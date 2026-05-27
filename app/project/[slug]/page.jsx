import Link from 'next/link';
import { notFound } from 'next/navigation';

const PROJECTS_DATA = {
  reparo: {
    title: 'Reparo',
    stack: 'Python, Gemini API, React, Node.js, Swift, PyTorch',
    htmlContent: `
      <p>Built an agentic AI repair platform using Gemini vision models and iterative reasoning to analyze product images and automatically generate step-by-step repair plans, specify required tools, and produce cost estimates.</p>
      <p>Integrated the Shopify Storefront API and SerpAPI to dynamically source replacement parts and create a seamless, unified checkout flow for users to quickly get the materials they need.</p>
      <p>The project won <strong>1st place in the Reactiv Track ($5,000)</strong> at Hack Canada 2026, and was shortlisted for the Most Complex AI Hack award.</p>
    `,
  },
  deliriumwatch: {
    title: 'DeliriumWatch',
    stack: 'Raspberry Pi, Arduino, Python, OpenCV, HTML, CSS, Flask, C/C++',
    htmlContent: `
      <p>Real-time monitoring pipeline built for Grand River Hospital staff, with secure login and role-based access control. The system was designed to reduce manual environmental monitoring during simulated testing — we saw a <strong>90%+ reduction</strong> in that workload.</p>
      <p>I implemented OpenCV-based eye detection and a live Flask-powered web visualization with automatic alert flagging, enabling automated sleep and blink classification and faster response to abnormal conditions during validation. On the hardware side, I engineered serial data ingestion and threshold validation for stable multi-sensor tracking with zero dropped readings.</p>
    `,
  },
  'ai-admissions': {
    title: 'AI Admissions Similarity Tool',
    stack: 'Python, PRAW, MongoDB',
    htmlContent: `
      <p>An AI-driven tool that scrapes admissions data and computes similarity scores across GPA, tests, and interests. Built applicant benchmarking with reach, target, and safety school classification.</p>
    `,
  },
  silhouette: {
    title: 'TailorAI (Silhouette)',
    stack: 'Python, TensorFlow, scikit-learn, OpenCV, Node.js, React, MongoDB',
    htmlContent: `
      <p>TailorAI (Silhouette) is a full-stack AI-powered custom tailoring platform that automates body measurement extraction from user photos, eliminating reliance on manual sizing inputs and streamlining custom apparel ordering.</p>
      <p>I built the core platform using computer vision algorithms and the MERN stack, processing 200+ images to automatically extract 10+ precise body measurements per user. On the AI pipeline side, I implemented a robust Python CV workflow using landmark normalization, leveraging <strong>scikit-learn</strong> and <strong>TensorFlow</strong> to improve statistical measurement consistency by <strong>40%</strong>.</p>
      <p>For the infrastructure and catalog, I designed a scalable MongoDB schema and optimized REST APIs to support 150+ items, maintaining an extremely low latency of sub-200ms per query.</p>
    `,
  },
  'spotify-pi': {
    title: 'Spotify Pi Thing',
    stack: 'Raspberry Pi, Python 3, FastAPI, Spotipy, HTML/CSS/JS',
    htmlContent: `
      <p>A standalone Raspberry Pi Spotify controller that acts like a small in-car console. Everything runs locally on the device, providing a touch-optimized UI in a fullscreen browser.</p>
      <p><strong>Architecture & Backend</strong><br />
      The Raspberry Pi runs a Python backend using <strong>FastAPI</strong> and <strong>Spotipy</strong> to serve a REST API and handle Spotify OAuth endpoints. It saves token caches persistently to allow the device to reconnect autonomously after a reboot.</p>
      <p><strong>Frontend</strong><br />
      The UI is a vanilla HTML/CSS/JS single-page application tailored for 3.5"-5" touchscreen displays. It polls the backend API for "now-playing" states every 3 seconds to update the UI on the fly without a build step.</p>
      <p><strong>Deployment</strong><br />
      The project is set up with fully automated deployment scripts (<code>systemd</code> via shell script) that launch the backend immediately at system boot, and autostarts Chromium into a fullscreen kiosk mode as soon as the desktop environment is loaded.</p>
    `,
  },
};

export function generateStaticParams() {
  return Object.keys(PROJECTS_DATA).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }) {
  const project = PROJECTS_DATA[params.slug];
  if (!project) return {};
  return {
    title: `${project.title} — Karan Gupta`,
    description: `Detailed walkthrough of ${project.title}. Stack: ${project.stack}.`,
  };
}

export default function ProjectPage({ params }) {
  const project = PROJECTS_DATA[params.slug];
  
  if (!project) {
    notFound();
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="project-page">
      <div className="main-wrap">
        <header className="header">
          <Link href="/" className="header-name">
            Karan Gupta
          </Link>
          <Link href="/#projects" className="header-resume">
            ← back
          </Link>
        </header>

        <main className="main project-main">
          <article className="project-article">
            <h1 className="project-title">{project.title}</h1>
            <p className="project-stack mono">{project.stack}</p>
            <div 
              className="project-body"
              dangerouslySetInnerHTML={{ __html: project.htmlContent }}
            />
            <p className="project-back">
              <Link href="/#projects">← Back to projects</Link>
            </p>
          </article>
        </main>

        <footer className="footer">
          <p className="mono">© {currentYear} Karan Gupta</p>
        </footer>
      </div>
    </div>
  );
}
