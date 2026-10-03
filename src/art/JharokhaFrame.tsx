import React from 'react';

export interface JharokhaFrameProps {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  strokeColor?: string;
  accentColor?: string;
  highlightColor?: string;
  style?: React.CSSProperties;
}

/**
 * Traditional Jharokha Folk-Window / Temple-Gateway Frame
 * 
 * Features an ornate arched top with a kalash finial, decorative lotus-bud row,
 * side pillars with repeating geometric motifs, and a stepped base.
 * The inner opening is guaranteed to be a clean, unencumbered rectangle with generous
 * margins so the QR code and its quiet zone are never touched.
 */
export const JharokhaFrame: React.FC<JharokhaFrameProps> = ({
  children,
  className = '',
  innerClassName = '',
  strokeColor = '#1A3644',
  accentColor = '#A62B2B',
  highlightColor = '#D99B26',
  style,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center bg-rice rounded-3xl p-4 sm:p-5 shadow-folk-card border-2 transition-all ${className}`}
      style={{
        borderColor: strokeColor,
        boxShadow: `0 0 0 2px #F6F1E8, 0 0 0 3.5px ${strokeColor}`,
        ...style,
      }}
    >
      {/* Top Arched Temple Gateway Crown with Kalash Finial */}
      <div className="w-full flex flex-col items-center mb-2 pointer-events-none select-none">
        {/* Kalash Spire */}
        <svg className="w-8 h-8 -mt-2 mb-0.5" viewBox="0 0 32 32" fill="none">
          {/* Base pot */}
          <ellipse cx="16" cy="24" rx="7" ry="4" fill="#F6F1E8" stroke={strokeColor} strokeWidth="1.4" />
          <path d="M12 21 C12 18 14 16 16 16 C18 16 20 18 20 21" stroke={strokeColor} strokeWidth="1.4" />
          {/* Spire coconut & mango leaves */}
          <path d="M16 6 C14 10 13 14 13 17 C15 18 17 18 19 17 C19 14 18 10 16 6 Z" fill={accentColor} stroke={strokeColor} strokeWidth="1.2" />
          <circle cx="16" cy="5" r="2" fill={highlightColor} stroke={strokeColor} strokeWidth="1" />
          {/* Side buds */}
          <circle cx="10" cy="20" r="1.5" fill={highlightColor} />
          <circle cx="22" cy="20" r="1.5" fill={highlightColor} />
        </svg>

        {/* Ornate Folk Gateway Arch */}
        <svg className="w-full max-w-[280px] h-9" viewBox="0 0 280 36" fill="none">
          {/* Outer Arch */}
          <path
            d="M10 34 C50 6 90 2 140 2 C190 2 230 6 270 34"
            stroke={strokeColor}
            strokeWidth="1.8"
            fill="none"
          />
          {/* Inner Arch */}
          <path
            d="M16 34 C52 11 90 8 140 8 C190 8 228 11 264 34"
            stroke={strokeColor}
            strokeWidth="1.2"
            fill="none"
          />
          {/* Central sun medallion in arch */}
          <circle cx="140" cy="8" r="4.5" fill={highlightColor} stroke={strokeColor} strokeWidth="1" />
          <circle cx="140" cy="8" r="2" fill={accentColor} />

          {/* Row of 7 Lotus Buds along the arch */}
          {[50, 80, 110, 140, 170, 200, 230].map((x, i) => (
            <g key={i} transform={`translate(${x - 6}, 16)`}>
              <path
                d="M6 1 C4 4 3 7 3 9 C4.5 10.5 7.5 10.5 9 9 C9 7 8 4 6 1 Z"
                fill={i % 2 === 0 ? accentColor : highlightColor}
                stroke={strokeColor}
                strokeWidth="0.8"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Main Inner Gateway Opening (Clean rectangle with generous quiet margin) */}
      <div className="relative w-full flex items-center justify-center my-1">
        {/* Left Side Pillar Motif */}
        <div className="hidden sm:flex flex-col items-center justify-around h-full pr-2 select-none pointer-events-none opacity-85">
          <svg className="w-4 h-48" viewBox="0 0 16 192" fill="none">
            <line x1="4" y1="0" x2="4" y2="192" stroke={strokeColor} strokeWidth="1.2" />
            <line x1="12" y1="0" x2="12" y2="192" stroke={strokeColor} strokeWidth="1.2" />
            {[20, 52, 84, 116, 148, 180].map((y, i) => (
              <polygon
                key={i}
                points={`8,${y - 8} 12,${y} 8,${y + 8} 4,${y}`}
                fill={i % 2 === 0 ? highlightColor : accentColor}
                stroke={strokeColor}
                strokeWidth="0.8"
              />
            ))}
          </svg>
        </div>

        {/* Clean Inner Window Opening */}
        <div
          className={`relative z-10 p-4 sm:p-5 rounded-2xl bg-rice shadow-inner border border-rice-border flex items-center justify-center ${innerClassName}`}
          style={{
            boxShadow: 'inset 0 2px 6px rgba(26, 54, 68, 0.05)',
          }}
        >
          {children}
        </div>

        {/* Right Side Pillar Motif */}
        <div className="hidden sm:flex flex-col items-center justify-around h-full pl-2 select-none pointer-events-none opacity-85">
          <svg className="w-4 h-48" viewBox="0 0 16 192" fill="none">
            <line x1="4" y1="0" x2="4" y2="192" stroke={strokeColor} strokeWidth="1.2" />
            <line x1="12" y1="0" x2="12" y2="192" stroke={strokeColor} strokeWidth="1.2" />
            {[20, 52, 84, 116, 148, 180].map((y, i) => (
              <polygon
                key={i}
                points={`8,${y - 8} 12,${y} 8,${y + 8} 4,${y}`}
                fill={i % 2 === 0 ? highlightColor : accentColor}
                stroke={strokeColor}
                strokeWidth="0.8"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Stepped Pedestal Base Plinth */}
      <div className="w-full flex flex-col items-center mt-2 pointer-events-none select-none">
        <svg className="w-full max-w-[280px] h-7" viewBox="0 0 280 28" fill="none">
          {/* Top step */}
          <rect x="20" y="2" width="240" height="7" rx="2" fill="#F6F1E8" stroke={strokeColor} strokeWidth="1.4" />
          {/* Middle step with kachni hatch marks */}
          <rect x="10" y="10" width="260" height="7" rx="2" fill="#F6F1E8" stroke={strokeColor} strokeWidth="1.4" />
          {[20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260].map((x, i) => (
            <line key={i} x1={x} y1="10" x2={x + 5} y2="17" stroke={highlightColor} strokeWidth="1.2" />
          ))}
          {/* Bottom stepped plinth */}
          <rect x="2" y="18" width="276" height="8" rx="2" fill="#F6F1E8" stroke={strokeColor} strokeWidth="1.4" />
        </svg>
      </div>
    </div>
  );
};
