import { describe, it, expect } from 'vitest';
import { FOLK_PALETTE, validatePaletteUsage, isWcagAaCompliant } from '../lib/contrastCheck';
import { calculateContrastRatio } from '../lib/reliability';
import { verifyTextureContrast } from '../lib/paperTexture';

describe('Folk Art Palette & WCAG AA Contrast', () => {
  it('enforces body text is indigo-ink on rice (> 4.5:1, achieves AAA ~11:1)', () => {
    const ratio = calculateContrastRatio(FOLK_PALETTE.indigoInk, FOLK_PALETTE.rice);
    expect(ratio).toBeGreaterThanOrEqual(7.0); // Passes AAA
    const validation = validatePaletteUsage('indigoInk', 'rice');
    expect(validation.allowed).toBe(true);
    expect(isWcagAaCompliant(FOLK_PALETTE.indigoInk, FOLK_PALETTE.rice)).toBe(true);
  });

  it('strictly forbids haldi as text on rice (~2.17:1 fails AA)', () => {
    const ratio = calculateContrastRatio(FOLK_PALETTE.haldi, FOLK_PALETTE.rice);
    expect(ratio).toBeLessThan(4.5);
    const validation = validatePaletteUsage('haldi', 'rice');
    expect(validation.allowed).toBe(false);
    expect(validation.reason).toContain('fails WCAG AA contrast');
    expect(isWcagAaCompliant(FOLK_PALETTE.haldi, FOLK_PALETTE.rice)).toBe(false);
  });

  it('guarantees text on haldi fill is indigo-ink (>= 4.5:1 passes AA ~5.05:1)', () => {
    const ratio = calculateContrastRatio(FOLK_PALETTE.indigoInk, FOLK_PALETTE.haldi);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    const validation = validatePaletteUsage('indigoInk', 'haldi');
    expect(validation.allowed).toBe(true);
  });

  it('allows white/rice text on sindoor, leaf, and indigo-ink (all pass AAA/AA)', () => {
    const sindoorWhite = calculateContrastRatio('#FFFFFF', FOLK_PALETTE.sindoor);
    const leafWhite = calculateContrastRatio('#FFFFFF', FOLK_PALETTE.leaf);
    const indigoWhite = calculateContrastRatio('#FFFFFF', FOLK_PALETTE.indigoInk);

    expect(sindoorWhite).toBeGreaterThanOrEqual(4.5);
    expect(leafWhite).toBeGreaterThanOrEqual(4.5);
    expect(indigoWhite).toBeGreaterThanOrEqual(7.0);

    const sindoorRice = calculateContrastRatio(FOLK_PALETTE.rice, FOLK_PALETTE.sindoor);
    const leafRice = calculateContrastRatio(FOLK_PALETTE.rice, FOLK_PALETTE.leaf);
    const indigoRice = calculateContrastRatio(FOLK_PALETTE.rice, FOLK_PALETTE.indigoInk);

    expect(sindoorRice).toBeGreaterThanOrEqual(4.5);
    expect(leafRice).toBeGreaterThanOrEqual(4.5);
    expect(indigoRice).toBeGreaterThanOrEqual(7.0);
  });

  it('verifies procedural paper texture darkest pixel maintains WCAG AA contrast with indigo-ink', () => {
    const textureCheck = verifyTextureContrast();
    expect(textureCheck.passesWcagAa).toBe(true);
    expect(textureCheck.contrastRatio).toBeGreaterThanOrEqual(4.5);
  });
});
