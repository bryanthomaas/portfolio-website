import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS, RESUME_DATA, SKILLS, type ProjectItem } from '../data/portfolioData';

interface ModalsProps {
  activeProjectId: ProjectItem['id'] | null;
  onCloseProject: () => void;
  isResumeOpen: boolean;
  onCloseResume: () => void;
  isCmdOpen: boolean;
  onCloseCmd: () => void;
  onNavigate: (selector: string) => void;
  onOpenResume: () => void;
  onCopyEmail: () => void;
  onCopyPhone: () => void;
}

const CMD_ITEMS = [
  { group: 'Navigation', label: 'Overview & 3D A* Sandbox', shortcut: 'G H', scroll: '#hero' },
  { group: 'Navigation', label: `Featured Projects (${PROJECTS.length})`, shortcut: 'G P', scroll: '#projects' },
  { group: 'Navigation', label: `Technical Stack (${SKILLS.length})`, shortcut: 'G S', scroll: '#stack' },
  { group: 'Navigation', label: 'Education Credentials', shortcut: 'G E', scroll: '#education' },
  { group: 'Navigation', label: 'Professional Experience', shortcut: 'G X', scroll: '#experience' },
  { group: 'Navigation', label: 'Contact & Direct Channels', shortcut: 'G C', scroll: '#contact' },
  { group: 'Actions', label: 'Download Official Resume PDF (146 KB)', shortcut: 'D', action: 'download-pdf' },
  { group: 'Actions', label: 'Open Printable Engineering Resume', shortcut: 'R', action: 'resume' },
  { group: 'Actions', label: 'Copy Email (thoma3ba@mail.uc.edu)', shortcut: 'C', action: 'copy-email' },
  { group: 'Actions', label: 'Copy Phone (+1 513 837-6339)', shortcut: 'P', action: 'copy-phone' },
  { group: 'Actions', label: 'Verify UC CeDiploma (CeDiD: 2680-FYHK-B9SQ)', shortcut: 'V', action: 'verify-cediploma' },
  { group: 'Actions', label: 'Open GitHub (@bryanthomaas)', shortcut: '↗', action: 'github' },
  { group: 'Actions', label: 'Open LinkedIn (in/bryanthomas543)', shortcut: '↗', action: 'linkedin' }
];

