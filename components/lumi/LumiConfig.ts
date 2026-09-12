import {
  LumiMoment,
  LumiAnimation,
  LumiParticleType,
  LumiZone,
  LumiZoneBounds,
  LumiBehavior,
} from './LumiTypes';

export interface MomentConfig {
  priority: number;
  duration: number; // ms
  animation: LumiAnimation;
  particleType: LumiParticleType;
  defaultQuote: string;
}

export const MOMENT_CONFIGS: Record<LumiMoment, MomentConfig> = {
  LEVEL_UP: {
    priority: 100,
    duration: 3200,
    animation: 'levelUp',
    particleType: 'confetti',
    defaultQuote: 'Whoa! Level up! Glory to the Guild!',
  },
  STREAK_MILESTONE: {
    priority: 85,
    duration: 2600,
    animation: 'streakCelebrate',
    particleType: 'radiant',
    defaultQuote: 'Your consistency is legendary! Keep that flame blazing!',
  },
  ACHIEVEMENT: {
    priority: 75,
    duration: 2400,
    animation: 'achievement',
    particleType: 'stars',
    defaultQuote: 'Achievement unlocked! A proud day for an adventurer.',
  },
  QUEST_COMPLETE: {
    priority: 65,
    duration: 1800,
    animation: 'cheer',
    particleType: 'xp',
    defaultQuote: 'Nice — quest logged! Every small win compounds.',
  },
  COIN_CATCH: {
    priority: 55,
    duration: 1600,
    animation: 'coinCatch',
    particleType: 'gold',
    defaultQuote: 'Clink! Gold secured for the Guild Vault.',
  },
  COIN_EARNED: {
    priority: 55,
    duration: 1600,
    animation: 'coinCatch',
    particleType: 'gold',
    defaultQuote: 'Clink! Gold secured for the Guild Vault.',
  },
  SELF_CARE: {
    priority: 50,
    duration: 2000,
    animation: 'wave',
    particleType: 'radiant',
    defaultQuote: 'Vitality replenished. Taking care of yourself is a heroic quest.',
  },
  FOCUS_START: {
    priority: 45,
    duration: 2000,
    animation: 'focus',
    particleType: 'none',
    defaultQuote: 'Focus sanctuary engaged. Distractions locked out!',
  },
  FOCUS: {
    priority: 45,
    duration: 2000,
    animation: 'focus',
    particleType: 'none',
    defaultQuote: 'Focus sanctuary engaged. Distractions locked out!',
  },
  SHOP_TRY_ON: {
    priority: 40,
    duration: 2200,
    animation: 'tryOn',
    particleType: 'stars',
    defaultQuote: 'Magnificent fit! Ready for the next expedition.',
  },
  EXPLORE: {
    priority: 35,
    duration: 1800,
    animation: 'lookAround',
    particleType: 'stars',
    defaultQuote: 'New trails, new bounties, new discoveries!',
  },
  YOU_GOT_THIS: {
    priority: 30,
    duration: 1800,
    animation: 'cheer',
    particleType: 'stars',
    defaultQuote: 'One step at a time, adventurer. You got this!',
  },
  WELCOME: {
    priority: 25,
    duration: 2200,
    animation: 'wave',
    particleType: 'none',
    defaultQuote: 'Welcome back! Lumi has the map ready for today.',
  },
  EMPTY_STATE: {
    priority: 25,
    duration: 2200,
    animation: 'lookAround',
    particleType: 'none',
    defaultQuote: 'Looks quiet around here. Shall we post our first quest?',
  },
  REST_DAY: {
    priority: 20,
    duration: 2400,
    animation: 'rest',
    particleType: 'none',
    defaultQuote: 'Rest is part of the journey. Breathe easy today.',
  },
  THINKING: {
    priority: 15,
    duration: 1800,
    animation: 'thinking',
    particleType: 'none',
    defaultQuote: 'Consulting the ancient scrolls...',
  },
  CONFUSED: {
    priority: 15,
    duration: 1800,
    animation: 'confused',
    particleType: 'none',
    defaultQuote: 'Hmm... that wasn’t supposed to happen.',
  },
  ERROR: {
    priority: 10,
    duration: 1800,
    animation: 'confused',
    particleType: 'none',
    defaultQuote: 'A small stumble on the path. We will recover!',
  },
};

