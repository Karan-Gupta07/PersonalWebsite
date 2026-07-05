# NERV OPERATIONS CONSOLE — Karan Gupta portfolio mockup

A single-page portfolio mockup for Karan Gupta, styled after the Neon Genesis
Evangelion / NERV operations-console aesthetic. It is a zero-build static site:
plain HTML, one stylesheet, one vanilla-JS module, and two SVG assets — no
framework, no bundler, no dependencies except Google Fonts.

The design follows one guiding principle, borrowed from the `nerv-ui` aesthetic:

> **"The screen is off until data demands it. Black void is the default state."**

No gradients, no color blending. Each color has exactly one role, and restraint is
the aesthetic. The full design contract lives in [`DESIGN.md`](./DESIGN.md); the
verbatim factual content lives in [`CONTENT.md`](./CONTENT.md). Those two files are
the single source of truth — this README only describes what has been built from them.

---

## Preview

No build step. Two options:

1. **Just open the file.** Double-click `index.html`, or open it in any browser.
   The site uses relative asset paths and inlines all its data, so it works
   straight off the filesystem (`file://`).
2. **Serve it locally** (recommended, avoids any `file://` quirks). From this
   directory (`/Users/guptkark/InternProj2026/website`):
   ```bash
   python3 -m http.server
   ```
   Then visit <http://localhost:8000>.

---

## File & folder structure

```
website/
├── index.html          All page markup + content. Links the fonts, css/nerv.css,
│                        and js/nerv.js (deferred). The CRT overlay divs are its
│                        first body children.
├── css/
│   └── nerv.css         The entire design system in one stylesheet: reset, color
│                        tokens, typography, CRT overlays, panels, per-section
│                        layout, MAGI panels, emergency remap, and responsive rules.
├── js/
│   └── nerv.js          All behavior in one DOMContentLoaded-guarded module: boot
│                        sequence, live clock/status, scroll reveal, emergency mode,
│                        MAGI deliberation, and the terminal contact emulator.
├── assets/
│   ├── nerv-logo.svg    NERV fig-leaf / half-mask logo mark (orange on transparent).
│   └── favicon.svg      Favicon built from the NERV logo mark.
├── sections/           Reserved for future extracted section partials (empty; the
│                        mockup keeps all markup inline in index.html by contract).
├── DESIGN.md           The design contract — single source of truth for names/IDs/tokens.
├── CONTENT.md          The verbatim content source (facts from karangupta.dev).
└── README.md           This file.
```

---

## Section map (single-page vertical scroll)

Order and IDs are fixed; the nav and JS depend on them.

| # | ID               | Section         | What it is |
|---|------------------|-----------------|------------|
| — | `#boot`          | Boot overlay    | Fixed full-viewport MAGI boot log that types out and progresses to `SYNCHRONIZATION 100%`, then fades; skippable. |
| — | `#nerv-nav`      | Top nav         | NERV logo + section anchors + live `#sys-clock` + `#emergency-toggle`. |
| 1 | `#hero`          | Hero            | Squished `KARAN GUPTA` title, 綾 subtitle, "PILOT / SOFTWARE ENGINEER", tagline, sync-ratio status readout. |
| 2 | `#dossier`       | Pilot Dossier   | About / bio: Computer Engineering + Economics minor @ University of Waterloo, GPA 3.95. |
| 3 | `#synclog`       | Sync Log        | Experience timeline of roles. |
| 4 | `#eva-units`     | EVA Units       | Projects as EVA-01..EVA-05 deployment cards. |
| 5 | `#magi`          | MAGI System     | Skills as the three-supercomputer panel (see below). |
| 6 | `#commendations` | Commendations   | Awards grid. |
| 7 | `#offline`       | Offline Records | Beyond code: film, music, keyboards/PC building, manga/martial arts/motorsports. |
| 8 | `#transmission`  | Transmission    | Terminal contact emulator with command buttons + raw links. |
| — | `<footer>`       | Footer          | © 2026 Karan Gupta · "NERV" · "ADVANCING BEYOND". |

---

## Notable features

- **Boot sequence** (`#boot`): fake MAGI boot log types into `#boot-log` while
  `#boot-bar` fills to synchronization. Completes on finish, on click/keypress, via
  the always-clickable `#boot-skip` button, or after a hard 6s cap — so it never
  traps the user, even if JS fails or is disabled.
- **MAGI skills panel** (`#magi`): the signature piece. Three `.magi-unit` panels —
  MELCHIOR·1 (Languages), BALTHASAR·2 (Frameworks), CASPER·3 (Tools & Cloud) — with
  Japanese glosses (科学者 / 母 / 女). The `#magi-run` "DELIBERATE" button flickers
  each unit (`.deliberating`), then resolves it (`.resolved`) to `NOMINAL`, revealing
  its skill tags. Re-runnable, and auto-runs once when scrolled into view.
- **Emergency mode**: the `#emergency-toggle` button (or pressing the **E** key)
  toggles `data-mode="emergency"` on `<html>`, remapping orange/cyan/green toward
  `--alert-red` and speeding up animations.
