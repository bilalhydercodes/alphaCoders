'use client';

import React from 'react';

interface LandingFooterProps {
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onOpenAuth }) => {
  return (
    <footer className="relative w-full overflow-hidden select-none" aria-label="Life RPG Footer">
      {/* 1. Organic Cloudy SVG Horizon Transition from Ghost White (#F8F8FF) into Amethyst (#9966CC) */}
      <div className="w-full bg-[#F8F8FF] leading-none">
        <svg
          viewBox="0 0 1440 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block pointer-events-none -mb-1"
          preserveAspectRatio="none"
        >
          {/* Layer 1: Soft translucent back cloud puffs */}
          <path
            d="M0,105 C120,60 220,95 340,70 C460,45 560,85 680,60 C800,35 900,80 1020,55 C1140,30 1240,75 1440,65 L1440,140 L0,140 Z"
            fill="rgba(153, 102, 204, 0.28)"
          />
          {/* Layer 2: Midground cloud puffs */}
          <path
            d="M0,115 C150,75 270,105 420,80 C570,55 690,95 840,70 C990,45 1110,85 1260,65 C1350,55 1410,75 1440,80 L1440,140 L0,140 Z"
            fill="rgba(153, 102, 204, 0.62)"
          />
          {/* Layer 3: Solid Amethyst foreground cumulus clouds */}
          <path
            d="M0,140 L0,110 C50,90 100,92 140,95 C190,65 260,70 310,88 C370,50 450,55 510,75 C560,95 620,90 660,80 C730,45 830,50 890,75 C950,55 1030,60 1080,82 C1140,55 1230,60 1290,80 C1360,68 1410,85 1440,92 L1440,140 Z"
            fill="#9966CC"
          />
        </svg>
      </div>

      {/* 2. Main Cloudy Footer Body (#9966CC) */}
      <div className="relative bg-[#9966CC] pt-10 sm:pt-14 pb-12 px-4 sm:px-8 md:px-12 lg:px-16 text-white">
        {/* Decorative Floating Clouds in Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Cloud 1 (Top-Left) */}
          <div className="absolute -top-6 left-10 w-64 h-24 bg-white/10 rounded-full blur-md" />
          {/* Cloud 2 (Mid-Right) */}
          <div className="absolute top-20 right-12 w-80 h-28 bg-white/12 rounded-full blur-lg" />
          {/* Cloud 3 (Bottom-Center) */}
          <div className="absolute bottom-8 left-1/3 w-96 h-32 bg-white/8 rounded-full blur-xl" />
        </div>

        {/* Hero Character & Call-To-Action Container */}
        <div className="max-w-[1160px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-14 border-b border-white/20">
            {/* Left Column: Inspiring Call-To-Action (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs border border-white/30 text-white font-draft-mono text-xs tracking-wider uppercase mb-5">
                <span className="w-2 h-2 bg-white" />
                <span>Begin Your Journey</span>
              </div>

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white tracking-[-0.035em] leading-[1.04] font-headline">
                Ready for your next real-life adventure?
              </h2>

              <p className="mt-4 text-base sm:text-lg text-white/90 font-medium leading-relaxed max-w-xl">
                Lumi is waiting to level up your habits, protect your streaks, and celebrate every milestone with you. Join the guild today.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('register')}
                  className="inline-flex items-center justify-center px-8 h-[48px] text-xs sm:text-sm font-bold text-[#1F1730] bg-white hover:bg-[#F8F8FF] active:scale-95 border border-[#2E2438] rounded-none shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  Start your campaign
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('login')}
                  className="inline-flex items-center justify-center px-6 h-[48px] text-xs sm:text-sm font-bold text-white hover:text-[#1F1730] hover:bg-white/90 border border-white/40 rounded-none transition-all cursor-pointer whitespace-nowrap"
                >
                  Sign in
                </button>
              </div>
            </div>

            {/* Right Column: Adorable Lumi Adventurer Mascot with Cloud Pedestal (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              {/* Soft dreamy cloud pedestal behind & under Lumi */}
              <div className="relative flex flex-col items-center group">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl transform scale-90 pointer-events-none" />
                <img
                  src="/images/lumi-footer.png"
                  alt="Lumi Adventurer Mascot with backpack and purple scarf"
                  className="relative z-10 w-56 sm:w-64 md:w-72 h-auto object-contain drop-shadow-[0_16px_28px_rgba(31,23,48,0.25)] hover:scale-105 transition-transform duration-300 pointer-events-auto select-none"
                />
                {/* Cloud puff shadow under Lumi's feet */}
                <div className="w-48 sm:w-56 h-6 bg-white/25 rounded-full blur-xs -mt-3 relative z-0" />
              </div>
            </div>
          </div>

          {/* Clean Bottom Navigation & Brand Credit */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-white/80">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm font-sans tracking-tight">Life RPG</span>
              <span>·</span>
              <span>with Lumi</span>
              <span>·</span>
              <span className="text-white/70">Turn daily routines into playable quests</span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#features"
                className="hover:text-white transition-colors cursor-pointer"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-white transition-colors cursor-pointer"
              >
                Experience
              </a>
              <a
                href="#faq"
                className="hover:text-white transition-colors cursor-pointer"
              >
                FAQ
              </a>
              <a
                href="https://github.com/bilalhydercodes/alphaCoders.git"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
