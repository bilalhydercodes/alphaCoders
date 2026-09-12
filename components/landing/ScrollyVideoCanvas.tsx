'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PaperHero } from './PaperHero';

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
  const curtainRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
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

  // Track container scroll position and choreograph the 3 distinct stages smoothly
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

      const isMobile = window.innerWidth < 640;
      const targetTop = isMobile ? 74 : 80;
      const initialTop = window.innerHeight * 0.5;

      if (progress <= 0.12) {
        // Stage 1: Text moves up first with 2-3 frames scrub
        const p1 = progress / 0.12;
        if (textRef.current) {
          textRef.current.style.transform = `translateY(-${p1 * 60}px)`;
        }
        if (curtainRef.current) {
          curtainRef.current.style.transform = 'translateY(0%)';
        }
        // Scrub 2-3 frames from frame 20 to 23 (video frame remains completely still)
        targetFrameRef.current = Math.round(START_FRAME + p1 * 3);
      } else if (progress < 0.30) {
        // Stage 2: Paper section and text sync and move up scroll animation (curtain lifts)
        const p2 = (progress - 0.12) / 0.18;
        if (textRef.current) {
          textRef.current.style.transform = 'translateY(-60px)';
        }
        if (curtainRef.current) {
          curtainRef.current.style.transform = `translateY(-${p2 * 100}%)`;
        }
        // Hold frame at 23 during curtain movement (video frame remains completely still)
        targetFrameRef.current = 23;
      } else {
        // Stage 3: Curtain is off-screen, video frames scrub from 23 to 184 (video frame remains completely still)
        const p3 = (progress - 0.30) / 0.70;
        if (textRef.current) {
          textRef.current.style.transform = 'translateY(-60px)';
        }
        if (curtainRef.current) {
          curtainRef.current.style.transform = 'translateY(-100%)';
        }
        // Scrub frames 23 -> 184
        targetFrameRef.current = Math.round(23 + p3 * (END_FRAME - 23));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      aria-label="Life RPG Interactive 3D Experience"
      className="relative w-full h-[380vh] bg-draft-paper scroll-mt-0"
    >
      <div id="meet-lumi" className="absolute top-0 pointer-events-none" />

      {/* Sticky Fullscreen Viewport Framed with Architectural Draft Paper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-draft-paper">
        {/* Stage 1 & 2: Architectural Draft Paper Curtain Hero */}
        <PaperHero
          ref={curtainRef}
          textRef={textRef}
          onOpenAuth={onOpenAuth}
        />

        {/* Framed 3D Video Screen with Draft Paper Margins & Borders (Completely still, no stretch/movement) */}
        <div
          ref={videoFrameRef}
          className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 lg:inset-x-16 max-w-[1200px] mx-auto border border-[#262524] rounded-none bg-black overflow-hidden shadow-2xl z-10"
          style={{
            top: '50vh',
            bottom: '24px',
          }}
        >
          {/* Framed Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-grab active:cursor-grabbing"
            aria-label="3D visual animation scrubbing smoothly on scroll"
          />

          {/* Loading Indicator */}
          {!isReady && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-black/80 backdrop-blur-md text-white">
              <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-300">
                Loading 3D Workspace ({loadProgress}%)...
              </span>
            </div>
          )}

          {/* Bottom-Right Architectural Drafting Coordinates Badge matching reference image */}
          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-20 flex items-center gap-2 text-[10px] sm:text-[11px] font-draft-mono text-white/80 bg-black/60 backdrop-blur-xs px-2.5 py-1 border border-white/15 rounded-none pointer-events-none">
            <span>X 334.40 / Y 214.40</span>
            <span className="opacity-40">|</span>
            <span className="hidden sm:inline">3D WORKSPACE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
