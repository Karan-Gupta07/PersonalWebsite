import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { projects, experience, profile, awards } from "./app/content.mjs";

const resumeDigest =
  "56d1c69d0e122302f3db1231facd39637668cbcd3f8e7fe497cd892e19d303ac";
assert.equal(
  createHash("sha256")
    .update(
      await readFile(new URL("./public/KaranGuptaResume.pdf", import.meta.url)),
    )
    .digest("hex"),
  resumeDigest,
);

assert.equal(
  new Set(projects.map((project) => project.slug)).size,
  projects.length,
);
assert.equal(projects.length, 7);
assert.equal(experience.length, 8);
assert.equal(awards.length, 8);
assert.equal(experience[0].company, "Overlap");
assert.equal(experience[0].current, true);
assert.equal(
  experience.find((job) => job.company === "Amazon").date,
  "May 2026 — Aug 2026",
);
assert.ok(!experience.find((job) => job.company === "Amazon").current);
assert.ok(projects.some((project) => project.slug === "dominiq"));
assert.ok(projects.some((project) => project.slug === "mr-clean"));
assert.equal(profile.resumeUpdated, "2026-10-01");
for (const project of projects) {
  assert.match(project.slug, /^[a-z0-9-]+$/);
  assert.ok(project.paragraphs.length && project.stack.length);
  assert.ok(project.flow.length >= 2);
  assert.equal(project.flowLabels.length, project.flow.length);
  assert.ok(Array.isArray(project.metrics));
  assert.ok(
    project.metrics.every((metric) => metric.label && /\d/.test(metric.value)),
  );
  assert.ok(project.metrics.every((metric) => !/^0[1-3]$/.test(metric.value)));
}
assert.equal(
  projects.find((project) => project.slug === "ai-admissions").metrics.length,
  0,
);
assert.equal(
  projects.find((project) => project.slug === "spotify-pi").metrics.length,
  2,
);
assert.equal(
  projects.find((project) => project.slug === "reparo").flow.length,
  4,
);
for (const url of Object.values(profile.links))
  assert.equal(new URL(url).protocol, "https:");
assert.match(
  projects.find((project) => project.slug === "deliriumwatch").summary,
  /simulated testing/,
);

if (process.argv[2]) {
  const base = new URL(process.argv[2]);
  const home = await fetch(base);
  assert.equal(home.status, 200);
  const html = await home.text();
  for (const section of [
    "main",
    "overview",
    "projects",
    "experience",
    "personnel",
    "contact",
    "stack",
  ])
    assert.ok(html.includes(`id="${section}"`), `Missing section: ${section}`);
  assert.ok(html.includes("KARAN"));
  assert.doesNotMatch(
    html,
    /NOT A SIMULATION|DESIGNED WITH INTENT|AWAITING INPUT|DISPLAY OSCILLATOR|HUMAN INTENT/,
  );
  for (const project of projects) {
    const response = await fetch(new URL(`/project/${project.slug}`, base));
    assert.equal(response.status, 200, project.slug);
    const content = await response.text();
    assert.ok(content.includes(project.title), project.slug);
    assert.ok(content.includes("IMPLEMENTATION RECORD"), project.slug);
    assert.equal(
      content.includes('class="project-metrics"'),
      project.metrics.length > 0,
      project.slug,
    );
    assert.ok(
      content.includes(`/?project=${project.slug}#projects`),
      `Missing return selection: ${project.slug}`,
    );
  }
  const missing = await fetch(new URL("/project/missing-record", base));
  assert.equal(missing.status, 404);
  const resume = await fetch(new URL(profile.resume, base));
  assert.equal(resume.status, 200);
  assert.match(resume.headers.get("content-type"), /pdf/);
  assert.equal(
    createHash("sha256")
      .update(Buffer.from(await resume.arrayBuffer()))
      .digest("hex"),
    resumeDigest,
  );
}
console.log(
  "Portfolio checks passed: content integrity, project schemas, and requested HTTP routes.",
);
