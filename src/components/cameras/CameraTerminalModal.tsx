import React, { useState } from 'react';
import { SecurityCamera } from '../../types/game';
import { sound } from '../../game/audio';
import { Camera, ShieldOff, RotateCw, Eye, X } from 'lucide-react';

interface CameraTerminalModalProps {
  cameras: SecurityCamera[];
  onLoopCamera: (id: string) => void;
  onDisableCamera: (id: string) => void;
  onRotateCamera: (id: string) => void;
  onClose: () => void;
}

export const CameraTerminalModal: React.FC<CameraTerminalModalProps> = ({
  cameras,
  onLoopCamera,
  onDisableCamera,
  onRotateCamera,
  onClose
}) => {
  const [selectedCamIndex, setSelectedCamIndex] = useState(0);
  const selectedCam = cameras[selectedCamIndex] || cameras[0];

  const handleSelect = (idx: number) => {
    sound.playUiClick();
    setSelectedCamIndex(idx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl bg-[#090d16] border border-cyan-500/30 rounded-xl shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Camera Selection List */}
        <div className="w-full md:w-72 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-mono-tech text-cyan-400">
              <Camera className="w-4 h-4" /> FACILITY OPTIC MESH
            </div>
            <div className="space-y-2">
              {cameras.map((cam, idx) => (
                <button
                  key={cam.id}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-3 rounded-lg border font-mono-tech text-xs flex items-center justify-between transition-colors ${
                    idx === selectedCamIndex
                      ? 'bg-cyan-950/50 border-cyan-500/60 text-cyan-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>FEED 0{idx + 1}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase">
                    {cam.isPowerOff ? 'OFFLINE' : cam.isLooping ? 'LOOPED' : 'ONLINE'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[10px] font-mono-tech text-slate-500">
            ENCRYPTION: 256-BIT SHA
          </div>
        </div>

        {/* Right Side: Camera View & Controls */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono-tech text-cyan-400/80 uppercase block">
                  SUB-NETWORK FEED CONTROLLER
                </span>
                <h3 className="text-base font-display font-semibold text-white">
                  CAMERA 0{selectedCamIndex + 1} · {selectedCam?.id.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Live Viewport */}
            <div className="relative aspect-video w-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
              {/* Scanlines overlay */}
              <div className="absolute inset-0 cyber-scanlines opacity-70" />
              
              {/* Status Header inside feed */}
              <div className="absolute top-3 left-3 text-[10px] font-mono-tech text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                REC ● {new Date().toLocaleTimeString()}
              </div>

              <div className="absolute top-3 right-3 text-[10px] font-mono-tech text-cyan-400/80">
                FOV {Math.round((selectedCam?.fov || 0.6) * 57.3)}° · RANGE {selectedCam?.range}M
              </div>

              {selectedCam?.isPowerOff ? (
                <div className="text-center font-mono-tech text-rose-500 text-sm tracking-widest">
                  [SIGNAL LOST · FEED TERMINATED]
                </div>
              ) : selectedCam?.isLooping ? (
                <div className="text-center font-mono-tech text-amber-400 text-sm tracking-widest animate-pulse">
                  [LOOPED BUFFER ACTIVE · SENSORS SPOOFED]
                </div>
              ) : (
                <div className="relative text-center">
                  <Eye className="w-10 h-10 text-cyan-500/40 mx-auto mb-2 animate-pulse" />
                  <span className="text-xs font-mono-tech text-slate-400 tracking-wider">
                    OPTICAL SURVEILLANCE ACTIVE
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                if (selectedCam) {
                  sound.playConfirm();
                  onLoopCamera(selectedCam.id);
                }
              }}
              className="py-2.5 px-4 rounded-lg border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 font-mono-tech text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              {selectedCam?.isLooping ? 'RESTORE LIVE FEED' : 'LOOP FOOTAGE'}
            </button>

            <button
              onClick={() => {
                if (selectedCam) {
                  sound.playEmpPulse();
                  onDisableCamera(selectedCam.id);
                }
              }}
              className="py-2.5 px-4 rounded-lg border border-rose-500/40 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 font-mono-tech text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldOff className="w-3.5 h-3.5" />
              {selectedCam?.isPowerOff ? 'RESTORE POWER' : 'KILL CAMERA FEED'}
            </button>

            <button
              onClick={() => {
                if (selectedCam) {
                  sound.playHackRotate();
                  onRotateCamera(selectedCam.id);
                }
              }}
              className="py-2.5 px-4 rounded-lg border border-slate-700 bg-slate-900 hover:border-slate-500 text-slate-200 font-mono-tech text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              ROTATE ANGLE (45°)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
