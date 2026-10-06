import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../game/audio';
import { Terminal, Shield, Play, RotateCcw } from 'lucide-react';

interface OpeningExperienceProps {
  onEnterNetwork: (isNewGame: boolean) => void;
  hasSavedGame: boolean;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({
  onEnterNetwork,
  hasSavedGame
}) => {
  const [phase, setPhase] = useState<number>(0);
  // Phase 0: Black screen with blinking cursor
  // Phase 1: ESTABLISHING SECURE CONNECTION...
  // Phase 2: ENCRYPTION: ACTIVE / IDENTITY: UNKNOWN / NETWORK: GHOSTNET
  // Phase 3: Glitch + WELCOME BACK, GHOST.
  // Phase 4: Cinematic City reveal with NEON HEIST title & buttons

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Cinematic timeline
    const t1 = setTimeout(() => {
      sound.playUiHover();
      setPhase(1);
    }, 1200);

    const t2 = setTimeout(() => {
      sound.playConfirm();
      setPhase(2);
    }, 3200);

    const t3 = setTimeout(() => {
      sound.playSuspicionAlert();
      setPhase(3);
    }, 5500);

    const t4 = setTimeout(() => {
      sound.playConfirm();
      setPhase(4);
    }, 7800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Rain, Hover vehicles, and Skyscraper Canvas
  useEffect(() => {
    if (phase < 3) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Rain particles
    const rainDrops: { x: number; y: number; l: number; v: number }[] = [];
    for (let i = 0; i < 160; i++) {
      rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: Math.random() * 20 + 10,
        v: Math.random() * 12 + 14
      });
    }

    // Hover vehicles
    const vehicles: { x: number; y: number; speed: number; color: string; len: number }[] = [
      { x: -50, y: height * 0.45, speed: 2.2, color: '#22d3ee', len: 60 },
      { x: width + 50, y: height * 0.58, speed: -1.8, color: '#a855f7', len: 45 },
      { x: -100, y: height * 0.72, speed: 3.1, color: '#f59e0b', len: 55 }
    ];

    // Distant buildings
    const buildings: { x: number; w: number; h: number; windows: { x: number; y: number; on: boolean }[] }[] = [];
    let curX = 0;
    while (curX < width) {
      const bW = Math.random() * 90 + 70;
      const bH = Math.random() * (height * 0.6) + height * 0.3;
      const bWindows: { x: number; y: number; on: boolean }[] = [];
      for (let wy = height - bH + 20; wy < height - 40; wy += 25) {
        for (let wx = curX + 15; wx < curX + bW - 15; wx += 20) {
          bWindows.push({ x: wx, y: wy, on: Math.random() > 0.4 });
        }
      }
      buildings.push({ x: curX, w: bW, h: bH, windows: bWindows });
      curX += bW + 15;
    }

    const render = () => {
      ctx.fillStyle = '#05070d';
      ctx.fillRect(0, 0, width, height);

      // Distant building silhouettes
      buildings.forEach(b => {
        ctx.fillStyle = '#090f1e';
        ctx.fillRect(b.x, height - b.h, b.w, b.h);

        // Windows
        b.windows.forEach(win => {
          ctx.fillStyle = win.on ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255, 255, 255, 0.02)';
          ctx.fillRect(win.x, win.y, 8, 12);
        });
      });

      // Distant billboard glow
      ctx.fillStyle = 'rgba(6, 182, 212, 0.04)';
      ctx.fillRect(width * 0.2, height * 0.3, 140, 60);

      // Hover vehicles light trails
      vehicles.forEach(v => {
        v.x += v.speed;
        if (v.speed > 0 && v.x > width + 100) v.x = -100;
        if (v.speed < 0 && v.x < -100) v.x = width + 100;

        ctx.strokeStyle = v.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = v.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(v.x - v.speed * 8, v.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Rain animation
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
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
  }, [phase]);

  const handleStart = (isNew: boolean) => {
    sound.playConfirm();
    onEnterNetwork(isNew);
  };

  return (
    <div className="relative w-screen h-screen bg-[#04060a] flex items-center justify-center overflow-hidden select-none font-mono-tech">
      {/* Background Cityscape Canvas */}
      {phase >= 3 && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 opacity-80" />
      )}

      {/* Cyber scanlines overlay */}
      <div className="absolute inset-0 cyber-scanlines opacity-50 z-10 pointer-events-none" />
      <div className="absolute inset-0 cyber-vignette opacity-80 z-10 pointer-events-none" />

      {/* PHASES 0-3: Terminal Boot Sequence */}
      {phase < 4 && (
        <div className="relative z-20 max-w-lg p-6 text-left space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span>TERMINAL BOOT SEQUENCE</span>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            {phase >= 1 && (
              <p className="text-cyan-300 animate-pulse">
                &gt; ESTABLISHING SECURE CONNECTION...
              </p>
            )}

            {phase >= 2 && (
              <div className="space-y-1 text-slate-400 text-xs border-l-2 border-cyan-500/50 pl-3">
                <p>ENCRYPTION: ACTIVE (SHA-512 QUANTUM)</p>
                <p>IDENTITY: UNKNOWN</p>
                <p>LOCATION: CLASSIFIED</p>
                <p className="text-cyan-400 font-bold">NETWORK: GHOSTNET</p>
              </div>
            )}

            {phase >= 3 && (
              <p className="text-base font-display font-bold text-white tracking-wider pt-2">
                &gt; WELCOME BACK, GHOST.
              </p>
            )}
          </div>

          {/* Skip intro button */}
          <button
            onClick={() => {
              sound.playConfirm();
              setPhase(4);
            }}
            className="text-[11px] text-slate-500 hover:text-slate-300 underline underline-offset-4 pt-4 block"
          >
            [SKIP SEQUENCE]
          </button>
        </div>
      )}

      {/* PHASE 4: Main Title & Enter Network Screen */}
      {phase >= 4 && (
        <div className="relative z-20 max-w-xl w-full p-8 text-center animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] text-cyan-300 tracking-widest uppercase mb-4">
            <Shield className="w-3.5 h-3.5" /> SECURE OPERATING SYSTEM
          </div>

          <h1 className="text-5xl sm:text-6xl font-display font-extrabold text-white tracking-wider mb-2 drop-shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            NEON HEIST
          </h1>

          <p className="text-sm sm:text-base font-mono-tech text-cyan-300/90 tracking-widest uppercase mb-8">
            STEAL THE IMPOSSIBLE. LEAVE NO TRACE.
          </p>

          {/* Action buttons */}
          <div className="space-y-3 max-w-sm mx-auto">
            {hasSavedGame ? (
              <>
                <button
                  onClick={() => handleStart(false)}
                  className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>CONTINUE HEIST</span>
                </button>

                <button
                  onClick={() => handleStart(true)}
                  className="w-full py-3 px-6 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono-tech text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>NEW GAME</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleStart(true)}
                className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>ENTER NETWORK</span>
              </button>
            )}
          </div>

          <div className="mt-8 text-[11px] font-mono-tech text-slate-500">
            GHOSTNET CLIENT V4.2.0 · ZERO DETECTION PROTOCOL
          </div>
        </div>
      )}
    </div>
  );
};
