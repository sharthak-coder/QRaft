import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrType,
  QrStyle,
  ReliabilityReport,
  ScanVerificationResult,
} from '../../types';
import { verifyCanvasScan } from '../../lib/scanVerify';
import {
  downloadCanvasAsPng,
  downloadAsSvg,
  copyCanvasToClipboard,
} from '../../lib/download';
import { RecentStore } from '../../services/recent';
import { TemplateStore } from '../../services/templates';
import { useAuth } from '../../hooks/useAuth';
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
}) => {
  const { user, isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [downloadAnyway, setDownloadAnyway] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Debounced QR Canvas Render
  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;

    if (!canvas || !isValid || !payload.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      QRCode.toCanvas(
        canvas,
        payload,
        {
          width: style.size,
          margin: style.margin,
          color: {
            dark: style.fgColor,
            light: style.bgColor,
          },
          errorCorrectionLevel: style.ecl,
        },
        (err) => {
          if (err && active) {
            console.error('QR generation error:', err);
          }
        }
      );
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [payload, isValid, style]);

  // Handle Verify Scan with jsQR
  const handleVerifyScan = () => {
    if (!canvasRef.current || !isValid) return;
    setIsVerifying(true);
    setTimeout(() => {
      const res = verifyCanvasScan(canvasRef.current!, payload);
      onVerificationChange(res);
      setIsVerifying(false);
    }, 200);
  };

  // Actions
  const handleDownloadPng = () => {
    if (!canvasRef.current || !canProceedWithDownload) return;
    downloadCanvasAsPng(canvasRef.current, type);
    RecentStore.add(type, inputs, style, payload);
  };

  const handleDownloadSvg = async () => {
    if (!canProceedWithDownload) return;
    await downloadAsSvg(payload, style, type);
    RecentStore.add(type, inputs, style, payload);
  };

  const handleCopyClipboard = async () => {
    if (!canvasRef.current || !canProceedWithDownload) return;
    const res = await copyCanvasToClipboard(canvasRef.current);
    setCopyFeedback(res.message);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleSaveTemplate = () => {
    const defaultName = `${type.toUpperCase()} Template - ${new Date().toLocaleDateString()}`;
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

  // Download permission logic
  const hasHardErrors = !isValid || !reliability.canDownload;
  const hasWarningsOnly = isValid && reliability.warnings.length > 0 && reliability.canDownload;
  const canProceedWithDownload = isValid && (reliability.canDownload || downloadAnyway);

  return (
    <div className="w-full space-y-4">
      {/* 1. Main Canvas Preview Card */}
      <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl border border-surface-border shadow-lift flex flex-col items-center text-center relative overflow-hidden">
        {/* Header Label */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-google-blue-royal animate-pulse" />
            <h3 className="text-xs font-bold text-surface-text uppercase tracking-wider">
              Real-Time Preview
            </h3>
          </div>
          <span className="text-[11px] font-mono text-surface-muted bg-surface-soft px-2.5 py-0.5 rounded-full border border-surface-border">
            {style.size}&times;{style.size}px &bull; ECL {style.ecl}
          </span>
        </div>

        {/* Live Canvas or Invalid Placeholder */}
        <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center p-4 rounded-2xl bg-surface-soft/60 border border-surface-border/80 shadow-inner overflow-hidden">
          {isValid && payload.trim() ? (
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full rounded-xl shadow-sm transition-all"
              style={{ width: `${Math.min(style.size, 300)}px`, height: `${Math.min(style.size, 300)}px` }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-surface-muted">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-google-red flex items-center justify-center mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-surface-text">Incomplete or Invalid Data</p>
              <p className="text-[11px] text-surface-muted mt-1 max-w-[200px]">
                {Object.values(errors)[0] || 'Please provide required fields on the left to render your QR code.'}
              </p>
            </div>
          )}
        </div>

        {/* Verification result pill */}
        {verification && (
          <div
            className={`mt-4 w-full p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              verification.match
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {verification.match ? (
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            )}
            <span className="line-clamp-2 text-left">{verification.message}</span>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-5">
          {/* Download PNG */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={!canProceedWithDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-google-blue-royal to-google-blue hover:from-google-blue-deep hover:to-google-blue-royal text-white text-xs font-bold shadow-sm shadow-royal-glow hover:shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Download PNG (matches preview canvas exactly)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>

          {/* Download SVG */}
          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={!canProceedWithDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-surface-border hover:bg-surface-soft text-surface-text text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Download Vector SVG"
          >
            <FileCode className="w-3.5 h-3.5 text-google-blue-royal" />
            <span>SVG</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            type="button"
            onClick={handleCopyClipboard}
            disabled={!canProceedWithDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-surface-border hover:bg-surface-soft text-surface-text text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Copy image to clipboard"
          >
            <Copy className="w-3.5 h-3.5 text-surface-muted" />
            <span>Copy</span>
          </button>

          {/* Verify with jsQR */}
          <button
            type="button"
            onClick={handleVerifyScan}
            disabled={!isValid || isVerifying}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Simulate scan with jsQR engine"
          >
            {isVerifying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Scan className="w-3.5 h-3.5" />
            )}
            <span>Verify</span>
          </button>
        </div>

        {/* Feedback toasts */}
        {copyFeedback && (
          <p className="mt-2 text-xs font-semibold text-google-blue-royal animate-fade-in">
            {copyFeedback}
          </p>
        )}
        {saveFeedback && (
          <p className="mt-2 text-xs font-semibold text-google-green animate-fade-in">
            {saveFeedback}
          </p>
        )}

        {/* Save as Template */}
        <div className="w-full mt-3 pt-3 border-t border-surface-border/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSaveTemplate}
            disabled={!isValid}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-muted hover:text-google-blue-royal transition-colors disabled:opacity-40"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save as Template</span>
          </button>
          {!isAuthenticated && (
            <span className="text-[11px] text-surface-muted">
              (Saved to local session)
            </span>
          )}
        </div>
      </div>

      {/* 2. Scan Reliability Card */}
      <div className="bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-surface-border shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {reliability.score === 'good' ? (
              <ShieldCheck className="w-5 h-5 text-google-green" />
            ) : reliability.score === 'caution' ? (
              <AlertTriangle className="w-5 h-5 text-google-yellow" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-google-red" />
            )}
            <h3 className="text-xs font-bold text-surface-text uppercase tracking-wider">
              Scan Reliability Engine
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-surface-muted">
              Contrast: <strong>{reliability.contrastRatio}:1</strong>
            </span>
            <span
              className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full capitalize ${
                reliability.score === 'good'
                  ? 'bg-emerald-100 text-emerald-800'
                  : reliability.score === 'caution'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {reliability.score}
            </span>
          </div>
        </div>

        {/* Errors / Warnings List */}
        <div className="space-y-2 text-xs">
          {reliability.errors.map((err, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-google-red flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{err}</span>
            </div>
          ))}

          {reliability.warnings.map((warn, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>{warn}</span>
            </div>
          ))}

          {reliability.errors.length === 0 && reliability.warnings.length === 0 && (
            <p className="text-[11px] text-surface-muted">
              &bull; High-contrast colors, adequate quiet zone, and standard module density. Expected to scan seamlessly across all modern devices.
            </p>
          )}

          {/* Warning override toggle */}
          {hasWarningsOnly && (
            <div className="pt-2 flex items-center justify-between border-t border-surface-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={downloadAnyway}
                  onChange={(e) => setDownloadAnyway(e.target.checked)}
                  className="rounded border-surface-border text-google-blue focus:ring-google-blue"
                />
                <span className="text-xs text-surface-text font-medium">
                  Acknowledge warnings & allow export
                </span>
              </label>
            </div>
          )}

          {hasHardErrors && (
            <p className="text-[11px] font-semibold text-google-red pt-1">
              Export is locked until contrast errors are resolved to prevent producing broken codes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
