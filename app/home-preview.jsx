"use client";

import { useEffect, useState } from "react";
import RobotDemo, { CleanPreview } from "./robot-demo";
import { StoryDemo, MonitoringDemo, GuardrailDemo, ClipDemo } from "./project-demos";

export default function HomePreview() {
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const home = document.querySelector(".site-shell--home");
    const viewport = window.matchMedia("(min-width: 901px)");
    const resize = () => setAvailable(viewport.matches);
    resize();
    viewport.addEventListener("change", resize);
    const kind = (target) => target instanceof Element ? target.closest("[data-robot-preview]")?.dataset.robotPreview || null : null;
    const over = (event) => setHovered(kind(event.target));
    const out = (event) => setHovered(kind(event.relatedTarget));
    const focus = (event) => setFocused(kind(event.target));
    const blur = (event) => setFocused(kind(event.relatedTarget));
    const clear = () => { setHovered(null); setFocused(null); };
    home.addEventListener("pointerover", over);
    home.addEventListener("pointerout", out);
    home.addEventListener("focusin", focus);
    home.addEventListener("focusout", blur);
    window.addEventListener("blur", clear);
    return () => {
      home.removeEventListener("pointerover", over);
      home.removeEventListener("pointerout", out);
      home.removeEventListener("focusin", focus);
      home.removeEventListener("focusout", blur);
      window.removeEventListener("blur", clear);
      viewport.removeEventListener("change", resize);
    };
  }, []);

  const kind = hovered || focused;
  const content = {
    warehouse: <RobotDemo kind="warehouse" key={kind} preview />,
    mission: <RobotDemo kind="mission" key={kind} preview />,
    repair: <StoryDemo kind="repair" key={kind} preview />,
    pipeline: <MonitoringDemo kind="pipeline" key={kind} preview />,
    guardrail: <GuardrailDemo key={kind} preview />,
    clips: <ClipDemo key={kind} preview />,
    clean: <CleanPreview key={kind} />,
  }[kind];
  return available && content ? <div className="home-preview" aria-hidden="true">{content}</div> : null;
}
