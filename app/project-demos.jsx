"use client";

import { useEffect, useId, useState } from "react";
import { stories, fitProfile, roomSamples, roomFlags, faceReadout, EYES_OPEN, pipelineSamples, pipelineFlags, matchApplicants, guardrailCases, checkAgentTrace, longVideo, sampleFrames, directorCue, nightStep, swing, NIGHT_SECONDS, actionShare, topClips, timestamp } from "./demo-data.mjs";

function DemoFrame({ title, name, note, children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <section className="interactive-demo" data-demo={name} aria-label={title}>
      <div className="demo-heading"><h2>{title}</h2><span>Illustrative demo</span></div>
      <fieldset className="demo-body" disabled={!ready}>
        <legend className="sr-only">{title} controls</legend>
        {children}
      </fieldset>
      <p className="demo-note">{note}</p>
      <noscript><p className="demo-note">The example is visible without JavaScript; interactive controls require it.</p></noscript>
    </section>
  );
}

function Person({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} shapeRendering="crispEdges">
      <path d="M-12-56h24v8h4v20h-4v8h-24v-8h-4v-20h4Z" fill="#bdbdbd" />
      <path d="M-12-56h24v8H-4v4h-12v-8h4Z" fill="#666" />
      <path d="M-8-38h4v4h-4zm16 0h4v4H8Z" fill="#171717" />
      <path d="M-16-20h32v8h8v44h-8V4h-4v36h-24V4h-4v28h-8v-44h8Z" fill="#ededed" />
      <path d="M-12 40h24v34H4V48h-8v26h-8Z" fill="#828282" />
      <path d="M-16 74h12v6h-12zm20 0h12v6H4Z" fill="#c7c7c7" />
    </g>
  );
}

function StoryScene({ kind, step, profile }) {
  const repair = kind === "repair";
  const scale = profile.height / 188;
  const shoulderY = 145 - 20 * scale;
  const waistY = 145 + 35 * scale;
  const speech = stories[kind].steps[step].speech;
  return (
    <svg className="robot-scene" viewBox="0 0 480 260" role="img" aria-label={`${stories[kind].steps[step].title}. ${speech.join(" ")}`} shapeRendering="crispEdges">
      <rect width="480" height="260" fill="#111" />
      <path d="M20 230h440" stroke="#555" />
      <path d="M20 16h268v46H82v7h-7v-7H20Z" fill="#1b1b1b" stroke="#888" />
      <text x="32" y="35" className="story-speech">{speech.map((line, i) => <tspan key={line} x="32" dy={i ? 16 : 0}>{line}</tspan>)}</text>
      <Person x={88} y={146} />
      {repair ? (
        <g>
          <path d="M286 100h50v68h-8v12h-58v-12h16Z" fill="#888" />
          <path d="M278 164h72v12h-72zm30 12h8v30h-8zm-36 30h80v6h-80Z" fill="#c9c9c9" />
          <path d={step >= 3 ? "M269 210h14v14h-14zm70 0h14v14h-14Z" : "M269 210h14v14h-14zm99 2h14v14h-14Z"} fill="#ddd" />
          {step > 0 && <path d="M331 199h31v31h-31Z" fill="none" stroke="var(--signal)" strokeDasharray="4 4" />}
          {step === 2 && <g><path d="M386 116h44v58h-44Z" fill="#222" stroke="#888" /><path d="M395 129h26m-26 12h26m-26 12h18" stroke="#ccc" /></g>}
          <text x="282" y="93" className="scene-label">{step === 0 ? "BROKEN CHAIR" : step >= 3 ? "REPLACEMENT FOUND" : "DAMAGED CASTER"}</text>
        </g>
      ) : (
        <g>
          <Person x={330} y={145} scale={scale} />
          {step > 0 && <g stroke="var(--signal)" fill="none"><path d={`M276 ${shoulderY}h104M276 145h104M276 ${waistY}h104M276 ${shoulderY - 4}V${waistY + 4}m104 0V${shoulderY - 4}`} strokeDasharray="3 4" /><rect x={330 - 16 * scale - 3} y={shoulderY - 3} width="6" height="6" /><rect x={330 + 16 * scale - 3} y={shoulderY - 3} width="6" height="6" /></g>}
          {step >= 3 && <g transform={`translate(330 145) scale(${scale})`}><path d="M-18-20h12l6 6 6-6h12l8 8v40h-10v12h-32v-12h-10v-40Z" fill="#707070" stroke="#eee" /><path d="M16-8v36M-16-8v36" stroke="#555" /></g>}
          <text x="294" y="246" className="scene-label">{step >= 3 ? "CUSTOM FIT PREVIEW" : "EXAMPLE SILHOUETTE"}</text>
        </g>
      )}
    </svg>
  );
}

