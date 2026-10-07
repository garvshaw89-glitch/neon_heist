import React from 'react';
import { sound } from '../../game/audio';
import { Shield, Cpu, Terminal, KeyRound, Award, FileText } from 'lucide-react';

interface GameFooterProps {
  onOpenAchievements?: () => void;
  onOpenSaves?: () => void;
  onOpenCredits?: () => void;
  onOpenKeybinds?: () => void;
}

export const GameFooter: React.FC<GameFooterProps> = ({
  onOpenAchievements,
  onOpenSaves,
  onOpenCredits,
  onOpenKeybinds
}) => {
  return (
    <footer className="w-full h-10 border-t border-white/10 bg-[#04060a]/90 backdrop-blur-md px-6 flex items-center justify-between text-[11px] font-mono-tech text-slate-400 select-none z-30 shrink-0">
      {/* Left: Terminal Identity */}
      <div className="flex items-center gap-3">
        <span className="text-white font-display font-extrabold tracking-wider">
          NEON HEIST
        </span>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <span className="text-slate-400 hidden sm:inline">
          © 2026 GHOSTNET COLLECTIVE
        </span>
      </div>

      {/* Center: System Status */}
      <div className="hidden md:flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        <span className="text-emerald-400 font-bold">SYSTEM SECURE</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-500">GHOSTNET PING: 14ms</span>
        <span className="text-slate-600">·</span>
        <span className="text-cyan-400/80">BUILD v1.0.4-PROD</span>
      </div>

      {/* Right: Tactical Direct Access Actions */}
      <div className="flex items-center gap-4 text-[10px]">
        {onOpenAchievements && (
          <button
            onClick={() => {
              sound.playUiClick();
              onOpenAchievements();
            }}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">COMMENDATIONS</span>
          </button>
        )}

        {onOpenSaves && (
          <button
            onClick={() => {
              sound.playUiClick();
              onOpenSaves();
            }}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>CRYPT SAVES</span>
          </button>
        )}

        {onOpenKeybinds && (
          <button
            onClick={() => {
              sound.playUiClick();
              onOpenKeybinds();
            }}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">CONTROLS</span>
          </button>
        )}

        {onOpenCredits && (
          <button
            onClick={() => {
              sound.playUiClick();
              onOpenCredits();
            }}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>CREDITS</span>
          </button>
        )}
      </div>
    </footer>
  );
};