- **Terminal contact** (`#transmission`): command buttons (`mail`, `linkedin`,
  `github`, `resume`) print a `$ <cmd>` line plus a response into `#terminal-output`
  and perform the action (mailto / open link). A blinking `.blink` cursor sits at the
  prompt. Raw links are also shown for accessibility.
- **CRT effects**: fixed, `aria-hidden`, pointer-events-none overlays — scanlines,
  vignette, near-invisible flicker, a slow top-to-bottom scan sweep, and a faint
  background grid.
- **Reduced-motion support**: under `@media (prefers-reduced-motion: reduce)` the
  scanline sweep, flicker, and boot typing freeze to their final state, the MAGI
  deliberation skips its flicker and resolves instantly, and scroll-reveal elements
  are shown without animation.

---

## Color & type system

**Color tokens** are declared on `:root` (see `DESIGN.md` §2), one role each:

| Token | Value | Role |
|-------|-------|------|
| `--void` | `#000000` | Page background — the default "off" state |
| `--panel` | `#060807` | Near-black panel fill |
| `--panel-edge` | `#14322b` | Faint panel border (nominal) |
| `--nerv-orange` | `#FF9830` | Headers, labels, primary brand |
| `--data-green` | `#50FF50` | Data, nominal status, terminal text |
| `--wire-cyan` | `#20F0FF` | Wireframes, links, accents |
| `--alert-red` | `#FF3030` | Emergencies / errors only |
| `--warn-amber` | `#FFB800` | Warning stamps / caution |
| `--steel` | `#D8D8D0` | Secondary / body text |
| `--steel-dim` | `#6b6f68` | Muted metadata |
| `--grid` | `rgba(80,255,80,0.06)` | Background grid lines |

Emergency mode remaps `--nerv-orange`, `--wire-cyan`, and `--data-green` toward
`--alert-red`. Colors pass WCAG AA against `--void`.

**Typography** (Google Fonts):

- **Titles / display**: `Noto Serif Display` 900, `scaleX(0.82)` via `.eva-title`
  (the signature squished-serif EVA look).
- **Japanese accents**: `Shippori Mincho B1` via `.jp`.
- **Data / terminal / labels / body default**: `JetBrains Mono`.
- **Warning stamps**: `Saira Extra Condensed`, uppercase, letter-spaced.

---

## Porting into the real Next.js site (karangupta.dev)

The live site is Next.js (App Router) + JS on Vercel. This mockup is deliberately
framework-free so it drops in cleanly. Suggested path:

1. **Wrap the markup as a component.** Move the body markup from `index.html` into a
   route or component under the App Router, e.g. `app/nerv/page.jsx` (or a
   `components/NervConsole.jsx` rendered by a route). Convert `class=` to
   `className=`, self-close void elements, and keep the section IDs (`#hero`,
   `#magi`, …) intact — the JS and nav anchors depend on them.
2. **Move `nerv.css` into the app.** Drop `css/nerv.css` into the app (e.g.
   `app/nerv/nerv.css` or `styles/nerv.css`) and `import` it from the route/layout,
   or paste it into a CSS module. The `:root` tokens and `data-mode="emergency"`
   remap work unchanged.
3. **Convert the vanilla JS to a client hook.** The behavior in `nerv.js` touches the
   DOM and `window`, so it must run client-side. Either make the console a client
   component (`'use client'`) and move the logic into a `useEffect(() => { … }, [])`
   hook (returning a cleanup that removes listeners/intervals such as the clock
   `setInterval`), or keep it a small standalone client component. The
   `DOMContentLoaded` wrapper is dropped — `useEffect` already runs after mount.
   IntersectionObserver, the emergency `E` keybinding, the MAGI runner, and the
   terminal buttons all move in as-is.
4. **Keep the fonts via `next/font`.** Replace the `<link>` to Google Fonts with
   `next/font/google` imports for Noto Serif Display, Shippori Mincho B1, JetBrains
   Mono, and Saira Extra Condensed, exposing them as CSS variables and referencing
   those variables from `nerv.css` (instead of the raw font-family strings). This
   gives self-hosted fonts with no layout shift.
5. **Move the assets.** Put `nerv-logo.svg` and `favicon.svg` under `public/` and
   update references (favicon via the App Router `icon`/metadata convention).
6. **Fix up links.** Project and resume links already point at real
   `karangupta.dev` / relative paths; convert internal navigations to `next/link`
   where appropriate.

---

## Sources

- [TheGreatGildo/nerv-ui](https://github.com/TheGreatGildo/nerv-ui) (external, MIT) —
  the NERV Operations Console design system and overall aesthetic. Accessed 2026-07-05.
- [hirakujira/MAGI-System](https://github.com/hirakujira/MAGI-System) (external) —
  the MELCHIOR / BALTHASAR / CASPER three-AI MAGI panel concept. Accessed 2026-07-05.
- [karangupta.dev](https://karangupta.dev) /
  [Karan-Gupta07/PersonalWebsite](https://github.com/Karan-Gupta07) (external) —
  the content source for all names, dates, links, and facts. Accessed 2026-07-05.
