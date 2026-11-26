import {
  PROJECTS,
  type ProjectCategory,
  type ProjectItem,
  type ProjectSpecSection,
  type ProjectVisualConfig
} from '../projects.config';

export {
  PROJECTS,
  type ProjectCategory,
  type ProjectItem,
  type ProjectSpecSection,
  type ProjectVisualConfig
};

export interface SkillItem {
  badge: string;
  name: string;
  categoryLabel: string;
  group: 'languages' | 'frontend' | 'backend' | 'ai-tools';
  context: string;
  heatLevel: number;
}

export interface EducationEntry {
  code: string;
  tag: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  gpaOrGrade: string;
  credentialId?: string;
  credentialUrl?: string;
  isVerifiedCredential?: boolean;
  points: string[];
}

export interface TimelineEntry {
  code: string;
  tag: string;
  role: string;
  org: string;
  period: string;
  location: string;
  credentialUrl?: string;
  credentialId?: string;
  points: string[];
  isVerifiedCredential?: boolean;
}

export const SKILLS: SkillItem[] = [
  // --- Languages & Core Systems ---
  {
    badge: 'TS',
    name: 'TypeScript',
    categoryLabel: 'Language',
    group: 'languages',
    context: 'End-to-end types across AlgoVision 2.0 and the Vault Ledger monorepo.',
    heatLevel: 5
  },
  {
    badge: 'JS',
    name: 'JavaScript (ES6+)',
    categoryLabel: 'Language',
    group: 'languages',
    context: 'Async APIs, browser performance, and HTML5 Canvas rendering.',
    heatLevel: 5
  },
  {
    badge: 'PY',
    name: 'Python (3.11+)',
    categoryLabel: 'Language',
    group: 'languages',
    context: 'FastAPI backends, Google GenAI SDK pipelines, and NumPy RF signal processing.',
    heatLevel: 5
  },
  {
    badge: 'C++',
    name: 'C++',
    categoryLabel: 'Language',
    group: 'languages',
    context: 'Data structures, systems coursework, and embedded motor control testing.',
    heatLevel: 5
  },
  {
    badge: 'JV',
    name: 'Java',
    categoryLabel: 'Language',
    group: 'languages',
    context: 'Backend service endpoints and automated API validation.',
    heatLevel: 4
  },
  {
    badge: 'SQL',
    name: 'SQL',
    categoryLabel: 'Language',
    group: 'languages',
    context: 'PostgreSQL 16 schema design, double-entry ledger queries, and indexing.',
    heatLevel: 5
  },
  {
    badge: 'VBA',
    name: 'VBA & Excel',
    categoryLabel: 'Language',
    group: 'languages',
    context: 'Automated hardware test calculations and campus parking permit audits.',
    heatLevel: 5
  },

  // --- Frontend & UI Engineering ---
  {
    badge: 'R19',
    name: 'React (18 / 19)',
    categoryLabel: 'Frontend UI',
    group: 'frontend',
    context: 'Interactive UIs for AlgoVision 2.0 and the Auto-Documenter web reader.',
    heatLevel: 5
  },
  {
    badge: 'RN',
    name: 'React Native & Expo',
    categoryLabel: 'Mobile Framework',
    group: 'frontend',
    context: 'Cross-platform mobile app development with Expo Router and biometric login.',
    heatLevel: 5
  },
  {
    badge: 'D3',
    name: 'React Native SVG & D3',
    categoryLabel: 'Visualization',
    group: 'frontend',
    context: 'Custom bezier curves and touch-scrubbable financial charts in Vault Ledger.',
    heatLevel: 5
  },
  {
    badge: 'GL',
    name: 'WebGL 2 & HTML5 Canvas',
    categoryLabel: 'Graphics',
    group: 'frontend',
    context: 'Custom 2D/3D isometric grid rendering and chart graphics.',
    heatLevel: 5
  },
  {
    badge: 'TW',
    name: 'Tailwind CSS',
    categoryLabel: 'Styling',
    group: 'frontend',
    context: 'Responsive layouts and dark-mode interfaces.',
    heatLevel: 5
  },
  {
    badge: 'GS',
    name: 'GSAP & Framer Motion',
    categoryLabel: 'Animation',
    group: 'frontend',
    context: 'Scroll animations, layout transitions, and 3D tile elevation effects.',
    heatLevel: 5
  },
  {
    badge: 'ZS',
    name: 'Zustand & TanStack Query',
    categoryLabel: 'State Management',
    group: 'frontend',
    context: 'Client state stores and cached API data syncing.',
    heatLevel: 5
  },
  {
    badge: 'MD',
    name: 'Mermaid.js & Lenis',
    categoryLabel: 'Diagrams & Motion',
    group: 'frontend',
    context: 'Zoomable dependency diagrams and smooth page scrolling.',
    heatLevel: 5
  },

  // --- Backend & Cloud Infrastructure ---
  {
    badge: 'F5',
    name: 'Fastify 5 & Node.js',
    categoryLabel: 'Backend Framework',
    group: 'backend',
    context: 'REST APIs, OpenAPI schemas, and transactional outbox workers.',
    heatLevel: 5
  },
  {
    badge: 'FA',
    name: 'FastAPI & Asyncio',
    categoryLabel: 'Async Python API',
    group: 'backend',
    context: 'Async Python workers, Pydantic validation, and Server-Sent Events (SSE).',
    heatLevel: 5
  },
  {
    badge: 'PG',
    name: 'PostgreSQL 16 & Drizzle',
    categoryLabel: 'Database & ORM',
    group: 'backend',
    context: 'Double-entry accounting tables, integer-cent storage, and type-safe queries.',
    heatLevel: 5
  },
  {
    badge: 'FB',
    name: 'Firebase (Firestore & Auth)',
    categoryLabel: 'Cloud Platform',
    group: 'backend',
    context: 'Real-time document storage, batch writes, and user authentication.',
    heatLevel: 5
  },
  {
    badge: 'DK',
    name: 'Docker & Docker Compose',
    categoryLabel: 'DevOps & Containers',
    group: 'backend',
    context: 'Containerized multi-service setups for local development and deployment.',
    heatLevel: 5
  },
  {
    badge: 'SSE',
    name: 'Server-Sent Events & REST',
    categoryLabel: 'API Architectures',
    group: 'backend',
    context: 'Live progress streaming from backend workers and RESTful API contracts.',
    heatLevel: 5
  },

  // --- AI Frameworks & Developer Tools ---
  {
    badge: 'AI',
    name: 'Google GenAI SDK (Gemini)',
    categoryLabel: 'AI & LLM Orchestration',
    group: 'ai-tools',
    context: 'Codebase documentation with Gemini 3.8 Flash and automatic rate-limit fallbacks.',
    heatLevel: 5
  },
  {
    badge: 'RF',
    name: 'LimeSDR, SoapySDR & GNU Radio',
    categoryLabel: 'Hardware & RF DSP',
    group: 'ai-tools',
    context: 'Baseband pulse transmission and raw I/Q signal capture for RF testing.',
    heatLevel: 5
  },
  {
    badge: 'AD',
    name: 'Active Directory & ITSM',
    categoryLabel: 'Enterprise IT',
    group: 'ai-tools',
    context: 'User account management, permissions, and enterprise ticket workflows.',
    heatLevel: 5
  },
  {
    badge: 'AZ',
    name: 'Microsoft 365 & Azure Cloud',
    categoryLabel: 'Cloud & Systems',
    group: 'ai-tools',
    context: 'Azure VM setup, Office 365 tenant admin, and Windows troubleshooting.',
    heatLevel: 5
  },
  {
    badge: 'NET',
    name: 'Network Diagnostics & Hardware',
    categoryLabel: 'Hardware & Systems',
    group: 'ai-tools',
    context: 'Network switch installation, Ethernet cabling, firewalls, and PCB bench testing.',
    heatLevel: 5
  },
  {
    badge: 'GIT',
    name: 'Git & Shallow Ingestion',
    categoryLabel: 'Developer Tooling',
    group: 'ai-tools',
    context: 'Automated shallow repo cloning (--depth 1), monorepo workflows, and version control.',
    heatLevel: 5
  }
];

