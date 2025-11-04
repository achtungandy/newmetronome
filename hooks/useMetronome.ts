import { useEffect, useRef } from 'react';
import type { Pattern } from '../types';

// This interface should ideally be in a global d.ts file or imported,
// but for simplicity in this single-file structure, it's defined here.
declare global {
  interface Window {
    Tone: any;
  }
}

interface UseMetronomeProps {
  isPlaying: boolean;
  bpm: number;
  volume: number;
  accentVolume: number;
  pattern: Pattern;
  tone: string;
  setCurrentBeat: (beat: number) => void;
}

export const useMetronome = ({
  isPlaying,
  bpm,
  volume,
  accentVolume,
  pattern,
  tone,
  setCurrentBeat,
}: UseMetronomeProps) => {
  const sequenceRef = useRef<any>(null);
  const synthsRef = useRef<any>({});

  // Effect for handling Tone.js setup and sequence
  useEffect(() => {
    if (typeof window.Tone === 'undefined') return;

    const Tone = window.Tone;

    // --- Dispose old synths ---
    Object.values(synthsRef.current).forEach((synthPair: any) => {
        if (synthPair.accent) synthPair.accent.dispose();
        if (synthPair.regular) synthPair.regular.dispose();
    });

    // --- Initialize Synths ---
    const toDest = (synth: any) => synth.toDestination();

    // Click: Accent has a higher octave
    const accentClick = toDest(new Tone.MembraneSynth({ pitchDecay: 0.01, octaves: 7, envelope: { attack: 0.001, decay: 0.2, sustain: 0 } }));
    const regularClick = toDest(new Tone.MembraneSynth({ pitchDecay: 0.01, octaves: 6, envelope: { attack: 0.001, decay: 0.2, sustain: 0 } }));

    // Beep: Accent has a higher pitch (G5 vs C5)
    const accentBeep = toDest(new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 } }));
    const regularBeep = toDest(new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 } }));

    // Woodblock: Accent has a higher octave
    const accentWoodblock = toDest(new Tone.MembraneSynth({ pitchDecay: 0.005, octaves: 5, envelope: { attack: 0.001, decay: 0.15, sustain: 0 } }));
    const regularWoodblock = toDest(new Tone.MembraneSynth({ pitchDecay: 0.005, octaves: 4, envelope: { attack: 0.001, decay: 0.15, sustain: 0 } }));

    // Cowbell: Accent has a higher frequency
    const cowbellOptions = { frequency: 350, envelope: { attack: 0.001, decay: 0.15, release: 0.02 }, harmonicity: 4, modulationIndex: 20, resonance: 8000, octaves: 2 };
    const accentCowbell = toDest(new Tone.MetalSynth({ ...cowbellOptions, frequency: 500 }));
    const regularCowbell = toDest(new Tone.MetalSynth(cowbellOptions));

    // Hi-hat: Accent has longer decay (more "open" sound)
    const hihatOptions = { frequency: 400, envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 5.1, modulationIndex: 64, resonance: 4000, octaves: 1 };
    const accentHihat = toDest(new Tone.MetalSynth({ ...hihatOptions, envelope: { ...hihatOptions.envelope, decay: 0.1 } }));
    const regularHihat = toDest(new Tone.MetalSynth(hihatOptions));

    // Snare: Accent has a longer decay
    const snareOptions = { noise: { type: 'white' as const }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 } };
    const accentSnare = toDest(new Tone.NoiseSynth({ ...snareOptions, envelope: { ...snareOptions.envelope, decay: 0.2 } }));
    const regularSnare = toDest(new Tone.NoiseSynth(snareOptions));

    synthsRef.current = {
        click: { accent: accentClick, regular: regularClick },
        beep: { accent: accentBeep, regular: regularBeep },
        woodblock: { accent: accentWoodblock, regular: regularWoodblock },
        cowbell: { accent: accentCowbell, regular: regularCowbell },
        hihat: { accent: accentHihat, regular: regularHihat },
        snare: { accent: accentSnare, regular: regularSnare },
    };
    
    // --- Setup Transport and Sequence ---
    const beats = Array.from({ length: pattern.beats }, (_, i) => i);

    if (sequenceRef.current) {
      sequenceRef.current.dispose();
    }
    
    const newSequence = new Tone.Sequence(
      (time, beat) => {
        const synthPair = synthsRef.current[tone] || synthsRef.current.click;
        
        if (beat === 0) {
          const synth = synthPair.accent;
          if (tone === 'beep') synth.triggerAttackRelease('G5', '16n', time);
          else if (tone === 'snare' || tone === 'hihat') synth.triggerAttackRelease('8n', time);
          else synth.triggerAttackRelease('C3', '8n', time);
        } else {
          const synth = synthPair.regular;
          if (tone === 'beep') synth.triggerAttackRelease('C5', '16n', time);
          else if (tone === 'snare' || tone === 'hihat') synth.triggerAttackRelease('8n', time);
          else synth.triggerAttackRelease('C2', '8n', time);
        }

        Tone.Draw.schedule(() => {
          setCurrentBeat(beat);
        }, time);
      },
      beats,
      `${pattern.beats}n`
    );

    sequenceRef.current = newSequence;
    
    Tone.Transport.timeSignature = [pattern.beats, 4];
    
    if (isPlaying) {
      Tone.Transport.start();
      sequenceRef.current.start(0);
    } else {
      Tone.Transport.stop();
      sequenceRef.current.stop();
      setCurrentBeat(0);
    }

    return () => {
      if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
      }
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, pattern, tone]);

  // Effect for updating parameters that don't require re-creating the sequence
  useEffect(() => {
    if (typeof window.Tone === 'undefined' || Object.keys(synthsRef.current).length === 0) return;
    const Tone = window.Tone;
    
    if (Tone.Transport.bpm.value !== bpm) {
        Tone.Transport.bpm.rampTo(bpm, 0.1);
    }
    
    // Convert slider value [0, 100] to decibels [-40, 0] for volume
    const accentDb = accentVolume === 0 ? -Infinity : (accentVolume / 100) * 40 - 40;
    const regularDb = volume === 0 ? -Infinity : (volume / 100) * 40 - 40;

    Object.values(synthsRef.current).forEach((synthPair: any) => {
        if (synthPair.accent) synthPair.accent.volume.rampTo(accentDb, 0.05);
        if (synthPair.regular) synthPair.regular.volume.rampTo(regularDb, 0.05);
    });

  }, [bpm, volume, accentVolume]);
};