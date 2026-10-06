import React, { useState, useEffect } from 'react';
import { sound } from '../../game/audio';
import { Radio, X } from 'lucide-react';

export interface DialogueMessage {
  speaker: 'VERA' | 'GHOST' | 'ZERO' | 'DIRECTOR KADE' | 'THE ARCHITECT';
  role: string;
  text: string;
}

interface RadioDialogueProps {
  dialogue: DialogueMessage | null;
  onDismiss: () => void;
}

export const RadioDialogue: React.FC<RadioDialogueProps> = ({ dialogue, onDismiss }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!dialogue) {
      setDisplayedText('');
      return;
    }
    sound.playUiHover();
    let index = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      index++;
      setDisplayedText(dialogue.text.slice(0, index));
      if (index >= dialogue.text.length) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [dialogue]);

  if (!dialogue) return null;

  const speakerColor = 
    dialogue.speaker === 'VERA' ? 'text-cyan-400 border-cyan-500/40' :
    dialogue.speaker === 'ZERO' ? 'text-purple-400 border-purple-500/40' :
    dialogue.speaker === 'DIRECTOR KADE' ? 'text-rose-400 border-rose-500/40' :
    'text-amber-400 border-amber-500/40';

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#070b14]/90 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex gap-4 items-start">
        {/* Speaker avatar tag */}
        <div className="shrink-0 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-lg bg-slate-900 border ${speakerColor} flex items-center justify-center font-display font-bold text-xs`}>
            {dialogue.speaker.slice(0, 2)}
          </div>
          <span className="text-[9px] font-mono-tech text-slate-500 uppercase mt-1">SECURE</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-bold text-white tracking-wide">
                {dialogue.speaker}
              </span>
              <span className="text-[10px] font-mono-tech text-cyan-400/80">
                // {dialogue.role}
              </span>
            </div>
            <button
              onClick={onDismiss}
              className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 font-mono-tech leading-relaxed">
            {displayedText}
          </p>
        </div>
      </div>
    </div>
  );
};
