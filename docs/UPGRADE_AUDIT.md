# QRaft Upgrade Audit: Madhubani Redesign & Authenticity Overhaul

> **Audit Date:** October 3, 2026  
> **Branch:** `madhubani-redesign` (branched from `master` baseline)  
> **Status:** Baseline tests passing (39/39 tests across 5 suites), production build cleanly succeeding.

---

## 1. Current Color Tokens & Hard-Coded Occurrences

### Tailwind Configuration (`tailwind.config.js`)
Currently defined color tokens:
- **`colors.google`**:
  - `blue`: `#4285F4`
  - `blue-royal`: `#1A56DB`
  - `blue-deep`: `#174EA6`
  - `red`: `#EA4335`
  - `yellow`: `#FBBC04`
  - `green`: `#34A853`
- **`colors.surface`**:
  - `DEFAULT`: `#FFFFFF`
  - `soft`: `#F8FAFF`
  - `border`: `#E6EAF2`
  - `muted`: `#5F6B7A`
  - `text`: `#1F2937`

### Hard-Coded Hex & RGB Values in Stylesheets & Components
- **`src/index.css`**:
  - Line 12: `bg-[#F8FAFF]`, `text-[#1F2937]`
  - Line 25, 32: `rgba(230, 234, 242, 0.9)`
  - Line 37: `rgba(66, 133, 244, 0.12)` (Google blue dot pattern)
  - Line 43: `rgba(26, 86, 219, 0.25)`, `rgba(26, 86, 219, 0.2)`
  - Line 47: `rgba(27, 46, 94, 0.06)`
  - Line 56: `#F1F4F9`
  - Line 59, 63: `#CBD5E1`, `#94A3B8`
- **`index.html`**:
  - Line 5: Favicon SVG hard-coded `#4285F4`, `#EA4335`, `#FBBC04`, `#34A853`
  - Line 14: `bg-[#F8FAFF]`, `text-[#1F2937]`, `selection:bg-google-blue/20`, `selection:text-google-blue-deep`
- **`src/App.tsx`**:
  - Line 16: `bg-[#F8FAFF]`, `selection:bg-google-blue/20`, `selection:text-google-blue-royal`
- **`src/components/ui/Logo.tsx`**:
  - Lines 29–32: 4 squares hard-coded to Google colors (`bg-google-blue`, `bg-google-red`, `bg-google-yellow`, `bg-google-green`), `text-google-blue-royal`
- **`src/components/ui/AbstractBackground.tsx`**:
  - Lines 16, 31, 46, 61, 76, 88: Gradients and SVGs using `google-blue`, `google-blue-royal`, `google-red`, `google-yellow`, `google-green`
- **`src/hooks/useQrStudio.ts`**:
  - Line 34: `fgColor: '#1A56DB'` (Google royal blue)
  - Line 44: `activePresetId: 'google'`
- **`src/lib/presets.ts`**:
  - Lines 18–28: Preset `'google'` with `name: 'Google Royal'`, `fgColor: '#1A56DB'`
- **`src/services/seed.ts`**:
  - Lines 20, 62, 91, 110: Sample templates using `#1A56DB`, `#EA4335`, `#4285F4`, `#34A853`
  - Lines 145, 177, 208, 237, 268, 297, 326, 357: Fake avatar colors `#4285F4`, `#EA4335`, `#34A853`, `#FBBC04`, `#1A56DB`
- **`src/three/themes.ts`**:
  - Lines 12, 40, 54, 98, 127, 129: Theme accents referencing `#EA4335`, `#34A853`, `#4285F4`, `#FBBC04`, `#1A56DB`, `#F8FAFF`
- **`src/components/tabs/ThreeTab.tsx`**:
  - Lines 24–31: `GOOGLE_ACCENTS` array containing `#1A56DB`, `#EA4335`, `#FBBC04`, `#34A853`, `#00E5FF`, `#9333EA`
- **`src/test/reliability.test.ts` & `src/test/shareLink.test.ts`**:
  - Test fixtures referencing `#1A56DB`

---

## 2. Google-Brand Color Usage to Replace

Every instance of `google-*` Tailwind classes and utility styles across all 15 component/page files must be replaced with the 5-color Madhubani palette:
- `saffron` (`#F79454`)
- `vermilion` (`#C84F4C`)
- `peacock-deep` (`#13504D`)
- `peacock` (`#2F7A72`)
- `sage` (`#A5B596`)
- `paper` (`#FFFDF8`)
- `paper-2` (`#F6F0E4`)
- `ink` (`#1C2B29`)

