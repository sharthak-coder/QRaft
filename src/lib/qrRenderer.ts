import QRCode from 'qrcode';
import jsQR from 'jsqr';
import {
  QrStyle,
  ModuleShape,
  FinderShape,
  GradientType,
  MadhubaniArtStyle,
} from '../types';

/**
 * Checks if a given row/col in an N x N QR matrix falls within any of the
 * three 7x7 finder pattern squares (including standard finders at Top-Left,
 * Top-Right, and Bottom-Left).
 */
export function isFinderPattern(row: number, col: number, size: number): boolean {
  return (
    (row < 7 && col < 7) || // Top-Left
    (row < 7 && col >= size - 7) || // Top-Right
    (row >= size - 7 && col < 7) // Bottom-Left
  );
}

/**
 * Checks if a given row/col falls in the 1-module separator zone around finders.
 */
export function isFinderSeparator(row: number, col: number, size: number): boolean {
  if (isFinderPattern(row, col, size)) return false;
  return (
    (row <= 7 && col <= 7) ||
    (row <= 7 && col >= size - 8) ||
    (row >= size - 8 && col <= 7)
  );
}

/**
 * Checks if a given row/col is part of the timing patterns (row 6 or col 6).
 */
export function isTimingPattern(row: number, col: number, size: number): boolean {
  return (row === 6 || col === 6) && !isFinderPattern(row, col, size);
}

/**
 * Returns center [row, col] coordinates for all alignment patterns for a given QR version.
 */
export function getAlignmentPositions(version: number): Array<[number, number]> {
  if (version < 2) return [];
  const posCount = Math.floor(version / 7) + 2;
  const size = version * 4 + 17;
  const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
  const positions = [size - 7];
  for (let i = 1; i < posCount - 1; i++) {
    positions[i] = positions[i - 1] - intervals;
  }
  positions.push(6);
  positions.reverse();

  const coords: Array<[number, number]> = [];
  const len = positions.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === len - 1) || (i === len - 1 && j === 0)) {
        continue;
      }
      coords.push([positions[i], positions[j]]);
    }
  }
  return coords;
}

/**
 * Checks if a given row/col in an N x N QR matrix falls within any 5x5 alignment pattern.
 */
export function isAlignmentPattern(row: number, col: number, version: number): boolean {
  if (version < 2) return false;
  const positions = getAlignmentPositions(version);
  for (const [ar, ac] of positions) {
    if (Math.abs(row - ar) <= 2 && Math.abs(col - ac) <= 2) {
      return true;
    }
  }
  return false;
}

/**
 * Deterministic pseudo-random number generator for procedural paper texture.
 */
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Draws organic Indian wasli paper texture on canvas.
 */
