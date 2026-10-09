import React, { useState, useEffect } from 'react';
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
  EyeOff
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

  // Hacking Authorization Sequence State
  const [authStage, setAuthStage] = useState<'LOCKED' | 'BREACHING' | 'GRANTED'>(
    isAuthorized ? 'GRANTED' : 'LOCKED'
  );
  const [timeLeft, setTimeLeft] = useState(25);
  const [authError, setAuthError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  // Puzzle: Code Cipher Matching
  const hexCodes = ['7A', 'BD', '1C', '55', 'E9', '3F'];
  const [targetCode, setTargetCode] = useState<string[]>(['BD', '1C', 'E9']);
  const [enteredCode, setEnteredCode] = useState<string[]>([]);
  const [availableCodes, setAvailableCodes] = useState<string[]>([]);

  // Initialize Puzzle
  useEffect(() => {
    if (!isAuthorized) {
      // Pick 3 target codes
      const shuffled = [...hexCodes].sort(() => Math.random() - 0.5);
      const targets = shuffled.slice(0, 3);
      setTargetCode(targets);
      // Available buttons with distractors
      setAvailableCodes([...shuffled]);
      setEnteredCode([]);
      setTimeLeft(25);
      setAttemptsLeft(3);
      setAuthError(null);
    }
  }, [isAuthorized]);

  // Timer for authorization sequence
  useEffect(() => {
    if (authStage !== 'BREACHING' || isAuthorized) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAuthFailure('FIREWALL TIMEOUT: INTRUSION ATTEMPT DETECTED — GUARDS ALERTED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [authStage, isAuthorized]);

  // Keyboard shortcut listener for Escape to close and number keys 1-6 for puzzle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        sound.playUiClick();
        onClose();
        return;
      }

      // Quick number key access for puzzle cipher buttons (1 - 6)
      if (authStage === 'BREACHING' && !isAuthorized) {
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
  }, [onClose, authStage, isAuthorized, availableCodes, enteredCode, targetCode]);

  const handleCodeClick = (code: string) => {
    sound.playUiClick();
    if (enteredCode.length >= targetCode.length) return;

    const next = [...enteredCode, code];
    setEnteredCode(next);

    // Check if next character is correct
    const expected = targetCode[next.length - 1];
    if (code !== expected) {
      sound.playSuspicionAlert();
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      if (remaining <= 0) {
        handleAuthFailure('FIREWALL LOCKOUT: 3 MISMATCHES DETECTED — SYSTEM BREACH TRIGGERED');
      } else {
        setAuthError(`CIPHER MISMATCH — ${remaining} ATTEMPT${remaining > 1 ? 'S' : ''} REMAINING`);
        setTimeout(() => {
          setEnteredCode([]);
          setAuthError(null);
        }, 700);
      }
      return;
    }

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
    setAttemptsLeft(3);
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
                  SECTOR 06 // SECURITY HUB
                </span>
                <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  isAuthorized || authStage === 'GRANTED'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                }`}>
                  {isAuthorized || authStage === 'GRANTED' ? 'AUTH: GRANTED' : 'AUTH: RESTRICTED'}
                </span>
              </div>
              <h2 className="text-xs sm:text-base font-display font-extrabold text-white tracking-wide mt-0.5 truncate">
                CENTRAL SECURITY COMMAND CONSOLE
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
          </div>
        </div>

        {/* MAIN BODY: HACKING AUTHORIZATION OR REAL CONTROLS */}
        {!isAuthorized && authStage !== 'GRANTED' ? (
          /* HACKING AUTHORIZATION GATEWAY */
          <div className="flex-1 p-4 sm:p-8 flex flex-col justify-center items-center text-center space-y-6 overflow-y-auto">
            <div className="max-w-md space-y-3">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 mb-1">
                <ShieldAlert className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-extrabold text-white">
                SECURITY OVERRIDE AUTHORIZATION REQUIRED
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono-tech">
                The Security Hub controls casino surveillance cameras, vault laser tripwires, restricted door magnetic seals, and the master alarm grid. You must breach the syndicate firewall cipher to authorize overrides.
              </p>
            </div>

            {authStage === 'LOCKED' ? (
              <div className="space-y-4">
                {authError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold animate-pulse">
                    <AlertTriangle className="w-4 h-4 inline mr-2 text-rose-400" />
                    {authError}
                  </div>
                )}
                <TactileButton
                  variant="clay-primary"
                  size="lg"
                  onClick={() => {
                    sound.playUiClick();
                    setAuthStage('BREACHING');
                    setTimeLeft(25);
                    setEnteredCode([]);
                    setAuthError(null);
                  }}
                  className="px-6 py-3"
                >
                  INITIALIZE FIREWALL BREACH
                </TactileButton>
              </div>
            ) : (
              /* ACTIVE BREACH PUZZLE */
              <div className="w-full max-w-lg p-5 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-5">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>CIPHER FREQUENCY DECODER</span>
                  </span>
                  <span className={`font-mono-tech font-bold ${timeLeft <= 5 ? 'text-rose-400 animate-ping' : 'text-amber-400'}`}>
                    TIME REMAINING: {timeLeft}s
                  </span>
                </div>

                {authError && (
                  <div className="text-xs text-rose-400 font-bold animate-pulse">
                    {authError}
                  </div>
                )}

                {/* Target Code Sequence */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                    MATCH TARGET SIGNATURE SEQUENCE
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    {targetCode.map((code, idx) => {
                      const isMatched = enteredCode[idx] === code;
                      return (
                        <div
                          key={idx}
                          className={`w-16 h-12 rounded-xl border flex flex-col items-center justify-center font-mono-tech font-extrabold text-sm transition-all ${
                            isMatched
                              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                              : 'bg-black/80 border-cyan-500/30 text-cyan-300'
                          }`}
                        >
                          <span className="text-[8px] text-slate-500">NODE 0{idx + 1}</span>
                          <span>{code}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Key Selection Grid */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                    SELECT FREQUENCY CHUNKS IN SEQUENCE
                  </span>
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    {availableCodes.map((code, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCodeClick(code)}
                        className="p-3 rounded-xl bg-[#090e1a] hover:bg-[#121c33] active:scale-95 border border-white/10 hover:border-cyan-400/50 text-white font-mono-tech font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ClayKey keyLabel={String(idx + 1)} size="sm" />
                        <span className="text-cyan-300">{code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span>INPUT: {enteredCode.join(' - ') || 'AWAITING KEYSTROKE'}</span>
                  <button
                    onClick={() => {
                      sound.playUiClick();
                      setAuthStage('LOCKED');
                    }}
                    className="text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    ABORT BREACH
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
                <div>CIRCUIT: OVERRIDE BUS</div>
                <div>ENCRYPTION: BYPASSED</div>
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
                    {cameras.map((cam, idx) => (
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
                        Deactivating laser barriers allows safe passage into the Diamond Vault corridor.
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
          <span>AIR-GAP HARDWARE CONNECTION ACTIVE</span>
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
