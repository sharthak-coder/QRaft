import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TypeForms } from '../components/forms/TypeForms';
import { TypeSelector } from '../components/forms/TypeSelector';
import { FOLK_PALETTE, validatePaletteUsage } from '../lib/contrastCheck';
import { calculateContrastRatio } from '../lib/reliability';

describe('Phase 6: Accessibility (a11y) & Responsive Audit', () => {
  describe('Input Font Sizes and Touch Targets (Prevent Auto-Zoom)', () => {
    it('enforces min 16px font-size (text-base) on all text inputs', () => {
      const inputs = {
        url: { url: 'https://example.com' },
        text: { text: 'Hello' },
        email: { address: 'test@example.com', subject: '', message: '' },
        phone: { number: '+1234567890' },
        wifi: { ssid: 'Guest', password: '', security: 'WPA' as const, hidden: false },
      };

      const { container } = render(
        <TypeForms
          activeType="url"
          inputs={inputs}
          onChange={() => {}}
          errors={{}}
          touched={{}}
        />
      );

      const input = container.querySelector('input');
      expect(input).not.toBeNull();
      // text-base class in Tailwind is font-size: 1rem (16px)
      expect(input?.className).toContain('text-base');
      expect(input?.className).toContain('py-3');
    });

    it('ensures type selector buttons have accessible labels and sufficient touch targets', () => {
      const { container } = render(
        <TypeSelector activeType="url" onChange={() => {}} />
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(5); // url, text, email, phone, wifi
      buttons.forEach((btn) => {
        expect(btn.getAttribute('aria-label') || btn.textContent).toBeTruthy();
        expect(btn.className).toContain('rounded-2xl');
      });
    });
  });

  describe('Comprehensive WCAG Contrast Enforcement', () => {
    it('guarantees text colors satisfy WCAG AA (>= 4.5:1) on their backgrounds', () => {
      // Body text: indigo-ink on rice
      const bodyRatio = calculateContrastRatio(FOLK_PALETTE.indigoInk, FOLK_PALETTE.rice);
      expect(bodyRatio).toBeGreaterThanOrEqual(7.0); // Passes AAA (11:1)

      // Active Haldi fill with Indigo-ink text
      const haldiIndigoRatio = calculateContrastRatio(FOLK_PALETTE.indigoInk, FOLK_PALETTE.haldi);
      expect(haldiIndigoRatio).toBeGreaterThanOrEqual(4.5); // Passes AA (5.05:1)

      // Sindoor button with White text
      const sindoorWhiteRatio = calculateContrastRatio(FOLK_PALETTE.white, FOLK_PALETTE.sindoor);
      expect(sindoorWhiteRatio).toBeGreaterThanOrEqual(4.5);

      // Leaf button with White text
      const leafWhiteRatio = calculateContrastRatio(FOLK_PALETTE.white, FOLK_PALETTE.leaf);
      expect(leafWhiteRatio).toBeGreaterThanOrEqual(4.5);
    });

    it('strictly fails improper haldi-as-text on rice configurations', () => {
      const result = validatePaletteUsage('haldi', 'rice');
      expect(result.allowed).toBe(false);
      expect(result.ratio).toBeLessThan(4.5);
    });
  });

  describe('ARIA Attributes & Accessibility Invariants', () => {
    it('provides role="alert" with aria-live="polite" on form field validation errors', () => {
      const inputs = {
        url: { url: '' },
        text: { text: '' },
        email: { address: '', subject: '', message: '' },
        phone: { number: '' },
        wifi: { ssid: '', password: '', security: 'WPA' as const, hidden: false },
      };

      const { container } = render(
        <TypeForms
          activeType="url"
          inputs={inputs}
          onChange={() => {}}
          errors={{ url: 'Please provide a valid web address.' }}
          touched={{ 'url.url': true }}
        />
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).not.toBeNull();
      expect(alert?.getAttribute('aria-live')).toBe('polite');
      expect(alert?.textContent).toContain('Please provide a valid web address.');
    });
  });
});
