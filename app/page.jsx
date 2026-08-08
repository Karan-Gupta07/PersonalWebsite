import Link from 'next/link';
import { meta, links, experience, projects, skills, awards, about } from '@/content/site';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import SpotifyWidget from '@/components/SpotifyWidget';

function SectionHead({ no, title, aside }) {
  return (
    <div className="section-head">
      <span className="no">{no}</span>
      <h2>{title}</h2>
      {aside ? <span className="meta aside">{aside}</span> : null}
    </div>
  );
}

function FeaturedWork({ p, i }) {
  return (
    <article className={`reveal work${i % 2 === 1 ? ' flip' : ''}`}>
      <Link href={`/project/${p.slug}`} className="hit">
        <div className="inner">
          <div className="txt">
            <span className="idx">{p.figure.index} / Selected work</span>
            <h3>{p.name}</h3>
            <p className="deck">{p.deck}</p>
          </div>
          <div className="fig" aria-hidden="true">
            <span className="big">{p.figure.value}</span>
            <span className="cap meta">{p.figure.label}</span>
          </div>
        </div>
        <div className="specs meta">
          <div>Role<span className="v">{p.role}</span></div>
          <div>Technology<span className="v">{p.tech}</span></div>
          <div>Result<span className="v">{p.result}</span></div>
        </div>
      </Link>
    </article>
  );
}

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />

      <main id="main">
        {/* ── hero ── */}
        <section className="wrap hero">
          <div className="kicker meta">
            <span>{meta.location}</span>
            <span>{meta.year} →</span>
          </div>
          <h1>
            {meta.first} {meta.last},<br />
            software <em>engineer</em>
          </h1>
          <div className="under">
            <p className="standfirst">{meta.standfirst}</p>
            <div className="facts">
              <div className="row"><span className="meta">Studying</span><span className="v">{meta.school}</span></div>
              <div className="row"><span className="meta">GPA</span><span className="v">{meta.gpa}</span></div>
              <div className="row"><span className="meta">Currently</span><span className="v">SDE Intern, Amazon</span></div>
              <div className="row"><span className="meta">Resume</span><a className="v" href={meta.resume} download>KaranGuptaResume.pdf ↓</a></div>
            </div>
          </div>
        </section>

        {/* ── selected work ── */}
        <section className="wrap section" id="projects">
          <SectionHead no="01" title="Selected work" aside={`${projects.length} projects`} />
          {featured.map((p, i) => <FeaturedWork key={p.slug} p={p} i={i} />)}
          <ul className="work-etc">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link href={`/project/${p.slug}`}>
                  <span className="meta">{p.figure.index}</span>
                  <span className="nm">{p.name}</span>
                  <span className="dk">{p.deck}</span>
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── experience ── */}
        <section className="wrap section" id="experience">
          <SectionHead no="02" title="Experience" aside="2022 — present" />
          {experience.map((e) => (
            <article className="reveal xp" key={e.org + e.role}>
              <div className="inner">
                <span className="year" aria-hidden="true">{e.year}</span>
                <div>
                  <h3>{e.org}{e.unit ? <small>{e.unit}</small> : null}</h3>
                  <p className="role">
                    <span className="meta">{e.role}</span>
                    <span className="r">{e.summary}</span>
                  </p>
                </div>
                <div className="side">
                  <span className="big">{e.result.value}</span>
                  <span className="cap meta">{e.result.label}</span>
                  <span className="cap meta">{e.period}</span>
                </div>
                <ul className="body">
                  {e.bullets.map((b) => <li key={b.slice(0, 32)}>{b}</li>)}
                </ul>
                <p className="tech meta">{e.tech}</p>
              </div>
            </article>
          ))}
        </section>

        {/* ── skills ── */}
        <section className="wrap section" id="skills">
          <SectionHead no="03" title="Skills" aside="proven by the work" />
          <div className="skills">
            {skills.map((cat) => (
              <div key={cat.label}>
                <h3>{cat.label}</h3>
                <ul>
                  {cat.items.map((s) => (
                    <li key={s.name}>
                      <span className="nm">{s.name}</span>
                      {s.via ? <span className="via">{s.via}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="awards">
            <SectionHead no="+" title="Recognition" aside={`${awards.length} entries`} />
            <ul style={{ marginTop: '1.5rem' }}>
              {awards.map((a) => (
                <li key={a.name}>
                  <span className="rk">{a.rank}</span>
                  <span className="aw">{a.name}{a.note ? <em>{a.note}</em> : null}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── about ── */}
        <section className="wrap section" id="about">
          <SectionHead no="04" title="About" />
          <div className="about">
            <div>
              <p className="lead">{about.lead}</p>
              <div className="prose">
                {about.body.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              </div>
            </div>
            <aside>
              <div className="row"><span className="meta">Elsewhere</span>
                <span className="v">
                  {links.filter((l) => l.href && l.name !== 'Email').map((l, i, arr) => (
                    <span key={l.name}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer">{l.name}</a>
                      {i < arr.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </span>
              </div>
              <div className="row"><span className="meta">Discord</span><span className="v">exo1k</span></div>
              <div className="row"><span className="meta">Off the clock</span><span className="v">Keyboards, film, motorsports, manga, martial arts, music.</span></div>
              <SpotifyWidget />
            </aside>
          </div>
        </section>

        {/* ── contact ── */}
        <section className="wrap contact" id="contact">
          <p className="close serif">
            The interesting problems have numbers attached.{' '}
            <a href={`mailto:${meta.email}`}>Send me one.</a>
          </p>
          <div className="grid meta">
            {links.map((l) => (
              <div key={l.name}>
                {l.name}
                {l.href
                  ? <a className="v" href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.handle}</a>
                  : <span className="v">{l.handle}</span>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
