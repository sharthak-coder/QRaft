# QRaft — Craft QR Codes That Stand Out

[![GDG Submission](https://img.shields.io/badge/GDG%20on%20Campus-SRM%20IST%20Recruitment-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gdg.community.dev/srm-ist)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-34A853?style=for-the-badge)](LICENSE)

> **QRaft** (pronounced *"craft"*; QR + craft) is an advanced, privacy-first QR code generator and 3D WebGL designer engineered for speed, scannability, and creative distinction. Built from scratch with zero backend dependencies, it runs 100% locally in the browser with automated WCAG contrast checks, live `jsQR` scan verification, and URL-hash cross-device sharing.

**Technical Recruitment Submission:** GDG on Campus, SRM Institute of Science and Technology (Technical Domain, Frontend: *"QR Code Generator & Designer"*).

---

## 🔗 Live Demo & Deployment
- **Live Demo Link:** `[ADD YOUR VERCEL / NETLIFY URL HERE: https://qraft-qr-designer.vercel.app]`
- **Repository:** `https://github.com/[YOUR-USERNAME]/qraft-qr-designer`

---

## 📸 Screenshots & Showcase

| View | Description | Preview |
|---|---|---|
| **Welcome Page** | Full-screen hero gate with auto-typing dynamic QR synthesizer | `docs/screenshots/01-welcome.png` |
| **2D Generator** | Live debounced canvas, presets, and color pickers | `docs/screenshots/02-generator.png` |
| **Reliability Banner** | Automated WCAG contrast math & jsQR scan simulation | `docs/screenshots/03-reliability.png` |
| **3D WebGL Studio** | GPU-instanced 3D QR mesh with 16 original themes | `docs/screenshots/04-3d-studio.png` |
| **My Templates** | Card library with rename, duplicate, and export | `docs/screenshots/05-templates.png` |
| **Community Feed** | Browser-local feed with likes, comments, and remixing | `docs/screenshots/06-community.png` |
| **Terms & Legal** | 17-section terms, privacy policy, and DPDP/GDPR rights | `docs/screenshots/07-terms.png` |
| **Mobile Experience** | Responsive single-column layout with swipe tabs | `docs/screenshots/08-mobile.png` |

> *To capture actual screenshots of your running instance, see instructions in [`docs/screenshots/README.md`](docs/screenshots/README.md).*

---

## ⚡ Core Features

### 1. 2D Standard QR Generator (Tab 1)
- **5 Supported Types:** URL, Plain Text, Email (`mailto:` with encoded query parameters), Phone (`tel:`), and Wi-Fi (WPA/WEP/None with MECARD escaping).
- **Instant Live Preview:** Debounced (~150ms) rendering on HTML5 canvas.
- **Granular Customization:** Sizing (128px to 1024px), foreground color, background color, error correction level (L, M, Q, H), and quiet zone margins (0 to 8 modules).
- **Curated Presets:** Classic, Google Royal, Professional, Dark Mode, Minimal Clean, and Cyber Neon. Selecting a preset applies it; tweaking any parameter clears the active preset indicator.
- **Exports:**
  - **PNG:** Rendered directly from the preview canvas for exact 1:1 pixel fidelity.
  - **SVG:** Scalable vector format via XML string generation.
  - **Clipboard:** Copies PNG data directly to system clipboard via `navigator.clipboard.write([ClipboardItem])`.

### 2. Scan-Reliability Engine (`src/lib/reliability.ts`)
- **WCAG Relative Luminance Math:** Calculates true contrast ratios from sRGB color values.
- **Hard Error Download Lock:** Blocks downloads when contrast falls below 2:1 to prevent distributing broken codes.
- **Warning System:** Warns about low contrast (<4:1), inverted color schemes (light-on-dark), tiny print sizes (<160px), thin quiet zones (<2 modules), or high data density with ECL 'H'.
- **Integrated Scanner Verification:** Includes a **"Verify scan"** button that extracts canvas image pixels and decodes them via `jsQR` to prove scannability.

### 3. 3D WebGL QR Studio (Tab 2)
- **High-Performance Instancing:** Dark modules are rendered using a single `THREE.InstancedMesh`, maintaining 60+ FPS on mobile devices.
- **16 Curated Original Themes across 4 Categories:**
  - **Scenes:** Sunset Hills, Midnight City, Ocean Waves, Deep Space.
  - **Anime-style (Original & Generic):** Cherry Blossom, Neon Metropolis, Cloud Kingdom, Mecha Armor.
  - **Characters (Original Mascots):** Robot Buddy, Cat Companion, Astronaut, Dino Mascot.
  - **Others:** Prism Crystal, Wooden Blocks, Cyber Grid, Minimal Clay.
- **3D Controls:** Depth slider (0.3x to 2.2x), module primitives (cube, rounded, cylinder), Google color accent picker, auto-rotate speed slider.
- **Scan-Safe Top View:** Snaps camera straight above at $[0, \text{distance}, 0.001]$ looking at $[0, 0, 0]$.
- **Dual Export:** Download an angled 3D artistic snapshot or a **"Flat Scan-Safe PNG"** verified by `jsQR`.

### 4. Client-Side Accounts & Demo Mode (Tab 5 & 6)
- **Zero Backend Constraint:** Operates 100% in the browser. Passwords use PBKDF2 Web Crypto hashing with unique 16-byte random salts.
- **"Try Demo Account":** Instant one-click login as *"Demo Designer"* with pre-populated templates, recent items, and social activity.
- **My Templates Library:** Create, duplicate, rename, delete, search, and tag templates.
- **Cross-Device Sharing:** Encodes templates into compressed, sanitized base64url strings in the URL hash (`#/app?share=...`), allowing sharing without a database.
- **Community Feed:** Browse, like, comment, and **Remix** designs with creator attribution.

---

## 🛠️ Tech Stack & Dependency Justification

| Dependency | Purpose | Justification |
|---|---|---|
| **Vite** | Build Tooling | Instant HMR, optimized roll-up bundling, and fast compilation. |
| **React 18** | UI Framework | Strict mode concurrent rendering, custom hooks, and clean component isolation. |
| **TypeScript** | Type Safety | Strict mode enabled; guarantees interfaces for QR payloads, styles, and templates. |
| **Tailwind CSS** | Styling | Rapid utility-first design token system in Google palette. Zero runtime CSS overhead. |
| **react-router-dom** | Client-Side Routing | Configured with `HashRouter` (`/#/`) so static hosting requires no rewrite rules. |
| **framer-motion** | Motion & Animation | Powers sliding indicator pill on tab bar, route transitions, and floating background blobs. |
| **qrcode** | QR Math & Generation | Standards-compliant module generation and 2D canvas/SVG rendering. |
| **three** & **@react-three/fiber** | 3D Rendering | Declarative WebGL canvas; instanced mesh rendering for 3D QR extrusions. |
| **@react-three/drei** | Three.js Helpers | Provides smooth, damped `OrbitControls` camera navigation. |
| **jsqr** | Barcode Decoding | Embedded scanner engine used to verify real-time scannability on canvases. |
| **vitest** & **@testing-library/react** | Unit Testing | Fast native ESM test runner for validating pure logic modules. |
| **lucide-react** | UI Icons | Lightweight, tree-shaken SVG icons for intuitive controls and toolbars. |

*Note: No Redux, UI component kits, or heavyweight dependencies are used.*

---

## 📁 Project Architecture

```
qraft-qr-designer/
├── src/
│   ├── components/
│   │   ├── forms/         # TypeSelector, TypeForms, CustomizationPanel
│   │   ├── layout/        # Navbar, TabBar (animated sliding pill), GateGuard
│   │   ├── qr/            # QrPreview (live canvas, reliability banner, verify)
│   │   ├── tabs/          # GeneratorTab, ThreeTab, TemplatesTab, CommunityTab, RecentTab, ProfileTab
│   │   └── ui/            # AbstractBackground, Logo
│   ├── hooks/             # useQrStudio, useAuth
│   ├── lib/               # Pure logic: payload.ts, validation.ts, reliability.ts, presets.ts, download.ts, shareLink.ts, scanVerify.ts, crypto.ts
│   ├── pages/             # WelcomePage, LoginPage, WorkspacePage, TermsPage, NotFoundPage
│   ├── services/          # auth.ts, templates.ts, community.ts, recent.ts, seed.ts
│   ├── test/              # Vitest test suites (payload, validation, reliability, shareLink, crypto)
│   ├── three/             # QrScene.tsx, themes.ts, matrix.ts
│   ├── types.ts           # Unified TypeScript definitions
│   ├── App.tsx            # HashRouter routing & global providers
│   ├── main.tsx           # React DOM root mounting
│   └── index.css          # Tailwind directives, glassmorphism, reduced motion
├── docs/
│   ├── EXPLAIN.md         # Plain-English interview cheat-sheet
│   ├── TESTING.md         # Comprehensive test checklist & scan matrix
│   └── screenshots/       # Screenshot assets & capturing guide
├── index.html             # Application shell with Google Fonts & favicon
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Google brand color tokens & shadows
├── tsconfig.json          # TypeScript strict compiler config
└── vite.config.ts         # Vite build and Vitest configuration
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js:** v18.0.0 or higher (tested on Node v20 & v24)
- **npm:** v9.0.0 or higher

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/[YOUR-USERNAME]/qraft-qr-designer.git
cd qraft-qr-designer

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run automated test suites
npm test

# 5. Build for production
npm run build
```

---

## 🚢 Deploying to Vercel

Because QRaft uses `HashRouter` and zero server-side code, it is 100% static:

1. Push your code to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `qraft-qr-designer` repository.
4. Set Framework Preset to **Vite**.
5. Build settings will auto-detect:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **Deploy**. Your site will be live across worldwide CDNs in under 60 seconds.

---

## 🔒 Security & Client-Side Architecture Disclosures
- **Honest Limitations:** There is no remote database server. Accounts, sessions, and community posts are stored in `localStorage` (`qraft:*`).
- **Cryptographic Hashing:** Passwords are never stored in plain text. QRaft utilizes standard Web Crypto PBKDF2 with unique 16-byte random salts and SHA-256 (100,000 rounds).
- **Future Production Upgrades:** The services layer (`src/services/auth.ts`, `templates.ts`, `community.ts`) is designed behind clean abstract interfaces. A production rollout would swap these classes for Firebase Auth and Cloud Firestore without modifying any React view components.

---

## 📄 License
This project is open-source software licensed under the **[MIT License](LICENSE)**.
Created by an applicant for **GDG on Campus, SRM IST** (Technical Domain Recruitment).
