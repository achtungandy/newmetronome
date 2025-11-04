
import React, { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import Visualizer from './components/Visualizer';
import { useMetronome } from './hooks/useMetronome';
import { PATTERNS, TONE_OPTIONS, DEFAULT_BPM, MIN_BPM, MAX_BPM } from './constants';
import type { Pattern, ToneOption } from './types';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(DEFAULT_BPM);
  const [volume, setVolume] = useState<number>(75);
  const [accentVolume, setAccentVolume] = useState<number>(100);
  const [pattern, setPattern] = useState<Pattern>(PATTERNS[0]);
  const [selectedTone, setSelectedTone] = useState<ToneOption>(TONE_OPTIONS[0]);
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  useMetronome({
    isPlaying,
    bpm,
    volume,
    accentVolume,
    pattern,
    tone: selectedTone.id,
    setCurrentBeat,
  });

  const handlePlayPause = async () => {
    // Tone.js requires audio context to be started by user gesture
    if (window.Tone && window.Tone.context.state !== 'running') {
      await window.Tone.start();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-sans text-stone-700">
      <div className="w-full max-w-md mx-4 p-6 sm:p-8 bg-white rounded-2xl shadow-lg space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-stone-800">Metronome</h1>
          <p className="text-stone-500 mt-1">Refine your rhythm</p>
        </header>
        
        <Visualizer currentBeat={currentBeat} totalBeats={pattern.beats} isPlaying={isPlaying} />

        <ControlPanel
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          bpm={bpm}
          onBpmChange={setBpm}
          minBpm={MIN_BPM}
          maxBpm={MAX_BPM}
          volume={volume}
          onVolumeChange={setVolume}
          accentVolume={accentVolume}
          onAccentVolumeChange={setAccentVolume}
          pattern={pattern}
          onPatternChange={setPattern}
          patterns={PATTERNS}
          selectedTone={selectedTone}
          onToneChange={setSelectedTone}
          tones={TONE_OPTIONS}
        />
      </div>
    </div>
  );
};

export default App;
