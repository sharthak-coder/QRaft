import jsQR from 'jsqr';
import { ScanVerificationResult } from '../types';

/**
 * Reads image data directly from an HTML canvas and decodes it using jsQR.
 * Compares the decoded text against the expected payload to confirm scannability.
 */
export function verifyCanvasScan(
  canvas: HTMLCanvasElement,
  expectedPayload: string
): ScanVerificationResult {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      checked: true,
      success: false,
      match: false,
      message: 'Failed to access 2D rendering context for scan verification.',
    };
  }

  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    // Multi-scale fallback (mitigates 8px binarizer grid resonance on inverted palettes)
    if (!code && typeof document !== 'undefined') {
      const altSizes = [280, 360];
      for (const altSize of altSizes) {
        const offscreen = document.createElement('canvas');
        offscreen.width = altSize;
        offscreen.height = altSize;
        const offCtx = offscreen.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(canvas, 0, 0, altSize, altSize);
          const altData = offCtx.getImageData(0, 0, altSize, altSize);
          code = jsQR(altData.data, altData.width, altData.height, {
            inversionAttempts: 'attemptBoth',
          });
          if (code) break;
        }
      }
    }

    if (!code) {
      return {
        checked: true,
        success: false,
        match: false,
        message: 'Could not be decoded in camera test. Contrast, quiet zone, or module shape may need adjustment.',
      };
    }

    const decoded = code.data;
    const isMatch = decoded.trim() === expectedPayload.trim();

    return {
      checked: true,
      success: true,
      decodedText: decoded,
      match: isMatch,
      message: isMatch
        ? 'Verified! The QR code scanned perfectly and accurately matches the input data.'
        : `Scanned successfully, but payload differs: expected "${expectedPayload.slice(0, 30)}...", got "${decoded.slice(0, 30)}..."`,
    };
  } catch (err: any) {
    return {
      checked: true,
      success: false,
      match: false,
      message: `Scanner error: ${err.message || 'Unknown verification error'}`,
    };
  }
}
