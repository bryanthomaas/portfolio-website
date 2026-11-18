import React from 'react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
}

export const Footer: React.FC<FooterProps> = React.memo(({
  onNavigate,
  onOpenResume
}) => {
  return (
    <footer className="site-footer">
      <div className="section-container footer-inner">
        <div className="footer-brand">
          <BrandLogo size={28} idPrefix="footer-brand" />
          <span>
            <strong>Bryan Thomas</strong> · Computer Engineer · Software Developer
          </span>
        </div>
        <p className="footer-colophon">
          Built with React 19, TypeScript, GSAP, and Lenis.
        </p>
        <div className="footer-links">
          <a href="https://github.com/bryanthomaas" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/bryanthomas543/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="mailto:thoma3ba@mail.uc.edu">Email</a>
          <button
            type="button"
            className="footer-btn-link"
            onClick={onOpenResume}
          >
            Resume
          </button>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#hero');
            }}
          >
            Back to Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
