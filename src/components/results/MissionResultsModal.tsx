import React, { useState, useEffect } from 'react';
import { MissionResult } from '../../types/game';
import { sound } from '../../game/audio';
import { Award, ShieldCheck, Zap, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

interface MissionResultsModalProps {
  result: MissionResult;
  onContinue: () => void;
}

export const MissionResultsModal: React.FC<MissionResultsModalProps> = ({
  result,
  onContinue
}) => {
  const [animatedTotal, setAnimatedTotal] = useState(0);

  useEffect(() => {
    sound.playConfirm();
    let current = 0;
    const target = result.totalPayout;
    const step = Math.max(100, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedTotal(target);
        clearInterval(timer);
      } else {
        setAnimatedTotal(current);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [result.totalPayout]);

  const minutes = Math.floor(result.timeSeconds / 60);
  const seconds = result.timeSeconds % 60;
  const timeFormatted = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const ratingLabel = 
    result.playStyle === 'GHOST' ? 'PERFECT GHOST // ZERO TRACE' :
    result.playStyle === 'GHOST_WITH_TRACE' ? 'GHOST WITH TRACE' : 'CHAOS OPERATIVE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 select-none font-mono-tech">
      <div className="relative w-full max-w-2xl brutal-frame glass-primary rounded-2xl shadow-[0_0_90px_rgba(0,0,0,0.95)] p-7 sm:p-9 overflow-hidden terminal-glass surface-imperfections animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="text-center mb-6 border-b border-white/10 pb-5">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
              DEBRIEF // CONTRACT COMPLETE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
            OPERATION SUCCESSFUL
          </h2>
          <div className="text-xs text-slate-400 mt-1">
            TARGET SECTOR: {result.facilityName}
          </div>
        </div>

        {/* Rating and Stars */}
        <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-center mb-6">
          <div className="flex justify-center gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`w-6 h-6 ${
                  idx < result.ratingStars
                    ? 'text-cyan-400 fill-cyan-400 drop-shadow-[0_0_8px_#22d3ee]'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="text-sm font-display font-black text-cyan-300 tracking-wider">
            {ratingLabel}
          </div>
        </div>

        {/* Oversized Performance Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 bg-black/60 border border-white/5 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 block uppercase">DETECTION</span>
            <span className="text-xl font-display font-extrabold text-slate-200">
              {result.detectionPercent.toFixed(1)}%
            </span>
          </div>
          <div className="p-3.5 bg-black/60 border border-white/5 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 block uppercase">TIME</span>
            <span className="text-xl font-display font-extrabold text-white">
              {timeFormatted}
            </span>
          </div>
          <div className="p-3.5 bg-black/60 border border-white/5 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 block uppercase">ICE HACKS</span>
            <span className="text-xl font-display font-extrabold text-cyan-300">
              0{result.systemsHacked}
            </span>
          </div>
          <div className="p-3.5 bg-black/60 border border-white/5 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 block uppercase">ALARMS</span>
            <span className={`text-xl font-display font-extrabold ${result.alarmsTriggered === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              0{result.alarmsTriggered}
            </span>
          </div>
        </div>

        {/* Payout Breakdown */}
        <div className="space-y-2 p-5 bg-black/50 border border-white/10 rounded-xl text-xs mb-7">
          <div className="flex justify-between text-slate-400">
            <span>BASE CONTRACT PAYOUT</span>
            <span className="text-slate-200">₡{result.basePayout.toLocaleString()}</span>
          </div>
          {result.stealthBonus > 0 && (
            <div className="flex justify-between text-cyan-400">
              <span>GHOST PROTOCOL STEALTH BONUS</span>
              <span>+₡{result.stealthBonus.toLocaleString()}</span>
            </div>
          )}
          {result.noCasualtyBonus > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>ZERO CASUALTY OPERATIVE BONUS</span>
              <span>+₡{result.noCasualtyBonus.toLocaleString()}</span>
            </div>
          )}
          <div className="pt-3 border-t border-white/10 flex justify-between items-baseline text-white">
            <span className="font-display font-bold text-sm uppercase">TOTAL FUNDS DISPATCHED</span>
            <span className="text-2xl font-display font-black text-cyan-300">
              ₡{animatedTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Continue Action */}
        <TactileButton
          variant="clay-accent"
          size="lg"
          className="w-full justify-center"
          icon={<ArrowRight className="w-4 h-4 fill-slate-950" />}
          onClick={() => {
            sound.playConfirm();
            onContinue();
          }}
        >
          TRANSFER FUNDS & RETURN TO COMMAND
        </TactileButton>

      </div>
    </div>
  );
};
