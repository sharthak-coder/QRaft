import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Handcrafted Madhubani QR Icon Mark */}
      <div
        className={`${iconSizes[size]} relative p-1 bg-paper-2 rounded-xl shadow-sm border border-peacock-deep/20 flex-shrink-0 grid grid-cols-2 gap-1 overflow-hidden`}
        style={{ outline: '1px solid rgba(19, 80, 77, 0.15)', outlineOffset: '1px' }}
        aria-hidden="true"
      >
        <span className="bg-peacock-deep rounded-[3px] transition-transform hover:scale-105" />
        <span className="bg-vermilion rounded-[3px] transition-transform hover:scale-105" />
        <span className="bg-saffron rounded-[3px] transition-transform hover:scale-105" />
        <span className="bg-sage rounded-[3px] transition-transform hover:scale-105" />
        {/* Center Tilak Dot */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-paper border border-peacock-deep/40 shadow-sm" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-heading font-extrabold tracking-tight text-peacock-deep ${textSizes[size]}`}>
            QR<span className="text-vermilion">aft</span>
          </span>
        </div>
      )}
    </div>
  );
};