export const EDUCATION: EducationEntry[] = [
  {
    code: 'CeDiploma Verified',
    tag: 'Conferred April 30, 2026',
    institution: 'University of Cincinnati — College of Engineering and Applied Science (CEAS)',
    degree: 'Bachelor of Science in Computer Engineering (B.S. Computer Engineering)',
    period: 'Aug 2021 – Apr 2026',
    location: 'Cincinnati, Ohio',
    gpaOrGrade: 'Cumulative GPA: 3.47',
    credentialId: '2680-FYHK-B9SQ',
    credentialUrl:
      'https://www.uc.edu/about/registrar/transcripts-diplomas-verifications/diplomas/cecredential/cecredential-validation.html',
    isVerifiedCredential: true,
    points: [
      'Graduated with a B.S. in Computer Engineering (3.47 GPA), focusing on computer architecture, algorithms, embedded systems, and software engineering.',
      'Certified Electronic Diploma (CeDiploma) verified by the University of Cincinnati Board of Trustees (CeDiD: 2680-FYHK-B9SQ).',
      'Signatories on record: Chair of the Board of Trustees; Michele A. Gillis, Secretary of the Board; Neville G. Pinto, President of the University; and the Interim Dean of CEAS.'
    ]
  },
  {
    code: 'CBSE Board Verified',
    tag: 'All-India Rank Top 7%',
    institution: 'Indian School Al Ghubra',
    degree: 'High School & Middle School — Computer and Information Sciences, General',
    period: '2010 – 2021',
    location: 'Muscat, Oman',
    gpaOrGrade: 'Grade: A+ · 93rd Percentile',
    points: [
      'Graduated with an A+ average, scoring in the 93rd percentile on both the 10th and 12th CBSE All-India Board Examinations.',
      'Studied Computer Science, Mathematics, and Physics, and competed in inter-school programming and informatics events.'
    ]
  }
];

