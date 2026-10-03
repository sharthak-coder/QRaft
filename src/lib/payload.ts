import { QrType, QrInputsMap } from '../types';

/**
 * Escapes special characters for Wi-Fi QR strings (MECARD / ZXing format).
 * Special characters that require backslash escaping: \ ; , : "
 */
export function escapeWifiString(value: string): string {
  return value.replace(/([\\;,:"'])/g, '\\$1');
}

/**
 * Generates the standardized payload string for a given QR type and inputs.
 */
export function generatePayload<T extends QrType>(type: T, inputs: QrInputsMap[T]): string {
  switch (type) {
    case 'url': {
      const { url } = inputs as QrInputsMap['url'];
      return (url || '').trim();
    }

    case 'text': {
      const { text } = inputs as QrInputsMap['text'];
      return text || '';
    }

    case 'email': {
      const { address, subject, message } = inputs as QrInputsMap['email'];
      const cleanAddress = (address || '').trim();
      const params: string[] = [];
      if (subject) {
        params.push(`subject=${encodeURIComponent(subject)}`);
      }
      if (message) {
        params.push(`body=${encodeURIComponent(message)}`);
      }
      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      return `mailto:${cleanAddress}${queryString}`;
    }

    case 'phone': {
      const { number } = inputs as QrInputsMap['phone'];
      const cleanNumber = (number || '').replace(/\s+/g, '');
      return `tel:${cleanNumber}`;
    }

    case 'wifi': {
      const { ssid, password, security, hidden } = inputs as QrInputsMap['wifi'];
      const cleanSsid = escapeWifiString((ssid || '').trim());
      const cleanPass = security !== 'nopass' && password ? escapeWifiString(password) : '';
      const hiddenPart = hidden ? 'H:true;' : '';
      const passPart = security !== 'nopass' ? `P:${cleanPass};` : '';
      return `WIFI:T:${security};S:${cleanSsid};${passPart}${hiddenPart};`;
    }

    default:
      return '';
  }
}

/**
 * Provides a short human-readable summary of the payload for lists/cards.
 */
export function getPayloadSummary<T extends QrType>(type: T, inputs: QrInputsMap[T]): string {
  switch (type) {
    case 'url':
      return (inputs as QrInputsMap['url']).url || 'Empty URL';
    case 'text': {
      const txt = (inputs as QrInputsMap['text']).text || 'Empty text';
      return txt.length > 40 ? `${txt.slice(0, 37)}...` : txt;
    }
    case 'email':
      return (inputs as QrInputsMap['email']).address || 'Empty email';
    case 'phone':
      return (inputs as QrInputsMap['phone']).number || 'Empty phone';
    case 'wifi':
      return `Wi-Fi: ${(inputs as QrInputsMap['wifi']).ssid || 'Unknown'}`;
    default:
      return 'QR Code';
  }
}
