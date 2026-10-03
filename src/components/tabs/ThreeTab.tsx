import React, { useState, useMemo, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrType, QrInputsMap, ThreeCategory, ThreeModuleStyle } from '../../types';
import { generatePayload } from '../../lib/payload';
import { validateInputs } from '../../lib/validation';
import { verifyCanvasScan } from '../../lib/scanVerify';
import { generateQrMatrix } from '../../three/matrix';
import { THREE_THEMES } from '../../three/themes';
import { QrScene } from '../../three/QrScene';
import { TypeSelector } from '../forms/TypeSelector';
import { TypeForms } from '../forms/TypeForms';
import { RecentStore } from '../../services/recent';
import {
  Camera,
  Box,
  Eye,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const GOOGLE_ACCENTS = [
  { name: 'Royal Blue', color: '#1A56DB' },
  { name: 'Google Red', color: '#EA4335' },
  { name: 'Google Yellow', color: '#FBBC04' },
  { name: 'Google Green', color: '#34A853' },
  { name: 'Cyan Neon', color: '#00E5FF' },
  { name: 'Deep Purple', color: '#9333EA' },
];

export const ThreeTab: React.FC = () => {
  // Payload state
  const [activeType, setActiveType] = useState<QrType>('url');
  const [inputs, setInputs] = useState<QrInputsMap>({
    url: { url: 'https://gdg.community.dev/srm-ist' },
    text: { text: 'QRaft 3D WebGL Matrix' },
    email: { address: 'leads@gdgsrm.org', subject: '3D QR Inquiry', message: 'Hello!' },
    phone: { number: '+919876543210' },
    wifi: { ssid: 'SRM-3D-Matrix', password: 'SpaceStation2026', security: 'WPA', hidden: false },
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 3D Settings state
  const [selectedCategory, setSelectedCategory] = useState<ThreeCategory>('scenes');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('midnight-city');
  const [depth, setDepth] = useState<number>(0.9);
  const [moduleStyle, setModuleStyle] = useState<ThreeModuleStyle>('cube');
  const [accentColor, setAccentColor] = useState<string>('#4285F4');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState<number>(1.2);
  const [isTopView, setIsTopView] = useState<boolean>(false);

  // Verification & flat canvas
  const [flatVerifyResult, setFlatVerifyResult] = useState<{
    checked: boolean;
    match: boolean;
    message: string;
  } | null>(null);

  const threeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const flatCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // WebGL support check
  const isWebGLAvailable = useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      return Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }, []);

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setInputs((prev) => ({
        ...prev,
        [activeType]: {
          ...prev[activeType],
          [field]: value,
        },
      }));
      setTouched((prev) => ({ ...prev, [`${activeType}.${field}`]: true }));
      setFlatVerifyResult(null);
    },
    [activeType]
  );

  const currentPayload = useMemo(
    () => generatePayload(activeType, inputs[activeType]),
    [activeType, inputs]
  );

  const validation = useMemo(
    () => validateInputs(activeType, inputs[activeType], 'M'),
    [activeType, inputs]
  );

  const currentTheme = useMemo(
    () => THREE_THEMES.find((t) => t.id === selectedThemeId) || THREE_THEMES[0],
    [selectedThemeId]
  );

  const qrMatrix = useMemo(
    () => generateQrMatrix(validation.isValid ? currentPayload : '', 'M'),
    [validation.isValid, currentPayload]
  );

  // Render scan-safe flat QR code into hidden canvas for verification & export
  const renderFlatCanvas = useCallback(async (): Promise<HTMLCanvasElement | null> => {
    if (!validation.isValid || !currentPayload) return null;
    const canvas = flatCanvasRef.current || document.createElement('canvas');
    flatCanvasRef.current = canvas;

    await QRCode.toCanvas(canvas, currentPayload, {
      width: 400,
      margin: 4,
      color: {
        dark: currentTheme.moduleColor,
        light: currentTheme.groundColor,
      },
      errorCorrectionLevel: 'H',
    });

    return canvas;
  }, [validation.isValid, currentPayload, currentTheme]);

  // Export 3D View as PNG
  const handleExport3DView = () => {
    if (!threeCanvasRef.current) return;
    const dataUrl = threeCanvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `qraft-3d-${activeType}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    RecentStore.add(
      activeType,
      inputs[activeType],
      {
        size: 400,
        fgColor: currentTheme.moduleColor,
        bgColor: currentTheme.groundColor,
        ecl: 'H',
        margin: 4,
      },
      currentPayload
    );
  };

  // Export Scan-Safe Flat PNG with verification
  const handleExportFlatPng = async () => {
    const canvas = await renderFlatCanvas();
    if (!canvas) return;

    // Verify with jsQR
    const verify = verifyCanvasScan(canvas, currentPayload);
    setFlatVerifyResult({
      checked: true,
      match: verify.match,
      message: verify.message,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `qraft-scansafe-${activeType}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  if (!isWebGLAvailable) {
    return (
      <div className="p-12 text-center bg-white/90 rounded-3xl border border-surface-border shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-surface-text">WebGL Acceleration Unavailable</h2>
        <p className="text-xs text-surface-muted max-w-md mx-auto mt-2">
          Your current browser or graphics driver has WebGL hardware acceleration disabled. Please check your browser settings or use the standard 2D QR Generator tab.
        </p>
      </div>
    );
  }

  const categoryThemes = THREE_THEMES.filter((t) => t.category === selectedCategory);

  return (
    <div className="w-full space-y-8">
      {/* Hidden canvas for flat scan verification */}
      <canvas ref={flatCanvasRef} className="hidden" />

      {/* Main 3D Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & 3D Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Payload Input Form */}
          <div className="space-y-4">
            <TypeSelector activeType={activeType} onChange={setActiveType} />
            <TypeForms
              activeType={activeType}
              inputs={inputs}
              onChange={handleInputChange}
              errors={validation.errors}
              touched={touched}
            />
          </div>

          {/* 2. Theme Categories & Curated Themes */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-surface-border shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-google-blue-royal" />
                <h3 className="text-xs font-bold text-surface-text uppercase tracking-wider">
                  Curated 3D Themes (16 Total)
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-google-blue-royal bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {currentTheme.name}
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex rounded-xl bg-surface-soft p-1 mb-4 border border-surface-border">
              {(['scenes', 'anime', 'characters', 'others'] as ThreeCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-surface-text shadow-sm'
                      : 'text-surface-muted hover:text-surface-text'
                  }`}
                >
                  {cat === 'anime' ? 'Anime-style' : cat}
                </button>
              ))}
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-2 gap-3">
              {categoryThemes.map((t) => {
                const isSelected = selectedThemeId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedThemeId(t.id);
                      setAccentColor(t.accentColor);
                      setFlatVerifyResult(null);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-google-blue ${
                      isSelected
                        ? 'border-google-blue-royal bg-blue-50/50 shadow-sm ring-1 ring-google-blue-royal/20'
                        : 'border-surface-border bg-white hover:border-slate-300 hover:bg-surface-soft'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`w-full h-7 rounded-xl bg-gradient-to-r ${t.previewGradient} shadow-inner flex items-center justify-end px-2`}>
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-sm"
                          style={{ backgroundColor: t.accentColor }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-surface-text">{t.name}</p>
                      <p className="text-[10px] text-surface-muted line-clamp-1 mt-0.5">
                        {t.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 3D Controls (Depth, Module Style, Accent, Auto-Rotate) */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-surface-border shadow-card space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Box className="w-4 h-4 text-google-blue-royal" />
              <h3 className="text-xs font-bold text-surface-text uppercase tracking-wider">
                Extrusion & Geometry Controls
              </h3>
            </div>

            {/* Depth Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-surface-text">
                  Extrusion Depth
                </label>
                <span className="text-xs font-mono font-bold text-surface-text">
                  {depth.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min={0.3}
                max={2.2}
                step={0.1}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-google-blue-royal"
              />
            </div>

            {/* Module Style */}
            <div>
              <label className="block text-xs font-semibold text-surface-text mb-2">
                Module Primitive Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['cube', 'rounded', 'cylinder'] as ThreeModuleStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setModuleStyle(style)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                      moduleStyle === style
                        ? 'border-google-blue-royal bg-blue-50/60 text-google-blue-royal ring-1 ring-google-blue-royal/20'
                        : 'border-surface-border bg-white hover:bg-surface-soft text-surface-text'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Palette */}
            <div>
              <label className="block text-xs font-semibold text-surface-text mb-2">
                Finder Pattern Accent Color
              </label>
              <div className="flex items-center gap-2">
                {GOOGLE_ACCENTS.map((acc) => (
                  <button
                    key={acc.color}
                    type="button"
                    onClick={() => setAccentColor(acc.color)}
                    className={`w-7 h-7 rounded-xl transition-transform hover:scale-110 shadow-sm border ${
                      accentColor === acc.color ? 'ring-2 ring-google-blue-royal ring-offset-2' : 'border-black/10'
                    }`}
                    style={{ backgroundColor: acc.color }}
                    title={acc.name}
                  />
                ))}
              </div>
            </div>

            {/* Auto-Rotate Controls */}
            <div className="pt-2 border-t border-surface-border flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="rounded border-surface-border text-google-blue focus:ring-google-blue"
                />
                <span className="text-xs text-surface-text font-semibold">
                  Auto-Rotate Orbit
                </span>
              </label>

              {autoRotate && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-surface-muted">Speed:</span>
                  <input
                    type="range"
                    min={0.5}
                    max={3.5}
                    step={0.5}
                    value={autoRotateSpeed}
                    onChange={(e) => setAutoRotateSpeed(Number(e.target.value))}
                    className="w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-google-blue-royal"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D WebGL Viewport & Exports (6 cols) */}
        <div className="lg:col-span-6 lg:sticky lg:top-20 space-y-4">
          <div className="bg-white/95 backdrop-blur-xl p-5 rounded-3xl border border-surface-border shadow-lift flex flex-col items-center">
            {/* Viewport Header */}
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-google-green animate-pulse" />
                <h3 className="text-xs font-bold text-surface-text uppercase tracking-wider">
                  Interactive 3D Viewport
                </h3>
              </div>
              <span className="text-[10px] font-mono text-surface-muted bg-surface-soft px-2 py-0.5 rounded-full border border-surface-border">
                Drag to orbit &bull; Scroll to zoom
              </span>
            </div>

            {/* 3D Canvas Container */}
            <div className="relative w-full aspect-square max-w-[480px] rounded-3xl overflow-hidden border border-surface-border shadow-inner bg-slate-900">
              {validation.isValid && qrMatrix.size > 0 ? (
                <QrScene
                  matrix={qrMatrix}
                  theme={currentTheme}
                  depth={depth}
                  moduleStyle={moduleStyle}
                  accentColor={accentColor}
                  autoRotate={autoRotate}
                  autoRotateSpeed={autoRotateSpeed}
                  isTopView={isTopView}
                  onCanvasRef={(c) => {
                    threeCanvasRef.current = c;
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300">
                  <Box className="w-12 h-12 text-slate-500 mb-3 animate-pulse" />
                  <p className="text-xs font-bold">Input Required</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Please provide valid QR input on the left to compute the 3D module matrix.
                  </p>
                </div>
              )}

              {/* Viewport Overlay Controls */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/20">
                <button
                  type="button"
                  onClick={() => setIsTopView(!isTopView)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isTopView
                      ? 'bg-google-blue-royal text-white shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="Snap camera straight on (Scan-Safe Ortho Angle)"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isTopView ? '3D Orbit View' : 'Top View (Scan-Safe)'}</span>
                </button>
              </div>
            </div>

            {/* Flat Verification Status Badge */}
            {flatVerifyResult && (
              <div
                className={`mt-4 w-full p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                  flatVerifyResult.match
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                {flatVerifyResult.match ? (
                  <CheckCircle2 className="w-4 h-4 text-google-green flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-google-yellow flex-shrink-0" />
                )}
                <span>{flatVerifyResult.message}</span>
              </div>
            )}

            {/* Export Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-5">
              {/* Export 3D Render */}
              <button
                type="button"
                onClick={handleExport3DView}
                disabled={!validation.isValid}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-surface-border hover:bg-surface-soft text-surface-text text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40"
              >
                <Camera className="w-4 h-4 text-google-blue-royal" />
                <span>Export 3D Snapshot</span>
              </button>

              {/* Export Flat Scan-Safe PNG */}
              <button
                type="button"
                onClick={handleExportFlatPng}
                disabled={!validation.isValid}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-google-blue-royal to-google-blue hover:from-google-blue-deep hover:to-google-blue-royal text-white text-xs font-bold shadow-sm shadow-royal-glow hover:shadow-md transition-all active:scale-95 disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                <span>Flat Scan-Safe PNG</span>
              </button>
            </div>

            {/* Scannability Honest Technical Note */}
            <div className="mt-4 pt-3 border-t border-surface-border flex items-start gap-2 text-[11px] text-surface-muted text-left">
              <ShieldCheck className="w-4 h-4 text-google-blue flex-shrink-0 mt-0.5" />
              <p>
                <strong>Scannability Note:</strong> Angled 3D renders depend on camera perspective and lighting. For guaranteed physical scanning on all devices, use the <strong>"Flat Scan-Safe PNG"</strong> export or snap to <strong>"Top View"</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
