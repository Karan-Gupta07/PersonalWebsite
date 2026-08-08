// Renders four dark theme mockups to static HTML from the real site
// content, so the themes can be compared on design alone.
//
//   node concepts/dark/build.mjs
//
// Each theme supplies its own CSS and its own section layout. They do
// not share a stylesheet on purpose: the point is to compare distinct
// designs, not variants of one.

import { writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { meta, links, experience, projects, skills, awards, about } from '../../content/site.js';

const HERE = dirname(fileURLToPath(new URL(import.meta.url)));

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENT[c]);
const featured = projects.filter((p) => p.featured);
const others = projects.filter((p) => !p.featured);

const FONTS = `
@font-face{font-family:'NR';src:url('./fonts/newsreader-wide.woff2')format('woff2-variations');font-weight:300 800;font-display:swap}
@font-face{font-family:'NR';src:url('./fonts/newsreader-wide-italic.woff2')format('woff2-variations');font-weight:300 800;font-style:italic;font-display:swap}
@font-face{font-family:'PM';src:url('./fonts/plex-mono-regular.woff2')format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'PM';src:url('./fonts/plex-mono-medium.woff2')format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'PM';src:url('./fonts/plex-mono-semibold.woff2')format('woff2');font-weight:600;font-display:swap}
`;

const RESET = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth;overflow-x:hidden;scroll-padding-top:5rem}
body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;font-kerning:normal}
h1,h2,h3,h4{font-weight:500}
ul,ol{list-style:none}a{color:inherit}img,svg{display:block;max-width:100%}
:focus-visible{outline:2px solid currentColor;outline-offset:3px}
.vh{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.skip{position:absolute;left:-9999px;top:0;z-index:99;padding:.75rem 1rem;font-family:'PM';font-size:11px;letter-spacing:.16em;text-transform:uppercase;text-decoration:none}
.skip:focus{left:.5rem;top:.5rem}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{transition-duration:.001ms!important;animation-duration:.001ms!important}}
`;

// The switcher is scaffolding for comparing mockups, not part of any
// theme, so it stays visually quiet until hovered.
const THEMES = [
  ['ink.html', 'Ink'],
  ['brut.html', 'Brutalist'],
  ['noir.html', 'Noir'],
  ['plate.html', 'Plate'],
];
const SWITCH = `
.sw{position:fixed;right:14px;bottom:14px;z-index:80;display:flex;font-family:'PM';font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;background:rgba(8,8,10,.94);border:1px solid rgba(255,255,255,.16);opacity:.5;transition:opacity 180ms ease;backdrop-filter:blur(6px)}
.sw:hover,.sw:focus-within{opacity:1}
.sw a{color:rgba(255,255,255,.66);text-decoration:none;padding:8px 11px;border-right:1px solid rgba(255,255,255,.12)}
.sw a:last-child{border-right:0}
.sw a:hover{color:#fff;background:rgba(255,255,255,.09)}
.sw a[aria-current=page]{color:#fff;background:rgba(255,255,255,.16)}
`;
const switcher = (self) => `<nav class="sw" aria-label="Theme">${THEMES
  .map(([f, n]) => `<a href="./${f}"${f === self ? ' aria-current="page"' : ''}>${n}</a>`).join('')}</nav>`;

const page = (file, title, css, body) => `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.name)} — ${esc(title)}</title>
<link rel="preload" href="./fonts/newsreader-wide.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="./fonts/plex-mono-medium.woff2" as="font" type="font/woff2" crossorigin>
<style>${FONTS}${RESET}${SWITCH}${css}</style>
</head><body>
<a class="skip" href="#main">Skip to content</a>
${body}
${switcher(file)}
</body></html>`;

const NAV = [['About', '#about'], ['Experience', '#experience'], ['Projects', '#projects'], ['Skills', '#skills'], ['Contact', '#contact']];

/* ═══════════════════════════════════════════════════════════════
   1. INK — warm dark editorial.
   Near-black paper with a warm cast, ivory text, burnt-amber accent.
   Structure: a full-height opening spread, then alternating bands
   of near-black and slightly-lifted charcoal so the page has a
   rhythm you can feel while scrolling.
   ═══════════════════════════════════════════════════════════════ */
const inkCSS = `
:root{
  --bg:#12100e; --bg2:#191713; --bg3:#221f1a;
  --tx:#f2ece1; --tx2:#b8b0a2; --tx3:#7d7669;
  --ac:#d98324; --line:#2e2a24; --line2:#413b32;
}
body{background:var(--bg);color:var(--tx);font-family:'PM';font-size:15px;line-height:1.6}
.w{max-width:82rem;margin:0 auto;padding:0 clamp(1.25rem,4vw,3.5rem)}
.mt{font-family:'PM';font-size:10.5px;font-weight:500;letter-spacing:.19em;text-transform:uppercase;color:var(--tx3)}
.skip{background:var(--ac);color:#12100e}

/* header */
.hd{position:sticky;top:0;z-index:40;background:rgba(18,16,14,.88);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.hd .in{display:flex;align-items:baseline;gap:1.5rem;padding:.95rem 0}
.hd .wm{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;text-decoration:none}
.hd nav{margin-left:auto;display:flex;gap:clamp(.85rem,2.4vw,1.9rem);min-width:0;overflow-x:auto;scrollbar-width:none}
.hd nav::-webkit-scrollbar{display:none}
.hd nav a{font-size:10.5px;font-weight:500;letter-spacing:.19em;text-transform:uppercase;color:var(--tx3);text-decoration:none;white-space:nowrap;transition:color .2s}
.hd nav a:hover{color:var(--ac)}.hd nav a.r{color:var(--ac)}

/* opening spread: fills the first screen, so the site opens like a cover */
.op{min-height:88vh;display:flex;flex-direction:column;justify-content:center;padding:clamp(3rem,9vh,7rem) 0 clamp(2rem,5vh,4rem);position:relative}
.op .kick{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding-bottom:1.5rem;border-bottom:1px solid var(--line)}
.op h1{font-family:'NR';font-size:clamp(2.9rem,1.9rem + 5.4vw,6.4rem);font-variation-settings:'opsz' 44;font-weight:420;line-height:1.02;letter-spacing:-.022em;margin:clamp(1.5rem,4vh,2.75rem) 0;max-width:24ch;text-wrap:balance}
.op h1 em{font-style:italic;font-weight:380;color:var(--ac)}
.op .btm{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:2rem clamp(1.5rem,5vw,4rem);padding-top:1.75rem;border-top:1px solid var(--line)}
.op .sf{font-family:'NR';font-size:clamp(1.1rem,1rem + .55vw,1.45rem);font-variation-settings:'opsz' 16;font-weight:380;line-height:1.55;color:var(--tx2);max-width:42ch}
.op dl{display:grid;gap:.6rem;align-content:start}
.op dl>div{display:grid;grid-template-columns:6rem minmax(0,1fr);gap:1rem;align-items:baseline}
.op dd{font-size:13.5px;color:var(--tx2)}
.op dd a{color:var(--ac);text-decoration:none;border-bottom:1px solid rgba(217,131,36,.35)}
.op dd a:hover{border-bottom-color:var(--ac)}

/* alternating bands give the scroll a pulse */
.band{padding:clamp(3.5rem,7vh,6rem) 0}
.band.alt{background:var(--bg2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.band.deep{background:#0c0b09}
.sh{display:flex;align-items:baseline;gap:1.1rem;padding-bottom:.85rem;border-bottom:1px solid var(--line2)}
.sh .n{font-size:10.5px;font-weight:500;letter-spacing:.19em;color:var(--ac)}
.sh h2{font-family:'PM';font-size:14px;font-weight:600;letter-spacing:.15em;text-transform:uppercase}
.sh .as{margin-left:auto}

/* projects: a wide numbered row that lifts on hover */
.pj{display:block;text-decoration:none;border-bottom:1px solid var(--line);transition:background .22s,padding .22s}
.pj:hover,.pj:focus-visible{background:var(--bg3)}
.pj .r1{display:grid;grid-template-columns:3.5rem minmax(0,1fr) auto;gap:1.25rem clamp(1rem,3vw,2.5rem);align-items:baseline;padding:1.6rem 0 .4rem}
.pj .no{font-size:11px;letter-spacing:.16em;color:var(--tx3)}
.pj h3{font-family:'NR';font-size:clamp(1.6rem,1.3rem + 1.5vw,2.6rem);font-variation-settings:'opsz' 32;font-weight:460;letter-spacing:-.018em;line-height:1.05;transition:color .22s}
.pj:hover h3{color:var(--ac)}
.pj .fig{font-family:'NR';font-size:clamp(1.5rem,1.2rem + 1.2vw,2.2rem);font-variation-settings:'opsz' 28;font-weight:500;color:var(--ac);letter-spacing:-.02em;white-space:nowrap;font-variant-numeric:lining-nums}
.pj .r2{display:grid;grid-template-columns:3.5rem minmax(0,1fr) auto;gap:1.25rem clamp(1rem,3vw,2.5rem);padding:0 0 1.6rem}
.pj .dk{grid-column:2;font-family:'NR';font-size:1.0625rem;font-style:italic;font-weight:380;color:var(--tx2);line-height:1.45;max-width:46ch}
.pj .cap{grid-column:3;text-align:right;max-width:11rem;margin-left:auto}
.pj .sp{grid-column:2;display:flex;flex-wrap:wrap;gap:.35rem 1.5rem;margin-top:.85rem}
.pj .sp span{font-size:11px;letter-spacing:.05em;color:var(--tx3)}
.pj .sp b{color:var(--tx2);font-weight:400}
.pjmore{margin-top:1.75rem;display:flex;flex-wrap:wrap;gap:.75rem 2rem}
.pjmore a{font-size:12px;letter-spacing:.06em;color:var(--tx2);text-decoration:none;border-bottom:1px solid var(--line2);padding-bottom:2px;transition:color .2s,border-color .2s}
.pjmore a:hover{color:var(--ac);border-bottom-color:var(--ac)}

/* experience */
.xp{display:grid;grid-template-columns:7rem minmax(0,1fr) 12rem;gap:1rem clamp(1.25rem,4vw,3rem);padding:1.9rem 0;border-bottom:1px solid var(--line)}
.xp .yr{font-family:'NR';font-size:1.5rem;font-variation-settings:'opsz' 24;font-weight:380;color:var(--tx3);font-variant-numeric:lining-nums}
.xp h3{font-family:'NR';font-size:clamp(1.4rem,1.2rem + 1vw,2.05rem);font-variation-settings:'opsz' 28;font-weight:460;letter-spacing:-.015em;line-height:1.08}
.xp h3 small{font-family:'PM';font-size:9.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--ac);margin-left:.6rem;vertical-align:.4em}
.xp .rl{margin-top:.4rem;font-size:10.5px;font-weight:500;letter-spacing:.17em;text-transform:uppercase;color:var(--tx3)}
.xp .sm{margin-top:.5rem;font-family:'NR';font-size:1.0625rem;font-style:italic;font-weight:380;color:var(--tx2)}
.xp ul{margin-top:1rem;display:grid;gap:.6rem;max-width:64ch}
.xp li{font-size:13.5px;line-height:1.68;color:var(--tx2);padding-left:1.1rem;position:relative}
.xp li::before{content:'';position:absolute;left:0;top:.7em;width:.45rem;height:1px;background:var(--line2)}
.xp .tc{margin-top:.9rem;font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--tx3)}
.xp .sd{text-align:right}
.xp .sd .b{font-family:'NR';font-size:clamp(1.5rem,1.3rem + 1vw,2.1rem);font-variation-settings:'opsz' 28;font-weight:500;color:var(--ac);line-height:1;letter-spacing:-.02em;display:block;font-variant-numeric:lining-nums}
.xp .sd .c{display:block;margin-top:.45rem}

/* skills */
.sk{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2.5rem clamp(1.5rem,4vw,3rem);margin-top:2rem}
.sk h3{font-size:10.5px;font-weight:600;letter-spacing:.19em;text-transform:uppercase;color:var(--ac);padding-bottom:.7rem;border-bottom:1px solid var(--line2)}
.sk li{padding:.55rem 0;border-bottom:1px solid var(--line)}
.sk .nm{font-family:'NR';font-size:1.125rem;font-weight:420}
.sk .vi{display:block;margin-top:.1rem;font-size:10px;letter-spacing:.09em;color:var(--tx3)}
.aw{margin-top:3rem}
.aw li{display:grid;grid-template-columns:7rem minmax(0,1fr);gap:1.25rem;padding:.65rem 0;border-bottom:1px solid var(--line);align-items:baseline}
.aw .rk{font-size:10px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--ac)}
.aw .nm{font-family:'NR';font-size:1.0625rem}
.aw .nm i{color:var(--tx3);margin-left:.5rem}

/* about */
.ab{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:2.5rem clamp(1.5rem,5vw,4rem);margin-top:2rem}
.ab .ld{font-family:'NR';font-size:clamp(1.5rem,1.2rem + 1.8vw,2.4rem);font-variation-settings:'opsz' 32;font-weight:420;line-height:1.22;letter-spacing:-.015em;text-wrap:balance}
.ab .pr{margin-top:1.6rem;display:grid;gap:1rem;max-width:62ch;color:var(--tx2);font-size:14.5px;line-height:1.72}
.ab aside{border-left:1px solid var(--line2);padding-left:1.5rem;align-self:start;display:grid;gap:1.1rem}
.ab aside .v{display:block;margin-top:.25rem;font-size:13px;color:var(--tx2)}
.ab aside a{color:var(--tx);text-decoration:none;border-bottom:1px solid var(--line2)}
.ab aside a:hover{color:var(--ac);border-bottom-color:var(--ac)}

/* contact */
.ct{padding:clamp(3.5rem,8vh,6.5rem) 0 clamp(2.5rem,5vh,4rem)}
.ct .cl{font-family:'NR';font-size:clamp(1.75rem,1.4rem + 2.2vw,3.1rem);font-variation-settings:'opsz' 36;font-weight:440;line-height:1.12;letter-spacing:-.02em;max-width:26ch;text-wrap:balance}
.ct .cl a{color:var(--ac);text-decoration:none;border-bottom:2px solid rgba(217,131,36,.35)}
.ct .cl a:hover{border-bottom-color:var(--ac)}
.ct .gr{margin-top:2.75rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr));border-top:1px solid var(--line2)}
.ct .gr>div{padding:.9rem 1rem .2rem 0}
.ct .gr .v{display:block;margin-top:.3rem;font-size:13px;color:var(--tx2);letter-spacing:0;text-transform:none}
.ct .gr a.v{color:var(--tx);text-decoration:none;border-bottom:1px solid var(--line2)}
.ct .gr a.v:hover{color:var(--ac);border-bottom-color:var(--ac)}
.ft{border-top:1px solid var(--line);padding:1.1rem 0 2.5rem;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}

