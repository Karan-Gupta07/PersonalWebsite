/*
 * NERV OPERATIONS CONSOLE — behavior module (js/nerv.js)
 * Single file. No imports, no fetch of local files. All data inlined.
 * Runs after DOMContentLoaded. Every feature is feature-detected so a missing
 * element never throws. Respects prefers-reduced-motion throughout.
 * Implements DESIGN.md §7 (JS hooks & behavior) and §8 (MAGI panel spec).
 */
(function () {
  "use strict";

  function start() {
    // --- Shared helpers -----------------------------------------------------
    var doc = document;
    var root = doc.documentElement;
    var body = doc.body;

    var reduceMotion = false;
    try {
      reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      reduceMotion = false;
    }

    function $(sel, ctx) {
      try {
        return (ctx || doc).querySelector(sel);
      } catch (e) {
        return null;
      }
    }
    function $all(sel, ctx) {
      try {
        return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
      } catch (e) {
        return [];
      }
    }
    function on(el, type, fn, opts) {
      if (el && typeof el.addEventListener === "function") {
        el.addEventListener(type, fn, opts || false);
      }
    }

    // =========================================================================
    // 1) BOOT SEQUENCE  — §7 Boot
    //    Type a MAGI boot log into #boot-log, animate #boot-bar to 100%,
    //    then add class "booted" to <body> and fade #boot.
    //    Complete on natural finish OR click/keydown OR a hard 6s cap.
    //    #boot-skip always skips. CSS hides #boot when body.booted.
    // =========================================================================
    (function bootSequence() {
      var boot = $("#boot");
      var log = $("#boot-log");
      var bar = $("#boot-bar");
      var skip = $("#boot-skip");

      var finished = false;
      var timers = [];

      function clearTimers() {
        for (var i = 0; i < timers.length; i++) {
          clearTimeout(timers[i]);
          clearInterval(timers[i]);
        }
        timers.length = 0;
      }

      function finish() {
        if (finished) return;
        finished = true;
        clearTimers();
        clearGlobalListeners();
        if (bar) {
          bar.style.width = "100%";
          try {
            bar.setAttribute("aria-valuenow", "100");
          } catch (e) {}
        }
        if (body && body.classList) body.classList.add("booted");
        // CSS is responsible for hiding/fading #boot once body.booted.
      }

      // Inlined MAGI boot log lines (no fetch of local files).
      var lines = [
        "KARAN // MAGI SYSTEM — CENTRAL DOGMA",
        "> POWER-ON SELF TEST ............ OK",
        "> MELCHIOR-1 ONLINE ............. OK",
        "> BALTHASAR-2 ONLINE ........... OK",
        "> CASPER-3 ONLINE .............. OK",
        "> LCL PRESSURE NOMINAL",
        "> A.T. FIELD STABLE",
        "> AUTHENTICATING PILOT-EXO ...... OK",
        "> LOADING DOSSIER: K. GUPTA",
        "> ESTABLISHING NEURAL LINK ...",
        "> SYNCHRONIZATION ....... 100%",
        "> ALL SYSTEMS NOMINAL. WELCOME.",
      ];

      function appendLine(text) {
        if (!log) return;
        var lineEl = doc.createElement("div");
        lineEl.className = "boot-line";
        lineEl.textContent = text;
        log.appendChild(lineEl);
        // Keep newest line in view within the log container.
        try {
          log.scrollTop = log.scrollHeight;
        } catch (e) {}
      }

      // Global "any input skips" listeners (only during boot).
      function onAnyInput() {
        finish();
      }
      function clearGlobalListeners() {
        if (doc.removeEventListener) {
          doc.removeEventListener("click", onAnyInput, true);
          doc.removeEventListener("keydown", onAnyInput, true);
        }
      }

      // If there is no boot overlay at all, the page is already usable.
      if (!boot) {
        if (body && body.classList) body.classList.add("booted");
        return;
      }

      // Explicit skip control always works (also works if animations are off).
      on(skip, "click", function (ev) {
        if (ev) {
          ev.preventDefault();
          if (ev.stopPropagation) ev.stopPropagation();
        }
        finish();
      });

      // Any click/keydown anywhere skips the boot (capture phase).
      if (doc.addEventListener) {
        doc.addEventListener("click", onAnyInput, true);
        doc.addEventListener("keydown", onAnyInput, true);
      }

      // Hard 6s cap regardless of typing progress.
      timers.push(setTimeout(finish, 6000));

      if (reduceMotion) {
        // Reduced motion: show final state immediately, no typing/animation.
        if (log) {
          for (var i = 0; i < lines.length; i++) appendLine(lines[i]);
        }
        if (bar) bar.style.width = "100%";
        // Brief settle so the final state is perceivable, still well within cap.
        timers.push(setTimeout(finish, 400));
        return;
      }

      // Animated boot: type lines out, drive the progress bar in lockstep.
      var total = lines.length;
      var idx = 0;
      var perLine = Math.min(380, Math.floor(5200 / Math.max(total, 1)));

      function step() {
        if (finished) return;
        if (idx < total) {
          appendLine(lines[idx]);
          idx++;
          if (bar) {
            var pct = Math.round((idx / total) * 100);
            bar.style.width = pct + "%";
            try {
              bar.setAttribute("aria-valuenow", String(pct));
            } catch (e) {}
          }
          timers.push(setTimeout(step, perLine));
        } else {
          // Natural finish shortly after the last line.
          timers.push(setTimeout(finish, 500));
        }
      }
      // Small initial delay for a "powering on" beat.
      timers.push(setTimeout(step, 250));
    })();

    // =========================================================================
    // 2) LIVE CLOCK — §7 Clock
    //    #sys-clock updates each second: 24h time + stylized MAGI date stamp.
    // =========================================================================
    (function liveClock() {
      var clock = $("#sys-clock");
      if (!clock) return;

      function pad2(n) {
        return (n < 10 ? "0" : "") + n;
      }

      function render() {
        var d = new Date(); // browser runtime — allowed per §7.
        var hh = pad2(d.getHours());
        var mm = pad2(d.getMinutes());
        var ss = pad2(d.getSeconds());
        var time = hh + ":" + mm + ":" + ss;

        // Stylized MAGI date stamp, e.g. "MAGI 2026.07.05".
        var stamp =
          "MAGI " +
          d.getFullYear() +
          "." +
          pad2(d.getMonth() + 1) +
          "." +
          pad2(d.getDate());

        clock.textContent = time + " · " + stamp;
        try {
          clock.setAttribute("datetime", d.toISOString());
        } catch (e) {}
      }

      render();
      setInterval(render, 1000);
    })();

    // =========================================================================
    // 3) EMERGENCY MODE — §7 Emergency mode
    //    #emergency-toggle button and the "E" key toggle
    //    document.documentElement.dataset.mode between "" and "emergency".
    // =========================================================================
    (function emergencyMode() {
      var toggle = $("#emergency-toggle");

      function isEmergency() {
        return root && root.dataset && root.dataset.mode === "emergency";
      }

      var conditionOne = $(".condition-one");

      function setEmergency(active) {
        if (!root) return;
        if (active) {
          if (root.dataset) root.dataset.mode = "emergency";
          else root.setAttribute("data-mode", "emergency");
        } else {
          // Reset to unset/empty.
          if (root.dataset) root.dataset.mode = "";
          else root.setAttribute("data-mode", "");
        }
        if (toggle) {
          try {
            toggle.setAttribute("aria-pressed", active ? "true" : "false");
            // Convey the state change through the real control (reliable for SRs).
            toggle.setAttribute(
              "aria-label",
              active
                ? "Emergency mode active — Condition One. Press to stand down."
                : "Activate emergency mode"
            );
          } catch (e) {}
        }
        // Reveal/hide the CONDITION ONE battle-stations banner.
        if (conditionOne) {
          try {
            conditionOne.setAttribute("aria-hidden", active ? "false" : "true");
          } catch (e) {}
        }
      }

      function flip() {
        setEmergency(!isEmergency());
      }

      on(toggle, "click", function (ev) {
        if (ev && ev.preventDefault) ev.preventDefault();
        flip();
      });

      on(doc, "keydown", function (ev) {
        if (!ev) return;
        // Ignore when typing into an input/textarea/contenteditable.
        var t = ev.target;
        if (t) {
          var tag = (t.tagName || "").toLowerCase();
          if (tag === "input" || tag === "textarea" || t.isContentEditable) {
            return;
          }
        }
        // Ignore modified key combos so browser shortcuts still work.
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
        var key = ev.key || "";
        if (key === "e" || key === "E" || ev.keyCode === 69) {
          flip();
        }
      });
    })();

    // =========================================================================
    // 3.5) CRT MODE — cycle the CRT overlays: MIN -> OFF -> FULL (default MIN).
    //   MIN  = static scanlines + vignette, no motion
    //   OFF  = no CRT overlays
    //   FULL = scanlines + vignette + flicker + moving sweep
    // =========================================================================
    (function crtMode() {
      var btn = $("#crt-toggle");
      if (!root) return;
      var MODES = ["min", "off", "full"];
      var LABELS = { min: "CRT: MIN", off: "CRT: OFF", full: "CRT: FULL" };

      function apply(mode) {
        try {
          if (root.dataset) root.dataset.crt = mode;
          else root.setAttribute("data-crt", mode);
        } catch (e) {}
        if (btn) {
          btn.textContent = LABELS[mode] || "CRT";
          try { btn.setAttribute("aria-label", "CRT effects: " + mode); } catch (e) {}
        }
      }

      // Default to MIN (calmer — no moving scan line).
      apply("min");

      on(btn, "click", function (ev) {
        if (ev && ev.preventDefault) ev.preventDefault();
        var cur = (root.dataset && root.dataset.crt) || "min";
        var next = MODES[(MODES.indexOf(cur) + 1) % MODES.length];
        apply(next);
      });
    })();

    // =========================================================================
    // 4) SCROLL REVEAL — §7 Scroll reveal
    //    IntersectionObserver on [data-reveal] → add .is-visible.
    //    Fallback: IO unsupported OR reduced-motion → reveal everything now.
    // =========================================================================
    (function scrollReveal() {
      var items = $all("[data-reveal]");
      if (!items.length) return;

      function revealAll() {
        for (var i = 0; i < items.length; i++) {
          if (items[i] && items[i].classList) {
            items[i].classList.add("is-visible");
          }
        }
      }

      if (reduceMotion || typeof window.IntersectionObserver !== "function") {
        revealAll();
        return;
      }

      try {
        var io = new IntersectionObserver(
          function (entries) {
            for (var i = 0; i < entries.length; i++) {
              var entry = entries[i];
              if (entry.isIntersecting && entry.target && entry.target.classList) {
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
              }
            }
          },
          { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
        );
        for (var i = 0; i < items.length; i++) io.observe(items[i]);
      } catch (e) {
        revealAll();
      }
    })();

    // =========================================================================
    // 5) MAGI DELIBERATION — §7 MAGI + §8
    //    #magi-run → each .magi-unit gets .deliberating (staggered) then
    //    .resolved. Auto-run once when #magi scrolls into view. Re-runnable.
    //    Under reduced-motion, resolve instantly.
    // =========================================================================
    (function magiSystem() {
      var runBtn = $("#magi-run");
      var magiSection = $("#magi");
      var units = $all(".magi-unit");
      if (!units.length && !runBtn) return;

      var running = false;
      var codeTimers = [];
      var resolveTimers = [];
      var runToken = 0; // bumped each run; stale resolve callbacks no-op.

      function pad3(n) {
        n = Math.floor(Math.abs(n)) % 1000;
        return (n < 100 ? "0" : "") + (n < 10 ? "0" : "") + n;
      }

      function setStatus(unit, text) {
        // Look for a status light element within the unit; tolerate absence.
        var light =
          $(".status-light", unit) ||
          $(".magi-status", unit) ||
          $("[data-magi-status]", unit);
        if (light) light.textContent = text;
      }

      function stopCodeCycles() {
        for (var i = 0; i < codeTimers.length; i++) clearInterval(codeTimers[i]);
        codeTimers.length = 0;
        // Also cancel any pending staggered-resolve timers from a prior run so
        // they can't prematurely flip units or clobber the running flag.
        for (var j = 0; j < resolveTimers.length; j++) clearTimeout(resolveTimers[j]);
        resolveTimers.length = 0;
      }

      function resolveUnit(unit) {
        if (!unit || !unit.classList) return;
        unit.classList.remove("deliberating");
        unit.classList.add("resolved");
        setStatus(unit, "NOMINAL");
      }

      function run() {
        if (running) return;
        running = true;
        stopCodeCycles();
        var token = ++runToken; // this run's generation

        if (reduceMotion) {
          // Resolve instantly, no flicker.
          for (var i = 0; i < units.length; i++) resolveUnit(units[i]);
          running = false;
          return;
        }

        var pending = units.length;
        if (!pending) {
          running = false;
          return;
        }

        units.forEach(function (unit, i) {
          if (!unit || !unit.classList) {
            pending--;
            return;
          }
          // Reset to a fresh deliberation state (supports re-running).
          unit.classList.remove("resolved");
          unit.classList.add("deliberating");

          // Cycle a CODE-XXX status light while deliberating.
          var cycle = setInterval(function () {
            setStatus(unit, "CODE-" + pad3(Math.floor(Math.random() * 1000)));
          }, 90);
          codeTimers.push(cycle);

          // Staggered resolve. Guard on the run token so a stale timer from a
          // superseded run can't resolve units or reset `running` mid-run.
          var delay = 700 + i * 550 + Math.floor(Math.random() * 200);
          var handle = setTimeout(function () {
            clearInterval(cycle);
            if (token !== runToken) return; // superseded by a newer run
            resolveUnit(unit);
            pending--;
            if (pending <= 0) running = false;
          }, delay);
          resolveTimers.push(handle);
        });
      }

      on(runBtn, "click", function (ev) {
        if (ev && ev.preventDefault) ev.preventDefault();
        running = false; // allow re-trigger even if a prior run flag lingered
        stopCodeCycles();
        run();
      });

      // Auto-run once when #magi first scrolls into view.
      var autoRan = false;
      function autoRunOnce() {
        if (autoRan) return;
        autoRan = true;
        run();
      }

      if (magiSection) {
        if (reduceMotion || typeof window.IntersectionObserver !== "function") {
          autoRunOnce();
        } else {
          try {
            var io = new IntersectionObserver(
              function (entries) {
                for (var i = 0; i < entries.length; i++) {
                  if (entries[i].isIntersecting) {
                    autoRunOnce();
                    io.disconnect();
                    break;
                  }
                }
              },
              { root: null, threshold: 0.25 }
            );
            io.observe(magiSection);
          } catch (e) {
            autoRunOnce();
          }
        }
      }
    })();

    // =========================================================================
    // 6) TERMINAL CONTACT EMULATOR — §7 Terminal
    //    Buttons with [data-cmd] in {mail,linkedin,github,resume} print
    //    "$ <cmd>" + a response line into #terminal-output, then perform
    //    mailto/window.open to the correct URL (from CONTENT.md).
    //    Keep a blinking cursor (.blink) at the prompt.
    // =========================================================================
    (function terminal() {
      var buttons = $all("[data-cmd]");
      var output = $("#terminal-output");
      if (!buttons.length) return;

      // Inlined contact data — verbatim from CONTENT.md (no local fetch).
      var EMAIL = "k79gupta@uwaterloo.ca";
      var LINKEDIN = "https://linkedin.com/in/karan-gupta-2b72a735a/";
      var GITHUB = "https://github.com/Karan-Gupta07";
      var RESUME = "KaranGuptaResume.pdf"; // relative link in the mockup

      var COMMANDS = {
        mail: {
          echo: "mail",
          response: "OPENING SECURE CHANNEL → " + EMAIL,
          run: function () {
            openUrl("mailto:" + EMAIL, true);
          },
        },
        linkedin: {
          echo: "open linkedin",
          response: "ROUTING → " + LINKEDIN,
          run: function () {
            openUrl(LINKEDIN, false);
          },
        },
        github: {
          echo: "open github",
          response: "ROUTING → " + GITHUB,
          run: function () {
            openUrl(GITHUB, false);
          },
        },
        resume: {
          echo: "open resume",
          response: "RETRIEVING DOSSIER → " + RESUME,
          run: function () {
            openUrl(RESUME, false);
          },
        },
      };

      function openUrl(url, sameWindow) {
        try {
          if (sameWindow) {
            window.location.href = url;
          } else {
            var w = window.open(url, "_blank", "noopener,noreferrer");
            if (w) {
              try {
                w.opener = null;
              } catch (e) {}
            } else {
              // Popup blocked — navigate current tab as a fallback.
              window.location.href = url;
            }
          }
        } catch (e) {
          try {
            window.location.href = url;
          } catch (e2) {}
        }
      }

      // Find (or lazily create) a blinking cursor at the prompt.
      var cursor = output ? $(".blink", output) : null;

      function printLine(text, cls) {
        if (!output) return;
        var line = doc.createElement("div");
        line.className = "term-line" + (cls ? " " + cls : "");
        line.textContent = text;
        // Insert before the blinking cursor if present so it stays at bottom.
        if (cursor && cursor.parentNode === output) {
          output.insertBefore(line, cursor);
        } else {
          output.appendChild(line);
        }
        try {
          output.scrollTop = output.scrollHeight;
        } catch (e) {}
      }

      buttons.forEach(function (btn) {
        on(btn, "click", function (ev) {
          if (ev && ev.preventDefault) ev.preventDefault();
          var key = (btn.getAttribute("data-cmd") || "").toLowerCase();
          var cmd = COMMANDS[key];
          if (!cmd) {
            printLine("$ " + key, "term-cmd");
            printLine("ERR: UNKNOWN COMMAND", "status-alert");
            return;
          }
          printLine("$ " + cmd.echo, "term-cmd");
          printLine(cmd.response, "term-resp");
          cmd.run();
        });
      });
    })();

    // =========================================================================
    // 6.5) MAGI NAVIGATION HUB — #nav-hub
    //   Hover/focus a node -> pulse its orange connector cyan. Click -> mark it
    //   selected (green "承認/approved" verdict on the status box + terminal
    //   readout), then let the hash link scroll to the target section.
    // =========================================================================
    (function navHub() {
      var nodes = $all(".mc-node");
      if (!nodes.length) return;
      var statusBox = $("#nav-status");
      var statusK = statusBox ? $(".mc-sb-k", statusBox) : null;
      var statusL = statusBox ? $(".mc-sb-l", statusBox) : null;
      var statusCode = statusBox ? $(".mc-sb-code", statusBox) : null;
      var qLine = $("#nav-q");

      function wireFor(node) {
        var id = node.getAttribute("data-wire");
        return id ? doc.getElementById(id) : null;
      }
      function setWire(node, on) {
        var w = wireFor(node);
        if (w) w.classList.toggle("active", !!on);
      }

      nodes.forEach(function (node) {
        on(node, "mouseenter", function () { setWire(node, true); });
        on(node, "mouseleave", function () { if (!node.classList.contains("selected")) setWire(node, false); });
        on(node, "focus", function () { setWire(node, true); });
        on(node, "blur", function () { if (!node.classList.contains("selected")) setWire(node, false); });

        on(node, "click", function () {
          // Clear prior selection, mark this one.
          nodes.forEach(function (n) {
            n.classList.remove("selected");
            if (n !== node) setWire(n, false);
          });
          node.classList.add("selected");
          setWire(node, true);

          var dest = node.getAttribute("data-dest") || "TARGET";
          // Flip status box to the green "approved" verdict (REFERENCE states).
          if (statusBox) statusBox.setAttribute("data-state", "approved");
          if (statusK) statusK.textContent = "承認";
          if (statusL) statusL.textContent = "Approved";
          if (statusCode) statusCode.textContent = "ROUTE // " + dest;
          if (qLine) qLine.textContent = "routing to " + dest.toLowerCase() + " ...";
          // The <a href="#..."> default action scrolls to the section.
        });
      });
    })();

    // =========================================================================
    // 6.6) NAV REVEAL — the top nav bar is hidden on the full-screen landing
    //   (#nav-hub) and slides in only once the user scrolls into the content.
    // =========================================================================
    (function navReveal() {
      var landing = $("#nav-hub");
      if (!body) return;

      function update() {
        // Reveal the nav once scrolled ~60% down the landing screen.
        var threshold = (window.innerHeight || 600) * 0.6;
        var scrolled = window.pageYOffset || doc.documentElement.scrollTop || 0;
        var show = scrolled > threshold;
        // If there's no landing section, always show the nav.
        if (!landing) show = true;
        body.classList.toggle("nav-visible", show);
      }

      on(window, "scroll", update, { passive: true });
      on(window, "resize", update, { passive: true });
      // If a nav/section anchor is clicked while hidden, reveal immediately.
      update();
    })();

    // =========================================================================
    // 7) ACTIVE NAV HIGHLIGHT — §7 (nice-to-have)
    //    Highlight the nav link for the section currently in view.
    // =========================================================================
    (function activeNav() {
      var nav = $("#nerv-nav");
      if (!nav) return;
      var links = $all('a[href^="#"]', nav);
      if (!links.length) return;

      // Map section id → nav link.
      var map = {};
      var sections = [];
      links.forEach(function (link) {
        var href = link.getAttribute("href") || "";
        var id = href.charAt(0) === "#" ? href.slice(1) : "";
        if (!id) return;
        var sec = doc.getElementById(id);
        if (sec) {
          map[id] = link;
          sections.push(sec);
        }
      });
      if (!sections.length) return;

      function setActive(id) {
        links.forEach(function (link) {
          if (link.classList) link.classList.remove("is-active");
          try {
            link.removeAttribute("aria-current");
          } catch (e) {}
        });
        var active = map[id];
        if (active) {
          if (active.classList) active.classList.add("is-active");
          try {
            active.setAttribute("aria-current", "true");
          } catch (e) {}
        }
      }

      if (typeof window.IntersectionObserver === "function") {
        try {
          var io = new IntersectionObserver(
            function (entries) {
              for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting && entries[i].target) {
                  setActive(entries[i].target.id);
                }
              }
            },
            { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0 }
          );
          for (var i = 0; i < sections.length; i++) io.observe(sections[i]);
          return;
        } catch (e) {
          // fall through to scroll fallback
        }
      }

      // Scroll fallback if IO is unavailable.
      function onScroll() {
        var best = null;
        var bestTop = -Infinity;
        var mid = (window.innerHeight || 0) / 2;
        for (var i = 0; i < sections.length; i++) {
          var rect = sections[i].getBoundingClientRect();
          if (rect.top <= mid && rect.top > bestTop) {
            bestTop = rect.top;
            best = sections[i];
          }
        }
        if (best) setActive(best.id);
      }
      on(window, "scroll", onScroll, { passive: true });
      onScroll();
    })();
  }

  // Guard: run after DOMContentLoaded (or immediately if already ready).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
