import React, { useRef, useEffect } from 'react';
import { PlayerState } from '../../types/game';
import { Shield, Award, Terminal, Eye, Crosshair } from 'lucide-react';
import { BrutalCard } from '../common/BrutalCard';

interface ProfileViewProps {
  player: PlayerState;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ player }) => {
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Futuristic Intelligence Radar Polygon
  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let pulse = 0;

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 360);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 280);
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.max(10, Math.min(cx, cy) - 35);

      ctx.clearRect(0, 0, w, h);

      // Web polygon rings
      const levels = 4;
      const stats = [
        { label: 'STEALTH', val: 0.94 },
        { label: 'HACKING', val: 0.88 },
        { label: 'SPEED', val: 0.82 },
        { label: 'EXTRACTION', val: 0.96 },
        { label: 'EVASION', val: 0.90 }
      ];
      const count = stats.length;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;

      for (let l = 1; l <= levels; l++) {
        const r = (radius / levels) * l;
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Axis lines
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "JetBrains Mono", monospace';
        const lx = cx + Math.cos(angle) * (radius + 18);
        const ly = cy + Math.sin(angle) * (radius + 18);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stats[i].label, lx, ly);
      }

      // Stat area polygon
      pulse += 0.03;
      const scaleAnim = 1 + Math.sin(pulse) * 0.02;

      ctx.beginPath();
      stats.forEach((s, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const r = radius * s.val * scaleAnim;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
      ctx.fill();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-4.5rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
              OPERATIVE // DOSSIER
            </span>
            <span className="text-xs text-slate-400">CLASSIFIED PERSONNEL RECORD</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white tracking-wide">
            INTELLIGENCE PROFILE
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10">
          <span>CLASSIFICATION:</span>
          <span className="text-cyan-300 font-bold">APEX GHOST</span>
        </div>
      </div>

      {/* Grid: Dossier Breakdown & Tactical Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center py-4">
        
        {/* Left 6 Columns: Operative Telemetry & Stats */}
        <div className="lg:col-span-6 brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="brutal-stamp text-cyan-300 border-cyan-500/30">
                RANK 0{player.reputationLevel}
              </span>
              <span className="text-xs text-slate-400">GHOSTNET IDENTITY: #07-ALPHA</span>
            </div>
            <h3 className="text-3xl font-display font-black text-white tracking-tight">
              {player.codename}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ROLE: INFILTRATION SPECIALIST · ZERO CASUALTY DISCIPLINE
            </p>
          </div>

          {/* Oversized Numerical Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-black/60 border border-white/5 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block uppercase">HEISTS</span>
              <span className="text-2xl font-display font-black text-white">
                0{player.stats.missionsCompleted}
              </span>
            </div>
            <div className="p-3.5 bg-black/60 border border-white/5 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block uppercase">STEALTH</span>
              <span className="text-2xl font-display font-black text-emerald-400">
                {100 - player.stats.detectionPercentage}%
              </span>
            </div>
            <div className="p-3.5 bg-black/60 border border-white/5 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block uppercase">HACKS</span>
              <span className="text-2xl font-display font-black text-cyan-300">
                0{player.stats.systemsHacked}
              </span>
            </div>
            <div className="p-3.5 bg-black/60 border border-white/5 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 block uppercase">TAKEDOWNS</span>
              <span className="text-2xl font-display font-black text-slate-200">
                0{player.stats.guardsNeutralized}
              </span>
            </div>
          </div>

          <div className="p-4 bg-black/50 border border-white/10 rounded-xl space-y-2 text-xs">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
              OPERATIONAL PERFORMANCE EVALUATION
            </span>
            <p className="text-slate-300 font-sans leading-relaxed text-xs">
              Demonstrates exceptional acoustic evasion and electromagnetic interference mastery. Unregistered biometric signature maintains zero cross-referencing on corporate surveillance grids.
            </p>
          </div>
        </div>

        {/* Right 6 Columns: Tactical Radar Geometry */}
        <div className="lg:col-span-6 brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">
                CYBERNETIC PROFICIENCY MATRIX
              </span>
              <h4 className="text-lg font-display font-extrabold text-white mt-0.5">
                NEURAL RADAR TELEMETRY
              </h4>
            </div>
            <span className="brutal-stamp text-cyan-300 border-cyan-500/30">
              POLYGON 5-AXIS
            </span>
          </div>

          {/* Radar Canvas Viewport */}
          <div className="relative w-full h-64 bg-black/60 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
            <div className="absolute inset-0 brutal-grid opacity-20" />
            <canvas ref={radarCanvasRef} className="w-full h-full block" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
            <span>AXIS: 5 DOMAINS SYNCHRONIZED</span>
            <span className="text-cyan-400">RATING: ELITE</span>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/10 pt-3">
        <span>GHOSTNET CLASSIFIED ARCHIVE // OPERATIVE #07</span>
        <span>ALL DATA SCRUBBED POST-OPERATION</span>
      </div>
    </div>
  );
};
