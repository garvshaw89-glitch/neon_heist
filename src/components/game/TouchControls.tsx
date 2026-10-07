import React, { useRef, useState, useEffect } from 'react';
import { Shield, Scan, Volume2, Key, Zap, Crosshair } from 'lucide-react';
import { sound } from '../../game/audio';

interface TouchControlsProps {
  onMove: (vector: { x: number; y: number }) => void;
  onAim: (angle: number) => void;
  onInteract: () => void;
  onToggleCrouch: () => void;
  isCrouched: boolean;
  onToggleSprint: (sprinting: boolean) => void;
  isSprinting: boolean;
  onTriggerScanner: () => void;
  isScannerActive: boolean;
  onThrowDecoy: () => void;
  decoyCooldown: number;
  onTakedown?: () => void;
  hasTakedownPrompt: boolean;
  hasNearbyPrompt: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onAim,
  onInteract,
  onToggleCrouch,
  isCrouched,
  onToggleSprint,
  isSprinting,
  onTriggerScanner,
  isScannerActive,
  onThrowDecoy,
  decoyCooldown,
  onTakedown,
  hasTakedownPrompt,
  hasNearbyPrompt
}) => {
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  // Handle Joystick Touch
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!joystickBaseRef.current) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsJoystickActive(true);
    updateKnob(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isJoystickActive) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateKnob(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsJoystickActive(false);
        setKnobPos({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
        break;
      }
    }
  };

  const updateKnob = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });

    // Normalized move vector
    const normX = knobX / maxRadius;
    const normY = knobY / maxRadius;
    onMove({ x: normX, y: normY });
    onAim(angle);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none pb-safe pl-safe pr-safe flex justify-between items-end p-4 sm:p-6 overflow-hidden">
      {/* LEFT: Virtual Floating Movement Joystick */}
      <div className="pointer-events-auto relative mb-2 ml-2">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full brutal-frame glass-primary border-2 border-white/20 bg-black/60 shadow-2xl flex items-center justify-center relative touch-none"
        >
          {/* Directional crosshair lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-full h-0.5 bg-cyan-400" />
            <div className="h-full w-0.5 bg-cyan-400 absolute" />
          </div>

          {/* Dynamic Joystick Knob */}
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-b from-[#1f2d47] to-[#0f1726] border-2 border-cyan-400 shadow-[0_4px_12px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.4)] transition-transform duration-75 flex items-center justify-center ${
              isJoystickActive ? 'scale-110 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : ''
            }`}
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
            }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400" />
          </div>
        </div>

        <div className="text-center font-mono-tech text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
          MOVE // NAV
        </div>
      </div>

      {/* RIGHT: Tactile Touch Action Cluster */}
      <div className="pointer-events-auto flex flex-col items-end gap-2.5 mb-2 mr-2">
        {/* Takedown Button (Appears prominently when near a guard) */}
        {hasTakedownPrompt && onTakedown && (
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              sound.playSuspicionAlert();
              onTakedown();
            }}
            className="min-w-[56px] min-h-[56px] px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-mono-tech font-extrabold text-xs tracking-wider border-2 border-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.6)] flex items-center gap-2 animate-bounce"
          >
            <Crosshair className="w-5 h-5 text-white" />
            <span>TAKEDOWN</span>
          </button>
        )}

        {/* Interact / Breach Button */}
        {hasNearbyPrompt && (
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              sound.playConfirm();
              onInteract();
            }}
            className="min-w-[54px] min-h-[54px] px-4 py-2 rounded-2xl bg-cyan-400 active:scale-95 text-slate-950 font-mono-tech font-extrabold text-xs tracking-wider border-2 border-white shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center gap-2 animate-pulse"
          >
            <Key className="w-5 h-5 fill-slate-950" />
            <span>INTERACT [E]</span>
          </button>
        )}

        {/* Main Touch Action Pad */}
        <div className="grid grid-cols-2 gap-2">
          {/* Sprint Button */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onToggleSprint(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onToggleSprint(false);
            }}
            className={`min-w-[48px] min-h-[48px] px-3 py-2 rounded-xl border flex items-center justify-center gap-1.5 font-mono-tech text-[11px] font-bold active:scale-95 transition-all ${
              isSprinting
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-black/70 border-white/20 text-slate-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>SPRINT</span>
          </button>

          {/* Crouch Button */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              sound.playUiClick();
              onToggleCrouch();
            }}
            className={`min-w-[48px] min-h-[48px] px-3 py-2 rounded-xl border flex items-center justify-center gap-1.5 font-mono-tech text-[11px] font-bold active:scale-95 transition-all ${
              isCrouched
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                : 'bg-black/70 border-white/20 text-slate-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>CROUCH</span>
          </button>

          {/* Scanner Button */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onTriggerScanner();
            }}
            className={`min-w-[48px] min-h-[48px] px-3 py-2 rounded-xl border flex items-center justify-center gap-1.5 font-mono-tech text-[11px] font-bold active:scale-95 transition-all ${
              isScannerActive
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                : 'bg-black/70 border-white/20 text-slate-300'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>SCAN</span>
          </button>

          {/* Decoy Button */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              if (decoyCooldown <= 0) onThrowDecoy();
            }}
            disabled={decoyCooldown > 0}
            className={`min-w-[48px] min-h-[48px] px-3 py-2 rounded-xl border flex items-center justify-center gap-1.5 font-mono-tech text-[11px] font-bold active:scale-95 transition-all ${
              decoyCooldown > 0
                ? 'bg-black/40 border-white/5 text-slate-600 opacity-60'
                : 'bg-black/70 border-purple-400/40 text-purple-300'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{decoyCooldown > 0 ? `${Math.ceil(decoyCooldown)}s` : 'DECOY'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
