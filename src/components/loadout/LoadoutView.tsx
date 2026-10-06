import React, { useState } from 'react';
import { EquipmentItem, PlayerState } from '../../types/game';
import { ALL_EQUIPMENT } from '../../hooks/useGameState';
import { sound } from '../../game/audio';
import { Eye, Cpu, Radio, Shield, Check, Lock, Zap, Clock } from 'lucide-react';

interface LoadoutViewProps {
  player: PlayerState;
  onEquipItem: (item: EquipmentItem) => void;
}

export const LoadoutView: React.FC<LoadoutViewProps> = ({ player, onEquipItem }) => {
  const [activeCategory, setActiveCategory] = useState<'INFILTRATION' | 'HACKING' | 'SURVEILLANCE' | 'ESCAPE'>('INFILTRATION');
  const [selectedItem, setSelectedItem] = useState<EquipmentItem>(ALL_EQUIPMENT[0]);

  const categories: { id: typeof activeCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'INFILTRATION', label: 'Infiltration', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'HACKING', label: 'Hacking', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'SURVEILLANCE', label: 'Surveillance', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'ESCAPE', label: 'Escape', icon: <Shield className="w-3.5 h-3.5" /> }
  ];

  const filteredEquipment = ALL_EQUIPMENT.filter(item => item.category === activeCategory);

  const isEquipped = (itemId: string) => {
    const catKey = activeCategory.toLowerCase() as keyof typeof player.activeLoadout;
    return player.activeLoadout[catKey] === itemId;
  };

  const isUnlocked = (itemId: string) => {
    return player.unlockedEquipment.includes(itemId);
  };

  const handleSelectItem = (item: EquipmentItem) => {
    sound.playUiHover();
    setSelectedItem(item);
  };

  const handleEquip = (item: EquipmentItem) => {
    sound.playConfirm();
    onEquipItem(item);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-0.5">
            TACTICAL ARSENAL CONFIGURATION
          </span>
          <h2 className="text-xl font-display font-bold text-white tracking-wide">
            OPERATIVE LOADOUT
          </h2>
        </div>
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-lg">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playUiClick();
                setActiveCategory(cat.id);
                const first = ALL_EQUIPMENT.find(e => e.category === cat.id);
                if (first) setSelectedItem(first);
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

      {/* Main Grid: Item List & Item Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center">
        {/* Left 7 Cols: Category Equipment Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredEquipment.map(item => {
            const equipped = isEquipped(item.id);
            const unlocked = isUnlocked(item.id);
            const isSelected = selectedItem.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                    : 'bg-[#090e1c]/50 border-white/5 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    item.rarity === 'LEGENDARY' ? 'text-amber-400' :
                    item.rarity === 'MIL-SPEC' ? 'text-purple-400' : 'text-cyan-400'
                  }`}>
                    {item.rarity}
                  </span>
                  {equipped && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> ACTIVE
                    </span>
                  )}
                  {!unlocked && (
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </div>

                <h3 className="text-base font-display font-bold text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 font-sans line-clamp-2 mb-4">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>ENERGY: {item.energyCost}%</span>
                  <span>CD: {item.cooldown}S</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 Cols: Selected Equipment Detailed Dossier */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-white/5 bg-[#090e1c]/60 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
              SUBSYSTEM SPECIFICATION
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              {selectedItem.name}
            </h3>
            <span className="text-xs text-amber-400">
              CLASS: {selectedItem.rarity}
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                <Zap className="w-3 h-3" /> ENERGY USAGE
              </span>
              <span className="text-base font-bold text-cyan-300">{selectedItem.energyCost}%</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                <Clock className="w-3 h-3" /> RECHARGE COOLDOWN
              </span>
              <span className="text-base font-bold text-slate-200">{selectedItem.cooldown}s</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              OPERATIONAL ABILITY
            </span>
            <p className="text-sm text-slate-200 font-sans leading-relaxed p-3.5 bg-slate-950/40 border border-slate-800/60 rounded-xl">
              {selectedItem.details}
            </p>
          </div>

          {/* Action Button: Equip or Locked */}
          {isUnlocked(selectedItem.id) ? (
            <button
              onClick={() => handleEquip(selectedItem)}
              disabled={isEquipped(selectedItem.id)}
              className={`w-full py-3.5 px-6 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all ${
                isEquipped(selectedItem.id)
                  ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              }`}
            >
              {isEquipped(selectedItem.id) ? 'CURRENTLY EQUIPPED' : 'ASSIGN TO ACTIVE SLOT'}
            </button>
          ) : (
            <div className="text-center p-3 rounded-xl border border-rose-500/20 bg-rose-950/10 text-xs text-rose-300">
              ACQUISITION REQUIRED · VISIT BLACK MARKET (₡{selectedItem.cost.toLocaleString()})
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500 flex justify-between">
        <span>GHOST SUIT TELEMETRY: HARMONIZED</span>
        <span>ENERGY GRID 100% NOMINAL</span>
      </div>
    </div>
  );
};
