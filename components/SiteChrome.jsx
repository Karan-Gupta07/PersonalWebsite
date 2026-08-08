import Link from 'next/link';
import { meta, links } from '@/content/site';

const NAV = [
  ['About', '/#about'],
  ['Experience', '/#experience'],
  ['Projects', '/#projects'],
  ['Skills', '/#skills'],
  ['Contact', '/#contact'],
];

export function SiteHeader() {
  return (
    <header className="site-head">
      <div className="wrap bar">
        <Link href="/" className="wordmark">{meta.name}</Link>
        <nav className="site-nav" aria-label="Site">
          {NAV.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
          <a className="res" href={meta.resume} download>Resume ↓</a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="wrap bar meta">
        <span>© {new Date().getFullYear()} {meta.name}</span>
        <span>{meta.location}</span>
        <span>
          <a href={links.find((l) => l.name === 'GitHub').href} target="_blank" rel="noopener noreferrer"
             style={{ textDecoration: 'none' }}>
            Set in Newsreader &amp; Plex Mono
          </a>
        </span>
      </div>
    </footer>
  );
}
