import React from 'react';

export type DoubleLineVariant = 'kachni' | 'bharni' | 'fish-scale';

export interface DoubleLineBorderProps {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: DoubleLineVariant;
  strokeColor?: string;
  bandColor?: string;
  cornerBud?: boolean;
  style?: React.CSSProperties;
}

/**
 * Traditional Madhubani Double-Line Border
 * Features an outer and inner ink contour with a patterned band (kachni, bharni, or fish-scale)
 * and four corner lotus-bud ornaments.
 */
export const DoubleLineBorder: React.FC<DoubleLineBorderProps> = ({
  children,
  className = '',
  contentClassName = '',
  variant = 'kachni',
  strokeColor = '#1A3644',
  bandColor = '#D99B26',
  cornerBud = true,
  style,
}) => {
  return (
    <div
      className={`relative p-2.5 rounded-2xl bg-rice/95 transition-all ${className}`}
      style={{
        border: `2px solid ${strokeColor}`,
        boxShadow: `0 0 0 3px #F6F1E8, 0 0 0 4.5px ${strokeColor}`,
        ...style,
      }}
    >
      {/* Pattern Overlay Band according to variant */}
      {variant === 'kachni' && (
        <div
          className="absolute inset-[3px] pointer-events-none rounded-[13px] opacity-15 overflow-hidden z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${strokeColor}, ${strokeColor} 1px, transparent 1px, transparent 6px), repeating-linear-gradient(-45deg, ${strokeColor}, ${strokeColor} 1px, transparent 1px, transparent 6px)`,
            maskImage: 'linear-gradient(to bottom, black 0%, black 8px, transparent 8px, transparent calc(100% - 8px), black calc(100% - 8px)), linear-gradient(to right, black 0%, black 8px, transparent 8px, transparent calc(100% - 8px), black calc(100% - 8px))',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 8px, transparent 8px, transparent calc(100% - 8px), black calc(100% - 8px)), linear-gradient(to right, black 0%, black 8px, transparent 8px, transparent calc(100% - 8px), black calc(100% - 8px))',
          }}
        />
      )}

      {variant === 'bharni' && (
        <div
          className="absolute inset-[3px] pointer-events-none rounded-[13px] opacity-20 border-[3px] z-0"
          style={{ borderColor: bandColor }}
        />
      )}

      {variant === 'fish-scale' && (
        <div
          className="absolute inset-[2px] pointer-events-none rounded-[14px] opacity-20 overflow-hidden z-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, transparent 4px, ${strokeColor} 4.5px, ${strokeColor} 5.5px, transparent 6px)`,
            backgroundSize: '12px 6px',
            backgroundRepeat: 'repeat-x',
          }}
        />
      )}

      {/* Lotus Bud Corner Ornaments */}
      {cornerBud && (
        <>
          {/* Top-Left */}
          <svg className="absolute -top-2 -left-2 w-5 h-5 pointer-events-none z-10" viewBox="0 0 20 20" fill="none">
            <path d="M10 2 C7 6 5 10 5 13 C5 16 8 18 10 18 C12 18 15 16 15 13 C15 10 13 6 10 2 Z" fill="#F6F1E8" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M10 5 C8.5 8 7 11 7 13 C7 15 8.5 16.5 10 16.5 C11.5 16.5 13 15 13 13 C13 11 11.5 8 10 5 Z" fill={bandColor} />
            <circle cx="10" cy="13" r="1.5" fill="#A62B2B" />
          </svg>

          {/* Top-Right */}
          <svg className="absolute -top-2 -right-2 w-5 h-5 pointer-events-none z-10 rotate-90" viewBox="0 0 20 20" fill="none">
            <path d="M10 2 C7 6 5 10 5 13 C5 16 8 18 10 18 C12 18 15 16 15 13 C15 10 13 6 10 2 Z" fill="#F6F1E8" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M10 5 C8.5 8 7 11 7 13 C7 15 8.5 16.5 10 16.5 C11.5 16.5 13 15 13 13 C13 11 11.5 8 10 5 Z" fill={bandColor} />
            <circle cx="10" cy="13" r="1.5" fill="#A62B2B" />
          </svg>

          {/* Bottom-Left */}
          <svg className="absolute -bottom-2 -left-2 w-5 h-5 pointer-events-none z-10 -rotate-90" viewBox="0 0 20 20" fill="none">
            <path d="M10 2 C7 6 5 10 5 13 C5 16 8 18 10 18 C12 18 15 16 15 13 C15 10 13 6 10 2 Z" fill="#F6F1E8" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M10 5 C8.5 8 7 11 7 13 C7 15 8.5 16.5 10 16.5 C11.5 16.5 13 15 13 13 C13 11 11.5 8 10 5 Z" fill={bandColor} />
            <circle cx="10" cy="13" r="1.5" fill="#A62B2B" />
          </svg>

          {/* Bottom-Right */}
          <svg className="absolute -bottom-2 -right-2 w-5 h-5 pointer-events-none z-10 rotate-180" viewBox="0 0 20 20" fill="none">
            <path d="M10 2 C7 6 5 10 5 13 C5 16 8 18 10 18 C12 18 15 16 15 13 C15 10 13 6 10 2 Z" fill="#F6F1E8" stroke={strokeColor} strokeWidth="1.2" />
            <path d="M10 5 C8.5 8 7 11 7 13 C7 15 8.5 16.5 10 16.5 C11.5 16.5 13 15 13 13 C13 11 11.5 8 10 5 Z" fill={bandColor} />
            <circle cx="10" cy="13" r="1.5" fill="#A62B2B" />
          </svg>
        </>
      )}

      {/* Inner Content Area */}
      <div className={`relative z-10 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};
