import { LumiMoment, LumiEventItem, LumiAnimation, LumiParticleType } from './LumiTypes';

export interface MomentConfig {
  priority: number;
  duration: number;
  animation: LumiAnimation;
  particleType: LumiParticleType;
  defaultQuote: string;
}

export const MOMENT_CONFIGS: Record<LumiMoment, MomentConfig> = {
  LEVEL_UP: {
    priority: 100,
    duration: 3400,
    animation: 'levelUp',
    particleType: 'confetti',
    defaultQuote: 'You did it! A new level, a brighter you!',
  },
  ACHIEVEMENT: {
    priority: 85,
    duration: 2800,
    animation: 'cheer',
    particleType: 'stars',
    defaultQuote: 'Milestones matter. You are making real progress!',
  },
  STREAK_MILESTONE: {
    priority: 75,
    duration: 2600,
    animation: 'cheer',
    particleType: 'radiant',
    defaultQuote: 'Your consistency is legendary! Keep the fire burning!',
  },
  QUEST_COMPLETE: {
    priority: 65,
    duration: 2200,
    animation: 'cheer',
    particleType: 'xp',
    defaultQuote: 'Bounty claimed! Every small quest counts.',
  },
  COIN_EARNED: {
    priority: 50,
    duration: 1600,
    animation: 'jump',
    particleType: 'gold',
    defaultQuote: 'Gold collected! Your treasury grows!',
  },
  SHOP_TRY_ON: {
    priority: 45,
    duration: 2200,
    animation: 'tryOn',
    particleType: 'stars',
    defaultQuote: 'Looking sharp, adventurer! Ready for anything.',
  },
  SELF_CARE: {
    priority: 40,
    duration: 2400,
    animation: 'wave',
    particleType: 'radiant',
    defaultQuote: 'Hydration and rest are vital quests too.',
  },
  YOU_GOT_THIS: {
    priority: 35,
    duration: 2200,
    animation: 'cheer',
    particleType: 'stars',
    defaultQuote: 'A little nudge, a lot of belief. Keep going!',
  },
  EXPLORE: {
    priority: 30,
    duration: 2000,
    animation: 'lookAround',
    particleType: 'stars',
    defaultQuote: 'New places, new bounties, more possibilities!',
  },
  WELCOME: {
    priority: 25,
    duration: 2200,
    animation: 'wave',
    particleType: 'none',
    defaultQuote: 'Welcome back, adventurer! Lumi missed you.',
  },
  FOCUS: {
    priority: 20,
    duration: 2200,
    animation: 'focus',
    particleType: 'none',
    defaultQuote: 'Focus mode ON! One quest at a time.',
  },
  REST_DAY: {
    priority: 15,
    duration: 2600,
    animation: 'sit',
    particleType: 'none',
    defaultQuote: 'Rest is valid, not failure. Breathe easy.',
  },
  ERROR: {
    priority: 10,
    duration: 1800,
    animation: 'thinking',
    particleType: 'none',
    defaultQuote: 'Hmm... something stumbled. Let’s try that again!',
  },
};

export class LumiEventQueue {
  private queue: LumiEventItem[] = [];
  private currentEvent: LumiEventItem | null = null;
  private timer: NodeJS.Timeout | null = null;
  private onEventChange: (event: LumiEventItem | null) => void;

  constructor(onEventChange: (event: LumiEventItem | null) => void) {
    this.onEventChange = onEventChange;
  }

  public enqueue(moment: LumiMoment, customQuote?: string): void {
    const config = MOMENT_CONFIGS[moment];
    const item: LumiEventItem = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      moment,
      quote: customQuote || config.defaultQuote,
      priority: config.priority,
      duration: config.duration,
      particleType: config.particleType,
      animationOverride: config.animation,
      createdAt: Date.now(),
    };

    // If higher priority than current playing event, interrupt or preempt
    if (this.currentEvent && item.priority > this.currentEvent.priority) {
      this.clearTimer();
      // Push interrupted event back into queue if it was major
      if (this.currentEvent.priority >= 50) {
        this.queue.unshift(this.currentEvent);
      }
      this.play(item);
      return;
    }

    // Insert sorted by descending priority
    this.queue.push(item);
    this.queue.sort((a, b) => b.priority - a.priority);

    if (!this.currentEvent) {
      this.processNext();
    }
  }

  private processNext(): void {
    if (this.queue.length === 0) {
      this.currentEvent = null;
      this.onEventChange(null);
      return;
    }

    const next = this.queue.shift()!;
    this.play(next);
  }

  private play(item: LumiEventItem): void {
    this.currentEvent = item;
    this.onEventChange(item);

    this.clearTimer();
    this.timer = setTimeout(() => {
      this.processNext();
    }, item.duration);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public destroy(): void {
    this.clearTimer();
    this.queue = [];
    this.currentEvent = null;
  }
}
