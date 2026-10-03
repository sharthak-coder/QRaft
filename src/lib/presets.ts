import { Preset } from '../types';

export const PRESETS: Preset[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless high-contrast black on white. 100% scanner compatibility.',
    badge: 'Universal',
    style: {
      size: 320,
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      ecl: 'M',
      margin: 4,
    },
  },
  {
    id: 'google',
    name: 'Google Royal',
    description: 'Refined deep royal blue on crisp white with high resilience.',
    badge: 'Signature',
    style: {
      size: 320,
      fgColor: '#1A56DB',
      bgColor: '#FFFFFF',
      ecl: 'H',
      margin: 4,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate navy on soft slate. Clean, trusted, executive look.',
    badge: 'Business',
    style: {
      size: 320,
      fgColor: '#1E3A8A',
      bgColor: '#F8FAFC',
      ecl: 'Q',
      margin: 4,
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Crisp white on deep charcoal. Sleek for dark themes.',
    badge: 'Modern',
    style: {
      size: 320,
      fgColor: '#F9FAFB',
      bgColor: '#111827',
      ecl: 'M',
      margin: 4,
    },
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Slate on light gray with a trimmed quiet zone.',
    badge: 'Compact',
    style: {
      size: 320,
      fgColor: '#334155',
      bgColor: '#F1F5F9',
      ecl: 'M',
      margin: 2,
    },
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    description: 'Vibrant electric cyan on midnight dark backdrop.',
    badge: 'Punchy',
    style: {
      size: 320,
      fgColor: '#00E5FF',
      bgColor: '#0B0F19',
      ecl: 'Q',
      margin: 4,
    },
  },
];