export function StoryDemo({ kind, preview = false }) {
  const [step, setStep] = useState(0);
  const story = stories[kind];
  const profile = fitProfile;
  useEffect(() => {
    if (!preview) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = preference.matches ? [] : [1, 2, 3].map((stage) => setTimeout(() => setStep(stage), stage * 1000));
    const stop = () => timers.forEach(clearTimeout);
    preference.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    return () => { stop(); preference.removeEventListener("change", stop); document.removeEventListener("visibilitychange", stop); };
  }, [preview]);
  const scene = <StoryScene kind={kind} step={step} profile={profile} />;
  if (preview) return <figure className="robot-demo robot-demo--preview" data-demo={kind}>{scene}<figcaption className="preview-caption">{kind === "repair" ? "Reparo" : "TailorAI"} · {story.steps[step].title}</figcaption></figure>;
  return (
    <DemoFrame title={story.title} name={kind} note={kind === "repair" ? "Scripted example: no photo analysis, live inventory, or checkout runs on this page." : "Synthetic silhouettes and fixed example measurements. No image is uploaded or processed."}>
      {scene}
      <div className="story-readout" role="status" data-step={step}>
        <span className="demo-note">Step {step + 1} of {story.steps.length}</span>
        <h3>{story.steps[step].title}</h3><p>{story.steps[step].text}</p>
      </div>
      {kind === "repair" && step === 3 && <div className="example-part"><span className="demo-note">Example listing</span><strong>Replacement chair caster</strong><p>Check the manufacturer’s attachment dimensions before choosing a replacement.</p><span className="demo-note">Live Reparo sources parts through Shopify + SerpAPI.</span></div>}
      {kind === "tailor" && step >= 2 && <dl className="demo-measurements">{["height", "chest", "shoulder", "sleeve"].map((key) => <div key={key}><dt>{key[0].toUpperCase() + key.slice(1)}</dt><dd>{profile[key]} cm</dd></div>)}</dl>}
      <div className="demo-controls"><button className="demo-primary" onClick={() => setStep((step + 1) % story.steps.length)}>{story.steps[step].action}</button><button className="demo-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</button></div>
    </DemoFrame>
  );
}

function TelemetryChart({ sample }) {
  const maximum = 200;
  const threshold = 150;
  return (
    <svg className="robot-scene telemetry-chart" viewBox="0 0 480 200" role="img" aria-label={`Queue depth, synthetic sample: ${sample.label}`} shapeRendering="crispEdges">
      <rect width="480" height="200" fill="#111" />
      {[40, 80, 120, 160].map((y) => <path key={y} d={`M32 ${y}h424`} stroke="#303030" />)}
      <path d={`M32 ${164 - threshold / maximum * 136}h424`} stroke="var(--signal)" strokeDasharray="4 4" />
      {sample.trace.map((value, i) => <rect key={i} x={42 + i * 34} y={164 - value / maximum * 136} width="18" height={value / maximum * 136} fill={value >= threshold ? "var(--signal)" : "#aaa"} />)}
      {!sample.trace.length && <text x="240" y="105" textAnchor="middle" className="scene-label">NO RECENT SIGNAL</text>}
      <text x="32" y="188" className="scene-label">QUEUE DEPTH</text>
      <text x="456" y="188" textAnchor="end" className="scene-label">EXAMPLE THRESHOLD: {threshold}</text>
    </svg>
  );
}

