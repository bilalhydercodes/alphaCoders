'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IconXpGem } from './icons/LumiIcons';

interface XpArcParticle {
  id: string;
  amount: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

interface XpArcContextType {
  triggerXpArc: (amount: number, originElement?: HTMLElement | null) => void;
}

const XpArcContext = createContext<XpArcContextType>({
  triggerXpArc: () => {},
});

export const useXpArc = () => useContext(XpArcContext);

export const XpArcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [particles, setParticles] = useState<XpArcParticle[]>([]);

  const triggerXpArc = useCallback((amount: number, originElement?: HTMLElement | null) => {
    // If reduced motion is active, skip ballistic arc
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (originElement) {
      const rect = originElement.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    // Locate header XP pill
    const targetElement = document.getElementById('header-xp-pill');
    let targetX = window.innerWidth - 80;
    let targetY = 32;

    if (targetElement) {
      const targetRect = targetElement.getBoundingClientRect();
      targetX = targetRect.left + targetRect.width / 2;
      targetY = targetRect.top + targetRect.height / 2;
    }

    const id = `xp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newParticle: XpArcParticle = {
      id,
      amount,
      startX,
      startY,
      targetX,
      targetY,
    };

    setParticles((prev) => [...prev, newParticle]);

    // Schedule cleanup and pulse effect on destination
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
      if (targetElement) {
        targetElement.classList.add('scale-110');
        setTimeout(() => {
          targetElement.classList.remove('scale-110');
        }, 200);
      }
    }, 750);
  }, []);

  return (
    <XpArcContext.Provider value={{ triggerXpArc }}>
      {children}
      {/* Container for in-flight XP chips */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
        {particles.map((particle) => (
          <XpChip key={particle.id} particle={particle} />
        ))}
      </div>
    </XpArcContext.Provider>
  );
};

const XpChip: React.FC<{ particle: XpArcParticle }> = ({ particle }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 650; // ms

    let animFrame: number;
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Parabolic arc calculation
  // Ease curve for X: cubic ease-in
  const easeProgress = progress * progress;
  const currentX = particle.startX + (particle.targetX - particle.startX) * easeProgress;

  // Arc curve for Y: goes upward then swoops down into target
  const arcHeight = 80;
  const straightY = particle.startY + (particle.targetY - particle.startY) * progress;
  const arcOffset = -Math.sin(progress * Math.PI) * arcHeight;
  const currentY = straightY + arcOffset;

  const scale = 1 + Math.sin(progress * Math.PI) * 0.35 - (progress > 0.8 ? (progress - 0.8) * 4 : 0);
  const opacity = progress > 0.85 ? 1 - (progress - 0.85) / 0.15 : 1;

  return (
    <div
      style={{
        transform: `translate(${currentX}px, ${currentY}px) translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
      className="absolute flex items-center gap-1 px-3 py-1 bg-surface border-2 border-primary rounded-full shadow-lg text-xs font-black text-primary"
    >
      <IconXpGem size={16} filled className="text-primary" />
      <span>+{particle.amount} XP</span>
    </div>
  );
};
