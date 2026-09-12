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
    <header className="fixed top-4 inset-x-0 z-50 px-4 flex justify-center pointer-events-none">
      <div className="w-full max-w-[820px] bg-white/95 backdrop-blur-md rounded-2xl border-2 border-slate-200 shadow-[0_10px_30px_rgba(112,66,193,0.08),0_2px_8px_rgba(0,0,0,0.04)] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 pointer-events-auto transition-all">
        {/* Left: Brand Identity (Matching the reference layout) */}
        <a
          href="#"
          className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-2 focus-visible:outline-primary rounded-xl shrink-0"
          aria-label="Life RPG Home"
        >
          <div className="w-8 h-8 rounded-xl bg-[#EDE4FC] border border-[#D5C2F6] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <LumiMascot mood="content" size={22} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-black text-[#1F1730] tracking-tight">
              Life RPG
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
        </a>

        {/* Center: Navigation Links (Clean text links like the reference) */}
        <nav
          className="hidden md:flex items-center gap-6 text-[13px] font-bold text-[#655B77]"
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
            className="hover:text-[#7042C1] transition-colors py-1"
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
            className="hover:text-[#7042C1] transition-colors py-1"
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
            className="hover:text-[#7042C1] transition-colors py-1"
          >
            Meet Lumi
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
            className="hover:text-[#7042C1] transition-colors py-1"
          >
            FAQ
          </a>
        </nav>

        {/* Right: Actions (Tactile Try for free button with dashboard colors) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Audio Chime Mute Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors text-xs font-bold cursor-pointer"
            title={isMuted ? 'Unmute game audio' : 'Mute game audio'}
            aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-[#7042C1] hover:bg-[#5F37A6] active:bg-[#4E2B8D] border-b-[2.5px] border-[#542E96] active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                <IconSparkles size={12} className="text-white" />
              </div>
              <span>Open Dashboard →</span>
            </a>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="text-xs font-bold text-[#655B77] hover:text-[#1F1730] transition-colors cursor-pointer hidden sm:block px-1"
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-[#7042C1] hover:bg-[#5F37A6] active:bg-[#4E2B8D] border-b-[2.5px] border-[#542E96] active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer shadow-xs whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                  <IconSparkles size={12} className="text-white" />
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
