import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { projects, experience, profile, awards } from "./app/content.mjs";
import "./robot-scenes.check.mjs";
import "./demos.check.mjs";

const resumeDigest =
  "c78ccf802e468c0ad8a6324ba1e5884526f88cd7bf831a73f3cf9962cf48fc0f";
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
assert.equal(projects.length, 8);
assert.equal(experience.length, 8);
assert.equal(new Set(experience.map((job) => job.slug)).size, experience.length);
for (const job of experience) assert.match(job.slug, /^[a-z0-9-]+$/);
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
assert.equal(profile.resumeUpdated, "2026-10-06");
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
for (const project of projects) {
  for (const url of Object.values(project.links || {})) assert.equal(new URL(url).protocol, "https:");
  if (project.video) assert.match(project.video, /^[\w-]{11}$/);
}
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
  for (const section of ["main", "overview", "projects", "experience", "personnel", "contact"])
    assert.ok(html.includes(`id="${section}"`), `Missing section: ${section}`);
  assert.match(html, /<h1[^>]*>Karan Gupta<\/h1>/);
  assert.ok(
    html.indexOf('id="experience"') < html.indexOf('id="projects"'),
    "Experience should appear before projects",
  );
  assert.ok(html.includes('class="site-shell site-shell--home"'));
  assert.ok(html.includes('class="pixel-feedback"'));
  for (const kind of ["clips", "warehouse", "mission", "clean", "repair", "pipeline", "guardrail"])
    assert.ok(html.includes(`data-robot-preview="${kind}"`));
  assert.match(html, /<dt>Now<\/dt>.*?Overlap.*?Wat.ai/s);
  assert.match(html, /<dt>Previously<\/dt>.*?Amazon.*?Manulife/s);
  assert.doesNotMatch(
    html,
    /<details\b|<dialog\b|COMMAND DECK|PERSONNEL FILE|ENGINEERING ARCHIVE|EVANGELION|motion-toggle|radial-system/,
  );
  for (const project of projects.slice(0, 3))
    assert.ok(html.includes(`href="/project/${project.slug}"`), project.slug);
  assert.ok(html.includes('href="/projects"'));
  assert.ok(html.includes('href="/about"'));
  for (const job of experience.slice(0, 4))
    assert.ok(html.includes(`href="/experience/${job.slug}"`), job.company);
  const about = await fetch(new URL("/about", base));
  assert.equal(about.status, 200);
  const aboutHtml = await about.text();
  assert.ok(aboutHtml.includes('id="stack"'));
  assert.ok(aboutHtml.indexOf('id="outside"') < aboutHtml.indexOf('id="overview"'), "Outside of work comes before the overview");
  for (const job of experience)
    assert.ok(aboutHtml.includes(`href="/experience/${job.slug}"`), job.company);
  const archive = await fetch(new URL("/projects", base));
  assert.equal(archive.status, 200);
  const archiveHtml = await archive.text();
  for (const project of projects)
    assert.ok(archiveHtml.includes(`href="/project/${project.slug}"`), project.slug);
  for (const url of [profile.resume, ...Object.values(profile.links)])
    assert.ok((html + aboutHtml).includes(`href="${url}"`), `Missing link: ${url}`);
  assert.ok(html.includes(`href="mailto:${profile.email}"`));
  for (const job of experience) {
    const response = await fetch(new URL(`/experience/${job.slug}`, base));
    assert.equal(response.status, 200, job.company);
    const content = await response.text();
    assert.ok(content.includes(job.company), job.company);
    assert.ok(content.includes(job.date), job.company);
    assert.ok(content.includes('href="/#experience"'), job.company);
    assert.equal(content.includes('data-robot-demo="warehouse"'), job.slug === "amazon");
    const demo = { overlap: "clips", manulife: "pipeline", "wat-ai": "guardrail" }[job.slug];
    if (demo) assert.ok(content.includes(`data-demo="${demo}"`), job.company);
    if (job.slug === "amazon") {
      assert.ok(content.includes("Not Amazon’s production system"));
      assert.ok(content.includes("every Amazon fulfillment center worldwide"));
      assert.ok(content.indexOf("every Amazon fulfillment center worldwide") < content.indexOf('data-robot-demo="warehouse"'));
    }
  }
  for (const project of projects) {
    const response = await fetch(new URL(`/project/${project.slug}`, base));
    assert.equal(response.status, 200, project.slug);
    const content = await response.text();
    assert.ok(content.includes(project.title), project.slug);
    assert.ok(content.includes("About this project"), project.slug);
    assert.equal(content.includes('data-robot-demo="mission"'), project.slug === "dominiq");
    if (project.slug === "dominiq") assert.ok(content.includes("not a recording of DominIQ"));
    for (const url of Object.values(project.links || {})) assert.ok(content.includes(`href="${url}"`), `${project.slug} link ${url}`);
    assert.doesNotMatch(content, /Ask me about this project/);
    assert.equal(content.includes("Watch the demo video"), Boolean(project.video), project.slug);
    const demo = { "mr-clean": "clean", "dread-director": "dread", reparo: "repair", silhouette: "tailor", deliriumwatch: "ward", "ai-admissions": "admissions", "spotify-pi": "music" }[project.slug];
    if (demo) assert.ok(content.includes(`data-demo="${demo}"`), project.slug);
    if (project.slug === "deliriumwatch") assert.ok(content.includes("not a diagnosis or a delirium probability"));
    if (project.slug === "ai-admissions") assert.ok(content.includes("not admissions outcomes or acceptance odds"));
    if (project.slug === "spotify-pi") {
      assert.ok(content.includes("not an audio broadcast"));
      assert.doesNotMatch(content, /<iframe\b/);
    }
    assert.equal(
      content.includes('class="project-metrics"'),
      project.metrics.length > 0,
      project.slug,
    );
    assert.ok(
      content.includes('href="/projects"'),
      `Missing return link: ${project.slug}`,
    );
    const next = projects[(projects.indexOf(project) + 1) % projects.length];
    assert.ok(content.includes(`href="/project/${next.slug}"`), project.slug);
  }
  const missing = await fetch(new URL("/project/missing-record", base));
  assert.equal(missing.status, 404);
  const missingJob = await fetch(new URL("/experience/missing-role", base));
  assert.equal(missingJob.status, 404);
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
