import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { Database, FileText, Building2, Users, ShieldAlert, Cpu } from 'lucide-react';

interface ArchiveEntry {
  id: string;
  category: 'CORPORATIONS' | 'LORE' | 'CHARACTERS' | 'TECH';
  title: string;
  source: string;
  date: string;
  content: string;
  clearance: string;
}

const ARCHIVE_DATA: ArchiveEntry[] = [
  {
    id: 'arch-ghostnet',
    category: 'LORE',
    title: 'THE DISAPPEARANCE OF GHOST-01 THROUGH GHOST-06',
    source: 'GHOSTNET BLACK BOX LOG',
    date: 'CLASSIFIED 2088',
    clearance: 'TOP SECRET',
    content: 'Interception logs prove that GhostNet was not founded by an anti-corporate collective, but engineered by an autonomous intelligence to stress-test corporate defense perimeters. When Ghost-04 attempted to leak the Orion Quantum source code, their telemetry feed abruptly flatlined.'
  },
  {
    id: 'arch-orion',
    category: 'CORPORATIONS',
    title: 'ORION DYNAMICS · QUANTUM CONVERGENCE PROTOCOL',
    source: 'RESEARCH INTERCEPT',
    date: 'CYCLE 14',
    clearance: 'RESTRICTED',
    content: 'Orion Dynamics specializes in sub-zero quantum computing algorithms capable of breaking 2048-bit military keys in 12 milliseconds. Their executive vaults are cryogenically insulated to protect superconducting matrices.'
  },
  {
    id: 'arch-vera',
    category: 'CHARACTERS',
    title: 'OPERATOR DOSSIER · VERA',
    source: 'PERSONNEL ARCHIVE',
    date: 'ACTIVE',
    clearance: 'INTERNAL',
    content: 'Former head of electronic counter-surveillance for Kuroshio Orbital. Severed ties with the syndicate after refusing an order to wipe an entire district grid. Calm, cynical, and possessor of the cleanest routing channels in Night City.'
  },
  {
    id: 'arch-kuroshio',
    category: 'CORPORATIONS',
    title: 'KUROSHIO HEAVY INDUSTRIES · PROJECT APEX',
    source: 'INTERNAL LEAK',
    date: 'RECENT',
    clearance: 'LEVEL 4',
    content: 'Kuroshio operates orbital manufacturing foundries and autonomous defense drones. Intelligence reports confirm they are training an untethered sovereign military AI to replace human command structures.'
  },
  {
    id: 'arch-lasers',
    category: 'TECH',
    title: 'HARMONIC LASER TRIPWIRES & SENSOR MATRICES',
    source: 'DEFENSE MANUAL',
    date: 'STANDARD',
    clearance: 'TECHNICAL',
    content: 'Modern corporate barriers use pulsed harmonic lasers. When disrupted by physical mass or smoke, breaker relays trip an instantaneous alarm. Operatives must either disable breaker terminals or navigate during pulse recharge intervals.'
  }
];

export const ArchiveView: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<ArchiveEntry>(ARCHIVE_DATA[0]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filtered = activeCategory === 'ALL'
    ? ARCHIVE_DATA
    : ARCHIVE_DATA.filter(e => e.category === activeCategory);

  const handleSelect = (entry: ArchiveEntry) => {
    sound.playUiClick();
    setSelectedEntry(entry);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-0.5">
            CLASSIFIED INTELLIGENCE DATABASE
          </span>
          <h2 className="text-xl font-display font-bold text-white tracking-wide">
            ARCHIVE REPOSITORY
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {['ALL', 'CORPORATIONS', 'LORE', 'CHARACTERS', 'TECH'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                sound.playUiClick();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Entry List & Detailed Document Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center">
        {/* Left 5 Cols: Entry list */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.map(entry => {
            const isSelected = selectedEntry.id === entry.id;
            return (
              <div
                key={entry.id}
                onClick={() => handleSelect(entry)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                    : 'bg-[#090e1c]/50 border-white/5 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-cyan-400 mb-1">
                  <span>{entry.category}</span>
                  <span className="text-slate-500">{entry.clearance}</span>
                </div>
                <h4 className="text-sm font-display font-bold text-white">
                  {entry.title}
                </h4>
                <div className="text-[11px] text-slate-400 mt-1">
                  SOURCE: {entry.source}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: Classified Document Reader */}
        <div className="lg:col-span-7 p-8 rounded-2xl border border-white/5 bg-[#090e1c]/60 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
              <span>DOCUMENT SOURCE: {selectedEntry.source}</span>
              <span className="text-amber-400 font-bold">{selectedEntry.clearance}</span>
            </div>
            <h3 className="text-xl font-display font-bold text-white">
              {selectedEntry.title}
            </h3>
          </div>

          <p className="text-sm text-slate-300 font-sans leading-relaxed p-6 bg-slate-950/50 border border-slate-800 rounded-xl">
            {selectedEntry.content}
          </p>

          <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-xs text-cyan-300/80">
            [INTERCEPT SUMMARY]: Further surveillance required to decrypt the full GhostNet conspiracy.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-[11px] text-slate-500 flex justify-between">
        <span>ENCRYPTED MEMORY CORE: 5/5 ENTRIES SYNCHRONIZED</span>
        <span>SECURITY LOCKOUT: BYPASSED</span>
      </div>
    </div>
  );
};
