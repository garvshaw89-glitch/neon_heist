import React, { useState } from 'react';
import { Mission } from '../../types/game';
import { MISSIONS } from '../../game/missions';
import { ContractModal } from './ContractModal';
import { sound } from '../../game/audio';
import { Shield, Crosshair, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    { id: 'sector-00', name: 'SECTOR 00 · UNDERGROUND', status: 'SAFEHOUSE' },
    { id: 'sector-01', name: 'SECTOR 01 · FINANCIAL DISTRICT', status: 'INFILTRATED' },
    { id: 'sector-02', name: 'SECTOR 02 · CORPORATE ZONE', status: 'ACTIVE THREAT' },
    { id: 'sector-03', name: 'SECTOR 03 · INDUSTRIAL CORE', status: 'MIL-SPEC LOCKDOWN' },
    { id: 'sector-05', name: 'SECTOR 05 · BLACK DISTRICT', status: 'EXTREME RISK' }
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
    <div className="w-full h-[calc(100vh-4rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-0.5">
            TACTICAL GRID MAP
          </span>
          <h2 className="text-xl font-display font-bold text-white tracking-wide">
            MEGACITY OPERATIONS
          </h2>
        </div>
        <div className="text-xs text-slate-400">
          AUTHORIZED CONTRACTS: {MISSIONS.length} AVAILABLE
        </div>
      </div>

      {/* Main Interactive Map & Mission Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center">
        {/* Left 7 Columns: Futuristic Sector Map with interactive nodes */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#090e1c]/50 relative overflow-hidden min-h-[420px] flex flex-col justify-between">
          {/* Subtle Sector Dividers overlay */}
          <div className="absolute inset-0 cyber-scanlines opacity-20 pointer-events-none" />

          {/* Sector list tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {sectors.map(sec => (
              <span
                key={sec.id}
                className="text-[10px] px-2.5 py-1 rounded bg-slate-950/80 border border-slate-800 text-slate-400"
              >
                {sec.name}
              </span>
            ))}
          </div>

          {/* Graphical Map Representation with nodes */}
          <div className="relative w-full h-64 border border-dashed border-cyan-500/20 rounded-xl bg-slate-950/60 p-4 overflow-hidden">
            {/* Background grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0,transparent_100%)] pointer-events-none" />

            {/* Mission Nodes */}
            {MISSIONS.map((m, idx) => {
              const isSelected = selectedMission.id === m.id;
              const isCompleted = completedMissionIds.includes(m.id);

              // Position coordinates on grid
              const positions = [
                { top: '80%', left: '16%' }, // Operation Zero
                { top: '60%', left: '34%' }, // Operation 01
                { top: '35%', left: '50%' }, // Operation 02
                { top: '22%', left: '72%' }, // Operation 03
                { top: '75%', left: '80%' }  // Operation 04
              ];
              const pos = positions[idx] || { top: '50%', left: '50%' };

              return (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 group flex items-center gap-2 ${
                    isSelected
                      ? 'bg-cyan-950/80 border border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] z-20 scale-110'
                      : 'bg-slate-900/80 border border-slate-700 hover:border-cyan-500/50 hover:scale-105 z-10'
                  }`}
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className="relative">
                    <span
                      className={`w-3 h-3 rounded-full block ${
                        isCompleted
                          ? 'bg-emerald-400'
                          : isSelected
                          ? 'bg-cyan-400 animate-ping'
                          : 'bg-slate-500'
                      }`}
                    />
                    {isSelected && (
                      <span className="w-3 h-3 rounded-full bg-cyan-400 absolute inset-0 block shadow-[0_0_8px_#22d3ee]" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-white whitespace-nowrap hidden sm:inline">
                    {m.facilityName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span>GRID: SECTOR 01–05 COORDINATION</span>
            <span>ENCRYPTED SATELLITE LINK 99.4%</span>
          </div>
        </div>

        {/* Right 5 Columns: Selected Mission Info Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-white/5 bg-[#090e1c]/60 space-y-5">
          <div className="border-b border-white/5 pb-4">
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
              SELECTED TARGET · {selectedMission.operationCode}
            </span>
            <h3 className="text-xl font-display font-bold text-white">
              {selectedMission.facilityName}
            </h3>
            <span className="text-xs text-slate-400">
              {selectedMission.sectorName}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>TARGET ASSET:</span>
              <span className="text-white font-bold">{selectedMission.targetName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>SECURITY LEVEL:</span>
              <span className="text-amber-400 font-bold">{selectedMission.intel.securityTier}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>RISK RATING:</span>
              <span className="text-rose-400 font-bold">{selectedMission.risk}</span>
            </div>
            <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
              <span>ESTIMATED PAYOUT:</span>
              <span className="text-cyan-300 font-bold text-sm">₡{selectedMission.basePayout.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300/80 font-sans leading-relaxed">
            {selectedMission.briefing.slice(0, 140)}...
          </p>

          <button
            onClick={handleOpenContract}
            className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 group"
          >
            <span>VIEW CONTRACT DOSSIER</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Contract Dossier Modal */}
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

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500 flex justify-between">
        <span>GHOSTNET CONTRACT DISPATCH</span>
        <span>STANDBY FOR INFILTRATION ROUTE</span>
      </div>
    </div>
  );
};
