import React, { useState } from 'react';
import { Mission } from '../../types/game';
import { MISSIONS } from '../../game/missions';
import { ContractModal } from './ContractModal';
import { sound } from '../../game/audio';
import { Shield, Crosshair, ArrowRight, CheckCircle2, ChevronRight, Play, Eye, Lock, Layers, Zap, Clock } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

interface OperationsViewProps {
  completedMissionIds: string[];
  onStartMission: (mission: Mission) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  completedMissionIds,
  onStartMission
}) => {
  const [selectedAct, setSelectedAct] = useState<number | 'ALL'>('ALL');
  const [selectedMission, setSelectedMission] = useState<Mission>(MISSIONS[0]);
  const [showContractModal, setShowContractModal] = useState(false);

  // Check if mission is unlocked
  const isMissionUnlocked = (m: Mission): boolean => {
    const index = MISSIONS.findIndex(item => item.id === m.id);
    if (index === 0) return true; // Level 01 always unlocked
    // If completed or previous completed
    if (completedMissionIds.includes(m.id)) return true;
    const prevMission = MISSIONS[index - 1];
    return completedMissionIds.includes(prevMission.id);
  };

  const filteredMissions = selectedAct === 'ALL'
    ? MISSIONS
    : MISSIONS.filter(m => m.actNumber === selectedAct);

  const handleSelect = (m: Mission) => {
    sound.playUiClick();
    setSelectedMission(m);
  };

  const handleOpenContract = () => {
    if (!isMissionUnlocked(selectedMission)) {
      sound.playSuspicionAlert();
      return;
    }
    sound.playConfirm();
    setShowContractModal(true);
  };

  const acts = [
    { num: 'ALL', title: 'FULL CAMPAIGN', subtitle: 'ALL 9 OPERATIONS' },
    { num: 1, title: 'ACT I: BECOMING THE GHOST', subtitle: 'LEVELS 01 - 03' },
    { num: 2, title: 'ACT II: CORPORATE INFILTRATION', subtitle: 'LEVELS 04 - 06' },
    { num: 3, title: 'ACT III: THE GHOST PROTOCOL', subtitle: 'LEVELS 07 - 09' }
  ];

  return (
    <div className="w-full h-[calc(100vh-4.5rem)] p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech select-none">
      {/* Top Brutalist Header Band */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
              CAMPAIGN // THE GHOST PROTOCOL
            </span>
            <span className="text-xs text-slate-400">MEGACITY INFILTRATION GRID</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white tracking-wide">
            CLASSIFIED OPERATIONS
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono-tech">
          <span className="text-slate-400">
            TOTAL OPERATIONS: <strong className="text-white">9 LEVELS</strong>
          </span>
          <span className="text-slate-400">
            COMPLETED: <strong className="text-emerald-400">{completedMissionIds.length} / 9</strong>
          </span>
        </div>
      </div>

      {/* Act Selector Filter Bar */}
      <div className="flex items-center gap-2 pt-3 pb-2 overflow-x-auto no-scrollbar">
        {acts.map(act => {
          const isActActive = selectedAct === act.num;
          return (
            <button
              key={String(act.num)}
              onClick={() => {
                sound.playUiClick();
                setSelectedAct(act.num as number | 'ALL');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                isActActive
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  : 'bg-black/50 border-white/10 hover:border-white/25 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{act.title}</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">({act.subtitle})</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Map & Mission Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-stretch py-2">
        
        {/* Left 7 Columns: Tactical Sector Map with Mission Node Network */}
        <div className="lg:col-span-7 brutal-frame glass-primary p-5 sm:p-6 rounded-2xl terminal-glass surface-imperfections relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          <div className="absolute inset-0 brutal-grid opacity-25 pointer-events-none" />

          {/* Top Classification Banner */}
          <div className="flex items-center justify-between z-10 text-[11px] border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-white font-bold">TACTICAL SATELLITE RADAR</span>
            </div>
            <span className="text-slate-400">
              DISPATCH VECTOR: <strong className="text-cyan-300">{selectedMission.operationCode}</strong>
            </span>
          </div>

          {/* Tactical Grid Visualizer */}
          <div className="relative w-full h-80 border border-white/10 rounded-xl bg-black/70 p-4 overflow-hidden my-4 z-10 shadow-inner">
            {/* Radar Sweep Arc */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08)_0%,transparent_75%)] pointer-events-none" />

            {/* Connecting Geometric Routes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <line x1="12%" y1="78%" x2="24%" y2="52%" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="24%" y1="52%" x2="38%" y2="76%" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="38%" y1="76%" x2="52%" y2="42%" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="52%" y1="42%" x2="64%" y2="68%" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="64%" y1="68%" x2="74%" y2="34%" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="74%" y1="34%" x2="84%" y2="60%" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="84%" y1="60%" x2="92%" y2="28%" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>

            {/* Mission Nodes */}
            {MISSIONS.map((m, idx) => {
              const isSelected = selectedMission.id === m.id;
              const isCompleted = completedMissionIds.includes(m.id);
              const unlocked = isMissionUnlocked(m);

              const positions = [
                { top: '78%', left: '12%' }, // Level 1
                { top: '52%', left: '24%' }, // Level 2
                { top: '76%', left: '38%' }, // Level 3
                { top: '42%', left: '52%' }, // Level 4
                { top: '68%', left: '64%' }, // Level 5
                { top: '34%', left: '74%' }, // Level 6
                { top: '60%', left: '84%' }, // Level 7
                { top: '28%', left: '92%' }, // Level 8
                { top: '82%', left: '88%' }  // Level 9
              ];
              const pos = positions[idx] || { top: '50%', left: '50%' };

              return (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 group flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#1c283c] to-[#0f1726] border-2 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.5)] z-20 scale-110'
                      : unlocked
                      ? 'bg-black/75 border border-white/20 hover:border-cyan-400/70 hover:scale-105 z-10'
                      : 'bg-black/80 border border-white/10 opacity-50 cursor-pointer z-10'
                  }`}
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className="relative">
                    {unlocked ? (
                      <span
                        className={`w-3.5 h-3.5 rounded-full block ${
                          isCompleted
                            ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                            : isSelected
                            ? 'bg-cyan-400 animate-ping'
                            : 'bg-cyan-300'
                        }`}
                      />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 absolute inset-0 block shadow-[0_0_10px_#22d3ee]" />
                    )}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">
                      {m.operationCode}
                    </div>
                    <div className="text-[11px] font-display font-bold text-white whitespace-nowrap">
                      {m.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick List Strip of Filtered Missions */}
          <div className="grid grid-cols-3 gap-2 z-10 pt-2 border-t border-white/10">
            {filteredMissions.slice(0, 3).map(m => {
              const isSelected = selectedMission.id === m.id;
              const isCompleted = completedMissionIds.includes(m.id);
              const unlocked = isMissionUnlocked(m);

              return (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m)}
                  className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200'
                      : 'bg-black/40 border-white/5 hover:border-white/20 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold">{m.operationCode}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : !unlocked ? (
                      <Lock className="w-3 h-3 text-slate-500" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <div className="text-xs font-display font-bold text-white truncate mt-0.5">
                    {m.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Selected Mission Dossier Card & Action Panel */}
        <div className="lg:col-span-5 brutal-frame glass-primary p-6 rounded-2xl terminal-glass surface-imperfections flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header Stamps */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
                  ACT {selectedMission.actNumber} // {selectedMission.operationCode}
                </span>
                <span className="text-[10px] text-slate-400">
                  LEVEL 0{selectedMission.levelNumber}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                completedMissionIds.includes(selectedMission.id)
                  ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30'
                  : isMissionUnlocked(selectedMission)
                  ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30'
                  : 'text-amber-300 bg-amber-950/60 border border-amber-500/30'
              }`}>
                {completedMissionIds.includes(selectedMission.id)
                  ? 'COMPLETED'
                  : isMissionUnlocked(selectedMission)
                  ? 'DISPATCH READY'
                  : 'LOCKED'}
              </span>
            </div>

            {/* Mission Titles */}
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">
                {selectedMission.sectorName}
              </div>
              <h3 className="text-2xl font-display font-black text-white tracking-tight mt-0.5">
                {selectedMission.facilityName}
              </h3>
              <div className="text-xs text-cyan-300 font-bold mt-1">
                TARGET ASSET: {selectedMission.targetName}
              </div>
            </div>

            {/* Environment & Telemetry Badges */}
            <div className="p-3 bg-black/60 rounded-xl border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>ENVIRONMENT:</span>
                <strong className="text-slate-200">{selectedMission.environmentType}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>SECURITY CLASSIFICATION:</span>
                <strong className="text-amber-400">{selectedMission.securityRating.toFixed(1)}/10</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>ESTIMATED TIME:</span>
                <strong className="text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {selectedMission.estimatedDuration || '04:30'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>REWARD BOUNTY:</span>
                <strong className="text-cyan-300 font-bold">₡{selectedMission.basePayout.toLocaleString()}</strong>
              </div>
            </div>

            {/* Briefing Snippet */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold mb-1 font-mono-tech">
                DIRECTIVE BRIEFING
              </div>
              {selectedMission.briefing}
            </div>

            {/* Unlock Reward Info */}
            {selectedMission.unlockReward && (
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono-tech">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>UNMEMORIZED UNLOCK:</span>
                <strong className="text-cyan-300">{selectedMission.unlockReward}</strong>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-white/10 mt-4">
            {isMissionUnlocked(selectedMission) ? (
              <TactileButton
                variant="clay-accent"
                size="lg"
                className="w-full justify-center"
                icon={<Play className="w-4 h-4 fill-slate-950" />}
                onClick={handleOpenContract}
              >
                OPEN BRIEFING DOSSIER
              </TactileButton>
            ) : (
              <div className="w-full p-3.5 rounded-xl bg-black/60 border border-white/10 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>LOCKED · COMPLETE PREVIOUS OPERATION TO UNLOCK</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Contract Briefing Modal */}
      {showContractModal && (
        <ContractModal
          mission={selectedMission}
          onBeginHeist={() => {
            setShowContractModal(false);
            onStartMission(selectedMission);
          }}
          onClose={() => setShowContractModal(false)}
        />
      )}
    </div>
  );
};