@media(max-width:60rem){
  .hd .wm{display:none}.hd nav{margin-left:0}
  .op .btm,.ab,.sk{grid-template-columns:minmax(0,1fr)}
  .op{min-height:0}
  .pj .r1,.pj .r2{grid-template-columns:minmax(0,1fr)}
  .pj .dk,.pj .cap,.pj .sp{grid-column:1}
  .pj .cap{text-align:left;margin-left:0}
  .xp{grid-template-columns:minmax(0,1fr)}
  .xp .sd{text-align:left}
  .ab aside{border-left:0;padding-left:0;border-top:1px solid var(--line2);padding-top:1.25rem}
}
`;

const inkBody = `
<header class="hd"><div class="w in">
  <a class="wm" href="#">${esc(meta.name)}</a>
  <nav aria-label="Site">${NAV.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}<a class="r" href="${esc(meta.resume)}">Resume ↓</a></nav>
</div></header>

<main id="main">
<section class="w op">
  <div class="kick mt"><span>${esc(meta.location)}</span><span>${esc(meta.year)} →</span></div>
  <h1>${esc(meta.first)} ${esc(meta.last)}, software <em>engineer</em></h1>
  <div class="btm">
    <p class="sf">${esc(meta.standfirst)}</p>
    <dl>
      <div><dt class="mt">Studying</dt><dd>${esc(meta.school)}</dd></div>
      <div><dt class="mt">GPA</dt><dd>${esc(meta.gpa)}</dd></div>
      <div><dt class="mt">Currently</dt><dd>SDE Intern, Amazon</dd></div>
      <div><dt class="mt">Resume</dt><dd><a href="${esc(meta.resume)}">KaranGuptaResume.pdf ↓</a></dd></div>
    </dl>
  </div>
</section>

<section class="band alt" id="projects"><div class="w">
  <div class="sh"><span class="n">01</span><h2>Selected work</h2><span class="as mt">${projects.length} projects</span></div>
  ${featured.map((p) => `
  <a class="pj" href="#${esc(p.slug)}">
    <div class="r1">
      <span class="no">${esc(p.figure.index)}</span>
      <h3>${esc(p.name)}</h3>
      <span class="fig">${esc(p.figure.value)}</span>
    </div>
    <div class="r2">
      <p class="dk">${esc(p.deck)}</p>
      <span class="cap mt">${esc(p.figure.label)}</span>
      <span class="sp"><span>Role <b>${esc(p.role)}</b></span><span>Stack <b>${esc(p.tech)}</b></span><span>Result <b>${esc(p.result)}</b></span></span>
    </div>
  </a>`).join('')}
  <p class="pjmore">${others.map((p) => `<a href="#${esc(p.slug)}">${esc(p.figure.index)} &nbsp; ${esc(p.name)} →</a>`).join('')}</p>
