'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useLumi } from './LumiContext';

const MODEL_PATH = '/assets/lumi/model-1789210678434.glb';

interface LumiModelProps {
  interactive?: boolean;
}

export const LumiModel: React.FC<LumiModelProps> = ({ interactive = true }) => {
  const {
    mood,
    animation,
    cursorTarget,
    isPetted,
    reducedMotion,
  } = useLumi();

  // Root group references
  const groupRef = useRef<THREE.Group>(null);
  const modelAnchorRef = useRef<THREE.Group>(null);

  // Load the 3D GLB model
  const { scene } = useGLTF(MODEL_PATH);

  // Clone scene so multiple canvas instances can render independently
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Optimize materials and enable soft shadow casting
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.38;
          mat.metalness = 0.05;
          mat.needsUpdate = true;
        }
      }
    });

    return clone;
  }, [scene]);

  // Model bounding box normalization & exact origin centering
  const { targetScale, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Target a consistent height of 1.30 units
    const height = size.y || 0.905;
    const scale = 1.30 / height;

    // Shift model so its geometric center is precisely at (0, 0, 0)
    return {
      targetScale: scale,
      centerOffset: [-center.x, -center.y, -center.z] as [number, number, number],
    };
  }, [clonedScene]);

  // Animation timing state
  const animTime = useRef(0);
  const spinAngle = useRef(0);
  const hopHeight = useRef(0);

  // Frame animation loop: applies subtle grounded breathing, gaze tracking, pet hops, and celebratory spins
  useFrame((state, delta) => {
    if (!groupRef.current || !modelAnchorRef.current) return;

    animTime.current += delta;
    const t = animTime.current;

    // 1. Subtle Grounded Breathing (Zero Levitation: only 0.008 units subtle breath)
    const breatheSpeed = mood === 'SLEEPY' ? 1.2 : mood === 'FOCUSED' ? 1.6 : 2.2;
    const breatheAmp = mood === 'SLEEPY' ? 0.004 : mood === 'FOCUSED' ? 0.006 : 0.008;
    const breatheY = reducedMotion ? 0 : Math.sin(t * breatheSpeed) * breatheAmp;

    // 2. Petting Hop Reaction
    if (isPetted) {
      hopHeight.current = THREE.MathUtils.lerp(hopHeight.current, 0.09, delta * 12);
    } else {
      hopHeight.current = THREE.MathUtils.lerp(hopHeight.current, 0, delta * 8);
    }

    groupRef.current.position.y = breatheY + hopHeight.current;

    // 3. Celebratory Spin Animation (Level Up / Claim / Try-on)
    if (animation === 'cheer' || animation === 'levelUp' || animation === 'tryOn') {
      spinAngle.current += delta * 6.5;
    } else {
      spinAngle.current = THREE.MathUtils.lerp(spinAngle.current, 0, delta * 6);
    }

    // 4. Gaze Tracking (Lumi turns head/body towards mouse pointer)
    // Model original face points toward -Z, so default facing angle is Math.PI (180 deg)
    const baseRotationY = Math.PI;
    const gazeY = !reducedMotion && interactive ? cursorTarget.x * 0.45 : 0;
    const gazeX = !reducedMotion && interactive ? -cursorTarget.y * 0.22 : 0;

    // Mood-specific tilts
    const moodTiltZ =
      mood === 'CONCERNED' || mood === 'WILTING'
        ? Math.sin(t * 1.5) * 0.06 - 0.05
        : mood === 'SLEEPY'
        ? 0.04
        : 0;

    const targetRotY = baseRotationY + gazeY + spinAngle.current;
    const targetRotX = gazeX + (mood === 'SLEEPY' ? 0.08 : 0);
    const targetRotZ = moodTiltZ;

    modelAnchorRef.current.rotation.y = THREE.MathUtils.lerp(
      modelAnchorRef.current.rotation.y,
      targetRotY,
      delta * 8
    );
    modelAnchorRef.current.rotation.x = THREE.MathUtils.lerp(
      modelAnchorRef.current.rotation.x,
      targetRotX,
      delta * 6
    );
    modelAnchorRef.current.rotation.z = THREE.MathUtils.lerp(
      modelAnchorRef.current.rotation.z,
      targetRotZ,
      delta * 6
    );

    // 5. Subtle Squash & Stretch on Hop
    if (isPetted) {
      const squash = 1 + Math.sin(t * 15) * 0.05;
      groupRef.current.scale.set(targetScale * (2 - squash), targetScale * squash, targetScale * (2 - squash));
    } else {
      groupRef.current.scale.set(targetScale, targetScale, targetScale);
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Centered Anchor Group with 180 deg orientation to face user */}
      <group ref={modelAnchorRef} rotation={[0, Math.PI, 0]}>
        <primitive object={clonedScene} position={centerOffset} />
      </group>
    </group>
  );
};

// Preload the 3D model asset for instant hydration
useGLTF.preload(MODEL_PATH);
