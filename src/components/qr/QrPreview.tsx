import React, { useEffect, useRef, useState } from 'react';
import {
  QrType,
  QrStyle,
  ReliabilityReport,
  ScanVerificationResult,
} from '../../types';
import { renderQrToCanvas } from '../../lib/qrRenderer';
import { verifyCanvasScan } from '../../lib/scanVerify';
import {
  downloadCanvasAsPng,
  downloadAsSvg,
  copyCanvasToClipboard,
} from '../../lib/download';
import { RecentStore } from '../../services/recent';
import { TemplateStore } from '../../services/templates';
import { useAuth } from '../../hooks/useAuth';
import { JharokhaFrame } from '../../art/JharokhaFrame';
import { Lotus } from '../../art/Lotus';
import {
  Download,
  Copy,
  FileCode,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Bookmark,
  Check,
  Scan,
  RefreshCw,
  Wand2,
} from 'lucide-react';

interface QrPreviewProps {
  type: QrType;
  payload: string;
  inputs: any;
  style: QrStyle;
  isValid: boolean;
  errors: Record<string, string>;
  reliability: ReliabilityReport;
  verification: ScanVerificationResult | null;
  onVerificationChange: (result: ScanVerificationResult) => void;
  onTabRequest?: (tab: string) => void;
  onUpdateStyle?: (updates: Partial<QrStyle>) => void;
}

