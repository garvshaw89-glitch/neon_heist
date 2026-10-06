import React, { useState, useEffect } from 'react';
import { MissionResult } from '../../types/game';
import { sound } from '../../game/audio';
import { Award, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react';

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
    result.playStyle === 'GHOST' ? 'PERFECT GHOST' :
    result.playStyle === 'GHOST_WITH_TRACE' ? 'GHOST WITH A TRACE' : 'CHAOS OPERATIVE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-2xl bg-[#090d18] border border-cyan-500/40 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.2)] p-8 overflow-hidden">
        <div className="text-center mb-8">
          <div className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest mb-1">
            CONTRACT FULFILLED · ENCRYPTED TRANSMISSION
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            OPERATION COMPLETE
          </h2>
          <div className="text-sm font-mono-tech text-slate-400 mt-1">
            FACILITY: {result.facilityName}
          </div>
        </div>

        {/* Rating and Playstyle */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center mb-6">
          <div className="flex justify-center gap-1.5 mb-2">
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
          <div className="text-sm font-display font-bold text-cyan-300 tracking-wider">
            {ratingLabel}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono-tech">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 block">DETECTION</span>
            <span className="text-base font-bold text-slate-200">{result.detectionPercent.toFixed(1)}%</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 block">TIME</span>
            <span className="text-base font-bold text-slate-200">{timeFormatted}</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 block">HACKED</span>
            <span className="text-base font-bold text-slate-200">{result.systemsHacked}</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-center">
            <span className="text-[10px] text-slate-500 block">ALARMS</span>
            <span className={`text-base font-bold ${result.alarmsTriggered === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.alarmsTriggered}
            </span>
          </div>
        </div>

        {/* Payout Breakdown */}
        <div className="space-y-2 p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl font-mono-tech text-xs mb-8">
          <div className="flex justify-between text-slate-400">
            <span>BASE CONTRACT PAYOUT</span>
            <span className="text-slate-200">₡{result.basePayout.toLocaleString()}</span>
          </div>
          {result.stealthBonus > 0 && (
            <div className="flex justify-between text-cyan-400">
              <span>STEALTH INFILTRATION BONUS</span>
              <span>+₡{result.stealthBonus.toLocaleString()}</span>
            </div>
          )}
          {result.noCasualtyBonus > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>ZERO CASUALTY GHOST BONUS</span>
              <span>+₡{result.noCasualtyBonus.toLocaleString()}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-bold text-white">
            <span className="font-display">TOTAL CREDITS EARNED</span>
            <span className="text-cyan-400 font-mono-tech">₡{animatedTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={() => {
            sound.playConfirm();
            onContinue();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        >
          <span>TRANSFER FUNDS & RETURN TO DASHBOARD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
