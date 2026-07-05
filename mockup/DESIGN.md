# NERV OPERATIONS CONSOLE — DESIGN CONTRACT

This is the **single source of truth** for the Karan Gupta portfolio mockup, styled after the
Neon Genesis Evangelion / NERV operations-console aesthetic. Every file MUST conform to the
class names, IDs, CSS variables, and JS hooks defined here so the independently-built pieces
interlock. Do not invent new names for things defined here.

Aesthetic bible (from github.com/TheGreatGildo/nerv-ui) + signature interactive piece
(the MAGI three-supercomputer display, from github.com/hirakujira/MAGI-System).

Guiding principle (nerv-ui): **"The screen is off until data demands it. Black void is the
default state."** No gradients, no color blending. Each color has ONE role. Restraint is the aesthetic.

---

## 1. Files & responsibilities

| File | Owner | Responsibility |
|------|-------|----------------|
| `index.html` | markup | All page markup + content. Links fonts, `css/nerv.css`, `js/nerv.js` (defer). |
| `css/nerv.css` | styles | Entire design system: reset, tokens, typography, CRT overlays, panels, every section's layout, MAGI panels, responsive. Single stylesheet. |
| `js/nerv.js` | behavior | Boot sequence, CRT/scanline runtime, scroll-reveal, live clock/status, emergency mode, MAGI deliberation animation, terminal contact emulator. Single module, guarded by `DOMContentLoaded`, respects `prefers-reduced-motion`. |
| `assets/nerv-logo.svg` | assets | The NERV fig-leaf/half-mask logo (orange on transparent). |
| `assets/favicon.svg` | assets | Favicon (NERV logo mark). |
| `README.md` | docs | How to preview, structure, Next.js migration path, Sources. |

Static site. Zero build step, zero dependencies except Google Fonts. Must open by
double-clicking `index.html` (use relative paths only; no ES-module `import`, no fetch of
local files — inline any data in `nerv.js`).

---

## 2. Color tokens — declare on `:root` EXACTLY these names

```css
:root{
  --void:        #000000; /* page background — the default "off" state */
  --panel:       #060807; /* near-black panel fill */
  --panel-edge:  #14322b; /* faint panel border in nominal state */
  --nerv-orange: #FF9830; /* headers, labels, primary brand */
  --data-green:  #50FF50; /* data, nominal status, terminal text */
  --wire-cyan:   #20F0FF; /* wireframes, links, accents */
  --alert-red:   #FF3030; /* emergencies / errors ONLY */
  --warn-amber:  #FFB800; /* warning stamps / caution */
  --steel:       #D8D8D0; /* secondary/body text */
  --steel-dim:   #6b6f68; /* muted metadata */
  --grid:        rgba(80,255,80,0.06); /* background grid lines */
}
```
Emergency mode: when `document.documentElement` has `data-mode="emergency"`, remap
`--nerv-orange`, `--wire-cyan`, `--data-green` toward `--alert-red` and speed up animations.
Colors MUST pass WCAG AA against `--void`.

---

