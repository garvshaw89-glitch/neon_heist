import React from 'react';
import { sound } from '../../game/audio';

interface ClayKeyProps {
  keyLabel: string;
  sublabel?: string;
  isPressed?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ClayKey: React.FC<ClayKeyProps> = ({
  keyLabel,
  sublabel,
  isPressed = false,
  onClick,
  className = '',
  size = 'md'
}) => {
  const handleClick = () => {
    sound.playUiClick();
    onClick?.();
  };

  const sizeClasses = {
    sm: 'min-w-[24px] min-h-[24px] text-[10px] px-1.5 py-0.5',
    md: 'min-w-[32px] min-h-[32px] text-xs px-2 py-1',
    lg: 'min-w-[42px] min-h-[42px] text-sm px-3 py-1.5'
  }[size];

  return (
    <div
      onClick={onClick ? handleClick : undefined}
      className={`clay-keycap ${sizeClasses} ${isPressed ? 'clay-keycap-pressed' : ''} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <span className="font-mono-tech font-bold leading-none">{keyLabel}</span>
      {sublabel && (
        <span className="text-[8px] text-slate-400 ml-1 uppercase">{sublabel}</span>
      )}
    </div>
  );
};
