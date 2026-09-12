# Lumi & Micro-Interaction Design Guide

## Part 1 — Lumi Expression & Pose Library

Think of these in two buckets: **Mood states** (Lumi's face/posture reflects the user's *current standing* — streak, energy, time of day) and **Moment states** (one-off reactions to a specific event). Mood states are what make Lumi feel alive between actions; Moment states are the celebratory payoff.

### A. Mood states (ambient — Lumi's default look changes with the user's status)
| State | When it shows | Visual direction |
|---|---|---|
| **Radiant** | Long active streak, high level | Sparkle particles idle-loop around her, brighter cheeks, subtle bounce-in-place |
| **Content (default)** | Normal day, no issues | The base smiling pose you already have |
| **Sleepy** | User hasn't opened the app in 24h+ | Half-closed eyes, small "Z" floating, slower idle sway |
| **Concerned** | Streak about to break (last few hours of the day) | Slightly furrowed brow, glancing at a clock/hourglass — never scolding, just alert |
| **Wilting** | Streak just broke | Droopy leaf-antenna, small frown — paired with a *supportive* caption ("Let's start a new one!"), never a guilt message |
| **Focused** | An active timer/quest is running | Eyes narrowed, tiny determination sweat-drop, arms in a "ready" pose |
| **Sleeping / Night mode** | After a set hour, or dark mode enabled | Eyes fully closed, holding a tiny star, curled posture |

### B. Moment states (triggered reactions)
| State | Trigger | Notes |
|---|---|---|
| **Level Up!** (have) | Level threshold crossed | Biggest, loudest pose — arms up, sparkle burst |
| **Achievement** (have) | Milestone badge earned | |
| **Explore** (have) | Opening a new feature/section for the first time | |
| **Self Care** (have) | Wellness-category quest completed | |
| **You Got This!** (have) | Encouragement moment, e.g. reopening an overdue quest | |
| **Focus** (have) | Timer/focus-mode active | |
| **Welcome wave** | First-ever onboarding screen | Simple wave + speech bubble intro |
| **Curious / empty state** | No quests created yet | Looking around, hand shading eyes — invites the user to add their first quest |
| **Thinking / loading** | Any async wait | Tiny hourglass or spinning gear held in hand, replaces a generic spinner |
| **Confused / 404 or error** | Broken route, failed request | Tilted head, question mark — keeps errors from feeling cold |
| **Streak milestone (7/30/100 day)** | Streak thresholds | Escalating: candle → torch → bonfire held alongside her, cosmetic tier-up |
| **Shop / try-on** | Browsing or equipping cosmetics | Holding up a mirror or wearing the item being previewed |
| **Coin catch** | Currency earned | Small hop, catching a coin mid-air |
| **Rest day** | Weekend / user-declared rest day | Lounging, hammock or lying against her backpack — reframes rest as valid, not "falling behind" |
| **Cheering (idle nav)** | Sits quietly in a corner of the dashboard | Occasional idle animation (blink, ear-leaf twitch) every 15–20s so she reads as alive, not a static PNG |

**Production tip:** ship the six Moment states you already have first (they cover 80% of real usage), then build Mood states next since those are cheap (just face-swaps on the same body) and are what make the app feel reactive rather than static.

---

## Part 2 — Micro-Interaction & Gamification Catalog

Organized by the moment it fires, with the actual mechanism — not just "make it feel good."

### Task / Quest completion
- Checkbox fills with a spring-eased checkmark draw-on (150–200ms), not an instant swap.
- Row background flashes a soft `success` tint, then the row collapses/archives after ~400ms delay (gives the eye time to register the win before it disappears).
- Lumi (sitting idle in a corner) plays a quick cheer-hop, out of the user's direct focus point so it doesn't interrupt, just reinforces.

