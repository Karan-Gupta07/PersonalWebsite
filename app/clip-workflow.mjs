export const clipSteps = [
  { title: "Find", note: "There’s silence here. Let’s skip to the good bit.", result: "Scanning the recording" },
  { title: "Trim", note: "This is the best part. Let’s start here.", result: "Opening trimmed · 23s kept" },
  { title: "Reframe", note: "He’s moving. Let’s follow him.", result: "Speaker in frame · 9:16" },
  { title: "Caption", note: "A few words at a time. Easier to follow.", result: "Adding timed captions" },
  { title: "Edit", note: "Tighter shot. Keep the good stuff.", result: "Title + finishing touches" },
  { title: "Ready", note: "There we go. Ready for the feed.", result: "Finished example · not posted" },
];

export const clipMoments = [
  {
    title: "Start with the interesting part",
    sourceStart: 4328,
    duration: 35,
    trim: { start: 8, end: 31 },
    transcript: [
      { start: 0, end: 3, text: "", label: "Silence / room tone" },
      { start: 3, end: 8, text: "Okay, so this is something we’ve been talking about." },
      { start: 8, end: 13, text: "Your best clip is hiding in the middle." },
      { start: 13, end: 19, text: "Start where the idea gets interesting, not where the recording starts." },
      { start: 19, end: 25, text: "Give it enough context to make sense on its own." },
      { start: 25, end: 31, text: "Then cut anything that doesn’t earn its place." },
      { start: 31, end: 35, text: "Anyway, let’s move on to the next question." },
    ],
  },
];

export function clipTime(seconds) {
  const value = Math.max(0, Math.floor(seconds));
  return [Math.floor(value / 3600), Math.floor(value % 3600 / 60), value % 60]
    .map((part) => String(part).padStart(2, "0")).join(":");
}

export function clipLine(moment, time) {
  return moment.transcript.find((line) => time >= line.start && time < line.end) || null;
}

export function clipCaption(moment, time) {
  const line = clipLine(moment, time);
  if (!line?.text) return null;
  const words = line.text.split(" ");
  const active = Math.min(words.length - 1, Math.floor((time - line.start) / (line.end - line.start) * words.length));
  const first = Math.floor(active / 4) * 4;
  return { words: words.slice(first, first + 4), active: active - first };
}

export const CLIP_STAGE_SECONDS = 4;
export const CLIP_WORKFLOW_SECONDS = CLIP_STAGE_SECONDS * (clipSteps.length - 1);
export const CLIP_DEMO_SECONDS = CLIP_WORKFLOW_SECONDS + clipMoments[0].trim.end - clipMoments[0].trim.start;

export function clipPlayback(elapsed) {
  const position = Math.max(0, Math.min(CLIP_DEMO_SECONDS, Number.isFinite(elapsed) ? elapsed : 0));
  const stage = Math.min(clipSteps.length - 1, Math.floor(position / CLIP_STAGE_SECONDS));
  const moment = clipMoments[0];
  const time = stage === 0 ? position : stage === clipSteps.length - 1
    ? Math.min(moment.trim.end - .01, moment.trim.start + position - CLIP_WORKFLOW_SECONDS)
    : moment.trim.start + position % CLIP_STAGE_SECONDS;
  return { stage, time, finished: position >= CLIP_DEMO_SECONDS, progress: position / CLIP_DEMO_SECONDS };
}

export function speakerFraming(time, reducedMotion = false) {
  const offset = reducedMotion ? 0 : Math.sin(time * .7) * 22;
  const center = 362 + offset;
  const width = 202.5;
  const x = Math.max(0, Math.min(640 - width, center - width / 2));
  return { offset, center, x, width };
}

export function clipVoiceBeat(moment, time) {
  const line = clipLine(moment, time);
  if (!line?.text) return null;
  const rhythm = [.14, .23, .16, .2, .12, .3, .18, .24, .16, .33];
  const position = (time - line.start) % 2.06;
  let start = 0;
  const index = rhythm.findIndex((length) => {
    const inside = position >= start && position < start + length;
    if (!inside) start += length;
    return inside;
  });
  if (index < 0 || index === 5 || index === 9) return null;
  const duration = rhythm[index] * .85;
  if (position - start >= duration) return null;
  const phrase = Math.floor((time - line.start) / 2.06);
  return {
    key: `${line.start}-${phrase}-${index}`,
    seed: line.start * 37 + phrase * 11 + index + 1,
    pitch: 132 + [6, 18, -8, 12, -4, 0, 24, -6, 8, 0][index],
    duration,
    vowel: (index + phrase) % 4,
  };
}
