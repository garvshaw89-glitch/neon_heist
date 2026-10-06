import React, { useState } from 'react';
import { PlayerState, EquipmentItem } from '../../types/game';
import { ALL_EQUIPMENT } from '../../hooks/useGameState';
import { sound } from '../../game/audio';
import { ShieldCheck, ShoppingCart, AlertCircle, CheckCircle, Terminal } from 'lucide-react';

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
      setErrorMessage(`INSUFFICIENT FUNDS · REQUIRED ₡${item.cost.toLocaleString()} | AVAILABLE ₡${player.credits.toLocaleString()}`);
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
    <div className="w-full h-[calc(100vh-4rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-0.5">
            ENCRYPTED BROKER HUB · ZERO
          </span>
          <h2 className="text-xl font-display font-bold text-white tracking-wide">
            BLACK DISTRICT MARKET
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-cyan-300 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-lg">
          <span className="text-slate-400">CREDIT BALANCE:</span>
          <span className="font-bold">₡{player.credits.toLocaleString()}</span>
        </div>
      </div>

      {/* Grid: Classified Inventory and Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center">
        {/* Left 7 Cols: Classified Catalog */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALL_EQUIPMENT.map(item => {
            const unlocked = isUnlocked(item.id);
            const isSelected = selectedItem.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-950/30 border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                    : 'bg-[#090e1c]/50 border-white/5 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">
                    {item.category}
                  </span>
                  <span className={unlocked ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>
                    {unlocked ? 'ACQUIRED' : `₡${item.cost.toLocaleString()}`}
                  </span>
                </div>

                <h3 className="text-base font-display font-bold text-white mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 font-sans line-clamp-2">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right 5 Cols: Underground Purchase Terminal */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-white/5 bg-[#090e1c]/60 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-1">
              BLACK MARKET PROCUREMENT
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              {selectedItem.name}
            </h3>
            <span className="text-xs text-slate-400">
              CATEGORY: {selectedItem.category} · CLASS: {selectedItem.rarity}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
            {selectedItem.details}
          </p>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>ACQUISITION COST:</span>
              <span className="text-white font-bold text-sm">₡{selectedItem.cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>AVAILABILITY:</span>
              <span className="text-emerald-400 font-bold">
                {isUnlocked(selectedItem.id) ? 'ALREADY PURCHASED' : 'UNRESTRICTED ACCESS'}
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {purchaseStatus === 'ERROR' && (
            <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {purchaseStatus === 'SUCCESS' && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>EQUIPMENT SECURED AND DELIVERED TO LOADOUT ARSENAL</span>
            </div>
          )}

          {/* Buy Button */}
          <button
            onClick={() => handlePurchase(selectedItem)}
            disabled={isUnlocked(selectedItem.id)}
            className={`w-full py-4 px-6 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              isUnlocked(selectedItem.id)
                ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{isUnlocked(selectedItem.id) ? 'IN ARSENAL' : `PURCHASE (₡${selectedItem.cost.toLocaleString()})`}</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500 flex justify-between">
        <span>BROKER NETWORK: ENCRYPTED PEER ROUTE</span>
        <span>NO REFUNDS · LEAVE NO EVIDENCE</span>
      </div>
    </div>
  );
};
