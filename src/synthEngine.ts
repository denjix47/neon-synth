import { SynthParams } from './types';

class SynthEngine {
  private audioCtx: AudioContext | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private activeVoices: Map<number, { osc: OscillatorNode; gain: GainNode }> = new Map();

  private init() {
    if (this.audioCtx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioCtx = new AudioContextClass();

    this.filterNode = this.audioCtx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = 2000;
    this.filterNode.Q.value = 2;

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = 0.5;

    // Master limiter to prevent clipping on chords
    this.compressorNode = this.audioCtx.createDynamicsCompressor();

    this.analyserNode = this.audioCtx.createAnalyser();
    this.analyserNode.fftSize = 256;
    this.analyserNode.smoothingTimeConstant = 0.8;

    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(this.compressorNode);
    this.compressorNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioCtx.destination);
  }

  public ensureContextRunning() {
    if (!this.audioCtx) {
      this.init();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public updateParams(params: SynthParams) {
    if (!this.audioCtx || !this.filterNode || !this.masterGain) return;
    const now = this.audioCtx.currentTime;
    this.filterNode.frequency.setTargetAtTime(params.cutoff, now, 0.03);
    this.filterNode.Q.setTargetAtTime(params.resonance, now, 0.03);
    this.masterGain.gain.setTargetAtTime(params.volume, now, 0.03);
  }

  public noteToFreq(midi: number, octaveOffset: number): number {
    const adjustedMidi = midi + octaveOffset * 12;
    return 440 * Math.pow(2, (adjustedMidi - 69) / 12);
  }

  public noteOn(midi: number, params: SynthParams) {
    this.ensureContextRunning();
    if (!this.audioCtx || !this.filterNode) return;

    if (this.activeVoices.has(midi)) {
      this.noteOff(midi, params);
    }

    const freq = this.noteToFreq(midi, params.octave);
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    osc.type = params.waveform;
    osc.frequency.setValueAtTime(freq, now);

    const voiceGain = this.audioCtx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, now);
    
    // Dynamic polyphony gain scaling to prevent clipping
    const currentActiveCount = this.activeVoices.size + 1;
    const targetGain = Math.min(0.4, 0.85 / Math.sqrt(currentActiveCount));
    const attackEnd = now + Math.max(0.005, params.attack);
    voiceGain.gain.linearRampToValueAtTime(targetGain, attackEnd);

    osc.connect(voiceGain);
    voiceGain.connect(this.filterNode);

    osc.start(now);
    this.activeVoices.set(midi, { osc, gain: voiceGain });
  }

  public noteOff(midi: number, params: SynthParams) {
    const voice = this.activeVoices.get(midi);
    if (!voice || !this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const releaseDuration = Math.max(0.01, params.release);

    const gainParam = voice.gain.gain;
    gainParam.cancelScheduledValues(now);
    gainParam.setValueAtTime(Math.max(0.0001, gainParam.value), now);
    gainParam.exponentialRampToValueAtTime(0.0001, now + releaseDuration);

    voice.osc.stop(now + releaseDuration + 0.05);
    setTimeout(() => {
      try {
        voice.osc.disconnect();
        voice.gain.disconnect();
      } catch {
        // ignore
      }
    }, (releaseDuration + 0.1) * 1000);

    this.activeVoices.delete(midi);
  }

  public stopAllNotes(params: SynthParams) {
    Array.from(this.activeVoices.keys()).forEach((midi) => {
      this.noteOff(midi, params);
    });
  }
}

export const synthEngine = new SynthEngine();
