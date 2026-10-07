import React from 'react';
import { sound } from '../../game/audio';
import { AlertOctagon, RotateCcw, ArrowLeft, ShieldAlert } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

interface FailureScreenProps {
  missionTitle: string;
  facilityName: string;
  detectionPercent: number;
  onRetry: () => void;
  onAbort: () => void;
}

export const FailureScreen: React.FC<FailureScreenProps> = ({
  missionTitle,
  facilityName,
  detectionPercent,
  onRetry,
  onAbort
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 font-mono-tech select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg brutal-frame glass-primary border-rose-500/50 rounded-2xl shadow-[0_0_120px_rgba(244,63,94,0.35)] p-7 sm:p-9 flex flex-col terminal-glass surface-imperfections space-y-6">
        
        {/* Warning Icon & Classification */}
        <div className="text-center border-b border-rose-500/20 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/40 mx-auto flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(244,63,94,0.4)]">
            <AlertOctagon className="w-7 h-7 text-rose-400 animate-pulse" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="brutal-stamp text-rose-400 border-rose-500/40">
              SECURITY LOCKDOWN
            </span>
          </div>

          <h2 className="text-3xl font-display font-black text-white tracking-tight">
            OPERATION COMPROMISED
          </h2>
          <div className="text-xs text-rose-300/80 mt-1">
            CAUSE: SYSTEM MAXIMUM DETECTION & COMBAT ALERT
          </div>
        </div>

        {/* Telemetry Breakdown */}
        <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>TARGET SECTOR:</span>
            <span className="text-white font-bold">{facilityName}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>MISSION DOSSIER:</span>
            <span className="text-white font-bold">{missionTitle}</span>
          </div>
          <div className="flex justify-between text-slate-400 pt-2 border-t border-rose-500/10">
            <span>DETECTION SPIKE:</span>
            <span className="text-rose-400 font-bold">{Math.round(detectionPercent)}% (CRITICAL)</span>
          </div>
        </div>

        {/* Tactical Actions */}
        <div className="space-y-3 pt-2">
          <TactileButton
            variant="clay-danger"
            size="lg"
            className="w-full justify-center"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => {
              sound.playConfirm();
              onRetry();
            }}
          >
            RETRY INFILTRATION
          </TactileButton>

          <TactileButton
            variant="glass"
            size="md"
            className="w-full justify-center"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => {
              sound.playSuspicionAlert();
              onAbort();
            }}
          >
            ABORT TO OPERATIONS
          </TactileButton>
        </div>

        {/* Subtitle Advice */}
        <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-white/5">
          TACTICAL ADVICE: STAY SUBMERGED IN SHADOWS & USE AUDIO DECOYS TO DIVERT PATROLS
        </div>

      </div>
    </div>
  );
};
