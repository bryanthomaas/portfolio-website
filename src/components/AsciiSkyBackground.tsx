import React, { useEffect, useRef } from 'react';
import createPiece, { meta } from 'ascii-magic-art/pieces/cloud-drift.js';
import { play } from 'ascii-magic-art/runtime/player.js';

interface AsciiSkyBackgroundProps {
  className?: string;
}

export const AsciiSkyBackground: React.FC<AsciiSkyBackgroundProps> = React.memo(({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    // Play cloud-drift ASCII animation in loop (still: false guarantees animation runs smoothly across all clients)
    const stop = play(pre, { default: createPiece, meta }, {
      speed: 0.85,
      still: false,
      dom: false
    });

    return () => {
      if (typeof stop === 'function') {
        stop();
      }
    };
  }, []);

  return (
    <div className={`ascii-sky-backdrop ${className}`} aria-hidden="true">
      <div className="ascii-sky-canvas-wrapper" ref={containerRef}>
        <pre ref={preRef} className="ascii-sky-pre" />
      </div>
      <div className="ascii-sky-overlay" />
    </div>
  );
});

AsciiSkyBackground.displayName = 'AsciiSkyBackground';
export default AsciiSkyBackground;
