import React, { useState, useEffect } from 'react';
import { sound } from '../../game/audio';
import { Shield, CheckCircle2, AlertTriangle, AlertOctagon, Award, Sparkles, X } from 'lucide-react';

export type ToastType = 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER' | 'UNLOCK' | 'REPUTATION';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private listeners: ToastListener[] = [];
  private toasts: ToastItem[] = [];

  public subscribe(fn: ToastListener) {
    this.listeners.push(fn);
    fn(this.toasts);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn([...this.toasts]));
  }

  public show(type: ToastType, title: string, message: string, duration = 4000) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, title, message, duration };
    this.toasts = [...this.toasts.slice(-4), newToast]; // Keep max 5
    this.notify();

    if (type === 'UNLOCK' || type === 'SUCCESS') {
      sound.playAchievementUnlocked();
    } else if (type === 'DANGER' || type === 'WARNING') {
      sound.playSuspicionAlert();
    } else {
      sound.playUiClick();
    }

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  public info(title: string, message: string, duration = 4000) {
    this.show('INFO', title, message, duration);
  }

  public success(title: string, message: string, duration = 4000) {
    this.show('SUCCESS', title, message, duration);
  }

  public warning(title: string, message: string, duration = 4500) {
    this.show('WARNING', title, message, duration);
  }

  public danger(title: string, message: string, duration = 5000) {
    this.show('DANGER', title, message, duration);
  }

  public unlock(title: string, message: string, duration = 5000) {
    this.show('UNLOCK', title, message, duration);
  }

  public reputation(title: string, message: string, duration = 4000) {
    this.show('REPUTATION', title, message, duration);
  }

  public dismiss(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }
}

export const toast = new ToastManager();

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full font-mono-tech select-none">
      {toasts.map(item => {
        const isDanger = item.type === 'DANGER';
        const isWarning = item.type === 'WARNING';
        const isSuccess = item.type === 'SUCCESS';
        const isUnlock = item.type === 'UNLOCK';
        const isRep = item.type === 'REPUTATION';

        const borderColor = isDanger
          ? 'border-rose-500/50 bg-gradient-to-b from-rose-950/70 to-black/80'
          : isWarning
          ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/70 to-black/80'
          : isSuccess
          ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/70 to-black/80'
          : isUnlock || isRep
          ? 'border-cyan-400/60 bg-gradient-to-b from-cyan-950/70 to-black/80'
          : 'border-white/15 bg-gradient-to-b from-slate-900/80 to-black/80';

        const stampColor = isDanger
          ? 'text-rose-400 border-rose-500/30'
          : isWarning
          ? 'text-amber-400 border-amber-500/30'
          : isSuccess
          ? 'text-emerald-400 border-emerald-500/30'
          : isUnlock || isRep
          ? 'text-cyan-400 border-cyan-400/40'
          : 'text-slate-400 border-white/20';

        return (
          <div
            key={item.id}
            className={`pointer-events-auto brutal-frame backdrop-blur-xl p-4 rounded-xl border shadow-[0_8px_32px_rgba(0,0,0,0.85)] terminal-glass transition-all duration-300 animate-in fade-in slide-in-from-right-5 ${borderColor}`}
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2">
                {isDanger && <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isUnlock && <Award className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />}
                {isRep && <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />}
                {!isDanger && !isWarning && !isSuccess && !isUnlock && !isRep && (
                  <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={`brutal-stamp text-[9px] ${stampColor}`}>
                  {item.type}
                </span>
              </div>
              <button
                onClick={() => toast.dismiss(item.id)}
                className="text-slate-500 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs font-display font-bold text-white tracking-wide">
              {item.title}
            </div>
            <div className="text-[11px] text-slate-300 font-sans mt-0.5 leading-relaxed">
              {item.message}
            </div>
          </div>
        );
      })}
    </div>
  );
};
