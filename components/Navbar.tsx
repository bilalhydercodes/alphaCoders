'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Volume2, VolumeX, Flame, Coins, Heart, Sparkles, HelpCircle, LogOut, Compass } from 'lucide-react';

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
  const hpPercent = Math.min(100, Math.round((user.hp / (user.maxHp || 100)) * 100));

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-primary/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand & Companion title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-lavender-soft flex items-center justify-center border border-primary/30 shadow-sm overflow-hidden flex-shrink-0">
              <img
                src="/lumi/extracted/lumi-avatar.png"
                alt="Lumi companion avatar"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // graceful fallback
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-copy tracking-tight text-base sm:text-lg">
                  Life RPG
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-lavender-soft text-primary font-semibold">
                  Lumi
                </span>
              </div>
              <p className="text-xs text-copy-muted hidden sm:block">
                {user.title} · {user.username}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-background-subtle p-1 rounded-xl border border-primary/10" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('quests')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'quests'
                  ? 'bg-primary text-primary-on shadow-sm'
                  : 'text-copy-muted hover:text-copy hover:bg-white/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Quests (1)</span>
            </button>
            <button
              onClick={() => setActiveTab('codex')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'codex'
                  ? 'bg-primary text-primary-on shadow-sm'
                  : 'text-copy-muted hover:text-copy hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Codex & Stats (2)</span>
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'shop'
                  ? 'bg-primary text-primary-on shadow-sm'
                  : 'text-copy-muted hover:text-copy hover:bg-white/60'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Emporium (3)</span>
            </button>
            <button
              onClick={() => setActiveTab('dungeon')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'dungeon'
                  ? 'bg-primary text-primary-on shadow-sm'
                  : 'text-copy-muted hover:text-copy hover:bg-white/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Raid Boss (4)</span>
            </button>
          </nav>

          {/* Stats Bar: Level, XP, Gold, Streak, Health */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Level & XP Gauge */}
            <div className="flex flex-col items-end min-w-[85px] sm:min-w-[120px]">
              <div className="flex items-center justify-between w-full text-xs font-semibold mb-0.5">
                <span className="text-primary font-bold">Lv. {user.level}</span>
                <span className="text-[11px] text-copy-muted">
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
                  className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Currency Chip: Strictly gold (#F5B700) with dark text as specified in design.md */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-primary-on font-bold text-xs shadow-sm transition-transform duration-200 ${
                goldBounce ? 'scale-110 shadow-gold-glow' : ''
              }`}
              title="Gold Coins (GP)"
            >
              <Coins className="w-3.5 h-3.5 text-primary-on" />
              <span>{user.gold} GP</span>
            </div>

            {/* Streak Indicator */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-copy text-xs font-bold"
              title={`${user.streak} Day Activity Streak`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>{user.streak}d</span>
            </div>

            {/* Health / HP */}
            <div
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 border border-rose-200 text-copy text-xs font-semibold"
              title={`Health: ${user.hp}/${user.maxHp}`}
            >
              <Heart className="w-3.5 h-3.5 text-danger fill-danger" />
              <span>{user.hp}/{user.maxHp}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                isMuted
                  ? 'bg-gray-100 text-copy-muted border-gray-200 hover:bg-gray-200'
                  : 'bg-lavender-soft text-primary border-primary/30 shadow-sm'
              }`}
              title={isMuted ? 'Sound Muted (Press M to unmute)' : 'Sound Enabled (Press M to mute)'}
              aria-label={isMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Shortcuts Help */}
            <button
              onClick={onOpenShortcuts}
              className="p-2 rounded-xl bg-background-subtle border border-primary/20 text-copy-muted hover:text-copy hover:bg-lavender-soft transition-colors"
              title="Keyboard Shortcuts (?)"
              aria-label="Show keyboard shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-danger hover:bg-rose-100 transition-colors"
              title="Leave the Guild (Logout)"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-primary/10">
          <button
            onClick={() => setActiveTab('quests')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 ${
              activeTab === 'quests' ? 'bg-primary text-primary-on' : 'text-copy-muted'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>Quests</span>
          </button>
          <button
            onClick={() => setActiveTab('codex')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 ${
              activeTab === 'codex' ? 'bg-primary text-primary-on' : 'text-copy-muted'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Codex</span>
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 ${
              activeTab === 'shop' ? 'bg-primary text-primary-on' : 'text-copy-muted'
            }`}
          >
            <Coins className="w-3 h-3" />
            <span>Shop</span>
          </button>
          <button
            onClick={() => setActiveTab('dungeon')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 ${
              activeTab === 'dungeon' ? 'bg-primary text-primary-on' : 'text-copy-muted'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Boss</span>
          </button>
        </div>
      </div>
    </header>
  );
};
