'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useXpArc } from './XpArcManager';
import { useLumi, LumiPresenter, LumiAnchor } from './lumi';
import { sound } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { Button } from './ui/Button';
import { LumiMascot } from './LumiMascot';
import {
  IconPlus,
  IconCheck,
  IconTrash,
  IconEdit,
  IconStreakFlame,
  IconAttributeIntellect,
  IconAttributeStrength,
  IconAttributeAgility,
  IconAttributeVitality,
  IconAttributeSpirit,
  IconXpGem,
  IconGoldCoin,
} from './icons/LumiIcons';

export interface Quest {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  type: string;
  habitDirection: string | null;
  xpReward: number;
  goldReward: number;
  isCompleted: boolean;
  streakCount: number;
  dueDate: string | null;
}

interface QuestBoardProps {
  onOpenCreateModal: () => void;
  onOpenEditModal: (quest: Quest) => void;
  onTriggerLevelUp: (payload: {
    newLevel: number;
    xpEarned: number;
    goldEarned: number;
    statGained: { attribute: string; points: number };
  }) => void;
}

// Strict Discipline: All 5 attributes use text + primary and their bespoke geometric icon
const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  INTELLECT: { label: 'Intellect', icon: IconAttributeIntellect },
  STRENGTH: { label: 'Strength', icon: IconAttributeStrength },
  AGILITY: { label: 'Agility', icon: IconAttributeAgility },
  VITALITY: { label: 'Vitality', icon: IconAttributeVitality },
  SPIRIT: { label: 'Spirit', icon: IconAttributeSpirit },
};

const DIFFICULTY_BADGES: Record<string, { label: string; bg: string }> = {
  TRIVIAL: { label: 'Trivial', bg: 'bg-slate-100 text-copy-muted font-medium' },
  EASY: { label: 'Easy', bg: 'bg-slate-100 text-copy font-medium' },
  MEDIUM: { label: 'Medium', bg: 'bg-slate-100 text-copy font-bold' },
  HARD: { label: 'Hard', bg: 'bg-primary/15 text-[#522B80] font-bold border border-primary/20' },
  EPIC: { label: 'Epic', bg: 'bg-primary/25 text-[#3D1D60] font-black border border-primary/30' },
};

