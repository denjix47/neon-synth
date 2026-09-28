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

  const waveforms: { id: WaveformType; label: string }[] = [
    { id: 'sawtooth', label: 'Sawtooth' },
    { id: 'square', label: 'Square' },
    { id: 'sine', label: 'Sine' },
    { id: 'triangle', label: 'Triangle' },
  ];

  const themes: { id: VisualizerTheme; label: string }[] = [
    { id: 'neon-grid', label: 'Grid' },
    { id: 'cosmic-spheres', label: 'Orb' },
    { id: 'quantum-waves', label: 'Waves' },
  ];

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm tracking-wide">
          <Sliders className="w-4 h-4 text-sky-400" aria-hidden="true" />
          <span>SYNTH CONTROLS</span>
        </div>

        <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800" role="toolbar" aria-label="Visualizer Display Modes">
          <Sparkles className="w-4 h-4 text-zinc-400 ml-2" aria-hidden="true" />
          <span className="text-xs text-zinc-400 mr-1">Display:</span>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={theme === t.id}
              onClick={() => onThemeChange(t.id)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                theme === t.id
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-3 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-zinc-300">
            <Activity className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span>OSCILLATOR WAVEFORM</span>
          </div>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Oscillator Waveform">
            {waveforms.map((wave) => (
              <button
                key={wave.id}
                type="button"
                role="radio"
                aria-checked={params.waveform === wave.id}
                onClick={() => updateParam('waveform', wave.id)}
                className={`py-2 px-3 text-xs font-medium rounded border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  params.waveform === wave.id
                    ? 'bg-sky-500 text-zinc-950 border-sky-400 font-bold shadow-sm'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-zinc-100'
                }`}
              >
                {wave.label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-300">
              <span>Octave</span>
              <span className="font-mono text-zinc-100">{params.octave > 0 ? `+${params.octave}` : params.octave}</span>
            </div>
            <div className="flex gap-1.5" role="group" aria-label="Octave Transpose">
              {[-2, -1, 0, 1, 2].map((oct) => (
                <button
                  key={oct}
                  type="button"
                  aria-label={`Set octave to ${oct > 0 ? `+${oct}` : oct}`}
                  aria-pressed={params.octave === oct}
                  onClick={() => updateParam('octave', oct)}
                  className={`flex-1 py-1.5 text-xs font-mono rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    params.octave === oct
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-200 font-bold'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {oct > 0 ? `+${oct}` : oct}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-zinc-300">
            <Layers className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span>LOW-PASS FILTER</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-300">
              <label htmlFor="filter-cutoff" className="cursor-pointer">Cutoff Frequency</label>
              <span className="font-mono text-zinc-100">{Math.round(params.cutoff)} Hz</span>
            </div>
            <input
              id="filter-cutoff"
              type="range"
              min="100"
              max="10000"
              step="10"
              value={params.cutoff}
              aria-label="Filter Cutoff Frequency"
              aria-valuemin={100}
              aria-valuemax={10000}
              aria-valuenow={params.cutoff}
              aria-valuetext={`${Math.round(params.cutoff)} Hertz`}
              onChange={(e) => updateParam('cutoff', parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-zinc-800 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-300">
              <label htmlFor="filter-resonance" className="cursor-pointer">Resonance (Q)</label>
              <span className="font-mono text-zinc-100">{params.resonance.toFixed(1)}</span>
            </div>
            <input
              id="filter-resonance"
              type="range"
              min="0.1"
              max="15"
              step="0.1"
              value={params.resonance}
              aria-label="Filter Resonance Q"
              aria-valuemin={0.1}
              aria-valuemax={15}
              aria-valuenow={params.resonance}
              aria-valuetext={`${params.resonance.toFixed(1)} Q factor`}
              onChange={(e) => updateParam('resonance', parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-zinc-800 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-zinc-300">
            <Volume2 className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span>ENVELOPE & VOLUME</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-300">
              <label htmlFor="envelope-attack" className="cursor-pointer">Attack Time</label>
              <span className="font-mono text-zinc-100">{params.attack.toFixed(2)}s</span>
            </div>
            <input
              id="envelope-attack"
              type="range"
              min="0.01"
              max="1.5"
              step="0.01"
              value={params.attack}
              aria-label="Attack Time"
              aria-valuemin={0.01}
              aria-valuemax={1.5}
              aria-valuenow={params.attack}
              aria-valuetext={`${params.attack.toFixed(2)} seconds`}
              onChange={(e) => updateParam('attack', parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-zinc-800 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-300">
              <label htmlFor="envelope-release" className="cursor-pointer">Release Time</label>
              <span className="font-mono text-zinc-100">{params.release.toFixed(2)}s</span>
            </div>
            <input
              id="envelope-release"
              type="range"
              min="0.01"
              max="2.5"
              step="0.01"
              value={params.release}
              aria-label="Release Time"
              aria-valuemin={0.01}
              aria-valuemax={2.5}
              aria-valuenow={params.release}
              aria-valuetext={`${params.release.toFixed(2)} seconds`}
              onChange={(e) => updateParam('release', parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-zinc-800 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-300">
              <label htmlFor="master-volume" className="cursor-pointer">Master Volume</label>
              <span className="font-mono text-zinc-100">{Math.round(params.volume * 100)}%</span>
            </div>
            <input
              id="master-volume"
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={params.volume}
              aria-label="Master Volume"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={params.volume}
              aria-valuetext={`${Math.round(params.volume * 100)} percent`}
              onChange={(e) => updateParam('volume', parseFloat(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-zinc-800 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
