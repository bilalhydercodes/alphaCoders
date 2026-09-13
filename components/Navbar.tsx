'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LumiPresenter } from './lumi/LumiPresenter';
import {
  IconVolumeOn,
  IconVolumeMuted,
  IconStreakFlame,
  IconGoldCoin,
  IconHeart,
  IconSparkles,
  IconHelp,
  IconLogout,
  IconMap,
  IconShop,
  IconSwords,
  IconCodex,
} from './icons/LumiIcons';

interface NavbarProps {
  onOpenShortcuts: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenShortcuts, activeTab, setActiveTab }) => {
  const { user, logout, isMuted, toggleSound } = useAuth();
  const [goldBounce, setGoldBounce] = useState(false);
  const [prevGold, setPrevGold] = useState<number | null>(null);

  useEffect(() => {
    if (user && prevGold !== null && user.gold !== prevGold) {
      setGoldBounce(true);
      const timer = setTimeout(() => setGoldBounce(false), 600);
      return () => clearTimeout(timer);
    }
    if (user) {
      setPrevGold(user.gold);
    }
  }, [user?.gold, prevGold, user]);

  if (!user) return null;

  const xpPercent = Math.min(100, Math.round((user.xp / (user.xpNeeded || 100)) * 100));

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b-2 border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand & Companion title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-lavender-soft flex items-center justify-center border-2 border-primary/30 shadow-xs overflow-hidden shrink-0">
              <LumiPresenter variant="mini" height={40} showSpeech={false} interactive={false} className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-copy tracking-tight text-base sm:text-lg">
                  Lumi
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-lavender-soft text-primary font-bold">
                  Codex
                </span>
              </div>
              <p className="text-xs text-copy-muted hidden sm:block">
                {user.title} · {user.username}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-background p-1 rounded-2xl border border-slate-200" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => setActiveTab('quests')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'quests'
                  ? 'bg-primary text-[#1F1730] shadow-xs'
                  : 'text-copy-muted hover:text-copy hover:bg-surface'
              }`}
            >
              <IconMap size={16} />
              <span>Quests (1)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('codex')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'codex'
                  ? 'bg-primary text-[#1F1730] shadow-xs'
                  : 'text-copy-muted hover:text-copy hover:bg-surface'
              }`}
            >
              <IconCodex size={16} />
              <span>Codex & Stats (2)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shop')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'shop'
                  ? 'bg-primary text-[#1F1730] shadow-xs'
                  : 'text-copy-muted hover:text-copy hover:bg-surface'
              }`}
            >
              <IconShop size={16} />
              <span>Emporium (3)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dungeon')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'dungeon'
                  ? 'bg-primary text-[#1F1730] shadow-xs'
                  : 'text-copy-muted hover:text-copy hover:bg-surface'
              }`}
            >
              <IconSwords size={16} />
              <span>Raid Boss (4)</span>
            </button>
          </nav>

          {/* Stats Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Level & XP Gauge */}
            <div className="flex flex-col items-end min-w-[85px] sm:min-w-[120px]">
              <div className="flex items-center justify-between w-full text-xs font-semibold mb-0.5">
                <span className="text-primary font-bold">Lv. {user.level}</span>
                <span className="text-[11px] text-copy-muted font-bold">
                  {user.xp}/{user.xpNeeded} XP
                </span>
              </div>
              <div
                className="w-full h-2 bg-lavender-soft rounded-full overflow-hidden border border-primary/20"
                role="progressbar"
                aria-valuenow={xpPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Experience points"
              >
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Currency Chip */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-accent text-[#1F1730] font-black text-xs shadow-xs transition-transform duration-200 ${
                goldBounce ? 'scale-110' : ''
              }`}
              title="Gold Coins (GP)"
            >
              <IconGoldCoin size={16} filled />
              <span>{user.gold} GP</span>
            </div>

            {/* Streak Indicator */}
            <div
              className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-surface border-2 border-slate-200 text-copy text-xs font-black"
              title={`${user.streak} Day Activity Streak`}
            >
              <IconStreakFlame size={16} filled className="text-accent animate-flame-breathe" />
              <span>{user.streak}d</span>
            </div>

            {/* Health / HP */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-surface border-2 border-slate-200 text-copy text-xs font-black"
              title={`Health: ${user.hp}/${user.maxHp}`}
            >
              <IconHeart size={16} filled className="text-danger" />
              <span>{user.hp}/{user.maxHp}</span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary ${
                isMuted
                  ? 'bg-slate-50 text-copy-muted border-slate-200 hover:bg-slate-100'
                  : 'bg-lavender-soft text-primary border-primary/30 shadow-xs'
              }`}
              title={isMuted ? 'Sound Muted (M)' : 'Sound Enabled (M)'}
              aria-label={isMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
            >
              {isMuted ? <IconVolumeMuted size={18} /> : <IconVolumeOn size={18} />}
            </button>

            {/* Shortcuts Help */}
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="p-2.5 rounded-xl bg-surface border border-slate-200 text-copy-muted hover:text-copy hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
              title="Keyboard Shortcuts (?)"
              aria-label="Show keyboard shortcuts"
            >
              <IconHelp size={18} />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className="p-2.5 rounded-xl text-copy-muted hover:text-danger hover:bg-danger-soft transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
              title="Leave Guild (Logout)"
              aria-label="Logout"
            >
              <IconLogout size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
