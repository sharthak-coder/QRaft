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
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    if (!code) {
      return {
        checked: true,
        success: false,
        match: false,
        message: 'No QR code could be detected by the scanning engine. Contrast or quiet zone may be insufficient.',
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
