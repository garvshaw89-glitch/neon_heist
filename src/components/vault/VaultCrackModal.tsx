import React, { useState, useEffect } from 'react';
import { sound } from '../../game/audio';
import { KeyRound, ShieldCheck, LockOpen, Sparkles } from 'lucide-react';

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
    // Sequence through layers
    if (currentLayer < securityLayers) {
      const timer = setTimeout(() => {
        sound.playConfirm();
        setCurrentLayer(prev => prev + 1);
      }, 900);
      return () => clearTimeout(timer);
    } else if (!isGranted) {
      const timer = setTimeout(() => {
        sound.playHackSuccess();
        setIsGranted(true);
        setIsOpening(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentLayer, securityLayers, isGranted]);

  const handleAcquire = () => {
    sound.playConfirm();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-xl bg-[#090d18] border border-cyan-500/40 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.2)] p-8 text-center overflow-hidden terminal-glass surface-imperfections">
        {/* Ambient background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 mb-6 shadow-inner">
            {isGranted ? (
              <LockOpen className="w-12 h-12 text-cyan-300 animate-pulse" />
            ) : (
              <KeyRound className="w-12 h-12 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            )}
          </div>

          <div className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest mb-1">
            EXECUTIVE SANCTUM
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-wide mb-6">
            QUANTUM VAULT DECRYPTION
          </h2>

          {/* Layer Progress Stack */}
          <div className="space-y-3 mb-8 max-w-sm mx-auto">
            {Array.from({ length: securityLayers }).map((_, idx) => {
              const bypassed = currentLayer > idx;
              const isBypassing = currentLayer === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border font-mono-tech text-xs transition-all ${
                    bypassed
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                      : isBypassing
                      ? 'bg-slate-900 border-cyan-500 text-white animate-pulse'
                      : 'bg-slate-950/60 border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${bypassed ? 'text-cyan-400' : 'text-slate-600'}`} />
                    <span>SECURITY LAYER 0{idx + 1}</span>
                  </div>
                  <span className="font-bold">
                    {bypassed ? 'BYPASSED' : isBypassing ? 'DECRYPTING...' : 'ENCRYPTED'}
                  </span>
                </div>
              );
            })}

            {/* Biometric seal */}
            <div
              className={`flex items-center justify-between p-3 rounded-lg border font-mono-tech text-xs transition-all ${
                isGranted
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${isGranted ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>BIOMETRIC HARMONIC SEAL</span>
              </div>
              <span className="font-bold">
                {isGranted ? 'OVERRIDDEN' : 'LOCKED'}
              </span>
            </div>
          </div>

          {/* Reveal target item when granted */}
          {isGranted ? (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-xl">
                <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
                  CLASSIFIED ASSET SECURED
                </span>
                <span className="text-xl font-display font-bold text-white tracking-wide">
                  {targetName}
                </span>
              </div>

              <div className="text-xs font-mono-tech text-amber-400 animate-pulse">
                [ALERT: FACILITY ENTERING HEIGHTENED SURVEILLANCE · ESCAPE TO EXTRACTION ZONE]
              </div>

              <button
                onClick={handleAcquire}
                className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-sm tracking-wider uppercase transition-colors shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              >
                EXTRACT ASSET & INITIATE ESCAPE
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="py-2 px-5 rounded-lg border border-slate-800 hover:border-slate-600 text-slate-400 font-mono-tech text-xs transition-colors"
            >
              ABORT INTERFACE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
