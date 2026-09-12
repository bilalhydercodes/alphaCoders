'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/sound';
import { useAuth } from '@/context/AuthContext';
import { X, Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimerComplete: () => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  onTimerComplete,
}) => {
  const { triggerLumiReaction, refreshUser } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      triggerLumiReaction('focus', 'Focus mode ON! Distractions blocked.');
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((sec) => sec - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      sound.playLevelUp();
      triggerLumiReaction('achievement', 'Magnificent focus session completed! Intellect boosted.');
      handleReward();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const handleReward = async () => {
    try {
      // Create and automatically complete a focus quest
      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '25-Minute Focus Sprint',
          description: 'Completed dedicated Pomodoro deep work session with Lumi.',
          category: 'INTELLECT',
          difficulty: 'MEDIUM',
          type: 'DAILY',
        }),
      });
      const data = await res.json();
      if (data.quest) {
        await fetch(`/api/quests/${data.quest.id}/complete`, { method: 'POST' });
        await refreshUser();
        onTimerComplete();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTimer = () => {
    sound.playClick();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsActive(false);
    setSecondsLeft(25 * 60);
    setIsCompleted(false);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = Math.round(((25 * 60 - secondsLeft) / (25 * 60)) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="focus-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-copy/60 backdrop-blur-md animate-in fade-in duration-200"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-lumi-lg border border-primary/20 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-copy-muted hover:text-copy rounded-xl hover:bg-lavender-soft transition-colors cursor-pointer"
          aria-label="Close focus timer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>DEEP FOCUS SANCTUARY</span>
        </div>

        <h3 id="focus-title" className="text-xl font-bold text-copy">
          Study & Deep Work with Lumi
        </h3>
        <p className="text-xs text-copy-muted max-w-xs mt-1">
          Lumi has her purple laptop open and is working beside you!
        </p>

        {/* Mascot */}
        <div className="w-40 h-40 my-3 flex items-center justify-center">
          <img
            src="/lumi/extracted/reaction-focus.png"
            alt="Lumi typing on purple laptop"
            className="w-full h-full object-contain drop-shadow"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/lumi/extracted/lumi-hero.png';
            }}
          />
        </div>

        {/* Digital Clock Display */}
        <div className="text-5xl font-extrabold text-copy tracking-tighter my-2 font-mono">
          {formattedTime}
        </div>

        {/* Circular / Line Progress */}
        <div className="w-full h-2 rounded-full bg-lavender-soft overflow-hidden my-2 border border-primary/15">
          <div
            className="h-full bg-gradient-to-r from-primary to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={toggleTimer}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
              isActive
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-primary text-primary-on hover:bg-primary-hover shadow-amethyst-glow'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause Focus' : 'Start Focus (25m)'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="p-3 rounded-xl bg-background border border-primary/20 text-copy-muted hover:text-copy hover:bg-lavender-soft transition-colors cursor-pointer"
            title="Reset timer"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Reward disclaimer */}
        <p className="text-[11px] text-copy-muted mt-5">
          Completing this session awards <span className="font-bold text-indigo-600">+50 Intellect XP</span> and <span className="font-bold text-accent">+25 GP</span>!
        </p>
      </div>
    </div>
  );
};
