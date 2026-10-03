import React from 'react';
import { QrStyle, ErrorCorrectionLevel } from '../../types';
import { PRESETS } from '../../lib/presets';
import { Sliders, Palette, Shield, Sparkles } from 'lucide-react';
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

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  style,
  onChange,
  activePresetId,
  onApplyPreset,
}) => {
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
              Style Presets
            </h3>
          </div>
          {activePresetId && (
            <span className="text-[11px] font-bold text-peacock-deep bg-saffron-50 px-2.5 py-0.5 rounded-full border border-saffron-300">
              Active: {PRESETS.find(p => p.id === activePresetId)?.name}
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
                      style={{ backgroundColor: preset.style.bgColor }}
                    />
                  </div>
                  {preset.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-paper-2 text-ink/70">
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

      {/* 2. Color Controls */}
      <div
        className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-peacock-deep" />
          <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
            Colors & Contrast
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Foreground Color */}
          <div>
            <label className="block text-xs font-heading font-semibold text-peacock-deep mb-1.5">
              Foreground (Modules)
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
              Background Color
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
      </div>

      {/* 3. Geometry & Sizing Controls */}
      <div
        className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-peacock-deep" />
          <h3 className="text-xs font-heading font-bold text-peacock-deep uppercase tracking-wider">
            Dimensions & Layout
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

      {/* 4. Error Correction Level (ECL) */}
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