export const QrPreview: React.FC<QrPreviewProps> = ({
  type,
  payload,
  inputs,
  style,
  isValid,
  errors,
  reliability,
  verification,
  onVerificationChange,
  onUpdateStyle,
}) => {
  const { user, isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [downloadAnyway, setDownloadAnyway] = useState(false);
  const [exportWithFrame, setExportWithFrame] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Debounced Designer QR Canvas Render with automated jsQR decode
  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;

    if (!canvas || !isValid || !payload.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await renderQrToCanvas(canvas, payload, style);
        if (!active) return;

        onVerificationChange({
          checked: true,
          success: result.decoded,
          match: result.decoded,
          decodedText: result.decodedText,
          message: result.decoded
            ? 'Scans OK in camera test (verified with jsQR engine).'
            : 'Could not be decoded in camera test. Contrast, quiet zone, or module shape may need adjustment.',
        });
      } catch (err) {
        if (active) {
          console.error('QR rendering error:', err);
        }
      }
    }, 120);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [payload, isValid, style]);

  // Handle Manual Verify Scan with jsQR
  const handleVerifyScan = () => {
    if (!canvasRef.current || !isValid) return;
    setIsVerifying(true);
    setTimeout(() => {
      const res = verifyCanvasScan(canvasRef.current!, payload);
      onVerificationChange(res);
      setIsVerifying(false);
    }, 150);
  };

  // Auto-remedy "Make it safer" handler
  const handleMakeItSafer = () => {
    if (!onUpdateStyle) return;
    onUpdateStyle({
      fgColor: '#1A3644',
      bgColor: '#F6F1E8',
      ecl: 'H',
      margin: 4,
      moduleShape: 'square',
      finderShape: 'square',
      gradientType: 'none',
      artStyle: 'none',
      paintedTexture: false,
      bgImage: null,
    });
    setDownloadAnyway(false);
  };

  // Helper to compose framed canvas if exportWithFrame is true
  const getExportCanvas = (): HTMLCanvasElement | null => {
    if (!canvasRef.current) return null;
    if (!exportWithFrame) return canvasRef.current;

    const src = canvasRef.current;
    const framePad = 48; // Quiet padding around QR ensuring quiet zone is untouched
    const offscreen = document.createElement('canvas');
    offscreen.width = src.width + framePad * 2;
    offscreen.height = src.height + framePad * 2;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return src;

    // Draw handmade rice paper background
    ctx.fillStyle = '#F6F1E8';
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);

    // Draw outer double border in Madhubani indigo-ink & haldi
    ctx.strokeStyle = '#1A3644';
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, offscreen.width - 24, offscreen.height - 24);

    ctx.strokeStyle = '#D99B26';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(18, 18, offscreen.width - 36, offscreen.height - 36);

    // Draw source QR code in center (quiet zone fully preserved)
    ctx.drawImage(src, framePad, framePad);

    return offscreen;
  };

  // Scannability Gate: require both reliability score and verified scan unless overridden
  const isScanVerified = verification ? verification.match : true;
  const hasHardErrors = !isValid || !reliability.canDownload;
  const hasScannabilityIssue = !isScanVerified || !reliability.canDownload;
  const canProceedWithDownload = isValid && (!hasScannabilityIssue || downloadAnyway);

  // Actions
  const handleDownloadPng = () => {
    const canvas = getExportCanvas();
    if (!canvas || !canProceedWithDownload) return;
    downloadCanvasAsPng(canvas, type);
    RecentStore.add(type, inputs, style, payload);
  };

  const handleDownloadSvg = async () => {
    if (!canProceedWithDownload) return;
    await downloadAsSvg(payload, style, type);
    RecentStore.add(type, inputs, style, payload);
  };

  const handleCopyClipboard = async () => {
    const canvas = getExportCanvas();
    if (!canvas || !canProceedWithDownload) return;
    const res = await copyCanvasToClipboard(canvas);
    setCopyFeedback(res.message);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleSaveTemplate = () => {
    const defaultName = `${type.toUpperCase()} Code - ${new Date().toLocaleDateString()}`;
    const name = window.prompt('Enter a title for this template:', defaultName);
    if (!name) return;

    TemplateStore.create(
      {
        name: name.trim(),
        type,
        inputs,
        style,
        tags: [type],
      },
      user?.id,
      user?.name || 'Guest Designer'
    );

    RecentStore.add(type, inputs, style, payload);
    setSaveFeedback('Template saved to "My Templates"!');
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. Main Canvas Preview Card */}
      <div
        className="bg-rice p-5 sm:p-6 rounded-3xl border-2 border-indigo-ink/20 shadow-folk-card flex flex-col items-center text-center relative overflow-hidden"
        style={{ outline: '1px solid rgba(26, 54, 68, 0.1)', outlineOffset: '2px' }}
      >
        {/* Header Label */}
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sindoor animate-pulse" />
            <h3 className="text-xs font-heading font-bold text-indigo-ink uppercase tracking-wider">
              Real-Time Preview
            </h3>
          </div>
          <span className="text-[11px] font-mono text-indigo-ink bg-rice-panel px-2.5 py-0.5 rounded-full border border-rice-border">
            {style.size}&times;{style.size}px &bull; ECL {style.ecl}
          </span>
        </div>

        {/* Live Canvas with Jharokha Folk Frame (Section 2.2) */}
        <div className="relative w-full max-w-[340px] flex items-center justify-center p-1 mb-2">
          {isValid && payload.trim() ? (
            <JharokhaFrame
              className="w-full shadow-folk-card"
              strokeColor="#1A3644"
              accentColor="#A62B2B"
              highlightColor="#D99B26"
            >
              <div className="relative p-2 bg-rice flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full rounded-lg transition-all"
                  style={{ width: `${Math.min(style.size, 250)}px`, height: `${Math.min(style.size, 250)}px` }}
                />
              </div>
            </JharokhaFrame>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-indigo-ink/70">
              <div className="w-12 h-12 rounded-2xl bg-sindoor/10 text-sindoor flex items-center justify-center mb-3 border border-sindoor/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-xs font-heading font-bold text-indigo-ink">Incomplete Payload Data</p>
              <p className="text-[11px] text-indigo-ink/65 mt-1 max-w-[200px]">
                {Object.values(errors)[0] || 'Provide required fields on the left to render your QR code.'}
              </p>
            </div>
          )}
        </div>

        {/* Frame Export Toggle */}
        <div className="w-full flex items-center justify-between px-1 mb-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-indigo-ink">
            <input
              type="checkbox"
              checked={exportWithFrame}
              onChange={(e) => setExportWithFrame(e.target.checked)}
              className="rounded border-rice-border text-sindoor focus:ring-haldi"
            />
            <span>Export with decorative Madhubani frame</span>
          </label>
        </div>

        {/* Verification Result Pill (Automated jsQR scannability test) */}
        {verification && (
          <div
            className={`w-full p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 mb-2 ${
              verification.match
                ? 'bg-leaf/15 border-leaf/30 text-leaf'
                : 'bg-sindoor/15 border-sindoor/30 text-sindoor'
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              {verification.match ? (
                <Check className="w-4 h-4 text-leaf flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-sindoor flex-shrink-0" />
              )}
              <span className="line-clamp-2">{verification.message}</span>
            </div>

            {/* "Make it safer" Auto-Remedy Button */}
            {!verification.match && onUpdateStyle && (
              <button
                type="button"
                onClick={handleMakeItSafer}
                className="flex-shrink-0 px-2.5 py-1 bg-sindoor text-rice text-[11px] font-heading font-bold rounded-lg hover:bg-sindoor-600 shadow-sm flex items-center gap-1 transition-all"
                title="Automatically fix contrast, shapes, and error correction for 100% scan reliability"
              >
                <Wand2 className="w-3 h-3" />
                <span>Make it safer</span>
              </button>
            )}
          </div>
        )}

        {/* Scannability Warning & Override */}
        {hasScannabilityIssue && isValid && (
          <div className="w-full p-2.5 bg-haldi/20 border border-haldi/50 rounded-xl mb-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-ink">
                Scannability check failed: camera decode was not verified.
              </span>
              {onUpdateStyle && (
                <button
                  type="button"
                  onClick={handleMakeItSafer}
                  className="text-[11px] font-bold text-sindoor underline hover:text-sindoor-600"
                >
                  Auto-remedy
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-1.5 pt-1.5 border-t border-haldi/30">
              <input
                type="checkbox"
                checked={downloadAnyway}
                onChange={(e) => setDownloadAnyway(e.target.checked)}
                className="rounded border-rice-border text-sindoor focus:ring-haldi"
              />
              <span className="text-[11px] text-indigo-ink font-medium">
                I understand this design may be hard to scan; allow download anyway
              </span>
            </label>
          </div>
        )}

        {/* Action Buttons Toolbar (Section 2.3) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-2">
          {/* Download PNG (Primary: sindoor fill, FolkTag haldi border, rice text, haldi glow) */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={!canProceedWithDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sindoor hover:bg-sindoor-600 text-rice font-heading font-bold text-xs shadow-sm shadow-haldi-glow hover:shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-haldi group focus:outline-none focus:ring-2 focus:ring-haldi"
            title="Download PNG (matches preview canvas exactly)"
          >
            <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>PNG</span>
          </button>

          {/* Download SVG (Secondary: indigo-ink outline with tag trim) */}
          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={!canProceedWithDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rice border-2 border-indigo-ink hover:bg-rice-panel text-indigo-ink font-heading font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-ink"
            title="Download Vector SVG matching designer styles"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-ink" />
            <span>SVG</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            type="button"
            onClick={handleCopyClipboard}
            disabled={!canProceedWithDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rice border-2 border-indigo-ink hover:bg-rice-panel text-indigo-ink font-heading font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-ink"
            title="Copy image to clipboard"
          >
            <Copy className="w-3.5 h-3.5 text-indigo-ink" />
            <span>Copy</span>
          </button>

          {/* Verify with jsQR */}
          <button
            type="button"
            onClick={handleVerifyScan}
            disabled={!isValid || isVerifying}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rice border-2 border-indigo-ink hover:bg-rice-panel text-indigo-ink font-heading font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-ink"
            title="Simulate optical camera decode with jsQR"
          >
            {isVerifying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-ink" />
            ) : (
              <Scan className="w-3.5 h-3.5 text-indigo-ink" />
            )}
            <span>Verify</span>
          </button>
        </div>

        {/* Microinteraction Toast Messages with Lotus Icon */}
        {copyFeedback && (
          <div className="mt-3 p-2 bg-haldi/20 border border-haldi/60 rounded-xl text-xs font-semibold text-indigo-ink flex items-center justify-center gap-2">
            <Lotus size={16} strokeColor="#1A3644" fillColor="#D99B26" accentColor="#A62B2B" />
            <span>{copyFeedback}</span>
          </div>
        )}
        {saveFeedback && (
          <div className="mt-3 p-2 bg-leaf/15 border border-leaf/30 rounded-xl text-xs font-semibold text-leaf flex items-center justify-center gap-2">
            <Lotus size={16} strokeColor="#1A3644" fillColor="#2D5A3E" accentColor="#D99B26" />
            <span>{saveFeedback}</span>
          </div>
        )}

        {/* Save as Template */}
        <div className="w-full mt-3 pt-3 border-t border-rice-border flex items-center justify-between">
          <button
            type="button"
            onClick={handleSaveTemplate}
            disabled={!isValid}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-ink hover:text-sindoor transition-colors disabled:opacity-40"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save as Template</span>
          </button>
          {!isAuthenticated && (
            <span className="text-[11px] text-indigo-ink/60">
              (Saved locally to browser)
            </span>
          )}
        </div>
      </div>

      {/* 2. Scan Reliability Card */}
      <div
        className="bg-rice p-5 rounded-3xl border-2 border-indigo-ink/20 shadow-folk-card relative overflow-hidden"
        style={{ outline: '1px solid rgba(26, 54, 68, 0.1)', outlineOffset: '2px' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {reliability.score === 'good' ? (
              <ShieldCheck className="w-5 h-5 text-leaf" />
            ) : reliability.score === 'caution' ? (
              <AlertTriangle className="w-5 h-5 text-haldi" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-sindoor" />
            )}
            <h3 className="text-xs font-heading font-bold text-indigo-ink uppercase tracking-wider">
              Scan Reliability Engine
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-indigo-ink/75">
              Contrast: <strong>{reliability.contrastRatio}:1</strong>
            </span>
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full capitalize ${
                reliability.score === 'good'
                  ? 'bg-leaf text-rice border border-leaf-light'
                  : reliability.score === 'caution'
                  ? 'bg-haldi text-indigo-ink border border-indigo-ink font-bold'
                  : 'bg-sindoor text-rice border border-sindoor-light'
              }`}
            >
              {reliability.score}
            </span>
          </div>
        </div>

        {/* Errors / Warnings List */}
        <div className="space-y-2 text-xs">
          {reliability.errors.map((err, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-sindoor/15 border border-sindoor/30 text-sindoor flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{err}</span>
            </div>
          ))}

          {reliability.warnings.map((warn, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-haldi/20 border border-haldi/50 text-indigo-ink flex items-start gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-sindoor" />
              <span>{warn}</span>
            </div>
          ))}

          {reliability.errors.length === 0 && reliability.warnings.length === 0 && (
            <p className="text-[11px] text-ink/70">
              &bull; High-contrast colors, adequate quiet zone, and standard module density. Expected to scan seamlessly across mobile cameras.
            </p>
          )}

          {hasHardErrors && (
            <div className="pt-2 flex items-center justify-between border-t border-paper-border">
              <p className="text-[11px] font-semibold text-vermilion">
                Low contrast detected. Physical cameras may struggle to read this.
              </p>
              {onUpdateStyle && (
                <button
                  type="button"
                  onClick={handleMakeItSafer}
                  className="px-2.5 py-1 bg-vermilion text-white text-[11px] font-heading font-bold rounded-lg hover:bg-vermilion-500 shadow-sm flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Fix with Safe Palette</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
