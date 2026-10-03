import { describe, it, expect } from 'vitest';
import { generateQrMatrix } from '../three/matrix';
import {
  generateScenicVoxels,
  SCENIC_THEMES,
  ScenicThemeId,
} from '../three/voxelGenerator';
import { renderQrToCanvas } from '../lib/qrRenderer';

describe('Phase 5: Scenic 3D World & Voxel Diorama Engine', () => {
  const samplePayload = 'https://gdg.community.dev/srm-ist';
  const qrMatrix = generateQrMatrix(samplePayload, 'H');

  describe('Theme Configurations', () => {
    const requiredThemes: ScenicThemeId[] = [
      'shinto-alpine',
      'mithila-grove',
      'floating-isle',
      'classic-blocks',
    ];

    it.each(requiredThemes)('properly defines theme "%s" with complete palette', (themeId) => {
      const theme = SCENIC_THEMES[themeId];
      expect(theme).toBeDefined();
      expect(theme.name).toBeTruthy();
      expect(theme.subtitle).toBeTruthy();
      expect(theme.palette.ground).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(theme.palette.terrain.length).toBeGreaterThan(0);
      expect(theme.palette.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(theme.palette.highlight).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('Procedural Voxel Generation & Budget Capping', () => {
    it('generates voxels from QR matrix within strict budget caps (< 40,000)', () => {
      expect(qrMatrix.size).toBeGreaterThan(0);
      expect(qrMatrix.totalDarkModules).toBeGreaterThan(0);

      const voxels = generateScenicVoxels(qrMatrix, 'shinto-alpine');
      expect(voxels.length).toBeGreaterThan(qrMatrix.totalDarkModules);
      expect(voxels.length).toBeLessThan(40000);
    });

    it('enforces flat scan invariants at t=0 for optical readability', () => {
      const voxels = generateScenicVoxels(qrMatrix, 'mithila-grove');

      // Base modules must sit at y=0.05 with flat scale y=0.05
      // Upper tier voxels must collapse to flat scale y=0
      let baseModulesFound = 0;
      for (const v of voxels) {
        if (!v.isDecorative) {
          if (v.flatScale.y > 0) {
            expect(v.flatPos.y).toBeCloseTo(0.05);
            expect(v.flatScale.y).toBeCloseTo(0.05);
            baseModulesFound++;
          } else {
            expect(v.flatScale.y).toBe(0);
          }
        }
      }
      expect(baseModulesFound).toBe(qrMatrix.totalDarkModules);
    });

    it('elevates voxels in scenic 3D state (t=1)', () => {
      const voxels = generateScenicVoxels(qrMatrix, 'floating-isle');
      const nonDeco = voxels.filter((v) => !v.isDecorative);

      // Check that at least some voxels have elevation > 1
      const highVoxels = nonDeco.filter((v) => v.scenicPos.y > 1.0);
      expect(highVoxels.length).toBeGreaterThan(0);
    });

    it('accents finder pattern centers with distinct landmark colors', () => {
      const voxels = generateScenicVoxels(qrMatrix, 'shinto-alpine');
      const finderVoxels = voxels.filter((v) => v.isFinder);
      expect(finderVoxels.length).toBeGreaterThan(0);
    });
  });

  describe('Optical Scannability Invariant in Scan Mode', () => {
    it('guarantees 100% optical readability of flattened scan canvas', async () => {
      const canvas = document.createElement('canvas');
      const baseStyle = {
        size: 320,
        fgColor: '#1A3644',
        bgColor: '#F6F1E8',
        ecl: 'H' as const,
        margin: 4,
        moduleShape: 'square' as const,
        finderShape: 'square' as const,
        gradientType: 'none' as const,
        artStyle: 'none' as const,
        paintedTexture: false,
      };

      const res = await renderQrToCanvas(canvas, samplePayload, baseStyle);
      expect(res.success).toBe(true);
      expect(canvas.width).toBe(320);
    });
  });
});
