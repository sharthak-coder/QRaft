# QRaft: Deep Architectural & Mathematical Documentation

This document provides a comprehensive technical and cultural explanation of the architectural decisions, mathematical algorithms, and accessibility invariants implemented in QRaft.

---

## 1. Cultural & Artistic Foundations of Mithila Art

### 1.1 Five Natural Folk Pigments
Traditional Mithila (Madhubani) paintings originate in the Mithila region of Bihar, India and Nepal. Unlike synthetic pigments, traditional practitioners prepare colors from organic mineral and vegetable sources:
1. **Indigo Ink (`#1A3644`):** Extracted from fermented *Indigofera tinctoria* leaves. In QRaft, it serves as the primary high-contrast line pigment, dark mode surface, and body copy text color.
2. **Sindoor Red (`#A62B2B`):** Prepared from crushed cinnabar (*Hingula*) stone. It represents life force, celebrations, and vital focus. In QRaft, it serves as the primary interactive button color, landmark finder accents, and validation error states.
3. **Haldi Turmeric (`#D99B26`):** Ground from dried turmeric roots (*Curcuma longa*). It symbolizes radiant warmth, prosperity, and dawn light. In QRaft, it is used strictly for fills, active badges, and highlights.
4. **Leaf Green (`#2D5A3E`):** Extracted from crushed wood-apple (*Bel*) and bean vines. In QRaft, it denotes verified states, nature motifs, and secondary actions.
5. **Rice Paper (`#F6F1E8`):** Handmade wasli paper washed with ground rice paste (*Aripana*). In QRaft, it forms the canvas base.

### 1.2 Framing & Hatching Traditions
- **Double-Line Borders:** Mithila art is distinguished by double-line contours. The narrow channel between lines is filled with geometric patterns:
  - *Kachni:* Delicate 45-degree parallel cross-hatching.
  - *Bharni:* Solid color fill with contrasting ink stitches.
  - *Fish-Scale:* Sinuous overlapping circular arcs symbolizing river currents.
- **Corner Lotus Buds:** Auspicious finials anchoring the four corners of panels without intruding into internal content quiet zones.
- **Jharokha Temple Gateways:** Stepped plinths and kalash finials framing the QR matrix, providing architectural grandeur while maintaining the standard 4-module quiet zone.

---

## 2. Color Contrast Engineering & WCAG Invariants

### 2.1 The Relative Luminance Formula
QRaft computes contrast ratios using the W3C WCAG 2.1 relative luminance specification:

$$L = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B$$

where color channels $C \in \{R, G, B\}$ are linear normalized sRGB components:

$$C = \begin{cases} \frac{C_{\text{sRGB}}}{12.92} & \text{if } C_{\text{sRGB}} \le 0.04045 \\ \left(\frac{C_{\text{sRGB}} + 0.055}{1.055}\right)^{2.4} & \text{otherwise} \end{cases}$$

The contrast ratio between two colors with luminances $L_1 > L_2$ is:

