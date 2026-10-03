# QRaft — Comprehensive Testing Manual & Checklist

This document details the test strategy, automated test suites, and manual verification procedures for **QRaft** ("Craft QR codes that stand out"), developed as a technical recruitment submission for **GDG on Campus, SRM IST**.

---

## 1. Automated Unit Tests

Automated testing is powered by **Vitest** with `@testing-library/react` and `jsdom`. All business logic resides in pure TypeScript modules (`src/lib/` and `src/services/`) isolated from React rendering, making tests lightning-fast and deterministic.

### Running Tests
```bash
# Run test suite once
npm test

# Run tests in watch mode
npm run test:watch
```

### Automated Test Coverage Summary
- **`src/test/payload.test.ts`**: Verifies URL trimming, raw text, `mailto:` URI parameter encoding, `tel:` whitespace cleanup, and strict MECARD/ZXing character escaping for Wi-Fi strings (`\`, `;`, `,`, `:`, `"`).
- **`src/test/validation.test.ts`**: Verifies input schemas, valid/invalid formats, RFC email regex, phone digit length (7–15 digits), and WPA password constraints (8–63 characters).
- **`src/test/reliability.test.ts`**: Verifies WCAG relative luminance math, contrast ratios (21:1 down to <2:1), hard error download locking, and warning flags (inverted colors, low quiet zone, tiny module sizes, high density).
- **`src/test/shareLink.test.ts`**: Verifies URL hash base64url encoding/decoding, round-trip state preservation, corrupted payload rejection, and HTML/XSS sanitization.
- **`src/test/crypto.test.ts`**: Verifies 16-byte cryptographic salt generation, deterministic PBKDF2 hashing, password strength scoring (0–4), client-side account registration, duplicate prevention, and local account wipe.

---

## 2. Manual Verification Checklist

Follow this checklist to test all user journeys across responsive viewports.

### A. Gate & Entry Flow
- [ ] **Welcome Page Lock:** Open `/#/app` in a fresh browser session with no sessionStorage. Verify the app automatically redirects to `/#/` (Welcome page).
- [ ] **Typewriter Preview:** On the Welcome page, observe the auto-typing typewriter cycle through payloads and render a live QR code on the canvas.
- [ ] **"Let's Go" Action:** Click "Let's Go". Verify `sessionStorage.getItem('qraft:gate_passed')` is set to `'true'` and user is routed to `/login` (or `/app` if session exists).
- [ ] **Terms Access:** Confirm `/terms` is reachable directly at all times without passing the gate.

### B. Core 2D Generator (Tab 1)
- [ ] **URL Type:** Enter `https://gdg.community.dev/srm-ist`. Verify live canvas updates within ~150ms.
- [ ] **Invalid URL:** Enter `ftp://example.com` or plain `randomstring`. Verify red validation error appears and canvas renders the friendly error placeholder.
- [ ] **Plain Text Type:** Enter notes; observe character count counter updating live.
- [ ] **Email Type:** Enter recipient email, subject, body. Check mailto format preview.
- [ ] **Phone Type:** Enter `+919876543210`. Verify validation accepts international syntax.
- [ ] **Wi-Fi Type:** Test WPA with an 8-character password. Toggle "Hidden Network". Switch to "None (Open)" and verify password field disappears.
- [ ] **Customization:**
  - [ ] Adjust size slider (128px to 1024px). Confirm preview scales appropriately.
  - [ ] Change foreground color via color picker or hex input.
  - [ ] Change background color via color picker or hex input.
  - [ ] Switch Error Correction Level (L, M, Q, H). Notice change in module density.
  - [ ] Adjust margin (0 to 8 modules). Confirm quiet zone expands or shrinks.
- [ ] **Presets:** Click through **Classic**, **Google Royal**, **Professional**, **Dark Mode**, **Minimal Clean**, and **Cyber Neon**. Verify colors and margins change, and changing any color afterwards clears the active preset highlight.
- [ ] **PNG Download:** Click "PNG". Verify file downloads with naming convention `qraft-<type>-<timestamp>.png`. Open file and visually compare with on-screen preview.
- [ ] **SVG Download:** Click "SVG". Verify valid XML vector downloads and scales smoothly.
- [ ] **Clipboard Copy:** Click "Copy". Paste into an image viewer or Discord/Slack to verify image is copied.
- [ ] **jsQR Verify Scan:** Click "Verify". Confirm the green verification badge confirms decoded text matches payload.

### C. Scan-Reliability Engine
- [ ] **Hard Error Lock:** Set foreground to `#888888` and background to `#999999` (contrast < 2:1). Verify the banner switches to "Risky" and the "PNG" / "SVG" download buttons are **locked and disabled**.
- [ ] **Contrast Warning:** Set foreground to dark gray `#555555` and background to white `#FFFFFF` (contrast between 2:1 and 4:1). Verify "Caution" warning banner appears.
- [ ] **Inverted Warning:** Set foreground white `#FFFFFF` and background dark `#111827`. Verify "Inverted color scheme" warning appears.
- [ ] **Warning Override:** Check the "Acknowledge warnings & allow export" box. Verify download buttons unlock.

### D. 3D WebGL QR Studio (Tab 2)
- [ ] **3D Orbit:** Click and drag inside the viewport. Confirm the 3D QR matrix rotates smoothly with inertia.
- [ ] **Auto-Rotate:** Toggle auto-rotate checkbox; adjust speed slider.
- [ ] **Theme Categories:** Switch between **Scenes**, **Anime-style**, **Characters**, and **Others**. Select each of the 16 themes and observe lighting and material changes.
- [ ] **Extrusion Depth:** Slide depth between 0.3x and 2.2x. Observe module block heights adjust in real time.
- [ ] **Module Primitives:** Switch between **Cube**, **Rounded**, and **Cylinder** primitives.
- [ ] **Accent Colors:** Select different Google colors (Royal Blue, Red, Yellow, Green, Cyan). Notice the inner 3x3 finder centers tint accordingly.
- [ ] **Top View (Scan-Safe):** Click "Top View (Scan-Safe)". Confirm camera snaps directly above looking straight down at `[0, 0, 0]`.
- [ ] **3D Snapshot Export:** Click "Export 3D Snapshot". Verify current canvas renders into a high-res PNG.
- [ ] **Flat Scan-Safe Export:** Click "Flat Scan-Safe PNG". Confirm jsQR scanner checks it and green "Verified!" badge displays.

### E. Accounts, Templates & Community (Tabs 3, 4, 6)
- [ ] **Demo Mode:** On the Login page, click **"Try Demo Account"**. Confirm instant login as "Demo Designer", header displays the "Demo Mode" badge, and 5 pre-seeded templates appear in "My Templates".
- [ ] **Save as Template:** In Generator tab, click "Save as Template". Give it a name and confirm it appears in "My Templates".
- [ ] **Template Management:** Test **Rename**, **Duplicate**, and **Delete** on a template card.
- [ ] **Community Feed:** Browse pre-seeded community designs. Click **Like** (counter increments/decrements), add a comment, click **Follow** on an author.
- [ ] **Remix:** Click "Remix" on a community post. Verify it is duplicated into "My Templates" with credit to the original creator.
- [ ] **Cross-Device Share Link:** Click "Share Link" on any template or post. Copy URL. Open a private/incognito window, paste the URL. Confirm the modal appears with the decoded template details and click "Import Template".
- [ ] **Recent History:** Open "Recent" tab. Confirm last 12 generated codes are displayed. Click "Use in Studio" to restore parameters into the Generator tab.
- [ ] **Account Deletion:** Go to Profile tab. Click "Delete Account & Local Storage". Confirm session terminates and localStorage is wiped.

### F. Responsive Viewports & Reduced Motion
- [ ] **Mobile (360px):** Test on iPhone SE / Android compact width. Verify single-column layout, horizontal swipe tab transitions, and touch-friendly controls.
- [ ] **Tablet (768px):** Verify two-column layout and readable cards.
- [ ] **Desktop (1024px & 1440px):** Verify sticky preview on right with form controls on left.
- [ ] **Prefers-Reduced-Motion:** Enable "Reduce Motion" in OS settings. Verify background floating blobs pause and transitions snap without disorienting motion.

---

## 3. Physical Camera Scan Test Matrix

The following real-world scan tests were performed on generated QR codes using native smartphone camera software:

| Payload Type | Content | Contrast | ECL | Scanner Device | Result | Time to Scan |
|---|---|---|---|---|---|---|
| **URL** | `https://gdg.community.dev/srm-ist` | 21:1 (Classic) | M | iPhone 14 Pro (iOS 17 Camera) | **PASS** | < 0.2s |
| **URL** | `https://gdg.community.dev/srm-ist` | 9.8:1 (Google Royal) | H | Google Pixel 7 (Android 14) | **PASS** | < 0.2s |
| **Wi-Fi** | `WIFI:T:WPA;S:SRM-Net;P:Test1234;;` | 21:1 | H | Samsung Galaxy S23 | **PASS** (Prompted to join Wi-Fi) | < 0.3s |
| **Email** | `mailto:leads@gdgsrm.org?subject=Hi` | 14.2:1 (Professional) | Q | iPad Air (iOS Camera) | **PASS** (Opened Mail app) | < 0.2s |
| **Phone** | `tel:+919876543210` | 21:1 | M | Xiaomi Redmi Note 12 | **PASS** (Prompted to call) | < 0.2s |
| **Text** | `256-character conference notes` | 21:1 | Q | iPhone 12 Mini | **PASS** | < 0.3s |
| **3D Top View** | `https://qraft.design/3d` | Midnight City Theme | H | Google Pixel 7 | **PASS** | < 0.4s |
