'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import {
  Plus,
  Check,
  Trash2,
  Edit2,
  Sparkles,
  BookOpen,
  Dumbbell,
  Zap,
  Heart,
  Flame,
  Calendar,
  Layers,
  Filter,
} from 'lucide-react';

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

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  INTELLECT: { label: 'Intellect', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  STRENGTH: { label: 'Strength', icon: Dumbbell, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  AGILITY: { label: 'Agility', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  VITALITY: { label: 'Vitality', icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  SPIRIT: { label: 'Spirit', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
};

const DIFFICULTY_BADGES: Record<string, { label: string; bg: string }> = {
  TRIVIAL: { label: 'Trivial', bg: 'bg-gray-100 text-gray-700' },
  EASY: { label: 'Easy', bg: 'bg-green-100 text-green-800' },
  MEDIUM: { label: 'Medium', bg: 'bg-blue-100 text-blue-800' },
  HARD: { label: 'Hard', bg: 'bg-orange-100 text-orange-800' },
  EPIC: { label: 'Epic', bg: 'bg-purple-100 text-purple-800 font-bold' },
};

export const QuestBoard: React.FC<QuestBoardProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
  onTriggerLevelUp,
}) => {
  const { refreshUser, updateUserOptimistic, triggerLumiReaction } = useAuth();
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

  const handleCompleteQuest = async (quest: Quest, e: React.MouseEvent) => {
    if (completingId || quest.isCompleted) return;
    setCompletingId(quest.id);

    // Audio chime immediately
    sound.playQuestComplete();
    sound.playCoin();

    // Floating text coordinates
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
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
    }, 1500);

    // React optimistic feedback
    updateUserOptimistic((prev) => ({
      ...prev,
      xp: prev.xp + quest.xpReward,
      gold: prev.gold + quest.goldReward,
    }));

    if (quest.category === 'VITALITY') {
      triggerLumiReaction('selfcare', 'Vitality replenished! Lumi feels nourished.');
    } else {
      triggerLumiReaction('achievement', 'Bounty completed! Glory to the Guild!');
    }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lumi border border-primary/15 shadow-sm">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist">
          {(['ALL', 'DAILY', 'TODO', 'HABIT'] as const).map((type) => (
            <button
              key={type}
              role="tab"
              aria-selected={activeTypeTab === type}
              onClick={() => {
                sound.playClick();
                setActiveTypeTab(type);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTypeTab === type
                  ? 'bg-primary text-primary-on shadow-sm'
                  : 'bg-background text-copy-muted hover:text-copy hover:bg-lavender-soft'
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
          <div className="flex items-center gap-1 bg-background px-2.5 py-1 rounded-lg border border-primary/15 text-xs">
            <Filter className="w-3.5 h-3.5 text-primary" />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-copy outline-none cursor-pointer"
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
            onClick={() => {
              sound.playClick();
              onOpenCreateModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-on font-bold text-xs shadow-sm hover:bg-primary-hover active:scale-97 transition-all cursor-pointer"
            title="Post a new quest bounty (Press 'Q')"
          >
            <Plus className="w-4 h-4" />
            <span>Post Bounty (Q)</span>
          </button>
        </div>
      </div>

      {/* Quest Cards Grid / List */}
      {filteredQuests.length === 0 ? (
        <div className="bg-white rounded-lumi border border-primary/15 p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-40 h-40 mb-3 flex items-center justify-center">
            <img
              src="/lumi/extracted/reaction-explore.png"
              alt="Lumi looking around"
              className="w-full h-full object-contain drop-shadow"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/lumi/extracted/lumi-hero.png';
              }}
            />
          </div>
          <h3 className="text-base font-bold text-copy">The Bounty Board is Clear</h3>
          <p className="text-xs text-copy-muted max-w-sm mt-1 mb-4">
            "No active quests found! Press 'Q' or click 'Post Bounty' to log your next real-world adventure."
          </p>
          <button
            onClick={() => {
              sound.playClick();
              onOpenCreateModal();
            }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-on font-bold text-xs shadow-sm hover:bg-primary-hover transition-all"
          >
            Create Your First Quest
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredQuests.map((quest) => {
            const cat = CATEGORY_CONFIG[quest.category] || CATEGORY_CONFIG.INTELLECT;
            const CatIcon = cat.icon;
            const diff = DIFFICULTY_BADGES[quest.difficulty] || DIFFICULTY_BADGES.MEDIUM;
            const isCompleting = completingId === quest.id;

            return (
              <article
                key={quest.id}
                className={`bg-white rounded-lumi border transition-all duration-300 p-4 flex items-center justify-between gap-4 shadow-lumi-card hover:shadow-lumi hover:border-primary/40 ${
                  quest.isCompleted
                    ? 'opacity-60 bg-background-subtle line-through border-gray-200'
                    : 'border-primary/15'
                }`}
              >
                {/* Left: Interactive Checkbox & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Checkbox */}
                  <button
                    onClick={(e) => handleCompleteQuest(quest, e)}
                    disabled={quest.isCompleted || isCompleting}
                    className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                      quest.isCompleted
                        ? 'bg-success border-success text-white'
                        : isCompleting
                        ? 'bg-success/20 border-success animate-pulse'
                        : 'border-primary/30 hover:border-success hover:bg-success/10'
                    }`}
                    aria-label={`Mark quest "${quest.title}" as complete`}
                  >
                    {quest.isCompleted && <Check className="w-5 h-5 stroke-[3] animate-checkmark" />}
                  </button>

                  {/* Title and tags */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          quest.isCompleted ? 'text-copy-muted line-through' : 'text-copy'
                        }`}
                      >
                        {quest.title}
                      </h4>

                      {/* Category tag */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cat.bg} ${cat.color}`}
                      >
                        <CatIcon className="w-2.5 h-2.5" />
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
                      <span className="font-semibold text-primary">
                        {quest.type === 'DAILY'
                          ? 'Daily Quest'
                          : quest.type === 'HABIT'
                          ? 'Core Habit'
                          : 'To-Do Bounty'}
                      </span>
                      {quest.streakCount > 0 && (
                        <span className="flex items-center gap-0.5 text-orange-600 font-bold">
                          <Flame className="w-3 h-3" />
                          <span>{quest.streakCount} streak</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Reward Badges & Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Rewards chip */}
                  <div className="hidden sm:flex flex-col items-end text-right">
                    <span className="text-xs font-extrabold text-success">
                      +{quest.xpReward} XP
                    </span>
                    <span className="text-[11px] font-bold text-accent">
                      +{quest.goldReward} GP
                    </span>
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => onOpenEditModal(quest)}
                    className="p-2 rounded-lg text-copy-muted hover:text-primary hover:bg-lavender-soft transition-colors"
                    title="Edit quest"
                    aria-label={`Edit ${quest.title}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteQuest(quest.id)}
                    className="p-2 rounded-lg text-copy-muted hover:text-danger hover:bg-rose-50 transition-colors"
                    title="Delete quest"
                    aria-label={`Delete ${quest.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Completion summary stats */}
      <div className="text-xs text-copy-muted text-center py-2">
        <span>{activeCount} active bounties remaining</span> ·{' '}
        <span className="text-success font-semibold">{completedCount} completed</span>
      </div>
    </section>
  );
};
