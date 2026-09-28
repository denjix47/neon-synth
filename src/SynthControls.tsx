import React from 'react';
import { SynthParams, VisualizerTheme, WaveformType } from './types';
import { Sliders, Activity, Volume2, Sparkles, Layers } from 'lucide-react';

interface SynthControlsProps {
  params: SynthParams;
  onChange: (newParams: SynthParams) => void;
  theme: VisualizerTheme;
  onThemeChange: (newTheme: VisualizerTheme) => void;
}

export const SynthControls: React.FC<SynthControlsProps> = ({
  params,
  onChange,
  theme,
  onThemeChange,
}) => {
  const updateParam = <K extends keyof SynthParams>(key: K, value: SynthParams[K]) => {
    onChange({
      ...params,
      [key]: value,
    });
  };

  const waveforms: WaveformType[] = ['sawtooth', 'square', 'sine', 'triangle'];
  const themes: { id: VisualizerTheme; label: string }[] = [
    { id: 'neon-grid', label: 'Neon Grid' },
    { id: 'cosmic-spheres', label: 'Cosmic Orb' },
    { id: 'quantum-waves', label: 'Quantum Waves' },
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm tracking-wide">
          <Sliders className="w-4 h-4" />
          SYNTHESIZER PARAMETERS
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <Sparkles className="w-4 h-4 text-fuchsia-400 ml-2" />
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                theme === t.id
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            OSCILLATOR WAVEFORM
          </div>
          <div className="grid grid-cols-2 gap-2">
            {waveforms.map((wave) => (
              <button
                key={wave}
                onClick={() => updateParam('waveform', wave)}
                className={`py-2 px-3 text-xs font-mono capitalize rounded border transition-all ${
                  params.waveform === wave
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {wave}
              </button>
            ))}
          </div>

          <div className="mt-2 flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Octave Shift</span>
              <span className="text-cyan-400">{params.octave > 0 ? `+${params.octave}` : params.octave}</span>
            </div>
            <div className="flex gap-2">
              {[-2, -1, 0, 1, 2].map((oct) => (
                <button
                  key={oct}
                  onClick={() => updateParam('octave', oct)}
                  className={`flex-1 py-1 text-xs font-mono rounded border ${
                    params.octave === oct
                      ? 'bg-cyan-600 text-white border-cyan-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {oct > 0 ? `+${oct}` : oct}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Layers className="w-3.5 h-3.5 text-fuchsia-400" />
            LOW-PASS FILTER
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Cutoff Frequency</span>
              <span className="text-fuchsia-400">{Math.round(params.cutoff)} Hz</span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="10"
              value={params.cutoff}
              onChange={(e) => updateParam('cutoff', parseFloat(e.target.value))}
              className="w-full accent-fuchsia-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Resonance (Q)</span>
              <span className="text-fuchsia-400">{params.resonance.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="15"
              step="0.1"
              value={params.resonance}
              onChange={(e) => updateParam('resonance', parseFloat(e.target.value))}
              className="w-full accent-fuchsia-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ENVELOPE & OUTPUT
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Attack</span>
              <span className="text-emerald-400">{params.attack.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="1.5"
              step="0.01"
              value={params.attack}
              onChange={(e) => updateParam('attack', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Release</span>
              <span className="text-emerald-400">{params.release.toFixed(2)}s</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="2.5"
              step="0.01"
              value={params.release}
              onChange={(e) => updateParam('release', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Master Volume</span>
              <span className="text-emerald-400">{Math.round(params.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={params.volume}
              onChange={(e) => updateParam('volume', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
