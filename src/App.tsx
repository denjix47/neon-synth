import React, { useState, useEffect } from "react";
import { SynthParams, VisualizerTheme } from "./types";
import { synthEngine } from "./synthEngine";
import { Visualizer3D } from "./Visualizer3D";
import { SynthControls } from "./SynthControls";
import { Keyboard } from "./Keyboard";
import { Music, Radio } from "lucide-react";

export default function App() {
  const [params, setParams] = useState<SynthParams>({
    waveform: 'sawtooth',
    cutoff: 3500,
    resonance: 3,
    attack: 0.05,
    release: 0.4,
    octave: 0,
    volume: 0.6,
  });

  const [theme, setTheme] = useState<VisualizerTheme>('neon-grid');
  const [activeNotesCount, setActiveNotesCount] = useState<number>(0);

  useEffect(() => {
    synthEngine.updateParams(params);
  }, [params]);

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <main className="w-full max-w-5xl flex flex-col gap-6">
        <header className="flex flex-wrap justify-between items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 shadow-inner">
              <Music className="w-5 h-5 text-sky-400" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-100">
                Studio Synth & 3D Visualizer
              </h1>
              <p className="text-xs text-zinc-400">Web Audio Polyphonic Synthesizer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div 
              role="status" 
              aria-live="polite" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300"
            >
              <Radio className={`w-3.5 h-3.5 ${activeNotesCount > 0 ? 'text-emerald-400 animate-pulse' : 'text-zinc-600'}`} aria-hidden="true" />
              <span>{activeNotesCount > 0 ? `${activeNotesCount} Note${activeNotesCount > 1 ? 's' : ''} Active` : 'Engine Ready'}</span>
            </div>
          </div>
        </header>

        <div className="w-full h-80 min-h-[320px]">
          <Visualizer3D theme={theme} activeNotesCount={activeNotesCount} />
        </div>

        <SynthControls
          params={params}
          onChange={setParams}
          theme={theme}
          onThemeChange={setTheme}
        />

        <Keyboard
          params={params}
          onActiveNotesChange={setActiveNotesCount}
        />
      </main>
    </div>
  );
}
