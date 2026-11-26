import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';
import type { ProjectItem } from '../projects.config';

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

interface ProjectVisualProps {
  project: ProjectItem;
  onInspect: (id: ProjectItem['id']) => void;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = React.memo(({ project, onInspect }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const paths = containerRef.current.querySelectorAll<SVGPathElement | SVGLineElement>('.circuit-draw-path');
      if (paths.length === 0) return;

      gsap.fromTo(
        paths,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    },
    { scope: containerRef }
  );

  const visual = project.visual;

  if (visual?.type === 'image') {
    const slides = visual.gallery && visual.gallery.length > 0 ? visual.gallery : null;
    const current = slides ? slides[activeSlide] ?? slides[0] : null;
    const src = current ? current.url : visual.imageUrl;
    const alt = current ? current.alt : visual.imageAlt || `${project.title} preview`;

    return (
      <div className="project-visual" ref={containerRef}>
        <img
          src={src}
          alt={alt}
          className="project-img"
          width="600"
          height="338"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        {!slides && (
          <div className="project-overlay">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              GitHub Repository ↗
            </a>
          </div>
        )}
        {slides && slides.length > 1 && (
          <div className="project-gallery-tabs" role="tablist" aria-label={`${project.title} screenshots`}>
            {slides.map((slide, idx) => (
              <button
                key={slide.label}
                type="button"
                role="tab"
                aria-selected={activeSlide === idx}
                className={`project-gallery-tab ${activeSlide === idx ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(idx);
                }}
              >
                {slide.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (visual?.type === 'pipeline') {
    return (
      <div className="project-visual visual-diagram" ref={containerRef}>
        <div className="diagram-canvas">
          <svg
            className="diagram-circuit-svg"
            viewBox="0 0 560 90"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="circuit-draw-path"
              d="M 40 45 L 520 45"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
          </svg>
          {visual.steps.map((step, idx) => (
            <React.Fragment key={step.title}>
              <div className="diag-node">
                {step.title}
                <small>{step.subtitle}</small>
              </div>
              {idx < visual.steps.length - 1 && <div className="diag-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
        <div className="project-overlay">
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
    );
  }

  if (visual?.type === 'metrics') {
    const gradId = `chartAreaGrad-${project.id}`;
    return (
      <div className="project-visual visual-diagram" ref={containerRef}>
        <div className="fintech-preview">
          <div className="fintech-header">
            <div>
              <span className="fintech-label">{visual.headlineLabel}</span>
              <div className="fintech-amount">
                {visual.headlineValue}{' '}
                {visual.delta && <span className="fintech-delta">{visual.delta}</span>}
              </div>
            </div>
            {visual.badge && <span className="rf-chip">{visual.badge}</span>}
          </div>
          <svg
            className="fintech-chart"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,88 C50,82 85,66 130,62 C175,58 210,42 260,34 C310,26 350,15 400,8 L400,100 L0,100 Z"
              fill={`url(#${gradId})`}
            />
            <path
              className="circuit-draw-path"
              d="M0,88 C50,82 85,66 130,62 C175,58 210,42 260,34 C310,26 350,15 400,8"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
            />
            <circle cx="260" cy="34" r="4" fill="var(--accent)" />
          </svg>
          <div className="fintech-footer-pills">
            {visual.pills.map((pill) => (
              <span key={pill}>{pill}</span>
            ))}
          </div>
        </div>
        <div className="project-overlay">
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
    );
  }

  if (visual?.type === 'signal') {
    return (
      <div className="project-visual visual-diagram" ref={containerRef}>
        <div className="rf-preview">
          <div className="rf-formula-box">
            <span className="rf-eq">{visual.formula}</span>
            <span className="rf-sub">{visual.formulaSub}</span>
          </div>
          <div className="rf-wave-row">
            <div className="diag-node">
              {visual.leftNode.title}
              <small>{visual.leftNode.subtitle}</small>
            </div>
            <div className="rf-waves">
              <svg className="rf-svg-waves" viewBox="0 0 240 44" aria-hidden="true">
                <path
                  className="circuit-draw-path"
                  d="M 8 22 Q 35 10, 62 22 T 116 22 T 170 22 T 232 22"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                />
              </svg>
              <div className="rf-wave-labels">
                <span>{visual.waveLabels[0]}</span>
                <span>{visual.waveLabels[1]}</span>
              </div>
            </div>
            <div className="diag-node">
              {visual.rightNode.title}
              <small>{visual.rightNode.subtitle}</small>
            </div>
          </div>
          <div className="rf-findings">
            {visual.pills.map((pill) => (
              <span className="rf-chip" key={pill}>
                {pill}
              </span>
            ))}
          </div>
        </div>
        <div className="project-overlay">
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
    );
  }

  // Automatic fallback visual if `visual` is omitted in src/projects.config.ts
  const fallbackSteps = project.tags.slice(0, 4);
  return (
    <div className="project-visual visual-diagram" ref={containerRef}>
      <div className="diagram-canvas">
        <svg
          className="diagram-circuit-svg"
          viewBox="0 0 560 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="circuit-draw-path"
            d="M 40 45 L 520 45"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
          />
        </svg>
        {fallbackSteps.map((tag, idx) => (
          <React.Fragment key={tag}>
            <div className="diag-node">
              {tag}
              <small>Module {idx + 1}</small>
            </div>
            {idx < fallbackSteps.length - 1 && <div className="diag-arrow">→</div>}
          </React.Fragment>
        ))}
      </div>
      <div className="project-overlay">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onInspect(project.id)}
        >
          Inspect Architecture
        </button>
      </div>
    </div>
  );
});

ProjectVisual.displayName = 'ProjectVisual';
export default ProjectVisual;