</div></section>

<section class="band" id="experience"><div class="w">
  <div class="sh"><span class="n">02</span><h2>Experience</h2><span class="as mt">2022 — present</span></div>
  ${experience.map((e) => `
  <article class="xp">
    <span class="yr" aria-hidden="true">${esc(e.year)}</span>
    <div>
      <h3>${esc(e.org)}${e.unit ? `<small>${esc(e.unit)}</small>` : ''}</h3>
      <p class="rl">${esc(e.role)}</p>
      <p class="sm">${esc(e.summary)}</p>
      <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      <p class="tc">${esc(e.tech)}</p>
    </div>
    <div class="sd"><span class="b">${esc(e.result.value)}</span><span class="c mt">${esc(e.result.label)}</span><span class="c mt">${esc(e.period)}</span></div>
  </article>`).join('')}
</div></section>

<section class="band alt" id="skills"><div class="w">
  <div class="sh"><span class="n">03</span><h2>Skills</h2><span class="as mt">proven by the work</span></div>
  <div class="sk">${skills.map((c) => `
    <div><h3>${esc(c.label)}</h3><ul>${c.items.map((s) => `<li><span class="nm">${esc(s.name)}</span>${s.via ? `<span class="vi">${esc(s.via)}</span>` : ''}</li>`).join('')}</ul></div>`).join('')}
  </div>
  <div class="aw">
    <div class="sh"><span class="n">+</span><h2>Recognition</h2><span class="as mt">${awards.length} entries</span></div>
    <ul style="margin-top:1.25rem">${awards.map((a) => `<li><span class="rk">${esc(a.rank)}</span><span class="nm">${esc(a.name)}${a.note ? `<i>${esc(a.note)}</i>` : ''}</span></li>`).join('')}</ul>
  </div>
</div></section>

<section class="band" id="about"><div class="w">
  <div class="sh"><span class="n">04</span><h2>About</h2></div>
  <div class="ab">
    <div>
      <p class="ld">${esc(about.lead)}</p>
      <div class="pr">${about.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    </div>
    <aside>
      <div><span class="mt">Elsewhere</span><span class="v">${links.filter((l) => l.href && l.name !== 'Email').map((l) => `<a href="${esc(l.href)}">${esc(l.name)}</a>`).join(' · ')}</span></div>
      <div><span class="mt">Discord</span><span class="v">exo1k</span></div>
      <div><span class="mt">Off the clock</span><span class="v">Keyboards, film, motorsports, manga, martial arts, music.</span></div>
    </aside>
  </div>
</div></section>
</main>

<footer class="band deep" id="contact"><div class="w ct">
  <p class="cl">The interesting problems have numbers attached. <a href="mailto:${esc(meta.email)}">Send me one.</a></p>
  <div class="gr mt">${links.map((l) => `<div>${esc(l.name)}${l.href ? `<a class="v" href="${esc(l.href)}">${esc(l.handle)}</a>` : `<span class="v">${esc(l.handle)}</span>`}</div>`).join('')}</div>
  <div class="ft mt"><span>© 2026 ${esc(meta.name)}</span><span>${esc(meta.location)}</span></div>
</div></footer>
`;

/* ═══════════════════════════════════════════════════════════════
   2. BRUTALIST — hard grid, visible structure.
   Pure black, off-white, one acid accent. Everything sits in a
   drawn table: thick rules, boxed cells, uppercase mono headings,
   oversized numerals. The opposite of soft.
   ═══════════════════════════════════════════════════════════════ */
const brutCSS = `
:root{
  --bg:#0a0a0a; --bg2:#121212; --tx:#f5f5f0; --tx2:#a8a8a2; --tx3:#6e6e68;
  --ac:#c8f04a; --line:#2a2a2a; --line2:#454540;
}
body{background:var(--bg);color:var(--tx);font-family:'PM';font-size:14px;line-height:1.55}
.w{max-width:92rem;margin:0 auto;padding:0 clamp(1rem,2.5vw,2rem)}
.mt{font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--tx3)}
.skip{background:var(--ac);color:#0a0a0a}

.hd{position:sticky;top:0;z-index:40;background:var(--bg);border-bottom:2px solid var(--tx)}
.hd .in{display:flex;align-items:center;gap:1.5rem;padding:.8rem 0}
.hd .wm{font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;text-decoration:none}
.hd nav{margin-left:auto;display:flex;min-width:0;overflow-x:auto;scrollbar-width:none}
.hd nav::-webkit-scrollbar{display:none}
.hd nav a{font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--tx3);text-decoration:none;white-space:nowrap;padding:.3rem .9rem;border-left:1px solid var(--line)}
.hd nav a:first-child{border-left:0}
.hd nav a:hover{color:var(--ac)}
.hd nav a.r{color:var(--ac)}

/* hero: the name as a stacked slab, each line its own row */
.hero{border-bottom:2px solid var(--tx)}
.hero .top{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:1.1rem 0;border-bottom:1px solid var(--line)}
.hero h1{font-family:'PM';font-weight:600;font-size:clamp(2.1rem,1rem + 7vw,7.5rem);line-height:.94;letter-spacing:-.045em;text-transform:uppercase;padding:clamp(1.5rem,4vh,3rem) 0}
.hero h1 span{display:block}
.hero h1 .ac{color:var(--ac)}
.hero .btm{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);border-top:1px solid var(--line)}
.hero .btm>div{padding:1.4rem 1.5rem 1.6rem 0}
.hero .btm>div+div{border-left:1px solid var(--line);padding-left:1.5rem}
.hero .sf{font-family:'NR';font-size:clamp(1.05rem,.95rem + .5vw,1.35rem);font-weight:400;line-height:1.55;color:var(--tx2);max-width:44ch}
.hero dl>div{display:grid;grid-template-columns:5.5rem minmax(0,1fr);gap:.75rem;padding:.3rem 0}
.hero dd{font-size:13px;color:var(--tx2)}
.hero dd a{color:var(--ac);text-decoration:none;border-bottom:1px solid currentColor}

.sec{border-bottom:2px solid var(--tx)}
.sh{display:flex;align-items:center;gap:1rem;padding:.85rem 0;border-bottom:1px solid var(--line)}
.sh .n{font-size:10px;font-weight:600;letter-spacing:.2em;color:var(--ac)}
.sh h2{font-family:'PM';font-size:13px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.sh .as{margin-left:auto}

/* projects as a hard table */
.tb{width:100%;border-collapse:collapse}
.tb th,.tb td{text-align:left;padding:1.15rem 1.25rem 1.15rem 0;border-bottom:1px solid var(--line);vertical-align:top;font-weight:400}
.tb thead th{font-size:9.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--tx3);padding-top:.7rem;padding-bottom:.7rem;border-bottom:1px solid var(--line2);white-space:nowrap}
.tb tbody tr{transition:background .18s}
.tb tbody tr:hover{background:var(--bg2)}
.tb .c-no{width:3rem;font-size:11px;color:var(--tx3)}
.tb .c-nm{width:16rem}
.tb .c-nm a{font-family:'PM';font-size:clamp(1.05rem,.95rem + .6vw,1.45rem);font-weight:600;letter-spacing:-.01em;text-transform:uppercase;text-decoration:none;line-height:1.1;display:block;transition:color .18s}
.tb tbody tr:hover .c-nm a{color:var(--ac)}
.tb .c-nm .dk{display:block;margin-top:.5rem;font-family:'NR';font-size:.9375rem;font-style:italic;color:var(--tx2);line-height:1.45;text-transform:none;letter-spacing:0;font-weight:400}
.tb .c-fg{width:9rem}
.tb .c-fg b{font-family:'PM';font-size:clamp(1.2rem,1rem + .9vw,1.85rem);font-weight:600;color:var(--ac);letter-spacing:-.02em;display:block;line-height:1;font-variant-numeric:lining-nums}
.tb .c-fg small{display:block;margin-top:.45rem;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3);line-height:1.5}
.tb .c-dt{font-size:12.5px;color:var(--tx2);line-height:1.7}
.tb .c-dt b{color:var(--tx);font-weight:400}
.tb .c-dt span{display:block}

