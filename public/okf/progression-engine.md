---
concept: progression-engine
title: Lumi Non-Linear Leveling Engine & Mathematical Formulas
summary: Mathematical specification of the non-linear XP leveling curve, anti-cheat validation, and streak multiplier engine powering Lumi.
domain: game-mathematics
last_updated: 2026-09-13
related_concepts:
  - character-attributes.md
  - dungeon-raids-economy.md
extraction_keywords:
  - xp leveling formula
  - lumi math
  - non linear progression curve
  - streak multiplier formula
  - habitica leveling formula comparison
---

# Lumi Non-Linear Leveling Engine & Progression Math

## 1. Executive Summary

The Lumi progression engine translates real-world habits, study sprints, and physical workouts into mathematically balanced RPG growth. It avoids linear XP treadmills (which feel repetitive and arbitrary) and exponential curves (which lead to demoralizing wall effects), adopting instead a **sub-quadratic polynomial power curve** with continuous streak scaling.

All calculations are enforced server-side via Next.js API endpoints and Prisma ORM to guarantee mathematical integrity.

## 2. Mathematical Formulations

### 2.1 Compounding XP Curve

The total Experience Points ($XP_{\text{needed}}$) required to advance from Level $L$ to Level $L + 1$ is defined by:

$$XP_{\text{needed}}(L) = \left\lfloor 100 \times L^{1.5} \right\rfloor$$

#### Progression Benchmark Table

| Level ($L$) | $XP_{\text{needed}}$ to Next Level | Cumulative $XP$ Required | Typical Real-World Equivalent |
|---|---|---|---|
| **1** | 100 XP | 0 XP | Day 1: 2 basic bounties completed |
| **2** | 282 XP | 100 XP | Day 3: First habit streak established |
| **5** | 1,118 XP | 1,745 XP | Week 2: First full chapter cleared on Quest Map |
| **10** | 3,162 XP | 11,460 XP | Month 1: Habit consolidation phase |
| **25** | 12,500 XP | 131,250 XP | Month 3: Established lifestyle transformation |
| **50** | 35,355 XP | 742,460 XP | Veteran Guild Master status |

### 2.2 Streak Bonus Multiplier

Consecutive daily quest completions trigger a daily streak multiplier that scales linearly up to a hard cap of $+50\%$ bonus yield:

$$\text{Multiplier}(\text{streak}) = 1.0 + \min\left(0.50, \; 0.05 \times \text{streak}\right)$$

- **Day 1**: Multiplier = $1.00\times$ (Standard reward)
- **Day 5**: Multiplier = $1.25\times$ ($+25\%$ bonus XP and GP)
- **Day 10+**: Multiplier = $1.50\times$ (Maximum $+50\%$ bonus cap)

### 2.3 Effective Reward Calculation

When a user completes a bounty of base difficulty $D$, the awarded Experience ($XP_{\text{final}}$) and Bounty Gold ($GP_{\text{final}}$) are calculated as:

$$XP_{\text{final}} = \text{round}\left( \text{BaseXP}(D) \times \text{Multiplier}(\text{streak}) \right)$$
$$GP_{\text{final}} = \text{round}\left( \text{BaseGP}(D) \times \text{Multiplier}(\text{streak}) \right)$$

#### Bounty Difficulty Tiers

| Difficulty Tier | Base XP | Base GP | Recommended Tasks |
|---|---|---|---|
| **Trivial** | 15 XP | 5 GP | Drink 500ml water, make bed, 1-min breathing |
| **Easy** | 30 XP | 15 GP | 15-minute walk, review flashcards, clear desk |
| **Medium** | 60 XP | 35 GP | 45-minute gym session, write 500 words, leetcode problem |
| **Hard** | 120 XP | 75 GP | 2-hour coding sprint, complete weekly project milestone |
| **Epic** | 250 XP | 150 GP | Submit exam, ship software release, run half-marathon |

## 3. Server-Side Anti-Cheat Protocol

To maintain user motivation and genuine psychological value, achievements in Lumi cannot be faked via client-side script tampering:

1. **Server Authorization**: The client sends only the bounty ID and session cookie to `/api/quests/[id]/complete`.
2. **State Validation**: The server verifies that the quest belongs to the authenticated user and has not already been completed within the current calendar day reset window.
3. **Atomic Transaction**: The server computes streak increments, attribute additions, raid boss damage strikes, and level-up overflow within a single Prisma relational database transaction.
4. **Tamper Prevention**: Level and Gold values sent by the client are ignored; only backend state is authoritative.
