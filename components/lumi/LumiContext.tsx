'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import {
  LumiMood,
  LumiMoment,
  LumiAnimation,
  LumiSpatialAnchor,
  LumiParticleType,
  LumiEventItem,
} from './LumiTypes';
import { resolveLumiMood } from './LumiMoodResolver';
import { LumiEventQueue, MOMENT_CONFIGS } from './LumiEventQueue';

interface LumiContextType {
  mood: LumiMood;
  setMood: (mood: LumiMood) => void;
  activeMoment: LumiMoment | null;
  currentEvent: LumiEventItem | null;
  animation: LumiAnimation;
  speech: string;
  isSpeechVisible: boolean;
  spatialAnchor: LumiSpatialAnchor;
  cursorTarget: { x: number; y: number };
  particleType: LumiParticleType;
  isPetted: boolean;
  reducedMotion: boolean;
  react: (moment: LumiMoment, quote?: string, payload?: any) => void;
  moveTo: (anchor: LumiSpatialAnchor) => void;
  pet: () => void;
  hideSpeech: () => void;
}

const LumiContext = createContext<LumiContextType | undefined>(undefined);

export const useLumi = () => {
  const context = useContext(LumiContext);
  if (!context) {
    throw new Error('useLumi must be used within a LumiProvider');
  }
  return context;
};

export const LumiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [mood, setMood] = useState<LumiMood>('CONTENT');
  const [currentEvent, setCurrentEvent] = useState<LumiEventItem | null>(null);
  const [animation, setAnimation] = useState<LumiAnimation>('idle');
  const [speech, setSpeech] = useState<string>('Ready for our next quest?');
  const [isSpeechVisible, setIsSpeechVisible] = useState<boolean>(true);
  const [spatialAnchor, setSpatialAnchor] = useState<LumiSpatialAnchor>('home');
  const [cursorTarget, setCursorTarget] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPetted, setIsPetted] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const lastInteractionTime = useRef<number>(Date.now());
  const queueRef = useRef<LumiEventQueue | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  // Initialize event queue
  useEffect(() => {
    const queue = new LumiEventQueue((event) => {
      setCurrentEvent(event);
      if (event) {
        setAnimation(event.animationOverride || 'cheer');
        if (event.quote) {
          setSpeech(event.quote);
          setIsSpeechVisible(true);
        }
      } else {
        // Return to ambient mood animation
        setAnimation('idle');
      }
    });

    queueRef.current = queue;
    return () => {
      queue.destroy();
    };
  }, []);

  // Update ambient mood when user state changes
  useEffect(() => {
    if (!user) return;

    const derivedMood = resolveLumiMood({
      streak: user.streak,
      level: user.level,
      hp: user.hp,
      maxHp: user.maxHp,
    });

    setMood(derivedMood);
  }, [user]);

  // Subtle cursor tracking in normalized -1 to 1 coordinates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePointerMove = (e: PointerEvent) => {
      lastInteractionTime.current = Date.now();
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setCursorTarget({ x, y });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Idle micro-behavior scheduler: triggers subtle actions every 15-20s
  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      // Only trigger idle behavior if no active moment event is playing
      if (currentEvent) return;

      const idleActions: LumiAnimation[] = ['blink', 'lookAround', 'wave', 'thinking', 'idle'];
      const randomAction = idleActions[Math.floor(Math.random() * idleActions.length)];

      if (randomAction !== 'idle') {
        setAnimation(randomAction);
        const resetTimer = setTimeout(() => {
          setAnimation('idle');
        }, 1800);
        return () => clearTimeout(resetTimer);
      }
    }, 16000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [currentEvent, reducedMotion]);

  // API Methods
  const react = useCallback((moment: LumiMoment, customQuote?: string, _payload?: any) => {
    if (!queueRef.current) return;

    // Trigger procedural audio based on moment
    if (moment === 'QUEST_COMPLETE') sound.playQuestComplete();
    else if (moment === 'COIN_EARNED') sound.playCoin();
    else if (moment === 'LEVEL_UP') sound.playLevelUp();
    else if (moment === 'ACHIEVEMENT') sound.playQuestComplete();
    else sound.playClick();

    queueRef.current.enqueue(moment, customQuote);
  }, []);

  const moveTo = useCallback((anchor: LumiSpatialAnchor) => {
    setSpatialAnchor(anchor);
    if (!reducedMotion) {
      setAnimation('walk');
      setTimeout(() => setAnimation('idle'), 1000);
    }
  }, [reducedMotion]);

  const pet = useCallback(() => {
    setIsPetted(true);
    sound.playQuestComplete();

    const cheerfulQuotes = [
      'Ready for the next quest?',
      'Nice work today!',
      'One more step forward!',
      'Lumi is cheering for you!',
      'We made real progress!',
    ];
    const randomQuote = cheerfulQuotes[Math.floor(Math.random() * cheerfulQuotes.length)];
    react('YOU_GOT_THIS', randomQuote);

    setTimeout(() => setIsPetted(false), 800);
  }, [react]);

  const hideSpeech = useCallback(() => {
    setIsSpeechVisible(false);
  }, []);

  const particleType = currentEvent?.particleType || (mood === 'RADIANT' ? 'radiant' : 'none');

  return (
    <LumiContext.Provider
      value={{
        mood,
        setMood,
        activeMoment: currentEvent?.moment || null,
        currentEvent,
        animation,
        speech,
        isSpeechVisible,
        spatialAnchor,
        cursorTarget,
        particleType,
        isPetted,
        reducedMotion,
        react,
        moveTo,
        pet,
        hideSpeech,
      }}
    >
      {children}
    </LumiContext.Provider>
  );
};
