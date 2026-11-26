import React from 'react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
}

/**
 * Site footer with brand identification, tech stack credits, and external profiles.
 */
export const Footer: React.FC<FooterProps> = React.memo(({
  onNavigate,
  onOpenResume
}) => {
  return (
    <footer className="site-footer">
      <div className="section-container footer-inner">
        <div className="footer-brand">
          <BrandLogo size={28} />
          <span>
            <strong>Bryan Thomas</strong> · Computer Engineer · Software Developer
          </span>
        </div>
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
