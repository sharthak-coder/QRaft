import { QrType, QrInputsMap, ErrorCorrectionLevel } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Approximate max alphanumeric/byte capacities for standard QR codes by ECL
// Version 40 maximums are around: L: 2953, M: 2331, Q: 1663, H: 1273 bytes
export const MAX_CAPACITY_BY_ECL: Record<ErrorCorrectionLevel, number> = {
  L: 2800,
  M: 2200,
  Q: 1550,
  H: 1200,
};

export function isValidHttpUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  // RFC 5322 compliant practical regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // 7-15 digits, optional leading +
  const clean = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(clean);
}

/**
 * Validates inputs for a given QR type.
 */
export function validateInputs<T extends QrType>(
  type: T,
  inputs: QrInputsMap[T],
  ecl: ErrorCorrectionLevel = 'M'
): ValidationResult {
  const errors: Record<string, string> = {};

  switch (type) {
    case 'url': {
      const { url } = inputs as QrInputsMap['url'];
      if (!url || !url.trim()) {
        errors.url = 'URL is required.';
      } else {
        const trimmed = url.trim();
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
          errors.url = 'URL must start with http:// or https://';
        } else if (!isValidHttpUrl(trimmed)) {
          errors.url = 'Please enter a valid web address (e.g., https://example.com).';
        } else if (trimmed.length > 2000) {
          errors.url = 'URL is too long (maximum 2000 characters).';
        }
      }
      break;
    }

    case 'text': {
      const { text } = inputs as QrInputsMap['text'];
      if (!text || !text.trim()) {
        errors.text = 'Text content cannot be empty.';
      } else if (text.length > MAX_CAPACITY_BY_ECL[ecl]) {
        errors.text = `Text exceeds maximum capacity for error correction level ${ecl} (${MAX_CAPACITY_BY_ECL[ecl]} chars).`;
      }
      break;
    }

    case 'email': {
      const { address, subject, message } = inputs as QrInputsMap['email'];
      if (!address || !address.trim()) {
        errors.address = 'Recipient email address is required.';
      } else if (!isValidEmail(address.trim())) {
        errors.address = 'Please enter a valid email address (e.g. name@domain.com).';
      }
      if (subject && subject.length > 200) {
        errors.subject = 'Subject is too long (maximum 200 characters).';
      }
      if (message && message.length > 1500) {
        errors.message = 'Message body is too long (maximum 1500 characters).';
      }
      break;
    }

    case 'phone': {
      const { number } = inputs as QrInputsMap['phone'];
      if (!number || !number.trim()) {
        errors.number = 'Phone number is required.';
      } else if (!isValidPhone(number.trim())) {
        errors.number = 'Phone number must contain 7 to 15 digits (e.g., +919876543210).';
      }
      break;
    }

    case 'wifi': {
      const { ssid, password, security } = inputs as QrInputsMap['wifi'];
      if (!ssid || !ssid.trim()) {
        errors.ssid = 'Network name (SSID) is required.';
      } else if (ssid.length > 32) {
        errors.ssid = 'SSID cannot exceed 32 characters.';
      }

      if (security !== 'nopass') {
        if (!password) {
          errors.password = 'Password is required for secured networks.';
        } else if (security === 'WPA') {
          if (password.length < 8 || password.length > 63) {
            errors.password = 'WPA/WPA2 password must be between 8 and 63 characters.';
          }
        } else if (security === 'WEP') {
          if (password.length < 5) {
            errors.password = 'WEP key is typically at least 5 characters.';
          }
        }
      }
      break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
