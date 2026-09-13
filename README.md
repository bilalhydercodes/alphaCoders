# Life RPG with Lumi — Chronicles of Mastery

> A gamified productivity system engineered to bridge the delayed gratification gap through RPG progression, character attributes, and an autonomous 3D companion.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL / Neon](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Neon-003B57?style=flat&logo=postgresql)](https://neon.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Live Deployment & Quick Access

- **Production URL**: [https://alpha-coders-xi.vercel.app/](https://alpha-coders-xi.vercel.app/)
- **1-Click Instant Demo**: On the sign-in modal, select **"Instant Demo Explorer Login"** for immediate access with pre-seeded quests, gear, and character attributes—no credentials required.
- **Source Repository**: [https://github.com/bilalhydercodes/alphaCoders.git](https://github.com/bilalhydercodes/alphaCoders.git)

---

## Problem Statement & Scientific Foundation

Traditional to-do applications and habit trackers suffer from a fundamental cognitive design flaw: **the neurobiological discount rate of delayed rewards**.

In the human prefrontal cortex, studying for an exam or exercising provides positive reinforcement only after weeks or months. Standard productivity tools replace this friction with sterile checklists, creating the "chore trap" that leads to abandonment—especially for ADHD and neurodivergent users.

**Life RPG** bridges this delayed gratification gap by coupling real-world task verification with immediate, multi-sensory feedback loops:
1. **Procedural Web Audio API Synthesizer**: Zero-latency acoustic feedback using harmonic major triads and exponential gain decays—no external audio files or bandwidth overhead.
2. **Ballistic 3D XP Particles**: Particle physics that erupt from completed tasks and arc across the viewport into the player's progression bars.
3. **Tactile Spring Micro-Interactions**: 180ms physics-based checkmark drawing with tactile resistance.
4. **Floating Combat Indicators**: Real-time ARPG visual markers (`+60 XP`, `+35 GP`, `-156 DMG`) confirming immediate reward delivery.

---

## Architectural Highlights & Engineering Innovations

### 1. Autonomous 3D Companion Mascot (Lumi)
Lumi is a WebGL-rendered 3D companion built with Three.js, `@react-three/fiber`, and `@react-three/drei`, operating on an autonomous probabilistic state engine:
- **70% Calm Resting**: Natural breathing, blinking, and ambient idle curiosity while the user works uninterrupted.
- **20% Subtle Movements**: Posture shifts, interface scans, and laptop interactions.
- **10% Contextual Reactions**: Instant choreography on bounty completion, level-ups, and focus sprints.
- **7 Dynamic Ambient Moods**: Content (default), Radiant (7+ day streak), Sleepy (24h+ inactive), Concerned (streak expiring), Wilting (streak reset), Focused (Pomodoro active), and Sleeping (night mode).
- **DOM-to-WebGL Spatial Projection**: Calculates bounding rects of interface elements (`data-lumi-zone`) and interpolates Lumi's 3D coordinates along Bezier trajectories to navigate across the screen.

### 2. Non-Linear Leveling Engine & Server-Side Anti-Cheat
Progress avoids arbitrary linear grinding and punishing exponential walls by implementing a sub-quadratic power curve:

$$XP_{\text{needed}}(L) = \left\lfloor 100 \times L^{1.5} \right\rfloor$$

- **Dynamic Streak Multipliers**: Scales linearly with consistency up to a $+50\%$ bonus cap: $\text{Multiplier}(\text{streak}) = 1.0 + \min(0.50, \; 0.05 \times \text{streak})$.
- **Atomic Verification**: XP, Gold, streak calculations, and inventory transactions execute exclusively within backend Prisma database transactions to prevent client-side state manipulation.

### 3. Five Real-World Character Attributes
Tasks are categorized across five distinct human dimensions to prevent cognitive flattening and burnout:
- **Intellect (INT)**: Reading, programming, research, academic synthesis.
- **Strength (STR)**: Resistance training, calisthenics, manual labor (amplifies raid boss damage).
- **Agility (AGI)**: Cardiovascular conditioning, quick chores, rapid execution sprints.
- **Vitality (VIT)**: Sleep hygiene, nutrition, hydration (increases maximum player HP).
- **Spirit (SPI)**: Meditation, journaling, emotional resilience, mindfulness.
- **Visual Codex**: Rendered via an interactive SVG radar pentagram with proactive deficit warnings.

### 4. Cooperative Boss Raids & Guild Economy
- **The Sloth Behemoth**: A persistent collective raid boss instance (10,000 HP). Authenticated quest completions strike the boss for damage scaled by base XP and Strength attribute scores.
- **Zero-Fiat Virtual Economy**: The Guild Emporium uses 100% in-game earned Bounty Gold (GP) with zero real-money transactions, microtransactions, or pay-to-win mechanics.

### 5. Deep Focus Sanctuary (Pomodoro Engine)
- Integrated 25-minute deep work sprint with ambient binaural sound synthesis.
- Synchronized companion behavior (Lumi sits and works on her purple laptop).
- Automatic award of Intellect XP and Bounty Gold upon sprint completion.

### 6. Frontier SEO & Answer Engine Optimization (AEO)
Built to lead in modern AI retrieval and agentic search systems:
- **Server-Side Rendering (SSR)**: Converted root routing to Next.js Server Components, ensuring all semantic headings, FAQs, and structured data are pre-rendered in initial HTML without client-side loading screens.
- **Google Open Knowledge Format (OKF) Bundle**: A modular `/public/okf/` knowledge base with YAML frontmatter designed for agentic RAG extraction.
- **Comprehensive Machine Readability**: Full JSON-LD graph (`SoftwareApplication`, `Organization`, `WebSite`, `FAQPage`), explicit crawler allowances in `robots.ts` (`GPTBot`, `PerplexityBot`, `ClaudeBot`, etc.), and structured `llms.txt`.
- **Dynamic Open Graph Generation**: Native 1200x630px social card via `next/og` (`/opengraph-image`).

---

## Technical Specifications

| Layer | Technology | Architectural Function |
|---|---|---|
| **Framework** | Next.js 15 (App Router) + React 19 | Server Component rendering, zero-latency crawling, streaming boundaries |
| **Language** | TypeScript 5.8 | Strict end-to-end type safety across API routes and client state |
| **Styling** | Tailwind CSS 3.4 + Plus Jakarta Sans | High-contrast design tokens, WCAG AA/AAA compliant color palette |
| **3D Engine** | Three.js + React Three Fiber + Drei | Low-overhead WebGL rendering of companion character models |
| **ORM & Database** | Prisma 6.4 + PostgreSQL (Neon) | Relational schema with user data isolation, atomic mutations, SQLite local fallback |
| **Audio Engine** | Web Audio API (`AudioContext`) | Procedural 8-bit sound synthesis with zero external audio assets |
| **Security** | `bcryptjs` + JWT | Salted password hashing with `httpOnly` secure session cookies |
| **Accessibility** | Semantic HTML + Keyboard Manager | Full keyboard navigation (`Tab`, `Space`, `Enter`, `Q`, `1-7`, `M`, `F`, `Esc`, `?`) |

---

## Keyboard Shortcuts

| Hotkey | Action |
|---|---|
| `Q` or `N` | Post a new bounty (Create Quest modal) |
| `1` | Switch to Quest Map & Chronicle |
| `2` | Switch to Bounty Board & Habit Tracker |
| `3` | Switch to Guild League Leaderboard |
| `4` | Switch to Guild Emporium (Shop) |
| `5` | Switch to Character Codex & Radar Stats |
| `6` | Switch to Adventurer Profile |
| `7` | Switch to Guild Settings |
| `F` | Open Deep Focus Sanctuary (Pomodoro timer) |
| `M` | Toggle procedural sound synthesis (Mute / Unmute) |
| `Esc` | Close active modal, dialog, or focus session |
| `?` | Display keyboard shortcuts cheatsheet |

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/           # Registration, login, logout, me, guest sessions
│   │   ├── quests/         # Bounty CRUD and server-side verification
│   │   ├── shop/           # Guild Emporium item catalog and purchases
│   │   ├── inventory/      # Player item management and equipping
│   │   └── boss/           # Persistent raid boss instance and combat logs
│   ├── dashboard/          # Dedicated authenticated dashboard route
│   ├── opengraph-image.tsx # Dynamic 1200x630 social card generator (next/og)
│   ├── layout.tsx          # Root layout, JSON-LD schemas, font optimization
│   ├── page.tsx            # Server Component landing page with SSR delivery
│   ├── robots.ts           # Search and AI crawler access rules
│   └── sitemap.ts          # Prioritized XML sitemap with OKF endpoints
├── components/
│   ├── dashboard/          # Isolated dashboard client engine and state router
│   ├── landing/            # Pre-rendered landing sections, features, and FAQ
│   ├── icons/              # Scalable SVG iconography
│   ├── lumi/               # 3D mascot provider, spatial projection, debug panel
│   ├── CharacterCodex.tsx  # Equipment paper doll and SVG radar pentagram
│   ├── DungeonRaid.tsx     # Raid boss health bar and combat log stream
│   ├── FocusTimerModal.tsx # Pomodoro focus sanctuary with audio synthesis
│   ├── GuildEmporium.tsx   # Virtual economy store and equipment purchase
│   ├── GuildLeague.tsx     # Division rankings from Bronze to Legend
│   ├── LevelUpModal.tsx    # Celebration screen with confetti and fanfare
│   └── QuestBoard.tsx      # Tactile task list with spring checkmarks
├── context/
│   └── AuthContext.tsx     # Authentication state, sound controls, user data
├── lib/
│   ├── auth.ts             # JWT signature verification and password hashing
│   ├── prisma.ts           # Prisma client singleton
│   ├── progression.ts      # Sub-quadratic leveling and streak formulas
│   └── sound.ts            # Procedural Web Audio API synthesizer
├── prisma/
│   ├── schema.prisma       # Relational models (User, Quest, HabitLog, Inventory)
│   ├── seed.mjs            # Seed data (starter equipment, elixirs, raid bosses)
│   └── migrations/         # PostgreSQL production migrations
└── public/
    ├── llms.txt            # Machine-readable product spec and competitive matrix
    └── okf/                # Google Open Knowledge Format concept bundle
        ├── index.md
        ├── lumi-companion.md
        ├── progression-engine.md
        ├── character-attributes.md
        ├── dungeon-raids-economy.md
        ├── focus-sanctuary-adhd.md
        └── architecture-persistence.md
```

---

## Local Development & Setup

### Prerequisites
- Node.js v18+ (tested on Node v20 and v24)
- npm or pnpm

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bilalhydercodes/alphaCoders.git
   cd alphaCoders
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file from the provided template:
   ```bash
   cp .env.example .env
   ```
   *(For local development, SQLite runs out of the box with `DATABASE_URL="file:./dev.db"`).*

4. **Initialize database schema and seed items**:
   ```bash
   npx prisma db push
   node prisma/seed.mjs
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` in your browser.

6. **Verify production build**:
   ```bash
   npm run build
   ```

---

## Production Deployment

The project is configured for single-click deployment on Vercel with PostgreSQL:
1. Connect the repository to [Vercel](https://vercel.com).
2. Provision a serverless PostgreSQL instance via [Neon](https://neon.tech) or Vercel Postgres.
3. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: A cryptographically secure secret string.
   - `NEXT_PUBLIC_APP_URL`: Production domain URL.
4. Deploy. Vercel automatically runs `prisma generate` during `npm run build`.

---

## License

This project is licensed under the MIT License. Built for the Life RPG Challenge.