export const EXPERIENCE: TimelineEntry[] = [
  {
    code: 'Current Role',
    tag: 'Enterprise IT & Cloud Support',
    role: 'Service Desk Analyst',
    org: 'Encore Technologies',
    period: 'Aug 2026 – Present',
    location: 'Cincinnati, Ohio',
    points: [
      'Troubleshoot Windows OS, packaged software, and account access issues for end users across multiple client companies.',
      'Use Active Directory, ITSM ticketing tools, and internal knowledge bases to diagnose problems and route escalations.',
      'Document symptoms, diagnostic steps, and fixes clearly in tickets while keeping users updated on progress.'
    ]
  },
  {
    code: 'Campus Operations',
    tag: 'Supervision & Logistics Automation',
    role: 'Lead Student Worker',
    org: 'University of Cincinnati (UC Parking Services)',
    period: 'Aug 2024 – Aug 2026',
    location: 'Cincinnati, Ohio',
    points: [
      'Supervised 8+ student workers managing campus parking lots, access lanes, and event traffic.',
      'Tracked hourly traffic during major campus events to balance open entry lanes and shorten vehicle wait times.',
      'Troubleshot broken gate and permit-validation hardware, automating incident reports to reduce downtime.',
      'Built Excel and VBA trackers to audit permit validation rates and spot recurring issues.'
    ]
  },
  {
    code: 'Software Co-op',
    tag: 'Agile Full-Stack Development',
    role: 'Full Stack Developer Intern',
    org: 'Prep Beta Solutions',
    period: 'May 2025 – Sep 2025',
    location: 'Lagos, Nigeria (Remote)',
    points: [
      'Built web application features in two-week sprints using React and Node.js on the frontend with Python and Java backend services.',
      'Wrote scripts to automate repetitive backend data tasks, cutting processing time by 25%.',
      'Added input and schema validation across Java, JavaScript, and TypeScript endpoints, keeping pipeline data accuracy at 99%.'
    ]
  },
  {
    code: 'Enterprise Co-op',
    tag: 'Multi-Facility Operations',
    role: 'Project Management Intern',
    org: 'EMCOR Facilities Services',
    period: 'Aug 2023 – Dec 2023',
    location: 'Cincinnati, Ohio (Hybrid)',
    points: [
      'Audited facility maintenance programs for industrial clients and documented verified contract cost savings.',
      'Coordinated project schedules between sales managers and field technicians across multi-state client sites.',
      'Maintained job tracking, compliance paperwork, and equipment records for industrial facilities.'
    ]
  },
  {
    code: 'Data Systems',
    tag: 'Medical Database Accreditation',
    role: 'Student Worker — Research Logix',
    org: 'University of Cincinnati Cancer Center',
    period: 'May 2023 – Jan 2024',
    location: 'Cincinnati, Ohio',
    points: [
      'Looked up medical trainees\' publications, clinical credentials, and career outcomes across research databases.',
      'Organized trainee records in Research Logix for institutional accreditation reviews and grant reporting.',
      'Ran regular data audits to fix missing fields and keep researcher profiles accurate.'
    ]
  },
  {
    code: 'Academic Mentorship',
    tag: 'Engineering Computing & Logic',
    role: 'Teaching Assistant',
    org: 'University of Cincinnati',
    period: 'Jan 2023 – Apr 2023',
    location: 'Cincinnati, Ohio',
    points: [
      'Helped undergraduate engineering students complete weekly programming labs in Python and Excel VBA.',
      'Held weekly office hours to walk students through data structures, program logic, and debugging.',
      'Graded student code and lab assignments for correctness, logic, and readability.'
    ]
  },
  {
    code: 'Embedded Co-op',
    tag: 'Motor Controls & PCB Testing',
    role: 'Computer Engineering Intern',
    org: 'Regal Rexnord',
    period: 'Aug 2022 – Dec 2022',
    location: 'Fort Wayne, Indiana',
    points: [
      'Wrote automated test scripts for embedded motor controllers, cutting hardware QA testing time by 15%.',
      'Worked with electrical engineers to bench-test and validate PCB layouts for industrial power transmission units.',
      'Ran component reliability tests and logged hardware failure modes in the engineering bug tracker.',
      'Automated test-rig data collection and math routines using Excel VBA.'
    ]
  },
  {
    code: 'Infrastructure Co-op',
    tag: 'Azure & Network Administration',
    role: 'IT Support Intern',
    org: 'Decoding IT Solutions',
    period: 'May 2022 – Aug 2022',
    location: 'Muscat, Oman',
    points: [
      'Set up Azure virtual machines and configured Microsoft 365 user accounts for client deployments.',
      'Installed network switches, terminated Ethernet cables, and configured basic firewall rules.',
      'Resolved hands-on IT support tickets for Windows OS errors, driver issues, and software updates.',
      'Wrote internal troubleshooting guides for common fixes to speed up first-contact resolution.'
    ]
  }
];

