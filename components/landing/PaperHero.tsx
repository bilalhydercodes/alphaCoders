'use client';

import React from 'react';

interface PaperHeroProps {
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const PaperHero: React.FC<PaperHeroProps> = () => {
  return (
    <section
      aria-label="Draft Paper Hero"
      className="relative z-20 w-full h-[48vh] sm:h-[50vh] bg-draft-paper border-b border-[#2A2825] shadow-[0_14px_40px_rgba(0,0,0,0.45)] flex flex-col justify-between pt-16 sm:pt-18 pb-3 px-4 sm:px-10 select-none overflow-hidden"
    >
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

      {/* Center Headline: Exactly 3 words explaining our product, matching reference image */}
      <div className="w-full flex items-center justify-center my-auto">
        <div className="relative inline-block text-left">
          {/* Top-Left Sketched Box Note */}
          <div className="absolute -top-5 sm:-top-7 left-0 sm:-left-36 px-2 py-0.5 border border-dashed border-[#7E7464] text-[#554C3E] font-pencil text-sm sm:text-base tracking-wider -rotate-2 bg-[#E0D8C7]/60">
            AGENTIC PRODUCTIVITY
          </div>

          {/* Exactly 3 Words */}
          <h1 className="text-[46px] sm:text-[72px] md:text-[88px] lg:text-[104px] font-black text-[#262524] tracking-tight leading-[0.92] font-sans">
            Productivity, <br />
            made playable
          </h1>

          {/* Right Sketched Annotation pointing with pencil arrow */}
          <div className="absolute -bottom-1 sm:bottom-3 -right-20 sm:-right-28 flex items-center gap-1.5 text-[#554C3E] font-pencil text-xl sm:text-2xl rotate-[-2deg]">
            <span className="font-bold">~&gt;</span>
            <span className="border-b border-dashed border-[#7E7464] pb-0.5 uppercase tracking-wider font-bold text-xs sm:text-sm">
              WITH LUMI
            </span>
          </div>
        </div>
      </div>

      {/* Subtle bottom edge spacing (strictly no other text) */}
      <div className="w-full h-1" />
    </section>
  );
};
