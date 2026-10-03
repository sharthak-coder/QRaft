import React from 'react';
import { FishPair } from '../../art/FishPair';
import { Lotus } from '../../art/Lotus';
import { Bird } from '../../art/Bird';
import { Sun } from '../../art/Sun';
import { DoubleLineBorder } from '../../art/DoubleLineBorder';

interface EmptyStateSceneProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  motif?: 'fish' | 'lotus' | 'bird' | 'sun';
  className?: string;
}

export const EmptyStateScene: React.FC<EmptyStateSceneProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  motif = 'fish',
  className = '',
}) => {
  return (
    <DoubleLineBorder
      variant="kachni"
      strokeColor="#1A3644"
      bandColor="#D99B26"
      className={`p-8 bg-rice text-center shadow-folk-card flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      {/* Illustrated Motifs */}
      <div className="mb-4">
        {motif === 'fish' && (
          <FishPair size={100} strokeColor="#1A3644" fillColor="#D99B26" accentColor="#A62B2B" secondaryFill="#2D5A3E" />
        )}
        {motif === 'lotus' && (
          <Lotus size={90} strokeColor="#1A3644" fillColor="#A62B2B" accentColor="#D99B26" />
        )}
        {motif === 'bird' && (
          <Bird size={90} strokeColor="#1A3644" fillColor="#2D5A3E" accentColor="#D99B26" />
        )}
        {motif === 'sun' && (
          <Sun size={90} strokeColor="#1A3644" fillColor="#D99B26" accentColor="#A62B2B" secondaryFill="#2D5A3E" />
        )}
      </div>

      <h3 className="text-base font-heading font-bold text-indigo-ink mb-1">
        {title}
      </h3>
      <p className="text-xs text-indigo-ink/75 max-w-sm leading-relaxed mb-4">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-sindoor hover:bg-sindoor-600 text-rice font-heading font-bold text-xs shadow-sm shadow-haldi-glow hover:shadow transition-all active:scale-95 border-2 border-haldi cursor-pointer focus:outline-none focus:ring-2 focus:ring-haldi"
        >
          {actionLabel}
        </button>
      )}
    </DoubleLineBorder>
  );
};
