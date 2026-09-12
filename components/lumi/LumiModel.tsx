'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useLumi } from './LumiContext';
import { LumiAttentionTarget } from './LumiTypes';

const MODEL_PATH = '/assets/lumi/model-1789210678434.glb';

interface LumiModelProps {
  interactive?: boolean;
}

export const LumiModel: React.FC<LumiModelProps> = ({ interactive = true }) => {
  const {
    mood,
    animation,
    cursorTarget,
    attentionTarget,
    isPetted,
    reducedMotion,
    movementController,
    animator,
  } = useLumi();

  // Root group references
  const groupRef = useRef<THREE.Group>(null);
  const modelAnchorRef = useRef<THREE.Group>(null);

  // Load the 3D GLB model and any skeletal animations
  const { scene, animations } = useGLTF(MODEL_PATH);

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

  // Initialize skeletal mixer if rigged clips are present (Layer 1)
  useEffect(() => {
    if (animations && animations.length > 0 && clonedScene) {
      animator.initMixer(clonedScene, animations);
      animator.play(animation);
    }
  }, [clonedScene, animations, animator, animation]);

  // Frame animation loop: coordinates movement controller and layered procedural animator
  useFrame((_, delta) => {
    if (!groupRef.current || !modelAnchorRef.current) return;

    // 1. Update Locomotion / Spatial Movement
    const moveState = movementController.update(delta);

    // 2. Resolve Attention Target (Cursor vs Explicit Focus Anchor)
    let activeAttention: LumiAttentionTarget | null = attentionTarget;
    if (!activeAttention && interactive && !reducedMotion) {
      activeAttention = {
        type: 'cursor',
        position: [cursorTarget.x, cursorTarget.y, 1],
        weight: 0.8,
      };
    }

    // 3. Update Procedural Dynamics (Layer 2 & Layer 3)
    const animState = animator.update(
      delta,
      mood,
      moveState.isMoving,
      moveState.isRunning,
      moveState.stepPhase,
      activeAttention,
      reducedMotion
    );

    // 4. Apply Spatial Positions (X & Z from movement, Y from breathing/hop/step)
    groupRef.current.position.x = moveState.position[0] + animState.positionOffset.x;
    groupRef.current.position.y = animState.positionOffset.y;
    groupRef.current.position.z = moveState.position[2] + animState.positionOffset.z;

    // 5. Apply Orientations (Facing user base Math.PI + turn heading + attention gaze + posture tilt)
    modelAnchorRef.current.rotation.y = moveState.rotationY + animState.rotationOffset.y;
    modelAnchorRef.current.rotation.x = animState.rotationOffset.x;
    modelAnchorRef.current.rotation.z = animState.rotationOffset.z;

    // 6. Apply Squash & Stretch Scaling
    groupRef.current.scale.set(
      targetScale * animState.scaleOffset.x,
      targetScale * animState.scaleOffset.y,
      targetScale * animState.scaleOffset.z
    );
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
