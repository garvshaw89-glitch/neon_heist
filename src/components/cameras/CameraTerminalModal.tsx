import React, { useState } from 'react';
import { SecurityCamera } from '../../types/game';
import { sound } from '../../game/audio';
import { Camera, ShieldOff, RotateCw, Eye, X, Video, Sliders } from 'lucide-react';
import { TactileButton } from '../common/TactileButton';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 select-none font-mono-tech">
      <div className="relative w-full max-w-4xl brutal-frame glass-primary rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row terminal-glass surface-imperfections animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Side: Camera Selection List in Smoked Glass */}
        <div className="w-full md:w-80 bg-black/70 border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
                SURVEILLANCE // MESH
              </span>
            </div>
            
            <div className="space-y-2">
              {cameras.map((cam, idx) => (
                <button
                  key={cam.id}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border font-mono-tech text-xs flex items-center justify-between transition-all cursor-pointer ${
                    idx === selectedCamIndex
                      ? 'bg-gradient-to-b from-[#182438] to-[#0f1725] border-cyan-400 text-cyan-300 shadow-md'
                      : 'bg-[#090e1c]/80 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${cam.isPowerOff ? 'bg-slate-600' : cam.isLooping ? 'bg-amber-400' : 'bg-cyan-400 animate-pulse'}`} />
                    <span className="font-bold">FEED 0{idx + 1}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {cam.isPowerOff ? 'DISABLED' : cam.isLooping ? 'LOOPED' : 'LIVE'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[10px] text-slate-500 flex items-center justify-between">
            <span>OPTICAL GRID: ACTIVE</span>
            <span className="text-cyan-400">FPS: 60 LOCKED</span>
          </div>
        </div>

        {/* Right Side: Camera View & Physical Controls */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">
                  OPTICAL RECONNAISSANCE CONTROLLER
                </span>
                <h3 className="text-xl font-display font-extrabold text-white mt-0.5">
                  CAMERA 0{selectedCamIndex + 1} // {selectedCam?.id.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playUiClick();
                  onClose();
                }}
                className="p-2 rounded-xl bg-black/60 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Live Viewport */}
            <div className="relative aspect-video w-full bg-black/90 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 cyber-scanlines opacity-50" />
              <div className="absolute inset-0 brutal-grid opacity-20" />
              
              <div className="absolute top-3 left-3 text-[10px] font-mono-tech text-emerald-400 flex items-center gap-2 bg-black/70 px-2.5 py-1 rounded border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                REC ● {new Date().toLocaleTimeString()}
              </div>

              <div className="absolute top-3 right-3 text-[10px] font-mono-tech text-cyan-300 bg-black/70 px-2.5 py-1 rounded border border-white/10">
                FOV {Math.round((selectedCam?.fov || 0.6) * 57.3)}° · RANGE {selectedCam?.range}M
              </div>

              {/* Status Graphic */}
              <div className="text-center space-y-1">
                {selectedCam?.isPowerOff ? (
                  <div className="text-rose-400 font-display font-extrabold text-lg tracking-widest">
                    [ SIGNAL TERMINATED · SENSOR OFFLINE ]
                  </div>
                ) : selectedCam?.isLooping ? (
                  <div className="text-amber-400 font-display font-extrabold text-lg tracking-widest animate-pulse">
                    [ GHOST LOOP ACTIVE · REPLAY BUFFER ]
                  </div>
                ) : (
                  <div className="text-slate-400 font-mono-tech text-xs tracking-wider">
                    TARGET SECTOR: INTERIOR PERIMETER
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Physical Clay Override Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
            <TactileButton
              variant={selectedCam?.isLooping ? 'clay-primary' : 'clay-accent'}
              size="md"
              icon={<RotateCw className="w-4 h-4" />}
              onClick={() => {
                sound.playConfirm();
                if (selectedCam) onLoopCamera(selectedCam.id);
              }}
            >
              {selectedCam?.isLooping ? 'DISENGAGE LOOP' : 'LOOP BUFFER FEED'}
            </TactileButton>

            <TactileButton
              variant={selectedCam?.isPowerOff ? 'clay-primary' : 'clay-danger'}
              size="md"
              icon={<ShieldOff className="w-4 h-4" />}
              onClick={() => {
                sound.playSuspicionAlert();
                if (selectedCam) onDisableCamera(selectedCam.id);
              }}
            >
              {selectedCam?.isPowerOff ? 'RESTORE OPTICS' : 'OVERLOAD SENSOR'}
            </TactileButton>

            <TactileButton
              variant="glass"
              size="md"
              icon={<Sliders className="w-4 h-4 text-cyan-400" />}
              onClick={() => {
                sound.playConfirm();
                if (selectedCam) onRotateCamera(selectedCam.id);
              }}
            >
              ROTATE 45°
            </TactileButton>
          </div>
        </div>

      </div>
    </div>
  );
};
