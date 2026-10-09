import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { Sliders, Volume2, Monitor, Keyboard, RotateCcw, AlertTriangle, ShieldCheck, Gamepad, Smartphone, Mouse, Hand } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { ClayKey } from '../common/ClayKey';
import { InputManager } from '../../game/input/InputManager';
import { InputPreference, ControlSettings } from '../../game/input/inputTypes';
import { useDevice } from '../../hooks/useDevice';

interface SettingsViewProps {
  onResetProgress: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetProgress,
  isMuted,
  onToggleMute
}) => {
  const device = useDevice();
  const [controlSettings, setControlSettings] = useState<ControlSettings>(() => InputManager.getSettings());
  const [masterVol, setMasterVol] = useState(80);
  const [sfxVol, setSfxVol] = useState(85);
  const [graphicsQuality, setGraphicsQuality] = useState<'ULTRA' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleMasterChange = (val: number) => {
    setMasterVol(val);
    sound.setVolumes(val / 100, sfxVol / 100);
  };

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    sound.setVolumes(masterVol / 100, val / 100);
  };

  const updateControls = (partial: Partial<ControlSettings>) => {
    sound.playUiClick();
    const updated = { ...controlSettings, ...partial };
    setControlSettings(updated);
    InputManager.updateSettings(partial);
  };

  const effectiveScheme = controlSettings.preference === 'AUTO' 
    ? device.activeInputMethod 
    : controlSettings.preference;

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
              SYS // CALIBRATION
            </span>
            <span className="text-xs text-slate-400">HARDWARE & KEYBOARD CONTROLS</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white tracking-wide">
            SETTINGS & CALIBRATION
          </h2>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto py-4">
        
        {/* Audio Calibration in Smoked Glass */}
        <div className="brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections space-y-6">
          <div className="flex items-center gap-2.5 text-sm font-display font-bold text-white border-b border-white/10 pb-4">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>ACOUSTIC & SYNTHESIZER CALIBRATION</span>
          </div>

          <div className="space-y-5 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-2 font-bold">
                <span>MASTER SYNTH VOL</span>
                <span className="text-cyan-300 font-extrabold">{masterVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVol}
                onChange={(e) => handleMasterChange(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-2 font-bold">
                <span>TACTICAL SFX FREQUENCY</span>
                <span className="text-cyan-300 font-extrabold">{sfxVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVol}
                onChange={(e) => handleSfxChange(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="pt-2">
              <TactileButton
                variant={isMuted ? 'clay-primary' : 'glass'}
                size="md"
                onClick={onToggleMute}
              >
                {isMuted ? 'UNMUTE MASTER AUDIO' : 'MUTE MASTER AUDIO'}
              </TactileButton>
            </div>

            {/* Graphics Performance Tier */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex justify-between items-center text-slate-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GRAPHICS & PARTICLE TIER</span>
                </span>
                <span className="text-cyan-300 font-extrabold">{graphicsQuality}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {(['ULTRA', 'HIGH', 'MEDIUM', 'LOW'] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => {
                      sound.playUiClick();
                      setGraphicsQuality(tier);
                      try {
                        localStorage.setItem('neon_heist_graphics_quality', tier);
                      } catch {
                        // ignore
                      }
                    }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      graphicsQuality === tier
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.25)]'
                        : 'bg-black/50 border-white/10 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-slate-500 font-mono-tech">
                {graphicsQuality === 'ULTRA' && 'Maximum dynamic lighting, 120+ particles, full ray casting, screen shake'}
                {graphicsQuality === 'HIGH' && 'Balanced atmospheric fog, shadow dampening, rain streaks, standard particles'}
                {graphicsQuality === 'MEDIUM' && 'Optimized shaders, reduced ambient lighting radius, stable mobile frame rate'}
                {graphicsQuality === 'LOW' && 'Battery saving, minimal particles, simplified lighting calculations'}
              </div>
            </div>
          </div>
        </div>

        {/* Universal Input System & Controls Reference */}
        <div className="brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5 text-sm font-display font-bold text-white">
              {effectiveScheme === 'TOUCH' ? (
                <Smartphone className="w-4 h-4 text-cyan-400" />
              ) : effectiveScheme === 'GAMEPAD' ? (
                <Gamepad className="w-4 h-4 text-cyan-400" />
              ) : (
                <Keyboard className="w-4 h-4 text-cyan-400" />
              )}
              <span>UNIVERSAL INPUT SCHEME & CALIBRATION</span>
            </div>

            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
              ACTIVE: {effectiveScheme}
            </span>
          </div>

          {/* Input Method Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              CONTROL INTERFACE PREFERENCE
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(
                [
                  { id: 'AUTO', label: 'AUTO DETECT', icon: <Sliders className="w-3 h-3" /> },
                  { id: 'TOUCH', label: 'TOUCH LINK', icon: <Smartphone className="w-3 h-3" /> },
                  { id: 'KEYBOARD', label: 'KEYS & MOUSE', icon: <Keyboard className="w-3 h-3" /> },
                  { id: 'GAMEPAD', label: 'CONTROLLER', icon: <Gamepad className="w-3 h-3" /> }
                ] as const
              ).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => updateControls({ preference: opt.id })}
                  className={`py-2 px-2.5 rounded-xl text-[10px] font-mono-tech font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    controlSettings.preference === opt.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                      : 'bg-black/50 border-white/10 hover:border-white/20 text-slate-400'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Touch Fine-Tuning (Shown if Touch is active or selected) */}
          {(effectiveScheme === 'TOUCH' || controlSettings.preference === 'TOUCH') && (
            <div className="p-3.5 bg-black/40 border border-cyan-500/20 rounded-xl space-y-3 text-xs">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Hand className="w-3 h-3" />
                <span>TOUCH CONTROLS ERGONOMICS</span>
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Joystick Size */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">JOYSTICK SIZE</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['sm', 'md', 'lg'] as const).map(sz => (
                      <button
                        key={sz}
                        onClick={() => updateControls({ joystickSize: sz })}
                        className={`py-1 text-[9px] rounded font-bold uppercase border cursor-pointer ${
                          controlSettings.joystickSize === sz
                            ? 'bg-cyan-900/60 border-cyan-400 text-cyan-300'
                            : 'bg-black/40 border-white/10 text-slate-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Size */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">BUTTON SIZE</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['sm', 'md', 'lg'] as const).map(sz => (
                      <button
                        key={sz}
                        onClick={() => updateControls({ buttonSize: sz })}
                        className={`py-1 text-[9px] rounded font-bold uppercase border cursor-pointer ${
                          controlSettings.buttonSize === sz
                            ? 'bg-cyan-900/60 border-cyan-400 text-cyan-300'
                            : 'bg-black/40 border-white/10 text-slate-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sliders for Touch Sensitivity & Opacity */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>SENSITIVITY</span>
                    <span className="text-cyan-300 font-bold">{Math.round(controlSettings.touchSensitivity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={Math.round(controlSettings.touchSensitivity * 100)}
                    onChange={(e) => updateControls({ touchSensitivity: Number(e.target.value) / 100 })}
                    className="w-full h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>OPACITY</span>
                    <span className="text-cyan-300 font-bold">{Math.round(controlSettings.controlOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={Math.round(controlSettings.controlOpacity * 100)}
                    onChange={(e) => updateControls({ controlOpacity: Number(e.target.value) / 100 })}
                    className="w-full h-1.5 bg-slate-900 rounded appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>

              {/* Left-Handed Mode Toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className="text-[10px] text-slate-300">LEFT-HANDED ORIENTATION</span>
                <button
                  onClick={() => updateControls({ leftHanded: !controlSettings.leftHanded })}
                  className={`px-2.5 py-1 text-[9px] rounded font-bold border transition-all cursor-pointer ${
                    controlSettings.leftHanded
                      ? 'bg-cyan-900/60 border-cyan-400 text-cyan-300'
                      : 'bg-black/40 border-white/10 text-slate-400'
                  }`}
                >
                  {controlSettings.leftHanded ? 'ENABLED (JOYSTICK RIGHT)' : 'DISABLED (JOYSTICK LEFT)'}
                </button>
              </div>
            </div>
          )}

          {/* Context-Adaptive Bindings Reference */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              ACTION MAPPINGS // {effectiveScheme}
            </span>

            {effectiveScheme === 'TOUCH' ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">MOVE INFILTRATION</span>
                  <span className="text-cyan-300 font-bold text-[11px]">VIRTUAL JOYSTICK</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">AIM / ORIENTATION</span>
                  <span className="text-cyan-300 font-bold text-[11px]">TOUCH-LOOK SWIPE</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">CROUCH (SILENT)</span>
                  <span className="text-cyan-300 font-bold text-[11px]">CROUCH PAD</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">SPRINT (BURST)</span>
                  <span className="text-cyan-300 font-bold text-[11px]">SPRINT PAD</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">INTERACT / BREACH</span>
                  <span className="text-cyan-300 font-bold text-[11px]">CONTEXTUAL [KEY]</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">SILENT TAKEDOWN</span>
                  <span className="text-rose-400 font-bold text-[11px]">TAKEDOWN BUTTON</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">PULSE SCANNER</span>
                  <span className="text-cyan-300 font-bold text-[11px]">SCANNER PAD</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">THROW DECOY</span>
                  <span className="text-purple-300 font-bold text-[11px]">DECOY PAD</span>
                </div>
              </div>
            ) : effectiveScheme === 'GAMEPAD' ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">MOVE INFILTRATION</span>
                  <ClayKey keyLabel="LEFT STICK" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">AIM / ORIENTATION</span>
                  <ClayKey keyLabel="RIGHT STICK" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">INTERACT / TAKEDOWN</span>
                  <ClayKey keyLabel="A" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">CROUCH (SILENT)</span>
                  <ClayKey keyLabel="B" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">THROW DECOY</span>
                  <ClayKey keyLabel="X" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">PULSE SCANNER</span>
                  <ClayKey keyLabel="Y" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">SPRINT (BURST)</span>
                  <ClayKey keyLabel="LB" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">PAUSE MISSION</span>
                  <ClayKey keyLabel="START" size="sm" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">MOVE INFILTRATION</span>
                  <div className="flex gap-1">
                    <ClayKey keyLabel="W" size="sm" />
                    <ClayKey keyLabel="A" size="sm" />
                    <ClayKey keyLabel="S" size="sm" />
                    <ClayKey keyLabel="D" size="sm" />
                  </div>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">AIM / CROSSHAIR</span>
                  <span className="text-cyan-300 font-bold text-[11px]">MOUSE POINTER</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">CROUCH (SILENT)</span>
                  <ClayKey keyLabel="C" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">SPRINT (BURST)</span>
                  <ClayKey keyLabel="SHIFT" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">INTERACT TERMINAL</span>
                  <ClayKey keyLabel="E" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">PULSE SCANNER</span>
                  <ClayKey keyLabel="Q" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">THROW DECOY</span>
                  <ClayKey keyLabel="F" size="sm" />
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                  <span className="text-slate-400">SILENT TAKEDOWN</span>
                  <ClayKey keyLabel="SPACE" size="sm" />
                </div>
              </div>
            )}
          </div>

          {/* Reset Save Progress */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 font-bold block">OPERATIVE RECORD RESET</span>
              <span className="text-[10px] text-slate-500">Purge local hardware save matrix</span>
            </div>

            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <TactileButton
                  variant="clay-danger"
                  size="sm"
                  onClick={() => {
                    sound.playSuspicionAlert();
                    setShowResetConfirm(false);
                    onResetProgress();
                  }}
                >
                  CONFIRM PURGE
                </TactileButton>
                <TactileButton
                  variant="glass"
                  size="sm"
                  onClick={() => setShowResetConfirm(false)}
                >
                  CANCEL
                </TactileButton>
              </div>
            ) : (
              <TactileButton
                variant="glass"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5 text-rose-400" />}
                onClick={() => setShowResetConfirm(true)}
              >
                RESET DATA
              </TactileButton>
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/10 pt-3">
        <span>STORAGE: PERSISTENT LOCAL AIR-GAP</span>
        <span>LATENCY: 0.1MS HARDWARE SYNCHRONIZED</span>
      </div>
    </div>
  );
};
