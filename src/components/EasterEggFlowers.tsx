import React, { useEffect, useRef, useState, useCallback } from 'react';

interface DecodedCell {
  x: number;
  y: number;
  ch: string;
  color: string;
}

interface SparkleParticle {
  x: number;
  y: number;
  char: string;
  color: string;
  speed: number;
  drift: number;
  alpha: number;
}

const DEFAULT_COLS = 76;
const DEFAULT_ROWS = 68;

const BLOOM_DURATION = 6200; // 6.2 seconds graceful, fluid blossom
const REST_DURATION = 7000;  // 7.0 seconds rest in full blossom with floating sparkles
const FADE_DURATION = 1000;  // 1.0 second smooth dissolve into next blossom cycle
const CYCLE_DURATION = BLOOM_DURATION + REST_DURATION + FADE_DURATION;

/**
 * End-of-page Easter Egg: 60 FPS Animated ASCII Lily Bouquet.
 *
 * Performance Architecture:
 * 1. Background Pre-rendering: Pre-loads and time-slices canvas rasterization across RAF ticks
 *    so the main thread NEVER freezes, guaranteeing zero scroll jank or lag spikes.
 * 2. 60 FPS Continuous Alpha Blending: Interpolates smoothly between 31 keyframes at full
 *    display refresh rate (60/120fps), eliminating discrete slideshow stutter completely.
 * 3. 7-Second Full Blossom Hold: Rests in full vibrant bloom with floating shimmer particles.
 * 4. Unslopped Aesthetic: Quiet chrome, clean typography, dark OLED framing.
 */
