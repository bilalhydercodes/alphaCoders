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
      {/* Compact Sharp Rectangular Nav Island - Compact width & increased height matching reference */}
      <div className="w-full max-w-[540px] h-[58px] sm:h-[62px] bg-white border border-[#2E2438] shadow-[0_4px_18px_rgba(153,102,204,0.08)] px-3.5 sm:px-4 flex items-center justify-between gap-3 pointer-events-auto rounded-none transition-all">
        {/* Left: Brand Identity (Sharp rectangular icon box + typography) */}
        <div className="flex items-center">
          <a
            href="#"
            className="flex items-center gap-2 group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#9966CC] rounded-none"
            aria-label="Lumi Home"
          >
            {/* Square sharp icon container */}
            <div className="w-8 h-8 bg-[#EADFFF] border border-[#2E2438] rounded-none flex items-center justify-center shrink-0">
              <LumiMascot mood="content" size={19} />
            </div>
            <span className="text-[14px] font-black text-[#1F1730] tracking-tight ml-0.5 font-sans">
              Lumi
            </span>
          </a>
        </div>

        {/* Center: Navigation Links (Compact text links matching reference) */}
        <nav
          className="hidden sm:flex items-center gap-3.5 md:gap-4.5 text-[12px] font-semibold text-[#7A6F8C]"
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
            Quests
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
            Lumi
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

        {/* Right: Action Button (Taller sharp rectangular button matching reference) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audio Chime Mute Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="hidden md:inline-flex items-center justify-center w-7 h-7 bg-slate-100 hover:bg-slate-200 border border-[#2B2927] rounded-none text-slate-700 transition-colors text-xs font-bold cursor-pointer"
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? '🔇' : '🔔'}
          </button>

          <button
            type="button"
            onClick={() => onOpenAuth('login')}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 h-[40px] sm:h-[42px] text-xs font-bold text-white bg-[#9966CC] hover:bg-[#8B54C2] active:bg-[#7A4BC2] border border-[#2E2438] rounded-none shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 bg-[#7A4BC2] rounded-none flex items-center justify-center shrink-0">
              <IconSparkles size={11} className="text-white" />
            </div>
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};
