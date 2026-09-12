import { LumiBehavior, LumiAnimation, LumiMood, LumiZone } from './LumiTypes';
import { IDLE_BEHAVIOR_WEIGHTS, LUMI_ZONES } from './LumiConfig';

export interface BrainDecision {
  behavior: LumiBehavior;
  animation: LumiAnimation;
  speech?: string;
  targetOffset?: [number, number, number];
  duration?: number;
}

export class LumiBehaviorBrain {
  private lastActionTime: number = Date.now();
  private lastUserActivityTime: number = Date.now();
  private cooldowns: Map<LumiBehavior, number> = new Map();
  private currentZone: LumiZone = 'HOME_ZONE';
  private actionTimer: number = 0;
  private nextInterval: number = 10; // seconds until next autonomous evaluation

  constructor(initialZone: LumiZone = 'HOME_ZONE') {
    this.currentZone = initialZone;
    this.resetNextInterval();
  }

  public setZone(zone: LumiZone) {
    this.currentZone = zone;
  }

  public recordUserActivity() {
    this.lastUserActivityTime = Date.now();
  }

  private resetNextInterval() {
    // 8 to 14 seconds between autonomous micro-decisions
    this.nextInterval = 8 + Math.random() * 6;
    this.actionTimer = 0;
  }

  /**
   * Evaluates autonomous behavior in the frame loop.
   * Returns a new BrainDecision if an autonomous action should start, or null.
   */
  public tick(
    delta: number,
    isInteracting: boolean,
    isFocusMode: boolean,
    mood: LumiMood,
    reducedMotion: boolean
  ): BrainDecision | null {
    if (reducedMotion || isFocusMode || isInteracting) {
      return null;
    }

    this.actionTimer += delta;
    if (this.actionTimer < this.nextInterval) {
      return null;
    }

    this.resetNextInterval();
    const now = Date.now();
    const userInactivitySec = (now - this.lastUserActivityTime) / 1000;

    // Reasoned Trigger 1: Deep user inactivity (> 45s) -> Restlessness or Stretch
    if (userInactivitySec > 45 && Math.random() < 0.5) {
      const zoneBounds = LUMI_ZONES[this.currentZone];
      // Pick a subtle shift within safe bounds
      const shiftX = (Math.random() - 0.5) * (zoneBounds.allowedMax[0] - zoneBounds.allowedMin[0]) * 0.4;
      const shiftZ = (Math.random() - 0.5) * (zoneBounds.allowedMax[1] - zoneBounds.allowedMin[1]) * 0.4;

      return {
        behavior: 'STRETCH',
        animation: 'stretch',
        targetOffset: [shiftX, 0, shiftZ],
        duration: 2200,
      };
    }

    // Reasoned Trigger 2: Inactivity (> 25s) -> Look around or blink
    if (userInactivitySec > 25 && Math.random() < 0.4) {
      return {
        behavior: 'LOOK_AROUND',
        animation: 'lookAround',
        duration: 2000,
      };
    }

    // Weighted autonomous selection (70% Calm, 20% Movement, 10% Special)
    const availableWeights = IDLE_BEHAVIOR_WEIGHTS.filter((item) => {
      const lastTrigger = this.cooldowns.get(item.behavior) || 0;
      return now - lastTrigger >= item.cooldownMs;
    });

    if (availableWeights.length === 0) {
      return null;
    }

    const totalWeight = availableWeights.reduce((acc, curr) => acc + curr.weight, 0);
    let rand = Math.random() * totalWeight;
    let selected = availableWeights[0];

    for (const item of availableWeights) {
      if (rand < item.weight) {
        selected = item;
        break;
      }
      rand -= item.weight;
    }

    this.cooldowns.set(selected.behavior, now);
    this.lastActionTime = now;

    // Formulate decision
    let duration = 1800;
    let targetOffset: [number, number, number] | undefined = undefined;

    if (selected.behavior === 'STRETCH') duration = 2400;
    else if (selected.behavior === 'WAVE') duration = 2000;
    else if (selected.behavior === 'SIT') duration = 3000;
    else if (selected.behavior === 'BLINK') duration = 600;

    return {
      behavior: selected.behavior,
      animation: selected.animation,
      duration,
      targetOffset,
    };
  }
}
