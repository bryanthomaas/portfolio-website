import React from 'react';

interface BrandLogoProps {
  size?: number;
  idPrefix?: string;
  className?: string;
}

/**
 * Minimalist Red & White Crescent Moon Brand Mark.
 */
export const BrandLogo: React.FC<BrandLogoProps> = React.memo(
  ({ size = 36, className = '' }) => {
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
          {/* Deep Red Circle Base */}
          <circle cx="32" cy="32" r="30" fill="#D71A06" />
          {/* Clean White Crescent Moon */}
          <path
            d="M 41 14 A 18 18 0 1 0 41 50 A 19.7 19.7 0 0 1 41 14 Z"
            fill="#FFFFFF"
            transform="rotate(-15 32 32)"
          />
        </svg>
      </span>
    );
  }
);

BrandLogo.displayName = 'BrandLogo';
export default BrandLogo;
