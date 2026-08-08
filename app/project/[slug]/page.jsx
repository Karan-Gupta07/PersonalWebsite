import Link from 'next/link';
import { notFound } from 'next/navigation';
import { meta, projects } from '@/content/site';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = projects.find((x) => x.slug === params.slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${meta.name}`,
    description: p.deck,
  };
}

export default function ProjectPage({ params }) {
  const idx = projects.findIndex((x) => x.slug === params.slug);
  if (idx === -1) notFound();
  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />

      <main id="main">
        <header className="wrap case-hero">
          <div className="crumbs meta">
            <Link href="/#projects">← Selected work</Link>
            <span aria-hidden="true">/</span>
            <span>{p.figure.index}</span>
          </div>
          <h1>{p.name}</h1>
          <p className="deck">{p.deck}</p>
          <div className="specs meta">
            <div>Role<span className="v">{p.role}</span></div>
            <div>Technology<span className="v">{p.tech}</span></div>
            <div>Result<span className="v">{p.result}</span></div>
          </div>
        </header>

        <figure className="reveal case-fig">
          <span className="big">{p.figure.value}</span>
          <figcaption className="cap meta">{p.figure.label}</figcaption>
        </figure>

        <div className="wrap">
          {p.sections.map((s) => (
            <section className="reveal case-sec" key={s.n}>
              <div className="label">
                <span className="no">{s.n}</span>
                <h2>{s.title}</h2>
              </div>
              <p className="body">{s.body}</p>
            </section>
          ))}

          <nav className="case-next" aria-label="Next project">
            <Link href={`/project/${next.slug}`}>
              <span className="meta">Next / {next.figure.index}</span>
              <span className="nm">{next.name}<span className="arw" aria-hidden="true">→</span></span>
            </Link>
          </nav>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
