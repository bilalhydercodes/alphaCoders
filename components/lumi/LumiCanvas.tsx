'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { LumiModel } from './LumiModel';
import { LumiParticles } from './LumiParticles';
import { LumiMascot } from '../LumiMascot';

interface LumiCanvasProps {
  variant?: 'dashboard' | 'focus' | 'pedestal' | 'shop' | 'modal' | 'mini';
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

  // Camera distance and height based on variant
  const cameraPosition: [number, number, number] =
    variant === 'mini'
      ? [0, 0.75, 2.6]
      : variant === 'modal'
      ? [0, 0.85, 3.0]
      : variant === 'pedestal'
      ? [0, 0.9, 3.4]
      : [0, 0.8, 3.2];

  return (
    <div className="relative w-full h-full select-none cursor-pointer overflow-hidden">
      <Canvas
        camera={{ position: cameraPosition, fov: 36 }}
        dpr={[1, 1.8]}
        shadows
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

          {/* Optional Pedestal for Character Codex */}
          {variant === 'pedestal' && (
            <mesh position={[0, -0.05, 0]} receiveShadow>
              <cylinderGeometry args={[1.1, 1.25, 0.12, 32]} />
              <meshStandardMaterial
                color="#EADFFF"
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          )}

          {/* Ambient Floating Motion */}
          <Float
            speed={variant === 'focus' ? 0.8 : 2}
            rotationIntensity={variant === 'focus' ? 0.05 : 0.2}
            floatIntensity={variant === 'focus' ? 0.1 : 0.35}
          >
            <LumiModel interactive={interactive} />
            <LumiParticles />
          </Float>

          {/* Soft Contact Shadow below Lumi */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={2.2}
            blur={2.0}
            far={1.6}
            color="#2E2438"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
