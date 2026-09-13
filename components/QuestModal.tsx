'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sound } from '@/lib/sound';
import { DIFFICULTY_REWARDS } from '@/lib/progression';
import { Button } from './ui/Button';
import {
  IconClose,
  IconPlus,
  IconEdit,
  IconAttributeIntellect,
  IconAttributeStrength,
  IconAttributeAgility,
  IconAttributeVitality,
  IconAttributeSpirit,
  IconXpGem,
  IconGoldCoin,
} from './icons/LumiIcons';
import { Quest } from './QuestBoard';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestSaved: () => void;
  editingQuest?: Quest | null;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  onQuestSaved,
  editingQuest,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('INTELLECT');
  const [difficulty, setDifficulty] = useState<string>('MEDIUM');
  const [type, setType] = useState<string>('DAILY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingQuest) {
        setTitle(editingQuest.title);
        setDescription(editingQuest.description || '');
        setCategory(editingQuest.category);
        setDifficulty(editingQuest.difficulty);
        setType(editingQuest.type);
      } else {
        setTitle('');
        setDescription('');
        setCategory('INTELLECT');
        setDifficulty('MEDIUM');
        setType('DAILY');
      }
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, editingQuest]);

  if (!isOpen) return null;

  const currentRewards = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.MEDIUM;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your quest');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const url = editingQuest ? `/api/quests/${editingQuest.id}` : '/api/quests';
      const method = editingQuest ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          difficulty,
          type,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save quest');
        return;
      }

      sound.playQuestComplete();
      onQuestSaved();
      onClose();
    } catch {
      setError('Network communication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-copy/50 backdrop-blur-xs animate-in fade-in duration-200"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-surface rounded-3xl border-2 border-slate-200 shadow-2xl p-4 sm:p-7 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 text-copy-muted hover:text-copy rounded-xl hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary z-10"
          aria-label="Close modal"
        >
          <IconClose size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-3 sm:mb-4 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-lavender-soft text-primary flex items-center justify-center">
            {editingQuest ? <IconEdit size={18} /> : <IconPlus size={18} />}
          </div>
          <h3 id="modal-title" className="text-base sm:text-lg font-black text-copy">
            {editingQuest ? 'Modify Guild Bounty' : 'Post New Guild Bounty'}
          </h3>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-3 p-3 rounded-2xl bg-danger-soft border border-danger/20 text-xs font-bold text-danger shrink-0"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 overflow-y-auto pr-1 -mr-1">
          {/* Title Input */}
          <div>
            <label
              htmlFor="quest-title-input"
              className="block text-xs font-bold text-copy mb-1"
            >
              Quest Title <span className="text-danger">*</span>
            </label>
            <input
              id="quest-title-input"
              ref={inputRef}
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 20 pages of clean architecture"
              className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border-2 border-slate-200 bg-background text-sm font-bold text-copy placeholder:text-copy-muted/60 focus:bg-surface focus:border-primary transition-all outline-none focus-visible:outline-2 focus-visible:outline-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="quest-desc-input"
              className="block text-xs font-bold text-copy mb-1"
            >
              Details or Real-World Motivation (Optional)
            </label>
            <textarea
              id="quest-desc-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key notes or goals..."
              className="w-full px-3.5 sm:px-4 py-2 rounded-2xl border-2 border-slate-200 bg-background text-sm font-medium text-copy placeholder:text-copy-muted/60 focus:bg-surface focus:border-primary transition-all outline-none resize-none focus-visible:outline-2 focus-visible:outline-primary"
            />
          </div>

          {/* Quest Type */}
          <div>
            <label className="block text-xs font-bold text-copy mb-1">Quest Frequency</label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {[
                { id: 'DAILY', label: 'Daily Bounty', desc: 'Resets daily' },
                { id: 'TODO', label: 'One-Time Bounty', desc: 'Single run' },
                { id: 'HABIT', label: 'Core Habit', desc: 'Repeated' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`p-2 sm:p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
                    type === t.id
                      ? 'bg-lavender-soft/40 border-primary text-primary shadow-xs'
                      : 'border-slate-200 text-copy-muted hover:border-slate-300'
                  }`}
                >
                  <p className="text-[11px] sm:text-xs font-bold text-copy leading-tight truncate">{t.label}</p>
                  <p className="text-[9px] sm:text-[10px] text-copy-muted font-medium truncate">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Attribute Mapping */}
          <div>
            <label className="block text-xs font-bold text-copy mb-1">
              Character Attribute Trained
            </label>
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {[
                { id: 'INTELLECT', label: 'Intellect', icon: IconAttributeIntellect },
                { id: 'STRENGTH', label: 'Strength', icon: IconAttributeStrength },
                { id: 'AGILITY', label: 'Agility', icon: IconAttributeAgility },
                { id: 'VITALITY', label: 'Vitality', icon: IconAttributeVitality },
                { id: 'SPIRIT', label: 'Spirit', icon: IconAttributeSpirit },
              ].map((c) => {
                const Icon = c.icon;
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
                      active
                        ? 'bg-primary text-[#1F1730] border-primary shadow-xs scale-102 font-black'
                        : 'border-slate-200 text-copy hover:border-slate-300 font-semibold'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-[9px] sm:text-[10px] truncate max-w-full">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Rewards */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-copy">Difficulty & Rewards</label>
              <div className="flex items-center gap-2 sm:gap-3 text-xs font-black">
                <span className="flex items-center gap-1 text-primary">
                  <IconXpGem size={14} filled />
                  +{currentRewards.xp} XP
                </span>
                <span className="flex items-center gap-1 text-[#875800] font-black">
                  <IconGoldCoin size={12} filled className="text-accent" />
                  +{currentRewards.gold} GP
                </span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {['TRIVIAL', 'EASY', 'MEDIUM', 'HARD', 'EPIC'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-1.5 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-bold capitalize border-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-primary truncate ${
                    difficulty === d
                      ? 'bg-lavender-soft/40 border-primary text-primary'
                      : 'border-slate-200 text-copy-muted hover:border-slate-300'
                  }`}
                >
                  {d.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Recording...' : editingQuest ? 'Save Changes' : 'Post Bounty'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
