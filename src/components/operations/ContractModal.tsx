import React from 'react';
import { Mission } from '../../types/game';
import { sound } from '../../game/audio';
import { Shield, Eye, Video, Radio, ArrowRight, X, AlertTriangle, Play, Crosshair } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 select-none">
      <div className="relative w-full max-w-4xl brutal-frame glass-primary rounded-2xl shadow-[0_0_90px_rgba(0,0,0,0.9)] p-6 sm:p-9 overflow-hidden font-mono-tech terminal-glass surface-imperfections animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Band */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
                DOSSIER // {mission.operationCode}
              </span>
              <span className="text-xs text-slate-400 tracking-wider">
                {mission.sectorName}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              {mission.facilityName}
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playUiClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-black/60 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Oversized Brutalist Telemetry Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-black/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">SECURITY LEVEL</span>
            <span className="text-3xl font-display font-extrabold text-amber-400">
              0{mission.securityRating}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">CONTRACT BOUNTY</span>
            <span className="text-3xl font-display font-extrabold text-cyan-300">
              ₡{mission.basePayout.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">RISK PROFILE</span>
            <span className="text-3xl font-display font-extrabold text-rose-400">
              APEX
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">TIME ESTIMATE</span>
            <span className="text-3xl font-display font-extrabold text-white">
              04:30
            </span>
          </div>
        </div>

        {/* Briefing Text Box */}
        <div className="mb-6 p-5 rounded-xl bg-black/50 border border-white/10 space-y-2">
          <div className="text-xs text-cyan-400 font-bold tracking-widest uppercase flex items-center gap-2">
            <Crosshair className="w-4 h-4" />
            PRIMARY OPERATIONAL DIRECTIVE
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {mission.briefing}
          </p>
          <div className="text-xs text-slate-400 pt-1">
            TARGET CLASSIFICATION: <strong className="text-white">{mission.targetName}</strong> · EXTRACTION VECTOR: <strong className="text-cyan-300">ROOFTOP AERODYNE</strong>
          </div>
        </div>

        {/* Split Intelligence & Gear Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
          {/* Secondary Objectives */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
              SECONDARY MISSION DIRECTIVES
            </span>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              {mission.secondaryObjectives.map((sec, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{sec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Surveillance Rating Breakdown */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
              SURVEILLANCE & PATROL GRID
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-black/60 rounded-lg border border-white/5">
                <span className="text-[9px] text-slate-500 block">PATROLS</span>
                <span className="font-bold text-white text-base">{mission.intel.guards}</span>
              </div>
              <div className="p-2.5 bg-black/60 rounded-lg border border-white/5">
                <span className="text-[9px] text-slate-500 block">CAMERAS</span>
                <span className="font-bold text-white text-base">{mission.intel.cameras}</span>
              </div>
              <div className="p-2.5 bg-black/60 rounded-lg border border-white/5">
                <span className="text-[9px] text-slate-500 block">DRONES</span>
                <span className="font-bold text-white text-base">{mission.intel.drones}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Triggers with Clay Hierarchy */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-white/10">
          <TactileButton
            variant="clay-accent"
            size="lg"
            className="w-full sm:flex-1 justify-center"
            icon={<Play className="w-4 h-4 fill-slate-950" />}
            onClick={() => {
              sound.playConfirm();
              onBeginHeist();
            }}
          >
            START OPERATION
          </TactileButton>

          <TactileButton
            variant="glass"
            size="lg"
            className="w-full sm:w-auto px-8"
            onClick={onClose}
          >
            DISMISS DOSSIER
          </TactileButton>
        </div>

      </div>
    </div>
  );
};
