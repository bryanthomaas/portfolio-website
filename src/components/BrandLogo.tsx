import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

/**
 * 2-Color Isometric Systems Matrix Brand Mark (Crimson Red #D71A06 & Pure White #FFFFFF).
 * Geometric 3D systems block referencing computer engineering and spatial pathfinding.
 */
export const BrandLogo: React.FC<BrandLogoProps> = React.memo(
  ({ size = 32, className = '' }) => {
    return (
      <span
        className={`brand-mark-wrap ${className}`.trim()}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg
          className="brand-logo-svg"
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Precision Obsidian Base */}
          <rect width="64" height="64" rx="14" fill="#000000" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.5" />
          {/* Pure White Isometric 3D Systems Matrix */}
          {/* Top Rhombus Face */}
          <polygon points="32,13 50,23 32,33 14,23" fill="#FFFFFF" />
          {/* Left Facet with Precision Data Channel */}
          <polygon points="14,26 30,35 30,51 14,42" fill="#FFFFFF" />
          <polygon points="18,34 26,38.5 26,45 18,40.5" fill="#000000" />
          {/* Right Facet with Amber Pulse State Node */}
          <polygon points="34,35 50,26 50,42 34,51" fill="#FFFFFF" />
          <circle cx="42" cy="38.5" r="3.5" fill="#F59E0B" />
        </svg>
      </span>
    );
  }
);

BrandLogo.displayName = 'BrandLogo';
export default BrandLogo;
