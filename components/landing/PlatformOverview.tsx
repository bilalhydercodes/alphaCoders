'use client';

import React from 'react';

interface PlatformOverviewProps {
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const PlatformOverview: React.FC<PlatformOverviewProps> = ({ onOpenAuth }) => {
  return (
    <section
      id="about-platform"
      aria-label="About Life RPG Platform"
      className="relative z-20 w-full bg-draft-paper py-16 sm:py-24 px-4 sm:px-8 md:px-12 lg:px-16 select-none"
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Top Minimal Drafting Markup */}
        <div className="w-full flex items-center justify-between pb-4 mb-8 text-xs font-draft-mono text-[#7A6F8C] tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#9966CC] border border-[#2E2438]" />
            <span className="font-semibold text-[#1F1730]">LIFE RPG OVERVIEW</span>
          </div>
          <div className="font-draft-mono text-[11px] text-[#7A6F8C]">
            X 334.40 / Y 214.40
          </div>
        </div>

        {/* Main Headline & Human Pitch */}
        <div className="max-w-4xl">
          <div className="inline-block px-2.5 py-0.5 border border-dashed border-[#9966CC]/50 text-[#7A4BC2] font-pencil text-base sm:text-lg -rotate-1 bg-[#EADFFF]/50 mb-4">
            ~ real habits, real character growth
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-[#1F1730] tracking-[-0.035em] leading-[1.04] font-headline">
            A workspace that turns your daily life into a playable role-playing game.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#5C5070] font-medium leading-relaxed max-w-2xl">
            Instead of dry to-do lists, your habits, study sessions, and projects directly level up an in-game character with real attributes and tangible momentum.
          </p>
        </div>

        {/* 3 Clear Structural Cards (Ghost White surface, Amethyst accents) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Card 1: Quests */}
          <div className="bg-white border border-[#E2D9F3] hover:border-[#9966CC]/40 rounded-none p-6 sm:p-8 flex flex-col justify-start shadow-xs transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#9966CC] border border-[#2E2438]" />
              <span className="font-draft-mono text-xs font-bold text-[#9966CC] tracking-wider">
                01
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1F1730] tracking-tight font-headline">
              Tasks become quests
            </h3>
            <p className="mt-3 text-sm text-[#5C5070] leading-relaxed font-normal">
              Turn overwhelming to-dos into manageable quests with clear difficulty tiers, XP, and gold rewards. Every task checked off advances your campaign.
            </p>
          </div>

          {/* Card 2: Stats */}
          <div className="bg-white border border-[#E2D9F3] hover:border-[#9966CC]/40 rounded-none p-6 sm:p-8 flex flex-col justify-start shadow-xs transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#9966CC] border border-[#2E2438]" />
              <span className="font-draft-mono text-xs font-bold text-[#9966CC] tracking-wider">
                02
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1F1730] tracking-tight font-headline">
              Real character stats
            </h3>
            <p className="mt-3 text-sm text-[#5C5070] leading-relaxed font-normal">
              Reading builds Intellect. Workouts raise Vitality. Focused coding builds Strength. Your character stats physically mirror your real-world routine.
            </p>
          </div>

          {/* Card 3: Mascot Companion */}
          <div className="bg-white border border-[#E2D9F3] hover:border-[#9966CC]/40 rounded-none p-6 sm:p-8 flex flex-col justify-start shadow-xs transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#9966CC] border border-[#2E2438]" />
              <span className="font-draft-mono text-xs font-bold text-[#9966CC] tracking-wider">
                03
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1F1730] tracking-tight font-headline">
              Lumi keeps momentum
            </h3>
            <p className="mt-3 text-sm text-[#5C5070] leading-relaxed font-normal">
              A living companion on your screen that tracks your streaks, reacts to your focus sessions, and prevents burnout with well-timed breaks.
            </p>
          </div>
        </div>

        {/* Clean CTA Row with Brand Amethyst (#9966CC) */}
        <div className="mt-10 pt-6 flex items-center justify-start">
          <button
            type="button"
            onClick={() => onOpenAuth?.('register')}
            className="inline-flex items-center justify-center px-7 h-[46px] text-xs font-bold text-white bg-[#9966CC] hover:bg-[#8B54C2] active:bg-[#7A4BC2] border border-[#2E2438] rounded-none shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            Start your first quest
          </button>
        </div>
      </div>

      {/* Seamless bottom blend into next section */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-[#F8F8FF]/80 to-[#F8F8FF] pointer-events-none z-0" />
    </section>
  );
};
