import { QrStyle, ReliabilityReport, ReliabilityScore } from '../types';

/**
 * Parses a hex color string (#RGB or #RRGGBB) to [R, G, B] in [0, 255].
 */
export function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) {
    return [0, 0, 0];
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Calculates WCAG relative luminance for an sRGB component.
 */
function srgbToLinear(c: number): number {
  const norm = c / 255;
  return norm <= 0.03928 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

/**
 * Computes relative luminance of a hex color.
 */
export function getRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/**
 * Calculates WCAG contrast ratio between two hex colors.
 * Returns a value between 1 and 21.
 */
export function calculateContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Evaluates scan reliability based on colors, sizing, margins, and payload density.
 */
export function evaluateReliability(
  style: QrStyle,
  payload: string
): ReliabilityReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const fgLum = getRelativeLuminance(style.fgColor);
  const bgLum = getRelativeLuminance(style.bgColor);
  const contrastRatio = calculateContrastRatio(style.fgColor, style.bgColor);

  const isInverted = fgLum > bgLum;
  const isSmall = style.size < 160;
  const isLowMargin = style.margin < 2;
  const isDense = payload.length > 120 && (style.ecl === 'Q' || style.ecl === 'H');

  // Contrast checks
  if (contrastRatio < 2.0) {
    errors.push(`Contrast ratio is extremely low (${contrastRatio}:1). Most scanners will fail to read this.`);
  } else if (contrastRatio < 4.0) {
    warnings.push(`Contrast ratio is low (${contrastRatio}:1). Minimum recommended contrast is 4:1 for reliable scanning.`);
  }

  // Inverted color check
  if (isInverted) {
    warnings.push('Inverted color scheme (light modules on dark background). Some older cameras and apps fail to scan inverted codes.');
  }

  // Size check
  if (isSmall) {
    warnings.push(`Export size is ${style.size}px. Sizes under 160px may be blurry or difficult to scan on physical screens/prints.`);
  }

  // Margin check
  if (isLowMargin) {
    warnings.push(`Quiet zone margin is ${style.margin} module(s). A quiet zone of at least 2-4 modules is recommended to avoid edge interference.`);
  }

  // Density check
  if (isDense) {
    warnings.push('High data payload with heavy error correction creates tiny modules. If scan speed is slow, consider using ECL "M" or a shorter URL.');
  }

  // Score determination
  let score: ReliabilityScore = 'good';
  if (errors.length > 0 || warnings.length >= 2 || contrastRatio < 2.5) {
    score = errors.length > 0 ? 'risky' : 'caution';
  } else if (warnings.length > 0) {
    score = 'caution';
  }

  return {
    score,
    contrastRatio,
    warnings,
    errors,
    canDownload: errors.length === 0,
    isInverted,
    isSmall,
    isLowMargin,
    isDense,
  };
}
