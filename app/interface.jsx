import Link from "next/link";
import { projects, profile } from "./content.mjs";

export function Arrow({ diagonal = false }) {
  return (
    <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-7-7 7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="Karan Gupta home">kg.</Link>
        <nav aria-label="Main navigation">
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          <a href={profile.resume} target="_blank" rel="noreferrer">
            Resume <Arrow diagonal />
          </a>
        </nav>
      </header>
    </>
  );
}

export function ProjectArchive({ items = projects, compact = false }) {
  return (
    <ul className={`project-list${compact ? " project-list--compact" : ""}`}>
      {items.map((project) => (
        <li key={project.slug}>
          <Link className="project-link" href={`/project/${project.slug}`} data-robot-preview={compact ? { dominiq: "mission", reparo: "repair" }[project.slug] : undefined}>
            <span>
              <strong>{project.title}</strong>
              <span className="project-description">{compact ? project.category : project.short}</span>
            </span>
            <Arrow />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ProjectFlow({ project }) {
  return (
    <ol className="project-flow" aria-label={`${project.title} workflow`}>
      {project.flow.map((step, i) => (
        <li key={step}>
          <strong>{step}</strong>
          <span>{project.flowLabels[i]}</span>
        </li>
      ))}
    </ol>
  );
}

export function ProjectMetrics({ project }) {
  if (!project.metrics.length) return null;
  return (
    <dl className="project-metrics">
      {project.metrics.map((metric) => (
        <div key={metric.label}>
          <dt>{metric.label}</dt>
          <dd>{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const linkLabels = { live: "Try it live", github: "GitHub", devpost: "Devpost" };

export function ProjectLinks({ project }) {
  const links = Object.entries(linkLabels).filter(([key]) => project.links?.[key]);
  if (!links.length) return null;
  return (
    <nav className="project-links" aria-label={`${project.title} links`}>
      {links.map(([key, label]) => <a key={key} href={project.links[key]} target="_blank" rel="noreferrer">{label} <Arrow diagonal /></a>)}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Karan Gupta</span>
      <a href="#top">Back to top <Arrow /></a>
    </footer>
  );
}
