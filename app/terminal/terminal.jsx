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

// Each tool returns a timeline: [{ at: ms, line, replace }]. `replace` overwrites the last line (animation).
const typed = (lines, gap = 250, last = 800) => { let at = 0; return lines.map((line, i) => ({ at: at += i === lines.length - 1 ? last : gap, line })); };
const art = (text) => <span className="terminal-art">{text}</span>;

const neofetchLogo = [" _          ", "| | ____ _  ", "| |/ / _` | ", "|   < (_| | ", "|_|\\_\\__, | ", "     |___/  ", "            ", "            "];
const neofetch = () => {
  const info = ["karan@site", "----------", "OS: kg.site (Next.js 15)", "Host: NZXT H6 Flow", "CPU: Intel i5-13600KF", "GPU: AMD RX 9070 XT", "Memory: Vengeance DDR5 7000MHz CL34", "Keyboard: Wooting 60HE / GMMK Pro"];
  return art(info.map((line, i) => `${neofetchLogo[i]}  ${line}`).join("\n"));
};

const train = ["      ====        ________", "  _D _|  |_______/        \\__I_I_____", "   |(_)---  |   H\\________/ |   |", "   /     |  |   H  |  |     |   |", "  |      |  |   H  |__-----------------|", "  | ________|___H__/__|_____/[][]~\\_____|", "  |/ |   |-----------I_____I [][] []  D |", "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ___Y__|", " |/-=|___|=    ||    ||    ||    |_____/", "  \\_/      \\O=====O=====O=====O_/"];
const WIDTH = 60;
// Slide the train right to left through a WIDTH-column window.
const trainFrame = (offset) => train.map((row) => (" ".repeat(Math.max(0, offset)) + row.slice(Math.max(0, -offset))).slice(0, WIDTH).trimEnd()).join("\n");
const sl = () => {
  const frames = [];
  for (let offset = WIDTH, at = 0; offset > -42; offset -= 2) frames.push({ at: at += 40, line: art(trainFrame(offset)), replace: frames.length > 0 });
  return [...frames, { at: frames.at(-1).at + 40, line: "(you meant ls)", replace: true }];
};

async function nowPlaying() {
  try {
    const response = await fetch("/api/spotify", { cache: "no-store" });
    const data = response.ok ? await response.json() : null;
    if (!data) return "spotify: could not reach Spotify.";
    if (typeof data.title !== "string" || !data.title) return "Nothing playing right now.";
    const song = `${data.title}${typeof data.artist === "string" ? ` - ${data.artist}` : ""}`;
    return data.isPlaying ? `Now playing: ${song}` : `Last played: ${song}`;
  } catch { return "spotify: could not reach Spotify."; }
}

const blame = ["e6671bc (karan 2026-07-29) const sleep = null;", "3f44af9 (karan 2026-10-07) // it works on my machine", "fa9a5ad (karan 2026-10-07) scrollbar.length += 120; // a bit longer", "5478617 (karan 2026-10-07) removeEmDashes();", "Every line is karan’s fault."];

const hackLines = (target) => ["Initializing proxy network...", `Bypassing mainframe firewalls for ${target}...`, "Cracking RSA-2048 encryption keys...", "Injecting payloads...", "Access token intercepted.", "Routing through secondary subnets...", <strong key="granted" className="terminal-accent">Access granted.</strong>];

// Returns output lines for a command, or an action the terminal runs itself.
function run(input, router) {
  const command = input.toLowerCase();
  const [name, ...rest] = command.split(/\s+/);
  const argument = rest.join(" ");
  if (favourites[command]) return [favourites[command]];
  switch (name) {
    case "help": case "!help":
      return ["whoami, ls, cd [page], projects, open [project], resume, contact, neofetch, spotify, sound [on|off], clear", "!game, !movie, !artist, !song, !manga, !pc, !keyboard, !anime, !socials, !github"];
    case "whoami": {
      const now = experience.filter((job) => job.current && job.slug !== "custom-keyboards").map((job) => job.company.toLowerCase());
      return [`karan, software engineer @ ${now.join(" / ")}`];
    }
    case "ls":
      if (argument === "~/manga" || argument === "manga") return ["homunculus/  vagabond/"];
      if (argument && argument !== "~") return [`ls: ${argument}: No such file or directory`];
      return [Object.keys(pages).map((page) => `${page}/`).join("  ") + "  manga/  resume.pdf"];
    case "neofetch": return [neofetch()];
    case "spotify": return { pending: nowPlaying() };
    case "git": return argument === "blame" ? blame : ["git: this terminal is read-only. Try git blame."];
    case "sl": return { timeline: sl() };
    case "exit": case "logout": return { timeline: typed(["logout", "Connection to karan@site closed."], 0, 500), after: () => router.push("/") };
    case "sound":
      if (argument !== "on" && argument !== "off") return ["usage: sound on | sound off"];
      return { sound: argument === "on" };
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
    case "hack": return { timeline: typed(hackLines(input.slice(5).trim() || "localhost")) };
    default:
      if (command === "rm -rf /") return ["Nice try. Deleting production database in 3... 2... 1..."];
      return [`command not found: ${input}. Type help.`];
  }
}

