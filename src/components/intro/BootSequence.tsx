import React, { useState, useEffect } from 'react';
import { sound } from '../../game/audio';
import { Terminal, Shield, Cpu, Eye, Wifi } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

interface LogLine {
  text: string;
  status: string;
  delay: number;
}

const BOOT_LOGS: LogLine[] = [
  { text: 'INITIALIZING GHOST PROTOCOL', status: 'LOADED', delay: 200 },
  { text: 'CRYPTOGRAPHIC CORE (SHA-512)', status: 'ACTIVE', delay: 700 },
  { text: 'SECURITY LAYER', status: 'ONLINE', delay: 1200 },
  { text: 'NEURAL LINK INTERFACE', status: 'ONLINE', delay: 1700 },
  { text: 'TACTICAL SENSOR TELEMETRY', status: 'CALIBRATED', delay: 2200 },
  { text: 'DISTRICT SURVEILLANCE FEED', status: 'BYPASSED', delay: 2700 },
  { text: 'HARDWARE ACCELERATION', status: 'SYNCHRONIZED', delay: 3100 },
  { text: 'OPERATIVE CLEARANCE LEVEL 07', status: 'VERIFIED', delay: 3500 },
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [showTitleReveal, setShowTitleReveal] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Schedule line reveals
    const timers: NodeJS.Timeout[] = [];

    BOOT_LOGS.forEach((log, index) => {
      const t = setTimeout(() => {
        setVisibleIndex(index + 1);
        sound.playTerminalBoot();
      }, log.delay);
      timers.push(t);
    });

    // Reveal title after logs
    const titleTimer = setTimeout(() => {
      setShowTitleReveal(true);
      sound.playConfirm();
    }, 4000);
    timers.push(titleTimer);

    // Complete boot sequence
    const completeTimer = setTimeout(() => {
      handleProceed();
    }, 5800);
    timers.push(completeTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const handleProceed = () => {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div
      onClick={handleProceed}
      className={`fixed inset-0 z-50 bg-[#020408] text-slate-100 flex flex-col justify-between p-6 sm:p-12 font-mono-tech select-none cursor-pointer transition-opacity duration-700 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Subtle CRT Scanline & Glass Distortion */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.04)_0%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px]" />

      {/* Top Header Diagnostics */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 text-[10px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-300 font-bold tracking-widest">GHOSTNET KERNEL 4.19-RT</span>
        </div>
        <div className="flex items-center gap-4">
          <span>PORT 0x47A8</span>
          <span className="text-slate-400">PRESS ANY KEY TO SKIP</span>
        </div>
      </div>

      {/* Center Console Logs or Title Reveal */}
      <div className="relative z-10 my-auto max-w-2xl mx-auto w-full">
        {!showTitleReveal ? (
          <div className="space-y-3.5 bg-black/60 p-6 sm:p-8 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
            <div className="text-xs text-slate-500 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>SYSTEM DIAGNOSTIC</span>
              <span className="text-cyan-400 font-bold">BOOT SEQUENCE</span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm font-mono-tech">
              {BOOT_LOGS.slice(0, visibleIndex).map((log, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-500 text-xs">›</span>
                    <span className="text-slate-200 tracking-wide">{log.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">................</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      log.status === 'ONLINE' || log.status === 'VERIFIED'
                        ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30'
                        : log.status === 'BYPASSED'
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                        : 'text-slate-300 bg-white/5'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {visibleIndex < BOOT_LOGS.length && (
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 animate-pulse">
                <span className="w-1.5 h-3 bg-cyan-400 inline-block" />
                <span>POLLING HARDWARE INTERRUPTS...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-cyan-400/40 bg-cyan-950/40 text-[10px] text-cyan-300 tracking-widest font-mono uppercase">
              <Shield className="w-3.5 h-3.5" />
              INFILTRATION OPERATING SYSTEM ONLINE
            </div>

            <h1 className="text-6xl sm:text-8xl font-display font-black text-white tracking-tight leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
              NEON HEIST
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 tracking-[0.3em] uppercase font-mono-tech">
              DARK LUXURY CYBERPUNK STEALTH
            </p>

            <div className="pt-6">
              <span className="text-xs text-cyan-400 animate-pulse font-mono tracking-widest">
                [ INITIALIZATION COMPLETE · ENTERING MAINFRAME ]
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Ticker */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-t border-white/10 pt-4 text-[10px] text-slate-600">
        <div>ORION SECURITY PROTOCOL · REV 8.44</div>
        <div className="flex items-center gap-2 text-cyan-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>CRYPTOGRAPHIC CIPHER LOCKED</span>
        </div>
      </div>
    </div>
  );
};