/* experience: boxed cells */
.xg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
.xg article{padding:1.5rem 1.5rem 1.75rem 0;border-bottom:1px solid var(--line)}
.xg article:nth-child(odd){padding-right:1.5rem}
.xg article:nth-child(even){border-left:1px solid var(--line);padding-left:1.5rem}
.xg .hd2{display:flex;align-items:baseline;gap:.85rem;flex-wrap:wrap}
.xg h3{font-family:'PM';font-size:clamp(1.05rem,.95rem + .55vw,1.4rem);font-weight:600;letter-spacing:-.005em;text-transform:uppercase;line-height:1.1}
.xg .yr{font-size:10px;letter-spacing:.18em;color:var(--tx3);margin-left:auto}
.xg .big{font-family:'PM';font-size:1.5rem;font-weight:600;color:var(--ac);letter-spacing:-.02em;font-variant-numeric:lining-nums}
.xg .met{display:flex;align-items:baseline;gap:.6rem;margin-top:.9rem;padding-top:.75rem;border-top:1px solid var(--line)}
.xg .rl{margin-top:.5rem;font-size:9.5px;font-weight:500;letter-spacing:.19em;text-transform:uppercase;color:var(--tx3)}
.xg ul{margin-top:1rem;display:grid;gap:.55rem}
.xg li{font-size:12.5px;line-height:1.68;color:var(--tx2);padding-left:1rem;position:relative}
.xg li::before{content:'';position:absolute;left:0;top:.72em;width:.4rem;height:1px;background:var(--ac)}
.xg .tc{margin-top:.85rem;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3)}

/* skills as boxed columns */
.sk{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
.sk>div{padding:1.25rem 1.25rem 1.5rem 0}
.sk>div+div{border-left:1px solid var(--line);padding-left:1.25rem}
.sk h3{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ac);padding-bottom:.65rem;border-bottom:1px solid var(--line2)}
.sk li{padding:.5rem 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:1rem;align-items:baseline}
.sk .nm{font-size:13px}
.sk .vi{font-size:9.5px;letter-spacing:.08em;color:var(--tx3);text-align:right;max-width:11rem}
.aw{border-top:1px solid var(--line)}
.aw ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
.aw li{display:grid;grid-template-columns:6.5rem minmax(0,1fr);gap:1rem;padding:.7rem 1.25rem .7rem 0;border-bottom:1px solid var(--line);align-items:baseline}
.aw li:nth-child(even){border-left:1px solid var(--line);padding-left:1.25rem}
.aw .rk{font-size:9.5px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--ac)}
.aw .nm{font-size:13px}
.aw .nm i{color:var(--tx3);margin-left:.4rem;font-style:normal;font-size:11.5px}

.ab{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.ab>div{padding:1.5rem 1.5rem 1.75rem 0}
.ab>aside{border-left:1px solid var(--line);padding:1.5rem 0 1.75rem 1.5rem;display:grid;gap:1rem;align-content:start}
.ab .ld{font-family:'PM';font-size:clamp(1.2rem,1rem + 1.2vw,1.85rem);font-weight:600;line-height:1.22;letter-spacing:-.02em;text-transform:uppercase}
.ab .pr{margin-top:1.4rem;display:grid;gap:.9rem;font-size:13.5px;line-height:1.72;color:var(--tx2);max-width:60ch}
.ab aside .v{display:block;margin-top:.25rem;font-size:12.5px;color:var(--tx2)}
.ab aside a{color:var(--ac);text-decoration:none;border-bottom:1px solid currentColor}

.ct{padding:2rem 0}
.ct .cl{font-family:'PM';font-size:clamp(1.35rem,1.1rem + 1.6vw,2.5rem);font-weight:600;line-height:1.14;letter-spacing:-.025em;text-transform:uppercase;max-width:30ch}
.ct .cl a{color:var(--ac);text-decoration:none;border-bottom:3px solid currentColor}
.ct .gr{margin-top:2rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));border-top:1px solid var(--line2)}
.ct .gr>div{padding:.85rem 1rem .2rem 0;border-right:1px solid var(--line)}
.ct .gr>div:last-child{border-right:0}
.ct .gr .v{display:block;margin-top:.3rem;font-size:12.5px;color:var(--tx2);letter-spacing:0;text-transform:none}
.ct .gr a.v{color:var(--tx);text-decoration:none}
.ct .gr a.v:hover{color:var(--ac)}
.ft{padding:1rem 0 2rem;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;border-top:1px solid var(--line)}

@media(max-width:64rem){
  .hd .wm{display:none}.hd nav{margin-left:0}
  .hero .btm,.xg,.sk,.ab,.aw ul{grid-template-columns:minmax(0,1fr)}
  .hero .btm>div+div,.xg article:nth-child(even),.sk>div+div,.ab>aside,.aw li:nth-child(even){border-left:0;padding-left:0}
  .xg article:nth-child(odd){padding-right:0}
  .tb thead{display:none}
  .tb,.tb tbody,.tb tr,.tb td{display:block;width:auto}
  .tb tr{border-bottom:1px solid var(--line2);padding:1rem 0}
  .tb td{border-bottom:0;padding:0 0 .5rem}
  .sk li{flex-direction:column;gap:.15rem}
  .sk .vi{text-align:left;max-width:none}
}
`;

const brutBody = `
<header class="hd"><div class="w in">
  <a class="wm" href="#">${esc(meta.name)}</a>
  <nav aria-label="Site">${NAV.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}<a class="r" href="${esc(meta.resume)}">Resume ↓</a></nav>
</div></header>

<main id="main">
<section class="hero"><div class="w">
  <div class="top mt"><span>${esc(meta.location)}</span><span>${esc(meta.year)} →</span></div>
  <h1><span>${esc(meta.first)}</span><span>${esc(meta.last)}</span><span class="ac">Engineer</span></h1>
  <div class="btm">
    <div><p class="sf">${esc(meta.standfirst)}</p></div>
    <div><dl>
      <div><dt class="mt">Studying</dt><dd>${esc(meta.school)}</dd></div>
      <div><dt class="mt">GPA</dt><dd>${esc(meta.gpa)}</dd></div>
      <div><dt class="mt">Currently</dt><dd>SDE Intern, Amazon</dd></div>
      <div><dt class="mt">Resume</dt><dd><a href="${esc(meta.resume)}">KaranGuptaResume.pdf ↓</a></dd></div>
    </dl></div>
  </div>
</div></section>

<section class="sec" id="projects"><div class="w">
  <div class="sh"><span class="n">01</span><h2>Selected work</h2><span class="as mt">${projects.length} projects</span></div>
  <table class="tb">
    <caption class="vh">Selected projects</caption>
    <thead><tr><th scope="col">No</th><th scope="col">Project</th><th scope="col">Result</th><th scope="col">Detail</th></tr></thead>
    <tbody>${projects.map((p) => `
      <tr>
        <td class="c-no">${esc(p.figure.index)}</td>
        <td class="c-nm"><a href="#${esc(p.slug)}">${esc(p.name)}</a><span class="dk">${esc(p.deck)}</span></td>
        <td class="c-fg"><b>${esc(p.figure.value)}</b><small>${esc(p.figure.label)}</small></td>
        <td class="c-dt"><span>Role <b>${esc(p.role)}</b></span><span>Stack <b>${esc(p.tech)}</b></span><span>Result <b>${esc(p.result)}</b></span></td>
      </tr>`).join('')}
    </tbody>
  </table>
</div></section>

<section class="sec" id="experience"><div class="w">
  <div class="sh"><span class="n">02</span><h2>Experience</h2><span class="as mt">2022 — present</span></div>
  <div class="xg">${experience.map((e) => `
    <article>
      <div class="hd2"><h3>${esc(e.org)}</h3><span class="yr">${esc(e.period)}</span></div>
      <p class="rl">${esc(e.role)}${e.unit ? ` · ${esc(e.unit)}` : ''}</p>
      <div class="met"><span class="big">${esc(e.result.value)}</span><span class="mt">${esc(e.result.label)}</span></div>
      <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      <p class="tc">${esc(e.tech)}</p>
    </article>`).join('')}
  </div>
</div></section>

<section class="sec" id="skills"><div class="w">
  <div class="sh"><span class="n">03</span><h2>Skills</h2><span class="as mt">proven by the work</span></div>
  <div class="sk">${skills.map((c) => `
    <div><h3>${esc(c.label)}</h3><ul>${c.items.map((s) => `<li><span class="nm">${esc(s.name)}</span>${s.via ? `<span class="vi">${esc(s.via)}</span>` : ''}</li>`).join('')}</ul></div>`).join('')}
  </div>
  <div class="aw">
    <div class="sh"><span class="n">+</span><h2>Recognition</h2><span class="as mt">${awards.length} entries</span></div>
    <ul>${awards.map((a) => `<li><span class="rk">${esc(a.rank)}</span><span class="nm">${esc(a.name)}${a.note ? `<i>${esc(a.note)}</i>` : ''}</span></li>`).join('')}</ul>
  </div>
