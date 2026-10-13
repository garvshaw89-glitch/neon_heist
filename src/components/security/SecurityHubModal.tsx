import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SecurityCamera, LaserGrid, Wall } from '../../types/game';
import { sound } from '../../game/audio';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Camera,
  Zap,
  Lock,
  Unlock,
  Bell,
  BellOff,
  X,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Terminal as TerminalIcon,
  Cpu,
  Activity,
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { ClayKey } from '../common/ClayKey';

interface SecurityHubModalProps {
  cameras: SecurityCamera[];
  lasers: LaserGrid[];
  walls: Wall[];
  alarmsActive: boolean;
  detectionPercent: number;
  surveillanceOverridden: boolean;
  isAuthorized: boolean;
  securityTier?: string;
  securityRating?: number;
  difficulty?: 'RECRUIT' | 'OPERATIVE' | 'GHOST' | 'NIGHTMARE';
  onAuthorizeSuccess: () => void;
  onAuthorizeFail: () => void;
  onToggleCameraLoop: (id: string) => void;
  onToggleCameraPower: (id: string) => void;
  onLoopAllCameras: () => void;
  onDisableAllCameras: () => void;
  onToggleLaser: (id: string) => void;
  onDeactivateAllLasers: () => void;
  onUnlockDoor: (doorId: string) => void;
  onUnlockAllVaultDoors: () => void;
  onSilenceAlarm: () => void;
  onSuppressTamperSensors: () => void;
  onClose: () => void;
}

type TabType = 'CAMERAS' | 'LASERS' | 'DOORS' | 'ALARMS';