export function MonitoringDemo({ preview = false }) {
  const [selected, setSelected] = useState(preview ? 1 : 0);
  const sample = pipelineSamples[selected];
  const flags = pipelineFlags(sample);
  const chart = <TelemetryChart sample={sample} />;
  if (preview) return <figure className="robot-demo robot-demo--preview" data-demo="pipeline">{chart}<figcaption className="preview-caption">Manulife · Early-warning example</figcaption></figure>;
  const metrics = [["Queued jobs", sample.queue], ["Memory", sample.memory === null ? null : `${sample.memory}%`], ["Data age", `${sample.age}s`]];
  return (
    <DemoFrame title="Catch the warning before the failure" name="pipeline" note="Synthetic telemetry and demonstration thresholds. No live company systems are connected.">
      <div className="scenario-picker" aria-label="Example scenario">{pipelineSamples.map((item, i) => <button key={item.label} aria-pressed={selected === i} onClick={() => setSelected(i)}>{item.label}</button>)}</div>
      {chart}
      <dl className="demo-measurements">{metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value ?? "Unavailable"}</dd></div>)}</dl>
      <FlagResult flags={flags} />
    </DemoFrame>
  );
}

function FlagResult({ flags }) {
  return (
    <div className={`monitor-result ${flags.length ? "flagged" : ""}`} role="status">
      <h3>{flags.length ? "Review flagged signals" : "No example thresholds crossed"}</h3>
      {flags.length ? <ul>{flags.map((flag) => <li key={flag}>{flag}</li>)}</ul> : <p>The example readings are within the demo’s configured limits.</p>}
    </div>
  );
}

// A pixel face; `face` values run 0–1. Landmarks are drawn where a face-landmark model would place them.
function PatientFace({ face }) {
  const lid = 2 + face.eye * 10;
  const furrow = face.brow > 0;
  const grimace = face.mouth > 0;
  const landmarks = [
    [93, 84], [117, furrow ? 88 : 84], [143, furrow ? 88 : 84], [167, 84],
    [93, 105], [117, 105], [143, 105], [167, 105], [105, 105 - lid / 2], [105, 105 + lid / 2], [155, 105 - lid / 2], [155, 105 + lid / 2],
    [130, 132],
    ...(grimace ? [[104, 156], [156, 156], [130, 148], [130, 158]] : [[112, 154], [148, 154], [130, 152], [130, 156]]),
    [78, 170], [130, 198], [182, 170],
  ];
  return (
    <g>
      <path d="M86 40h88v8h8v8h8v120h-8v8h-8v8H86v-8h-8v-8h-8V56h8v-8h8Z" fill={face.pallor ? "#c8c8bc" : "#9a9a9a"} />
      <path d="M86 40h88v8h8v16H78V48h8Z" fill="#555" />
      {face.eye < .05
        ? <path d="M93 104h24v2H93Zm50 0h24v2h-24Z" fill="#171717" />
        : <g><rect x="93" y={105 - lid / 2} width="24" height={lid} fill="#eee" /><rect x="143" y={105 - lid / 2} width="24" height={lid} fill="#eee" /><rect x="102" y={105 - Math.min(lid, 6) / 2} width="6" height={Math.min(lid, 6)} fill="#171717" /><rect x="152" y={105 - Math.min(lid, 6) / 2} width="6" height={Math.min(lid, 6)} fill="#171717" /></g>}
      <path d={furrow ? "M93 82h8v2h8v2h8v4h-8v-2h-8v-2h-8Zm50 4h8v-2h8v-2h8v4h-8v2h-8v2h-8Z" : "M93 82h24v4H93Zm50 0h24v4h-24Z"} fill="#444" />
      <rect x="127" y="112" width="6" height="20" fill={face.pallor ? "#b0b0a4" : "#828282"} />
      {grimace
        ? <g><rect x="106" y="148" width="48" height="10" fill="#333" /><rect x="110" y="150" width="40" height="4" fill="#ddd" /><rect x="102" y="156" width="4" height="4" fill="#333" /><rect x="154" y="156" width="4" height="4" fill="#333" /></g>
        : <rect x="112" y="152" width="36" height="4" fill="#444" />}
      {face.pallor > 0 && <path d="M184 92h4v8h-4Zm-112 28h4v8h-4Z" fill="#bcd4f2" />}
      <rect x="62" y="34" width="136" height="172" fill="none" stroke="var(--signal)" strokeDasharray="4 4" />
      {landmarks.map(([x, y], i) => <rect key={i} x={x - 2} y={y - 2} width="4" height="4" fill="var(--signal)" />)}
    </g>
  );
}