</div></section>

<section class="sec" id="about"><div class="w">
  <div class="sh"><span class="n">04</span><h2>About</h2></div>
  <div class="ab">
    <div>
      <p class="ld">${esc(about.lead)}</p>
      <div class="pr">${about.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    </div>
    <aside>
      <div><span class="mt">Elsewhere</span><span class="v">${links.filter((l) => l.href && l.name !== 'Email').map((l) => `<a href="${esc(l.href)}">${esc(l.name)}</a>`).join(' · ')}</span></div>
      <div><span class="mt">Discord</span><span class="v">exo1k</span></div>
      <div><span class="mt">Off the clock</span><span class="v">Keyboards, film, motorsports, manga, martial arts, music.</span></div>
    </aside>
  </div>
</div></section>
</main>

<footer id="contact"><div class="w ct">
  <p class="cl">Problems with numbers attached. <a href="mailto:${esc(meta.email)}">Send one.</a></p>
  <div class="gr mt">${links.map((l) => `<div>${esc(l.name)}${l.href ? `<a class="v" href="${esc(l.href)}">${esc(l.handle)}</a>` : `<span class="v">${esc(l.handle)}</span>`}</div>`).join('')}</div>
  <div class="ft mt"><span>© 2026 ${esc(meta.name)}</span><span>${esc(meta.location)}</span></div>
</div></footer>
`;

/* ═══════════════════════════════════════════════════════════════
   3. NOIR — high contrast, cinematic.
   Blue-black, cool white, no chroma accent except a cold silver and
   a single deep red for figures. Very large serif display, generous
   letter-spacing on tiny caps, wide margins, centred title cards
   between sections so it reads like film titles.
   ═══════════════════════════════════════════════════════════════ */
const noirCSS = `
:root{
  --bg:#0b0d10; --bg2:#101317; --tx:#eef1f4; --tx2:#9aa3ad; --tx3:#5f6873;
  --ac:#c8433a; --line:#20252b; --line2:#333b44;
}
body{background:var(--bg);color:var(--tx);font-family:'PM';font-size:14.5px;line-height:1.6}
.w{max-width:74rem;margin:0 auto;padding:0 clamp(1.25rem,5vw,4.5rem)}
.mt{font-size:10px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--tx3)}
.skip{background:var(--tx);color:var(--bg)}

.hd{position:fixed;top:0;left:0;right:0;z-index:40;background:linear-gradient(180deg,rgba(11,13,16,.96),rgba(11,13,16,0));padding-bottom:1.5rem}
.hd .in{display:flex;align-items:baseline;gap:1.5rem;padding:1.05rem 0}
.hd .wm{font-size:10px;font-weight:600;letter-spacing:.26em;text-transform:uppercase;text-decoration:none}
.hd nav{margin-left:auto;display:flex;gap:clamp(.8rem,2.2vw,1.75rem);min-width:0;overflow-x:auto;scrollbar-width:none}
.hd nav::-webkit-scrollbar{display:none}
.hd nav a{font-size:10px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--tx3);text-decoration:none;white-space:nowrap;transition:color .25s}
.hd nav a:hover{color:var(--tx)}.hd nav a.r{color:var(--ac)}

/* title card opening, centred like a film title */
.tc1{min-height:92vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:6rem 0 4rem}
.tc1 .ov{font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:var(--tx3)}
.tc1 h1{font-family:'NR';font-size:clamp(2.8rem,1.6rem + 6.4vw,7rem);font-variation-settings:'opsz' 48;font-weight:340;line-height:1.03;letter-spacing:-.02em;margin:1.75rem 0;max-width:20ch}
.tc1 h1 em{font-style:italic;font-weight:320;color:var(--tx2)}
.tc1 .sf{font-family:'NR';font-size:clamp(1.05rem,.95rem + .5vw,1.35rem);font-weight:340;font-style:italic;line-height:1.6;color:var(--tx2);max-width:44ch}
.tc1 .dv{margin:2.5rem auto 0;width:1px;height:3.5rem;background:linear-gradient(180deg,var(--line2),transparent)}

/* interstitial title cards between sections */
.card{text-align:center;padding:clamp(4rem,9vh,7rem) 0 clamp(2rem,4vh,3rem)}
.card .n{font-size:10px;letter-spacing:.3em;color:var(--ac)}
.card h2{font-family:'NR';font-size:clamp(1.9rem,1.5rem + 2.4vw,3.4rem);font-variation-settings:'opsz' 36;font-weight:340;letter-spacing:-.015em;margin-top:.85rem}
.card p{margin-top:.85rem}

.strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:1px;background:var(--line);border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-top:2rem}
.strip>div{background:var(--bg);padding:1.15rem 1.25rem}
.strip dt{font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--tx3)}
.strip dd{margin-top:.4rem;font-size:13px;color:var(--tx2)}
.strip dd a{color:var(--ac);text-decoration:none;border-bottom:1px solid rgba(200,67,58,.4)}

/* projects: full-width plates with the figure as a watermark */
.pl{position:relative;border-bottom:1px solid var(--line);padding:clamp(2.25rem,5vh,3.75rem) 0;text-decoration:none;display:block;overflow:hidden;transition:background .3s}
.pl:hover{background:var(--bg2)}
.pl .wmk{position:absolute;right:0;top:50%;transform:translateY(-50%);font-family:'NR';font-size:clamp(4rem,14vw,10rem);font-variation-settings:'opsz' 72;font-weight:300;line-height:1;color:var(--ac);opacity:.13;letter-spacing:-.04em;pointer-events:none;font-variant-numeric:lining-nums;transition:opacity .3s}
.pl:hover .wmk{opacity:.22}
.pl .inn{position:relative;display:grid;grid-template-columns:4rem minmax(0,1fr);gap:1.5rem}
.pl .no{font-size:10px;letter-spacing:.2em;color:var(--tx3);padding-top:.5rem}
.pl h3{font-family:'NR';font-size:clamp(1.7rem,1.3rem + 1.9vw,3rem);font-variation-settings:'opsz' 36;font-weight:360;letter-spacing:-.018em;line-height:1.06;transition:color .25s}
.pl:hover h3{color:var(--ac)}
.pl .dk{margin-top:.9rem;font-family:'NR';font-size:1.0625rem;font-style:italic;font-weight:340;color:var(--tx2);line-height:1.5;max-width:44ch}
.pl .rw{margin-top:1.4rem;display:flex;flex-wrap:wrap;gap:.5rem 2.5rem}
.pl .rw span{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3)}
.pl .rw b{display:block;margin-top:.25rem;font-size:12.5px;letter-spacing:0;text-transform:none;color:var(--tx2);font-weight:400}

/* experience: centred column, generous rhythm */
.xr{border-bottom:1px solid var(--line);padding:clamp(1.75rem,4vh,2.75rem) 0}
.xr .t{display:flex;align-items:baseline;gap:1rem;flex-wrap:wrap}
.xr h3{font-family:'NR';font-size:clamp(1.4rem,1.15rem + 1.1vw,2.1rem);font-variation-settings:'opsz' 28;font-weight:380;letter-spacing:-.015em}
.xr h3 small{font-family:'PM';font-size:9px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--ac);margin-left:.55rem;vertical-align:.45em}
.xr .pd{margin-left:auto;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--tx3)}
.xr .rl{margin-top:.45rem;font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--tx3)}
.xr .fg{margin-top:1rem;display:flex;align-items:baseline;gap:.75rem}
.xr .fg b{font-family:'NR';font-size:clamp(1.5rem,1.3rem + .9vw,2.05rem);font-variation-settings:'opsz' 28;font-weight:400;color:var(--ac);letter-spacing:-.02em;font-variant-numeric:lining-nums}
.xr ul{margin-top:1.1rem;display:grid;gap:.6rem;max-width:66ch}
.xr li{font-size:13.5px;line-height:1.7;color:var(--tx2);padding-left:1.15rem;position:relative}
.xr li::before{content:'';position:absolute;left:0;top:.72em;width:.5rem;height:1px;background:var(--line2)}
.xr .tc2{margin-top:.9rem;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3)}

.sk{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2.25rem clamp(1.5rem,4vw,3rem);margin-top:1.5rem}
.sk h3{font-size:9.5px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--tx3);padding-bottom:.65rem;border-bottom:1px solid var(--line2)}
.sk li{padding:.5rem 0;border-bottom:1px solid var(--line)}
.sk .nm{font-family:'NR';font-size:1.0625rem;font-weight:380}
.sk .vi{display:block;margin-top:.1rem;font-size:9.5px;letter-spacing:.1em;color:var(--tx3)}
.aw{margin-top:2.5rem}
.aw li{display:grid;grid-template-columns:7rem minmax(0,1fr);gap:1.25rem;padding:.6rem 0;border-bottom:1px solid var(--line);align-items:baseline}
.aw .rk{font-size:9.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--ac)}
.aw .nm{font-family:'NR';font-size:1.0625rem;font-weight:380}
.aw .nm i{color:var(--tx3);margin-left:.5rem}

