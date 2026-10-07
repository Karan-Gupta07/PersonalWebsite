"use client";

// Port of https://github.com/LucasHJin/scrollbar-but-cooler with the dialkit tuning panel
// replaced by fixed settings. Idle: bobbing arrow (click = scroll one viewport).
// Scrolled: arrow morphs into a dot column that tracks/jumps to page position.
import { useLayoutEffect, useRef, useState } from "react";

const S = {
  arrowLength: 28, wingSpread: 8, bobAmplitude: 3, bobPeriod: 2, arrowHitPadding: 10,
  lineLength: 520, dotSpacing: 10,
  maxExtension: 50, extensionFalloff: 0.6, colorFalloff: 0.3, smoothingTau: 0.05, hitPadding: 10,
  timing: [[0.15, [0.33, 1, 0.68, 1]], [0.35, [0.65, 0, 0.35, 1]], [0.2, [0.33, 1, 0.68, 1]], [0.2, [0.33, 1, 0.68, 1]]],
  dotColor: [102, 102, 102], hoverColor: [237, 237, 237], // match #666 / --text; stroke width + color live in globals.css
};
const DOTS = Math.round(S.lineLength / S.dotSpacing);
const POSE_ORDER = ["idle", "compressed", "extended", "split", "tracking"];
const MARGIN_RIGHT = 40, MARGIN_BOTTOM = 40, SPLIT_DOT = 0.01;

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (f, g, t) => `rgb(${f.map((c, i) => Math.round(lerp(c, g[i], t))).join(", ")})`;
const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
const fraction = () => (maxScroll() > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll())) : 0);
const focusDot = () => Math.round(fraction() * (DOTS - 1));
const scrollToDot = (dot) => scrollTo({ top: (DOTS > 1 ? dot / (DOTS - 1) : 1) * maxScroll(), behavior: smooth() });
const scrollDown = () => scrollTo({ top: scrollY + innerHeight, behavior: smooth() });

// Solve x(t) = x by bisection, return y(t).
const cubicBezier = (x1, y1, x2, y2) => {
  const at = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 24; i++) { if (at(x1, x2, t) < x) lo = t; else hi = t; t = (lo + hi) / 2; }
    return at(y1, y2, t);
  };
};
const transitions = S.timing.map(([duration, ease]) => ({ duration, ease: cubicBezier(...ease) }));

const pieces = (x, top, bottom, dots) => Array.from({ length: DOTS }, (_, i) => {
  const step = (bottom - top) / DOTS;
  if (!dots) return [x, top + i * step, x, top + (i + 1) * step];
  const c = top + (i + 0.5) * step;
  return [x, c - SPLIT_DOT / 2, x, c + SPLIT_DOT / 2];
});

function getPoses({ width, height }) {
  const x = width - MARGIN_RIGHT, bottomY = height - MARGIN_BOTTOM;
  const top = height / 2 - S.lineLength / 2, bottom = height / 2 + S.lineLength / 2;
  const shaft = pieces(x, bottomY - S.arrowLength, bottomY, false);
  const dotC = bottom - S.lineLength / DOTS / 2;
  const at = (y) => [x, y, x, y];
  const dots = { leftWing: at(dotC), rightWing: at(dotC), pieces: pieces(x, top, bottom, true) };
  return {
    idle: { leftWing: [x - S.wingSpread, bottomY - S.wingSpread, x, bottomY], rightWing: [x + S.wingSpread, bottomY - S.wingSpread, x, bottomY], pieces: shaft },
    compressed: { leftWing: at(bottomY), rightWing: at(bottomY), pieces: shaft },
    extended: { leftWing: at(bottom), rightWing: at(bottom), pieces: pieces(x, top, bottom, false) },
    split: dots,
    tracking: dots,
  };
}

