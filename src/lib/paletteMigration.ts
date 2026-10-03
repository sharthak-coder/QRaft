import { QrStyle } from '../types';

/**
 * Migration map for legacy hex colors into the natural folk pigment palette
 */
export const LEGACY_COLOR_MAP: Record<string, string> = {
  // Deep peacock / ink -> Indigo Ink
  '#13504D': '#1A3644',
  '#13504d': '#1A3644',
  '#1C2B29': '#1A3644',
  '#1c2b29': '#1A3644',

  // Vermilion -> Sindoor Red
  '#C54845': '#A62B2B',
  '#c54845': '#A62B2B',
  '#C84F4C': '#A62B2B',
  '#c84f4c': '#A62B2B',

  // Saffron -> Haldi Turmeric
  '#F79454': '#D99B26',
  '#f79454': '#D99B26',

  // Peacock teal / Sage -> Leaf Green
  '#2F7A72': '#2D5A3E',
  '#2f7a72': '#2D5A3E',
  '#A5B596': '#2D5A3E',
  '#a5b596': '#2D5A3E',

  // Paper / Paper-2 -> Rice Paper
  '#FFFDF8': '#F6F1E8',
  '#fffdf8': '#F6F1E8',
  '#F6F0E4': '#F6F1E8',
  '#f6f0e4': '#F6F1E8',
};

/**
 * Migrates any legacy color string to its corresponding folk palette token.
 */
export function migrateColor(hex?: string): string {
  if (!hex) return '#1A3644';
  const clean = hex.trim();
  return LEGACY_COLOR_MAP[clean] || clean;
}

/**
 * Upgrades a legacy QrStyle object to ensure it conforms to the current version.
 */
export function migrateQrStyle(rawStyle: any): QrStyle {
  if (!rawStyle || typeof rawStyle !== 'object') {
    return {
      size: 320,
      fgColor: '#1A3644',
      bgColor: '#F6F1E8',
      ecl: 'H',
      margin: 4,
      moduleShape: 'square',
      finderShape: 'square',
      gradientType: 'none',
      artStyle: 'none',
      paintedTexture: false,
    };
  }

  return {
    size: typeof rawStyle.size === 'number' ? rawStyle.size : 320,
    fgColor: migrateColor(rawStyle.fgColor || '#1A3644'),
    bgColor: migrateColor(rawStyle.bgColor || '#F6F1E8'),
    ecl: ['L', 'M', 'Q', 'H'].includes(rawStyle.ecl) ? rawStyle.ecl : 'H',
    margin: typeof rawStyle.margin === 'number' ? rawStyle.margin : 4,
    moduleShape: rawStyle.moduleShape || 'square',
    finderShape: rawStyle.finderShape || 'square',
    gradientType: rawStyle.gradientType || 'none',
    gradientColor: rawStyle.gradientColor ? migrateColor(rawStyle.gradientColor) : undefined,
    artStyle: rawStyle.artStyle || 'none',
    paintedTexture: Boolean(rawStyle.paintedTexture),
    bgImage: rawStyle.bgImage || null,
    bgImageOpacity: typeof rawStyle.bgImageOpacity === 'number' ? rawStyle.bgImageOpacity : 0.25,
  };
}
