'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { AuthScreen } from '@/components/AuthScreen';
import { LumiCompanion } from '@/components/LumiCompanion';
import { QuestBoard, Quest } from '@/components/QuestBoard';
import { QuestModal } from '@/components/QuestModal';
import { CharacterCodex } from '@/components/CharacterCodex';
import { GuildEmporium } from '@/components/GuildEmporium';
import { DungeonRaid } from '@/components/DungeonRaid';
import { LevelUpModal } from '@/components/LevelUpModal';
import { FocusTimerModal } from '@/components/FocusTimerModal';
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal';

export default function HomePage() {
  const { user, isLoading, toggleSound } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('quests');
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

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys when user is actively typing in an input or textarea
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
        setActiveTab('quests');
      } else if (e.key === '2') {
        setActiveTab('codex');
      } else if (e.key === '3') {
        setActiveTab('shop');
      } else if (e.key === '4') {
        setActiveTab('dungeon');
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-36 h-36 mb-4 flex items-center justify-center">
          <img
            src="/lumi/extracted/reaction-explore.png"
            alt="Lumi thinking"
            className="w-full h-full object-contain animate-bounce-subtle drop-shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/lumi/extracted/lumi-avatar.png';
            }}
          />
        </div>
        <h2 className="text-base font-bold text-copy">Opening the Adventurer's Codex...</h2>
        <p className="text-xs text-copy-muted mt-1">Lumi is preparing your daily quests.</p>
      </div>
    );
  }

  // Not authenticated -> Show Auth & Welcome Screen
  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Accessible Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main App Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Content Area (2 cols on large screen) */}
          <main className="lg:col-span-2">
            {activeTab === 'quests' && (
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
              />
            )}

            {activeTab === 'codex' && <CharacterCodex />}

            {activeTab === 'shop' && <GuildEmporium />}

            {activeTab === 'dungeon' && <DungeonRaid />}
          </main>

          {/* Right Companion Dock (1 col on large screen) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 flex flex-col gap-5">
            <LumiCompanion onStartFocus={() => setIsFocusTimerOpen(true)} />
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
    </div>
  );
}
