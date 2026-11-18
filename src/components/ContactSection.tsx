import React from 'react';

interface ContactSectionProps {
  onCopyEmail: () => void;
  onCopyPhone: () => void;
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Contact section featuring direct communication channels with one-click copy
 * and an interactive mailto contact form.
 */
export const ContactSection: React.FC<ContactSectionProps> = React.memo(({
  onCopyEmail,
  onCopyPhone,
  onFormSubmit
}) => {
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
                <label htmlFor="inquiryType">Inquiry Topic</label>
                <select id="inquiryType" name="inquiryType">
                  <option value="Full-Time Engineering Role">Full-Time Opportunity</option>
                  <option value="Project Collaboration">Project Collaboration</option>
                  <option value="General Technical Inquiry">Technical Discussion</option>
                </select>
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
