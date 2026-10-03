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
import { Corner } from '../../art/Corner';
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

const MADHUBANI_ACCENTS = [
  { name: 'Peacock Deep', color: '#13504D' },
  { name: 'Vermilion', color: '#C54845' },
  { name: 'Saffron Sun', color: '#F79454' },
  { name: 'Peacock Teal', color: '#2F7A72' },
  { name: 'Mithila Sage', color: '#A5B596' },
  { name: 'Carbon Ink', color: '#1C2B29' },
];

export const ThreeTab: React.FC = () => {
  // Payload state
  const [activeType, setActiveType] = useState<QrType>('url');
  const [inputs, setInputs] = useState<QrInputsMap>({
    url: { url: 'https://gdg.community.dev/srm-ist' },
    text: { text: 'QRaft 3D WebGL Matrix — Madhubani Collection' },
    email: { address: 'leads@gdgsrm.org', subject: '3D QR Inquiry', message: 'Hello from QRaft 3D!' },
    phone: { number: '+919876543210' },
    wifi: { ssid: 'SRM-3D-Matrix', password: 'SpaceStation2026', security: 'WPA', hidden: false },
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 3D Settings state (defaulting to Peacock Garden with Saffron accent)
  const [selectedCategory, setSelectedCategory] = useState<ThreeCategory>('scenes');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('peacock-garden');
  const [depth, setDepth] = useState<number>(0.9);
  const [moduleStyle, setModuleStyle] = useState<ThreeModuleStyle>('rounded');
  const [accentColor, setAccentColor] = useState<string>('#F79454');
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

  // Filter themes by category
  const categoryThemes = useMemo(
    () => THREE_THEMES.filter((t) => t.category === selectedCategory),
    [selectedCategory]
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
      <div className="p-12 text-center bg-paper-2/95 rounded-3xl border border-paper-border shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-vermilion-50 text-vermilion flex items-center justify-center mx-auto mb-4 border border-vermilion/20">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-heading font-bold text-peacock-deep mb-2">
          WebGL Hardware Acceleration Unavailable
        </h3>
        <p className="text-sm text-ink/70 max-w-md mx-auto">
          Your current browser or graphics device does not support WebGL 3D context rendering. Please switch to the 2D Generator tab to design and export full vector Madhubani QR codes.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & 3D Theme Customizer (6 cols) */}
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
          <div
            className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card relative overflow-hidden"
            style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
          >
            <Corner position="top-right" size={24} strokeColor="#13504D" fillColor="#F79454" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-vermilion" />
                <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
                  Madhubani 3D Themes (16 Curated)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-peacock-deep bg-saffron-50 px-2.5 py-0.5 rounded-full border border-saffron-300">
                {currentTheme.name}
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex rounded-xl bg-paper p-1 mb-4 border border-paper-border">
              {(['scenes', 'anime', 'characters', 'others'] as ThreeCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-1 py-1.5 text-xs font-heading font-bold rounded-lg capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-peacock-deep text-white shadow-sm'
                      : 'text-ink/65 hover:text-peacock-deep'
                  }`}
                >
                  {cat === 'scenes' ? 'Courtyards' : cat === 'anime' ? 'Folk Tales' : cat === 'characters' ? 'Motifs' : 'Artisanal'}
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
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-peacock-deep ${
                      isSelected
                        ? 'border-2 border-peacock-deep bg-peacock/10 shadow-sm ring-1 ring-peacock-deep/20'
                        : 'border-paper-border bg-paper hover:border-peacock/40 hover:bg-paper-2'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`w-full h-7 rounded-xl bg-gradient-to-r ${t.previewGradient} shadow-inner flex items-center justify-end px-2 border border-peacock-deep/15`}>
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/80 shadow-sm"
                          style={{ backgroundColor: t.accentColor }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-heading font-bold text-peacock-deep">{t.name}</p>
                      <p className="text-[10px] text-ink/65 line-clamp-1 mt-0.5">
                        {t.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 3D Controls (Depth, Module Style, Accent, Auto-Rotate) */}
          <div
            className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card space-y-4 relative overflow-hidden"
            style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Box className="w-4 h-4 text-peacock-deep" />
              <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
                Extrusion & Geometry Controls
              </h3>
            </div>

            {/* Depth Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-heading font-semibold text-peacock-deep">
                  Extrusion Depth
                </label>
                <span className="text-xs font-mono font-bold text-peacock-deep">
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
                className="w-full h-2 bg-paper-border rounded-lg appearance-none cursor-pointer accent-peacock-deep"
              />
            </div>

            {/* Module Style */}
            <div>
              <label className="block text-xs font-heading font-semibold text-peacock-deep mb-2">
                Module Primitive Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['cube', 'rounded', 'cylinder'] as ThreeModuleStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setModuleStyle(style)}
                    className={`py-2 px-3 rounded-xl border text-xs font-heading font-bold capitalize transition-all ${
                      moduleStyle === style
                        ? 'border-2 border-peacock-deep bg-peacock/10 text-peacock-deep ring-1 ring-peacock-deep/20'
                        : 'border-paper-border bg-paper hover:bg-paper-2 text-ink'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Palette */}
            <div>
              <label className="block text-xs font-heading font-semibold text-peacock-deep mb-2">
                Corner Finder Accent Color
              </label>
              <div className="flex items-center gap-2">
                {MADHUBANI_ACCENTS.map((acc) => (
                  <button
                    key={acc.color}
                    type="button"
                    onClick={() => setAccentColor(acc.color)}
                    className={`w-7 h-7 rounded-xl transition-transform hover:scale-110 shadow-sm border ${
                      accentColor === acc.color ? 'ring-2 ring-peacock-deep ring-offset-2' : 'border-paper-border'
                    }`}
                    style={{ backgroundColor: acc.color }}
                    title={acc.name}
                  />
                ))}
              </div>
            </div>

            {/* Auto-Rotate Controls */}
            <div className="pt-2 border-t border-paper-border flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="rounded border-paper-border text-peacock-deep focus:ring-peacock-deep"
                />
                <span className="text-xs text-peacock-deep font-semibold">
                  Auto-Rotate Orbit
                </span>
              </label>

              {autoRotate && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ink/65 font-medium">Speed:</span>
                  <input
                    type="range"
                    min={0.5}
                    max={3.5}
                    step={0.5}
                    value={autoRotateSpeed}
                    onChange={(e) => setAutoRotateSpeed(Number(e.target.value))}
                    className="w-20 h-1.5 bg-paper-border rounded-lg appearance-none cursor-pointer accent-peacock-deep"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D WebGL Viewport & Exports (6 cols) */}
        <div className="lg:col-span-6 lg:sticky lg:top-20 space-y-4">
          <div
            className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card flex flex-col items-center relative overflow-hidden"
            style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
          >
            {/* Viewport Header */}
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-vermilion animate-pulse" />
                <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
                  Interactive 3D Viewport
                </h3>
              </div>
              <span className="text-[10px] font-mono text-ink/70 bg-paper px-2 py-0.5 rounded-full border border-paper-border">
                Drag to orbit &bull; Scroll to zoom
              </span>
            </div>

            {/* 3D Canvas Container */}
            <div className="relative w-full aspect-square max-w-[480px] rounded-3xl overflow-hidden border border-paper-border shadow-inner bg-ink">
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
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-paper/70">
                  <Box className="w-12 h-12 text-paper/40 mb-3 animate-pulse" />
                  <p className="text-xs font-heading font-bold text-paper">Input Required</p>
                  <p className="text-[11px] text-paper/60 mt-1 max-w-xs">
                    Please provide valid QR input on the left to compute the 3D module matrix.
                  </p>
                </div>
              )}

              {/* Viewport Overlay Controls */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-ink/60 backdrop-blur-md p-1 rounded-xl border border-white/20">
                <button
                  type="button"
                  onClick={() => setIsTopView(!isTopView)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
                    isTopView
                      ? 'bg-vermilion text-white shadow-sm'
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
                className={`mt-4 w-full p-3 rounded-2xl border text-xs font-medium flex items-center gap-2 ${
                  flatVerifyResult.match
                    ? 'bg-peacock/15 border-peacock/30 text-peacock-deep'
                    : 'bg-vermilion-50 border-vermilion/30 text-vermilion'
                }`}
              >
                {flatVerifyResult.match ? (
                  <CheckCircle2 className="w-4 h-4 text-peacock flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-vermilion flex-shrink-0" />
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
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-paper border border-peacock/30 hover:bg-paper-2 text-peacock-deep text-xs font-heading font-bold shadow-sm transition-all active:scale-95 disabled:opacity-40"
              >
                <Camera className="w-4 h-4 text-peacock-deep" />
                <span>Export 3D Snapshot</span>
              </button>

              {/* Export Flat Scan-Safe PNG */}
              <button
                type="button"
                onClick={handleExportFlatPng}
                disabled={!validation.isValid}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-vermilion hover:bg-vermilion-500 text-white text-xs font-heading font-bold shadow-sm shadow-vermilion-glow hover:shadow-saffron-glow transition-all active:scale-95 disabled:opacity-40 border border-white/30"
              >
                <Download className="w-4 h-4" />
                <span>Flat Scan-Safe PNG</span>
              </button>
            </div>

            {/* Scannability Technical Note */}
            <div className="mt-4 pt-3 border-t border-paper-border flex items-start gap-2 text-[11px] text-ink/65 text-left">
              <ShieldCheck className="w-4 h-4 text-peacock flex-shrink-0 mt-0.5" />
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
