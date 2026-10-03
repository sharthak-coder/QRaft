import { calculateContrastRatio } from './reliability';

/**
 * Madhubani palette tokens
 */
export const MADHUBANI_PALETTE = {
  saffron: '#F79454',
  vermilion: '#C54845',
  peacockDeep: '#13504D',
  peacock: '#2F7A72',
  sage: '#A5B596',
  paper: '#FFFDF8',
  paper2: '#F6F0E4',
  ink: '#1C2B29',
  white: '#FFFFFF',
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
 * Enforces the accessibility rule:
 * - saffron or sage must NEVER be used as text directly on paper / paper2
 * - body text must be ink or peacockDeep
 * - white text is permitted only on vermilion, peacock, or peacockDeep
 */
export function validatePaletteUsage(fgKey: keyof typeof MADHUBANI_PALETTE, bgKey: keyof typeof MADHUBANI_PALETTE): {
  allowed: boolean;
  ratio: number;
  reason?: string;
} {
  const fg = MADHUBANI_PALETTE[fgKey];
  const bg = MADHUBANI_PALETTE[bgKey];
  const ratio = calculateContrastRatio(fg, bg);

  if ((fgKey === 'saffron' || fgKey === 'sage') && (bgKey === 'paper' || bgKey === 'paper2')) {
    return {
      allowed: false,
      ratio,
      reason: `Accessibility violation: ${fgKey} text on ${bgKey} fails WCAG AA contrast (${ratio}:1 < 4.5:1). Use ink or peacockDeep for text.`,
    };
  }

  if (fgKey === 'white' && (bgKey === 'paper' || bgKey === 'paper2' || bgKey === 'sage' || bgKey === 'saffron')) {
    return {
      allowed: false,
      ratio,
      reason: `Accessibility violation: white text on ${bgKey} does not provide adequate contrast (${ratio}:1).`,
    };
  }

  const compliant = ratio >= 4.5;
  return {
    allowed: compliant,
    ratio,
    reason: compliant ? undefined : `Contrast ratio ${ratio}:1 is below standard 4.5:1.`,
  };
}
