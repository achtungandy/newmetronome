
import React from 'react';
import type { Pattern, ToneOption } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  bpm: number;
  onBpmChange: (value: number) => void;
  minBpm: number;
  maxBpm: number;
  volume: number;
  onVolumeChange: (value: number) => void;
  accentVolume: number;
  onAccentVolumeChange: (value: number) => void;
  pattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
  patterns: Pattern[];
  selectedTone: ToneOption;
  onToneChange: (tone: ToneOption) => void;
  tones: ToneOption[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onPlayPause,
  bpm,
  onBpmChange,
  minBpm,
  maxBpm,
  volume,
  onVolumeChange,
  accentVolume,
  onAccentVolumeChange,
  pattern,
  onPatternChange,
  patterns,
  selectedTone,
  onToneChange,
  tones,
}) => {
  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPattern = patterns.find(p => p.id === e.target.value);
    if (selectedPattern) {
      onPatternChange(selectedPattern);
    }
  };

  const handleToneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = tones.find(t => t.id === e.target.value);
    if (selected) {
      onToneChange(selected);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <button
          onClick={onPlayPause}
          className="w-20 h-20 bg-teal-400 text-white rounded-full flex items-center justify-center shadow-md hover:bg-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="space-y-4">
        {/* BPM Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label htmlFor="bpm" className="text-sm font-medium text-stone-600">Tempo</label>
            <span className="text-lg font-semibold text-teal-500">{bpm} BPM</span>
          </div>
          <input
            type="range"
            id="bpm"
            min={minBpm}
            max={maxBpm}
            value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>

        {/* Volume Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="volume" className="text-sm font-medium text-stone-600">Volume</label>
            <input
              type="range"
              id="volume"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="accent" className="text-sm font-medium text-stone-600">Accent Beat</label>
            <input
              type="range"
              id="accent"
              min="0"
              max="100"
              value={accentVolume}
              onChange={(e) => onAccentVolumeChange(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="space-y-2">
            <label htmlFor="pattern" className="text-sm font-medium text-stone-600">Pattern</label>
            <select
              id="pattern"
              value={pattern.id}
              onChange={handlePatternChange}
              className="w-full p-2 border border-stone-300 rounded-md bg-white focus:ring-teal-400 focus:border-teal-400"
            >
              {patterns.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
           <div className="space-y-2">
            <label htmlFor="tone" className="text-sm font-medium text-stone-600">Tone</label>
            <select
              id="tone"
              value={selectedTone.id}
              onChange={handleToneChange}
              className="w-full p-2 border border-stone-300 rounded-md bg-white focus:ring-teal-400 focus:border-teal-400"
            >
              {tones.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
