import React from 'react';
import { MadhubaniMotifProps } from './types';

interface CornerProps extends MadhubaniMotifProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const Corner: React.FC<CornerProps> = ({
  size = 36,
  className = '',
  strokeColor = '#13504D',
  fillColor = '#F79454',
  accentColor = '#C54845',
  secondaryFill = '#A5B596',
  strokeWidth = 1.2,
  position = 'top-left',
  style,
}) => {
  const rotation = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270,
  }[position];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)`, ...style }}
      aria-hidden="true"
    >
      {/* Outer Double-Line Right Angle */}
      <path
        d="M2 38 L2 6 C2 3.8 3.8 2 6 2 L38 2"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <path
        d="M6 38 L6 8 C6 6.9 6.9 6 8 6 L38 6"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.75}
        fill="none"
      />

      {/* Decorative Corner Floral / Kachni Triangle Fan */}
      <path
        d="M6 6 Q14 8 20 6 Q16 16 6 20 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.8}
      />
      <circle cx="11" cy="11" r="2" fill={accentColor} />

      {/* Tiny Serrated Triangle Teeth along arms */}
      <polygon points="12,2 14,5 16,2" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.5} />
      <polygon points="20,2 22,5 24,2" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.5} />
      <polygon points="28,2 30,5 32,2" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.5} />

      <polygon points="2,12 5,14 2,16" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.5} />
      <polygon points="2,20 5,22 2,24" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.5} />
      <polygon points="2,28 5,30 2,32" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.5} />
    </svg>
  );
};
