import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { Footer } from './components/Footer';
import { Modals } from './components/Modals';

import { PROJECTS, SKILLS, EDUCATION, EXPERIENCE, type ProjectItem } from './data/portfolioData';

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);

/**
 * Main application orchestrator managing global theme, Lenis smooth scrolling,
 * GSAP ScrollTrigger/Flip animations, section spy, and modal overlays.
 */
export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('bt-portfolio-theme');
    return saved === 'light' ? 'light' : 'dark';
  });

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
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bt-portfolio-theme', theme);
  }, [theme]);

  // Brand SVG Favicon
  useEffect(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect x="2" y="2" width="60" height="60" rx="8" fill="#250104" stroke="#CDF73D" stroke-width="3.5"/><rect x="7" y="7" width="50" height="50" rx="5" stroke="#D71A06" stroke-width="1.5" stroke-opacity="0.7"/><path d="M14 16H27.5C32 16 35 18.4 35 22.2C35 25 33.3 27 30.5 27.8C33.8 28.6 36 31 36 34.5C36 39 32.3 42 27 42H14V16ZM20.2 21V26H26.2C28 26 29.2 25 29.2 23.5C29.2 22 28 21 26.2 21H20.2ZM20.2 30.5V36.8H26.8C28.6 36.8 30 35.7 30 33.7C30 31.7 28.6 30.5 26.8 30.5H20.2Z" fill="#D71A06"/><path d="M32 16H51V21.5H44.5V48H38.5V21.5H32V16Z" fill="#CDF73D"/><path d="M17 42V48L22 51H31" stroke="#CDF73D" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter"/><rect x="30" y="48.5" width="5" height="5" fill="#CDF73D"/><rect x="47" y="28" width="4.5" height="4.5" fill="#D71A06"/></svg>`;
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = dataUri;
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(next === 'dark' ? 'Switched to Dark Mode' : 'Switched to Light Mode');
      return next;
    });
  }, [showToast]);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5
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
    const id = selector.replace(/^#/, '');
    if (activeSectionRef.current !== id) {
      activeSectionRef.current = id;
      setActiveSection(id);
    }
    const target = document.getElementById(id) || document.querySelector<HTMLElement>(selector);
    if (!target) return;

    navLockRef.current = true;
    if (navLockTimerRef.current) window.clearTimeout(navLockTimerRef.current);
    navLockTimerRef.current = window.setTimeout(() => {
      navLockRef.current = false;
    }, 900);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(id === 'hero' ? 0 : target, {
        offset: 0,
        duration: 0.8,
        force: true,
        onComplete: () => {
          navLockRef.current = false;
          if (activeSectionRef.current !== id) {
            activeSectionRef.current = id;
            setActiveSection(id);
          }
        }
      });
    } else {
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

      const sections = ['hero', 'projects', 'skills', 'education', 'experience', 'contact'];
      sections.forEach((id, index) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          refreshPriority: -index,
          onToggle: (self) => {
            if (self.isActive && !navLockRef.current && activeSectionRef.current !== id) {
              activeSectionRef.current = id;
              setActiveSection(id);
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
  const handleProjectFilterChange = (nextFilter: ProjectFilter) => {
    if (nextFilter === projectFilter) return;
    if (projectsGridRef.current) {
      flipProjectStateRef.current = Flip.getState(
        projectsGridRef.current.querySelectorAll('.project-flip-item')
      );
    }
    setProjectFilter(nextFilter);
  };

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
  const handleSkillFilterChange = (nextFilter: SkillFilter) => {
    if (nextFilter === skillFilter) return;
    if (skillsGridRef.current) {
      flipSkillStateRef.current = Flip.getState(
        skillsGridRef.current.querySelectorAll('.skill-flip-item')
      );
    }
    setSkillFilter(nextFilter);
  };

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

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  const visibleProjects = PROJECTS.filter((p) =>
    projectFilter === 'all' ? true : p.categories.includes(projectFilter)
  );

  const visibleSkills = SKILLS.filter((s) =>
    skillFilter === 'all' ? true : s.group === skillFilter
  );

  return (
    <div className="app-shell" ref={appRootRef}>
      {/* ASCII Sky Background */}
      <AsciiSkyBackground />

      {/* Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((o) => !o)}
        onNavigate={scrollToSection}
        onOpenSearch={() => setIsCmdOpen(true)}
      />

      <main>
        {/* Hero Section */}
        <HeroSection onNavigate={scrollToSection} />

        {/* Featured Projects */}
        <ProjectsSection
          projects={visibleProjects}
          projectFilter={projectFilter}
          onFilterChange={handleProjectFilterChange}
          onInspectProject={(id) => setActiveProjectModal(id)}
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
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Modals & Dialogs */}
      <Modals
        activeProjectId={activeProjectModal}
        onCloseProject={() => setActiveProjectModal(null)}
        isResumeOpen={isResumeOpen}
        onCloseResume={() => setIsResumeOpen(false)}
        isCmdOpen={isCmdOpen}
        onCloseCmd={() => setIsCmdOpen(false)}
        onNavigate={(href) => scrollToSection(href)}
        onToggleTheme={toggleTheme}
        onCopyEmail={handleCopyEmail}
        onCopyPhone={handleCopyPhone}
        onOpenResume={() => setIsResumeOpen(true)}
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