export function WardDemo({ preview = false }) {
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (!preview || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers = [1, 2].map((i) => setTimeout(() => setSelected(i), i * 1400));
    return () => timers.forEach(clearTimeout);
  }, [preview]);
  const sample = roomSamples[selected];
  const face = faceReadout(sample);
  const flags = roomFlags(sample);
  const metrics = [["Eyes", face?.eyes], ["Blinks in window", face?.blinks], ["Expression", face?.expression], ["Room light", sample.light === null ? null : `${sample.light} lx`], ["Room noise", sample.noise === null ? null : `${sample.noise} dB`]];
  const scene = (
      <svg className="robot-scene" viewBox="0 0 480 240" role="img" aria-label={face ? `Synthetic patient face with landmarks. Eyes: ${face.eyes}. Expression: ${face.expression}.` : "Camera offline"} shapeRendering="crispEdges">
        <rect width="480" height="240" fill="#111" />
        {face ? <PatientFace face={sample.face} /> : <text x="130" y="124" textAnchor="middle" className="scene-label">NO CAMERA SIGNAL</text>}
        <text x="62" y="224" className="scene-label">{face ? "FACE + LANDMARKS" : ""}</text>
        <path d="M236 30v180" stroke="#303030" />
        <text x="258" y="30" className="scene-label">EYE OPENNESS</text>
        <path d={`M258 ${190 - EYES_OPEN / .4 * 140}h198`} stroke="var(--signal)" strokeDasharray="4 4" />
        {sample.openness.map((value, i) => <rect key={i} x={262 + i * 16} y={190 - value / .4 * 140} width="10" height={value / .4 * 140} fill={value >= EYES_OPEN ? "#ddd" : "#666"} />)}
        <path d="M258 190h198" stroke="#555" />
        <text x="258" y="206" className="scene-label">LAST 12 FRAMES</text>
        <text x="456" y="206" textAnchor="end" className="scene-label">OPEN ≥ {EYES_OPEN}</text>
      </svg>
  );
  if (preview) return <figure className="robot-demo robot-demo--preview" data-demo="ward">{scene}<figcaption className="preview-caption">DeliriumWatch · {sample.label}<span>Illustration</span></figcaption></figure>;
  return (
    <DemoFrame title="Read the face, and the room" name="ward" note="A synthetic face with example landmarks, sensor readings and thresholds. No camera is used. Flags prompt a staff check-in; they are not a diagnosis or a delirium probability.">
      <div className="scenario-picker" aria-label="Example scenario">{roomSamples.map((item, i) => <button key={item.label} aria-pressed={selected === i} onClick={() => setSelected(i)}>{item.label}</button>)}</div>
      {scene}
      <dl className="demo-measurements">{metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value ?? "Unavailable"}</dd></div>)}</dl>
      <FlagResult flags={flags} />
    </DemoFrame>
  );
}

