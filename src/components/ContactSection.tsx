import React, { useState, useRef, useEffect } from 'react';

interface ContactSectionProps {
  onCopyEmail: () => void;
  onCopyPhone: () => void;
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface InquiryOption {
  value: string;
  label: string;
  badge: string;
  description: string;
}

const INQUIRY_OPTIONS: InquiryOption[] = [
  {
    value: 'Full-Time Engineering Role',
    label: 'Full-Time Opportunity',
    badge: 'Careers',
    description: 'SWE, Systems & Infrastructure Roles'
  },
  {
    value: 'Project Collaboration',
    label: 'Project Collaboration',
    badge: 'Projects',
    description: 'Open-source or technical projects'
  },
  {
    value: 'General Technical Inquiry',
    label: 'Technical Discussion',
    badge: 'General',
    description: 'Architecture, ideas & tech talk'
  }
];

/**
 * Contact section featuring direct communication channels with one-click copy
 * and an interactive mailto contact form.
 */
export const ContactSection: React.FC<ContactSectionProps> = React.memo(({
  onCopyEmail,
  onCopyPhone,
  onFormSubmit
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Full-Time Engineering Role');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        setFocusedIndex(0);
      } else {
        setFocusedIndex((prev) => (prev + 1) % INQUIRY_OPTIONS.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        setFocusedIndex(INQUIRY_OPTIONS.length - 1);
      } else {
        setFocusedIndex((prev) => (prev - 1 + INQUIRY_OPTIONS.length) % INQUIRY_OPTIONS.length);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (isDropdownOpen) {
        e.preventDefault();
        setSelectedTopic(INQUIRY_OPTIONS[focusedIndex].value);
        setIsDropdownOpen(false);
        triggerRef.current?.focus();
      }
    } else if (e.key === 'Escape') {
      if (isDropdownOpen) {
        e.preventDefault();
        setIsDropdownOpen(false);
        triggerRef.current?.focus();
      }
    }
  };

  const handleSelect = (value: string) => {
    setSelectedTopic(value);
    setIsDropdownOpen(false);
    triggerRef.current?.focus();
  };

  const currentOption =
    INQUIRY_OPTIONS.find((opt) => opt.value === selectedTopic) || INQUIRY_OPTIONS[0];
  return (
    <section className="section-container" id="contact">
      <div className="section-header">
        <h2 className="section-title">Get in Touch</h2>
        <p className="section-subtitle">
          Open to full-time software engineering and IT infrastructure roles, technical discussions, and project collaborations.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-info card">
          <h3 className="contact-title">Direct Communication</h3>
          <p className="contact-lead">
            Reach out directly via email, phone, LinkedIn, or GitHub.
          </p>

          <div className="contact-channels">
            <div className="channel-row">
              <span className="channel-icon">@</span>
              <div className="channel-details">
                <span className="channel-label">University Email</span>
                <a href="mailto:thoma3ba@mail.uc.edu" className="channel-value">
                  thoma3ba@mail.uc.edu
                </a>
              </div>
              <button type="button" className="btn-chip" onClick={onCopyEmail}>
                Copy
              </button>
            </div>

            <div className="channel-row">
              <span className="channel-icon">tel</span>
              <div className="channel-details">
                <span className="channel-label">Direct Phone</span>
                <a href="tel:+15138376339" className="channel-value">
                  +1 (513) 837-6339
                </a>
              </div>
              <a href="tel:+15138376339" className="btn-chip">
                Call
              </a>
              <button type="button" className="btn-chip" onClick={onCopyPhone}>
                Copy
              </button>
            </div>

            <div className="channel-row">
              <span className="channel-icon">in</span>
              <div className="channel-details">
                <span className="channel-label">LinkedIn</span>
                <a
                  href="https://www.linkedin.com/in/bryanthomas543/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-value"
                >
                  linkedin.com/in/bryanthomas543
                </a>
              </div>
              <a
                href="https://www.linkedin.com/in/bryanthomas543/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-chip"
              >
                Connect
              </a>
            </div>

            <div className="channel-row">
              <span className="channel-icon">gh</span>
              <div className="channel-details">
                <span className="channel-label">GitHub</span>
                <a
                  href="https://github.com/bryanthomaas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-value"
                >
                  github.com/bryanthomaas
                </a>
              </div>
              <a
                href="https://github.com/bryanthomaas"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-chip"
              >
                Profile
              </a>
            </div>

            <div className="channel-row">
              <span className="channel-icon">loc</span>
              <div className="channel-details">
                <span className="channel-label">Location &amp; Availability</span>
                <span className="channel-value">
                  Cincinnati, Ohio · Open to full-time roles in SE, AI &amp; Infrastructure
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-wrap card">
          <form className="contact-form" onSubmit={onFormSubmit}>
            <h3 className="contact-title">Send a Message</h3>
            <p className="contact-lead">
              Opens your default email app with a pre-filled message to thoma3ba@mail.uc.edu.
            </p>

            <div className="form-group">
              <label htmlFor="senderName">Your Name</label>
              <input
                type="text"
                id="senderName"
                name="senderName"
                placeholder="Jane Doe"
                minLength={2}
                maxLength={100}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="senderEmail">Email Address</label>
                <input
                  type="email"
                  id="senderEmail"
                  name="senderEmail"
                  placeholder="jane@company.com"
                  maxLength={150}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label id="inquiryType-label" htmlFor="inquiryType-button">Inquiry Topic</label>
                <div className="custom-select-wrapper" ref={dropdownRef}>
                  <button
                    ref={triggerRef}
                    type="button"
                    id="inquiryType-button"
                    className={`custom-select-trigger ${isDropdownOpen ? 'open' : ''}`}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    onKeyDown={handleKeyDown}
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    aria-labelledby="inquiryType-label"
                  >
                    <span className="custom-select-value">{currentOption.label}</span>
                    <span className="custom-select-meta">
                      <kbd>{currentOption.badge}</kbd>
                      <svg
                        className={`custom-select-chevron ${isDropdownOpen ? 'open' : ''}`}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="custom-select-menu cmd-palette-box"
                      role="listbox"
                      aria-labelledby="inquiryType-label"
                    >
                      <div className="custom-select-header">Inquiry Options</div>
                      <div className="custom-select-list">
                        {INQUIRY_OPTIONS.map((opt, idx) => {
                          const isSelected = opt.value === selectedTopic;
                          const isFocused = idx === focusedIndex;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              className={`custom-select-item cmd-item ${isSelected ? 'selected' : ''} ${
                                isFocused ? 'focused' : ''
                              }`}
                              onClick={() => handleSelect(opt.value)}
                              onMouseEnter={() => setFocusedIndex(idx)}
                            >
                              <div className="custom-select-item-content">
                                <span className="custom-select-item-label">{opt.label}</span>
                                <span className="custom-select-item-desc">{opt.description}</span>
                              </div>
                              <div className="custom-select-item-aside">
                                <kbd>{opt.badge}</kbd>
                                {isSelected && (
                                  <svg
                                    className="custom-select-check"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <input type="hidden" id="inquiryType" name="inquiryType" value={selectedTopic} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="senderMessage">Message</label>
              <textarea
                id="senderMessage"
                name="senderMessage"
                rows={4}
                minLength={10}
                maxLength={2000}
                placeholder="Write your note here..."
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';