export function drawWasliPaperTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bgColor: string
): void {
  // Base background fill
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Soft subtle organic fibers (deterministic seed so no jitter on re-renders)
  const rand = seededRandom(108);
  const fiberCount = Math.floor(width * 0.15);

  ctx.save();
  ctx.lineCap = 'round';

  for (let i = 0; i < fiberCount; i++) {
    const x = rand() * width;
    const y = rand() * height;
    const len = 4 + rand() * 12;
    const angle = rand() * Math.PI * 2;
    const alpha = 0.03 + rand() * 0.05;
    const isSaffron = rand() > 0.5;

    ctx.strokeStyle = isSaffron
      ? `rgba(247, 148, 84, ${alpha})`
      : `rgba(165, 181, 150, ${alpha})`;
    ctx.lineWidth = 0.8 + rand() * 0.6;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Soft subtle corner mineral wash
  const grad = ctx.createRadialGradient(
    width * 0.1,
    height * 0.1,
    width * 0.05,
    width * 0.5,
    height * 0.5,
    width * 0.7
  );
  grad.addColorStop(0, 'rgba(247, 148, 84, 0.03)');
  grad.addColorStop(0.6, 'rgba(165, 181, 150, 0.02)');
  grad.addColorStop(1, 'rgba(19, 80, 77, 0.02)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

/**
 * Safely polyfills or draws rounded rectangle path on Canvas context.
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radii: number | [number, number, number, number]
): void {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radii);
    return;
  }

  // Fallback manual arc-based rounded rectangle
  let rTopLeft = 0;
  let rTopRight = 0;
  let rBottomRight = 0;
  let rBottomLeft = 0;

  if (Array.isArray(radii)) {
    [rTopLeft, rTopRight, rBottomRight, rBottomLeft] = radii;
  } else {
    rTopLeft = rTopRight = rBottomRight = rBottomLeft = radii;
  }

  ctx.moveTo(x + rTopLeft, y);
  ctx.lineTo(x + w - rTopRight, y);
  if (rTopRight > 0) ctx.arcTo(x + w, y, x + w, y + rTopRight, rTopRight);
  ctx.lineTo(x + w, y + h - rBottomRight);
  if (rBottomRight > 0) ctx.arcTo(x + w, y + h, x + w - rBottomRight, y + h, rBottomRight);
  ctx.lineTo(x + rBottomLeft, y + h);
  if (rBottomLeft > 0) ctx.arcTo(x, y + h, x, y + h - rBottomLeft, rBottomLeft);
  ctx.lineTo(x, y + rTopLeft);
  if (rTopLeft > 0) ctx.arcTo(x, y, x + rTopLeft, y, rTopLeft);
}

/**
 * Creates canvas fill style (solid or linear/radial gradient).
 */
export function getCanvasFillStyle(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  style: QrStyle
): string | CanvasGradient {
  const gradType: GradientType = style.gradientType || 'none';
  if (gradType === 'none' || !style.gradientColor) {
    return style.fgColor;
  }

  if (gradType === 'linear') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, style.fgColor);
    grad.addColorStop(1, style.gradientColor);
    return grad;
  }

  if (gradType === 'radial') {
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.05,
      width / 2,
      height / 2,
      width * 0.72
    );
    grad.addColorStop(0, style.fgColor);
    grad.addColorStop(1, style.gradientColor);
    return grad;
  }

  return style.fgColor;
}

/**
 * Draws a single finder pattern (7x7 modules) at the given pixel coordinates.
 */
export function drawFinderPatternOnCanvas(
  ctx: CanvasRenderingContext2D,
  fx: number,
  fy: number,
  cellSize: number,
  shape: FinderShape,
  fillStyle: string | CanvasGradient,
  bgColor: string
): void {
  const fsize = 7 * cellSize;
  const cx = fx + fsize / 2;
  const cy = fy + fsize / 2;

  // Protect quiet zone around finder from any background image/texture
  ctx.fillStyle = bgColor;
  ctx.fillRect(fx - cellSize, fy - cellSize, fsize + cellSize * 2, fsize + cellSize * 2);

  ctx.fillStyle = fillStyle;

  if (shape === 'square') {
    // Outer 7x7 dark box
    ctx.fillRect(fx, fy, fsize, fsize);
    // Inner 5x5 light cut
    ctx.fillStyle = bgColor;
    ctx.fillRect(fx + cellSize, fy + cellSize, 5 * cellSize, 5 * cellSize);
    // Center 3x3 dark core
    ctx.fillStyle = fillStyle;
    ctx.fillRect(fx + 2 * cellSize, fy + 2 * cellSize, 3 * cellSize, 3 * cellSize);
  } else if (shape === 'rounded') {
    // Outer 7x7 rounded (safe corner radius to preserve 1:1:3:1:1 diagonal chord detection)
    ctx.beginPath();
    drawRoundRect(ctx, fx, fy, fsize, fsize, cellSize * 0.7);
    ctx.fill();

    // Inner 5x5 light cut
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    drawRoundRect(ctx, fx + cellSize, fy + cellSize, 5 * cellSize, 5 * cellSize, cellSize * 0.45);
    ctx.fill();

    // Center 3x3 dark core
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    drawRoundRect(ctx, fx + 2 * cellSize, fy + 2 * cellSize, 3 * cellSize, 3 * cellSize, cellSize * 0.3);
    ctx.fill();
  } else if (shape === 'circle-ring') {
    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5 * cellSize, 0, Math.PI * 2);
    ctx.fill();

    // Inner light circle
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5 * cellSize, 0, Math.PI * 2);
    ctx.fill();

    // Center dark core circle
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5 * cellSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Draws a single data module on canvas according to chosen ModuleShape.
 */
function drawModuleOnCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  shape: ModuleShape,
  neighbors: { top: boolean; bottom: boolean; left: boolean; right: boolean }
): void {
  if (shape === 'square') {
    ctx.fillRect(x, y, cellSize, cellSize);
    return;
  }

  if (shape === 'rounded') {
    const pad = cellSize * 0.05;
    const w = cellSize - 2 * pad;
    ctx.beginPath();
    drawRoundRect(ctx, x + pad, y + pad, w, w, cellSize * 0.28);
    ctx.fill();
    return;
  }

  if (shape === 'dot') {
    // High-radius dot maintaining sufficient area (>= 72%) for binarizer
    const cx = x + cellSize / 2;
    const cy = y + cellSize / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, cellSize * 0.48, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (shape === 'diamond') {
    const pad = cellSize * 0.04;
    const cx = x + cellSize / 2;
    const cy = y + cellSize / 2;
    ctx.beginPath();
    ctx.moveTo(cx, y + pad);
    ctx.lineTo(x + cellSize - pad, cy);
    ctx.lineTo(cx, y + cellSize - pad);
    ctx.lineTo(x + pad, cy);
    ctx.closePath();
    ctx.fill();
    return;
  }

  if (shape === 'connected') {
    const rad = cellSize * 0.35;
    const rTopLeft = !neighbors.top && !neighbors.left ? rad : 0;
    const rTopRight = !neighbors.top && !neighbors.right ? rad : 0;
    const rBottomRight = !neighbors.bottom && !neighbors.right ? rad : 0;
    const rBottomLeft = !neighbors.bottom && !neighbors.left ? rad : 0;

    ctx.beginPath();
    drawRoundRect(ctx, x, y, cellSize, cellSize, [rTopLeft, rTopRight, rBottomRight, rBottomLeft]);
    ctx.fill();
    return;
  }

  // Default fallback
  ctx.fillRect(x, y, cellSize, cellSize);
}

/**
 * Draws authentic Madhubani hand-drawn accents inside a module.
 * Uses dynamic background color at gentle opacity, preserving the module's core
 * luminance so optical camera barcode binarizers read the data accurately.
 */
function drawMadhubaniAccent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number,
  artStyle: MadhubaniArtStyle,
  bgColor: string = '#FFFDF8'
): void {
  if (artStyle === 'none') return;

  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = bgColor;
  ctx.fillStyle = bgColor;

  if (artStyle === 'katchni') {
    // Delicate traditional 45-degree diagonal hatching at safe non-destructive opacity
    ctx.lineWidth = Math.max(0.6, cellSize * 0.08);
    ctx.beginPath();
    ctx.moveTo(x + cellSize * 0.15, y + cellSize * 0.85);
    ctx.lineTo(x + cellSize * 0.85, y + cellSize * 0.15);

    ctx.moveTo(x + cellSize * 0.05, y + cellSize * 0.45);
    ctx.lineTo(x + cellSize * 0.45, y + cellSize * 0.05);

    ctx.moveTo(x + cellSize * 0.55, y + cellSize * 0.95);
    ctx.lineTo(x + cellSize * 0.95, y + cellSize * 0.55);
    ctx.stroke();
  } else if (artStyle === 'godna') {
    // 4 corner stipple dots leaving the critical 50% center sampling core solid
    const d = cellSize * 0.28;
    const r = Math.max(0.6, cellSize * 0.08);
    ctx.beginPath();
    ctx.arc(x + cellSize / 2 - d, y + cellSize / 2 - d, r, 0, Math.PI * 2);
    ctx.arc(x + cellSize / 2 + d, y + cellSize / 2 - d, r, 0, Math.PI * 2);
    ctx.arc(x + cellSize / 2 - d, y + cellSize / 2 + d, r, 0, Math.PI * 2);
    ctx.arc(x + cellSize / 2 + d, y + cellSize / 2 + d, r, 0, Math.PI * 2);
    ctx.fill();
  } else if (artStyle === 'bharni') {
    // Double outline border at safe opacity
    ctx.lineWidth = Math.max(0.6, cellSize * 0.08);
    const inset = cellSize * 0.22;
    ctx.strokeRect(x + inset, y + inset, cellSize - 2 * inset, cellSize - 2 * inset);
  }

  ctx.restore();
}

/**
 * Renders the complete stylized QR code onto an HTML Canvas element.
 * Resolves with automated jsQR scannability result.
 */
