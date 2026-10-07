import React, { useState, useEffect } from 'react';
import { Terminal, HackType } from '../../types/game';
import { sound } from '../../game/audio';
import { Zap, ShieldAlert, Cpu, CheckCircle2, RotateCw, X, Shield, Lock, Unlock } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';
import { ClayKey } from '../common/ClayKey';

interface HackModalProps {
  terminal: Terminal;
  onSuccess: () => void;
  onClose: () => void;
}

export const HackModal: React.FC<HackModalProps> = ({ terminal, onSuccess, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hackFailed, setHackFailed] = useState(false);
  const [hackStage, setHackStage] = useState<'LOCK' | 'BYPASS' | 'ACCESS' | 'SYSTEM CONTROL'>('LOCK');

  // Mini-game 1: Signal Alignment (3x3 grid)
  const [signalGrid, setSignalGrid] = useState<number[]>([
    90, 180, 0,
    270, 90, 180,
    0, 270, 0
  ]);

  // Mini-game 2: Code Sequence (Hex matrix match)
  const hexValues = ['7A', '55', 'BD', '1C', 'E9', 'FF'];
  const [codeTarget, setCodeTarget] = useState<string[]>(['55', 'BD', '1C']);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [codeMatrix, setCodeMatrix] = useState<string[][]>([]);

  // Mini-game 3: Network Infiltration (node graph)
  const [networkNodes, setNetworkNodes] = useState<{ id: number; name: string; isHacked: boolean; isCore?: boolean }[]>([
    { id: 0, name: 'FIREWALL GATEWAY', isHacked: true },
    { id: 1, name: 'PROXY CLUSTER A', isHacked: false },
    { id: 2, name: 'DAEMON ROUTER', isHacked: false },
    { id: 3, name: 'SECURITY BUS', isHacked: false },
    { id: 4, name: 'ROOT KERNEL CORE', isHacked: false, isCore: true }
  ]);
  const [currentNodeId, setCurrentNodeId] = useState(0);

  // Mini-game 4: Power Override (Sliders frequency balance)
  const [overrideFreqs, setOverrideFreqs] = useState<number[]>([35, 75, 20]);

  // Initialize Code Matrix
  useEffect(() => {
    if (terminal.type === 'CODE') {
      const matrix: string[][] = [];
      for (let r = 0; r < 4; r++) {
        const row: string[] = [];
        for (let c = 0; c < 4; c++) {
          row.push(hexValues[Math.floor(Math.random() * hexValues.length)]);
        }
        matrix.push(row);
      }
      setCodeMatrix(matrix);
      const rand1 = hexValues[Math.floor(Math.random() * hexValues.length)];
      const rand2 = hexValues[Math.floor(Math.random() * hexValues.length)];
      const rand3 = hexValues[Math.floor(Math.random() * hexValues.length)];
      setCodeTarget([rand1, rand2, rand3]);
    }
  }, [terminal.type]);

  // Timer countdown
  useEffect(() => {
    if (isCompleted || hackFailed) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setHackFailed(true);
          sound.playSuspicionAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted, hackFailed]);

  // Handle Signal Alignment rotation
  const rotateNode = (idx: number) => {
    if (isCompleted || hackFailed) return;
    sound.playHackRotate();
    const updated = [...signalGrid];
    updated[idx] = (updated[idx] + 90) % 360;
    setSignalGrid(updated);

    const isAligned = updated.every((rot, i) => {
      return (rot % 180 === 0 && (i % 2 === 0)) || (rot % 90 === 0 && (i % 2 === 1 && rot === 90));
    });

    if (isAligned || updated.filter(r => r === 0).length >= 5) {
      triggerSuccess();
    } else {
      setHackStage('BYPASS');
    }
  };

  // Handle Code Sequence click
  const handleHexClick = (val: string) => {
    if (isCompleted || hackFailed) return;
    sound.playUiClick();
    const nextSeq = [...currentSequence, val];
    setCurrentSequence(nextSeq);

    const matchesPrefix = nextSeq.every((v, i) => v === codeTarget[i]);
    if (!matchesPrefix) {
      sound.playSuspicionAlert();
      setTimeout(() => setCurrentSequence([]), 250);
      return;
    }

    if (nextSeq.length === 1) setHackStage('BYPASS');
    if (nextSeq.length === 2) setHackStage('ACCESS');

    if (nextSeq.length === codeTarget.length) {
      triggerSuccess();
    }
  };

  // Handle Network Node transition
  const handleNodeClick = (id: number) => {
    if (isCompleted || hackFailed) return;
    if (id === currentNodeId + 1) {
      sound.playConfirm();
      setCurrentNodeId(id);
      setNetworkNodes(prev => prev.map(n => n.id === id ? { ...n, isHacked: true } : n));
      
      if (id === 1) setHackStage('BYPASS');
      if (id === 2 || id === 3) setHackStage('ACCESS');
      if (id === networkNodes.length - 1) {
        triggerSuccess();
      }
    } else {
      sound.playUiHover();
    }
  };

  // Handle Power Override slider
  const handleFreqChange = (idx: number, val: number) => {
    if (isCompleted || hackFailed) return;
    const updated = [...overrideFreqs];
    updated[idx] = val;
    setOverrideFreqs(updated);

    const allClose = updated.every(v => Math.abs(v - 50) <= 6);
    if (allClose) {
      triggerSuccess();
    } else {
      setHackStage('BYPASS');
    }
  };

  const triggerSuccess = () => {
    setIsCompleted(true);
    setHackStage('SYSTEM CONTROL');
    sound.playHackSuccess();
    setTimeout(() => {
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 select-none font-mono-tech">
      {/* Layer 1: Transparent Smoked Glass Terminal */}
      <div className="relative w-full max-w-2xl brutal-frame glass-primary rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden terminal-glass surface-imperfections animate-in fade-in zoom-in-95 duration-200">
        
        {/* Layer 2: Brutalist Header Block */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#141d2e] border border-cyan-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="brutal-stamp text-[9px] text-cyan-400 border-cyan-500/30">
                  BREACH // {terminal.type}
                </span>
                <span className="text-xs text-slate-400">{terminal.name}</span>
              </div>
              <h3 className="text-base font-display font-extrabold text-white tracking-wide mt-0.5">
                ICE INFILTRATION TERMINAL
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 block">TRACE LOCK</span>
              <span className={`text-lg font-display font-black ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
              </span>
            </div>

            <button
              onClick={() => {
                sound.playUiClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-black/50 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Layer 3: Progressive Breach Status Bar */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[10px] tracking-widest uppercase">STAGE PROGRESSION:</span>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className={hackStage === 'LOCK' ? 'text-amber-400 font-extrabold' : 'text-slate-500'}>
              [ LOCK ]
            </span>
            <span className="text-slate-600">→</span>
            <span className={hackStage === 'BYPASS' ? 'text-cyan-400 font-extrabold' : 'text-slate-500'}>
              [ BYPASS ]
            </span>
            <span className="text-slate-600">→</span>
            <span className={hackStage === 'ACCESS' ? 'text-purple-400 font-extrabold' : 'text-slate-500'}>
              [ ACCESS ]
            </span>
            <span className="text-slate-600">→</span>
            <span className={hackStage === 'SYSTEM CONTROL' ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-slate-500'}>
              [ SYSTEM CONTROL ]
            </span>
          </div>
        </div>

        {/* Terminal Body with Clay Interactive Controls */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {terminal.description}
          </p>

          {/* Mini-game 1: SIGNAL ALIGNMENT */}
          {terminal.type === 'SIGNAL' && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-cyan-300 font-bold mb-4 flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5" /> ROTATE PHYSICAL NODES TO HARMONIZE WAVEGUIDES
              </span>
              <div className="grid grid-cols-3 gap-3.5 p-5 bg-black/60 border border-white/10 rounded-2xl">
                {signalGrid.map((rot, idx) => (
                  <button
                    key={idx}
                    onClick={() => rotateNode(idx)}
                    className="w-18 h-18 rounded-xl border border-white/10 hover:border-cyan-400 bg-gradient-to-b from-[#182337] to-[#0f1725] flex items-center justify-center relative transition-transform duration-200 active:scale-95 shadow-md group cursor-pointer"
                    style={{ transform: `rotate(${rot}deg)` }}
                  >
                    <div className="w-11 h-1.5 bg-cyan-400/80 rounded group-hover:bg-cyan-300 group-hover:shadow-[0_0_10px_#22d3ee]" />
                    <div className="w-3 h-3 rounded-full bg-cyan-200 absolute shadow-[0_0_6px_#22d3ee]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mini-game 2: CODE SEQUENCE */}
          {terminal.type === 'CODE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-black/60 border border-white/10 rounded-xl">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                  TARGET CYPHER:
                </span>
                <div className="flex gap-2">
                  {codeTarget.map((targetHex, idx) => {
                    const isMatched = currentSequence[idx] === targetHex;
                    return (
                      <span
                        key={idx}
                        className={`px-3.5 py-1 rounded-lg text-sm font-bold ${
                          isMatched 
                            ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' 
                            : 'bg-black/50 text-slate-400 border border-white/10'
                        }`}
                      >
                        {targetHex}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Hex Clay Matrix Buttons */}
              <div className="grid grid-cols-4 gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl">
                {codeMatrix.map((row, rIdx) =>
                  row.map((hex, cIdx) => (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => handleHexClick(hex)}
                      className="py-3 px-4 font-mono-tech text-sm font-bold text-slate-200 bg-gradient-to-b from-[#182236] to-[#0f1725] hover:from-[#202d46] hover:to-[#141e30] border border-white/10 hover:border-cyan-400 rounded-xl active:translate-y-0.5 shadow-md transition-all cursor-pointer"
                    >
                      {hex}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Mini-game 3: NETWORK INFILTRATION */}
          {terminal.type === 'NETWORK' && (
            <div className="space-y-3">
              <span className="text-xs text-cyan-300 font-bold block mb-1">
                BREACH SEQUENTIAL FIREWALL GATEWAYS
              </span>
              <div className="flex flex-col gap-2.5">
                {networkNodes.map((node, i) => {
                  const isCurrent = node.id === currentNodeId;
                  const isNext = node.id === currentNodeId + 1;
                  return (
                    <div
                      key={node.id}
                      onClick={() => handleNodeClick(node.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        node.isHacked
                          ? 'bg-[#121c2e] border-cyan-500/40 text-cyan-300 shadow-sm cursor-default'
                          : isNext
                          ? 'bg-black/80 hover:bg-[#18243a] border-cyan-400 text-white animate-pulse cursor-pointer'
                          : 'bg-black/40 border-white/5 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400">0{i + 1}</span>
                        <span className="text-sm font-bold tracking-wide">{node.name}</span>
                      </div>
                      <span className="text-xs font-bold">
                        {node.isHacked ? 'OVERRIDDEN' : isNext ? 'PRESS TO BREACH' : 'LOCKED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mini-game 4: SECURITY OVERRIDE SLIDERS */}
          {terminal.type === 'OVERRIDE' && (
            <div className="space-y-5 p-4 rounded-xl bg-black/50 border border-white/10">
              <span className="text-xs text-slate-300 font-bold block">
                TUNE RESONANCE SLIDERS TO 50% HARMONIC EQUILIBRIUM
              </span>
              {overrideFreqs.map((freq, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>OSCILLATOR BUS 0{idx + 1}</span>
                    <span className={Math.abs(freq - 50) <= 6 ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                      {freq}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={freq}
                    onChange={(e) => handleFreqChange(idx, Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Status Progression Banners */}
          {isCompleted && (
            <div className="p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-xl flex items-center justify-center gap-2.5 text-emerald-300 text-xs tracking-wider animate-pulse font-bold">
              <CheckCircle2 className="w-4 h-4" /> INFILTRATION COMPLETE · SYSTEM CONTROL GRANTED
            </div>
          )}

          {hackFailed && (
            <div className="p-4 bg-rose-950/70 border border-rose-500/50 rounded-xl flex items-center justify-center gap-2.5 text-rose-300 text-xs tracking-wider animate-pulse font-bold">
              <ShieldAlert className="w-4 h-4" /> TRACE COMPLETE · COUNTERMEASURES ACTIVATED
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
