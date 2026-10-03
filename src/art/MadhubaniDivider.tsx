import React from 'react';
import { MadhubaniMotifProps } from './types';

interface MadhubaniDividerProps extends MadhubaniMotifProps {
  motif?: 'lotus' | 'fish' | 'sun';
}

export const MadhubaniDivider: React.FC<MadhubaniDividerProps> = ({
  className = '',
  strokeColor = '#13504D',
  fillColor = '#F79454',
  accentColor = '#C54845',
  strokeWidth = 1.2,
  motif = 'lotus',
  style,
}) => {
  return (
    <div className={`w-full flex items-center justify-center my-4 overflow-hidden select-none ${className}`} style={style} aria-hidden="true">
      <svg
        viewBox="0 0 400 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-lg h-6"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Left Double Running Line with Serrated Teeth */}
        <line x1="10" y1="11" x2="180" y2="11" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.6" />
        <line x1="10" y1="13" x2="180" y2="13" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} opacity="0.4" />
        {/* Left triangle tooth row */}
        {[30, 50, 70, 90, 110, 130, 150, 170].map((x) => (
          <polygon key={x} points={`${x},11 ${x + 4},7 ${x + 8},11`} fill={fillColor} opacity="0.7" />
        ))}

        {/* Center Motif (Lotus Bud or Sacred Eye) */}
        {motif === 'lotus' && (
          <g id="center-lotus-bud" transform="translate(200, 12)">
            {/* Center petal */}
            <path d="M0 -8 C-4 -2 -4 6 0 9 C4 6 4 -2 0 -8 Z" fill={accentColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Left lateral petal */}
            <path d="M-2 4 C-8 0 -11 -6 -8 -9 C-5 -4 -3 1 -2 4 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
            {/* Right lateral petal */}
            <path d="M2 4 C8 0 11 -6 8 -9 C5 -4 3 1 2 4 Z" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
            <circle cx="0" cy="2" r="1.5" fill="#FFFDF8" />
          </g>
        )}

        {motif === 'sun' && (
          <g id="center-sun" transform="translate(200, 12)">
            <circle cx="0" cy="0" r="7" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="0" cy="0" r="3" fill={accentColor} />
            {/* 8 tiny rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
              <line
                key={ang}
                x1="0"
                y1="-7"
                x2="0"
                y2="-10"
                stroke={strokeColor}
                strokeWidth={strokeWidth * 0.75}
                transform={`rotate(${ang})`}
              />
            ))}
          </g>
        )}

        {motif === 'fish' && (
          <g id="center-fish" transform="translate(200, 12)">
            <path
              d="M-10 0 C-4 -6 6 -6 10 0 C6 6 -4 6 -10 0 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <circle cx="-5" cy="0" r="1.2" fill={strokeColor} />
            <polygon points="10,0 15,-4 13,0 15,4" fill={accentColor} stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          </g>
        )}

        {/* Right Double Running Line with Serrated Teeth */}
        <line x1="220" y1="11" x2="390" y2="11" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.6" />
        <line x1="220" y1="13" x2="390" y2="13" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} opacity="0.4" />
        {/* Right triangle tooth row */}
        {[222, 242, 262, 282, 302, 322, 342, 362].map((x) => (
          <polygon key={x} points={`${x},11 ${x + 4},7 ${x + 8},11`} fill={fillColor} opacity="0.7" />
        ))}
      </svg>
    </div>
  );
};
