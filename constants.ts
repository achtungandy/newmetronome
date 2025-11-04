import type { Pattern, ToneOption } from './types';

export const MIN_BPM = 40;
export const MAX_BPM = 240;
export const DEFAULT_BPM = 120;

export const PATTERNS: Pattern[] = [
  { id: '4/4', name: '4/4', beats: 4 },
  { id: '3/4', name: '3/4', beats: 3 },
  { id: '2/4', name: '2/4', beats: 2 },
  { id: '6/8', name: '6/8', beats: 6 },
  { id: '5/4', name: '5/4', beats: 5 },
  { id: '7/8', name: '7/8', beats: 7 },
  { id: '9/8', name: '9/8', beats: 9 },
  { id: '12/8', name: '12/8', beats: 12 },
];

export const TONE_OPTIONS: ToneOption[] = [
  { id: 'click', name: 'Click' },
  { id: 'beep', name: 'Beep' },
  { id: 'woodblock', name: 'Woodblock' },
  { id: 'cowbell', name: 'Cowbell' },
  { id: 'hihat', name: 'Hi-hat' },
  { id: 'snare', name: 'Snare' },
];