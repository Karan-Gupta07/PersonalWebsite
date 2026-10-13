"use client";

import { useEffect, useRef, useState } from "react";
import { clipSteps, clipMoments, clipLine, clipCaption, clipPlayback, speakerFraming, clipVoiceBeat, CLIP_DEMO_SECONDS } from "./clip-workflow.mjs";
import { playClipChatter } from "./clip-audio.mjs";

function PodcastScene({ portrait, time, edited, reducedMotion }) {
  const { x, offset } = speakerFraming(time, reducedMotion);
  const speaking = !reducedMotion && Boolean(clipVoiceBeat(clipMoments[0], time));
  return (
    <svg viewBox={portrait ? `${x} 0 202.5 360` : "0 0 640 360"} role="img" aria-label={`Illustrated podcast studio, ${portrait ? "vertical crop" : "horizontal source"}`} className={edited ? "clip-scene clip-scene--edited" : "clip-scene"}>
      <rect width="640" height="360" fill="#171717" />
      <path d="M0 70h640M0 180h640M100 0v270M540 0v270" stroke="#292929" strokeWidth="2" />
      <rect x="44" y="42" width="158" height="180" fill="#222" stroke="#484848" strokeWidth="3" />
      <path d="M48 179l40-46 28 28 36-60 46 56v61H48Z" fill="#363636" />
      <path d="M121 44v174M46 132h152" stroke="#555" strokeWidth="3" />
      <rect x="478" y="46" width="100" height="156" fill="#242424" />
      {[66, 84, 102, 120, 138, 156, 174].map((y) => <path key={y} d={`M488 ${y}h80`} stroke="#3c3c3c" strokeWidth="4" />)}
      <path d="M487 268v-66h42v66m-55-62h67l-20-40h-27Z" fill="#555" />
      <path d="M278 306v-82q0-26 24-26h104q26 0 26 26v82Z" fill="#343434" stroke="#555" strokeWidth="2" />
      <g transform={`translate(${offset} ${speaking && !reducedMotion ? -1 : 0})`}>
        <path d="M340 157h42v43l-21 25-21-25Z" fill="#888" />
        <path d="M308 226q2-31 32-31l21 21 21-21q35 0 44 37l14 66H295Z" fill="#b6b6b6" />
        <path d="M319 95q0-38 43-38t44 38v51q-2 38-44 41-42-3-43-41Z" fill="#bcbcbc" />
        <path d="M317 111V88q0-37 46-37 42 0 47 35l-11 27-6-30-16 10-38-6-9 30Z" fill="#525252" />
        <path d="M336 118h10m31 0h10" stroke="#292929" strokeWidth="4" />
        <path d="M359 124l-3 18h9" fill="none" stroke="#828282" strokeWidth="3" />
        <rect x="350" y="154" width="24" height={speaking ? 7 : 2} rx="2" fill="#555" />
        <path d="M312 248l-6 41h35m58-41 8 41h-27" fill="none" stroke="#909090" strokeWidth="15" />
      </g>
      <path d="M0 301h640v59H0Z" fill="#333" />
      <path d="M0 301h640" stroke="#737373" strokeWidth="3" />
      <path d="M408 313v-61l-21-53" fill="none" stroke="#777" strokeWidth="6" />
      <rect x="372" y="170" width="24" height="56" rx="12" fill="#161616" stroke="#8c8c8c" strokeWidth="2" transform="rotate(-16 384 198)" />
      <path d="M242 276h64l13 38h-86Z" fill="#515151" stroke="#888" strokeWidth="2" />
      <rect x="275" y="288" width="8" height="8" fill="#aaa" />
      {!portrait && <><text x="28" y="32" fill="#888" fontSize="10" fontFamily="monospace">THE LONG CONVERSATION / SAMPLE</text><text x="612" y="338" textAnchor="end" fill="#aaa" fontSize="10" fontFamily="monospace">CAM 01 · 16:9</text></>}
    </svg>
  );
}

function ClipPreview({ stage, time, reducedMotion }) {
  const moment = clipMoments[0];
  const portrait = stage >= 2;
  const caption = stage >= 3 ? clipCaption(moment, time) : null;
  const edited = stage >= 4;
  return (
    <div className={`clip-screen${portrait ? " clip-screen--portrait" : ""}${stage === 5 ? " clip-screen--viewer" : ""}`}>
      <PodcastScene portrait={portrait} time={time} edited={edited} reducedMotion={reducedMotion} />
      {stage === 1 && <div className="clip-corner-label">Opening trimmed · {moment.trim.end - moment.trim.start}s</div>}
      {edited && <div className="clip-title">{moment.title}</div>}
      {caption && <div className="clip-caption clip-caption--highlight" aria-hidden="true">{caption.words.map((word, i) => <span key={`${i}-${word}`} className={i === caption.active ? "is-active" : ""}>{word} </span>)}</div>}
      {stage === 5 && <div className="clip-viewer-label"><strong>@overlap.example</strong><span>Viewer preview · not published</span></div>}
    </div>
  );
}

