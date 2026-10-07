export const stories = {
  repair: {
    title: "From a broken object to a repair plan",
    steps: [
      { title: "Something’s broken", text: "An example customer has a chair that no longer rolls, but doesn’t know what to replace.", action: "Inspect the example photo", speech: ["This chair won’t roll.", "How do I fix it?"] },
      { title: "Identify the problem", text: "The example image highlights a damaged caster. Reparo’s vision workflow connects the visible problem to a repairable component.", action: "Show the repair plan", speech: ["The caster is damaged.", "Let’s find a replacement."] },
      { title: "Make the repair understandable", text: "Identify the attachment, verify a compatible replacement, then follow the manufacturer’s replacement instructions.", action: "Find replacement parts", speech: ["A plan, tools, and a part.", "Now I know where to start."] },
      { title: "Source the missing part", text: "Reparo connects a repair plan to parts sourcing through Shopify and SerpAPI. The listing below is illustrative, not live inventory.", action: "Start over", speech: ["A matching part to look for.", "Repair instead of replace."] },
    ],
  },
  tailor: {
    title: "From a photo to a better fit",
    steps: [
      { title: "Start with an example silhouette", text: "A synthetic profile shows the photo-to-measurement workflow. No photo is uploaded or analyzed here.", action: "Show landmarks", speech: ["My clothes never fit.", "Can a photo help?"] },
      { title: "Locate the landmarks", text: "Shoulder, torso, and arm landmarks establish the reference points used by the measurement workflow.", action: "Show measurements", speech: ["Shoulders, torso, sleeves.", "A consistent reference."] },
      { title: "Translate landmarks into measurements", text: "These fixed example measurements show the shape of the result—not measurements inferred from your body.", action: "Preview the garment", speech: ["Measurements, not guesses.", "Ready for a custom fit."] },
      { title: "Connect the measurements to apparel", text: "The tailoring flow brings the measurements into a custom-apparel catalog. This is a visual example, not a live order.", action: "Start over", speech: ["A garment built around", "the example measurements."] },
    ],
  },
};

export const fitProfile = { height: 178, chest: 98, shoulder: 44, sleeve: 62 };

// DeliriumWatch: synthetic night-time readings. `openness` is a per-frame eye-openness trace
// (eye aspect ratio from eye landmarks); `face` drives the drawn landmarks.
export const roomSamples = [
  { label: "Resting", online: true, light: 80, noise: 34, face: { eye: 0, brow: 0, mouth: 0, pallor: 0 }, openness: [.06, .05, .06, .05, .05, .06, .05, .06, .05, .05, .06, .05] },
  { label: "Disrupted rest", online: true, light: 420, noise: 72, face: { eye: 1, brow: 0, mouth: 0, pallor: 0 }, openness: [.31, .3, .08, .32, .29, .07, .3, .31, .06, .3, .07, .31] },
  { label: "Visible distress", online: true, light: 90, noise: 40, face: { eye: .5, brow: 1, mouth: 1, pallor: 1 }, openness: [.18, .17, .19, .16, .18, .17, .18, .16, .17, .18, .17, .16] },
  { label: "Camera offline", online: false, light: null, noise: null, face: null, openness: [] },
];

export const EYES_OPEN = .2;

export function faceReadout(sample) {
  if (!sample.online || !sample.face || !sample.openness.length) return null;
  const average = sample.openness.reduce((sum, value) => sum + value, 0) / sample.openness.length;
  const blinks = sample.openness.filter((value, i) => i && value < EYES_OPEN && sample.openness[i - 1] >= EYES_OPEN).length;
  const eyes = average < .1 ? "Closed" : blinks >= 3 ? "Open, blinking often" : average >= EYES_OPEN ? "Open" : "Half-open";
  const expression = sample.face.brow && sample.face.mouth ? "Furrowed brow, grimace" : "Relaxed";
  return { eyes, blinks, expression, pallor: sample.face.pallor > 0 };
}

export function roomFlags(sample) {
  const face = faceReadout(sample);
  if (!face || !Number.isFinite(sample.light) || !Number.isFinite(sample.noise)) return ["Camera or sensor readings unavailable; check the connection."];
  return [
    sample.light >= 300 && "Room light exceeds the example night-time threshold.",
    sample.noise >= 60 && "Room noise exceeds the example threshold.",
    face.blinks >= 3 && "Eyes open with frequent blinking: rest looks disrupted.",
    face.expression !== "Relaxed" && "Brow and mouth landmarks show a strained expression.",
    face.pallor && "Skin tone differs from this patient’s example baseline.",
  ].filter(Boolean);
}

export const pipelineSamples = [
  { label: "Normal traffic", queue: 42, memory: 48, age: 4, trace: [28, 34, 32, 30, 38, 36, 40, 43, 38, 41, 40, 42] },
  { label: "Growing backlog", queue: 184, memory: 89, age: 12, trace: [42, 51, 66, 82, 95, 112, 131, 148, 163, 172, 180, 184] },
  { label: "Telemetry gap", queue: null, memory: null, age: 95, trace: [] },
];

