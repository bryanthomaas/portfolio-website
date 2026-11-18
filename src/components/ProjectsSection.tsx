import React from 'react';
import type { ProjectItem, ProjectCategory } from '../projects.config';
import { ProjectCard } from './ProjectCard';

export type ProjectFilter = 'all' | ProjectCategory;

interface ProjectsSectionProps {
  projects: ProjectItem[];
  projectFilter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
  onInspectProject: (id: ProjectItem['id']) => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
}

const FILTER_TABS: { id: ProjectFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai-cloud', label: 'AI & Cloud' },
  { id: 'fullstack', label: 'Full-Stack' },
  { id: 'frontend-3d', label: 'Algorithms' },
  { id: 'hardware-rf', label: 'Embedded & RF' }
];

/**
 * Featured projects section with category filter pills and animated grid.
 */
export const ProjectsSection: React.FC<ProjectsSectionProps> = React.memo(({
  projects,
  projectFilter,
  onFilterChange,
  onInspectProject,
  gridRef
}) => {
  return (
    <section className="section-container" id="projects">
      <div className="section-header">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              Open-source apps, developer tools, and hardware research from my GitHub.
            </p>
          </div>

          <div
            className="filter-bar"
            role="group"
            aria-label="Filter projects by category"
          >
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-btn ${projectFilter === tab.id ? 'active' : ''}`}
                aria-pressed={projectFilter === tab.id}
                onClick={() => onFilterChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="projects-grid" ref={gridRef}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onInspect={onInspectProject}
          />
        ))}
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';
