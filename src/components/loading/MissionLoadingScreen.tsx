import React, { useState, useEffect, useRef } from 'react';
import { Mission } from '../../types/game';
import { sound } from '../../game/audio';
import { Shield, Crosshair, Terminal, Radio, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

interface MissionLoadingScreenProps {
  mission: Mission;
  onReady: () => void;
  onAbort: () => void;
  error?: string | null;
  onRetry?: () => void;
}

export const MissionLoadingScreen: React.FC<MissionLoadingScreenProps> = ({
  mission,
  onReady,
  onAbort,
  error,
  onRetry
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeoutTriggered, setTimeoutTriggered] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef(Date.now());
  const timerFiredRef = useRef(false);
  const watchdogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps = [
    'AUTHENTICATING GHOST CIPHER KEY...',
    'INJECTING SECTOR ARCHITECTURE & SHADOW CONTOURS...',
    'CALIBRATING PATROL AI FREQUENCIES & SENSOR GRIDS...',
    'INITIALIZING TACTICAL NEURAL INTERFACE...',
    'DISPATCH AUTHORIZED — READY FOR INFILTRATION'
  ];

  useEffect(() => {
    if (error) return;

    startTimeRef.current = Date.now();
    timerFiredRef.current = false;
    setTimeoutTriggered(false);

    console.log(`[MissionLoadingScreen] Initializing deployment pipeline for ${mission.id} (${mission.operationCode})`);
    console.log(`[MissionLoadingScreen] 5.0-second recovery watchdog timer engaged at ${new Date().toISOString()}`);

    // 5-second recovery watchdog timer
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
    }

    watchdogTimerRef.current = setTimeout(() => {
      if (!timerFiredRef.current) {
        const timeDiff = Date.now() - startTimeRef.current;
        setElapsedMs(timeDiff);
        console.warn(`[MissionLoadingScreen::watchdog] WATCHDOG TIMEOUT TRIGGERED: Engine did not signal onReady within ${timeDiff}ms for mission [${mission.id}]. Engaging recovery state.`);
        setTimeoutTriggered(true);
        sound.playSuspicionAlert();
      }
    }, 5000);

    sound.playTerminalBoot();
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      if (p <= 25) setCurrentStepIndex(0);
      else if (p <= 55) setCurrentStepIndex(1);
      else if (p <= 80) setCurrentStepIndex(2);
      else if (p < 100) setCurrentStepIndex(3);
      else {
        setCurrentStepIndex(4);
        setProgress(100);
        clearInterval(interval);
        sound.playConfirm();
        timerFiredRef.current = true;
        if (watchdogTimerRef.current) {
          clearTimeout(watchdogTimerRef.current);
          watchdogTimerRef.current = null;
        }
        const elapsed = Date.now() - startTimeRef.current;
        console.log(`[MissionLoadingScreen] Pipeline successfully completed in ${elapsed}ms. Signalling onReady for ${mission.id}.`);
        setTimeout(() => {
          onReady();
        }, 280);
      }
      setProgress(Math.min(100, p));
    }, 40);

    return () => {
      clearInterval(interval);
      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current);
        watchdogTimerRef.current = null;
      }
    };
  }, [error, mission.id, onReady]);

  // Error or Timeout Recovery State Handling
  if (error || timeoutTriggered) {
    const errorTitle = timeoutTriggered
      ? 'INITIALIZATION WATCHDOG TIMEOUT (5.0s)'
      : 'OPERATION INITIALIZATION FAILED';

    const errorDetails = timeoutTriggered
      ? `The simulation engine did not signal operational readiness within 5000ms (elapsed: ${elapsedMs || 5000}ms). Tactical recovery protocol engaged.`
      : (error || 'Failed to initialize tactical operations pipeline.');

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040609]/95 backdrop-blur-2xl p-4 font-mono-tech select-none">
        <div className="relative w-full max-w-lg brutal-frame glass-primary rounded-2xl p-7 border-rose-500/50 shadow-[0_0_80px_rgba(244,63,94,0.3)] space-y-5 text-left">
          <div className="flex items-center gap-3 text-rose-400 border-b border-rose-500/20 pb-4">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <div>
              <span className="brutal-stamp text-rose-400 border-rose-500/30 text-[9px]">
                {timeoutTriggered ? 'RECOVERY WATCHDOG (5.0s)' : 'SYSTEM COMPROMISED'}
              </span>
              <h3 className="text-xl font-display font-black text-white mt-1">
                {errorTitle}
              </h3>
            </div>
          </div>

          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            NEON HEIST encountered a delay during sector initialization. Campaign progress, credits, and perks remain preserved.
          </p>

          <div className="p-3.5 rounded-xl bg-black/60 border border-rose-500/30 text-xs text-rose-300 font-mono space-y-1">
            <div className="font-bold text-slate-200">DIAGNOSTIC STATUS:</div>
            <div>{errorDetails}</div>
            <div className="text-[10px] text-slate-400 pt-1 border-t border-rose-500/20">
              TARGET: {mission.targetName} | SECTOR: {mission.sectorName} | MAP: {mission.mapWidth}x{mission.mapHeight}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-white/10">
            {/* Force Launch Option when timeout occurred */}
            {timeoutTriggered && (
              <TactileButton
                variant="clay-accent"
                size="md"
                className="w-full sm:flex-1 justify-center"
                icon={<ArrowRight className="w-4 h-4 fill-slate-950" />}
                onClick={() => {
                  console.log(`[MissionLoadingScreen::watchdog] Player manually triggered FORCE LAUNCH for ${mission.id}`);
                  sound.playConfirm();
                  onReady();
                }}
              >
                FORCE LAUNCH
              </TactileButton>
            )}

            {onRetry && (
              <TactileButton
                variant={timeoutTriggered ? 'clay-primary' : 'clay-accent'}
                size="md"
                className="w-full sm:flex-1 justify-center"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={() => {
                  console.log(`[MissionLoadingScreen] Retrying dispatch for ${mission.id}`);
                  setTimeoutTriggered(false);
                  onRetry();
                }}
              >
                RETRY DISPATCH
              </TactileButton>
            )}

            <TactileButton
              variant="glass"
              size="md"
              className="w-full sm:w-auto px-5"
              onClick={() => {
                console.log(`[MissionLoadingScreen] Aborting dispatch for ${mission.id}`);
                onAbort();
              }}
            >
              RETURN TO OPERATIONS
            </TactileButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040609]/95 backdrop-blur-2xl p-4 font-mono-tech select-none">
      <div className="relative w-full max-w-2xl brutal-frame glass-primary rounded-2xl p-8 sm:p-10 border-cyan-500/40 shadow-[0_0_100px_rgba(34,211,238,0.2)] space-y-6 text-left terminal-glass surface-imperfections">
        
        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="brutal-stamp text-cyan-400 border-cyan-500/30 text-[9px]">
                INFILTRATION DISPATCH // {mission.operationCode}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              {mission.facilityName}
            </h2>
            <div className="text-xs text-slate-400 mt-1">
              {mission.sectorName} · TARGET: <strong className="text-cyan-300">{mission.targetName}</strong>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">RISK LEVEL</span>
            <span className={`text-xl font-display font-black ${
              mission.risk === 'EXTREME' ? 'text-rose-400' :
              mission.risk === 'HIGH' ? 'text-rose-300' :
              mission.risk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {mission.risk}
            </span>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span className="text-slate-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{steps[currentStepIndex]}</span>
            </span>
            <span className="text-cyan-300 font-bold">{progress}%</span>
          </div>

          {/* Precision Meter Bar */}
          <div className="w-full h-3 bg-black/80 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-300 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tactical Parameters Strip */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-black/60 border border-white/5 text-xs text-slate-400">
          <div>
            <span className="text-[9px] text-slate-500 block uppercase">SECURITY RATING</span>
            <span className="font-bold text-amber-400">{mission.securityRating.toFixed(1)} / 10</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block uppercase">ENVIRONMENT</span>
            <span className="font-bold text-slate-200">{mission.environmentType}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block uppercase">PAYOUT BOUNTY</span>
            <span className="font-bold text-cyan-300">₡{mission.basePayout.toLocaleString()}</span>
          </div>
        </div>

        {/* Skip / Abort footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
          <button
            onClick={() => {
              console.log(`[MissionLoadingScreen] Player activated QUICK INFILTRATE skip for ${mission.id}`);
              sound.playConfirm();
              onReady();
            }}
            className="text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer text-xs font-mono font-bold tracking-wider"
          >
            [ QUICK INFILTRATE ⚡ ]
          </button>
          <button
            onClick={onAbort}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-mono"
          >
            [ CANCEL DISPATCH ]
          </button>
        </div>

      </div>
    </div>
  );
};
