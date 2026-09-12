# 🌟 Life RPG with Lumi — Chronicles of Mastery

> *Small steps. Big quests. Level up yourself.*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![SQLite / Postgres](https://img.shields.io/badge/Database-SQLite%20%7C%20Postgres-003B57?style=flat&logo=sqlite)](https://www.sqlite.org/)

**Life RPG with Lumi** is a gamified productivity web application designed to solve the **delayed gratification** problem of traditional habit trackers. By turning real-world tasks (studying, gym, coding, chores) into guild quests with immediate dopamine loops, RPG leveling, character attributes, a virtual economy, and dungeon boss battles, it transforms discipline into an engaging adventure alongside **Lumi**, your supportive companion.

---

## 🎮 Live Demo & Walkthrough Video

- **Live URL**: *(Deployable with 1-click on Vercel / Render)*
- **Demo Walkthrough Video (90–180s)**: See [Video Walkthrough Script](#-90180-second-video-walkthrough-script) below for exact recording timestamps and narration.
- **Instant Demo Account**: On the login screen, click **"Instant Demo Explorer Login"** for 1-click immediate access with pre-seeded quests and gear!

---

## 💜 Creative Direction & The "Lumi" Experience

The application follows the design system laid out in `design.md.md` and `lumi-experience-design.md`:
- **Theme**: *"Quiet Mastery"* — an indie-game adventurer’s codex rather than sterile enterprise SaaS.
- **Palette**: Deep Amethyst (`#9966CC`), Ghost White (`#F8F8FF`), Gold (`#F5B700` strictly reserved for currency/rewards), and Emerald Success (`#4FCE6B`).
- **Lumi Dynamic Companion**:
  - **7 Ambient Mood States**: Content (Default), Radiant (High streak), Sleepy (Inactive 24h+), Concerned (Streak at risk), Wilting (Streak reset), Focused (Pomodoro active), Sleeping (Night mode).
  - **Moment Reactions**: Level-Up fanfare, Quest hop cheer, Gold coin catch, Self-Care heart hug, and Deep Work focus.
- **Tactile Sound Engine**: Procedural **Web Audio API** synthesizer delivering zero-latency 8-bit chimes, coin clinks, and level-up fanfare without external audio files. (Muted by default, toggleable via speaker icon or `M` key).
- **Juice & Motion**: Spring-eased checkmark draw-on (180ms), floating combat reward text (`+50 XP`, `+25 GP`, `-50 DMG`), continuous level-up overflow animation, and full-screen celebration modal with confetti.

---

## 🏰 Core Features Checklist

| System | Implementation Details |
|---|---|
| **User Authentication & Security** | Secure password hashing (`bcryptjs`), JWT httpOnly session cookies, user-scoped data isolation. |
| **Relational Database & True Persistence** | Prisma ORM with SQLite (local) / PostgreSQL (production). Data survives page reloads, browser restarts, and cross-device sessions. |
| **Server-Side Anti-Cheat** | XP, Gold, Streaks, Stat multipliers, and Shop purchases are calculated exclusively on the backend to prevent client-side tampering. |
| **Non-Linear Leveling Engine** | $XP_{\text{needed}}(L) = \lfloor 100 \times L^{1.5} \rfloor$. Progress starts fast for immediate dopamine and scales smoothly. |
| **5 Character Attributes** | Quests train **Intellect** (Coding/Study), **Strength** (Gym/Fitness), **Agility** (Habits/Routines), **Vitality** (Sleep/Diet/Self-care), and **Spirit** (Mindfulness/Creativity). |
| **Daily Streak System** | Consecutive daily quest completions award a scaling streak multiplier: up to **+50% bonus XP and Gold**! |
| **The Guild Emporium (Shop)** | Spend earned Gold on equipment, potions (Elixirs restore HP), companion decor, and stat-boosting relics. |
| **Dungeon Boss Raid** | Every quest completed strikes **The Sloth Behemoth** for damage equal to your Quest XP. Defeating bosses unlocks victory loot! |
| **Focus Mode (Pomodoro)** | 25-minute deep focus timer with Lumi on her purple laptop. Awards Intellect XP and Gold on completion. |
| **Accessibility (a11y)** | 100% keyboard navigable (`Tab`, `Space`, `Enter`, `Q`, `1-4`, `M`, `F`, `Esc`, `?`), 44px+ touch targets, 2px focus outlines, semantic HTML. |

---

## ⌨️ Keyboard Hotkeys

| Hotkey | Action |
|---|---|
| `Q` or `N` | Post a new Bounty (New Quest modal) |
| `1` | Switch to Quests Board tab |
| `2` | Switch to Character Codex & Stats tab |
| `3` | Switch to Guild Emporium (Shop) tab |
| `4` | Switch to Dungeon Raid Boss tab |
| `F` | Open Focus Mode Pomodoro timer |
| `M` | Toggle procedural Web Audio sound FX (Mute / Unmute) |
| `Esc` | Close any active modal or menu |
| `?` | View keyboard shortcuts cheatsheet |

---

## 🛠️ Tech Stack & Architecture

```
├── app/
│   ├── api/
│   │   ├── auth/ (register, login, logout, me)
│   │   ├── quests/ (CRUD, complete with anti-cheat)
│   │   ├── shop/ (items, buy)
│   │   ├── inventory/ (items, equip/use)
│   │   └── boss/ (active raid boss, strike log)
│   ├── globals.css (design tokens, tactile animations)
│   ├── layout.tsx (metadata, viewport, auth provider)
│   └── page.tsx (responsive dashboard & tab router)
├── components/
│   ├── Navbar.tsx (level, XP bar, gold chip, streak)
│   ├── LumiCompanion.tsx (mascot widget with dynamic moods)
│   ├── QuestBoard.tsx (bounties, spring checkmarks, floating text)
│   ├── QuestModal.tsx (create/edit quest modal)
│   ├── CharacterCodex.tsx (paper doll gear, attribute bars)
│   ├── GuildEmporium.tsx (shop & virtual economy)
│   ├── DungeonRaid.tsx (raid boss HP & damage logs)
│   ├── LevelUpModal.tsx (confetti, fanfare, reward reveal)
│   ├── FocusTimerModal.tsx (pomodoro timer with Lumi)
│   └── KeyboardShortcutsModal.tsx (a11y cheat sheet)
├── context/
│   └── AuthContext.tsx (state management & optimistic updates)
├── lib/
│   ├── prisma.ts (database singleton)
│   ├── auth.ts (JWT & bcrypt security)
│   ├── progression.ts (RPG mathematical formulas)
│   └── sound.ts (Web Audio API procedural sound synth)
├── prisma/
│   ├── schema.prisma (relational data models)
│   └── seed.mjs (starter gear, elixirs, and raid bosses)
└── public/lumi/ (high-res Lumi sprites and cropped mood assets)
```

---

## 🚀 Setup & Local Installation

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm** or **pnpm**

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/life-rpg-lumi.git
   cd life-rpg-lumi
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(For local development, SQLite works out of the box with `DATABASE_URL="file:./dev.db"`).*

4. **Initialize Database & Seed Data**:
   ```bash
   npx prisma db push
   node prisma/seed.mjs
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Verify Production Build**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Production

### Deploying to Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Import the project into [Vercel](https://vercel.com).
3. Connect a PostgreSQL database (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), or Vercel Postgres).
4. In `prisma/schema.prisma`, update the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
5. Set the `DATABASE_URL` and `JWT_SECRET` environment variables in Vercel settings.
6. Deploy! Vercel automatically runs `npm run build` which invokes `prisma generate`.

---

## 📹 90–180 Second Video Walkthrough Script

For the official submission video recording (under 100MB, 90–180 seconds):

| Timestamp | Action | Narration / Key Point |
|---|---|---|
| **0:00 - 0:25** | **Hero & Sign Up / Login** | Introduce *Life RPG with Lumi*. Show the 1-click Demo login or create account `hero@guild.com`. Explain how the app turns real-world delay into instant game feedback. |
| **0:25 - 0:50** | **Quest Board & Tactile Micro-Interactions** | Navigate the Quest Board. Check off a task ("25-Minute Deep Focus"). Highlight the 180ms spring checkmark, floating `+50 XP / +25 GP` combat text, audio chime, and Lumi’s cheer reaction. |
| **0:50 - 1:15** | **Leveling Up Celebration** | Check off another high-XP quest to cross the level threshold. Showcase the full-screen **Level Up modal**, Lumi's jumping celebration pose, confetti explosion, brass fanfare, and stat point increase. |
| **1:15 - 1:35** | **Hard Refresh & True Persistence Proof** | Press `Ctrl + F5` (hard refresh). Show that level, XP, Gold, streak, and completed status remain **100% persisted** from the backend database (not temporary localStorage). |
| **1:35 - 1:55** | **Emporium Shop & Character Codex** | Switch to the Guild Emporium (`3` key). Buy the "Amethyst Silk Scarf" with Gold. Switch to Codex (`2` key) to show character attributes (INT, STR, AGI, VIT, SPI) and equip the item. |
| **1:55 - 2:15** | **Dungeon Raid Boss & Focus Mode** | Switch to Raid Boss (`4` key). Show *The Sloth Behemoth* taking damage from completed quests. Press `F` to demonstrate the 25-minute Pomodoro timer featuring Lumi on her purple laptop. |

---

## 📜 License
MIT License. Built for the Life RPG Challenge. Powered by Next.js, Prisma, and Lumi the Companion.
