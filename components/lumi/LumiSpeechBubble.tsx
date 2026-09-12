'use client';

import React from 'react';
import { useLumi } from './LumiContext';

export const LumiSpeechBubble: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { speech, isSpeechVisible, pet } = useLumi();

  if (!isSpeechVisible || !speech) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={pet}
      className={`relative px-4 py-2.5 bg-surface border-2 border-slate-200/90 rounded-2xl text-xs text-copy font-bold text-center shadow-xs cursor-pointer hover:border-primary/40 transition-all select-none animate-pop-in max-w-[260px] mx-auto ${className}`}
      title="Tap Lumi to share a moment!"
    >
      <span>"{speech}"</span>
      {/* Speech bubble pointer arrow */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface border-r-2 border-b-2 border-slate-200/90 rotate-45" />
    </div>
  );
};
