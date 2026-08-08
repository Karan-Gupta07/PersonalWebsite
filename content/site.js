// Single source of truth for the site. Presentation lives in
// components and CSS; everything a recruiter reads lives here.

export const meta = {
  name: 'Karan Gupta',
  first: 'Karan',
  last: 'Gupta',
  title: 'Software Engineer',
  school: 'Computer Engineering + Economics minor, University of Waterloo',
  gpa: '3.95 / 4.00',
  location: 'Waterloo, Ontario',
  year: '2026',
  email: 'k79gupta@uwaterloo.ca',
  resume: '/KaranGuptaResume.pdf',
  standfirst:
    'I build multi-step AI agents at Amazon and lead evaluation on TRACE, an agent reliability engine. I like problems where the answer has a number attached.',
};

export const links = [
  { name: 'Email', href: `mailto:${meta.email}`, handle: meta.email },
  { name: 'GitHub', href: 'https://github.com/Karan-Gupta07', handle: 'Karan-Gupta07' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/karan-gupta-2b72a735a/', handle: 'karan-gupta' },
  { name: 'Letterboxd', href: 'https://letterboxd.com/Exoxeon/', handle: 'Exoxeon' },
  { name: 'AOTY', href: 'https://www.albumoftheyear.org/user/exoxoen/', handle: 'exoxoen' },
  { name: 'Discord', href: null, handle: 'exo1k' },
];

export const experience = [
  {
    org: 'Amazon',
    role: 'Software Development Engineer Intern',
    period: 'May 2026 — Present',
    year: '2026',
    summary: 'AI agents that migrate legacy Java services.',
    result: { value: '98%', label: 'less migration time' },
    bullets: [
      'Reduced legacy service migration time by 98% (2 weeks to 1 hour per stage) by building multi-step AI agents using prompt chaining and CoT reasoning to automate Java architecture transformation across thousands of lines.',
      'Architected an agentic RAG pipeline with few-shot prompting to achieve 92% translation accuracy across legacy API calls, algorithm structures, and AWS cloud deployment patterns into modernized service frameworks.',
      'Developed a pluggable natural language interface enabling on-demand algorithm adjustments during automated migration, allowing seamless integration with modern service handlers without manual intervention.',
    ],
    tech: 'AI agents · RAG · Java · AWS',
  },
  {
    org: 'Wat.ai',
    unit: 'TRACE',
    role: 'AI Software Engineer, Evaluation Lead',
    period: 'May 2026 — Present',
    year: '2026',
    summary: 'An agent reliability engine that finds its own root causes.',
    result: { value: '70%', label: 'faster root-cause diagnosis' },
    bullets: [
      'Engineered TRACE, an AI agent reliability engine that automates multi-step execution tracing and failure isolation, reducing root-cause diagnostic latency by 70% for complex RAG and tool-use workflows.',
      'Eliminated 95% of runtime non-determinism across 4 downstream production applications by architecting a canonical verifier interface and Pydantic schemas to enforce strict data contracts over subjective LLM logic.',
      'Enforced 100% compliance for financial-action workflows by deploying a high-throughput, 7-check deterministic execution engine that intercepts policy violations and eliminates manual operational triage.',
    ],
    tech: 'Python · Pydantic · LLM evaluation',
  },
  {
    org: 'Manulife',
    role: 'Software Engineering Intern',
    period: 'Jan — Apr 2026',
    year: '2026',
    summary: 'Telemetry that caught bottlenecks before they became outages.',
    result: { value: '20+', label: 'anomalies surfaced' },
    bullets: [
      'Reduced system downtime risk by scripting a New Relic data exporter and architecting NRQL queries, enabling early detection of 3+ resource bottlenecks before system failure.',
      'Designed a Python analysis script and SQL telemetry pipeline to process clickstream data, identifying 20+ suspicious user anomalies by applying mathematical modeling and cross-referencing behavioral logs.',
      'Implemented 15+ Salesforce features to automate data entry during document uploads for specialized lending workflows, reducing manual input for high-value client processing using Apex and LWC.',
    ],
    tech: 'Python · SQL · New Relic · Apex',
  },
  {
    org: 'Waterloo Aerial Robotics Group',
    role: 'Autonomy Software Developer',
    period: 'Sep 2025 — Present',
    year: '2025',
    summary: 'Real-time vision and telemetry for UAV autonomy.',
    result: { value: '+13%', label: 'detection accuracy' },
    bullets: [
      'Improved real-time signal detection accuracy by 13% using OpenCV2 computer vision algorithms through iterative parameter tuning and validation.',
      'Built multi-process telemetry and command systems in Python (PyMAVLink) to simulate UAV communication, reducing message latency by 30% across distributed processes.',
    ],
    tech: 'OpenCV · PyMAVLink · Python',
  },
  {
    org: 'C2C Development Holdings',
    role: 'Computer Support Specialist',
    period: 'May 2022 — Sep 2025',
    year: '2022',
    summary: 'A bot that answered 700+ customer conversations.',
    result: { value: '−70%', label: 'response time' },
    bullets: [
      'Engineered a Python-based automation bot that auto-responded to Facebook Marketplace messages, improving response time by over 70% and automating 700+ customer interactions.',
      'Provided technical support in database management, hardware setup, and network troubleshooting.',
    ],
    tech: 'Python · automation',
  },
  {
    org: 'Custom Gaming Keyboards',
    role: 'Founder & Operator',
    period: 'Sep 2022 — Present',
    year: '2022',
    summary: '35+ keyboards designed, built and sold by hand.',
    result: { value: '$5,500+', label: 'revenue' },
    bullets: [
      'Designed and sold 35+ custom keyboards, generating $5,500+ in revenue, while building and maintaining an e-commerce platform for orders, client communication, and margin optimization.',
    ],
    tech: 'Hardware · e-commerce',
  },
];

// Case studies. `sections` follows the editorial structure:
// overview → problem → approach → architecture → implementation →
// result → reflection. Prose is measured; every number is real.
export const projects = [
  {
    slug: 'reparo',
    name: 'Reparo',
    deck: 'An agentic AI system that decides whether a broken thing is worth fixing, then finds the parts.',
    role: 'Full stack / AI',
    tech: 'Python · Gemini · React · Node.js · Swift · PyTorch',
    result: '1st place · Hack Canada 2026 · $5,000',
    figure: { value: '90%+', label: 'classification accuracy', index: '01' },
    featured: true,
    sections: [
      {
        n: '01', title: 'Overview',
        body: 'Reparo is a repair-or-replace assistant. Point it at a broken product and it classifies the item with Gemini vision models, generates a step-by-step repair plan with tools and cost estimates, and sources replacement parts into a single checkout. It won 1st place in the Reactiv Track at Hack Canada 2026 ($5,000) and was shortlisted for Most Complex AI Hack.',
      },
      {
        n: '02', title: 'Problem',
        body: 'When something breaks, the real question is not "how do I fix this" but "is this worth fixing, and what exactly do I need." Answering it means identifying the product, diagnosing the fault, pricing the repair against replacement, and finding the right parts. Each step lives on a different website.',
      },
      {
        n: '03', title: 'Approach',
        body: 'We treated the whole flow as one agentic pipeline: a vision model identifies the product and damage from a photo, iterative reasoning produces a repair plan, and search integrations turn that plan into a purchasable parts list. The user takes one photo and gets one decision.',
      },
      {
        n: '04', title: 'Architecture',
        body: 'Gemini vision models handle product classification at 90%+ accuracy. An iterative reasoning loop refines the diagnosis and emits a structured repair plan: steps, tools, cost. The Shopify Storefront API and SerpAPI back the parts search, giving access to 1,000+ real-time listings with a unified checkout flow.',
      },
      {
        n: '05', title: 'Implementation',
        body: 'Python service layer around the Gemini calls, a React front end, a Swift companion for capture, and Node.js glue for the commerce integrations. Built in a hackathon weekend by a team of four.',
      },
      {
        n: '06', title: 'Result',
        body: '1st place, Reactiv Track, Hack Canada 2026, with a $5,000 prize. 90%+ classification accuracy, a 70% reduction in part-search time, and live access to 1,000+ listings.',
      },
      {
        n: '07', title: 'Reflection',
        body: 'The lesson that stuck: structure beats cleverness. The pipeline got reliable when we forced every model output into a strict schema before the next stage consumed it, the same idea I now apply to agent evaluation work on TRACE.',
      },
    ],
  },
  {
    slug: 'deliriumwatch',
    name: 'DeliriumWatch',
    deck: 'Bedside monitoring for hospital delirium, built on a Raspberry Pi.',
    role: 'CV / hardware',
    tech: 'Raspberry Pi · Arduino · Python · OpenCV · Flask · C/C++',
    result: '90%+ less manual monitoring',
    figure: { value: '90%', label: 'less manual monitoring', index: '02' },
    featured: true,
    sections: [
      {
        n: '01', title: 'Overview',
        body: 'DeliriumWatch is a real-time patient-monitoring pipeline built for Grand River Hospital staff: OpenCV eye tracking, multi-sensor environmental ingestion, and a role-gated Flask dashboard that flags abnormal conditions automatically.',
      },
      {
        n: '02', title: 'Problem',
        body: 'Hospital delirium is monitored by periodic manual checks. Staff walk rounds, note conditions, and hope the interesting event does not happen between visits. The signal is continuous; the observation is not.',
      },
      {
        n: '03', title: 'Approach',
        body: 'Put cheap continuous sensing at the bedside and reserve humans for judgement. A camera watches for sleep and blink patterns, environmental sensors track the room, and the system only asks for attention when something crosses a threshold.',
      },
      {
        n: '04', title: 'Architecture',
        body: 'A Raspberry Pi runs the OpenCV eye-detection pipeline and a Flask web server; an Arduino handles sensor ingestion over serial with threshold validation for stable multi-sensor tracking and zero dropped readings. Access is controlled with a SQL-backed login and role-based permissions for hospital staff.',
      },
      {
        n: '05', title: 'Implementation',
        body: 'Python for the vision pipeline and web layer, C/C++ on the microcontroller. Live web visualizations show the current state; alerts flag abnormal conditions for review.',
      },
      {
        n: '06', title: 'Result',
        body: 'In simulated testing the system cut manual environmental monitoring by over 90%, with automated sleep and blink classification enabling faster response to abnormal conditions.',
      },
      {
        n: '07', title: 'Reflection',
        body: 'Hardware taught me margins. Sensors drift, serial links hiccup, cameras meet bad lighting. The reliability came from validation at every boundary, not from any single clever algorithm.',
      },
    ],
  },
  {
    slug: 'silhouette',
    name: 'TailorAI',
    deck: 'Body measurements from photographs, so custom tailoring skips the tape.',
    role: 'Full stack / CV',
    tech: 'Python · TensorFlow · scikit-learn · OpenCV · React · MongoDB',
    result: '10+ measurements per user · +40% consistency',
    figure: { value: '+40%', label: 'measurement consistency', index: '03' },
    featured: true,
    sections: [
      {
        n: '01', title: 'Overview',
        body: 'TailorAI (Silhouette) is a full-stack custom-tailoring platform that extracts body measurements from user photos, removing manual sizing from custom apparel orders.',
      },
      {
        n: '02', title: 'Problem',
        body: 'Custom clothing depends on accurate measurements, and self-measurement is the weakest link in the pipeline: inconsistent, error-prone, and enough friction that customers abandon the order.',
      },
      {
        n: '03', title: 'Approach',
        body: 'Replace the tape measure with a camera. A computer-vision pipeline finds body landmarks in a photo, normalizes them, and derives the measurements a tailor actually needs.',
      },
      {
        n: '04', title: 'Architecture',
        body: 'A Python CV workflow using landmark normalization, with scikit-learn and TensorFlow improving statistical measurement consistency by 40%. The platform is MERN: a MongoDB schema designed for a 150+ item catalog, REST APIs holding sub-200ms per query, and a responsive React front end.',
      },
      {
        n: '05', title: 'Implementation',
        body: 'Processed 200+ images to extract 10+ measurements per user. The measurement pipeline runs server-side; the storefront and order flow run on the MERN stack.',
      },
      {
        n: '06', title: 'Result',
        body: '10+ automated measurements per user across 200+ processed images, 40% better measurement consistency, and sub-200ms catalog queries at 150+ items.',
      },
      {
        n: '07', title: 'Reflection',
        body: 'Normalization mattered more than model choice. Most of the accuracy gain came from careful landmark normalization before any learning happened, cleaning the input beat tuning the model.',
      },
    ],
  },
  {
    slug: 'ai-admissions',
    name: 'Admissions Similarity Tool',
    deck: 'Scrapes real admissions outcomes and scores how similar you are.',
    role: 'Data / ML',
    tech: 'Python · PRAW · MongoDB',
    result: 'Reach / target / safety classification',
    figure: { value: '3', label: 'tiers: reach, target, safety', index: '04' },
    featured: false,
    sections: [
      {
        n: '01', title: 'Overview',
        body: 'An AI-driven tool that scrapes real admissions data and computes similarity scores across GPA, test scores, and interests, then classifies schools into reach, target, and safety tiers for a given applicant.',
      },
      {
        n: '02', title: 'Problem',
        body: 'Applicants benchmark themselves against anecdotes. Thousands of real outcomes are posted publicly, but they are unstructured and impossible to compare against by hand.',
      },
      {
        n: '03', title: 'Approach',
        body: 'Scrape the outcomes with PRAW, structure them into MongoDB, and compute per-school similarity between the applicant profile and historical admits.',
      },
      {
        n: '06', title: 'Result',
        body: 'Working applicant benchmarking with reach, target, and safety classification computed from real, scraped outcomes rather than self-reported averages.',
      },
      {
        n: '07', title: 'Reflection',
        body: 'Scraped data is adversarial: inconsistent formats, missing fields, exaggeration. Most of the engineering was cleaning, which is most of data engineering everywhere.',
      },
    ],
  },
  {
    slug: 'spotify-pi',
    name: 'Spotify Pi',
    deck: 'A touchscreen Spotify console for the car that never needs a phone.',
    role: 'Hardware / backend',
    tech: 'Raspberry Pi · Python · FastAPI · Spotipy · JS',
    result: 'Boots straight to kiosk playback',
    figure: { value: '0', label: 'phones required', index: '05' },
    featured: false,
    sections: [
      {
        n: '01', title: 'Overview',
        body: 'A standalone Raspberry Pi Spotify controller acting like a small in-car console: touch-optimized UI in a fullscreen browser, everything running locally on the device.',
      },
      {
        n: '02', title: 'Problem',
        body: 'In-car music control means a phone: unlock, mount, tap through an interface designed for hands and attention you do not have while driving.',
      },
      {
        n: '04', title: 'Architecture',
        body: 'A Python backend on FastAPI and Spotipy serves a REST API and handles Spotify OAuth, persisting token caches so the device reconnects autonomously after a reboot. The front end is a vanilla HTML/CSS/JS single-page app for 3.5 to 5 inch touchscreens, polling now-playing state every 3 seconds with no build step.',
      },
      {
        n: '05', title: 'Implementation',
        body: 'systemd launches the backend at boot and Chromium autostarts into fullscreen kiosk mode when the desktop loads. Power on, music appears.',
      },
      {
        n: '07', title: 'Reflection',
        body: 'The best interface for a car is the one that survives a reboot with zero taps. Persistence and autostart were the product, not features of it.',
      },
    ],
  },
];

// Editorial index, not a pill wall. `via` ties a skill to the work
// that proves it; entries without `via` are listed plainly.
export const skills = [
  {
    label: 'Languages',
    items: [
      { name: 'Python', via: 'TRACE · Manulife · WARG · DeliriumWatch' },
      { name: 'Java', via: 'Amazon' },
      { name: 'C / C++', via: 'DeliriumWatch' },
      { name: 'TypeScript / JavaScript', via: 'Reparo · this site' },
      { name: 'SQL', via: 'Manulife' },
      { name: 'Swift', via: 'Reparo' },
      { name: 'Apex', via: 'Manulife' },
    ],
  },
  {
    label: 'Frameworks & libraries',
    items: [
      { name: 'PyTorch', via: 'Reparo' },
      { name: 'TensorFlow / scikit-learn', via: 'TailorAI' },
      { name: 'OpenCV', via: 'WARG · DeliriumWatch · TailorAI' },
      { name: 'React / Node.js', via: 'Reparo · TailorAI' },
      { name: 'FastAPI / Flask', via: 'Spotify Pi · DeliriumWatch' },
      { name: 'Pydantic', via: 'TRACE' },
      { name: 'PyMAVLink', via: 'WARG' },
      { name: 'NumPy' },
      { name: 'JUnit / Dagger' },
    ],
  },
  {
    label: 'Systems & tools',
    items: [
      { name: 'AWS — S3, SQS, SNS', via: 'Amazon' },
      { name: 'RAG pipelines', via: 'Amazon' },
      { name: 'New Relic / NRQL', via: 'Manulife' },
      { name: 'Salesforce', via: 'Manulife' },
      { name: 'MongoDB', via: 'TailorAI' },
      { name: 'Docker · Kubernetes' },
      { name: 'Git · GitHub' },
    ],
  },
];

export const awards = [
  { rank: '1st', name: 'Hack Canada 2026', note: 'Reactiv track · $5,000' },
  { rank: '1st', name: 'Amazon Robotics Hackathon' },
  { rank: '1st', name: 'Euclid Math Contest', note: 'school medal' },
  { rank: 'Shortlist', name: 'Most Complex AI Hack', note: 'Hack Canada 2026' },
  { rank: 'Bronze', name: 'Chess AI Bot', note: 'Waterloo Tech Week' },
  { rank: '—', name: 'Valedictorian', note: 'graduating class' },
  { rank: '—', name: "Governor General's Academic Award" },
];

export const about = {
  lead: 'I like building things where you can measure whether they work.',
  body: [
    'I study computer engineering at Waterloo with an economics minor, and I spend most of my time on AI agents, computer vision, and automation: systems that act on the world and can be held to a number.',
    'The through-line in my work is evaluation. At Amazon I build agents that migrate legacy services; on TRACE I build the machinery that decides whether agents like that can be trusted. I think the second problem is harder and more interesting.',
    'Off the clock I build custom keyboards (35+ sold), log every film on Letterboxd, rate albums on AOTY, and follow motorsports. Current rig: NZXT H6 Flow, 13600KF, 9070XT.',
  ],
};
