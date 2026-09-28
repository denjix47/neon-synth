export type WaveformType = 'sawtooth' | 'square' | 'sine' | 'triangle';

export type VisualizerTheme = 'neon-grid' | 'cosmic-spheres' | 'quantum-waves';

export interface SynthParams {
cutoff: number;
  resonance: number;
  attack: number;
  release: number;
  octave: number;
  volume: number;
}

export interface PianoNote {
  note: string;
  midi: number;
  isBlack: boolean;
  keyChar?: string;
  frequency: number;
}
