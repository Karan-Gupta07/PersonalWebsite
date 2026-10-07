import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../../content.mjs";
import { Header, Footer, ProjectFlow, ProjectMetrics, ProjectLinks, Arrow } from "../../interface";
import RobotDemo, { CleanDemo } from "../../robot-demo";
import { StoryDemo, WardDemo, AdmissionsDemo, DreadDemo, VideoEmbed } from "../../project-demos";
import SpotifyWidget from "../../../components/SpotifyWidget";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project
    ? {
        title: project.fullTitle || project.title,
        description: project.summary,
      }
    : { title: "Project not found" };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const demo = {
    dominiq: <RobotDemo kind="mission" />,
    "mr-clean": <CleanDemo />,
    "dread-director": <DreadDemo />,
    reparo: <StoryDemo kind="repair" />,
    silhouette: <StoryDemo kind="tailor" />,
    deliriumwatch: <WardDemo />,
    "ai-admissions": <AdmissionsDemo />,
    "spotify-pi": <SpotifyWidget />,
  }[project.slug];

  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main" className="project-page" tabIndex={-1}>
        <Link className="back-link" href="/projects"><Arrow /> All projects</Link>
        <article>
          <div className={`case-opening${demo ? " with-demo" : ""}`}>
            <header className="project-heading">
              <h1>{project.fullTitle || project.title}</h1>
              <p>{project.summary}</p>
              <p className="project-distinction">{project.distinction}</p>
              <ProjectLinks project={project} />
            </header>
            <div className="demo-column">
              {demo}
              {project.video && <VideoEmbed id={project.video} title={project.title} />}
            </div>
          </div>
          <ProjectMetrics project={project} />
          <section className="project-section" aria-labelledby="project-about">
            <h2 id="project-about">About this project</h2>
            {project.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <section className="project-section" aria-labelledby="project-workflow">
            <h2 id="project-workflow">How it works</h2>
            <ProjectFlow project={project} />
          </section>
          <section className="project-section" aria-labelledby="project-tools">
            <h2 id="project-tools">Built with</h2>
            <ul className="stack-inline">
              {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
            </ul>
          </section>
          <ProjectLinks project={project} />
        </article>
        <nav className="project-navigation" aria-label="Project navigation">
          <Link href="/projects"><span>Back to</span><strong>All projects</strong></Link>
          <Link href={`/project/${next.slug}`}>
            <span>Next project</span>
            <strong>{next.title} <Arrow /></strong>
          </Link>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
