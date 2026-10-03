import React from 'react';
import { MadhubaniMotifProps } from './types';

/**
 * Traditional Kadamba Tree Motif
 * Features a round canopy adorned with stylized circular flower balls,
 * a sturdy textured trunk with double contour lines, and a rooted plinth.
 */
export const Kadamba: React.FC<MadhubaniMotifProps> = ({
  size = 80,
  className = '',
  strokeColor = '#1A3644',
  fillColor = '#2D5A3E',
  accentColor = '#D99B26',
  secondaryFill = '#A62B2B',
  strokeWidth = 1.2,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Rooted Pedestal / Base Ghat */}
      <path
        d="M24 74 L56 74 L52 68 L28 68 Z"
        fill="#F6F1E8"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Textured Trunk */}
      <path
        d="M36 68 L36 44 C34 40 30 38 28 36 C32 37 36 39 38 42 L42 42 C44 39 48 37 52 36 C50 38 46 40 44 44 L44 68 Z"
        fill={strokeColor}
      />

      {/* Main Round Canopy (Double Outline) */}
      <circle cx="40" cy="30" r="22" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
      <circle cx="40" cy="30" r="19" stroke="#F6F1E8" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Stylized Kadamba Flower Balls (Round blossoms) */}
      {[
        { cx: 40, cy: 15 },
        { cx: 28, cy: 22 },
        { cx: 52, cy: 22 },
        { cx: 24, cy: 34 },
        { cx: 56, cy: 34 },
        { cx: 34, cy: 30 },
        { cx: 46, cy: 30 },
        { cx: 40, cy: 40 },
      ].map((pos, i) => (
        <g key={i}>
          <circle
            cx={pos.cx}
            cy={pos.cy}
            r="4"
            fill={i % 2 === 0 ? accentColor : secondaryFill}
            stroke={strokeColor}
            strokeWidth="0.8"
          />
          <circle cx={pos.cx} cy={pos.cy} r="1.5" fill="#FFFFFF" />
        </g>
      ))}

      {/* Canopy top lotus finial */}
      <path
        d="M40 4 C38 6 37 8 40 10 C43 8 42 6 40 4 Z"
        fill={secondaryFill}
        stroke={strokeColor}
        strokeWidth="0.8"
      />
    </svg>
  );
};
