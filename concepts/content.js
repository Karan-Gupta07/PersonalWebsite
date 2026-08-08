// Shared content for all theme mockups. Single source of truth so the four
// concepts can be compared on layout alone, not on content drift.

export const meta = {
  name: 'Karan Gupta',
  tagline: 'Computer Engineering + Econ minor @ Waterloo',
  gpa: '3.95 / 4.00',
  location: 'Waterloo, ON',
  rev: 'Rev 4.2',
  date: 'August 2026',
  email: 'k79gupta@uwaterloo.ca',
  linkedin: 'https://www.linkedin.com/in/karan-gupta-2b72a735a/',
  github: 'https://github.com/Karan-Gupta07',
  letterboxd: 'https://letterboxd.com/Exoxeon/',
  aoty: 'https://www.albumoftheyear.org/user/exoxoen/',
  discord: 'exo1k',
  resume: '/KaranGuptaResume.pdf',
  disciplines: ['software', 'computer vision', 'ai agents', 'automation'],
};

// Front-matter card. Facts only, drawn from the sections below.
export const bio = [
  'Computer Engineering at the University of Waterloo, with an Economics minor and a 3.95 GPA.',
  'Right now I build multi-step AI agents at Amazon that migrate legacy Java services, and I lead evaluation on Wat.ai TRACE, an agent reliability engine.',
  'Before that: telemetry and Salesforce work at Manulife, computer vision for UAV autonomy at the Waterloo Aerial Robotics Group, and 35 custom keyboards built and sold by hand.',
  'I like problems where the answer has a number attached. Every figure on these cards was measured.',
];

