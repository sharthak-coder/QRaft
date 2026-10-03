import React from 'react';
import { MadhubaniMotifProps } from './types';

export const Bird: React.FC<MadhubaniMotifProps> = ({
  size = 110,
  width,
  height,
  className = '',
  strokeColor = '#13504D',
  fillColor = '#2F7A72',
  accentColor = '#F79454',
  secondaryFill = '#C54845',
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
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${animated ? 'transition-transform duration-700 hover:scale-105' : ''} ${className}`}
      style={style}
      aria-label="Madhubani Bird Motif"
    >
      {/* 1. Branch Perch */}
      <path d="M10 98 Q50 92 110 98" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} />
      <path d="M10 101 Q50 95 110 101" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
      {/* Small Leaf sprouting from branch */}
      <path d="M30 96 C24 88 28 80 34 82 C38 88 34 94 30 96 Z" fill="#A5B596" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />

      {/* 2. Tail Feathers (Layered stepped bands) */}
      <path
        d="M26 80 L8 106 L22 100 L12 114 L34 88 Z"
        fill={secondaryFill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <line x1="24" y1="84" x2="14" y2="102" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />

      {/* 3. Main Body */}
      <path
        d="M34 84 C28 66 38 42 56 36 C70 30 84 38 84 52 C84 66 74 86 52 90 C42 92 36 88 34 84 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* Double-Line Body Contour */}
      <path
        d="M38 80 C34 66 42 46 56 41 C68 36 78 44 78 54 C78 66 70 82 52 85"
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.7}
      />

      {/* 4. Wing with Decorative Kachni Bands */}
      <path
        d="M48 56 C62 50 78 60 74 74 C70 84 54 84 44 76 C40 70 42 60 48 56 Z"
        fill={accentColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* Wing Hatching */}
      <line x1="50" y1="62" x2="68" y2="60" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
      <line x1="48" y1="68" x2="70" y2="68" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
      <line x1="48" y1="74" x2="66" y2="76" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />

      {/* 5. Head, Curved Parrot Beak, & Crown Feather */}
      {/* Head Crest */}
      <path d="M72 32 C78 22 84 22 86 26 C82 30 76 34 72 36" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />

      {/* Curved Beak */}
      <path
        d="M82 46 C94 46 102 54 98 62 C94 58 88 56 82 56 Z"
        fill={secondaryFill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Almond Eye with Big Pupil */}
      <ellipse cx="70" cy="46" rx="4" ry="2.6" fill="#FFFDF8" stroke={strokeColor} strokeWidth={strokeWidth} />
      <circle cx="70" cy="46" r="1.5" fill={strokeColor} />

      {/* 6. Claws Clasping the Perch */}
      <path d="M48 89 L46 98 M48 89 L50 98 M48 89 L54 97" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
};
