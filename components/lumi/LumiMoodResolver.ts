import { LumiMood } from './LumiTypes';

export interface MoodResolverParams {
  streak?: number;
  level?: number;
  hp?: number;
  maxHp?: number;
  energy?: number;
  hasActiveQuest?: boolean;
  isFocusModeActive?: boolean;
  timeOfDay?: Date;
  secondsInactive?: number;
  streakAtRisk?: boolean;
  streakLostRecently?: boolean;
}

export function resolveLumiMood(params: MoodResolverParams): LumiMood {
  const {
    streak = 0,
    hp = 100,
    maxHp = 100,
    isFocusModeActive = false,
    timeOfDay = new Date(),
    secondsInactive = 0,
    streakAtRisk = false,
    streakLostRecently = false,
  } = params;

  // 1. Focus mode has highest ambient priority
  if (isFocusModeActive) {
    return 'FOCUSED';
  }

  // 2. Night mode: late night rest
  const currentHour = timeOfDay.getHours();
  if (currentHour >= 23 || currentHour < 5) {
    return 'SLEEPING';
  }

  // 3. Wilting: streak was recently lost or low HP
  if (streakLostRecently || (maxHp > 0 && hp / maxHp < 0.25)) {
    return 'WILTING';
  }

  // 4. Concerned: streak is endangered today
  if (streakAtRisk) {
    return 'CONCERNED';
  }

  // 5. Sleepy: prolonged user inactivity
  if (secondsInactive > 240) {
    return 'SLEEPY';
  }

  // 6. Radiant: high streak and healthy progression
  if (streak >= 3) {
    return 'RADIANT';
  }

  // 7. Content: peaceful baseline
  return 'CONTENT';
}