## 3. Typography — Google Fonts (link exactly this in `<head>`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@900&family=Shippori+Mincho+B1:wght@700;800&family=JetBrains+Mono:wght@400;700&family=Saira+Extra+Condensed:wght@700;900&display=swap" rel="stylesheet">
```

Roles:
- **Titles / display**: `'Noto Serif Display', serif`; `font-weight:900`; `transform: scaleX(0.82)`
  applied via a `.eva-title` helper (the signature squished-serif EVA look). Give squished
  titles `display:inline-block` so the transform takes.
- **Japanese accents**: `'Shippori Mincho B1', serif` via `.jp`.
- **Data / terminal / labels**: `'JetBrains Mono', monospace` (default body font).
- **Warning stamps**: `'Saira Extra Condensed', sans-serif`, uppercase, letter-spaced.

Body default: JetBrains Mono, `--steel`, on `--void`.

---

## 4. CRT / atmosphere layer (always present, pointer-events:none, capped subtle)

Fixed full-viewport overlays appended in `index.html` as the FIRST children of `<body>`:
```html
<div class="crt-scanlines" aria-hidden="true"></div>
<div class="crt-vignette" aria-hidden="true"></div>
<div class="crt-flicker" aria-hidden="true"></div>
<div class="scan-sweep" aria-hidden="true"></div>
```
- `.crt-scanlines`: repeating-linear-gradient horizontal lines, opacity ≤ 0.10.
- `.crt-vignette`: radial-gradient darkening edges.
- `.crt-flicker`: near-invisible opacity flicker animation (max opacity 0.06).
- `.scan-sweep`: a thin line translating top→bottom slowly.
- A faint background grid (`--grid`) on `<body>` via `background-image` linear-gradients.
- ALL of the above disabled/frozen under `@media (prefers-reduced-motion: reduce)`.

---

## 5. Shared components (class vocabulary — use these names verbatim)

- `.nerv-panel` — bordered console panel: `--panel` bg, 1px `--panel-edge` border, clipped
  corner (use `clip-path` for a cut corner) , subtle inner glow.
- `.panel-header` — top bar of a panel; contains `.panel-label` (orange, uppercase, mono) and
  optional `.panel-code` (right-aligned dim code like `SEC-02`).
- `.hazard-stripe` — diagonal amber/black caution stripe strip (repeating-linear-gradient).
- `.eva-title` — squished serif title helper (see §3).
- `.jp` — Japanese text accent.
- `.section` — vertical rhythm wrapper; each major section. Sections carry the IDs in §6.
- `.section-index` — big faint section number/label bleeding off the panel edge.
- `.data-row`, `.data-key`, `.data-value` — key/value readouts.
- `.status-nominal` (green), `.status-warn` (amber), `.status-alert` (red) — status pills.
- `.tag` — small bordered skill/tech chip.
- `.reveal` + `data-reveal` — elements start hidden/translated; JS adds `.is-visible` on scroll.
- `.link-cyan` — anchor styling (cyan, underline on hover, bracketed `[ ]` affordance ok).
- `.blink` — hard blink animation for cursors/alerts.

---

## 6. Page structure & section IDs (single-page vertical scroll)

Order and IDs are FIXED (nav + JS depend on them):

1. `#boot` — **boot overlay** (position:fixed, covers viewport). ASCII/NERV logo + a fake
   MAGI system boot log typing out lines, a progress bar to `SYNCHRONIZATION 100%`, then it
   fades and `document.body` gets class `booted`. Skippable by click/keypress. Must NOT trap
   users if JS fails (see §7).
2. Fixed top **nav** `#nerv-nav` — left: small NERV logo + `NERV`; right: anchor links to the
   sections below + a live `#sys-clock` + `#emergency-toggle` button.
3. `#hero` — full-height. Huge squished `KARAN GUPTA` title, `.jp` subtitle (綾), designation
   line "PILOT / SOFTWARE ENGINEER", tagline "swe · cv · automation", a MAGI-style status
   readout (SYNC RATIO, location Waterloo, status NOMINAL), scroll cue.
4. `#dossier` — **PILOT DOSSIER** (About). Bio: Computer Engineering + Economics minor @
   University of Waterloo, GPA 3.95. Portrait placeholder frame. Key-value readouts.
5. `#synclog` — **SYNC LOG** (Experience). Vertical timeline of roles (see CONTENT.md), each a
   `.nerv-panel` node with role/company/dates/blurb and a "sync ratio" flourish.
6. `#eva-units` — **EVA UNITS** (Projects). Each project = an EVA unit deployment card
   (`.eva-card`): unit code, project name, status, description, tech `.tag`s, links.
7. `#magi` — **MAGI SYSTEM** (Skills). The signature three-panel supercomputer:
   `.magi-unit` × 3 → MELCHIOR-1 (Languages), BALTHASAR-2 (Frameworks), CASPER-3 (Tools/Cloud).
   A `#magi-run` "DELIBERATE" button triggers the deliberation-flicker then resolves each panel
   to `NOMINAL`, revealing that unit's skill tags. See §8.
8. `#commendations` — **COMMENDATIONS** (Awards). Grid of award chips/medals.
9. `#offline` — **OFFLINE RECORDS** (Beyond code / personal): film (Letterboxd), music (AOTY),
   keyboards/PC building, manga/martial arts/motorsports.
10. `#transmission` — **TRANSMISSION** (Contact). A terminal emulator (`.terminal`) with a
    prompt; clickable command buttons (`mail`, `open linkedin`, `open github`, `open resume`)
    print output lines to `#terminal-output` and open the right link. Also show raw links.
