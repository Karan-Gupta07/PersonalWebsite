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
        <header className="project-heading">
          <h1>A little more about me.</h1>
          <p>Computer engineering at Waterloo. Plenty of interests beyond it.</p>
        </header>
        <section className="project-section" aria-labelledby="outside-heading">
          <h2 id="outside-heading">Outside of work</h2>
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
        </section>
        <section className="project-section" aria-labelledby="education-heading">
          <h2 id="education-heading">Education</h2>
          <p>{profile.university} · {profile.education}<br />{profile.minor} · {profile.gpa} GPA</p>
        </section>
        <section className="project-section" id="experience" aria-labelledby="experience-heading">
          <h2 id="experience-heading">Experience</h2>
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
          <h2 id="awards-heading">Awards &amp; competitions</h2>
          <ul className="award-list">
            {awards.map(([number, title, detail]) => (
              <li key={number}><strong>{title}</strong><span>{detail}</span></li>
            ))}
          </ul>
        </section>
        <section className="project-section" id="stack" aria-labelledby="stack-heading">
          <h2 id="stack-heading">Tools I work with</h2>
          {Object.entries(stack).map(([category, items]) => (
            <div className="stack-group" key={category}>
              <h3>{category}</h3>
              <p>{items.join(" · ")}</p>
            </div>
          ))}
        </section>
        <section className="project-section" aria-labelledby="contact-heading">
          <h2 id="contact-heading">Say hello</h2>
          <p><a href={`mailto:${profile.email}`}>{profile.email}</a><br />Or find me on Discord as exo1k.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
