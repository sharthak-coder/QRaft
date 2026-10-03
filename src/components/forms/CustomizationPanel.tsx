import React, { useRef } from 'react';
import {
  QrStyle,
  ErrorCorrectionLevel,
  ModuleShape,
  FinderShape,
  GradientType,
  MadhubaniArtStyle,
} from '../../types';
import { PRESETS } from '../../lib/presets';
import {
  Sliders,
  Palette,
  Shield,
  Sparkles,
  Shapes,
  Layers,
  Image as ImageIcon,
  Trash2,
  Upload,
} from 'lucide-react';
import { Corner } from '../../art/Corner';

interface CustomizationPanelProps {
  style: QrStyle;
  onChange: <K extends keyof QrStyle>(field: K, value: QrStyle[K]) => void;
  activePresetId: string | null;
  onApplyPreset: (id: string) => void;
}

const ECL_OPTIONS: Array<{
  level: ErrorCorrectionLevel;
  label: string;
  recovery: string;
  description: string;
}> = [
  { level: 'L', label: 'Low (L)', recovery: '~7%', description: 'Highest data density, clean surface' },
  { level: 'M', label: 'Medium (M)', recovery: '~15%', description: 'Standard balance for most uses' },
  { level: 'Q', label: 'Quality (Q)', recovery: '~25%', description: 'Tolerates moderate scuffs & dirt' },
  { level: 'H', label: 'High (H)', recovery: '~30%', description: 'Maximum resilience, rugged environments' },
];

const MODULE_SHAPES: Array<{
  id: ModuleShape;
  label: string;
  desc: string;
}> = [
  { id: 'square', label: 'Sharp Square', desc: 'Standard crisp edges' },
  { id: 'rounded', label: 'Smooth Squircle', desc: 'Curved modern corners' },
  { id: 'dot', label: 'Circular Dots', desc: 'Rounded circular points' },
  { id: 'diamond', label: 'Folk Diamond', desc: '45-degree angled rhombus' },
  { id: 'connected', label: 'Connected Flow', desc: 'Organic unified clusters' },
];

const FINDER_SHAPES: Array<{
  id: FinderShape;
  label: string;
  desc: string;
}> = [
  { id: 'square', label: 'Square Eyes', desc: 'Standard 7x7 concentric boxes' },
  { id: 'rounded', label: 'Curved Eyes', desc: 'Rounded concentric frames' },
  { id: 'circle-ring', label: 'Concentric Rings', desc: 'Circular target concentric rings' },
];

const ART_STYLES: Array<{
  id: MadhubaniArtStyle;
  label: string;
  desc: string;
}> = [
  { id: 'none', label: 'Crisp Solid', desc: 'Pure geometric fill' },
  { id: 'katchni', label: 'Katchni Hatching', desc: 'Fine hand-drawn parallel diagonal lines' },
  { id: 'godna', label: 'Godna Stipple', desc: 'Sacred concentric dot center marks' },
  { id: 'bharni', label: 'Bharni Border', desc: 'Traditional double-line module inset' },
];

