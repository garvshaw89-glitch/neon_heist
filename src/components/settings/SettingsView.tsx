import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { Sliders, Volume2, Monitor, Keyboard, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { ClayKey } from '../common/ClayKey';

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

  return (
    <div className="w-full h-[calc(100vh-4.5rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech select-none">
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

        {/* Physical Clay Controls Reference */}
        <div className="brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections space-y-5">
          <div className="flex items-center gap-2.5 text-sm font-display font-bold text-white border-b border-white/10 pb-4">
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <span>TACTICAL PHYSICAL KEYBINDINGS</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">MOVE INFILTRATION</span>
              <div className="flex gap-1">
                <ClayKey keyLabel="W" size="sm" />
                <ClayKey keyLabel="A" size="sm" />
                <ClayKey keyLabel="S" size="sm" />
                <ClayKey keyLabel="D" size="sm" />
              </div>
            </div>

            <div className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">CROUCH (SILENT)</span>
              <ClayKey keyLabel="C" size="sm" />
            </div>

            <div className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">INTERACT TERMINAL</span>
              <ClayKey keyLabel="E" size="sm" />
            </div>

            <div className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">PULSE SCANNER</span>
              <ClayKey keyLabel="Q" size="sm" />
            </div>

            <div className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">THROW DECOY</span>
              <ClayKey keyLabel="F" size="sm" />
            </div>

            <div className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
              <span className="text-slate-400">SILENT TAKEDOWN</span>
              <ClayKey keyLabel="SPACE" size="sm" />
            </div>
          </div>

          {/* Reset Save Progress */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
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
