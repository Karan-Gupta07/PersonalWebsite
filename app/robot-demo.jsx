"use client";

import { useEffect, useId, useRef, useState } from "react";
import { warehouse, routeLength, pointOnRoute, warehouseFrame, missionFrame, room, cleanApproaches, cleanRoutes, agentLog } from "./robot-scenes.mjs";

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

const cleanStages = ["plan", "out", "grasp", "back", "done"];
const cleanSpeech = {
  stack: { plan: ["Map built.", "Route planned."], out: ["Following A*."], grasp: ["ACT: reach, grasp,", "lift."], back: ["Heading back."], done: ["Delivered."] },
  fly: { plan: ["No map.", "Just sensing."], out: ["Closer… closer…"], grasp: ["Grasping."], back: ["Finding home."], done: ["Delivered."] },
  agent: { plan: ["Goal: bring the", "blue cube back."], out: ["go_to(pick table)"], grasp: ["manipulate(cube)"], back: ["go_to(dock)"], done: ["finished()"] },
};

export function CleanPreview() {
  const { out } = cleanRoutes("stack");
  return (
    <figure className="robot-demo robot-demo--preview" data-demo="clean">
      <svg className="robot-scene" viewBox="0 0 480 240" role="img" aria-label="Mr. Clean planning a route" shapeRendering="crispEdges">
        <rect width="480" height="240" fill="#111" />
        {room.obstacles.map((item) => <rect key={item.name} x={pixel(item.x) - 9} y={pixel(item.y) - 9} width={item.w * 18} height={item.h * 18} fill="#282828" stroke="#666" />)}
        <polyline points={line(out)} fill="none" stroke="var(--signal)" strokeWidth="2" strokeDasharray="4 4" />
        <Robot point={room.dock} label="MC" active />
      </svg>
      <figcaption className="preview-caption">Mr. Clean · Three ways to fetch a cube<span>Illustration</span></figcaption>
    </figure>
  );
}

