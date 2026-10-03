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
      {/* 4 Rounded Squares representing QR modules in Google Palette */}
      <div
        className={`${iconSizes[size]} grid grid-cols-2 gap-1 p-1 bg-white rounded-xl shadow-sm border border-surface-border/80 flex-shrink-0`}
        aria-hidden="true"
      >
        <span className="bg-google-blue rounded-[3px] transition-transform hover:scale-105" />
        <span className="bg-google-red rounded-[3px] transition-transform hover:scale-105" />
        <span className="bg-google-yellow rounded-[3px] transition-transform hover:scale-105" />
        <span className="bg-google-green rounded-[3px] transition-transform hover:scale-105" />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-heading font-extrabold tracking-tight text-surface-text ${textSizes[size]}`}>
            QR<span className="text-google-blue-royal">aft</span>
          </span>
        </div>
      )}
    </div>
  );
};
