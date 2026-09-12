'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/sound';
import {
  IconSwords,
  IconLeague,
  IconStreakFlame,
  IconHelp,
  IconXpGem,
  IconGoldCoin,
} from './icons/LumiIcons';

export const DungeonRaid: React.FC = () => {
  const [boss, setBoss] = useState<any | null>(null);
  const [recentHits, setRecentHits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [damageNumber, setDamageNumber] = useState<number | null>(null);

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
      <div className="bg-surface rounded-2xl border-2 border-slate-200 p-8 text-center text-xs text-copy-muted font-bold">
        Scouting dungeon depths...
      </div>
    );
  }

  if (!boss) {
    return (
      <div className="bg-surface rounded-2xl border-2 border-slate-200 p-8 text-center flex flex-col items-center">
        <IconLeague size={40} filled className="text-accent mb-2" />
        <h3 className="text-base font-black text-copy">All Dungeon Bosses Slain!</h3>
        <p className="text-xs text-copy-muted mt-1 max-w-sm">
          The dungeon is pacified for now. Continue completing daily quests to maintain peace across the realm!
        </p>
      </div>
    );
  }

  const handleStrike = (dmg: number = 45) => {
    sound.playHit();
    setIsShaking(true);
    setDamageNumber(dmg);
    setBoss((prev: any) =>
      prev ? { ...prev, currentHp: Math.max(0, prev.currentHp - dmg) } : prev
    );
    setTimeout(() => setIsShaking(false), 400);
    setTimeout(() => setDamageNumber(null), 1200);
  };

  const hpPercent = Math.max(0, Math.round((boss.currentHp / boss.maxHp) * 100));

  return (
    <div className={`flex flex-col gap-4 text-left relative ${isShaking ? 'animate-shake' : ''}`}>
      {/* Floating Damage Text */}
      {damageNumber && (
        <div className="absolute top-2 right-4 font-black text-danger text-base animate-float-up pointer-events-none drop-shadow-md z-20">
          -{damageNumber} DMG!
        </div>
      )}

      {/* Boss Encounter Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger-soft text-danger text-xs font-black self-start">
          <IconStreakFlame size={14} filled className="animate-flame-breathe" />
          <span>ACTIVE RAID BOSS</span>
        </div>

        <h3 className="text-lg font-black text-copy tracking-tight">
          {boss.name}
        </h3>
        <p className="text-xs font-bold text-primary">{boss.title}</p>
        <p className="text-xs text-copy-muted leading-relaxed">
          {boss.description}
        </p>

        <div className="flex items-center gap-3 text-xs font-bold text-copy">
          <span className="flex items-center gap-1 text-primary">
            <IconXpGem size={14} filled />
            <span>+{boss.rewardXp} XP</span>
          </span>
          <span className="flex items-center gap-1 text-[#875800] font-black">
            <IconGoldCoin size={14} filled className="text-accent" />
            <span>+{boss.rewardGold} GP</span>
          </span>
        </div>
      </div>

      {/* Boss HP Gauge */}
      <div className="w-full bg-background p-4 rounded-2xl border border-slate-200 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-danger flex items-center gap-1">
            <IconSwords size={16} />
            <span>Boss Health</span>
          </span>
          <span className="text-copy font-black">
            {boss.currentHp} / {boss.maxHp} HP ({hpPercent}%)
          </span>
        </div>

        <div
          className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={hpPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Boss health"
        >
          <div
            className="h-full rounded-full transition-all duration-500 bg-danger"
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        <div className="p-2 rounded-xl bg-surface border border-slate-200 text-[11px] text-copy-muted flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <IconHelp size={14} className="text-primary shrink-0" />
            <span>Completed bounties deal damage equal to quest XP!</span>
          </div>
          <button
            type="button"
            onClick={() => handleStrike(45)}
            className="px-2 py-1 rounded-lg text-[10px] font-black bg-danger/10 text-danger hover:bg-danger/20 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Simulate Guild Strike"
          >
            Strike ⚔
          </button>
        </div>
      </div>

      {/* Recent Strikes Log */}
      {recentHits.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-copy-muted">
            Recent Guild Strikes
          </span>
          <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
            {recentHits.slice(0, 3).map((hit) => (
              <div
                key={hit.id}
                className="p-2 rounded-xl bg-background border border-slate-200 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-copy truncate max-w-[160px]">
                  "{hit.questTitle}"
                </span>
                <span className="font-black text-danger text-[11px] px-2 py-0.5 rounded-full bg-danger-soft shrink-0">
                  -{hit.damageDealt} DMG
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
