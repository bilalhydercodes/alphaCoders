'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLumi, LumiPresenter } from './lumi';
import { Button } from './ui/Button';
import { IconHeart, IconEnergy } from './icons/LumiIcons';

interface LumiCompanionProps {
  onStartFocus: () => void;
}

export const LumiCompanion: React.FC<LumiCompanionProps> = ({ onStartFocus }) => {
  const { user } = useAuth();
  const { mood, activeMoment, react } = useLumi();

  if (!user) return null;

  return (
    <aside className="bg-surface rounded-2xl border-2 border-slate-200/80 p-5 shadow-xs relative overflow-hidden transition-all">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-lavender-soft/30 rounded-full blur-2xl pointer-events-none" />

      {/* Header status */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-copy uppercase tracking-wider">
            3D Companion
          </span>
        </div>
        <span
          className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
            activeMoment
              ? 'bg-success-soft text-success'
              : mood === 'RADIANT'
              ? 'bg-amber-100 text-amber-800'
              : mood === 'SLEEPY'
              ? 'bg-indigo-100 text-indigo-700'
              : mood === 'CONCERNED'
              ? 'bg-orange-100 text-orange-800'
              : mood === 'FOCUSED'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-lavender-soft text-primary'
          }`}
        >
          {activeMoment ? activeMoment.replace('_', ' ') : mood}
        </span>
      </div>

      {/* Real-time 3D Lumi Character System */}
      <div className="relative my-1">
        <LumiPresenter variant="dashboard" height={220} showSpeech={true} interactive={true} />
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
        <Button
          onClick={() => {
            react('FOCUS', 'Focus sprint initialized. Distractions blocked!');
            onStartFocus();
          }}
          variant="primary"
          size="md"
          fullWidth
          leftIcon={<IconEnergy size={16} />}
        >
          Start Focus Mode (Pomodoro)
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              react('SELF_CARE', 'Hydration, stretching, and rest are vital quests!');
            }}
            leftIcon={<IconHeart size={14} className="text-danger" />}
          >
            Self Care
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              react('YOU_GOT_THIS', 'A little belief and a steady pace. You got this!');
            }}
            leftIcon={<IconEnergy size={14} className="text-accent" />}
          >
            Encourage
          </Button>
        </div>
      </div>
    </aside>
  );
};
