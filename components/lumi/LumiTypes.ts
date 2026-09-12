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
  | 'FOCUS'
  | 'WELCOME'
  | 'COIN_EARNED'
  | 'STREAK_MILESTONE'
  | 'SHOP_TRY_ON'
  | 'REST_DAY'
  | 'ERROR';

export type LumiAnimation =
  | 'idle'
  | 'blink'
  | 'lookAround'
  | 'walk'
  | 'run'
  | 'jump'
  | 'wave'
  | 'sit'
  | 'stand'
  | 'sleep'
  | 'wake'
  | 'thinking'
  | 'focus'
  | 'cheer'
  | 'levelUp'
  | 'tryOn';

export type LumiSpatialAnchor =
  | 'home'
  | 'quest'
  | 'focus'
  | 'shop'
  | 'codex'
  | 'empty';

export type LumiParticleType =
  | 'none'
  | 'xp'
  | 'gold'
  | 'stars'
  | 'confetti'
  | 'radiant';

export interface LumiEventItem {
  id: string;
  moment: LumiMoment;
  quote?: string;
  priority: number;
  duration: number; // in milliseconds
  particleType?: LumiParticleType;
  animationOverride?: LumiAnimation;
  createdAt: number;
}

export interface LumiPresenterProps {
  variant?: 'dashboard' | 'focus' | 'pedestal' | 'shop' | 'modal' | 'mini';
  spatialAnchor?: LumiSpatialAnchor;
  className?: string;
  height?: number | string;
  showSpeech?: boolean;
  interactive?: boolean;
}