export const experience = [
  {
    org: 'Amazon',
    role: 'Software Development Engineer Intern',
    period: 'May 2026 — Present',
    start: '2026.05',
    headline: 'Cut legacy service migration from two weeks to one hour',
    metric: { value: '98%', label: 'less migration time' },
    bullets: [
      'Reduced legacy service migration time by 98% (2 weeks to 1 hour per stage) by building multi-step AI agents using prompt chaining and CoT reasoning to automate Java architecture transformation across thousands of lines.',
      'Architected an agentic RAG pipeline with few-shot prompting to achieve 92% translation accuracy across legacy API calls, algorithm structures, and AWS cloud deployment patterns into modernized service frameworks.',
      'Developed a pluggable natural language interface enabling on-demand algorithm adjustments during automated migration, allowing seamless integration with modern service handlers without manual intervention.',
    ],
    specs: [
      ['Migration time', '1 hr', '2 wk', 'per stage, Java service'],
      ['Translation accuracy', '92%', '—', 'agentic RAG, few-shot'],
    ],
    tags: ['AI agents', 'RAG', 'Java', 'AWS'],
  },
  {
    org: 'Wat.ai',
    unit: 'TRACE Subteam',
    role: 'AI Software Engineer, Evaluation Lead',
    period: 'May 2026 — Present',
    start: '2026.05',
    headline: 'Built an agent reliability engine that finds its own root causes',
    metric: { value: '70%', label: 'faster root-cause' },
    bullets: [
      'Engineered TRACE, an AI agent reliability engine that automates multi-step execution tracing and failure isolation, reducing root-cause diagnostic latency by 70% for complex RAG and tool-use workflows.',
      'Eliminated 95% of runtime non-determinism across 4 downstream production applications by architecting a canonical verifier interface and Pydantic schemas to enforce strict data contracts over subjective LLM logic.',
      'Enforced 100% compliance for financial-action workflows by deploying a high-throughput, 7-check deterministic execution engine that intercepts policy violations and eliminates manual operational triage.',
    ],
    specs: [
      ['Diagnostic latency', '−70%', '—', 'RAG + tool-use workflows'],
      ['Runtime non-determinism', '−95%', '—', '4 downstream apps'],
      ['Policy compliance', '100%', '—', '7-check exec engine'],
    ],
    tags: ['Python', 'Pydantic', 'evaluation', 'reliability'],
  },
  {
    org: 'Manulife Financial',
    role: 'Software Engineering Intern',
    period: 'January 2026 — April 2026',
    start: '2026.01',
    headline: 'Caught resource bottlenecks before they became outages',
    metric: { value: '20+', label: 'anomalies surfaced' },
    bullets: [
      'Reduced system downtime risk by scripting a New Relic data exporter and architecting NRQL queries, enabling early detection of 3+ resource bottlenecks before system failure.',
      'Designed a Python analysis script and SQL telemetry pipeline to process clickstream data, identifying 20+ suspicious user anomalies by applying mathematical modeling and cross-referencing behavioral logs.',
      'Implemented 15+ Salesforce features to automate data entry during document uploads for specialized lending workflows, reducing manual input for high-value client processing using Apex and LWC.',
    ],
    specs: [
      ['Bottlenecks detected', '3+', '—', 'pre-failure, NRQL'],
      ['User anomalies flagged', '20+', '—', 'clickstream, SQL pipeline'],
      ['Salesforce features', '15+', '—', 'Apex + LWC'],
    ],
    tags: ['Python', 'SQL', 'New Relic', 'Apex'],
  },
  {
    org: 'Waterloo Aerial Robotics Group',
    role: 'Autonomy Software Developer',
    period: 'Sep 2025 — Present',
    start: '2025.09',
    headline: 'Tuned real-time vision and telemetry for UAV autonomy',
    metric: { value: '13%', label: 'better detection' },
    bullets: [
      'Improved real-time signal detection accuracy by 13% using OpenCV2 computer vision algorithms through iterative parameter tuning and validation.',
      'Built multi-process telemetry and command systems in Python (PyMAVLink) to simulate UAV communication, reducing message latency by 30% across distributed processes.',
    ],
    specs: [
      ['Detection accuracy', '+13%', '—', 'OpenCV2, tuned params'],
      ['Message latency', '−30%', '—', 'multi-process PyMAVLink'],
    ],
    tags: ['OpenCV', 'PyMAVLink', 'UAV'],
  },
  {
    org: 'C2C Development Holdings',
    role: 'Computer Support Specialist',
    period: 'May 2022 — Sep 2025',
    start: '2022.05',
    headline: 'Automated 700+ customer conversations with a bot',
    metric: { value: '700+', label: 'interactions automated' },
    bullets: [
      'Engineered a Python-based automation bot that auto-responded to Facebook Marketplace messages, improving response time by over 70% and automating 700+ customer interactions.',
      'Provided technical support in database management, hardware setup, and network troubleshooting.',
    ],
    specs: [
      ['Response time', '−70%', '—', 'automation bot'],
      ['Interactions handled', '700+', '—', 'Facebook Marketplace'],
    ],
    tags: ['Python', 'automation', 'support'],
  },
  {
    org: 'Custom Gaming Keyboards',
    role: 'Founder & Operator',
    period: 'Sep 2022 — Present',
    start: '2022.09',
    headline: 'Designed, built and sold 35 keyboards, hand to hand',
    metric: { value: '$5,500+', label: 'revenue' },
    bullets: [
      'Designed and sold 35+ custom keyboards, generating $5,500+ in revenue, while building and maintaining an e-commerce platform for orders, client communication, and margin optimization.',
    ],
    specs: [
      ['Units built', '35+', '—', 'hand-assembled'],
      ['Revenue', '$5,500+', '—', 'direct sale'],
    ],
    tags: ['hardware', 'e-commerce', 'ops'],
  },
  {
    org: 'FRC Team 8089',
    role: 'Build & Design Team Planner',
    period: 'High School',
    start: '2021.09',
    headline: 'Constrained the build so the electronics would fit',
    metric: { value: '—', label: 'competition robot' },
    bullets: [
      "Planned and designed electrical engineering (EE) components and constrained the robot's physical build process.",
      'Collaborated with design and build sub-teams to define functional boundaries and integrate electronics efficiently.',
    ],
    specs: [['Subsystem', 'EE + build', '—', 'competition robot']],
    tags: ['electronics', 'CAD', 'robotics'],
  },
];

