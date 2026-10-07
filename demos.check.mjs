import assert from "node:assert/strict";
import { stories, fitProfile, roomSamples, roomFlags, faceReadout, pipelineSamples, pipelineFlags, matchApplicants, guardrailCases, checkAgentTrace, spotifyEmbedUrl, longVideo, sampleFrames, directorCue, nightStep, swing, NIGHT_SECONDS, actionShare, topClips, timestamp } from "./app/demo-data.mjs";

for (const story of Object.values(stories)) {
  assert.equal(story.steps.length, 4);
  assert.ok(story.steps.every((step) => step.title && step.text && step.action && step.speech.length));
}
assert.ok(["height", "chest", "shoulder", "sleeve"].every((key) => fitProfile[key] > 0));
assert.deepEqual(roomSamples.map((sample) => roomFlags(sample).length), [0, 3, 2, 1]);
assert.match(roomFlags(roomSamples[3])[0], /unavailable/);
assert.match(roomFlags({ ...roomSamples[0], light: NaN })[0], /unavailable/);
assert.deepEqual(roomSamples.slice(0, 3).map((sample) => faceReadout(sample).eyes), ["Closed", "Open, blinking often", "Half-open"]);
assert.equal(faceReadout(roomSamples[1]).blinks, 4);
assert.equal(faceReadout(roomSamples[3]), null);
assert.equal(pipelineFlags(pipelineSamples[0]).length, 0);
assert.equal(pipelineFlags(pipelineSamples[1]).length, 2);
assert.match(pipelineFlags(pipelineSamples[2])[0], /stale/);
assert.equal(matchApplicants("3.8", "1490", "Computer science")[0].name, "Example profile C");
assert.equal(matchApplicants(3.8, 1490, "Computer science")[0].similarity, 100);
for (const input of [["", 1400], [null, 1400], [true, 1400], [NaN, 1400], [5, 1400], [3.5, 1601], [3.5, ""]])
  assert.deepEqual(matchApplicants(...input, "Engineering"), []);
assert.deepEqual(matchApplicants(3.5, 1400, "Unknown"), []);
assert.ok(matchApplicants(0, 400, "Arts").every((profile) => profile.similarity >= 0 && profile.similarity <= 100));
assert.deepEqual(guardrailCases.map((sample) => checkAgentTrace(sample).passed), [true, false, false]);
assert.equal(checkAgentTrace({}).passed, false);
assert.equal(checkAgentTrace({ type: "permission", approved: true }).passed, true);
assert.match(checkAgentTrace(guardrailCases[1]).reason, /90 days.*30/);
const track = "A".repeat(22);
assert.equal(spotifyEmbedUrl(`https://open.spotify.com/track/${track}?si=example`), `https://open.spotify.com/embed/track/${track}?theme=0`);
for (const url of [null, "", "javascript:alert(1)", `https://open.spotify.com.evil.test/track/${track}`, `http://open.spotify.com/track/${track}`, "https://open.spotify.com/track/short"])
  assert.equal(spotifyEmbedUrl(url), null);

const budget = 72;
const uniform = sampleFrames(longVideo.motion, budget, false);
const adaptive = sampleFrames(longVideo.motion, budget, true);
assert.equal(uniform.reduce((a, b) => a + b), budget);
assert.ok(adaptive.reduce((a, b) => a + b) === budget && adaptive.every((n) => n >= 1), "Adaptive sampling stays in budget and covers every segment");
assert.ok(actionShare(adaptive, longVideo.motion) > actionShare(uniform, longVideo.motion) + 15);
assert.deepEqual(topClips(longVideo.motion), [13, 29, 30]);
assert.deepEqual(sampleFrames([10, 20], 1, true), [0, 0]);
assert.deepEqual(sampleFrames([0, 0], 5, true), [3, 2]);
assert.equal(sampleFrames([1, 2, 3], 10, true).reduce((a, b) => a + b), 10);
assert.equal(actionShare([0, 0], [90, 90]), 0);
assert.equal(timestamp(65), "1:05:00");

assert.deepEqual([60, 90, 130].map((bpm) => directorCue(bpm).cue), ["escalate", "build", "ease off"]);
const night = { closeness: 0, time: 0, hits: 0, misses: 0, over: null };
let calm = night;
for (let t = 0; t < 40; t++) calm = nightStep(calm, 65, 1);
assert.equal(calm.over, "caught", "Staying calm lets the creature reach you");
let panicked = night;
for (let t = 0; t < 40; t++) panicked = nightStep(panicked, 130, 1);
assert.deepEqual([panicked.over, panicked.closeness, panicked.time], ["dawn", 0, NIGHT_SECONDS]);
assert.equal(swing({ ...night, closeness: 80 }).closeness, 35);
assert.equal(swing({ ...night, closeness: 30 }).misses, 1);
assert.deepEqual(nightStep(calm, 130, 1), calm, "A finished night does not change");
