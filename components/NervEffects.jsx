'use client';

import { useEffect } from 'react';

export default function NervEffects() {
  useEffect(() => {
    /* ── shared refs ───────────────────────────────────────────────── */
    const doc   = document;
    const root  = doc.documentElement;
    const body  = doc.body;

    let reduceMotion = false;
    try {
      reduceMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      reduceMotion = false;
    }

    function $(sel, ctx) { try { return (ctx || doc).querySelector(sel); } catch (_) { return null; } }
    function $all(sel, ctx) { try { return Array.from((ctx || doc).querySelectorAll(sel)); } catch (_) { return []; } }

    /* Cleanup registry ------------------------------------------------ */
    const cleanups = [];                              // array of teardown fns
    function addTimer(id)      { cleanups.push(() => { clearTimeout(id); clearInterval(id); }); return id; }
    function addInterval(id)   { cleanups.push(() => clearInterval(id)); return id; }
    function addObserver(io)   { cleanups.push(() => io.disconnect()); return io; }
    function addListener(el, type, fn, opts) {
      if (el && typeof el.addEventListener === 'function') {
        el.addEventListener(type, fn, opts || false);
        cleanups.push(() => el.removeEventListener(type, fn, opts || false));
      }
    }

    // =====================================================================
    // 1) BOOT SEQUENCE
    // =====================================================================
    (function bootSequence() {
      const boot = $('#boot');
      const log  = $('#boot-log');
      const bar  = $('#boot-bar');
      const skip = $('#boot-skip');

      let finished = false;
      const timers = [];

      function clearTimers() {
        timers.forEach(id => { clearTimeout(id); clearInterval(id); });
        timers.length = 0;
      }

      function onAnyInput() { finish(); }

      function clearGlobalListeners() {
        doc.removeEventListener('click',   onAnyInput, true);
        doc.removeEventListener('keydown', onAnyInput, true);
      }

      function finish() {
        if (finished) return;
        finished = true;
        clearTimers();
        clearGlobalListeners();
        if (bar) {
          bar.style.width = '100%';
          try { bar.setAttribute('aria-valuenow', '100'); } catch (_) {}
        }
        if (body) body.classList.add('booted');
      }

      const lines = [
        'KARAN // MAGI SYSTEM \u2014 CENTRAL DOGMA',
        '> POWER-ON SELF TEST ............ OK',
        '> MELCHIOR-1 ONLINE ............. OK',
        '> BALTHASAR-2 ONLINE ........... OK',
        '> CASPER-3 ONLINE .............. OK',
        '> LCL PRESSURE NOMINAL',
        '> A.T. FIELD STABLE',
        '> AUTHENTICATING PILOT-EXO ...... OK',
        '> LOADING DOSSIER: K. GUPTA',
        '> ESTABLISHING NEURAL LINK ...',
        '> SYNCHRONIZATION ....... 100%',
        '> ALL SYSTEMS NOMINAL. WELCOME.',
      ];

      function appendLine(text) {
        if (!log) return;
        const el = doc.createElement('div');
        el.className = 'boot-line';
        el.textContent = text;
        log.appendChild(el);
        try { log.scrollTop = log.scrollHeight; } catch (_) {}
      }

      if (!boot) {
        if (body) body.classList.add('booted');
        return;
      }

      // Skip button
      if (skip) {
        const handler = (ev) => { ev.preventDefault(); ev.stopPropagation(); finish(); };
        skip.addEventListener('click', handler);
        cleanups.push(() => skip.removeEventListener('click', handler));
      }

      // Any click/keydown skips (capture phase)
      doc.addEventListener('click',   onAnyInput, true);
      doc.addEventListener('keydown', onAnyInput, true);
      cleanups.push(() => clearGlobalListeners());

      // Hard 6s cap
      timers.push(setTimeout(finish, 6000));
      cleanups.push(() => clearTimers());

      if (reduceMotion) {
        lines.forEach(l => appendLine(l));
        if (bar) bar.style.width = '100%';
        timers.push(setTimeout(finish, 400));
        return;
      }

      // Animated boot
      const total   = lines.length;
      let idx       = 0;
      const perLine = Math.min(380, Math.floor(5200 / Math.max(total, 1)));

      function step() {
        if (finished) return;
        if (idx < total) {
          appendLine(lines[idx]);
          idx++;
          if (bar) {
            const pct = Math.round((idx / total) * 100);
            bar.style.width = pct + '%';
            try { bar.setAttribute('aria-valuenow', String(pct)); } catch (_) {}
          }
          timers.push(setTimeout(step, perLine));
        } else {
          timers.push(setTimeout(finish, 500));
        }
      }
      timers.push(setTimeout(step, 250));
    })();

    // =====================================================================
    // 2) LIVE CLOCK
    // =====================================================================
    (function liveClock() {
      const clock = $('#sys-clock');
      if (!clock) return;

      const pad2 = n => (n < 10 ? '0' : '') + n;

      function render() {
        const d  = new Date();
        const time  = pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
        const stamp = 'MAGI ' + d.getFullYear() + '.' + pad2(d.getMonth() + 1) + '.' + pad2(d.getDate());
        clock.textContent = time + ' \u00b7 ' + stamp;
        try { clock.setAttribute('datetime', d.toISOString()); } catch (_) {}
      }

      render();
      addInterval(setInterval(render, 1000));
    })();

    // =====================================================================
    // 3) EMERGENCY MODE
    // =====================================================================
    (function emergencyMode() {
      const toggle       = $('#emergency-toggle');
      const conditionOne = $('.condition-one');

      function isEmergency() { return root.dataset && root.dataset.mode === 'emergency'; }

      function setEmergency(active) {
        if (root.dataset) root.dataset.mode = active ? 'emergency' : '';
        else root.setAttribute('data-mode', active ? 'emergency' : '');

        if (toggle) {
          try {
            toggle.setAttribute('aria-pressed', active ? 'true' : 'false');
            toggle.setAttribute('aria-label',
              active
                ? 'Emergency mode active \u2014 Condition One. Press to stand down.'
                : 'Activate emergency mode'
            );
          } catch (_) {}
        }
        if (conditionOne) {
          try { conditionOne.setAttribute('aria-hidden', active ? 'false' : 'true'); } catch (_) {}
        }
      }

      function flip() { setEmergency(!isEmergency()); }

      addListener(toggle, 'click', (ev) => { ev.preventDefault(); flip(); });

      addListener(doc, 'keydown', (ev) => {
        const t = ev.target;
        if (t) {
          const tag = (t.tagName || '').toLowerCase();
          if (tag === 'input' || tag === 'textarea' || t.isContentEditable) return;
        }
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
        if (ev.key === 'e' || ev.key === 'E') flip();
      });
    })();

    // =====================================================================
    // 3.5) CRT MODE
    // =====================================================================
    (function crtMode() {
      const btn = $('#crt-toggle');
      const MODES  = ['min', 'off', 'full'];
      const LABELS = { min: 'CRT: MIN', off: 'CRT: OFF', full: 'CRT: FULL' };

      function apply(mode) {
        try {
          if (root.dataset) root.dataset.crt = mode;
          else root.setAttribute('data-crt', mode);
        } catch (_) {}
        if (btn) {
          btn.textContent = LABELS[mode] || 'CRT';
          try { btn.setAttribute('aria-label', 'CRT effects: ' + mode); } catch (_) {}
        }
      }

      apply('min');

      addListener(btn, 'click', (ev) => {
        ev.preventDefault();
        const cur  = (root.dataset && root.dataset.crt) || 'min';
        const next = MODES[(MODES.indexOf(cur) + 1) % MODES.length];
        apply(next);
      });
    })();

    // =====================================================================
    // 4) SCROLL REVEAL
    // =====================================================================
    (function scrollReveal() {
      const items = $all('[data-reveal]');
      if (!items.length) return;

      function revealAll() { items.forEach(el => el.classList.add('is-visible')); }

      if (reduceMotion || typeof IntersectionObserver !== 'function') {
        revealAll();
        return;
      }

      try {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
              }
            });
          },
          { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
        );
        items.forEach(el => io.observe(el));
        addObserver(io);
      } catch (_) {
        revealAll();
      }
    })();

    // =====================================================================
    // 5) MAGI DELIBERATION
    // =====================================================================
    (function magiSystem() {
      const runBtn      = $('#magi-run');
      const magiSection = $('#magi');
      const units       = $all('.magi-unit');
      if (!units.length && !runBtn) return;

      let running       = false;
      let codeTimers    = [];
      let resolveTimers = [];
      let runToken      = 0;

      const pad3 = n => {
        n = Math.floor(Math.abs(n)) % 1000;
        return (n < 100 ? '0' : '') + (n < 10 ? '0' : '') + n;
      };

      function setStatus(unit, text) {
        const light = $('.status-light', unit) || $('.magi-status', unit) || $('[data-magi-status]', unit);
        if (light) light.textContent = text;
      }

      function stopCodeCycles() {
        codeTimers.forEach(id => clearInterval(id));
        codeTimers = [];
        resolveTimers.forEach(id => clearTimeout(id));
        resolveTimers = [];
      }

      function resolveUnit(unit) {
        if (!unit) return;
        unit.classList.remove('deliberating');
        unit.classList.add('resolved');
        setStatus(unit, 'NOMINAL');
      }

      function run() {
        if (running) return;
        running = true;
        stopCodeCycles();
        const token = ++runToken;

        if (reduceMotion) {
          units.forEach(u => resolveUnit(u));
          running = false;
          return;
        }

        let pending = units.length;
        if (!pending) { running = false; return; }

        units.forEach((unit, i) => {
          unit.classList.remove('resolved');
          unit.classList.add('deliberating');

          const cycle = setInterval(() => {
            setStatus(unit, 'CODE-' + pad3(Math.floor(Math.random() * 1000)));
          }, 90);
          codeTimers.push(cycle);

          const delay  = 700 + i * 550 + Math.floor(Math.random() * 200);
          const handle = setTimeout(() => {
            clearInterval(cycle);
            if (token !== runToken) return;
            resolveUnit(unit);
            pending--;
            if (pending <= 0) running = false;
          }, delay);
          resolveTimers.push(handle);
        });
      }

      addListener(runBtn, 'click', (ev) => {
        ev.preventDefault();
        running = false;
        stopCodeCycles();
        run();
      });

      // Register cleanup for MAGI timers
      cleanups.push(() => stopCodeCycles());

      // Auto-run once on scroll-into-view
      let autoRan = false;
      function autoRunOnce() { if (autoRan) return; autoRan = true; run(); }

      if (magiSection) {
        if (reduceMotion || typeof IntersectionObserver !== 'function') {
          autoRunOnce();
        } else {
          try {
            const io = new IntersectionObserver(
              (entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) { autoRunOnce(); io.disconnect(); }
                });
              },
              { root: null, threshold: 0.25 }
            );
            io.observe(magiSection);
            addObserver(io);
          } catch (_) {
            autoRunOnce();
          }
        }
      }
    })();

    // =====================================================================
    // 6) TERMINAL CONTACT EMULATOR
    // =====================================================================
    (function terminal() {
      const buttons = $all('[data-cmd]');
      const output  = $('#terminal-output');
      if (!buttons.length) return;

      const EMAIL    = 'k79gupta@uwaterloo.ca';
      const LINKEDIN = 'https://linkedin.com/in/karan-gupta-2b72a735a/';
      const GITHUB   = 'https://github.com/Karan-Gupta07';
      const RESUME   = '/KaranGuptaResume.pdf';

      const COMMANDS = {
        mail:     { echo: 'mail',          response: 'OPENING SECURE CHANNEL \u2192 ' + EMAIL,    run() { openUrl('mailto:' + EMAIL, true); } },
        linkedin: { echo: 'open linkedin', response: 'ROUTING \u2192 ' + LINKEDIN,                run() { openUrl(LINKEDIN, false); } },
        github:   { echo: 'open github',   response: 'ROUTING \u2192 ' + GITHUB,                  run() { openUrl(GITHUB, false); } },
        resume:   { echo: 'open resume',   response: 'RETRIEVING DOSSIER \u2192 ' + RESUME,        run() { openUrl(RESUME, false); } },
      };

      function openUrl(url, sameWindow) {
        try {
          if (sameWindow) { window.location.href = url; return; }
          const w = window.open(url, '_blank', 'noopener,noreferrer');
          if (w) { try { w.opener = null; } catch (_) {} }
          else window.location.href = url;
        } catch (_) {
          try { window.location.href = url; } catch (_2) {}
        }
      }

      const cursor = output ? $('.blink', output) : null;

      function printLine(text, cls) {
        if (!output) return;
        const line = doc.createElement('div');
        line.className = 'term-line' + (cls ? ' ' + cls : '');
        line.textContent = text;
        if (cursor && cursor.parentNode === output) output.insertBefore(line, cursor);
        else output.appendChild(line);
        try { output.scrollTop = output.scrollHeight; } catch (_) {}
      }

      buttons.forEach(btn => {
        addListener(btn, 'click', (ev) => {
          ev.preventDefault();
          const key = (btn.getAttribute('data-cmd') || '').toLowerCase();
          const cmd = COMMANDS[key];
          if (!cmd) {
            printLine('$ ' + key, 'term-cmd');
            printLine('ERR: UNKNOWN COMMAND', 'status-alert');
            return;
          }
          printLine('$ ' + cmd.echo, 'term-cmd');
          printLine(cmd.response, 'term-resp');
          cmd.run();
        });
      });
    })();

    // =====================================================================
    // 6.5) MAGI NAVIGATION HUB
    // =====================================================================
    (function navHub() {
      const nodes     = $all('.mc-node');
      if (!nodes.length) return;
      const statusBox  = $('#nav-status');
      const statusK    = statusBox ? $('.mc-sb-k', statusBox) : null;
      const statusL    = statusBox ? $('.mc-sb-l', statusBox) : null;
      const statusCode = statusBox ? $('.mc-sb-code', statusBox) : null;
      const qLine      = $('#nav-q');

      function wireFor(node) {
        const id = node.getAttribute('data-wire');
        return id ? doc.getElementById(id) : null;
      }
      function setWire(node, on) {
        const w = wireFor(node);
        if (w) w.classList.toggle('active', !!on);
      }

      nodes.forEach(node => {
        addListener(node, 'mouseenter', () => setWire(node, true));
        addListener(node, 'mouseleave', () => { if (!node.classList.contains('selected')) setWire(node, false); });
        addListener(node, 'focus',      () => setWire(node, true));
        addListener(node, 'blur',       () => { if (!node.classList.contains('selected')) setWire(node, false); });

        addListener(node, 'click', () => {
          nodes.forEach(n => {
            n.classList.remove('selected');
            if (n !== node) setWire(n, false);
          });
          node.classList.add('selected');
          setWire(node, true);

          const dest = node.getAttribute('data-dest') || 'TARGET';
          if (statusBox) statusBox.setAttribute('data-state', 'approved');
          if (statusK)    statusK.textContent = '\u627F\u8A8D';
          if (statusL)    statusL.textContent = 'Approved';
          if (statusCode) statusCode.textContent = 'ROUTE // ' + dest;
          if (qLine)      qLine.textContent = 'routing to ' + dest.toLowerCase() + ' ...';
        });
      });
    })();

    // =====================================================================
    // 6.6) NAV REVEAL
    // =====================================================================
    (function navReveal() {
      const landing = $('#nav-hub');

      function update() {
        const threshold = (window.innerHeight || 600) * 0.6;
        const scrolled  = window.pageYOffset || root.scrollTop || 0;
        let show = scrolled > threshold;
        if (!landing) show = true;
        body.classList.toggle('nav-visible', show);
      }

      addListener(window, 'scroll', update, { passive: true });
      addListener(window, 'resize', update, { passive: true });
      update();
    })();

    // =====================================================================
    // 7) ACTIVE NAV HIGHLIGHT
    // =====================================================================
    (function activeNav() {
      const nav = $('#nerv-nav');
      if (!nav) return;
      const links = $all('a[href^="#"]', nav);
      if (!links.length) return;

      const map      = {};
      const sections = [];

      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        const id   = href.charAt(0) === '#' ? href.slice(1) : '';
        if (!id) return;
        const sec = doc.getElementById(id);
        if (sec) { map[id] = link; sections.push(sec); }
      });
      if (!sections.length) return;

      function setActive(id) {
        links.forEach(link => {
          link.classList.remove('is-active');
          try { link.removeAttribute('aria-current'); } catch (_) {}
        });
        const active = map[id];
        if (active) {
          active.classList.add('is-active');
          try { active.setAttribute('aria-current', 'true'); } catch (_) {}
        }
      }

      if (typeof IntersectionObserver === 'function') {
        try {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting && entry.target) setActive(entry.target.id);
              });
            },
            { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 }
          );
          sections.forEach(sec => io.observe(sec));
          addObserver(io);
          return;
        } catch (_) { /* fall through */ }
      }

      // Scroll fallback
      function onScroll() {
        let best    = null;
        let bestTop = -Infinity;
        const mid   = (window.innerHeight || 0) / 2;
        sections.forEach(sec => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= mid && rect.top > bestTop) { bestTop = rect.top; best = sec; }
        });
        if (best) setActive(best.id);
      }
      addListener(window, 'scroll', onScroll, { passive: true });
      onScroll();
    })();

    // =====================================================================
    // 11) SPOTIFY NOW PLAYING (text-only into #spotify-text)
    // =====================================================================
    (function spotifyStatus() {
      const el = $('#spotify-text');
      if (!el) return;

      async function fetchStatus() {
        try {
          const res = await fetch('/api/spotify');
          if (!res.ok) { el.textContent = 'STATUS // OFFLINE'; return; }
          const data = await res.json();
          if (data.title) {
            if (data.isPlaying) {
              el.textContent = 'NOW LISTENING TO ' + data.title + (data.artist ? ' - ' + data.artist : '');
            } else {
              el.textContent = 'LAST PLAYED ' + data.title + (data.artist ? ' - ' + data.artist : '');
            }
          } else {
            el.textContent = 'STATUS // OFFLINE';
          }
        } catch (_) {
          el.textContent = 'STATUS // OFFLINE';
        }
      }

      fetchStatus();
      addInterval(setInterval(fetchStatus, 30000));
    })();

    // =====================================================================
    // CLEANUP — tear down everything on unmount
    // =====================================================================
    return () => {
      cleanups.forEach(fn => { try { fn(); } catch (_) {} });
      cleanups.length = 0;
    };
  }, []);

  return null;
}
