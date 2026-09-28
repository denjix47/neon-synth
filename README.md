# Neon Synth

A polyphonic synthesizer that runs in the browser, with a 3D audio visualizer that reacts to your playing. It's built with React, the Web Audio API and Three.js.

## Features

- **Polyphonic synth engine**: Play full chords. Volume is balanced automatically as you add notes so chords don't clip, and a master compressor catches any peaks.
- **Four waveforms**: Sawtooth, square, sine and triangle.
- **Low-pass filter**: Controls for cutoff and resonance.
- **Envelope**: Controls for attack and release.
- **Octave shift and master volume**
- **3D visualizer**: Three themes (Neon Grid, Cosmic Spheres and Quantum Waves) that react to the audio in real time.
- **Play with your computer keyboard or by clicking**: The on-screen keys show which computer key plays each note.

## Keyboard Map

The keyboard covers C4 to E5:

| Keys  | A | W  | S | E  | D | F | T  | G | Y  | H | U  | J | K  | O   | L  | P   | ;  |
|-------|---|----|---|----|---|---|----|---|----|---|----|---|----|-----|----|-----|----|
| Notes | C | C# | D | D# | E | F | F# | G | G# | A | A# | B | C5 | C#5 | D5 | D#5 | E5 |

## Tech Stack

- [React 19](https://react.dev) + TypeScript
- [Vite](https://vite.dev)
- [Three.js](https://threejs.org) for the visualizer
- [Tailwind CSS v4](https://tailwindcss.com)
- [Lucide](https://lucide.dev) icons
- Web Audio API (no audio libraries)

## Getting Started

```bash
pnpm install
pnpm dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

> Browsers only allow audio after you interact with the page. Click or press a key once to start the sound.

### Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `pnpm dev`     | Start the dev server                 |
| `pnpm build`   | Type-check and build for production  |
| `pnpm preview` | Preview the production build         |

## Project Structure

```
src/
├── App.tsx            # App layout and state
├── Keyboard.tsx       # On-screen keyboard and computer-key input
├── SynthControls.tsx  # Waveform, filter, envelope, octave, volume and theme controls
├── Visualizer3D.tsx   # Three.js visualizer
├── synthEngine.ts     # Web Audio engine (voices, filter, compressor, analyser)
├── types.ts           # Shared types
└── main.tsx           # Entry point
```

## How the Audio Works

Each note is its own oscillator with its own volume control. From there, all notes go through the same chain:

```
Oscillator → Voice Gain → Low-pass Filter → Master Gain → Compressor → Analyser → Output
```

The visualizer reads the sound data from the analyser to drive the 3D scene.

## License

This project is licensed under the [MIT License](LICENSE) © 2026 Denji47.
