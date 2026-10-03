import React from 'react';

export const MadhubaniArtCredit: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`text-xs text-ink/70 leading-relaxed ${className}`}>
      <p>
        <strong>About the art style:</strong> The visual motifs throughout QRaft are inspired by the traditional
        Madhubani (Mithila) folk art of Bihar, India, characterized by geometric double-line contours,
        stylized nature symbolism, and intricate line hatching.
      </p>
    </div>
  );
};
