'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useLumi } from './LumiContext';
import { LumiSpeechBubble } from './LumiSpeechBubble';
import { IconSparkles } from '../icons/LumiIcons';
import { LumiPresenterProps } from './LumiTypes';

// Dynamically import LumiCanvas with SSR disabled to ensure safe WebGL mounting
const LumiCanvas = dynamic(
  () => import('./LumiCanvas').then((mod) => mod.LumiCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center animate-pulse text-xs text-copy-muted font-bold">
        Summoning Lumi...
      </div>
    ),
  }
);

export const LumiPresenter: React.FC<LumiPresenterProps> = ({
  variant = 'dashboard',
  className = '',
  height = 200,
  showSpeech = true,
  interactive = true,
}) => {
  const { pet, isPetted, mood } = useLumi();

  return (
    <div className={`relative flex flex-col items-center justify-center w-full select-none ${className}`}>
      {/* Dynamic Speech Bubble if enabled */}
      {showSpeech && variant === 'dashboard' && (
        <div className="mb-2 w-full flex justify-center">
          <LumiSpeechBubble />
        </div>
      )}

      {/* 3D Canvas Stage */}
      <div
        onClick={interactive ? pet : undefined}
        style={{ height }}
        className={`relative w-full rounded-2xl flex items-center justify-center transition-transform duration-200 ${
          isPetted ? 'scale-105' : ''
        } ${interactive ? 'cursor-pointer group' : ''}`}
        title="Interact with Lumi"
        aria-label={`3D Lumi companion, current mood: ${mood}`}
      >
        <LumiCanvas variant={variant} interactive={interactive} />

        {/* Ambient hover sparkles */}
        {interactive && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <IconSparkles size={18} className="text-accent" />
          </div>
        )}
      </div>

      {variant === 'dashboard' && (
        <p className="text-[11px] font-medium text-copy-muted mt-2 text-center">
          Tap Lumi to share a moment!
        </p>
      )}
    </div>
  );
};
