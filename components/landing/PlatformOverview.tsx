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
        {/* Main Headline */}
        <div className="max-w-4xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-[#1F1730] tracking-[-0.035em] leading-[1.04] font-headline">
            Turn daily habits into an RPG — earn XP for real-life tasks
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#5C5070] font-medium leading-relaxed max-w-2xl">
            Instead of dry to-do lists, your habits, study sessions, and projects directly level up an in-game character with real attributes and tangible momentum.
          </p>
          <p id="what-is-gamified-habit-tracker" className="mt-4 text-base sm:text-lg text-[#5C5070] font-medium leading-relaxed max-w-2xl">
            A gamified habit tracker is a productivity app that applies game mechanics — experience points, levels, streaks, and virtual rewards — to real-world tasks like studying, exercising, and daily routines. Life RPG takes this further with a non-linear leveling engine, 5 trainable character attributes (Intellect, Strength, Agility, Vitality, Spirit), boss raids driven by task completion, and Lumi, an autonomous 3D companion who reacts to your progress in real time.
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
              Turn to-do lists into game quests
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
              5 real-life character attributes
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
              Lumi — your 3D study companion
            </h3>
            <p className="mt-3 text-sm text-[#5C5070] leading-relaxed font-normal">
              A living companion on your screen that tracks your streaks, reacts to your focus sessions, and prevents burnout with well-timed breaks.
            </p>
          </div>
        </div>

        {/* SEO/AEO Semantic Block */}
        <article className="text-sm text-[#5C5070]/80 leading-relaxed max-w-3xl mt-12">
          <h3 id="how-it-works" className="font-semibold text-[#1F1730] mb-2">How Life RPG works</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Create a bounty (task) and assign it to one of 5 attributes</li>
            <li>Complete the task to earn XP, gold, and deal damage to the guild boss</li>
            <li>Level up your character and unlock gear in the Guild Emporium</li>
            <li>Track your growth across Intellect, Strength, Agility, Vitality, and Spirit</li>
          </ol>
        </article>

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
    </section>
  );
};
