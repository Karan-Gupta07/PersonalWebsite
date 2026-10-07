"use client";

import { useEffect, useRef } from "react";

export default function PixelFeedback() {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clear = () => {
      layer.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      layer.replaceChildren();
    };
    const burst = (x, y, count) => {
      if (motion.matches || document.hidden || layer.childElementCount > 48) return;
      for (let i = 0; i < count; i++) {
        const pixel = document.createElement("i");
        const angle = i * Math.PI * 2 / count + Math.random() * .4;
        const radius = (count > 4 ? 18 : 8) + Math.random() * 24;
        pixel.style.left = `${Math.round(x / 3) * 3}px`;
        pixel.style.top = `${Math.round(y / 3) * 3}px`;
        layer.appendChild(pixel);
        const animation = pixel.animate([
          { transform: `translate(${Math.round(Math.cos(angle) * 2) * 3}px, ${Math.round(Math.sin(angle) * 2) * 3}px)`, opacity: .9 },
          { transform: `translate(${Math.round(Math.cos(angle) * radius / 3) * 3}px, ${Math.round(Math.sin(angle) * radius / 3) * 3}px)`, opacity: 0 },
        ], { duration: count > 4 ? 520 : 320, easing: "cubic-bezier(.16, 1, .3, 1)" });
        animation.onfinish = animation.oncancel = () => pixel.remove();
      }
    };
    const click = (event) => {
      if (event.button === 0) burst(event.clientX, event.clientY, 14);
    };
    const hover = (event) => {
      const link = event.target instanceof Element && event.target.closest("a, button:not(:disabled)");
      if (link && !link.contains(event.relatedTarget)) burst(event.clientX, event.clientY, 4);
    };
    const focus = (event) => {
      if (event.target.matches("a:focus-visible, button:focus-visible")) {
        const rect = event.target.getBoundingClientRect();
        burst(rect.left - 5, rect.top + rect.height / 2, 4);
      }
    };
    document.addEventListener("pointerdown", click, { passive: true });
    document.addEventListener("pointerover", hover, { passive: true });
    document.addEventListener("focusin", focus);
    document.addEventListener("visibilitychange", clear);
    motion.addEventListener("change", clear);
    return () => {
      document.removeEventListener("pointerdown", click);
      document.removeEventListener("pointerover", hover);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("visibilitychange", clear);
      motion.removeEventListener("change", clear);
      clear();
    };
  }, []);

  return <div className="pixel-feedback" ref={layerRef} aria-hidden="true" />;
}
