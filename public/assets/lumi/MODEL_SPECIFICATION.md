# Lumi 3D Asset Specification & Rigging Standard

## 1. Character Identity & Visual Attributes
- **Name**: Lumi (Chronicles of Mastery Companion)
- **Archetype**: Gentle spirit guide, chibi proportions, rounded body geometry
- **Visual Style**: Matte cel-shaded, stylized, editorial, soft studio lighting
- **Primary Palette**:
  - Body: Ghost White (`#F8F8FF` / `#FFFFFF`)
  - Scarf & Backpack: Amethyst Purple (`#9966CC`, active shade `#7A4BC2`)
  - Sprout / Antenna: Verdant Emerald (`#4FCE6B`) with Gold Star Bud (`#F5B700`)
  - Facial Features: Deep Midnight Plum (`#1F1730` / `#2E2438`)
  - Cheeks: Soft Pastel Pink Blush (`#F3C6E6`)

---

## 2. Geometry & Poly Budget
- **Format**: GLTF 2.0 Binary (`.glb`)
- **Polygon Count**: Max 12,000 triangles (optimal: 4,000–8,000 tris)
- **Topology**: Clean quad-dominant topology, symmetric UV layout with continuous seam placement around inner scarf crease
- **Normal Smoothing**: 35-degree angle smoothing threshold to keep soft organic curves without faceted artifacts

---

## 3. Skeletal Hierarchy & Armature Naming
```
root
 └── spine_base
      ├── hip_left ── leg_left ── foot_left
      ├── hip_right ── leg_right ── foot_right
      ├── spine_mid
      │    ├── backpack_mount
      │    ├── shoulder_left ── arm_left ── hand_left
      │    ├── shoulder_right ── arm_right ── hand_right
      │    └── neck
      │         └── head
      │              ├── eye_target_left
      │              ├── eye_target_right
      │              ├── antenna_base ── antenna_mid ── antenna_tip
      │              └── scarf_knot ── scarf_tail_01 ── scarf_tail_02
```

---

## 4. Morph Targets / Blend Shapes
1. `eye_blink_left`, `eye_blink_right`: Smooth 0-to-1 eyelid descent
2. `mouth_smile`: Gentle upward curve for Content / Welcoming
3. `mouth_joy`: Open laughing expression (`:D`) for LevelUp / Achievement
4. `mouth_sleepy`: Small oval `"o"` mouth
5. `mouth_worry`: Soft wavy curve for Concerned / Streak at Risk
6. `antenna_droop`: 0-to-1 droop for Wilting mood
7. `cheeks_blush_intensity`: Material glow multiplier (0 to 1.5)

---

## 5. Required Animation Clips (60 FPS)
| Clip Name | Duration | Looping | Description |
| :--- | :--- | :--- | :--- |
| `Idle` | 2.5s | Yes | Gentle vertical breathing, soft body bounce, subtle leaf drift |
| `Blink` | 0.25s | No | Quick eyelid blink (triggered every 3–5s by idle scheduler) |
| `LookAround` | 2.0s | No | Head turns left then right curiously |
| `Wave` | 1.8s | No | Friendly raised right arm greeting |
| `Cheer` | 1.5s | No | High hop, arms raised, scarf tails fluttering |
| `LevelUp` | 3.2s | No | Grand celebration: double jump, backflip, raised arms, confetti burst |
| `Sit` | 1.0s | Transition | Sits on floor with feet forward |
| `Focus` | 3.0s | Yes | Seated deep-work posture, steady minimal breathing |
| `Sleep` | 3.0s | Yes | Curled resting pose, drooping antenna, deep breathing |
| `Walk` | 1.0s | Yes | Cute waddling step cycle for spatial transitions |
| `TryOn` | 2.0s | No | Gentle left/right mirror check inspection |

---

## 6. Target Directory
Save production export to:
`public/assets/lumi/Lumi.glb`

The Life RPG engine automatically detects and hot-swaps this file if present. If absent, the engine seamlessly renders the built-in procedural rigged 3D character.
