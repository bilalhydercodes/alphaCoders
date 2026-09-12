'use client';

import React from 'react';
import {
  IconMap,
  IconBounties,
  IconLeague,
  IconShop,
  IconCodex,
  IconEnergy,
  IconAttributeIntellect,
  IconAttributeStrength,
  IconAttributeAgility,
  IconAttributeVitality,
  IconAttributeSpirit,
  IconGoldCoin,
  IconXpGem,
  IconStreakFlame,
} from '../icons/LumiIcons';

export const LandingFeatures: React.FC = () => {
  return (
    <section
      id="features"
      className="py-24 px-4 sm:px-8 bg-surface scroll-mt-20"
      aria-label="Core RPG Features"
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-soft text-[#492673] border border-primary/25 font-black text-xs uppercase tracking-wider mb-3">
            Guild Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-copy tracking-tight">
            Features Built for Real-Life Mastery
          </h2>
          <p className="text-sm sm:text-base text-copy-muted font-medium mt-3 leading-relaxed">
            Every feature in Life RPG translates productive habits, focused sprints, and personal milestones into an engaging game progression engine.
          </p>
        </div>

        {/* 6 Core Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 1. Interactive Quest Map */}
          <div
            id="quest-map"
            className="bg-background rounded-3xl border-2 border-slate-200 p-7 shadow-xs hover:border-primary/40 transition-all scroll-mt-28 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-lavender-soft text-primary border border-primary/20 flex items-center justify-center mb-5">
                <IconMap size={24} filled />
              </div>
              <h3 className="text-xl font-black text-copy tracking-tight">
                Interactive Quest Map
              </h3>
              <p className="text-xs sm:text-sm text-copy-muted font-medium mt-2 leading-relaxed">
                Embark on an interconnected sinusoidal journey. Progress node-by-node across epic chapters that break intimidating long-term life goals into bite-sized daily adventures.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-primary">
              <span className="px-2.5 py-1 rounded-full bg-lavender-soft border border-primary/20">
                Visual Waypoints
              </span>
              <span className="px-2.5 py-1 rounded-full bg-lavender-soft border border-primary/20">
                Chapter Unlocks
              </span>
            </div>
          </div>

          {/* 2. Bounty Board & Habit Engine */}
          <div
            id="bounties"
            className="bg-background rounded-3xl border-2 border-slate-200 p-7 shadow-xs hover:border-primary/40 transition-all scroll-mt-28 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-accent border border-accent/30 flex items-center justify-center mb-5">
                <IconBounties size={24} filled />
              </div>
              <h3 className="text-xl font-black text-copy tracking-tight">
                Tactile Bounty Board
              </h3>
              <p className="text-xs sm:text-sm text-copy-muted font-medium mt-2 leading-relaxed">
                Log daily habits and urgent bounties with instant satisfaction. Every completion unleashes ballistic XP arcs, celebratory harmonic chimes, and streak protections.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-[#875800]">
              <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-accent/30 flex items-center gap-1">
                <IconStreakFlame size={12} filled /> Streak Multipliers
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-accent/30 flex items-center gap-1">
                <IconXpGem size={12} filled /> Ballistic XP
              </span>
            </div>
          </div>

          {/* 3. Guild League & Boss Raids */}
          <div
            id="league"
            className="bg-background rounded-3xl border-2 border-slate-200 p-7 shadow-xs hover:border-primary/40 transition-all scroll-mt-28 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-danger border border-danger/20 flex items-center justify-center mb-5">
                <IconLeague size={24} filled />
              </div>
              <h3 className="text-xl font-black text-copy tracking-tight">
                Guild League & Raids
              </h3>
              <p className="text-xs sm:text-sm text-copy-muted font-medium mt-2 leading-relaxed">
                Climb weekly division ranks from Bronze to Legend. Join forces with community members to deal quest damage against raid bosses like "The Sloth Behemoth".
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-rose-700">
              <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200">
                Weekly Tiers
              </span>
              <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200">
                Co-op Monster Fights
              </span>
            </div>
          </div>

          {/* 4. Guild Emporium (Economy) */}
          <div
            id="emporium"
            className="bg-background rounded-3xl border-2 border-slate-200 p-7 shadow-xs hover:border-primary/40 transition-all scroll-mt-28 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#7042C1] border border-primary/20 flex items-center justify-center mb-5">
                <IconShop size={24} filled />
              </div>
              <h3 className="text-xl font-black text-copy tracking-tight">
                Guild Emporium Economy
              </h3>
              <p className="text-xs sm:text-sm text-copy-muted font-medium mt-2 leading-relaxed">
                Spend hard-earned Bounty Gold (GP) on cosmetic gear, custom titles, companion scarves, and restorative elixirs in the marketplace.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-[#7042C1]">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-primary/20 flex items-center gap-1">
                <IconGoldCoin size={12} filled /> Gold Rewards
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-primary/20">
                Lumi Gear & Titles
              </span>
            </div>
          </div>

          {/* 5. Character Codex & 5 Attributes */}
          <div
            id="codex"
            className="bg-background rounded-3xl border-2 border-slate-200 p-7 shadow-xs hover:border-primary/40 transition-all scroll-mt-28 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-primary border border-primary/20 flex items-center justify-center mb-5">
                <IconCodex size={24} filled />
              </div>
              <h3 className="text-xl font-black text-copy tracking-tight">
                Character Codex & Stats
              </h3>
              <p className="text-xs sm:text-sm text-copy-muted font-medium mt-2 leading-relaxed">
                Cultivate a balanced life across 5 core RPG attributes: Intellect, Strength, Agility, Vitality, and Spirit. Track your lifetime chronicles and growth radar.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-1.5 text-[11px] font-black text-[#492673]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lavender-soft border border-primary/20">
                <IconAttributeIntellect size={11} /> INT
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lavender-soft border border-primary/20">
                <IconAttributeStrength size={11} /> STR
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lavender-soft border border-primary/20">
                <IconAttributeAgility size={11} /> AGI
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lavender-soft border border-primary/20">
                <IconAttributeVitality size={11} /> VIT
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lavender-soft border border-primary/20">
                <IconAttributeSpirit size={11} /> SPI
              </span>
            </div>
          </div>

          {/* 6. Focus Sanctuary (Pomodoro) */}
          <div
            id="focus"
            className="bg-background rounded-3xl border-2 border-slate-200 p-7 shadow-xs hover:border-primary/40 transition-all scroll-mt-28 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-5">
                <IconEnergy size={24} filled />
              </div>
              <h3 className="text-xl font-black text-copy tracking-tight">
                Focus Mode Sanctuary
              </h3>
              <p className="text-xs sm:text-sm text-copy-muted font-medium mt-2 leading-relaxed">
                Enter deep work trance states with the integrated Pomodoro focus timer. Features custom sprint durations, procedural harp soundscapes, and bonus XP multipliers.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-[#1B6E32]">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                Deep Work Sprints
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                Bard Acoustics
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
