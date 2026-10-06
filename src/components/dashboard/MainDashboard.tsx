import React, { useRef, useEffect } from 'react';
import { PlayerState } from '../../types/game';
import { ActiveNavTab } from '../navigation/TopBar';
import { sound } from '../../game/audio';
import {
  Crosshair,
  Cpu,
  Layers,
  ShoppingBag,
  Database,
  Sliders,
  ShieldCheck,
  ChevronRight,
  Radio
} from 'lucide-react';

interface MainDashboardProps {
  player: PlayerState;
  onNavigate: (tab: ActiveNavTab) => void;
  onSelectOperation: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  player,
  onNavigate,
  onSelectOperation
}) => {
  const holoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Holographic City Sector Wireframe Animation
  useEffect(() => {
    const canvas = holoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 500);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 450);
      const cx = w / 2;
      const cy = h / 2 + 30;

      ctx.clearRect(0, 0, w, h);

      // Radar scan rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      for (let r = 50; r <= 180; r += 40) {
        if (r > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(0, r), 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Sweeping radar beam
      rotation += 0.015;
      const beamX = cx + Math.cos(rotation) * 180;
      const beamY = cy + Math.sin(rotation) * 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(beamX, beamY);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Holographic isometric city buildings
      const numTowers = 9;
      for (let i = 0; i < numTowers; i++) {
        const angle = (i / numTowers) * Math.PI * 2 + rotation * 0.4;
        const dist = 70 + (i % 3) * 35;
        const bx = cx + Math.cos(angle) * dist;
        const by = cy + Math.sin(angle) * (dist * 0.55);
        const bHeight = 40 + (i % 4) * 25;

        // Base
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
        ctx.strokeRect(bx - 12, by - 8, 24, 16);

        // Tower top
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
        ctx.strokeRect(bx - 12, by - 8 - bHeight, 24, 16);

        // Vertical connecting corner struts
        ctx.beginPath();
        ctx.moveTo(bx - 12, by - 8);
        ctx.lineTo(bx - 12, by - 8 - bHeight);
        ctx.moveTo(bx + 12, by - 8);
        ctx.lineTo(bx + 12, by - 8 - bHeight);
        ctx.moveTo(bx - 12, by + 8);
        ctx.lineTo(bx - 12, by + 8 - bHeight);
        ctx.moveTo(bx + 12, by + 8);
        ctx.lineTo(bx + 12, by + 8 - bHeight);
        ctx.stroke();

        // Tower antenna pulse
        if (i === 1 || i === 4) {
          ctx.fillStyle = '#22d3ee';
          ctx.beginPath();
          ctx.arc(bx, by - 12 - bHeight, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const menuItems: { id: ActiveNavTab; index: string; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'OPERATIONS', index: '01', label: 'OPERATIONS', desc: 'Tactical Megacity Contracts', icon: <Crosshair className="w-4 h-4" /> },
    { id: 'PROFILE', index: '02', label: 'INTELLIGENCE', desc: 'Operative Analytics & Bio', icon: <Cpu className="w-4 h-4" /> },
    { id: 'LOADOUT', index: '03', label: 'LOADOUT', desc: 'Active Stealth Arsenal', icon: <Layers className="w-4 h-4" /> },
    { id: 'MARKET', index: '04', label: 'MARKET', desc: 'Illicit Weaponry & Software', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'ARCHIVE', index: '05', label: 'ARCHIVE', desc: 'Classified Corporate Lore', icon: <Database className="w-4 h-4" /> },
    { id: 'SETTINGS', index: '06', label: 'SETTINGS', desc: 'Audio, Visuals & Terminal', icon: <Sliders className="w-4 h-4" /> }
  ];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
      {/* Top OS Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5 font-mono-tech text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400 font-bold">GHOSTNET OS · ENCRYPTED KERNEL</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">NODE ID: GHOST-894-DELTA</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>IP: 10.42.198.74 [ANONYMIZED]</span>
          <span>LATENCY: 4MS</span>
        </div>
      </div>

      {/* Tri-column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center">
        {/* Left Column: Minimal Encrypted Navigation */}
        <div className="lg:col-span-3 space-y-2.5 font-mono-tech">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest px-2 mb-3">
            ROOT NAVIGATION
          </div>

          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                sound.playUiClick();
                onNavigate(item.id);
              }}
              onMouseEnter={() => sound.playUiHover()}
              className="w-full text-left p-3.5 rounded-xl border border-white/5 bg-[#0a0f1d]/50 hover:bg-cyan-950/30 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-cyan-400 font-bold group-hover:drop-shadow-[0_0_8px_#22d3ee]">
                  {item.index}
                </span>
                <div>
                  <div className="text-xs font-display font-semibold text-white tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 group-hover:text-cyan-300/70">
                    {item.desc}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        {/* Center Column: Holographic City Map */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-[#080d19]/40 relative overflow-hidden">
          {/* Canvas Hologram */}
          <div className="w-full h-72 sm:h-80 relative flex items-center justify-center">
            <canvas ref={holoCanvasRef} className="w-full h-full block" />

            {/* Hologram Floating Tag */}
            <div className="absolute top-4 left-4 text-left font-mono-tech">
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest block">
                SECTOR OVERVIEW
              </span>
              <h2 className="text-lg font-display font-bold text-white tracking-wide">
                NIGHT CITY · SECTOR 07
              </h2>
              <span className="text-xs text-amber-400 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> SECURITY LEVEL: HIGH
              </span>
            </div>

            {/* Center Deploy Button */}
            <div className="absolute bottom-4">
              <button
                onClick={() => {
                  sound.playConfirm();
                  onSelectOperation();
                }}
                className="py-3 px-7 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2 group"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>ACCESS ACTIVE CONTRACTS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Operative Dossier Information */}
        <div className="lg:col-span-3 space-y-4 font-mono-tech">
          <div className="p-5 rounded-2xl border border-white/5 bg-[#0a0f1d]/50 space-y-4">
            <div className="border-b border-white/5 pb-3">
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-0.5">
                OPERATIVE DOSSIER
              </span>
              <h3 className="text-base font-display font-bold text-white">
                {player.codename}
              </h3>
              <span className="text-xs text-slate-400">
                CLASS: {player.classTitle}
              </span>
            </div>

            {/* Reputation Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">REPUTATION</span>
                <span className="text-cyan-300 font-bold">LEVEL {player.reputationLevel} · 82%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full w-[82%] shadow-[0_0_8px_#22d3ee]" />
              </div>
            </div>

            {/* Stats list */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-slate-400">
                <span>CREDITS</span>
                <span className="text-white font-bold">₡{player.credits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>MISSIONS COMPLETED</span>
                <span className="text-white font-bold">{player.stats.missionsCompleted}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>DETECTION RATE</span>
                <span className="text-emerald-400 font-bold">{player.stats.detectionPercentage}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>PERFECT GHOST RUNS</span>
                <span className="text-cyan-400 font-bold">{player.stats.perfectInfiltrations}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Micro Telemetry Bar */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono-tech text-slate-500">
        <span>GHOST PROTOCOL STATUS: ENGAGED</span>
        <span>SECURITY SCAN INTERVAL: 3000MS</span>
      </div>
    </div>
  );
};
