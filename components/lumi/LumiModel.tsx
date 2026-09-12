'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useLumi } from './LumiContext';

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

  // Root group reference
  const groupRef = useRef<THREE.Group>(null);

  // Articulated bone / body part references for procedural animation
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftFootRef = useRef<THREE.Group>(null);
  const rightFootRef = useRef<THREE.Group>(null);
  const scarfTailRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Group>(null);
  const cheeksRef = useRef<THREE.Group>(null);

  // Track if a custom external GLB is available in public/assets/lumi/Lumi.glb
  const [useExternalGlb, setUseExternalGlb] = useState(false);

  // Materials matching Lumi's exact visual system
  const materials = useMemo(() => {
    return {
      body: new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.35,
        metalness: 0.05,
      }),
      amethyst: new THREE.MeshStandardMaterial({
        color: '#9966CC',
        roughness: 0.4,
        metalness: 0.1,
      }),
      amethystDark: new THREE.MeshStandardMaterial({
        color: '#7A4BC2',
        roughness: 0.45,
      }),
      sprout: new THREE.MeshStandardMaterial({
        color: '#4FCE6B',
        roughness: 0.3,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: '#F5B700',
        roughness: 0.25,
        metalness: 0.3,
      }),
      eyes: new THREE.MeshBasicMaterial({
        color: '#2E2438',
      }),
      catchlight: new THREE.MeshBasicMaterial({
        color: '#FFFFFF',
      }),
      blush: new THREE.MeshStandardMaterial({
        color: '#F3C6E6',
        roughness: 0.5,
        transparent: true,
        opacity: 0.85,
      }),
      mouth: new THREE.MeshBasicMaterial({
        color: '#2E2438',
      }),
    };
  }, []);

  // Animation procedural clock
  const animTime = useRef(0);
  const blinkProgress = useRef(0);
  const isBlinking = useRef(false);
  const lastBlinkTime = useRef(0);

  // Frame animation loop with zero-allocation math
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    animTime.current += delta;
    const t = animTime.current;

    // 1. Idle Blinking Logic (every 3.5 - 5s)
    if (!reducedMotion && t - lastBlinkTime.current > 4.2) {
      isBlinking.current = true;
      lastBlinkTime.current = t;
    }
    if (isBlinking.current) {
      blinkProgress.current += delta * 12;
      if (blinkProgress.current >= Math.PI) {
        blinkProgress.current = 0;
        isBlinking.current = false;
      }
    }
    const eyeScaleY = isBlinking.current ? Math.max(0.08, Math.cos(blinkProgress.current)) : 1;
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = eyeScaleY;
      rightEyeRef.current.scale.y = eyeScaleY;
    }

    // 2. Subtle Gaze Tracking toward cursor
    if (headRef.current && interactive && !reducedMotion) {
      const targetRotX = THREE.MathUtils.clamp(cursorTarget.y * 0.25, -0.3, 0.3);
      const targetRotY = THREE.MathUtils.clamp(cursorTarget.x * 0.35, -0.45, 0.45);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, delta * 4);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, delta * 4);
    }

    // 3. Pose & Animation State Machine
    if (bodyRef.current) {
      // Pet reaction bounce
      if (isPetted) {
        bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, 0.35, delta * 15);
        bodyRef.current.scale.set(1.15, 0.9, 1.15);
      } else {
        bodyRef.current.scale.set(1, 1, 1);
      }

      // Animation modes
      switch (animation) {
        case 'cheer':
        case 'levelUp': {
          const hop = Math.abs(Math.sin(t * 6)) * 0.45;
          bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, hop, delta * 10);

          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 2.3, delta * 10);
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -2.3, delta * 10);
          }
          if (antennaRef.current) {
            antennaRef.current.rotation.z = Math.sin(t * 12) * 0.25;
          }
          break;
        }

        case 'walk': {
          const waddle = Math.sin(t * 8) * 0.08;
          bodyRef.current.rotation.z = waddle;
          bodyRef.current.position.y = Math.abs(Math.sin(t * 8)) * 0.08;

          if (leftFootRef.current && rightFootRef.current) {
            leftFootRef.current.position.z = Math.sin(t * 8) * 0.12;
            rightFootRef.current.position.z = -Math.sin(t * 8) * 0.12;
          }
          break;
        }

        case 'wave': {
          bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, 0.05, delta * 4);
          if (rightArmRef.current) {
            rightArmRef.current.rotation.z = -1.8 + Math.sin(t * 10) * 0.4;
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.2, delta * 4);
          }
          break;
        }

        case 'thinking': {
          if (headRef.current) {
            headRef.current.rotation.z = 0.25 + Math.sin(t * 2) * 0.05;
          }
          if (rightArmRef.current) {
            rightArmRef.current.rotation.z = -1.4;
            rightArmRef.current.rotation.x = 0.8;
          }
          break;
        }

        case 'sit':
        case 'focus': {
          bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, -0.2, delta * 5);
          if (leftFootRef.current && rightFootRef.current) {
            leftFootRef.current.position.y = 0.08;
            rightFootRef.current.position.y = 0.08;
          }
          // Steady calm breathing
          const calmBreathe = Math.sin(t * 1.5) * 0.03;
          bodyRef.current.scale.y = 1 + calmBreathe;
          break;
        }

        case 'sleep': {
          bodyRef.current.position.y = -0.25;
          bodyRef.current.rotation.z = 0.35;
          if (antennaRef.current) {
            antennaRef.current.rotation.z = 0.6;
          }
          break;
        }

        case 'idle':
        default: {
          // Natural vertical breathing cycle
          const breatheSpeed = mood === 'RADIANT' ? 3.5 : mood === 'SLEEPY' ? 1.2 : 2.2;
          const breatheAmp = mood === 'RADIANT' ? 0.04 : 0.025;
          const breathe = Math.sin(t * breatheSpeed) * breatheAmp;

          bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, breathe, delta * 6);
          bodyRef.current.scale.y = 1 + breathe * 0.5;

          // Gentle antenna twitch
          if (antennaRef.current) {
            antennaRef.current.rotation.z = Math.sin(t * 2.5) * 0.08;
            antennaRef.current.rotation.x = Math.cos(t * 2.0) * 0.06;
          }

          // Relax arms
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.3, delta * 5);
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.3, delta * 5);
          }

          // Inertia scarf sway
          if (scarfTailRef.current) {
            scarfTailRef.current.rotation.x = Math.sin(t * 2.5) * 0.12;
          }
          break;
        }
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Articulated Body Hierarchy */}
      <group ref={bodyRef} position={[0, 0, 0]}>
        {/* Main Chibi Spirit Torso (Ghost White soft capsule) */}
        <mesh position={[0, 0.75, 0]} material={materials.body} castShadow receiveShadow>
          <sphereGeometry args={[0.65, 32, 32]} />
        </mesh>

        {/* Lower body base */}
        <mesh position={[0, 0.5, 0]} material={materials.body} castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.58, 0.4, 32]} />
        </mesh>

        {/* Head and Face Group */}
        <group ref={headRef} position={[0, 0.85, 0]}>
          {/* Eyes (Dark plum stylized beads) */}
          <group ref={leftEyeRef} position={[-0.24, 0.06, 0.58]}>
            <mesh material={materials.eyes}>
              <sphereGeometry args={[0.085, 16, 16]} />
            </mesh>
            {/* Catchlight */}
            <mesh position={[0.025, 0.025, 0.07]} material={materials.catchlight}>
              <sphereGeometry args={[0.025, 8, 8]} />
            </mesh>
          </group>

          <group ref={rightEyeRef} position={[0.24, 0.06, 0.58]}>
            <mesh material={materials.eyes}>
              <sphereGeometry args={[0.085, 16, 16]} />
            </mesh>
            {/* Catchlight */}
            <mesh position={[0.025, 0.025, 0.07]} material={materials.catchlight}>
              <sphereGeometry args={[0.025, 8, 8]} />
            </mesh>
          </group>

          {/* Blush Cheeks */}
          <group ref={cheeksRef}>
            <mesh position={[-0.38, -0.06, 0.48]} material={materials.blush}>
              <sphereGeometry args={[0.1, 16, 16]} />
            </mesh>
            <mesh position={[0.38, -0.06, 0.48]} material={materials.blush}>
              <sphereGeometry args={[0.1, 16, 16]} />
            </mesh>
          </group>

          {/* Mouth */}
          <group ref={mouthRef} position={[0, -0.08, 0.61]}>
            {animation === 'cheer' || animation === 'levelUp' ? (
              // Open joyful mouth
              <mesh material={materials.mouth} rotation={[0, 0, 0]}>
                <torusGeometry args={[0.06, 0.025, 8, 16, Math.PI]} />
              </mesh>
            ) : (
              // Gentle upward smile
              <mesh material={materials.mouth} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.05, 0.018, 8, 16, Math.PI]} />
              </mesh>
            )}
          </group>

          {/* Sprout / Leaf Antenna */}
          <group ref={antennaRef} position={[0, 0.65, 0]}>
            {/* Stem */}
            <mesh position={[0, 0.12, 0]} material={materials.sprout} castShadow>
              <cylinderGeometry args={[0.025, 0.035, 0.25, 12]} />
            </mesh>
            {/* Left Leaf */}
            <mesh
              position={[-0.09, 0.22, 0]}
              rotation={[0, 0, -0.6]}
              scale={[0.16, 0.07, 0.05]}
              material={materials.sprout}
              castShadow
            >
              <sphereGeometry args={[1, 16, 16]} />
            </mesh>
            {/* Right Leaf */}
            <mesh
              position={[0.09, 0.24, 0]}
              rotation={[0, 0, 0.6]}
              scale={[0.18, 0.08, 0.05]}
              material={materials.sprout}
              castShadow
            >
              <sphereGeometry args={[1, 16, 16]} />
            </mesh>
            {/* Golden Star Bud */}
            <mesh position={[0, 0.28, 0]} material={materials.gold} castShadow>
              <octahedronGeometry args={[0.045, 0]} />
            </mesh>
          </group>
        </group>

        {/* Adventurer Scarf (Amethyst Purple #9966CC) */}
        <group position={[0, 0.46, 0]}>
          {/* Scarf Collar Ring */}
          <mesh material={materials.amethyst} castShadow>
            <torusGeometry args={[0.55, 0.12, 16, 32]} />
          </mesh>
          {/* Folded Scarf Knot */}
          <mesh position={[0.2, 0.02, 0.45]} material={materials.amethystDark} castShadow>
            <boxGeometry args={[0.18, 0.14, 0.16]} />
          </mesh>
          {/* Dangling Scarf Tail with Inertia */}
          <group ref={scarfTailRef} position={[0.2, -0.05, 0.48]}>
            <mesh material={materials.amethyst} castShadow>
              <boxGeometry args={[0.14, 0.35, 0.06]} />
            </mesh>
          </group>
        </group>

        {/* Adventurer Backpack */}
        <group position={[0, 0.58, -0.52]}>
          <mesh material={materials.amethyst} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.52, 0.3]} />
          </mesh>
          {/* Top flap */}
          <mesh position={[0, 0.22, 0.04]} material={materials.amethystDark} castShadow>
            <boxGeometry args={[0.46, 0.12, 0.28]} />
          </mesh>
          {/* Golden Clasp */}
          <mesh position={[0, 0.06, 0.16]} material={materials.gold}>
            <boxGeometry args={[0.08, 0.06, 0.04]} />
          </mesh>
        </group>

        {/* Cute Spirit Arms */}
        <group ref={leftArmRef} position={[-0.58, 0.42, 0.08]}>
          <mesh material={materials.body} castShadow>
            <capsuleGeometry args={[0.1, 0.2, 8, 16]} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.58, 0.42, 0.08]}>
          <mesh material={materials.body} castShadow>
            <capsuleGeometry args={[0.1, 0.2, 8, 16]} />
          </mesh>
        </group>

        {/* Cute Spirit Feet */}
        <group ref={leftFootRef} position={[-0.26, 0.1, 0.12]}>
          <mesh material={materials.body} castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
          </mesh>
        </group>

        <group ref={rightFootRef} position={[0.26, 0.1, 0.12]}>
          <mesh material={materials.body} castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
