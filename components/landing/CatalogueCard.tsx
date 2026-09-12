'use client';

import React, { useRef, useEffect, useState } from 'react';

interface CatalogueCardProps {
  id?: string;
  direction: 'left' | 'right';
  cardIndex: string;
  category: string;
  children: React.ReactNode;
  className?: string;
  bgClassName?: string;
}

export const CatalogueCard: React.FC<CatalogueCardProps> = ({
  id,
  direction,
  cardIndex,
  category,
  children,
  className = '',
  bgClassName = 'bg-[#FAF8F5]',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (entry.boundingClientRect.top > (window.innerHeight || 800)) {
          // Reset when scrolled back above viewport so it animates smoothly when scrolling down
          setIsVisible(false);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Directional offsets: Left cards glide from left + bottom; Right cards glide from right + bottom
  const offsetClass =
    direction === 'left'
      ? '-translate-x-16 sm:-translate-x-28 translate-y-16 sm:translate-y-24 rotate-[-1.5deg]'
      : 'translate-x-16 sm:translate-x-28 translate-y-16 sm:translate-y-24 rotate-[1.5deg]';

  return (
    <div
      id={id}
      ref={cardRef}
      className={`relative w-full max-w-[1360px] mx-auto my-12 sm:my-20 px-3 sm:px-6 md:px-8 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isVisible
          ? 'opacity-100 translate-x-0 translate-y-0 rotate-0'
          : `opacity-0 ${offsetClass}`
      } ${className}`}
    >
      {/* Top Architectural Catalogue Card Tab */}
      <div className="flex items-center justify-between mb-0 select-none">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#262524] text-white border border-[#262524] border-b-0 rounded-none font-draft-mono text-[11px] sm:text-xs font-bold tracking-wider">
          <span className="w-2 h-2 bg-[#4FCE6B] inline-block" />
          <span>{cardIndex}</span>
          <span className="opacity-40">|</span>
          <span className="text-white/80">{category}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-draft-mono text-[11px] text-[#6E6454] pr-1">
          <span>CATALOGUE DECK</span>
          <span className="opacity-40">/</span>
          <span>INDEX 04</span>
        </div>
      </div>

      {/* Main Physical Catalogue Card Body */}
      <div
        className={`w-full border border-[#262524] rounded-none shadow-[0_16px_45px_rgba(0,0,0,0.07)] overflow-hidden ${bgClassName}`}
      >
        {children}
      </div>
    </div>
  );
};
