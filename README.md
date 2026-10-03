# QRaft — Madhubani Folk Art 2D & 3D QR Designer

[![GDG Submission](https://img.shields.io/badge/GDG%20on%20Campus-SRM%20IST%20Recruitment-13504D?style=for-the-badge&logo=google&logoColor=white)](https://gdg.community.dev/srm-ist)
[![React 18](https://img.shields.io/badge/React-18.3-F79454?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-C54845?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-1C2B29?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-2F7A72?style=for-the-badge)](LICENSE)

> **QRaft** is an authentic, privacy-first QR code generator and 3D WebGL designer inspired by the traditional **Mithila Madhubani folk art** of Bihar, India. Designed and built from scratch with zero backend dependencies, it combines ancient artistic heritage with modern web engineering: real-time WCAG AA/AAA contrast calculations, automated optical `jsQR` scannability gating, 2D designer module shapes with Madhubani line hatching, and 16 GPU-instanced 3D WebGL themes.

**Technical Recruitment Submission:** GDG on Campus, SRM Institute of Science and Technology (Technical Domain, Frontend: *"QR Code Generator & Designer"*).

---

## 🔗 Live Demo & Single Source of Truth
- **Single Source of Truth:** All project, author, and college metadata is configured in [`src/config/site.ts`](src/config/site.ts).
- **Deployment URL:** Check `siteConfig.author.deploymentUrl` in `src/config/site.ts`.
- **Manual Setup Checklist:** See [`docs/MANUAL_TODO.md`](docs/MANUAL_TODO.md) for student submission steps.

---

## 🎨 Madhubani Folk Art Design System

QRaft moves away from generic corporate aesthetics to celebrate India's rich geometric folk art tradition:

| Token | Hex | WCAG Role & Usage |
|---|---|---|
| `peacock-deep` | `#13504D` | Primary brand ink; 9.6:1 contrast against warm paper (passes AAA) |
| `peacock` | `#2F7A72` | Secondary accent & cool water tones; 4.7:1 contrast (passes AA) |
| `vermilion` | `#C54845` | Primary action buttons & sindoor accents; 4.76:1 with white text (calibrated AA) |
| `saffron` | `#F79454` | Warm turmeric highlights, borders, and badges (never text on light bg) |
| `sage` | `#A5B596` | Organic herbal accents, leaf vines, and secondary fills |
| `paper` | `#FFFDF8` | Base handmade wasli paper background |
| `paper-2` | `#F6F0E4` | Secondary parchment container fill with subtle warm texture |
| `ink` | `#1C2B29` | Carbon soot black for sharp body copy & universal compatibility |

### Typography
- **Headings & Display:** **Fraunces** (optical-size serif with handcrafted organic weight)
- **Body & Controls:** **Mukta** (clean, open humanist sans-serif with high readability)
- **Technical & Coordinates:** **JetBrains Mono** (monospace font for hex codes, resolutions, and contrast ratios)

### Vector Art Library (`src/art/`)
Zero stock photos, raster images, or AI-generated graphics. Every motif is hand-drawn pure SVG code:
- `FishPair`: Twin swimming carp representing fertility and auspicious journeys
- `Peacock`: Sacred peacock with fan-tail plume details
- `Lotus`: Sacred multi-petaled padma blossom
- `Sun`: Radiant Mithila surya face with solar rays
- `LeafVine`: Flowering creepers and organic border tendrils
- `BorderFrame`: Authentic double-bordered geometric cartouche
- `PatternFill`: Procedural Kachni (fine parallel hatching), Godna (stipple dots), and Bharni fills
- `Corner`: Corner floral brackets for cards and panels

---

## ⚡ Key Architectural Features

### 1. 2D Designer QR Generator & Styler
- **5 QR Types:** URL, Plain Text, Email (`mailto:` with encoded query), Phone (`tel:`), and Wi-Fi (WPA/WEP/None with MECARD escaping).
- **Module Shapes:**
  - `square`: Standard crisp geometry
  - `rounded`: Modern smooth-corner squircles
  - `dot`: High-area circular dots with protected timing tracks
  - `diamond`: 45-degree folk rhombus
  - `connected`: Organic fluid clusters that dynamically detect adjacent modules
- **Finder Patterns (Corner Eyes):** Independent styling for `square`, `rounded`, and `circle-ring` concentric eyes.
- **Color Flows & Gradients:** Linear and Radial gradient flows with quick Madhubani presets (*Sunrise*, *Pond*, *Garden*).
- **Madhubani Folk Art Hatching:**
  - `katchni`: Delicate 45-degree parallel ink hatching lines inside modules
  - `godna`: Sacred tattoo-inspired stippling center dots
  - `bharni`: Double-line inset module borders
- **Procedural Wasli Paper Texture:** Deterministic organic fiber wash simulating traditional handmade sun-dried paper.
- **Image-Blend Underlay:** Client-side background artwork blend with opacity slider and protected quiet zones around finders.
- **Pixel-Matched Exports:**
  - **PNG:** Rendered from the preview canvas (with optional decorative Madhubani frame).
  - **SVG:** Standalone vector XML matching shapes, finders, gradients, and hatching 1:1.
  - **Clipboard:** Native image copy via `navigator.clipboard.write([ClipboardItem])`.

### 2. Optical Scannability Gate & Automated `jsQR` Engine
- **Automated Real-Time Camera Simulation:** Every render executes `jsQR` on canvas pixel data in the background.
- **Status Badges:** Displays *"Scans OK in camera test"* or *"Could not be decoded in camera test"*.
- **Download Guard:** Export buttons are disabled when optical decode fails unless the user explicitly checks *"Download anyway"*.
- **"Make It Safer" Auto-Remedy:** One-click button that resets contrast, increases error correction level to 'H', sets safe rounded shapes, and restores standard margins.

### 3. 3D WebGL QR Studio (`src/three/`)
- **GPU-Instanced Rendering:** Single `THREE.InstancedMesh` for 60+ FPS performance even on low-powered mobile devices.
- **16 Curated Madhubani Themes:**
  - *Courtyards:* Peacock Garden, Lotus Pond, Sun Temple, Mithila Fish Pond
  - *Folk Tales:* Mithila Courtyard, Monsoon Canopy, Terracotta Village, Twilight Bazaar
  - *Motifs:* Sacred Peacock, Auspicious Twin Fish, Royal Elephant, Blooming Lotus
  - *Artisanal:* Classic Ink Block, Wasli Parchment, Mineral Pigments, Deep Night Rangoli
- **3D Controls:** Extrusion depth slider (0.3x to 2.2x), primitive styles (cube, rounded, cylinder), palette accent picker, and orbit auto-rotate controls.
- **Dual Export:** Export an artistic 3D snapshot or a verified flat scan-safe PNG.

### 4. Client-Side State, Cryptography & URL Sharing
- **Zero Backend Required:** Operates 100% locally. Passwords use PBKDF2 Web Crypto hashing with unique 16-byte random salts.
- **"Try Demo Account":** One-click demo login as *"Demo Designer"* with local storage isolation.
- **Cross-Device URL Sharing (`src/lib/shareLink.ts`):** Encodes full templates (including 2D designer styles and 3D settings) into compressed, sanitized base64url strings (`#/app?share=...`). Backward compatible with v1 payloads.

### 5. Automated Authenticity & Hygiene Audit (`scripts/audit-site.mjs`)
- Custom static analysis script scanning all source files.
- Enforces zero placeholder copy (`Lorem ipsum`, `foo`, `bar`), zero stub links (`href="#"`), zero fake social proof (`Fortune 500`, fake user reviews), and zero stray `console.log` statements in production.

---

## 📁 Repository Structure

```
QRaft/
├── docs/
│   ├── EXPLAIN.md          # Architectural deep-dive & technical decisions
│   ├── TESTING.md          # Comprehensive testing strategy & checklist
│   ├── MANUAL_TODO.md      # Student submission manual checklist
│   └── UPGRADE_AUDIT.md    # Baseline upgrade audit report
├── scripts/
│   └── audit-site.mjs      # Automated hygiene and authenticity checker
├── src/
│   ├── art/                # Pure code-drawn Madhubani vector SVG library
│   │   ├── FishPair.tsx    # Auspicious twin fish motif
│   │   ├── Peacock.tsx     # Sacred peacock motif
│   │   ├── Lotus.tsx       # Sacred lotus motif
│   │   ├── Sun.tsx         # Radiant solar motif
│   │   ├── LeafVine.tsx    # Organic foliage tendrils
│   │   ├── BorderFrame.tsx # Madhubani geometric decorative frame
│   │   └── Corner.tsx      # Corner floral cartouche
│   ├── components/
│   │   ├── forms/          # Type selectors, forms, and customization panel
│   │   ├── layout/         # Navbar, responsive TabBar with motion indicator
│   │   ├── qr/             # QrPreview canvas, RangoliQrAnimator
│   │   ├── tabs/           # GeneratorTab, ThreeTab, Templates, Community, Recent, Profile
│   │   └── ui/             # MadhubaniBackground, Logo, EmptyStateScene
│   ├── config/
│   │   └── site.ts         # Single source of truth for site/author metadata
│   ├── lib/
│   │   ├── contrastCheck.ts# WCAG contrast calculation & AA validation
│   │   ├── download.ts     # Canvas PNG and vector SVG export pipelines
│   │   ├── payload.ts      # QR payload generators (URL, Wi-Fi, email, etc.)
│   │   ├── presets.ts      # Madhubani style presets
│   │   ├── qrRenderer.ts   # Designer QR canvas & vector SVG rendering engine
│   │   ├── reliability.ts  # Scan reliability analyzer
│   │   ├── scanVerify.ts   # Client-side jsQR verification
│   │   ├── shareLink.ts    # v1/v2 base64url URL hash share engine
│   │   └── validation.ts   # Input validation rules
│   ├── pages/              # Welcome, Workspace, Login, Terms, NotFound
│   ├── services/           # RecentStore, TemplateStore, CommunityStore, AuthService, seed
│   ├── three/              # Three.js WebGL instanced mesh scene and themes
│   └── test/               # Vitest test suite (55 tests)
├── package.json
└── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/[YOUR-USERNAME]/qraft.git
cd qraft

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173`.

### Quality Assurance & Verification Commands

```bash
# 1. Run unit test suite (55 tests passing across 6 suites)
npm test

# 2. Run automated authenticity and hygiene audit
npm run audit

# 3. Type check and build production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🏆 Evaluation Criteria Checklist (GDG SRM IST)

| Category | Requirement | Implementation in QRaft |
|---|---|---|
| **Design & UI** | Cohesive visual theme | Authentic Madhubani folk art palette, Fraunces serif typography, hand-drawn vector library |
| **QR Types** | URL, Text, Email, Phone, Wi-Fi | All 5 types with live validation and field hints |
| **Customization** | Colors, sizes, margins, error correction | 5 module shapes, 3 finder styles, gradients, hatching, paper texture, image blend |
| **Scannability** | High scan reliability across devices | WCAG AA/AAA contrast math + automated background `jsQR` scan verification gate |
| **Exports** | High-resolution PNG and vector SVG | Canvas PNG (with decorative frame) and exact-match scalable vector SVG |
| **3D Mode** | Interactive WebGL QR preview | 16 Madhubani WebGL themes, GPU instancing, top-view snap, dual export |
| **State & Storage**| Client-side persistence | Templates library, recent items, PBKDF2 local auth, URL-hash share links |
| **Performance**| Fast load times and responsiveness | Lazy-loaded 3D tab, debounced rendering, touch swipe tab bar, 60+ FPS |
| **Authenticity**| Clean, genuine content | Zero stock/AI photos, zero fake reviews, single source of truth in `src/config/site.ts` |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
All Madhubani vector motifs in `src/art/` are original vector interpretations created for QRaft.
