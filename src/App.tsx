import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { Analytics } from '@vercel/analytics/react';

import { AsciiSkyBackground } from './components/AsciiSkyBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection, type ProjectFilter } from './components/ProjectsSection';
import { SkillsSection, type SkillFilter } from './components/SkillsSection';
import { EducationSection } from './components/EducationSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { EasterEggFlowers } from './components/EasterEggFlowers';
import { Footer } from './components/Footer';
import { Modals } from './components/Modals';

import { PROJECTS, SKILLS, EDUCATION, EXPERIENCE, type ProjectItem } from './data/portfolioData';

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);

/**
 * Main application orchestrator managing global theme, Lenis smooth scrolling,
 * GSAP ScrollTrigger/Flip animations, section spy, and modal overlays.
 */
export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const activeSectionRef = useRef<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all');

  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem['id'] | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [isCmdOpen, setIsCmdOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const appRootRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const projectsGridRef = useRef<HTMLDivElement | null>(null);
  const skillsGridRef = useRef<HTMLDivElement | null>(null);
  const flipProjectStateRef = useRef<Flip.FlipState | null>(null);
  const flipSkillStateRef = useRef<Flip.FlipState | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2800);
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Brand SVG Favicon - Monochrome Obsidian & White with Warm Amber Spark (#000000, #FFFFFF, #F59E0B)
  useEffect(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="14" fill="#000000" stroke="rgba(255,255,255,0.25)" stroke-width="2"/><polygon points="32,13 50,23 32,33 14,23" fill="#FFFFFF"/><polygon points="14,26 30,35 30,51 14,42" fill="#FFFFFF"/><polygon points="18,34 26,38.5 26,45 18,40.5" fill="#000000"/><polygon points="34,35 50,26 50,42 34,51" fill="#FFFFFF"/><circle cx="42" cy="38.5" r="3.5" fill="#F59E0B"/></svg>`;
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = dataUri;

    const appleLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
    if (appleLink) {
      appleLink.href = dataUri;
    }
  }, []);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      lerp: 0.09,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      respectReducedMotion: false
    });
    lenisRef.current = lenis;

    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const navLockRef = useRef<boolean>(false);
  const navLockTimerRef = useRef<number | null>(null);

  const scrollToSection = useCallback((selector: string) => {
    setMobileMenuOpen(false);
    let id = selector.replace(/^#/, '');
    // Normalize alias between 'stack' and 'skills'
    let target = document.getElementById(id);
    if (!target) {
      if (id === 'stack') target = document.getElementById('skills');
      else if (id === 'skills') target = document.getElementById('stack');
      else target = document.querySelector<HTMLElement>(selector);
    }
    if (!target && id !== 'hero') return;

    const normalizedId = target?.id || (id === 'skills' ? 'stack' : id);
    if (activeSectionRef.current !== normalizedId) {
      activeSectionRef.current = normalizedId;
      setActiveSection(normalizedId);
    }

    navLockRef.current = true;
    if (navLockTimerRef.current) window.clearTimeout(navLockTimerRef.current);
    navLockTimerRef.current = window.setTimeout(() => {
      navLockRef.current = false;
    }, 1400);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(id === 'hero' ? 0 : target!, {
        offset: 0,
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        force: true,
        onComplete: () => {
          navLockRef.current = false;
          if (activeSectionRef.current !== normalizedId) {
            activeSectionRef.current = normalizedId;
            setActiveSection(normalizedId);
          }
        }
      });
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Keyboard shortcut Ctrl+K / ⌘K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Section scroll spy with GSAP ScrollTrigger
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const sections = ['hero', 'projects', 'stack', 'skills', 'education', 'experience', 'contact'];
      sections.forEach((id, index) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          refreshPriority: -index,
          onToggle: (self) => {
            if (self.isActive && !navLockRef.current) {
              const targetId = (id === 'skills' || id === 'stack') ? 'stack' : id;
              if (activeSectionRef.current !== targetId) {
                activeSectionRef.current = targetId;
                setActiveSection(targetId);
              }
            }
          }
        });
      });

      if (!prefersReducedMotion && appRootRef.current) {
        const headers = appRootRef.current.querySelectorAll<HTMLElement>('.section-header');
        headers.forEach((header) => {
          ScrollTrigger.create({
            trigger: header,
            start: 'top 92%',
            once: true,
            onEnter: () => {
              gsap.fromTo(
                header,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
              );
            }
          });
        });
      }
    },
    { scope: appRootRef }
  );

  // Projects category filter with GSAP Flip
  const handleProjectFilterChange = useCallback((nextFilter: ProjectFilter) => {
    if (nextFilter === projectFilter) return;
    if (projectsGridRef.current) {
      flipProjectStateRef.current = Flip.getState(
        projectsGridRef.current.querySelectorAll('.project-flip-item')
      );
    }
    setProjectFilter(nextFilter);
  }, [projectFilter]);

  useLayoutEffect(() => {
    if (!flipProjectStateRef.current) return;
    Flip.from(flipProjectStateRef.current, {
      duration: 0.35,
      ease: 'power2.out',
      scale: true,
      absolute: false,
      stagger: 0.03,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out', clearProps: 'transform,opacity' }
        ),
      onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0.97, duration: 0.18 }),
      onComplete: () => ScrollTrigger.refresh()
    });
    flipProjectStateRef.current = null;
  }, [projectFilter]);

  // Skills category filter with GSAP Flip
  const handleSkillFilterChange = useCallback((nextFilter: SkillFilter) => {
    if (nextFilter === skillFilter) return;
    if (skillsGridRef.current) {
      flipSkillStateRef.current = Flip.getState(
        skillsGridRef.current.querySelectorAll('.skill-flip-item')
      );
    }
    setSkillFilter(nextFilter);
  }, [skillFilter]);

  useLayoutEffect(() => {
    if (!flipSkillStateRef.current) return;
    Flip.from(flipSkillStateRef.current, {
      duration: 0.32,
      ease: 'power2.out',
      scale: true,
      stagger: 0.02,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.24, ease: 'power2.out', clearProps: 'transform,opacity' }
        ),
      onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0.97, duration: 0.16 }),
      onComplete: () => ScrollTrigger.refresh()
    });
    flipSkillStateRef.current = null;
  }, [skillFilter]);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard?.writeText('thoma3ba@mail.uc.edu').then(
      () => showToast('Copied thoma3ba@mail.uc.edu to clipboard'),
      () => showToast('Email: thoma3ba@mail.uc.edu')
    );
  }, [showToast]);

  const handleCopyPhone = useCallback(() => {
    navigator.clipboard?.writeText('+1 (513) 837-6339').then(
      () => showToast('Copied +1 (513) 837-6339 to clipboard'),
      () => showToast('Phone: +1 (513) 837-6339')
    );
  }, [showToast]);

  const handleContactSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('senderName') || '').trim();
    const email = String(data.get('senderEmail') || '').trim();
    const subject = String(data.get('inquiryType') || 'Software Engineering Inquiry').trim();
    const message = String(data.get('senderMessage') || '').trim();

    if (!name || !email || !message) return;

    const mailtoSubject = encodeURIComponent(`[Portfolio] ${subject} — ${name}`);
    const mailtoBody = encodeURIComponent(
      `Hi Bryan,\n\n${message}\n\n—\nFrom: ${name}\nReply-To: ${email}`
    );
    window.location.href = `mailto:thoma3ba@mail.uc.edu?subject=${mailtoSubject}&body=${mailtoBody}`;
    showToast('Opening email client for thoma3ba@mail.uc.edu...');
  }, [showToast]);

  const handleToggleMobileMenu = useCallback(() => setMobileMenuOpen((o) => !o), []);
  const handleOpenSearch = useCallback(() => setIsCmdOpen(true), []);
  const handleCloseCmd = useCallback(() => setIsCmdOpen(false), []);
  const handleOpenResume = useCallback(() => setIsResumeOpen(true), []);
  const handleCloseResume = useCallback(() => setIsResumeOpen(false), []);
  const handleInspectProject = useCallback((id: ProjectItem['id']) => setActiveProjectModal(id), []);
  const handleCloseProject = useCallback(() => setActiveProjectModal(null), []);

  const visibleProjects = useMemo(
    () => PROJECTS.filter((p) => (projectFilter === 'all' ? true : p.categories.includes(projectFilter))),
    [projectFilter]
  );

  const visibleSkills = useMemo(
    () => SKILLS.filter((s) => (skillFilter === 'all' ? true : s.group === skillFilter)),
    [skillFilter]
  );

  return (
    <div className="app-shell" ref={appRootRef}>
      {/* ASCII Sky Background */}
      <AsciiSkyBackground />

      {/* Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={handleToggleMobileMenu}
        onNavigate={scrollToSection}
        onOpenSearch={handleOpenSearch}
      />

      <main>
        {/* Hero Section */}
        <HeroSection onNavigate={scrollToSection} />

        {/* Featured Projects */}
        <ProjectsSection
          projects={visibleProjects}
          projectFilter={projectFilter}
          onFilterChange={handleProjectFilterChange}
          onInspectProject={handleInspectProject}
          gridRef={projectsGridRef}
        />

        {/* Technical Stack */}
        <SkillsSection
          skills={visibleSkills}
          skillFilter={skillFilter}
          onFilterChange={handleSkillFilterChange}
          gridRef={skillsGridRef}
        />

        {/* Education */}
        <EducationSection education={EDUCATION} />

        {/* Experience */}
        <ExperienceSection experience={EXPERIENCE} />

        {/* Contact */}
        <ContactSection
          onCopyEmail={handleCopyEmail}
          onCopyPhone={handleCopyPhone}
          onFormSubmit={handleContactSubmit}
        />

        {/* Easter Egg: Blooming ASCII Lily Bouquet */}
        <EasterEggFlowers />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenResume={handleOpenResume}
      />

      {/* Modals & Dialogs */}
      <Modals
        activeProjectId={activeProjectModal}
        onCloseProject={handleCloseProject}
        isResumeOpen={isResumeOpen}
        onCloseResume={handleCloseResume}
        isCmdOpen={isCmdOpen}
        onCloseCmd={handleCloseCmd}
        onNavigate={scrollToSection}
        onCopyEmail={handleCopyEmail}
        onCopyPhone={handleCopyPhone}
        onOpenResume={handleOpenResume}
      />

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="toast" role="status" aria-live="polite">
          <span className="toast-dot" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
};

export default App;
