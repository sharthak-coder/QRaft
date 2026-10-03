import { describe, it, expect } from 'vitest';
import {
  encodeTemplateToShareLink,
  decodeShareLink,
  toBase64Url,
  fromBase64Url,
} from '../lib/shareLink';
import { Template } from '../types';

describe('Cross-Device Share Link Engine (shareLink.ts)', () => {
  const sampleTemplate: Template = {
    id: 'test-tmpl-1',
    name: 'Madhubani Peacock Design',
    type: 'url',
    inputs: { url: 'https://gdg.community.dev/srm-ist' },
    style: {
      size: 360,
      fgColor: '#13504D',
      bgColor: '#FFFDF8',
      ecl: 'H',
      margin: 4,
      moduleShape: 'connected',
      finderShape: 'rounded',
      gradientType: 'linear',
      gradientColor: '#2F7A72',
      artStyle: 'katchni',
      paintedTexture: true,
    },
    tags: ['madhubani', 'peacock'],
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
    authorName: 'Aanya',
  };

  it('performs base64url encoding and decoding safely with unicode characters', () => {
    const text = 'Hello, QRaft! — Designed for GDG SRM IST 🚀';
    const encoded = toBase64Url(text);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');

    const decoded = fromBase64Url(encoded);
    expect(decoded).toBe(text);
  });

  it('correctly encodes a Template and decodes it back in v2 format with designer properties', () => {
    const shareLink = encodeTemplateToShareLink(sampleTemplate);
    expect(shareLink).toContain('#/app?share=');

    const encodedPart = shareLink.split('share=')[1];
    const decoded = decodeShareLink(encodedPart);

    expect(decoded).not.toBeNull();
    expect(decoded?.v).toBe(2);
    expect(decoded?.name).toBe('Madhubani Peacock Design');
    expect(decoded?.type).toBe('url');
    expect(decoded?.inputs.url).toBe('https://gdg.community.dev/srm-ist');
    expect(decoded?.style.fgColor).toBe('#13504D');
    expect(decoded?.style.ecl).toBe('H');
    expect(decoded?.style.moduleShape).toBe('connected');
    expect(decoded?.style.finderShape).toBe('rounded');
    expect(decoded?.style.gradientType).toBe('linear');
    expect(decoded?.style.gradientColor).toBe('#2F7A72');
    expect(decoded?.style.artStyle).toBe('katchni');
    expect(decoded?.style.paintedTexture).toBe(true);
    expect(decoded?.authorName).toBe('Aanya');
    expect(decoded?.tags).toContain('madhubani');
  });

  it('gracefully decodes legacy v1 payloads and sets safe designer defaults', () => {
    const legacyV1 = {
      v: 1,
      name: 'Legacy V1 Card',
      type: 'url',
      inputs: { url: 'https://example.com' },
      style: {
        size: 320,
        fgColor: '#1A56DB',
        bgColor: '#FFFFFF',
        ecl: 'M',
        margin: 4,
      },
      authorName: 'Rohan',
    };

    const encoded = toBase64Url(JSON.stringify(legacyV1));
    const decoded = decodeShareLink(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded?.v).toBe(1);
    expect(decoded?.name).toBe('Legacy V1 Card');
    expect(decoded?.style.moduleShape).toBe('square');
    expect(decoded?.style.finderShape).toBe('square');
    expect(decoded?.style.gradientType).toBe('none');
    expect(decoded?.style.artStyle).toBe('none');
    expect(decoded?.style.paintedTexture).toBe(false);
  });

  it('rejects tampered or malformed encoded strings gracefully', () => {
    expect(decodeShareLink('')).toBeNull();
    expect(decodeShareLink('not-valid-base64-@@@')).toBeNull();
    expect(decodeShareLink('eyJhIjoxfQ')).toBeNull(); // { a: 1 } missing version & required fields
  });

  it('rejects payloads with invalid QR types or unsupported version', () => {
    const invalidTypeJson = JSON.stringify({
      v: 2,
      name: 'Hack',
      type: 'malicious_executable_type',
      style: { size: 300, fgColor: '#000', bgColor: '#fff', ecl: 'M', margin: 4 },
    });
    expect(decodeShareLink(toBase64Url(invalidTypeJson))).toBeNull();

    const futureVersionJson = JSON.stringify({
      v: 99,
      name: 'Future Version',
      type: 'url',
      style: { size: 300, fgColor: '#000', bgColor: '#fff', ecl: 'M', margin: 4 },
    });
    expect(decodeShareLink(toBase64Url(futureVersionJson))).toBeNull();
  });

  it('sanitizes potential HTML/XSS injection attempts in template names and author fields', () => {
    const xssJson = JSON.stringify({
      v: 2,
      name: '<script>alert("xss")</script>Safe Name',
      type: 'text',
      inputs: { text: 'Hello' },
      style: { size: 300, fgColor: '#000', bgColor: '#fff', ecl: 'M', margin: 4 },
      authorName: '<img src=x onerror=alert(1)>Hacker',
    });

    const decoded = decodeShareLink(toBase64Url(xssJson));
    expect(decoded).not.toBeNull();
    expect(decoded?.name).not.toContain('<script>');
    expect(decoded?.authorName).not.toContain('<img');
  });
});
