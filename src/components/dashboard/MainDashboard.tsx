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
  Radio
} from 'lucide-react';

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

    // Rain particles
    const rainDrops: { x: number; y: number; l: number; v: number }[] = [];
    for (let i = 0; i < 140; i++) {
      rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: Math.random() * 22 + 12,
        v: Math.random() * 12 + 16
      });
    }

    // Traffic light streaks (Hovercrafts)
    const traffic: { x: number; y: number; speed: number; color: string; len: number }[] = [
      { x: -50, y: height * 0.42, speed: 2.5, color: '#38bdf8', len: 70 },
      { x: width + 50, y: height * 0.54, speed: -2.1, color: '#fb7185', len: 55 },
      { x: -80, y: height * 0.68, speed: 3.2, color: '#f59e0b', len: 65 }
    ];

    // Background Skyscraper Silhouettes
    const towers: { x: number; w: number; h: number; windows: { x: number; y: number; lit: boolean }[] }[] = [];
    let curX = 0;
    while (curX < width + 100) {
      const bW = Math.random() * 110 + 80;
      const bH = Math.random() * (height * 0.65) + height * 0.35;
      const bWindows: { x: number; y: number; lit: boolean }[] = [];
      for (let wy = height - bH + 30; wy < height - 60; wy += 26) {
        for (let wx = curX + 16; wx < curX + bW - 16; wx += 22) {
          bWindows.push({ x: wx, y: wy, lit: Math.random() > 0.45 });
        }
      }
      towers.push({ x: curX, w: bW, h: bH, windows: bWindows });
      curX += bW + 18;
    }

    const render = () => {
      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, width, height);

      // Atmospheric gradient haze
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#04060a');
      skyGrad.addColorStop(0.7, '#070b14');
      skyGrad.addColorStop(1, '#0c1220');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant Tower Silhouettes
      towers.forEach(t => {
        ctx.fillStyle = '#0b101c';
        ctx.fillRect(t.x, height - t.h, t.w, t.h);

        // Windows
        t.windows.forEach(w => {
          ctx.fillStyle = w.lit ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.015)';
          ctx.fillRect(w.x, w.y, 9, 13);
        });

        // Rooftop aviation beacon
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(t.x + t.w / 2, height - t.h - 4, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Distant corporate sign glow
      ctx.fillStyle = 'rgba(56, 189, 248, 0.03)';
      ctx.fillRect(width * 0.45, height * 0.35, 200, 80);

      // Hovercraft Traffic Light Trails
      traffic.forEach(v => {
        v.x += v.speed;
        if (v.speed > 0 && v.x > width + 100) v.x = -100;
        if (v.speed < 0 && v.x < -100) v.x = width + 100;

        ctx.strokeStyle = v.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(v.x - v.speed * 8, v.y);
        ctx.stroke();
      });

      // Rain animation
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
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

  const menuOptions = [
    {
      label: 'CONTINUE CONTRACT',
      desc: 'Resume active infiltration sequence',
      action: () => onSelectOperation(),
      icon: <Play className="w-4 h-4" />
    },
    {
      label: 'OPERATION ZERO',
      desc: 'Play stealth tutorial simulation',
      action: () => onPlayTutorial(),
      icon: <Radio className="w-4 h-4" />
    },
    {
      label: 'OPERATIONS',
      desc: 'Select megacity corporate targets',
      action: () => onNavigate('OPERATIONS'),
      icon: <Crosshair className="w-4 h-4" />
    },
    {
      label: 'LOADOUT ARSENAL',
      desc: 'Configure tactical infiltration gear',
      action: () => onNavigate('LOADOUT'),
      icon: <Layers className="w-4 h-4" />
    },
    {
      label: 'INTELLIGENCE DOSSIER',
      desc: 'Operative profile & performance data',
      action: () => onNavigate('PROFILE'),
      icon: <Cpu className="w-4 h-4" />
    },
    {
      label: 'BLACK MARKET',
      desc: 'Procure classified hardware & software',
      action: () => onNavigate('MARKET'),
      icon: <ShoppingBag className="w-4 h-4" />
    },
    {
      label: 'CALIBRATION',
      desc: 'Audio, display & keybinding preferences',
      action: () => onNavigate('SETTINGS'),
      icon: <Sliders className="w-4 h-4" />
    }
  ];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden select-none font-mono-tech">
      {/* Live Atmospheric Canvas Backdrop */}
      <canvas ref={cityCanvasRef} className="absolute inset-0 w-full h-full block z-0" />

      {/* Cyber Vignette & Subtle Fog */}
      <div className="absolute inset-0 cyber-vignette opacity-85 z-10 pointer-events-none" />

      {/* Foreground Minimal Commercial Game Menu */}
      <div className="relative z-20 w-full h-full p-8 lg:p-12 flex flex-col justify-between">
        {/* Top Operative Status Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white font-bold">{player.codename}</span>
            <span className="text-slate-600">·</span>
            <span>RANK {player.reputationLevel}</span>
          </div>

          <div className="flex items-center gap-6">
            <span>BALANCE: <strong className="text-cyan-300">₡{player.credits.toLocaleString()}</strong></span>
            <span>DETECTION: <strong className="text-emerald-400">{player.stats.detectionPercentage}%</strong></span>
          </div>
        </div>

        {/* Center-Left AAA Game Navigation Menu */}
        <div className="max-w-md my-auto space-y-3">
          <div className="mb-6">
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
              SINGLE-PLAYER STEALTH SIMULATION
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-wider">
              NEON HEIST
            </h1>
            <p className="text-xs text-slate-400 tracking-wider mt-1">
              STEAL THE IMPOSSIBLE. LEAVE NO TRACE.
            </p>
          </div>

          <div className="space-y-2">
            {menuOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playConfirm();
                  opt.action();
                }}
                onMouseEnter={() => sound.playUiHover()}
                className="w-full text-left p-3.5 rounded-xl border border-white/5 bg-[#080d19]/60 hover:bg-slate-900/90 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-slate-500 group-hover:text-cyan-400 transition-colors">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold text-white tracking-wider group-hover:text-cyan-300 transition-colors">
                      {opt.label}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {opt.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Corner Security Connection Stamp */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-4">
          <span>GHOSTNET // SECURE ENCRYPTED CONNECTION</span>
          <span>VERSION 1.0 · OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
};