export default function Scrollbar() {
  const [scrollable, setScrollable] = useState(false);
  const svgRef = useRef(null);
  const wingRefs = useRef([]);
  const pieceRefs = useRef([]);
  const hitRefs = useRef([]);
  const arrowHitRef = useRef(null);

  // Only render on pages that actually scroll (layout persists across navigations).
  useLayoutEffect(() => {
    const check = () => setScrollable(maxScroll() > 1);
    const ro = new ResizeObserver(check);
    ro.observe(document.body);
    addEventListener("resize", check);
    check();
    return () => { ro.disconnect(); removeEventListener("resize", check); };
  }, []);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!scrollable || !svg) return;
    const [leftWing, rightWing] = wingRefs.current;
    const lines = pieceRefs.current, hits = hitRefs.current, arrowHit = arrowHitRef.current;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const canHover = matchMedia("(hover: hover)");
    const a = { current: 0, target: 0, rafId: null, lastTime: 0, state: "idle" };
    let bobTime = 0;
    let poses = getPoses(svg.getBoundingClientRect());
    const target = () => POSE_ORDER.indexOf(a.state);
    const extensionFor = (i, f) => S.maxExtension * S.extensionFalloff ** Math.abs(i - f);

    const placeHitAreas = () => {
      const spacing = S.lineLength / DOTS;
      hits.forEach((el, i) => {
        const [x, y1, , y2] = poses.split.pieces[i];
        el.setAttribute("x", x - S.maxExtension - S.hitPadding);
        el.setAttribute("y", (y1 + y2) / 2 - spacing / 2);
        el.setAttribute("width", S.maxExtension + 2 * S.hitPadding);
        el.setAttribute("height", spacing);
      });
      const [, , x, bottomY] = poses.idle.leftWing;
      const top = bottomY - S.arrowLength - S.bobAmplitude - S.arrowHitPadding;
      arrowHit.setAttribute("x", x - S.wingSpread - S.arrowHitPadding);
      arrowHit.setAttribute("y", top);
      arrowHit.setAttribute("width", 2 * (S.wingSpread + S.arrowHitPadding));
      arrowHit.setAttribute("height", bottomY + S.bobAmplitude + S.arrowHitPadding - top);
    };

    let hoveredDot = null, arrowHovered = false;
    const applyHover = () => {
      const arrow = arrowHovered ? "var(--text)" : "";
      leftWing.style.stroke = rightWing.style.stroke = arrow;
      lines.forEach((el, i) => {
        el.style.stroke = arrowHovered ? arrow : hoveredDot === null ? "" : mix(S.dotColor, S.hoverColor, S.colorFalloff ** Math.abs(i - hoveredDot));
      });
    };

    const extensions = new Float64Array(DOTS);
    const advanceExtensions = (dt) => {
      const f = focusDot();
      const alpha = reduceMotion.matches ? 1 : 1 - Math.exp(-dt / S.smoothingTau);
      let settled = true;
      for (let i = 0; i < DOTS; i++) {
        const goal = extensionFor(i, f);
        const next = extensions[i] + (goal - extensions[i]) * alpha;
        if (Math.abs(goal - next) < 0.05) extensions[i] = goal;
        else { extensions[i] = next; settled = false; }
      }
      return settled;
    };

    const setLine = (el, f, g, s, extendLeft, dy) => {
      el.setAttribute("x1", lerp(f[0], g[0], s) - extendLeft);
      el.setAttribute("y1", lerp(f[1], g[1], s) + dy);
      el.setAttribute("x2", lerp(f[2], g[2], s));
      el.setAttribute("y2", lerp(f[3], g[3], s) + dy);
    };

    const applyGeometry = (t) => {
      const seg = Math.min(Math.max(Math.floor(t), 0), transitions.length - 1);
      const from = poses[POSE_ORDER[seg]], to = poses[POSE_ORDER[seg + 1]];
      const local = transitions[seg].ease(t - seg);
      const extScale = seg === transitions.length - 1 ? local : 0;
      const bob = (seg === 0 ? 1 - local : 0) * S.bobAmplitude * Math.sin((2 * Math.PI * bobTime) / S.bobPeriod);
      setLine(leftWing, from.leftWing, to.leftWing, local, 0, bob);
      setLine(rightWing, from.rightWing, to.rightWing, local, 0, bob);
      lines.forEach((el, i) => setLine(el, from.pieces[i], to.pieces[i], local, extScale * extensions[i], bob));
    };

    const syncState = () => {
      const next = scrollY > 0 ? "tracking" : "idle";
      if (next === a.state) return;
      a.state = svg.dataset.state = next;
      hoveredDot = null;
      arrowHovered = false;
      applyHover();
    };

    // Walk through pose segments at each segment's own speed.
    const advance = (dt) => {
      if (reduceMotion.matches) { a.current = a.target; return; }
      let remaining = dt;
      while (remaining > 0 && a.current !== a.target) {
        const dir = a.target > a.current ? 1 : -1;
        const seg = dir > 0 ? Math.min(Math.floor(a.current), transitions.length - 1) : Math.max(Math.ceil(a.current) - 1, 0);
        const stop = dir > 0 ? Math.min(a.target, seg + 1) : Math.max(a.target, seg);
        const { duration } = transitions[seg];
        const timeToStop = Math.abs(stop - a.current) * duration;
        if (timeToStop <= remaining) { a.current = stop; remaining -= timeToStop; }
        else { a.current += (remaining / duration) * dir; remaining = 0; }
      }
    };

    const step = (now) => {
      const dt = Math.min((now - a.lastTime) / 1000, 0.1);
      a.lastTime = now;
      advance(dt);
      const settled = advanceExtensions(dt);
      if (!reduceMotion.matches) bobTime += dt;
      applyGeometry(a.current);
      const bobbing = a.current === 0 && !reduceMotion.matches;
      a.rafId = a.current === a.target && settled && !bobbing ? null : requestAnimationFrame(step);
    };
    const kick = () => { if (a.rafId === null) { a.lastTime = performance.now(); a.rafId = requestAnimationFrame(step); } };
    const onScroll = () => { syncState(); a.target = target(); kick(); };

    syncState();
    a.target = target();
    a.current = reduceMotion.matches ? a.target : Math.max(a.target - 1, 0); // entry: play only the last transition
    const f = focusDot();
    for (let i = 0; i < DOTS; i++) extensions[i] = extensionFor(i, f);
    applyGeometry(a.current);
    placeHitAreas();
    kick();

    const ro = new ResizeObserver(() => { poses = getPoses(svg.getBoundingClientRect()); applyGeometry(a.current); placeHitAreas(); });
    ro.observe(svg);

    const listeners = [];
    const on = (el, type, fn) => { el.addEventListener(type, fn); listeners.push([el, type, fn]); };
    hits.forEach((el, i) => {
      on(el, "mouseenter", () => { if (canHover.matches) { hoveredDot = i; applyHover(); } });
      on(el, "mouseleave", () => { if (hoveredDot === i) { hoveredDot = null; applyHover(); } });
    });
    on(arrowHit, "mouseenter", () => { if (canHover.matches) { arrowHovered = true; applyHover(); } });
    on(arrowHit, "mouseleave", () => { arrowHovered = false; applyHover(); });
    addEventListener("scroll", onScroll, { passive: true });

    return () => {
      listeners.forEach(([el, type, fn]) => el.removeEventListener(type, fn));
      removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (a.rafId !== null) cancelAnimationFrame(a.rafId);
    };
  }, [scrollable]);

  if (!scrollable) return null;
  return (
    <svg ref={svgRef} className="scrollbar" data-state="idle" aria-hidden="true">
      <line ref={(el) => { wingRefs.current[0] = el; }} />
      <line ref={(el) => { wingRefs.current[1] = el; }} />
      {Array.from({ length: DOTS }, (_, i) => <line key={i} ref={(el) => { pieceRefs.current[i] = el; }} />)}
      {Array.from({ length: DOTS }, (_, i) => <rect key={i} className="hit-area" ref={(el) => { hitRefs.current[i] = el; }} onClick={() => scrollToDot(i)} />)}
      <rect ref={arrowHitRef} className="arrow-hit" onClick={scrollDown} />
    </svg>
  );
}