export function AdmissionsDemo() {
  const id = useId();
  const [gpa, setGpa] = useState("3.60");
  const [sat, setSat] = useState("1450");
  const [interest, setInterest] = useState("Engineering");
  const matches = matchApplicants(gpa, sat, interest);
  return (
    <DemoFrame title="Try a profile match" name="admissions" note="Synthetic applicant profiles, not admissions outcomes or acceptance odds. This local example uses GPA (50%), SAT (35%), and interest (15%); nothing is sent or saved.">
      <div className="admissions-fields">
        <label htmlFor={`${id}-gpa`}>GPA (0–4)<input id={`${id}-gpa`} type="number" min="0" max="4" step=".01" value={gpa} onChange={(event) => setGpa(event.target.value)} /></label>
        <label htmlFor={`${id}-sat`}>SAT (400–1600)<input id={`${id}-sat`} type="number" min="400" max="1600" step="10" value={sat} onChange={(event) => setSat(event.target.value)} /></label>
        <label htmlFor={`${id}-interest`}>Interest<select id={`${id}-interest`} value={interest} onChange={(event) => setInterest(event.target.value)}>{["Engineering", "Computer science", "Arts"].map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="match-results" aria-live="polite">
        {matches.length ? matches.slice(0, 3).map((profile) => <div className="match-row" key={profile.name}><div><strong>{profile.name}</strong><p>{profile.gpa.toFixed(2)} GPA · {profile.sat} SAT · {profile.interest}</p></div><div className="match-score"><strong>{profile.similarity}%</strong><span>similarity</span></div></div>) : <p className="demo-validation">Enter a GPA from 0 to 4 and an SAT score from 400 to 1600.</p>}
      </div>
      <div className="demo-controls"><button className="demo-secondary" onClick={() => { setGpa("3.60"); setSat("1450"); setInterest("Engineering"); }}>Reset example</button></div>
    </DemoFrame>
  );
}

export function GuardrailDemo({ preview = false }) {
  const [selected, setSelected] = useState(preview ? 1 : 0);
  const [checked, setChecked] = useState(preview);
  const sample = guardrailCases[selected];
  const result = checkAgentTrace(sample);
  if (preview) return <div className="guardrail-preview" data-demo="guardrail"><span>Example policy</span><strong>30 days</strong><span>Agent claim</span><strong className="unsupported">90 days</strong><p>Unsupported claim blocked.</p></div>;
  return (
    <DemoFrame title="An answer needs evidence" name="guardrail" note="A deterministic example of evidence and permission checks, not a live LLM or a general hallucination detector. Tool actions are simulated; no email is sent.">
      <div className="scenario-picker" aria-label="Agent scenario">{guardrailCases.map((item, i) => <button key={item.label} aria-pressed={selected === i} onClick={() => { setSelected(i); setChecked(false); }}>{item.label}</button>)}</div>
      <div className="evidence-record"><h3>Retrieved evidence</h3><p>{sample.evidence}</p><h3>Agent response / action</h3><p className={checked && !result.passed ? "unsupported" : ""}>{sample.response}</p></div>
      <div className="demo-controls"><button className="demo-primary" onClick={() => setChecked(true)}>Validate against evidence</button></div>
      <div className={`monitor-result ${checked && !result.passed ? "flagged" : ""}`} role="status"><h3>{!checked ? "Ready to validate" : result.passed ? "Supported by the evidence" : "Blocked: unsupported or unapproved"}</h3><p>{checked ? result.reason : "Check the proposed answer or action against its source before accepting it."}</p></div>
    </DemoFrame>
  );
}

export function ClipDemo({ preview = false }) {
  const [adaptive, setAdaptive] = useState(false);
  const [found, setFound] = useState(false);
  useEffect(() => {
    if (!preview) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setAdaptive(true); setFound(true); return; }
    const timers = [setTimeout(() => setAdaptive(true), 1200), setTimeout(() => setFound(true), 2600)];
    return () => timers.forEach(clearTimeout);
  }, [preview]);
  const { motion, segmentMinutes } = longVideo;
  const frames = sampleFrames(motion, 72, adaptive);
  const clips = topClips(motion);
  const width = 424 / motion.length;
  const timeline = (
      <svg className="robot-scene" viewBox="0 0 480 220" role="img" aria-label={`Three-hour timeline. ${adaptive ? "Motion-adaptive" : "Uniform"} sampling puts ${actionShare(frames, motion)}% of frames on high-motion footage.`} shapeRendering="crispEdges">
        <rect width="480" height="220" fill="#111" />
        <text x="28" y="22" className="scene-label">MOTION</text>
        <text x="28" y="134" className="scene-label">FRAMES ANALYZED</text>
        {motion.map((value, i) => {
          const x = 28 + i * width;
          const clip = found && clips.includes(i);
          return (
            <g key={i}>
              <rect x={x + 1} y={110 - value * .8} width={width - 3} height={value * .8} fill={clip ? "var(--signal)" : value >= 50 ? "#bbb" : "#555"} />
              {Array.from({ length: frames[i] }, (_, n) => <rect key={n} x={x + 1} y={176 - n * 9} width={width - 3} height="6" fill="#ededed" />)}
              {clip && <rect x={x - 1} y="28" width={width + 1} height="160" fill="none" stroke="var(--signal)" strokeDasharray="3 3" />}
            </g>
          );
        })}
        <path d="M28 188h424" stroke="#555" />
        {[0, 60, 120, 180].map((minute) => <text key={minute} x={28 + minute / segmentMinutes * width} y="204" textAnchor={minute ? minute === 180 ? "end" : "middle" : "start"} className="scene-label">{timestamp(minute)}</text>)}
      </svg>
  );
  if (preview) return <figure className="robot-demo robot-demo--preview" data-demo="clips">{timeline}<figcaption className="preview-caption">Overlap · {found ? "Clips found" : adaptive ? "Frames follow the action" : "Frames spread evenly"}<span>Illustration</span></figcaption></figure>;
  return (
    <DemoFrame title="Find the moments worth clipping" name="clips" note="A simplified illustration with example motion scores and a fixed frame budget. Nothing is uploaded, and no video or model runs on this page.">
      <div className="scenario-picker" aria-label="Frame sampling">
        <button aria-pressed={!adaptive} onClick={() => { setAdaptive(false); setFound(false); }}>Uniform sampling</button>
        <button aria-pressed={adaptive} onClick={() => { setAdaptive(true); setFound(false); }}>Motion-adaptive</button>
      </div>
      {timeline}
      <dl className="demo-measurements">
        <div><dt>Frames on high motion</dt><dd>{actionShare(frames, motion)}%</dd></div>
        <div><dt>Frames on static footage</dt><dd>{100 - actionShare(frames, motion)}%</dd></div>
      </dl>
      <div className="demo-controls"><button className="demo-primary" onClick={() => setFound(!found)}>{found ? "Hide clips" : "Find clips"}</button></div>
      <div className="monitor-result" role="status">
        {found ? <><h3>Three candidate clips</h3><ul>{clips.map((i) => <li key={i}>{timestamp(i * segmentMinutes)}–{timestamp((i + 1) * segmentMinutes)}</li>)}</ul></> : <><h3>{adaptive ? "Frames follow the action" : "Frames spread evenly"}</h3><p>{adaptive ? "Same budget, but quiet stretches get one frame and busy scenes get more." : "Every five minutes gets the same frames, whether anything happens or not."}</p></>}
      </div>
    </DemoFrame>
  );
}

