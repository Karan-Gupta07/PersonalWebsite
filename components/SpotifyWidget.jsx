"use client";

import { useEffect, useState } from "react";
import { spotifyEmbedUrl } from "../app/demo-data.mjs";

const POLL_MS = 10000;

export default function SpotifyWidget() {
  const [ready, setReady] = useState(false);
  const [listening, setListening] = useState(null);
  const [connection, setConnection] = useState("loading");
  const [sample, setSample] = useState(false);
  const [embeddedUrl, setEmbeddedUrl] = useState(null);
  const embedUrl = spotifyEmbedUrl(listening?.songUrl);
  const spotifyUrl = embedUrl?.replace("/embed/", "/").split("?")[0];
  const display = listening || (sample ? { title: "Example track", artist: "Example artist", album: "Sample display" } : null);

  useEffect(() => {
    let controller;
    let disposed = false;
    async function refresh() {
      if (document.hidden) return;
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch("/api/spotify", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Spotify unavailable");
        const data = await response.json();
        if (disposed) return;
        if (typeof data.title === "string" && data.title) {
          setListening({ title: data.title, artist: typeof data.artist === "string" ? data.artist : "Artist unavailable", album: typeof data.album === "string" ? data.album : "Album artwork", albumArt: typeof data.albumArt === "string" && /^https:\/\/(i|mosaic)\.scdn\.co\//.test(data.albumArt) ? data.albumArt : null, songUrl: data.songUrl, isPlaying: data.isPlaying === true });
          setConnection("connected");
        } else {
          setListening(null);
          setConnection(data.message === "Spotify credentials missing" ? "disconnected" : "quiet");
        }
      } catch (error) {
        if (error.name !== "AbortError" && !disposed) { setListening(null); setConnection("unavailable"); }
      }
    }
    setReady(true);
    refresh();
    const timer = setInterval(refresh, POLL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => { disposed = true; controller?.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, []);

  const status = listening ? listening.isPlaying ? "Now playing on Spotify" : "Last played on Spotify" : sample ? "Sample display — not live" : connection === "loading" ? "Checking listening status" : "Spotify not connected / no track available";
  return (
    <section className="interactive-demo music-demo" data-demo="music" aria-label="Spotify Pi player prototype">
      <div className="demo-heading"><h2>A little player for the desk</h2><span>Live status</span></div>
      <div className="music-hardware">
        <div className="music-device-label"><span>PI / AUDIO</span><span>SPOTIFY</span></div>
        {embeddedUrl ? <iframe className="spotify-embed" src={embeddedUrl} title="Official Spotify player" height="152" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="no-referrer" /> : (
          <div className="music-screen">
            {display?.albumArt ? <img className="music-art" src={display.albumArt} alt={display.album} width="72" height="72" referrerPolicy="no-referrer" /> : <svg className="music-art" viewBox="0 0 64 64" aria-hidden="true" shapeRendering="crispEdges"><path d="M8 8h48v48H8Z" fill="#252525" /><path d="M34 15h13v7H34v25H21v-9h7V18h6Z" fill="#bdbdbd" /></svg>}
            <div><p className="music-status">{status}</p><strong>{display?.title || "Your listening, here."}</strong><p>{display?.artist || "Nothing playing right now."}</p></div>
          </div>
        )}
      </div>
      <div className="demo-controls">
        <button className="demo-primary" disabled={!ready || !embedUrl || embeddedUrl === embedUrl} onClick={() => setEmbeddedUrl(embedUrl)}>{embeddedUrl === embedUrl && embedUrl ? "Player open" : "Listen to this track"}</button>
        {embeddedUrl && <button className="demo-secondary" onClick={() => setEmbeddedUrl(null)}>Close player</button>}
        {!listening && <button className="demo-secondary" disabled={!ready} onClick={() => setSample(!sample)}>{sample ? "Hide sample display" : "Preview sample display"}</button>}
        {spotifyUrl && <a className="music-external" href={spotifyUrl} target="_blank" rel="noreferrer">Open in Spotify</a>}
      </div>
      <p className="demo-note">Status shows what Karan is listening to, refreshed every 10 seconds; it is not an audio broadcast. “Listen to this track” loads Spotify’s official player only when requested. Playback depends on Spotify and the listener’s account.</p>
      {!listening && <p className="demo-note" role="status">{connection === "loading" ? "Checking the Spotify connection…" : connection === "disconnected" ? "The site’s Spotify connection has not been configured yet." : connection === "unavailable" ? "Spotify is temporarily unavailable." : "No current or recent track is available from Spotify."}</p>}
      <noscript><p className="demo-note">Live listening status requires JavaScript.</p></noscript>
    </section>
  );
}
