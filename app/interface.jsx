"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { projects, experience } from "./content.mjs";

export function Arrow({ diagonal = false }) {
  return (
    <svg className="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-7-7 7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function Header() {
  const [paused, setPaused] = useState(false);
  const [section, setSection] = useState("overview");
  const pathname = usePathname();
  const headerRef = useRef(null);

  useEffect(() => {
    const measureHeader = () => {
      if (headerRef.current)
        document.documentElement.style.setProperty(
          "--site-nav-height",
          `${headerRef.current.offsetHeight}px`,
        );
    };
    const observer = new ResizeObserver(measureHeader);
    observer.observe(headerRef.current);
    measureHeader();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSection(entry.target.id);
        }
      },
      { rootMargin: "-22% 0px -70% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    let pause = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      const preference = localStorage.getItem("kg-motion");
      if (preference) pause = preference === "paused";
    } catch {}
    setPaused(pause);
    document.documentElement.dataset.motion = pause ? "paused" : "running";
    const openRecord = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    openRecord();
    window.addEventListener("hashchange", openRecord);
    return () => window.removeEventListener("hashchange", openRecord);
  }, []);

  function toggleMotion() {
    const next = !paused;
    setPaused(next);
    document.documentElement.dataset.motion = next ? "paused" : "running";
    try {
      localStorage.setItem("kg-motion", next ? "paused" : "running");
    } catch {}
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="system-strip">
        <span>PERSONAL ENGINEERING ARCHIVE</span>
        <span className="strip-middle">UNIVERSITY OF WATERLOO / CA</span>
        <span>PORTFOLIO</span>
      </div>
      <header className="site-header" ref={headerRef}>
        <Link href="/" className="wordmark" aria-label="Karan Gupta home">
          <span className="monogram">
            K<span>G</span>
            <i />
          </span>
          <span>
            KARAN GUPTA<small>PORTFOLIO / KG–079</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          {["projects", "experience", "personnel", "contact"].map((id, i) => (
            <a
              key={id}
              href={`${pathname === "/" ? "" : "/"}#${id}`}
              aria-current={
                (pathname.startsWith("/project/") ? "projects" : section) === id
                  ? "location"
                  : undefined
              }
            >
              <span>0{i + 1}</span> {id.toUpperCase()}
            </a>
          ))}
        </nav>
        <button
          className="motion-toggle"
          onClick={toggleMotion}
          aria-pressed={paused}
          aria-label={paused ? "Enable ambient motion" : "Pause ambient motion"}
        >
          <span className={paused ? "motion-symbol paused" : "motion-symbol"}>
            <i />
            <i />
            <i />
          </span>
          <span>
            MOTION<small>{paused ? "PAUSED" : "ACTIVE"}</small>
          </span>
        </button>
      </header>
    </>
  );
}

export function SectionHeading({ id, number, title, count }) {
  return (
    <div className="section-heading">
      <span className="section-number" aria-hidden="true">
        {number}
      </span>
      <h2 id={id}>{title}</h2>
      <span className="section-count">
        {count}
        <span className="crosshair" />
      </span>
    </div>
  );
}

