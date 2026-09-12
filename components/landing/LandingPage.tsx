'use client';

import React, { useState, useEffect } from 'react';
import { LandingNav } from './LandingNav';
import { ScrollyVideoCanvas } from './ScrollyVideoCanvas';
import { CatalogueCard } from './CatalogueCard';
import { PlatformOverview } from './PlatformOverview';
import { LandingFeatures } from './LandingFeatures';
import { LandingFaq } from './LandingFaq';
import { LandingFooter } from './LandingFooter';
import { AuthScreen } from '../AuthScreen';
import { KeyboardShortcutsModal } from '../KeyboardShortcutsModal';

interface LandingPageProps {
  onEnterDashboard?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Check for ?auth=login or ?auth=register URL parameter on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get('auth');
      if (authParam === 'login' || authParam === 'register') {
        setAuthMode(authParam);
        setAuthModalOpen(true);
      }
    }
  }, []);

  // Global Escape key listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (authModalOpen) setAuthModalOpen(false);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
      } else if (e.key === '?' && !authModalOpen) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          setIsShortcutsOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, isShortcutsOpen]);

  const handleOpenAuth = (mode: 'login' | 'register' = 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-copy selection:bg-lavender-soft selection:text-primary flex flex-col font-sans relative">
      {/* Floating Center Dock Navigation */}
      <LandingNav
        onOpenAuth={handleOpenAuth}
        onOpenDashboard={onEnterDashboard}
      />

      {/* Main Experience */}
      <main className="flex-1 flex flex-col relative overflow-x-hidden">
        {/* 1. 3D Scrollytelling Experience with Integrated Draft Paper Curtain Hero */}
        <ScrollyVideoCanvas onOpenAuth={() => handleOpenAuth('register')} />

        {/* 2. Separated Catalogue Deck: Each section moves up in turn from left and right */}
        <div className="relative z-20 w-full py-12 sm:py-20 bg-draft-paper border-t border-[#262524] flex flex-col gap-2 sm:gap-6">
          {/* Card 1: What is this product (moves from LEFT and up) */}
          <CatalogueCard
            id="about-platform"
            direction="left"
            cardIndex="01 // OVERVIEW"
            category="WHAT IS LIFE RPG"
            bgClassName="bg-draft-paper"
          >
            <PlatformOverview onOpenAuth={() => handleOpenAuth('register')} embedded />
          </CatalogueCard>

          {/* Card 2: What are the features (moves from RIGHT and up) */}
          <CatalogueCard
            id="features"
            direction="right"
            cardIndex="02 // ARCHITECTURE"
            category="CORE RPG FEATURES"
            bgClassName="bg-white"
          >
            <LandingFeatures embedded />
          </CatalogueCard>

          {/* Card 3: FAQs (moves from LEFT and up) */}
          <CatalogueCard
            id="faq"
            direction="left"
            cardIndex="03 // INQUIRIES"
            category="FREQUENTLY ASKED QUESTIONS"
            bgClassName="bg-[#FAF8F5]"
          >
            <LandingFaq embedded />
          </CatalogueCard>

          {/* Card 4: Footer (moves from RIGHT and up) */}
          <CatalogueCard
            id="guild-footer"
            direction="right"
            cardIndex="04 // DISPATCH"
            category="ADVENTURERS GUILD"
            bgClassName="bg-white"
          >
            <LandingFooter
              onOpenAuth={() => handleOpenAuth('register')}
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
              embedded
            />
          </CatalogueCard>
        </div>
      </main>

      {/* Accessible Authentication Modal */}
      {authModalOpen && (
        <AuthScreen
          isModal
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {
            setAuthModalOpen(false);
            onEnterDashboard?.();
          }}
        />
      )}

      {/* Accessible Keyboard Shortcuts Cheatsheet */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
