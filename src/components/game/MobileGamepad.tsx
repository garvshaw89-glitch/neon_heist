import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Shield, Scan, Volume2, Key, Zap, Crosshair, Pause, Compass } from 'lucide-react';
import { sound } from '../../game/audio';
import { InputManager } from '../../game/input/InputManager';
import { ControlSettings } from '../../game/input/inputTypes';

export interface MobileGamepadProps {
  onMove: (vector: { x: number; y: number }) => void;
  onAim: (angle: number) => void;
  onLookDelta?: (delta: { dx: number; dy: number }) => void;
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
  nearbyPromptText?: string;
  onPause: () => void;
  settings: ControlSettings;
}

export const MobileGamepad: React.FC<MobileGamepadProps> = ({
  onMove,
  onAim,
  onLookDelta,
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
  hasNearbyPrompt,
  nearbyPromptText,
  onPause,
  settings
}) => {
  // Joystick State & Refs
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const joystickPointerIdRef = useRef<number | null>(null);

  // Look Area State & Refs
  const lookAreaRef = useRef<HTMLDivElement | null>(null);
  const lookPointerIdRef = useRef<number | null>(null);
  const lastLookPosRef = useRef<{ x: number; y: number } | null>(null);

  // Button sizing classes
  const joystickSizePx = settings.joystickSize === 'sm' ? 104 : settings.joystickSize === 'lg' ? 144 : 124;
  const knobSizePx = settings.joystickSize === 'sm' ? 42 : settings.joystickSize === 'lg' ? 56 : 48;
  const buttonSizeClass = settings.buttonSize === 'sm' 
    ? 'min-w-[42px] min-h-[42px] p-2 text-[10px]' 
    : settings.buttonSize === 'lg' 
    ? 'min-w-[56px] min-h-[56px] p-3.5 text-xs' 
    : 'min-w-[48px] min-h-[48px] p-2.5 text-[11px]';

  const opacityStyle = { opacity: Math.max(0.3, Math.min(1.0, settings.controlOpacity)) };

  // --- JOYSTICK POINTER HANDLERS ---
  const handleJoystickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (joystickPointerIdRef.current !== null) return;
    e.preventDefault();
    e.stopPropagation();

    joystickPointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    setIsJoystickActive(true);
    InputManager.triggerHaptic('light');
    updateKnob(e.clientX, e.clientY);
  };

  const handleJoystickPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== joystickPointerIdRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    updateKnob(e.clientX, e.clientY);
  };

  const handleJoystickPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== joystickPointerIdRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    resetJoystick();
  };

  const resetJoystick = useCallback(() => {
    joystickPointerIdRef.current = null;
    setIsJoystickActive(false);
    setKnobPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  }, [onMove]);

  const updateKnob = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = rect.width / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });

    // Normalized move vector with deadzone
    const deadzone = 0.12;
    const rawMag = clampedDist / maxRadius;
    if (rawMag < deadzone) {
      onMove({ x: 0, y: 0 });
    } else {
      const scaledMag = (rawMag - deadzone) / (1 - deadzone);
      const normX = Math.cos(angle) * scaledMag;
      const normY = Math.sin(angle) * scaledMag;
      onMove({ x: normX, y: normY });
      // If player is not actively using look pad, orient player in movement direction
      if (lookPointerIdRef.current === null) {
        onAim(angle);
      }
    }
  };

  // --- TOUCH-LOOK REGION HANDLERS ---
  const handleLookPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If tapping an interactive button inside look region, ignore
    if ((e.target as HTMLElement)?.closest('button')) return;
    if (lookPointerIdRef.current !== null) return;
    e.preventDefault();
    e.stopPropagation();

    lookPointerIdRef.current = e.pointerId;
    lastLookPosRef.current = { x: e.clientX, y: e.clientY };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleLookPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== lookPointerIdRef.current || !lastLookPosRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const dx = (e.clientX - lastLookPosRef.current.x) * settings.cameraSensitivity;
    const dy = (e.clientY - lastLookPosRef.current.y) * settings.cameraSensitivity * (settings.invertVerticalLook ? -1 : 1);
    lastLookPosRef.current = { x: e.clientX, y: e.clientY };

    if (onLookDelta) {
      onLookDelta({ dx, dy });
    }

    if (Math.hypot(dx, dy) > 1.5) {
      const angle = Math.atan2(dy, dx);
      onAim(angle);
    }
  };

  const handleLookPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== lookPointerIdRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    lookPointerIdRef.current = null;
    lastLookPosRef.current = null;
  };

  // Safe reset when unmounting or on blur
  useEffect(() => {
    const handleWindowBlur = () => {
      resetJoystick();
      lookPointerIdRef.current = null;
      lastLookPosRef.current = null;
      onToggleSprint(false);
    };

    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      resetJoystick();
    };
  }, [resetJoystick, onToggleSprint]);

  // Layout arrangement (left-handed or standard)
  const isLeftHanded = settings.leftHanded;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden touch-none flex flex-col justify-between"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))'
      }}
    >
      {/* TOP CONTROLS BAR: Pause & Tactical Badge */}
      <div className="w-full flex items-center justify-between px-2 pt-1 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="brutal-stamp text-[9px] text-cyan-400 border-cyan-500/30 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
            TOUCH LINK ACTIVE
          </span>
        </div>

        {/* Top-Right Quick Pause Button */}
        <button
          onClick={() => {
            InputManager.triggerHaptic('medium');
            sound.playPause();
            onPause();
          }}
          className="p-2 sm:p-2.5 rounded-xl brutal-frame bg-[#0a0f1d]/80 hover:bg-[#121a2f] border border-white/20 text-slate-300 active:scale-95 transition-all shadow-xl flex items-center gap-1.5 backdrop-blur-md"
          title="Pause Mission"
        >
          <Pause className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-mono-tech font-bold hidden sm:inline">PAUSE</span>
        </button>
      </div>

      {/* MIDDLE-TOUCH: Full-Height Dedicated Touch-Look Region */}
      <div
        ref={lookAreaRef}
        onPointerDown={handleLookPointerDown}
        onPointerMove={handleLookPointerMove}
        onPointerUp={handleLookPointerUp}
        onPointerCancel={handleLookPointerUp}
        className={`absolute inset-0 z-10 pointer-events-auto ${
          isLeftHanded ? 'right-0 left-[35%]' : 'left-0 right-[35%]'
        }`}
        style={{ touchAction: 'none' }}
      >
        {/* Subtle holographic swipe hint indicator on drag */}
        {lookPointerIdRef.current !== null && (
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 pointer-events-none flex items-center gap-2 text-cyan-400/50 text-[10px] font-mono-tech uppercase tracking-widest animate-pulse">
            <Compass className="w-4 h-4 animate-spin" />
            <span>AIM // LOOKING</span>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS: Virtual Joystick & Action Cluster */}
      <div 
        className={`w-full flex items-end justify-between px-1 sm:px-4 z-20 pointer-events-none ${
          isLeftHanded ? 'flex-row-reverse' : 'flex-row'
        }`}
        style={opacityStyle}
      >
        {/* 1. VIRTUAL MOVEMENT JOYSTICK */}
        <div className="pointer-events-auto relative mb-1">
          <div
            ref={joystickBaseRef}
            onPointerDown={handleJoystickPointerDown}
            onPointerMove={handleJoystickPointerMove}
            onPointerUp={handleJoystickPointerUp}
            onPointerCancel={handleJoystickPointerUp}
            className="rounded-full brutal-frame border-2 border-cyan-500/30 bg-[#050811]/75 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_0_24px_rgba(34,211,238,0.15)] flex items-center justify-center relative touch-none cursor-pointer select-none"
            style={{
              width: `${joystickSizePx}px`,
              height: `${joystickSizePx}px`
            }}
          >
            {/* Holographic Crosshair Grid */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-full h-[1px] bg-cyan-400" />
              <div className="h-full w-[1px] bg-cyan-400 absolute" />
              <div className="w-3/4 h-3/4 rounded-full border border-dashed border-cyan-400/40" />
            </div>

            {/* Glowing Movable Thumbstick Knob */}
            <div
              className={`rounded-full bg-gradient-to-b from-[#18263e] to-[#0c1422] border-2 border-cyan-400 shadow-[0_4px_16px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center transition-transform duration-75 ${
                isJoystickActive ? 'scale-110 shadow-[0_0_25px_rgba(34,211,238,0.6)] border-cyan-300' : ''
              }`}
              style={{
                width: `${knobSizePx}px`,
                height: `${knobSizePx}px`,
                transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
              }}
            >
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
            </div>
          </div>

          <div className="text-center font-mono-tech text-[8px] sm:text-[9px] text-cyan-400/80 font-bold uppercase tracking-widest mt-1">
            MOVE // NAV
          </div>
        </div>

        {/* 2. TACTILE ACTION BUTTONS CLUSTER */}
        <div className="pointer-events-auto flex flex-col items-end gap-2 mb-1">
          {/* Contextual TAKEDOWN Button (Glows crimson when near unaware guard) */}
          {hasTakedownPrompt && onTakedown && (
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                InputManager.triggerHaptic('heavy');
                sound.playSuspicionAlert();
                onTakedown();
              }}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-mono-tech font-extrabold text-xs tracking-wider border-2 border-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.7)] flex items-center gap-2 animate-bounce backdrop-blur-md"
            >
              <Crosshair className="w-5 h-5 text-white" />
              <span>TAKEDOWN</span>
            </button>
          )}

          {/* Contextual INTERACT / BREACH Button (Glows vibrant cyan when near interactable) */}
          {hasNearbyPrompt && (
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                InputManager.triggerHaptic('medium');
                sound.playConfirm();
                onInteract();
              }}
              className="px-4 py-2.5 rounded-2xl bg-cyan-400 active:scale-95 text-slate-950 font-mono-tech font-extrabold text-xs tracking-wider border-2 border-white shadow-[0_0_25px_rgba(34,211,238,0.7)] flex items-center gap-2 animate-pulse backdrop-blur-md"
            >
              <Key className="w-5 h-5 fill-slate-950" />
              <span>{nearbyPromptText || 'INTERACT'}</span>
            </button>
          )}

          {/* Main Action Pad: Sprint, Crouch, Scanner, Decoy */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl brutal-frame bg-[#050811]/70 border border-white/10 backdrop-blur-md shadow-2xl">
            {/* SPRINT BUTTON */}
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                InputManager.triggerHaptic('light');
                if (settings.sprintMode === 'TOGGLE') {
                  onToggleSprint(!isSprinting);
                } else {
                  onToggleSprint(true);
                }
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                if (settings.sprintMode === 'HOLD') {
                  onToggleSprint(false);
                }
              }}
              className={`${buttonSizeClass} rounded-xl border flex items-center justify-center gap-1.5 font-mono-tech font-bold active:scale-95 transition-all cursor-pointer ${
                isSprinting
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.6)] font-black'
                  : 'bg-black/60 border-white/15 text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>RUN</span>
            </button>

            {/* CROUCH BUTTON */}
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                InputManager.triggerHaptic('light');
                sound.playUiClick();
                onToggleCrouch();
              }}
              className={`${buttonSizeClass} rounded-xl border flex items-center justify-center gap-1.5 font-mono-tech font-bold active:scale-95 transition-all cursor-pointer ${
                isCrouched
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.6)] font-black'
                  : 'bg-black/60 border-white/15 text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>CROUCH</span>
            </button>

            {/* SCANNER BUTTON */}
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                InputManager.triggerHaptic('light');
                onTriggerScanner();
              }}
              className={`${buttonSizeClass} rounded-xl border flex items-center justify-center gap-1.5 font-mono-tech font-bold active:scale-95 transition-all cursor-pointer ${
                isScannerActive
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.6)] font-black'
                  : 'bg-black/60 border-white/15 text-slate-300 hover:text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>SCAN</span>
            </button>

            {/* DECOY BUTTON */}
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                if (decoyCooldown <= 0) {
                  InputManager.triggerHaptic('medium');
                  onThrowDecoy();
                }
              }}
              disabled={decoyCooldown > 0}
              className={`${buttonSizeClass} rounded-xl border flex items-center justify-center gap-1.5 font-mono-tech font-bold active:scale-95 transition-all cursor-pointer ${
                decoyCooldown > 0
                  ? 'bg-black/40 border-white/5 text-slate-600 opacity-60 cursor-not-allowed'
                  : 'bg-black/60 border-purple-500/40 text-purple-300 hover:text-purple-100 hover:border-purple-400'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{decoyCooldown > 0 ? `${Math.ceil(decoyCooldown)}s` : 'DECOY'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