$$\text{Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

### 2.2 Strict Pigment Enforcement Rules
- **Rule 1 (The Haldi Fallacy):** Turmeric yellow on rice paper has a contrast ratio of $\approx 2.17:1$, severely failing the minimum WCAG AA threshold of $4.5:1$. Therefore, QRaft's contrast validator programmatically forbids haldi text on light backgrounds. Haldi is reserved for fills and borders.
- **Rule 2 (Indigo Supremacy):** Indigo-ink on rice paper yields a ratio of $\approx 11.0:1$, surpassing WCAG AAA ($7.0:1$) for exceptional reading comfort.
- **Rule 3 (Inverted Text on Haldi):** When a button or badge uses a haldi fill, the text must strictly be indigo-ink ($5.05:1$, passing WCAG AA).

---

## 3. Procedural Khadi Paper Synthesis

Rather than shipping static megabyte raster textures, QRaft synthesizes organic paper grain client-side in `src/lib/paperTexture.ts`:
1. **$512\times 512$ Khadi Base:** Synthesized using pseudo-random fiber generation with varied stroke lengths ($12-45$ px) and alpha perturbation ($0.03-0.08$).
2. **$128\times 128$ Grain Wash:** Per-pixel micro-noise simulating pressed cotton pulp fibers.
3. **Contrast Invariant Check:** The procedural generator samples the darkest generated fiber and verifies that the contrast against `#1A3644` remains $\ge 4.5:1$.

---

## 4. Interactive Motion Background & Physics

In `src/components/MotionBackground.tsx`, three parallax layers render to an unoccluded HTML5 canvas:

### 4.1 Parallax Layer Hierarchy
- **Far Layer ($\text{factor} = 0.02$):** Surya (Sun) and Chandra (Moon) celestial bodies with gentle rotational oscillation.
- **Mid Layer ($\text{factor} = 0.05$):** Flowing peacock plume curves and twin swimming carp oscillating with harmonic sine waves.
- **Near Layer ($\text{factor} = 0.10$):** Ambient folk specks and rice petal particles subject to gentle Brownian motion.

### 4.2 Smooth Lerp Smoothing
To eliminate jerky mouse movements and sensor noise, targets are smoothed using linear interpolation:

$$\mathbf{x}_{\text{current}} \leftarrow \mathbf{x}_{\text{current}} + (\mathbf{x}_{\text{target}} - \mathbf{x}_{\text{current}}) \times 0.05$$

### 4.3 Energy Conservation & Throttling
1. **Idle Throttling:** If no pointer or motion event is detected for 2,000 ms, the frame loop skips frames, throttling from 60 FPS down to 10 FPS to conserve laptop and mobile battery life.
2. **Page Visibility:** The RAF loop halts completely when `document.hidden === true`.
3. **Calm Mode:** When Calm Mode or `prefers-reduced-motion` is active, the engine renders a single static frame and permanently pauses the RAF loop.

---

## 5. Scenic 3D World & Voxel Diorama Mathematics

### 5.1 QR Module Decomposition & Cluster Flood-Fill
Standard QR code matrices consist of dark (1) and light (0) modules. QRaft runs a 4-connected BFS cluster flood-fill on dark modules:
1. **Clusters $\ge 8$ modules:** Identified as contiguous terrain plateaus or mountain ridges (elevated to $4-6$ voxel tiers).
2. **Clusters $4-7$ modules:** Identified as stepped shrines or village pavilions (elevated to $2-3$ voxel tiers).
3. **Finder Pattern Centers:** Distinct landmarks (Torii gate towers in Shinto Pass, Kadamba sanctums in Mithila Grove, Beacon towers in Floating Isle).

### 5.2 Strict Voxel Budget Capping
To guarantee 60 FPS on mobile and low-end hardware, the generator enforces a hard budget cap:
- **Desktop:** Max 40,000 voxels.
- **Mobile:** Max 15,000 voxels.
Single-pass GPU instancing (`THREE.InstancedMesh`) batches all voxels into a single draw call.

### 5.3 Continuous Morph Mathematics ($t \in [0, 1]$)
The morph parameter $t$ controls smooth interpolation:
1. **Voxel Position & Scale:**
   $$\mathbf{P}(t) = (1 - t)\mathbf{P}_{\text{flat}} + t\mathbf{P}_{\text{scenic}}$$
   $$\mathbf{S}(t) = (1 - t)\mathbf{S}_{\text{flat}} + t\mathbf{S}_{\text{scenic}}$$
   At $t=0$, vertical scale $S_y$ for all upper-tier voxels collapses to 0, ensuring that only the ground plane is visible.
2. **Camera Angle:**
   At $t=0$, the camera snaps to $(0, \text{dist}, 0.001)$ looking directly down at $(0, 0, 0)$, acting as an orthographic flat view. At $t=1$, the camera transitions to an isometric 45-degree angle.

### 5.4 Optical Scannability Invariant
When $t \to 0$, the 3D scene becomes mathematically equivalent to an unlit, flat 2D QR matrix. Optical verification with `jsQR` operates on this flattened projection, ensuring 100% camera decode reliability.
