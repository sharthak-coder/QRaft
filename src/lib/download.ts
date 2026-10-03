import { QrType, QrStyle } from '../types';
import { renderQrToSvgString } from './qrRenderer';

/**
 * Generates standardized filename formatted as qraft-<type>-<timestamp>.<ext>
 */
export function getExportFilename(type: QrType, extension: string): string {
  const timestamp = Date.now();
  return `qraft-${type}-${timestamp}.${extension}`;
}

/**
 * Downloads the exact preview canvas as a PNG file.
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, type: QrType): void {
  const filename = getExportFilename(type, 'png');
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates and downloads an SVG vector file of the QR code matching designer styles.
 */
export async function downloadAsSvg(
  payload: string,
  style: QrStyle,
  type: QrType
): Promise<void> {
  const filename = getExportFilename(type, 'svg');
  const svgString = renderQrToSvgString(payload, style);

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies the canvas PNG image directly to system clipboard.
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<{ success: boolean; message: string }> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      return { success: false, message: 'Clipboard image API is not supported in this browser.' };
    }

    return await new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve({ success: false, message: 'Could not create image blob from canvas.' });
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          resolve({ success: true, message: 'QR Code image copied to clipboard!' });
        } catch (err: any) {
          resolve({ success: false, message: err.message || 'Clipboard write permission denied.' });
        }
      }, 'image/png');
    });
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to copy image to clipboard.' };
  }
}
