import React from 'react';
import { sound } from '../../game/audio';
import { Play, Volume2, VolumeX, Shield, Terminal } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

export type ActiveNavTab = 
  | 'DASHBOARD' 
  | 'OPERATIONS' 
  | 'LOADOUT' 
  | 'MARKET' 
  | 'UPGRADES' 
  | 'PROFILE' 
  | 'ARCHIVE' 
  | 'SETTINGS';

interface TopBarProps {
  currentTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  credits: number;
  onQuickHeist: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onTabChange,
  credits,
  onQuickHeist,
  isMuted,
  onToggleMute
}) => {
  const navItems: { id: ActiveNavTab; label: string; code: string }[] = [
    { id: 'DASHBOARD', label: 'SYSTEM', code: '01' },
    { id: 'OPERATIONS', label: 'OPERATIONS', code: '02' },
    { id: 'LOADOUT', label: 'LOADOUT', code: '03' },
    { id: 'MARKET', label: 'BLACK MARKET', code: '04' },
    { id: 'UPGRADES', label: 'AUGMENTS', code: '05' },
    { id: 'ARCHIVE', label: 'ARCHIVE', code: '06' }
  ];

  const handleNav = (tab: ActiveNavTab) => {
    sound.playUiClick();
    onTabChange(tab);
  };

  return (
    <header className="h-18 w-full px-7 flex items-center justify-between border-b border-white/10 bg-[#060910]/85 backdrop-blur-2xl z-40 select-none terminal-glass surface-imperfections relative">
      {/* Zone 1: Brutalist Architectural Wordmark */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleNav('DASHBOARD')}
          className="group text-left cursor-pointer outline-none flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#1c2638] to-[#0e1422] border border-white/20 border-b-2 border-b-black flex items-center justify-center shadow-md">
            <Terminal className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-display font-extrabold tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                NEON HEIST
              </span>
              <span className="brutal-stamp text-[9px] text-cyan-400/80 border-cyan-500/20 py-0.5 px-1.5 hidden sm:inline-block">
                SYS.07
              </span>
            </div>
            <div className="font-mono-tech text-[9px] text-slate-500 tracking-widest uppercase">
              STEALTH COMMAND NETWORK
            </div>
          </div>
        </button>
      </div>

      {/* Zone 2: Brutalist Clean Tab Navigation */}
      <nav className="hidden lg:flex items-center gap-2 font-mono-tech text-xs tracking-wider">
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#151f33] text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_2px_12px_rgba(34,211,238,0.15)] -translate-y-0.5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="text-[10px] text-slate-500">{item.code}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Tactile Clay Action Controls & Credits */}
      <div className="flex items-center gap-3">
        {/* Credits Pill with Clay Inset */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#090d18] border border-white/10 shadow-inner">
          <span className="font-mono-tech text-[10px] text-slate-400 tracking-wider">CREDITS</span>
          <span className="font-mono-tech font-bold text-cyan-300 text-xs">
            ₡{credits.toLocaleString()}
          </span>
        </div>

        {/* Audio Mute Glass Button */}
        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-xl bg-[#0e1524]/80 hover:bg-[#162137] active:scale-95 border border-white/10 text-slate-400 hover:text-white transition-all shadow-md cursor-pointer"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* Primary Tactile Deploy Button */}
        <TactileButton
          variant="clay-accent"
          size="md"
          icon={<Play className="w-3.5 h-3.5 fill-slate-950" />}
          onClick={onQuickHeist}
        >
          DEPLOY HEIST
        </TactileButton>
      </div>
    </header>
  );
};
