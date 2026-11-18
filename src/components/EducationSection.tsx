import React from 'react';
import type { EducationEntry } from '../data/portfolioData';

interface EducationSectionProps {
  education: EducationEntry[];
}

/**
 * Education timeline displaying academic history, honors, and verified CeCredential data.
 */
export const EducationSection: React.FC<EducationSectionProps> = React.memo(({ education }) => {
  return (
    <section className="section-container" id="education">
      <div className="section-header">
        <h2 className="section-title">Education</h2>
        <p className="section-subtitle">
          Academic background and verified degree credentials.
        </p>
      </div>

      <div className="timeline-single-file">
        {education.map((edu) => (
          <div
            key={edu.institution + edu.degree}
            className={`timeline-item card ${edu.isVerifiedCredential ? 'credential-card' : ''}`}
          >
            <div className="timeline-meta-row">
              <span className="timeline-tag">{edu.code}</span>
              <span className="timeline-period">{edu.period}</span>
            </div>
            <h3 className="timeline-role">{edu.degree}</h3>
            <p className="timeline-org">
              {edu.institution} · {edu.location}
            </p>

            {edu.isVerifiedCredential && edu.credentialId && edu.credentialUrl && (
              <div className="cediploma-badge-box">
                <div className="cediploma-info">
                  <span className="cediploma-label">Verified Electronic Credential</span>
                  <span className="cediploma-id">
                    CeDiD: <strong>{edu.credentialId}</strong>
                  </span>
                </div>
                <a
                  href={edu.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Verify on UC Registrar ↗
                </a>
              </div>
            )}

            <ul className="timeline-points">
              {edu.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
});

EducationSection.displayName = 'EducationSection';
