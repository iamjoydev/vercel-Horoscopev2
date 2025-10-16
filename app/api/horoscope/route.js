import { DateTime } from "luxon";
import * as Astronomy from "astronomy-engine";

export const runtime = "nodejs"; // ensure Node runtime on Vercel

const SIGNS = [
  "à¦®à§‡à¦·","à¦¬à§ƒà¦·","à¦®à¦¿à¦¥à§à¦¨","à¦•à¦°à§à¦•à¦Ÿ","à¦¸à¦¿à¦‚à¦¹","à¦•à¦¨à§à¦¯à¦¾",
  "à¦¤à§à¦²à¦¾","à¦¬à§ƒà¦¶à§à¦šà¦¿à¦•","à¦§à¦¨à§","à¦®à¦•à¦°","à¦•à§à¦®à§à¦­","à¦®à§€à¦¨"
];

const NAKSHATRAS = [
  "à¦…à¦¶à§à¦¬à¦¿à¦¨à§€","à¦­à¦°à¦£à§€","à¦•à§ƒà¦¤à§à¦¤à¦¿à¦•à¦¾","à¦°à§‹à¦¹à¦¿à¦£à§€","à¦®à§ƒà¦—à¦¶à¦¿à¦°à¦¾","à¦†à¦°à§à¦¦à§à¦°à¦¾","à¦ªà§à¦¨à¦°à§à¦¬à¦¸à§","à¦ªà§à¦·à§à¦¯à¦¾","à¦…à¦¶à§à¦²à§‡à¦·à¦¾",
  "à¦®à¦˜à¦¾","à¦ªà§‚à¦°à§à¦¬à¦«à¦¾à¦²à§à¦—à§à¦¨à§€","à¦‰à¦¤à§à¦¤à¦°à¦«à¦¾à¦²à§à¦—à§à¦¨à§€","à¦¹à¦¸à§à¦¤à¦¾","à¦šà¦¿à¦¤à§à¦¤à¦¾","à¦¸à§à¦¬à¦¾à¦¤à§€","à¦¬à¦¿à¦¶à¦¾à¦–à¦¾","à¦…à¦¨à§à¦°à¦¾à¦§à¦¾",
  "à¦œà§à¦¯à§‡à¦·à§à¦ à¦¾","à¦®à§‚à¦²à¦¾","à¦ªà§‚à¦°à§à¦¬à¦¾à¦·à¦¾à§à¦¾","à¦‰à¦¤à§à¦¤à¦°à¦¾à¦·à¦¾à§à¦¾","à¦¶à§à¦°à¦¬à¦£à¦¾","à¦§à¦¨à¦¿à¦·à§à¦ à¦¾","à¦¶à¦¤à¦­à¦¿à¦·à¦¾","à¦ªà§‚à¦°à§à¦¬à¦­à¦¾à¦¦à§à¦°à¦ªà¦¦",
  "à¦‰à¦¤à§à¦¤à¦°à¦­à¦¾à¦¦à§à¦°à¦ªà¦¦","à¦°à§‡à¦¬à¦¤à§€"
];