export const EasterEggFlowers: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const offscreenCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const prepFrameIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const particlesRef = useRef<SparkleParticle[]>([]);
  const hasTriggeredRef = useRef<boolean>(false);
  const isPreppingRef = useRef<boolean>(false);
  const isLoopRunningRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(false);
  const isUnmountedRef = useRef<boolean>(false);

  const totalFramesRef = useRef<number>(31);
  const dimsRef = useRef({ cols: DEFAULT_COLS, rows: DEFAULT_ROWS });
  const sizeRef = useRef({ w: 520, h: 540, dpr: 1 });

  // Render a single frame to an offscreen canvas
  const renderSingleFrameToCanvas = useCallback((cells: DecodedCell[], w: number, h: number, dpr: number) => {
    const { cols, rows } = dimsRef.current;
    const targetW = Math.floor(w * dpr);
    const targetH = Math.floor(h * dpr);
    const cellW = w / cols;
    const cellH = h / rows;
    const fontSize = Math.floor(cellH * 1.15);

    const oc = document.createElement('canvas');
    oc.width = targetW;
    oc.height = targetH;
    const octx = oc.getContext('2d');
    if (!octx) return oc;

    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    octx.font = `700 ${fontSize}px "JetBrains Mono", Consolas, monospace`;
    octx.textBaseline = 'top';

    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      octx.fillStyle = c.color;
      octx.fillText(c.ch, c.x * cellW, c.y * cellH);
    }

    return oc;
  }, []);

  // Time-sliced asynchronous pre-rendering: 1 frame per tick to prevent any scroll stutter
  const startAsyncPreRendering = useCallback((frames: DecodedCell[][], w: number, h: number, dpr: number, onFrameReady?: () => void) => {
    if (isPreppingRef.current) return;
    isPreppingRef.current = true;

    let currentIdx = 0;
    const totalFrames = frames.length;

    const prepStep = () => {
      if (currentIdx >= totalFrames) {
        isPreppingRef.current = false;
        return;
      }

      // Process 1-2 frames per tick (keeps execution under ~4ms, well within 16ms frame budget)
      const count = Math.min(2, totalFrames - currentIdx);
      for (let k = 0; k < count; k++) {
        const frameIdx = currentIdx + k;
        const oc = renderSingleFrameToCanvas(frames[frameIdx], w, h, dpr);
        offscreenCanvasesRef.current[frameIdx] = oc;
      }

      currentIdx += count;

      if (onFrameReady) {
        onFrameReady();
      }

      if (currentIdx < totalFrames) {
        prepFrameIdRef.current = requestAnimationFrame(prepStep);
      } else {
        isPreppingRef.current = false;
      }
    };

    prepStep();
  }, [renderSingleFrameToCanvas]);

  const stopAnimationLoop = useCallback(() => {
    if (animFrameIdRef.current !== null) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    isLoopRunningRef.current = false;
  }, []);

  // Main 60 FPS animation loop with continuous alpha-interpolation
  const startAnimationLoop = useCallback(() => {
    if (isLoopRunningRef.current || !isVisibleRef.current || document.hidden) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    isLoopRunningRef.current = true;
    if (animFrameIdRef.current !== null) {
      cancelAnimationFrame(animFrameIdRef.current);
    }

    startTimeRef.current = null;

    const render = (now: number) => {
      if (!isLoopRunningRef.current || !isVisibleRef.current || document.hidden) {
        isLoopRunningRef.current = false;
        animFrameIdRef.current = null;
        return;
      }

      if (!startTimeRef.current) startTimeRef.current = now;
      const totalElapsed = (now - startTimeRef.current) % CYCLE_DURATION;
      const { w, h, dpr } = sizeRef.current;
      const { cols, rows } = dimsRef.current;
      const cellW = w / cols;
      const cellH = h / rows;
      const canvases = offscreenCanvasesRef.current;

      // Always clear to deep OLED black
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      if (canvases.length > 0) {
        const total = totalFramesRef.current || canvases.length;
        const maxIdx = Math.max(0, total - 1);

        if (totalElapsed < BLOOM_DURATION) {
          // Phase 1: Fluid continuous bloom at full 60 FPS via sub-frame alpha blending
          const progress = totalElapsed / BLOOM_DURATION;
          // Smooth organic cubic easing
          const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          const floatIdx = eased * maxIdx;
          const idxA = Math.floor(floatIdx);
          const idxB = Math.min(maxIdx, idxA + 1);
          const blend = floatIdx - idxA;

          // Draw base frame with fallback if frame is still in background queue
          const readyA = canvases[idxA] || canvases[canvases.length - 1];
          if (readyA) {
            ctx.globalAlpha = 1.0;
            ctx.drawImage(readyA, 0, 0, w, h);
          }

          // Smoothly cross-fade to next keyframe for continuous 60fps growth
          if (blend > 0.005 && idxA !== idxB && canvases[idxB]) {
            ctx.globalAlpha = blend;
            ctx.drawImage(canvases[idxB], 0, 0, w, h);
          }
          ctx.globalAlpha = 1.0;
        } else if (totalElapsed < BLOOM_DURATION + REST_DURATION) {
          // Phase 2: Rest in full vibrant bloom for 7.0s
          const finalFrame = canvases[maxIdx] || canvases[canvases.length - 1];
          if (finalFrame) {
            ctx.globalAlpha = 1.0;
            ctx.drawImage(finalFrame, 0, 0, w, h);
          }
        } else {
          // Phase 3: Gentle 1.0s dissolve into next cycle
          const fadeElapsed = totalElapsed - (BLOOM_DURATION + REST_DURATION);
          const fadeProgress = Math.min(1, fadeElapsed / FADE_DURATION);
          const fadeAlpha = Math.max(0, 1 - fadeProgress);

          const finalFrame = canvases[maxIdx] || canvases[canvases.length - 1];
          if (finalFrame) {
            ctx.globalAlpha = fadeAlpha;
            ctx.drawImage(finalFrame, 0, 0, w, h);
          }
          ctx.globalAlpha = 1.0;
        }

        // Draw floating ambient pollen sparkles during bloom and rest
        if (totalElapsed > 1200) {
          const sparkles = particlesRef.current;
          const elapsedSec = now * 0.001;
          const fadeMultiplier = totalElapsed > BLOOM_DURATION + REST_DURATION
            ? Math.max(0, 1 - (totalElapsed - (BLOOM_DURATION + REST_DURATION)) / FADE_DURATION)
            : 1.0;

          ctx.font = '600 12px "JetBrains Mono", Consolas, monospace';
          ctx.textBaseline = 'middle';

          for (let i = 0; i < sparkles.length; i++) {
            const p = sparkles[i];
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(elapsedSec * 3 + p.x)) * fadeMultiplier;
            ctx.fillText(p.char, p.x * cellW, p.y * cellH);
            p.y -= p.speed * 0.12;
            p.x += p.drift * 0.08;
            if (p.y < 2) p.y = rows - 4;
            if (p.x < 2) p.x = cols - 3;
            if (p.x > cols - 3) p.x = 2;
          }
          ctx.globalAlpha = 1.0;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);
  }, []);

  // Update canvas size safely
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const w = rect.width || 520;
    const h = rect.height || 540;

    sizeRef.current = { w, h, dpr };
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }, []);

  // Load and decode flower data
  const loadAndPrepare = useCallback(() => {
    updateCanvasDimensions();

    import('../data/flowerData').then(({ FLOWER_DATA }) => {
      if (isUnmountedRef.current) return;
      dimsRef.current = { cols: FLOWER_DATA.cols, rows: FLOWER_DATA.rows };
      totalFramesRef.current = FLOWER_DATA.frames.length;

      // Fast binary decode into memory
      const frames = FLOWER_DATA.frames.map((b64) => {
        const binary = atob(b64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const view = new DataView(bytes.buffer);
        const cells: DecodedCell[] = [];
        for (let i = 0; i < len; i += 5) {
          cells.push({
            x: view.getUint8(i),
            y: view.getUint8(i + 1),
            ch: FLOWER_DATA.chars[view.getUint8(i + 2)] || '*',
            color: FLOWER_DATA.palette[view.getUint16(i + 3, true)] || '#ffffff'
          });
        }
        return cells;
      });

      // Pollen sparkle particles
      particlesRef.current = Array.from({ length: 22 }, () => ({
        x: Math.random() * FLOWER_DATA.cols,
        y: 4 + Math.random() * (FLOWER_DATA.rows - 10),
        char: ['*', '·', '°', '+', '✧', '•'][Math.floor(Math.random() * 6)],
        color: ['#ffb7c5', '#ffd700', '#fbcfe8', '#ffffff', '#fda4af'][Math.floor(Math.random() * 5)],
        speed: 0.15 + Math.random() * 0.35,
        drift: (Math.random() - 0.5) * 0.3,
        alpha: 0.35 + Math.random() * 0.65
      }));

      // Start time-sliced offscreen pre-rendering
      startAsyncPreRendering(
        frames,
        sizeRef.current.w,
        sizeRef.current.h,
        sizeRef.current.dpr,
        () => {
          // Only spin up RAF if still scrolled into viewport and tab is visible
          if (isVisibleRef.current && !document.hidden && !isLoopRunningRef.current && offscreenCanvasesRef.current[0]) {
            startAnimationLoop();
          }
        }
      );
    });
  }, [updateCanvasDimensions, startAsyncPreRendering, startAnimationLoop]);

  // Viewport + visibility gated loading and RAF lifecycle (zero offscreen CPU/GPU burn)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    isUnmountedRef.current = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimationLoop();
      } else if (isVisibleRef.current && offscreenCanvasesRef.current.length > 0) {
        startAnimationLoop();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          isVisibleRef.current = true;
          setIsRevealed(true);

          if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            updateCanvasDimensions();
            if (offscreenCanvasesRef.current.length === 0 && !isPreppingRef.current) {
              loadAndPrepare();
            }
          } else if (offscreenCanvasesRef.current.length > 0) {
            startAnimationLoop();
          }
        } else {
          isVisibleRef.current = false;
          stopAnimationLoop();
        }
      },
      { threshold: 0.05, rootMargin: '400px 0px' }
    );

    observer.observe(el);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isUnmountedRef.current = true;
      isVisibleRef.current = false;
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopAnimationLoop();
      if (prepFrameIdRef.current !== null) {
        cancelAnimationFrame(prepFrameIdRef.current);
      }
    };
  }, [updateCanvasDimensions, loadAndPrepare, startAnimationLoop, stopAnimationLoop]);

  return (
    <section
      id="easter-egg"
      ref={containerRef}
      className={`easter-egg-section ${isRevealed ? 'revealed' : ''}`}
      aria-label="Thank you reward"
    >
      <div className="section-container">
        <div className="easter-egg-card">
          <div className="easter-egg-header">
            <h3 className="easter-egg-heading">Thank you for scrolling till the end</h3>
            <p className="easter-egg-sub">Here is a little reward for you:</p>
          </div>

          <div className="easter-egg-canvas-frame">
            <canvas ref={canvasRef} className="easter-egg-canvas" />
          </div>
        </div>
      </div>
    </section>
  );
});

EasterEggFlowers.displayName = 'EasterEggFlowers';
export default EasterEggFlowers;
