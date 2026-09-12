'use client';

import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Q', description: 'Post new bounty (New Quest modal)' },
    { key: '1', description: 'Navigate to Quests Board tab' },
    { key: '2', description: 'Navigate to Character Codex & Stats tab' },
    { key: '3', description: 'Navigate to Guild Emporium (Shop) tab' },
    { key: '4', description: 'Navigate to Dungeon Raid Boss tab' },
    { key: 'F', description: 'Open Focus Mode Pomodoro timer' },
    { key: 'M', description: 'Toggle procedural Web Audio chimes (Mute/Unmute)' },
    { key: 'Esc', description: 'Close any active modal or menu' },
    { key: '?', description: 'Display this keyboard shortcuts cheatsheet' },
    { key: 'Tab', description: 'Navigate through accessible interactive elements' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-copy/50 backdrop-blur-sm animate-in fade-in duration-200"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-lumi-lg border border-primary/20 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-copy-muted hover:text-copy rounded-xl hover:bg-lavender-soft transition-colors cursor-pointer"
          aria-label="Close keyboard shortcuts"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-lavender-soft text-primary flex items-center justify-center">
            <Keyboard className="w-4 h-4" />
          </div>
          <h3 id="shortcuts-title" className="text-base font-bold text-copy">
            Keyboard Navigation & Hotkeys
          </h3>
        </div>

        <p className="text-xs text-copy-muted mb-4">
          Life RPG is built to be 100% accessible via keyboard navigation. Use these shortcuts for swift guild operations:
        </p>

        <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-primary/10 text-xs"
            >
              <span className="text-copy font-medium">{s.description}</span>
              <kbd className="px-2 py-1 rounded bg-white border border-primary/20 font-mono text-[11px] font-bold text-primary shadow-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
