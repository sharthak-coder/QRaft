import React from 'react';
import { MadhubaniMotifProps } from './types';

export const Sun: React.FC<MadhubaniMotifProps> = ({
  size = 140,
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

  // 16 alternating rays (8 flame/petal rays + 8 triangular spear rays)
  const rays = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 360) / 16;
    const isFlame = i % 2 === 0;
    return { angle, isFlame };
  });

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${animated ? 'transition-transform duration-700 hover:rotate-12' : ''} ${className}`}
      style={style}
      aria-label="Madhubani Surya Sun Motif"
    >
      {/* 1. Radiating Sun Rays */}
      <g id="rays" transform="translate(80, 80)">
        {rays.map((ray, idx) => (
          <g key={idx} transform={`rotate(${ray.angle})`}>
            {ray.isFlame ? (
              // Curving flame/leaf ray with fine hatching
              <g>
                <path
                  d="M-5 -52 C-10 -64 0 -76 0 -76 C0 -76 10 -64 5 -52 Z"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
                <line x1="0" y1="-53" x2="0" y2="-72" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
                <circle cx="0" cy="-62" r="1.5" fill={accentColor} />
              </g>
            ) : (
              // Triangular Kachni ray with double line
              <g>
                <polygon
                  points="-4,-52 0,-70 4,-52"
                  fill={accentColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
                <circle cx="0" cy="-73" r="1.8" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.6} />
              </g>
            )}
          </g>
        ))}
      </g>

      {/* 2. Outer Concentric Border with Kachni Serrated Teeth */}
      <circle cx="80" cy="80" r="50" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth} />
      <circle cx="80" cy="80" r="45" fill="#FFFDF8" stroke={strokeColor} strokeWidth={strokeWidth} />
      {/* Dot Ring */}
      <circle cx="80" cy="80" r="42" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeDasharray="2 3" opacity="0.6" />

      {/* 3. Inner Face Sun Disc */}
      <circle cx="80" cy="80" r="38" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
      {/* Inner double border */}
      <circle cx="80" cy="80" r="35" stroke={strokeColor} strokeWidth={strokeWidth * 0.65} opacity="0.7" />

      {/* 4. Serene Mithila Facial Features */}
      {/* Forehead Sacred Tilak */}
      <path d="M80 50 L77 58 L83 58 Z" fill={accentColor} stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
      <circle cx="80" cy="62" r="1.8" fill={strokeColor} />

      {/* Stylized Madhubani Almond Eyes */}
      {/* Left Eye */}
      <g id="left-eye">
        <path d="M64 74 Q71 68 76 74 Q71 78 64 74 Z" fill="#FFFDF8" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="71" cy="73.5" r="2" fill={strokeColor} />
        {/* Eyebrow */}
        <path d="M63 69 Q70 65 76 68" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} fill="none" />
      </g>

      {/* Right Eye */}
      <g id="right-eye">
        <path d="M84 74 Q89 68 96 74 Q89 78 84 74 Z" fill="#FFFDF8" stroke={strokeColor} strokeWidth={strokeWidth} />
        <circle cx="89" cy="73.5" r="2" fill={strokeColor} />
        {/* Eyebrow */}
        <path d="M84 68 Q90 65 97 69" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} fill="none" />
      </g>

      {/* Sharp Traditional Nose */}
      <path d="M80 66 L77 82 L81 83" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Gentle Smiling Lips */}
      <path d="M72 88 Q80 94 88 88" stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
      <path d="M74 88 Q80 84 86 88" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill={accentColor} />

      {/* Cheek Ornamentation Dots */}
      <circle cx="65" cy="83" r="1.2" fill={strokeColor} opacity="0.6" />
      <circle cx="95" cy="83" r="1.2" fill={strokeColor} opacity="0.6" />
      <circle cx="80" cy="98" r="1.5" fill={accentColor} />
    </svg>
  );
};
