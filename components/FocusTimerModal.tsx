'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/sound';
import { useAuth } from '@/context/AuthContext';
import { useLumi, LumiPresenter } from './lumi';
import { Button } from './ui/Button';
import { LumiMascot } from './LumiMascot';
import {
  IconClose,
  IconPlay,
  IconPause,
  IconReset,
  IconSparkles,
} from './icons/LumiIcons';

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
  const lumi = useLumi();
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      triggerLumiReaction('focus', 'Focus sanctuary engaged. Distractions locked out!');
      lumi.setMood('FOCUSED');
      lumi.setZone('FOCUS_ZONE');
      lumi.react('FOCUS_START', 'Focus sanctuary engaged. Distractions locked out!');
    } else {
      lumi.setMood('CONTENT');
      lumi.setZone('HOME_ZONE');
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
      lumi.react('ACHIEVEMENT', 'Magnificent focus session completed! Intellect boosted.', 50);
      handleReward();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const handleReward = async () => {
    try {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-copy/60 backdrop-blur-md animate-in fade-in duration-200"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-surface rounded-3xl border-2 border-slate-200 shadow-2xl p-5 sm:p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-copy-muted hover:text-copy rounded-xl hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary z-10"
          aria-label="Close focus timer"
        >
          <IconClose size={20} />
        </button>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-lavender-soft text-[#492673] border border-primary/20 text-xs font-black mb-2">
          <IconSparkles size={14} className="text-[#522B80]" />
          <span>DEEP FOCUS SANCTUARY</span>
        </div>

        <h3 id="focus-title" className="text-xl font-black text-copy">
          Study & Deep Work with Lumi
        </h3>
        <p className="text-xs text-copy-muted max-w-xs mt-1 font-medium">
          Lumi is focused and working alongside you!
        </p>

        {/* 3D Focused Lumi Companion */}
        <div className="my-2 w-full flex items-center justify-center">
          <LumiPresenter variant="focus" height={180} interactive />
        </div>

        {/* Digital Clock Display */}
        <div className="text-5xl font-black text-copy tracking-tight my-2 font-mono tabular-nums">
          {formattedTime}
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-2 rounded-full bg-slate-100 overflow-hidden my-2 border border-slate-200"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Focus progress: ${progressPercent}%`}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-4">
          <Button
            variant={isActive ? 'accent' : 'primary'}
            size="md"
            onClick={toggleTimer}
            leftIcon={isActive ? <IconPause size={16} /> : <IconPlay size={16} />}
          >
            {isActive ? 'Pause Focus' : 'Start Focus (25m)'}
          </Button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-surface border-2 border-slate-200 text-copy-muted hover:text-copy hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Reset timer"
            aria-label="Reset timer"
          >
            <IconReset size={18} />
          </button>
        </div>

        {/* Reward disclaimer */}
        <p className="text-[11px] text-copy-muted mt-5 font-semibold">
          Completing this session awards <span className="font-bold text-primary">+50 Intellect XP</span> and <span className="font-bold text-[#875800]">+25 GP</span>!
        </p>
      </div>
    </div>
  );
};