11. `<footer>` — © 2026 Karan Gupta · "NERV" · a small "ADVANCING BEYOND" tagline.

---

## 7. JS hooks & behavior contract (`js/nerv.js`)

- Wrap in `DOMContentLoaded`. Feature-detect; never throw if an element is missing.
- **Boot**: element `#boot`. On load, type the boot log into `#boot-log`, animate `#boot-bar`.
  On complete OR on click/keydown OR after a hard 6s cap, add `booted` to `<body>` and fade
  `#boot`. CRITICAL: `#boot` MUST be hidden by CSS whenever `<body>.booted`, AND `<body>` must
  become `booted` even if JS is disabled — so put a `<noscript>` style / or default the page
  usable. Simplest: page content is always in normal flow; `#boot` only overlays; if JS fails,
  add a CSS fallback that hides `#boot` after an animation delay is NOT reliable — so also
  include: `#boot` has an always-clickable "SKIP ▸" control (`#boot-skip`).
- **Clock**: `#sys-clock` updates each second (24h + a fake MAGI date stamp). No `Date.now()`
  restriction here — this is browser runtime JS, `new Date()` is fine in the delivered file.
- **Emergency mode**: `#emergency-toggle` toggles `document.documentElement.dataset.mode`
  between unset and `"emergency"`. Also bind key `E`.
- **Scroll reveal**: IntersectionObserver on `[data-reveal]` → add `.is-visible`. Fallback:
  if IO unsupported or reduced-motion, everything visible.
- **MAGI**: `#magi-run` click → each `.magi-unit` gets `.deliberating` (flicker) for a staggered
  duration, then `.resolved` (reveals skills, status → NOMINAL). Re-runnable. Auto-run once when
  `#magi` first scrolls into view.
- **Terminal**: command buttons `[data-cmd]` (values: `mail`,`linkedin`,`github`,`resume`).
  Clicking prints a `$ <cmd>` line + a response line to `#terminal-output`, then performs the
  action (mailto / open link). Keep a blinking cursor `.blink` at the prompt.
- **Active nav**: highlight nav link for the section in view (optional, nice-to-have).

---

## 8. MAGI panel spec (the signature piece)

Three side-by-side trapezoid/paneled units on a dark field, echoing the show's overhead MAGI
diagram. Each `.magi-unit`:
- Header: unit name (`MELCHIOR·1` / `BALTHASAR·2` / `CASPER·3`) + a `.jp` gloss
  (科学者 / 母 / 女) + role label (Scientist / Mother / Woman) as an Easter-egg, mapped to
  the skill category it now represents.
- Body: category title (LANGUAGES / FRAMEWORKS / TOOLS & CLOUD) + the skill `.tag`s (hidden
  until `.resolved`).
- Status light: cycles CODE-`XXX` while `.deliberating` (green flicker), settles to `NOMINAL`.
- Layout: CSS grid, 3 columns on desktop, stack on mobile. A faint connecting "bus" line
  between them and a central "CENTRAL DOGMA" label is a nice touch.
Deliberation animation must obey `prefers-reduced-motion` (skip flicker, resolve instantly).

---

## 9. Accessibility & quality bar

- Semantic landmarks: `<nav> <main> <section> <footer>`, one `<h1>` (Karan Gupta), logical
  `<h2>` per section.
- All decorative overlays `aria-hidden="true"` + `pointer-events:none`.
- Color contrast AA on black. Don't rely on color alone for status (include text).
- `prefers-reduced-motion`: freeze scanline sweep, flicker, boot typing (show final state).
- Keyboard: nav links focusable, terminal buttons are real `<button>`s, emergency toggle a
  `<button>`, boot skip a `<button>`. Visible focus outlines (cyan).
- Responsive: works 360px → 1920px. MAGI + EVA grids collapse to one column on mobile; nav
  collapses gracefully.
- No console errors. No external JS/CSS deps besides Google Fonts. Relative asset paths.

---

## 10. Copy/tone

Terse military-ops readout voice. Uppercase labels. Sparse Japanese accents (綾, 使徒, 同期率,
発進, 記録). Never overdo it — restraint. Real content (names, dates, links) comes from
CONTENT.md and must be accurate.