// Rich speech quote pools with context
export const CONTEXTUAL_SPEECH_POOLS: Record<LumiMoment, string[]> = {
  QUEST_COMPLETE: [
    'Nice — quest logged!',
    'One more step forward on the path of mastery.',
    'Bounty claimed! Every small quest counts.',
    'XP safely banked in your chronicle!',
    'You are on a roll today!',
  ],
  LEVEL_UP: [
    'Whoa! Level up! Glory to the Guild!',
    'Your power grows! Look at that new title!',
    'Mastery attained! A whole new chapter begins!',
  ],
  ACHIEVEMENT: [
    'Milestones matter. You are making real progress!',
    'A badge of honor! Wear it with pride!',
  ],
  STREAK_MILESTONE: [
    'Your consistency is legendary! Keep the fire burning!',
    'Day after day, showing up. That is true discipline!',
  ],
  COIN_CATCH: [
    'Gold collected! Your treasury grows!',
    'Every coin is proof of real-world work.',
  ],
  COIN_EARNED: [
    'Gold collected! Your treasury grows!',
    'Every coin is proof of real-world work.',
  ],
  SELF_CARE: [
    'Hydration and breath: the true elixir of mastery.',
    'Restored and nourished. Well done.',
  ],
  FOCUS_START: [
    'Let’s lock in. One focused quest at a time.',
    'Sanctuary active. Deep work mode engaged.',
  ],
  FOCUS: [
    'Let’s lock in. One focused quest at a time.',
    'Sanctuary active. Deep work mode engaged.',
  ],
  SHOP_TRY_ON: [
    'Looking sharp, adventurer! Ready for anything.',
    'That gear suits your spirit!',
  ],
  EXPLORE: [
    'New trails, new bounties, more possibilities!',
    'Curiosity is the greatest attribute.',
  ],
  YOU_GOT_THIS: [
    'A little nudge, a lot of belief. Keep going!',
    'Lumi believes in you!',
  ],
  WELCOME: [
    'Welcome back! The guild awaits your chronicle.',
    'Ready for today’s adventures?',
  ],
  EMPTY_STATE: [
    'Looks quiet around here. Shall we post our first quest?',
    'The bounty board is clean and waiting for your goals.',
  ],
  REST_DAY: [
    'Rest is part of the journey, not failure.',
    'Sharpening the sword means resting the arm.',
  ],
  THINKING: [
    'Hmm... considering the best route...',
    'Consulting the Codex scrolls...',
  ],
  CONFUSED: [
    'Hmm... that was unexpected.',
    'A curious path... let us recalibrate.',
  ],
  ERROR: [
    'A small stumble on the path. We’ve got this!',
  ],
};

// Autonomous Idle Brain: 70% calm ("DO NOTHING"), 20% subtle movement, 10% special action
export interface IdleBehaviorWeight {
  behavior: LumiBehavior;
  animation: LumiAnimation;
  weight: number; // Relative probability
  cooldownMs: number;
}

export const IDLE_BEHAVIOR_WEIGHTS: IdleBehaviorWeight[] = [
  // 70% Calm / Do Nothing
  { behavior: 'IDLE', animation: 'idle', weight: 45, cooldownMs: 0 },
  { behavior: 'BLINK', animation: 'blink', weight: 15, cooldownMs: 3000 },
  { behavior: 'LOOK_AROUND', animation: 'lookAround', weight: 10, cooldownMs: 6000 },

  // 20% Subtle Movement
  { behavior: 'STRETCH', animation: 'stretch', weight: 8, cooldownMs: 18000 },
  { behavior: 'SIT', animation: 'sit', weight: 7, cooldownMs: 14000 },
  { behavior: 'STAND', animation: 'stand', weight: 5, cooldownMs: 14000 },

  // 10% Special Contextual Action
  { behavior: 'LOOK_AT_USER', animation: 'lookAround', weight: 4, cooldownMs: 8000 },
  { behavior: 'WAVE', animation: 'wave', weight: 3, cooldownMs: 25000 },
  { behavior: 'CHECK_BACKPACK', animation: 'thinking', weight: 2, cooldownMs: 30000 },
  { behavior: 'YAWN', animation: 'yawn', weight: 1, cooldownMs: 40000 },
];

