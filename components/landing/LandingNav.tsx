'use client';

import React from 'react';
import { LumiMascot } from '../LumiMascot';
import { useAuth } from '@/context/AuthContext';
import { IconSparkles } from '../icons/LumiIcons';

interface LandingNavProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenDashboard?: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ onOpenAuth, onOpenDashboard }) => {
  const { user, isMuted, toggleSound } = useAuth();

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-4 flex justify-center pointer-events-none">
      {/* Strict Sharp Rectangular Nav Island - Exactly like the reference image (no rounded corners) */}
      <div className="w-full max-w-[880px] bg-white border border-[#2B2927] shadow-[0_4px_16px_rgba(0,0,0,0.06)] px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-3 sm:gap-4 pointer-events-auto rounded-none transition-all">
        {/* Left: Brand Identity (Sharp rectangular icon box + typography) */}
        <div className="flex items-center">
          <a
            href="#"
            className="flex items-center gap-2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7042C1] rounded-none"
            aria-label="Life RPG Home"
          >
            {/* Square sharp icon container */}
            <div className="w-7 h-7 bg-[#EDE4FC] border border-[#2B2927] rounded-none flex items-center justify-center shrink-0">
              <LumiMascot mood="content" size={18} />
            </div>
            <span className="text-[15px] font-black text-[#1E1D1C] tracking-tight ml-1">
              Life RPG
            </span>
          </a>
        </div>

        {/* Center: Navigation Links (Clean text links matching reference) */}
        <nav
          className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-[#5A534B]"
          aria-label="Primary Navigation"
        >
          <a
            href="#features"
            onClick={(e) => {
              const el = document.getElementById('features');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-[#1E1D1C] transition-colors py-1"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              const el = document.getElementById('how-it-works');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-[#1E1D1C] transition-colors py-1"
          >
            How It Works
          </a>
          <a
            href="#meet-lumi"
            onClick={(e) => {
              const el = document.getElementById('meet-lumi');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-[#1E1D1C] transition-colors py-1"
          >
            Companion
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              const el = document.getElementById('faq');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hover:text-[#1E1D1C] transition-colors py-1"
          >
            FAQ
          </a>
        </nav>

        {/* Right: Actions (Strict sharp rectangle button with dashboard purple palette) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Audio Chime Mute Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="hidden sm:inline-flex items-center justify-center w-7 h-7 bg-slate-100 hover:bg-slate-200 border border-[#2B2927] rounded-none text-slate-700 transition-colors text-xs font-bold cursor-pointer"
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? '🔇' : '🔔'}
          </button>

          {user ? (
            <a
              href="/dashboard"
              onClick={(e) => {
                if (onOpenDashboard) {
                  e.preventDefault();
                  onOpenDashboard();
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-[#7042C1] hover:bg-[#5F37A6] active:bg-[#4E2B8D] border border-[#2B2927] rounded-none shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <div className="w-4 h-4 bg-[#542E96] rounded-none flex items-center justify-center shrink-0">
                <IconSparkles size={11} className="text-white" />
              </div>
              <span>Open Dashboard</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="text-xs font-semibold text-[#5A534B] hover:text-[#1E1D1C] transition-colors cursor-pointer hidden sm:block px-1"
              >
                Log in
              </button>

              {/* Exact sharp rectangle button with left square icon box */}
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-bold text-white bg-[#7042C1] hover:bg-[#5F37A6] active:bg-[#4E2B8D] border border-[#2B2927] rounded-none shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-4 h-4 bg-[#542E96] rounded-none flex items-center justify-center shrink-0">
                  <IconSparkles size={11} className="text-white" />
                </div>
                <span>Try for free</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
