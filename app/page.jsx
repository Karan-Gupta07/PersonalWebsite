import Link from "next/link";
import { profile, projects, experience, stack, awards } from "./content.mjs";
import {
  Header,
  Footer,
  SectionHeading,
  SystemDiagram,
  ProjectArchive,
  Arrow,
} from "./interface";

export default function Home() {
  return (
    <div className="site-shell site-shell--home" id="top">
      <Header />
      <main id="main" tabIndex={-1}>
        <section
          className="command-deck"
          id="overview"
          aria-labelledby="identity-title"
        >
          <div className="landing-register">
            <span>KG–079 / PERSONAL ENGINEERING ARCHIVE</span>
            <span className="landing-register-end">
              SOFTWARE · VISION · AUTONOMY <span className="crosshair" />
            </span>
          </div>
          <div className="landing-scene">
            <div className="landing-identity">
              <h1 id="identity-title">
                <span>KARAN</span> <span>GUPTA</span>
              </h1>
              <div className="landing-caption">
                <span lang="ja">個人記録</span>
                <span>
                  COMPUTER ENGINEERING
                  <br />
                  UNIVERSITY OF WATERLOO
                </span>
              </div>
              <p className="landing-bio">
                AI video systems at Overlap (YC S24).
                <br />
                Previously Amazon · AI evaluation with Wat.ai.
              </p>
              <div className="landing-actions">
                <a className="landing-primary" href="#projects">
                  EXPLORE PROJECTS <Arrow />
                </a>
                <a href={`mailto:${profile.email}`}>
                  EMAIL <Arrow diagonal />
                </a>
              </div>
            </div>
            <SystemDiagram />
          </div>
          <div className="landing-rail">
            <a className="landing-entry" href="#role-0">
              <span>
                CURRENT{" "}
                <span className="landing-rail-detail">
                  / {experience[0].location}
                </span>
              </span>
              <strong>
                {experience[0].company} <small>YC S24</small>
              </strong>
              <span className="landing-entry-note">{experience[0].role}</span>
              <Arrow />
            </a>
            <Link
              className="landing-entry landing-feature"
              href="/project/dominiq"
            >
              <span>
                FEATURED{" "}
                <span className="landing-rail-detail">PROJECT / PRJ–06</span>
              </span>
              <strong>DominIQ</strong>
              <span className="landing-entry-note">
                Hack The North 2026 winner
              </span>
              <Arrow />
            </Link>
            <a
              className="landing-entry landing-resume"
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              <span>RESUME / PDF</span>
              <strong>Resume</strong>
              <span className="landing-entry-note">
                <span className="landing-rail-detail">Updated </span>
                <time dateTime={profile.resumeUpdated}>
                  {new Date(profile.resumeUpdated).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
              </span>
              <Arrow diagonal />
            </a>
          </div>
        </section>

        <section
          className="archive-section"
          id="projects"
          aria-labelledby="projects-heading"
        >
          <SectionHeading
            id="projects-heading"
            number="01"
            title="PROJECT ARCHIVE"
            count={`${String(projects.length).padStart(2, "0")} RECORDS`}
          />
          <ProjectArchive />
        </section>

        <section
          className="archive-section"
          id="experience"
          aria-labelledby="experience-heading"
        >
          <SectionHeading
            id="experience-heading"
            number="02"
            title="EXPERIENCE"
            count={`${String(experience.length).padStart(2, "0")} RECORDS`}
          />
          <div className="experience-layout">
            <div className="experience-list">
              {experience.map((job, i) => (
                <details
                  className="experience-entry"
                  id={`role-${i}`}
                  key={job.company}
                  open={i === 0}
                >
                  <summary>
                    <span className="entry-index">
                      {String(i + 1).padStart(2, "0")}
                      <i />
                    </span>
                    <span className="entry-heading">
                      <span className="entry-meta">
                        {job.date}
                        {job.current && (
                          <span className="current-label">CURRENT</span>
                        )}
                      </span>
                      <strong>{job.company}</strong>
                      <span className="entry-role">{job.role}</span>
                    </span>
                    <span className="expand-symbol" aria-hidden="true" />
                  </summary>
                  <div className="entry-body">
                    <p className="eyebrow">{job.field}</p>
                    <ul>
                      {job.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <div className="entry-end">
                      END OF RECORD / {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                </details>
              ))}
            </div>
            <aside className="stack-panel" id="stack">
              <div className="stack-title">
                <h3>
                  TECHNICAL <br />
                  INVENTORY
                </h3>
                <span className="inventory-glyph" aria-hidden="true">
                  技
                </span>
              </div>
              {Object.entries(stack).map(([category, items], index) => (
                <div className="stack-group" key={category}>
                  <h4>
                    <span>0{index + 1}</span>
                    {category}
                  </h4>
                  <ul>
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section
          className="archive-section"
          id="personnel"
          aria-labelledby="personnel-heading"
        >
          <SectionHeading
            id="personnel-heading"
            number="03"
            title="PERSONNEL FILE"
            count="KG–079"
          />
          <div className="personnel-grid">
            <div className="personal-file">
              <h3>
                Keyboards,
                <br />
                films &amp; music.
              </h3>
              <div className="personal-note">
                <span>FILM</span>
                <p>
                  I log everything on{" "}
                  <a
                    href={profile.links.letterboxd}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Letterboxd <Arrow diagonal />
                  </a>
                  .
                </p>
              </div>
              <div className="personal-note">
                <span>KEYBOARDS &amp; PC BUILDING</span>
                <p>
                  35+ custom keyboards built and sold. I love the craft of
                  keyboards and PC building.
                </p>
                <small>
                  CURRENT RIG / NZXT H6 FLOW · 13600KF · 9070XT · VENGEANCE
                  7000MHz CL34
                </small>
              </div>
              <div className="personal-note">
                <span>OTHER INTERESTS</span>
                <p>
                  Manga, martial arts, motorsports.
                  <br />
                  Music: rage, EDM, and hyperpop.
                </p>
                <a
                  className="text-link"
                  href={profile.links.music}
                  target="_blank"
                  rel="noreferrer"
                >
                  MUSIC LOG / AOTY <Arrow diagonal />
                </a>
              </div>
            </div>
            <div className="distinctions-panel">
              <h3>AWARDS &amp; COMPETITIONS</h3>
              <ol className="award-list">
                {awards.map(([number, title, detail]) => (
                  <li key={number}>
                    <span>{number}</span>
                    <div>
                      <strong>{title}</strong>
                      <p>{detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="education-record">
                <span className="education-symbol" aria-hidden="true">
                  W
                </span>
                <div>
                  <h4>{profile.university}</h4>
                  <p>
                    {profile.education} · {profile.minor}
                  </p>
                </div>
                <div className="gpa">
                  <strong>{profile.gpa}</strong>
                  <span>GPA</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="contact-topline">
            <span>04 / COMMUNICATIONS</span>
            <span>INTERNSHIPS &amp; COLLABORATION</span>
          </div>
          <div className="contact-main">
            <h2 id="contact-title">CONTACT</h2>
            <div className="contact-actions">
              <a className="email-link" href={`mailto:${profile.email}`}>
                {profile.email}
                <Arrow diagonal />
              </a>
              <p>
                For internships, project questions, or a conversation about the
                work here, email me.
              </p>
              <div className="social-links">
                <a href={profile.links.github} target="_blank" rel="noreferrer">
                  GITHUB <Arrow diagonal />
                </a>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LINKEDIN <Arrow diagonal />
                </a>
                <a href={profile.resume} target="_blank" rel="noreferrer">
                  RESUME <Arrow diagonal />
                </a>
              </div>
              <span className="discord-handle">DISCORD / exo1k</span>
            </div>
          </div>
          <div className="contact-bottom">
            <span>KG–079 / END OF FILE</span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
