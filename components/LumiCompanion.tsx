'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import { Sparkles, Heart, Clock, Coffee, Zap } from 'lucide-react';

interface LumiCompanionProps {
  onStartFocus: () => void;
}

const MOOD_INFO: Record<
  string,
  {
    title: string;
    caption: string;
    quote: string;
    badge: string;
    badgeBg: string;
    image: string;
  }
> = {
  content: {
    title: 'Content',
    caption: 'Calm, happy and ready for new quests.',
    quote: 'Here we go again! Small steps make big quests.',
    badge: 'NORMAL DAY',
    badgeBg: 'bg-lavender-soft text-primary',
    image: '/lumi/extracted/mood-content.png',
  },
  radiant: {
    title: 'Radiant',
    caption: 'Energetic and glowing with excitement!',
    quote: "You're shining! What a streak!",
    badge: 'HIGH STREAK',
    badgeBg: 'bg-amber-100 text-amber-800',
    image: '/lumi/extracted/mood-radiant.png',
  },
  sleepy: {
    title: 'Sleepy',
    caption: 'A little tired, but still waiting for you.',
    quote: 'Missed you... Take your time. We are ready when you are.',
    badge: 'TAKE A BREATHER',
    badgeBg: 'bg-indigo-100 text-indigo-700',
    image: '/lumi/extracted/mood-sleepy.png',
  },
  concerned: {
    title: 'Concerned',
    caption: 'A gentle reminder when your streak is at risk.',
    quote: 'Still got time! You can finish your daily bounties!',
    badge: 'STREAK AT RISK',
    badgeBg: 'bg-orange-100 text-orange-800',
    image: '/lumi/extracted/mood-concerned.png',
  },
  wilting: {
    title: 'Wilting',
    caption: 'Feeling low, but still hopeful and supportive.',
    quote: "It's okay... Every adventurer stumbles. Let's start fresh!",
    badge: 'SUPPORTIVE',
    badgeBg: 'bg-purple-100 text-purple-700',
    image: '/lumi/extracted/mood-wilting.png',
  },
  focused: {
    title: 'Focused',
    caption: 'Determined and completely in the zone.',
    quote: 'Focus mode ON! One quest at a time.',
    badge: 'IN A QUEST',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    image: '/lumi/extracted/mood-focused.png',
  },
  sleeping: {
    title: 'Sleeping',
    caption: 'Resting for a brighter tomorrow.',
    quote: 'Good night... Rest well, brave adventurer.',
    badge: 'NIGHT MODE',
    badgeBg: 'bg-slate-200 text-slate-700',
    image: '/lumi/extracted/mood-sleeping.png',
  },
};

const REACTION_INFO: Record<string, { title: string; quote: string; image: string }> = {
  levelup: {
    title: 'Level Up!',
    quote: 'You did it! A new level, a brighter you!',
    image: '/lumi/extracted/reaction-levelup.png',
  },
  achievement: {
    title: 'Achievement Unlocked!',
    quote: 'Milestones matter. You are making real progress!',
    image: '/lumi/extracted/reaction-achievement.png',
  },
  explore: {
    title: "Let's Explore!",
    quote: 'New places. New bounties. More possibilities!',
    image: '/lumi/extracted/reaction-explore.png',
  },
  selfcare: {
    title: 'You Deserve This!',
    quote: 'Taking care of yourself is a vital quest too.',
    image: '/lumi/extracted/reaction-selfcare.png',
  },
  yougotthis: {
    title: 'You Got This!',
    quote: 'A little nudge, a lot of belief. Keep going!',
    image: '/lumi/extracted/reaction-yougotthis.png',
  },
  focus: {
    title: 'Focus Mode: ON!',
    quote: 'Deep work time. Distractions blocked.',
    image: '/lumi/extracted/reaction-focus.png',
  },
};

