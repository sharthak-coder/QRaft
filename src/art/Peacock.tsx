import React from 'react';
import { MadhubaniMotifProps } from './types';

export const Peacock: React.FC<MadhubaniMotifProps> = ({
  size = 140,
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
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${animated ? 'transition-transform duration-700 hover:scale-105' : ''} ${className}`}
      style={style}
      aria-label="Madhubani Peacock Motif"
    >
      {/* 1. Magnificent Fan of Tail Feathers (repeated eye-shapes) */}
      <g id="tail-fan">
        {/* Outer Feather Radii */}
        {[
          { x: 34, y: 38, rot: -40 },
          { x: 55, y: 22, rot: -22 },
          { x: 82, y: 16, rot: 0 },
          { x: 109, y: 22, rot: 22 },
          { x: 130, y: 38, rot: 40 },
          { x: 142, y: 64, rot: 60 },
        ].map((f, i) => (
          <g key={i} transform={`translate(${f.x}, ${f.y}) rotate(${f.rot})`}>
            {/* Feather Stem */}
            <line x1="0" y1="18" x2="0" y2="40" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
            {/* Outer Feather Teardrop */}
            <path
              d="M0 -14 C-10 -4 -10 10 0 18 C10 10 10 -4 0 -14 Z"
              fill={accentColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {/* Inner Concentric Eye */}
            <path
              d="M0 -9 C-6 -2 -6 7 0 12 C6 7 6 -2 0 -9 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.75}
            />
            {/* Center Core Dot */}
            <circle cx="0" cy="1" r="2.5" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.5} />
          </g>
        ))}

        {/* Secondary Inner Fan Tier */}
        {[
          { x: 48, y: 56, rot: -30 },
          { x: 70, y: 44, rot: -10 },
          { x: 94, y: 44, rot: 10 },
          { x: 116, y: 56, rot: 30 },
        ].map((f, i) => (
          <g key={`in-${i}`} transform={`translate(${f.x}, ${f.y}) rotate(${f.rot})`}>
            <path
              d="M0 -10 C-7 -2 -7 8 0 14 C7 8 7 -2 0 -10 Z"
              fill="#A5B596"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <circle cx="0" cy="2" r="2.2" fill={strokeColor} />
          </g>
        ))}
      </g>

      {/* 2. Peacock Body & Breast */}
      <g id="body">
        {/* Main Body Pear Form */}
        <path
          d="M58 84 C52 98 56 122 76 132 C96 142 118 130 118 110 C118 96 108 86 98 82 C88 78 84 66 84 56 C84 48 76 42 68 46 C60 50 64 62 66 70 C68 76 64 78 58 84 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {/* Double-Line Body Contour */}
        <path
          d="M62 86 C58 98 62 118 78 126 C94 134 112 124 112 108 C112 98 104 90 94 86"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 0.75}
        />

        {/* Textured Neck Rings (Double hatching) */}
        <line x1="70" y1="58" x2="80" y2="58" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
        <line x1="68" y1="64" x2="82" y2="64" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
        <line x1="66" y1="70" x2="84" y2="70" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />

        {/* Wing with Madhubani Hatching */}
        <path
          d="M78 94 C74 106 82 120 98 118 C106 116 108 104 102 96 C96 90 84 90 78 94 Z"
          fill={secondaryFill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <path d="M82 100 Q90 102 96 98" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} fill="none" />
        <path d="M84 106 Q92 108 98 104" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} fill="none" />
        <path d="M88 112 Q94 114 98 110" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} fill="none" />

        {/* Beak */}
        <path d="M60 48 L48 52 L60 55 Z" fill={accentColor} stroke={strokeColor} strokeWidth={strokeWidth} />

        {/* Stylized Almond Eye */}
        <ellipse cx="66" cy="50" rx="3.5" ry="2.2" fill="#FFFDF8" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="65.5" cy="50" r="1.3" fill={strokeColor} />

        {/* Crown Crest (3 feathered plume rays) */}
        <line x1="72" y1="44" x2="68" y2="32" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="68" cy="31" r="2.5" fill={accentColor} stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />

        <line x1="76" y1="43" x2="77" y2="29" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="77" cy="28" r="2.5" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />

        <line x1="80" y1="44" x2="86" y2="33" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="87" cy="32" r="2.5" fill={accentColor} stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />

        {/* Perched Legs */}
        <path d="M80 134 L76 150 M76 150 L68 152 M76 150 L76 154 M76 150 L84 152" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d="M96 132 L94 148 M94 148 L86 150 M94 148 L94 152 M94 148 L102 150" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      </g>
    </svg>
  );
};
