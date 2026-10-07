import assert from "node:assert/strict";
import { stories, fittingProfiles, roomSamples, roomFlags, pipelineSamples, pipelineFlags, matchApplicants, guardrailCases, checkAgentTrace, spotifyEmbedUrl, nextTrackIndex } from "./app/demo-data.mjs";

for (const story of Object.values(stories)) {
  assert.equal(story.steps.length, 4);
  assert.ok(story.steps.every((step) => step.title && step.text && step.action && step.speech.length));
}
assert.ok(fittingProfiles.every((profile) => profile.height > 0 && profile.chest > 0 && profile.shoulder > 0 && profile.sleeve > 0));
assert.equal(roomFlags(roomSamples[0]).length, 0);
assert.equal(roomFlags(roomSamples[1]).length, 3);
assert.match(roomFlags(roomSamples[2])[0], /unavailable/);
assert.match(roomFlags({ online: true, light: NaN, noise: 0 })[0], /unavailable/);
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
assert.equal(nextTrackIndex(0, 3, false), 1);
assert.equal(nextTrackIndex(2, 3, true), 0);
assert.equal(nextTrackIndex(2, 3, false), null);
assert.equal(nextTrackIndex(0, 0, true), null);
assert.equal(nextTrackIndex(-1, 3, true), null);
assert.equal(nextTrackIndex(0, 1, true), 0);
