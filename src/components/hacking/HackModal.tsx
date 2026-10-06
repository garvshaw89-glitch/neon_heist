import React, { useState, useEffect, useRef } from 'react';
import { Terminal, HackType } from '../../types/game';
import { sound } from '../../game/audio';
import { Zap, ShieldAlert, Cpu, CheckCircle2, RotateCw } from 'lucide-react';

interface HackModalProps {
  terminal: Terminal;
  onSuccess: () => void;
  onClose: () => void;
}

export const HackModal: React.FC<HackModalProps> = ({ terminal, onSuccess, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hackFailed, setHackFailed] = useState(false);

  // Mini-game 1: Signal Alignment (3x3 grid of pipe nodes with rotations 0, 90, 180, 270)
  // Each node has connections: [top, right, bottom, left]
  // Target: create connected path from (0,0) [in from left] to (2,2) [out to right]
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
  const targetFreqs = [50, 50, 50];

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
      // Ensure target appears in matrix
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

    // Simple solve check: check if all are oriented to 0 or 180 degrees (in phase)
    const isAligned = updated.every((rot, i) => {
      // predefined solved states
      return (rot % 180 === 0 && (i % 2 === 0)) || (rot % 90 === 0 && (i % 2 === 1 && rot === 90));
    });

    if (isAligned || updated.filter(r => r === 0).length >= 5) {
      triggerSuccess();
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
      // Mismatch reset
      sound.playSuspicionAlert();
      setTimeout(() => setCurrentSequence([]), 250);
      return;
    }

    if (nextSeq.length === codeTarget.length) {
      triggerSuccess();
    }
  };

  // Handle Network Node transition
  const handleNodeClick = (id: number) => {
    if (isCompleted || hackFailed) return;
    // Allow stepping to next adjacent node
    if (id === currentNodeId + 1) {
      sound.playConfirm();
      setCurrentNodeId(id);
      setNetworkNodes(prev => prev.map(n => n.id === id ? { ...n, isHacked: true } : n));
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

    const allClose = updated.every((v, i) => Math.abs(v - targetFreqs[i]) <= 6);
    if (allClose) {
      triggerSuccess();
    }
  };

  const triggerSuccess = () => {
    setIsCompleted(true);
    sound.playHackSuccess();
    setTimeout(() => {
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/30 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden terminal-glass surface-imperfections">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <div className="text-xs font-mono-tech text-cyan-400 tracking-wider">
                ICE INFILTRATION PROTOCOL · {terminal.type}
              </div>
              <h3 className="text-base font-display font-semibold text-white tracking-wide">
                {terminal.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono-tech text-slate-400 block">Trace Lock</span>
              <span className={`text-base font-mono-tech font-bold ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}`}>
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs font-mono-tech text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded transition-colors"
            >
              ABORT [ESC]
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6">
          <p className="text-xs text-slate-400 mb-6 font-mono-tech">
            {terminal.description}
          </p>

          {/* Mini-game 1: SIGNAL ALIGNMENT */}
          {terminal.type === 'SIGNAL' && (
            <div className="flex flex-col items-center">
              <div className="text-xs text-cyan-400/80 mb-3 font-mono-tech flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5" /> CLICK NODES TO ALIGN OPTIC WAVEGUIDES
              </div>
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
                {signalGrid.map((rot, idx) => (
                  <button
                    key={idx}
                    onClick={() => rotateNode(idx)}
                    className="w-16 h-16 rounded border border-cyan-500/20 hover:border-cyan-400/80 bg-slate-900/90 flex items-center justify-center relative transition-transform duration-200 active:scale-95 group"
                    style={{ transform: `rotate(${rot}deg)` }}
                  >
                    <div className="w-10 h-1 bg-cyan-400/80 rounded group-hover:bg-cyan-300 group-hover:shadow-[0_0_10px_#22d3ee]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-200 absolute shadow-[0_0_6px_#22d3ee]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mini-game 2: CODE SEQUENCE */}
          {terminal.type === 'CODE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                <span className="text-xs font-mono-tech text-slate-400">TARGET SEQUENCE:</span>
                <div className="flex gap-2">
                  {codeTarget.map((targetHex, idx) => {
                    const isMatched = currentSequence[idx] === targetHex;
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded text-sm font-mono-tech font-bold ${
                          isMatched 
                            ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' 
                            : 'bg-slate-900 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {targetHex}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5 p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
                {codeMatrix.map((row, rIdx) =>
                  row.map((hex, cIdx) => (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => handleHexClick(hex)}
                      className="py-3 px-4 font-mono-tech text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 rounded transition-colors"
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
            <div className="space-y-4">
              <div className="text-xs font-mono-tech text-cyan-400/90 mb-2">
                TRACE ROUTE · INFILTRATE TO ROOT KERNEL CORE
              </div>
              <div className="flex flex-col gap-3">
                {networkNodes.map((node, i) => {
                  const isCurrent = node.id === currentNodeId;
                  const isNext = node.id === currentNodeId + 1;
                  return (
                    <div
                      key={node.id}
                      onClick={() => handleNodeClick(node.id)}
                      className={`flex items-center justify-between p-3.5 rounded-lg border font-mono-tech cursor-pointer transition-all ${
                        node.isHacked
                          ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                          : isNext
                          ? 'bg-slate-900 hover:bg-cyan-950/60 border-cyan-500/50 text-white animate-pulse'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400">0{i + 1}</span>
                        <span className="text-sm tracking-wider">{node.name}</span>
                      </div>
                      <span className="text-xs">
                        {node.isHacked ? 'OVERRIDDEN' : isNext ? 'READY TO BREACH' : 'LOCKED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mini-game 4: SECURITY OVERRIDE */}
          {terminal.type === 'OVERRIDE' && (
            <div className="space-y-6">
              <div className="text-xs font-mono-tech text-slate-400 mb-2">
                TUNE OSCILLATOR BARS TO HARMONIC RESONANCE (TARGET 50%)
              </div>
              {overrideFreqs.map((freq, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-mono-tech text-slate-400">
                    <span>BUS PHASE 0{idx + 1}</span>
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
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Status Banner */}
          {isCompleted && (
            <div className="mt-6 p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-lg flex items-center justify-center gap-2 text-emerald-400 font-mono-tech text-xs tracking-wider animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> INFILTRATION COMPLETE · SYSTEM BYPASS AUTHORIZED
            </div>
          )}

          {hackFailed && (
            <div className="mt-6 p-3 bg-rose-950/70 border border-rose-500/50 rounded-lg flex items-center justify-center gap-2 text-rose-400 font-mono-tech text-xs tracking-wider animate-pulse">
              <ShieldAlert className="w-4 h-4" /> TRACE COMPLETE · COUNTERMEASURES ACTIVATED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
