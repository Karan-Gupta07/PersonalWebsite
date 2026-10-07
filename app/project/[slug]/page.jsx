import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, profile } from "../../content.mjs";
import {
  Header,
  Footer,
  ProjectFlow,
  ProjectMetrics,
  Arrow,
} from "../../interface";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }) {
  const project = projects.find((item) => item.slug === params.slug);
  return project
    ? {
        title: project.fullTitle || project.title,
        description: project.summary,
      }
    : { title: "Record not found" };
}

export default function ProjectPage({ params }) {
  const project = projects.find((item) => item.slug === params.slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main" className="case-file" tabIndex={-1}>
        <div className="case-breadcrumb">
          <Link href={`/?project=${project.slug}#projects`}>
            PROJECT ARCHIVE
          </Link>
          <span>/</span>
          <span>{project.code}</span>
          <span className="mint">PUBLIC TECHNICAL RECORD</span>
        </div>
        <div className="case-heading">
          <h1>{project.fullTitle || project.title}</h1>
          <p>{project.short}</p>
        </div>
        <div className="case-layout">
          <article className="case-body">
            <div className="panel-label">
              <span>01 / SYSTEM OVERVIEW</span>
              <span>RECORD OPEN</span>
            </div>
            <p className="case-intro">{project.summary}</p>
            <div className="distinction">
              <span className="tiny-cross">+</span>
              {project.distinction}
            </div>
            <ProjectMetrics project={project} />
            <div className="case-section-label">02 / WORKFLOW</div>
            <ProjectFlow project={project} />
            <div className="case-section-label">03 / IMPLEMENTATION RECORD</div>
            <div className="case-prose">
              {project.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
          <aside className="case-sidebar">
            <div className="panel-label">
              <span>IMPLEMENTATION STACK</span>
              <span>INV.</span>
            </div>
            <ol>
              {project.stack.map((tech, i) => (
                <li key={tech}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {tech}
                </li>
              ))}
            </ol>
            <div className="case-owner">
              <span className="eyebrow">ENGINEER OF RECORD</span>
              <strong>KARAN GUPTA</strong>
              <span>
                Computer Engineering
                <br />
                University of Waterloo
              </span>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`Let's talk about ${project.title}`)}`}
                className="action-link"
              >
                DISCUSS THIS PROJECT <Arrow diagonal />
              </a>
            </div>
            <span className="case-file-id">{project.code} / KG–079</span>
          </aside>
        </div>
        <nav className="case-navigation" aria-label="Project navigation">
          <Link href={`/?project=${project.slug}#projects`}>
            <span>RETURN TO INDEX</span>
            <strong>ALL PROJECTS</strong>
          </Link>
          <Link href={`/project/${next.slug}`}>
            <span>NEXT RECORD / {next.code}</span>
            <strong>
              {next.title} <Arrow />
            </strong>
          </Link>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
