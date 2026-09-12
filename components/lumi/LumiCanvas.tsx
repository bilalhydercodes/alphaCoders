'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { LumiModel } from './LumiModel';
import { LumiParticles } from './LumiParticles';
import { LumiMascot } from '../LumiMascot';

interface LumiCanvasProps {
  variant?: 'dashboard' | 'focus' | 'pedestal' | 'shop' | 'modal' | 'mini' | 'auth';
  interactive?: boolean;
}

export const LumiCanvas: React.FC<LumiCanvasProps> = ({
  variant = 'dashboard',
  interactive = true,
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  // Detect WebGL capability safely in browser
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Graceful fallback to vector SVG mascot if WebGL is unavailable
  if (hasWebGL === false) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <LumiMascot mood="content" size={140} />
      </div>
    );
  }

  // Camera distance and height calibrated for centered character (head at +0.65, feet at -0.65)
  const cameraPosition: [number, number, number] =
    variant === 'mini'
      ? [0, -0.05, 3.5]
      : variant === 'auth'
      ? [0, -0.05, 2.05]
      : variant === 'modal'
      ? [0, -0.05, 2.7]
      : variant === 'pedestal'
      ? [0, 0.15, 2.8]
      : variant === 'focus'
      ? [0, -0.05, 2.55]
      : [0, -0.05, 2.55];

  return (
    <div className="relative w-full h-full select-none cursor-pointer overflow-hidden">
      <Canvas
        camera={{ position: cameraPosition, fov: 34 }}
        dpr={[1, 1.8]}
        shadows="percentage"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
      >
        <Suspense fallback={null}>
          {/* Studio Lighting System */}
          <ambientLight intensity={1.3} color="#FAF8FF" />

          {/* Key Light (Front-Right Warm Studio Light) */}
          <directionalLight
            position={[3, 5, 4]}
            intensity={1.5}
            color="#FFFFFF"
            castShadow
            shadow-mapSize={[512, 512]}
            shadow-bias={-0.0001}
          />

          {/* Fill Light (Soft Lavender Rim Light from left) */}
          <directionalLight
            position={[-3, 2, -2]}
            intensity={0.7}
            color="#DCC7FF"
          />

          {/* Bottom Bounce Light */}
          <directionalLight
            position={[0, -2, 2]}
            intensity={0.25}
            color="#F8F8FF"
          />

          {/* Pedestal for Character Codex (top surface at y = -0.65, directly beneath feet) */}
          {variant === 'pedestal' && (
            <group position={[0, -0.72, 0]}>
              <mesh receiveShadow>
                <cylinderGeometry args={[1.05, 1.18, 0.14, 36]} />
                <meshStandardMaterial
                  color="#EADFFF"
                  roughness={0.32}
                  metalness={0.08}
                />
              </mesh>
              {/* Amethyst accent trim ring on pedestal base */}
              <mesh position={[0, -0.04, 0]} receiveShadow>
                <cylinderGeometry args={[1.15, 1.22, 0.05, 36]} />
                <meshStandardMaterial
                  color="#9966CC"
                  roughness={0.4}
                  metalness={0.15}
                />
              </mesh>
            </group>
          )}

          {/* 3D Model & Particles (Grounded, Zero Float Levitation) */}
          <LumiModel interactive={interactive} />
          <LumiParticles />

          {/* Soft Contact Shadow beneath Lumi's feet */}
          <ContactShadows
            position={[0, variant === 'pedestal' ? -0.648 : -0.65, 0]}
            opacity={variant === 'mini' ? 0.3 : 0.55}
            scale={variant === 'mini' ? 1.2 : 1.8}
            blur={variant === 'mini' ? 2.0 : 1.6}
            far={1.2}
            color="#1F1730"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
