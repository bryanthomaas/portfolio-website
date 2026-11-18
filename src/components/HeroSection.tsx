import React from 'react';
import { AlgoSandbox3D } from './AlgoSandbox3D';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({
  onNavigate,
  isFullscreen,
  onToggleFullscreen
}) => {
  return (
    <section className="section-container hero-section" id="hero">
      <div className="hero-grid">
        {/* Left: Bio & Actions */}
        <div className="hero-intro-card card">
          <div className="hero-identity-row">
            <img
              src="https://avatars.githubusercontent.com/u/157053252?v=4"
              alt="Bryan Thomas"
              className="hero-avatar"
              width="64"
              height="64"
              decoding="async"
              fetchPriority="high"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="hero-name">Bryan Thomas</h1>
              <p className="hero-role">Computer Engineer &amp; Full-Stack Systems Developer</p>
            </div>
          </div>

          <h2 className="hero-headline">
            I build full-stack web apps, developer tools, and reliable backend systems.
          </h2>

          <p className="hero-body">
            I'm a Computer Engineering graduate from the University of Cincinnati (3.47 GPA). I enjoy building practical software—from a tool that auto-documents GitHub repositories using the Gemini API to a double-entry personal finance app. Right now, I work as a Service Desk Analyst at Encore Technologies, troubleshooting Windows systems, Azure, and Active Directory.
          </p>

          <div className="hero-actions">
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#projects');
              }}
            >
              View Projects
            </a>

            <a
              href="/Bryan_Thomas_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-surface"
              download="Bryan_Thomas_Resume.pdf"
            >
              Download Resume ↓
            </a>

            <a
              href="https://github.com/bryanthomaas"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              aria-label="GitHub profile"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/bryanthomas543/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              aria-label="LinkedIn profile"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Right: Interactive 3D Isometric Algorithm & Maze Engine */}
        <div className="hero-sim-card card">
          <AlgoSandbox3D
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
