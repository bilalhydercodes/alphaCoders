import * as THREE from 'three';
import { LumiAnimation, LumiMood, LumiAttentionTarget } from './LumiTypes';
import { SKELETAL_CLIP_NAMES } from './LumiConfig';

export interface ProceduralAnimationState {
  positionOffset: THREE.Vector3;
  rotationOffset: THREE.Euler;
  scaleOffset: THREE.Vector3;
}

export class LumiAnimator {
  private mixer: THREE.AnimationMixer | null = null;
  private actions: Map<string, THREE.AnimationAction> = new Map();
  private currentActionName: string | null = null;
  private hasSkeletalClips: boolean = false;

  // Procedural dynamics
  private animTime: number = 0;
  private hopProgress: number = 0;
  private isHopping: boolean = false;
  private hopHeight: number = 0.28;
  private hopDuration: number = 0.65;
  private hopStartTime: number = 0;
  private hopOnComplete?: () => void;

  // Level Up sequence dynamics
  public isLevelUpPlaying: boolean = false;
  private levelUpStartTime: number = 0;

  constructor(scene?: THREE.Object3D, animations?: THREE.AnimationClip[]) {
    if (scene && animations && animations.length > 0) {
      this.initMixer(scene, animations);
    }
  }

  public initMixer(scene: THREE.Object3D, animations: THREE.AnimationClip[]) {
    this.mixer = new THREE.AnimationMixer(scene);
    this.actions.clear();

    animations.forEach((clip) => {
      const action = this.mixer!.clipAction(clip);
      this.actions.set(clip.name.toLowerCase(), action);
    });

    this.hasSkeletalClips = this.actions.size > 0;
  }

  // Play an animation with cross-fading
  public play(animation: LumiAnimation, crossFadeDuration: number = 0.25) {
    if (!this.hasSkeletalClips || !this.mixer) {
      // Trigger procedural action equivalents
      if (animation === 'jump' || animation === 'cheer') {
        this.triggerHop();
      } else if (animation === 'levelUp') {
        this.triggerLevelUpSequence();
      }
      return;
    }

    const possibleNames = SKELETAL_CLIP_NAMES[animation] || [animation];
    let matchingAction: THREE.AnimationAction | null = null;

    for (const name of possibleNames) {
      const action = this.actions.get(name.toLowerCase());
      if (action) {
        matchingAction = action;
        break;
      }
    }

    if (!matchingAction) {
      // Fallback: if clip not found, fallback to procedural hop/celebration
      if (animation === 'jump' || animation === 'cheer') {
        this.triggerHop();
      } else if (animation === 'levelUp') {
        this.triggerLevelUpSequence();
      }
      return;
    }

    const prevAction = this.currentActionName ? this.actions.get(this.currentActionName) : null;

    if (prevAction && prevAction !== matchingAction) {
      matchingAction.reset().fadeIn(crossFadeDuration).play();
      prevAction.fadeOut(crossFadeDuration);
    } else {
      matchingAction.reset().play();
    }

    this.currentActionName = matchingAction.getClip().name.toLowerCase();
  }

  // Procedural Hop trigger
  public triggerHop(height: number = 0.28, duration: number = 0.65, onComplete?: () => void) {
    this.isHopping = true;
    this.hopHeight = height;
    this.hopDuration = duration;
    this.hopStartTime = this.animTime;
    this.hopOnComplete = onComplete;
  }

  // Procedural Level-up multi-stage choreography
  public triggerLevelUpSequence(onComplete?: () => void) {
    this.isLevelUpPlaying = true;
    this.levelUpStartTime = this.animTime;
    // Launch a series of celebratory jumps
    this.triggerHop(0.38, 0.85, () => {
      this.triggerHop(0.24, 0.6, () => {
        this.isLevelUpPlaying = false;
        if (onComplete) onComplete();
      });
    });
  }

