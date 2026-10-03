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
import { DoubleLineBorder } from '../../art/DoubleLineBorder';

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
  { id: 'rounded', label: 'Rounded Eyes', desc: 'Smooth rounded border corners' },
  { id: 'circle-ring', label: 'Concentric Rings', desc: 'Traditional folk circular eye' },
];

const ART_STYLES: Array<{
  id: MadhubaniArtStyle;
  label: string;
  desc: string;
}> = [
  { id: 'none', label: 'Standard Solid', desc: 'Clean vector module fill' },
  { id: 'katchni', label: 'Katchni Hatching', desc: 'Fine delicate diagonal line strokes' },
  { id: 'bharni', label: 'Bharni Solid & Dot', desc: 'Rich filled modules with center eye' },
  { id: 'godna', label: 'Godna Stippling', desc: 'Tattoo-inspired stippled concentric dots' },
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

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange('bgImage', dataUrl);
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
      <DoubleLineBorder
        variant="kachni"
        className="p-5 shadow-folk-card bg-rice"
        strokeColor="#1A3644"
        bandColor="#D99B26"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sindoor" />
            <h3 className="text-xs font-heading font-bold text-indigo-ink uppercase tracking-wider">
              Madhubani Heritage Presets
            </h3>
          </div>
          {activePresetId && (
            <span className="text-[11px] font-bold text-indigo-ink bg-haldi px-2.5 py-0.5 rounded-full border border-indigo-ink shadow-xs">
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
                className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-haldi ${
                  isSelected
                    ? 'border-indigo-ink bg-haldi/20 text-indigo-ink shadow-sm font-bold'
                    : 'border-rice-border bg-rice hover:border-indigo-ink/40 hover:bg-rice-panel text-indigo-ink'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-indigo-ink/30 flex-shrink-0"
                      style={{ backgroundColor: preset.style.fgColor }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-indigo-ink/30 flex-shrink-0"
                      style={{ backgroundColor: preset.style.bgColor }}
                    />
                  </div>
                  {preset.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rice border border-rice-border text-indigo-ink">
                      {preset.badge}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-xs font-heading font-bold leading-tight group-hover:text-sindoor transition-colors">
                    {preset.name}
                  </p>
                  <p className="text-[10px] text-indigo-ink/70 line-clamp-2 mt-0.5 leading-snug">
                    {preset.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </DoubleLineBorder>

      {/* 2. Module Geometry & Finder Patterns */}
      <DoubleLineBorder
        variant="bharni"
        className="p-5 shadow-folk-card bg-rice"
        strokeColor="#1A3644"
        bandColor="#D99B26"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shapes className="w-4 h-4 text-indigo-ink" />
          <h3 className="text-xs font-heading font-bold text-indigo-ink uppercase tracking-wider">
            Module Geometry & Finder Patterns
          </h3>
        </div>

        {/* Module Shape Options */}
        <div className="mb-4">
          <label className="block text-xs font-heading font-semibold text-indigo-ink mb-2">
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
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-haldi ${
                    isSelected
                      ? 'border-indigo-ink bg-haldi/20 text-indigo-ink font-bold shadow-xs'
                      : 'border-rice-border bg-rice hover:bg-rice-panel text-indigo-ink'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center mb-1">
                    {shape.id === 'square' && (
                      <div className="w-4 h-4 bg-indigo-ink" />
                    )}
                    {shape.id === 'rounded' && (
                      <div className="w-4 h-4 bg-indigo-ink rounded-md" />
                    )}
                    {shape.id === 'dot' && (
                      <div className="w-4 h-4 bg-indigo-ink rounded-full" />
                    )}
                    {shape.id === 'diamond' && (
                      <div className="w-3.5 h-3.5 bg-indigo-ink rotate-45" />
                    )}
                    {shape.id === 'connected' && (
                      <div className="flex items-center -space-x-1">
                        <div className="w-3 h-3 bg-indigo-ink rounded-full" />
                        <div className="w-3 h-3 bg-indigo-ink rounded-full" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-heading font-bold">{shape.label}</span>
                  <span className="text-[9px] text-indigo-ink/65 mt-0.5 leading-none hidden sm:block">
                    {shape.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Finder Eye Shapes */}
        <div>
          <label className="block text-xs font-heading font-semibold text-indigo-ink mb-2">
            Corner Finder Pattern Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {FINDER_SHAPES.map((finder) => {
              const isSelected = (style.finderShape || 'square') === finder.id;
              return (
                <button
                  key={finder.id}
                  type="button"
                  onClick={() => onChange('finderShape', finder.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-haldi ${
                    isSelected
                      ? 'border-indigo-ink bg-haldi/20 text-indigo-ink font-bold shadow-xs'
                      : 'border-rice-border bg-rice hover:bg-rice-panel text-indigo-ink'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl border border-rice-border bg-rice flex items-center justify-center flex-shrink-0">
                    {finder.id === 'square' && (
                      <div className="w-5 h-5 border-2 border-indigo-ink flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-ink" />
                      </div>
                    )}
                    {finder.id === 'rounded' && (
                      <div className="w-5 h-5 border-2 border-indigo-ink rounded-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-ink rounded-xs" />
                      </div>
                    )}
                    {finder.id === 'circle-ring' && (
                      <div className="w-5 h-5 border-2 border-indigo-ink rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-ink rounded-full" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-heading font-bold">{finder.label}</p>
                    <p className="text-[10px] text-indigo-ink/65">{finder.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </DoubleLineBorder>

      {/* 3. Color Palette & Gradients */}
      <DoubleLineBorder
        variant="fish-scale"
        className="p-5 shadow-folk-card bg-rice"
        strokeColor="#1A3644"
        bandColor="#D99B26"
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-indigo-ink" />
          <h3 className="text-xs font-heading font-bold text-indigo-ink uppercase tracking-wider">
            Color Palette & Gradients
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Foreground Color */}
          <div>
            <label className="block text-xs font-heading font-semibold text-indigo-ink mb-1.5">
              Foreground (Ink)
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-rice rounded-2xl border border-rice-border">
              <input
                type="color"
                value={style.fgColor}
                onChange={(e) => onChange('fgColor', e.target.value)}
                className="w-9 h-9 rounded-xl border border-rice-border cursor-pointer bg-transparent"
                title="Choose foreground color"
              />
              <input
                type="text"
                value={style.fgColor}
                onChange={(e) => onChange('fgColor', e.target.value)}
                className="flex-1 bg-transparent text-xs font-mono font-semibold px-2 focus:outline-none uppercase text-indigo-ink"
                maxLength={7}
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-xs font-heading font-semibold text-indigo-ink mb-1.5">
              Background (Paper)
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-rice rounded-2xl border border-rice-border">
              <input
                type="color"
                value={style.bgColor}
                onChange={(e) => onChange('bgColor', e.target.value)}
                className="w-9 h-9 rounded-xl border border-rice-border cursor-pointer bg-transparent"
                title="Choose background color"
              />
              <input
                type="text"
                value={style.bgColor}
                onChange={(e) => onChange('bgColor', e.target.value)}
                className="flex-1 bg-transparent text-xs font-mono font-semibold px-2 focus:outline-none uppercase text-indigo-ink"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* Gradient Options */}
        <div className="pt-3 border-t border-rice-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-heading font-semibold text-indigo-ink">
              Foreground Gradient Flow
            </label>
            <div className="flex gap-1 bg-rice-panel p-1 rounded-xl border border-rice-border">
              {(['none', 'linear', 'radial'] as GradientType[]).map((gType) => (
                <button
                  key={gType}
                  type="button"
                  onClick={() => onChange('gradientType', gType)}
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg capitalize transition-colors ${
                    (style.gradientType || 'none') === gType
                      ? 'bg-indigo-ink text-rice shadow-xs'
                      : 'text-indigo-ink/70 hover:text-indigo-ink'
                  }`}
                >
                  {gType}
                </button>
              ))}
            </div>
          </div>

          {style.gradientType && style.gradientType !== 'none' && (
            <div className="mt-2 p-3 bg-rice-panel rounded-2xl border border-rice-border space-y-2">
              <label className="block text-[11px] font-heading font-semibold text-indigo-ink">
                Secondary Gradient Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.gradientColor || '#D99B26'}
                  onChange={(e) => onChange('gradientColor', e.target.value)}
                  className="w-8 h-8 rounded-xl border border-rice-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={style.gradientColor || '#D99B26'}
                  onChange={(e) => onChange('gradientColor', e.target.value)}
                  className="flex-1 bg-rice text-xs font-mono font-semibold px-2 py-1.5 rounded-xl border border-rice-border uppercase text-indigo-ink"
                  maxLength={7}
                />
              </div>
            </div>
          )}
        </div>
      </DoubleLineBorder>

      {/* 4. Heritage Art Finishes & Image Blend */}
      <DoubleLineBorder
        variant="kachni"
        className="p-5 shadow-folk-card bg-rice"
        strokeColor="#1A3644"
        bandColor="#D99B26"
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-indigo-ink" />
          <h3 className="text-xs font-heading font-bold text-indigo-ink uppercase tracking-wider">
            Mithila Art Finishes & Underlay
          </h3>
        </div>

        {/* Traditional Fill Hatches */}
        <div className="mb-4">
          <label className="block text-xs font-heading font-semibold text-indigo-ink mb-2">
            Traditional Linework Fill Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ART_STYLES.map((art) => {
              const isSelected = (style.artStyle || 'none') === art.id;
              return (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => onChange('artStyle', art.id)}
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all focus:outline-none focus:ring-2 focus:ring-haldi ${
                    isSelected
                      ? 'border-indigo-ink bg-haldi/20 text-indigo-ink font-bold shadow-xs'
                      : 'border-rice-border bg-rice hover:bg-rice-panel text-indigo-ink'
                  }`}
                >
                  <p className="text-xs font-heading font-bold">{art.label}</p>
                  <p className="text-[9px] text-indigo-ink/65 mt-0.5 leading-tight">{art.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Painted Wasli Paper Texture Switch */}
        <div className="flex items-center justify-between p-3 bg-rice-panel rounded-2xl border border-rice-border mb-4">
          <div>
            <p className="text-xs font-heading font-bold text-indigo-ink">
              Tactile Mineral Pigment Wash
            </p>
            <p className="text-[10px] text-indigo-ink/65">
              Simulates hand-ground mineral color variations on handmade paper
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={style.paintedTexture || false}
              onChange={(e) => onChange('paintedTexture', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-rice-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-rice after:border-rice-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-ink" />
          </label>
        </div>

        {/* Image Underlay Blend */}
        <div className="p-3 bg-rice rounded-2xl border border-rice-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-ink" />
              <div>
                <p className="text-xs font-heading font-bold text-indigo-ink">
                  Image-Blend Underlay
                </p>
                <p className="text-[10px] text-indigo-ink/65">
                  Client-side artwork underlay with protected finder zones
                </p>
              </div>
            </div>
            {style.bgImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-[10px] font-semibold text-sindoor hover:text-sindoor-600 flex items-center gap-1"
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
                className="w-full py-2.5 px-3 border border-dashed border-indigo-ink/30 hover:border-indigo-ink rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-indigo-ink bg-rice-panel hover:bg-rice cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Artwork / Image</span>
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-ink/75 font-medium">Blend Opacity:</span>
                <span className="font-mono font-bold text-indigo-ink">
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
                className="w-full h-2 bg-rice-border rounded-lg appearance-none cursor-pointer accent-indigo-ink"
              />
            </div>
          )}
        </div>
      </DoubleLineBorder>

      {/* 5. Dimensions & Layout */}
      <DoubleLineBorder
        variant="bharni"
        className="p-5 shadow-folk-card bg-rice"
        strokeColor="#1A3644"
        bandColor="#D99B26"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-indigo-ink" />
          <h3 className="text-xs font-heading font-bold text-indigo-ink uppercase tracking-wider">
            Dimensions & Quiet Zone
          </h3>
        </div>

        <div className="space-y-4">
          {/* Size Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-heading font-semibold text-indigo-ink">
                Resolution / Size
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono font-bold text-indigo-ink">
                  {style.size}px
                </span>
              </div>
            </div>
            <input
              type="range"
              min={160}
              max={640}
              step={16}
              value={style.size}
              onChange={(e) => onChange('size', parseInt(e.target.value, 10))}
              className="w-full h-2 bg-rice-border rounded-lg appearance-none cursor-pointer accent-indigo-ink"
            />
            <div className="flex justify-between text-[10px] text-indigo-ink/60 mt-1 font-mono">
              <span>160px</span>
              <span>320px (Default)</span>
              <span>640px (High-Res)</span>
            </div>
          </div>

          {/* Margin (Quiet Zone) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-heading font-semibold text-indigo-ink">
                Quiet Zone Margin
              </label>
              <span className="text-xs font-mono font-bold text-indigo-ink">
                {style.margin} module{style.margin === 1 ? '' : 's'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={style.margin}
              onChange={(e) => onChange('margin', parseInt(e.target.value, 10))}
              className="w-full h-2 bg-rice-border rounded-lg appearance-none cursor-pointer accent-indigo-ink"
            />
            <p className="text-[10px] text-indigo-ink/65 mt-1">
              {style.margin < 2
                ? 'Warning: low margin may interfere with edge detection.'
                : 'Generous quiet zone ensures reliable camera targeting.'}
            </p>
          </div>
        </div>

        {/* Error Correction Level */}
        <div className="pt-4 border-t border-rice-border mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Shield className="w-3.5 h-3.5 text-indigo-ink" />
            <label className="text-xs font-heading font-semibold text-indigo-ink">
              Error Correction Level (ECL)
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ECL_OPTIONS.map((opt) => {
              const isSelected = style.ecl === opt.level;
              return (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => onChange('ecl', opt.level)}
                  className={`p-2.5 rounded-2xl border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-haldi ${
                    isSelected
                      ? 'border-indigo-ink bg-haldi/20 text-indigo-ink font-bold shadow-xs'
                      : 'border-rice-border bg-rice hover:bg-rice-panel text-indigo-ink'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-heading font-bold">{opt.level}</span>
                    <span className="text-[10px] font-mono text-leaf font-semibold">
                      {opt.recovery}
                    </span>
                  </div>
                  <p className="text-[10px] text-indigo-ink/65 line-clamp-2 leading-tight">
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </DoubleLineBorder>
    </div>
  );
};
