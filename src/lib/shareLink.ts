import {
  Template,
  QrType,
  ModuleShape,
  FinderShape,
  GradientType,
  MadhubaniArtStyle,
} from '../types';
import { migrateColor } from './paletteMigration';

export interface SharedTemplatePayload {
  v: number;
  name: string;
  type: QrType;
  inputs: any;
  style: {
    size: number;
    fgColor: string;
    bgColor: string;
    ecl: 'L' | 'M' | 'Q' | 'H';
    margin: number;
    moduleShape?: ModuleShape;
    finderShape?: FinderShape;
    gradientType?: GradientType;
    gradientColor?: string;
    artStyle?: MadhubaniArtStyle;
    paintedTexture?: boolean;
  };
  threeSettings?: any;
  tags?: string[];
  authorName?: string;
}

// Convert UTF-8 string to base64url safely
export function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Convert base64url to UTF-8 string safely
export function fromBase64Url(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

const VALID_MODULE_SHAPES: ModuleShape[] = ['square', 'rounded', 'dot', 'diamond', 'connected'];
const VALID_FINDER_SHAPES: FinderShape[] = ['square', 'rounded', 'circle-ring'];
const VALID_GRADIENT_TYPES: GradientType[] = ['none', 'linear', 'radial'];
const VALID_ART_STYLES: MadhubaniArtStyle[] = ['none', 'katchni', 'godna', 'bharni'];

/**
 * Encodes a template into a compact base64url string suitable for URL hash (v2 format).
 */
export function encodeTemplateToShareLink(template: Template): string {
  const minified: SharedTemplatePayload = {
    v: 2,
    name: template.name.slice(0, 60),
    type: template.type,
    inputs: template.inputs,
    style: {
      size: template.style.size,
      fgColor: template.style.fgColor,
      bgColor: template.style.bgColor,
      ecl: template.style.ecl,
      margin: template.style.margin,
      moduleShape: template.style.moduleShape || 'square',
      finderShape: template.style.finderShape || 'square',
      gradientType: template.style.gradientType || 'none',
      gradientColor: template.style.gradientColor,
      artStyle: template.style.artStyle || 'none',
      paintedTexture: Boolean(template.style.paintedTexture),
    },
    threeSettings: template.threeSettings,
    tags: (template.tags || []).slice(0, 5).map(t => t.slice(0, 20)),
    authorName: (template.authorName || 'Anonymous').slice(0, 40),
  };

  const json = JSON.stringify(minified);
  const encoded = toBase64Url(json);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#/app?share=${encoded}`;
}

/**
 * Decodes and rigorously validates a shared template payload (supports v1 and v2).
 * Returns null if invalid or tampered.
 */
export function decodeShareLink(encoded: string): SharedTemplatePayload | null {
  try {
    if (!encoded || encoded.length > 8000) {
      // Reject unreasonably large payloads
      return null;
    }

    const json = fromBase64Url(encoded);
    const parsed = JSON.parse(json);

    // Structure validation: accept v1 (legacy), v2 (designer), and v3 (scenic folk)
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.v !== 1 && parsed.v !== 2 && parsed.v !== 3) return null;

    const validTypes: QrType[] = ['url', 'text', 'email', 'phone', 'wifi'];
    if (!validTypes.includes(parsed.type)) return null;

    if (typeof parsed.name !== 'string' || !parsed.name.trim()) return null;
    if (!parsed.style || typeof parsed.style !== 'object') return null;

    const validEcl = ['L', 'M', 'Q', 'H'];
    if (!validEcl.includes(parsed.style.ecl)) return null;

    // Validate designer style fields (v2/v3) or default them (v1)
    const rawModuleShape = parsed.style.moduleShape;
    const moduleShape: ModuleShape = VALID_MODULE_SHAPES.includes(rawModuleShape)
      ? rawModuleShape
      : 'square';

    const rawFinderShape = parsed.style.finderShape;
    const finderShape: FinderShape = VALID_FINDER_SHAPES.includes(rawFinderShape)
      ? rawFinderShape
      : 'square';

    const rawGrad = parsed.style.gradientType;
    const gradientType: GradientType = VALID_GRADIENT_TYPES.includes(rawGrad)
      ? rawGrad
      : 'none';

    const rawArt = parsed.style.artStyle;
    const artStyle: MadhubaniArtStyle = VALID_ART_STYLES.includes(rawArt)
      ? rawArt
      : 'none';

    const rawGradColor = parsed.style.gradientColor
      ? String(parsed.style.gradientColor).slice(0, 9)
      : undefined;
    const gradientColor = rawGradColor ? migrateColor(rawGradColor) : undefined;

    // Sanitize and migrate values to current folk palette
    const sanitized: SharedTemplatePayload = {
      v: parsed.v,
      name: parsed.name.slice(0, 60).replace(/[<>]/g, ''),
      type: parsed.type,
      inputs: parsed.inputs && typeof parsed.inputs === 'object' ? parsed.inputs : {},
      style: {
        size: Math.min(Math.max(Number(parsed.style.size) || 300, 128), 1024),
        fgColor: migrateColor(String(parsed.style.fgColor || '#1A3644').slice(0, 9)),
        bgColor: migrateColor(String(parsed.style.bgColor || '#F6F1E8').slice(0, 9)),
        ecl: parsed.style.ecl,
        margin: Math.min(Math.max(Number(parsed.style.margin) || 4, 0), 8),
        moduleShape,
        finderShape,
        gradientType,
        gradientColor,
        artStyle,
        paintedTexture: Boolean(parsed.style.paintedTexture),
      },
      threeSettings: parsed.threeSettings,
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.map((t: unknown) => String(t).slice(0, 20).replace(/[<>]/g, '')).slice(0, 5)
        : [],
      authorName: parsed.authorName ? String(parsed.authorName).slice(0, 40).replace(/[<>]/g, '') : 'Anonymous',
    };

    return sanitized;
  } catch {
    return null;
  }
}
