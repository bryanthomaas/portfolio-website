import React from 'react';
import type { TimelineEntry } from '../data/portfolioData';

interface ExperienceSectionProps {
  experience: TimelineEntry[];
}

/**
 * Professional experience timeline highlighting industry roles and achievements.
 */
export const ExperienceSection: React.FC<ExperienceSectionProps> = React.memo(({ experience }) => {
  return (
    <section className="section-container" id="experience">
      <div className="section-header">
        <h2 className="section-title">Professional Experience</h2>
        <p className="section-subtitle">
          Full-time roles, engineering co-ops, and university work experience.
        </p>
      </div>

      <div className="timeline-single-file">
        {experience.map((item) => (
          <div
            key={item.role + item.org}
            className="timeline-item card"
          >
            <div className="timeline-meta-row">
              <span className="timeline-tag">{item.code}</span>
              <span className="timeline-period">{item.period}</span>
            </div>
            <h3 className="timeline-role">{item.role}</h3>
            <p className="timeline-org">
              {item.org} · {item.location}
            </p>

            <ul className="timeline-points">
              {item.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
});

ExperienceSection.displayName = 'ExperienceSection';
