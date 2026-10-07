import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../game/audio';
import { Terminal, Shield, Play, RotateCcw, Crosshair, ChevronRight, Award, KeyRound, FileText, Sliders } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { ActiveNavTab } from '../navigation/TopBar';

interface OpeningExperienceProps {
  onEnterNetwork: (isNewGame: boolean) => void;
  hasSavedGame: boolean;
  onNavigateTo?: (tab: ActiveNavTab) => void;
  onOpenCredits?: () => void;
  onOpenAchievements?: () => void;
  onOpenSaves?: () => void;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({
  onEnterNetwork,
  hasSavedGame,
  onNavigateTo,
  onOpenCredits,
  onOpenAchievements,
  onOpenSaves
}) => {
  const [phase, setPhase] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      sound.playUiHover();
      setPhase(1);
    }, 1000);

    const t2 = setTimeout(() => {
      sound.playConfirm();
      setPhase(2);
    }, 2400);

    const t3 = setTimeout(() => {
      sound.playSuspicionAlert();
      setPhase(3);
    }, 4200);

    const t4 = setTimeout(() => {
      sound.playConfirm();
      setPhase(4);
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Atmospheric rain, fog, and layered brutalist skyline
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
    for (let i = 0; i < 140; i++) {
      rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: Math.random() * 22 + 12,
        v: Math.random() * 12 + 15
      });
    }

    // Heavy atmospheric aircraft / hover vehicles
    const vehicles: { x: number; y: number; speed: number; color: string }[] = [
      { x: -80, y: height * 0.38, speed: 2.4, color: '#22d3ee' },
      { x: width + 100, y: height * 0.52, speed: -1.7, color: '#a855f7' },
      { x: -120, y: height * 0.68, speed: 3.2, color: '#38bdf8' }
    ];

    // Monolithic Brutalist Architecture
    const monoliths: { x: number; w: number; h: number; windows: { x: number; y: number; on: boolean }[] }[] = [];
    let curX = 0;
    while (curX < width) {
      const bW = Math.random() * 110 + 80;
      const bH = Math.random() * (height * 0.65) + height * 0.3;
      const bWindows: { x: number; y: number; on: boolean }[] = [];
      for (let wy = height - bH + 30; wy < height - 50; wy += 32) {
        for (let wx = curX + 18; wx < curX + bW - 18; wx += 24) {
          bWindows.push({ x: wx, y: wy, on: Math.random() > 0.45 });
        }
      }
      monoliths.push({ x: curX, w: bW, h: bH, windows: bWindows });
      curX += bW + 20;
    }

    const render = () => {
      ctx.fillStyle = '#030508';
      ctx.fillRect(0, 0, width, height);

      // Deep atmospheric haze
      const grad = ctx.createLinearGradient(0, height * 0.3, 0, height);
      grad.addColorStop(0, 'rgba(6, 12, 24, 0.4)');
      grad.addColorStop(1, 'rgba(2, 4, 8, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Distant brutalist monoliths
      monoliths.forEach(b => {
        ctx.fillStyle = '#080d19';
        ctx.fillRect(b.x, height - b.h, b.w, b.h);

        b.windows.forEach(win => {
          ctx.fillStyle = win.on ? 'rgba(34, 211, 238, 0.12)' : 'rgba(255, 255, 255, 0.015)';
          ctx.fillRect(win.x, win.y, 6, 14);
        });
      });

      // Air vehicles light beams
      vehicles.forEach(v => {
        v.x += v.speed;
        if (v.speed > 0 && v.x > width + 120) v.x = -120;
        if (v.speed < 0 && v.x < -120) v.x = width + 120;

        ctx.strokeStyle = v.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = v.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(v.x - v.speed * 12, v.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Rain streaks
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.16)';
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
    <div className="relative w-screen h-screen bg-[#030508] flex items-center justify-center overflow-hidden select-none font-mono-tech">
      {/* Background Cityscape Canvas */}
      {phase >= 3 && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 opacity-80" />
      )}

      {/* Cyber scanlines & vignette */}
      <div className="absolute inset-0 cyber-scanlines opacity-50 z-10 pointer-events-none" />
      <div className="absolute inset-0 cyber-vignette opacity-85 z-10 pointer-events-none" />

      {/* PHASES 0-3: Terminal Boot Sequence */}
      {phase < 4 && (
        <div className="relative z-20 max-w-xl w-full p-8 text-left space-y-5 brutal-frame glass-primary rounded-xl mx-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>TERMINAL INITIALIZATION // PROTOCOL 07</span>
            </div>
            <span className="brutal-stamp text-cyan-300 border-cyan-500/30">
              SYS-BOOT
            </span>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            {phase >= 1 && (
              <p className="text-cyan-300 font-mono-tech flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-cyan-400" />
                ESTABLISHING SECURE OPTICAL LINK...
              </p>
            )}

            {phase >= 2 && (
              <div className="space-y-1.5 text-slate-400 text-xs border-l-2 border-cyan-500/50 pl-4 py-1">
                <p>ENCRYPTION: <span className="text-white">QUANTUM SHA-512 ACTIVE</span></p>
                <p>BIOMETRIC AUTH: <span className="text-cyan-400">UNREGISTERED (GHOST CLASSIFICATION)</span></p>
                <p>LOCATION: <span className="text-slate-300">SECTOR 01 · FINANCIAL CITADEL</span></p>
                <p className="text-cyan-400 font-bold">NETWORK STATUS: ISOLATED AIR-GAP</p>
              </div>
            )}

            {phase >= 3 && (
              <div className="pt-2">
                <span className="text-xs uppercase text-slate-400 block mb-1">OPERATIVE RECOGNIZED</span>
                <p className="text-2xl font-display font-extrabold text-white tracking-wider">
                  WELCOME BACK, GHOST.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <TactileButton
              variant="brutal"
              size="sm"
              onClick={() => {
                sound.playConfirm();
                setPhase(4);
              }}
            >
              [SKIP INITIALIZATION]
            </TactileButton>
            <span className="text-[10px] text-slate-500">KERNEL BUILD 26.10</span>
          </div>
        </div>
      )}

      {/* PHASE 4: Brutalist × Glassmorphic × Claymorphic Main Menu */}
      {phase >= 4 && (
        <div className="relative z-20 max-w-5xl w-full p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Enormous Brutalist Typography */}
            <div className="lg:col-span-7 text-left space-y-4">
              <div className="flex items-center gap-3">
                <span className="brutal-stamp text-cyan-400 border-cyan-500/40">
                  CLASSIFIED // LEVEL 05
                </span>
                <span className="font-mono-tech text-xs text-slate-400 tracking-widest">
                  TACTICAL STEALTH SIMULATOR
                </span>
              </div>

              <div className="space-y-0 select-none">
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-black text-white tracking-tighter leading-none">
                  NEON
                </h1>
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-slate-200 tracking-tighter leading-none">
                  HEIST
                </h1>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border-l-4 border-cyan-400 max-w-lg">
                <p className="font-mono-tech text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Steal the impossible. Leave no trace. Tactical infiltration, guard AI evasion, cybernetic terminal hacking, and classified vault extractions.
                </p>
              </div>

              <div className="flex items-center gap-6 pt-2 font-mono-tech text-[11px] text-slate-500">
                <div>SECTOR 01 · FIN. DISTRICT</div>
                <div>SEC. LEVEL: APEX</div>
                <div>GHOST PROTOCOL: ACTIVE</div>
              </div>
            </div>

            {/* Right Column: Smoked Glass Dossier & Clay Tactile Actions */}
            <div className="lg:col-span-5">
              <div className="brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="font-mono-tech text-[10px] text-cyan-400 uppercase tracking-widest block">
                      OPERATIVE DISPATCH
                    </span>
                    <span className="font-display font-bold text-white text-base">
                      INITIALIZE SEQUENCE
                    </span>
                  </div>
                  <Crosshair className="w-5 h-5 text-cyan-400" />
                </div>

                {/* Tactile Clay Menu Actions */}
                <div className="space-y-3.5">
                  {hasSavedGame ? (
                    <>
                      <TactileButton
                        variant="clay-accent"
                        size="lg"
                        className="w-full justify-between"
                        icon={<Play className="w-4 h-4 fill-slate-950" />}
                        onClick={() => handleStart(false)}
                      >
                        CONTINUE OPERATION
                      </TactileButton>

                      <TactileButton
                        variant="clay-primary"
                        size="md"
                        className="w-full justify-between"
                        icon={<RotateCcw className="w-4 h-4 text-slate-300" />}
                        onClick={() => handleStart(true)}
                      >
                        START NEW HEIST
                      </TactileButton>
                    </>
                  ) : (
                    <TactileButton
                      variant="clay-accent"
                      size="lg"
                      className="w-full justify-between"
                      icon={<Play className="w-4 h-4 fill-slate-950" />}
                      onClick={() => handleStart(true)}
                    >
                      START OPERATION 01
                    </TactileButton>
                  )}

                  <TactileButton
                    variant="glass"
                    size="md"
                    className="w-full justify-between"
                    icon={<Terminal className="w-4 h-4 text-cyan-400" />}
                    onClick={() => handleStart(false)}
                  >
                    ENTER COMMAND NETWORK
                  </TactileButton>

                  {/* Secondary AAA Quick Navigation Shortcuts */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {onNavigateTo && (
                      <button
                        onClick={() => {
                          sound.playUiClick();
                          onEnterNetwork(false);
                          onNavigateTo('OPERATIONS');
                        }}
                        className="p-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/20 text-[11px] font-mono-tech text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                        <span>OPERATIONS</span>
                      </button>
                    )}

                    {onOpenAchievements && (
                      <button
                        onClick={() => {
                          sound.playUiClick();
                          onOpenAchievements();
                        }}
                        className="p-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/20 text-[11px] font-mono-tech text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>AWARDS</span>
                      </button>
                    )}

                    {onOpenSaves && (
                      <button
                        onClick={() => {
                          sound.playUiClick();
                          onOpenSaves();
                        }}
                        className="p-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/20 text-[11px] font-mono-tech text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                        <span>SAVES</span>
                      </button>
                    )}

                    {onOpenCredits && (
                      <button
                        onClick={() => {
                          sound.playUiClick();
                          onOpenCredits();
                        }}
                        className="p-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/20 text-[11px] font-mono-tech text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>CREDITS</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
                  <span>TERMINAL: GHOST-07</span>
                  <span className="text-cyan-400">STATUS: READY</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
