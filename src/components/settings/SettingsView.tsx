import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { Sliders, Volume2, Monitor, Keyboard, RotateCcw, AlertTriangle } from 'lucide-react';

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
  const [graphicsQuality, setGraphicsQuality] = useState<'ULTRA' | 'HIGH' | 'PERFORMANCE'>('HIGH');
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
    <div className="w-full h-[calc(100vh-4rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-0.5">
            TERMINAL ENVIRONMENT PREFERENCES
          </span>
          <h2 className="text-xl font-display font-bold text-white tracking-wide">
            SETTINGS & CALIBRATION
          </h2>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-auto">
        {/* Audio Calibration */}
        <div className="p-6 rounded-2xl border border-white/5 bg-[#090e1c]/60 space-y-6">
          <div className="flex items-center gap-2 text-sm font-display font-bold text-white border-b border-white/5 pb-3">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>AUDIO FREQUENCIES</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1.5">
                <span>MASTER VOL</span>
                <span className="text-cyan-300 font-bold">{masterVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVol}
                onChange={(e) => handleMasterChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1.5">
                <span>TACTICAL SFX VOL</span>
                <span className="text-cyan-300 font-bold">{sfxVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVol}
                onChange={(e) => handleSfxChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={onToggleMute}
                className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:text-white transition-colors"
              >
                {isMuted ? 'UNMUTE MASTER AUDIO' : 'MUTE MASTER AUDIO'}
              </button>
            </div>
          </div>
        </div>

        {/* Controls Reference */}
        <div className="p-6 rounded-2xl border border-white/5 bg-[#090e1c]/60 space-y-6">
          <div className="flex items-center gap-2 text-sm font-display font-bold text-white border-b border-white/5 pb-3">
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <span>OPERATIVE KEYBINDINGS</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">MOVEMENT</span>
              <span className="text-slate-200 font-bold">W / A / S / D</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">CROUCH / SNEAK</span>
              <span className="text-cyan-300 font-bold">[C] KEY</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">OPTICAL CLOAK</span>
              <span className="text-cyan-300 font-bold">[Q] KEY</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">EMP / DISTRACT</span>
              <span className="text-purple-300 font-bold">[F] KEY</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">HACK & INTERACT</span>
              <span className="text-slate-200 font-bold">[E] KEY</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">SILENT TAKEDOWN</span>
              <span className="text-rose-300 font-bold">[SPACEBAR]</span>
            </div>
          </div>
        </div>

        {/* Save & Reset Management */}
        <div className="md:col-span-2 p-6 rounded-2xl border border-rose-500/20 bg-[#090e1c]/60 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-display font-bold text-white mb-1">
              GHOSTNET PROFILE PERSISTENCE
            </h4>
            <p className="text-xs text-slate-400">
              Operative progress is stored in local encrypted cache.
            </p>
          </div>

          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playSuspicionAlert();
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
              >
                CONFIRM WIPE ALL DATA
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs hover:text-white"
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-950/30 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET ALL PROGRESS</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500 flex justify-between">
        <span>GHOSTNET VERSION 4.2.0 · BUILD ID 8942-PX</span>
        <span>SYSTEM CALIBRATED</span>
      </div>
    </div>
  );
};
