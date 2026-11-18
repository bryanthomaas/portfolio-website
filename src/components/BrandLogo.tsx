import React from 'react';

interface BrandLogoProps {
  size?: number;
  idPrefix?: string;
  className?: string;
}

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
          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="8"
            fill="#250104"
            stroke="#CDF73D"
            strokeWidth="3.5"
          />
          <rect
            x="7"
            y="7"
            width="50"
            height="50"
            rx="5"
            stroke="#D71A06"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          <path
            d="M14 16H27.5C32 16 35 18.4 35 22.2C35 25 33.3 27 30.5 27.8C33.8 28.6 36 31 36 34.5C36 39 32.3 42 27 42H14V16ZM20.2 21V26H26.2C28 26 29.2 25 29.2 23.5C29.2 22 28 21 26.2 21H20.2ZM20.2 30.5V36.8H26.8C28.6 36.8 30 35.7 30 33.7C30 31.7 28.6 30.5 26.8 30.5H20.2Z"
            fill="#D71A06"
          />

          <path
            d="M32 16H51V21.5H44.5V48H38.5V21.5H32V16Z"
            fill="#CDF73D"
          />

          <path
            d="M17 42V48L22 51H31"
            stroke="#CDF73D"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <rect x="30" y="48.5" width="5" height="5" fill="#CDF73D" />
          <rect x="47" y="28" width="4.5" height="4.5" fill="#D71A06" />
        </svg>
      </span>
    );
  }
);

BrandLogo.displayName = 'BrandLogo';
export default BrandLogo;
