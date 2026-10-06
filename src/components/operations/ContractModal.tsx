import React from 'react';
import { Mission } from '../../types/game';
import { sound } from '../../game/audio';
import { Shield, Eye, Video, Radio, ArrowRight, X, AlertTriangle } from 'lucide-react';

interface ContractModalProps {
  mission: Mission;
  onBeginHeist: () => void;
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  mission,
  onBeginHeist,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl bg-[#080d19] border border-cyan-500/40 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.2)] p-6 sm:p-8 overflow-hidden font-mono-tech">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
              CONTRACT DOSSIER · {mission.operationCode}
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-wide">
              {mission.facilityName}
            </h2>
            <div className="text-xs text-slate-400 mt-1">
              {mission.sectorName}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Briefing Text */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-xs text-cyan-400/90 font-bold mb-1">PRIMARY OBJECTIVE</div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans mb-3">
            {mission.briefing}
          </p>
          <div className="text-[11px] text-slate-400">
            TARGET: <span className="text-white font-bold">{mission.targetName}</span>
          </div>
        </div>

        {/* Secondary Objectives & Intelligence Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Secondary Objectives */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              SECONDARY OBJECTIVES
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {mission.secondaryObjectives.map((sec, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{sec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Intelligence Ratings */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              FACILITY INTELLIGENCE
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">GUARDS</span>
                <span className="font-bold text-white">{mission.intel.guards}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">CAMERAS</span>
                <span className="font-bold text-white">{mission.intel.cameras}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">DRONES</span>
                <span className="font-bold text-white">{mission.intel.drones}</span>
              </div>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="text-slate-400">SECURITY RATING:</span>
              <span className="text-amber-400 font-bold">{mission.securityRating} / 10</span>
            </div>
          </div>
        </div>

        {/* Recommended Gear & Expected Payout */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 mb-8">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block mb-1">
              RECOMMENDED EQUIPMENT
            </span>
            <div className="flex flex-wrap gap-2">
              {mission.recommendedEquipment.map((gear, idx) => (
                <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                  {gear}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase block mb-0.5">
              ESTIMATED PAYOUT
            </span>
            <span className="text-xl font-display font-bold text-cyan-300">
              ₡{mission.basePayout.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sound.playConfirm();
            onBeginHeist();
          }}
          className="w-full py-4 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
        >
          <span>BEGIN HEIST</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
