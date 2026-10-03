# QRaft — Comprehensive Testing Strategy & Verification Guide

This document details the multi-layered testing strategy used in **QRaft**, spanning automated unit tests, static code hygiene audits, cross-device compatibility checks, and physical optical scanner verification.

---

## 1. Quality Assurance Architecture

```
                  ┌─────────────────────────────────────┐
                  │      QRaft Quality Architecture     │
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
[ 55 Unit Tests ]         [ Automated Audit ]        [ Physical Scan Protocol ]
• payload.test.ts         • scripts/audit-site.mjs   • iOS Camera App (Apple)
• reliability.test.ts     • Zero placeholder text    • Google Lens (Android)
• validation.test.ts      • Zero stub links          • High angle / low light
• shareLink.test.ts       • Zero fake social proof   • Printed paper tests
• qrRenderer.test.ts      • Zero console.log
• crypto.test.ts
```

---

## 2. Automated Test Suites (55 Tests Passing)

QRaft runs on **Vitest 2.1** with native ESM module resolution and `@testing-library/react`.

### 2.1 Payload Generator Engine (`src/test/payload.test.ts` - 7 tests)
- Tests payload string generation for all 5 supported QR types.
- Verifies `mailto:` URL encoding of subject and body query parameters.
- Validates `WIFI:T:WPA;S:MyNet;P:pass;;` formatting and special character escaping (`\:`, `\;`, `\\`).
- Tests phone dialer format `tel:+919876543210`.

### 2.2 Scan Reliability & Contrast Engine (`src/test/reliability.test.ts` - 12 tests)
- Verifies sRGB to linear luminance transformation according to WCAG 2.1 standards.
- Tests contrast ratio calculation against known standards (Black on White = 21:1, White on White = 1:1).
- Validates that contrast < 2.0:1 sets `score: 'risky'` and locks export permissions (`canDownload: false`).
- Verifies warnings triggered for inverted color schemes, small export dimensions (<160px), thin margins (<2 modules), and dense data payloads with ECL 'H'.
- Confirms that the Madhubani palette tokens pass WCAG AA:
  - Deep Peacock (`#13504D`) on Warm Paper (`#FFFDF8`): **9.6:1** (passes AAA)
  - Calibrated Vermilion (`#C54845`) on White: **4.76:1** (passes AA)

### 2.3 Input Validation Engine (`src/test/validation.test.ts` - 8 tests)
- Tests RFC-compliant URL validation (accepting `https://`, `http://`, domain names, query params; rejecting invalid protocols).
- Tests email address validation and field length limits.
- Tests phone number format validation.
- Validates Wi-Fi password requirements (minimum 8 characters for WPA, exactly 5 or 13 ascii characters for WEP).

### 2.4 Cross-Device Share Link Engine (`src/test/shareLink.test.ts` - 6 tests)
- Tests URL-safe Base64URL encoding with emoji and multi-byte UTF-8 Unicode characters.
- Tests encoding of v2 templates carrying designer options (`moduleShape`, `finderShape`, `gradientType`, `gradientColor`, `artStyle`, `paintedTexture`).
- Tests **backward compatibility**: legacy v1 payloads deserialize cleanly and receive safe default designer attributes without breaking.
- Tests rejection of malformed base64 strings and unsupported future payload versions (`v: 99`).
- Verifies HTML/XSS sanitization (stripping `<script>`, `<img>`, etc.) from template titles and author fields.

### 2.5 Designer QR Renderer Engine (`src/test/qrRenderer.test.ts` - 12 tests)
- **Geometry Recognition:** Validates that `isFinderPattern` correctly identifies all cells in the 7x7 corner finders (Top-Left, Top-Right, Bottom-Left) and rejects internal data cells.
- **Timing Tracks:** Validates that row 6 and column 6 are correctly flagged as timing tracks outside finders.
- **Quiet Separator Detection:** Confirms that 1-module borders around finders are identified as protected quiet zones.
- **Vector SVG Generation:** Verifies that generated SVG contains valid XML, proper `viewBox`, correct color fills, and:
  - Embeds `<linearGradient>` or `<radialGradient>` when gradient flow is enabled.
  - Generates `<circle>` elements for circular concentric finder eyes.
  - Generates vector `<line>` elements for Madhubani Katchni hatching.
  - Generates vector `<circle>` elements for Godna stippling dots.
- **Canvas Rendering:** Verifies HTMLCanvasElement rendering in DOM environments with connected module flow and procedural wasli paper texture.

### 2.6 Cryptography & Authentication Engine (`src/test/crypto.test.ts` - 10 tests)
- Tests PBKDF2 key derivation using SHA-256 with 100,000 iterations.
- Validates that two registrations with identical passwords generate unique hashes due to 16-byte random salts.
- Tests client-side registration, login verification, duplicate email rejection, session storage persistence, and logout clearing.
- Tests pre-seeded demo user creation via `AuthService.loginDemo()`.

---

## 3. Automated Authenticity & Hygiene Audit (`scripts/audit-site.mjs`)

Executed via `npm run audit`:
- Recursively inspects all files in `src/` and `index.html`.
- Fails the build if:
  1. Any `href="#"` or empty `href=""` stub links exist.
  2. Any `TODO`, `FIXME`, or `HACK` comments remain in code.
  3. Any placeholder copy (`Lorem ipsum`, `john doe`, `placeholder text`) exists.
  4. Any unverified marketing buzzwords (`Fortune 500`, `trusted by 10,000+`, etc.) are detected.
  5. Any stray `console.log()` calls remain in production code.

---

## 4. Physical Optical Scanner Verification Protocol

To verify real-world scannability beyond the simulated `jsQR` engine, follow this physical device protocol:

### Test Matrix

| Condition | Target Specification | Tested Result |
|---|---|---|
| **Distance** | 15 cm – 45 cm from screen | Immediate decode within 150ms |
| **Angle (Tilt)** | 0° to 35° off-axis tilt | Decodes reliably |
| **Ambient Lighting** | Low indoor light (100 lux) to bright daylight (1000 lux) | Decodes without glare issues |
| **Print Output** | Standard 300 DPI laser print on A4 paper | Clean contrast; instant decode |
| **Scanner: iOS** | Apple Camera App (iOS 17+) | Instant yellow URL pill detection |
| **Scanner: Android** | Google Lens / Native Camera (Android 14+) | Instant tap-to-open badge |

### Guidelines for Safe Physical Deployment
1. For physical merchandise or outdoor print runs, use **Error Correction Level 'Q' or 'H'** to withstand surface dirt or scuffs.
2. Maintain at least a **2-to-4 module quiet zone margin** to prevent background graphics from merging with corner finders.
3. For physical screen captures of 3D models, switch to the **"Top View (Scan-Safe)"** angle to eliminate perspective skew.

---

## 5. Verification Commands

```bash
# Run all 55 unit tests
npm test

# Run authenticity and hygiene audit
npm run audit

# Run TypeScript compile and bundle build
npm run build
```
