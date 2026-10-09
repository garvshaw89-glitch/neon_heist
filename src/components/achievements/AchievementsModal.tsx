import React from 'react';
import { sound } from '../../game/audio';
import { Award, ShieldCheck, Eye, Terminal, Zap, Crosshair, Lock, X, CheckCircle2 } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

export interface AchievementDef {
  id: string;
  title: string;
  code: string;
  description: string;
  rewardCredits: number;
  icon: string;
  category: 'STEALTH' | 'HACKING' | 'MASTERY' | 'TACTICAL';
}

export const GAME_ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'ach-first-heist',
    title: 'GHOST EMBARKATION',
    code: 'SEC-01',
    description: 'Execute your inaugural corporate infiltration without sounding full facility lockdown.',
    rewardCredits: 5000,
    icon: 'ShieldCheck',
    category: 'STEALTH'
  },
  {
    id: 'ach-perfect-ghost',
    title: 'ZERO TRACE OPERATIVE',
    code: 'SEC-02',
    description: 'Achieve a 100% clean infiltration with zero guard alerts, zero camera tripwires, and 0% detection.',
    rewardCredits: 25000,
    icon: 'Eye',
    category: 'STEALTH'
  },
  {
    id: 'ach-master-hacker',
    title: 'ICE BREAKER PRIME',
    code: 'NET-03',
    description: 'Infiltrate and disable over 15 security subnet terminals across corporate complexes.',
    rewardCredits: 15000,
    icon: 'Terminal',
    category: 'HACKING'
  },
  {
    id: 'ach-phantom-strike',
    title: 'PHANTOM TAKEDOWN',
    code: 'TAC-04',
    description: 'Neutralize an elite patrol guard from behind while fully submerged in shadow geometry.',
    rewardCredits: 12000,
    icon: 'Crosshair',
    category: 'TACTICAL'
  },
  {
    id: 'ach-black-syndicate',
    title: 'BLACK DISTRICT SYNDICATE',
    code: 'MKT-05',
    description: 'Acquire high-tier military-grade hardware from the Black Market underworld broker.',
    rewardCredits: 18000,
    icon: 'Zap',
    category: 'MASTERY'
  },
  {
    id: 'ach-high-roller',
    title: 'OFFSHORE MEGACREDITS',
    code: 'FIN-06',
    description: 'Accumulate more than 100,000 corporate credits across contracts.',
    rewardCredits: 30000,
    icon: 'Award',
    category: 'MASTERY'
  },
  {
    id: 'ach-ghost-protocol',
    title: 'THE GHOST PROTOCOL',
    code: 'CAM-09',
    description: 'Complete all 9 campaign infiltration operations across Acts I, II, and III.',
    rewardCredits: 100000,
    icon: 'ShieldCheck',
    category: 'MASTERY'
  }
];

interface AchievementsModalProps {
  unlockedIds: string[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedIds,
  onClose
}) => {
  const unlockedCount = GAME_ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6 font-mono-tech select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl brutal-frame glass-primary rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6 sm:p-8 flex flex-col max-h-[88vh] overflow-hidden terminal-glass surface-imperfections">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
                INTEL // DOSSIER COMMENDATIONS
              </span>
              <span className="text-xs text-slate-400">CLASSIFIED OPERATIVE MILESTONES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              TACTICAL COMMENDATIONS
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">UNLOCKED</span>
              <span className="text-base font-display font-extrabold text-cyan-300">
                {unlockedCount} / {GAME_ACHIEVEMENTS.length}
              </span>
            </div>
            <button
              onClick={() => {
                sound.playUiClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Achievement Cards */}
        <div className="overflow-y-auto space-y-3.5 pr-1 flex-1">
          {GAME_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl brutal-frame transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-[#0d1627] to-[#070b14] border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                    : 'bg-black/50 border-white/5 opacity-60'
                }`}
              >
                <div className={`p-3 rounded-xl border shrink-0 ${
                  isUnlocked
                    ? 'bg-cyan-950/60 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900 border-white/10 text-slate-600'
                }`}>
                  {isUnlocked ? (
                    <Award className="w-6 h-6 text-cyan-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`brutal-stamp text-[9px] ${
                        isUnlocked ? 'text-cyan-400 border-cyan-500/30' : 'text-slate-500 border-white/10'
                      }`}>
                        {ach.code} // {ach.category}
                      </span>
                      <h4 className="text-sm font-display font-extrabold text-white truncate">
                        {ach.title}
                      </h4>
                    </div>

                    <span className={`text-xs font-mono font-bold ${
                      isUnlocked ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      {isUnlocked ? 'ACQUIRED · +₡' + ach.rewardCredits.toLocaleString() : 'LOCKED'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4">
          <span className="text-[10px] text-slate-500">
            RECORDED IN LOCAL QUANTUM MEMORY
          </span>
          <TactileButton
            variant="glass"
            size="sm"
            onClick={onClose}
          >
            DISMISS DOSSIER
          </TactileButton>
        </div>

      </div>
    </div>
  );
};
