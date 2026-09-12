'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

const TOTAL_FRAMES = 184;

interface ScrollyVideoCanvasProps {
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onOpenDashboard?: () => void;
}

export const ScrollyVideoCanvas: React.FC<ScrollyVideoCanvasProps> = ({
  onOpenAuth,
  onOpenDashboard,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Current interpolated frame for silky 60fps rendering
  const targetFrameRef = useRef(1);
  const currentFrameRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  // Preload frames incrementally
  useEffect(() => {
    let loadedCount = 0;
    const priorityFrames = [1, 20, 40, 60, 90, 120, 150, 184];

    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index - 1]) {
          resolve();
          return;
        }

        const img = new Image();
        const paddedIndex = String(index).padStart(3, '0');
        img.src = `/frames/frame_${paddedIndex}.webp`;

        img.onload = () => {
          imagesRef.current[index - 1] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));

          // Draw frame immediately as soon as frame 1 or current target arrives
          if (index === 1 || Math.round(currentFrameRef.current) === index) {
            renderFrame(index);
          }

          if (loadedCount >= 5) {
            setIsReady(true);
          }
          resolve();
        };

        img.onerror = () => {
          loadedCount++;
          resolve();
        };
      });
    };

    // Immediately load frame 1 for instant display
    loadFrame(1).then(() => {
      renderFrame(1);
    });

    // Load key frames first for smooth initial scrub
    Promise.all(priorityFrames.map(loadFrame)).then(() => {
      setIsReady(true);
      renderFrame(1);
      // Load remainder in background batches
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        if (!imagesRef.current[i - 1]) {
          loadFrame(i);
        }
      }
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Edge-to-edge full bleed cover render loop with High-DPI support
  const renderFrame = useCallback((frameIndex: number): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const img = imagesRef.current[frameIndex - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return false;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== Math.round(displayWidth * dpr) || canvas.height !== Math.round(displayHeight * dpr)) {
      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Edge-to-edge cover calculation (100% viewport coverage, zero letterboxing)
    const scale = Math.max(displayWidth / img.naturalWidth, displayHeight / img.naturalHeight);
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    const offsetX = (displayWidth - drawWidth) / 2;
    const offsetY = (displayHeight - drawHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
    return true;
  }, []);

  // 60fps / 120fps lerp interpolation loop
  useEffect(() => {
    let lastRenderedFrame = -1;

    const loop = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.05) {
        currentFrameRef.current = target;
      } else {
        currentFrameRef.current += diff * 0.18;
      }

      const frameToDraw = Math.round(
        Math.max(1, Math.min(TOTAL_FRAMES, currentFrameRef.current))
      );

      if (frameToDraw !== lastRenderedFrame) {
        const drawn = renderFrame(frameToDraw);
        if (drawn) {
          lastRenderedFrame = frameToDraw;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const handleResize = () => {
      lastRenderedFrame = -1;
      renderFrame(Math.round(currentFrameRef.current));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame]);

  // Track container scroll position smoothly
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      setScrollProgress(progress);

      // Map progress 0.0 -> 1.0 to Frame 1 -> 184
      const targetFrame = Math.round(1 + progress * (TOTAL_FRAMES - 1));
      targetFrameRef.current = targetFrame;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      aria-label="Life RPG Interactive 3D Experience"
      className="relative w-full h-[400vh] bg-black scroll-mt-10"
    >
      <div id="meet-lumi" className="absolute top-0 pointer-events-none" />
      {/* Sticky Fullscreen Edge-to-Edge Scrollytelling Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Full-Bleed Edge-to-Edge Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing"
          aria-label="3D visual animation scrubbing smoothly on scroll"
        />

        {/* Cinematic Vignettes */}
        {/* Top gradient for navbar clarity */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none z-10" />

        {/* Bottom gradient smoothly merging with next section */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-surface via-surface/60 to-transparent pointer-events-none z-10" />

        {/* Loading Indicator */}
        {!isReady && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-black/80 backdrop-blur-md text-white">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-300">
              Loading 3D Experience ({loadProgress}%)...
            </span>
          </div>
        )}

        {/* Minimal Scroll Helper Indicator at Bottom Center - Fades on scroll */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/90 shadow-lg text-xs font-bold transition-opacity duration-300 pointer-events-none ${
            scrollProgress > 0.03 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span>Scroll to explore the 3D journey</span>
          <span className="animate-bounce inline-block">↓</span>
        </div>

        {/* Edge-to-Edge Glowing Progress Bar at Absolute Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/10 z-30">
          <div
            className="h-full bg-gradient-to-r from-[#7042C1] via-[#9966CC] to-[#A855F7] transition-all duration-75 shadow-[0_0_12px_#9966CC]"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
};
