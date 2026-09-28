import React, { useEffect, useState, useRef } from 'react';
import { PianoNote, SynthParams } from './types';
import { synthEngine } from './synthEngine';

interface KeyboardProps {
  params: SynthParams;
  onActiveNotesChange: (count: number) => void;
}

const NOTES_LIST: PianoNote[] = [
  { note: 'C', midi: 60, isBlack: false, keyChar: 'A', frequency: 261.63 },
  { note: 'C#', midi: 61, isBlack: true, keyChar: 'W', frequency: 277.18 },
  { note: 'D', midi: 62, isBlack: false, keyChar: 'S', frequency: 293.66 },
  { note: 'D#', midi: 63, isBlack: true, keyChar: 'E', frequency: 311.13 },
  { note: 'E', midi: 64, isBlack: false, keyChar: 'D', frequency: 329.63 },
  { note: 'F', midi: 65, isBlack: false, keyChar: 'F', frequency: 349.23 },
  { note: 'F#', midi: 66, isBlack: true, keyChar: 'T', frequency: 369.99 },
  { note: 'G', midi: 67, isBlack: false, keyChar: 'G', frequency: 392.00 },
  { note: 'G#', midi: 68, isBlack: true, keyChar: 'Y', frequency: 415.30 },
  { note: 'A', midi: 69, isBlack: false, keyChar: 'H', frequency: 440.00 },
  { note: 'A#', midi: 70, isBlack: true, keyChar: 'U', frequency: 466.16 },
  { note: 'B', midi: 71, isBlack: false, keyChar: 'J', frequency: 493.88 },
  { note: 'C5', midi: 72, isBlack: false, keyChar: 'K', frequency: 523.25 },
  { note: 'C#5', midi: 73, isBlack: true, keyChar: 'O', frequency: 554.37 },
  { note: 'D5', midi: 74, isBlack: false, keyChar: 'L', frequency: 587.33 },
  { note: 'D#5', midi: 75, isBlack: true, keyChar: 'P', frequency: 622.25 },
  { note: 'E5', midi: 76, isBlack: false, keyChar: ';', frequency: 659.25 }
];

export const Keyboard: React.FC<KeyboardProps> = ({ params, onActiveNotesChange }) => {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    onActiveNotesChange(activeNotes.size);
  }, [activeNotes.size, onActiveNotesChange]);

  const triggerNoteOn = (midi: number) => {
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.add(midi);
      return next;
    });
    synthEngine.noteOn(midi, paramsRef.current);
  };

  const triggerNoteOff = (midi: number) => {
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
    synthEngine.noteOff(midi, paramsRef.current);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toUpperCase();
      const match = NOTES_LIST.find((n) => n.keyChar === key);
      if (match) {
        triggerNoteOn(match.midi);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const match = NOTES_LIST.find((n) => n.keyChar === key);
      if (match) {
        triggerNoteOff(match.midi);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      synthEngine.stopAllNotes(paramsRef.current);
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Interactive Keybed</h3>
        <span className="text-xs text-slate-500 font-mono">Use Mouse or A W S E D F T G Y H U J K O L P ;</span>
      </div>
      <div className="relative flex justify-center items-start h-40 select-none overflow-x-auto py-2">
        {NOTES_LIST.map((note) => {
          const isActive = activeNotes.has(note.midi);
          
          if (note.isBlack) {
            const index = NOTES_LIST.indexOf(note);
            const whiteBefore = NOTES_LIST.slice(0, index).filter(n => !n.isBlack).length;
            const leftPos = `calc(${whiteBefore * 10}% - 14px)`;

            return (
              <button
                key={note.midi}
                onMouseDown={() => triggerNoteOn(note.midi)}
                onMouseUp={() => triggerNoteOff(note.midi)}
                onMouseLeave={() => activeNotes.has(note.midi) && triggerNoteOff(note.midi)}
                onTouchStart={(e) => { e.preventDefault(); triggerNoteOn(note.midi); }}
                onTouchEnd={(e) => { e.preventDefault(); triggerNoteOff(note.midi); }}
                className={`absolute z-10 w-7 h-24 rounded-b border-x border-b border-black shadow-md transition-all duration-75 flex flex-col justify-end pb-2 items-center ${
                  isActive
                    ? 'bg-fuchsia-600 border-fuchsia-800 shadow-inner'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-950'
                }`}
                style={{ left: leftPos }}
              >
                <span className="text-[10px] font-mono text-slate-400">{note.keyChar}</span>
              </button>
            );
          } else {
            return (
              <button
                key={note.midi}
                onMouseDown={() => triggerNoteOn(note.midi)}
                onMouseUp={() => triggerNoteOff(note.midi)}
                onMouseLeave={() => activeNotes.has(note.midi) && triggerNoteOff(note.midi)}
                onTouchStart={(e) => { e.preventDefault(); triggerNoteOn(note.midi); }}
                onTouchEnd={(e) => { e.preventDefault(); triggerNoteOff(note.midi); }}
                className={`flex-1 min-w-[36px] max-w-[48px] h-36 rounded-b border border-slate-700/60 transition-all duration-75 flex flex-col justify-end pb-3 items-center ${
                  isActive
                    ? 'bg-gradient-to-t from-cyan-500 to-cyan-300 text-slate-900 border-cyan-400 shadow-inner translate-y-0.5'
                    : 'bg-white hover:bg-slate-100 text-slate-800 shadow-md'
                }`}
              >
                <span className="text-[11px] font-bold font-mono select-none opacity-80">{note.keyChar}</span>
              </button>
            );
          }
        })}
      </div>
    </div>
  );
};
