import React, { useState } from 'react';
import { PlayerState, UpgradeNode } from '../../types/game';
import { UPGRADE_NODES } from '../../hooks/useGameState';
import { sound } from '../../game/audio';
import { Activity, Cpu, Layers, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { BrutalCard } from '../common/BrutalCard';

interface UpgradeTreeViewProps {
  player: PlayerState;
  onUpgradeNode: (nodeId: string, cost: number) => boolean;
}

export const UpgradeTreeView: React.FC<UpgradeTreeViewProps> = ({ player, onUpgradeNode }) => {
  const [activeCategory, setActiveCategory] = useState<'BODY' | 'TECH' | 'EQUIPMENT' | 'INTELLIGENCE'>('BODY');

  const categories: { id: typeof activeCategory; label: string; code: string; icon: React.ReactNode }[] = [
    { id: 'BODY', label: 'BODY AUGMENTS', code: '01', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'TECH', label: 'TECH IMPLANTS', code: '02', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'EQUIPMENT', label: 'EQUIPMENT TUNING', code: '03', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'INTELLIGENCE', label: 'NEURAL INTEL', code: '04', icon: <Sparkles className="w-3.5 h-3.5" /> }
  ];

  const filteredNodes = UPGRADE_NODES.filter(n => n.category === activeCategory);

  const handleUpgrade = (node: UpgradeNode) => {
    const currentLevel = player.upgrades[node.id] || 1;
    if (currentLevel >= node.maxLevel) return;

    const success = onUpgradeNode(node.id, node.cost);
    if (success) {
      sound.playHackSuccess();
    } else {
      sound.playSuspicionAlert();
    }
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
              AUGMENTS // MATRIX
            </span>
            <span className="text-xs text-slate-400">BIOMETRIC & NEURAL UPGRADE SCHEMATICS</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white tracking-wide">
            AUGMENTATION TREE
          </h2>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-black/60 border border-white/10 rounded-xl">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playUiClick();
                setActiveCategory(cat.id);
              }}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#162137] text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <span className="text-[10px] text-slate-500">{cat.code}</span>
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upgrade Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-4">
        {filteredNodes.map(node => {
          const currentLevel = player.upgrades[node.id] || 1;
          const isMaxed = currentLevel >= node.maxLevel;
          const canAfford = player.credits >= node.cost;

          return (
            <div
              key={node.id}
              className="brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="brutal-stamp text-[9px] text-cyan-300 border-cyan-500/30">
                    TIER 0{currentLevel} // 0{node.maxLevel}
                  </span>
                  {/* Physical Level Blocks */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: node.maxLevel }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-4 h-2 rounded-xs transition-all ${
                          idx < currentLevel 
                            ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' 
                            : 'bg-black/60 border border-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-display font-black text-white">
                    {node.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1">
                    {node.description}
                  </p>
                </div>

                <div className="p-3.5 bg-black/50 border border-white/10 rounded-xl text-xs text-cyan-300">
                  <span className="text-slate-400 text-[10px] uppercase block mb-0.5">CURRENT ENHANCEMENT:</span>
                  <span className="font-bold">{node.statBonus}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">UPGRADE INVESTMENT</span>
                  <span className="text-lg font-display font-black text-white">
                    {isMaxed ? 'MAXIMAL LEVEL REACHED' : `₡${node.cost.toLocaleString()}`}
                  </span>
                </div>

                {isMaxed ? (
                  <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    OPTIMIZED
                  </div>
                ) : (
                  <TactileButton
                    variant={canAfford ? 'clay-accent' : 'clay-primary'}
                    size="md"
                    disabled={!canAfford}
                    onClick={() => handleUpgrade(node)}
                  >
                    INSTALL UPGRADE
                  </TactileButton>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/10 pt-3">
        <span>NEURAL INTEGRATION: 100% COMPATIBLE</span>
        <span>SYNAPSE CALIBRATION OPTIMAL</span>
      </div>
    </div>
  );
};
