'use client';

import React from 'react';

interface PaperHeroProps {
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const PaperHero: React.FC<PaperHeroProps> = ({ onOpenAuth }) => {
  return (
    <section
      aria-label="Architectural Paper Hero"
      className="relative z-20 w-full min-h-[95vh] sm:min-h-screen bg-draft-paper flex flex-col justify-between pt-28 sm:pt-32 pb-8 px-6 sm:px-12 select-none shadow-[0_30px_90px_rgba(0,0,0,0.65)] border-b-2 border-[#C9BEAA] overflow-hidden"
    >
      {/* Top Drafting Markup (Architectural Pencil Coordinates & Branding) */}
      <div className="w-full flex items-start justify-between text-xs font-draft-mono text-[#736856] tracking-wider">
        {/* Left: Draft Coordinates & Registration Crosshair */}
        <div className="flex items-start gap-2">
          <div className="flex flex-col leading-tight font-medium text-[11px]">
            <span className="flex items-center gap-1">
              <span className="opacity-60">X</span> 1160.00
            </span>
            <span className="flex items-center gap-1">
              <span className="opacity-60">Y</span> 247.20
            </span>
          </div>
          <span className="opacity-40 text-sm font-light">⊕</span>
        </div>

        {/* Right: Architectural Note */}
        <div className="text-right font-draft-mono text-[11px] text-[#736856] tracking-widest hidden sm:block">
          HELLO@LIFERPG.APP
        </div>
      </div>

      {/* Center Main Stage: Editorial Headline & Hand-sketched Annotations */}
      <div className="max-w-[1240px] w-full mx-auto my-auto py-10 flex flex-col items-start text-left">
        {/* Sketched Tag: "AGENTIC PRODUCTIVITY" in Hand-Drawn Pencil Box */}
        <div className="inline-block px-3 py-1 border-2 border-dashed border-[#7E7464] text-[#5C5345] font-pencil text-xl sm:text-2xl tracking-wide -rotate-2 mb-4 bg-[#DFD6C5]/50 shadow-xs">
          AGENTIC PRODUCTIVITY
        </div>

        {/* Massive Headline matching the reference image layout */}
        <div className="relative">
          <h1 className="text-[52px] sm:text-[76px] md:text-[92px] lg:text-[112px] font-black text-[#222120] tracking-tight leading-[0.94] font-sans">
            Turn your life, <br />
            made playable
          </h1>

          {/* Sketched Hand-Drawn Annotation pointing to "WITH LUMI" */}
          <div className="mt-4 sm:mt-2 sm:absolute sm:bottom-4 sm:right-[-160px] md:right-[-200px] flex items-center gap-2 text-[#5C5345] font-pencil text-2xl sm:text-3xl rotate-[-3deg]">
            <span className="tracking-tighter font-bold">~&gt;</span>
            <span className="border-b-2 border-dashed border-[#7E7464] pb-0.5 uppercase tracking-wider font-bold">
              WITH LUMI
            </span>
          </div>
        </div>

        {/* Clean Architectural Subtitle */}
        <p className="mt-8 text-base sm:text-xl text-[#534A3E] font-medium max-w-[620px] leading-relaxed">
          The autonomous 3D companion system that turns daily habits, study sprints, and self-care into an epic progression.
        </p>

        {/* Action Button Row */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onOpenAuth?.('register')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white bg-[#7042C1] hover:bg-[#5F37A6] active:bg-[#4E2B8D] border-b-4 border-[#542E96] active:border-b-0 active:translate-y-[2px] transition-all cursor-pointer shadow-md"
          >
            <span>Begin Your Quest →</span>
          </button>

          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-[#453D32] bg-white/70 hover:bg-white border-2 border-[#C2B7A2] transition-all cursor-pointer"
          >
            <span>Explore 3D World ↓</span>
          </a>
        </div>
      </div>

      {/* Bottom Technical Footer / Curtain Hint */}
      <div className="w-full pt-6 border-t border-[#D0C5B0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-draft-mono text-[#736856]">
        <span className="hidden sm:inline">SYSTEM // LUMI 3D AUTONOMOUS AGENT</span>
        
        {/* Animated Curtain Hint */}
        <div className="flex items-center gap-2 font-bold text-[#40382E] animate-bounce cursor-pointer">
          <span>Scroll down to unveil the 3D video experience</span>
          <span>↓</span>
        </div>

        <span className="hidden sm:inline">SCALE: 1:1 REAL-WORLD RPG</span>
      </div>
    </section>
  );
};
