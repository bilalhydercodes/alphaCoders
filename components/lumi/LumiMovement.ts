import * as THREE from 'three';
import { LumiZone } from './LumiTypes';
import { LUMI_ZONES } from './LumiConfig';

export interface MovementTarget {
  position: [number, number, number];
  zone: LumiZone;
  speed: number; // units per sec
  isRunning: boolean;
  onArrival?: () => void;
}

export class LumiMovementController {
  public currentPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public targetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public currentRotationY: number = Math.PI; // Face user by default (180 deg)
  public targetRotationY: number = Math.PI;
  public isMoving: boolean = false;
  public isRunning: boolean = false;
  public currentZone: LumiZone = 'HOME_ZONE';
  private onArrivalCallback: (() => void) | null = null;
  private walkSpeed: number = 0.85; // 3D units / sec
  private runSpeed: number = 1.6;

  constructor(initialZone: LumiZone = 'HOME_ZONE') {
    this.currentZone = initialZone;
    const pref = LUMI_ZONES[initialZone].preferredSpot;
    this.currentPosition.set(pref[0], pref[1], pref[2]);
    this.targetPosition.copy(this.currentPosition);
  }

  // Set new movement destination
  public moveTo(
    target: [number, number, number],
    zone: LumiZone,
    run: boolean = false,
    onArrival?: () => void
  ) {
    this.currentZone = zone;
    this.isRunning = run;
    this.onArrivalCallback = onArrival || null;

    // Constrain target within active zone bounds
    const bounds = LUMI_ZONES[zone];
    const clampedX = THREE.MathUtils.clamp(target[0], bounds.allowedMin[0], bounds.allowedMax[0]);
    const clampedZ = THREE.MathUtils.clamp(target[2], bounds.allowedMin[1], bounds.allowedMax[1]);

    this.targetPosition.set(clampedX, target[1] ?? 0, clampedZ);

    const deltaX = this.targetPosition.x - this.currentPosition.x;
    const deltaZ = this.targetPosition.z - this.currentPosition.z;
    const distance = Math.hypot(deltaX, deltaZ);

    if (distance > 0.04) {
      this.isMoving = true;
      // Calculate target yaw (rotation Y) facing destination
      this.targetRotationY = Math.atan2(deltaX, deltaZ) + Math.PI;
    } else {
      this.isMoving = false;
      this.currentPosition.copy(this.targetPosition);
      if (this.onArrivalCallback) {
        this.onArrivalCallback();
        this.onArrivalCallback = null;
      }
    }
  }

  // Return to preferred resting spot in current zone
  public returnHome(onArrival?: () => void) {
    const pref = LUMI_ZONES[this.currentZone].preferredSpot;
    this.moveTo(pref, this.currentZone, false, onArrival);
  }

  // Frame update
  public update(delta: number): {
    position: [number, number, number];
    rotationY: number;
    isMoving: boolean;
    isRunning: boolean;
    stepPhase: number;
  } {
    if (!this.isMoving) {
      // Smoothly rotate back towards default facing user (Math.PI) when idle
      this.currentRotationY = THREE.MathUtils.lerp(
        this.currentRotationY,
        this.targetRotationY,
        delta * 5
      );
      return {
        position: [this.currentPosition.x, this.currentPosition.y, this.currentPosition.z],
        rotationY: this.currentRotationY,
        isMoving: false,
        isRunning: false,
        stepPhase: 0,
      };
    }

    const deltaX = this.targetPosition.x - this.currentPosition.x;
    const deltaZ = this.targetPosition.z - this.currentPosition.z;
    const distance = Math.hypot(deltaX, deltaZ);

    // Turn towards target direction first
    this.currentRotationY = THREE.MathUtils.lerp(
      this.currentRotationY,
      this.targetRotationY,
      delta * 9
    );

    if (distance <= 0.03) {
      // Arrived at destination
      this.currentPosition.copy(this.targetPosition);
      this.isMoving = false;
      this.targetRotationY = Math.PI; // Face user on arrival
      if (this.onArrivalCallback) {
        const cb = this.onArrivalCallback;
        this.onArrivalCallback = null;
        cb();
      }
    } else {
      // Move towards destination with easing near arrival
      const speed = this.isRunning ? this.runSpeed : this.walkSpeed;
      const ease = THREE.MathUtils.clamp(distance * 3.5, 0.25, 1.0);
      const step = speed * ease * delta;

      const moveX = (deltaX / distance) * Math.min(step, distance);
      const moveZ = (deltaZ / distance) * Math.min(step, distance);

      this.currentPosition.x += moveX;
      this.currentPosition.z += moveZ;
    }

    // Step phase cycle for procedural walk/run bobbing
    const stepPhase = this.isMoving
      ? (Date.now() / (this.isRunning ? 180 : 260)) % (Math.PI * 2)
      : 0;

    return {
      position: [this.currentPosition.x, this.currentPosition.y, this.currentPosition.z],
      rotationY: this.currentRotationY,
      isMoving: this.isMoving,
      isRunning: this.isRunning,
      stepPhase,
    };
  }

  // Convert a 2D DOM element bounding client rect into normalized Three.js coordinates
  public static projectDomToWorld(
    domRect: DOMRect,
    containerRect: DOMRect
  ): [number, number, number] {
    const relX = (domRect.left + domRect.width / 2 - containerRect.left) / containerRect.width;
    const relY = (domRect.top + domRect.height / 2 - containerRect.top) / containerRect.height;

    // Map [0, 1] relative screen coordinates to localized zone space [-0.4, 0.4]
    const x = THREE.MathUtils.lerp(-0.35, 0.35, THREE.MathUtils.clamp(relX, 0, 1));
    const z = THREE.MathUtils.lerp(-0.25, 0.25, THREE.MathUtils.clamp(relY, 0, 1));

    return [x, 0, z];
  }
}
