import { calculateContrastRatio } from './reliability';

/**
 * Natural Folk Pigment Palette Tokens (Madhubani / Mithila)
 * Exactly 5 pure pigments + pure white for high contrast accents.
 */
export const FOLK_PALETTE = {
  indigoInk: '#1A3644', // text, QR foreground default, headings, dark surfaces, outlines
  haldi: '#D99B26',     // accents, highlights, glows, active-state fills
  sindoor: '#A62B2B',   // primary action color, key motifs, errors
  leaf: '#2D5A3E',      // success, secondary actions, nature motifs
  rice: '#F6F1E8',      // page and card base
  ricePanel: '#EFE8D9', // derived tint (rice with small indigo mix)
  white: '#FFFFFF',     // crisp contrast accents
} as const;

/**
 * Backward-compatible alias for existing code
 */
export const MADHUBANI_PALETTE = {
  ...FOLK_PALETTE,
  saffron: FOLK_PALETTE.haldi,
  vermilion: FOLK_PALETTE.sindoor,
  peacockDeep: FOLK_PALETTE.indigoInk,
  peacock: FOLK_PALETTE.leaf,
  sage: FOLK_PALETTE.leaf,
  paper: FOLK_PALETTE.rice,
  paper2: FOLK_PALETTE.ricePanel,
  ink: FOLK_PALETTE.indigoInk,
} as const;

/**
 * Checks whether a foreground/background pair meets WCAG AA standards.
 * Normal text requires >= 4.5:1, large/bold text requires >= 3.0:1.
 */
export function isWcagAaCompliant(
  fgHex: string,
  bgHex: string,
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(fgHex, bgHex);
  return ratio >= (isLargeText ? 3.0 : 4.5);
}

/**
 * Enforces the folk contrast rules:
 * - Body text is indigo-ink on rice (11.0:1, AAA)
 * - haldi is NEVER used as text on rice (~2.17:1, fails). haldi is for fills, borders, and glows.
 * - Text on a haldi fill must be indigo-ink (5.05:1, AA)
 * - White or rice text is allowed on indigo-ink, sindoor, and leaf (>= 6.6:1, AAA)
 */
export function validatePaletteUsage(
  fgKey: keyof typeof MADHUBANI_PALETTE,
  bgKey: keyof typeof MADHUBANI_PALETTE,
  isLargeText: boolean = false
): {
  allowed: boolean;
  ratio: number;
  reason?: string;
} {
  const fg = MADHUBANI_PALETTE[fgKey];
  const bg = MADHUBANI_PALETTE[bgKey];
  const ratio = calculateContrastRatio(fg, bg);

  // Strict Rule 1: Haldi / saffron text must NEVER be placed on rice / paper
  if ((fgKey === 'haldi' || fgKey === 'saffron') && (bgKey === 'rice' || bgKey === 'ricePanel' || bgKey === 'paper' || bgKey === 'paper2')) {
    return {
      allowed: false,
      ratio,
      reason: `Accessibility violation: haldi (${fg}) text on rice (${bg}) fails WCAG AA contrast (${ratio}:1 < 4.5:1). haldi is for fills and borders; use indigo-ink for text.`,
    };
  }

  // Strict Rule 2: White text on light backgrounds
  if (fgKey === 'white' && (bgKey === 'rice' || bgKey === 'ricePanel' || bgKey === 'paper' || bgKey === 'paper2' || bgKey === 'haldi' || bgKey === 'saffron')) {
    return {
      allowed: false,
      ratio,
      reason: `Accessibility violation: white text on ${bgKey} (${bg}) does not provide adequate contrast (${ratio}:1).`,
    };
  }

  // Strict Rule 3: Text on haldi fill must be indigo-ink
  if ((bgKey === 'haldi' || bgKey === 'saffron') && (fgKey !== 'indigoInk' && fgKey !== 'ink' && fgKey !== 'peacockDeep')) {
    return {
      allowed: false,
      ratio,
      reason: `Contrast violation: text on haldi fill must be indigo-ink (got ${fgKey} with ratio ${ratio}:1).`,
    };
  }

  const threshold = isLargeText ? 3.0 : 4.5;
  const compliant = ratio >= threshold;
  return {
    allowed: compliant,
    ratio,
    reason: compliant ? undefined : `Contrast ratio ${ratio}:1 is below standard ${threshold}:1.`,
  };
}
