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
octave: 0,
    volume: 0.6,
  });

  const [theme, setTheme] = useState<VisualizerTheme>('neon-grid');
  const [activeNotesCount, setActiveNotesCount] = useState<number>(0);

  useEffect(() => {
    synthEngine.updateParams(params);
  }, [params]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <header className="flex flex-wrap justify-between items-center gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-fuchsia-500 rounded-lg text-slate-950 shadow-md">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                NEON SYNTH 3D
              </h1>
              <p className="text-xs text-slate-400">Interactive Web Audio Synthesizer & Audio-Reactive Visualizer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono">
              <Radio className={`w-3.5 h-3.5 ${activeNotesCount > 0 ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
              <span>{activeNotesCount > 0 ? `${activeNotesCount} NOTE(S) ACTIVE` : 'READY'}</span>
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
      </div>
    </div>
  );
}