export const projects = [
  {
    slug: 'reparo',
    name: 'Reparo',
    award: 'Hack Canada 2026 — 1st place, $5,000',
    metric: { value: '90%+', label: 'classification accuracy' },
    stack: ['Python', 'Gemini API', 'React', 'Node.js', 'Swift', 'PyTorch'],
    desc: 'Won 1st place ($5,000) by building an Agentic AI system using Gemini vision models for product classification with 90%+ accuracy. Reduced search time by 70% and enabled access to 1,000+ real-time listings by integrating Shopify Storefront API and SerpAPI.',
    short: 'Agentic repair-or-replace assistant. Gemini vision classifies the broken thing, then searches 1,000+ live listings for the part.',
  },
  {
    slug: 'deliriumwatch',
    name: 'DeliriumWatch',
    award: 'Hospital monitoring pipeline',
    metric: { value: '90%', label: 'less manual monitoring' },
    stack: ['Raspberry Pi', 'Arduino', 'Python', 'OpenCV', 'Flask', 'C/C++'],
    desc: 'Built a real-time Python monitoring pipeline with SQL-backed secure login and role-based access control for hospital staff, resulting in over 90% reduction in manual monitoring. Implemented OpenCV-based eye detection and live Flask web visualizations to flag abnormal conditions.',
    short: 'Bedside delirium detection on a Pi. OpenCV eye tracking, role-gated Flask dashboard for hospital staff.',
  },
  {
    slug: 'silhouette',
    name: 'TailorAI (Silhouette)',
    award: 'Full-stack CV platform',
    metric: { value: '10+', label: 'measurements per user' },
    stack: ['Python', 'TensorFlow', 'scikit-learn', 'OpenCV', 'Node.js', 'React', 'MongoDB'],
    desc: 'Built a full-stack AI platform using computer vision and the MERN stack, processing 200+ images to automatically extract 10+ body measurements per user. Implemented Python CV pipeline with landmark normalization, improving measurement consistency by 40%. Designed scalable backend APIs, MongoDB schema, and responsive React frontend.',
    short: 'Body measurement from photos. Landmark normalization pushed consistency up 40% across 200+ images.',
  },
  {
    slug: 'ai-admissions',
    name: 'AI Admissions Similarity Tool',
    award: 'Applicant benchmarking',
    metric: { value: '3', label: 'reach / target / safety' },
    stack: ['Python', 'PRAW', 'MongoDB'],
    desc: 'AI-driven tool to scrape admissions data and compute similarity scores (GPA, tests, interests). Applicant benchmarking with reach, target, and safety school classification.',
    short: 'Scrapes real admissions outcomes and scores how similar you are, then sorts schools into reach, target, safety.',
  },
  {
    slug: 'spotify-pi',
    name: 'Spotify Pi Thing',
    award: 'Hardware side quest',
    metric: { value: '0', label: 'phone required' },
    stack: ['Raspberry Pi', 'Python 3', 'FastAPI', 'Spotipy', 'JS'],
    desc: 'A standalone Raspberry Pi Spotify controller with a touchscreen UI acting like an in-car console. Uses FastAPI matching OAuth caching for independent boot-time kiosk playback.',
    short: 'Touchscreen Spotify console for the car. Boots straight to kiosk, caches OAuth so it never needs a phone.',
  },
];

export const stack = [
  {
    label: 'languages',
    items: ['Python', 'Java', 'C', 'C++', 'Swift', 'TypeScript', 'JavaScript', 'SQL', 'Apex', 'HTML', 'CSS', 'VBA'],
  },
  {
    label: 'frameworks',
    items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'RAG', 'React', 'Node.js', 'Flask', 'FastAPI', 'OpenCV2', 'REST API', 'PyMAVLink', 'NumPy', 'JUnit', 'Dagger'],
  },
  {
    label: 'tools & cloud',
    items: ['Git', 'GitHub', 'Docker', 'VS Code', 'AWS (S3, SQS, SNS)', 'Salesforce', 'Postman', 'Kubernetes', 'Xcode', 'MongoDB'],
  },
];

export const awards = [
  { rank: 'Valedictorian', name: '', note: 'graduating class' },
  { rank: '1st', name: 'Euclid Math Contest', note: 'school medal' },
  { rank: '1st', name: 'Amazon Robotics Hackathon', note: '' },
  { rank: '1st', name: 'Hack Canada 2026', note: 'Reactiv track, $5,000' },
  { rank: 'Shortlisted', name: 'Most Complex AI Hack', note: 'Hack Canada 2026' },
  { rank: 'Bronze', name: 'Chess AI Bot', note: 'Waterloo Tech Week' },
  { rank: "Gov. General's", name: 'Academic Award', note: '' },
];

export const personal = [
  {
    label: 'film',
    body: 'I log everything on Letterboxd.',
    link: { text: 'Letterboxd', href: meta.letterboxd },
  },
  {
    label: 'keyboards & PCs',
    body: '35+ custom boards built and sold, love the craft. Current rig: NZXT H6 Flow, 13600KF, 9070XT, Vengeance 7000MHz CL34.',
  },
  {
    label: 'otherwise',
    body: 'manga, martial arts, motorsports, music (rage, EDM, hyperpop).',
  },
];

export const links = [
  { name: 'GitHub', href: meta.github, handle: 'Karan-Gupta07' },
  { name: 'LinkedIn', href: meta.linkedin, handle: 'karan-gupta' },
  { name: 'Letterboxd', href: meta.letterboxd, handle: 'Exoxeon' },
  { name: 'AOTY', href: meta.aoty, handle: 'exoxoen' },
  { name: 'Discord', href: null, handle: 'exo1k' },
  { name: 'Email', href: `mailto:${meta.email}`, handle: meta.email },
];