const GRADIENT_PRESETS = [
  { name: 'Sunrise', fg: '#C54845', grad: '#F79454' },
  { name: 'Pond', fg: '#13504D', grad: '#2F7A72' },
  { name: 'Garden', fg: '#13504D', grad: '#A5B596' },
];

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  style,
  onChange,
  activePresetId,
  onApplyPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert('Image size exceeds 2.5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange('bgImage', dataUrl);
      if (!style.bgImageOpacity) {
        onChange('bgImageOpacity', 0.25);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onChange('bgImage', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Presets Selector */}
      <div
        className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <Corner position="top-right" size={24} strokeColor="#13504D" fillColor="#F79454" />
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-vermilion" />
            <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
              Madhubani Heritage Presets
            </h3>
          </div>
          {activePresetId && (
            <span className="text-[11px] font-bold text-peacock-deep bg-saffron-50 px-2.5 py-0.5 rounded-full border border-saffron-300">
              Active: {PRESETS.find((p) => p.id === activePresetId)?.name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-peacock-deep ${
                  isSelected
                    ? 'border-2 border-peacock-deep bg-peacock/10 shadow-sm ring-1 ring-peacock-deep/20'
                    : 'border-paper-border bg-paper hover:border-peacock/40 hover:bg-paper-2'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-peacock-deep/20 flex-shrink-0"
                      style={{ backgroundColor: preset.style.fgColor }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-peacock-deep/20 flex-shrink-0"
                      style={{ backgroundColor: preset.style.gradientColor || preset.style.bgColor }}
                    />
                  </div>
                  {preset.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-paper-2 text-peacock-deep border border-paper-border">
                      {preset.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-peacock-deep">{preset.name}</p>
                  <p className="text-[10px] text-ink/65 line-clamp-1 mt-0.5">{preset.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Module Geometry & Finder Patterns */}
      <div
        className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Shapes className="w-4 h-4 text-peacock-deep" />
          <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
            Module Geometry & Finder Patterns
          </h3>
        </div>

        {/* Module Shape Options */}
        <div className="mb-4">
          <label className="block text-xs font-heading font-semibold text-peacock-deep mb-2">
            Module Shape (Data Grid)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {MODULE_SHAPES.map((shape) => {
              const isSelected = (style.moduleShape || 'square') === shape.id;
              return (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => onChange('moduleShape', shape.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-peacock-deep ${
                    isSelected
                      ? 'border-2 border-peacock-deep bg-peacock/10 text-peacock-deep ring-1 ring-peacock-deep/20 font-bold'
                      : 'border-paper-border bg-paper hover:bg-paper-2 text-ink'
                  }`}
                >
                  {/* Miniature Shape Preview */}
                  <div className="w-6 h-6 flex items-center justify-center mb-1">
                    {shape.id === 'square' && (
                      <div className="w-4 h-4 bg-peacock-deep" />
                    )}
                    {shape.id === 'rounded' && (
                      <div className="w-4 h-4 bg-peacock-deep rounded-md" />
                    )}
                    {shape.id === 'dot' && (
                      <div className="w-4 h-4 bg-peacock-deep rounded-full" />
                    )}
                    {shape.id === 'diamond' && (
                      <div className="w-3.5 h-3.5 bg-peacock-deep rotate-45 transform" />
                    )}
                    {shape.id === 'connected' && (
                      <div className="flex gap-0.5">
                        <div className="w-2.5 h-4 bg-peacock-deep rounded-l-full" />
                        <div className="w-2.5 h-4 bg-peacock-deep rounded-r-full" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold">{shape.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Finder Pattern Options */}
        <div>
          <label className="block text-xs font-heading font-semibold text-peacock-deep mb-2">
            Finder Patterns (Corner Eyes)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {FINDER_SHAPES.map((finder) => {
              const isSelected = (style.finderShape || 'square') === finder.id;
              return (
                <button
                  key={finder.id}
                  type="button"
                  onClick={() => onChange('finderShape', finder.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-peacock-deep ${
                    isSelected
                      ? 'border-2 border-peacock-deep bg-peacock/10 text-peacock-deep ring-1 ring-peacock-deep/20 font-bold'
                      : 'border-paper-border bg-paper hover:bg-paper-2 text-ink'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center mb-1">
                    {finder.id === 'square' && (
                      <div className="w-5 h-5 border-2 border-peacock-deep flex items-center justify-center">
                        <div className="w-2 h-2 bg-peacock-deep" />
                      </div>
                    )}
                    {finder.id === 'rounded' && (
                      <div className="w-5 h-5 border-2 border-peacock-deep rounded-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-peacock-deep rounded-sm" />
                      </div>
                    )}
                    {finder.id === 'circle-ring' && (
                      <div className="w-5 h-5 border-2 border-peacock-deep rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-peacock-deep rounded-full" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold">{finder.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Colors & Foreground Gradients */}
      <div
        className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-peacock-deep" />
          <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
            Colors & Gradients
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Foreground Color */}
          <div>
            <label className="block text-xs font-heading font-semibold text-peacock-deep mb-1.5">
              Foreground (Primary)
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-paper rounded-2xl border border-paper-border">
              <input
                type="color"
                value={style.fgColor}
                onChange={(e) => onChange('fgColor', e.target.value)}
                className="w-9 h-9 rounded-xl border border-paper-border cursor-pointer bg-transparent"
                title="Choose foreground color"
              />
              <input
                type="text"
                value={style.fgColor}
                onChange={(e) => onChange('fgColor', e.target.value)}
                className="flex-1 bg-transparent text-xs font-mono font-semibold px-2 focus:outline-none uppercase text-ink"
                maxLength={7}
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-xs font-heading font-semibold text-peacock-deep mb-1.5">
              Background (Paper)
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-paper rounded-2xl border border-paper-border">
              <input
                type="color"
                value={style.bgColor}
                onChange={(e) => onChange('bgColor', e.target.value)}
                className="w-9 h-9 rounded-xl border border-paper-border cursor-pointer bg-transparent"
                title="Choose background color"
              />
              <input
                type="text"
                value={style.bgColor}
                onChange={(e) => onChange('bgColor', e.target.value)}
                className="flex-1 bg-transparent text-xs font-mono font-semibold px-2 focus:outline-none uppercase text-ink"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* Gradient Options */}
        <div className="pt-3 border-t border-paper-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-heading font-semibold text-peacock-deep">
              Foreground Gradient Flow
            </label>
            <div className="flex gap-1 bg-paper p-1 rounded-xl border border-paper-border">
              {(['none', 'linear', 'radial'] as GradientType[]).map((gType) => (
                <button
                  key={gType}
                  type="button"
                  onClick={() => onChange('gradientType', gType)}
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg capitalize transition-colors ${
                    (style.gradientType || 'none') === gType
                      ? 'bg-peacock-deep text-white shadow-xs'
                      : 'text-ink/70 hover:text-peacock-deep'
                  }`}
                >
                  {gType}
                </button>
              ))}
            </div>
          </div>

          {style.gradientType && style.gradientType !== 'none' && (
            <div className="mt-3 p-3 bg-paper rounded-2xl border border-paper-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-peacock-deep">Secondary Gradient Tone:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.gradientColor || '#C54845'}
                    onChange={(e) => onChange('gradientColor', e.target.value)}
                    className="w-7 h-7 rounded-lg border border-paper-border cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono uppercase font-bold text-peacock-deep">
                    {style.gradientColor || '#C54845'}
                  </span>
                </div>
              </div>

              {/* Quick Gradient Presets */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-ink/60">Quick Duos:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {GRADIENT_PRESETS.map((gp) => (
                    <button
                      key={gp.name}
                      type="button"
                      onClick={() => {
                        onChange('fgColor', gp.fg);
                        onChange('gradientColor', gp.grad);
                      }}
                      className="px-2 py-0.5 text-[10px] font-semibold rounded-lg bg-paper-2 hover:bg-paper-border text-peacock-deep border border-paper-border transition-colors flex items-center gap-1"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${gp.fg}, ${gp.grad})`,
                        }}
                      />
                      <span>{gp.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Madhubani Folk Art Accents & Paper Texture */}
      <div
        className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-peacock-deep" />
          <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
            Madhubani Folk Art & Texture
          </h3>
        </div>

        {/* Motif Hatching Style */}
        <div className="mb-4">
          <label className="block text-xs font-heading font-semibold text-peacock-deep mb-2">
            Module Hatching (Art Style)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ART_STYLES.map((art) => {
              const isSelected = (style.artStyle || 'none') === art.id;
              return (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => onChange('artStyle', art.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-peacock-deep ${
                    isSelected
                      ? 'border-2 border-peacock-deep bg-peacock/10 text-peacock-deep ring-1 ring-peacock-deep/20 font-bold'
                      : 'border-paper-border bg-paper hover:bg-paper-2 text-ink'
                  }`}
                >
                  <span className="text-xs font-semibold">{art.label}</span>
                  <span className="text-[9px] text-ink/65 line-clamp-1 mt-0.5">{art.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Indian Wasli Paper Texture Toggle */}
        <div className="p-3 bg-paper rounded-2xl border border-paper-border flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-heading font-bold text-peacock-deep">
              Handmade Wasli Paper Texture
            </p>
            <p className="text-[10px] text-ink/65">
              Organic Mithila fiber wash and mineral pigment tinting
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(style.paintedTexture)}
              onChange={(e) => onChange('paintedTexture', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-paper-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-peacock-deep" />
          </label>
        </div>

        {/* Image Underlay Blend */}
        <div className="p-3 bg-paper rounded-2xl border border-paper-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-peacock-deep" />
              <div>
                <p className="text-xs font-heading font-bold text-peacock-deep">
                  Image-Blend Underlay
                </p>
                <p className="text-[10px] text-ink/65">
                  Client-side artwork underlay with protected finder zones
                </p>
              </div>
            </div>
            {style.bgImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-[10px] font-semibold text-vermilion hover:text-vermilion-500 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {!style.bgImage ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="bg-image-upload"
              />
              <label
                htmlFor="bg-image-upload"
                className="w-full py-2.5 px-3 border border-dashed border-peacock/30 hover:border-peacock-deep rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-peacock-deep bg-paper-2 hover:bg-paper cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Artwork / Image</span>
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink/75 font-medium">Blend Opacity:</span>
                <span className="font-mono font-bold text-peacock-deep">
                  {Math.round((style.bgImageOpacity || 0.25) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.7}
                step={0.05}
                value={style.bgImageOpacity || 0.25}
                onChange={(e) => onChange('bgImageOpacity', parseFloat(e.target.value))}
                className="w-full h-2 bg-paper-border rounded-lg appearance-none cursor-pointer accent-peacock-deep"
              />
            </div>
          )}
        </div>
      </div>

      {/* 5. Dimensions & Layout */}
      <div
        className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-peacock-deep" />
          <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
            Dimensions & Quiet Zone
          </h3>
        </div>

        <div className="space-y-4">
          {/* Size Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-heading font-semibold text-peacock-deep">
                Resolution / Size
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={128}
                  max={1024}
                  step={16}
                  value={style.size}
                  onChange={(e) => onChange('size', Math.min(1024, Math.max(128, Number(e.target.value) || 300)))}
                  className="w-16 px-2 py-0.5 text-xs text-right font-mono font-bold rounded-lg border border-paper-border bg-paper text-ink"
                />
                <span className="text-[11px] text-ink/65">px</span>
              </div>
            </div>
            <input
              type="range"
              min={128}
              max={1024}
              step={16}
              value={style.size}
              onChange={(e) => onChange('size', Number(e.target.value))}
              className="w-full h-2 bg-paper-border rounded-lg appearance-none cursor-pointer accent-peacock-deep"
            />
            <div className="flex justify-between text-[10px] text-ink/65 mt-1 font-mono">
              <span>128px</span>
              <span>320px (Recommended)</span>
              <span>1024px</span>
            </div>
          </div>

          {/* Margin Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-heading font-semibold text-peacock-deep">
                Quiet Zone Margin
              </label>
              <span className="text-xs font-mono font-bold text-peacock-deep">
                {style.margin} {style.margin === 1 ? 'module' : 'modules'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={style.margin}
              onChange={(e) => onChange('margin', Number(e.target.value))}
              className="w-full h-2 bg-paper-border rounded-lg appearance-none cursor-pointer accent-peacock-deep"
            />
            <div className="flex justify-between text-[10px] text-ink/65 mt-1 font-mono">
              <span>0 (None)</span>
              <span>2 (Compact)</span>
              <span>4 (ISO Standard)</span>
              <span>8 (Wide)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Error Correction Level (ECL) */}
      <div
        className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-peacock-deep" />
          <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
            Error Correction Level (ECL)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ECL_OPTIONS.map((opt) => {
            const isSelected = style.ecl === opt.level;
            return (
              <button
                key={opt.level}
                type="button"
                onClick={() => onChange('ecl', opt.level)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-peacock-deep ${
                  isSelected
                    ? 'border-2 border-peacock-deep bg-peacock/10 text-peacock-deep ring-1 ring-peacock-deep/20 font-bold'
                    : 'border-paper-border bg-paper hover:bg-paper-2 text-ink'
                }`}
              >
                <span className="text-xs font-extrabold">{opt.level}</span>
                <span className="text-[10px] text-ink/70 mt-0.5">{opt.recovery}</span>
                <span className="text-[9px] text-ink/60 line-clamp-1 mt-1 opacity-80">{opt.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
