import React from 'react';
import type { SkillItem } from '../data/portfolioData';

export type SkillFilter = 'all' | 'languages' | 'frontend' | 'backend' | 'ai-tools';

interface SkillsSectionProps {
  skills: SkillItem[];
  skillFilter: SkillFilter;
  onFilterChange: (filter: SkillFilter) => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
}

const SKILL_TABS: { id: SkillFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'languages', label: 'Languages' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend & Cloud' },
  { id: 'ai-tools', label: 'AI, Systems & IT' }
];

export const SkillsSection: React.FC<SkillsSectionProps> = React.memo(({
  skills,
  skillFilter,
  onFilterChange,
  gridRef
}) => {
  return (
    <section className="section-container" id="skills">
      <div className="section-header">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Technical Stack</h2>
            <p className="section-subtitle">
              Languages, frameworks, cloud platforms, and hardware tools I use across my projects and work.
            </p>
          </div>

          <div
            className="filter-bar"
            role="group"
            aria-label="Filter technical stack by category"
          >
            {SKILL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-btn ${skillFilter === tab.id ? 'active' : ''}`}
                aria-pressed={skillFilter === tab.id}
                onClick={() => onFilterChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="skills-grid" ref={gridRef}>
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="skill-flip-item"
            data-flip-id={skill.name}
          >
            <div className="skill-card card">
              <div className="skill-top">
                <span className="skill-badge">{skill.badge}</span>
                <div>
                  <h3 className="skill-name">{skill.name}</h3>
                  <span className="skill-cat-label">{skill.categoryLabel}</span>
                </div>
              </div>
              <p className="skill-context">{skill.context}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

SkillsSection.displayName = 'SkillsSection';
