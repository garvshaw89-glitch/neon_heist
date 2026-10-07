import React, { useRef, useEffect } from 'react';
import { PlayerState } from '../../types/game';
import { ActiveNavTab } from '../navigation/TopBar';
import { sound } from '../../game/audio';
import {
  Play,
  Crosshair,
  Layers,
  ShoppingBag,
  Cpu,
  Sliders,
  ChevronRight,
  Shield,
  Radio,
  Terminal,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { BrutalCard } from '../common/BrutalCard';

interface MainDashboardProps {
  player: PlayerState;
  onNavigate: (tab: ActiveNavTab) => void;
  onSelectOperation: () => void;
  onPlayTutorial: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  player,
  onNavigate,
  onSelectOperation,
  onPlayTutorial
}) => {
  const cityCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Multi-Layer Cinematic Megacity Canvas
  useEffect(() => {
    const canvas = cityCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Rain streaks
    const rainDrops: { x: number; y: number; l: number; v: number }[] = [];
    for (let i = 0; i < 120; i++) {
      rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: Math.random() * 22 + 10,
        v: Math.random() * 11 + 14
      });
    }

    // Heavy Hovercraft traffic
    const traffic: { x: number; y: number; speed: number; color: string }[] = [
      { x: -50, y: height * 0.38, speed: 2.2, color: '#38bdf8' },
      { x: width + 50, y: height * 0.52, speed: -1.8, color: '#a855f7' },
      { x: -80, y: height * 0.65, speed: 3.1, color: '#f59e0b' }
    ];

    // Monolithic Brutalist Towers
    const towers: { x: number; w: number; h: number; windows: { x: number; y: number; lit: boolean }[] }[] = [];
    let curX = 0;
    while (curX < width + 100) {
      const bW = Math.random() * 110 + 75;
      const bH = Math.random() * (height * 0.65) + height * 0.35;
      const bWindows: { x: number; y: number; lit: boolean }[] = [];
      for (let wy = height - bH + 28; wy < height - 50; wy += 28) {
        for (let wx = curX + 16; wx < curX + bW - 16; wx += 22) {
          bWindows.push({ x: wx, y: wy, lit: Math.random() > 0.45 });
        }
      }
      towers.push({ x: curX, w: bW, h: bH, windows: bWindows });
      curX += bW + 20;
    }

    const render = () => {
      ctx.fillStyle = '#040609';
      ctx.fillRect(0, 0, width, height);

      // Deep atmospheric haze
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#020407');
      skyGrad.addColorStop(0.7, '#070b14');
      skyGrad.addColorStop(1, '#0c1322');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Monolithic towers
      towers.forEach(t => {
        ctx.fillStyle = '#080d1a';
        ctx.fillRect(t.x, height - t.h, t.w, t.h);

        t.windows.forEach(w => {
          ctx.fillStyle = w.lit ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.012)';
          ctx.fillRect(w.x, w.y, 8, 14);
        });

        // Beacon
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(t.x + t.w / 2, height - t.h - 3, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Hovercraft Traffic Light Trails
      traffic.forEach(v => {
        v.x += v.speed;
        if (v.speed > 0 && v.x > width + 100) v.x = -100;
        if (v.speed < 0 && v.x < -100) v.x = width + 100;

        ctx.strokeStyle = v.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = v.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(v.x - v.speed * 8, v.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Rain animation
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      rainDrops.forEach(drop => {
        drop.y += drop.v;
        if (drop.y > height) {
          drop.y = -20;
          drop.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1, drop.y + drop.l);
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const menuModules = [
    {
      code: '01',
      title: 'OPERATIONS',
      subtitle: 'SELECT CLASSIFIED TARGETS',
      desc: 'Active contracts across 4 corporate megacity sectors.',
      action: () => onNavigate('OPERATIONS'),
      icon: <Crosshair className="w-4 h-4 text-cyan-400" />
    },
    {
      code: '02',
      title: 'LOADOUT ARSENAL',
      subtitle: 'TACTICAL GEAR DEPLOYMENT',
      desc: 'Equip cloaks, EMP devices, and signal scramblers.',
      action: () => onNavigate('LOADOUT'),
      icon: <Layers className="w-4 h-4 text-purple-400" />
    },
    {
      code: '03',
      title: 'BLACK MARKET',
      subtitle: 'ILLICIT HARDWARE PROCUREMENT',
      desc: 'Acquire restricted military hardware & stealth software.',
      action: () => onNavigate('MARKET'),
      icon: <ShoppingBag className="w-4 h-4 text-amber-400" />
    },
    {
      code: '04',
      title: 'AUGMENTATIONS',
      subtitle: 'CYBERNETIC TREE UPGRADES',
      desc: 'Enhance neural processing, stamina, and cloak duration.',
      action: () => onNavigate('UPGRADES'),
      icon: <Cpu className="w-4 h-4 text-emerald-400" />
    }
  ];

  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] overflow-hidden select-none font-mono-tech">
      {/* Live Atmospheric Canvas Backdrop */}
      <canvas ref={cityCanvasRef} className="absolute inset-0 w-full h-full block z-0 opacity-70" />

      {/* Cyber Vignette & Scanlines */}
      <div className="absolute inset-0 cyber-vignette opacity-85 z-10 pointer-events-none" />
      <div className="absolute inset-0 cyber-scanlines opacity-40 z-10 pointer-events-none" />

      {/* Foreground Asymmetric Brutalist × Glass Layout */}
      <div className="relative z-20 w-full h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
        
        {/* Top Status HUD Band */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="brutal-stamp text-cyan-300 border-cyan-500/30">
              SYS // ACTIVE
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-display font-bold text-white text-sm">
                OPERATIVE: {player.codename}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">RANK {player.reputationLevel}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10">
              <span className="text-slate-400">CREDITS</span>
              <span className="font-bold text-cyan-300">₡{player.credits.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10">
              <span className="text-slate-400">STEALTH INDEX</span>
              <span className="font-bold text-emerald-400">{100 - player.stats.detectionPercentage}% GHOST</span>
            </div>
          </div>
        </div>

        {/* Center Grid: Asymmetric Architectural Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto py-6">
          
          {/* Left Hero Card: Active Dispatch Dossier */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono-tech text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
                    PRIMARY DIRECTIVE // OP-01
                  </span>
                  <h2 className="text-3xl font-display font-black text-white tracking-tight">
                    SILENT ENTRY
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    AURELION FINANCIAL TOWER · SECTOR 01
                  </p>
                </div>
                <span className="brutal-stamp text-amber-300 border-amber-500/30">
                  CLASSIFIED
                </span>
              </div>

              {/* Oversized Numerical Telemetry */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-black/50 border border-white/5">
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase">SECURITY</span>
                  <span className="text-xl font-display font-extrabold text-amber-400">LVL 03</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase">REWARD</span>
                  <span className="text-xl font-display font-extrabold text-cyan-300">₡12,500</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase">RISK</span>
                  <span className="text-xl font-display font-extrabold text-rose-400">HIGH</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Infiltrate the high-security core of Aurelion Dynamics. Bypass the laser perimeter, loop security cameras, and extract the quantum encryption cipher.
              </p>

              {/* Tactile Clay Action Triggers */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <TactileButton
                  variant="clay-accent"
                  size="md"
                  className="flex-1"
                  icon={<Play className="w-4 h-4 fill-slate-950" />}
                  onClick={onSelectOperation}
                >
                  COMMENCE OPERATION
                </TactileButton>

                <TactileButton
                  variant="clay-primary"
                  size="md"
                  icon={<Radio className="w-4 h-4 text-cyan-400" />}
                  onClick={onPlayTutorial}
                >
                  TACTICAL TUTORIAL
                </TactileButton>
              </div>
            </div>

            {/* Micro Intelligence Ticker */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>INTELLIGENCE RADAR: ORION SURVEILLANCE ACTIVE</span>
              </div>
              <span className="text-[10px] text-slate-500">SEC. LAYER 4</span>
            </div>
          </div>

          {/* Right Column: 4 Brutalist Tactical Modules */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuModules.map(mod => (
              <BrutalCard
                key={mod.code}
                stamp={mod.code}
                title={mod.title}
                subtitle={mod.subtitle}
                interactive
                onClick={mod.action}
                className="group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    ACCESS MODULE <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-cyan-500/10 transition-colors">
                    {mod.icon}
                  </div>
                </div>
              </BrutalCard>
            ))}
          </div>

        </div>

        {/* Bottom Brutalist Footer Stamp */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/10 pt-3">
          <div className="flex items-center gap-4">
            <span>NEON HEIST ARCHITECTURE // VER 4.2</span>
            <span>ENCRYPTION: HARDWARE AIR-GAP</span>
          </div>
          <span>AUTONOMOUS OPERATING SYSTEM // ALL RIGHTS RESERVED</span>
        </div>

      </div>
    </div>
  );
};
