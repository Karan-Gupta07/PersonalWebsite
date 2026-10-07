import Link from "next/link";
import { notFound } from "next/navigation";
import { experience, profile } from "../../content.mjs";
import { Header, Footer, Arrow } from "../../interface";
import RobotDemo from "../../robot-demo";
import { MonitoringDemo, GuardrailDemo, ClipDemo } from "../../project-demos";

export function generateStaticParams() {
  return experience.map((job) => ({ slug: job.slug }));
}

export function generateMetadata({ params }) {
  const job = experience.find((item) => item.slug === params.slug);
  return job
    ? { title: `${job.company} — Experience`, description: `${job.role} at ${job.company}. ${job.date}.` }
    : { title: "Experience not found" };
}

export default function ExperiencePage({ params }) {
  const job = experience.find((item) => item.slug === params.slug);
  if (!job) notFound();
  const demo = {
    overlap: <ClipDemo />,
    amazon: <RobotDemo kind="warehouse" />,
    manulife: <MonitoringDemo kind="pipeline" />,
    "wat-ai": <GuardrailDemo />,
  }[job.slug];

  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main" className="reading-page" tabIndex={-1}>
        <Link className="back-link" href="/#experience"><Arrow /> Back home</Link>
        <article>
          <div className={`case-opening${demo ? " with-demo" : ""}`}>
            <header className="project-heading">
              <h1>{job.company}</h1>
              <p>{job.role}</p>
              <p className="role-date">{job.date}{job.location && ` · ${job.location}`}</p>
              {job.intro && <p className="work-intro">{job.intro}</p>}
            </header>
            {demo}
          </div>
          <section className="project-section" aria-labelledby="role-work">
            <h2 id="role-work">What I worked on</h2>
            {job.bullets.map((bullet) => <p key={bullet}>{bullet}</p>)}
          </section>
        </article>
        <nav className="project-navigation" aria-label="Experience navigation">
          <Link href="/about#experience"><span>My background</span><strong>All experience <Arrow /></strong></Link>
          <a href={profile.resume} target="_blank" rel="noreferrer"><span>The full picture</span><strong>Resume <Arrow diagonal /></strong></a>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
