import React, { useRef, useEffect } from 'react';
import { PlayerState } from '../../types/game';
import { Shield, Award, Terminal, Eye, Crosshair } from 'lucide-react';

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

        // Label
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

      ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const stats = player.stats;

  return (
    <div className="w-full h-[calc(100vh-4rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-0.5">
            OPERATIVE INTELLIGENCE DOSSIER
          </span>
          <h2 className="text-xl font-display font-bold text-white tracking-wide">
            OPERATIVE PROFILE
          </h2>
        </div>
        <div className="text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg font-bold">
          CLEARANCE: GHOST RANK TIER 1
        </div>
      </div>

      {/* Main Grid: Identity & Intelligence Spider & Stats Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center">
        {/* Left 4 Cols: Identity & Spider Graph */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-white/5 bg-[#090e1c]/60 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
              CODENAME
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              {player.codename}
            </h3>
            <div className="text-xs text-slate-400 mt-1">
              CLASS: <span className="text-cyan-300 font-bold">{player.classTitle}</span> · REPUTATION LEVEL: <span className="text-white font-bold">{player.reputationLevel}</span>
            </div>
          </div>

          {/* Radar canvas */}
          <div className="w-full h-64 relative flex items-center justify-center">
            <canvas ref={radarCanvasRef} className="w-full h-full block" />
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            TACTICAL EFFICIENCY: 94.2% · ZERO LETHAL INCIDENTS
          </div>
        </div>

        {/* Right 7 Cols: Detailed Intelligence Stats Matrix */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-1">MISSIONS COMPLETED</span>
            <span className="text-xl font-display font-bold text-white">{stats.missionsCompleted}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-1">PERFECT GHOST RUNS</span>
            <span className="text-xl font-display font-bold text-cyan-300">{stats.perfectInfiltrations}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-1">DETECTION RATE</span>
            <span className="text-xl font-display font-bold text-emerald-400">{stats.detectionPercentage}%</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-1">SYSTEMS HACKED</span>
            <span className="text-xl font-display font-bold text-white">{stats.systemsHacked}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-1">CAMERAS DISABLED</span>
            <span className="text-xl font-display font-bold text-white">{stats.camerasDisabled}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-1">GUARDS NEUTRALIZED</span>
            <span className="text-xl font-display font-bold text-slate-300">{stats.guardsNeutralized}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-1">CLEAN EXTRACTIONS</span>
            <span className="text-xl font-display font-bold text-cyan-300">{stats.cleanExtractions}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-1">HIGHEST CONTRACT</span>
            <span className="text-xl font-display font-bold text-white">₡{stats.highestContract.toLocaleString()}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-500 block mb-1">TOTAL EARNINGS</span>
            <span className="text-xl font-display font-bold text-cyan-400">₡{stats.totalEarnings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500 flex justify-between">
        <span>GHOSTNET CLASSIFICATION: CODENAME 'THE GHOST'</span>
        <span>SECURITY SIGNATURE: ZERO TRACE CONFIRMED</span>
      </div>
    </div>
  );
};