export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  payload: string,
  style: QrStyle
): Promise<{ success: boolean; decoded: boolean; decodedText?: string }> {
  if (!canvas || !payload.trim()) {
    return { success: false, decoded: false };
  }

  const qr = QRCode.create(payload, {
    errorCorrectionLevel: style.ecl,
  });

  const matrixSize = qr.modules.size;
  const version = qr.version;
  const margin = style.margin;
  const totalModules = matrixSize + margin * 2;

  canvas.width = style.size;
  canvas.height = style.size;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { success: false, decoded: false };
  }

  const cellSize = style.size / totalModules;

  // 1. Draw Background (Plain or Painted Wasli Paper Texture)
  if (style.paintedTexture) {
    drawWasliPaperTexture(ctx, style.size, style.size, style.bgColor);
  } else {
    ctx.fillStyle = style.bgColor;
    ctx.fillRect(0, 0, style.size, style.size);
  }

  // 2. Draw Background Image underlay (if specified)
  if (style.bgImage) {
    try {
      const img = new Image();
      img.src = style.bgImage;
      await new Promise<void>((resolve, reject) => {
        if (img.complete) resolve();
        img.onload = () => resolve();
        img.onerror = () => reject();
      });
      ctx.save();
      ctx.globalAlpha = Math.min(Math.max(style.bgImageOpacity || 0.25, 0.05), 0.85);
      ctx.drawImage(img, 0, 0, style.size, style.size);
      ctx.restore();
    } catch {
      // Ignore background image load error and proceed
    }
  }

  // 3. Prepare Fill Style (Solid or Gradient)
  const fillStyle = getCanvasFillStyle(ctx, style.size, style.size, style);
  ctx.fillStyle = fillStyle;

  const moduleShape: ModuleShape = style.moduleShape || 'square';
  const finderShape: FinderShape = style.finderShape || 'square';
  const artStyle: MadhubaniArtStyle = style.artStyle || 'none';

  // Helper to query module state
  const isDark = (r: number, c: number): boolean => {
    if (r < 0 || r >= matrixSize || c < 0 || c >= matrixSize) return false;
    return Boolean(qr.modules.get(r, c));
  };

  // 4. Render Data Modules & Structural Modules
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (!isDark(r, c)) continue;

      // Finder modules are drawn separately
      if (isFinderPattern(r, c, matrixSize)) continue;

      const x = (margin + c) * cellSize;
      const y = (margin + r) * cellSize;

      const isTiming = isTimingPattern(r, c, matrixSize);
      const isAlign = isAlignmentPattern(r, c, version);

      // For timing and alignment patterns, use rounded/solid shapes to guarantee optical scan line detection
      const effectiveShape: ModuleShape = (isTiming || isAlign)
        ? moduleShape === 'dot' || moduleShape === 'diamond'
          ? 'rounded'
          : moduleShape
        : moduleShape;

      const neighbors = {
        top: isDark(r - 1, c),
        bottom: isDark(r + 1, c),
        left: isDark(r, c - 1),
        right: isDark(r, c + 1),
      };

      ctx.fillStyle = fillStyle;
      drawModuleOnCanvas(ctx, x, y, cellSize, effectiveShape, neighbors);

      if (artStyle !== 'none' && !isTiming && !isAlign) {
        drawMadhubaniAccent(ctx, x, y, cellSize, artStyle, style.bgColor);
      }
    }
  }

  // 5. Render Finder Patterns
  const finderPositions = [
    { r: 0, c: 0 },
    { r: 0, c: matrixSize - 7 },
    { r: matrixSize - 7, c: 0 },
  ];

  for (const pos of finderPositions) {
    const fx = (margin + pos.c) * cellSize;
    const fy = (margin + pos.r) * cellSize;
    drawFinderPatternOnCanvas(
      ctx,
      fx,
      fy,
      cellSize,
      finderShape,
      fillStyle,
      style.bgColor
    );
  }

  // 6. Automated live jsQR verification with multi-scale fallback
  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let code = jsQR(imgData.data, imgData.width, imgData.height, {
      inversionAttempts: 'attemptBoth',
    });

    // Multi-scale fallback (mitigates 8px binarizer grid resonance on inverted palettes)
    if (!code && typeof document !== 'undefined') {
      const altSizes = [280, 360];
      for (const altSize of altSizes) {
        const offscreen = document.createElement('canvas');
        offscreen.width = altSize;
        offscreen.height = altSize;
        const offCtx = offscreen.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(canvas, 0, 0, altSize, altSize);
          const altData = offCtx.getImageData(0, 0, altSize, altSize);
          code = jsQR(altData.data, altData.width, altData.height, {
            inversionAttempts: 'attemptBoth',
          });
          if (code) break;
        }
      }
    }

    const isMatch = Boolean(code && code.data.trim() === payload.trim());
    return {
      success: true,
      decoded: isMatch,
      decodedText: code ? code.data : undefined,
    };
  } catch {
    return { success: true, decoded: false };
  }
}

