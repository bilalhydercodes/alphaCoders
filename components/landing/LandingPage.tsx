'use client';

import React, { useState, useEffect } from 'react';
import { LandingNav } from './LandingNav';
import { ScrollyVideoCanvas } from './ScrollyVideoCanvas';
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
      <main className="flex-1 flex flex-col relative">
        {/* 1. 3D Scrollytelling Experience with Integrated Draft Paper Curtain Hero */}
        <ScrollyVideoCanvas onOpenAuth={() => handleOpenAuth('register')} />

        {/* 2. Platform Overview: Architectural Brief explaining what the platform is */}
        <PlatformOverview onOpenAuth={() => handleOpenAuth('register')} />

        {/* 3. Progression Layers: 4 Systems Features & FAQ */}
        <div className="relative z-20 bg-background shadow-[0_-30px_90px_rgba(0,0,0,0.5)]">
          <LandingFeatures />
          <LandingFaq />
          <LandingFooter
            onOpenAuth={() => handleOpenAuth('register')}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
          />
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
