# QRaft — Student Submission Checklist & Manual Steps

Welcome! QRaft has been upgraded with an authentic Mithila Madhubani folk art design system, animated Rangoli generation, 2D designer modules, automated optical scannability verification via `jsQR`, and 16 curated 3D WebGL themes.

Before submitting this repository to **GDG SRM IST**, please complete the following quick checklist items:

---

## 1. Fill in Your Personal Details in `src/config/site.ts`

Open `src/config/site.ts` and update the `siteConfig.author` section with your actual details:

```typescript
export const siteConfig = {
  // ...
  author: {
    name: 'Your Full Name', // e.g. 'Aarav Sharma'
    registrationNumber: 'RAxxxxxxxxxxxxx', // Your SRM IST Student Reg Number
    department: 'Department of Computing Technologies', // or your department
    college: 'SRM Institute of Science and Technology, Kattankulathur',
    email: 'your_netid@srmist.edu.in',
    github: 'https://github.com/your-username',
    linkedin: 'https://linkedin.com/in/your-profile',
    deploymentUrl: 'https://qraft-your-username.vercel.app', // Once deployed
  },
  // ...
};
```

> [!NOTE]
> All footer credits, Terms of Service notices, and metadata automatically draw from `src/config/site.ts` as the single source of truth.

---

## 2. Run Local Verification Commands

Run the 3 automated quality checks in your terminal to ensure everything is green:

```bash
# 1. Run full unit test suite (55 tests)
npm test

# 2. Run automated authenticity and hygiene audit
npm run audit

# 3. Compile TypeScript and build production bundle
npm run build
```

---

## 3. Recommended Screenshots for Submission

Capture 4 clear screenshots to include in your repository submission or presentation deck:

1. **Welcome Screen (`#/`)**:
   - The animated Madhubani Rangoli QR code assembling radially outward on warm wasli paper with peacock feathers and lotus cartouche.
2. **2D Generator Studio (`#/app`)**:
   - Showing the **Peacock Garden** or **Saffron Sun** preset with custom connected modules, circular finder rings, and the green *"Scans OK in camera test"* verification badge.
3. **Interactive 3D WebGL Viewport (`#/app` > 3D Matrix)**:
   - Orbiting extrusion in **Peacock Garden** or **Sun Temple** theme with extruded rounded primitives.
4. **Mobile Responsive View**:
   - Resize browser to 375px width (iPhone / Pixel view) to demonstrate the responsive sliding tab bar and touch-friendly controls.

---

## 4. Deploying to Vercel or Netlify

1. Push your branch to GitHub:
   ```bash
   git push origin madhubani-redesign
   ```
2. Import your repository into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Paste the resulting live URL into `src/config/site.ts` (`deploymentUrl`).

---

Good luck with your submission to **GDG SRM IST**!
