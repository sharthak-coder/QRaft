import React from 'react';
import { MadhubaniMotifProps } from './types';

export const Lotus: React.FC<MadhubaniMotifProps> = ({
  size = 120,
  width,
  height,
  className = '',
  strokeColor = '#13504D',
  fillColor = '#C54845',
  accentColor = '#F79454',
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
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${animated ? 'transition-transform duration-700 hover:scale-105' : ''} ${className}`}
      style={style}
      aria-label="Madhubani Sacred Lotus Motif"
    >
      {/* 1. Base Calyx Leaves */}
      <g id="calyx-base">
        {/* Left Leaf */}
        <path
          d="M80 114 C56 120 32 116 18 102 C30 96 52 100 80 114 Z"
          fill={secondaryFill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {/* Right Leaf */}
        <path
          d="M80 114 C104 120 128 116 142 102 C130 96 108 100 80 114 Z"
          fill={secondaryFill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {/* Calyx stem base */}
        <path
          d="M74 114 C74 126 76 134 80 138 C84 134 86 126 86 114 Z"
          fill={secondaryFill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </g>

      {/* 2. Outer Tier Petals (Widest splay) */}
      <g id="outer-petals">
        {/* Far Left Petal */}
        <path
          d="M80 114 C52 110 24 88 14 58 C32 60 58 84 80 114 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <path
          d="M74 108 C52 86 32 66 22 58"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 0.7}
        />

        {/* Far Right Petal */}
        <path
          d="M80 114 C108 110 136 88 146 58 C128 60 102 84 80 114 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <path
          d="M86 108 C108 86 128 66 138 58"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 0.7}
        />
      </g>

      {/* 3. Middle Tier Petals */}
      <g id="mid-petals">
        {/* Mid Left Petal */}
        <path
          d="M80 114 C62 96 44 64 42 34 C60 48 74 80 80 114 Z"
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <path
          d="M76 106 C64 80 52 52 46 38"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 0.7}
        />

        {/* Mid Right Petal */}
        <path
          d="M80 114 C98 96 116 64 118 34 C100 48 86 80 80 114 Z"
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <path
          d="M84 106 C96 80 108 52 114 38"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 0.7}
        />
      </g>

      {/* 4. Center Main Petal (Tallest upright crown) */}
      <g id="center-petal">
        <path
          d="M80 114 C68 84 66 48 80 14 C94 48 92 84 80 114 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {/* Double-Line Inner Contour */}
        <path
          d="M80 106 C72 80 70 50 80 24 C90 50 88 80 80 106 Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 0.75}
        />
        {/* Central Vein */}
        <line x1="80" y1="24" x2="80" y2="106" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
      </g>

      {/* 5. Center Golden Stamen & Seed Pod */}
      <g id="seed-pod">
        <circle cx="80" cy="98" r="8" fill="#FFFDF8" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="80" cy="98" r="4" fill={accentColor} />
        {/* Radiating stamen dots */}
        <circle cx="72" cy="92" r="1.4" fill={strokeColor} />
        <circle cx="88" cy="92" r="1.4" fill={strokeColor} />
        <circle cx="75" cy="104" r="1.4" fill={strokeColor} />
        <circle cx="85" cy="104" r="1.4" fill={strokeColor} />
      </g>
    </svg>
  );
};
