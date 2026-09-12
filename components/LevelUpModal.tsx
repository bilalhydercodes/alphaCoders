'use client';

import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '@/lib/sound';
import { LumiMascot } from './LumiMascot';
import { Button } from './ui/Button';
import {
  IconLeague,
  IconSparkles,
  IconGoldCoin,
  IconShield,
  IconArrowRight,
} from './icons/LumiIcons';

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
        className="relative w-full max-w-md bg-surface rounded-2xl border-2 border-primary/40 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden outline-none animate-in zoom-in-95 duration-300"
      >
        {/* Decorative rays */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Level badge header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent text-accent-dark font-extrabold text-sm mb-3">
          <IconLeague size={18} className="text-accent fill-accent" />
          <span>LEVEL UP RECOGNITION</span>
        </div>

        {/* Big celebrating Lumi vector mascot */}
        <div className="relative my-3 flex items-center justify-center">
          <LumiMascot mood="celebrating" size={170} />
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
          <div className="p-3.5 rounded-2xl bg-background border border-primary/15 flex flex-col items-center">
            <span className="text-xs text-copy-muted font-bold">Attribute Boost</span>
            <div className="flex items-center gap-1.5 mt-1 text-sm font-extrabold text-copy">
              <IconSparkles size={16} className="text-primary" />
              <span className="capitalize">+{statGained.points} {statGained.attribute}</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-background border border-primary/15 flex flex-col items-center">
            <span className="text-xs text-copy-muted font-bold">Bounty Gold</span>
            <div className="flex items-center gap-1.5 mt-1 text-sm font-extrabold text-copy">
              <IconGoldCoin size={16} className="text-accent" />
              <span>+{goldEarned} GP</span>
            </div>
          </div>
        </div>

        {/* HP Restored indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-success bg-success-soft px-3.5 py-2 rounded-full mb-6">
          <IconShield size={16} className="text-success" />
          <span>Health (HP) fully restored to maximum!</span>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onClose}
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<IconArrowRight size={18} />}
        >
          Continue Journey
        </Button>
      </div>
    </div>
  );
};
