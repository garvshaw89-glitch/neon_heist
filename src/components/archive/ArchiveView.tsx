import React, { useState } from 'react';
import { sound } from '../../game/audio';
import { Database, FileText, Building2, Users, ShieldAlert, Cpu } from 'lucide-react';
import { BrutalCard } from '../common/BrutalCard';

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
    <div className="w-full h-[calc(100vh-4.5rem)] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto font-mono-tech select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
              INTELLIGENCE // DATABASE
            </span>
            <span className="text-xs text-slate-400">CORP LORE & OPERATIVE ARCHIVES</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white tracking-wide">
            ARCHIVE REPOSITORY
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-black/60 border border-white/10 rounded-xl">
          {['ALL', 'CORPORATIONS', 'LORE', 'CHARACTERS', 'TECH'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                sound.playUiClick();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#162137] text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Entry List and Dossier Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center py-4">
        
        {/* Left 6 Columns: File List */}
        <div className="lg:col-span-6 space-y-3">
          {filtered.map((entry, idx) => {
            const isSelected = selectedEntry.id === entry.id;

            return (
              <div
                key={entry.id}
                onClick={() => handleSelect(entry)}
                className={`p-4.5 rounded-2xl brutal-frame cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#182337] to-[#0f1725] border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                    : 'bg-[#090e1c]/70 hover:bg-[#111728]/80 border border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="brutal-stamp text-[9px] text-cyan-300 border-cyan-500/20">
                    0{idx + 1} // {entry.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    {entry.clearance}
                  </span>
                </div>

                <h3 className="text-sm font-display font-bold text-white mb-1">
                  {entry.title}
                </h3>
                <div className="text-[10px] text-slate-400">
                  SOURCE: {entry.source} · {entry.date}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 6 Columns: Dossier Reader */}
        <div className="lg:col-span-6 brutal-frame glass-primary p-7 rounded-2xl terminal-glass surface-imperfections space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="brutal-stamp text-cyan-400 border-cyan-500/30">
                DECRYPTED // {selectedEntry.clearance}
              </span>
              <span className="text-xs text-slate-400">
                DATE: {selectedEntry.date}
              </span>
            </div>
            <h3 className="text-2xl font-display font-black text-white tracking-tight">
              {selectedEntry.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              SOURCE IDENTIFIER: {selectedEntry.source}
            </p>
          </div>

          <div className="p-5 bg-black/50 border border-white/10 rounded-xl">
            <p className="text-sm text-slate-200 font-sans leading-relaxed">
              {selectedEntry.content}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
            <span>TRANSMISSION: DECLASSIFIED UNDER GHOST PROTOCOL</span>
            <span className="text-cyan-400">CIPHER: UNLOCKED</span>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/10 pt-3">
        <span>ARCHIVE CLEARANCE: LEVEL 05 UNRESTRICTED</span>
        <span>AUTONOMOUS HISTORICAL RECORD</span>
      </div>
    </div>
  );
};
