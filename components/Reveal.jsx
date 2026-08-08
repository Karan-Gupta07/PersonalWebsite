'use client';

import { useEffect, useRef, useState } from 'react';

// Reveal-on-scroll that cannot hide content.
//
// Phases: 'off' renders no class at all, so the server HTML is fully
// visible without JavaScript, for crawlers, and if this effect never
// runs. On mount we move to 'hidden' only for elements already below
// the fold, so nothing the visitor can see is hidden after paint.
//
// className is derived from state alone. Mutating classList here
// instead would race React's next render, which would overwrite the
// class and leave the element permanently invisible.
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [phase, setPhase] = useState('off');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || el.getBoundingClientRect().top <= window.innerHeight) return undefined;

    setPhase('hidden');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase('shown');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [
    phase === 'hidden' ? 'reveal' : '',
    phase === 'shown' ? 'reveal in' : '',
    className,
  ].filter(Boolean).join(' ');

  return <Tag ref={ref} className={cls} {...rest}>{children}</Tag>;
}
