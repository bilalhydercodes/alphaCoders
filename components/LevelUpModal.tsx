'use client';

import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '@/lib/sound';
import { Sparkles, Trophy, Award, ArrowRight, Shield } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  xpEarned: number;
  goldEarned: number;
  statGained: {
    attribute: string;
    points: number;
  };
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  xpEarned,
  goldEarned,
  statGained,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      sound.playLevelUp();

      // Confetti burst
      const count = 200;
      const defaults = {
        origin: { y: 0.6 },
        colors: ['#9966CC', '#F5B700', '#4FCE6B', '#EADFFF', '#F3C6E6'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });

      // Focus modal for keyboard accessibility
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-copy/60 backdrop-blur-md animate-in fade-in duration-300"
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter') {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-md bg-white rounded-lumi-lg border-2 border-primary/40 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden outline-none animate-in zoom-in-95 duration-300"
      >
        {/* Decorative rays */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Level badge header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent text-accent-dark font-extrabold text-sm mb-3">
          <Trophy className="w-4 h-4 text-accent fill-accent" />
          <span>LEVEL UP RECOGNITION</span>
        </div>

        {/* Big celebrating Lumi */}
        <div className="relative w-48 h-48 my-2 flex items-center justify-center">
          <img
            src="/lumi/extracted/reaction-levelup.png"
            alt="Lumi Celebrating Level Up"
            className="w-full h-full object-contain animate-bounce-subtle drop-shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/lumi/extracted/lumi-hero.png';
            }}
          />
        </div>

        {/* Congratulatory Text */}
        <h2
          id="levelup-title"
          className="text-2xl sm:text-3xl font-extrabold text-copy tracking-tight"
        >
          You Reached Level <span className="text-primary underline decoration-accent">{newLevel}</span>!
        </h2>
        <p className="text-sm text-copy-muted mt-1 max-w-xs">
          "You did it! A new level, a brighter you!" — Lumi is cheering for your real-world progress!
        </p>

        {/* Milestone Rewards Grid */}
        <div className="grid grid-cols-2 gap-3 w-full my-5">
          <div className="p-3 rounded-xl bg-background border border-primary/15 flex flex-col items-center">
            <span className="text-xs text-copy-muted font-medium">Attribute Boost</span>
            <div className="flex items-center gap-1 mt-1 text-sm font-bold text-copy">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="capitalize">+{statGained.points} {statGained.attribute}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-background border border-primary/15 flex flex-col items-center">
            <span className="text-xs text-copy-muted font-medium">Bounty Gold</span>
            <div className="flex items-center gap-1 mt-1 text-sm font-bold text-copy">
              <Award className="w-3.5 h-3.5 text-accent" />
              <span>+{goldEarned} GP</span>
            </div>
          </div>
        </div>

        {/* HP Restored indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-success bg-success-soft px-3 py-1.5 rounded-full mb-6">
          <Shield className="w-3.5 h-3.5" />
          <span>Health (HP) fully restored to maximum!</span>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-xl bg-primary text-primary-on font-bold text-sm flex items-center justify-center gap-2 shadow-amethyst-glow hover:bg-primary-hover active:scale-97 transition-all cursor-pointer"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
