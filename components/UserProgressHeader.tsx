'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  IconEnergy,
  IconStreak,
  IconGold,
  IconXp,
} from './icons/LumiIcons';

interface UserProgressHeaderProps {
  onOpenFocus: () => void;
}

export const UserProgressHeader: React.FC<UserProgressHeaderProps> = ({ onOpenFocus }) => {
  const { user } = useAuth();

  if (!user) return null;

  const xpPercent = Math.min(100, Math.round((user.xp / (user.xpNeeded || 100)) * 100));

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md pb-4 pt-2">
      <div className="flex items-center justify-between gap-3 max-w-full">
        {/* Level & XP Gauge */}
        <div className="flex items-center gap-2.5 bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-1.5 shadow-xs">
          <div className="w-7 h-7 rounded-xl bg-primary text-primary-on flex items-center justify-center font-black text-xs">
            {user.level}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-copy mb-0.5">
              <span>LEVEL {user.level}</span>
              <span className="text-primary ml-2">{xpPercent}%</span>
            </div>
            <div className="w-24 sm:w-28 h-2 bg-lavender-soft rounded-full overflow-hidden border border-primary/20">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Currency & Vitals Group */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Energy / Focus Points */}
          <button
            onClick={onOpenFocus}
            className="flex items-center gap-1.5 bg-white border-2 border-slate-200 hover:border-indigo-300 rounded-2xl px-3 py-1.5 shadow-xs transition-all cursor-pointer"
            title="Focus Energy (25m Pomodoro Sprint)"
          >
            <IconEnergy size={20} filled className="text-indigo-600" />
            <span className="text-xs font-black text-copy">5/5</span>
          </button>

          {/* Streak Flame */}
          <div
            className="flex items-center gap-1.5 bg-white border-2 border-slate-200 rounded-2xl px-3 py-1.5 shadow-xs"
            title={`${user.streak} Day Guild Streak`}
          >
            <IconStreak size={20} filled className="text-amber-500 animate-pulse-subtle" />
            <span className="text-xs font-black text-copy">{user.streak}d</span>
          </div>

          {/* Gold Coins */}
          <div
            className="flex items-center gap-1.5 bg-white border-2 border-accent/40 rounded-2xl px-3 py-1.5 shadow-xs"
            title="Bounty Gold (GP)"
          >
            <IconGold size={20} filled className="text-accent" />
            <span className="text-xs font-black text-copy">{user.gold}</span>
          </div>

          {/* XP Gems */}
          <div
            className="hidden sm:flex items-center gap-1.5 bg-white border-2 border-primary/30 rounded-2xl px-3 py-1.5 shadow-xs"
            title="Experience Points (XP)"
          >
            <IconXp size={20} filled className="text-primary" />
            <span className="text-xs font-black text-primary">{user.xp} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
};