export const TIMELINE: TimelineEntry[] = EXPERIENCE;

export const RESUME_DATA = {
  name: 'Bryan Thomas',
  headline:
    'B.S. in Computer Engineering @ University of Cincinnati (GPA: 3.47) · Full-Stack Systems & AI Developer',
  location: 'Cincinnati, OH',
  email: 'thoma3ba@mail.uc.edu',
  phone: '+1 (513) 837-6339',
  phoneLabel: '+1 (513) 837-6339',
  linkedin: 'https://www.linkedin.com/in/bryanthomas543/',
  linkedinLabel: 'linkedin.com/in/bryanthomas543',
  github: 'https://github.com/bryanthomaas',
  githubLabel: 'github.com/bryanthomaas',
  pdfUrl: '/Bryan_Thomas_Resume.pdf',
  workAvailability:
    'Full-time roles in Software Engineering, AI Systems, and Distributed Infrastructure',
  currentRole: 'Service Desk Analyst at Encore Technologies',
  education: [
    {
      institution:
        'University of Cincinnati — College of Engineering and Applied Science (CEAS)',
      location: 'Cincinnati, OH',
      degree: 'Bachelor of Science in Computer Engineering (B.S. Computer Engineering)',
      gpa: '3.47',
      period: 'Aug 2021 – Apr 2026',
      conferralDate: 'April 30, 2026',
      credentialType: 'Certified Electronic Diploma (CeDiploma)',
      ceDiD: '2680-FYHK-B9SQ',
      validationAuthority: 'The Board of Trustees of the University of Cincinnati',
      verificationUrl:
        'https://www.uc.edu/about/registrar/transcripts-diplomas-verifications/diplomas/cecredential/cecredential-validation.html',
      details: 'Cumulative GPA: 3.47 · Validated by Board of Trustees (CeDiD: 2680-FYHK-B9SQ)'
    },
    {
      institution: 'Indian School Al Ghubra',
      location: 'Muscat, Oman',
      degree: 'High School & Middle School — Computer and Information Sciences, General',
      gpa: 'Grade: A+ (93rd Percentile)',
      period: '2010 – 2021',
      details: 'Grade: A+ · 93rd Percentile in 10th and 12th CBSE All-India Board Examinations'
    }
  ],
  skills: [
    {
      label: 'Languages:',
      value: ' TypeScript, JavaScript (ES6+), Python (3.11+), C++, Java, SQL, VBA'
    },
    {
      label: 'Frontend & UI:',
      value:
        ' React (18/19), React Native (Expo Router), React Native SVG, D3-Shape, WebGL 2, Zustand, TanStack Query, Vite, Tailwind CSS, Framer Motion, GSAP, Lenis, Mermaid.js'
    },
    {
      label: 'Backend & APIs:',
      value:
        ' Fastify 5, FastAPI, Node.js, Asyncio, Pydantic v2, REST APIs, OpenAPI, Server-Sent Events (SSE), Monorepos'
    },
    {
      label: 'Data & Storage:',
      value: ' PostgreSQL 16, Drizzle ORM, Firebase (Firestore, Auth)'
    },
    {
      label: 'AI & Systems:',
      value:
        ' Google GenAI SDK (google-genai), Gemini 3.8 Flash, Gemini 3.5 Flash Lite, Gemini 1.5 Pro, AST Parsing'
    },
    {
      label: 'Hardware & SDR:',
      value:
        ' LimeSDR, SoapySDR, Lime Suite, GNU Radio, NumPy Signal Processing, Embedded Motor Testing, PCB Validation'
    },
    {
      label: 'DevOps & IT:',
      value:
        ' Docker, Docker Compose, Git (--depth 1), Active Directory, ITSM Workflows, Microsoft 365, Azure Cloud'
    }
  ],
  // Automatically generated from `src/projects.config.ts` so all details stay in sync!
  projects: PROJECTS.filter((p) => p.includeInResume !== false).map((p) => ({
    title: `${p.title} — ${p.subtitle}`,
    stack: p.tags.join(', '),
    bullets: p.bullets
  })),
  experience: [
    {
      role: 'Service Desk Analyst',
      org: 'Encore Technologies',
      period: 'Aug 2026 – Present',
      location: 'Cincinnati, OH',
      lead: 'Enterprise Systems & Directory Support:',
      text: ' Troubleshoot Windows OS, packaged software, and account access issues across multiple client companies using Active Directory, ITSM ticketing tools, and internal knowledge bases.'
    },
    {
      role: 'Lead Student Worker',
      org: 'University of Cincinnati (UC Parking Services)',
      period: 'Aug 2024 – Aug 2026',
      location: 'Cincinnati, OH',
      lead: 'Operations Leadership & Gate Hardware Diagnostics:',
      text: ' Supervised 8+ student workers, tracked hourly event traffic to balance open entry lanes, troubleshot broken gate and permit-validation hardware, and built Excel/VBA trackers to audit permit validation rates.'
    },
    {
      role: 'Full Stack Developer Intern',
      org: 'Prep Beta Solutions',
      period: 'May 2025 – Sep 2025',
      location: 'Remote',
      lead: 'Agile Full-Stack Development:',
      text: ' Built web features in two-week sprints using React and Node.js with Python and Java backend services; automated data tasks to cut processing time by 25% and kept pipeline accuracy at 99%.'
    },
    {
      role: 'Project Management Intern',
      org: 'EMCOR Facilities Services',
      period: 'Aug 2023 – Dec 2023',
      location: 'Cincinnati, OH',
      lead: 'Multi-Facility Project Operations:',
      text: ' Audited facility maintenance programs for industrial clients, maintained compliance paperwork, and coordinated project schedules across multi-state sites.'
    },
    {
      role: 'Student Worker — Research Logix',
      org: 'University of Cincinnati Cancer Center',
      period: 'May 2023 – Jan 2024',
      location: 'Cincinnati, OH',
      lead: 'Accreditation Data Management:',
      text: ' Looked up medical trainees\' publications and clinical credentials, organized records in Research Logix for accreditation reviews, and ran regular data audits.'
    },
    {
      role: 'Teaching Assistant (Engineering Computing & Logic)',
      org: 'University of Cincinnati',
      period: 'Jan 2023 – Apr 2023',
      location: 'Cincinnati, OH',
      lead: 'Academic Mentorship:',
      text: ' Helped undergraduate engineering students complete weekly programming labs in Python and Excel VBA, held office hours on debugging and data structures, and graded lab submissions.'
    },
    {
      role: 'Computer Engineering Intern',
      org: 'Regal Rexnord',
      period: 'Aug 2022 – Dec 2022',
      location: 'Fort Wayne, IN',
      lead: 'Embedded Motor Testing & PCB Validation:',
      text: ' Wrote automated test scripts for embedded motor controllers (cutting QA testing time by 15%), bench-tested PCB layouts, and automated test-rig data collection in Excel VBA.'
    },
    {
      role: 'IT Support Intern',
      org: 'Decoding IT Solutions',
      period: 'May 2022 – Aug 2022',
      location: 'Muscat, Oman',
      lead: 'Cloud Infrastructure & Networking:',
      text: ' Set up Azure virtual machines, configured Microsoft 365 user accounts, installed network switches, resolved Windows OS support tickets, and wrote internal troubleshooting guides.'
    }
  ]
};
