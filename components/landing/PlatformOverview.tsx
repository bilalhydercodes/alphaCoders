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
      className="relative z-20 w-full bg-draft-paper border-t border-b border-[#262524] py-20 sm:py-28 px-4 sm:px-8 md:px-12 select-none"
    >
      <div className="max-w-[1360px] mx-auto">
        {/* Top Technical Metadata Bar */}
        <div className="w-full flex items-center justify-between border-b border-[#262524]/40 pb-3 mb-10 text-xs font-draft-mono text-[#6E6454] tracking-wider">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[#262524]" />
            <span className="font-bold text-[#262524]">SPECIFICATION // 01</span>
            <span className="opacity-40">|</span>
            <span>PLATFORM ARCHITECTURE</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>INDEX: WORKSPACE-OS</span>
            <span className="opacity-40">|</span>
            <span>X 334.40 / Y 214.40</span>
          </div>
        </div>

        {/* Main Headline & Human Pitch */}
        <div className="max-w-4xl">
          <div className="inline-block px-2 py-0.5 border border-dashed border-[#7E7464] text-[#554C3E] font-pencil text-base sm:text-lg -rotate-1 bg-[#E0D8C7]/70 mb-4">
            ~ real habits, real character growth
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-[#222120] tracking-[-0.035em] leading-[1.04] font-headline">
            A workspace that turns your daily life into a playable role-playing game.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-[#554C3E] font-medium leading-relaxed max-w-2xl">
            Instead of dry to-do lists, your habits, study sessions, and projects directly level up an in-game character with real attributes and tangible momentum.
          </p>
        </div>

        {/* 3 Clear Structural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {/* Card 1: Quests */}
          <div className="bg-[#F2ECE1] border border-[#262524] rounded-none p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="font-draft-mono text-xs font-bold text-[#7A7060] tracking-widest uppercase mb-3">
                01 // QUEST ENGINE
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#222120] tracking-tight font-headline">
                Tasks become quests
              </h3>
              <p className="mt-3 text-sm text-[#554C3E] leading-relaxed font-normal">
                Turn overwhelming to-dos into manageable quests with clear difficulty tiers, XP, and gold rewards. Every task checked off advances your campaign.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262524]/20 flex items-center justify-between font-draft-mono text-[11px] text-[#6E6454]">
              <span>SYSTEM: QUEST_LOG</span>
              <span>+XP / +GOLD</span>
            </div>
          </div>

          {/* Card 2: Stats */}
          <div className="bg-[#F2ECE1] border border-[#262524] rounded-none p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="font-draft-mono text-xs font-bold text-[#7A7060] tracking-widest uppercase mb-3">
                02 // ATTRIBUTES
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#222120] tracking-tight font-headline">
                Real character stats
              </h3>
              <p className="mt-3 text-sm text-[#554C3E] leading-relaxed font-normal">
                Reading builds Intellect. Workouts raise Vitality. Focused coding builds Strength. Your character stats physically mirror your real-world routine.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262524]/20 flex items-center justify-between font-draft-mono text-[11px] text-[#6E6454]">
              <span>SYSTEM: 5_ATTRIBUTES</span>
              <span>LIVE SYNC</span>
            </div>
          </div>

          {/* Card 3: Mascot Companion */}
          <div className="bg-[#F2ECE1] border border-[#262524] rounded-none p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="font-draft-mono text-xs font-bold text-[#7A7060] tracking-widest uppercase mb-3">
                03 // LUMI MASCOT
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-[#222120] tracking-tight font-headline">
                Lumi keeps momentum
              </h3>
              <p className="mt-3 text-sm text-[#554C3E] leading-relaxed font-normal">
                A living companion on your screen that tracks your streaks, reacts to your focus sessions, and prevents burnout with well-timed breaks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262524]/20 flex items-center justify-between font-draft-mono text-[11px] text-[#6E6454]">
              <span>SYSTEM: MASCOT_AI</span>
              <span>AUTONOMOUS</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Row */}
        <div className="mt-12 pt-8 border-t border-[#262524]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="font-draft-mono text-xs text-[#6E6454]">
            NO COMPLEX SETUP. START PLAYING IN UNDER 60 SECONDS.
          </div>

          <button
            type="button"
            onClick={() => onOpenAuth?.('register')}
            className="inline-flex items-center justify-center px-6 h-[44px] text-xs font-bold text-white bg-[#7042C1] hover:bg-[#5F37A6] active:bg-[#4E2B8D] border border-[#262524] rounded-none shadow-xs transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            Start your first quest
          </button>
        </div>
      </div>
    </section>
  );
};
