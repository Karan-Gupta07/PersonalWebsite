import assert from "node:assert/strict";
import { clipSteps, clipMoments, clipTime, clipLine, clipCaption, clipPlayback, speakerFraming, clipVoiceBeat, CLIP_STAGE_SECONDS, CLIP_WORKFLOW_SECONDS, CLIP_DEMO_SECONDS } from "./app/clip-workflow.mjs";
import { playClipChatter, renderClipChatter } from "./app/clip-audio.mjs";

assert.equal(clipSteps.length, 6);
assert.ok(clipSteps.every((step) => step.title && step.note && step.result));
assert.ok(clipSteps.every((step) => step.note.length <= 60), "Agent comments stay short");
assert.equal(clipMoments.length, 1);
assert.equal(clipTime(4328), "01:12:08");
assert.equal(clipTime(0), "00:00:00");
for (const moment of clipMoments) {
  assert.ok(moment.trim.start > 0 && moment.trim.end <= moment.duration);
  assert.equal(moment.transcript[0].start, 0);
  assert.equal(moment.transcript.at(-1).end, moment.duration);
  for (let i = 1; i < moment.transcript.length; i++) assert.equal(moment.transcript[i - 1].end, moment.transcript[i].start);
  assert.equal(clipCaption(moment, 0), null, "The blank opening has no captions");
  assert.equal(clipLine(moment, -1), null);
  assert.equal(clipCaption(moment, moment.duration), null);
  assert.ok(clipLine(moment, moment.trim.start).text, "The suggested trim opens on spoken content");
  for (let time = 0; time < moment.duration; time += .25) {
    const caption = clipCaption(moment, time);
    if (!caption) continue;
    assert.ok(caption.words.length > 0 && caption.words.length <= 4);
    assert.ok(caption.active >= 0 && caption.active < caption.words.length);
    assert.ok(clipLine(moment, time).text.includes(caption.words.join(" ")));
  }
}
assert.equal(clipCaption(clipMoments[0], 8).words.join(" "), "Your best clip is");
assert.equal(clipCaption(clipMoments[0], 8).active, 0);
assert.equal(CLIP_DEMO_SECONDS, 43);
assert.equal(clipPlayback(-10).stage, 0);
assert.equal(clipPlayback(NaN).progress, 0);
for (let i = 0; i < clipSteps.length; i++) assert.equal(clipPlayback(i * CLIP_STAGE_SECONDS).stage, i);
assert.equal(clipPlayback(CLIP_WORKFLOW_SECONDS).time, clipMoments[0].trim.start);
assert.equal(clipPlayback(CLIP_DEMO_SECONDS).finished, true);
assert.equal(clipPlayback(CLIP_DEMO_SECONDS + 99).progress, 1);
assert.equal(clipPlayback(CLIP_DEMO_SECONDS + 99).stage, 5);
assert.ok(clipPlayback(CLIP_DEMO_SECONDS).time < clipMoments[0].trim.end);
for (let elapsed = 0; elapsed < CLIP_DEMO_SECONDS; elapsed += .08) {
  const state = clipPlayback(elapsed);
  if (state.stage > 0) assert.ok(state.time >= clipMoments[0].trim.start && state.time < clipMoments[0].trim.end);
  const framing = speakerFraming(state.time);
  assert.ok(framing.x >= 0 && framing.x + framing.width <= 640);
  assert.ok(Math.abs(framing.x + framing.width / 2 - framing.center) < .001, "Auto framing keeps the speaker centered");
}
assert.deepEqual(speakerFraming(0, true), speakerFraming(20, true), "Reduced motion disables speaker drift");
assert.notEqual(speakerFraming(1).x, speakerFraming(2).x, "The crop follows the illustrated speaker");
assert.equal(clipVoiceBeat(clipMoments[0], 0), null, "The blank opening is silent");
assert.equal(clipVoiceBeat(clipMoments[0], 9.05), null, "Vocal phrases include pauses");
const beat = clipVoiceBeat(clipMoments[0], 8);
assert.ok(beat.pitch >= 120 && beat.pitch <= 170);
assert.ok(beat.duration > .05 && beat.duration < .3);
const syllables = new Map();
for (let time = 8; time < 13; time += .02) {
  const sound = clipVoiceBeat(clipMoments[0], time);
  if (sound) syllables.set(sound.key, sound);
}
assert.ok(new Set([...syllables.values()].map((sound) => sound.duration)).size > 3, "Chatter has an uneven rhythm");
assert.ok(new Set([...syllables.values()].map((sound) => sound.vowel)).size === 4, "Chatter changes vowel shapes");
for (const rate of [22050, 44100, 48000]) {
  for (const sound of [...syllables.values()].slice(0, 8)) {
    const samples = renderClipChatter(rate, sound);
    assert.equal(samples.length, Math.ceil(rate * sound.duration));
    assert.ok(samples.every(Number.isFinite), "All audio samples are finite");
    const peak = samples.reduce((maximum, value) => Math.max(maximum, Math.abs(value)), 0);
    assert.ok(peak > .1 && peak < .14, "Chatter stays at a quiet, bounded level");
    assert.ok(Math.abs(samples[0]) < .001 && Math.abs(samples.at(-1)) < .001, "Syllables fade without clicks");
  }
}
assert.deepEqual(renderClipChatter(44100, beat), renderClipChatter(44100, beat), "Audio generation is deterministic");

const calls = [];
const voice = { connect: () => calls.push(["connect"]), disconnect: () => calls.push(["disconnect"]), start: () => calls.push(["start"]), stop: (at) => calls.push(["stop", at]) };
const context = { state: "running", currentTime: 5, sampleRate: 44100, destination: {}, createBufferSource: () => voice, createBuffer: (channels, length, rate) => ({ copyToChannel: (data, channel) => calls.push(["buffer", channels, length, rate, data.length, channel]) }) };
playClipChatter(context, beat);
assert.equal(calls.filter(([action]) => action === "start").length, 1);
assert.ok(calls.some(([action, at]) => action === "stop" && at > 5 && at < 5.2));
assert.ok(calls.some(([action, channels, length, rate, dataLength, channel]) => action === "buffer" && channels === 1 && length === dataLength && rate === 44100 && channel === 0));
voice.onended();
assert.equal(calls.filter(([action]) => action === "disconnect").length, 1, "Each syllable releases its audio source");
const count = calls.length;
playClipChatter({ ...context, state: "suspended" }, beat);
playClipChatter(context, null);
assert.equal(calls.length, count, "Muted or silent playback creates no sound");
console.log("Clip workflow checks passed: automatic stages, speaker framing, captions, and synthesized vocal sounds.");
