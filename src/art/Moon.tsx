import React from 'react';
import { MadhubaniMotifProps } from './types';

/**
 * Traditional Chandra (Folk Moon) Motif
 * Features stylized concentric rings, radial kachni rays, and delicate stippled dots.
 */
export const Moon: React.FC<MadhubaniMotifProps> = ({
  size = 64,
  className = '',
  strokeColor = '#1A3644',
  fillColor = '#D99B26',
  accentColor = '#A62B2B',
  strokeWidth = 1.2,
  animated = false,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-spin-slow' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Outer Halo Rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 32 32)`}>
          <line x1="32" y1="4" x2="32" y2="8" stroke={fillColor} strokeWidth={strokeWidth} />
          <circle cx="32" cy="2" r="1" fill={accentColor} />
        </g>
      ))}

      {/* Outer concentric contour */}
      <circle cx="32" cy="32" r="22" stroke={strokeColor} strokeWidth={strokeWidth} fill="#F6F1E8" />
      <circle cx="32" cy="32" r="20" stroke={fillColor} strokeWidth={strokeWidth * 0.8} />

      {/* Folk Crescent Face with Kachni Hatching */}
      <path
        d="M32 12 C43 12 52 21 52 32 C52 43 43 52 32 52 C38 46 41 39 41 32 C41 25 38 18 32 12 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Internal decorative eye & lotus bud */}
      <ellipse cx="26" cy="28" rx="2" ry="3.5" fill={strokeColor} />
      <circle cx="26" cy="27" r="1" fill="#FFFFFF" />

      {/* Tilak / bindi on forehead */}
      <circle cx="28" cy="22" r="1.5" fill={accentColor} />
    </svg>
  );
};
