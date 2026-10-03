import React, { useEffect, useRef, useState, useCallback } from 'react';
import QRCode from 'qrcode';

interface RangoliQrAnimatorProps {
  payload: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  accentColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  onComplete?: () => void;
  loop?: boolean;
  className?: string;
}

interface ModuleItem {
  r: number;
  c: number;
  dist: number;
  isFinder: boolean;
}

export const RangoliQrAnimator: React.FC<RangoliQrAnimatorProps> = ({
  payload,
  size = 220,
  fgColor = '#13504D',
  bgColor = '#FFFDF8',
  accentColor = '#C54845',
  errorCorrectionLevel = 'M',
  onComplete,
  loop = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSettled, setIsSettled] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  // Helper to detect if coordinate belongs to one of the 3 finder patterns
  const isFinderPattern = useCallback((r: number, c: number, matrixSize: number) => {
    // Top-Left (0..6, 0..6)
    if (r < 7 && c < 7) return true;
    // Top-Right (0..6, matrixSize-7..matrixSize-1)
    if (r < 7 && c >= matrixSize - 7) return true;
    // Bottom-Left (matrixSize-7..matrixSize-1, 0..6)
    if (r >= matrixSize - 7 && c < 7) return true;
    return false;
  }, []);

  const runRangoliAssembly = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !payload.trim()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate QR matrix
    const qr = QRCode.create(payload, { errorCorrectionLevel });
    const matrix = qr.modules;
    const matrixSize = matrix.size;
    const center = (matrixSize - 1) / 2;

    const modulePixelSize = size / (matrixSize + 4); // 2-module margin
    const marginOffset = modulePixelSize * 2;

    // Collect all dark modules with radial distance from center
    const darkModules: ModuleItem[] = [];
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        if (matrix.get(r, c)) {
          const dx = c - center;
          const dy = r - center;
          const dist = Math.sqrt(dx * dx + dy * dy);
          darkModules.push({
            r,
            c,
            dist,
            isFinder: isFinderPattern(r, c, matrixSize),
          });
        }
      }
    }

    // Sort radially outward from center
    darkModules.sort((a, b) => a.dist - b.dist);

    const totalModules = darkModules.length;
    const maxDist = darkModules[totalModules - 1]?.dist || 1;
    const durationMs = 1400; // 1.4s smooth rangoli flow
    const startTime = performance.now();

    setIsSettled(false);

    const renderFrame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease-out cubic curve for natural rangoli flower petal unfolding
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRadius = eased * maxDist;

      // Clear canvas with paper tone
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      // Draw faint concentric rangoli guide circles during animation
      if (progress < 1) {
        ctx.strokeStyle = 'rgba(19, 80, 77, 0.08)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, (currentRadius + 1) * modulePixelSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw active modules
      for (let i = 0; i < totalModules; i++) {
        const item = darkModules[i];
        if (item.dist <= currentRadius || progress >= 1) {
          const x = marginOffset + item.c * modulePixelSize;
          const y = marginOffset + item.r * modulePixelSize;

          if (item.isFinder) {
            // Finders rendered crisp with slight vermilion accent on core
            ctx.fillStyle = fgColor;
            ctx.fillRect(x, y, modulePixelSize, modulePixelSize);
          } else {
            // Radial petal reveal: scale module from center
            const itemRevealProgress = Math.min(
              1,
              Math.max(0, (currentRadius - item.dist) / 2)
            );
            const w = modulePixelSize * (0.4 + 0.6 * itemRevealProgress);
            const offset = (modulePixelSize - w) / 2;

            ctx.fillStyle = fgColor;
            ctx.fillRect(x + offset, y + offset, w, w);
          }
        }
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(renderFrame);
      } else {
        // Complete & fully scannable!
        setIsSettled(true);
        if (onComplete) onComplete();

        if (loop) {
          setTimeout(() => {
            animFrameRef.current = requestAnimationFrame(renderFrame);
          }, 3000);
        }
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(renderFrame);
  }, [payload, size, fgColor, bgColor, accentColor, errorCorrectionLevel, isFinderPattern, onComplete, loop]);

  useEffect(() => {
    runRangoliAssembly();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [runRangoliAssembly]);

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-2xl shadow-sm border border-peacock-deep/15"
        style={{ width: size, height: size }}
      />
      {!isSettled && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <span className="sr-only">Assembling QR matrix in radial rangoli sequence</span>
        </div>
      )}
    </div>
  );
};
