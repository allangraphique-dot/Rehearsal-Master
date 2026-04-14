import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Clock, 
  ListMusic, 
  Mic2, 
  Settings,
  Plus,
  Info
} from 'lucide-react';
import { initialSongs } from './data';
import { Song } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [songs] = useState<Song[]>(initialSongs);
  const [selectedSongId, setSelectedSongId] = useState<string>(songs[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const handleSongSelect = (id: string) => {
    setSelectedSongId(id);
    setCurrentSectionIndex(0);
    setIsPlaying(false);
  };

  const selectedSong = songs.find(s => s.id === selectedSongId) || songs[0];
  const currentSection = selectedSong.sections[currentSectionIndex] || selectedSong.sections[0];

  const togglePlay = () => setIsPlaying(!isPlaying);

  const getSectionStartTime = (index: number) => {
    const section = selectedSong.sections[index];
    if (section?.startTime) return section.startTime;

    let totalBars = 0;
    for (let i = 0; i < index; i++) {
      totalBars += selectedSong.sections[i].bars;
    }
    const [beatsPerBar] = selectedSong.timeSignature.split('/').map(Number);
    const totalSeconds = (totalBars * beatsPerBar * 60) / selectedSong.bpm;
    
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-elegant-bg text-elegant-text font-sans selection:bg-elegant-accent/30 flex flex-col">
      {/* Top Header */}
      <header className="h-20 bg-elegant-surface border-b-2 border-elegant-border px-10 flex items-center justify-between sticky top-0 z-50">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-[2px] uppercase text-white leading-none">{selectedSong.title}</h1>
          <p className="text-[12px] text-elegant-muted uppercase tracking-[1px] mt-1">
            {selectedSong.artist} • {selectedSong.album}
          </p>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-[10px] text-[#555] uppercase mb-1">Tempo</div>
              <div className="font-mono text-lg text-elegant-accent">{selectedSong.bpm} BPM</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-[#555] uppercase mb-1">Compasso</div>
              <div className="font-mono text-lg text-elegant-accent">{selectedSong.timeSignature}</div>
            </div>
            <div className="text-center hidden md:block">
              <div className="text-[10px] text-[#555] uppercase mb-1">Tom</div>
              <div className="font-mono text-lg text-elegant-accent">A Major</div>
            </div>
          </div>
          <button className="p-2 hover:bg-elegant-border rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-elegant-muted" />
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-[280px_1fr] overflow-hidden">
        {/* Sidebar - Song List */}
        <aside className="bg-elegant-sidebar border-r border-elegant-border flex flex-col overflow-hidden">
          <div className="p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-[#555] border-b border-elegant-border pb-2 mb-5 flex items-center justify-between">
              <span>Estrutura da Música</span>
              <Plus className="w-3 h-3 cursor-pointer hover:text-elegant-accent transition-colors" />
            </h2>
            
            <div className="overflow-y-auto space-y-2 pr-1">
              {selectedSong.sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSectionIndex(index)}
                  className={cn(
                    "w-full text-left p-3 rounded-sm transition-all relative bg-elegant-item border-l-3",
                    currentSectionIndex === index 
                      ? "border-elegant-accent bg-elegant-active" 
                      : "border-transparent hover:bg-elegant-active/50"
                  )}
                >
                  <span className="float-right font-mono text-[12px] text-elegant-muted">
                    {getSectionStartTime(index)}
                  </span>
                  <div className="font-bold text-sm text-white">{section.name}</div>
                  <div className="text-[11px] text-[#666] mt-1">{section.bars} Compassos</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-elegant-border">
            <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-[#555] mb-4">Setlist</h2>
            <div className="space-y-1">
              {songs.map(song => (
                <button
                  key={song.id}
                  onClick={() => handleSongSelect(song.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded text-xs transition-colors",
                    selectedSongId === song.id ? "bg-elegant-accent text-black font-bold" : "text-elegant-muted hover:text-white"
                  )}
                >
                  {song.title}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className="overflow-y-auto p-10 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-[#555] border-b border-elegant-border pb-2 flex-1 mr-4">
              Mapa de Ensaio Detalhado
            </h3>
            <button 
              onClick={togglePlay}
              className="px-6 py-2 bg-elegant-accent hover:bg-[#C5A02E] text-black font-bold rounded text-xs uppercase tracking-wider transition-all active:scale-95"
            >
              {isPlaying ? 'Pause Rehearsal' : 'Start Rehearsal'}
            </button>
          </div>

          {/* Details Card */}
          <div className="bg-elegant-surface border border-elegant-border rounded-lg p-8 flex-1">
            <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-elegant-accent border-b border-elegant-border pb-3 mb-8 flex items-center justify-between">
              <span>Seção Atual: {currentSection?.name}</span>
              <div className="flex gap-4 items-center">
                <span className="font-mono text-[10px] text-elegant-muted">Início: {getSectionStartTime(currentSectionIndex)}</span>
                <span className="font-mono text-[10px] text-white/20">|</span>
                <span className="font-mono text-[10px] text-elegant-muted">{currentSection?.bars} Compassos</span>
              </div>
            </h3>
            
            <div className="space-y-6">
              {currentSection?.notes ? (
                currentSection.notes.split('\n').map((line, i) => {
                  const tagMatch = line.match(/^\[(LYRIC|INSTR|GROOVE|DYN|CHORDS)\]\s*(.*)/);
                  if (tagMatch) {
                    const [, tag, content] = tagMatch;
                    const tagColors: Record<string, string> = {
                      LYRIC: 'text-white/40',
                      INSTR: 'text-elegant-accent',
                      GROOVE: 'text-blue-400',
                      DYN: 'text-red-400',
                      CHORDS: 'text-emerald-400'
                    };
                    
                    return (
                      <div key={i} className="flex flex-col gap-1 border-l-2 border-elegant-border pl-4 py-1">
                        <span className={cn("text-[9px] font-black uppercase tracking-[2px]", tagColors[tag])}>
                          {tag}
                        </span>
                        <p className={cn(
                          "leading-relaxed",
                          tag === 'LYRIC' ? "text-xl text-white font-medium italic" : 
                          tag === 'CHORDS' ? "text-2xl font-mono font-bold text-emerald-300 tracking-widest" :
                          "text-sm text-[#BBB]"
                        )}>
                          {content}
                        </p>
                      </div>
                    );
                  }
                  return <p key={i} className="text-sm text-[#BBB]">{line}</p>;
                })
              ) : (
                <div className="text-center py-20 text-elegant-muted italic text-sm">
                  Nenhuma marcação específica para esta seção.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-10 bg-[#0A0A0C] flex items-center px-10 text-[10px] text-[#444] tracking-[1px] uppercase">
        Production Assistant v2.4 // Rehearsal Mode Active // No network requests enabled
      </footer>

      {/* Floating Player Controls - Only visible when playing */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className="bg-elegant-surface border border-elegant-border p-4 rounded-xl shadow-2xl flex items-center gap-6 min-w-[300px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-elegant-accent rounded flex items-center justify-center text-black font-bold font-mono">
                  {currentSectionIndex + 1}
                </div>
                <div className="text-xs uppercase font-bold tracking-wider">{currentSection?.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentSectionIndex(prev => Math.max(0, prev - 1))} className="p-2 hover:bg-elegant-border rounded text-elegant-muted"><SkipBack size={18}/></button>
                <button onClick={togglePlay} className="w-10 h-10 bg-white text-black rounded flex items-center justify-center"><Pause size={20} fill="currentColor"/></button>
                <button onClick={() => setCurrentSectionIndex(prev => Math.min(selectedSong.sections.length - 1, prev + 1))} className="p-2 hover:bg-elegant-border rounded text-elegant-muted"><SkipForward size={18}/></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