export const SecurityHubModal: React.FC<SecurityHubModalProps> = ({
  cameras,
  lasers,
  walls,
  alarmsActive,
  detectionPercent,
  surveillanceOverridden,
  isAuthorized,
  securityTier,
  securityRating,
  difficulty,
  onAuthorizeSuccess,
  onAuthorizeFail,
  onToggleCameraLoop,
  onToggleCameraPower,
  onLoopAllCameras,
  onDisableAllCameras,
  onToggleLaser,
  onDeactivateAllLasers,
  onUnlockDoor,
  onUnlockAllVaultDoors,
  onSilenceAlarm,
  onSuppressTamperSensors,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('CAMERAS');

  // --- FACILITY SECURITY TIER DIFFICULTY SCALING SYSTEM ---
  const tierConfig = useMemo(() => {
    const rawTier = (securityTier || '').toUpperCase();
    const tierMatch = rawTier.match(/TIER\s*(\d+)/i);
    const parsedTier = tierMatch ? parseInt(tierMatch[1], 10) : 
      (difficulty === 'NIGHTMARE' ? 5 : difficulty === 'GHOST' ? 3 : difficulty === 'OPERATIVE' ? 2 : 1);
    const rating = securityRating || (parsedTier * 2);

    if (parsedTier >= 5 || difficulty === 'NIGHTMARE' || rating >= 8.5) {
      return {
        tierLabel: 'TIER 5 // BLACK-SITE ZERO-POINT CIPHER',
        securityLevel: 'MAXIMUM THREAT',
        sequenceLength: 5,
        timeLimit: 16,
        maxAttempts: 2,
        undoPenaltySeconds: 8,
        hexPool: ['7A', 'BD', '1C', '55', 'E9', '3F', 'F4', '0D', '99', '2B'],
        packetRate: '1.42 GB/s',
        complexity: 'QUANTUM CRYPTO-HARDENED'
      };
    }
    if (parsedTier === 4 || rating >= 7.0) {
      return {
        tierLabel: 'TIER 4 // MIL-SPEC HIGH SEC GRID',
        securityLevel: 'HIGH THREAT',
        sequenceLength: 4,
        timeLimit: 18,
        maxAttempts: 2,
        undoPenaltySeconds: 6,
        hexPool: ['7A', 'BD', '1C', '55', 'E9', '3F', '4C', 'A8'],
        packetRate: '840 MB/s',
        complexity: 'MIL-SPEC HARDENED'
      };
    }
    if (parsedTier === 3 || difficulty === 'GHOST' || rating >= 5.0) {
      return {
        tierLabel: 'TIER 3 // CORPORATE MAINFRAME FIREWALL',
        securityLevel: 'ELEVATED SECURITY',
        sequenceLength: 4,
        timeLimit: 22,
        maxAttempts: 3,
        undoPenaltySeconds: 5,
        hexPool: ['7A', 'BD', '1C', '55', 'E9', '3F', '8E', '62'],
        packetRate: '520 MB/s',
        complexity: 'HEAVY ENCRYPTION'
      };
    }
    if (parsedTier === 2 || difficulty === 'OPERATIVE' || rating >= 3.0) {
      return {
        tierLabel: 'TIER 2 // PRIVATE CASINO SYNDICATE HUB',
        securityLevel: 'MODERATE ENCRYPTION',
        sequenceLength: 3,
        timeLimit: 25,
        maxAttempts: 3,
        undoPenaltySeconds: 4,
        hexPool: ['7A', 'BD', '1C', '55', 'E9', '3F'],
        packetRate: '310 MB/s',
        complexity: 'SYNDICATE CIPHER'
      };
    }
    return {
      tierLabel: 'TIER 1 // COMMERCIAL SECURITY CONSOLE',
      securityLevel: 'STANDARD ENCRYPTION',
      sequenceLength: 3,
      timeLimit: 30,
      maxAttempts: 3,
      undoPenaltySeconds: 3,
      hexPool: ['7A', 'BD', '1C', '55', 'E9', '3F'],
      packetRate: '140 MB/s',
      complexity: 'STANDARD CIPHER'
    };
  }, [securityTier, securityRating, difficulty]);

  // Hacking Authorization Sequence State
  const [authStage, setAuthStage] = useState<'LOCKED' | 'BREACHING' | 'GRANTED'>(
    isAuthorized ? 'GRANTED' : 'LOCKED'
  );
  const [timeLeft, setTimeLeft] = useState(tierConfig.timeLimit);
  const [authError, setAuthError] = useState<string | null>(null);
  const [undoPenaltyNotice, setUndoPenaltyNotice] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(tierConfig.maxAttempts);

  // Puzzle: Code Cipher Matching
  const [targetCode, setTargetCode] = useState<string[]>([]);
  const [enteredCode, setEnteredCode] = useState<string[]>([]);
  const [availableCodes, setAvailableCodes] = useState<string[]>([]);
  const [decryptingIndex, setDecryptingIndex] = useState<number | null>(null);
  const [glitchCharacters, setGlitchCharacters] = useState<Record<number, string>>({});

  // Background Hex Stream Canvas Ref
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Puzzle based on scaled tier configuration
  const setupPuzzle = () => {
    const pool = [...tierConfig.hexPool];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, tierConfig.sequenceLength);
    setTargetCode(targets);
    setAvailableCodes([...shuffled]);
    setEnteredCode([]);
    setTimeLeft(tierConfig.timeLimit);
    setAttemptsLeft(tierConfig.maxAttempts);
    setAuthError(null);
    setUndoPenaltyNotice(null);
    setDecryptingIndex(null);
  };

  useEffect(() => {
    if (!isAuthorized) {
      setupPuzzle();
    }
  }, [isAuthorized, tierConfig]);

  // Timer for authorization sequence
  useEffect(() => {
    if (authStage !== 'BREACHING' || isAuthorized) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAuthFailure('FIREWALL TIMEOUT: INTRUSION ATTEMPT DETECTED — GUARDS DISPATCHED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [authStage, isAuthorized]);

  // --- VISUAL DECRYPTION MATRIX STREAM ANIMATION ---
  useEffect(() => {
    if (authStage === 'LOCKED' && isAuthorized) return;
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const cols = Math.floor(canvas.width / 22);
    const ypos = Array(cols).fill(0).map(() => Math.floor(Math.random() * -50));

    const hexChars = '0123456789ABCDEF';

    const renderStream = () => {
      ctx.fillStyle = 'rgba(5, 8, 17, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '10px "JetBrains Mono", monospace';

      for (let i = 0; i < cols; i++) {
        const text = '0x' + hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
        
        // Leading glow character
        ctx.fillStyle = Math.random() > 0.85 ? '#67e8f9' : '#0ea5e9';
        ctx.fillText(text, i * 22, ypos[i]);

        if (ypos[i] > canvas.height + Math.random() * 80) {
          ypos[i] = -20;
        } else {
          ypos[i] += 12;
        }
      }

      animId = requestAnimationFrame(renderStream);
    };

    renderStream();

    return () => cancelAnimationFrame(animId);
  }, [authStage, isAuthorized]);

  // Tactical Penalty-Based Undo Move
  const handleUndoStep = () => {
    if (enteredCode.length === 0 || authStage !== 'BREACHING' || isAuthorized) return;
    const penalty = tierConfig.undoPenaltySeconds;
    sound.playUiClick();
    sound.playSuspicionAlert();

    setTimeLeft(prev => {
      const remaining = prev - penalty;
      if (remaining <= 0) {
        handleAuthFailure(`FIREWALL LOCKOUT: ROLLBACK PENALTY (-${penalty}s) DEPLETED TIME WINDOW`);
        return 0;
      }
      return remaining;
    });

    setEnteredCode(prev => prev.slice(0, -1));
    setAuthError(null);
    setUndoPenaltyNotice(`-${penalty}s TIME PENALTY APPLIED // BUFFER ROLLBACK`);
    setTimeout(() => {
      setUndoPenaltyNotice(null);
    }, 1800);
  };

  // Keyboard shortcut listener for Escape to close, Backspace for tactical undo, and number keys for puzzle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        sound.playUiClick();
        onClose();
        return;
      }

      if (authStage === 'BREACHING' && !isAuthorized) {
        // Penalty-based undo move via Backspace, Delete, or U key
        if (e.key === 'Backspace' || e.key === 'Delete' || e.key.toLowerCase() === 'u' || (e.ctrlKey && e.key.toLowerCase() === 'z')) {
          e.preventDefault();
          e.stopPropagation();
          handleUndoStep();
          return;
        }

        // Quick number key access for puzzle cipher buttons (1 - 9)
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= availableCodes.length) {
          e.preventDefault();
          e.stopPropagation();
          handleCodeClick(availableCodes[num - 1]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose, authStage, isAuthorized, availableCodes, enteredCode, targetCode, tierConfig]);

  const handleCodeClick = (code: string) => {
    sound.playUiClick();
    if (enteredCode.length >= targetCode.length) return;

    const currentIndex = enteredCode.length;
    const next = [...enteredCode, code];

    // Trigger visual decryption glitch cycle on the newly matched node
    setDecryptingIndex(currentIndex);
    let glitchCount = 0;
    const glitchInterval = setInterval(() => {
      const hexChars = '0123456789ABCDEF';
      const randHex = hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
      setGlitchCharacters(prev => ({ ...prev, [currentIndex]: randHex }));
      glitchCount++;
      if (glitchCount >= 4) {
        clearInterval(glitchInterval);
        setGlitchCharacters(prev => {
          const updated = { ...prev };
          delete updated[currentIndex];
          return updated;
        });
        setDecryptingIndex(null);
      }
    }, 60);

    setEnteredCode(next);

    // Check if next character is correct
    const expected = targetCode[currentIndex];
    if (code !== expected) {
      sound.playSuspicionAlert();
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      if (remaining <= 0) {
        handleAuthFailure(`FIREWALL LOCKOUT: ${tierConfig.maxAttempts} MISMATCHES DETECTED — SYSTEM BREACH TRIGGERED`);
      } else {
        setAuthError(`CIPHER MISMATCH — ${remaining} ATTEMPT${remaining > 1 ? 'S' : ''} REMAINING`);
        setTimeout(() => {
          setEnteredCode([]);
          setAuthError(null);
        }, 700);
      }
      return;
    }

    // Success sound on partial correct match
    sound.playHackRotate();

    // If completed full code correctly
    if (next.length === targetCode.length) {
      sound.playConfirm();
      setAuthStage('GRANTED');
      onAuthorizeSuccess();
    }
  };

  const handleAuthFailure = (reason: string) => {
    sound.playSuspicionAlert();
    setAuthError(reason);
    setAuthStage('LOCKED');
    setEnteredCode([]);
    setAttemptsLeft(tierConfig.maxAttempts);
    onAuthorizeFail();
  };

  // Door status helper
  const getDoorStatus = (doorId: string) => {
    const w = walls.find(wall => wall.doorId === doorId);
    return w?.isOpen ? 'OPEN' : 'LOCKED';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-2 sm:p-4 select-none font-mono-tech">
      <div className="relative w-full max-w-4xl max-h-[92vh] brutal-frame glass-primary rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col terminal-glass surface-imperfections animate-in fade-in zoom-in-95 duration-200">
        
        {/* TOP BAR: Mainframe Identity & Exit Action */}
        <div className="w-full bg-[#050811]/90 border-b border-white/10 p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="brutal-stamp text-[8px] sm:text-[9px] text-cyan-400 border-cyan-500/30">
                  {tierConfig.tierLabel}
                </span>
                <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  isAuthorized || authStage === 'GRANTED'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                }`}>
                  {isAuthorized || authStage === 'GRANTED' ? 'AUTH: GRANTED' : 'AUTH: RESTRICTED'}
                </span>
              </div>
              <h2 className="text-xs sm:text-base font-display font-extrabold text-white tracking-wide mt-0.5 truncate flex items-center gap-2">
                <span>CENTRAL SECURITY COMMAND CONSOLE</span>
                <span className="text-[10px] text-slate-400 font-mono-tech hidden sm:inline">[{tierConfig.complexity}]</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[9px] text-slate-400">
              [ESC] TO EXIT
            </span>
            <button
              onClick={() => {
                sound.playUiClick();
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-rose-950/40 border border-white/10 hover:border-rose-400/40 text-slate-300 hover:text-rose-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Close Terminal"
            >
              <X className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold hidden sm:inline">DISENGAGE</span>
            </button>
          </div>
        </div>

        {/* SECURITY STATUS BANNER */}
        <div className="bg-[#080d1a] border-b border-white/10 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-4">
            <span>
              STATUS: <strong className={alarmsActive ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}>
                {alarmsActive ? 'LOCKDOWN // ACTIVE' : 'SECURE // ARMED'}
              </strong>
            </span>
            <span>
              DETECTION: <strong className={detectionPercent > 50 ? 'text-rose-400' : 'text-cyan-300'}>
                {Math.round(detectionPercent)}%
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>
              TAMPER SENSORS:{' '}
              <strong className={surveillanceOverridden ? 'text-emerald-400' : 'text-amber-400'}>
                {surveillanceOverridden ? 'SUPPRESSED (SILENT)' : 'ARMED'}
              </strong>
            </span>
            <span>
              CAMERAS ONLINE:{' '}
              <strong className="text-cyan-300">
                {cameras.filter(c => !c.isPowerOff && !c.isLooping).length} / {cameras.length}
              </strong>
            </span>
            <span>
              LASERS ENERGIZED:{' '}
              <strong className={lasers.filter(l => l.isActive).length > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                {lasers.filter(l => l.isActive).length} / {lasers.length}
              </strong>
            </span>
          </div>
        </div>

        {/* MAIN BODY: HACKING AUTHORIZATION OR REAL CONTROLS */}
        {!isAuthorized && authStage !== 'GRANTED' ? (
          /* HACKING AUTHORIZATION GATEWAY WITH VISUAL DECRYPTION ANIMATION */
          <div className="relative flex-1 p-4 sm:p-8 flex flex-col justify-center items-center text-center space-y-5 overflow-hidden">
            
            {/* Visual Decryption Canvas Background */}
            <canvas
              ref={matrixCanvasRef}
              width={800}
              height={500}
              className="absolute inset-0 w-full h-full pointer-events-none opacity-25 z-0"
            />

            {/* Scanline CRT overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] z-0" />

            <div className="relative z-10 max-w-lg space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 mb-1 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                <ShieldAlert className="w-7 h-7 text-cyan-400 animate-pulse" />
              </div>
              <h3 className="text-base sm:text-xl font-display font-extrabold text-white tracking-wide">
                FACILITY SECURITY OVERRIDE REQUIRED
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono-tech max-w-md mx-auto">
                Protected by <strong className="text-cyan-300">{tierConfig.tierLabel}</strong>. Authorize master administrative privileges to loop surveillance cameras, disengage laser barriers, and disarm vault tamper alarms.
              </p>
            </div>

            {authStage === 'LOCKED' ? (
              <div className="relative z-10 space-y-4">
                {authError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold animate-pulse max-w-md mx-auto">
                    <AlertTriangle className="w-4 h-4 inline mr-2 text-rose-400" />
                    {authError}
                  </div>
                )}
                
                {/* Security Tier Telemetry Card */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-left max-w-sm mx-auto space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>DEFENSE PROTOCOL:</span>
                    <strong className="text-amber-400 font-mono-tech">{tierConfig.securityLevel}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>CIPHER NODES REQUIRED:</span>
                    <strong className="text-cyan-300 font-mono-tech">{tierConfig.sequenceLength} HEX CHUNKS</strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>INJECTION TIMEOUT:</span>
                    <strong className="text-cyan-300 font-mono-tech">{tierConfig.timeLimit} SECONDS</strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>TOLERANCE THRESHOLD:</span>
                    <strong className="text-rose-400 font-mono-tech">{tierConfig.maxAttempts} FAILED ATTEMPTS</strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px] pt-1 border-t border-white/5">
                    <span>TACTICAL ROLLBACK PENALTY:</span>
                    <strong className="text-amber-400 font-mono-tech">-{tierConfig.undoPenaltySeconds}s PER NODE</strong>
                  </div>
                </div>

                <TactileButton
                  variant="clay-primary"
                  size="lg"
                  onClick={() => {
                    sound.playUiClick();
                    setupPuzzle();
                    setAuthStage('BREACHING');
                  }}
                  className="px-6 py-3 cursor-pointer"
                >
                  INITIALIZE FIREWALL BREACH
                </TactileButton>
              </div>
            ) : (
              /* ACTIVE BREACH PUZZLE WITH DATA STREAM OVERLAY */
              <div className="relative z-10 w-full max-w-xl p-4 sm:p-5 rounded-2xl bg-black/80 border border-cyan-500/40 backdrop-blur-md shadow-[0_0_35px_rgba(34,211,238,0.2)] space-y-4">
                
                {/* Live Data Stream Telemetry Header */}
                <div className="flex flex-wrap items-center justify-between text-xs border-b border-white/10 pb-2.5 gap-2">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="text-cyan-400 font-bold tracking-wider">
                      BRUTE-FORCE DATA STREAM: <span className="text-white font-mono-tech">{tierConfig.packetRate}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400">
                      TOLERANCE: <strong className={attemptsLeft === 1 ? 'text-rose-400' : 'text-cyan-300'}>{attemptsLeft}/{tierConfig.maxAttempts}</strong>
                    </span>
                    <span className={`font-mono-tech font-bold text-xs ${timeLeft <= 5 ? 'text-rose-400 animate-ping' : 'text-amber-400'}`}>
                      TIMEOUT: {timeLeft}s
                    </span>
                  </div>
                </div>

                {authError && (
                  <div className="text-xs text-rose-400 font-bold animate-pulse bg-rose-950/60 p-2 rounded-lg border border-rose-500/40">
                    <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                    {authError}
                  </div>
                )}

                {/* Target Code Sequence with Decryption Animation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    <span>MATCH TARGET CIPHER SEQUENCE</span>
                    <span className="text-cyan-400/80 font-mono-tech">
                      PROGRESS: {enteredCode.length} / {targetCode.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    {targetCode.map((code, idx) => {
                      const isMatched = enteredCode[idx] === code;
                      const isCurrentlyDecrypting = decryptingIndex === idx;
                      const displayCode = glitchCharacters[idx] || (isMatched ? code : (isCurrentlyDecrypting ? '??' : code));

                      return (
                        <div
                          key={idx}
                          className={`min-w-[58px] sm:min-w-[68px] h-12 rounded-xl border flex flex-col items-center justify-center font-mono-tech font-extrabold text-sm transition-all relative overflow-hidden ${
                            isMatched
                              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-105'
                              : isCurrentlyDecrypting
                              ? 'bg-cyan-950/90 border-cyan-300 text-white animate-pulse'
                              : idx === enteredCode.length
                              ? 'bg-cyan-950/40 border-cyan-400/70 text-cyan-200 ring-2 ring-cyan-400/30'
                              : 'bg-black/80 border-white/10 text-slate-400'
                          }`}
                        >
                          {/* Animated Decryption Scan Sweep */}
                          {isMatched && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                          )}
                          <span className="text-[8px] text-slate-500">NODE 0{idx + 1}</span>
                          <span className="tracking-wider">{displayCode}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Key Selection Grid with Keyboard Hints */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    <span>SELECT FREQUENCY CHUNKS IN ORDER</span>
                    <span className="text-slate-500 hidden sm:inline">[PRESS KEYS 1-{availableCodes.length}]</span>
                  </div>

                  <div className={`grid gap-2 pt-1 ${availableCodes.length > 6 ? 'grid-cols-4 sm:grid-cols-4' : 'grid-cols-3'}`}>
                    {availableCodes.map((code, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCodeClick(code)}
                        className="p-2.5 sm:p-3 rounded-xl bg-[#090e1a] hover:bg-[#121c33] active:scale-95 border border-white/10 hover:border-cyan-400/60 text-white font-mono-tech font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 group"
                      >
                        <ClayKey keyLabel={String(idx + 1)} size="sm" />
                        <span className="text-cyan-300 group-hover:text-cyan-100 font-extrabold">{code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tactical Rollback (Undo Move) Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleUndoStep}
                    disabled={enteredCode.length === 0}
                    className={`px-3 py-2 rounded-xl border text-xs font-mono-tech font-bold flex items-center gap-2 transition-all ${
                      enteredCode.length > 0
                        ? 'bg-amber-950/70 hover:bg-amber-900/80 border-amber-500/50 text-amber-300 hover:text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer active:scale-95'
                        : 'bg-black/40 border-white/5 text-slate-600 opacity-40 cursor-not-allowed'
                    }`}
                    title={`Undo last entered cipher node (-${tierConfig.undoPenaltySeconds}s penalty)`}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>ROLLBACK CHUNK</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-amber-500/40 text-amber-300 font-extrabold">
                      -{tierConfig.undoPenaltySeconds}s
                    </span>
                    <span className="hidden sm:inline text-[9px] text-slate-400 font-normal">[BACKSPACE]</span>
                  </button>

                  {undoPenaltyNotice ? (
                    <div className="text-[11px] text-amber-300 font-bold font-mono-tech animate-pulse flex items-center gap-1.5 bg-amber-950/90 px-3 py-1.5 rounded-lg border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>{undoPenaltyNotice}</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 font-mono-tech flex items-center gap-1">
                      <span>ROLLBACK COST:</span>
                      <strong className="text-amber-400">-{tierConfig.undoPenaltySeconds}s / NODE</strong>
                    </div>
                  )}
                </div>

                {/* Telemetry Stream Footer */}
                <div className="text-[10px] text-slate-500 pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-cyan-400 animate-spin" />
                    <span>BUFFER: {enteredCode.join(' - ') || 'AWAITING KEYSTROKE'}</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playUiClick();
                      setAuthStage('LOCKED');
                    }}
                    className="text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    ABORT INJECTION
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* AUTHORIZED SYSTEM CONTROL INTERFACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* SUB-SYSTEM NAVIGATION TABS */}
            <div className="w-full md:w-56 bg-black/60 border-b md:border-b-0 md:border-r border-white/10 p-3 sm:p-4 flex md:flex-col gap-2 overflow-x-auto">
              <button
                onClick={() => {
                  sound.playUiClick();
                  setActiveTab('CAMERAS');
                }}
                className={`flex-1 md:flex-none p-2.5 sm:p-3 rounded-xl border font-mono-tech text-xs flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'CAMERAS'
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                    : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">CAMERAS ({cameras.length})</span>
              </button>

              <button
                onClick={() => {
                  sound.playUiClick();
                  setActiveTab('LASERS');
                }}
                className={`flex-1 md:flex-none p-2.5 sm:p-3 rounded-xl border font-mono-tech text-xs flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'LASERS'
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                    : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">LASER GRIDS ({lasers.length})</span>
              </button>

              <button
                onClick={() => {
                  sound.playUiClick();
                  setActiveTab('DOORS');
                }}
                className={`flex-1 md:flex-none p-2.5 sm:p-3 rounded-xl border font-mono-tech text-xs flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'DOORS'
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                    : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">ACCESS CONTROL</span>
              </button>

              <button
                onClick={() => {
                  sound.playUiClick();
                  setActiveTab('ALARMS');
                }}
                className={`flex-1 md:flex-none p-2.5 sm:p-3 rounded-xl border font-mono-tech text-xs flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'ALARMS'
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                    : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Bell className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">ALARM GRID</span>
              </button>

              <div className="hidden md:block pt-4 mt-auto border-t border-white/10 text-[9px] text-slate-500 space-y-1">
                <div className="text-cyan-400 font-bold">SYNDICATE MAINFRAME</div>
                <div>ROOT PERMISSIONS: GRANTED</div>
                <div>OVERRIDE PROTOCOL: ACTIVE</div>
              </div>
            </div>

            {/* TAB CONTENT VIEWPORT */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              
              {/* TAB 1: CAMERAS */}
              {activeTab === 'CAMERAS' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-display font-bold text-white">
                        SURVEILLANCE CAMERA NETWORK
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Disabling or looping feeds removes optical detection arcs in real-time.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sound.playConfirm();
                          onLoopAllCameras();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-[10px] font-bold cursor-pointer transition-all"
                      >
                        LOOP ALL FEEDS
                      </button>
                      <button
                        onClick={() => {
                          sound.playConfirm();
                          onDisableAllCameras();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold cursor-pointer transition-all"
                      >
                        DISABLE ALL FEEDS
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cameras.map((cam) => (
                      <div
                        key={cam.id}
                        className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              cam.isPowerOff ? 'bg-slate-600' :
                              cam.isLooping ? 'bg-amber-400 animate-pulse' :
                              'bg-cyan-400 animate-ping'
                            }`} />
                            <span className="text-xs font-bold text-white font-mono-tech">
                              {cam.id.toUpperCase()}
                            </span>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            cam.isPowerOff
                              ? 'bg-slate-900 text-slate-400 border border-slate-700'
                              : cam.isLooping
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                              : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                          }`}>
                            {cam.isPowerOff ? 'OFFLINE' : cam.isLooping ? 'LOOPED' : 'ONLINE // SCANNING'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                          <button
                            onClick={() => {
                              sound.playUiClick();
                              onToggleCameraLoop(cam.id);
                            }}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              cam.isLooping
                                ? 'bg-amber-900/60 border-amber-400 text-amber-300'
                                : 'bg-black/60 border-white/10 hover:border-white/30 text-slate-300'
                            }`}
                          >
                            {cam.isLooping ? 'DISENGAGE LOOP' : 'LOOP VIDEO FEED'}
                          </button>

                          <button
                            onClick={() => {
                              sound.playUiClick();
                              onToggleCameraPower(cam.id);
                            }}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              cam.isPowerOff
                                ? 'bg-rose-900/60 border-rose-400 text-rose-300'
                                : 'bg-black/60 border-white/10 hover:border-white/30 text-slate-300'
                            }`}
                          >
                            {cam.isPowerOff ? 'RESTORE POWER' : 'CUT CAMERA POWER'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: LASERS */}
              {activeTab === 'LASERS' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-display font-bold text-white">
                        INFRARED LASER TRIPWIRE GRIDS
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Deactivating laser barriers allows safe passage through secured perimeters.
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sound.playConfirm();
                        onDeactivateAllLasers();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold cursor-pointer transition-all"
                    >
                      DEACTIVATE ALL LASERS
                    </button>
                  </div>

                  <div className="space-y-3">
                    {lasers.map(laser => (
                      <div
                        key={laser.id}
                        className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              laser.isActive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'
                            }`} />
                            <span className="text-xs font-bold text-white">
                              {laser.id.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {laser.isActive
                              ? 'ENERGIZED // TRIPWIRE SIREN HAZARD'
                              : 'POWER DISENGAGED // SAFE PASSAGE'}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            sound.playUiClick();
                            onToggleLaser(laser.id);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            laser.isActive
                              ? 'bg-rose-950/80 border-rose-500/50 hover:bg-rose-900/80 text-rose-300'
                              : 'bg-emerald-950/80 border-emerald-500/50 hover:bg-emerald-900/80 text-emerald-300'
                          }`}
                        >
                          {laser.isActive ? 'DISABLE BARRIER' : 'RE-ARM BARRIER'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DOORS / ACCESS CONTROL */}
              {activeTab === 'DOORS' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-display font-bold text-white">
                        FACILITY ACCESS CONTROL GATES
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Disengage magnetic locks on restricted sector doors and outer vault bulkheads.
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sound.playHydraulicDoor();
                        onUnlockAllVaultDoors();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold cursor-pointer transition-all"
                    >
                      OPEN ALL VAULT GATES
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'door-vault-outer', label: 'OUTER VAULT SECURITY GATE', desc: 'Depository anteroom barrier' },
                      { id: 'door-vault-blast', label: 'DIAMOND VAULT BLAST DOOR', desc: 'Subterranean core chamber' },
                      { id: 'door-lobby-security', label: 'SECURITY CORRIDOR GATE', desc: 'Casino lobby to hub connector' },
                      { id: 'door-sec-hub', label: 'SECURITY HUB ACCESS DOOR', desc: 'Command center bulkhead' },
                      { id: 'door-garage-exit', label: 'PARKING TRANSIT ROLL-UP', desc: 'Ground-level vehicular getaway' },
                      { id: 'door-vip-rooftop', label: 'VIP ROOFTOP HELI-STAIRS', desc: 'Sky-crane helipad staircase' }
                    ].map(item => {
                      const status = getDoorStatus(item.id);
                      const isOpen = status === 'OPEN';
                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              {isOpen ? (
                                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                              )}
                              <span className="text-xs font-bold text-white truncate max-w-[150px]">
                                {item.label}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-400 block mt-0.5">
                              {item.desc}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              sound.playHydraulicDoor();
                              onUnlockDoor(item.id);
                            }}
                            disabled={isOpen}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              isOpen
                                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300 opacity-60 cursor-default'
                                : 'bg-black/60 hover:bg-cyan-950/60 border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-300'
                            }`}
                          >
                            {isOpen ? 'UNLOCKED' : 'DISENGAGE LOCK'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: ALARMS & TAMPER SENSORS */}
              {activeTab === 'ALARMS' && (
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <h4 className="text-sm font-display font-bold text-white">
                      CENTRAL ALARM & SENSOR CONTROLS
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Suppress vault tamper alarms to maintain perfect Ghost stealth protocol.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Vault Tamper Sensor Suppression */}
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            VAULT TAMPER SENSOR OVERRIDE
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Prevents siren trigger when cracking the Diamond Vault.
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-300 bg-black/40 p-2.5 rounded border border-white/5">
                        STATUS:{' '}
                        <strong className={surveillanceOverridden ? 'text-emerald-400' : 'text-amber-400'}>
                          {surveillanceOverridden
                            ? 'TAMPER SENSORS SUPPRESSED (GHOST READY)'
                            : 'ARMED // VAULT CRACK WILL TRIP SIREN'}
                        </strong>
                      </div>

                      <button
                        onClick={() => {
                          sound.playConfirm();
                          onSuppressTamperSensors();
                        }}
                        disabled={surveillanceOverridden}
                        className={`w-full py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          surveillanceOverridden
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 opacity-60 cursor-default'
                            : 'bg-emerald-900/60 hover:bg-emerald-800/60 border-emerald-400 text-emerald-200'
                        }`}
                      >
                        {surveillanceOverridden ? '✓ OVERRIDE ACTIVE' : 'ENGAGE TAMPER SUPPRESSION'}
                      </button>
                    </div>

                    {/* Emergency Alarm Disengagement */}
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2">
                        <BellOff className="w-5 h-5 text-rose-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            EMERGENCY SIREN DISENGAGEMENT
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Silence active alarms and return facility guards to search patrol.
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-300 bg-black/40 p-2.5 rounded border border-white/5">
                        ALARM GRID:{' '}
                        <strong className={alarmsActive ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}>
                          {alarmsActive ? 'LOCKDOWN SIRENS BLARING' : 'STANDBY // NORMAL'}
                        </strong>
                      </div>

                      <button
                        onClick={() => {
                          sound.playConfirm();
                          onSilenceAlarm();
                        }}
                        disabled={!alarmsActive}
                        className={`w-full py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          alarmsActive
                            ? 'bg-rose-900/80 hover:bg-rose-800/80 border-rose-400 text-rose-200 animate-pulse'
                            : 'bg-black/60 border-white/10 text-slate-500 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {alarmsActive ? 'SILENCE SIRENS & CLEAR LOCKDOWN' : 'ALARMS INACTIVE'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="bg-[#050811]/90 border-t border-white/10 px-4 py-2.5 flex items-center justify-between text-[10px] text-slate-500">
          <span>AIR-GAP HARDWARE CONNECTION ACTIVE // PROTOCOL {tierConfig.tierLabel}</span>
          <button
            onClick={() => {
              sound.playUiClick();
              onClose();
            }}
            className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
          >
            DISENGAGE TERMINAL [ESC]
          </button>
        </div>

      </div>
    </div>
  );
};