.ab{max-width:62ch;margin:0 auto}
.ab .ld{font-family:'NR';font-size:clamp(1.5rem,1.25rem + 1.6vw,2.4rem);font-variation-settings:'opsz' 32;font-weight:340;line-height:1.28;letter-spacing:-.015em;text-align:center;text-wrap:balance}
.ab .pr{margin-top:2rem;display:grid;gap:1.1rem;color:var(--tx2);font-size:14.5px;line-height:1.78}
.ab .ex{margin-top:2rem;padding-top:1.25rem;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:.6rem 1.5rem;justify-content:center}
.ab .ex a{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--tx2);text-decoration:none;transition:color .25s}
.ab .ex a:hover{color:var(--ac)}

.ct{text-align:center;padding:clamp(4rem,9vh,7rem) 0 clamp(2.5rem,5vh,4rem)}
.ct .cl{font-family:'NR';font-size:clamp(1.8rem,1.4rem + 2.4vw,3.4rem);font-variation-settings:'opsz' 36;font-weight:340;line-height:1.16;letter-spacing:-.02em;max-width:24ch;margin:0 auto;text-wrap:balance}
.ct .cl a{color:var(--ac);text-decoration:none;border-bottom:1px solid rgba(200,67,58,.45)}
.ct .cl a:hover{border-bottom-color:var(--ac)}
.ct .gr{margin-top:2.75rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:1px;background:var(--line);border-top:1px solid var(--line)}
.ct .gr>div{background:var(--bg);padding:1rem .75rem}
.ct .gr .v{display:block;margin-top:.3rem;font-size:12.5px;color:var(--tx2);letter-spacing:0;text-transform:none}
.ct .gr a.v{color:var(--tx);text-decoration:none}
.ct .gr a.v:hover{color:var(--ac)}
.ft{padding:1.1rem 0 2.5rem;display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;border-top:1px solid var(--line)}

@media(max-width:60rem){
  .hd .wm{display:none}.hd nav{margin-left:0}
  .tc1{min-height:0;padding-top:7rem}
  .sk{grid-template-columns:minmax(0,1fr)}
  .pl .inn{grid-template-columns:minmax(0,1fr)}
  .pl .wmk{font-size:5rem;opacity:.1}
}
`;

const noirBody = `
<header class="hd"><div class="w in">
  <a class="wm" href="#">${esc(meta.name)}</a>
  <nav aria-label="Site">${NAV.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}<a class="r" href="${esc(meta.resume)}">Resume</a></nav>
</div></header>

<main id="main">
<section class="w tc1">
  <p class="ov">${esc(meta.location)} &nbsp;·&nbsp; ${esc(meta.year)}</p>
  <h1>${esc(meta.first)} ${esc(meta.last)} <em>software engineer</em></h1>
  <p class="sf">${esc(meta.standfirst)}</p>
  <div class="dv" aria-hidden="true"></div>
</section>

<section class="w" id="about">
  <div class="card"><span class="n">01</span><h2>About</h2></div>
  <div class="ab">
    <p class="ld">${esc(about.lead)}</p>
    <div class="pr">${about.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    <p class="ex">${links.filter((l) => l.href && l.name !== 'Email').map((l) => `<a href="${esc(l.href)}">${esc(l.name)}</a>`).join('')}</p>
  </div>
  <dl class="strip">
    <div><dt>Studying</dt><dd>${esc(meta.school)}</dd></div>
    <div><dt>GPA</dt><dd>${esc(meta.gpa)}</dd></div>
    <div><dt>Currently</dt><dd>SDE Intern, Amazon</dd></div>
    <div><dt>Resume</dt><dd><a href="${esc(meta.resume)}">Download ↓</a></dd></div>
  </dl>
</section>

<section class="w" id="projects">
  <div class="card"><span class="n">02</span><h2>Selected work</h2><p class="mt">${projects.length} projects</p></div>
  ${projects.map((p) => `
  <a class="pl" href="#${esc(p.slug)}">
    <span class="wmk" aria-hidden="true">${esc(p.figure.value)}</span>
    <div class="inn">
      <span class="no">${esc(p.figure.index)}</span>
      <div>
        <h3>${esc(p.name)}</h3>
        <p class="dk">${esc(p.deck)}</p>
        <p class="rw"><span>Role<b>${esc(p.role)}</b></span><span>Stack<b>${esc(p.tech)}</b></span><span>Result<b>${esc(p.result)}</b></span></p>
      </div>
    </div>
  </a>`).join('')}
</section>

<section class="w" id="experience">
  <div class="card"><span class="n">03</span><h2>Experience</h2><p class="mt">2022 — present</p></div>
  ${experience.map((e) => `
  <article class="xr">
    <div class="t"><h3>${esc(e.org)}${e.unit ? `<small>${esc(e.unit)}</small>` : ''}</h3><span class="pd">${esc(e.period)}</span></div>
    <p class="rl">${esc(e.role)}</p>
    <p class="fg"><b>${esc(e.result.value)}</b><span class="mt">${esc(e.result.label)}</span></p>
    <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    <p class="tc2">${esc(e.tech)}</p>
  </article>`).join('')}
</section>

<section class="w" id="skills">
  <div class="card"><span class="n">04</span><h2>Skills</h2><p class="mt">proven by the work</p></div>
  <div class="sk">${skills.map((c) => `
    <div><h3>${esc(c.label)}</h3><ul>${c.items.map((s) => `<li><span class="nm">${esc(s.name)}</span>${s.via ? `<span class="vi">${esc(s.via)}</span>` : ''}</li>`).join('')}</ul></div>`).join('')}
  </div>
  <ul class="aw">${awards.map((a) => `<li><span class="rk">${esc(a.rank)}</span><span class="nm">${esc(a.name)}${a.note ? `<i>${esc(a.note)}</i>` : ''}</span></li>`).join('')}</ul>
</section>
</main>

<footer class="w" id="contact"><div class="ct">
  <p class="cl">The interesting problems have numbers attached. <a href="mailto:${esc(meta.email)}">Send me one.</a></p>
  <div class="gr mt">${links.map((l) => `<div>${esc(l.name)}${l.href ? `<a class="v" href="${esc(l.href)}">${esc(l.handle)}</a>` : `<span class="v">${esc(l.handle)}</span>`}</div>`).join('')}</div>
  <div class="ft mt"><span>© 2026 ${esc(meta.name)}</span><span>${esc(meta.location)}</span></div>
</div></footer>
`;

/* ═══════════════════════════════════════════════════════════════
   4. PLATE — dark with warm metal.
   Charcoal with a green-grey cast, bone text, brass accent. The
   device is the plate: content sits on raised panels separated by
   hairlines, with figures engraved in brass. Two-column asymmetric
   grid so the eye moves diagonally down the page.
   ═══════════════════════════════════════════════════════════════ */
const plateCSS = `
:root{
  --bg:#14171a; --pl:#1b1f22; --pl2:#22272a; --tx:#e9e6dd; --tx2:#a7a49a; --tx3:#6f6d64;
  --ac:#c9a227; --line:#282d31; --line2:#3b4247;
}
body{background:var(--bg);color:var(--tx);font-family:'PM';font-size:14.5px;line-height:1.6}
.w{max-width:86rem;margin:0 auto;padding:0 clamp(1.25rem,3.5vw,3rem)}
.mt{font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--tx3)}
.skip{background:var(--ac);color:#14171a}

.hd{position:sticky;top:0;z-index:40;background:rgba(20,23,26,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.hd .in{display:flex;align-items:baseline;gap:1.5rem;padding:.95rem 0}
.hd .wm{font-size:10.5px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;text-decoration:none}
.hd nav{margin-left:auto;display:flex;gap:clamp(.85rem,2.4vw,1.8rem);min-width:0;overflow-x:auto;scrollbar-width:none}
.hd nav::-webkit-scrollbar{display:none}
.hd nav a{font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--tx3);text-decoration:none;white-space:nowrap;transition:color .22s}
.hd nav a:hover{color:var(--ac)}.hd nav a.r{color:var(--ac)}

.hero{padding:clamp(3rem,8vh,6rem) 0 clamp(2rem,5vh,3.5rem)}
.hero .kick{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}
.hero h1{font-family:'NR';font-size:clamp(2.7rem,1.8rem + 5vw,6rem);font-variation-settings:'opsz' 44;font-weight:440;line-height:1.04;letter-spacing:-.022em;margin:1.25rem 0 0;max-width:22ch;text-wrap:balance}
.hero h1 em{font-style:italic;font-weight:400;color:var(--ac)}
.hero .un{margin-top:clamp(1.75rem,4vh,2.75rem);display:grid;grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:1.5rem clamp(1.5rem,4vw,3rem);align-items:start}
.hero .sf{font-family:'NR';font-size:clamp(1.1rem,1rem + .5vw,1.4rem);font-weight:400;line-height:1.55;color:var(--tx2);max-width:40ch}
.hero .pnl{background:var(--pl);border:1px solid var(--line);padding:1.25rem 1.4rem}
.hero .pnl>div{display:grid;grid-template-columns:5.75rem minmax(0,1fr);gap:.9rem;padding:.4rem 0}
.hero .pnl>div+div{border-top:1px solid var(--line)}
.hero .pnl dd{font-size:13px;color:var(--tx2)}
.hero .pnl dd a{color:var(--ac);text-decoration:none;border-bottom:1px solid rgba(201,162,39,.4)}

.sec{padding:clamp(2.5rem,6vh,4.5rem) 0}
.sh{display:flex;align-items:baseline;gap:1.1rem;padding-bottom:.8rem;border-bottom:1px solid var(--line2);margin-bottom:1.5rem}
.sh .n{font-size:10px;font-weight:600;letter-spacing:.2em;color:var(--ac)}
.sh h2{font-family:'PM';font-size:13px;font-weight:600;letter-spacing:.18em;text-transform:uppercase}
.sh .as{margin-left:auto}

/* project plates: asymmetric two-up, big one first */
.pg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--line)}
.pc{background:var(--pl);padding:1.5rem 1.5rem 1.75rem;text-decoration:none;display:flex;flex-direction:column;transition:background .22s,transform .22s}
.pc:hover{background:var(--pl2)}
.pc.lg{grid-column:span 2}
.pc .tp{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;padding-bottom:.85rem;border-bottom:1px solid var(--line2)}
.pc .no{font-size:10px;letter-spacing:.18em;color:var(--tx3)}
.pc .fg{font-family:'NR';font-size:clamp(1.4rem,1.2rem + .9vw,2rem);font-variation-settings:'opsz' 28;font-weight:520;color:var(--ac);letter-spacing:-.02em;line-height:1;font-variant-numeric:lining-nums;white-space:nowrap}
.pc h3{font-family:'NR';font-size:clamp(1.45rem,1.2rem + 1.3vw,2.35rem);font-variation-settings:'opsz' 30;font-weight:460;letter-spacing:-.018em;line-height:1.08;margin-top:1rem;transition:color .22s}
.pc:hover h3{color:var(--ac)}
.pc .cap{margin-top:.35rem}
.pc .dk{margin-top:.8rem;font-family:'NR';font-size:1.0625rem;font-style:italic;font-weight:400;color:var(--tx2);line-height:1.48;max-width:44ch;flex:1}
.pc .mr{margin-top:1.25rem;padding-top:.85rem;border-top:1px solid var(--line);display:grid;gap:.45rem}
.pc .mr span{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3)}
.pc .mr b{color:var(--tx2);font-weight:400;letter-spacing:0;text-transform:none;font-size:12.5px}

