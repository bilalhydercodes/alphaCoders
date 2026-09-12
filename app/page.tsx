'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { UserProgressHeader } from '@/components/UserProgressHeader';
import { AuthScreen } from '@/components/AuthScreen';
import { LumiCompanion } from '@/components/LumiCompanion';
import { QuestMap } from '@/components/QuestMap';
import { QuestBoard, Quest } from '@/components/QuestBoard';
import { GuildLeague } from '@/components/GuildLeague';
import { GuildEmporium } from '@/components/GuildEmporium';
import { CharacterCodex } from '@/components/CharacterCodex';
import { ProfileSection } from '@/components/ProfileSection';
import { Settings } from '@/components/Settings';
import { DailyGoalsPanel } from '@/components/DailyGoalsPanel';
import { DungeonRaid } from '@/components/DungeonRaid';
import { QuestModal } from '@/components/QuestModal';
import { LevelUpModal } from '@/components/LevelUpModal';
import { FocusTimerModal } from '@/components/FocusTimerModal';
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal';
import {
  IconMap,
  IconBounties,
  IconLeague,
  IconShop,
  IconCodex,
  IconProfile,
  IconSettings,
} from '@/components/icons/LumiIcons';
import { LandingPage } from '@/components/landing/LandingPage';
import { LumiMascot } from '@/components/LumiMascot';
import { XpArcProvider } from '@/components/XpArcManager';
import { LumiProvider, LumiDebugPanel, useLumi, NAVIGATION_INTENTS } from '@/components/lumi';