const NAKSHATRA_DESC = {
  "à¦…à¦¶à§à¦¬à¦¿à¦¨à§€": "à¦¶à§à¦°à§ à¦•à¦°à¦¾à¦° à¦¶à¦•à§à¦¤à¦¿ à¦“ à¦‰à¦¦à§à¦¯à¦® à¦¬à¦¾à¦¡à¦¼à¦¬à§‡à¥¤",
  "à¦­à¦°à¦£à§€": "à¦¸à§ƒà¦œà¦¨à¦¶à§€à¦² à¦•à¦¾à¦œà§‡ à¦…à¦—à§à¦°à¦—à¦¤à¦¿ à¦¹à¦¬à§‡à¥¤",
  "à¦•à§ƒà¦¤à§à¦¤à¦¿à¦•à¦¾": "à¦…à¦¸à§à¦¥à¦¿à¦°à¦¤à¦¾ à¦•à¦®à¦¿à¦¯à¦¼à§‡ à¦®à¦¨à§‹à¦¯à§‹à¦— à¦°à¦¾à¦–à§à¦¨à¥¤",
  "à¦°à§‹à¦¹à¦¿à¦£à§€": "à¦¸à¦®à§à¦ªà¦°à§à¦•à§‡ à¦­à¦¾à¦°à¦¸à¦¾à¦®à§à¦¯ à¦¬à¦œà¦¾à¦¯à¦¼ à¦°à¦¾à¦–à§à¦¨à¥¤",
  "à¦®à§ƒà¦—à¦¶à¦¿à¦°à¦¾": "à¦•à¦°à§à¦®à§‹à¦¦à§à¦¯à¦®à§‡ à¦¸à¦¾à¦«à¦²à§à¦¯ à¦†à¦¸à¦¬à§‡à¥¤",
  "à¦†à¦°à§à¦¦à§à¦°à¦¾": "à¦šà¦¿à¦¨à§à¦¤à¦¾ à¦¨à¦¿à¦¯à¦¼à¦¨à§à¦¤à§à¦°à¦£à§‡ à¦°à¦¾à¦–à§à¦¨à¥¤",
  "à¦ªà§à¦¨à¦°à§à¦¬à¦¸à§": "à¦¸à§à¦¯à§‹à¦—à§‡à¦° à¦¸à¦¦à§à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨à¥¤",
  "à¦ªà§à¦·à§à¦¯à¦¾": "à¦¸à¦®à§à¦®à¦¾à¦¨ à¦“ à¦ªà§à¦°à¦¶à¦‚à¦¸à¦¾ à¦ªà¦¾à¦¬à§‡à¦¨à¥¤",
  "à¦…à¦¶à§à¦²à§‡à¦·à¦¾": "à¦—à§‹à¦ªà¦¨ à¦¬à¦¿à¦·à¦¯à¦¼à§‡ à¦¸à¦¤à¦°à§à¦• à¦¥à¦¾à¦•à§à¦¨à¥¤",
  "à¦®à¦˜à¦¾": "à¦¨à§‡à¦¤à§ƒà¦¤à§à¦¬à¦—à§à¦£ à¦¬à§ƒà¦¦à§à¦§à¦¿ à¦ªà¦¾à¦¬à§‡à¥¤"
};

