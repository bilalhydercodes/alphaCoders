'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Shield, Trophy, Swords, Zap, AlertCircle } from 'lucide-react';

export const DungeonRaid: React.FC = () => {
  const [boss, setBoss] = useState<any | null>(null);
  const [recentHits, setRecentHits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoss = async () => {
    try {
      const res = await fetch('/api/boss');
      const data = await res.json();
      if (data.boss) {
        setBoss(data.boss);
        setRecentHits(data.recentHits || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoss();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lumi border border-primary/15 p-12 text-center text-xs text-copy-muted">
        Scouting dungeon depths...
      </div>
    );
  }

  if (!boss) {
    return (
      <div className="bg-white rounded-lumi border border-primary/15 p-8 text-center flex flex-col items-center">
        <Trophy className="w-12 h-12 text-accent mb-3" />
        <h3 className="text-base font-bold text-copy">All Dungeon Bosses Slain!</h3>
        <p className="text-xs text-copy-muted mt-1 max-w-sm">
          The dungeon is pacified for now. Continue completing daily quests to maintain peace across the realm!
        </p>
      </div>
    );
  }

  const hpPercent = Math.max(0, Math.round((boss.currentHp / boss.maxHp) * 100));

  return (
    <div className="flex flex-col gap-6">
      {/* Boss Stage Header */}
      <div className="bg-gradient-to-b from-purple-900/10 to-white rounded-lumi border border-primary/20 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-danger text-xs font-bold">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>ACTIVE RAID BOSS ENCOUNTER</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-copy tracking-tight mt-1">
            {boss.name}
          </h2>
          <p className="text-xs font-semibold text-primary">{boss.title}</p>
          <p className="text-xs text-copy-muted max-w-md mt-1 leading-relaxed">
            {boss.description}
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs font-bold text-copy">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-accent" />
              <span>Reward: +{boss.rewardXp} XP · +{boss.rewardGold} GP</span>
            </span>
          </div>
        </div>

        {/* Boss HP Gauge */}
        <div className="w-full md:w-80 bg-white p-5 rounded-2xl border border-primary/20 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-danger flex items-center gap-1">
              <Swords className="w-3.5 h-3.5" />
              <span>Boss Health</span>
            </span>
            <span className="text-copy font-extrabold">
              {boss.currentHp} / {boss.maxHp} HP ({hpPercent}%)
            </span>
          </div>

          <div
            className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200"
            role="progressbar"
            aria-valuenow={hpPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Boss health percentage"
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                hpPercent > 50
                  ? 'bg-danger'
                  : hpPercent > 20
                  ? 'bg-amber-500'
                  : 'bg-rose-600 animate-pulse'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          <div className="p-2.5 rounded-xl bg-background text-[11px] text-copy-muted flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Every quest you complete deals damage equal to the quest's XP!</span>
          </div>
        </div>
      </div>

      {/* Recent Strikes Log */}
      <div className="bg-white rounded-lumi border border-primary/15 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-copy flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-accent" />
          <span>Recent Strikes Against Boss</span>
        </h3>

        {recentHits.length === 0 ? (
          <p className="text-xs text-copy-muted text-center py-6">
            No attacks recorded yet today. Complete a bounty on your Quest Board to strike the boss!
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentHits.map((hit) => (
              <div
                key={hit.id}
                className="p-3 rounded-xl bg-background border border-primary/10 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-copy">{hit.user?.username || 'Adventurer'}</span>
                  <span className="text-copy-muted">struck with</span>
                  <span className="font-semibold text-primary">"{hit.questTitle}"</span>
                </div>
                <span className="font-extrabold text-danger text-xs px-2.5 py-0.5 rounded-full bg-danger-soft">
                  -{hit.damageDealt} DMG
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
