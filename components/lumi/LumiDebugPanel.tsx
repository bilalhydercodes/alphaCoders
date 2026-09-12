'use client';

import React, { useState, useEffect } from 'react';
import { useLumi } from './LumiContext';
import { LumiMood, LumiMoment, LumiSpatialAnchor, LumiAnimation } from './LumiTypes';

export const LumiDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mood, setMood, react, moveTo, activeMoment } = useLumi();

  // Keyboard shortcut Ctrl+Shift+L to toggle debug drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Only active in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const moods: LumiMood[] = [
    'CONTENT',
    'RADIANT',
    'SLEEPY',
    'CONCERNED',
    'WILTING',
    'FOCUSED',
    'SLEEPING',
  ];

  const moments: LumiMoment[] = [
    'QUEST_COMPLETE',
    'LEVEL_UP',
    'ACHIEVEMENT',
    'COIN_EARNED',
    'EXPLORE',
    'SELF_CARE',
    'YOU_GOT_THIS',
    'FOCUS',
    'STREAK_MILESTONE',
    'SHOP_TRY_ON',
    'REST_DAY',
    'ERROR',
  ];

  const anchors: LumiSpatialAnchor[] = ['home', 'quest', 'focus', 'shop', 'codex', 'empty'];

  return (
    <>
      {/* Small floating toggle button in bottom-right */}
      <div className="fixed bottom-20 right-4 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-1 bg-primary text-[#1F1730] font-black text-[11px] rounded-full shadow-lg border border-primary/40 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
          title="Toggle 3D Lumi Debug Panel (Ctrl+Shift+L)"
        >
          {isOpen ? '✕ Close Lumi 3D Debug' : '⚙ 3D Lumi Debug'}
        </button>
      </div>

      {/* Floating Drawer */}
      {isOpen && (
        <div className="fixed bottom-32 right-4 z-50 w-80 max-h-[75vh] overflow-y-auto bg-surface/95 backdrop-blur-md rounded-2xl border-2 border-primary/30 p-4 shadow-2xl text-xs font-sans animate-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
            <span className="font-black text-copy uppercase tracking-wider">3D Lumi Controller</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
              Active: {activeMoment || mood}
            </span>
          </div>

          {/* Test Ambient Moods */}
          <div className="mb-3">
            <p className="text-[10px] font-black text-copy-muted uppercase mb-1.5">Set Persistent Mood</p>
            <div className="grid grid-cols-2 gap-1">
              {moods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border text-left transition-all ${
                    mood === m
                      ? 'bg-primary text-[#1F1730] border-primary font-black shadow-xs'
                      : 'border-slate-200 text-copy hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Test Moment Reactions */}
          <div className="mb-3">
            <p className="text-[10px] font-black text-copy-muted uppercase mb-1.5">Trigger Moment Event</p>
            <div className="grid grid-cols-2 gap-1">
              {moments.map((evt) => (
                <button
                  key={evt}
                  type="button"
                  onClick={() => react(evt)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 text-copy hover:bg-lavender-soft/60 active:scale-95 text-left transition-all truncate"
                  title={`Trigger ${evt}`}
                >
                  {evt.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Test Movement Anchors */}
          <div>
            <p className="text-[10px] font-black text-copy-muted uppercase mb-1.5">Spatial Anchors</p>
            <div className="grid grid-cols-3 gap-1">
              {anchors.map((anc) => (
                <button
                  key={anc}
                  type="button"
                  onClick={() => moveTo(anc)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 text-copy hover:bg-slate-100 capitalize text-center"
                >
                  {anc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
