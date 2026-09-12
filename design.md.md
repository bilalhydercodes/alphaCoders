# Life RPG — Design System

## Color Tokens

| Token | Hex | Role |
|---|---|---|
| `primary` | `#9966CC` | Primary / brand (Amethyst) |
| `on-primary` | `#1F1730` | Text on primary |
| `background` | `#F8F8FF` | Background (Ghost White) |
| `text` | `#2E2438` | Text |
| `text-muted` | `#7A6F8C` | Muted text |
| `accent` | `#F5B700` | Accent (Gold — currency/rewards) |
| `success` | `#4FCE6B` | XP gain / level-up / positive state |
| `danger` | `#E5484D` | Errors, HP loss, destructive actions |

---

## Rationale

Life RPG's design system reflects a productivity tool built to feel like a game, not a chore. The measured tokens center on a deep amethyst primary (`#9966CC`) against a near-white lavender background (`#F8F8FF`) — a pairing that reads as premium and a little mystical rather than corporate, which matters for a habit tracker competing against sterile enterprise-style to-do apps. Purple carries an inherent association with rarity and magic (loot tiers, enchantment, "epic" items), so it does double duty as both a brand color and a thematic cue.

Gold (`#F5B700`) is reserved as the accent — this is deliberate, not incidental. In an RPG economy, gold *means* currency and reward, so using it anywhere else (links, generic highlights) would dilute its meaning. It only appears where the user is meant to think "I earned this."

Typography should run on a single clean sans-serif family at modest sizes (13–15px body, larger for level-up moments), with hierarchy built through weight rather than dramatic size jumps — this keeps stat-heavy screens (multiple XP bars, currency counters, streak numbers) legible without becoming visually loud.

Spacing runs on a 10px base unit, matching the reference system's discipline: predictable, grid-aligned, and easy to keep consistent across a dashboard that will show a lot of simultaneous information (quest list, stat panel, currency, streak).

Motion is fast and consistent (250–300ms), because in a gamified app, feedback timing *is* the reward — a level-up that animates too slowly feels like lag, not celebration.

---

## 1. Visual Theme & Atmosphere

Life RPG should feel like "a well-designed indie game's inventory screen," not a spreadsheet with icons bolted on. The amethyst-on-ghost-white palette signals something a little enchanted and premium — closer to a fantasy loot UI than a habit tracker. Dark, warm-toned text (`#2E2438`) keeps everything readable despite the moodier primary color, so the app still reads as usable and calm, not garish.

The mood to aim for is **"quiet mastery"** — the opposite of Duolingo's loud, chirpy energy. Where Duolingo shouts encouragement, Life RPG should feel like a serious character sheet: your progress is real, tracked, and worth taking seriously, even though the framing is playful. This fits a slightly older, more self-directed user (someone building a gym habit or a reading habit) versus Duolingo's casual daily-nudge audience.

---

## 2. Color System

- **Primary — `#9966CC` (Amethyst):** brand color, primary buttons, active nav states, XP bar fill (or paired with `success` for fill, see below), quest-card borders.
- **On-Primary — `#1F1730`:** near-black-purple text used on top of the primary color, chosen over white because it passes AA contrast comfortably (~5.1:1) while white on amethyst sits closer to ~4.1:1 — fine for bold/large text but risky for anything smaller.
- **Background — `#F8F8FF` (Ghost White):** main canvas. Very low saturation, keeps long dashboard sessions easy on the eyes.
- **Text — `#2E2438`:** default body copy. A warm near-black rather than pure black, softer on the eyes, still exceeds AAA contrast against the background (~12:1+).
- **Text-Muted — `#7A6F8C`:** secondary/hint text, timestamps, disabled states. Sits right at the edge of AA compliance (~4.5:1) against the background — treat this as a floor, not a target: never drop it any lighter, and never use it for anything the user *must* read (error text, primary labels).
- **Accent — `#F5B700` (Gold):** currency counters, reward badges, "new item unlocked" states, streak flame icon. Contrast against the background is too low (~1.7:1) to use as text color directly — always pair gold with dark text on a gold *chip/badge background*, never gold text on white.
- **Success — `#4FCE6B`:** level-up flashes, quest-complete checkmarks, positive stat changes.
- **Danger — `#E5484D`:** validation errors, "quest failed"/streak-broken states, delete confirmations.

This gives you three distinct semantic lanes so color is never ambiguous: **purple = brand/navigation**, **gold = currency/reward**, **green/red = state feedback**. Never let gold and success collide in the same context (e.g., don't use gold for "task complete" — that's what green is for).

---

## 3. Typography

Single sans-serif family throughout (e.g. Inter, Manrope, or a rounded geometric face like Outfit for extra "game UI" personality). One family, multiple weights — no mixing serif/sans.