export function VideoEmbed({ id, title }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="video-embed">
      <div className="demo-controls">
        <button className="demo-secondary" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Hide video" : "Watch the demo video"}</button>
        <a className="music-external" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer">Open on YouTube</a>
      </div>
      {open && <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={`${title} demo video`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" loading="lazy" />}
    </div>
  );
}

export function AdmissionsPreview() {
  const [gpa, setGpa] = useState(3.4);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setGpa((value) => value >= 3.9 ? 3.9 : Math.round((value + .05) * 100) / 100), 300);
    return () => clearInterval(timer);
  }, []);
  const matches = matchApplicants(gpa, 1450, "Engineering").slice(0, 3);
  return (
    <figure className="robot-demo robot-demo--preview" data-demo="admissions">
      <svg className="robot-scene" viewBox="0 0 480 240" role="img" aria-label="Profile similarity example" shapeRendering="crispEdges">
        <rect width="480" height="240" fill="#111" />
        <text x="32" y="36" className="scene-label">YOUR GPA {gpa.toFixed(2)} · SAT 1450 · ENGINEERING</text>
        {matches.map((item, i) => (
          <g key={item.name} transform={`translate(32 ${70 + i * 52})`}>
            <text y="-6" className="scene-label">{item.name.toUpperCase()} · {item.gpa.toFixed(2)} GPA</text>
            <rect width="360" height="18" fill="#222" />
            <rect width={3.6 * item.similarity} height="18" fill={i ? "#aaa" : "var(--signal)"} />
            <text x="416" y="13" textAnchor="end" className="scene-label">{item.similarity}%</text>
          </g>
        ))}
      </svg>
      <figcaption className="preview-caption">AI Admissions · Closest profiles<span>Illustration</span></figcaption>
    </figure>
  );
}

