import React, { useState, useEffect } from 'react';
import { sound } from '../../game/audio';
import { KeyRound, ShieldCheck, LockOpen, Sparkles, X, ShieldAlert } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

interface VaultCrackModalProps {
  targetName: string;
  securityLayers: number;
  onComplete: () => void;
  onClose: () => void;
}

export const VaultCrackModal: React.FC<VaultCrackModalProps> = ({
  targetName,
  securityLayers,
  onComplete,
  onClose
}) => {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [isGranted, setIsGranted] = useState(false);

  useEffect(() => {
    if (currentLayer < securityLayers) {
      const timer = setTimeout(() => {
        sound.playConfirm();
        setCurrentLayer(prev => prev + 1);
      }, 850);
      return () => clearTimeout(timer);
    } else if (!isGranted) {
      const timer = setTimeout(() => {
        sound.playHackSuccess();
        setIsGranted(true);
        setIsOpening(true);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [currentLayer, securityLayers, isGranted]);

  const handleAcquire = () => {
    sound.playConfirm();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 select-none font-mono-tech">
      <div className="relative w-full max-w-xl brutal-frame glass-primary rounded-2xl shadow-[0_0_90px_rgba(0,0,0,0.95)] p-7 sm:p-9 text-center overflow-hidden terminal-glass surface-imperfections animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
              VAULT // SEC-CORE
            </span>
            <span className="text-xs text-slate-400">EXECUTIVE SANCTUM</span>
          </div>
          <button
            onClick={() => {
              sound.playUiClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-black/50 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cylinder / Lock Cylinder Visualizer */}
        <div className="relative z-10 space-y-4">
          <div className="inline-flex p-5 rounded-2xl bg-gradient-to-b from-[#182338] to-[#0f1725] border-2 border-cyan-400/50 text-cyan-300 shadow-xl">
            {isGranted ? (
              <LockOpen className="w-14 h-14 text-cyan-300 animate-pulse" />
            ) : (
              <KeyRound className="w-14 h-14 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            )}
          </div>

          <div>
            <h2 className="text-3xl font-display font-black text-white tracking-tight">
              QUANTUM VAULT DECRYPTION
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              MULTILAYER BIOMETRIC BYPASS IN PROGRESS
            </p>
          </div>

          {/* Layer Progress Stack */}
          <div className="space-y-2.5 my-6 max-w-md mx-auto">
            {Array.from({ length: securityLayers }).map((_, idx) => {
              const bypassed = currentLayer > idx;
              const isBypassing = currentLayer === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all ${
                    bypassed
                      ? 'bg-[#121c2e] border-cyan-500/40 text-cyan-300 shadow-sm'
                      : isBypassing
                      ? 'bg-black/80 border-cyan-400 text-white animate-pulse'
                      : 'bg-black/40 border-white/5 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className={`w-4 h-4 ${bypassed ? 'text-cyan-400' : 'text-slate-600'}`} />
                    <span className="font-bold">SECURITY LAYER 0{idx + 1}</span>
                  </div>
                  <span className="font-mono-tech font-extrabold text-[11px]">
                    {bypassed ? 'BYPASSED' : isBypassing ? 'DECRYPTING...' : 'ENCRYPTED'}
                  </span>
                </div>
              );
            })}

            {/* Biometric seal */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-all ${
                isGranted
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 shadow-md'
                  : 'bg-black/40 border-white/5 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className={`w-4 h-4 ${isGranted ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span className="font-bold">BIOMETRIC HARMONIC SEAL</span>
              </div>
              <span className="font-mono-tech font-extrabold text-[11px]">
                {isGranted ? 'OVERRIDDEN' : 'LOCKED'}
              </span>
            </div>
          </div>

          {/* Reveal target item when granted */}
          {isGranted ? (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="p-4 bg-black/60 border border-cyan-400/40 rounded-xl">
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1 font-bold">
                  CLASSIFIED ASSET SECURED
                </span>
                <span className="text-2xl font-display font-black text-white tracking-wide">
                  {targetName}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-bold animate-pulse">
                <ShieldAlert className="w-4 h-4" />
                FACILITY ALERT LEVEL MAXIMAL · RETREAT TO EXTRACTION VECTOR
              </div>

              <TactileButton
                variant="clay-accent"
                size="lg"
                className="w-full justify-center"
                onClick={handleAcquire}
              >
                EXTRACT ASSET & COMMENCE ESCAPE
              </TactileButton>
            </div>
          ) : (
            <TactileButton
              variant="glass"
              size="md"
              onClick={onClose}
            >
              ABORT DECRYPTION
            </TactileButton>
          )}
        </div>
      </div>
    </div>
  );
};