export function SystemDiagram() {
  return (
    <div className="system-diagram">
      <div className="diagram-caption">
        <span>ARCHIVE NAVIGATION</span>
        <span>REF. KG / 079</span>
      </div>
      <div className="diagram-stage">
        <svg
          className="radial-system"
          viewBox="0 0 520 430"
          fill="none"
          role="group"
          aria-label="Portfolio archive navigation"
        >
          <defs>
            <pattern
              id="system-crosses"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M14 16h4m-2-2v4"
                stroke="currentColor"
                strokeWidth=".6"
              />
            </pattern>
            <path id="orbit-text" d="M260 47a168 168 0 1 1-.01 0" />
          </defs>
          <g aria-hidden="true">
            <rect
              x="12"
              y="15"
              width="496"
              height="400"
              fill="url(#system-crosses)"
              opacity=".2"
            />
            <path
              d="M0 215h520M260 0v430M40 215v-8m0 16v-8m440 0v-8m0 16v-8"
              stroke="currentColor"
              opacity=".28"
            />
            <g stroke="currentColor" className="ring-field">
              {[86, 97, 112, 128, 151, 183].map((r, i) => (
                <circle
                  key={r}
                  cx="260"
                  cy="215"
                  r={r}
                  strokeWidth={i === 4 ? 2 : 0.7}
                  opacity={i === 4 ? 0.65 : 0.28}
                />
              ))}
            </g>
            <g className="orbit-ticks">
              {Array.from({ length: 72 }, (_, i) => {
                const angle = (i * Math.PI) / 36;
                const radius = i % 6 === 0 ? 194 : 189;
                return (
                  <line
                    key={i}
                    x1={(260 + Math.sin(angle) * 184).toFixed(3)}
                    y1={(215 + Math.cos(angle) * 184).toFixed(3)}
                    x2={(260 + Math.sin(angle) * radius).toFixed(3)}
                    y2={(215 + Math.cos(angle) * radius).toFixed(3)}
                    stroke="currentColor"
                    strokeWidth={i % 6 === 0 ? 2 : 0.7}
                  />
                );
              })}
            </g>
            <g className="angular-labels" fill="currentColor">
              {Array.from({ length: 12 }, (_, i) => (
                <text
                  key={i}
                  x="260"
                  y="18"
                  textAnchor="middle"
                  transform={`rotate(${i * 30} 260 215)`}
                >
                  {String(i * 30).padStart(3, "0")}
                </text>
              ))}
            </g>
            <g className="subsystem-guides" stroke="var(--amber)" opacity=".42">
              <path d="M209 76v-9h102v9M117 253h-10v87h10m286-87h10v87h-10" />
              <path d="M227 106h66m-66 8h66m-66 8h66M126 282h36m-36 8h36m196-8h36m-36 8h36" />
            </g>
            <g className="orbit-slow">
              <circle
                cx="260"
                cy="215"
                r="140"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="100 140 5 24"
                opacity=".5"
              />
              <circle
                cx="260"
                cy="215"
                r="173"
                stroke="currentColor"
                strokeDasharray="2 7"
                opacity=".7"
              />
            </g>
            <text className="orbit-legend" fill="currentColor">
              <textPath href="#orbit-text" startOffset="0%">
                PROJECT ARCHIVE · WORK EXPERIENCE · PERSONAL RECORD · KARAN
                GUPTA ·
              </textPath>
            </text>
            <path
              d="m260 117 88 151H172Z"
              stroke="var(--amber)"
              strokeWidth="1"
              opacity=".7"
            />
            <path
              d="M260 158v33m-68 69 46-28m89 28-44-28"
              stroke="var(--amber)"
              strokeWidth="2"
            />
            <circle
              cx="260"
              cy="215"
              r="24"
              fill="var(--background)"
              stroke="var(--amber)"
            />
            <text
              x="260"
              y="222"
              textAnchor="middle"
              className="core-label"
              fill="var(--amber)"
            >
              KG
            </text>
            <g stroke="var(--amber)" strokeWidth="1">
              <path d="M16 34h32M16 34v28M504 34h-32m32 0v28M16 396h32m-32 0v-28m488 28h-32m32 0v-28" />
              <path d="m77 128 26 15m312-15-26 15M100 331l22-14m298 14-22-14" />
            </g>
            <g className="svg-micro" fill="var(--amber)">
              <text x="21" y="82">
                01 / A
              </text>
              <text x="465" y="82">
                B / 02
              </text>
              <text x="21" y="359">
                S.C.
              </text>
              <text x="460" y="359">
                079
              </text>
              <text x="260" y="414" textAnchor="middle">
                INDEX 01–03 / SELECT A RECORD GROUP
              </text>
            </g>
          </g>
          <a
            className="system-node node-projects"
            href="#projects"
            aria-label={`Projects, ${projects.length} dossiers`}
          >
            <path className="node-plate" d="M194 62H306L329 85V165H194Z" />
            <text className="node-code" x="204" y="79">
              01
            </text>
            <text className="node-title" x="261" y="116">
              PROJECTS
            </text>
            <text className="node-detail" x="261" y="140">
              {String(projects.length).padStart(2, "0")} DOSSIERS
            </text>
          </a>
          <a
            className="system-node node-experience"
            href="#experience"
            aria-label={`Experience, ${experience.length} records`}
          >
            <path className="node-plate" d="M73 239H215V319L193 341H73Z" />
            <text className="node-code" x="83" y="256">
              02
            </text>
            <text className="node-title" x="144" y="290">
              EXPERIENCE
            </text>
            <text className="node-detail" x="144" y="313">
              {String(experience.length).padStart(2, "0")} RECORDS
            </text>
          </a>
          <a
            className="system-node node-personnel"
            href="#personnel"
            aria-label="Personnel, education and interests"
          >
            <path className="node-plate" d="M307 239H445V341H329L307 319Z" />
            <text className="node-code" x="317" y="256">
              03
            </text>
            <text className="node-title" x="376" y="290">
              PERSONNEL
            </text>
            <text className="node-detail" x="376" y="313">
              BIO &amp; AWARDS
            </text>
          </a>
        </svg>
      </div>
      <div className="diagram-footer">
        <span>
          {projects.length} PROJECTS / {experience.length} EXPERIENCE RECORDS
        </span>
        <span>KG–079</span>
      </div>
    </div>
  );
}