// deterministic RNG
function seededRandom(seedStr) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619) >>> 0;
  }
  return () => {
    h += 0x6D2B79F5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

async function fetchGeo(ip) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { cache: "no-store" });
    if (!res.ok) throw new Error("geo failed");
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET(req) {
  try {
    // obtain client IP (Vercel sets x-forwarded-for)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "8.8.8.8";
    const geo = await fetchGeo(ip) || {};
    const lat = geo.latitude || 22.5726;
    const lon = geo.longitude || 88.3639;
    const city = geo.city || "Kolkata";
    const tz = geo.timezone || "Asia/Kolkata";

    const now = DateTime.now().setZone(tz);
    const isoDate = now.toISODate();

    // astronomy calculations
    const sunLon = Astronomy.EclipticLongitude("Sun", now.toJSDate());
    const moonLon = Astronomy.EclipticLongitude("Moon", now.toJSDate());

    const tithi = Math.floor(((moonLon - sunLon + 360) % 360) / 12) + 1;
    const nakIndex = Math.floor((moonLon % 360) / (360 / 27));
    const nakshatra = NAKSHATRAS[nakIndex] || "à¦…à¦œà¦¾à¦¨à¦¾";
    const flavor = NAKSHATRA_DESC[nakshatra] || "";

    const horoscope = {};
    for (const sign of SIGNS) {
      const rng = seededRandom(`${isoDate}-${sign}`);
      horoscope[sign] = {
        summary: `${pick(rng, [
          "à¦†à¦œ à¦†à¦ªà¦¨à¦¾à¦° à¦¸à§ƒà¦œà¦¨à¦¶à§€à¦² à¦¶à¦•à§à¦¤à¦¿ à¦œà¦¾à¦—à§à¦°à¦¤ à¦¹à¦¬à§‡à¥¤",
          "à¦†à¦œ à¦§à§ˆà¦°à§à¦¯ à¦“ à¦¬à¦¿à¦šà¦•à§à¦·à¦£à¦¤à¦¾ à¦•à¦¾à¦œà§‡ à¦¦à§‡à¦¬à§‡â€”à¦¸à¦¾à¦¬à¦§à¦¾à¦¨ à¦¥à¦¾à¦•à§à¦¨à¥¤",
          "à¦†à¦œ à¦¨à¦¤à§à¦¨ à¦•à¦¿à¦›à§ à¦¶à§‡à¦–à¦¾à¦° à¦†à¦—à§à¦°à¦¹ à¦¦à§‡à¦–à¦¾ à¦¦à§‡à¦¬à§‡à¥¤"
        ])} ${flavor}`.trim(),
        career: pick(rng, [
          "à¦•à¦¾à¦œà§‡ à¦¸à§à¦¯à§‡à¦¾à¦— à¦†à¦¸à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¥¤", "à¦¨à¦¤à§à¦¨ à¦ªà§à¦°à¦•à¦²à§à¦ªà§‡ à¦®à¦¨ à¦¦à¦¿à¦¨à¥¤", "à¦¸à¦¹à¦•à¦°à§à¦®à§€à¦¦à§‡à¦° à¦¸à¦™à§à¦—à§‡ à¦¸à¦®à¦¨à§à¦¬à¦¯à¦¼ à¦°à¦¾à¦–à§à¦¨à¥¤"
        ]),
        health: pick(rng, [
          "à¦¶à¦°à§€à¦° à¦¸à§à¦¸à§à¦¥ à¦¥à¦¾à¦•à¦¬à§‡à¥¤", "à¦¹à¦¾à¦²à¦•à¦¾ à¦•à§à¦²à¦¾à¦¨à§à¦¤à¦¿ à¦¥à¦¾à¦•à¦¤à§‡ à¦ªà¦¾à¦°à§‡â€”à¦¬à¦¿à¦¶à§à¦°à¦¾à¦® à¦¨à¦¿à¦¨à¥¤", "à¦ªà¦¾à¦¨à¦¿ à¦¬à§‡à¦¶à¦¿ à¦ªà¦¾à¦¨à§‡ à¦‰à¦ªà¦•à¦¾à¦°à¥¤"
        ]),
        family: pick(rng, [
          "à¦ªà¦°à¦¿à¦¬à¦¾à¦°à§‡ à¦¶à¦¾à¦¨à§à¦¤à¦¿à¦ªà§‚à¦°à§à¦£ à¦¸à¦®à¦¯à¦¼à¥¤", "à¦ªà¦°à¦¿à¦¬à¦¾à¦°à¦¿à¦• à¦•à¦¥à§‹à¦ªà¦•à¦¥à¦¨ à¦®à¦§à§à¦° à¦¹à¦¬à§‡à¥¤", "à¦¸à¦®à¦¯à¦¼ à¦¦à¦¿à¦¨, à¦¸à¦®à§à¦ªà¦°à§à¦• à¦®à¦œà¦¬à§à¦¤ à¦¹à¦¬à§‡à¥¤"
        ]),
        wealth: pick(rng, [
          "à¦†à¦°à§à¦¥à¦¿à¦• à¦¦à¦¿à¦• à¦¥à§‡à¦•à§‡ à¦¸à§à¦¥à¦¿à¦¤à¦¿à¦¶à§€à¦²à¥¤", "à¦…à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨à§€à¦¯à¦¼ à¦–à¦°à¦š à¦à¦¡à¦¼à¦¾à¦¨à¥¤", "à¦…à¦°à§à¦¥ à¦²à¦¾à¦­à§‡à¦° à¦¸à¦®à§à¦­à¦¾à¦¬à¦¨à¦¾ à¦†à¦›à§‡à¥¤"
        ]),
        totka: pick(rng, [
          "à¦¸à§à¦®à¦¨-à¦° à¦¯à¦¾à¦“à¦¯à¦¼à¦¾", " à¦¸à¦•à¦¾à¦²à§‡ à¦§à§à¦¯à¦¾à¦¨ à¦•à¦°à§à¦¨à¥¤", "à¦¨à¦¾à¦®à§à¦¨à¦¾ à¦…à¦¨à§à¦¶à§€à¦²à¦¨ à¦•à¦°à§à¦¨à¥¤"
        ]),
        tithi: `à¦¤à¦¿à¦¥à¦¿ ${tithi}`,
        nakshatra
      };
    }

    const out = {
      date: now.toFormat("dd/MM/yyyy"),
      location: { city, lat, lon, timeZone: tz },
      sun_longitude: Number(sunLon.toFixed(6)),
      moon_longitude: Number(moonLon.toFixed(6)),
      tithi,
      nakshatra,
      signs: horoscope,
      meta: { generatedAt: new Date().toISOString() }
    };

    return new Response(JSON.stringify(out), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "s-maxage=900, stale-while-revalidate=3600" }
    });
  } catch (err) {
    console.error("Horoscope API error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate horoscope", details: String(err) }), { status: 500 });
  }
}