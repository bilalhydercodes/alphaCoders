'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  IconEnergy,
  IconStreakFlame,
  IconGoldCoin,
  IconXpGem,
  IconHeart,
} from './icons/LumiIcons';

interface UserProgressHeaderProps {
  onOpenFocus: () => void;
}

export const UserProgressHeader: React.FC<UserProgressHeaderProps> = ({ onOpenFocus }) => {
  const { user } = useAuth();

  if (!user) return null;

  const xpPercent = Math.min(100, Math.round((user.xp / (user.xpNeeded || 100)) * 100));
  const userHp = (user as any).hp ?? 100;
  const userMaxHp = (user as any).maxHp ?? 100;

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md pb-4 pt-2">
      <div className="flex items-center justify-between gap-2 sm:gap-3 max-w-full overflow-x-auto scrollbar-none pb-1">
        {/* Level & XP Gauge */}
        <div
          className="flex items-center gap-2 sm:gap-2.5 bg-surface border-2 border-slate-200 rounded-2xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 shadow-xs min-h-[40px] sm:min-h-[44px] shrink-0"
          role="progressbar"
          aria-valuenow={xpPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Level ${user.level} Progress: ${xpPercent}%`}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary text-[#1F1730] flex items-center justify-center font-black text-xs shrink-0">
            {user.level}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold text-copy mb-0.5">
              <span>LVL {user.level}</span>
              <span className="text-primary ml-2">{xpPercent}%</span>
            </div>
            <div className="w-16 sm:w-28 h-1.5 sm:h-2 bg-lavender-soft rounded-full overflow-hidden border border-primary/20">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Currency & Vitals Group */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Health Heart */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 bg-surface border-2 border-slate-200 rounded-2xl px-2 sm:px-3 py-1 sm:py-1.5 shadow-xs min-h-[40px] sm:min-h-[44px] shrink-0"
            title={`Health: ${userHp}/${userMaxHp} HP`}
            aria-label={`Health: ${userHp}/${userMaxHp} HP`}
          >
            <IconHeart size={18} filled className="text-danger sm:w-5 sm:h-5" />
            <span className="text-xs font-black text-copy hidden sm:inline">{userHp}</span>
          </div>

          {/* Energy / Focus Points */}
          <button
            type="button"
            onClick={onOpenFocus}
            className="flex items-center gap-1 sm:gap-1.5 bg-surface border-2 border-slate-200 hover:border-primary/40 rounded-2xl px-2 sm:px-3 py-1 sm:py-1.5 shadow-xs min-h-[40px] sm:min-h-[44px] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary shrink-0"
            title="Focus Energy (Start Pomodoro Sprint)"
            aria-label="Focus Energy"
          >
            <IconEnergy size={18} filled className="text-primary sm:w-5 sm:h-5" />
            <span className="text-xs font-black text-copy">5/5</span>
          </button>

          {/* Streak Flame (with animated breathing) */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 bg-surface border-2 border-slate-200 rounded-2xl px-2 sm:px-3 py-1 sm:py-1.5 shadow-xs min-h-[40px] sm:min-h-[44px] shrink-0"
            title={`${user.streak} Day Guild Streak`}
            aria-label={`${user.streak} Day Streak`}
          >
            <IconStreakFlame size={18} filled className="text-accent animate-flame-breathe sm:w-5 sm:h-5" />
            <span className="text-xs font-black text-copy">{user.streak}d</span>
          </div>

          {/* Gold Coins */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 bg-surface border-2 border-accent/40 rounded-2xl px-2 sm:px-3 py-1 sm:py-1.5 shadow-xs min-h-[40px] sm:min-h-[44px] shrink-0"
            title="Bounty Gold (GP)"
            aria-label={`${user.gold} Gold Coins`}
          >
            <IconGoldCoin size={18} filled className="text-accent sm:w-5 sm:h-5" />
            <span className="text-xs font-black text-copy">{user.gold}</span>
          </div>

          {/* XP Gems - Target for Ballistic Arc */}
          <div
            id="header-xp-pill"
            className="flex items-center gap-1 sm:gap-1.5 bg-surface border-2 border-primary/30 rounded-2xl px-2 sm:px-3 py-1 sm:py-1.5 shadow-xs min-h-[40px] sm:min-h-[44px] transition-transform duration-200 shrink-0"
            title="Experience Points (XP)"
            aria-label={`${user.xp} Experience Points`}
          >
            <IconXpGem size={18} filled className="text-primary sm:w-5 sm:h-5" />
            <span className="text-xs font-black text-primary">{user.xp}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