export default function HomePage() {
  const { user, isLoading, toggleSound } = useAuth();
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<string>('map');
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    xpEarned: number;
    goldEarned: number;
    statGained: { attribute: string; points: number };
  } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sync viewMode with query parameter (?view=landing or ?view=dashboard) or persisted session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryView = params.get('view');
      if (queryView === 'dashboard') {
        setViewMode('dashboard');
        sessionStorage.setItem('liferpg_active_view', 'dashboard');
      } else if (queryView === 'landing') {
        setViewMode('landing');
        sessionStorage.setItem('liferpg_active_view', 'landing');
      } else {
        const saved = sessionStorage.getItem('liferpg_active_view');
        if (saved === 'dashboard') {
          setViewMode('dashboard');
        } else {
          setViewMode('landing');
          sessionStorage.setItem('liferpg_active_view', 'landing');
        }
      }
    }
  }, []);

  const handleEnterDashboard = () => {
    setViewMode('dashboard');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('liferpg_active_view', 'dashboard');
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'dashboard');
      window.history.replaceState(null, '', url.toString());
    }
  };

  const handleViewLanding = () => {
    setViewMode('landing');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('liferpg_active_view', 'landing');
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      window.history.replaceState(null, '', url.pathname + url.hash);
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      if (e.key === 'Escape') {
        setIsQuestModalOpen(false);
        setIsFocusTimerOpen(false);
        setIsShortcutsOpen(false);
        setLevelUpData(null);
      } else if (e.key === 'q' || e.key === 'Q' || e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingQuest(null);
        setIsQuestModalOpen(true);
      } else if (e.key === '1') {
        setActiveTab('map');
      } else if (e.key === '2') {
        setActiveTab('bounties');
      } else if (e.key === '3') {
        setActiveTab('league');
      } else if (e.key === '4') {
        setActiveTab('shop');
      } else if (e.key === '5') {
        setActiveTab('codex');
      } else if (e.key === '6') {
        setActiveTab('profile');
      } else if (e.key === '7') {
        setActiveTab('settings');
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleSound();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsFocusTimerOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSound]);

  // Loading Screen featuring Lumi
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-36 h-36 mb-4 flex items-center justify-center">
          <LumiMascot mood="explore" size={130} />
        </div>
        <h2 className="text-lg font-black text-copy">Opening the Adventurer's Codex...</h2>
        <p className="text-xs text-copy-muted font-semibold mt-1">Lumi is preparing your path to mastery.</p>
      </div>
    );
  }

  // Determine whether to display Landing Page or Dashboard
  const showLanding = viewMode === 'landing' || (!user && viewMode !== 'dashboard');

  if (showLanding) {
    return (
      <LumiProvider>
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      </LumiProvider>
    );
  }

  // If user navigated directly to dashboard mode but is unauthenticated, show AuthScreen
  if (!user) {
    return (
      <LumiProvider>
        <AuthScreen
          onClose={handleViewLanding}
          onSuccess={handleEnterDashboard}
        />
      </LumiProvider>
    );
  }

  return (
    <LumiProvider>
      <XpArcProvider>
        <DashboardContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onViewLanding={handleViewLanding}
          isQuestModalOpen={isQuestModalOpen}
          setIsQuestModalOpen={setIsQuestModalOpen}
          editingQuest={editingQuest}
          setEditingQuest={setEditingQuest}
          isFocusTimerOpen={isFocusTimerOpen}
          setIsFocusTimerOpen={setIsFocusTimerOpen}
          isShortcutsOpen={isShortcutsOpen}
          setIsShortcutsOpen={setIsShortcutsOpen}
          levelUpData={levelUpData}
          setLevelUpData={setLevelUpData}
          refreshTrigger={refreshTrigger}
          setRefreshTrigger={setRefreshTrigger}
        />
      </XpArcProvider>
    </LumiProvider>
  );
}

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onViewLanding?: () => void;
  isQuestModalOpen: boolean;
  setIsQuestModalOpen: (open: boolean) => void;
  editingQuest: Quest | null;
  setEditingQuest: (q: Quest | null) => void;
  isFocusTimerOpen: boolean;
  setIsFocusTimerOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  levelUpData: any;
  setLevelUpData: (data: any) => void;
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  setActiveTab,
  onViewLanding,
  isQuestModalOpen,
  setIsQuestModalOpen,
  editingQuest,
  setEditingQuest,
  isFocusTimerOpen,
  setIsFocusTimerOpen,
  isShortcutsOpen,
  setIsShortcutsOpen,
  levelUpData,
  setLevelUpData,
  refreshTrigger,
  setRefreshTrigger,
}) => {
  const { setZone, react: lumiReact } = useLumi();

  // Sync activeTab with Lumi navigation intents
  useEffect(() => {
    const intent = NAVIGATION_INTENTS[activeTab];
    if (intent) {
      setZone(intent.zone);
      if (intent.speechHint) {
        lumiReact('EXPLORE', intent.speechHint);
      }
    }
  }, [activeTab, setZone, lumiReact]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 1. Left Fixed Desktop Sidebar (256px wide) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onViewLanding={onViewLanding}
      />

      {/* Mobile Bottom Navigation Bar (<768px) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t-2 border-slate-200 z-40 flex items-center justify-around px-2"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl min-h-[44px] justify-center ${
            activeTab === 'map' ? 'text-primary font-black' : 'text-copy-muted'
          }`}
        >
          <IconMap size={20} filled={activeTab === 'map'} />
          <span className="text-[10px] font-bold">Map</span>
        </button>
        <button
          onClick={() => setActiveTab('bounties')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl min-h-[44px] justify-center ${
            activeTab === 'bounties' ? 'text-primary font-black' : 'text-copy-muted'
          }`}
        >
          <IconBounties size={20} filled={activeTab === 'bounties'} />
          <span className="text-[10px] font-bold">Bounties</span>
        </button>
        <button
          onClick={() => setActiveTab('league')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl min-h-[44px] justify-center ${
            activeTab === 'league' ? 'text-primary font-black' : 'text-copy-muted'
          }`}
        >
          <IconLeague size={20} filled={activeTab === 'league'} />
          <span className="text-[10px] font-bold">League</span>
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl min-h-[44px] justify-center ${
            activeTab === 'shop' ? 'text-primary font-black' : 'text-copy-muted'
          }`}
        >
          <IconShop size={20} filled={activeTab === 'shop'} />
          <span className="text-[10px] font-bold">Shop</span>
        </button>
        <button
          onClick={() => setActiveTab('codex')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl min-h-[44px] justify-center ${
            activeTab === 'codex' ? 'text-primary font-black' : 'text-copy-muted'
          }`}
        >
          <IconCodex size={20} filled={activeTab === 'codex'} />
          <span className="text-[10px] font-bold">Codex</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl min-h-[44px] justify-center ${
            activeTab === 'profile' ? 'text-primary font-black' : 'text-copy-muted'
          }`}
        >
          <IconProfile size={20} filled={activeTab === 'profile'} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl min-h-[44px] justify-center ${
            activeTab === 'settings' ? 'text-primary font-black' : 'text-copy-muted'
          }`}
        >
          <IconSettings size={20} filled={activeTab === 'settings'} />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>

      {/* 2. Main Content Viewport (Indented 72px on tablet, 256px on desktop) */}
      <div className="md:pl-[72px] lg:pl-[256px] min-h-screen pb-20 md:pb-10 flex flex-col">
        <div className="max-w-[1080px] w-full mx-auto px-4 sm:px-8 pt-4 flex-1 flex flex-col">
          {/* Top Status Header */}
          <UserProgressHeader onOpenFocus={() => setIsFocusTimerOpen(true)} />

          {/* 3. Responsive 2-Column Grid: Center Feed + Sticky Right Rail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 items-start flex-1">
            {/* Center Canvas */}
            <main
              className={`${
                activeTab === 'settings' || activeTab === 'profile'
                  ? 'lg:col-span-12 max-w-4xl mx-auto w-full'
                  : 'lg:col-span-7'
              } flex flex-col`}
            >
              {activeTab === 'map' && (
                <QuestMap onCompleteQuestModal={() => setIsQuestModalOpen(true)} />
              )}

              {activeTab === 'bounties' && (
                <QuestBoard
                  key={refreshTrigger}
                  onOpenCreateModal={() => {
                    setEditingQuest(null);
                    setIsQuestModalOpen(true);
                  }}
                  onOpenEditModal={(quest) => {
                    setEditingQuest(quest);
                    setIsQuestModalOpen(true);
                  }}
                  onTriggerLevelUp={(data) => setLevelUpData(data)}
                  onOpenFocus={() => setIsFocusTimerOpen(true)}
                />
              )}

              {activeTab === 'league' && <GuildLeague />}

              {activeTab === 'shop' && <GuildEmporium />}

              {activeTab === 'codex' && <CharacterCodex />}

              {activeTab === 'profile' && <ProfileSection />}

              {activeTab === 'settings' && <Settings />}
            </main>

            {/* Right Sticky Rail (hidden on Settings and Profile to match full-width reference layout) */}
            {activeTab !== 'settings' && activeTab !== 'profile' && (
              <aside className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-20">
                {/* Lumi Mascot Companion Card */}
                <LumiCompanion onStartFocus={() => setIsFocusTimerOpen(true)} />

                {/* Daily Goals Mini-Challenge Card */}
                <DailyGoalsPanel />

                {/* Active Dungeon Raid Summary */}
                {activeTab !== 'codex' && (
                  <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs">
                    <DungeonRaid />
                  </div>
                )}
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuestModal
        isOpen={isQuestModalOpen}
        editingQuest={editingQuest}
        onClose={() => {
          setIsQuestModalOpen(false);
          setEditingQuest(null);
        }}
        onQuestSaved={() => setRefreshTrigger((prev) => prev + 1)}
      />

      {levelUpData && (
        <LevelUpModal
          isOpen={!!levelUpData}
          newLevel={levelUpData.newLevel}
          xpEarned={levelUpData.xpEarned}
          goldEarned={levelUpData.goldEarned}
          statGained={levelUpData.statGained}
          onClose={() => setLevelUpData(null)}
        />
      )}

      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        onTimerComplete={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <LumiDebugPanel />
    </div>
  );
};
