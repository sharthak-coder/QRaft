# QRaft — Madhubani Folk Art 2D & Scenic 3D World QR Designer

[![GDG Submission](https://img.shields.io/badge/GDG%20on%20Campus-SRM%20IST%20Recruitment-1A3644?style=for-the-badge&logo=google&logoColor=white)](https://gdg.community.dev/srm-ist)
[![React 18](https://img.shields.io/badge/React-18.3-D99B26?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict%20Mode-A62B2B?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-Scenic%203D%20World-2D5A3E?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-1A3644?style=for-the-badge)](LICENSE)

> **QRaft** is an authentic, privacy-first QR code generator and **Scenic 3D World** diorama designer inspired by the centuries-old living traditions of **Mithila (Madhubani) folk art** from Bihar, India. Designed and engineered client-side with zero tracking and zero backend dependencies, QRaft bridges ancient cultural craftsmanship with modern web graphics: natural folk pigment tokens, procedural handmade khadi paper textures, an interactive HTML5 motion canvas, real-time WCAG contrast checking, automated optical `jsQR` scannability gating, and an instanced procedural 3D voxel diorama that seamlessly morphs between camera-ready 2D Scan Mode and a 45-degree isometric 3D Scenic Orbit.

**Technical Recruitment Submission:** GDG on Campus, SRM Institute of Science and Technology (Technical Domain, Frontend: *"QR Code Generator & Designer"*).

---

## 🎨 Authentic Mithila Folk Art Design System

QRaft celebrates India's geometric folk art heritage through 5 carefully calibrated natural pigment tokens:

| Token | Hex | Folk Pigment Source | Role & WCAG Ratio |
|---|---|---|---|
| `indigo-ink` | `#1A3644` | Natural indigo plant vat dye (*Indigofera tinctoria*) | Primary brand ink, text, headings, outlines; **11:1 AAA** contrast on rice |
| `haldi` | `#D99B26` | Stone-ground turmeric rhizome (*Curcuma longa*) | Accents, highlights, active fills; **never used as text on rice** (~2.17:1 fails AA) |
| `sindoor` | `#A62B2B` | Sacred vermilion cinnabar mineral (*Hingula*) | Primary action buttons, motifs, errors; **> 4.5:1 AA** with white |
| `leaf` | `#2D5A3E` | Crushed wood-apple tree leaves (*Aegle marmelos*) | Nature motifs, verified success badges, secondary actions; **> 4.5:1 AA** |
| `rice` | `#F6F1E8` | Ground rice paste (*Aripana*) on sun-dried paper | Warm handmade wasli paper background with organic canvas grain |
| `rice-panel` | `#EFE8D9` | Derived tint (rice paper mixed with subtle ink wash) | Card and container surfaces providing soft visual separation |

### Typography
- **Headings & Display:** **Yatra One** & **Fraunces** (Devanagari-inspired handcrafted display serif with authentic chisel strokes)
- **Body & Controls:** **Mukta** (Clean, humanist open sans-serif; enforced $\ge 16$px on mobile text inputs to prevent auto-zoom)
- **Technical & Coordinates:** **JetBrains Mono** (Monospace for payload strings, resolutions, and contrast calculations)

### Handcrafted SVG Art Library (`src/art/`)
Zero stock photos, downloaded raster images, or AI-generated artwork. Every graphic is hand-coded vector SVG:
- `DoubleLineBorder`: Authentic Madhubani double-line frame with selectable inner band hatching (`kachni`, `bharni`, `fish-scale`) and four corner lotus buds.
- `JharokhaFrame`: Traditional temple gateway arch featuring a sacred Kalash finial, stepped plinth, and clean quiet zone.
- `FolkTag`: Auspicious pill badge with rice/haldi/sindoor pigment styling.
- `Sun`: Radiating Mithila Surya motif with double concentric rings and auspicious ray dots.
- `Moon`: Chandra crescent with delicate parallel katchni hatching.
- `Peacock`: Sacred peacock with arched fan-tail plumes and eyespot details.
- `FishPair`: Auspicious twin swimming carp symbolizing fertility and journeys.
- `Kadamba`: Sacred flowering kadamba tree with layered blossom rosettes.
- `ArtCreditNote`: Respectful tribute honoring the centuries-old living traditions of Mithila artists.

---

## ⚡ 7-Phase Architecture & Redesign Highlights

### Phase 1: Folk Palette, Typography & Procedural Paper
- Definitive natural pigment color tokens in Tailwind and CSS custom properties.
- Mathematical contrast engine (`src/lib/contrastCheck.ts`) enforcing WCAG AA/AAA. Haldi is strictly forbidden as text on light surfaces.
- Procedural paper texture generator (`src/lib/paperTexture.ts`) generating high-performance cached $512\times 512$ khadi tiles and $128\times 128$ grain washes.

### Phase 2: Folk Frames, Calm Workspace Rule & Calm Mode
- Folk frames (`DoubleLineBorder`, `JharokhaFrame`) wrapping previews and cards.
- **Calm Workspace Rule:** While the landing gate features expressive folk art, the creative workspace is quiet, focused, and distraction-free.
- **Calm Mode Toggle:** Persisted via `localStorage` with automatic `prefers-reduced-motion` detection, providing a tranquil workspace for focused designing.

### Phase 3: Shared Palette Migration Engine
- **Backward-Compatible Migration (`src/lib/paletteMigration.ts`):** Automatically maps legacy hex codes into folk tokens.
- **10 Curated Presets (`src/lib/presets.ts`):** Indigo Ink, Sindoor Red, Haldi Glow, Sacred Grove, Classic Ink, Dark Canvas, Professional, Minimal, Neon Haldi, and Godna Tattoo.
- **Auto-Migrated Stores:** `TemplateStore` and `RecentStore` upgraded to `v2` with automatic legacy `v1` migration on load.
- **Cross-Device Share Links (`src/lib/shareLink.ts`):** Sanitized base64url payload sharing supporting v1, v2, and v3 payloads with automatic color migration.

### Phase 4: Interactive Motion Background (`src/components/MotionBackground.tsx`)
- Full-screen hardware-accelerated HTML5 canvas background.
- **3 Parallax Depth Layers:**
  - *Far Layer (0.02 factor):* Surya & Chandra celestial motifs with gentle drift.
  - *Mid Layer (0.05 factor):* Flowing folk fauna (peacock feather arcs, swimming fish pairs).
  - *Near Layer (0.10 factor):* Ambient ink specks and floating rice petal particles.
- **Smooth Interaction:** Desktop `pointermove` and mobile gyroscope tilt (`deviceorientation` with iOS permission toggle) with smooth lerp interpolation.
- **Battery & Performance Safeguards:** Idle throttle to 10 FPS after 2s of inactivity; complete RAF pause when `document.hidden`; single static frame when Calm Mode is active.

### Phase 5: Scenic 3D World & Voxel Diorama (`src/three/`)
- Renamed and reimagined as **Scenic 3D World**.
- **Procedural Voxel Generation (`src/three/voxelGenerator.ts`):** Deterministic voxel columns generated from `QRCode.create()` modules with cluster flood-fill extracting terrain islands, stepped temples, and landmark shrines.
- **Voxel Budget Cap:** Strict budget capping (40,000 voxels desktop / 15,000 voxels mobile) ensuring steady 60 FPS WebGL performance.
- **3 Hero Themes + Classic Fallback:**
  1. *Anime Alpine & Shinto Pass:* Misty pine terraces, snow-capped peaks, and vermilion torii gateway finders.
  2. *Mithila Sacred Grove:* Terracotta stepped plinths, kadamba tree canopies, and golden kalash finials.
  3. *Floating Voxel Isle:* Cascading floating basalt isles and luminous glowing crystal pillars.
  4. *Classic Blocks:* High-contrast architectural cubes for universal readability.
- **2D Scan $\leftrightarrow$ 3D Scenic Continuous Morph:**
  - Slider and quick toggle morphing parameter $t \in [0, 1]$.
  - At $t=0$ (*Scan Mode*): Top-down orthographic camera, unlit flat shading, 100% planar module alignment.
  - At $t=1$ (*Scenic Mode*): 45-degree isometric orbit, atmospheric fog, and directional toon lighting.
- **Real-Time Optical `jsQR` Verification:** Canvas verification with decoded payload banner in Scan Mode.
- **Dual Export Options:** Export Scan-Safe PNG (flat 1024px) or Export Scenic Diorama PNG (perspective 3D snapshot).

### Phase 6: Responsive Layout & Accessibility Audit
- Mobile (360px), tablet (768px), and desktop (1440px) responsive layouts.
- Enforced minimum 16px (`text-base`) input font size to eliminate mobile iOS/Android auto-zoom.
- Minimum $44\times 44$ px touch targets across buttons, tabs, and form fields.
- Zero horizontal overflow across all viewports.
- Screen reader ARIA alerts (`role="alert" aria-live="polite"`), explicit label pairings, and accessible names.

### Phase 7: Comprehensive Testing & Verification
- **11 Vitest test suites with 93 passing unit tests.**
- 100% automated hygiene audit passing via `npm run audit`.

---

## 🛠️ Verification & Test Instructions

### Running Tests
Execute the comprehensive Vitest test suite:
```bash
npm test
```
*Current test suite: 11 test files, 93 tests passed (100% pass rate).*

### Building the Project
Compile TypeScript strict mode and bundle production assets:
```bash
npm run build
```

### Running the Authenticity & Hygiene Audit
Verify zero stubs, placeholders, fake marketing claims, or stray logs:
```bash
npm run audit
```

### Local Preview
Launch the optimized production build:
```bash
npm run preview
```

---

## 📂 Project Structure

```
QRaft/
├── docs/
│   ├── EXPLAIN.md              # In-depth architectural & mathematical reasoning
│   ├── TESTING.md              # Test suite documentation & coverage report
│   ├── MANUAL_TODO.md          # Student GDG submission checklist
│   └── screenshots/            # Responsive screenshots across all phases
├── src/
│   ├── art/                    # Handcrafted SVG art library (DoubleLineBorder, JharokhaFrame, etc.)
│   ├── components/
│   │   ├── forms/              # Type forms & type selector (URL, text, email, phone, wifi)
│   │   ├── layout/             # Navbar, TabBar, GateGuard
│   │   ├── qr/                 # QrPreview, RangoliQrAnimator, CustomizationPanel
│   │   ├── tabs/               # GeneratorTab, ThreeTab (Scenic 3D World), TemplatesTab, etc.
│   │   ├── ui/                 # Logo, FolkTag, EmptyStateScene
│   │   └── MotionBackground.tsx # Interactive HTML5 parallax canvas background
│   ├── hooks/                  # useCalmMode, useQrStudio, useAuth
│   ├── lib/                    # Contrast check, palette migration, paper texture, share link, QR renderer
│   ├── services/               # Templates (v2), Recent (v2), Seed, Auth
│   ├── test/                   # 11 unit test suites (93 tests)
│   └── three/                  # Scenic 3D World (voxel generator, ScenicQrScene, themes, matrix)
└── scripts/
    └── audit-site.mjs          # Automated hygiene audit script
```

---

## 📜 Cultural Note & Attribution

QRaft respectfully honors the rich folk art traditions of the Mithila region of Bihar, India. The geometric motifs, natural earth pigment palette, and decorative framing techniques are inspired by generations of traditional Mithila artists. QRaft uses strictly original, code-authored vector artwork created specifically for this project.
