'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import { LumiMascot } from './LumiMascot';
import { Button } from './ui/Button';
import { IconHeart, IconEnergy, IconSparkles } from './icons/LumiIcons';

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
  }
> = {
  content: {
    title: 'Content',
    caption: 'Calm, happy and ready for new quests.',
    quote: 'Here we go again! Small steps make big quests.',
    badge: 'NORMAL DAY',
    badgeBg: 'bg-lavender-soft text-primary',
  },
  radiant: {
    title: 'Radiant',
    caption: 'Energetic and glowing with excitement!',
    quote: "You're shining! What a streak!",
    badge: 'HIGH STREAK',
    badgeBg: 'bg-amber-100 text-amber-800',
  },
  sleepy: {
    title: 'Sleepy',
    caption: 'A little tired, but still waiting for you.',
    quote: 'Missed you... Take your time. We are ready when you are.',
    badge: 'TAKE A BREATHER',
    badgeBg: 'bg-indigo-100 text-indigo-700',
  },
  concerned: {
    title: 'Concerned',
    caption: 'A gentle reminder when your streak is at risk.',
    quote: 'Still got time! You can finish your daily bounties!',
    badge: 'STREAK AT RISK',
    badgeBg: 'bg-orange-100 text-orange-800',
  },
  wilting: {
    title: 'Wilting',
    caption: 'Feeling low, but still hopeful and supportive.',
    quote: "It's okay... Every adventurer stumbles. Let's start fresh!",
    badge: 'SUPPORTIVE',
    badgeBg: 'bg-purple-100 text-purple-700',
  },
  focused: {
    title: 'Focused',
    caption: 'Determined and completely in the zone.',
    quote: 'Focus mode ON! One quest at a time.',
    badge: 'IN A QUEST',
    badgeBg: 'bg-emerald-100 text-emerald-800',
  },
  sleeping: {
    title: 'Sleeping',
    caption: 'Resting for a brighter tomorrow.',
    quote: 'Good night... Rest well, brave adventurer.',
    badge: 'NIGHT MODE',
    badgeBg: 'bg-slate-200 text-slate-700',
  },
};

const REACTION_INFO: Record<string, { title: string; quote: string }> = {
  levelup: {
    title: 'Level Up!',
    quote: 'You did it! A new level, a brighter you!',
  },
  achievement: {
    title: 'Achievement Unlocked!',
    quote: 'Milestones matter. You are making real progress!',
  },
  explore: {
    title: "Let's Explore!",
    quote: 'New places. New bounties. More possibilities!',
  },
  selfcare: {
    title: 'You Deserve This!',
    quote: 'Taking care of yourself is a vital quest too.',
  },
  yougotthis: {
    title: 'You Got This!',
    quote: 'A little nudge, a lot of belief. Keep going!',
  },
  focus: {
    title: 'Focus Mode: ON!',
    quote: 'Deep work time. Distractions blocked.',
  },
};

export const LumiCompanion: React.FC<LumiCompanionProps> = ({ onStartFocus }) => {
  const { user, currentReaction, triggerLumiReaction } = useAuth();
  const [isPetted, setIsPetted] = useState(false);

  if (!user) return null;

  const moodKey = user.companionMood in MOOD_INFO ? user.companionMood : 'content';
  const mood = MOOD_INFO[moodKey];

  // If there's an active reaction (e.g. just leveled up or completed self-care)
  const activeReactionKey = currentReaction?.reaction;
  const activeReaction = activeReactionKey ? REACTION_INFO[activeReactionKey] : null;

  const displayTitle = activeReaction ? activeReaction.title : mood.title;
  const displayQuote = activeReaction
    ? (currentReaction?.quote || activeReaction.quote)
    : mood.quote;

  const handlePetLumi = () => {
    setIsPetted(true);
    sound.playQuestComplete();
    triggerLumiReaction('yougotthis', 'Lumi loves your dedication! Keep going!');
    setTimeout(() => setIsPetted(false), 1000);
  };

  return (
    <aside className="bg-surface rounded-lumi border border-slate-200/80 p-5 shadow-sm relative overflow-hidden transition-all">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-lavender-soft/30 rounded-full blur-2xl pointer-events-none" />

      {/* Header status */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-extrabold text-copy uppercase tracking-wider">
            Companion Status
          </span>
        </div>
        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            activeReaction ? 'bg-success-soft text-success' : mood.badgeBg
          }`}
        >
          {activeReaction ? 'CELEBRATING' : mood.badge}
        </span>
      </div>

      {/* Lumi Mascot Display */}
      <div className="relative flex flex-col items-center justify-center my-2 group">
        {/* Dynamic Speech Bubble */}
        <div className="relative mb-3 px-3.5 py-2.5 bg-background-subtle border border-primary/20 rounded-2xl text-xs text-copy font-semibold text-center shadow-xs max-w-[240px]">
          <span>"{displayQuote}"</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-background-subtle border-r border-b border-primary/20 rotate-45" />
        </div>

        {/* Mascot Avatar Card */}
        <button
          type="button"
          onClick={handlePetLumi}
          className={`relative w-40 h-44 rounded-2xl bg-gradient-to-b from-white to-background border-2 border-slate-200/80 flex items-center justify-center p-2 cursor-pointer shadow-sm hover:border-primary/40 transition-all duration-300 ${
            isPetted ? 'scale-105 ring-4 ring-primary/20' : 'hover:-translate-y-1'
          }`}
          title="Tap Lumi for encouragement!"
          aria-label={`Lumi companion, currently ${displayTitle}. Click to interact.`}
        >
          <LumiMascot
            mood={activeReactionKey || moodKey}
            size={144}
            isPetted={isPetted}
          />

          {/* Sparkles on hover */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconSparkles size={18} className="text-accent" />
          </div>
        </button>

        <p className="text-[11px] font-medium text-copy-muted mt-2 text-center">
          Tap Lumi to share a moment!
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
        <Button
          onClick={onStartFocus}
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
              sound.playClick();
              triggerLumiReaction('selfcare', 'Hydration, stretching, and rest are powerful quests!');
            }}
            leftIcon={<IconHeart size={14} className="text-danger" />}
          >
            Self Care
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              sound.playClick();
              triggerLumiReaction('explore', 'Look around the Guild Emporium or challenge a Boss!');
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