export function MusicPreview() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setTick((value) => value + 1), 160);
    return () => clearInterval(timer);
  }, []);
  return (
    <figure className="robot-demo robot-demo--preview" data-demo="music">
      <svg className="robot-scene" viewBox="0 0 480 240" role="img" aria-label="Raspberry Pi Spotify player" shapeRendering="crispEdges">
        <rect width="480" height="240" fill="#111" />
        <rect x="60" y="30" width="360" height="180" fill="#1b1b1b" stroke="#666" />
        <rect x="84" y="58" width="96" height="96" fill="#252525" />
        <path d="M134 78h22v12h-22v46h-24v-16h12V78Z" fill="#bdbdbd" />
        <text x="204" y="76" className="scene-label">NOW PLAYING</text>
        <rect x="204" y="88" width="150" height="8" fill="#ddd" />
        <rect x="204" y="104" width="96" height="6" fill="#777" />
        {Array.from({ length: 12 }, (_, i) => { const h = 6 + ((i * 7 + tick * (i % 3 + 2)) % 26); return <rect key={i} x={204 + i * 14} y={150 - h} width="8" height={h} fill={i % 4 ? "#aaa" : "var(--signal)"} />; })}
        <rect x="84" y="176" width="312" height="4" fill="#333" />
        <rect x="84" y="176" width={(tick * 3) % 312} height="4" fill="var(--signal)" />
        <text x="240" y="226" textAnchor="middle" className="scene-label">PI / AUDIO</text>
      </svg>
      <figcaption className="preview-caption">Spotify Pi · Live listening status<span>Illustration</span></figcaption>
    </figure>
  );
}

const freshNight = { closeness: 0, time: 0, hits: 0, misses: 0, over: null };

