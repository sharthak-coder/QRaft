import React from 'react';
import { MadhubaniMotifProps } from './types';

interface LeafVineProps extends MadhubaniMotifProps {
  orientation?: 'horizontal' | 'vertical';
  repeat?: number;
}

export const LeafVine: React.FC<LeafVineProps> = ({
  size,
  width,
  height,
  className = '',
  strokeColor = '#13504D',
  fillColor = '#A5B596',
  accentColor = '#F79454',
  secondaryFill = '#C54845',
  strokeWidth = 1.5,
  animated = false,
  orientation = 'horizontal',
  style,
}) => {
  const isHoriz = orientation === 'horizontal';
  const defaultW = isHoriz ? 240 : 48;
  const defaultH = isHoriz ? 48 : 240;
  const w = width ?? (size ? size : defaultW);
  const h = height ?? (size ? size : defaultH);

  return (
    <svg
      width={w}
      height={h}
      viewBox={isHoriz ? "0 0 240 48" : "0 0 48 240"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${animated ? 'transition-all duration-700' : ''} ${className}`}
      style={style}
      aria-label="Madhubani Leaf Vine Motif"
    >
      <g transform={isHoriz ? undefined : "rotate(90 24 24) translate(0 -192)"}>
        {/* Double-Line Stem (Sinuous gentle wave) */}
        <path
          d="M0 24 Q30 14 60 24 T120 24 T180 24 T240 24"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <path
          d="M0 26 Q30 16 60 26 T120 26 T180 26 T240 26"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 0.7}
          fill="none"
        />

        {/* Node 1 (Leaves Top & Bottom) */}
        <g transform="translate(30, 19)">
          {/* Top Leaf */}
          <path
            d="M0 0 C-4 -14 12 -16 16 -12 C16 -6 8 -2 0 0 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <line x1="2" y1="-2" x2="14" y2="-12" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          {/* Floral Bud Accent */}
          <circle cx="20" cy="-14" r="2.5" fill={accentColor} stroke={strokeColor} strokeWidth={strokeWidth * 0.6} />
        </g>

        <g transform="translate(60, 26)">
          {/* Bottom Leaf */}
          <path
            d="M0 0 C-4 14 12 16 16 12 C16 6 8 2 0 0 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <line x1="2" y1="2" x2="14" y2="12" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <circle cx="20" cy="14" r="2.5" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.6} />
        </g>

        {/* Node 2 */}
        <g transform="translate(90, 19)">
          <path
            d="M0 0 C-4 -14 12 -16 16 -12 C16 -6 8 -2 0 0 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <line x1="2" y1="-2" x2="14" y2="-12" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <circle cx="20" cy="-14" r="2.5" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.6} />
        </g>

        <g transform="translate(120, 26)">
          <path
            d="M0 0 C-4 14 12 16 16 12 C16 6 8 2 0 0 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <line x1="2" y1="2" x2="14" y2="12" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <circle cx="20" cy="14" r="2.5" fill={accentColor} stroke={strokeColor} strokeWidth={strokeWidth * 0.6} />
        </g>

        {/* Node 3 */}
        <g transform="translate(150, 19)">
          <path
            d="M0 0 C-4 -14 12 -16 16 -12 C16 -6 8 -2 0 0 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <line x1="2" y1="-2" x2="14" y2="-12" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <circle cx="20" cy="-14" r="2.5" fill={accentColor} stroke={strokeColor} strokeWidth={strokeWidth * 0.6} />
        </g>

        <g transform="translate(180, 26)">
          <path
            d="M0 0 C-4 14 12 16 16 12 C16 6 8 2 0 0 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <line x1="2" y1="2" x2="14" y2="12" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <circle cx="20" cy="14" r="2.5" fill={secondaryFill} stroke={strokeColor} strokeWidth={strokeWidth * 0.6} />
        </g>

        {/* Node 4 */}
        <g transform="translate(210, 19)">
          <path
            d="M0 0 C-4 -14 12 -16 16 -12 C16 -6 8 -2 0 0 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <line x1="2" y1="-2" x2="14" y2="-12" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
        </g>
      </g>
    </svg>
  );
};
