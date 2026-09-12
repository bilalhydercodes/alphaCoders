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
      className="relative z-20 py-28 sm:py-36 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#9966CC] scroll-mt-20 select-none overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
      aria-label="Core RPG Features"
    >
      {/* Top Blend: Seamless fade from Platform Overview (#F8F8FF) into Amethyst (#9966CC) */}
      <div className="absolute inset-x-0 top-0 h-32 sm:h-44 bg-gradient-to-b from-[#F8F8FF] to-transparent pointer-events-none z-10" />

      <div className="max-w-[1200px] mx-auto relative z-20">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3 text-xs font-draft-mono text-white/85 tracking-wider uppercase">
            <span className="w-2 h-2 bg-white border border-[#2E2438]" />
            <span>Core Game Mechanics</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white tracking-[-0.035em] leading-[1.04] font-headline">
            Features built for real-life mastery
          </h2>
          <p className="text-base sm:text-lg text-white/90 font-medium mt-4 leading-relaxed max-w-2xl">
            Every system in Life RPG connects your productive habits, study sessions, and milestones into an active role-playing engine.
          </p>
        </div>

        {/* 6 Core Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {/* 1. Interactive Quest Map */}
          <div
            id="quest-map"
            className="bg-white border border-[#2E2438] rounded-none p-6 sm:p-8 shadow-[0_6px_20px_rgba(31,23,48,0.12)] hover:shadow-[0_12px_32px_rgba(31,23,48,0.22)] transition-all flex flex-col justify-start group cursor-default"
          >
            <div className="w-10 h-10 bg-[#EADFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-6 shrink-0 group-hover:bg-[#9966CC] group-hover:text-white transition-colors">
              <IconMap size={20} className="currentColor" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1F1730] tracking-tight font-headline group-hover:text-[#7A4BC2] transition-colors">
              Interactive Quest Map
            </h3>
            <p className="text-sm sm:text-base text-[#5C5070] font-normal mt-3 leading-relaxed">
              Progress node-by-node across chapters that break intimidating long-term life goals into clear, achievable daily milestones.
            </p>
          </div>

          {/* 2. Bounty Board & Habit Engine */}
          <div
            id="bounties"
            className="bg-white border border-[#2E2438] rounded-none p-6 sm:p-8 shadow-[0_6px_20px_rgba(31,23,48,0.12)] hover:shadow-[0_12px_32px_rgba(31,23,48,0.22)] transition-all flex flex-col justify-start group cursor-default"
          >
            <div className="w-10 h-10 bg-[#EADFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-6 shrink-0 group-hover:bg-[#9966CC] group-hover:text-white transition-colors">
              <IconBounties size={20} className="currentColor" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1F1730] tracking-tight font-headline group-hover:text-[#7A4BC2] transition-colors">
              Tactile Bounty Board
            </h3>
            <p className="text-sm sm:text-base text-[#5C5070] font-normal mt-3 leading-relaxed">
              Log recurring habits and urgent bounties with immediate tactile response, streak multipliers, and XP rewards.
            </p>
          </div>

          {/* 3. Guild League & Boss Raids */}
          <div
            id="league"
            className="bg-white border border-[#2E2438] rounded-none p-6 sm:p-8 shadow-[0_6px_20px_rgba(31,23,48,0.12)] hover:shadow-[0_12px_32px_rgba(31,23,48,0.22)] transition-all flex flex-col justify-start group cursor-default"
          >
            <div className="w-10 h-10 bg-[#EADFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-6 shrink-0 group-hover:bg-[#9966CC] group-hover:text-white transition-colors">
              <IconLeague size={20} className="currentColor" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1F1730] tracking-tight font-headline group-hover:text-[#7A4BC2] transition-colors">
              Guild League & Raids
            </h3>
            <p className="text-sm sm:text-base text-[#5C5070] font-normal mt-3 leading-relaxed">
              Compete across weekly divisions from Bronze to Legend, and team up with fellow guild members to take down cooperative boss raids.
            </p>
          </div>

          {/* 4. Guild Emporium (Economy) */}
          <div
            id="emporium"
            className="bg-white border border-[#2E2438] rounded-none p-6 sm:p-8 shadow-[0_6px_20px_rgba(31,23,48,0.12)] hover:shadow-[0_12px_32px_rgba(31,23,48,0.22)] transition-all flex flex-col justify-start group cursor-default"
          >
            <div className="w-10 h-10 bg-[#EADFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-6 shrink-0 group-hover:bg-[#9966CC] group-hover:text-white transition-colors">
              <IconShop size={20} className="currentColor" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1F1730] tracking-tight font-headline group-hover:text-[#7A4BC2] transition-colors">
              Guild Emporium Economy
            </h3>
            <p className="text-sm sm:text-base text-[#5C5070] font-normal mt-3 leading-relaxed">
              Reinvest earned Bounty Gold into cosmetic gear, custom titles, companion scarves, and restorative elixirs in the marketplace.
            </p>
          </div>

          {/* 5. Character Codex & 5 Attributes */}
          <div
            id="codex"
            className="bg-white border border-[#2E2438] rounded-none p-6 sm:p-8 shadow-[0_6px_20px_rgba(31,23,48,0.12)] hover:shadow-[0_12px_32px_rgba(31,23,48,0.22)] transition-all flex flex-col justify-start group cursor-default"
          >
            <div className="w-10 h-10 bg-[#EADFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-6 shrink-0 group-hover:bg-[#9966CC] group-hover:text-white transition-colors">
              <IconCodex size={20} className="currentColor" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1F1730] tracking-tight font-headline group-hover:text-[#7A4BC2] transition-colors">
              Character Codex & Stats
            </h3>
            <p className="text-sm sm:text-base text-[#5C5070] font-normal mt-3 leading-relaxed">
              Cultivate balance across 5 attributes: Intellect, Strength, Agility, Vitality, and Spirit. Track your lifetime growth charts.
            </p>
          </div>

          {/* 6. Focus Sanctuary (Pomodoro) */}
          <div
            id="focus"
            className="bg-white border border-[#2E2438] rounded-none p-6 sm:p-8 shadow-[0_6px_20px_rgba(31,23,48,0.12)] hover:shadow-[0_12px_32px_rgba(31,23,48,0.22)] transition-all flex flex-col justify-start group cursor-default"
          >
            <div className="w-10 h-10 bg-[#EADFFF] border border-[#2E2438] text-[#1F1730] flex items-center justify-center mb-6 shrink-0 group-hover:bg-[#9966CC] group-hover:text-white transition-colors">
              <IconEnergy size={20} className="currentColor" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1F1730] tracking-tight font-headline group-hover:text-[#7A4BC2] transition-colors">
              Focus Mode Sanctuary
            </h3>
            <p className="text-sm sm:text-base text-[#5C5070] font-normal mt-3 leading-relaxed">
              Sprint through deep work sessions with a built-in Pomodoro timer, ambient soundscapes, and bonus XP multipliers on completion.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Blend: Seamless fade from Amethyst (#9966CC) into FAQ (#F8F8FF) */}
      <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-b from-transparent to-[#F8F8FF] pointer-events-none z-10" />
    </section>
  );
};
