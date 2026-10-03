import React from 'react';
import { QrType } from '../../types';
import { Globe, Type, Mail, Phone, Wifi } from 'lucide-react';

interface TypeSelectorProps {
  activeType: QrType;
  onChange: (type: QrType) => void;
}

const QR_TYPES: Array<{
  id: QrType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'url', label: 'URL / Link', description: 'Websites & forms', icon: Globe },
  { id: 'text', label: 'Plain Text', description: 'Notes & messages', icon: Type },
  { id: 'email', label: 'Email', description: 'Pre-filled mail', icon: Mail },
  { id: 'phone', label: 'Phone Call', description: 'Direct dialing', icon: Phone },
  { id: 'wifi', label: 'Wi-Fi Network', description: 'One-tap connect', icon: Wifi },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ activeType, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-surface-muted uppercase tracking-wider mb-2">
        Select QR Code Type
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {QR_TYPES.map((t) => {
          const isActive = activeType === t.id;
          const Icon = t.icon;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center group focus:outline-none focus:ring-2 focus:ring-google-blue ${
                isActive
                  ? 'bg-gradient-to-b from-blue-50/90 to-white border-google-blue-royal text-google-blue-royal shadow-sm ring-1 ring-google-blue-royal/20'
                  : 'bg-white/80 border-surface-border hover:border-slate-300 text-surface-text hover:bg-surface-soft'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'bg-google-blue-royal text-white shadow-sm'
                    : 'bg-surface-soft text-surface-muted group-hover:text-surface-text'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">{t.label}</span>
              <span className="text-[10px] text-surface-muted mt-0.5 hidden sm:block">{t.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
