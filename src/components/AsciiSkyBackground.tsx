import React, { useEffect, useRef } from 'react';
import createRainforestFallsMist, { meta } from 'ascii-magic-art/pieces/rainforest-falls-mist.js';
import { paint } from 'ascii-magic-art/runtime/canvas.js';

interface AsciiSkyBackgroundProps {
  className?: string;
}

const CELL_PX = 4;
const TARGET_FPS = 12;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const FRAME_COUNT = 24;
const CROSSFADE_FRAMES = 4;
const TOTAL_FRAMES = FRAME_COUNT + CROSSFADE_FRAMES;

/**
 * Animated Rainforest Falls Mist halftone canvas background.
 * Pre-renders a seamless cross-faded 24-frame cache incrementally via requestIdleCallback
 * so steady-state runtime playback uses sub-millisecond drawImage blits with zero main-thread stutter.
 */
export const AsciiSkyBackground: React.FC<AsciiSkyBackgroundProps> = React.memo(({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const logicalWidth = meta.cols * CELL_PX;
    const logicalHeight = meta.rows * CELL_PX;
    canvas.width = logicalWidth;
    canvas.height = logicalHeight;

    const draw = createRainforestFallsMist();
    const paintOpts = {
      cw: CELL_PX,
      ch: CELL_PX,
      mode: 'circle' as const,
      size: 0.56,
      density: 1,
      tone: {
        ...meta.dots?.tone,
        sat: 1.0,
        gamma: 0.55
      },
      lift: false,
      dpr: 1
    };

    const renderCachedFrame = (idx: number): HTMLCanvasElement => {
      const offscreen = document.createElement('canvas');
      offscreen.width = logicalWidth;
      offscreen.height = logicalHeight;
      const octx = offscreen.getContext('2d', { alpha: true });
      if (octx) {
        paint(octx, draw(idx / TARGET_FPS), meta.palette, paintOpts);
        // Back anti-aliased dots with solid black so cross-fades interpolate linearly with zero darkening
        octx.globalCompositeOperation = 'destination-over';
        octx.fillStyle = '#000000';
        octx.fillRect(0, 0, logicalWidth, logicalHeight);
        octx.globalCompositeOperation = 'source-over';
      }
      return offscreen;
    };

    const frames: HTMLCanvasElement[] = [];
    let stopped = false;
    let rafId = 0;
    let idleHandle: number | null = null;
    let isTimerFallback = false;

    const blitFrame = (idx: number, isLoopActive: boolean) => {
      if (isLoopActive && idx < CROSSFADE_FRAMES && frames.length === TOTAL_FRAMES) {
        const tailIdx = FRAME_COUNT + idx;
        const alpha = (idx + 1) / (CROSSFADE_FRAMES + 1);
        ctx.globalAlpha = 1;
        ctx.drawImage(frames[tailIdx], 0, 0);
        ctx.globalAlpha = alpha;
        ctx.drawImage(frames[idx], 0, 0);
        ctx.globalAlpha = 1;
        return;
      }

      const frame = frames[idx];
      if (frame) {
        ctx.globalAlpha = 1;
        ctx.drawImage(frame, 0, 0);
      }
    };

    // Frame 0 renders synchronously for instant first paint without blank flash
    frames.push(renderCachedFrame(0));
    blitFrame(0, false);

    // Incrementally build the remaining frames during idle time to keep startup silky smooth
    const scheduleNextCacheFrame = () => {
      if (stopped || frames.length >= TOTAL_FRAMES) return;
      const win = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      };

      const stepCache = () => {
        idleHandle = null;
        if (stopped || frames.length >= TOTAL_FRAMES) return;
        frames.push(renderCachedFrame(frames.length));
        if (frames.length < TOTAL_FRAMES) {
          scheduleNextCacheFrame();
        }
      };

      if (typeof win.requestIdleCallback === 'function') {
        isTimerFallback = false;
        idleHandle = win.requestIdleCallback(stepCache, { timeout: 120 });
      } else {
        isTimerFallback = true;
        idleHandle = window.setTimeout(stepCache, 40);
      }
    };

    scheduleNextCacheFrame();

    let currentIdx = 0;
    let hasCompletedFirstCycle = false;
    let lastDraw = performance.now();

    const tick = (now: number) => {
      if (stopped || document.hidden) return;
      rafId = requestAnimationFrame(tick);

      if (now - lastDraw < FRAME_INTERVAL) return;
      lastDraw = now - ((now - lastDraw) % FRAME_INTERVAL);

      if (frames.length < 2) return;

      const nextIdx = currentIdx + 1;
      if (frames.length === TOTAL_FRAMES) {
        if (nextIdx >= FRAME_COUNT) {
          hasCompletedFirstCycle = true;
          currentIdx = 0;
        } else {
          currentIdx = nextIdx;
        }
      } else {
        currentIdx = nextIdx % frames.length;
      }

      blitFrame(currentIdx, hasCompletedFirstCycle);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else if (!stopped && !rafId) {
        lastDraw = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (!document.hidden) {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      stopped = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (idleHandle !== null) {
        const win = window as Window & { cancelIdleCallback?: (id: number) => void };
        if (!isTimerFallback && typeof win.cancelIdleCallback === 'function') {
          win.cancelIdleCallback(idleHandle);
        } else {
          window.clearTimeout(idleHandle);
        }
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      frames.length = 0;
    };
  }, []);

  return (
    <div className={`ascii-sky-backdrop ${className}`} aria-hidden="true">
      <div className="ascii-sky-canvas-wrapper">
        <canvas ref={canvasRef} className="ascii-sky-canvas" />
      </div>
      <div className="ascii-sky-overlay" />
    </div>
  );
});

AsciiSkyBackground.displayName = 'AsciiSkyBackground';
export default AsciiSkyBackground;
