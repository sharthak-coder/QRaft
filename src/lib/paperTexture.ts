/**
 * Procedural Handmade Paper & Khadi Parchment Texture Generator
 * 
 * Generates seamless 512x512 khadi paper canvas tile and 128x128 rice-powder/vermilion
 * grain overlay once at startup. Caches as CSS variables with zero per-frame runtime cost.
 */

import { calculateContrastRatio } from './reliability';

let cachedPaperDataUrl: string | null = null;
let cachedGrainDataUrl: string | null = null;
let cachedDarkestHex: string = '#EFE8D9';

/**
 * Generates a seamless 512x512 handmade khadi paper texture tile.
 */
export function generatePaperTile(): string {
  if (cachedPaperDataUrl) return cachedPaperDataUrl;

  if (typeof document === 'undefined') {
    // In headless / SSR / test environments without HTMLCanvasElement
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="512" height="512"%3E%3Crect width="512" height="512" fill="%23F6F1E8"/%3E%3C/svg%3E';
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  // 1. Base Rice paper color (#F6F1E8)
  ctx.fillStyle = '#F6F1E8';
  ctx.fillRect(0, 0, 512, 512);

  // Pseudo-random helper with fixed seed for deterministic warm paper feel
  let s = 42;
  const pseudoRandom = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  // 2. Seamless faint warm blotches (haldi & sindoor washes at ~1.5% opacity)
  const drawBlotch = (cx: number, cy: number, r: number, color: string) => {
    const offsets = [-512, 0, 512];
    for (const ox of offsets) {
      for (const oy of offsets) {
        const x = cx + ox;
        const y = cy + oy;
        if (x + r < 0 || x - r > 512 || y + r < 0 || y - r > 512) continue;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  for (let i = 0; i < 18; i++) {
    const bx = pseudoRandom() * 512;
    const by = pseudoRandom() * 512;
    const br = 45 + pseudoRandom() * 70;
    // Faint haldi or sindoor tint wash
    const isHaldi = pseudoRandom() > 0.4;
    const blotchColor = isHaldi
      ? 'rgba(217, 155, 38, 0.018)'
      : 'rgba(166, 43, 43, 0.012)';
    drawBlotch(bx, by, br, blotchColor);
  }

  // 3. Fine organic khadi fibers (hand-pounded cotton rag paper strands)
  ctx.lineWidth = 0.6;
  for (let i = 0; i < 140; i++) {
    const fx = pseudoRandom() * 512;
    const fy = pseudoRandom() * 512;
    const len = 3 + pseudoRandom() * 8;
    const angle = pseudoRandom() * Math.PI * 2;
    const curvature = (pseudoRandom() - 0.5) * 4;

    const endX = fx + Math.cos(angle) * len;
    const endY = fy + Math.sin(angle) * len;
    const ctrlX = (fx + endX) / 2 + Math.sin(angle) * curvature;
    const ctrlY = (fy + endY) / 2 - Math.cos(angle) * curvature;

    // Faint natural ochre or indigo fiber
    const isIndigo = pseudoRandom() > 0.75;
    ctx.strokeStyle = isIndigo
      ? 'rgba(26, 54, 68, 0.022)'
      : 'rgba(130, 95, 45, 0.028)';

    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    ctx.stroke();

    // Wrap around for seamless tile
    if (fx < len || fx > 512 - len || fy < len || fy > 512 - len) {
      const wrapX = fx < len ? fx + 512 : fx - 512;
      const wrapY = fy < len ? fy + 512 : fy - 512;
      ctx.beginPath();
      ctx.moveTo(wrapX, wrapY);
      ctx.quadraticCurveTo(ctrlX + (wrapX - fx), ctrlY + (wrapY - fy), endX + (wrapX - fx), endY + (wrapY - fy));
      ctx.stroke();
    }
  }

  // Sample darkest pixel to ensure contrast verification
  try {
    const imgData = ctx.getImageData(0, 0, 512, 512).data;
    let minLum = 1.0;
    let darkestR = 246;
    let darkestG = 241;
    let darkestB = 232;

    // Step sample to keep startup instantaneous
    for (let p = 0; p < imgData.length; p += 4 * 64) {
      const r = imgData[p];
      const g = imgData[p + 1];
      const b = imgData[p + 2];
      const lum = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
      if (lum < minLum) {
        minLum = lum;
        darkestR = r;
        darkestG = g;
        darkestB = b;
      }
    }
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    cachedDarkestHex = `#${toHex(darkestR)}${toHex(darkestG)}${toHex(darkestB)}`;
  } catch {
    cachedDarkestHex = '#EFE8D9';
  }

  cachedPaperDataUrl = canvas.toDataURL('image/png');
  return cachedPaperDataUrl;
}

/**
 * Generates seamless 128x128 rice-powder and vermilion grain overlay tile.
 */
export function generateGrainTile(): string {
  if (cachedGrainDataUrl) return cachedGrainDataUrl;

  if (typeof document === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.clearRect(0, 0, 128, 128);

  let s = 101;
  const pseudoRandom = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  // Fine stippled rice powder (white) and vermilion specks
  for (let i = 0; i < 280; i++) {
    const x = Math.floor(pseudoRandom() * 128);
    const y = Math.floor(pseudoRandom() * 128);
    const isVermilion = pseudoRandom() > 0.85;

    ctx.fillStyle = isVermilion
      ? 'rgba(166, 43, 43, 0.035)'
      : 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(x, y, 1, 1);
  }

  cachedGrainDataUrl = canvas.toDataURL('image/png');
  return cachedGrainDataUrl;
}

/**
 * Returns the darkest sampled hex color from the paper texture to verify contrast.
 */
export function getDarkestTextureHex(): string {
  return cachedDarkestHex;
}

/**
 * Verifies that the procedural paper texture maintains WCAG AA contrast against indigo-ink.
 */
export function verifyTextureContrast(): {
  darkestHex: string;
  contrastRatio: number;
  passesWcagAa: boolean;
} {
  const darkestHex = getDarkestTextureHex();
  const contrastRatio = calculateContrastRatio('#1A3644', darkestHex);
  return {
    darkestHex,
    contrastRatio,
    passesWcagAa: contrastRatio >= 4.5,
  };
}

/**
 * Initializes and injects procedural texture tiles into CSS variables.
 * Runs once at application startup.
 */
export function initPaperTexture(): void {
  if (typeof document === 'undefined') return;

  const paperTile = generatePaperTile();
  const grainTile = generateGrainTile();

  const root = document.documentElement;
  if (paperTile) {
    root.style.setProperty('--bg-paper-tile', `url("${paperTile}")`);
  }
  if (grainTile) {
    root.style.setProperty('--bg-grain-tile', `url("${grainTile}")`);
  }
}
