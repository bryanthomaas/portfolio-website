# Bryan Thomas — Portfolio & Systems Engineering Showcase

Personal engineering portfolio for **Bryan Thomas** (`@bryanthomaas`), Computer Engineering graduate from the **University of Cincinnati (CEAS)**.

Live at: [https://bryanthomas.dev](https://bryanthomas.dev) *(or localhost:8080)*

---

## Overview

This repository contains the source code for my personal engineering portfolio. It showcases full-stack web applications, developer tooling, 3D algorithms, and embedded systems research, built with a focus on performant rendering, tactile feedback, and accessible interface design.

### Core Highlights

- **Interactive 3D Pathfinding Engine**: A custom-built, isometric grid simulation featuring weighted pathfinding algorithms (A\*, Dijkstra, BFS, and Greedy Search) with dynamic terrain brushes (Walls, Mountains, Swamps), real-time cost telemetry, and a True Fullscreen Laboratory Mode.
- **Featured Projects Showcase**: Filterable gallery of real production systems and open-source tools with direct links to GitHub repositories, architecture breakdowns, and tech stack tags.
- **Technical Stack Arsenal**: Comprehensive matrix of programming languages, frameworks, cloud services, and developer tools with real-world production contexts.
- **Academic & Professional Timelines**: Single-file, chronological timelines highlighting verified degree credentials from the University of Cincinnati (CeDiD verified) and professional enterprise IT experience at Encore Technologies.
- **Command Palette & Keyboard Navigation**: <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>⌘K</kbd> quick navigation, interactive contact routing, and high-contrast color token architecture.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Animation & Transitions**: [GSAP 3](https://greensock.com/gsap/) (`ScrollTrigger`, `Flip`)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Styling Architecture**: Semantic Vanilla CSS with CSS custom properties (design tokens in `src/styles/tokens.css` and component rules in `src/styles/app.css`)
- **Deployment**: Static asset build optimized for Vercel, Netlify, or GitHub Pages

---

## Project Structure

```text
bryan-thomas-portfolio/
├── public/
│   ├── images/                 # Project screenshots and diagrams
│   ├── Bryan_Thomas_Resume.pdf # Printable PDF engineering resume
│   └── favicon.svg             # Custom SVG brand favicon
├── src/
│   ├── components/             # Modular UI components
│   │   ├── AlgoSandbox3D.tsx   # 3D Isometric pathfinding simulation engine
│   │   ├── AsciiSkyBackground.tsx # Lightweight ASCII ambient backdrop
│   │   ├── BrandLogo.tsx       # SVG vector brand mark
│   │   ├── ContactSection.tsx  # Direct communication & inquiry form
│   │   ├── EducationSection.tsx # Academic timeline & CeCredential verification
│   │   ├── ExperienceSection.tsx # Enterprise IT & research experience
│   │   ├── Footer.tsx          # Colophon, status, and external links
│   │   ├── HeroSection.tsx     # Intro bio and 3D preview cards
│   │   ├── Modals.tsx          # Command palette, project architecture, & resume
│   │   ├── Navbar.tsx          # Sticky navigation dock & mobile drawer
│   │   ├── ProjectCard.tsx     # Individual project card component
│   │   ├── ProjectsSection.tsx # Filterable featured projects grid
│   │   ├── ProjectVisuals.tsx  # Pipeline and metric project visualizers
│   │   └── SkillsSection.tsx   # Categorized technical stack cards
│   ├── data/
│   │   └── portfolioData.ts    # Centralized data model for projects, stack, & experience
│   ├── styles/
│   │   ├── app.css             # Component layout and responsive rules
│   │   └── tokens.css          # Color ramps, typography, and spacing tokens
│   ├── projects.config.ts      # Project metadata configuration
│   ├── App.tsx                 # Main application orchestrator
│   └── main.tsx                # React root entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bryanthomaas/bryan-thomas-portfolio.git
   cd bryan-thomas-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

   The application will be running at `http://localhost:8080`.

---

## Production Build

To compile a production-ready static build:

```bash
npm run build
```

This compiles TypeScript (`tsc -b`) and bundles static assets into `dist/`.

To preview the production build locally:

```bash
npm run preview
```

---

## License

MIT © [Bryan Thomas](https://github.com/bryanthomaas)
