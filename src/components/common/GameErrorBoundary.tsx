import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ShieldAlert } from 'lucide-react';
import { sound } from '../../game/audio';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GameErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Game System Module Exception:', error, errorInfo);
  }

  private handleRecover = () => {
    sound.playConfirm();
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 bg-[#04060a] text-slate-100 flex items-center justify-center p-6 font-mono-tech select-none">
          <div className="max-w-md w-full brutal-frame glass-primary p-8 rounded-2xl border-rose-500/50 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/40 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-rose-400" />
            </div>

            <div>
              <div className="inline-block px-2 py-0.5 rounded border border-rose-500/30 bg-rose-950/40 text-[10px] text-rose-300 font-mono tracking-widest uppercase mb-2">
                RECOVERY ISOLATION
              </div>
              <h2 className="text-2xl font-display font-black text-white">
                SYSTEM MODULE OFFLINE
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-2 leading-relaxed">
                An anomaly in tactical graphics or memory execution was caught and contained. The application integrity remains protected.
              </p>
            </div>

            <div className="p-3 bg-black/60 rounded-xl border border-white/5 text-[11px] text-slate-500 font-mono text-left overflow-x-auto">
              {this.state.error?.message || 'TACTICAL ENGINE STATE DESYNCHRONIZED'}
            </div>

            <button
              onClick={this.handleRecover}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-display font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              REINITIALIZE MAINFRAME
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
