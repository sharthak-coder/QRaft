import { describe, it, expect, beforeEach } from 'vitest';
import { migrateColor, migrateQrStyle, LEGACY_COLOR_MAP } from '../lib/paletteMigration';
import { TemplateStore, TEMPLATES_KEY_V1, TEMPLATES_KEY_V2 } from '../services/templates';
import { RecentStore, RECENT_KEY_V1, RECENT_KEY_V2 } from '../services/recent';
import { decodeShareLink, toBase64Url } from '../lib/shareLink';
import { PRESETS, getPresetById } from '../lib/presets';
import { calculateContrastRatio } from '../lib/reliability';

describe('Phase 3: Palette Migration Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('migrateColor and LEGACY_COLOR_MAP', () => {
    it('maps legacy peacock blue (#13504D) to indigo-ink (#1A3644)', () => {
      expect(migrateColor('#13504D')).toBe('#1A3644');
      expect(migrateColor('#13504d')).toBe('#1A3644');
    });

    it('maps legacy vermilion (#C54845, #C84F4C) to sindoor (#A62B2B)', () => {
      expect(migrateColor('#C54845')).toBe('#A62B2B');
      expect(migrateColor('#C84F4C')).toBe('#A62B2B');
    });

    it('maps legacy saffron (#F79454) to haldi (#D99B26)', () => {
      expect(migrateColor('#F79454')).toBe('#D99B26');
    });

    it('maps legacy sage/teal (#2F7A72, #A5B596) to leaf green (#2D5A3E)', () => {
      expect(migrateColor('#2F7A72')).toBe('#2D5A3E');
      expect(migrateColor('#A5B596')).toBe('#2D5A3E');
    });

    it('maps legacy paper (#FFFDF8, #F6F0E4) to rice paper (#F6F1E8)', () => {
      expect(migrateColor('#FFFDF8')).toBe('#F6F1E8');
      expect(migrateColor('#F6F0E4')).toBe('#F6F1E8');
      expect(LEGACY_COLOR_MAP['#FFFDF8']).toBe('#F6F1E8');
    });

    it('preserves unknown custom colors without alteration', () => {
      expect(migrateColor('#123456')).toBe('#123456');
      expect(migrateColor('#EFEFEF')).toBe('#EFEFEF');
    });

    it('handles falsy or empty inputs with safe default fallback', () => {
      expect(migrateColor('')).toBe('#1A3644');
      expect(migrateColor(undefined)).toBe('#1A3644');
    });
  });

  describe('migrateQrStyle', () => {
    it('returns valid default style when input is null or non-object', () => {
      const fallback = migrateQrStyle(null);
      expect(fallback.fgColor).toBe('#1A3644');
      expect(fallback.bgColor).toBe('#F6F1E8');
      expect(fallback.ecl).toBe('H');
      expect(fallback.moduleShape).toBe('square');
    });

    it('upgrades legacy style properties to folk pigment tokens', () => {
      const legacyStyle = {
        size: 400,
        fgColor: '#13504D',
        bgColor: '#FFFDF8',
        gradientColor: '#2F7A72',
        gradientType: 'linear',
        ecl: 'Q',
      };

      const migrated = migrateQrStyle(legacyStyle);
      expect(migrated.fgColor).toBe('#1A3644');
      expect(migrated.bgColor).toBe('#F6F1E8');
      expect(migrated.gradientColor).toBe('#2D5A3E');
      expect(migrated.size).toBe(400);
      expect(migrated.ecl).toBe('Q');
    });
  });

  describe('TemplateStore automatic v1 to v2 migration', () => {
    it('reads legacy v1 localStorage data, upgrades colors, and saves to v2 store', () => {
      const legacyTemplates = [
        {
          id: 'legacy-card-1',
          name: 'Old Exhibition Pass',
          type: 'url',
          inputs: { url: 'https://exhibition.org' },
          style: {
            size: 320,
            fgColor: '#13504D',
            bgColor: '#FFFDF8',
            ecl: 'H',
            margin: 4,
          },
          authorName: 'Rohan',
          tags: ['vintage'],
          createdAt: 1690000000000,
          updatedAt: 1690000000000,
        },
      ];

      localStorage.setItem(TEMPLATES_KEY_V1, JSON.stringify(legacyTemplates));
      expect(localStorage.getItem(TEMPLATES_KEY_V2)).toBeNull();

      const templates = TemplateStore.getAll();
      expect(templates.length).toBe(1);
      expect(templates[0].name).toBe('Old Exhibition Pass');
      expect(templates[0].style.fgColor).toBe('#1A3644');
      expect(templates[0].style.bgColor).toBe('#F6F1E8');

      // Check that v2 store was populated
      const savedV2 = JSON.parse(localStorage.getItem(TEMPLATES_KEY_V2) || '[]');
      expect(savedV2.length).toBe(1);
      expect(savedV2[0].style.fgColor).toBe('#1A3644');
      expect(savedV2[0].style.bgColor).toBe('#F6F1E8');
    });
  });

  describe('RecentStore automatic v1 to v2 migration', () => {
    it('reads legacy v1 recent store and upgrades colors to folk tokens', () => {
      const legacyRecent = [
        {
          id: 'rec-1',
          type: 'text',
          inputs: { text: 'Legacy note' },
          payload: 'Legacy note',
          summary: 'Legacy note',
          createdAt: 1690000000000,
          style: {
            size: 300,
            fgColor: '#C54845',
            bgColor: '#FFFDF8',
            ecl: 'M',
            margin: 4,
          },
        },
      ];

      localStorage.setItem(RECENT_KEY_V1, JSON.stringify(legacyRecent));
      expect(localStorage.getItem(RECENT_KEY_V2)).toBeNull();

      const items = RecentStore.getAll();
      expect(items.length).toBe(1);
      expect(items[0].style.fgColor).toBe('#A62B2B');
      expect(items[0].style.bgColor).toBe('#F6F1E8');

      // Confirms v2 store was persisted
      const savedV2 = JSON.parse(localStorage.getItem(RECENT_KEY_V2) || '[]');
      expect(savedV2.length).toBe(1);
      expect(savedV2[0].style.fgColor).toBe('#A62B2B');
    });
  });

  describe('decodeShareLink backward compatibility', () => {
    it('migrates legacy colors embedded in share link payloads', () => {
      const legacyPayload = {
        v: 1,
        name: 'Shared Heritage Card',
        type: 'url',
        inputs: { url: 'https://gdg.community.dev' },
        style: {
          size: 320,
          fgColor: '#13504D', // legacy peacock
          bgColor: '#FFFDF8', // legacy paper
          gradientColor: '#2F7A72', // legacy sage
          gradientType: 'linear',
          ecl: 'H',
          margin: 4,
        },
        authorName: 'Sunita',
      };

      const encoded = toBase64Url(JSON.stringify(legacyPayload));
      const decoded = decodeShareLink(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded?.style.fgColor).toBe('#1A3644');
      expect(decoded?.style.bgColor).toBe('#F6F1E8');
      expect(decoded?.style.gradientColor).toBe('#2D5A3E');
    });
  });

  describe('getPresetById legacy alias resolver', () => {
    it('resolves legacy preset IDs to new folk pigment presets', () => {
      expect(getPresetById('peacock')?.id).toBe('indigo');
      expect(getPresetById('saffron-sun')?.id).toBe('haldi-glow');
      expect(getPresetById('lotus-pond')?.id).toBe('grove');
      expect(getPresetById('terracotta')?.id).toBe('sindoor');
      expect(getPresetById('godna-stipple')?.id).toBe('godna');
    });

    it('directly matches current preset IDs', () => {
      expect(getPresetById('indigo')?.id).toBe('indigo');
      expect(getPresetById('sindoor')?.id).toBe('sindoor');
      expect(getPresetById('dark')?.id).toBe('dark');
    });

    it('returns undefined for non-existent preset IDs', () => {
      expect(getPresetById('unknown-random-id')).toBeUndefined();
    });
  });

  describe('WCAG AA Contrast Compliance across all Presets', () => {
    it('guarantees every preset in PRESETS satisfies at least 4.5:1 contrast', () => {
      for (const preset of PRESETS) {
        const ratio = calculateContrastRatio(preset.style.fgColor, preset.style.bgColor);
        expect(
          ratio,
          `Preset "${preset.name}" (${preset.id}) contrast ratio (${ratio.toFixed(2)}:1) failed WCAG AA 4.5:1 requirement.`
        ).toBeGreaterThanOrEqual(4.5);
      }
    });
  });
});
