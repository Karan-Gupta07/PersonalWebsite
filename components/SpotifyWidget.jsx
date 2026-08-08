'use client';

import { useEffect, useState } from 'react';

// Live now-playing line. Renders nothing until the API answers with
// a track, so a missing Spotify credential is invisible rather than
// a broken widget.
export default function SpotifyWidget() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch('/api/spotify');
        if (!res.ok) return;
        const json = await res.json();
        if (alive) setData(json);
      } catch {
        /* offline or unconfigured: stay silent */
      }
    }
    load();
    const id = setInterval(load, 30000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  if (!data?.title) return null;

  return (
    <div className="row nowplaying">
      <span className="meta">{data.isPlaying ? 'Now playing' : 'Last played'}</span>
      <span className="v">
        {data.songUrl
          ? <a href={data.songUrl} target="_blank" rel="noopener noreferrer">{data.title}</a>
          : data.title}
        {data.artist ? <i>{data.artist}</i> : null}
      </span>
    </div>
  );
}
