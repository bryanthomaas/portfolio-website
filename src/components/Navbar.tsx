import React from 'react';

interface NavbarProps {
  activeSection: string;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenSearch: () => void;
}

const NAV_ITEMS = [
  { id: 'hero', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Stack' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' }
] as const;

export const Navbar: React.FC<NavbarProps> = React.memo(({
  activeSection,
  mobileMenuOpen,
  onToggleMobileMenu,
  onNavigate,
  onOpenSearch
}) => {
  return (
    <header className="site-header" id="top">
      <nav className="command-dock" aria-label="Primary navigation">
        <a
          href="#hero"
          className="brand-logo"
          aria-label="Bryan Thomas home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('#hero');
          }}
        >
          <div className="brand-text">
            <span className="brand-name">Bryan Thomas</span>
            <span className="brand-sub">Computer Engineer · Full-Stack Systems</span>
          </div>
        </a>

        <div className={`nav-pill-wrapper ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links" id="navLinks">
            {NAV_ITEMS.map((nav) => (
              <li key={nav.id}>
                <a
                  href={`#${nav.id}`}
                  className={`nav-link ${activeSection === nav.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`#${nav.id}`);
                  }}
                >
                  {nav.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="cmd-k-btn"
            onClick={onOpenSearch}
            title="Open Command Palette (Ctrl+K / ⌘K)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>

          <a
            href="/Bryan_Thomas_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-surface btn-sm"
            download="Bryan_Thomas_Resume.pdf"
          >
            Resume ↓
          </a>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
});

Navbar.displayName = 'Navbar';
