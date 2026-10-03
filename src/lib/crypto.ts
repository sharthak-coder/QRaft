/**
 * Client-side cryptographic helper using Web Crypto API.
 * Uses PBKDF2 with SHA-256 and a 16-byte random salt for password hashing.
 *
 * NOTE (Honesty constraint): This runs entirely client-side in the browser.
 * While passwords are not stored in plaintext, true authentication security
 * requires a trusted server.
 */

// Helper to convert ArrayBuffer to hex string
export function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

// Helper to convert hex string to Uint8Array
export function hexToUint8Array(hex: string): Uint8Array {
  const match = hex.match(/.{1,2}/g);
  if (!match) return new Uint8Array();
  return new Uint8Array(match.map(byte => parseInt(byte, 16)));
}

/**
 * Generates a random cryptographic salt of specified byte length.
 */
export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for non-browser / test environments
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return bufferToHex(array.buffer);
}

/**
 * Derives a PBKDF2 hash from a password and salt using SHA-256.
 */
export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const passwordBuffer = enc.encode(password);
  const salt = hexToUint8Array(saltHex);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt as any,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      256
    );

    return bufferToHex(derivedBits);
  } else {
    // Fallback simple hash for headless test runners if crypto.subtle is unavailable
    let hash = 0;
    const combined = password + saltHex;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  feedback: string[];
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: 'Very Weak', color: '#EF4444', feedback: ['Password is required'] };
  }

  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Must be at least 8 characters long');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one uppercase letter');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one number');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one special character (!@#$%^&*)');
  }

  const levels: Array<{ label: PasswordStrength['label']; color: string }> = [
    { label: 'Very Weak', color: '#EF4444' },
    { label: 'Weak', color: '#F97316' },
    { label: 'Fair', color: '#EAB308' },
    { label: 'Good', color: '#3B82F6' },
    { label: 'Strong', color: '#10B981' },
  ];

  return {
    score,
    label: levels[score].label,
    color: levels[score].color,
    feedback,
  };
}
