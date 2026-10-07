"use client";

import { useEffect, useId, useRef, useState } from "react";
import { warehouse, routeLength, pointOnRoute, warehouseFrame, missionFrame } from "./robot-scenes.mjs";

const pixel = (value) => Math.round((24 + value * 18) / 2) * 2;
const line = (route) => route.map(([x, y]) => `${pixel(x)},${pixel(y)}`).join(" ");
const sprite = ["000030000", "011111110", "112222211", "122020221", "122222221", "112222211", "101111101", "110000011"];

function Robot({ point, label, active = false }) {
  return (
    <g transform={`translate(${pixel(point[0]) - 9} ${pixel(point[1]) - 8})`} data-robot={label}>
      {sprite.flatMap((row, y) => [...row].map((part, x) => part !== "0" && (
        <rect key={`${x}-${y}`} x={x * 2} y={y * 2} width="2" height="2" fill={part === "1" ? "#858585" : part === "3" && active ? "var(--signal)" : "#ededed"} />
      )))}
      <text x="9" y="27" textAnchor="middle" className="scene-label">{label}</text>
    </g>
  );
}

function Bubble({ point, lines }) {
  if (!lines.length) return null;
  const height = lines.length * 14 + 12;
  const x = Math.max(8, Math.min(326, pixel(point[0]) - 48));
  const y = Math.max(6, pixel(point[1]) - height - 16);
  return (
    <g transform={`translate(${x} ${y})`} className="robot-bubble">
      <path d={`M0 0h146v${height}H54v6h-6v-6H0Z`} />
      <text x="8" y="16">{lines.map((text, i) => <tspan key={text} x="8" dy={i ? 14 : 0}>{text}</tspan>)}</text>
    </g>
  );
}

function WarehouseScene({ frame, optimized }) {
  return (
    <>
      {warehouse.shelves.map((shelf) => (
        <g key={`${shelf.x}-${shelf.y}`}>
          <rect x={pixel(shelf.x) - 8} y={pixel(shelf.y) - 8} width="52" height="52" fill="#282828" stroke="#666" />
          {[10, 28].map((offset) => <path key={offset} d={`M${pixel(shelf.x) - 8} ${pixel(shelf.y) + offset}h52`} stroke="#666" />)}
        </g>
      ))}
      {optimized && <polyline points={line(warehouse.routes.original)} fill="none" stroke="#555" strokeWidth="1" strokeDasharray="2 5" />}
      <polyline points={line(frame.route)} fill="none" stroke={optimized ? "var(--signal)" : "#b1b1b1"} strokeWidth="2" strokeDasharray={optimized ? undefined : "4 4"} />
      {warehouse.picks.map(({ id, point }) => (
        <g key={id} transform={`translate(${pixel(point[0])} ${pixel(point[1])})`}>
          <rect x="-5" y="-5" width="10" height="10" fill={frame.collected.includes(id) ? "var(--signal)" : "#171717"} stroke="#ededed" />
          <text y="-13" textAnchor="middle" className="scene-label">{id}</text>
        </g>
      ))}
      <rect x={pixel(warehouse.depot[0]) - 10} y={pixel(warehouse.depot[1]) - 10} width="20" height="20" fill="none" stroke="#858585" strokeDasharray="3 3" />
      <text x="25" y="235" className="scene-label">DEPOT</text>
      <Robot point={frame.position} label="R1" active={optimized} />
    </>
  );
}

function MissionScene({ frame, progress }) {
  const [vesselX, vesselY] = frame.vessel.map(pixel);
  const assigned = ["assigned", "investigating", "confirmed"].includes(frame.phase);
  const packet = pointOnRoute([frame.scout, frame.responder], (progress - .28) / .16);
  return (
    <>
      <g stroke="#303030" fill="none">
        {Array.from({ length: 28 }, (_, i) => <path key={i} d={`M${32 + (i % 7) * 66} ${34 + Math.floor(i / 7) * 52}h8v2h8`} />)}
      </g>
      <g transform={`translate(${vesselX} ${vesselY})`}>
        <path d="M-22-6h5v-4h34v4h6v3h4v6h-4v3h-6v4h-34v-4h-5Z" fill="#626262" />
        <rect x="-12" y="-7" width="15" height="14" fill="#c9c9c9" />
        <rect x="-5" y="-17" width="3" height="10" fill="#ededed" />
        <path d="M6-6h9v12H6Z" fill="#9c9c9c" />
        <text y="29" textAnchor="middle" className="scene-label">VESSEL</text>
      </g>
      {frame.phase !== "searching" && (
        <>
          <polyline points={line([frame.scout, frame.vessel])} fill="none" stroke="var(--signal)" strokeDasharray="3 4" />
          <rect x={vesselX - 31} y={vesselY - 24} width="62" height="45" fill="none" stroke="var(--signal)" strokeDasharray="4 4" />
        </>
      )}
      {["detected", "assigned"].includes(frame.phase) && (
        <>
          <polyline points={line([frame.scout, frame.responder])} fill="none" stroke="#888" strokeDasharray="2 5" />
          <rect x={pixel(packet[0]) - 3} y={pixel(packet[1]) - 3} width="6" height="6" fill="#ededed" />
        </>
      )}
      {assigned && <polyline points={line([frame.responder, [19, 6]])} fill="none" stroke="#aaa" strokeDasharray="3 4" />}
      <Robot point={frame.scout} label="A" active={frame.phase !== "searching"} />
      <Robot point={frame.responder} label="B" active={assigned} />
      <Bubble point={frame.scout} lines={frame.scoutMessage} />
      <Bubble point={frame.responder} lines={frame.responderMessage} />
    </>
  );
}

