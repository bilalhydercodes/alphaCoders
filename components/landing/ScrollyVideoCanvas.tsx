'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

const START_FRAME = 20;
const END_FRAME = 184;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1; // 165 frames

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
  // Store cached frames indexed by frame number (20..184)
  const imagesRef = useRef<{ [key: number]: HTMLImageElement | null }>({});

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Current interpolated frame for silky 60fps rendering, starting at frame 20
  const targetFrameRef = useRef(START_FRAME);
  const currentFrameRef = useRef(START_FRAME);
  const rafRef = useRef<number | null>(null);

  // Edge-to-edge full bleed cover render loop with High-DPI support
  const renderFrame = useCallback((frameIndex: number): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const img = imagesRef.current[frameIndex];
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

  // Preload frames starting at frame 20 through 184
  useEffect(() => {
    let loadedCount = 0;
    const priorityFrames = [20, 35, 50, 75, 100, 130, 160, 184];

    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]) {
          resolve();
          return;
        }

        const img = new Image();
        const paddedIndex = String(index).padStart(3, '0');
        img.src = `/frames/frame_${paddedIndex}.webp`;

        img.onload = () => {
          imagesRef.current[index] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));

          // Draw frame immediately as soon as start frame (20) or current target arrives
          if (index === START_FRAME || Math.round(currentFrameRef.current) === index) {
            renderFrame(index);
          }

          if (loadedCount >= 4) {
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

    // Immediately load frame 20 for instant display
    loadFrame(START_FRAME).then(() => {
      renderFrame(START_FRAME);
    });

    // Load key frames first for smooth initial scrub
    Promise.all(priorityFrames.map(loadFrame)).then(() => {
      setIsReady(true);
      renderFrame(START_FRAME);
      // Load remainder of frames (20..184) in background batches
      for (let i = START_FRAME; i <= END_FRAME; i++) {
        if (!imagesRef.current[i]) {
          loadFrame(i);
        }
      }
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [renderFrame]);

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
        Math.max(START_FRAME, Math.min(END_FRAME, currentFrameRef.current))
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

      // Map progress 0.0 -> 1.0 directly to Frame 20 -> 184
      const targetFrame = Math.round(START_FRAME + progress * (END_FRAME - START_FRAME));
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
      className="relative w-full h-[360vh] bg-black scroll-mt-0"
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

        {/* Bottom gradient smoothly merging with next section */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-surface via-surface/60 to-transparent pointer-events-none z-10" />

        {/* Loading Indicator */}
        {!isReady && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-black/80 backdrop-blur-md text-white">
            <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-300">
              Loading 3D Workspace ({loadProgress}%)...
            </span>
          </div>
        )}

        {/* Bottom-Right Tagline matching reference layout */}
        <div className="absolute bottom-4 right-4 sm:right-6 z-20 hidden sm:flex items-center gap-2 text-[11px] font-medium text-white/70 bg-black/40 backdrop-blur-xs px-2.5 py-1 border border-white/10 rounded-none pointer-events-none">
          <span>The agentic 3D workspace that levels up with you.</span>
        </div>
      </div>
    </section>
  );
};