export const QuestBoard: React.FC<QuestBoardProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
  onTriggerLevelUp,
}) => {
  const { refreshUser, updateUserOptimistic, triggerLumiReaction } = useAuth();
  const { triggerXpArc } = useXpArc();
  const {
    react: lumiReact,
    lookAt,
    moveToAnchor,
    returnHome,
  } = useLumi();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeTypeTab, setActiveTypeTab] = useState<'ALL' | 'DAILY' | 'TODO' | 'HABIT'>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<
    { id: string; text: string; x: number; y: number }[]
  >([]);

  const fetchQuests = useCallback(async () => {
    try {
      const res = await fetch('/api/quests');
      const data = await res.json();
      if (data.quests) {
        setQuests(data.quests);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const handleCompleteQuest = async (quest: Quest, e: React.MouseEvent<HTMLButtonElement>) => {
    if (completingId || quest.isCompleted) return;
    setCompletingId(quest.id);

    // 1. Lumi attends and turns towards quest anchor
    lookAt({ type: 'quest', label: quest.title, weight: 1.0 });
    moveToAnchor(`quest-${quest.id}`, false);

    // Audio chime immediately
    sound.playQuestComplete();
    sound.playCoin();

    // Tactile confetti burst from completed checkbox
    const rect = e.currentTarget.getBoundingClientRect();
    try {
      confetti({
        particleCount: 30,
        spread: 55,
        startVelocity: 26,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ['#9966CC', '#F5B700', '#4FCE6B', '#8B54C2', '#FFFFFF'],
        disableForReducedMotion: true,
        zIndex: 9999,
      });
    } catch {
      // ignore
    }

    // Trigger Ballistic Arc directly to header XP pill
    triggerXpArc(quest.xpReward, e.currentTarget);

    // Floating text coordinates
    const floatId = Math.random().toString();
    setFloatingTexts((prev) => [
      ...prev,
      {
        id: floatId,
        text: `+${quest.xpReward} XP  +${quest.goldReward} GP`,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      },
    ]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((f) => f.id !== floatId));
    }, 1400);

    // React optimistic feedback
    updateUserOptimistic((prev) => ({
      ...prev,
      xp: prev.xp + quest.xpReward,
      gold: prev.gold + quest.goldReward,
    }));

    if (quest.category === 'VITALITY') {
      triggerLumiReaction('selfcare', 'Vitality replenished! Lumi feels nourished.');
      lumiReact('SELF_CARE', 'Vitality replenished! Lumi feels nourished.');
    } else {
      triggerLumiReaction('achievement', 'Bounty completed! Glory to the Guild!');
      lumiReact('QUEST_COMPLETE', `Bounty completed! +${quest.xpReward} XP gained!`);
    }

    // Return home smoothly after celebration
    setTimeout(() => {
      returnHome();
      lookAt(null);
    }, 2200);

    try {
      const res = await fetch(`/api/quests/${quest.id}/complete`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success && data.progression) {
        if (data.progression.didLevelUp) {
          onTriggerLevelUp({
            newLevel: data.progression.newLevel,
            xpEarned: data.progression.xpEarned,
            goldEarned: data.progression.goldEarned,
            statGained: data.progression.statGained,
          });
        }
        await refreshUser();
        await fetchQuests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompletingId(null);
    }
  };

  const handleDeleteQuest = async (id: string) => {
    if (!confirm('Are you sure you want to dismiss this bounty?')) return;
    sound.playClick();
    try {
      await fetch(`/api/quests/${id}`, { method: 'DELETE' });
      setQuests((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering
  const filteredQuests = quests.filter((q) => {
    if (activeTypeTab !== 'ALL' && q.type !== activeTypeTab) return false;
    if (activeCategory !== 'ALL' && q.category !== activeCategory) return false;
    return true;
  });

  const completedCount = quests.filter((q) => q.isCompleted).length;
  const activeCount = quests.filter((q) => !q.isCompleted).length;

  return (
    <section className="flex flex-col gap-5">
      {/* Floating Combat / Reward Text Overlays */}
      {floatingTexts.map((f) => (
        <div
          key={f.id}
          className="fixed z-50 pointer-events-none font-extrabold text-sm sm:text-base text-accent drop-shadow-md animate-float-up px-3 py-1 rounded-full bg-copy/90 border border-accent/40"
          style={{ left: `${f.x}px`, top: `${f.y}px`, transform: 'translateX(-50%)' }}
        >
          {f.text}
        </div>
      ))}

      {/* Control Bar: Tabs, Filter, and Post Bounty Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist">
          {(['ALL', 'DAILY', 'TODO', 'HABIT'] as const).map((type) => (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={activeTypeTab === type}
              onClick={() => {
                sound.playClick();
                setActiveTypeTab(type);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
                activeTypeTab === type
                  ? 'bg-primary text-[#1F1730] shadow-xs'
                  : 'bg-background text-copy-muted hover:text-copy hover:bg-lavender-soft/50'
              }`}
            >
              {type === 'ALL'
                ? `All (${quests.length})`
                : type === 'DAILY'
                ? 'Dailies'
                : type === 'TODO'
                ? 'To-Dos'
                : 'Habits'}
            </button>
          ))}
        </div>

        {/* Right action group: Attribute filter & Add Quest */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 bg-background px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="bg-transparent text-xs font-bold text-copy outline-none cursor-pointer"
              aria-label="Filter quests by attribute"
            >
              <option value="ALL">All Attributes</option>
              <option value="INTELLECT">Intellect</option>
              <option value="STRENGTH">Strength</option>
              <option value="AGILITY">Agility</option>
              <option value="VITALITY">Vitality</option>
              <option value="SPIRIT">Spirit</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenCreateModal();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-primary hover:bg-[#8B54C2] border-b-4 border-[#7343A8] active:border-b-0 active:translate-y-1 shadow-md hover:shadow-lg transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary shrink-0"
            title="Post a new bounty (Press Q)"
            aria-label="Post a new bounty"
          >
            <IconPlus size={16} />
            <span>Post Bounty (Q)</span>
          </button>
        </div>
      </div>

      {/* Quest Cards Grid / List */}
      {filteredQuests.length === 0 ? (
        <div className="bg-surface rounded-2xl border-2 border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-48 h-44 mb-2 flex items-center justify-center">
            <LumiPresenter variant="mini" height={160} showSpeech={false} interactive={true} />
          </div>
          <h3 className="text-base font-extrabold text-copy">The Bounty Board is Clear</h3>
          <p className="text-xs text-copy-muted max-w-sm mt-1 mb-4">
            "No active quests found! Press 'Q' or click 'Post Bounty' to log your next real-world adventure."
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              sound.playClick();
              onOpenCreateModal();
            }}
            leftIcon={<IconPlus size={16} />}
          >
            Create Your First Quest
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredQuests.map((quest) => {
            const cat = CATEGORY_CONFIG[quest.category] || CATEGORY_CONFIG.INTELLECT;
            const CatIcon = cat.icon;
            const diff = DIFFICULTY_BADGES[quest.difficulty] || DIFFICULTY_BADGES.MEDIUM;
            const isCompleting = completingId === quest.id;

            return (
              <LumiAnchor key={quest.id} id={`quest-${quest.id}`} category="quest" className="w-full">
                <article
                  onMouseEnter={() => lookAt({ type: 'quest', label: quest.title, weight: 0.8 })}
                  onMouseLeave={() => lookAt(null)}
                  className={`bg-surface rounded-2xl border transition-all duration-200 p-4 flex items-center justify-between gap-4 shadow-xs hover:border-primary/40 ${
                    quest.isCompleted
                      ? 'opacity-65 bg-background-subtle border-slate-200'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Left: Interactive Checkbox & Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Checkbox with tactile active scale */}
                    <button
                      type="button"
                      onClick={(e) => handleCompleteQuest(quest, e)}
                      disabled={quest.isCompleted || isCompleting}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-90 focus-visible:outline-2 focus-visible:outline-primary ${
                        quest.isCompleted
                          ? 'bg-success border-success text-white shadow-xs'
                          : isCompleting
                          ? 'bg-success/20 border-success animate-pulse'
                          : 'border-slate-300 hover:border-primary hover:bg-lavender-soft/40 shadow-xs'
                      }`}
                      aria-label={`Mark quest "${quest.title}" as complete`}
                    >
                      {quest.isCompleted && (
                        <span className="animate-spring-check inline-flex">
                          <IconCheck size={20} filled className="text-white" />
                        </span>
                      )}
                    </button>

                    {/* Title and tags */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-sm font-bold ${
                            quest.isCompleted ? 'text-copy-muted line-through' : 'text-copy'
                          }`}
                        >
                          {quest.title}
                        </h4>

                        {/* Monochromatic Category tag: WCAG AAA compliance (>7.4:1 contrast) */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-primary/30 bg-lavender-soft text-[#492673]">
                          <CatIcon size={12} className="text-[#522B80]" />
                          <span>{cat.label}</span>
                        </span>

                        {/* Difficulty tag */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${diff.bg}`}
                        >
                          {diff.label}
                        </span>
                      </div>

                      {quest.description && (
                        <p className="text-xs text-copy-muted line-clamp-1 mt-0.5">
                          {quest.description}
                        </p>
                      )}

                      {/* Streak & Type Subtext */}
                      <div className="flex items-center gap-3 text-[11px] text-copy-muted mt-1">
                        <span className="font-bold text-primary">
                          {quest.type === 'DAILY'
                            ? 'Daily Quest'
                            : quest.type === 'HABIT'
                            ? 'Core Habit'
                            : 'To-Do Bounty'}
                        </span>
                        {quest.streakCount > 0 && (
                          <span className="flex items-center gap-1 text-[#875800] font-black">
                            <IconStreakFlame size={14} filled className="text-accent animate-flame-breathe" />
                            <span>{quest.streakCount}d streak</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Reward Badges & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Rewards chip (WCAG AA compliant gold text) */}
                    <div className="hidden sm:flex flex-col items-end text-right">
                      <span className="flex items-center gap-1 text-xs font-black text-primary">
                        <IconXpGem size={14} filled />
                        +{quest.xpReward} XP
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-black text-[#875800]">
                        <IconGoldCoin size={12} filled className="text-accent" />
                        +{quest.goldReward} GP
                      </span>
                    </div>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => onOpenEditModal(quest)}
                      className="p-2 rounded-xl text-copy-muted hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
                      title="Edit quest"
                      aria-label={`Edit ${quest.title}`}
                    >
                      <IconEdit size={16} />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteQuest(quest.id)}
                      className="p-2 rounded-xl text-copy-muted hover:text-danger hover:bg-danger-soft transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
                      title="Delete quest"
                      aria-label={`Delete ${quest.title}`}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </article>
              </LumiAnchor>
            );
          })}
        </div>
      )}

      {/* Completion summary stats */}
      <div className="text-xs text-copy-muted text-center py-2 font-medium">
        <span>{activeCount} active bounties remaining</span> ·{' '}
        <span className="text-primary font-bold">{completedCount} completed</span>
      </div>
    </section>
  );
};
