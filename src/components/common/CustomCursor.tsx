import React, { useEffect, useState, useRef } from 'react';

export type CursorMode = 'default' | 'pointer' | 'hack' | 'danger' | 'scan';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState<CursorMode>('default');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafRef = useRef<number | null>(null);
  const targetPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Check if touch device
    const checkTouch = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const hasTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isCoarse || hasTouch);
    };
    checkTouch();

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });

      // Determine element under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.closest('[data-cursor="danger"]') || target.closest('.cursor-danger')) {
          setMode('danger');
        } else if (target.closest('[data-cursor="hack"]') || target.closest('.cursor-hack')) {
          setMode('hack');
        } else if (target.closest('[data-cursor="scan"]')) {
          setMode('scan');
        } else if (
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.closest('.interactive-target')
        ) {
          setMode('pointer');
        } else {
          setMode('default');
        }
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth trailing physics
    const loop = () => {
      setTrail(prev => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.28,
        y: prev.y + (targetPos.current.y - prev.y) * 0.28
      }));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (isTouchDevice) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Precision Center Dot */}
      <div
        className={`fixed w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-150 ${
          mode === 'danger'
            ? 'bg-rose-400'
            : mode === 'hack'
            ? 'bg-purple-400'
            : mode === 'pointer'
            ? 'bg-cyan-300 scale-125'
            : 'bg-white/90'
        }`}
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />

      {/* Trailing Tactical Reticle */}
      <div
        className={`fixed -translate-x-1/2 -translate-y-1/2 transition-all duration-150 rounded-full border ${
          mode === 'pointer'
            ? 'w-7 h-7 border-cyan-400/60 bg-cyan-400/5 scale-110'
            : mode === 'hack'
            ? 'w-8 h-8 border-purple-400/70 border-dashed animate-spin'
            : mode === 'danger'
            ? 'w-8 h-8 border-rose-500/80 bg-rose-500/10 scale-125'
            : mode === 'scan'
            ? 'w-7 h-7 border-cyan-300/60'
            : 'w-5 h-5 border-white/20'
        } ${isMouseDown ? 'scale-90 opacity-100' : 'opacity-85'}`}
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`
        }}
      >
        {/* Corner ticks when in pointer or danger mode */}
        {(mode === 'pointer' || mode === 'danger') && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-current opacity-60" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-current opacity-60" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-1 bg-current opacity-60" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-1 bg-current opacity-60" />
          </>
        )}
      </div>
    </div>
  );
};
