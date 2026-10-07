import React, { useState, useEffect } from 'react';
import { PlayerState } from '../../types/game';
import { sound } from '../../game/audio';
import { toast } from '../common/ToastSystem';
import { KeyRound, Download, Upload, RotateCcw, X, Check, Database, Shield } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

interface SaveSlot {
  slotId: number;
  name: string;
  data: PlayerState | null;
  lastSaved: string | null;
}

interface SaveSlotsModalProps {
  currentPlayer: PlayerState;
  onLoadPlayer: (player: PlayerState) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SaveSlotsModal: React.FC<SaveSlotsModalProps> = ({
  currentPlayer,
  onLoadPlayer,
  onResetProgress,
  onClose
}) => {
  const [slots, setSlots] = useState<SaveSlot[]>([]);

  useEffect(() => {
    loadSlotsFromStorage();
  }, []);

  const loadSlotsFromStorage = () => {
    const s1 = localStorage.getItem('neon_heist_slot_1');
    const s2 = localStorage.getItem('neon_heist_slot_2');
    const s3 = localStorage.getItem('neon_heist_slot_3');

    const loadedSlots: SaveSlot[] = [
      {
        slotId: 1,
        name: 'CRYPT SLOT 01 // ALPHA',
        data: s1 ? JSON.parse(s1) : currentPlayer,
        lastSaved: s1 ? 'ACTIVE PRIMARY PROFILE' : 'CURRENT RUN'
      },
      {
        slotId: 2,
        name: 'CRYPT SLOT 02 // BRAVO',
        data: s2 ? JSON.parse(s2) : null,
        lastSaved: s2 ? 'SAVED BACKUP' : 'EMPTY REPOSITORY'
      },
      {
        slotId: 3,
        name: 'CRYPT SLOT 03 // CHARLIE',
        data: s3 ? JSON.parse(s3) : null,
        lastSaved: s3 ? 'SAVED BACKUP' : 'EMPTY REPOSITORY'
      }
    ];

    setSlots(loadedSlots);
  };

  const handleSaveToSlot = (slotId: number) => {
    try {
      localStorage.setItem(`neon_heist_slot_${slotId}`, JSON.stringify(currentPlayer));
      sound.playConfirm();
      toast.success('PROFILE SAVED', `Operative data secured in Crypt Slot 0${slotId}`);
      loadSlotsFromStorage();
    } catch {
      toast.danger('SAVE FAILED', 'Storage write error');
    }
  };

  const handleLoadFromSlot = (slot: SaveSlot) => {
    if (!slot.data) return;
    onLoadPlayer(slot.data);
    sound.playConfirm();
    toast.info('PROFILE LOADED', `Restored ${slot.name} credentials`);
    onClose();
  };

  // Export JSON backup
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentPlayer, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `neon_heist_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    sound.playConfirm();
    toast.success('BACKUP EXPORTED', 'Encrypted operative JSON saved to device');
  };

  // Import JSON backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.stats && parsed.codename) {
          onLoadPlayer(parsed);
          sound.playConfirm();
          toast.success('BACKUP RESTORED', 'Operative profile verified and mounted');
          onClose();
        } else {
          toast.danger('INVALID BACKUP', 'Missing required cryptographic fields');
        }
      } catch {
        toast.danger('PARSING ERROR', 'Corrupted JSON backup file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6 font-mono-tech select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl brutal-frame glass-primary rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-hidden terminal-glass surface-imperfections">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="brutal-stamp text-amber-400 border-amber-500/30">
                CRYPT // STORAGE MATRIX
              </span>
              <span className="text-xs text-slate-400">OFFLINE MEMORY REPOSITORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              TACTICAL SAVE SLOTS
            </h2>
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

        {/* Slot Cards */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {slots.map((slot) => {
            const hasData = !!slot.data;

            return (
              <div
                key={slot.slotId}
                className="p-5 rounded-2xl brutal-frame bg-black/60 border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-display font-bold text-white tracking-wide">
                      {slot.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    hasData ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30' : 'text-slate-500 bg-white/5'
                  }`}>
                    {slot.lastSaved}
                  </span>
                </div>

                {hasData && (
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 bg-black/40 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-500 block">CREDITS</span>
                      <span className="font-bold text-cyan-300">₡{slot.data?.credits.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">COMPLETED</span>
                      <span className="font-bold text-white">0{slot.data?.stats.missionsCompleted} OP</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">STEALTH</span>
                      <span className="font-bold text-emerald-400">
                        {slot.data ? (100 - slot.data.stats.detectionPercentage).toFixed(0) : 0}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <TactileButton
                    variant="clay-primary"
                    size="sm"
                    className="flex-1 justify-center text-xs"
                    onClick={() => handleSaveToSlot(slot.slotId)}
                  >
                    SAVE CURRENT
                  </TactileButton>

                  {hasData && (
                    <TactileButton
                      variant="glass"
                      size="sm"
                      className="flex-1 justify-center text-xs"
                      onClick={() => handleLoadFromSlot(slot)}
                    >
                      LOAD SLOT
                    </TactileButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Import/Export & Reset Controls */}
        <div className="pt-4 border-t border-white/10 mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TactileButton
              variant="glass"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExportJson}
            >
              EXPORT JSON
            </TactileButton>

            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-mono-tech">
                <Upload className="w-3.5 h-3.5" />
                IMPORT
              </span>
            </label>
          </div>

          <button
            onClick={() => {
              if (confirm('REINITIALIZE ALL CRYPT PROGRESS? This resets current profile data.')) {
                onResetProgress();
                loadSlotsFromStorage();
                toast.warning('RESET COMPLETE', 'Operative profile returned to default baseline');
              }
            }}
            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 cursor-pointer p-1 rounded transition-colors text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            RESET ALL DATA
          </button>
        </div>

      </div>
    </div>
  );
};
