import React from 'react';
import { FishPair } from '../../art/FishPair';
import { Lotus } from '../../art/Lotus';
import { Bird } from '../../art/Bird';
import { Sun } from '../../art/Sun';
import { Corner } from '../../art/Corner';

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
    <div
      className={`p-8 rounded-3xl bg-paper-2/95 border border-paper-border text-center shadow-card relative overflow-hidden flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
      style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
    >
      <Corner position="top-right" size={24} strokeColor="#13504D" fillColor="#F79454" />
      <Corner position="bottom-left" size={24} strokeColor="#13504D" fillColor="#A5B596" />

      {/* Illustrated Motifs */}
      <div className="mb-4">
        {motif === 'fish' && (
          <FishPair size={100} strokeColor="#13504D" fillColor="#F79454" accentColor="#C54845" />
        )}
        {motif === 'lotus' && (
          <Lotus size={90} strokeColor="#13504D" fillColor="#C54845" accentColor="#F79454" />
        )}
        {motif === 'bird' && (
          <Bird size={90} strokeColor="#13504D" fillColor="#2F7A72" accentColor="#F79454" />
        )}
        {motif === 'sun' && (
          <Sun size={90} strokeColor="#13504D" fillColor="#F79454" accentColor="#C54845" />
        )}
      </div>

      <h3 className="text-base font-heading font-bold text-peacock-deep mb-1">
        {title}
      </h3>
      <p className="text-xs text-ink/75 max-w-sm leading-relaxed mb-4">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-vermilion hover:bg-vermilion-500 text-white font-heading font-bold text-xs shadow-sm shadow-vermilion-glow hover:shadow-saffron-glow transition-all active:scale-95 border border-white/30 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
