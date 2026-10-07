// Latest diary entry from the public Letterboxd RSS feed. Server-only; cached for an hour.
const FEED = "https://letterboxd.com/exoxeon/rss/";

const decode = (text) => text.replace(/&(amp|lt|gt|quot|#39|apos);/g, (_, name) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'" })[name]);
const tag = (item, name) => item.match(new RegExp(`<${name}>([^<]*)</${name}>`))?.[1]?.trim();

export function stars(rating) {
  if (!Number.isFinite(rating) || rating <= 0 || rating > 5) return "";
  return "★".repeat(Math.floor(rating)) + (rating % 1 ? "½" : "");
}

// Feed text is untrusted: only accept Letterboxd links and posters, and plain-text fields.
export function parseLastFilm(xml) {
  const item = xml.match(/<item>([\s\S]*?)<\/item>/)?.[1];
  const title = item && tag(item, "letterboxd:filmTitle");
  if (!title) return null;
  const link = tag(item, "link");
  const poster = item.match(/<img src="([^"]+)"/)?.[1];
  const year = tag(item, "letterboxd:filmYear");
  const score = Number(tag(item, "letterboxd:memberRating"));
  return {
    title: decode(title),
    year: /^\d{4}$/.test(year ?? "") ? year : null,
    rating: stars(score),
    score: stars(score) ? score : null,
    watched: /^\d{4}-\d{2}-\d{2}$/.test(tag(item, "letterboxd:watchedDate") ?? "") ? tag(item, "letterboxd:watchedDate") : null,
    link: link?.startsWith("https://letterboxd.com/") ? link : null,
    poster: poster?.startsWith("https://a.ltrbxd.com/") ? decode(poster) : null,
  };
}

export async function lastFilm() {
  try {
    const response = await fetch(FEED, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    return response.ok ? parseLastFilm(await response.text()) : null;
  } catch {
    return null;
  }
}