export function ProjectFlow({ project }) {
  return (
    <ol
      className="project-flow"
      aria-label={`${project.title} workflow`}
      style={{ "--flow-steps": project.flow.length }}
    >
      {project.flow.map((step, i) => (
        <li className="flow-node" key={step}>
          <span className="flow-code">{String(i + 1).padStart(2, "0")}</span>
          <strong>{step}</strong>
          <small>{project.flowLabels[i]}</small>
          {i < project.flow.length - 1 && <Arrow />}
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

export function ProjectArchive() {
  const [selected, setSelected] = useState(projects[0].slug);
  const project = projects.find((item) => item.slug === selected);

  useEffect(() => {
    const restoreSelection = () => {
      const slug = new URL(window.location.href).searchParams.get("project");
      setSelected(
        projects.some((item) => item.slug === slug) ? slug : projects[0].slug,
      );
    };
    restoreSelection();
    window.addEventListener("popstate", restoreSelection);
    return () => window.removeEventListener("popstate", restoreSelection);
  }, []);

  function selectProject(slug) {
    setSelected(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("project", slug);
    url.hash = "projects";
    window.history.replaceState(window.history.state, "", url);
  }

  return (
    <div className="project-archive">
      <div className="project-index">
        <div className="panel-label">
          <span>SELECT A PROJECT</span>
          <span>{String(projects.length).padStart(2, "0")} FILES</span>
        </div>
        <label className="mobile-project-picker" htmlFor="project-picker">
          Project
          <select
            id="project-picker"
            value={selected}
            onChange={(event) => selectProject(event.target.value)}
            aria-controls="project-preview"
          >
            {projects.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <div
          className="project-buttons"
          role="group"
          aria-label="Preview a project"
        >
          {projects.map((item) => (
            <button
              key={item.slug}
              className={`project-selector ${selected === item.slug ? "selected" : ""}`}
              onClick={() => selectProject(item.slug)}
              aria-pressed={selected === item.slug}
              aria-controls="project-preview"
              aria-label={`Preview ${item.title}`}
            >
              <span className="project-selector-number">
                {item.code.slice(-2)}
              </span>
              <span>
                <small>{item.category}</small>
                <strong>{item.title}</strong>
              </span>
              <span className="selector-state" aria-hidden="true">
                {selected === item.slug ? "OPEN" : "VIEW"}
              </span>
            </button>
          ))}
        </div>
        <div className="record-console">
          <div className="panel-label">
            <span>RECORD DETAILS</span>
            <span className="crosshair" />
          </div>
          <dl>
            <div>
              <dt>FILE</dt>
              <dd>{project.code}</dd>
            </div>
            <div>
              <dt>STACK</dt>
              <dd>{project.stack.length} TECHNOLOGIES</dd>
            </div>
            <div>
              <dt>WORKFLOW</dt>
              <dd>{project.flow.length} STEPS</dd>
            </div>
          </dl>
        </div>
        <noscript>
          <p>Open a project:</p>
          {projects.map((item) => (
            <p key={item.slug}>
              <Link href={`/project/${item.slug}`}>{item.title}</Link>
            </p>
          ))}
        </noscript>
      </div>
      <p className="sr-only" role="status">
        Previewing {project.title}
      </p>
      <article
        className="project-preview"
        id="project-preview"
        aria-labelledby="preview-title"
      >
        <div className="dossier" key={project.slug}>
          <div className="dossier-topline">
            <span>{project.code} / TECHNICAL DOSSIER</span>
            <span className="mint">PREVIEW</span>
          </div>
          <div className="project-title-row">
            <h3 id="preview-title">{project.title}</h3>
          </div>
          <p className="project-summary">{project.summary}</p>
          <div className="distinction">
            <span className="tiny-cross" aria-hidden="true">
              +
            </span>
            {project.distinction}
          </div>
          <ProjectMetrics project={project} />
          <ProjectFlow project={project} />
          <div className="project-bottom">
            <div className="stack-inline" aria-label="Technologies">
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
            <Link className="action-link" href={`/project/${project.slug}`}>
              READ PROJECT DOSSIER <Arrow />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <Link href="/" className="footer-brand">
        KG<span>PERSONAL ENGINEERING ARCHIVE</span>
      </Link>
      <span>EVANGELION-INSPIRED INTERFACE</span>
      <a href="#top">
        RETURN TO TOP <span aria-hidden="true">↑</span>
      </a>
      <small>© {new Date().getFullYear()} KARAN GUPTA</small>
    </footer>
  );
}