  // Frame update calculating procedural layers
  public update(
    delta: number,
    mood: LumiMood,
    isMoving: boolean,
    isRunning: boolean,
    stepPhase: number,
    attentionTarget: LumiAttentionTarget | null,
    reducedMotion: boolean
  ): ProceduralAnimationState {
    this.animTime += delta;
    const t = this.animTime;

    // Update skeletal mixer if clips are present
    if (this.mixer) {
      this.mixer.update(delta);
    }

    const state: ProceduralAnimationState = {
      positionOffset: new THREE.Vector3(0, 0, 0),
      rotationOffset: new THREE.Euler(0, 0, 0),
      scaleOffset: new THREE.Vector3(1, 1, 1),
    };

    if (reducedMotion) {
      return state;
    }

    // 1. Layer 2: Grounded Breathing (Zero levitation: 0.005–0.008 units)
    const breatheSpeed = mood === 'SLEEPY' || mood === 'SLEEPING' ? 1.2 : mood === 'FOCUSED' ? 1.6 : 2.2;
    const breatheAmp = mood === 'SLEEPY' ? 0.004 : mood === 'FOCUSED' ? 0.005 : 0.008;
    const breatheY = Math.sin(t * breatheSpeed) * breatheAmp;
    state.positionOffset.y += breatheY;

    // Subtle breathing volume expansion
    const breatheScale = 1 + Math.sin(t * breatheSpeed) * 0.012;
    state.scaleOffset.set(breatheScale, 2 - breatheScale, breatheScale);

    // 2. Layer 2: Attention & Gaze Tracking
    if (attentionTarget && attentionTarget.type !== 'none') {
      const targetPos = attentionTarget.position || [0, 0, 1];
      const targetYaw = Math.atan2(targetPos[0], targetPos[2]) * 0.45 * attentionTarget.weight;
      const targetPitch = -targetPos[1] * 0.25 * attentionTarget.weight;

      state.rotationOffset.y += targetYaw;
      state.rotationOffset.x += targetPitch;
    }

    // 3. Layer 2: Mood-Specific Posture Tilts
    if (mood === 'CONCERNED' || mood === 'WILTING') {
      state.rotationOffset.z += Math.sin(t * 1.5) * 0.04 - 0.05;
      state.rotationOffset.x += 0.04;
    } else if (mood === 'SLEEPY' || mood === 'SLEEPING') {
      state.rotationOffset.x += 0.08; // sleepy droop
      state.positionOffset.y -= 0.02;
    } else if (mood === 'FOCUSED') {
      state.rotationOffset.x -= 0.03; // alert determination
    } else if (mood === 'RADIANT') {
      state.positionOffset.y += Math.sin(t * 3.5) * 0.006;
    }

    // 4. Layer 2: Locomotion Step Bobbing
    if (isMoving) {
      const bobFreq = isRunning ? 16 : 10;
      const bobAmp = isRunning ? 0.035 : 0.018;
      const swayAmp = isRunning ? 0.06 : 0.03;

      // Vertical step bounce
      state.positionOffset.y += Math.abs(Math.sin(stepPhase * 2)) * bobAmp;
      // Side-to-side body sway
      state.rotationOffset.z += Math.sin(stepPhase) * swayAmp;
      // Forward tilt when running
      state.rotationOffset.x += isRunning ? 0.09 : 0.03;
    }

    // 5. Layer 2: Procedural Hop & Squash/Stretch
    if (this.isHopping) {
      const elapsed = t - this.hopStartTime;
      const progress = THREE.MathUtils.clamp(elapsed / this.hopDuration, 0, 1);

      if (progress >= 1) {
        this.isHopping = false;
        if (this.hopOnComplete) {
          const cb = this.hopOnComplete;
          this.hopOnComplete = undefined;
          cb();
        }
      } else {
        // Parabolic trajectory: 4 * progress * (1 - progress)
        const arc = 4 * progress * (1 - progress);
        state.positionOffset.y += arc * this.hopHeight;

        // Anticipation squash before launch (first 15%)
        if (progress < 0.15) {
          const sq = progress / 0.15;
          state.scaleOffset.set(1 + (1 - sq) * 0.08, 1 - (1 - sq) * 0.12, 1 + (1 - sq) * 0.08);
        }
        // Apex stretch (middle)
        else if (progress < 0.75) {
          state.scaleOffset.set(0.95, 1.08, 0.95);
        }
        // Landing squash and recovery (last 25%)
        else {
          const rec = (progress - 0.75) / 0.25;
          const squashFactor = Math.sin(rec * Math.PI) * 0.1;
          state.scaleOffset.set(1 + squashFactor, 1 - squashFactor, 1 + squashFactor);
        }
      }
    }

    return state;
  }
}