/* experience plates */
.xl{display:grid;gap:1px;background:var(--line)}
.xp{background:var(--pl);display:grid;grid-template-columns:7rem minmax(0,1fr) 11rem;gap:1rem clamp(1.25rem,3vw,2.25rem);padding:1.5rem}
.xp:hover{background:var(--pl2)}
.xp .yr{font-family:'NR';font-size:1.4rem;font-variation-settings:'opsz' 24;font-weight:400;color:var(--tx3);font-variant-numeric:lining-nums}
.xp h3{font-family:'NR';font-size:clamp(1.35rem,1.15rem + 1vw,1.95rem);font-variation-settings:'opsz' 26;font-weight:460;letter-spacing:-.015em;line-height:1.1}
.xp h3 small{font-family:'PM';font-size:9px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--ac);margin-left:.55rem;vertical-align:.45em}
.xp .rl{margin-top:.4rem;font-size:9.5px;font-weight:500;letter-spacing:.19em;text-transform:uppercase;color:var(--tx3)}
.xp .sm{margin-top:.5rem;font-family:'NR';font-size:1.0625rem;font-style:italic;font-weight:400;color:var(--tx2)}
.xp ul{margin-top:.95rem;display:grid;gap:.55rem;max-width:64ch}
.xp li{font-size:13.5px;line-height:1.68;color:var(--tx2);padding-left:1.05rem;position:relative}
.xp li::before{content:'';position:absolute;left:0;top:.72em;width:.42rem;height:1px;background:var(--ac);opacity:.7}
.xp .tc{margin-top:.85rem;font-size:9.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3)}
.xp .sd{text-align:right}
.xp .sd b{font-family:'NR';font-size:clamp(1.4rem,1.2rem + .9vw,1.95rem);font-variation-settings:'opsz' 26;font-weight:520;color:var(--ac);letter-spacing:-.02em;line-height:1;display:block;font-variant-numeric:lining-nums}
.xp .sd span{display:block;margin-top:.4rem}

.tw{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:1px;background:var(--line)}
.tw>div{background:var(--pl);padding:1.4rem 1.5rem 1.6rem}
.sk{display:grid;gap:1.5rem}
.sk h3{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ac);padding-bottom:.6rem;border-bottom:1px solid var(--line2)}
.sk li{padding:.5rem 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:1rem;align-items:baseline}
.sk .nm{font-family:'NR';font-size:1.0625rem;font-weight:440}
.sk .vi{font-size:9.5px;letter-spacing:.08em;color:var(--tx3);text-align:right;max-width:12rem}
.aw li{display:grid;grid-template-columns:6.5rem minmax(0,1fr);gap:1rem;padding:.55rem 0;border-bottom:1px solid var(--line);align-items:baseline}
.aw .rk{font-size:9.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--ac)}
.aw .nm{font-family:'NR';font-size:1.0625rem}
.aw .nm i{color:var(--tx3);margin-left:.45rem}

.ab{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:1px;background:var(--line)}
.ab>div{background:var(--pl);padding:1.6rem 1.75rem 1.85rem}
.ab .ld{font-family:'NR';font-size:clamp(1.45rem,1.2rem + 1.6vw,2.3rem);font-variation-settings:'opsz' 30;font-weight:440;line-height:1.24;letter-spacing:-.015em;text-wrap:balance}
.ab .pr{margin-top:1.5rem;display:grid;gap:1rem;color:var(--tx2);font-size:14px;line-height:1.75}
.ab aside{display:grid;gap:1rem;align-content:start}
.ab aside .v{display:block;margin-top:.25rem;font-size:12.5px;color:var(--tx2)}
.ab aside a{color:var(--tx);text-decoration:none;border-bottom:1px solid var(--line2)}
.ab aside a:hover{color:var(--ac);border-bottom-color:var(--ac)}

.ct{background:var(--pl);border-top:1px solid var(--line2);padding:clamp(2.5rem,6vh,4rem) 0}
.ct .cl{font-family:'NR';font-size:clamp(1.7rem,1.4rem + 2vw,2.9rem);font-variation-settings:'opsz' 34;font-weight:460;line-height:1.16;letter-spacing:-.02em;max-width:26ch;text-wrap:balance}
.ct .cl a{color:var(--ac);text-decoration:none;border-bottom:2px solid rgba(201,162,39,.4)}
.ct .gr{margin-top:2.25rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:1px;background:var(--line)}
.ct .gr>div{background:var(--pl2);padding:.9rem 1rem}
.ct .gr .v{display:block;margin-top:.3rem;font-size:12.5px;color:var(--tx2);letter-spacing:0;text-transform:none}
.ct .gr a.v{color:var(--tx);text-decoration:none}
.ct .gr a.v:hover{color:var(--ac)}
.ft{padding:1.1rem 0 2.25rem;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}

@media(max-width:64rem){
  .hd .wm{display:none}.hd nav{margin-left:0}
  .hero .un,.pg,.tw,.ab{grid-template-columns:minmax(0,1fr)}
  .pc.lg{grid-column:span 1}
  .xp{grid-template-columns:minmax(0,1fr)}
  .xp .sd{text-align:left}
  .sk li{flex-direction:column;gap:.15rem}
  .sk .vi{text-align:left;max-width:none}
}
`;

const plateBody = `
<header class="hd"><div class="w in">
  <a class="wm" href="#">${esc(meta.name)}</a>
  <nav aria-label="Site">${NAV.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}<a class="r" href="${esc(meta.resume)}">Resume ↓</a></nav>
</div></header>

