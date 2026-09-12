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
        className="absolute top-0 inset-x-0 z-30 h-[50vh] bg-draft-paper select-none overflow-hidden will-change-transform"
      >
        {/* Constrained Framed Container matching video margins */}
        <div className="w-full max-w-[1200px] mx-auto h-full flex flex-col justify-between pt-16 sm:pt-20 pb-3 px-4 sm:px-8 md:px-12 lg:px-16">
          {/* Top Drafting Markup (Architectural Pencil Coordinates & Contact Note) */}
          <div className="w-full flex items-start justify-between text-xs font-draft-mono text-[#7A6F8C] tracking-wider pointer-events-none">
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
            <div className="font-draft-mono text-[10px] sm:text-[11px] text-[#7A6F8C] tracking-widest">
              HELLO@LIFERPG.COM
            </div>
          </div>

          {/* Center Headline: Exactly 3 words with animated textRef */}
          <div
            ref={textRef}
            className="w-full flex items-center justify-center my-auto will-change-transform"
          >
            <div className="relative inline-block text-left">
              {/* Top-Left Eyebrow: AGENTIC PRODUCTIVITY (Clean floating italic tracking, matching reference image) */}
              <div className="text-[11px] sm:text-[13px] md:text-[14px] font-draft-mono italic tracking-[0.24em] text-[#8A52C7] uppercase mb-1 sm:mb-2 select-none">
                AGENTIC PRODUCTIVITY
              </div>

              {/* Exactly 3 Words in deep Amethyst ink with cursive italic serif 'made' */}
              <h1 className="text-[46px] sm:text-[72px] md:text-[90px] lg:text-[106px] font-bold text-[#1F1730] tracking-[-0.04em] leading-[0.92] font-headline select-none">
                Productivity, <br />
                <span className="font-serif-italic font-normal text-[#8A52C7] tracking-[-0.02em] mr-2 sm:mr-3.5 inline-block transform -translate-y-0.5">
                  made
                </span>
                <span>playable</span>
              </h1>

              {/* Right Annotation: -> WITH LUMI (Clean arrow & letter-spaced purple text) */}
              <div className="absolute -bottom-1 sm:bottom-3 -right-20 sm:-right-28 flex items-center gap-1.5 text-[#8A52C7] font-draft-mono text-xs sm:text-sm font-semibold tracking-widest select-none">
                <span>-&gt;</span>
                <span className="uppercase">WITH LUMI</span>
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
