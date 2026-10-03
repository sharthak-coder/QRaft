import { describe, it, expect } from 'vitest';
import {
  calculateContrastRatio,
  getRelativeLuminance,
  evaluateReliability,
} from '../lib/reliability';

describe('Scan Reliability Engine (reliability.ts)', () => {
  describe('WCAG Luminance & Contrast Calculation', () => {
    it('calculates expected contrast ratio for pure black on pure white (21:1)', () => {
      const contrast = calculateContrastRatio('#000000', '#FFFFFF');
      expect(contrast).toBe(21);
      expect(getRelativeLuminance('#FFFFFF')).toBeCloseTo(1, 2);
      expect(getRelativeLuminance('#000000')).toBeCloseTo(0, 2);
    });

    it('calculates symmetric contrast ratio regardless of order', () => {
      const contrast1 = calculateContrastRatio('#1A56DB', '#FFFFFF');
      const contrast2 = calculateContrastRatio('#FFFFFF', '#1A56DB');
      expect(contrast1).toBe(contrast2);
    });

    it('detects low contrast for similar colors', () => {
      // Gray on slightly lighter gray
      const lowContrast = calculateContrastRatio('#888888', '#999999');
      expect(lowContrast).toBeLessThan(2.0);
    });
  });

  describe('Scan-Safety Evaluation Rules', () => {
    it('rates standard black on white as good with no warnings or errors', () => {
      const report = evaluateReliability(
        { size: 320, fgColor: '#000000', bgColor: '#FFFFFF', ecl: 'M', margin: 4 },
        'https://gdg.community.dev'
      );

      expect(report.score).toBe('good');
      expect(report.canDownload).toBe(true);
      expect(report.errors.length).toBe(0);
      expect(report.warnings.length).toBe(0);
    });

    it('blocks download and flags hard error when contrast is below 2:1', () => {
      const report = evaluateReliability(
        { size: 320, fgColor: '#A0A0A0', bgColor: '#B0B0B0', ecl: 'M', margin: 4 },
        'https://gdg.community.dev'
      );

      expect(report.score).toBe('risky');
      expect(report.canDownload).toBe(false);
      expect(report.errors.some((e) => e.includes('Contrast ratio is extremely low'))).toBe(true);
    });

    it('issues warning for inverted color schemes (light on dark)', () => {
      const report = evaluateReliability(
        { size: 320, fgColor: '#FFFFFF', bgColor: '#111827', ecl: 'M', margin: 4 },
        'https://gdg.community.dev'
      );

      expect(report.isInverted).toBe(true);
      expect(report.warnings.some((w) => w.includes('Inverted color scheme'))).toBe(true);
    });

    it('issues warning for small sizes (<160px)', () => {
      const report = evaluateReliability(
        { size: 128, fgColor: '#000000', bgColor: '#FFFFFF', ecl: 'M', margin: 4 },
        'https://gdg.community.dev'
      );

      expect(report.isSmall).toBe(true);
      expect(report.warnings.some((w) => w.includes('Export size is 128px'))).toBe(true);
    });

    it('issues warning for low margin (<2 modules)', () => {
      const report = evaluateReliability(
        { size: 320, fgColor: '#000000', bgColor: '#FFFFFF', ecl: 'M', margin: 1 },
        'https://gdg.community.dev'
      );

      expect(report.isLowMargin).toBe(true);
      expect(report.warnings.some((w) => w.includes('Quiet zone margin'))).toBe(true);
    });

    it('issues warning for high data density with high error correction', () => {
      const longPayload = 'https://example.com/very/long/path/with/lots/of/parameters/and/tokens/that/increase/module/count/substantially/to/test/dense/qr/matrix/capacity/safeguards';
      const report = evaluateReliability(
        { size: 320, fgColor: '#000000', bgColor: '#FFFFFF', ecl: 'H', margin: 4 },
        longPayload
      );

      expect(report.isDense).toBe(true);
      expect(report.warnings.some((w) => w.includes('High data payload with heavy error correction'))).toBe(true);
    });

    it('verifies Madhubani peacock-deep and ink achieve high WCAG contrast on paper', () => {
      const inkOnPaper = calculateContrastRatio('#1C2B29', '#FFFDF8');
      const peacockDeepOnPaper = calculateContrastRatio('#13504D', '#FFFDF8');

      // Both must exceed 7:1 (WCAG AAA)
      expect(inkOnPaper).toBeGreaterThan(10);
      expect(peacockDeepOnPaper).toBeGreaterThan(8);
    });

    it('confirms saffron and sage must never be used as normal text on paper', () => {
      const saffronOnPaper = calculateContrastRatio('#F79454', '#FFFDF8');
      const sageOnPaper = calculateContrastRatio('#A5B596', '#FFFDF8');

      // Both fail 4.5:1 AA for normal text
      expect(saffronOnPaper).toBeLessThan(4.5);
      expect(sageOnPaper).toBeLessThan(4.5);
    });

    it('confirms white text passes AA contrast on vermilion and peacock-deep', () => {
      const whiteOnVermilion = calculateContrastRatio('#FFFFFF', '#C54845');
      const whiteOnPeacockDeep = calculateContrastRatio('#FFFFFF', '#13504D');

      expect(whiteOnVermilion).toBeGreaterThan(4.5);
      expect(whiteOnPeacockDeep).toBeGreaterThan(8.0);
    });
  });
});
