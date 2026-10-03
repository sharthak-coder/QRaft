import QRCode from 'qrcode';
import { ErrorCorrectionLevel } from '../types';

export interface QrMatrix {
  size: number; // width/height in modules
  modules: boolean[][]; // [row][col], true if dark module
  totalDarkModules: number;
}

/**
 * Computes the 2D boolean module matrix from a payload using the standard QRCode library.
 */
export function generateQrMatrix(
  payload: string,
  ecl: ErrorCorrectionLevel = 'M'
): QrMatrix {
  if (!payload || !payload.trim()) {
    return { size: 0, modules: [], totalDarkModules: 0 };
  }

  try {
    const qr = QRCode.create(payload, {
      errorCorrectionLevel: ecl,
    });

    const size = qr.modules.size;
    const modules: boolean[][] = [];
    let totalDarkModules = 0;

    for (let r = 0; r < size; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < size; c++) {
        // In QRCode.create, qr.modules.get(row, col) returns 1 (dark) or 0 (light)
        const isDark = Boolean(qr.modules.get(r, c));
        row.push(isDark);
        if (isDark) totalDarkModules++;
      }
      modules.push(row);
    }

    return {
      size,
      modules,
      totalDarkModules,
    };
  } catch (err) {
    console.error('Failed to generate QR module matrix:', err);
    return { size: 0, modules: [], totalDarkModules: 0 };
  }
}
