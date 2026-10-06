import React, { useState } from 'react';
import { PlayerState, UpgradeNode } from '../../types/game';
import { UPGRADE_NODES } from '../../hooks/useGameState';
import { sound } from '../../game/audio';
import { Activity, Cpu, Layers, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface UpgradeTreeViewProps {
  player: PlayerState;
  onUpgradeNode: (nodeId: string, cost: number) => boolean;
}

export const UpgradeTreeView: React.FC<UpgradeTreeViewProps> = ({ player, onUpgradeNode }) => {
  const [activeCategory, setActiveCategory] = useState<'BODY' | 'TECH' | 'EQUIPMENT' | 'INTELLIGENCE'>('BODY');

  const categories: { id: typeof activeCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'BODY', label: 'Body Augments', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'TECH', label: 'Tech Implants', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'EQUIPMENT', label: 'Equipment Tuning', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'INTELLIGENCE', label: 'Neural Intelligence', icon: <Sparkles className="w-3.5 h-3.5" /> }
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
    <div className="w-full h-[calc(100vh-4rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-0.5">
            NEURAL & BIOMETRIC AUGMENTATIONS
          </span>
          <h2 className="text-xl font-display font-bold text-white tracking-wide">
            UPGRADE MATRIX
          </h2>
        </div>
        {/* Category Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-lg">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playUiClick();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upgrade Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
        {filteredNodes.map(node => {
          const currentLevel = player.upgrades[node.id] || 1;
          const isMaxed = currentLevel >= node.maxLevel;
          const canAfford = player.credits >= node.cost;

          return (
            <div
              key={node.id}
              className="p-6 rounded-2xl border border-white/5 bg-[#090e1c]/60 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    {node.category} PROTOCOL
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: node.maxLevel }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-3 h-1.5 rounded-sm ${
                          idx < currentLevel ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-display font-bold text-white mb-1">
                  {node.title}
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                  {node.description}
                </p>

                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-cyan-300">
                  CURRENT EFFECT: <span className="font-bold">{node.statBonus}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">UPGRADE COST</span>
                  <span className="text-sm font-bold text-white">
                    {isMaxed ? 'MAX LEVEL' : `₡${node.cost.toLocaleString()}`}
                  </span>
                </div>

                <button
                  onClick={() => handleUpgrade(node)}
                  disabled={isMaxed || !canAfford}
                  className={`py-2.5 px-5 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                    isMaxed
                      ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
                      : canAfford
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  {isMaxed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>OPTIMAL</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>ENHANCE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500 flex justify-between">
        <span>NEURAL IMPLANT CAPACITY: STABLE</span>
        <span>SYNAPSE SYNCHRONIZATION: 99.8%</span>
      </div>
    </div>
  );
};
