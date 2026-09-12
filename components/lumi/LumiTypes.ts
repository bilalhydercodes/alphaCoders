export type LumiMood =
  | 'CONTENT'
  | 'RADIANT'
  | 'SLEEPY'
  | 'CONCERNED'
  | 'WILTING'
  | 'FOCUSED'
  | 'SLEEPING';

export type LumiMoment =
  | 'QUEST_COMPLETE'
  | 'LEVEL_UP'
  | 'ACHIEVEMENT'
  | 'EXPLORE'
  | 'SELF_CARE'
  | 'YOU_GOT_THIS'
  | 'FOCUS_START'
  | 'FOCUS'
  | 'WELCOME'
  | 'EMPTY_STATE'
  | 'THINKING'
  | 'CONFUSED'
  | 'STREAK_MILESTONE'
  | 'SHOP_TRY_ON'
  | 'COIN_CATCH'
  | 'COIN_EARNED'
  | 'REST_DAY'
  | 'ERROR';

export type LumiBehavior =
  | 'IDLE'
  | 'BLINK'
  | 'LOOK_AROUND'
  | 'LOOK_AT_USER'
  | 'LOOK_AT_QUEST'
  | 'WALK'
  | 'RUN'
  | 'SIT'
  | 'STAND'
  | 'STRETCH'
  | 'YAWN'
  | 'WAVE'
  | 'JUMP'
  | 'CHECK_BACKPACK'
  | 'READ'
  | 'REST'
  | 'THINK'
  | 'SLEEP';

export type LumiAnimation =
  | 'idle'
  | 'blink'
  | 'lookAround'
  | 'walk'
  | 'run'
  | 'sit'
  | 'stand'
  | 'jump'
  | 'wave'
  | 'cheer'
  | 'focus'
  | 'sleep'
  | 'stretch'
  | 'yawn'
  | 'thinking'
  | 'happy'
  | 'sad'
  | 'confused'
  | 'rest'
  | 'read'
  | 'point'
  | 'coinCatch'
  | 'achievement'
  | 'tryOn'
  | 'levelUp'
  | 'streakCelebrate';

export type LumiZone =
  | 'HOME_ZONE'
  | 'QUEST_ZONE'
  | 'DAILY_GOALS_ZONE'
  | 'BOSS_ZONE'
  | 'FOCUS_ZONE'
  | 'CODEX_ZONE'
  | 'EMPORIUM_ZONE';

export type LumiSpatialAnchor =
  | 'home'
  | 'quest'
  | 'focus'
  | 'shop'
  | 'codex'
  | 'empty'
  | 'boss'
  | 'daily_goals';

export type LumiParticleType =
  | 'none'
  | 'xp'
  | 'gold'
  | 'stars'
  | 'confetti'
  | 'radiant';

export type LumiAttentionTargetType =
  | 'cursor'
  | 'quest'
  | 'xp_bar'
  | 'boss'
  | 'shop_item'
  | 'daily_goals'
  | 'user'
  | 'none';

export interface LumiAttentionTarget {
  type: LumiAttentionTargetType;
  position?: [number, number, number]; // WebGL coordinates
  weight: number; // 0 to 1
  label?: string;
}

export interface LumiZoneBounds {
  name: LumiZone;
  allowedMin: [number, number]; // [x, z] in normalized local coordinates
  allowedMax: [number, number];
  preferredSpot: [number, number, number]; // [x, y, z]
  avoidAreas?: { min: [number, number]; max: [number, number] }[];
}

export interface LumiEventItem {
  id: string;
  moment: LumiMoment;
  quote?: string;
  priority: number;
  duration: number; // in milliseconds
  particleType?: LumiParticleType;
  animationOverride?: LumiAnimation;
  distanceTier?: 'nearby' | 'medium' | 'far';
  targetAnchor?: string;
  createdAt: number;
}

export interface LumiPresenterProps {
  variant?: 'dashboard' | 'focus' | 'pedestal' | 'shop' | 'modal' | 'mini' | 'auth';
  spatialAnchor?: LumiSpatialAnchor;
  className?: string;
  height?: number | string;
  showSpeech?: boolean;
  interactive?: boolean;
}