export default function ClipDemo({ preview = false }) {
  const [ready, setReady] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const audio = useRef(null);
  const lastBeat = useRef(null);
  const moment = clipMoments[0];
  const { stage, time, finished, progress } = clipPlayback(elapsed);
  const line = clipLine(moment, time);

  useEffect(() => {
    setReady(true);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(preference.matches);
      if (preview) setPlaying(!preference.matches);
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, [preview]);
  useEffect(() => {
    if (!playing || finished) return;
    const pause = () => {
      setPlaying(false);
      audio.current?.suspend().catch(() => {});
    };
    document.addEventListener("visibilitychange", pause);
    // Use elapsed wall time so slow renders do not stretch the workflow.
    let previous = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      const delta = Math.min(.25, (now - previous) / 1000) * (preview ? 4 : 1);
      previous = now;
      setElapsed((value) => Math.min(CLIP_DEMO_SECONDS, value + delta));
    }, 80);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", pause); };
  }, [playing, finished, preview]);
  useEffect(() => {
    if (finished) {
      setPlaying(false);
      audio.current?.suspend().catch(() => {});
    }
  }, [finished]);
  useEffect(() => () => { audio.current?.close().catch(() => {}); }, []);
  useEffect(() => {
    if (preview || !playing || !sound || finished) return;
    const beat = clipVoiceBeat(moment, time);
    const key = beat && `${stage}-${beat.key}`;
    if (!beat || key === lastBeat.current || audio.current?.state !== "running") return;
    lastBeat.current = key;
    playClipChatter(audio.current, beat);
  }, [preview, playing, sound, finished, stage, moment, time]);

  const resumeAudio = () => {
    try {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) throw new Error("Audio unavailable");
      audio.current ??= new Context();
      audio.current.resume().catch(() => { setAudioAvailable(false); setSound(false); });
    } catch { setAudioAvailable(false); setSound(false); }
  };
  const togglePlayback = () => {
    if (playing) {
      setPlaying(false);
      audio.current?.suspend().catch(() => {});
    } else {
      if (finished) { setElapsed(0); lastBeat.current = null; }
      if (sound) resumeAudio();
      setPlaying(true);
    }
  };
  const toggleSound = () => {
    if (sound) audio.current?.suspend().catch(() => {});
    else if (playing) resumeAudio();
    setSound(!sound);
  };
  const reset = () => {
    setElapsed(0);
    setPlaying(false);
    lastBeat.current = null;
    audio.current?.suspend().catch(() => {});
  };
  const screen = <ClipPreview stage={stage} time={time} reducedMotion={reducedMotion} />;
  if (preview) return <figure className="robot-demo robot-demo--preview clip-mini" data-demo="clips"><div className="clip-mini-stage">{screen}</div><figcaption className="preview-caption">Overlap · {clipSteps[stage].title}<span>Illustration</span></figcaption></figure>;

  return (
    <section className="interactive-demo clip-demo" data-demo="clips" data-stage={stage} data-playing={playing} aria-label="From a long recording to a short clip">
      <div className="demo-heading"><h2>Long recording → short clip</h2><span>Illustrative demo</span></div>
      <fieldset className="demo-body" disabled={!ready}>
        <legend className="sr-only">Clip-editing workflow controls</legend>
        <div className="clip-workspace">
          <aside className="clip-agent" aria-label="Scripted agent workflow">
            <div className="clip-agent-heading"><span className="clip-agent-dot" />Editing agent</div>
            <div className="clip-agent-note" role="status" aria-live="polite" aria-atomic="true">
              <span>{clipSteps[stage].title} · {stage + 1}/{clipSteps.length}</span>
              <p key={stage}>{elapsed === 0 ? "Let’s find the good bit." : clipSteps[stage].note}</p>
            </div>
            <ol className="clip-step-dots" aria-label="Workflow steps">{clipSteps.map((step, i) => <li key={step.title} aria-current={stage === i ? "step" : undefined} data-complete={i < stage}><span className="sr-only">{step.title}</span></li>)}</ol>
          </aside>
          <div className="clip-editor">
            <div className="clip-editor-heading"><span>{stage === 0 ? "Original" : stage === 5 ? "Finished clip" : clipSteps[stage].title}</span><span>{stage >= 2 ? "9:16" : "16:9"}</span></div>
            <div className="clip-preview-stage">{screen}</div>
            <p className="sr-only">Example transcript: {line?.text || line?.label || "End of excerpt"}</p>
          </div>
        </div>
        <div className="clip-transport"><progress max="1" value={progress} aria-label="Demo progress" /><span>{Math.floor(elapsed)}s / {CLIP_DEMO_SECONDS}s</span></div>
        <div className="demo-controls clip-workflow-controls"><button className="demo-primary" onClick={togglePlayback}>{playing ? "Pause" : finished ? "Replay" : elapsed > 0 ? "Resume" : "Play demo"}</button><button className="demo-secondary" onClick={reset} disabled={elapsed === 0}>Restart</button><button className="demo-secondary" aria-pressed={sound} aria-label={sound ? "Mute chatter" : "Enable chatter"} onClick={toggleSound} disabled={!audioAvailable}>{sound ? "Sound on" : "Sound off"}</button></div>
        {!audioAvailable && <p className="demo-note">Sound is unavailable in this browser. The visual workflow still plays.</p>}
      </fieldset>
      <p className="demo-note">Scripted team-workflow example, not Overlap’s actual product. Synthesized chatter, no speech. No uploads or publishing.</p>
      <noscript><p className="demo-note">The example is visible without JavaScript; editing controls require it.</p></noscript>
    </section>
  );
}
