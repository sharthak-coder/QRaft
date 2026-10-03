# QRaft: Comprehensive Testing & Quality Assurance Documentation

This document catalogs the automated testing suite and hygiene auditing mechanisms implemented in QRaft for the GDG on Campus SRM IST submission.

---

## 1. Test Suite Overview

QRaft uses **Vitest** for fast, deterministic unit and integration testing. All tests run in JSDOM / Node environments with zero flaky timeouts.

- **Total Test Files:** 11
- **Total Tests:** 93
- **Test Pass Rate:** 100% (93 / 93 passing)
- **Execution Time:** $\approx 1.5$ seconds

```
 RUN  v2.1.9 E:/QRaft

 ✓ src/test/payload.test.ts (7 tests)
 ✓ src/test/validation.test.ts (8 tests)
 ✓ src/test/reliability.test.ts (12 tests)
 ✓ src/test/shareLink.test.ts (6 tests)
 ✓ src/test/contrast.test.ts (5 tests)
 ✓ src/test/migration.test.ts (16 tests)
 ✓ src/test/qrRenderer.test.ts (12 tests)
 ✓ src/test/motionBackground.test.tsx (3 tests)
 ✓ src/test/scenic3d.test.ts (9 tests)
 ✓ src/test/crypto.test.ts (10 tests)
 ✓ src/test/a11y-responsive.test.tsx (5 tests)

 Test Files  11 passed (11)
      Tests  93 passed (93)
```

---

## 2. Detailed Test Suite Inventory

### 2.1 `src/test/contrast.test.ts` (5 tests)
- Enforces body text is `indigo-ink` on `rice` ($> 4.5:1$, achieves AAA $\approx 11:1$).
- Strictly forbids `haldi` as text on `rice` ($\approx 2.17:1$ fails AA).
- Guarantees text on `haldi` fill is `indigo-ink` ($\ge 4.5:1$, passes AA $\approx 5.05:1$).
- Verifies white/rice text on `sindoor`, `leaf`, and `indigo-ink` passes AAA/AA.
- Verifies procedural paper texture darkest fiber maintains WCAG AA contrast.

### 2.2 `src/test/migration.test.ts` (16 tests)
- `migrateColor`: Maps legacy hex codes (`#13504D`, `#C54845`, `#F79454`, `#2F7A72`, `#FFFDF8`) to folk tokens.
- `migrateQrStyle`: Upgrades legacy style objects with safe defaults and migrated pigment tokens.
- `TemplateStore`: Migrates legacy `v1` templates in localStorage to `v2` on load.
- `RecentStore`: Migrates legacy `v1` recents in localStorage to `v2` on load.
- `decodeShareLink`: Backward-compatible decoding of legacy v1/v2 share links with automatic pigment migration.
- `getPresetById`: Resolves legacy preset IDs (`peacock`, `saffron-sun`, `lotus-pond`, `terracotta`, `godna-stipple`) to folk presets.
- **WCAG Contrast Invariant:** Asserts that every preset in `PRESETS` meets or exceeds the $4.5:1$ contrast requirement.

### 2.3 `src/test/scenic3d.test.ts` (9 tests)
- Validates all 4 scenic theme definitions (`shinto-alpine`, `mithila-grove`, `floating-isle`, `classic-blocks`) have complete palettes.
- Generates voxels within strict budget caps ($< 40,000$ desktop / $< 15,000$ mobile).
- Enforces flat scan invariants at $t=0$ (base modules sit at $y=0.05$ with $S_y=0.05$; upper tiers collapse to $S_y=0$).
- Verifies voxel elevation in scenic state ($t=1$).
- Verifies finder centers receive distinct landmark highlighting.
- Optical scannability test confirming 100% canvas readability.

### 2.4 `src/test/motionBackground.test.tsx` (3 tests)
- Renders fixed background canvas with `aria-hidden="true"` and `pointer-events-none`.
- Renders cleanly on workspace routes with subdued peripheral styling.
- Handles window resize and updates canvas metrics gracefully.

### 2.5 `src/test/a11y-responsive.test.tsx` (5 tests)
- Enforces minimum 16px (`text-base`) font size on text inputs to eliminate mobile auto-zoom.
- Verifies $\ge 44$px touch targets and accessible labels on type selector buttons.
- Comprehensive WCAG contrast enforcement across all primary color pairings.
- Verifies `role="alert"` with `aria-live="polite"` on form field validation errors.

### 2.6 `src/test/qrRenderer.test.ts` (12 tests)
- Finder and timing pattern geometric detection.
- Finder separator module recognition.
- SVG export with Madhubani `katchni` hatching and `godna` stippling.
- HTML5 canvas rendering and optical verification.

### 2.7 `src/test/payload.test.ts` (7 tests)
- URL prefix normalization (`http://` / `https://`).
- Plain text formatting.
- `mailto:` URI formatting with subject and message escaping.
- `tel:` dialing URI formatting.
- `WIFI:` MECARD formatting with special character escaping.

### 2.8 `src/test/validation.test.ts` (8 tests)
- Validates URL formats, emails, telephone numbers, and Wi-Fi credentials.
- Checks QR code payload length limits against error correction capacity.

### 2.9 `src/test/reliability.test.ts` (12 tests)
- Relative luminance and contrast ratio calculations.
- QR density scoring based on payload length and ECL.
- Reliability grading (`good`, `caution`, `risky`).
- Inverted colors and low-margin warnings.

### 2.10 `src/test/shareLink.test.ts` (6 tests)
- UTF-8 safe base64url encoding and decoding.
- v2 template share link serialization and deserialization.
- Graceful decoding of legacy v1 payloads.
- Rejection of corrupted, oversized, or malicious payloads.
- XSS and HTML injection sanitization on template names and authors.

### 2.11 `src/test/crypto.test.ts` (10 tests)
- PBKDF2 Web Crypto password hashing with 100,000 iterations.
- Unique 16-byte cryptographically secure random salts.
- Deterministic password verification.

---

## 3. Automated Authenticity & Hygiene Audit (`scripts/audit-site.mjs`)

QRaft includes a strict custom static analysis script that scans the codebase for submission quality:
- **Stub link detection:** Flags any `href="#"` or `href=""`.
- **Development markers:** Flags unresolved `TODO`, `FIXME`, or `HACK` comments.
- **Placeholder copy:** Flags `lorem ipsum`, `foo`, `bar`, `john doe`.
- **Unsubstantiated claims:** Flags fake marketing buzzwords like `Fortune 500` or `Trusted by 10,000+`.
- **Stray console logs:** Detects and flags unintended `console.log` statements in production code.

Run the audit script:
```bash
npm run audit
```
*Current result: 100% PASS (0 issues found).*