<main id="main">
<section class="w hero">
  <div class="kick mt"><span>${esc(meta.location)}</span><span>${esc(meta.year)} →</span></div>
  <h1>${esc(meta.first)} ${esc(meta.last)}, software <em>engineer</em></h1>
  <div class="un">
    <p class="sf">${esc(meta.standfirst)}</p>
    <dl class="pnl">
      <div><dt class="mt">Studying</dt><dd>${esc(meta.school)}</dd></div>
      <div><dt class="mt">GPA</dt><dd>${esc(meta.gpa)}</dd></div>
      <div><dt class="mt">Currently</dt><dd>SDE Intern, Amazon</dd></div>
      <div><dt class="mt">Resume</dt><dd><a href="${esc(meta.resume)}">KaranGuptaResume.pdf ↓</a></dd></div>
    </dl>
  </div>
</section>

<section class="w sec" id="projects">
  <div class="sh"><span class="n">01</span><h2>Selected work</h2><span class="as mt">${projects.length} projects</span></div>
  <div class="pg">
    ${featured.map((p, i) => `
    <a class="pc${i === 0 ? ' lg' : ''}" href="#${esc(p.slug)}">
      <span class="tp"><span class="no">${esc(p.figure.index)}</span><span class="fg">${esc(p.figure.value)}</span></span>
      <h3>${esc(p.name)}</h3>
      <span class="cap mt">${esc(p.figure.label)}</span>
      <p class="dk">${esc(p.deck)}</p>
      <span class="mr"><span>Role <b>${esc(p.role)}</b></span><span>Stack <b>${esc(p.tech)}</b></span><span>Result <b>${esc(p.result)}</b></span></span>
    </a>`).join('')}
    ${others.map((p) => `
    <a class="pc" href="#${esc(p.slug)}">
      <span class="tp"><span class="no">${esc(p.figure.index)}</span><span class="fg">${esc(p.figure.value)}</span></span>
      <h3>${esc(p.name)}</h3>
      <span class="cap mt">${esc(p.figure.label)}</span>
      <p class="dk">${esc(p.deck)}</p>
      <span class="mr"><span>Stack <b>${esc(p.tech)}</b></span></span>
    </a>`).join('')}
  </div>
</section>

<section class="w sec" id="experience">
  <div class="sh"><span class="n">02</span><h2>Experience</h2><span class="as mt">2022 — present</span></div>
  <div class="xl">${experience.map((e) => `
    <article class="xp">
      <span class="yr" aria-hidden="true">${esc(e.year)}</span>
      <div>
        <h3>${esc(e.org)}${e.unit ? `<small>${esc(e.unit)}</small>` : ''}</h3>
        <p class="rl">${esc(e.role)}</p>
        <p class="sm">${esc(e.summary)}</p>
        <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
        <p class="tc">${esc(e.tech)}</p>
      </div>
      <div class="sd"><b>${esc(e.result.value)}</b><span class="mt">${esc(e.result.label)}</span><span class="mt">${esc(e.period)}</span></div>
    </article>`).join('')}
  </div>
</section>

<section class="w sec" id="skills">
  <div class="sh"><span class="n">03</span><h2>Skills &amp; recognition</h2><span class="as mt">proven by the work</span></div>
  <div class="tw">
    <div class="sk">${skills.map((c) => `
      <div><h3>${esc(c.label)}</h3><ul>${c.items.map((s) => `<li><span class="nm">${esc(s.name)}</span>${s.via ? `<span class="vi">${esc(s.via)}</span>` : ''}</li>`).join('')}</ul></div>`).join('')}
    </div>
    <div class="aw"><h3 class="mt" style="color:var(--ac);padding-bottom:.6rem;border-bottom:1px solid var(--line2)">Recognition</h3>
      <ul style="margin-top:.5rem">${awards.map((a) => `<li><span class="rk">${esc(a.rank)}</span><span class="nm">${esc(a.name)}${a.note ? `<i>${esc(a.note)}</i>` : ''}</span></li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="w sec" id="about">
  <div class="sh"><span class="n">04</span><h2>About</h2></div>
  <div class="ab">
    <div>
      <p class="ld">${esc(about.lead)}</p>
      <div class="pr">${about.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
    </div>
    <aside>
      <div><span class="mt">Elsewhere</span><span class="v">${links.filter((l) => l.href && l.name !== 'Email').map((l) => `<a href="${esc(l.href)}">${esc(l.name)}</a>`).join(' · ')}</span></div>
      <div><span class="mt">Discord</span><span class="v">exo1k</span></div>
      <div><span class="mt">Off the clock</span><span class="v">Keyboards, film, motorsports, manga, martial arts, music.</span></div>
    </aside>
  </div>
</section>
</main>

<footer class="ct" id="contact"><div class="w">
  <p class="cl">The interesting problems have numbers attached. <a href="mailto:${esc(meta.email)}">Send me one.</a></p>
  <div class="gr mt">${links.map((l) => `<div>${esc(l.name)}${l.href ? `<a class="v" href="${esc(l.href)}">${esc(l.handle)}</a>` : `<span class="v">${esc(l.handle)}</span>`}</div>`).join('')}</div>
  <div class="ft mt"><span>© 2026 ${esc(meta.name)}</span><span>${esc(meta.location)}</span></div>
</div></footer>
`;

/* ── index ─────────────────────────────────────────────────────── */
const indexCSS = `
body{background:#0c0c0e;color:#eceae5;font-family:'PM';font-size:14px;line-height:1.6;padding:clamp(2rem,7vh,5rem) clamp(1.25rem,4vw,3rem)}
.w{max-width:60rem;margin:0 auto}
h1{font-family:'NR';font-size:clamp(2rem,1.5rem + 2.5vw,3.4rem);font-variation-settings:'opsz' 36;font-weight:420;letter-spacing:-.02em;line-height:1.05}
.sub{margin-top:1rem;font-family:'NR';font-size:1.15rem;font-style:italic;font-weight:380;color:#a09d95;max-width:50ch;line-height:1.55}
ol{margin-top:2.5rem;border-top:1px solid #23242a}
li{border-bottom:1px solid #23242a}
a.t{display:grid;grid-template-columns:3rem minmax(0,10rem) minmax(0,1fr) auto;gap:1.25rem;align-items:baseline;padding:1.35rem 0;text-decoration:none;transition:color .2s,padding-left .2s}
a.t:hover{color:#d98324;padding-left:.4rem}
.n{font-size:10px;letter-spacing:.18em;color:#6c6a63}
.nm{font-family:'NR';font-size:1.65rem;font-variation-settings:'opsz' 28;font-weight:460;letter-spacing:-.015em}
.ds{font-size:13px;color:#a09d95;line-height:1.55}
.ar{font-size:13px;color:#6c6a63}
.ft{margin-top:2.5rem;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6c6a63}
@media(max-width:52rem){a.t{grid-template-columns:2.5rem minmax(0,1fr)}.ds,.ar{display:none}}
`;
const CARDS = [
  ['ink.html', 'Ink', 'Warm near-black with amber. Alternating dark bands give the scroll a pulse; full-height opening spread.'],
  ['brut.html', 'Brutalist', 'Pure black, acid lime, hard grid. Everything boxed in visible rules; name as an uppercase mono slab.'],
  ['noir.html', 'Noir', 'Blue-black and cold white with deep red. Centred film-title cards between sections, figures as watermarks.'],
  ['plate.html', 'Plate', 'Charcoal and brass. Content on raised panels split by hairlines, asymmetric plate grid for projects.'],
];
const indexBody = `
<div class="w">
  <h1>Dark themes</h1>
  <p class="sub">Four dark directions for the portfolio. Same content throughout, so the difference you are judging is the design.</p>
  <ol>${CARDS.map(([f, n, d], i) => `
    <li><a class="t" href="./${f}">
      <span class="n">0${i + 1}</span>
      <span class="nm">${n}</span>
      <span class="ds">${d}</span>
      <span class="ar">→</span>
    </a></li>`).join('')}
  </ol>
  <p class="ft">Serve from the repo root, then open /concepts/dark/</p>
</div>`;

const OUT = [
  ['ink.html', 'Ink', inkCSS, inkBody],
  ['brut.html', 'Brutalist', brutCSS, brutBody],
  ['noir.html', 'Noir', noirCSS, noirBody],
  ['plate.html', 'Plate', plateCSS, plateBody],
  ['index.html', 'Dark themes', indexCSS, indexBody],
];

for (const [file, title, css, body] of OUT) {
  const html = page(file, title, css, body);
  writeFileSync(join(HERE, file), html);
  console.log(`${file.padEnd(12)} ${(html.length / 1024).toFixed(1)} KB`);
}
console.log('fonts:', readdirSync(join(HERE, 'fonts')).length);