- **Display** (24–28px, 700 weight): level-up modals, "You reached Level 12" moments, big celebratory numbers.
- **Heading** (16–18px, 600 weight): section titles — "Active Quests," "Character Sheet," "Shop."
- **Body** (14px, 500–600 weight): task text, descriptions. Slightly bolder than a typical body weight (400) to stay legible against the busier UI a stats-heavy dashboard implies.
- **Caption / Muted** (12–13px, 500 weight, `text-muted` color): timestamps, "3 tasks left today," stat sub-labels.

Numbers (XP counts, gold totals, streak days) deserve a tabular/monospaced numeral variant if your font supports it — RPG-style counters look cheap when digits jitter in width as they tick up.

---

## 4. Components & Patterns

- **Primary Buttons (Quest actions, "Level Up," "Claim Reward"):** `primary` background, `on-primary` text, 12px radius, subtle scale-down (0.97) on press for tactile feedback.
- **Quest Cards:** `background` or a very slightly tinted white, 1px border in a low-opacity `primary`, 12px radius, soft shadow. Completed quests animate to a `success`-tinted state before collapsing/archiving.
- **XP Bar:** track in a light tint of `primary` (e.g. `primary` at 15% opacity), fill in solid `primary` or `success`, animated fill on gain (never an instant jump — always tween).
- **Currency Chip:** rounded pill, `accent` background, `on-primary`-style dark text, small coin/gem icon — this is the *only* place gold should carry text directly on it.
- **Stat Badges (Strength/Intellect/etc.):** small rounded tags, distinct icon per attribute, `primary`-tinted background with dark text — icon + label together so color is never the only signal.
- **Streak Indicator:** flame or spark icon, uses `accent` for the icon fill but pairs it with a numeral in `text`, never gold text alone.
- **Disabled / Locked states:** `text-muted` at reduced opacity, plus a lock icon — never rely on the muted color alone to signal "unavailable."

---

## 5. Spacing & Layout

Base unit: **10px**, same disciplined single-scale approach as the reference system — reduces one-off spacing values and keeps the character-sheet-style layout aligned.

- Internal padding (buttons, chips, form fields): 10px or 20px.
- Gaps between related items (quest list rows, stat rows): 10–20px.
- Margins between distinct sections (quest list vs. stat panel vs. shop): 30–40px.
- Breakpoints: mirror mobile-first tiers — ~400px (small phones), ~480px (standard phones), ~768px (tablet/desktop switch to multi-column, e.g. sidebar stat panel + main quest list side by side).

---

## 6. Motion & Interaction

- **Duration:** 250–300ms standard across the system — fast enough to feel game-responsive, not sluggish.
- **Easing:** ease-out for things entering/growing (XP bar fill, modal pop-in), ease-in for things leaving (completed quest sliding away).
- **Signature moments:**
  - *Task complete:* checkbox fills with `success`, brief scale-bounce, quest card fades/collapses.
  - *Level up:* screen-level celebratory modal — number count-up animation, particle burst in `primary`/`accent`, distinct sound-adjacent "beat" via a slightly longer 400–500ms sequence (the one exception to the fast-motion rule, because this moment should feel earned).
  - *Gold earned:* coin icon arcs from the completed task into the currency chip, chip briefly scales up.
- Avoid parallax or scroll-triggered gimmicks — keep motion tied to direct user actions so it reads as feedback, not decoration.

---

## Accessibility

**Contrast checks**

| Pairing | Approx. ratio | WCAG AA (4.5:1 text / 3:1 large) |
|---|---|---|
| `text` (#2E2438) on `background` (#F8F8FF) | ~12.5:1 | ✅ Passes AAA |
| `on-primary` (#1F1730) on `primary` (#9966CC) | ~5.1:1 | ✅ Passes AA |
| White text on `primary` (#9966CC) | ~4.1:1 | ⚠️ OK for large/bold text only — avoid for body-size labels |
| `text-muted` (#7A6F8C) on `background` | ~4.5:1 | ⚠️ Borderline — treat as a floor, never go lighter |
| `accent` (#F5B700) on `background` | ~1.7:1 | ❌ Never use gold as text color on the background directly |

**Minimum requirements**
- **Touch targets:** all buttons, quest checkboxes, and nav items ≥ 44×44px.
- **Focus indicator:** 2px solid outline in `accent` or `primary`, offset 2px from the element — must be visible on every interactive element via keyboard Tab.
- **Color independence:** never signal state (success, failure, locked, streak-broken) through color alone — always pair with an icon or text label.
- **Motion sensitivity:** level-up/particle effects should respect `prefers-reduced-motion` — fall back to a simple fade/scale instead of particle bursts.
- **Text scaling:** layout should tolerate browser zoom to 200% without breaking the quest list or stat panel into overlapping elements.
