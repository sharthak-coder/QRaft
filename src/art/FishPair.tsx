import React from 'react';
import { MadhubaniMotifProps } from './types';

export const FishPair: React.FC<MadhubaniMotifProps> = ({
  size = 120,
  width,
  height,
  className = '',
  strokeColor = '#13504D',
  fillColor = '#F79454',
  accentColor = '#C54845',
  secondaryFill = '#A5B596',
  strokeWidth = 1.5,
  animated = false,
  style,
}) => {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${animated ? 'transition-transform duration-700 hover:scale-105' : ''} ${className}`}
      style={style}
      aria-label="Madhubani Fish Pair Motif"
    >
      {/* Decorative Outer Aura / Dots Ring */}
      <circle cx="80" cy="80" r="76" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="3 4" opacity="0.4" />
      <circle cx="80" cy="80" r="72" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} opacity="0.6" />

      {/* Top Fish (Curved right-to-left) */}
      <g id="top-fish">
        {/* Main Body */}
        <path
          d="M32 72 C36 44 65 30 100 36 C124 40 138 56 128 72 C115 62 82 56 50 68 C42 71 36 72 32 72 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {/* Inner parallel double line */}
        <path
          d="M38 68 C42 48 68 36 96 41 C116 45 125 56 119 66"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 0.75}
        />
        {/* Dorsal Fin */}
        <path
          d="M60 34 C64 22 78 20 86 24 C82 28 80 32 80 35"
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {/* Tail Fin with fine hatching */}
        <path
          d="M128 72 C138 62 152 60 156 68 C148 74 148 78 156 84 C148 88 136 82 128 72 Z"
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <line x1="134" y1="70" x2="148" y2="68" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
        <line x1="134" y1="74" x2="148" y2="76" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />

        {/* Fish Scales Hatching */}
        <path d="M60 52 Q66 46 72 52" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill="none" />
        <path d="M72 53 Q78 47 84 53" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill="none" />
        <path d="M84 55 Q90 49 96 55" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill="none" />
        <path d="M66 59 Q72 53 78 59" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill="none" />
        <path d="M78 60 Q84 54 90 60" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill="none" />

        {/* Head Gill Division Line */}
        <path d="M52 50 C50 58 48 64 46 70" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
        <path d="M54 51 C52 59 50 65 48 71" stroke={strokeColor} strokeWidth={strokeWidth * 0.6} fill="none" />

        {/* Stylized Almond Eye */}
        <ellipse cx="44" cy="56" rx="4" ry="2.6" fill="#FFFDF8" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="43.5" cy="56" r="1.5" fill={strokeColor} />
      </g>

      {/* Bottom Fish (Curved left-to-right, inverted symmetry) */}
      <g id="bottom-fish">
        {/* Main Body */}
        <path
          d="M128 88 C124 116 95 130 60 124 C36 120 22 104 32 88 C45 98 78 104 110 92 C118 89 124 88 128 88 Z"
          fill={secondaryFill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {/* Inner parallel double line */}
        <path
          d="M122 92 C118 112 92 124 64 119 C44 115 35 104 41 94"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 0.75}
        />
        {/* Ventral Fin */}
        <path
          d="M100 126 C96 138 82 140 74 136 C78 132 80 128 80 125"
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {/* Tail Fin */}
        <path
          d="M32 88 C22 98 8 100 4 92 C12 86 12 82 4 76 C12 72 24 78 32 88 Z"
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <line x1="26" y1="90" x2="12" y2="92" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
        <line x1="26" y1="86" x2="12" y2="84" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />

        {/* Scales */}
        <path d="M100 108 Q94 114 88 108" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill="none" />
        <path d="M88 107 Q82 113 76 107" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill="none" />
        <path d="M76 105 Q70 111 64 105" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill="none" />
        <path d="M94 101 Q88 107 82 101" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill="none" />
        <path d="M82 100 Q76 106 70 100" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill="none" />

        {/* Head Gill Division Line */}
        <path d="M108 110 C110 102 112 96 114 90" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />
        <path d="M106 109 C108 101 110 95 112 89" stroke={strokeColor} strokeWidth={strokeWidth * 0.6} fill="none" />

        {/* Stylized Almond Eye */}
        <ellipse cx="116" cy="104" rx="4" ry="2.6" fill="#FFFDF8" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="116.5" cy="104" r="1.5" fill={strokeColor} />
      </g>

      {/* Center Lotus Bud / Sacred Seed between fishes */}
      <g id="center-lotus">
        <path d="M80 72 C74 76 74 84 80 88 C86 84 86 76 80 72 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="80" cy="80" r="1.5" fill={accentColor} />
      </g>
    </svg>
  );
};
