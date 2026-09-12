'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { IconChest, IconXp, IconCheck } from './icons/LumiIcons';
import { Sparkles, Trophy } from 'lucide-react';

export const DailyGoalsPanel: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const xpEarnedToday = Math.min(50, user.xp % 100);
  const xpPercent = Math.round((xpEarnedToday / 50) * 100);

  const habitsDone = user.streak > 0 ? 2 : 1;
  const habitsPercent = Math.min(100, Math.round((habitsDone / 2) * 100));

  const goals = [
    {
      id: 'g1',
      title: 'Earn 50 XP Today',
      current: xpEarnedToday,
      target: 50,
      percent: xpPercent,
      reward: '+20 GP',
    },
    {
      id: 'g2',
      title: 'Complete 2 Daily Habits',
      current: habitsDone,
      target: 2,
      percent: habitsPercent,
      reward: '+15 GP',
    },
    {
      id: 'g3',
      title: 'Maintain Active Streak',
      current: user.streak,
      target: 1,
      percent: user.streak >= 1 ? 100 : 0,
      reward: '+10 GP',
    },
  ];

  const completedCount = goals.filter((g) => g.percent >= 100).length;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <IconChest size={22} filled className="text-accent" />
          <h3 className="text-sm font-black text-copy uppercase tracking-wider">
            Daily Goals
          </h3>
        </div>
        <span className="text-xs font-black text-primary px-2.5 py-0.5 rounded-full bg-lavender-soft">
          {completedCount} / 3 DONE
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        {goals.map((g) => {
          const isDone = g.percent >= 100;
          return (
            <div key={g.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-copy">
                <div className="flex items-center gap-1.5">
                  {isDone ? (
                    <IconCheck size={14} filled className="text-success" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                  <span>{g.title}</span>
                </div>
                <span className="text-[11px] font-extrabold text-primary">
                  {g.reward}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isDone ? 'bg-success' : 'bg-primary'
                  }`}
                  style={{ width: `${g.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