### XP gain
- A `+15 XP` chip spawns at the completed task and arcs (curved path, not a straight line) into the XP bar.
- XP bar fills with a spring easing (slight overshoot then settle) rather than linear — this single detail is what separates "game juice" from "progress bar."
- If XP gain crosses a level boundary mid-animation, the bar visibly "overflows," resets, and continues filling the next level's bar in one continuous motion — never a hard cut.

### Level up
- Full-screen (or modal) takeover — this is the one moment allowed to interrupt the user.
- Sequence: brief freeze → light flash/particle burst → Lumi's biggest pose → level number count-up (not just appears) → optional new cosmetic-unlock reveal.
- Slightly longer duration than everything else (400–600ms) — this is the payoff moment, it's allowed to breathe.

### Streaks
- Flame/spark icon has a subtle idle pulse (breathing scale, 2s loop) so it reads as "alive," not static.
- Crossing a streak milestone triggers its own small celebration distinct from level-up (different animation so the two never feel interchangeable).
- Streak-at-risk state (see Mood: Concerned) is a *nudge*, never a red countdown timer that induces anxiety — keep the framing supportive.

### Currency / shop
- Coin icon arcs from the completed source into the wallet chip, wallet does a small bounce-scale on receipt.
- Shop items reveal on hover/tap with a card-flip or gentle tilt (3D transform), not just a static grid.
- Equipping an item triggers Lumi's try-on pose before committing.

### Navigation & general feel
- Buttons: 0.97 scale-down on press, spring back on release — makes every tap feel tactile even with no sound.
- Cards: subtle lift (translateY + shadow increase) on hover, signals interactivity without relying on color alone.
- Page/section transitions: staggered fade-up for lists (each item 30–50ms after the previous) rather than everything appearing at once — cheap to build, reads as expensive.
- Empty states are illustrated (Lumi + a short line), never a bare "No items" — this is one of the highest-leverage places to make the app feel crafted rather than templated.

### Reward pacing (keep this healthy)
- Vary the *size* of rewards (small/medium/big XP or gold) rather than the *guarantee* of them — surprise-and-delight, not withheld progress. Never make the user feel punished for missing a day beyond the honest "streak reset" — no shame copy, no aggressive re-engagement notifications. This keeps the loop feeling like encouragement rather than manipulation, which also happens to be what actually keeps people coming back long-term.

---

## Part 3 — Making It Feel Crafted, Not Templated

Concrete things that separate a "wow" site from a default component library look:

1. **Break the perfect rectangle.** Use a couple of hand-drawn/wobbly SVG borders or blob shapes for hero sections or badges — echoes the illustrated mascot style instead of clashing with it (sharp Tailwind cards next to a soft rounded mascot looks mismatched).
2. **Custom cursor states** on interactive elements (a small Lumi-leaf icon replacing the pointer over buttons) — cheap, memorable, easy to overuse so reserve it for a few key zones.
3. **Grain/texture overlay** at very low opacity across the background — kills the "flat gradient SaaS template" look in about five minutes of work.
4. **A real loading screen**, not a spinner — Lumi's "thinking" pose with a short rotating tip/quote. Turns dead time into personality.
5. **Custom icon set matching Lumi's line weight and corner radius** — mixing Heroicons/Lucide defaults with a hand-illustrated mascot is one of the fastest ways to look AI-generated/generic. Even 10–15 custom icons for your most-used actions (quest, streak, gold, level) go a long way.
6. **Micro-copy has a voice.** Instead of generic toasts ("Task completed"), write them as things Lumi would say ("Nice — quest logged!"). Keep a short shared voice doc so copy stays consistent across the whole app.
7. **Unlockable dark mode / themes as rewards**, not a settings toggle everyone gets on day one — turns a utility feature into part of the progression system itself.
8. **Sound as an optional layer.** A handful of very short (under 200ms) UI chimes for task-complete, level-up, and coin-earn, togglable and off by default — respects users who don't want audio while giving those who do an extra dopamine channel.
9. **Restraint on parallax/motion.** Use scroll depth or parallax only in the hero — sprinkling it everywhere reads as a template effect rather than a deliberate choice.
