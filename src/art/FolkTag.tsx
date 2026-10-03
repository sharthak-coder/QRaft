import React from 'react';

export interface FolkTagProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'haldi' | 'leaf' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  trim?: 'triangle' | 'zigzag';
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  as?: 'button' | 'div' | 'span';
  style?: React.CSSProperties;
  title?: string;
  ariaLabel?: string;
}

/**
 * FolkTag: A chip/tag component with traditional tribal zig-zag / triangle trim.
 * Used for stylized buttons, badges, chips, and active indicator pills.
 */
export const FolkTag: React.FC<FolkTagProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  trim = 'triangle',
  onClick,
  disabled = false,
  type = 'button',
  as = 'div',
  style,
  title,
  ariaLabel,
}) => {
  // Sizing styles
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  }[size];

  // Variant palette styling conforming to WCAG rules
  const variantClasses = {
    primary: 'bg-sindoor text-rice border-2 border-haldi shadow-sm hover:shadow-haldi-glow active:scale-95',
    secondary: 'bg-rice text-indigo-ink border-2 border-indigo-ink hover:bg-rice-panel active:scale-95',
    haldi: 'bg-haldi text-indigo-ink border-2 border-indigo-ink font-bold shadow-sm active:scale-95',
    leaf: 'bg-leaf text-rice border-2 border-rice-border shadow-sm active:scale-95',
    ghost: 'bg-transparent text-indigo-ink hover:bg-rice-panel border border-indigo-ink/20',
  }[variant];

  const Comp = as as any;

  return (
    <Comp
      type={as === 'button' ? type : undefined}
      onClick={onClick}
      disabled={as === 'button' ? disabled : undefined}
      title={title}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl font-heading font-bold select-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-haldi focus-visible:ring-offset-2 ${sizeClasses} ${variantClasses} ${
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
      } ${className}`}
      style={style}
    >
      {/* Subtle tribal zig-zag or triangle edge trim */}
      {trim === 'triangle' && (
        <span
          className="absolute -bottom-1 left-2 right-2 h-1 pointer-events-none opacity-40 overflow-hidden"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 4px)',
            backgroundSize: '6px 4px',
            backgroundRepeat: 'repeat-x',
          }}
        />
      )}

      {children}
    </Comp>
  );
};
