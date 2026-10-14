"use client";

import { useEffect, useRef, useState } from "react";
import { clipSteps, clipMoments, clipLine, clipCaption, clipPlayback, clipShot, speakerFraming, clipVoiceBeat, CLIP_DEMO_SECONDS } from "./clip-workflow.mjs";
import { playClipChatter } from "./clip-audio.mjs";

function PodcastSpeaker({ speaker, time, reducedMotion }) {
  const guest = speaker === "guest";
  const { center } = speakerFraming(time, reducedMotion, speaker);
  const speaking = !reducedMotion && Boolean(clipVoiceBeat(clipMoments[0], time, speaker));
  return (
    <g data-speaker={speaker} transform={`translate(${center} ${speaking ? -1 : 0}) scale(${guest ? -1 : 1} 1)`}>
      <path d="M-65 303v-94q0-26 24-26h76q26 0 26 26v94Z" fill="#252525" stroke="#515151" strokeWidth="2" />
      <path d="M-15 163h32v40l-12 18-20-19Z" fill={guest ? "#969696" : "#a6a6a6"} />
      <path d="M-67 292l9-61q4-31 39-36l23 20 15-20q31 3 43 34l17 63Z" fill={guest ? "#666" : "#b6b6b6"} />
      <path d="M-16 197l20 18-4 71m0-71 20-18" fill="none" stroke={guest ? "#444" : "#919191"} strokeWidth="3" />
      <path d="M-34 102q-3-39 33-40 37 0 43 36l-1 25 9 17-12 5q-4 35-30 38-30-1-39-33Z" fill={guest ? "#aaa" : "#c5c5c5"} />
      <path d={guest ? "M-37 121v-26q0-37 39-38 32 0 42 26l-2 22-14-19-41 2-8 37Z" : "M-36 120l-4-30q-1-37 41-35 38 1 46 29l-8 20-15-18-37 11-7 27Z"} fill={guest ? "#303030" : "#4d4d4d"} />
      <path d="M-7 118h9m23-3h8" stroke="#242424" strokeWidth="4" strokeLinecap="round" />
      <path d="M21 123l4 17h8" fill="none" stroke="#808080" strokeWidth="3" />
      {guest && <path d="M-23 146q11 8 17 5l20 3 23-10q-3 33-28 36-23-1-32-34Z" fill="#525252" />}
      <rect x="9" y="155" width="21" height={speaking ? 7 : 2} rx="2" fill="#333" />
      <path d="M-41 116V95q0-43 43-43 39 0 43 38" fill="none" stroke="#171717" strokeWidth="8" />
      <rect x="-43" y="105" width="16" height="36" rx="6" fill="#1c1c1c" stroke="#777" strokeWidth="2" />
      <path d="M-43 235l-5 38 44 12m45-49 13 33-21 18" fill="none" stroke={guest ? "#565656" : "#999"} strokeWidth="19" strokeLinecap="round" />
      <path d="M-5 285h21m17 2h18" stroke={guest ? "#aaa" : "#c5c5c5"} strokeWidth="12" strokeLinecap="round" />
      <path d="M88 307l-12-66-27-27" fill="none" stroke="#858585" strokeWidth="5" />
      <path d="M80 307l-5-64-29-27" fill="none" stroke="#444" strokeWidth="3" />
      <rect x="33" y="170" width="24" height="55" rx="11" fill="#121212" stroke="#8c8c8c" strokeWidth="2" transform="rotate(-24 45 197)" />
      <path d="M40 182l15 7m-17 1 15 7m-17 1 15 7" stroke="#555" strokeWidth="2" />
    </g>
  );
}

