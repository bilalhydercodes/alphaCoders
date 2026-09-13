---
concept: lumi-companion
title: Lumi — Autonomous 3D Mascot & Behavioral State Engine
summary: Lumi is an autonomous 3D companion mascot in Life RPG who reacts in real time to user productivity, navigating UI zones via DOM-to-WebGL projection and providing affective feedback.
domain: agentic-mascot
last_updated: 2026-09-13
related_concepts:
  - focus-sanctuary-adhd.md
  - progression-engine.md
extraction_keywords:
  - who is lumi
  - 3d companion mascot
  - life rpg companion
  - three js companion
  - duolingo owl alternative
---

# Lumi — The Autonomous 3D Companion Mascot

## 1. Executive Definition

**Lumi** is the autonomous 3D guide and emotional companion residing inside Life RPG. Unlike static 2D stickers or decorative vector illustrations found in traditional habit trackers, Lumi is rendered via WebGL using Three.js and `@react-three/fiber`, driven by an autonomous state machine that continuously monitors user interaction, task progression, and focus intervals.

Lumi serves as the affective anchor of the platform, transforming isolated to-do completion into a cooperative adventure.

## 2. Behavioral State Machine

Lumi operates on a probabilistic behavior loop that mimics natural living presence rather than repetitive looping animations:

- **70% Calm Resting (Ambient Baseline)**: Gentle breathing cycles, subtle blinking, soft ear twitches, and ambient curiosity while the user works uninterrupted.
- **20% Subtle In-Place Movements**: Stretching, shifting posture, looking around the application interface, checking her purple laptop.
- **10% Contextual Reactive Actions**: Triggered by user actions such as hovering over urgent bounties, checking off quests, or letting focus timers wind down.

### Ambient Mood States

Lumi dynamically transitions across 7 core mood states governed by database user metrics:

| Mood State | Trigger Condition | Visual Manifestation | Audio Cue |
|---|---|---|---|
| **Content (Default)** | Standard active session; streak active | Gentle smiling idle breathing | Ambient chime |
| **Radiant** | Streak >= 7 days or Level Up achieved | Golden sparkles, enthusiastic hovering | Victory brass fanfare |
| **Sleepy** | User inactive for 24+ hours | Drooping posture, slow blink rate | Soft low chord |
| **Concerned** | Streak expiration imminent (<4 hours left in day) | Leaning forward, inquisitive ears | Alert arpeggio |
| **Wilting** | Streak broken / reset | Dejected sitting pose, muted color tone | Melancholic descending tone |
| **Focused** | Deep Focus Pomodoro mode active | Sits with purple adventurer's laptop, typing | Ambient white-noise drone |
| **Sleeping** | Night hours (11:00 PM – 6:00 AM local time) | Curled up asleep with floating Zzz runes | Gentle lullaby tone |

## 3. DOM-to-WebGL Projection & Spatial Navigation

Lumi is not confined to a static rectangular sidebar card. Using a custom DOM-to-WebGL coordinate projection system:

1. Target UI elements (such as the Quest Map, Focus Timer, or Level Up modal) declare spatial zones (`data-lumi-zone`).
2. When the user switches tabs or triggers events, Lumi computes the screen-space bounding rect of the target DOM zone.
3. Lumi interpolates her 3D world position across three-dimensional Bezier curves to "fly" or "walk" directly to the active interface element.
4. When leveling up, Lumi takes center stage in a full-screen celebration modal with synchronized confetti particle physics.

## 4. Psychological Role in Habit Adherence

In cognitive behavioral psychology, accountability partners dramatically increase commitment to repetitive tasks. However, human accountability partners often induce shame, performance anxiety, or inconsistent availability. 

Lumi functions as a **non-judgmental parasocial accountability companion**:
- Never punishes or lectures the user for missed days.
- Celebrates micro-wins immediately with high-valence visual feedback.
- Protects streak recovery with encouraging dialogue rather than penalties.
