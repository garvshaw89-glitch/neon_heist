import React from 'react';
import { sound } from '../../game/audio';
import { Play, Volume2, VolumeX } from 'lucide-react';

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
  const navItems: { id: ActiveNavTab; label: string }[] = [
    { id: 'DASHBOARD', label: 'System' },
    { id: 'OPERATIONS', label: 'Operations' },
    { id: 'LOADOUT', label: 'Loadout' },
    { id: 'MARKET', label: 'Black Market' },
    { id: 'UPGRADES', label: 'Augments' },
    { id: 'ARCHIVE', label: 'Archive' }
  ];

  const handleNav = (tab: ActiveNavTab) => {
    sound.playUiClick();
    onTabChange(tab);
  };

  return (
    <header className="h-16 w-full px-6 flex items-center justify-between border-b border-white/5 bg-[#070a12]/90 backdrop-blur-xl z-40 select-none">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => handleNav('DASHBOARD')}
        className="text-lg font-display font-bold tracking-wider text-white hover:text-cyan-400 transition-colors whitespace-nowrap"
      >
        NEON HEIST
      </button>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-xs font-mono-tech tracking-wider">
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`transition-colors whitespace-nowrap ${
                isActive
                  ? 'text-cyan-400 font-bold border-b border-cyan-400 pb-0.5 shadow-[0_1px_8px_rgba(34,211,238,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono-tech text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1.5 rounded-lg whitespace-nowrap">
          <span className="text-slate-400">CREDITS</span>
          <span className="font-bold">₡{credits.toLocaleString()}</span>
        </div>

        <button
          onClick={onToggleMute}
          className="p-2 rounded-lg text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        <button
          onClick={onQuickHeist}
          className="px-4 py-2 text-xs font-display font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>DEPLOY</span>
        </button>
      </div>
    </header>
  );
};