// A short synthesized key press: filtered noise for the click, a low sine for the thock.
// Tuned toward lubed linears (Banana Splits on the GMMK Pro); space and enter sound deeper.
function clack(ctx, heavy) {
  const now = ctx.currentTime;
  const length = heavy ? .06 : .035;
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * length), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 4;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = (heavy ? 1100 : 2200) * (.85 + Math.random() * .3);
  const click = ctx.createGain();
  click.gain.value = heavy ? .28 : .2;
  noise.connect(filter).connect(click).connect(ctx.destination);
  const body = ctx.createOscillator();
  body.frequency.value = heavy ? 110 : 170 + Math.random() * 30;
  const thock = ctx.createGain();
  thock.gain.setValueAtTime(heavy ? .25 : .15, now);
  thock.gain.exponentialRampToValueAtTime(.001, now + length * 1.5);
  body.connect(thock).connect(ctx.destination);
  noise.start(now);
  body.start(now);
  body.stop(now + length * 1.5);
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
  const [sound, setSound] = useState(false);
  const audio = useRef(null);

  useEffect(() => { screen.current.scrollTop = screen.current.scrollHeight; }, [lines]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => setSound(localStorage.getItem("terminal-sound") === "on"), []);

  function toggleSound(on) {
    setSound(on);
    localStorage.setItem("terminal-sound", on ? "on" : "off");
    if (on) { audio.current ??= new AudioContext(); audio.current.resume(); clack(audio.current, false); }
  }

  function print(lines, prompt) { setLines((list) => [...list, ...(prompt ? [prompt] : []), ...lines.map((text) => ({ text }))]); }
  function release() { setBusy(false); setTimeout(() => input.current?.focus(), 0); }

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
    if (Array.isArray(result)) return print(result, prompt);
    if ("sound" in result) { toggleSound(result.sound); return print([`Key sounds ${result.sound ? "on" : "off"}.`], prompt); }
    print([], prompt);
    setBusy(true);
    if (result.pending) { result.pending.then((line) => { print([line]); release(); }); return; }
    result.timeline.forEach(({ at, line, replace }, i) => {
      timers.current.push(setTimeout(() => {
        setLines((list) => [...(replace ? list.slice(0, -1) : list), { text: line }]);
        if (i < result.timeline.length - 1) return;
        if (result.after) timers.current.push(setTimeout(result.after, 700));
        else release();
      }, at));
    });
  }

  function keyDown(event) {
    if (sound && audio.current && !event.repeat && !event.metaKey && !event.ctrlKey && (event.key.length === 1 || event.key === "Backspace" || event.key === "Enter")) clack(audio.current, event.key === " " || event.key === "Enter");
    recall(event);
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
      <button type="button" className="terminal-sound" aria-pressed={sound} onClick={() => toggleSound(!sound)}>sound: {sound ? "on" : "off"}</button>
      <div className="terminal-screen" ref={screen} role="log" aria-live="polite">
        {lines.map((line, i) => <p key={i} className={line.prompt ? "terminal-prompt" : "terminal-output"}>{line.prompt && <span aria-hidden="true">karan@site:~$ </span>}{line.text}</p>)}
      </div>
      <form className="terminal-input" onSubmit={submit}>
        <label htmlFor="terminal-command"><span aria-hidden="true">karan@site:~$</span><span className="sr-only">Command</span></label>
        <input id="terminal-command" ref={input} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={keyDown} disabled={busy} autoComplete="off" autoCapitalize="off" spellCheck="false" autoFocus />
      </form>
    </section>
  );
}
