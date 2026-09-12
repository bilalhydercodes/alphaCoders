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
  LumiAttentionTarget,
  LumiZone,
} from './LumiTypes';
import { resolveLumiMood } from './LumiMoodResolver';
import { LumiEventQueue } from './LumiEventQueue';
import { CONTEXTUAL_SPEECH_POOLS, MOMENT_CONFIGS, LUMI_ZONES } from './LumiConfig';
import { LumiMovementController } from './LumiMovement';
import { LumiAnimator } from './LumiAnimator';
import { LumiBehaviorBrain } from './LumiBehaviorBrain';

interface RegisteredAnchor {
  id: string;
  element: HTMLElement;
  category?: string;
}

export interface LumiContextType {
  mood: LumiMood;
  setMood: (mood: LumiMood) => void;
  activeMoment: LumiMoment | null;
  currentEvent: LumiEventItem | null;
  animation: LumiAnimation;
  speech: string;
  isSpeechVisible: boolean;
  spatialAnchor: LumiSpatialAnchor;
  currentZone: LumiZone;
  attentionTarget: LumiAttentionTarget | null;
  cursorTarget: { x: number; y: number };
  particleType: LumiParticleType;
  isPetted: boolean;
  reducedMotion: boolean;
  movementController: LumiMovementController;
  animator: LumiAnimator;
  react: (moment: LumiMoment, quote?: string, payload?: any) => void;
  moveTo: (anchor: LumiSpatialAnchor) => void;
  moveToAnchor: (anchorId: string, run?: boolean, onArrival?: () => void) => void;
  returnHome: (onArrival?: () => void) => void;
  setZone: (zone: LumiZone) => void;
  lookAt: (target: LumiAttentionTarget | null) => void;
  registerAnchor: (id: string, element: HTMLElement, category?: string) => void;
  unregisterAnchor: (id: string) => void;
  pet: () => void;
  hideSpeech: () => void;
  recordUserActivity: () => void;
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
  const [currentZone, setCurrentZone] = useState<LumiZone>('HOME_ZONE');
  const [attentionTarget, setAttentionTarget] = useState<LumiAttentionTarget | null>(null);
  const [cursorTarget, setCursorTarget] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPetted, setIsPetted] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Controller Singletons
  const movementControllerRef = useRef<LumiMovementController>(new LumiMovementController('HOME_ZONE'));
  const animatorRef = useRef<LumiAnimator>(new LumiAnimator());
  const brainRef = useRef<LumiBehaviorBrain>(new LumiBehaviorBrain('HOME_ZONE'));

  // Memory & Anchors
  const anchorsRef = useRef<Map<string, RegisteredAnchor>>(new Map());
  const recentQuotesRef = useRef<string[]>([]);
  const queueRef = useRef<LumiEventQueue | null>(null);
  const speechCooldownRef = useRef<number>(Date.now());

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

  // Pick contextual quote with memory history (avoids back-to-back repeats)
  const pickQuote = useCallback((moment: LumiMoment, customQuote?: string): string => {
    if (customQuote) return customQuote;

    const pool = CONTEXTUAL_SPEECH_POOLS[moment] || [
      MOMENT_CONFIGS[moment]?.defaultQuote || 'Onward, adventurer!',
    ];

    // Filter out quotes spoken in last 5 messages
    const freshQuotes = pool.filter((q) => !recentQuotesRef.current.includes(q));
    const candidateList = freshQuotes.length > 0 ? freshQuotes : pool;
    const chosen = candidateList[Math.floor(Math.random() * candidateList.length)];

    // Update memory FIFO (max 5)
    recentQuotesRef.current.push(chosen);
    if (recentQuotesRef.current.length > 5) {
      recentQuotesRef.current.shift();
    }

    return chosen;
  }, []);

  // User activity tracker
  const recordUserActivity = useCallback(() => {
    brainRef.current.recordUserActivity();
  }, []);

  // Initialize event queue
  useEffect(() => {
    const queue = new LumiEventQueue((event) => {
      setCurrentEvent(event);
      if (event) {
        setAnimation(event.animationOverride || 'cheer');
        animatorRef.current.play(event.animationOverride || 'cheer');
        if (event.quote) {
          setSpeech(event.quote);
          setIsSpeechVisible(true);
        }
      } else {
        setAnimation('idle');
        animatorRef.current.play('idle');
      }
    });

    queueRef.current = queue;
    return () => {
      queue.destroy();
    };
  }, []);

  // Update ambient mood when user stats change
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

  // Pointer move activity and cursor tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePointerMove = (e: PointerEvent) => {
      recordUserActivity();
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setCursorTarget({ x, y });
    };

    const handleKeyDown = () => recordUserActivity();
    const handleClick = () => recordUserActivity();

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [recordUserActivity]);

  // Autonomous behavior ticker (8-14s)
  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      if (currentEvent) return; // Don't interrupt moments

      const decision = brainRef.current.tick(
        10,
        isPetted,
        mood === 'FOCUSED',
        mood,
        reducedMotion
      );

      if (decision) {
        setAnimation(decision.animation);
        animatorRef.current.play(decision.animation);

        if (decision.targetOffset) {
          // Subtle movement within zone
          movementControllerRef.current.moveTo(
            decision.targetOffset,
            currentZone,
            false
          );
        }

        const timer = setTimeout(() => {
          setAnimation('idle');
          animatorRef.current.play('idle');
        }, decision.duration || 2000);

        return () => clearTimeout(timer);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentEvent, isPetted, mood, reducedMotion, currentZone]);

  // Zone management
  const setZone = useCallback((zone: LumiZone) => {
    setCurrentZone(zone);
    brainRef.current.setZone(zone);
    movementControllerRef.current.moveTo(
      LUMI_ZONES[zone].preferredSpot,
      zone,
      false
    );
  }, []);

  // Attention tracking
  const lookAt = useCallback((target: LumiAttentionTarget | null) => {
    setAttentionTarget(target);
  }, []);

  // Anchor registration
  const registerAnchor = useCallback((id: string, element: HTMLElement, category?: string) => {
    anchorsRef.current.set(id, { id, element, category });
  }, []);

  const unregisterAnchor = useCallback((id: string) => {
    anchorsRef.current.delete(id);
  }, []);

  // Navigate to an anchor
  const moveToAnchor = useCallback(
    (anchorId: string, run: boolean = false, onArrival?: () => void) => {
      if (reducedMotion) {
        if (onArrival) onArrival();
        return;
      }

      const anchor = anchorsRef.current.get(anchorId);
      if (!anchor) {
        movementControllerRef.current.returnHome(onArrival);
        return;
      }

      // Project DOM element coordinates to 3D zone coordinates
      const rect = anchor.element.getBoundingClientRect();
      const containerRect =
        anchor.element.closest('[data-lumi-container]')?.getBoundingClientRect() ||
        document.body.getBoundingClientRect();

      const projected = LumiMovementController.projectDomToWorld(rect, containerRect);

      setAnimation(run ? 'run' : 'walk');
      animatorRef.current.play(run ? 'run' : 'walk');

      movementControllerRef.current.moveTo(projected, currentZone, run, () => {
        setAnimation('idle');
        animatorRef.current.play('idle');
        if (onArrival) onArrival();
      });
    },
    [currentZone, reducedMotion]
  );

  const returnHome = useCallback((onArrival?: () => void) => {
    if (reducedMotion) {
      if (onArrival) onArrival();
      return;
    }

    setAnimation('walk');
    animatorRef.current.play('walk');

    movementControllerRef.current.returnHome(() => {
      setAnimation('idle');
      animatorRef.current.play('idle');
      if (onArrival) onArrival();
    });
  }, [reducedMotion]);

  // Reactive moment dispatch
  const react = useCallback(
    (moment: LumiMoment, customQuote?: string, _payload?: any) => {
      if (!queueRef.current) return;

      // Audio cues
      if (moment === 'QUEST_COMPLETE') sound.playQuestComplete();
      else if (moment === 'COIN_CATCH') sound.playCoin();
      else if (moment === 'LEVEL_UP') sound.playLevelUp();
      else if (moment === 'ACHIEVEMENT') sound.playQuestComplete();
      else sound.playClick();

      const chosenQuote = pickQuote(moment, customQuote);
      queueRef.current.enqueue(moment, chosenQuote);
    },
    [pickQuote]
  );

  const moveTo = useCallback(
    (anchor: LumiSpatialAnchor) => {
      setSpatialAnchor(anchor);
      moveToAnchor(anchor);
    },
    [moveToAnchor]
  );

  const pet = useCallback(() => {
    recordUserActivity();
    setIsPetted(true);
    sound.playQuestComplete();

    // Trigger hop squash/stretch in animator
    animatorRef.current.triggerHop(0.26, 0.6);

    const cheerfulQuote = pickQuote('YOU_GOT_THIS');
    react('YOU_GOT_THIS', cheerfulQuote);

    setTimeout(() => setIsPetted(false), 700);
  }, [pickQuote, react, recordUserActivity]);

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
        currentZone,
        attentionTarget,
        cursorTarget,
        particleType,
        isPetted,
        reducedMotion,
        movementController: movementControllerRef.current,
        animator: animatorRef.current,
        react,
        moveTo,
        moveToAnchor,
        returnHome,
        setZone,
        lookAt,
        registerAnchor,
        unregisterAnchor,
        pet,
        hideSpeech,
        recordUserActivity,
      }}
    >
      {children}
    </LumiContext.Provider>
  );
};
