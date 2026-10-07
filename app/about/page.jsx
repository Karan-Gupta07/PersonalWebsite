import Link from "next/link";
import { profile, experience, awards, stack } from "../content.mjs";
import { Header, Footer, Arrow } from "../interface";

export const metadata = {
  title: "About",
  description: "Karan Gupta’s background, experience, and interests outside of work.",
};

export default function AboutPage() {
  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main" className="reading-page" tabIndex={-1}>
        <Link className="back-link" href="/"><Arrow /> Back home</Link>
        <nav className="page-tabs" aria-label="About sections">
          <a href="#outside">Outside of work</a>
          <a href="#overview">Overview</a>
        </nav>
        <section className="about-part" id="outside" aria-labelledby="outside-heading">
          <h1 id="outside-heading">Outside of work</h1>
          <p className="about-lead">What I do when I’m not working.</p>
          <div className="project-section">
          <p>
            I’ve built and sold 35+ custom keyboards, and I’m into PC building,
            manga, martial arts, and motorsports.
          </p>
          <p>
            There’s usually some rage, EDM, or hyperpop playing. I keep a{" "}
            <a href={profile.links.music} target="_blank" rel="noreferrer">music log</a>
            {" "}and track what I’m watching on{" "}
            <a href={profile.links.letterboxd} target="_blank" rel="noreferrer">Letterboxd</a>.
          </p>
          <p className="setup-note">Current setup: NZXT H6 Flow · 13600KF · 9070XT · Vengeance 7000MHz CL34</p>
          </div>
        </section>
        <section className="about-part" id="overview" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="about-title">Overview</h2>
        <section className="project-section" aria-labelledby="education-heading">
          <h3 id="education-heading">Education</h3>
          <p>{profile.university} · {profile.education}<br />{profile.minor} · {profile.gpa} GPA</p>
        </section>
        <section className="project-section" id="experience" aria-labelledby="experience-heading">
          <h3 id="experience-heading">Experience</h3>
          <ul className="experience-index">
            {experience.map((job) => (
              <li key={job.slug}>
                <Link href={`/experience/${job.slug}`}>
                  <span><strong>{job.company}</strong><span>{job.role}</span></span>
                  <span className="role-date">{job.date}</span>
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="project-section" aria-labelledby="awards-heading">
          <h3 id="awards-heading">Awards &amp; competitions</h3>
          <ul className="award-list">
            {awards.map(([number, title, detail]) => (
              <li key={number}><strong>{title}</strong><span>{detail}</span></li>
            ))}
          </ul>
        </section>
        <section className="project-section" id="stack" aria-labelledby="stack-heading">
          <h3 id="stack-heading">Tools I work with</h3>
          {Object.entries(stack).map(([category, items]) => (
            <div className="stack-group" key={category}>
              <h4>{category}</h4>
              <p>{items.join(" · ")}</p>
            </div>
          ))}
        </section>
        <section className="project-section" aria-labelledby="contact-heading">
          <h3 id="contact-heading">Say hello</h3>
          <p><a href={`mailto:${profile.email}`}>{profile.email}</a><br />Or find me on Discord as exo1k.</p>
        </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