function NightScene({ night, cue, bpm }) {
  const x = 430 - night.closeness * 2.9;
  const dark = cue.cue === "escalate" ? "#0b0b0b" : cue.cue === "build" ? "#121212" : "#1a1a1a";
  return (
    <svg className="robot-scene" viewBox="0 0 480 240" role="img" aria-label={`Night Watch. ${night.over === "caught" ? "Caught." : night.over === "dawn" ? "Survived until dawn." : `The creature is ${Math.round(night.closeness)}% of the way to you.`}`} shapeRendering="crispEdges">
      <rect width="480" height="240" fill={dark} />
      <path d="M0 206h480" stroke="#333" />
      <rect x="196" y="36" width="44" height="58" fill={night.over === "dawn" ? "#c9b98a" : "#151a24"} stroke="#444" />
      <path d="M218 36v58M196 65h44" stroke="#444" />
      <Person x={70} y={142} scale={.8} />
      <g transform={`translate(${x} 149) scale(1.5)`}>
        <path d="M-14-30h28v8h6v20h6v40h-8V8h-4v30h-8V12h-8v26h-8V8h-4v30h-8V-2h6v-20h6Z" fill="#2a2a2a" stroke="#555" />
        <rect x="-8" y="-20" width="5" height="4" fill="var(--signal)" />
        <rect x="3" y="-20" width="5" height="4" fill="var(--signal)" />
      </g>
      <text x="16" y="24" className="scene-label">HEART {bpm} BPM · CUE: {cue.cue.toUpperCase()}</text>
      <rect x="16" y="32" width="120" height="6" fill="#222" />
      <rect x="16" y="32" width={120 * cue.stress} height="6" fill="var(--signal)" />
      <text x="464" y="24" textAnchor="end" className="scene-label">{Math.ceil(NIGHT_SECONDS - night.time)}S TO DAWN</text>
      <text x="142" y="39" className="scene-label">STRESS</text>
    </svg>
  );
}

export function DreadDemo({ preview = false }) {
  const [bpm, setBpm] = useState(70);
  const [night, setNight] = useState(freshNight);
  const [running, setRunning] = useState(preview);
  const cue = directorCue(bpm);
  useEffect(() => {
    if (!running) return;
    if (preview && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setNight({ ...freshNight, closeness: 70, time: 6 }); setRunning(false); return; }
    const timer = setInterval(() => setNight((current) => {
      const next = nightStep(current, bpm, preview ? .6 : .1);
      if (next.over || (preview && next.closeness >= 85)) setRunning(false);
      return next;
    }), 100);
    return () => clearInterval(timer);
  }, [running, bpm, preview]);
  const scene = <NightScene night={night} cue={cue} bpm={bpm} />;
  if (preview) return <figure className="robot-demo robot-demo--preview" data-demo="dread">{scene}<figcaption className="preview-caption">Dread Director · {cue.line}<span>Illustration</span></figcaption></figure>;
  const result = night.over === "caught" ? "Caught. Staying calm gave it the opening." : night.over === "dawn" ? `Dawn. You survived${night.hits ? ` with ${night.hits} hit${night.hits === 1 ? "" : "s"}` : ""}.` : running ? cue.line : "Start the night, then set how your heart is racing.";
  return (
    <DemoFrame title="Survive the night watch" name="dread" note="A browser mini-game. Your heart rate is a slider here; the real build reads it from a camera and pulse sensor, and nothing is captured on this page.">
      {scene}
      <label className="dread-slider" htmlFor="dread-bpm">Simulated heart rate · {bpm} bpm<input id="dread-bpm" type="range" min="60" max="140" step="1" value={bpm} onChange={(event) => setBpm(Number(event.target.value))} /></label>
      <div className="demo-controls">
        {night.over || !running
          ? <button className="demo-primary" onClick={() => { setNight(freshNight); setRunning(true); }}>{night.over ? "Play again" : "Start the night"}</button>
          : <button className="demo-primary" onClick={() => setNight(swing)}>Swing</button>}
        {running && <button className="demo-secondary" onClick={() => setRunning(false)}>Pause</button>}
      </div>
      <p className="demo-status" role="status">{result}</p>
      <p className="demo-note">The director’s rule: calm players get hunted (escalate), tense ones get pressure (build), panicking ones get relief (ease off). Swing when it’s close.</p>
    </DemoFrame>
  );
}
