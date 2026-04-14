export interface SongSection {
  id: string;
  name: string;
  bars: number;
  notes?: string;
  color?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  bpm: number;
  timeSignature: string;
  sections: SongSection[];
}
