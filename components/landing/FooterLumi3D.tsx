'use client';

import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { sound } from '@/lib/sound';

const MODEL_PATH = '/model-1789210678434.glb';

interface LumiInnerModelProps {
  onPet: () => void;
  isPetted: boolean;
}

const LumiInnerModel: React.FC<LumiInnerModelProps> = ({ onPet, isPetted }) => {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const hopRef = useRef<{ hopping: boolean; startTime: number }>({ hopping: false, startTime: 0 });

  // Clone scene for isolation and optimize materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const orig = mesh.material as THREE.MeshStandardMaterial;
          const mat = orig.clone();
          mat.roughness = 0.32;
          mat.metalness = 0.04;
          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [scene]);

  // Center model bounding box and scale to consistent friendly height
  const { scale, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const targetHeight = 1.65;
    const s = targetHeight / (size.y || 1);

    return {
      scale: s,
      centerOffset: [-center.x, -center.y, -center.z] as [number, number, number],
    };
  }, [clonedScene]);

  // Trigger hop when petted
  useEffect(() => {
    if (isPetted) {
      hopRef.current = { hopping: true, startTime: performance.now() };
    }
  }, [isPetted]);

  // Smooth frame loop: gentle cloud bobbing + energetic hop when clicked
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    let hopY = 0;
    let squashY = 1;
    let squashX = 1;

    if (hopRef.current.hopping) {
      const elapsed = (performance.now() - hopRef.current.startTime) / 1000;
      const duration = 0.55;
      if (elapsed < duration) {
        const p = elapsed / duration;
        // Parabolic jump arc
        hopY = Math.sin(p * Math.PI) * 0.35;
        // Anticipation squash & apex stretch
        squashY = 1 + Math.sin(p * Math.PI) * 0.18;
        squashX = 1 - Math.sin(p * Math.PI) * 0.09;
      } else {
        hopRef.current.hopping = false;
      }
    } else {
      // Gentle breathing & floating cloud bob
      hopY = Math.sin(t * 2.2) * 0.04;
    }

    groupRef.current.position.y = hopY;
    groupRef.current.scale.set(scale * squashX, scale * squashY, scale * squashX);
  });

  return (
    <group ref={groupRef} onClick={onPet}>
      {/* Front-facing angle with a gentle natural 3/4 turn towards user */}
      <group rotation={[0, -2.7, 0]}>
        <primitive object={clonedScene} position={centerOffset} />
      </group>
    </group>
  );
};

// Preload model
useGLTF.preload(MODEL_PATH);

export const FooterLumi3D: React.FC = () => {
  const [isPetted, setIsPetted] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const speechTimeout = useRef<NodeJS.Timeout | null>(null);
  const pointerStart = useRef({ x: 0, y: 0 });

  const quotes = [
    '✨ Onward to new adventures!',
    '💜 Let’s crush those habits together!',
    '🌟 High five! You’re leveling up!',
    '⚔️ Quests await! Let’s begin!',
    '🛡️ I’ll guard your streaks!',
  ];

  const handlePet = () => {
    setIsPetted(true);
    sound.playQuestComplete();

    // Pick random cheerful quote
    const nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeech(nextQuote);
    if (speechTimeout.current) clearTimeout(speechTimeout.current);
    speechTimeout.current = setTimeout(() => setSpeech(null), 3000);

    // Spawn floating heart particles
    const newHeart = { id: Date.now(), x: 45 + Math.random() * 10, y: 35 + Math.random() * 10 };
    setHearts((prev) => [...prev.slice(-4), newHeart]);

    setTimeout(() => setIsPetted(false), 600);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const dist = Math.hypot(e.clientX - pointerStart.current.x, e.clientY - pointerStart.current.y);
    if (dist < 6) {
      handlePet();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full select-none">
      {/* Speech / Reaction Bubble */}
      <div className="h-9 mb-1 flex items-center justify-center pointer-events-none">
        {speech ? (
          <div className="animate-bounce-short px-3 py-1 bg-white text-[#1F1730] text-xs font-bold rounded-full shadow-lg border border-[#2E2438]/20 flex items-center gap-1.5 whitespace-nowrap">
            {speech}
          </div>
        ) : (
          <div className="opacity-75 hover:opacity-100 transition-opacity px-2.5 py-0.5 bg-white/15 text-white text-[11px] font-semibold rounded-full border border-white/20 whitespace-nowrap">
            ✨ Drag to rotate · Click to pet Lumi!
          </div>
        )}
      </div>

      {/* Floating Heart & Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {hearts.map((h) => (
          <span
            key={h.id}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className="absolute text-lg animate-float-up opacity-90 transition-all"
          >
            💜
          </span>
        ))}
      </div>

      {/* 3D Canvas Stage with completely transparent background */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative w-full max-w-[360px] sm:max-w-[400px] h-[300px] sm:h-[340px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        title="Interact with Lumi (Drag to rotate, click to pet)"
      >
        {/* Soft Dreamy Ambient Cloud Glow behind Lumi */}
        <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl pointer-events-none transform scale-90" />

        <Canvas
          camera={{ position: [0, 0.05, 3.0], fov: 32 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            {/* Balanced Studio Lighting */}
            <ambientLight intensity={1.4} color="#FFFFFF" />

            {/* Key Light */}
            <directionalLight
              position={[3, 4, 3]}
              intensity={1.6}
              color="#FFFFFF"
            />

            {/* Soft Lavender Rim Light */}
            <directionalLight
              position={[-3, 2, -2]}
              intensity={0.8}
              color="#E6D4FF"
            />

            {/* Bottom Bounce Light */}
            <directionalLight
              position={[0, -2, 1.5]}
              intensity={0.3}
              color="#FAF8FF"
            />

            {/* Interactive 360 Drag Orbit Controls */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 2.6}
              maxPolarAngle={Math.PI / 1.7}
              rotateSpeed={0.7}
              dampingFactor={0.06}
            />

            {/* The 3D Lumi Character */}
            <LumiInnerModel onPet={handlePet} isPetted={isPetted} />

            {/* Soft Contact Shadow under Lumi's feet */}
            <ContactShadows
              position={[0, -0.65, 0]}
              opacity={0.4}
              scale={1.8}
              blur={1.6}
              far={1.2}
              color="#1F1730"
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Soft Cloud Pedestal beneath Lumi's feet */}
      <div className="w-48 sm:w-56 h-6 bg-white/25 rounded-full blur-xs -mt-4 relative z-0 pointer-events-none" />
    </div>
  );
};