export const Modals: React.FC<ModalsProps> = React.memo(({
  activeProjectId,
  onCloseProject,
  isResumeOpen,
  onCloseResume,
  isCmdOpen,
  onCloseCmd,
  onNavigate,
  onOpenResume,
  onCopyEmail,
  onCopyPhone
}) => {
  const projectDialogRef = useRef<HTMLDialogElement | null>(null);
  const resumeDialogRef = useRef<HTMLDialogElement | null>(null);
  const cmdDialogRef = useRef<HTMLDialogElement | null>(null);
  const cmdInputRef = useRef<HTMLInputElement | null>(null);

  const [cmdQuery, setCmdQuery] = useState('');

  const activeProject = PROJECTS.find((p) => p.id === activeProjectId) ?? null;

  useEffect(() => {
    const dialog = projectDialogRef.current;
    if (!dialog) return;
    if (activeProjectId && !dialog.open) {
      dialog.showModal();
    } else if (!activeProjectId && dialog.open) {
      dialog.close();
    }
  }, [activeProjectId]);

  useEffect(() => {
    const dialog = resumeDialogRef.current;
    if (!dialog) return;
    if (isResumeOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isResumeOpen && dialog.open) {
      dialog.close();
    }
  }, [isResumeOpen]);

  useEffect(() => {
    const dialog = cmdDialogRef.current;
    if (!dialog) return;
    if (isCmdOpen && !dialog.open) {
      setCmdQuery('');
      dialog.showModal();
      window.setTimeout(() => cmdInputRef.current?.focus(), 30);
    } else if (!isCmdOpen && dialog.open) {
      dialog.close();
    }
  }, [isCmdOpen]);

  const filteredCmds = CMD_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(cmdQuery.trim().toLowerCase())
  );

  const handleCmdSelect = (item: (typeof CMD_ITEMS)[number]) => {
    onCloseCmd();
    if (item.scroll) {
      onNavigate(item.scroll);
    } else if (item.action === 'resume') {
      onOpenResume();
    } else if (item.action === 'download-pdf') {
      const a = document.createElement('a');
      a.href = '/Bryan_Thomas_Resume.pdf';
      a.download = 'Bryan_Thomas_Resume.pdf';
      a.target = '_blank';
      a.click();
    } else if (item.action === 'copy-email') {
      onCopyEmail();
    } else if (item.action === 'copy-phone') {
      onCopyPhone();
    } else if (item.action === 'verify-cediploma') {
      window.open(
        'https://www.uc.edu/about/registrar/transcripts-diplomas-verifications/diplomas/cecredential/cecredential-validation.html',
        '_blank',
        'noopener,noreferrer'
      );
    } else if (item.action === 'github') {
      window.open('https://github.com/bryanthomaas', '_blank', 'noopener,noreferrer');
    } else if (item.action === 'linkedin') {
      window.open('https://www.linkedin.com/in/bryanthomas543/', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <dialog
        ref={cmdDialogRef}
        className="portfolio-dialog"
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-label="Command Palette"
        onClose={onCloseCmd}
        onClick={(e) => {
          if (e.target === cmdDialogRef.current) onCloseCmd();
        }}
      >
        <div className="cmd-palette-box bento-surface">
          <div className="cmd-search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={cmdInputRef}
              type="text"
              value={cmdQuery}
              onChange={(e) => setCmdQuery(e.target.value)}
              placeholder="Jump to section or run an action..."
              aria-label="Search commands"
              autoComplete="off"
            />
            <button type="button" className="cmd-esc-btn" onClick={onCloseCmd}>
              ESC
            </button>
          </div>
          <div className="cmd-list">
            {['Navigation', 'Actions'].map((groupName) => {
              const groupItems = filteredCmds.filter((i) => i.group === groupName);
              if (groupItems.length === 0) return null;
              return (
                <React.Fragment key={groupName}>
                  <div className="cmd-group-label">{groupName}</div>
                  {groupItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="cmd-item"
                      onClick={() => handleCmdSelect(item)}
                    >
                      <span>{item.label}</span>
                      <kbd>{item.shortcut}</kbd>
                    </button>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </dialog>

      <dialog
        ref={projectDialogRef}
        className="portfolio-dialog"
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-labelledby="projectModalTitle"
        onClose={onCloseProject}
        onClick={(e) => {
          if (e.target === projectDialogRef.current) onCloseProject();
        }}
      >
        <div className="modal-container bento-surface">
          <button
            type="button"
            className="modal-close"
            onClick={onCloseProject}
            aria-label="Close project details"
          >
            ✕
          </button>
          {activeProject && (
            <div className="modal-spec-body">
              <h2 className="modal-title" id="projectModalTitle">
                {activeProject.title}
              </h2>
              <p className="modal-desc">{activeProject.description}</p>

              {activeProject.specSections.map((sec) => (
                <div className="modal-section" key={sec.heading}>
                  <h4>{sec.heading}</h4>
                  <ul>
                    {sec.items.map((item) => (
                      <li key={item.lead}>
                        <strong>{item.lead}</strong>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="modal-footer-actions">
                <a
                  href={activeProject.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Open GitHub Repository ↗
                </a>
                <button type="button" className="btn btn-surface btn-sm" onClick={onCloseProject}>
                  Close Spec
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>

      <dialog
        ref={resumeDialogRef}
        className="portfolio-dialog"
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-label="Engineering Resume"
        onClose={onCloseResume}
        onClick={(e) => {
          if (e.target === resumeDialogRef.current) onCloseResume();
        }}
      >
        <div className="modal-container modal-resume bento-surface">
          <div className="resume-modal-toolbar no-print">
            <span className="toolbar-title">Bryan Thomas — Formatted Engineering Resume</span>
            <div className="toolbar-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href="/Bryan_Thomas_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                download="Bryan_Thomas_Resume.pdf"
              >
                Download Official PDF ↓
              </a>
              <a
                href="/Bryan_Thomas_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-surface btn-sm"
              >
                Open PDF in Tab ↗
              </a>
              <button
                type="button"
                className="btn btn-surface btn-sm"
                onClick={() => window.print()}
              >
                Print Sheet
              </button>
              <button type="button" className="modal-close-inline" onClick={onCloseResume}>
                ✕ Close
              </button>
            </div>
          </div>

          <div className="resume-sheet">
            <div className="res-header">
              <div>
                <div className="res-name">{RESUME_DATA.name}</div>
                <div className="res-sub">{RESUME_DATA.headline}</div>
              </div>
              <div className="res-contact">
                <div>{RESUME_DATA.location}</div>
                <div>
                  <a href={`mailto:${RESUME_DATA.email}`}>{RESUME_DATA.email}</a>
                </div>
                <div>
                  <a href={`tel:${RESUME_DATA.phone.replace(/[^+\d]/g, '')}`}>{RESUME_DATA.phoneLabel}</a>
                </div>
                <div>
                  <a href={RESUME_DATA.linkedin} target="_blank" rel="noopener noreferrer">
                    {RESUME_DATA.linkedinLabel}
                  </a>
                </div>
                <div>
                  <a href={RESUME_DATA.github} target="_blank" rel="noopener noreferrer">
                    {RESUME_DATA.githubLabel}
                  </a>
                </div>
              </div>
            </div>

            <div className="res-sec">
              <div className="res-sec-title">Education &amp; Verified Credentials</div>
              {RESUME_DATA.education.map((edu) => (
                <div className="res-item" key={edu.institution + edu.degree}>
                  <div className="res-item-head">
                    <span>{edu.institution}</span>
                    <span>{edu.location}</span>
                  </div>
                  <div className="res-item-sub">
                    <strong>{edu.degree}</strong> ({edu.period})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {edu.details}
                    {edu.verificationUrl && (
                      <>
                        {' '}· <a href={edu.verificationUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Verify CeDiploma ↗</a>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="res-sec">
              <div className="res-sec-title">Technical Skills</div>
              <ul className="res-list">
                {RESUME_DATA.skills.map((s) => (
                  <li key={s.label}>
                    <strong>{s.label}</strong>
                    {s.value}
                  </li>
                ))}
              </ul>
            </div>

            <div className="res-sec">
              <div className="res-sec-title">Featured Engineering Projects &amp; Research</div>
              {RESUME_DATA.projects.map((p) => (
                <div className="res-item" key={p.title}>
                  <div className="res-item-head">
                    <span>{p.title}</span>
                    <span>{p.stack}</span>
                  </div>
                  <ul className="res-list">
                    {p.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="res-sec">
              <div className="res-sec-title">Professional Experience &amp; Co-op Rotations</div>
              {RESUME_DATA.experience.map((exp) => (
                <div className="res-item" key={exp.role + exp.org}>
                  <div className="res-item-head">
                    <span>{exp.role} — {exp.org}</span>
                    <span>{exp.period} · {exp.location}</span>
                  </div>
                  <ul className="res-list">
                    <li>
                      <strong>{exp.lead}</strong>
                      {exp.text}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
});

Modals.displayName = 'Modals';