export const LumiCompanion: React.FC<LumiCompanionProps> = ({ onStartFocus }) => {
  const { user, currentReaction, triggerLumiReaction } = useAuth();
  const [isPetted, setIsPetted] = useState(false);

  if (!user) return null;

  const moodKey = user.companionMood in MOOD_INFO ? user.companionMood : 'content';
  const mood = MOOD_INFO[moodKey];

  // If there's an active reaction (e.g. just leveled up or completed self-care)
  const activeReaction = currentReaction && REACTION_INFO[currentReaction.reaction];

  const displayImage = activeReaction ? activeReaction.image : mood.image;
  const displayTitle = activeReaction ? activeReaction.title : mood.title;
  const displayQuote = activeReaction
    ? (currentReaction.quote || activeReaction.quote)
    : mood.quote;

  const handlePetLumi = () => {
    setIsPetted(true);
    sound.playQuestComplete();
    triggerLumiReaction('yougotthis', 'Lumi loves your dedication! Keep going!');
    setTimeout(() => setIsPetted(false), 1000);
  };

  return (
    <aside className="bg-white rounded-lumi border border-primary/15 p-5 shadow-lumi relative overflow-hidden transition-all">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-lavender-soft/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header status */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-copy uppercase tracking-wider">
            Companion Status
          </span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            activeReaction ? 'bg-success-soft text-success' : mood.badgeBg
          }`}
        >
          {activeReaction ? 'CELEBRATING' : mood.badge}
        </span>
      </div>

      {/* Lumi Mascot Display */}
      <div className="relative flex flex-col items-center justify-center my-2 group">
        {/* Dynamic Speech Bubble */}
        <div className="relative mb-2 px-3 py-2 bg-lavender-soft/80 border border-primary/20 rounded-xl text-xs text-copy font-medium text-center shadow-sm max-w-[240px]">
          <span>"{displayQuote}"</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-lavender-soft/80 border-r border-b border-primary/20 rotate-45" />
        </div>

        {/* Mascot Avatar Card */}
        <button
          onClick={handlePetLumi}
          className={`relative w-40 h-44 rounded-2xl bg-gradient-to-b from-background to-lavender-soft/30 border border-primary/20 flex items-center justify-center p-2 cursor-pointer shadow-sm hover:shadow-lumi-hover transition-all duration-300 ${
            isPetted ? 'scale-105 ring-4 ring-primary/20' : 'hover:-translate-y-1'
          }`}
          title="Tap Lumi for encouragement!"
          aria-label={`Lumi companion, currently ${displayTitle}. Click to interact.`}
        >
          <img
            src={displayImage}
            alt={`Lumi ${displayTitle}`}
            className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // fallback to master hero
              (e.target as HTMLImageElement).src = '/lumi/extracted/lumi-hero.png';
            }}
          />

          {/* Sparkles on hover */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles className="w-4 h-4 text-accent animate-spin" />
          </div>
        </button>

        <p className="text-[11px] text-copy-muted mt-2 text-center">
          Tap Lumi to share a moment!
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-4 pt-3 border-t border-primary/10 flex flex-col gap-2">
        <button
          onClick={onStartFocus}
          className="w-full py-2 px-3 rounded-xl bg-primary text-primary-on font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-primary-hover active:scale-95 transition-all"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Start Focus Mode (Pomodoro)</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              sound.playClick();
              triggerLumiReaction('selfcare', 'Hydration, stretching, and rest are powerful quests!');
            }}
            className="py-1.5 px-2 rounded-xl bg-background-subtle border border-primary/20 text-copy text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-lavender-soft transition-colors"
          >
            <Heart className="w-3 h-3 text-rose-500" />
            <span>Self Care</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              triggerLumiReaction('explore', 'Look around the Guild Emporium or challenge a Boss!');
            }}
            className="py-1.5 px-2 rounded-xl bg-background-subtle border border-primary/20 text-copy text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-lavender-soft transition-colors"
          >
            <Zap className="w-3 h-3 text-accent" />
            <span>Encourage</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
