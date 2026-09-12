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
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 py-3.5 transition-all">
      <div className="max-w-[1400px] mx-auto bg-slate-950/65 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-2xl px-3 sm:px-5 py-2 flex items-center justify-between gap-3 text-white relative">
        {/* Left: Brand Identity */}
        <a
          href="#"
          className="flex items-center gap-2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-primary rounded-xl shrink-0 z-10"
          aria-label="Life RPG Home"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
            <LumiMascot mood="content" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-tight leading-none flex items-center gap-1.5">
              Life RPG
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <span className="text-[10px] font-bold text-slate-400 leading-tight">
              with Lumi
            </span>
          </div>
        </a>

        {/* Center: Curated High-Converting Navigation (Exact Middle) */}
        <nav
          className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-bold text-slate-300 absolute left-1/2 -translate-x-1/2 z-20"
          aria-label="Realm Navigation"
        >
          {/* Features */}
          <a
            href="#features"
            onClick={(e) => {
              const el = document.getElementById('features');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-3 py-1.5 rounded-xl hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            Features
          </a>

          {/* How It Works */}
          <a
            href="#how-it-works"
            onClick={(e) => {
              const el = document.getElementById('how-it-works');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-3 py-1.5 rounded-xl hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            How It Works
          </a>

          {/* Meet Lumi */}
          <a
            href="#meet-lumi"
            onClick={(e) => {
              const el = document.getElementById('meet-lumi');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-3 py-1.5 rounded-xl hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            Meet Lumi
          </a>

          {/* Community */}
          <a
            href="#league"
            onClick={(e) => {
              const el = document.getElementById('league');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-3 py-1.5 rounded-xl hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            Community
          </a>

          {/* FAQ */}
          <a
            href="#faq"
            onClick={(e) => {
              const el = document.getElementById('faq');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-3 py-1.5 rounded-xl hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            FAQ
          </a>
        </nav>

        {/* Right: Actions & Live Indicator */}
        <div className="flex items-center gap-2 shrink-0 z-10 ml-auto">

          {/* Audio Chime Mute Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 border border-white/15 text-slate-200 hover:text-white hover:bg-white/20 transition-colors text-xs font-bold cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#7042C1] hover:bg-[#6236AB] active:bg-[#542B95] shadow-lg shadow-purple-900/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <IconSparkles size={13} />
              <span>Dashboard →</span>
            </a>
          ) : (
            <>
              {/* Sign In CTA */}
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>

              {/* Primary Action */}
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#7042C1] hover:bg-[#6236AB] active:bg-[#542B95] shadow-lg shadow-purple-950/40 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <IconSparkles size={13} />
                <span>Begin Quest</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
