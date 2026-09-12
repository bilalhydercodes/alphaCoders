export interface ProgressionResult {
  newLevel: number;
  newXp: number;
  xpNeeded: number;
  didLevelUp: boolean;
  levelsGained: number;
  goldEarned: number;
  xpEarned: number;
  statGained: {
    attribute: string;
    points: number;
  };
  streakUpdated: {
    currentStreak: number;
    multiplier: number;
  };
}

export function getXpForNextLevel(level: number): number {
  // Non-linear RPG curve: 100 * level^1.5
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function getStreakMultiplier(streak: number): number {
  // 1.0 + min(0.50, streak * 0.05) -> up to +50% bonus
  return 1.0 + Math.min(0.5, Math.max(0, streak) * 0.05);
}

export const DIFFICULTY_REWARDS: Record<string, { xp: number; gold: number }> = {
  TRIVIAL: { xp: 10, gold: 5 },
  EASY: { xp: 25, gold: 12 },
  MEDIUM: { xp: 50, gold: 25 },
  HARD: { xp: 100, gold: 55 },
  EPIC: { xp: 250, gold: 150 },
};

export const CATEGORY_ATTRIBUTES: Record<string, 'strength' | 'intellect' | 'agility' | 'vitality' | 'spirit'> = {
  STRENGTH: 'strength',
  INTELLECT: 'intellect',
  AGILITY: 'agility',
  VITALITY: 'vitality',
  SPIRIT: 'spirit',
};

export function calculateQuestCompletion(
  currentLevel: number,
  currentXp: number,
  currentStreak: number,
  lastActiveDate: Date | null,
  difficulty: string,
  category: string
): ProgressionResult {
  const baseReward = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.MEDIUM;

  // Streak logic
  const now = new Date();
  let updatedStreak = currentStreak;

  if (!lastActiveDate) {
    updatedStreak = 1;
  } else {
    const diffHours = (now.getTime() - new Date(lastActiveDate).getTime()) / (1000 * 60 * 60);
    if (diffHours < 36) {
      // Completed within ~1.5 days -> continue or maintain streak
      if (diffHours >= 12) {
        updatedStreak = currentStreak + 1;
      }
    } else {
      // Streak broken
      updatedStreak = 1;
    }
  }

  const multiplier = getStreakMultiplier(updatedStreak);
  const xpEarned = Math.round(baseReward.xp * multiplier);
  const goldEarned = Math.round(baseReward.gold * multiplier);

  // Level progression loop
  let level = currentLevel;
  let xp = currentXp + xpEarned;
  let didLevelUp = false;
  let levelsGained = 0;

  while (true) {
    const needed = getXpForNextLevel(level);
    if (xp >= needed) {
      xp -= needed;
      level += 1;
      didLevelUp = true;
      levelsGained += 1;
    } else {
      break;
    }
  }

  const attribute = CATEGORY_ATTRIBUTES[category] || 'intellect';
  const statPoints = difficulty === 'EPIC' ? 3 : difficulty === 'HARD' ? 2 : 1;

  return {
    newLevel: level,
    newXp: xp,
    xpNeeded: getXpForNextLevel(level),
    didLevelUp,
    levelsGained,
    goldEarned,
    xpEarned,
    statGained: {
      attribute,
      points: statPoints,
    },
    streakUpdated: {
      currentStreak: updatedStreak,
      multiplier,
    },
  };
}
