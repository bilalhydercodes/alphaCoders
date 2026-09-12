'use client';

import React, { forwardRef } from 'react';

interface PaperHeroProps {
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  textRef?: React.RefObject<HTMLDivElement | null>;
}

export const PaperHero = forwardRef<HTMLDivElement, PaperHeroProps>(
  ({ onOpenAuth, textRef }, ref) => {
    return (
      <div
        ref={ref}
        aria-label="Draft Paper Hero"
        className="absolute top-0 inset-x-0 z-30 h-[50vh] bg-draft-paper border-b border-[#2A2825] shadow-[0_12px_36px_rgba(0,0,0,0.3)] select-none overflow-hidden will-change-transform"
      >
        {/* Constrained Framed Container matching video margins */}
        <div className="w-full max-w-[1200px] mx-auto h-full flex flex-col justify-between pt-16 sm:pt-20 pb-3 px-4 sm:px-8 md:px-12 lg:px-16">
          {/* Top Drafting Markup (Architectural Pencil Coordinates & Contact Note) */}
          <div className="w-full flex items-start justify-between text-xs font-draft-mono text-[#6E6454] tracking-wider pointer-events-none">
            {/* Left: Draft Coordinates */}
            <div className="flex flex-col leading-tight font-medium text-[10px] sm:text-[11px]">
              <span className="flex items-center gap-1">
                <span className="opacity-60">X</span> 334.40
              </span>
              <span className="flex items-center gap-1">
                <span className="opacity-60">Y</span> 214.40
              </span>
            </div>

            {/* Right: Architectural Contact Note */}
            <div className="font-draft-mono text-[10px] sm:text-[11px] text-[#6E6454] tracking-widest">
              HELLO@LIFERPG.COM
            </div>
          </div>

          {/* Center Headline: Exactly 3 words with animated textRef */}
          <div
            ref={textRef}
            className="w-full flex items-center justify-center my-auto will-change-transform"
          >
            <div className="relative inline-block text-left">
              {/* Top-Left Sketched Box Note */}
              <div className="absolute -top-5 sm:-top-7 left-0 sm:-left-32 px-2 py-0.5 border border-dashed border-[#7E7464] text-[#554C3E] font-pencil text-sm sm:text-base tracking-wider -rotate-2 bg-[#E0D8C7]/70 select-none">
                AGENTIC PRODUCTIVITY
              </div>

              {/* Exactly 3 Words matching reference image font */}
              <h1 className="text-[44px] sm:text-[68px] md:text-[84px] lg:text-[100px] font-semibold text-[#222120] tracking-[-0.035em] leading-[0.94] font-headline select-none">
                Productivity, <br />
                made playable
              </h1>

              {/* Right Sketched Annotation pointing with pencil arrow */}
              <div className="absolute -bottom-1 sm:bottom-2 -right-20 sm:-right-28 flex items-center gap-1.5 text-[#554C3E] font-pencil text-xl sm:text-2xl rotate-[-2deg] select-none">
                <span className="font-bold">~&gt;</span>
                <span className="border-b border-dashed border-[#7E7464] pb-0.5 uppercase tracking-wider font-bold text-xs sm:text-sm">
                  WITH LUMI
                </span>
              </div>
            </div>
          </div>

          {/* Subtle bottom edge spacing */}
          <div className="w-full h-1" />
        </div>
      </div>
    );
  }
);

PaperHero.displayName = 'PaperHero';