### Files using Google-brand tokens:
1. `tailwind.config.js`: Entire `colors.google` object.
2. `src/index.css`: Dot grid, shadow glow utilities (`shadow-royal-glow`, `shadow-google-card`).
3. `index.html`: Favicon inline SVG, body selection colors.
4. `src/App.tsx`: Selection colors, background colors.
5. `src/components/ui/Logo.tsx`: 4-color module grid and accent text.
6. `src/components/ui/AbstractBackground.tsx`: All blob gradients and SVG rings.
7. `src/components/layout/Navbar.tsx`: Focus rings, avatar gradient, buttons, login CTA.
8. `src/components/layout/TabBar.tsx`: Sliding pill gradient, active badges.
9. `src/components/forms/TypeSelector.tsx`: Active button background, icon wrapper, borders, focus rings.
10. `src/components/forms/TypeForms.tsx`: Validation error icons/text, input focus rings, hint icons.
11. `src/components/forms/CustomizationPanel.tsx`: Header icons, active preset tags/borders, slider focus rings.
12. `src/components/qr/QrPreview.tsx`: Download buttons, reliability cards, scan verification badges.
13. `src/pages/Welcome.tsx`: Hero gradient headline, feature card icon badges, CTA button gradient, live typewriter output.
14. `src/pages/Login.tsx`: Submit button gradient, input focus rings, demo button border/hover.
15. `src/pages/Terms.tsx`: Back link, section icons, active TOC links.
16. `src/pages/NotFound.tsx`: Yellow compass badge, return home button gradient.
17. `src/components/tabs/ThreeTab.tsx`: `GOOGLE_ACCENTS` constant and color picker buttons.
18. `src/components/tabs/CommunityTab.tsx`: Follow button active states, author avatar colors.
19. `src/components/tabs/RecentTab.tsx`: Type badge pills.
20. `src/components/tabs/ProfileTab.tsx`: Avatar gradient, CTA banner, export button.
21. `src/hooks/useQrStudio.ts`: Initial foreground color (`#1A56DB`) and default preset (`'google'`).
22. `src/lib/presets.ts`: Preset `'google'` (to be replaced with Madhubani presets: Peacock, Saffron Sun, Lotus Pond, Terracotta).

---

## 3. Inventory of Pages, Tabs, and Components

