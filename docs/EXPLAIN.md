# QRaft — Interview Architecture Cheat-Sheet (`EXPLAIN.md`)

This guide is designed for the author to review before technical interviews with **GDG on Campus, SRM IST**. It provides clear, plain-English explanations of how every system in **QRaft** is constructed, the mathematical principles behind them, and the engineering trade-offs chosen.

---

## 1. How QR Code Generation Works Internally
- **Matrix & Modules:** A QR code is a two-dimensional grid composed of black and white squares called **modules**. QR code sizes are defined by **Versions** (Version 1 is $21 \times 21$ modules; each subsequent version increments by 4 modules per side up to Version 40, which is $177 \times 177$ modules).
- **Finder Patterns:** The three conspicuous nested squares located at the top-left, top-right, and bottom-left corners are finder patterns (each $7 \times 7$ modules). Scanners use these to determine code orientation, tilt angle, and module dimensions.
- **Timing Patterns & Alignment Patterns:** Horizontal and vertical alternating module rows between finders establish grid coordinates, while smaller sub-squares (alignment patterns) compensate for curved or uneven surfaces.
- **Reed-Solomon Error Correction:** QR codes embed mathematical redundancy using Reed-Solomon coding over a Galois Field $\text{GF}(2^8)$. QRaft supports all 4 standard levels:
  - **L (Low):** $\sim 7\%$ recovery
  - **M (Medium):** $\sim 15\%$ recovery
  - **Q (Quality):** $\sim 25\%$ recovery
  - **H (High):** $\sim 30\%$ recovery
  Even if $30\%$ of the physical QR is obstructed, dirty, or stylized with 3D extrusions, the original payload can be reconstructed with exact bit fidelity.

---

## 2. Payload Construction & Escaping
- **URL:** Standard URI structure (`https://...` or `http://...`). QRaft validates protocol presence and strips surrounding whitespace.
- **Text:** Raw UTF-8 string encoding.
- **Email:** RFC 6068 `mailto:` format with URL-encoded query parameters:
  `mailto:name@domain.com?subject=Encoded%20Subject&body=Encoded%20Message`
- **Phone:** RFC 3966 `tel:` URI, stripping whitespace and hyphens:
  `tel:+919876543210`
- **Wi-Fi (MECARD / ZXing syntax):**
  Format: `WIFI:T:<WPA|WEP|nopass>;S:<SSID>;P:<Password>;H:<true|false>;;`
  **Escaping Rule:** Characters `\`, `;`, `,`, `:`, and `"` are reserved syntax delimiters in the ZXing standard. QRaft runs regex escaping `str.replace(/([\\;,:"'])/g, '\\$1')` so network names or passwords containing semicolons or colons do not break barcode parsers.

---

## 3. State Management & Flow
- **No Redux / Heavy State Store:** State is kept lightweight and localized:
  - Pure computation (derived payload, validation results, reliability scores) is calculated via `useMemo` from input and style states.
  - `useQrStudio` encapsulates type-switching, field mutations, and preset changes.
  - `AuthContext` exposes authentication state and user profile actions across the tree.
  - URL query parameters (`?tab=generator`) and Hash fragments (`#/app?share=...`) ensure deep linking and browser history (Back/Forward) work seamlessly.

---

## 4. Scan Reliability & WCAG Contrast Math
- **Relative Luminance Calculation:** Human eyes perceive colors with differing brightness (green appears brighter than blue). Standard sRGB values $[0, 255]$ are converted to linear color space:
  $$\text{If } c \le 0.03928: c_{\text{linear}} = \frac{c}{12.92} \quad \text{else} \quad c_{\text{linear}} = \left(\frac{c + 0.055}{1.055}\right)^{2.4}$$
  Then relative luminance $L$ is computed via:
  $$L = 0.2126 \cdot R_{\text{linear}} + 0.7152 \cdot G_{\text{linear}} + 0.0722 \cdot B_{\text{linear}}$$
- **Contrast Ratio:**
  $$\text{Ratio} = \frac{L_{\text{lighter}} + 0.05}{L_{\text{darker}} + 0.05}$$
