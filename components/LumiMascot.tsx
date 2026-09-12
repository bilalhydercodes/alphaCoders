'use client';

import React from 'react';

export type LumiMood =
  | 'content'
  | 'radiant'
  | 'sleepy'
  | 'concerned'
  | 'wilting'
  | 'focused'
  | 'sleeping'
  | 'celebrating'
  | 'levelup'
  | 'achievement'
  | 'explore'
  | 'selfcare'
  | 'yougotthis';

interface LumiMascotProps {
  mood?: LumiMood | string;
  size?: number;
  className?: string;
  isPetted?: boolean;
}

export const LumiMascot: React.FC<LumiMascotProps> = ({
  mood = 'content',
  size = 140,
  className = '',
  isPetted = false,
}) => {
  // Normalize mood into base facial expressions
  const normalizedMood = (() => {
    switch (mood) {
      case 'levelup':
      case 'celebrating':
      case 'achievement':
        return 'celebrating';
      case 'sleepy':
      case 'sleeping':
      case 'wilting':
        return 'sleepy';
      case 'concerned':
        return 'concerned';
      case 'focused':
        return 'focused';
      case 'radiant':
      case 'explore':
      case 'yougotthis':
        return 'radiant';
      case 'content':
      case 'selfcare':
      default:
        return 'content';
    }
  })();

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform duration-300 select-none ${
        isPetted ? 'scale-110 -translate-y-2' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Lumi companion mascot looking ${mood}`}
    >
      <svg
        viewBox="0 0 160 160"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          {/* Ambient body gradient */}
          <linearGradient id="lumiBodyGrad" x1="80" y1="20" x2="80" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F5F0FF" />
            <stop offset="100%" stopColor="#EADFFF" />
          </linearGradient>

          {/* Golden glow for radiant/celebrating */}
          <radialGradient id="lumiGlow" cx="80" cy="80" r="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5B700" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F5B700" stopOpacity="0" />
          </radialGradient>

          {/* Scarf gradient */}
          <linearGradient id="lumiScarfGrad" x1="40" y1="100" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9966CC" />
            <stop offset="100%" stopColor="#7A4BC2" />
          </linearGradient>
        </defs>

        {/* Ambient aura glow if celebrating or radiant */}
        {(normalizedMood === 'celebrating' || normalizedMood === 'radiant') && (
          <circle cx="80" cy="80" r="72" fill="url(#lumiGlow)" className="animate-pulse" />
        )}

        {/* Floating Sprout / Leaf on head */}
        <g id="lumi-sprout" className="transition-transform duration-300">
          <path
            d="M80 34 C80 20 70 12 62 14 C56 16 60 26 78 32"
            fill="#4FCE6B"
            stroke="#3BA853"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M80 34 C82 22 92 16 98 20 C104 24 96 32 82 35"
            fill="#6BE085"
            stroke="#3BA853"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="80" cy="33" r="2.5" fill="#F5B700" />
        </g>

        {/* Floating Body Shadow */}
        <ellipse cx="80" cy="148" rx="42" ry="7" fill="#2E2438" fillOpacity="0.08" />

        {/* Main Body (Soft pear/cloud spirit) */}
        <path
          d="M80 32 C115 32 136 58 136 92 C136 122 118 140 80 140 C42 140 24 122 24 92 C24 58 45 32 80 32 Z"
          fill="url(#lumiBodyGrad)"
          stroke="#DCC7FF"
          strokeWidth="2.5"
        />

        {/* Cute Little Spirit Arms */}
        <path
          d="M32 94 C24 92 20 102 28 108 C34 112 40 106 38 98"
          fill="#FAF8FF"
          stroke="#DCC7FF"
          strokeWidth="2"
        />
        <path
          d="M128 94 C136 92 140 102 132 108 C126 112 120 106 122 98"
          fill="#FAF8FF"
          stroke="#DCC7FF"
          strokeWidth="2"
        />

        {/* Soft Blush Cheeks */}
        <ellipse cx="52" cy="94" rx="8" ry="5" fill="#F3C6E6" fillOpacity="0.85" />
        <ellipse cx="108" cy="94" rx="8" ry="5" fill="#F3C6E6" fillOpacity="0.85" />

        {/* Expressions (Swappable Layer) */}
        {normalizedMood === 'content' && (
          <g id="expr-content">
            {/* Curved happy eyes ^ ^ */}
            <path
              d="M50 82 C54 75 62 75 66 82"
              stroke="#2E2438"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M94 82 C98 75 106 75 110 82"
              stroke="#2E2438"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Gentle smile */}
            <path
              d="M74 92 C77 96 83 96 86 92"
              stroke="#2E2438"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {normalizedMood === 'radiant' && (
          <g id="expr-radiant">
            {/* Big round shining eyes */}
            <circle cx="58" cy="80" r="8" fill="#2E2438" />
            <circle cx="61" cy="77" r="3" fill="#FFFFFF" />
            <circle cx="55" cy="83" r="1.5" fill="#FFFFFF" />

            <circle cx="102" cy="80" r="8" fill="#2E2438" />
            <circle cx="105" cy="77" r="3" fill="#FFFFFF" />
            <circle cx="99" cy="83" r="1.5" fill="#FFFFFF" />

            {/* Happy open smile */}
            <path
              d="M72 90 Q80 102 88 90 Z"
              fill="#E5484D"
              stroke="#2E2438"
              strokeWidth="2"
            />
            {/* Sparkles around head */}
            <path d="M26 44 L30 50 L26 56 L22 50 Z" fill="#F5B700" />
            <path d="M134 44 L138 50 L134 56 L130 50 Z" fill="#F5B700" />
          </g>
        )}

        {normalizedMood === 'celebrating' && (
          <g id="expr-celebrating">
            {/* Star sparkle eyes */}
            <path
              d="M58 72 L61 78 L67 80 L61 82 L58 88 L55 82 L49 80 L55 78 Z"
              fill="#F5B700"
              stroke="#D49E00"
              strokeWidth="1.2"
            />
            <path
              d="M102 72 L105 78 L111 80 L105 82 L102 88 L99 82 L93 80 L99 78 Z"
              fill="#F5B700"
              stroke="#D49E00"
              strokeWidth="1.2"
            />
            {/* Joyful open mouth */}
            <path
              d="M72 89 C72 98 88 98 88 89 Z"
              fill="#E5484D"
              stroke="#2E2438"
              strokeWidth="2.2"
            />
            {/* Confetti sparks */}
            <circle cx="28" cy="40" r="3" fill="#9966CC" />
            <circle cx="132" cy="38" r="3" fill="#4FCE6B" />
            <polygon points="76,14 80,18 84,14 80,10" fill="#F5B700" />
          </g>
        )}

        {normalizedMood === 'concerned' && (
          <g id="expr-concerned">
            {/* Soft worried eyebrows */}
            <path d="M48 72 Q56 76 64 74" stroke="#7A6F8C" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M96 74 Q104 76 112 72" stroke="#7A6F8C" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Round concerned eyes with lower look */}
            <circle cx="58" cy="82" r="6" fill="#2E2438" />
            <circle cx="60" cy="80" r="2" fill="#FFFFFF" />

            <circle cx="102" cy="82" r="6" fill="#2E2438" />
            <circle cx="104" cy="80" r="2" fill="#FFFFFF" />

            {/* Slight wavy mouth */}
            <path
              d="M74 94 Q80 91 86 94"
              stroke="#2E2438"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Small blue sweat/worry drop */}
            <path
              d="M118 68 C118 64 122 60 122 60 C122 60 126 64 126 68 C126 71 123 73 120 73 C118 73 118 71 118 68 Z"
              fill="#7A94D4"
            />
          </g>
        )}

        {normalizedMood === 'sleepy' && (
          <g id="expr-sleepy">
            {/* Droopy crescent eyes */}
            <path
              d="M48 84 Q58 88 66 84"
              stroke="#2E2438"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M94 84 Q102 88 112 84"
              stroke="#2E2438"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Small sleepy mouth */}
            <circle cx="80" cy="94" r="3" fill="#7A6F8C" />

            {/* Floating "Z z" */}
            <text
              x="118"
              y="56"
              fill="#9966CC"
              fontSize="16"
              fontWeight="bold"
              fontFamily="inherit"
              opacity="0.8"
            >
              z
            </text>
            <text
              x="130"
              y="40"
              fill="#9966CC"
              fontSize="22"
              fontWeight="bold"
              fontFamily="inherit"
              opacity="0.9"
            >
              Z
            </text>
          </g>
        )}

        {normalizedMood === 'focused' && (
          <g id="expr-focused">
            {/* Determined angled eyes */}
            <path
              d="M50 75 L66 81"
              stroke="#2E2438"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="58" cy="83" r="4.5" fill="#2E2438" />
            <circle cx="60" cy="82" r="1.5" fill="#FFFFFF" />

            <path
              d="M110 75 L94 81"
              stroke="#2E2438"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="102" cy="83" r="4.5" fill="#2E2438" />
            <circle cx="100" cy="82" r="1.5" fill="#FFFFFF" />

            {/* Small determined straight mouth */}
            <line
              x1="74"
              y1="94"
              x2="86"
              y2="94"
              stroke="#2E2438"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Adventurer's Cozy Amethyst Scarf */}
        <g id="lumi-scarf">
          <path
            d="M44 108 C64 120 96 120 116 108 C120 115 116 126 98 128 C80 130 60 126 44 118 Z"
            fill="url(#lumiScarfGrad)"
            stroke="#7A4BC2"
            strokeWidth="1.8"
          />
          {/* Hanging scarf tail */}
          <path
            d="M92 122 L98 144 L110 142 L106 122 Z"
            fill="#9966CC"
            stroke="#7A4BC2"
            strokeWidth="1.5"
          />
          {/* Scarf fold detail */}
          <line x1="94" y1="126" x2="108" y2="124" stroke="#EADFFF" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
