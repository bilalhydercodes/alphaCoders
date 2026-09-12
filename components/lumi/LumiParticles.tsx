'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useLumi } from './LumiContext';

export const LumiParticles: React.FC = () => {
  const { particleType, reducedMotion } = useLumi();
  const pointsRef = useRef<THREE.Points>(null);

  // If reduced motion is requested or no particles, render nothing
  if (reducedMotion || particleType === 'none') {
    return null;
  }

  // Generate particle buffer attributes
  const count = particleType === 'confetti' ? 48 : particleType === 'radiant' ? 16 : 28;

  const [positions, colors, scales, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    const vel = new Float32Array(count * 3);

    const cPrimary = new THREE.Color('#9966CC');
    const cGold = new THREE.Color('#F5B700');
    const cEmerald = new THREE.Color('#4FCE6B');
    const cWhite = new THREE.Color('#FFFFFF');

    for (let i = 0; i < count; i++) {
      // Origin around Lumi's head/body
      pos[i * 3] = (Math.random() - 0.5) * 1.2;
      pos[i * 3 + 1] = 0.6 + Math.random() * 0.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

      // Velocities
      vel[i * 3] = (Math.random() - 0.5) * 1.2;
      vel[i * 3 + 1] = 0.8 + Math.random() * 1.6;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 1.0;

      // Colors depending on particle type
      let chosenColor = cPrimary;
      if (particleType === 'gold') {
        chosenColor = Math.random() > 0.3 ? cGold : cWhite;
      } else if (particleType === 'xp') {
        chosenColor = Math.random() > 0.4 ? cPrimary : cWhite;
      } else if (particleType === 'confetti') {
        const palette = [cPrimary, cGold, cEmerald, cWhite];
        chosenColor = palette[Math.floor(Math.random() * palette.length)];
      } else if (particleType === 'radiant') {
        chosenColor = Math.random() > 0.5 ? cGold : cWhite;
      }

      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;

      sca[i] = 0.08 + Math.random() * 0.12;
    }

    return [pos, col, sca, vel];
  }, [particleType, count]);

  // Texture-less clean round procedural point particle material
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * delta;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      // Gravity / drag
      velocities[i * 3 + 1] -= delta * 1.8;

      // Loop or reset if fallen
      if (arr[i * 3 + 1] < 0) {
        arr[i * 3] = (Math.random() - 0.5) * 1.0;
        arr[i * 3 + 1] = 0.8 + Math.random() * 0.4;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
        velocities[i * 3 + 1] = 0.8 + Math.random() * 1.4;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <primitive object={particleMaterial} attach="material" />
    </points>
  );
};
