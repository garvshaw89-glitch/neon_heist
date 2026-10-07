import React from 'react';
import { sound } from '../../game/audio';

export type ButtonVariant = 
  | 'clay-primary' 
  | 'clay-accent' 
  | 'clay-danger' 
  | 'glass' 
  | 'brutal';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  cursorMode?: 'default' | 'danger' | 'hack' | 'scan';
  loading?: boolean;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'clay-primary',
  size = 'md',
  icon,
  cursorMode,
  loading = false,
  children,
  className = '',
  onClick,
  onMouseEnter,
  disabled,
  ...rest
}) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      sound.playUiHover();
    }
    onMouseEnter?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      if (variant === 'clay-danger') {
        sound.playSuspicionAlert();
      } else {
        sound.playUiClick();
      }
      onClick?.(e);
    }
  };

  // Base sizing
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[11px] gap-1.5',
    md: 'px-4 py-2.5 text-xs gap-2',
    lg: 'px-6 py-3.5 text-sm gap-2.5'
  }[size];

  // Variant classes
  let variantClass = '';
  switch (variant) {
    case 'clay-accent':
      variantClass = 'btn-clay-accent font-display tracking-wider uppercase';
      break;
    case 'clay-danger':
      variantClass = 'btn-clay-danger font-display tracking-wider uppercase';
      break;
    case 'clay-primary':
      variantClass = 'btn-clay-primary font-display tracking-wider';
      break;
    case 'glass':
      variantClass = 
        'bg-[#0b101c]/70 hover:bg-[#12192a]/80 active:bg-[#070b14]/90 text-slate-200 border border-white/10 hover:border-cyan-400/40 rounded-xl backdrop-blur-md transition-all duration-150 active:scale-[0.98] shadow-lg shadow-black/40';
      break;
    case 'brutal':
      variantClass = 
        'bg-black/80 hover:bg-zinc-900 active:bg-zinc-950 text-slate-200 font-mono-tech border border-white/20 hover:border-cyan-400 active:translate-y-0.5 uppercase tracking-widest transition-all duration-150 relative';
      break;
  }

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      data-cursor={cursorMode}
      className={`inline-flex items-center justify-center select-none cursor-pointer outline-none ${sizeClasses} ${variantClass} ${
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
    >
      {loading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
