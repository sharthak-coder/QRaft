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
    name: 'Hackathon Badge Design',
    type: 'url',
    inputs: { url: 'https://gdg.community.dev/srm-ist' },
    style: {
      size: 360,
      fgColor: '#1A56DB',
      bgColor: '#FFFFFF',
      ecl: 'H',
      margin: 4,
    },
    tags: ['hackathon', 'badge'],
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

  it('correctly encodes a Template and decodes it back', () => {
    const shareLink = encodeTemplateToShareLink(sampleTemplate);
    expect(shareLink).toContain('#/app?share=');

    const encodedPart = shareLink.split('share=')[1];
    const decoded = decodeShareLink(encodedPart);

    expect(decoded).not.toBeNull();
    expect(decoded?.name).toBe('Hackathon Badge Design');
    expect(decoded?.type).toBe('url');
    expect(decoded?.inputs.url).toBe('https://gdg.community.dev/srm-ist');
    expect(decoded?.style.fgColor).toBe('#1A56DB');
    expect(decoded?.style.ecl).toBe('H');
    expect(decoded?.authorName).toBe('Aanya');
    expect(decoded?.tags).toContain('hackathon');
  });

  it('rejects tampered or malformed encoded strings gracefully', () => {
    expect(decodeShareLink('')).toBeNull();
    expect(decodeShareLink('not-valid-base64-@@@')).toBeNull();
    expect(decodeShareLink('eyJhIjoxfQ')).toBeNull(); // { a: 1 } missing version & required fields
  });

  it('rejects payloads with invalid QR types or unsupported version', () => {
    const invalidTypeJson = JSON.stringify({
      v: 1,
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
      v: 1,
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