export function pipelineFlags(sample) {
  if (![sample.queue, sample.memory, sample.age].every(Number.isFinite) || sample.age > 60) return ["Telemetry is stale or missing; check the ingestion pipeline."];
  return [sample.queue >= 150 && "Queue growth crossed the example early-warning threshold.", sample.memory >= 80 && "Memory usage is elevated; investigate before service degradation."].filter(Boolean);
}

export const applicantExamples = [
  { name: "Example profile A", gpa: 3.9, sat: 1510, interest: "Engineering" },
  { name: "Example profile B", gpa: 3.5, sat: 1390, interest: "Engineering" },
  { name: "Example profile C", gpa: 3.8, sat: 1490, interest: "Computer science" },
  { name: "Example profile D", gpa: 3.4, sat: 1340, interest: "Arts" },
];

export function matchApplicants(gpa, sat, interest) {
  if (![gpa, sat].every((value) => ["string", "number"].includes(typeof value) && String(value).trim() !== "")) return [];
  const grade = Number(gpa), test = Number(sat);
  if (!Number.isFinite(grade) || grade < 0 || grade > 4 || !Number.isFinite(test) || test < 400 || test > 1600 || !applicantExamples.some((profile) => profile.interest === interest)) return [];
  return applicantExamples.map((profile) => ({ ...profile, similarity: Math.round(100 * (1 - .5 * Math.abs(grade - profile.gpa) / 4 - .35 * Math.abs(test - profile.sat) / 1200 - .15 * Number(interest !== profile.interest))) })).sort((a, b) => b.similarity - a.similarity);
}

export const guardrailCases = [
  { label: "Grounded answer", type: "claim", evidence: "Sample returns policy: unopened items may be returned within 30 days.", response: "You can return an unopened item within 30 days.", allowedDays: 30, claimedDays: 30 },
  { label: "Unsupported claim", type: "claim", evidence: "Sample returns policy: unopened items may be returned within 30 days.", response: "You can return an unopened item within 90 days.", allowedDays: 30, claimedDays: 90 },
  { label: "Unapproved action", type: "permission", evidence: "Sample tool policy: an email may be sent only after explicit user approval.", response: "The agent attempts to send an email without approval.", approved: false },
];

export function checkAgentTrace(sample) {
  if (sample.type === "permission") return { passed: sample.approved === true, reason: sample.approved === true ? "Explicit approval is present." : "The required approval is missing. The simulated action is blocked." };
  if (sample.type !== "claim" || !Number.isFinite(sample.allowedDays) || !Number.isFinite(sample.claimedDays)) return { passed: false, reason: "The claim cannot be verified from the supplied evidence." };
  const passed = sample.allowedDays === sample.claimedDays;
  return { passed, reason: passed ? "The claimed return window matches the retrieved policy." : `The agent claims ${sample.claimedDays} days, but the evidence supports ${sample.allowedDays}. The unsupported claim is blocked.` };
}

export function spotifyEmbedUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "open.spotify.com" && /^\/track\/[a-zA-Z0-9]{22}$/.test(url.pathname) ? `https://open.spotify.com/embed${url.pathname}?theme=0` : null;
  } catch { return null; }
}

export function nextTrackIndex(index, length, loop) {
  if (!Number.isInteger(index) || !Number.isInteger(length) || length <= 0 || index < 0 || index >= length) return null;
  return index + 1 < length ? index + 1 : loop ? 0 : null;
}

// Overlap: a three-hour stream split into 5-minute segments; values are example motion scores (0–100).
export const longVideo = {
  segmentMinutes: 5,
  motion: [8, 10, 6, 12, 64, 82, 70, 14, 9, 7, 11, 18, 52, 90, 76, 22, 10, 8, 6, 9, 12, 40, 66, 58, 14, 8, 7, 10, 72, 95, 84, 30, 12, 9, 6, 8],
};

export function sampleFrames(motion, budget, adaptive) {
  if (!motion.length || budget < motion.length) return motion.map(() => 0);
  if (!adaptive) return motion.map(() => Math.floor(budget / motion.length));
  const total = motion.reduce((sum, value) => sum + value, 0);
  if (!total) return motion.map((_, i) => Math.floor(budget / motion.length) + Number(i < budget % motion.length));
  const spare = budget - motion.length;
  const share = motion.map((value) => spare * value / total);
  const frames = share.map((value) => 1 + Math.floor(value));
  // Largest remainder: hand leftover frames to the segments that lost the most to rounding.
  const left = budget - frames.reduce((sum, value) => sum + value, 0);
  share.map((value, i) => [value % 1, i]).sort((a, b) => b[0] - a[0]).slice(0, left).forEach(([, i]) => frames[i]++);
  return frames;
}

export function actionShare(frames, motion, threshold = 50) {
  const total = frames.reduce((sum, value) => sum + value, 0);
  return total ? Math.round(100 * frames.reduce((sum, value, i) => sum + (motion[i] >= threshold ? value : 0), 0) / total) : 0;
}

export function topClips(motion, count = 3) {
  return motion.map((value, i) => [value, i]).sort((a, b) => b[0] - a[0]).slice(0, count).map(([, i]) => i).sort((a, b) => a - b);
}

export function timestamp(minutes) {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:00`;
}
