import React from 'react';
import { sound } from '../../game/audio';
import { Play, RotateCcw, Sliders, ArrowLeft, Shield, Clock, Crosshair, Volume2, VolumeX } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

interface PauseMenuProps {
  missionTitle: string;
  facilityName: string;
  timeElapsedSeconds: number;
  detectionPercent: number;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onToggleMute: () => void;
  onAbort: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  missionTitle,
  facilityName,
  timeElapsedSeconds,
  detectionPercent,
  isMuted,
  onResume,
  onRestart,
  onToggleMute,
  onAbort
}) => {
  const minutes = Math.floor(timeElapsedSeconds / 60);
  const seconds = timeElapsedSeconds % 60;
  const timeFormatted = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-2xl p-4 sm:p-6 font-mono-tech select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg brutal-frame glass-primary rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.95)] p-7 sm:p-9 flex flex-col terminal-glass surface-imperfections space-y-6">
        
        {/* Header */}
        <div className="text-center border-b border-white/10 pb-5">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
              TACTICAL SUSPENSION
            </span>
          </div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">
            GAME PAUSED
          </h2>
          <div className="text-xs text-slate-400 mt-1">
            {facilityName} · {missionTitle}
          </div>
        </div>

        {/* Live Telemetry Snapshot */}
        <div className="grid grid-cols-2 gap-3 bg-black/60 p-4 rounded-xl border border-white/5 text-center">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-mono">TIME IN SECTOR</span>
            <span className="text-xl font-display font-bold text-white mt-0.5">
              {timeFormatted}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-mono">DETECTION PEAK</span>
            <span className={`text-xl font-display font-bold mt-0.5 ${
              detectionPercent >= 75 ? 'text-rose-400' : 'text-cyan-300'
            }`}>
              {Math.round(detectionPercent)}%
            </span>
          </div>
        </div>

        {/* Actions Stack */}
        <div className="space-y-3 pt-2">
          <TactileButton
            variant="clay-primary"
            size="lg"
            className="w-full justify-center"
            icon={<Play className="w-4 h-4 fill-white" />}
            onClick={() => {
              sound.playResume();
              onResume();
            }}
          >
            RESUME OPERATION
          </TactileButton>

          <TactileButton
            variant="glass"
            size="md"
            className="w-full justify-center"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => {
              sound.playConfirm();
              onRestart();
            }}
          >
            RESTART CHECKPOINT
          </TactileButton>

          <div className="flex gap-3">
            <button
              onClick={() => {
                sound.playUiClick();
                onToggleMute();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 hover:border-white/20 text-xs font-mono-tech flex items-center justify-center gap-2 text-slate-300 transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span>{isMuted ? 'AUDIO: MUTED' : 'AUDIO: ACTIVE'}</span>
            </button>
          </div>

          <TactileButton
            variant="clay-danger"
            size="md"
            className="w-full justify-center mt-2"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => {
              sound.playSuspicionAlert();
              onAbort();
            }}
          >
            ABORT MISSION & QUIT
          </TactileButton>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-white/5">
          PRESS [ESC] OR [P] TO RESUME AT ANY TIME
        </div>

      </div>
    </div>
  );
};
