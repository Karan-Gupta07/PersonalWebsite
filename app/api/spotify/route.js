import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  });
  return res.json();
}

export async function GET() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 's-maxage=30, stale-while-revalidate=59',
  };

  // If environment variables are missing (e.g. locally during initial setup),
  // return gracefully rather than crashing.
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return NextResponse.json(
      { isPlaying: false, title: null, message: 'Spotify credentials missing' },
      { status: 200, headers }
    );
  }

  try {
    const { access_token } = await getAccessToken();

    // Try currently playing first
    const npRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (npRes.status === 200) {
      const song = await npRes.json();
      if (song && song.item) {
        return NextResponse.json(
          {
            isPlaying: song.is_playing,
            title: song.item.name,
            artist: song.item.artists.map((a) => a.name).join(', '),
            album: song.item.album.name,
            albumArt: song.item.album.images[0]?.url ?? null,
            songUrl: song.item.external_urls.spotify,
          },
          { status: 200, headers }
        );
      }
    }

    // Fall back to recently played
    try {
      const rpRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (rpRes.status === 200) {
        const data = await rpRes.json();
        const track = data.items?.[0]?.track;
        if (track) {
          return NextResponse.json(
            {
              isPlaying: false,
              title: track.name,
              artist: track.artists.map((a) => a.name).join(', '),
              album: track.album.name,
              albumArt: track.album.images[0]?.url ?? null,
              songUrl: track.external_urls.spotify,
            },
            { status: 200, headers }
          );
        }
      }
    } catch (_) {
      // scope not granted — just return not playing
    }

    return NextResponse.json({ isPlaying: false, title: null }, { status: 200, headers });
  } catch (err) {
    console.error('Spotify API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500, headers });
  }
}
export const dynamic = 'force-dynamic';