function PodcastStudio({ time, reducedMotion, wide = false }) {
  return (
    <>
      <rect width="640" height="360" fill="#171717" />
      <path d="M0 70h640M0 180h640M80 0v290M560 0v290" stroke="#292929" strokeWidth="2" />
      {[104, 384].map((x) => <g key={x}><rect x={x} y="40" width="152" height="180" fill="#212121" stroke="#363636" />{[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${x + 12 + i * 20} 48v164`} stroke="#303030" strokeWidth="5" />)}</g>)}
      <rect x="276" y="64" width="88" height="88" rx="44" fill="#242424" stroke="#515151" strokeWidth="2" />
      <path d="M299 100v17m10-26v35m11-44v53m11-43v33m10-25v17" stroke="#8c8c8c" strokeWidth="4" />
      <PodcastSpeaker speaker="host" time={time} reducedMotion={reducedMotion} />
      <PodcastSpeaker speaker="guest" time={time} reducedMotion={reducedMotion} />
      <path d="M0 301h640v59H0Z" fill="#333" />
      <path d="M0 301h640" stroke="#737373" strokeWidth="3" />
      {[122, 500].map((x) => <g key={x}><path d={`M${x} 283h21l-2 25h-17Z`} fill="#aaa" stroke="#ccc" strokeWidth="2" /><path d={`M${x + 21} 287q13 0 10 12h-11`} fill="none" stroke="#aaa" strokeWidth="3" /></g>)}
      <path d="M291 289h57l9 23h-74Z" fill="#515151" stroke="#888" strokeWidth="2" />
      {wide && <><text x="28" y="28" fill="#888" fontSize="10" fontFamily="monospace">THE LONG CONVERSATION / SAMPLE</text><text x="612" y="338" textAnchor="end" fill="#aaa" fontSize="10" fontFamily="monospace">CAM 01 · 16:9</text></>}
    </>
  );
}

function ClipBRoll({ time, reducedMotion }) {
  const playhead = reducedMotion ? 105 : 42 + (time - 19) / 3 * 118;
  return (
    <svg viewBox="0 0 202.5 360" role="img" aria-label="Full-screen B-roll of a video editing timeline" className="clip-scene">
      <rect width="202.5" height="360" fill="#161616" />
      <path d="M0 65h202.5M0 285h202.5" stroke="#303030" />
      <text x="18" y="49" fill="#999" fontSize="8" fontFamily="monospace">MAKE EVERY SECOND COUNT</text>
      <g transform="rotate(-7 101 173)">
        <rect x="14" y="88" width="176" height="169" rx="5" fill="#222" stroke="#777" />
        <rect x="24" y="100" width="156" height="65" fill="#111" />
        <path d="M39 142l27-24 20 15 31-21 48 39H39Z" fill="#555" />
        <circle cx="148" cy="116" r="7" fill="#aaa" />
        <path d="M24 180h156" stroke="#777" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${26 + i * 21} 175v5`} stroke="#777" />)}
        <rect x="25" y="189" width="45" height="17" fill="#666" />
        <rect x="73" y="189" width="58" height="17" fill="#969696" />
        <rect x="134" y="189" width="45" height="17" fill="#555" />
        <rect x="25" y="215" width="154" height="21" fill="#383838" />
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${29 + i * 5} ${225 - (i % 4 + 1) * 2}v${(i % 4 + 1) * 4}`} stroke="#999" strokeWidth="2" />)}
        <path d={`M${playhead} 176v65`} stroke="#eee" strokeWidth="2" />
        <path d={`M${playhead - 4} 173h8l-4 6Z`} fill="#eee" />
      </g>
      <text x="101" y="308" textAnchor="middle" fill="#ccc" fontSize="9" fontFamily="monospace">B-ROLL / THE EDIT</text>
    </svg>
  );
}

function PodcastScene({ shot, time, reducedMotion }) {
  if (shot.type === "b-roll") return <ClipBRoll time={time} reducedMotion={reducedMotion} />;
  const stacked = shot.type === "stacked";
  const wide = shot.type === "wide";
  const { x } = speakerFraming(time, reducedMotion, shot.speaker);
  const description = wide ? "Two men seated at three-quarter angles with podcast microphones"
    : stacked ? "Both podcast speakers stacked top and bottom"
    : `Vertical close-up of the podcast ${shot.speaker}`;
  return (
    <svg viewBox={wide ? "0 0 640 360" : stacked ? "0 0 202.5 360" : `${x} 0 202.5 360`} role="img" aria-label={description} className="clip-scene">
      {stacked ? <>{["host", "guest"].map((speaker, i) => {
        const framing = speakerFraming(time, reducedMotion, speaker);
        return <svg key={speaker} x="0" y={i * 180} width="202.5" height="180" viewBox={`${framing.x} 48 202.5 180`} overflow="hidden"><PodcastStudio time={time} reducedMotion={reducedMotion} /></svg>;
      })}<path d="M0 180h202.5" stroke="#999" strokeWidth="2" /></>
        : <PodcastStudio time={time} reducedMotion={reducedMotion} wide={wide} />}
    </svg>
  );
}

function ClipPreview({ stage, time, reducedMotion }) {
  const moment = clipMoments[0];
  const portrait = stage >= 2;
  const caption = stage >= 3 ? clipCaption(moment, time) : null;
  const edited = stage >= 4;
  const shot = clipShot(moment, time, { portrait, edited });
  return (
    <div className={`clip-screen${portrait ? " clip-screen--portrait" : ""}${stage === 5 ? " clip-screen--viewer" : ""}${shot.type === "stacked" ? " clip-screen--stacked" : ""}`} data-shot={shot.type} data-active-speaker={shot.speaker}>
      <PodcastScene shot={shot} time={time} reducedMotion={reducedMotion} />
      {stage === 1 && <div className="clip-corner-label">Opening trimmed · {moment.trim.end - moment.trim.start}s</div>}
      {caption && <div className="clip-caption clip-caption--highlight" aria-hidden="true">{caption.words.map((word, i) => <span key={`${i}-${word}`} className={i === caption.active ? "is-active" : ""}>{word} </span>)}</div>}
      {stage === 5 && <div className="clip-viewer-label"><strong>@overlap.example</strong><span>Viewer preview · not published</span></div>}
    </div>
  );
}

export default function ClipDemo({ preview = false }) {
  const [ready, setReady] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seeking, setSeeking] = useState(false);
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
    if (!playing || finished || seeking) return;
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
  }, [playing, finished, seeking, preview]);
  useEffect(() => {
    if (finished && !seeking) {
      setPlaying(false);
      audio.current?.suspend().catch(() => {});
    }
  }, [finished, seeking]);
  useEffect(() => () => { audio.current?.close().catch(() => {}); }, []);
  useEffect(() => {
    if (preview || !playing || !sound || finished || seeking) return;
    const speakers = clipLine(moment, time)?.speakers || [];
    const beats = speakers.map((speaker) => clipVoiceBeat(moment, time, speaker)).filter(Boolean);
    const key = beats.length && `${stage}-${beats.map((beat) => beat.key).join("|")}`;
    if (!key || key === lastBeat.current || audio.current?.state !== "running") return;
    lastBeat.current = key;
    beats.forEach((beat) => playClipChatter(audio.current, beat));
  }, [preview, playing, sound, finished, seeking, stage, moment, time]);

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
  const seek = (event) => {
    setElapsed(event.currentTarget.valueAsNumber);
    lastBeat.current = null;
  };
  const startSeeking = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setSeeking(true);
    audio.current?.suspend().catch(() => {});
  };
  const finishSeeking = () => {
    if (!seeking) return;
    setSeeking(false);
    if (playing && sound && !finished) resumeAudio();
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
        <div className="clip-transport">
          <input className="clip-seek" type="range" min="0" max={CLIP_DEMO_SECONDS} step="0.1" value={elapsed} aria-label="Seek demo" aria-valuetext={`${Math.floor(elapsed)} of ${CLIP_DEMO_SECONDS} seconds`} style={{ "--clip-progress": `${progress * 100}%` }} onChange={seek} onPointerDown={startSeeking} onPointerUp={finishSeeking} onPointerCancel={finishSeeking} onLostPointerCapture={finishSeeking} onBlur={finishSeeking} />
          <span>{Math.floor(elapsed)}s / {CLIP_DEMO_SECONDS}s</span>
        </div>
        <div className="demo-controls clip-workflow-controls"><button className="demo-primary" onClick={togglePlayback}>{playing ? "Pause" : finished ? "Replay" : elapsed > 0 ? "Resume" : "Play demo"}</button><button className="demo-secondary" onClick={reset} disabled={elapsed === 0}>Restart</button><button className="demo-secondary" aria-pressed={sound} aria-label={sound ? "Mute chatter" : "Enable chatter"} onClick={toggleSound} disabled={!audioAvailable}>{sound ? "Sound on" : "Sound off"}</button></div>
        {!audioAvailable && <p className="demo-note">Sound is unavailable in this browser. The visual workflow still plays.</p>}
      </fieldset>
      <p className="demo-note">Scripted team-workflow example, not Overlap’s actual product. Synthesized chatter, no speech. No uploads or publishing.</p>
      <noscript><p className="demo-note">The example is visible without JavaScript; editing controls require it.</p></noscript>
    </section>
  );
}
