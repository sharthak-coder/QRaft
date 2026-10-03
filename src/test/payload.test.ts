import { describe, it, expect } from 'vitest';
import { generatePayload, escapeWifiString, getPayloadSummary } from '../lib/payload';

describe('Payload Generator & Escaping (payload.ts)', () => {
  it('generates standard HTTP/HTTPS URL payloads correctly', () => {
    const urlPayload = generatePayload('url', { url: 'https://gdg.community.dev/srm-ist' });
    expect(urlPayload).toBe('https://gdg.community.dev/srm-ist');

    const trimmedPayload = generatePayload('url', { url: '   http://example.com/test   ' });
    expect(trimmedPayload).toBe('http://example.com/test');
  });

  it('generates raw text payloads without mutation', () => {
    const textPayload = generatePayload('text', { text: 'Hello, World! 123 @#$' });
    expect(textPayload).toBe('Hello, World! 123 @#$');
  });

  it('generates mailto payloads with encoded query parameters', () => {
    const emailPayload = generatePayload('email', {
      address: 'leads@gdgsrm.org',
      subject: 'Interview Request & Review',
      message: 'Hello! Let\'s connect.',
    });

    expect(emailPayload).toContain('mailto:leads@gdgsrm.org');
    expect(emailPayload).toContain('subject=Interview%20Request%20%26%20Review');
    expect(emailPayload).toContain('body=Hello!%20Let\'s%20connect.');
  });

  it('generates tel payloads stripping whitespace', () => {
    const phonePayload = generatePayload('phone', { number: '+91 98765 43210' });
    expect(phonePayload).toBe('tel:+919876543210');
  });

  it('escapes special characters in Wi-Fi SSID and password according to ZXing/MECARD specifications', () => {
    expect(escapeWifiString('MyNetwork;Name,With:Colons"And\\Backslash')).toBe(
      'MyNetwork\\;Name\\,With\\:Colons\\"And\\\\Backslash'
    );

    const wifiPayload = generatePayload('wifi', {
      ssid: 'SRM;Guest:WiFi',
      password: 'Pass"Word,123\\',
      security: 'WPA',
      hidden: true,
    });

    expect(wifiPayload).toBe(
      'WIFI:T:WPA;S:SRM\\;Guest\\:WiFi;P:Pass\\"Word\\,123\\\\;H:true;;'
    );
  });

  it('handles open Wi-Fi networks without password parameter', () => {
    const openWifi = generatePayload('wifi', {
      ssid: 'Public-Open-WiFi',
      password: '',
      security: 'nopass',
      hidden: false,
    });

    expect(openWifi).toBe('WIFI:T:nopass;S:Public-Open-WiFi;;');
  });

  it('produces informative payload summaries', () => {
    expect(getPayloadSummary('url', { url: 'https://example.com' })).toBe('https://example.com');
    expect(getPayloadSummary('phone', { number: '+1234567890' })).toBe('+1234567890');
    expect(getPayloadSummary('wifi', { ssid: 'Campus-WiFi', password: '', security: 'nopass', hidden: false })).toBe('Wi-Fi: Campus-WiFi');
  });
});
