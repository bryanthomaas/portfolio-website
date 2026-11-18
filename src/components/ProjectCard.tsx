import React from 'react';
import type { ProjectItem } from '../projects.config';
import { ProjectVisual } from './ProjectVisuals';

interface ProjectCardProps {
  project: ProjectItem;
  onInspect: (id: ProjectItem['id']) => void;
}

/**
 * Individual project card featuring visual interactive preview, domain tags,
 * engineering highlights, and GitHub repository link.
 */
export const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, onInspect }) => {
  return (
    <div className="project-flip-item" data-flip-id={project.id}>
      <div className="project-card card">
        <ProjectVisual
          project={project}
          onInspect={onInspect}
        />

        <div className="project-body">
          <div className="project-title-row">
            <div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-subtitle">{project.subtitle}</p>
            </div>
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              aria-label={`View ${project.title} source on GitHub`}
              title="View Source on GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          <ul className="project-bullets">
            {project.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          <div className="project-tags">
            {project.tags.map((tag) => (
              <span className="tech-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className="project-actions">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              GitHub Repository ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';
