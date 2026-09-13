'use client';

import React from 'react';
import { IconClose, IconKeyboard } from './icons/LumiIcons';

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
    { key: '1', description: 'Navigate to Quest Map' },
    { key: '2', description: 'Navigate to Bounties tab' },
    { key: '3', description: 'Navigate to Guild League tab' },
    { key: '4', description: 'Navigate to Guild Emporium (Shop)' },
    { key: '5', description: 'Navigate to Character Codex & Stats' },
    { key: '6', description: 'Navigate to Adventurer Profile & Chronicles' },
    { key: 'F', description: 'Open Focus Mode Pomodoro timer' },
    { key: 'M', description: 'Toggle procedural chimes (Mute/Unmute)' },
    { key: 'Esc', description: 'Close any active modal or menu' },
    { key: '?', description: 'Display this keyboard shortcuts cheatsheet' },
    { key: 'Tab', description: 'Navigate through accessible interactive elements' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-copy/50 backdrop-blur-xs animate-in fade-in duration-200"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-surface rounded-3xl border-2 border-slate-200 shadow-2xl p-5 sm:p-7 animate-in zoom-in-95 duration-200 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-copy-muted hover:text-copy rounded-xl hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary z-10"
          aria-label="Close keyboard shortcuts"
        >
          <IconClose size={20} />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-lavender-soft text-primary flex items-center justify-center">
            <IconKeyboard size={20} />
          </div>
          <h3 id="shortcuts-title" className="text-base font-black text-copy">
            Keyboard Navigation & Hotkeys
          </h3>
        </div>

        <p className="text-xs text-copy-muted mb-4 font-medium">
          Lumi is built to be accessible via keyboard tab traversal. Use these shortcuts for swift guild navigation:
        </p>

        <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-background border border-slate-200 text-xs"
            >
              <span className="text-copy font-bold">{s.description}</span>
              <kbd className="px-2.5 py-1 rounded-xl bg-surface border-2 border-slate-200 font-mono text-[11px] font-black text-primary shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
