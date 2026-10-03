import React from 'react';
import { Corner } from './Corner';

interface BorderFrameProps {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  strokeColor?: string;
  fillColor?: string;
  accentColor?: string;
  cornerSize?: number;
  showCorners?: boolean;
  style?: React.CSSProperties;
}

export const BorderFrame: React.FC<BorderFrameProps> = ({
  children,
  className = '',
  contentClassName = '',
  strokeColor = '#13504D',
  fillColor = '#F79454',
  accentColor = '#C54845',
  cornerSize = 28,
  showCorners = true,
  style,
}) => {
  return (
    <div
      className={`relative rounded-3xl p-1 border-2 border-peacock-deep/20 bg-paper-2 ${className}`}
      style={{
        outline: '1px solid rgba(19, 80, 77, 0.12)',
        outlineOffset: '3px',
        ...style,
      }}
    >
      {/* 4 Madhubani Corner Pieces */}
      {showCorners && (
        <>
          <div className="absolute top-1 left-1 pointer-events-none z-10">
            <Corner position="top-left" size={cornerSize} strokeColor={strokeColor} fillColor={fillColor} accentColor={accentColor} />
          </div>
          <div className="absolute top-1 right-1 pointer-events-none z-10">
            <Corner position="top-right" size={cornerSize} strokeColor={strokeColor} fillColor={fillColor} accentColor={accentColor} />
          </div>
          <div className="absolute bottom-1 left-1 pointer-events-none z-10">
            <Corner position="bottom-left" size={cornerSize} strokeColor={strokeColor} fillColor={fillColor} accentColor={accentColor} />
          </div>
          <div className="absolute bottom-1 right-1 pointer-events-none z-10">
            <Corner position="bottom-right" size={cornerSize} strokeColor={strokeColor} fillColor={fillColor} accentColor={accentColor} />
          </div>
        </>
      )}

      {/* Frame Content Container */}
      <div className={`relative z-0 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};
