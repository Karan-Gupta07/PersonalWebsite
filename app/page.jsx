import Link from "next/link";
import { profile, projects, experience } from "./content.mjs";
import { ProjectArchive, Arrow } from "./interface";
import HomePreview from "./home-preview";

export default function Home() {
  return (
    <div className="site-shell site-shell--home" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <main id="main" className="home-layout" tabIndex={-1}>
        <section className="intro" id="overview" aria-labelledby="identity-title">
          <h1 id="identity-title">Karan Gupta</h1>
          <p className="intro-lead">
            Computer engineering at Waterloo.
            <br />
            Software, AI &amp; robotics.
          </p>
        </section>

        <section className="home-section experience-section" id="experience" aria-labelledby="experience-heading">
          <div className="section-heading">
            <h2 id="experience-heading">Experience</h2>
            <Link className="quiet-link" href="/about#experience">Full history <Arrow /></Link>
          </div>
          <dl className="career-links">
            {[true, false].map((current) => (
              <div key={String(current)}>
                <dt>{current ? "Now" : "Previously"}</dt>
                <dd>
                  {experience.slice(0, 4).filter((job) => Boolean(job.current) === current).map((job) => (
                    <Link key={job.slug} href={`/experience/${job.slug}`} data-robot-preview={{ overlap: "clips", amazon: "warehouse", manulife: "pipeline", "wat-ai": "guardrail" }[job.slug]}>{job.company}<Arrow diagonal /></Link>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="home-section selected-projects" id="projects" aria-labelledby="projects-heading">
          <div className="section-heading">
            <h2 id="projects-heading">Selected projects</h2>
            <Link className="quiet-link" href="/projects">View all <Arrow /></Link>
          </div>
          <ProjectArchive items={projects.slice(0, 3)} compact />
        </section>

        <section className="personal-link" id="personnel" aria-label="About me">
          <HomePreview />
          <Link href="/about">A little more about me <Arrow /></Link>
          <p>5× hackathon winner · keyboards, films &amp; music.</p>
        </section>
      </main>
      <footer className="home-contact" id="contact">
        <a className="contact-link" href={`mailto:${profile.email}`}>
          Say hello <Arrow diagonal />
        </a>
        <nav className="social-links" aria-label="Social links and resume">
          <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a>
          <a href={profile.resume} target="_blank" rel="noreferrer">Resume <Arrow diagonal /></a>
        </nav>
      </footer>
    </div>
  );
}