export function CleanDemo() {
  const id = useId();
  const [approach, setApproach] = useState("stack");
  const [stage, setStage] = useState("plan");
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const info = cleanApproaches.find((item) => item.id === approach);
  const routes = cleanRoutes(approach);
  const leg = stage === "back" || stage === "done" ? routes.back : routes.out;
  const steps = leg.length - 1;
  const position = stage === "plan" ? room.dock : stage === "grasp" ? room.pickup.stop : stage === "done" ? room.dock : pointOnRoute(leg, progress);
  const travelled = stage === "plan" ? 0 : stage === "out" ? Math.round(progress * steps) : stage === "back" ? routes.out.length - 1 + Math.round(progress * steps) : routes.out.length - 1 + (stage === "done" ? routes.back.length - 1 : 0);
  const trail = (path, amount) => path.slice(0, Math.max(1, Math.floor(amount * (path.length - 1)) + 1)).concat([pointOnRoute(path, amount)]);
  const drawn = approach === "fly"
    ? { out: stage === "plan" ? [] : trail(routes.out, stage === "out" ? progress : 1), back: stage === "back" ? trail(routes.back, progress) : stage === "done" ? routes.back : [] }
    : { out: stage === "back" || stage === "done" ? [] : routes.out, back: stage === "back" || stage === "done" ? routes.back : [] };
  const table = room.obstacles.find((item) => item.name === room.pickup.table);
  const carrying = stage === "back" || stage === "done";
  const index = cleanStages.indexOf(stage);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (stage !== "out" && stage !== "back") return;
    const finish = () => setStage(stage === "out" ? "grasp" : "done");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setProgress(1); finish(); return; }
    let request, start;
    const tick = (now) => {
      start ??= now;
      const value = Math.min(1, (now - start) / (steps * 90));
      setProgress(value);
      if (value < 1) request = requestAnimationFrame(tick);
      else finish();
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [stage, steps]);

  function go(next) { setProgress(0); setStage(next); }
  function choose(next) { setApproach(next); go("plan"); }

  const action = { plan: ["Start", () => go("out")], out: ["Driving…", null], grasp: [`Grasp with ${info.manipulation}`, () => go("back")], back: ["Returning…", null], done: ["Run again", () => go("plan")] }[stage];
  const status = stage === "done" ? `Blue cube delivered · ${travelled} steps travelled` : stage === "grasp" ? `At the pick table · ${info.manipulation} takes over the arm` : `${info.label} · ${travelled} steps travelled`;

  return (
    <section className="interactive-demo" data-demo="clean" aria-label="One robot, three ways to decide">
      <div className="demo-heading"><h2>One robot, three ways to decide</h2><span>Illustrative demo</span></div>
      <div className="scenario-picker" aria-label="Control approach">
        {cleanApproaches.map((item) => <button key={item.id} disabled={!ready} aria-pressed={approach === item.id} onClick={() => choose(item.id)}>{item.label}</button>)}
      </div>
      <svg className="robot-scene" viewBox="0 0 480 240" role="img" aria-label={`Room map. Task: bring back the blue cube. ${status}`} shapeRendering="crispEdges">
        <defs><pattern id={`${id}-grid`} width="18" height="18" x="6" y="6" patternUnits="userSpaceOnUse"><path d="M0 1h1" stroke="#292929" /></pattern></defs>
        <rect width="480" height="240" fill="#111" />
        <rect x="15" y="15" width="432" height="216" fill={`url(#${id}-grid)`} stroke="#333" />
        {room.obstacles.map((item) => (
          <g key={item.name}>
            {approach !== "fly" && <rect x={pixel(item.x - 1) - 9} y={pixel(item.y - 1) - 9} width={(item.w + 2) * 18} height={(item.h + 2) * 18} fill="none" stroke="#444" strokeDasharray="3 3" />}
            <rect x={pixel(item.x) - 9} y={pixel(item.y) - 9} width={item.w * 18} height={item.h * 18} fill={item === table ? "#3a3a3a" : "#282828"} stroke={item === table ? "#bbb" : "#666"} />
            <text x={pixel(item.x) - 9} y={pixel(item.y + item.h) + 2} className="scene-label">{item.name}</text>
          </g>
        ))}
        {!carrying && stage !== "grasp" && <rect x={pixel(table.x + 1) - 5} y={pixel(table.y + 1) - 5} width="10" height="10" fill="#4f7bd9" />}
        {drawn.out.length > 1 && <polyline points={line(drawn.out)} fill="none" stroke={approach === "fly" ? "#b1b1b1" : "var(--signal)"} strokeWidth="2" strokeDasharray={approach === "fly" ? undefined : "4 4"} />}
        {drawn.back.length > 1 && <polyline points={line(drawn.back)} fill="none" stroke="var(--signal)" strokeWidth="2" strokeDasharray={approach === "fly" ? undefined : "4 4"} />}
        <rect x={pixel(room.dock[0]) - 10} y={pixel(room.dock[1]) - 10} width="20" height="20" fill="none" stroke="#858585" strokeDasharray="3 3" />
        <text x={pixel(room.dock[0]) + 14} y={pixel(room.dock[1]) + 4} className="scene-label">DOCK</text>
        <Robot point={position} label="MC" active={stage !== "plan"} />
        {(carrying || stage === "grasp") && <rect x={pixel(position[0]) - 5} y={pixel(position[1]) - 20} width="10" height="10" fill="#4f7bd9" />}
        <Bubble point={position} lines={cleanSpeech[approach][stage]} />
      </svg>
      <div className="story-readout">
        <h3>{info.label}</h3>
        <p>{info.summary}</p>
      </div>
      {approach === "agent" && (
        <ol className="agent-log" aria-label="Agent tool calls">
          {agentLog.filter(([at]) => cleanStages.indexOf(at) <= index).map(([, call]) => <li key={call}><code>{call}</code></li>)}
          {index === 0 && <li className="demo-note">Waiting for a goal: “bring the blue cube back to the dock.”</li>}
        </ol>
      )}
      <div className="demo-controls">
        <button className="demo-primary" disabled={!ready || !action[1]} onClick={action[1] ?? undefined}>{action[0]}</button>
        {stage !== "plan" && <button className="demo-secondary" disabled={!ready} onClick={() => go("plan")}>Reset</button>}
      </div>
      <p className="demo-status" role="status">{status}</p>
      <p className="demo-note">Same robot, same room, same task. The routes here are computed in your browser for illustration; the real controllers run in MuJoCo, and the fly-brain trail is a stand-in for its reactive behaviour.</p>
    </section>
  );
}
