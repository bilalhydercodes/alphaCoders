'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sound } from '@/lib/sound';
import { DIFFICULTY_REWARDS } from '@/lib/progression';
import { X, Sparkles, BookOpen, Dumbbell, Zap, Heart, Plus, Edit2 } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-copy/50 backdrop-blur-sm animate-in fade-in duration-200"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-lumi-lg border border-primary/20 shadow-2xl p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-copy-muted hover:text-copy rounded-xl hover:bg-lavender-soft transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-lavender-soft text-primary flex items-center justify-center">
            {editingQuest ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
          <h3 id="modal-title" className="text-lg font-bold text-copy">
            {editingQuest ? 'Modify Guild Bounty' : 'Post New Guild Bounty'}
          </h3>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger-soft border border-danger/20 text-xs font-semibold text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-copy mb-1">
              Quest Title <span className="text-danger">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 20 pages of clean architecture"
              className="w-full px-3.5 py-2.5 rounded-xl border border-primary/20 bg-background text-sm text-copy placeholder:text-copy-muted focus:bg-white focus:border-primary transition-all outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-copy mb-1">
              Details or Real-World Motivation (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key notes or goals..."
              className="w-full px-3.5 py-2 rounded-xl border border-primary/20 bg-background text-sm text-copy placeholder:text-copy-muted focus:bg-white focus:border-primary transition-all outline-none resize-none"
            />
          </div>

          {/* Quest Type */}
          <div>
            <label className="block text-xs font-bold text-copy mb-1.5">Quest Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'DAILY', label: 'Daily Bounty', desc: 'Resets each day' },
                { id: 'TODO', label: 'One-Time Bounty', desc: 'Single completion' },
                { id: 'HABIT', label: 'Core Habit', desc: 'Repeated tracking' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    type === t.id
                      ? 'bg-lavender-soft border-primary text-primary shadow-sm'
                      : 'border-gray-200 text-copy-muted hover:border-primary/40'
                  }`}
                >
                  <p className="text-xs font-bold text-copy">{t.label}</p>
                  <p className="text-[10px] text-copy-muted">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Attribute Mapping */}
          <div>
            <label className="block text-xs font-bold text-copy mb-1.5">
              Character Attribute Trained
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'INTELLECT', label: 'Intellect', icon: BookOpen },
                { id: 'STRENGTH', label: 'Strength', icon: Dumbbell },
                { id: 'AGILITY', label: 'Agility', icon: Zap },
                { id: 'VITALITY', label: 'Vitality', icon: Heart },
                { id: 'SPIRIT', label: 'Spirit', icon: Sparkles },
              ].map((c) => {
                const Icon = c.icon;
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      active
                        ? 'bg-primary text-primary-on border-primary shadow-sm scale-105'
                        : 'border-gray-200 text-copy hover:border-primary/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-semibold">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Rewards */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-copy">Difficulty & Rewards</label>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-success">+{currentRewards.xp} XP</span>
                <span className="text-accent">+{currentRewards.gold} GP</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {['TRIVIAL', 'EASY', 'MEDIUM', 'HARD', 'EPIC'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    difficulty === d
                      ? 'bg-lavender-soft border-primary text-primary font-bold'
                      : 'border-gray-200 text-copy-muted hover:border-primary/30'
                  }`}
                >
                  {d.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-primary/10 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-copy-muted hover:text-copy hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-on font-bold text-xs shadow-sm hover:bg-primary-hover active:scale-97 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : editingQuest ? 'Save Changes' : 'Post Bounty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
