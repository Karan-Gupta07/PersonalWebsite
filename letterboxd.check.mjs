import assert from "node:assert/strict";
import { parseLastFilm, stars } from "./app/letterboxd.mjs";

const item = (fields) => `<rss><channel><item>${fields}</item><item><letterboxd:filmTitle>Older</letterboxd:filmTitle></item></channel></rss>`;
const film = parseLastFilm(item(`<link>https://letterboxd.com/exoxeon/film/primetime-2026/</link> <letterboxd:watchedDate>2026-10-03</letterboxd:watchedDate> <letterboxd:filmTitle>Tom &amp; Jerry</letterboxd:filmTitle> <letterboxd:filmYear>2026</letterboxd:filmYear> <letterboxd:memberRating>3.5</letterboxd:memberRating> <description><![CDATA[ <p><img src="https://a.ltrbxd.com/resized/x.jpg?v=1"/></p> ]]></description>`));
assert.deepEqual(film, { title: "Tom & Jerry", year: "2026", rating: "★★★½", score: 3.5, watched: "2026-10-03", link: "https://letterboxd.com/exoxeon/film/primetime-2026/", poster: "https://a.ltrbxd.com/resized/x.jpg?v=1" });

const hostile = parseLastFilm(item(`<link>javascript:alert(1)</link><letterboxd:filmTitle>X</letterboxd:filmTitle><letterboxd:filmYear>"><script></letterboxd:filmYear><description><![CDATA[<img src="https://evil.example/x.jpg"/>]]></description>`));
assert.equal(hostile.link, null, "Only Letterboxd links");
assert.equal(hostile.poster, null, "Only Letterboxd posters");
assert.equal(hostile.year, null);
assert.equal(hostile.rating, "", "Unrated diary entries show no stars");

assert.equal(parseLastFilm("<rss></rss>"), null);
assert.equal(parseLastFilm(item("<title>list entry</title>")), null, "Non-film items are skipped");
assert.deepEqual([5, 0.5, 1, 0, 7, NaN].map(stars), ["★★★★★", "½", "★", "", "", ""]);
console.log("Letterboxd checks passed.");
