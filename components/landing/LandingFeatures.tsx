'use client';

import React from 'react';
import {
  IconMap,
  IconBounties,
  IconLeague,
  IconShop,
  IconCodex,
  IconEnergy,
} from '../icons/LumiIcons';

export const LandingFeatures: React.FC = () => {
  return (
    <section
      id="features"
      className="py-20 sm:py-24 px-4 sm:px-8 md:px-12 lg:px-16 bg-draft-paper scroll-mt-20 select-none"
      aria-label="Core RPG Features"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-5xl font-semibold text-[#1F1730] tracking-[-0.035em] leading-[1.06] font-headline">
            Features built for real-life mastery
          </h2>
          <p className="text-base sm:text-lg text-[#5C5070] font-medium mt-3 leading-relaxed max-w-2xl">
            Every system in Life RPG connects your productive habits, study sessions, and milestones into an active role-playing engine.
          </p>
        </div>

        {/* 6 Core Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Interactive Quest Map */}
          <div
            id="quest-map"
            className="bg-white border border-[#E2D9F3] hover:border-[#9966CC]/50 rounded-none p-6 sm:p-7 shadow-xs transition-colors flex flex-col justify-start"
          >
            <div className="w-10 h-10 bg-[#F4EFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-5 shrink-0">
              <IconMap size={20} className="text-[#1F1730]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F1730] tracking-tight font-headline">
              Interactive Quest Map
            </h3>
            <p className="text-sm text-[#5C5070] font-normal mt-2.5 leading-relaxed">
              Progress node-by-node across chapters that break intimidating long-term life goals into clear, achievable daily milestones.
            </p>
          </div>

          {/* 2. Bounty Board & Habit Engine */}
          <div
            id="bounties"
            className="bg-white border border-[#E2D9F3] hover:border-[#9966CC]/50 rounded-none p-6 sm:p-7 shadow-xs transition-colors flex flex-col justify-start"
          >
            <div className="w-10 h-10 bg-[#F4EFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-5 shrink-0">
              <IconBounties size={20} className="text-[#1F1730]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F1730] tracking-tight font-headline">
              Tactile Bounty Board
            </h3>
            <p className="text-sm text-[#5C5070] font-normal mt-2.5 leading-relaxed">
              Log recurring habits and urgent bounties with immediate tactile response, streak multipliers, and XP rewards.
            </p>
          </div>

          {/* 3. Guild League & Boss Raids */}
          <div
            id="league"
            className="bg-white border border-[#E2D9F3] hover:border-[#9966CC]/50 rounded-none p-6 sm:p-7 shadow-xs transition-colors flex flex-col justify-start"
          >
            <div className="w-10 h-10 bg-[#F4EFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-5 shrink-0">
              <IconLeague size={20} className="text-[#1F1730]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F1730] tracking-tight font-headline">
              Guild League & Raids
            </h3>
            <p className="text-sm text-[#5C5070] font-normal mt-2.5 leading-relaxed">
              Compete across weekly divisions from Bronze to Legend, and team up with fellow guild members to take down cooperative boss raids.
            </p>
          </div>

          {/* 4. Guild Emporium (Economy) */}
          <div
            id="emporium"
            className="bg-white border border-[#E2D9F3] hover:border-[#9966CC]/50 rounded-none p-6 sm:p-7 shadow-xs transition-colors flex flex-col justify-start"
          >
            <div className="w-10 h-10 bg-[#F4EFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-5 shrink-0">
              <IconShop size={20} className="text-[#1F1730]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F1730] tracking-tight font-headline">
              Guild Emporium Economy
            </h3>
            <p className="text-sm text-[#5C5070] font-normal mt-2.5 leading-relaxed">
              Reinvest earned Bounty Gold into cosmetic gear, custom titles, companion scarves, and restorative elixirs in the marketplace.
            </p>
          </div>

          {/* 5. Character Codex & 5 Attributes */}
          <div
            id="codex"
            className="bg-white border border-[#E2D9F3] hover:border-[#9966CC]/50 rounded-none p-6 sm:p-7 shadow-xs transition-colors flex flex-col justify-start"
          >
            <div className="w-10 h-10 bg-[#F4EFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-5 shrink-0">
              <IconCodex size={20} className="text-[#1F1730]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F1730] tracking-tight font-headline">
              Character Codex & Stats
            </h3>
            <p className="text-sm text-[#5C5070] font-normal mt-2.5 leading-relaxed">
              Cultivate balance across 5 attributes: Intellect, Strength, Agility, Vitality, and Spirit. Track your lifetime growth charts.
            </p>
          </div>

          {/* 6. Focus Sanctuary (Pomodoro) */}
          <div
            id="focus"
            className="bg-white border border-[#E2D9F3] hover:border-[#9966CC]/50 rounded-none p-6 sm:p-7 shadow-xs transition-colors flex flex-col justify-start"
          >
            <div className="w-10 h-10 bg-[#F4EFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-5 shrink-0">
              <IconEnergy size={20} className="text-[#1F1730]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1F1730] tracking-tight font-headline">
              Focus Mode Sanctuary
            </h3>
            <p className="text-sm text-[#5C5070] font-normal mt-2.5 leading-relaxed">
              Sprint through deep work sessions with a built-in Pomodoro timer, ambient soundscapes, and bonus XP multipliers on completion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
