import React from 'react';

interface PatternFillDefsProps {
  idPrefix?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export const MadhubaniPatternDefs: React.FC<PatternFillDefsProps> = ({
  idPrefix = 'mb-',
  strokeColor = '#13504D',
  strokeWidth = 1,
}) => {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* 1. Diagonal Fine Hatching (Kachni line work) */}
        <pattern
          id={`${idPrefix}hatch`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </pattern>

        {/* 2. Cross Hatching */}
        <pattern
          id={`${idPrefix}crosshatch`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="8"
            y2="8"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1="8"
            y1="0"
            x2="0"
            y2="8"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </pattern>

        {/* 3. Stippled Dots (Rangoli Dot Fill) */}
        <pattern
          id={`${idPrefix}dots`}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="5" cy="5" r="1.2" fill={strokeColor} />
          <circle cx="0" cy="0" r="0.8" fill={strokeColor} opacity="0.4" />
          <circle cx="10" cy="10" r="0.8" fill={strokeColor} opacity="0.4" />
        </pattern>

        {/* 4. Fish Scales (Scallop overlapping arches) */}
        <pattern
          id={`${idPrefix}scales`}
          width="16"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 6 A8 6 0 0 0 16 6 M-8 12 A8 6 0 0 0 8 12 M8 12 A8 6 0 0 0 24 12"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </pattern>

        {/* 5. Flowing River Waves */}
        <pattern
          id={`${idPrefix}waves`}
          width="20"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 4 Q5 0 10 4 T20 4"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
    </svg>
  );
};
