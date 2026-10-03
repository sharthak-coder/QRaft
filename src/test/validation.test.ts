import { describe, it, expect } from 'vitest';
import {
  validateInputs,
  isValidHttpUrl,
  isValidEmail,
  isValidPhone,
} from '../lib/validation';

describe('Validation Engine (validation.ts)', () => {
  describe('Helper Validators', () => {
    it('validates HTTP/HTTPS URLs strictly', () => {
      expect(isValidHttpUrl('https://gdg.community.dev')).toBe(true);
      expect(isValidHttpUrl('http://localhost:3000')).toBe(true);
      expect(isValidHttpUrl('ftp://example.com')).toBe(false);
      expect(isValidHttpUrl('not-a-valid-url')).toBe(false);
      expect(isValidHttpUrl('javascript:alert(1)')).toBe(false);
    });

    it('validates RFC-compliant email formats', () => {
      expect(isValidEmail('developer@srmist.edu.in')).toBe(true);
      expect(isValidEmail('test.name+alias@domain.co')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
    });

    it('validates phone numbers (7 to 15 digits with optional leading +)', () => {
      expect(isValidPhone('+919876543210')).toBe(true);
      expect(isValidPhone('9876543210')).toBe(true);
      expect(isValidPhone('+14155552671')).toBe(true);
      expect(isValidPhone('12345')).toBe(false); // too short (<7)
      expect(isValidPhone('12345678901234567890')).toBe(false); // too long (>15)
      expect(isValidPhone('+91ABC1234567')).toBe(false); // letters not allowed
    });
  });

  describe('Type-Specific Input Validation', () => {
    it('validates URL inputs and reports empty or non-http error', () => {
      const empty = validateInputs('url', { url: '' });
      expect(empty.isValid).toBe(false);
      expect(empty.errors.url).toBeDefined();

      const nonHttp = validateInputs('url', { url: 'ftp://files.example.com' });
      expect(nonHttp.isValid).toBe(false);
      expect(nonHttp.errors.url).toContain('http:// or https://');

      const valid = validateInputs('url', { url: 'https://qraft.design' });
      expect(valid.isValid).toBe(true);
      expect(Object.keys(valid.errors).length).toBe(0);
    });

    it('validates Text inputs and capacity limit', () => {
      const empty = validateInputs('text', { text: '   ' });
      expect(empty.isValid).toBe(false);
      expect(empty.errors.text).toBeDefined();

      const valid = validateInputs('text', { text: 'Valid short note' }, 'M');
      expect(valid.isValid).toBe(true);

      const hugeText = 'a'.repeat(3000);
      const invalidCapacity = validateInputs('text', { text: hugeText }, 'H');
      expect(invalidCapacity.isValid).toBe(false);
      expect(invalidCapacity.errors.text).toContain('maximum capacity');
    });

    it('validates Email inputs', () => {
      const invalid = validateInputs('email', {
        address: 'notanemail',
        subject: '',
        message: '',
      });
      expect(invalid.isValid).toBe(false);
      expect(invalid.errors.address).toBeDefined();

      const valid = validateInputs('email', {
        address: 'leads@gdgsrm.org',
        subject: 'Hello',
        message: 'World',
      });
      expect(valid.isValid).toBe(true);
    });

    it('validates Phone inputs', () => {
      const invalid = validateInputs('phone', { number: '123' });
      expect(invalid.isValid).toBe(false);
      expect(invalid.errors.number).toBeDefined();

      const valid = validateInputs('phone', { number: '+919940000000' });
      expect(valid.isValid).toBe(true);
    });

    it('validates Wi-Fi network inputs and WPA password constraints', () => {
      const missingSsid = validateInputs('wifi', {
        ssid: '',
        password: 'password123',
        security: 'WPA',
        hidden: false,
      });
      expect(missingSsid.isValid).toBe(false);
      expect(missingSsid.errors.ssid).toBeDefined();

      const shortWpaPass = validateInputs('wifi', {
        ssid: 'Campus-Net',
        password: '123', // < 8 characters
        security: 'WPA',
        hidden: false,
      });
      expect(shortWpaPass.isValid).toBe(false);
      expect(shortWpaPass.errors.password).toContain('between 8 and 63');

      const validWpa = validateInputs('wifi', {
        ssid: 'Campus-Net',
        password: 'ValidPass1234',
        security: 'WPA',
        hidden: false,
      });
      expect(validWpa.isValid).toBe(true);

      const validOpen = validateInputs('wifi', {
        ssid: 'Open-Library-Net',
        password: '',
        security: 'nopass',
        hidden: false,
      });
      expect(validOpen.isValid).toBe(true);
    });
  });
});