// Bounded Playground Zones
export const LUMI_ZONES: Record<LumiZone, LumiZoneBounds> = {
  HOME_ZONE: {
    name: 'HOME_ZONE',
    allowedMin: [-0.35, -0.3],
    allowedMax: [0.35, 0.3],
    preferredSpot: [0, 0, 0],
  },
  QUEST_ZONE: {
    name: 'QUEST_ZONE',
    allowedMin: [-0.4, -0.2],
    allowedMax: [0.4, 0.2],
    preferredSpot: [0, 0, 0],
  },
  DAILY_GOALS_ZONE: {
    name: 'DAILY_GOALS_ZONE',
    allowedMin: [-0.3, -0.2],
    allowedMax: [0.3, 0.2],
    preferredSpot: [0, 0, 0],
  },
  BOSS_ZONE: {
    name: 'BOSS_ZONE',
    allowedMin: [-0.35, -0.25],
    allowedMax: [0.35, 0.25],
    preferredSpot: [0, 0, 0],
  },
  FOCUS_ZONE: {
    name: 'FOCUS_ZONE',
    allowedMin: [-0.15, -0.15],
    allowedMax: [0.15, 0.15],
    preferredSpot: [0, -0.05, 0],
  },
  CODEX_ZONE: {
    name: 'CODEX_ZONE',
    allowedMin: [-0.2, -0.2],
    allowedMax: [0.2, 0.2],
    preferredSpot: [0, -0.02, 0],
  },
  EMPORIUM_ZONE: {
    name: 'EMPORIUM_ZONE',
    allowedMin: [-0.3, -0.2],
    allowedMax: [0.3, 0.2],
    preferredSpot: [0, 0, 0],
  },
};

// Navigation Intent Map: Tab -> Zone + Intent
export const NAVIGATION_INTENTS: Record<
  string,
  { zone: LumiZone; initialBehavior: LumiBehavior; speechHint?: string }
> = {
  map: {
    zone: 'HOME_ZONE',
    initialBehavior: 'IDLE',
    speechHint: 'The path of mastery awaits!',
  },
  bounties: {
    zone: 'QUEST_ZONE',
    initialBehavior: 'LOOK_AT_QUEST',
    speechHint: 'Reviewing the guild bounty board.',
  },
  league: {
    zone: 'BOSS_ZONE',
    initialBehavior: 'STAND',
    speechHint: 'Checking the tournament standings!',
  },
  shop: {
    zone: 'EMPORIUM_ZONE',
    initialBehavior: 'LOOK_AROUND',
    speechHint: 'The Guild Emporium! So many treasures.',
  },
  codex: {
    zone: 'CODEX_ZONE',
    initialBehavior: 'SIT',
    speechHint: 'Opening your adventurer chronicle.',
  },
};

// Standard Rigged Animation Clip Names (Layer 1 Skeletal Mapping)
export const SKELETAL_CLIP_NAMES: Record<LumiAnimation, string[]> = {
  idle: ['Idle', 'idle', 'Lumi_Idle', 'Anim_Idle'],
  walk: ['Walk', 'walk', 'Lumi_Walk', 'Anim_Walk'],
  run: ['Run', 'run', 'Lumi_Run', 'Anim_Run'],
  sit: ['Sit', 'sit', 'Lumi_Sit', 'Anim_Sit'],
  stand: ['Stand', 'stand', 'Lumi_Stand', 'Anim_Stand'],
  jump: ['Jump', 'jump', 'Lumi_Jump', 'Anim_Jump'],
  wave: ['Wave', 'wave', 'Lumi_Wave', 'Anim_Wave'],
  cheer: ['Cheer', 'cheer', 'Lumi_Cheer', 'Anim_Cheer'],
  focus: ['Focus', 'focus', 'Lumi_Focus', 'Anim_Focus'],
  sleep: ['Sleep', 'sleep', 'Lumi_Sleep', 'Anim_Sleep'],
  stretch: ['Stretch', 'stretch', 'Lumi_Stretch'],
  yawn: ['Yawn', 'yawn', 'Lumi_Yawn'],
  blink: ['Blink', 'blink', 'Lumi_Blink'],
  lookAround: ['LookAround', 'lookAround', 'Lumi_LookAround'],
  thinking: ['Think', 'thinking', 'Lumi_Think'],
  happy: ['Happy', 'happy', 'Lumi_Happy'],
  sad: ['Sad', 'sad', 'Lumi_Sad'],
  confused: ['Confused', 'confused', 'Lumi_Confused'],
  rest: ['Rest', 'rest', 'Lumi_Rest'],
  read: ['Read', 'read', 'Lumi_Read'],
  point: ['Point', 'point', 'Lumi_Point'],
  coinCatch: ['CoinCatch', 'coinCatch', 'Lumi_CoinCatch'],
  achievement: ['Achievement', 'achievement', 'Lumi_Achievement'],
  tryOn: ['TryOn', 'tryOn', 'Lumi_TryOn'],
  levelUp: ['LevelUp', 'levelUp', 'Lumi_LevelUp'],
  streakCelebrate: ['StreakCelebrate', 'streakCelebrate', 'Lumi_StreakCelebrate'],
};
