import { describe, it, expect } from 'vitest';
import {
  isFinderPattern,
  isTimingPattern,
  isFinderSeparator,
  isAlignmentPattern,
  getAlignmentPositions,
  renderQrToCanvas,
  renderQrToSvgString,
} from '../lib/qrRenderer';
import { QrStyle } from '../types';

describe('Designer QR Renderer Engine (qrRenderer.ts)', () => {
  const baseStyle: QrStyle = {
    size: 320,
    fgColor: '#13504D',
    bgColor: '#FFFDF8',
    ecl: 'H',
    margin: 4,
    moduleShape: 'square',
    finderShape: 'square',
    gradientType: 'none',
    artStyle: 'none',
    paintedTexture: false,
  };

  const payload = 'https://gdg.community.dev/srm-ist';

  describe('Geometric Finder and Timing Pattern Recognition', () => {
    const size = 25; // standard QR version 2

    it('accurately identifies 7x7 corner finder zones', () => {
      // Top-Left Finder
      expect(isFinderPattern(0, 0, size)).toBe(true);
      expect(isFinderPattern(6, 6, size)).toBe(true);

      // Top-Right Finder
      expect(isFinderPattern(0, size - 1, size)).toBe(true);
      expect(isFinderPattern(6, size - 7, size)).toBe(true);

      // Bottom-Left Finder
      expect(isFinderPattern(size - 1, 0, size)).toBe(true);
      expect(isFinderPattern(size - 7, 6, size)).toBe(true);

      // Center data module must NOT be finder
      expect(isFinderPattern(12, 12, size)).toBe(false);
      expect(isFinderPattern(10, 10, size)).toBe(false);
    });

    it('identifies finder quiet separators', () => {
      // Separator adjacent to Top-Left finder
      expect(isFinderSeparator(7, 0, size)).toBe(true);
      expect(isFinderSeparator(0, 7, size)).toBe(true);
      expect(isFinderSeparator(7, 7, size)).toBe(true);

      // Inside finder itself is not separator
      expect(isFinderSeparator(3, 3, size)).toBe(false);
      // Far center data is not separator
      expect(isFinderSeparator(15, 15, size)).toBe(false);
    });

    it('identifies timing pattern tracks at row 6 and col 6', () => {
      // Timing tracks outside finder patterns
      expect(isTimingPattern(6, 8, size)).toBe(true);
      expect(isTimingPattern(8, 6, size)).toBe(true);
      expect(isTimingPattern(6, 12, size)).toBe(true);

      // Inside finder pattern is finder, not timing
      expect(isTimingPattern(6, 3, size)).toBe(false);
      expect(isTimingPattern(3, 6, size)).toBe(false);

      // General data cells
      expect(isTimingPattern(10, 10, size)).toBe(false);
    });

    it('identifies QR code alignment pattern locations and modules', () => {
      // Version 1 has no alignment patterns
      expect(getAlignmentPositions(1)).toEqual([]);

      // Version 4 has alignment pattern at [26, 26]
      const v4Positions = getAlignmentPositions(4);
      expect(v4Positions).toEqual([[26, 26]]);
      expect(isAlignmentPattern(26, 26, 4)).toBe(true);
      expect(isAlignmentPattern(24, 24, 4)).toBe(true);
      expect(isAlignmentPattern(28, 28, 4)).toBe(true);
      // Outside 5x5 zone
      expect(isAlignmentPattern(23, 26, 4)).toBe(false);
      expect(isAlignmentPattern(10, 10, 4)).toBe(false);
    });
  });

  describe('Vector SVG Generation matching Designer Styles', () => {
    it('generates standard vector SVG with crisp rectangular paths', () => {
      const svg = renderQrToSvgString(payload, baseStyle);
      expect(svg).toContain('<svg');
      expect(svg).toContain('viewBox="0 0 320 320"');
      expect(svg).toContain('fill="#FFFDF8"');
      expect(svg).toContain('fill="#13504D"');
    });

    it('embeds linear gradient definitions when gradient flow is enabled', () => {
      const gradientStyle: QrStyle = {
        ...baseStyle,
        gradientType: 'linear',
        gradientColor: '#2F7A72',
      };
      const svg = renderQrToSvgString(payload, gradientStyle);
      expect(svg).toContain('<linearGradient id="qr-grad"');
      expect(svg).toContain('<stop offset="0%" stop-color="#13504D"');
      expect(svg).toContain('<stop offset="100%" stop-color="#2F7A72"');
      expect(svg).toContain('fill="url(#qr-grad)"');
    });

    it('embeds radial gradient definitions when radial flow is enabled', () => {
      const radialStyle: QrStyle = {
        ...baseStyle,
        gradientType: 'radial',
        gradientColor: '#F79454',
      };
      const svg = renderQrToSvgString(payload, radialStyle);
      expect(svg).toContain('<radialGradient id="qr-grad"');
      expect(svg).toContain('fill="url(#qr-grad)"');
    });

    it('generates circular concentric rings for circle-ring finder style', () => {
      const ringStyle: QrStyle = {
        ...baseStyle,
        finderShape: 'circle-ring',
      };
      const svg = renderQrToSvgString(payload, ringStyle);
      expect(svg).toContain('<circle cx=');
    });

    it('generates authentic Madhubani katchni hatching lines in SVG export', () => {
      const katchniStyle: QrStyle = {
        ...baseStyle,
        artStyle: 'katchni',
      };
      const svg = renderQrToSvgString(payload, katchniStyle);
      expect(svg).toContain('<line x1=');
      expect(svg).toContain('stroke="#FFFDF8"');
    });

    it('generates Godna stippling dots in SVG export', () => {
      const godnaStyle: QrStyle = {
        ...baseStyle,
        artStyle: 'godna',
      };
      const svg = renderQrToSvgString(payload, godnaStyle);
      expect(svg).toContain('<circle cx=');
      expect(svg).toContain('fill="#FFFDF8"');
    });
  });

  describe('Canvas Rendering & Automated Scan Verification', () => {
    it('returns empty result gracefully if canvas or payload is missing', async () => {
      const res = await renderQrToCanvas(null as any, '', baseStyle);
      expect(res.success).toBe(false);
      expect(res.decoded).toBe(false);
    });

    it('renders on HTMLCanvasElement in DOM environment', async () => {
      const canvas = document.createElement('canvas');
      const res = await renderQrToCanvas(canvas, payload, baseStyle);
      expect(canvas.width).toBe(320);
      expect(canvas.height).toBe(320);
      expect(res.success).toBe(true);
    });

    it('supports connected module flow and paper texture rendering', async () => {
      const canvas = document.createElement('canvas');
      const texturedStyle: QrStyle = {
        ...baseStyle,
        moduleShape: 'connected',
        finderShape: 'rounded',
        paintedTexture: true,
      };
      const res = await renderQrToCanvas(canvas, payload, texturedStyle);
      expect(res.success).toBe(true);
    });
  });
});
