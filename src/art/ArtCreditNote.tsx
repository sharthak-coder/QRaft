import React from 'react';

export const MadhubaniArtCredit: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`text-xs text-indigo-ink/75 leading-relaxed ${className}`}>
      <p>
        <strong>About the design:</strong> The visual motifs and borders throughout QRaft are inspired by the traditional Madhubani (Mithila) folk art of Bihar, India. We gratefully acknowledge the rich cultural heritage and centuries-old living traditions of Mithila artists.
      </p>
    </div>
  );
};
