import React, { useState } from 'react';
import { PlayerState, EquipmentItem } from '../../types/game';
import { ALL_EQUIPMENT } from '../../hooks/useGameState';
import { sound } from '../../game/audio';
import { ShieldCheck, ShoppingCart, AlertCircle, CheckCircle, Terminal, ShoppingBag } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

interface BlackMarketViewProps {
  player: PlayerState;
  onBuyItem: (item: EquipmentItem) => boolean;
}

export const BlackMarketView: React.FC<BlackMarketViewProps> = ({ player, onBuyItem }) => {
  const [selectedItem, setSelectedItem] = useState<EquipmentItem>(ALL_EQUIPMENT[2]);
  const [purchaseStatus, setPurchaseStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelect = (item: EquipmentItem) => {
    sound.playUiHover();
    setSelectedItem(item);
    setPurchaseStatus('IDLE');
  };

  const handlePurchase = (item: EquipmentItem) => {
    if (player.credits < item.cost) {
      sound.playSuspicionAlert();
      setPurchaseStatus('ERROR');
      setErrorMessage(`INSUFFICIENT FUNDS · NEED ₡${item.cost.toLocaleString()} | AVAILABLE ₡${player.credits.toLocaleString()}`);
      return;
    }

    const success = onBuyItem(item);
    if (success) {
      sound.playHackSuccess();
      setPurchaseStatus('SUCCESS');
      setTimeout(() => setPurchaseStatus('IDLE'), 3000);
    }
  };

  const isUnlocked = (itemId: string) => player.unlockedEquipment.includes(itemId);

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-stamp text-amber-400 border-amber-500/30">
              BROKER // ZERO
            </span>
            <span className="text-xs text-slate-400">RESTRICTED BLACK DISTRICT PROCUREMENT</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white tracking-wide">
            BLACK MARKET TERMINAL
          </h2>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-xs">
          <span className="text-slate-400">CREDIT BALANCE:</span>
          <span className="font-bold text-cyan-300">₡{player.credits.toLocaleString()}</span>
        </div>
      </div>

      {/* Grid: Classified Inventory and Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center py-4">
        
        {/* Left 7 Cols: Classified Catalog */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALL_EQUIPMENT.map((item, idx) => {
            const unlocked = isUnlocked(item.id);
            const isSelected = selectedItem.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-5 rounded-2xl brutal-frame cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1c2235] to-[#101422] border-2 border-amber-400/80 shadow-[0_0_24px_rgba(245,158,11,0.25)] scale-[1.02]'
                    : 'bg-[#090d18]/70 hover:bg-[#111728]/80 border border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-3 text-[10px]">
                  <span className="brutal-stamp text-[9px] text-amber-300 border-amber-500/20">
                    0{idx + 1} // {item.category}
                  </span>
                  <span className={unlocked ? 'text-emerald-400 font-bold' : 'text-cyan-300 font-bold'}>
                    {unlocked ? 'ACQUIRED' : `₡${item.cost.toLocaleString()}`}
                  </span>
                </div>

                <h3 className="text-base font-display font-bold text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right 5 Cols: Underground Purchase Terminal */}
        <div className="lg:col-span-5 brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="brutal-stamp text-amber-400 border-amber-500/30">
                HARDWARE // {selectedItem.rarity}
              </span>
              <span className="text-xs text-slate-400">
                CLASS: {selectedItem.category}
              </span>
            </div>
            <h3 className="text-3xl font-display font-black text-white tracking-tight">
              {selectedItem.name}
            </h3>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed p-4 bg-black/60 border border-white/10 rounded-xl">
            {selectedItem.details}
          </p>

          <div className="p-4 bg-black/50 border border-white/10 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-baseline text-slate-400">
              <span className="font-bold">PROCUREMENT COST:</span>
              <span className="text-2xl font-display font-black text-cyan-300">
                ₡{selectedItem.cost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-400 pt-2 border-t border-white/5">
              <span>STATUS:</span>
              <span className="text-emerald-400 font-bold">
                {isUnlocked(selectedItem.id) ? 'ALREADY IN OPERATIVE ARSENAL' : 'AVAILABLE FOR TRANSFER'}
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {purchaseStatus === 'ERROR' && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {purchaseStatus === 'SUCCESS' && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>TRANSACTION VERIFIED · DELIVERED TO LOADOUT</span>
            </div>
          )}

          {/* Clay Action Trigger */}
          <div className="pt-2">
            {isUnlocked(selectedItem.id) ? (
              <div className="w-full py-3.5 px-4 rounded-xl bg-black/60 border border-white/10 text-slate-500 font-mono-tech text-center text-xs tracking-wider flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ACQUIRED TO PERSONAL ARSENAL
              </div>
            ) : (
              <TactileButton
                variant="clay-accent"
                size="lg"
                className="w-full justify-center"
                icon={<ShoppingBag className="w-4 h-4 fill-slate-950" />}
                onClick={() => handlePurchase(selectedItem)}
              >
                AUTHORIZE PROCUREMENT
              </TactileButton>
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/10 pt-3">
        <span>BROKER IDENTITY: ZERO // UNTRACEABLE PROXY</span>
        <span>BLACK DISTRICT SECURE CRYPT</span>
      </div>
    </div>
  );
};