/**
 * Generates an SVG vector representation that matches the stylized preview canvas.
 */
export function renderQrToSvgString(payload: string, style: QrStyle): string {
  const qr = QRCode.create(payload, {
    errorCorrectionLevel: style.ecl,
  });

  const matrixSize = qr.modules.size;
  const version = qr.version;
  const margin = style.margin;
  const totalModules = matrixSize + margin * 2;
  const cellSize = style.size / totalModules;

  const moduleShape: ModuleShape = style.moduleShape || 'square';
  const finderShape: FinderShape = style.finderShape || 'square';
  const gradType: GradientType = style.gradientType || 'none';
  const artStyle: MadhubaniArtStyle = style.artStyle || 'none';

  let defs = '';
  let fillAttr = `fill="${style.fgColor}"`;

  if (gradType === 'linear' && style.gradientColor) {
    defs += `
    <linearGradient id="qr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${style.fgColor}" />
      <stop offset="100%" stop-color="${style.gradientColor}" />
    </linearGradient>`;
    fillAttr = 'fill="url(#qr-grad)"';
  } else if (gradType === 'radial' && style.gradientColor) {
    defs += `
    <radialGradient id="qr-grad" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${style.fgColor}" />
      <stop offset="100%" stop-color="${style.gradientColor}" />
    </radialGradient>`;
    fillAttr = 'fill="url(#qr-grad)"';
  }

  const isDark = (r: number, c: number): boolean => {
    if (r < 0 || r >= matrixSize || c < 0 || c >= matrixSize) return false;
    return Boolean(qr.modules.get(r, c));
  };

  let elements = '';

  // Background
  elements += `<rect width="${style.size}" height="${style.size}" fill="${style.bgColor}" />\n`;

  // Finder Patterns
  const finderPositions = [
    { r: 0, c: 0 },
    { r: 0, c: matrixSize - 7 },
    { r: matrixSize - 7, c: 0 },
  ];

  for (const pos of finderPositions) {
    const fx = (margin + pos.c) * cellSize;
    const fy = (margin + pos.r) * cellSize;
    const fsize = 7 * cellSize;
    const cx = fx + fsize / 2;
    const cy = fy + fsize / 2;

    // Quiet backing
    elements += `<rect x="${fx - cellSize}" y="${fy - cellSize}" width="${fsize + cellSize * 2}" height="${fsize + cellSize * 2}" fill="${style.bgColor}" />\n`;

    if (finderShape === 'square') {
      elements += `<rect x="${fx}" y="${fy}" width="${fsize}" height="${fsize}" ${fillAttr} />\n`;
      elements += `<rect x="${fx + cellSize}" y="${fy + cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" fill="${style.bgColor}" />\n`;
      elements += `<rect x="${fx + 2 * cellSize}" y="${fy + 2 * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" ${fillAttr} />\n`;
    } else if (finderShape === 'rounded') {
      elements += `<rect x="${fx}" y="${fy}" width="${fsize}" height="${fsize}" rx="${cellSize * 0.7}" ${fillAttr} />\n`;
      elements += `<rect x="${fx + cellSize}" y="${fy + cellSize}" width="${5 * cellSize}" height="${5 * cellSize}" rx="${cellSize * 0.45}" fill="${style.bgColor}" />\n`;
      elements += `<rect x="${fx + 2 * cellSize}" y="${fy + 2 * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" rx="${cellSize * 0.3}" ${fillAttr} />\n`;
    } else if (finderShape === 'circle-ring') {
      elements += `<circle cx="${cx}" cy="${cy}" r="${3.5 * cellSize}" ${fillAttr} />\n`;
      elements += `<circle cx="${cx}" cy="${cy}" r="${2.5 * cellSize}" fill="${style.bgColor}" />\n`;
      elements += `<circle cx="${cx}" cy="${cy}" r="${1.5 * cellSize}" ${fillAttr} />\n`;
    }
  }

  // Data Modules
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (!isDark(r, c) || isFinderPattern(r, c, matrixSize)) continue;

      const x = (margin + c) * cellSize;
      const y = (margin + r) * cellSize;
      const isTiming = isTimingPattern(r, c, matrixSize);
      const isAlign = isAlignmentPattern(r, c, version);

      const effectiveShape: ModuleShape = (isTiming || isAlign)
        ? moduleShape === 'dot' || moduleShape === 'diamond'
          ? 'rounded'
          : moduleShape
        : moduleShape;

      if (effectiveShape === 'square') {
        elements += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" ${fillAttr} />\n`;
      } else if (effectiveShape === 'rounded') {
        const pad = cellSize * 0.05;
        const w = cellSize - 2 * pad;
        elements += `<rect x="${x + pad}" y="${y + pad}" width="${w}" height="${w}" rx="${cellSize * 0.28}" ${fillAttr} />\n`;
      } else if (effectiveShape === 'dot') {
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        elements += `<circle cx="${cx}" cy="${cy}" r="${cellSize * 0.48}" ${fillAttr} />\n`;
      } else if (effectiveShape === 'diamond') {
        const pad = cellSize * 0.04;
        const p1 = `${x + cellSize / 2},${y + pad}`;
        const p2 = `${x + cellSize - pad},${y + cellSize / 2}`;
        const p3 = `${x + cellSize / 2},${y + cellSize - pad}`;
        const p4 = `${x + pad},${y + cellSize / 2}`;
        elements += `<polygon points="${p1} ${p2} ${p3} ${p4}" ${fillAttr} />\n`;
      } else if (effectiveShape === 'connected') {
        const rad = cellSize * 0.35;
        const top = isDark(r - 1, c);
        const bottom = isDark(r + 1, c);
        const left = isDark(r, c - 1);
        const right = isDark(r, c + 1);

        const rTopLeft = !top && !left ? rad : 0;
        const rTopRight = !top && !right ? rad : 0;
        const rBottomRight = !bottom && !right ? rad : 0;
        const rBottomLeft = !bottom && !left ? rad : 0;

        elements += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${Math.max(rTopLeft, rTopRight, rBottomRight, rBottomLeft)}" ${fillAttr} />\n`;
      }

      // Safe Madhubani Art Accents in SVG
      if (artStyle !== 'none' && !isTiming && !isAlign) {
        if (artStyle === 'katchni') {
          elements += `<line x1="${x + cellSize * 0.15}" y1="${y + cellSize * 0.85}" x2="${x + cellSize * 0.85}" y2="${y + cellSize * 0.15}" stroke="${style.bgColor}" stroke-opacity="0.35" stroke-width="${Math.max(0.6, cellSize * 0.08)}" />\n`;
        } else if (artStyle === 'godna') {
          const d = cellSize * 0.28;
          const r = Math.max(0.6, cellSize * 0.08);
          elements += `<circle cx="${x + cellSize / 2 - d}" cy="${y + cellSize / 2 - d}" r="${r}" fill="${style.bgColor}" fill-opacity="0.4" />\n`;
          elements += `<circle cx="${x + cellSize / 2 + d}" cy="${y + cellSize / 2 - d}" r="${r}" fill="${style.bgColor}" fill-opacity="0.4" />\n`;
          elements += `<circle cx="${x + cellSize / 2 - d}" cy="${y + cellSize / 2 + d}" r="${r}" fill="${style.bgColor}" fill-opacity="0.4" />\n`;
          elements += `<circle cx="${x + cellSize / 2 + d}" cy="${y + cellSize / 2 + d}" r="${r}" fill="${style.bgColor}" fill-opacity="0.4" />\n`;
        } else if (artStyle === 'bharni') {
          const inset = cellSize * 0.22;
          elements += `<rect x="${x + inset}" y="${y + inset}" width="${cellSize - 2 * inset}" height="${cellSize - 2 * inset}" fill="none" stroke="${style.bgColor}" stroke-opacity="0.3" stroke-width="${Math.max(0.6, cellSize * 0.08)}" />\n`;
        }
      }
    }
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${style.size}" height="${style.size}" viewBox="0 0 ${style.size} ${style.size}">
  <defs>${defs}</defs>
  ${elements}
</svg>`;
}
