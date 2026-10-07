import React, { useState } from 'react';
import { Mission } from '../../types/game';
import { MISSIONS } from '../../game/missions';
import { ContractModal } from './ContractModal';
import { sound } from '../../game/audio';
import { Shield, Crosshair, ArrowRight, CheckCircle2, ChevronRight, Play, Eye } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { BrutalCard } from '../common/BrutalCard';

interface OperationsViewProps {
  completedMissionIds: string[];
  onStartMission: (mission: Mission) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  completedMissionIds,
  onStartMission
}) => {
  const [selectedMission, setSelectedMission] = useState<Mission>(MISSIONS[0]);
  const [showContractModal, setShowContractModal] = useState(false);

  const sectors = [
    { id: 'sector-00', name: 'SECTOR 00', title: 'SAFEHOUSE / GHOST VECTOR', status: 'ACTIVE' },
    { id: 'sector-01', name: 'SECTOR 01', title: 'FINANCIAL DISTRICT', status: 'TARGETED' },
    { id: 'sector-02', name: 'SECTOR 02', title: 'ORION CORPORATE ZONE', status: 'HIGH RISK' },
    { id: 'sector-03', name: 'SECTOR 03', title: 'KUROSHIO CITADEL', status: 'MIL-SPEC' },
    { id: 'sector-04', name: 'SECTOR 04', title: 'BLACK DISTRICT CRYPT', status: 'CLASSIFIED' }
  ];

  const handleSelect = (m: Mission) => {
    sound.playUiClick();
    setSelectedMission(m);
  };

  const handleOpenContract = () => {
    sound.playConfirm();
    setShowContractModal(true);
  };

  return (
    <div className="w-full h-[calc(100vh-4.5rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech select-none">
      {/* Top Brutalist Header Band */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
              TACTICAL GRID // SATELLITE
            </span>
            <span className="text-xs text-slate-400">MEGACITY INTELLIGENCE DOSSIER</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white tracking-wide">
            CLASSIFIED OPERATIONS
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">
            CONTRACTS: <strong className="text-white">{MISSIONS.length} DISPATCHABLE</strong>
          </span>
          <span className="text-slate-400">
            COMPLETED: <strong className="text-emerald-400">{completedMissionIds.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Interactive Map & Mission Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center py-4">
        
        {/* Left 7 Columns: Tactical Sector Map with Physical Clay Mission Nodes */}
        <div className="lg:col-span-7 brutal-frame glass-primary p-6 rounded-2xl terminal-glass surface-imperfections relative overflow-hidden min-h-[460px] flex flex-col justify-between">
          <div className="absolute inset-0 brutal-grid opacity-30 pointer-events-none" />

          {/* Top Sector Tags */}
          <div className="flex flex-wrap gap-2 z-10">
            {sectors.map(sec => (
              <span
                key={sec.id}
                className="text-[10px] px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-slate-300 font-bold"
              >
                {sec.name} // {sec.title}
              </span>
            ))}
          </div>

          {/* Tactical Grid Visualizer */}
          <div className="relative w-full h-72 border border-white/10 rounded-xl bg-black/60 p-4 overflow-hidden my-4 z-10 shadow-inner">
            {/* Radar Sweep Arc */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08)_0%,transparent_75%)] pointer-events-none" />

            {/* Connecting Geometric Routes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <line x1="16%" y1="78%" x2="34%" y2="58%" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="34%" y1="58%" x2="52%" y2="34%" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="52%" y1="34%" x2="74%" y2="22%" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="52%" y1="34%" x2="80%" y2="75%" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>

            {/* Physical Mission Nodes */}
            {MISSIONS.map((m, idx) => {
              const isSelected = selectedMission.id === m.id;
              const isCompleted = completedMissionIds.includes(m.id);

              const positions = [
                { top: '78%', left: '16%' },
                { top: '58%', left: '34%' },
                { top: '34%', left: '52%' },
                { top: '22%', left: '74%' },
                { top: '75%', left: '80%' }
              ];
              const pos = positions[idx] || { top: '50%', left: '50%' };

              return (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-200 group flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#1c283c] to-[#0f1726] border-2 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.45)] z-20 scale-110'
                      : 'bg-black/70 border border-white/15 hover:border-cyan-400/60 hover:scale-105 z-10'
                  }`}
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className="relative">
                    <span
                      className={`w-3.5 h-3.5 rounded-full block ${
                        isCompleted
                          ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                          : isSelected
                          ? 'bg-cyan-400 animate-ping'
                          : 'bg-slate-500'
                      }`}
                    />
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 absolute inset-0 block shadow-[0_0_10px_#22d3ee]" />
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      {m.operationCode}
                    </div>
                    <div className="text-xs font-display font-bold text-white whitespace-nowrap">
                      {m.facilityName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 z-10 border-t border-white/5 pt-3">
            <span>RADAR: 5 SEC. CHECKPOINTS TRACKED</span>
            <span className="text-cyan-400">ENCRYPTION: QUANTUM OPTICAL LINK</span>
          </div>
        </div>

        {/* Right 5 Columns: Selected Mission Dossier */}
        <div className="lg:col-span-5 brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="brutal-stamp text-cyan-300 border-cyan-500/30">
                {selectedMission.operationCode} // DOSSIER
              </span>
              <span className="font-mono-tech text-xs text-slate-400">
                {completedMissionIds.includes(selectedMission.id) ? 'STATUS: INFILTRATED' : 'STATUS: UNEXECUTED'}
              </span>
            </div>
            <h3 className="text-3xl font-display font-black text-white tracking-tight">
              {selectedMission.facilityName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedMission.sectorName}
            </p>
          </div>

          {/* Oversized Brutalist Telemetry Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-black/60 border border-white/5">
            <div>
              <span className="text-[9px] text-slate-500 block uppercase">SECURITY</span>
              <span className="text-2xl font-display font-extrabold text-amber-400">
                LVL 0{selectedMission.securityRating}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block uppercase">BASE PAYOUT</span>
              <span className="text-2xl font-display font-extrabold text-cyan-300">
                ₡{selectedMission.basePayout.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block uppercase">VAULT TYPE</span>
              <span className="text-sm font-display font-bold text-white pt-1 block">
                0{selectedMission.vault.securityLayers} LAYERS
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {selectedMission.briefing}
          </p>

          {/* Action Clay Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <TactileButton
              variant="clay-accent"
              size="lg"
              className="flex-1 justify-center"
              icon={<Play className="w-4 h-4 fill-slate-950" />}
              onClick={() => onStartMission(selectedMission)}
            >
              DEPLOY HEIST
            </TactileButton>

            <TactileButton
              variant="glass"
              size="lg"
              icon={<Eye className="w-4 h-4 text-cyan-400" />}
              onClick={handleOpenContract}
            >
              FULL DOSSIER
            </TactileButton>
          </div>
        </div>

      </div>

      {/* Contract Modal Popup */}
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