### Pages (5)
- [`src/pages/Welcome.tsx`](file:///e:/QRaft/src/pages/Welcome.tsx): Landing gate with typewriter demo and 3 feature cards.
- [`src/pages/Workspace.tsx`](file:///e:/QRaft/src/pages/Workspace.tsx): Main application container managing tabs, touch swipe gestures, and share link modal.
- [`src/pages/Login.tsx`](file:///e:/QRaft/src/pages/Login.tsx): Authentication page with sign in, sign up, and one-click demo login.
- [`src/pages/Terms.tsx`](file:///e:/QRaft/src/pages/Terms.tsx): 17-section comprehensive terms, disclaimer, and privacy policy page.
- [`src/pages/NotFound.tsx`](file:///e:/QRaft/src/pages/NotFound.tsx): 404 error page.

### Navigation & Layout Components (3)
- [`src/components/layout/Navbar.tsx`](file:///e:/QRaft/src/components/layout/Navbar.tsx): Header with brand logo, demo mode badge, user menu, and terms link.
- [`src/components/layout/TabBar.tsx`](file:///e:/QRaft/src/components/layout/TabBar.tsx): Sliding tab bar with animated pill and keyboard navigation.
- [`src/components/layout/GateGuard.tsx`](file:///e:/QRaft/src/components/layout/GateGuard.tsx): Route guard checking session gate pass before workspace access.

### Workspace Tabs (6)
- [`src/components/tabs/GeneratorTab.tsx`](file:///e:/QRaft/src/components/tabs/GeneratorTab.tsx): 2D QR builder orchestrating TypeSelector, TypeForms, CustomizationPanel, and QrPreview.
- [`src/components/tabs/ThreeTab.tsx`](file:///e:/QRaft/src/components/tabs/ThreeTab.tsx): Lazy-loaded 3D WebGL QR visualizer with Three.js/Fiber.
- [`src/components/tabs/TemplatesTab.tsx`](file:///e:/QRaft/src/components/tabs/TemplatesTab.tsx): User's saved template library with search, duplicate, delete, and remix actions.
- [`src/components/tabs/CommunityTab.tsx`](file:///e:/QRaft/src/components/tabs/CommunityTab.tsx): Public gallery with like, comment, remix, report, and author follow.
- [`src/components/tabs/RecentTab.tsx`](file:///e:/QRaft/src/components/tabs/RecentTab.tsx): Session history of recently generated QR codes stored in localStorage.
- [`src/components/tabs/ProfileTab.tsx`](file:///e:/QRaft/src/components/tabs/ProfileTab.tsx): User profile, stats counters, JSON backup export, demo reset, and account deletion.

### Form & Preview Components (4)
- [`src/components/forms/TypeSelector.tsx`](file:///e:/QRaft/src/components/forms/TypeSelector.tsx): 5-type selection grid (URL, Text, Email, Phone, Wi-Fi).
- [`src/components/forms/TypeForms.tsx`](file:///e:/QRaft/src/components/forms/TypeForms.tsx): Specialized input forms with validation error feedback.
- [`src/components/forms/CustomizationPanel.tsx`](file:///e:/QRaft/src/components/forms/CustomizationPanel.tsx): Presets, color controls, size/margin sliders, and ECL picker.
- [`src/components/qr/QrPreview.tsx`](file:///e:/QRaft/src/components/qr/QrPreview.tsx): Real-time canvas renderer, contrast meter, scan verification, PNG/SVG export, and copy.

### UI Decorative Elements (2)
- [`src/components/ui/Logo.tsx`](file:///e:/QRaft/src/components/ui/Logo.tsx): 4-dot brand icon mark and typography.
- [`src/components/ui/AbstractBackground.tsx`](file:///e:/QRaft/src/components/ui/AbstractBackground.tsx): Animated ambient gradient blobs.

### Three.js Components (2)
- [`src/three/QrScene.tsx`](file:///e:/QRaft/src/three/QrScene.tsx): React Three Fiber canvas with instanced meshes, orbit controls, camera transitions, and lighting.
- [`src/three/matrix.ts`](file:///e:/QRaft/src/three/matrix.ts): QR module matrix extractor from `qrcode.create()`.
- [`src/three/themes.ts`](file:///e:/QRaft/src/three/themes.ts): 16 pre-built 3D theme definitions across 4 categories.

---

## 4. Leftover Framework & Template Defaults

1. **Fonts in `index.html` & `tailwind.config.js`:**
   - Default Google Fonts import: `Inter` and `Plus Jakarta Sans`.
   - Must be migrated to **`Fraunces`** (headings) and **`Mukta`** (body).
2. **Favicon in `index.html`:**
   - Contains a generic 4-square Google-colored data SVG.
   - Must be replaced with a custom Madhubani lotus or fish mark SVG in the 5-color palette.
3. **Open Graph & Metadata:**
   - Missing canonical URL tag, Open Graph image, Twitter card tags, `theme-color` meta tag.
4. **`package.json` Metadata:**
   - `"name": "qraft-qr-designer"`, `"private": true`, `"version": "1.0.0"`.
   - Needs explicit description, author, repository, and license fields tied to `site.ts`.

---

## 5. Unused Files, Assets, and Dependencies

### Unused Runtime Dependencies in `package.json`
- **`clsx`** (`^2.1.1`): Zero references in `src/`.
- **`tailwind-merge`** (`^2.5.5`): Zero references in `src/`.
- *Recommendation:* Remove both or implement a clean `cn(...)` utility if conditional classes are needed.

### Unused Assets
- No root `public/` directory exists. All icons are rendered via `lucide-react` and inline SVGs.
- No orphan image files in `src/assets/` (folder does not exist).

---

## 6. Duplicated Logic & Components

1. **Mini QR Canvas Rendering:**
   - Duplicated across:
     - `src/components/tabs/TemplatesTab.tsx` (lines 37–54)
     - `src/components/tabs/CommunityTab.tsx` (lines 42–59)
     - `src/components/tabs/RecentTab.tsx` (lines 20–36)
     - `src/pages/Welcome.tsx` (lines 54–71)
   - *Recommendation:* Abstract into a reusable `<MiniQrCanvas />` or leverage the custom drawing pipeline built in Phase 5.
2. **Form Input Field Markup:**
   - Repetitive text input label, error, and info text markup in `TypeForms.tsx` and `Login.tsx`.

---

## 7. Placeholders, Filler Text, Dead Links, and Fake Proof

### Placeholders Found
- **`src/pages/Terms.tsx`**:
  - Line 187: `[ADD YOUR DETAILS: student@srmist.edu.in]`
  - Line 227: `[ADD YOUR DETAILS: Chennai, Tamil Nadu, India]`
  - Line 238: `[ADD YOUR DETAILS: Student Developer Name]`
  - Line 239: `[ADD YOUR DETAILS: student@srmist.edu.in]`
- **`README.md`**:
  - Line 16: `[ADD YOUR VERCEL / NETLIFY URL HERE: https://qraft-qr-designer.vercel.app]`
- **`src/components/forms/TypeForms.tsx`**:
  - Line 40: `placeholder="https://example.com/page"` (generic placeholder to be replaced with specific, realistic URL)
- **`src/lib/validation.ts`**:
  - Line 59: `(e.g., https://example.com)` (replace with realistic example)

### Fake Social Proof & Invented Entities Found
- **`src/services/seed.ts`**:
  - Lines 123–366: Fake user identities posing as real people:
    - `"Aanya Sharma"`, `"Rohan K."`, `"Vikram Patel"`, `"Priya Sundaram"`, `"Devon Vance"`, `"Maya Lin"`, `"Sameer Joshi"`, `"Kavita Reddy"`
    - Fake comment threads and fabricated like counts (e.g. 38 likes, 64 likes).
  - *Must be overhauled:* Posts must be badged as **"Sample template"**, attributed to `"QRaft samples"`, and fake user counts removed.

### Banned Buzzwords & Slogans
- `src/pages/Welcome.tsx`:
  - Slogan "Craft QR codes that stand out."
  - "Zero Backend" / "Reliability Engine"
- Various generic descriptions across presets and themes.

---

## 8. Excessive & Narrating Comments

Several files contain step-by-step narrating comments that clutter the code without explaining rationale:
- `src/App.tsx`: `// Global Ambient Animated Google Palette Blobs`, `// Route Handlers`, `// Public Entry Gate: Welcome page`
- `src/pages/Welcome.tsx`: `// Typewriter demo state`, `// Typewriter effect`, `// Live QR canvas render`, `// Hero section`, `// Left Column: Headline, Value prop, CTA`, `// Three Feature Highlights`
- `src/three/themes.ts`: `// 1. SCENES (4)`, `// 2. ANIME-STYLE (4 - Original Generic)`, `// 3. CHARACTERS (4 - Original low-poly mascots)`, `// 4. OTHERS (4)`
- `src/services/seed.ts`: Redundant category and seed comments.

---

## 9. Inconsistent Naming or Patterns

1. **Color Naming:** Mix of semantic Google colors (`google-blue`, `google-blue-royal`) and Tailwind default palette colors (`blue-50`, `amber-50`, `red-50`, `emerald-50`).
2. **Payload Generation vs. Custom Drawing:** 2D generator currently relies entirely on `QRCode.toCanvas` while 3D generator extracts matrix via `generateQrMatrix()`. The Phase 5 Designer QR styles will unify 2D drawing on a matrix-based pipeline.
3. **Storage Keys:** `qraft:templates:v1` and `qraft:recent:v1` need migration logic when adding Designer QR style properties.

---

## 10. Baseline Build and Test Status

- **Git Branch:** `madhubani-redesign` created and active.
- **Unit Tests:** `npm test` (Vitest v2.1.9)
  - `src/test/payload.test.ts`: 7 tests passed
  - `src/test/shareLink.test.ts`: 5 tests passed
  - `src/test/reliability.test.ts`: 9 tests passed
  - `src/test/validation.test.ts`: 8 tests passed
  - `src/test/crypto.test.ts`: 10 tests passed
  - **Total: 5 test files, 39 passed, 0 failed.**
- **Production Build:** `npm run build` (`tsc && vite build`)
  - TypeScript check: 0 errors
  - Output bundle:
    - `dist/index.html`: 1.51 kB
    - `dist/assets/index-Cs4awAu2.css`: 44.81 kB
    - `dist/assets/index-COskZYDd.js`: 581.19 kB
    - `dist/assets/ThreeTab-C9Xr6lHp.js`: 852.01 kB (properly code-split)
  - Exit code: 0
