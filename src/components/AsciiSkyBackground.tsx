import React, { useEffect, useRef } from 'react';
import createPiece, { meta as originalMeta } from 'ascii-magic-art/pieces/cloud-drift.js';
import { play } from 'ascii-magic-art/runtime/player.js';

interface AsciiSkyBackgroundProps {
  className?: string;
}

/**
 * Deep OLED Oxblood & Crimson calibrated palette.
 * Renders native crisp glyphs directly onto canvas without blurry CSS filters.
 */
const OLED_PALETTE: Record<string, string> = {
  // Deep atmospheric sky gradient (0 to b)
  "0": "#0e0103",
  "1": "#140104",
  "2": "#1a0205",
  "3": "#220207",
  "4": "#2c0309",
  "5": "#38040c",
  "6": "#46050f",
  "7": "#570713",
  "8": "#6c0917",
  "9": "#850b1c",
  "a": "#a10e22",
  "b": "#c01128",
  // Luminous drifting cloud layer (c to l)
  "c": "#3a060b",
  "d": "#520910",
  "e": "#700d16",
  "f": "#94131e",
  "g": "#bd1a27",
  "h": "#dc3846",
  "i": "#f06b77",
  "j": "#f8a8b0",
  "k": "#fde4e7",
  "l": "#ffffff",
  // Horizon terrain / distant silhouettes (m to p)
  "m": "#0c0102",
  "n": "#120104",
  "o": "#1c0206",
  "p": "#280309",
  // Sun / highlight node (q, r)
  "q": "#ffe8eb",
  "r": "#ffffff"
};

const customMeta = {
  ...originalMeta,
  palette: OLED_PALETTE
};

export const AsciiSkyBackground: React.FC<AsciiSkyBackgroundProps> = React.memo(({ className = '' }) => {
  const preRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    // Dynamically size font so 100 columns fill the viewport width exactly,
    // ensuring the canvas renders at native Retina/HiDPI resolution without bitmap stretching.
    const adjustScale = () => {
      const vw = window.innerWidth;
      const targetPx = Math.max(14, Math.ceil(vw / (customMeta.cols * 0.6)));
      pre.style.fontSize = `${targetPx}px`;
    };

    adjustScale();
    window.addEventListener('resize', adjustScale);

    // Play cloud-drift ASCII animation with native OLED palette at 60fps
    const stop = play(pre, { default: createPiece, meta: customMeta }, {
      speed: 0.85,
      still: false,
      dom: false
    });

    return () => {
      window.removeEventListener('resize', adjustScale);
      if (typeof stop === 'function') {
        stop();
      }
    };
  }, []);

  return (
    <div className={`ascii-sky-backdrop ${className}`} aria-hidden="true">
      <div className="ascii-sky-canvas-wrapper">
        <pre ref={preRef} className="ascii-sky-pre" />
      </div>
      <div className="ascii-sky-overlay" />
    </div>
  );
});

AsciiSkyBackground.displayName = 'AsciiSkyBackground';
export default AsciiSkyBackground;
