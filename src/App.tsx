import { useState, useEffect } from 'react';
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
  Info,
  StickyNote,
  Trash2
} from 'lucide-react';
import { initialSongs } from './data';
import { Song } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [songs] = useState<Song[]>(initialSongs);
  const [selectedSongId, setSelectedSongId] = useState<string>(songs[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionNotes, setSectionNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('rehearsal-section-notes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('rehearsal-section-notes', JSON.stringify(sectionNotes));
  }, [sectionNotes]);

  const handleSongSelect = (id: string) => {
    setSelectedSongId(id);
    setCurrentSectionIndex(0);
    setIsPlaying(false);
  };

  const selectedSong = songs.find(s => s.id === selectedSongId) || songs[0];
  const currentSection = selectedSong.sections[currentSectionIndex] || selectedSong.sections[0];

  const currentNoteKey = `${selectedSongId}-${currentSection.id}`;
  const currentNote = sectionNotes[currentNoteKey] || '';

  const handleNoteChange = (val: string) => {
    setSectionNotes(prev => ({
      ...prev,
      [currentNoteKey]: val
    }));
  };

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
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-elegant-accent rounded-lg flex items-center justify-center shadow-lg shadow-elegant-accent/20">
            <Music className="text-black w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-[3px] uppercase text-white leading-none">REHEARSAL MASTER</h1>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-elegant-muted font-mono tracking-widest">PRO v2.5</span>
            </div>
            <p className="text-[10px] text-elegant-accent uppercase tracking-[2px] mt-1 font-bold">
              {selectedSong.title} <span className="text-white/20 mx-2">|</span> {selectedSong.artist}
            </p>
          </div>
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

            {/* Section-Specific Notes */}
            <div className="mt-12 pt-8 border-t border-elegant-border/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[2px] text-elegant-muted flex items-center gap-2">
                  <StickyNote size={12} className="text-elegant-accent" />
                  Observações da Seção ({currentSection?.name})
                </h4>
                {currentNote && (
                  <button 
                    onClick={() => handleNoteChange('')}
                    className="text-[9px] uppercase tracking-wider text-red-400/40 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={10} /> Limpar Nota
                  </button>
                )}
              </div>
              <textarea
                value={currentNote}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder={`Adicione notas específicas para ${currentSection?.name}...`}
                className="w-full h-32 bg-black/20 border border-elegant-border rounded-lg p-4 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent/30 transition-all resize-none font-mono placeholder:text-white/5"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-10 bg-[#0A0A0C] flex items-center justify-between px-10 text-[9px] text-[#444] tracking-[1px] uppercase border-t border-white/5">
        <div>Production Assistant v2.5 // Rehearsal Mode Active</div>
        <div className="flex items-center gap-4">
          <span className="text-elegant-accent/40">Developed by Allan Krainski</span>
          <span className="text-white/10">|</span>
          <span>© 2024 Rehearsal Master</span>
        </div>
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
