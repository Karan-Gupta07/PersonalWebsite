"use client";

import { useEffect, useId, useRef, useState } from "react";
import { spotifyEmbedUrl, nextTrackIndex } from "../app/demo-data.mjs";

export default function SpotifyWidget() {
  const id = useId();
  const audio = useRef(null);
  const objectUrls = useRef([]);
  const continuePlayback = useRef(false);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState("spotify");
  const [listening, setListening] = useState(null);
  const [connection, setConnection] = useState("loading");
  const [sample, setSample] = useState(false);
  const [embeddedUrl, setEmbeddedUrl] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [index, setIndex] = useState(0);
  const [volume, setVolume] = useState(.35);
  const [loop, setLoop] = useState(true);
  const [notice, setNotice] = useState("");
  const current = tracks[index];
  const hasTrack = Boolean(current);
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
        const response = await fetch("/api/spotify", { signal: controller.signal });
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
    const timer = setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => { disposed = true; controller?.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, []);

  useEffect(() => () => objectUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);
  useEffect(() => { const element = audio.current; return () => element?.pause(); }, [source, hasTrack]);
  useEffect(() => { if (audio.current) audio.current.volume = volume; }, [volume, source, current?.src]);

  function chooseSource(next) {
    audio.current?.pause();
    continuePlayback.current = false;
    setEmbeddedUrl(null);
    setSource(next);
  }

  function chooseFiles(event) {
    const selected = [...(event.target.files || [])];
    if (!selected.length) return;
    const files = selected.filter((file) => file.type.startsWith("audio/") || /\.(mp3|m4a|ogg|wav|flac|opus)$/i.test(file.name)).slice(0, 15);
    if (!files.length) { setNotice("Choose a supported audio file such as MP3, WAV, or Ogg."); return; }
    audio.current?.pause();
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    const next = files.map((file) => ({ title: file.name.replace(/\.[^.]+$/, ""), src: URL.createObjectURL(file) }));
    objectUrls.current = next.map((track) => track.src);
    continuePlayback.current = false;
    setTracks(next);
    setIndex(0);
    setNotice(`${next.length} local ${next.length === 1 ? "track" : "tracks"} ready${selected.length > 15 ? " (first 15 files)" : ""}. Nothing is uploaded.`);
  }

  function changeTrack(next, resume = false) {
    if (next === null) return;
    continuePlayback.current = resume;
    setIndex(next);
    setNotice("");
  }

  function loaded() {
    if (!continuePlayback.current) return;
    continuePlayback.current = false;
    audio.current?.play().catch((error) => {
      if (error.name !== "AbortError") setNotice("Press play to continue; the browser blocked automatic playback.");
    });
  }

  const status = listening ? listening.isPlaying ? "Now playing on Spotify" : "Last played on Spotify" : sample ? "Sample display — not live" : connection === "loading" ? "Checking listening status" : "Spotify not connected / no track available";
  return (
    <section className="interactive-demo music-demo" data-demo="music" aria-label="Spotify Pi player prototype">
      <div className="demo-heading"><h2>A little player for the desk</h2><span>Player prototype</span></div>
      <div className="scenario-picker" aria-label="Audio source">
        <button disabled={!ready} aria-pressed={source === "spotify"} onClick={() => chooseSource("spotify")}>Spotify status</button>
        <button disabled={!ready} aria-pressed={source === "local"} onClick={() => chooseSource("local")}>Local playlist</button>
      </div>
      <div className="music-hardware">
        <div className="music-device-label"><span>PI / AUDIO</span><span>{source === "spotify" ? "SPOTIFY" : "LOCAL"}</span></div>
        {source === "spotify" ? (
          <>
            {embeddedUrl ? <iframe className="spotify-embed" src={embeddedUrl} title="Official Spotify player" height="152" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="no-referrer" /> : (
              <div className="music-screen">
                {display?.albumArt ? <img className="music-art" src={display.albumArt} alt={display.album} width="72" height="72" referrerPolicy="no-referrer" /> : <svg className="music-art" viewBox="0 0 64 64" aria-hidden="true" shapeRendering="crispEdges"><path d="M8 8h48v48H8Z" fill="#252525" /><path d="M34 15h13v7H34v25H21v-9h7V18h6Z" fill="#bdbdbd" /></svg>}
                <div><p className="music-status">{status}</p><strong>{display?.title || "Your listening, here."}</strong><p>{display?.artist || "Connect Spotify, or try a local audio file."}</p></div>
              </div>
            )}
          </>
        ) : (
          <div className="music-screen local-screen"><p className="music-status">{hasTrack ? `Track ${index + 1} of ${tracks.length} · local preview` : "Local playlist preview"}</p><strong>{current?.title || "No local tracks added."}</strong><p>Files stay in this browser.</p></div>
        )}
        {source === "local" && current && <audio ref={audio} controls preload="metadata" src={current.src} loop={loop && tracks.length === 1} onLoadedMetadata={loaded} onVolumeChange={(event) => setVolume(event.currentTarget.volume)} onEnded={() => changeTrack(nextTrackIndex(index, tracks.length, loop), true)} onError={() => setNotice("This file could not be played. Try another supported audio format.")}>Your browser does not support audio playback.</audio>}
      </div>
      {source === "spotify" ? (
        <>
          <div className="demo-controls">
            <button className="demo-primary" disabled={!ready || !embedUrl || embeddedUrl === embedUrl} onClick={() => setEmbeddedUrl(embedUrl)}>{embeddedUrl === embedUrl && embedUrl ? "Player open" : "Listen to this track"}</button>
            {embeddedUrl && <button className="demo-secondary" onClick={() => setEmbeddedUrl(null)}>Close player</button>}
            {!listening && <button className="demo-secondary" disabled={!ready} onClick={() => setSample(!sample)}>{sample ? "Hide sample display" : "Preview sample display"}</button>}
            {spotifyUrl && <a className="music-external" href={spotifyUrl} target="_blank" rel="noreferrer">Open in Spotify</a>}
          </div>
          <p className="demo-note">Status shows what Karan is listening to; it is not an audio broadcast. “Listen to this track” loads Spotify’s official player only when requested. Playback depends on Spotify and the listener’s account.</p>
          {!listening && <p className="demo-note" role="status">{connection === "loading" ? "Checking the existing Spotify connection…" : connection === "disconnected" ? "The site’s Spotify connection has not been configured yet." : connection === "unavailable" ? "Spotify is temporarily unavailable. Local audio is still available." : "No current or recent track is available from Spotify."}</p>}
        </>
      ) : (
        <>
          <label className="audio-file-label" htmlFor={`${id}-files`}>Choose up to 15 audio files to preview<input id={`${id}-files`} type="file" accept="audio/*,.mp3,.m4a,.ogg,.wav,.flac,.opus" multiple disabled={!ready} onChange={chooseFiles} /></label>
          {hasTrack && <div className="local-audio-options">
            <label htmlFor={`${id}-track`}>Track<select id={`${id}-track`} value={index} onChange={(event) => changeTrack(Number(event.target.value), !audio.current?.paused)}>{tracks.map((track, i) => <option key={track.src} value={i}>{track.title}</option>)}</select></label>
            <label htmlFor={`${id}-volume`}>Volume {Math.round(volume * 100)}%<input id={`${id}-volume`} aria-label="Volume" type="range" min="0" max="1" step=".01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>
            <label className="loop-option"><input type="checkbox" checked={loop} onChange={(event) => setLoop(event.target.checked)} />Loop playlist</label>
            <div className="demo-controls"><button className="demo-secondary" disabled={tracks.length < 2} onClick={() => changeTrack((index + tracks.length - 1) % tracks.length, !audio.current?.paused)}>Previous track</button><button className="demo-secondary" disabled={tracks.length < 2} onClick={() => changeTrack((index + 1) % tracks.length, !audio.current?.paused)}>Next track</button></div>
          </div>}
          <p className="demo-note" role="status">{notice || "Nothing autoplays. Local files are not uploaded or stored by the site. A shared playlist can be added once publishable audio files are supplied."}</p>
        </>
      )}
      <noscript><p className="demo-note">The player prototype requires JavaScript. No audio is loaded automatically.</p></noscript>
    </section>
  );
}