- **Thresholds:**
  - $\text{Ratio} < 2.0$: **Hard Error (Risky).** Blocks download to prevent issuing unreadable codes.
  - $\text{Ratio} < 4.0$: **Warning (Caution).** Flags poor contrast while permitting download with user confirmation.
- **jsQR Simulation:** To prove real-world viability, the "Verify scan" button extracts raw pixel bytes (`ctx.getImageData()`) from the rendered canvas and runs `jsQR`, an algorithmic barcode decoder. If the decoded payload matches the input string, scannability is verified.

---

## 5. PNG & SVG Export Architecture
- **Single Source of Truth:** Rather than re-generating an offscreen image, PNG downloads call `canvas.toDataURL('image/png')` on the exact preview canvas element. What the user inspects on their screen is byte-for-byte what is written to their filesystem.
- **Deterministic Filenames:** Formatted as `qraft-<type>-<timestamp>.png` (e.g. `qraft-url-1727918239000.png`).
- **SVG Generation:** Calls `QRCode.toString(payload, { type: 'svg' })` to emit scalable vector XML suitable for professional print billboards and laser cutting.

---

## 6. 3D WebGL Studio & Three.js Instancing
- **The Performance Problem:** A Version 5 QR code contains over 1,300 dark modules. Creating 1,300 individual Three.js `Mesh` objects produces 1,300 separate draw calls per frame, crippling mobile GPU performance.
- **The Solution (InstancedMesh):** QRaft uses a single `THREE.InstancedMesh`. Geometry is uploaded to the GPU once. A single draw call renders all 1,300+ modules by passing a transform matrix (`Matrix4`) and instance color buffer.
- **Matrix Mapping:** `QRCode.create()` generates the module grid. In `useLayoutEffect`, we loop through rows and columns, compute centered world coordinates:
  $$x = \text{col} - \frac{\text{size} - 1}{2}, \quad z = \text{row} - \frac{\text{size} - 1}{2}, \quad y = \frac{\text{depth}}{2}$$
- **Scan-Safe Top View:** When the user clicks "Top view (scan-safe)", the camera smoothly re-centers to $[0, \text{distance}, 0.001]$ looking down at $[0, 0, 0]$, eliminating perspective distortion so physical phones can scan directly from the monitor.

---

## 7. Client-Side Authentication & Honest Limitations
- **PBKDF2 with Web Crypto API:** Passwords are never stored in plaintext. They are salted with a 16-byte cryptographically secure random value (`crypto.getRandomValues`) and derived using `PBKDF2` (100,000 iterations of SHA-256).
- **Honest Architectural Disclosure:** In technical interviews, emphasize:
  > *"Because QRaft is 100% serverless and runs purely in the client browser, accounts and sessions are persisted in localStorage. While passwords are salt-hashed, this provides local profile organization rather than multi-user server security. A production enterprise backend would replace `AuthService` with Firebase Auth or Supabase without modifying any UI components."*

---

## 8. Cross-Device Sharing Without a Backend
- **How it works:** When a user shares a template or community design, QRaft minifies the template parameters, stringifies them to JSON, and converts them to **base64url** format:
  `https://qraft.design/#/app?share=<base64url_payload>`
- **Security & Validation:** When loaded, `decodeShareLink` decodes the hash, enforces a maximum length (5KB), checks schema version, strips potential `<script>` tags, and clamps numeric bounds to protect against XSS or state corruption.

---

## 9. LocalStorage Architecture & Resilience
- **Versioned Keys:** `qraft:users:v1`, `qraft:session:v1`, `qraft:templates:v1`, `qraft:community:v1`, `qraft:recent:v1`.
- **Fault Tolerance:** Every read is wrapped in `try/catch` and validates JSON structure. If an item is corrupted by an external extension, it gracefully defaults to pre-seeded data rather than crashing the React tree.
- **Data Pruning:** The `Recent` list is capped at 12 items with payload de-duplication to prevent storage bloat.

---

## 10. Deployment Strategy
- **Static Asset Compilation:** Built using `tsc && vite build`, outputting static HTML, CSS, and JS into `dist/`.
- **HashRouter (`/#/`):** Utilized specifically so static web hosts (Vercel, Netlify, GitHub Pages) require zero rewrite rules or server redirects for client-side routing.
