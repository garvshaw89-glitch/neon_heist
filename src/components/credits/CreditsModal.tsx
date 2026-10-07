import React from 'react';
import { sound } from '../../game/audio';
import { Shield, Sparkles, X, Terminal, Cpu } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 font-mono-tech select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl brutal-frame glass-primary rounded-2xl shadow-[0_0_90px_rgba(0,0,0,0.95)] p-6 sm:p-9 flex flex-col max-h-[88vh] overflow-hidden terminal-glass surface-imperfections">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
                STUDIO // PRODUCTION
              </span>
              <span className="text-xs text-slate-400">CREDITS & ACKNOWLEDGMENTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              NEON HEIST
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

        {/* Cinematic Credits Crawl Content */}
        <div className="overflow-y-auto space-y-8 pr-2 flex-1 text-center py-4">
          <div className="space-y-2">
            <span className="text-[10px] text-cyan-400 tracking-widest uppercase block">
              EXPERIENCE DIRECTION & ARCHITECTURE
            </span>
            <h3 className="text-xl font-display font-black text-white">
              GHOSTNET CREATIVE LABS
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Brutalist, Glassmorphic & Claymorphic UI/UX Engineering
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left p-6 bg-black/60 rounded-2xl border border-white/5">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">GAMEPLAY DESIGN</span>
              <div className="text-sm font-display font-bold text-slate-200 mt-1">Realistic Stealth Dynamics</div>
              <div className="text-xs text-slate-400 font-sans mt-0.5">Raycasting LOS, Patrol FOV, Diegetic Audio Waves</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">SOUND DESIGN</span>
              <div className="text-sm font-display font-bold text-slate-200 mt-1">Algorithmic Web Audio Synth</div>
              <div className="text-xs text-slate-400 font-sans mt-0.5">Zero external audio dependencies · Pure synthesized physics</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">FRONTEND ARCHITECTURE</span>
              <div className="text-sm font-display font-bold text-slate-200 mt-1">React 19 & Tailwind CSS v4</div>
              <div className="text-xs text-slate-400 font-sans mt-0.5">Hardware-accelerated Canvas & Responsive Clay controls</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">WORLD BUILDING & LORE</span>
              <div className="text-sm font-display font-bold text-slate-200 mt-1">Orion Dynamics Megacorporation</div>
              <div className="text-xs text-slate-400 font-sans mt-0.5">Sub-zero quantum vaults, cyber surveillance perimeters</div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 tracking-widest uppercase block">
              SPECIAL THANKS
            </span>
            <p className="text-xs text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
              To everyone who values tactical patience, shadows over gunfire, and games where intellect overcomes corporate defenses.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 text-[10px] text-slate-600">
            ALL INTEL & LOGOS ARE PROPERTY OF GHOSTNET // 2088 CYBER DISTRICT
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end mt-4">
          <TactileButton
            variant="glass"
            size="sm"
            onClick={onClose}
          >
            CLOSE CREDITS
          </TactileButton>
        </div>

      </div>
    </div>
  );
};