export default function RobotDemo({ kind, preview = false }) {
  const id = useId();
  const container = useRef(null);
  const elapsed = useRef(0);
  const [progress, setProgress] = useState(0);
  const [optimized, setOptimized] = useState(preview && kind === "warehouse");
  const [playing, setPlaying] = useState(preview);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const isWarehouse = kind === "warehouse";
  const frame = isWarehouse ? warehouseFrame(progress, optimized) : missionFrame(progress);
  const duration = preview ? 4200 : isWarehouse ? frame.distance * 160 : 10000;
  const state = isWarehouse ? optimized ? "optimized" : "original" : frame.phase;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changeMotion = () => {
      setReduced(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    const changeVisibility = () => setTabVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(container.current);
    changeMotion();
    changeVisibility();
    setReady(true);
    preference.addEventListener("change", changeMotion);
    document.addEventListener("visibilitychange", changeVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", changeMotion);
      document.removeEventListener("visibilitychange", changeVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || reduced || !inView || !tabVisible) return;
    let request;
    let previous;
    let sampled = 0;
    const tick = (now) => {
      if (previous !== undefined) elapsed.current = Math.min(duration, elapsed.current + Math.min(now - previous, 100));
      previous = now;
      if (now - sampled >= 80 || elapsed.current === duration) {
        setProgress(elapsed.current / duration);
        sampled = now;
      }
      if (elapsed.current < duration) request = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [playing, reduced, inView, tabVisible, duration, optimized]);

  function reset(run = false) {
    elapsed.current = 0;
    setProgress(0);
    setPlaying(run && !reduced);
  }

  function play() {
    if (reduced) {
      const steps = isWarehouse ? [0, .25, .5, .75, 1] : [0, .35, .48, .72, 1];
      const next = steps.find((value) => value > progress + .001) ?? 0;
      elapsed.current = next * duration;
      setProgress(next);
      return;
    }
    if (progress >= 1) reset(true);
    else setPlaying(!playing);
  }

  function optimize() {
    setOptimized(!optimized);
    reset(true);
  }

  const title = isWarehouse ? "A shorter way through the warehouse" : "Two robots, one shared target";
  const previewLabels = { searching: "Searching", detected: "Vessel spotted", assigned: "Scout B, investigate", investigating: "Converging on the vessel", confirmed: "Vessel confirmed" };
  const status = isWarehouse
    ? `${optimized ? "Optimized" : "Original"} route · ${frame.distance} grid steps · ${frame.collected.length}/3 items picked`
    : frame.label;

  return (
    <figure ref={container} className={`robot-demo${preview ? " robot-demo--preview" : ""}`} data-robot-demo={kind} data-state={state} data-playing={playing && !reduced && inView && tabVisible}>
      {!preview && <div className="demo-heading"><h2 id={`${id}-heading`}>{title}</h2><span>Illustrative demo</span></div>}
      <svg className="robot-scene" viewBox="0 0 480 240" role="img" aria-label={`${title}. ${status}`} shapeRendering="crispEdges">
        <defs><pattern id={`${id}-grid`} width="18" height="18" x="6" y="6" patternUnits="userSpaceOnUse"><path d="M0 1h1" stroke="#292929" /></pattern></defs>
        <rect width="480" height="240" fill="#111" />
        {isWarehouse && <rect x="12" y="12" width="456" height="216" fill={`url(#${id}-grid)`} />}
        {isWarehouse ? <WarehouseScene frame={frame} optimized={optimized} /> : <MissionScene frame={frame} progress={progress} />}
      </svg>
      <figcaption>
        {preview ? (
          <p className="preview-caption">{isWarehouse ? "Amazon · Optimized pick route" : `DominIQ · ${previewLabels[state]}`}<span>Illustration</span></p>
        ) : (
          <>
            <div className="demo-controls">
              {isWarehouse && <button className="demo-primary" onClick={optimize} disabled={!ready}>{optimized ? "Show original route" : "Optimize route"}</button>}
              <button className={isWarehouse ? "demo-secondary" : "demo-primary"} onClick={play} disabled={!ready}>
                {reduced ? "Next step" : playing ? "Pause" : progress >= 1 ? "Replay" : isWarehouse ? "Run route" : "Run mission"}
              </button>
              {!isWarehouse && <button className="demo-secondary" onClick={() => reset()} disabled={!ready}>Reset</button>}
            </div>
            <p className="demo-status" role="status">{status}</p>
            <p className="demo-note">{isWarehouse ? `Illustrative routes: ${routeLength(warehouse.routes.original)} to ${routeLength(warehouse.routes.optimized)} grid steps. Not Amazon’s production system or a performance benchmark.` : "An illustrative coordination sequence, not a recording of DominIQ."}</p>
            <noscript><p className="demo-note">This is a static illustration. Enable JavaScript to run the demo.</p></noscript>
          </>
        )}
      </figcaption>
    </figure>
  );
}
