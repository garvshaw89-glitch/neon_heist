import React, { useState } from 'react';
import { EquipmentItem, PlayerState } from '../../types/game';
import { ALL_EQUIPMENT } from '../../hooks/useGameState';
import { sound } from '../../game/audio';
import { Eye, Cpu, Radio, Shield, Check, Lock, Zap, Clock, Disc, Layers } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { BrutalCard } from '../common/BrutalCard';

interface LoadoutViewProps {
  player: PlayerState;
  onEquipItem: (item: EquipmentItem) => void;
}

export const LoadoutView: React.FC<LoadoutViewProps> = ({ player, onEquipItem }) => {
  const [activeCategory, setActiveCategory] = useState<'INFILTRATION' | 'HACKING' | 'SURVEILLANCE' | 'ESCAPE'>('INFILTRATION');
  const [selectedItem, setSelectedItem] = useState<EquipmentItem>(ALL_EQUIPMENT[0]);

  const categories: { id: typeof activeCategory; label: string; code: string; icon: React.ReactNode }[] = [
    { id: 'INFILTRATION', label: 'INFILTRATION', code: '01', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'HACKING', label: 'HACKING', code: '02', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'SURVEILLANCE', label: 'SURVEILLANCE', code: '03', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'ESCAPE', label: 'ESCAPE', code: '04', icon: <Shield className="w-3.5 h-3.5" /> }
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
    <div className="w-full h-[calc(100vh-4.5rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
              ARSENAL // GHOST KIT
            </span>
            <span className="text-xs text-slate-400">TACTICAL LOADOUT CONFIGURATION</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white tracking-wide">
            EQUIPMENT SYSTEM
          </h2>
        </div>

        {/* Brutalist Category Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-black/60 border border-white/10 rounded-xl">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playUiClick();
                setActiveCategory(cat.id);
                const first = ALL_EQUIPMENT.find(e => e.category === cat.id);
                if (first) setSelectedItem(first);
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

      {/* Main Grid: Inventory Racks & Physical Hardware Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center py-4">
        
        {/* Left 7 Columns: Smoked Glass Inventory Rack */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredEquipment.map((item, idx) => {
            const equipped = isEquipped(item.id);
            const unlocked = isUnlocked(item.id);
            const isSelected = selectedItem.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`p-5 rounded-2xl brutal-frame cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#182337] to-[#0f1725] border-2 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.3)] scale-[1.02]'
                    : 'bg-[#0a0f1d]/70 hover:bg-[#10172c]/80 border border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="brutal-stamp text-[9px] text-cyan-300 border-cyan-500/20">
                    0{idx + 1} // {item.rarity}
                  </span>
                  {equipped ? (
                    <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-1">
                      <Check className="w-3 h-3" /> EQUIPPED
                    </span>
                  ) : !unlocked ? (
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> RESTRICTED
                    </span>
                  ) : null}
                </div>

                <h3 className="text-base font-display font-bold text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 font-sans line-clamp-2 mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-white/5">
                  <span>ENERGY: <strong className="text-cyan-400">{item.energyCost}%</strong></span>
                  <span>COOLDOWN: <strong className="text-white">{item.cooldown}S</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 Columns: Physical Hardware Inspector */}
        <div className="lg:col-span-5 brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="brutal-stamp text-cyan-300 border-cyan-500/30">
                INSPECTOR // {selectedItem.rarity}
              </span>
              <span className="font-mono-tech text-xs text-slate-400">
                CLASS: {selectedItem.category}
              </span>
            </div>
            <h3 className="text-3xl font-display font-black text-white tracking-tight">
              {selectedItem.name}
            </h3>
          </div>

          {/* Physical 3D Object Pedestal Visualizer */}
          <div className="relative w-full h-44 rounded-xl bg-gradient-to-b from-black/80 to-[#070c18] border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group">
            <div className="absolute inset-0 brutal-grid opacity-30 pointer-events-none" />
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-[#1c283f] to-[#0e1626] border-2 border-cyan-400/60 shadow-[0_16px_32px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
              <Disc className="w-12 h-12 text-cyan-300 group-hover:animate-spin" />
            </div>
            <div className="absolute bottom-2 left-3 text-[10px] text-slate-500 font-mono-tech">
              PHYSICAL MOUNT // CALIBRATED
            </div>
          </div>

          {/* Oversized Specification Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-black/60 border border-white/5">
            <div>
              <span className="text-[9px] text-slate-500 block uppercase">ENERGY</span>
              <span className="text-2xl font-display font-extrabold text-cyan-300">
                {selectedItem.energyCost}%
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block uppercase">COOLDOWN</span>
              <span className="text-2xl font-display font-extrabold text-white">
                {selectedItem.cooldown}s
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block uppercase">SIGNATURE</span>
              <span className="text-2xl font-display font-extrabold text-emerald-400">
                LOW
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {selectedItem.description}
          </p>

          {/* Tactile Clay Action Controls */}
          <div className="pt-2">
            {isEquipped(selectedItem.id) ? (
              <div className="w-full py-3.5 px-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-display font-bold text-center text-xs tracking-wider flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> ACTIVE IN MISSION DEPLOYMENT
              </div>
            ) : isUnlocked(selectedItem.id) ? (
              <TactileButton
                variant="clay-accent"
                size="lg"
                className="w-full justify-center"
                icon={<Check className="w-4 h-4 fill-slate-950" />}
                onClick={() => handleEquip(selectedItem)}
              >
                EQUIP TO LOADOUT
              </TactileButton>
            ) : (
              <div className="w-full py-3.5 px-4 rounded-xl bg-black/60 border border-white/10 text-slate-500 font-mono-tech text-center text-xs tracking-wider flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> PROCURE ON BLACK MARKET TO UNLOCK
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Classification */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/10 pt-3">
        <span>GHOST ARSENAL // BIOMETRICALLY SYNCHRONIZED</span>
        <span>ZERO EMISSION HARNESS</span>
      </div>
    </div>
  );
};
