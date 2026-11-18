/**
 * ============================================================================
 * EASY PROJECT CONFIGURATION FILE (src/projects.config.ts)
 * ============================================================================
 *
 * Single source of truth for all Featured Projects across the portfolio.
 * Both the main website cards and the printable Engineering Resume modal
 * auto-synchronize with this file.
 */

export type ProjectCategory = 'ai-cloud' | 'fullstack' | 'frontend-3d' | 'hardware-rf';

export interface ProjectSpecSection {
  heading: string;
  items: { lead: string; text: string }[];
}

export type ProjectVisualConfig =
  | {
      type: 'image';
      imageUrl: string;
      imageAlt?: string;
    }
  | {
      type: 'pipeline';
      steps: { title: string; subtitle: string }[];
    }
  | {
      type: 'metrics';
      headlineLabel: string;
      headlineValue: string;
      delta?: string;
      badge?: string;
      pills: string[];
    }
  | {
      type: 'signal';
      formula: string;
      formulaSub: string;
      leftNode: { title: string; subtitle: string };
      rightNode: { title: string; subtitle: string };
      waveLabels: [string, string];
      pills: string[];
    };

export interface ProjectItem {
  id: string;
  code: string;
  domainTag: string;
  categories: ProjectCategory[];
  title: string;
  subtitle: string;
  repo: string;
  visual?: ProjectVisualConfig;
  description: string;
  bullets: string[];
  tags: string[];
  specSections: ProjectSpecSection[];
  includeInResume?: boolean;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'auto-documenter',
    code: 'Full Stack & Systems',
    domainTag: 'Python 3.11 · FastAPI · Gemini · SSE',
    categories: ['ai-cloud', 'fullstack'],
    title: 'Auto Codebase Documenter',
    subtitle: 'Automated Documentation & Dependency Mapper for GitHub Repos',
    repo: 'https://github.com/bryanthomaas/Auto-Documenter',
    visual: {
      type: 'image',
      imageUrl: '/images/auto-documenter.png',
      imageAlt: 'Auto Codebase Documenter interface screenshot'
    },
    description:
      'Paste in any public GitHub repository URL and get a plain-English breakdown of its modules, exported functions, and interactive Mermaid dependency diagrams.',
    bullets: [
      'Tested on 50+ public repositories with an average generation time under 2.5 minutes, cutting the time it takes to map out an unfamiliar codebase by roughly 85%.',
      'Runs in two modes: a fast offline mode that reads manifest files (package.json, pyproject.toml, go.mod, Cargo.toml) and local imports with zero API calls, and a deep mode that uses gemini-3.8-flash (falling back to gemini-3.5-flash-lite on 429/503 rate limits) to explain what each module and API route does.',
      'Uses FastAPI background workers to stream live progress (CLONING → ANALYZING → SYNTHESIZING → PACKAGING) over Server-Sent Events (SSE), with a 150,000-line cap and automatic temp-folder cleanup so large repos don\'t crash the server.'
    ],
    tags: [
      'Python 3.11',
      'FastAPI',
      'Google GenAI SDK',
      'Gemini 3.8 Flash',
      'Server-Sent Events',
      'React 18',
      'Mermaid.js',
      'Docker'
    ],
    specSections: [
      {
        heading: 'Repo Ingestion & Gemini Fallback',
        items: [
          {
            lead: 'Fast Scope (Offline):',
            text: ' Clones shallow trees (--depth 1) via GitPython and maps internal imports directly from manifest files (package.json, requirements.txt, pyproject.toml, go.mod, Cargo.toml) with zero API calls.'
          },
          {
            lead: 'In-Depth Scope (Gemini AI):',
            text: ' Uses the official Google GenAI SDK (google-genai) with gemini-3.8-flash and automatic failover to gemini-3.5-flash-lite when rate-limited (HTTP 429/503).'
          },
          {
            lead: 'Live Progress Streaming:',
            text: ' FastAPI async workers stream job stages (CLONING → ANALYZING → SYNTHESIZING → PACKAGING) to the browser in real time over Server-Sent Events.'
          }
        ]
      },
      {
        heading: 'Guardrails & Web Reader',
        items: [
          {
            lead: 'Pipeline Guardrails:',
            text: ' Enforces a 150,000-line cap per repository and deletes temporary scratch directories after each run to prevent disk or token exhaustion.'
          },
          {
            lead: 'Reader Interface:',
            text: ' 7-section web reader with Ctrl+K fuzzy search, smooth Lenis scrolling, zoomable Mermaid flowcharts, and raw Markdown export.'
          },
          {
            lead: 'Docker Packaging:',
            text: ' Packaged with Docker and Docker Compose so the backend and frontend run identically locally or in the cloud.'
          }
        ]
      }
    ]
  },
  {
    id: 'algo-visualizer',
    code: 'Frontend & Algorithm Engine',
    domainTag: 'React 19 · Vite · Framer Motion',
    categories: ['frontend-3d', 'fullstack'],
    title: '3D Isometric AlgoVisualizer',
    subtitle: 'Interactive 3D Pathfinding & Maze Generator',
    repo: 'https://github.com/bryanthomaas/Algo-Visualizer',
    visual: {
      type: 'image',
      imageUrl: '/images/algo-visualizer.png',
      imageAlt: '3D Isometric AlgoVisualizer interface screenshot'
    },
    description:
      'Visualizes classic 2D pathfinding algorithms on an isometric 3D grid where tiles rise up as the search explores them, built with React 19, Vite, and Framer Motion.',
    bullets: [
      'Renders a 2D grid in an isometric 3D view on HTML5 Canvas, animating tile height as algorithms search and lock in a final route.',
      'Includes 8 pathfinding algorithms (Dijkstra, A* Manhattan/Euclidean, BFS, DFS, Greedy Best-First, Jump Point Search, Bidirectional BFS, and Swarm) and 4 maze generators (Cellular Automata, Kruskal\'s, Recursive Division, and Weighted Scatter).',
      'Lets you paint weighted terrain (Swamps at cost 5, Mountains at cost 10), compare any algorithm\'s route against Dijkstra\'s optimal path, and scrub forward or backward through the search step by step.'
    ],
    tags: [
      'React 19',
      'TypeScript',
      'Vite',
      'Framer Motion',
      'HTML5 Canvas',
      'Tailwind CSS',
      'Graph Theory'
    ],
    specSections: [
      {
        heading: 'Pathfinding Algorithms & Optimization',
        items: [
          {
            lead: 'Dijkstra & A* Heuristics:',
            text: ' Finds the guaranteed cheapest path across weighted grids using Dijkstra\'s baseline alongside Manhattan and Euclidean A* heuristics.'
          },
          {
            lead: 'Search Optimization:',
            text: ' Includes Jump Point Search (JPS) to skip redundant open-grid tiles and Bidirectional BFS to search from start and goal simultaneously.'
          },
          {
            lead: 'Additional Solvers:',
            text: ' Breadth-First Search (BFS), Depth-First Search (DFS), Greedy Best-First Search, and a multi-agent Swarm model.'
          }
        ]
      },
      {
        heading: 'Maze Generators & Playback Telemetry',
        items: [
          {
            lead: '4 Maze Generators:',
            text: ' Cellular Automata, Randomized Kruskal\'s, Recursive Division, and Weighted Random Scatter.'
          },
          {
            lead: 'Weighted Terrain:',
            text: ' Interactive brush for Swamps (cost 5), Mountains (cost 10), and Walls, rendered with dynamic 3D tile height.'
          },
          {
            lead: 'Playback & Telemetry:',
            text: ' Tracks visited node counts and total path cost in real time, validates optimality against Dijkstra\'s baseline, and supports frame-by-frame timeline scrubbing.'
          }
        ]
      }
    ]
  },
  {
    id: 'vault-ledger',
    code: 'Mobile & Full-Stack Architect',
    domainTag: 'React Native · Fastify 5 · PostgreSQL 16',
    categories: ['fullstack'],
    title: 'Vault Ledger',
    subtitle: 'Double-Entry Personal Finance & Cash Flow Forecaster',
    repo: 'https://github.com/bryanthomaas/Vault-Ledger',
    visual: {
      type: 'image',
      imageUrl: '/images/vault-ledger.png',
      imageAlt: 'Vault Ledger mobile dashboard screenshot'
    },
    description:
      'A mobile and backend personal finance app built in a TypeScript monorepo. It uses a real double-entry accounting ledger instead of simple balance columns and simulates future cash flow based on past spending.',
    bullets: [
      'Stores every transaction as balanced debit and credit entries in integer cents (bigint in PostgreSQL 16, number in TypeScript) so balances never suffer from floating-point rounding errors.',
      'Runs background workers via a transactional outbox to handle automated spare-change round-ups and savings splits, using database idempotency keys so a round-up never triggers an infinite loop of new round-ups.',
      'Includes a Monte Carlo forecaster that runs 1,000 simulations from your historical spending habits to show pessimistic (p10), median (p50), and optimistic (p90) net-worth projections alongside recurring bills.',
      'Secured with Face ID / Touch ID (expo-local-authentication) and Argon2id password hashing, plus an offline demo mode pre-loaded with 18 months of sample transactions.'
    ],
    tags: [
      'React Native (Expo)',
      'Fastify 5',
      'PostgreSQL 16',
      'Drizzle ORM',
      'TypeScript',
      'Zustand',
      'TanStack Query',
      'Argon2id',
      'Docker'
    ],
    specSections: [
      {
        heading: 'Double-Entry Ledger & Outbox Workers',
        items: [
          {
            lead: 'Double-Entry Accounting:',
            text: ' Replaces mutable balance columns with immutable journal records where every transaction writes equal debits and credits in integer cents (bigint in PostgreSQL, number in TypeScript).'
          },
          {
            lead: 'Transactional Outbox:',
            text: ' Background workers process automated round-ups and balance sweeps asynchronously, guarded by database idempotency keys against duplicate runs.'
          },
          {
            lead: 'Shared Monorepo:',
            text: ' Shares Drizzle ORM schemas, OpenAPI specs, and validation types between the React Native (Expo) app and Fastify 5 API via npm workspaces.'
          }
        ]
      },
      {
        heading: 'Cash Flow Forecasting & Device Security',
        items: [
          {
            lead: '1,000-Path Monte Carlo Forecaster:',
            text: ' Simulates 1,000 future spending paths from historical transaction velocity to plot p10, p50, and p90 net-worth projections.'
          },
          {
            lead: 'Interactive Charts:',
            text: ' Gesture-driven net-worth charts built with React Native SVG and D3-Shape so users can scrub through past and projected balances.'
          },
          {
            lead: 'Biometric Login & Sandbox:',
            text: ' Uses Face ID / Touch ID via expo-local-authentication, Argon2id password hashing, JWT sessions, and an offline sandbox seeded with 18 months of sample data.'
          }
        ]
      }
    ]
  },
  {
    id: 'wearable-sensor',
    code: 'Senior Design Capstone',
    domainTag: 'LimeSDR · SoapySDR · NumPy · GNU Radio',
    categories: ['hardware-rf'],
    title: 'Wireless Wearable RF Sensors: Time-of-Flight (ToF)',
    subtitle: 'SDR Distance Measurement & Hardware Post-Mortem',
    repo: 'https://github.com/bryanthomaas/Wearable-Strain-Sensor',
    visual: {
      type: 'image',
      imageUrl: '/images/rf-sensor-tof.svg',
      imageAlt: 'LimeSDR RF Time-of-Flight distance measurement schematic'
    },
    description:
      'My senior design capstone: we tried to measure distance between a LimeSDR radio and a passive wearable antenna using RF Time-of-Flight, and documented the physical hardware limits that break short-range SDR measurement.',
    bullets: [
      'Calculated target distance from round-trip radio signal delay using d = (c * t) / 2, where a 1-meter distance requires resolving roughly 6.67 nanoseconds.',
      'Wrote baseband pulse transmission and raw I/Q signal processing scripts in Python, NumPy, and GNU Radio via the SoapySDR interface.',
      'Authored an engineering post-mortem explaining two major hardware bottlenecks: "The Half-Duplex Blind Spot" (TX/RX switching and USB buffer latency taking longer than the nanosecond signal return) and "The Dielectric Nightmare" (saltwater in the human body detuning the wearable antenna\'s resonant frequency).'
    ],
    tags: [
      'LimeSDR',
      'SoapySDR API',
      'Lime Suite',
      'GNU Radio',
      'Python',
      'NumPy',
      'RF Signal Processing'
    ],
    specSections: [
      {
        heading: 'Measurement Math & SDR Pipeline',
        items: [
          {
            lead: 'Time-of-Flight Calculation:',
            text: ' Measures distance via d = (c * t) / 2 where c ≈ 299,792,458 m/s. Over a 1-meter target distance (2-meter round trip), the return delay is roughly 6.67 nanoseconds.'
          },
          {
            lead: 'SDR Signal Pipeline:',
            text: ' Programmed baseband pulse generation, TX/RX scheduling, and raw I/Q signal processing in Python, NumPy, and GNU Radio through SoapySDR.'
          }
        ]
      },
      {
        heading: 'Hardware Post-Mortem Findings',
        items: [
          {
            lead: 'The Half-Duplex Blind Spot:',
            text: ' Documented how TX/RX switching on half-duplex SDR hardware hides short-range returns because PLL settling and USB buffer delays are far longer than the nanosecond signal round trip.'
          },
          {
            lead: 'The Dielectric Nightmare:',
            text: ' Measured how proximity to saltwater in the human body shifts the wearable antenna\'s resonant frequency and causes severe impedance mismatch.'
          }
        ]
      }
    ]
  }
];
