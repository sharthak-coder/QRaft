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
      <label className="block text-xs font-heading font-bold text-indigo-ink uppercase tracking-wider mb-2">
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
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all text-center group focus:outline-none focus:ring-2 focus:ring-haldi ${
                isActive
                  ? 'bg-haldi border-indigo-ink text-indigo-ink shadow-sm font-bold'
                  : 'bg-rice border-rice-border hover:border-indigo-ink/40 text-indigo-ink hover:bg-rice-panel'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'bg-indigo-ink text-rice shadow-sm'
                    : 'bg-rice-panel text-indigo-ink/75 group-hover:text-indigo-ink'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-heading font-bold leading-tight">{t.label}</span>
              <span className="text-[10px] text-indigo-ink/70 mt-0.5 hidden sm:block">{t.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
