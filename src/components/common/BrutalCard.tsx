import React, { useRef, useState } from 'react';

interface BrutalCardProps {
  stamp?: string;
  title?: string;
  subtitle?: string;
  status?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const BrutalCard: React.FC<BrutalCardProps> = ({
  stamp,
  title,
  subtitle,
  status,
  variant = 'primary',
  interactive = false,
  className = '',
  children,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt: max 4 degrees
    const tiltX = ((y - centerY) / centerY) * -3.5;
    const tiltY = ((x - centerX) / centerX) * 3.5;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true);
  };

  const frameBorder = variant === 'danger' ? 'brutal-frame-danger' : 'brutal-frame';

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-2px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.35s ease-out'
      }}
      className={`hybrid-card ${frameBorder} terminal-glass surface-imperfections p-5 rounded-xl ${
        interactive ? 'cursor-pointer hover:border-cyan-400/40' : ''
      } ${className}`}
    >
      {/* Header bar if stamp or title provided */}
      {(stamp || title || status) && (
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-white/5">
          <div className="space-y-1">
            {stamp && (
              <span className="brutal-stamp text-cyan-300 border-cyan-500/30">
                {stamp}
              </span>
            )}
            {title && (
              <h3 className="font-display font-bold text-lg text-white tracking-wide mt-1.5">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-mono-tech text-[10px] text-slate-400 uppercase tracking-widest">
                {subtitle}
              </p>
            )}
          </div>
          {status && (
            <span className="font-mono-tech text-[10px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-bold tracking-wider">
              {status}
            </span>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
