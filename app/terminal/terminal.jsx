"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { profile, projects, experience } from "../content.mjs";

const external = (href, label) => <a href={href} target="_blank" rel="noreferrer">{label}</a>;
const pages = { home: "/", projects: "/projects", about: "/about", experience: "/about#experience" };

const favourites = {
  "!game": "Fav game: Elden Ring",
  "!movie": "Fav movie: 2001: A Space Odyssey",
  "!artist": "Fav artist: Osamason",
  "!song": "Fav song: Long Time - Playboi Carti",
  "!manga": "Fav manga: Homunculus or Vagabond",
  "!pc": "Rig: 9070 XT | 13600KF | Vengeance 7000MHz CL34 | NZXT H6 Flow",
  "!keyboard": "Gaming: Wooting 60HE in PSD60 | Typing: GMMK Pro, Tangerine v3 stabs, Banana Splits, Blue Gamrui GMK",
};
favourites["!keeb"] = favourites["!keyboard"];

const hackLines = (target) => ["Initializing proxy network...", `Bypassing mainframe firewalls for ${target}...`, "Cracking RSA-2048 encryption keys...", "Injecting payloads...", "Access token intercepted.", "Routing through secondary subnets...", <strong key="granted" className="terminal-accent">Access granted.</strong>];

// Returns output lines for a command, or an action the terminal runs itself.
function run(input, router) {
  const command = input.toLowerCase();
  const [name, ...rest] = command.split(/\s+/);
  const argument = rest.join(" ");
  if (favourites[command]) return [favourites[command]];
  switch (name) {
    case "help": case "!help":
      return ["whoami, ls, cd [page], projects, open [project], resume, contact, clear", "!game, !movie, !artist, !song, !manga, !pc, !keyboard, !anime, !socials, !github"];
    case "whoami": {
      const now = experience.filter((job) => job.current && job.slug !== "custom-keyboards").map((job) => job.company.toLowerCase());
      return [`karan — software engineer @ ${now.join(" / ")}`];
    }
    case "ls": return [Object.keys(pages).map((page) => `${page}/`).join("  ") + "  resume.pdf"];
    case "cd":
      if (!argument) return ["cd: missing destination"];
      if (!pages[argument.replace(/\/$/, "")]) return [`cd: no such directory: ${argument}`];
      router.push(pages[argument.replace(/\/$/, "")]);
      return [`Navigating to ${argument}...`];
    case "projects": return projects.map((project) => `${project.slug.padEnd(16)} ${project.short}`);
    case "open": {
      const project = projects.find((item) => item.slug === argument || item.title.toLowerCase() === argument);
      if (!project) return [argument ? `open: no project named ${argument}. Try projects.` : "open: which project? Try projects."];
      router.push(`/project/${project.slug}`);
      return [`Opening ${project.title}...`];
    }
    case "resume": window.open(profile.resume, "_blank", "noopener"); return ["Opening resume..."];
    case "contact": return [<>Email: <a href={`mailto:${profile.email}`}>{profile.email}</a></>];
    case "!anime": return [<>AniList: {external("https://anilist.co/user/Exoxeon/", "Exoxeon")}</>];
    case "!socials": return [<>Links: {external(profile.links.github, "GitHub")} | {external(profile.links.linkedin, "LinkedIn")} | {external(profile.links.letterboxd, "Letterboxd")}</>];
    case "!github": window.open(profile.links.github, "_blank", "noopener"); return ["Opening GitHub..."];
    case "sudo": return ["karan is not in the sudoers file. This incident will be reported."];
    case "vi": case "vim": return ["Bro this is a read-only terminal, I'm not trapped in vim again."];
    case "echo": if (argument === "$path") return [[...experience].reverse().filter((job) => job.slug !== "frc-8089").map((job) => job.company).join(" -> ")]; return [input.slice(5)];
    case "hack": return { hack: input.slice(5).trim() || "localhost" };
    default:
      if (command === "rm -rf /") return ["Nice try. Deleting production database in 3... 2... 1..."];
      return [`command not found: ${input}. Type help.`];
  }
}

export default function Terminal() {
  const router = useRouter();
  const input = useRef(null);
  const screen = useRef(null);
  const timers = useRef([]);
  const past = useRef(-1);
  const [value, setValue] = useState("");
  const [lines, setLines] = useState([{ text: 'Type "help" for a list of available commands.' }]);
  const [commands, setCommands] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { screen.current.scrollTop = screen.current.scrollHeight; }, [lines]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function submit(event) {
    event.preventDefault();
    const text = value.trim();
    if (!text || busy) return;
    setValue("");
    setCommands((list) => [...list, text]);
    past.current = -1;
    if (text.toLowerCase() === "clear") { setLines([]); return; }
    const result = run(text, router);
    const prompt = { prompt: true, text };
    if (!result.hack) { setLines((list) => [...list, prompt, ...result.map((line) => ({ text: line }))]); return; }
    setLines((list) => [...list, prompt]);
    setBusy(true);
    const steps = hackLines(result.hack);
    let delay = 0;
    steps.forEach((line, i) => {
      delay += i === steps.length - 1 ? 800 : 250;
      timers.current.push(setTimeout(() => {
        setLines((list) => [...list, { text: line }]);
        if (i === steps.length - 1) { setBusy(false); setTimeout(() => input.current?.focus(), 0); }
      }, delay));
    });
  }

  function recall(event) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (!commands.length) return;
    past.current = event.key === "ArrowUp" ? Math.min(past.current + 1, commands.length - 1) : Math.max(past.current - 1, -1);
    setValue(past.current < 0 ? "" : commands[commands.length - 1 - past.current]);
  }

  return (
    <section className="terminal" aria-label="Karan terminal" onClick={() => input.current?.focus()}>
      <div className="terminal-screen" ref={screen} role="log" aria-live="polite">
        {lines.map((line, i) => <p key={i} className={line.prompt ? "terminal-prompt" : "terminal-output"}>{line.prompt && <span aria-hidden="true">karan@site:~$ </span>}{line.text}</p>)}
      </div>
      <form className="terminal-input" onSubmit={submit}>
        <label htmlFor="terminal-command"><span aria-hidden="true">karan@site:~$</span><span className="sr-only">Command</span></label>
        <input id="terminal-command" ref={input} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={recall} disabled={busy} autoComplete="off" autoCapitalize="off" spellCheck="false" autoFocus />
      </form>
    </section>
  );
}
