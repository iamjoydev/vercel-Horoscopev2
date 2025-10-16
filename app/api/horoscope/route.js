// ===============================================================
// 🪐 Daily Bengali Vedic Horoscope API
// Works perfectly on Vercel (Next.js App Router)
// Dynamic by design, supports IP-based geo lookup
// ===============================================================

export const dynamic = "force-dynamic"; // ✅ Required for dynamic headers / IP

import { DateTime } from "luxon";
import * as Astronomy from "astronomy-engine";

// 🗺️ IP → Geo Lookup
async function fetchGeo(ip) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { cache: "no-store" });
    if (!res.ok) throw new Error("Geo lookup failed");
    return await res.json();
  } catch {
    return null;
  }
}

// 🎲 Deterministic pseudo-random generator
function seededRandom(seedStr) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619) >>> 0;
  }
  return function () {
    h += 0x6D2B79F5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ♈ Zodiac Signs
const SIGNS = [
  "মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা",
  "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"
];

// 🌟 Horoscope Text Templates
const TEMPLATES = {
  lead: [
    "আজ আপনার সৃজনশীল শক্তি জাগ্রত হবে। নতুন কাজের সুযোগ আসবে।",
    "আজ ধৈর্য ও বিচক্ষণতা কাজে দেবে—একটু সাবধান থাকুন।",
    "আজ আপনার মন কর্মে একাগ্র থাকবে; নতুন সিদ্ধান্তে সাফল্য মিলবে।",
    "আজ যোগাযোগ বৃদ্ধি পাবে—মিথস্ক্রিয়া ফলদায়ক হবে।",
    "আজ আত্মবিশ্লেষণ ও শৃঙ্খলা বিশেষ ফল দেবে।",
  ],
  health: [
    "গলা বা হজমে হালকা সমস্যা হতে পারে—হালকা খাবার খান।",
    "চোখ ও মাথায় ক্লান্তি এড়াতে বিশ্রাম নিন।",
    "হালকা ব্যায়াম বা হাঁটা স্বাস্থ্য ভালো রাখবে।",
    "বিশ্রাম ও পর্যাপ্ত পানি গ্রহণ রাখুন।",
  ],
  advice: [
    "অপ্রয়োজনীয় খরচ এড়ান।",
    "পরিবারের সঙ্গে সময় কাটান।",
    "নতুন পরিকল্পনা লিখে রাখুন।",
    "ধ্যান ও গভীর শ্বাস মন শান্ত করবে।",
  ],
};

// 🌠 Nakshatra Flavor Texts
const NAK_FLAVOR = {
  "অশ্বিনী": "শুরু করার শক্তি ও উদ্যম বৃদ্ধি পাবে।",
  "ভরণী": "সৃজনশীলতা ও সহমর্মিতা জাগ্রত হবে।",
  "কৃত্তিকা": "পরিশ্রমের ফল মিলবে।",
  "রোহিণী": "পারিবারিক সম্পর্ক মজবুত হবে।",
  "মৃগশিরা": "নতুন চিন্তা ও কৌতূহল বৃদ্ধি পাবে।",
  "আর্দ্রা": "আবেগ নিয়ন্ত্রণে রাখুন।",
  "পুনর্বসু": "নতুন সূচনার জন্য শুভ দিন।",
  "পুষ্যা": "সহযোগিতা ও সফলতা মিলবে।",
  "অশ্লেষা": "সম্পর্কে সতর্ক থাকুন।",
  "মঘা": "সম্মান ও স্বীকৃতি পাওয়ার সম্ভাবনা।",
};

// 🎯 Utility
function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

// ===============================================================
// 🚀 Main Horoscope Route
// ===============================================================
export async function GET(request) {
  try {
    // 🔍 Client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "8.8.8.8";

    // 🌍 Geo lookup
    const geo = await fetchGeo(clientIp);
    const lat = geo?.latitude ?? 22.5726;
    const lon = geo?.longitude ?? 88.3639;
    const city = geo?.city ?? "Kolkata";
    const region = geo?.region ?? "West Bengal";
    const country = geo?.country_name ?? "India";
    const tz = geo?.timezone ?? "Asia/Kolkata";

    // 🕒 Local DateTime
    const now = DateTime.now().setZone(tz);
    const isoDate = now.toISODate();
    const displayDate = now.toFormat("cccc, dd LLLL yyyy", { locale: "bn" });

    // ☀️🌙 Astronomy Calculations
    const sunLon = Astronomy.EclipticLongitude("Sun", now.toJSDate());
    const moonLon = Astronomy.EclipticLongitude("Moon", now.toJSDate());

    // তিথি (Tithi) Calculation (simplified)
    const tithi = Math.floor(((moonLon - sunLon + 360) % 360) / 12) + 1;

    // নক্ষত্র (Nakshatra)
    const nakIndex = Math.floor((moonLon % 360) / (360 / 27));
    const nakshatras = [
      "অশ্বিনী", "ভরণী", "কৃত্তিকা", "রোহিণী", "মৃগশিরা", "আর্দ্রা",
      "পুনর্বসু", "পুষ্যা", "অশ্লেষা", "মঘা", "পূর্বফাল্গুনী", "উত্তরফাল্গুনী",
      "হস্তা", "চিত্রা", "স্বাতী", "বিশাখা", "অনুরাধা", "জ্যেষ্ঠা",
      "মূলা", "পূর্বাষাঢ়া", "উত্তরাষাঢ়া", "শ্রবণা", "ধনিষ্ঠা", "শতভিষা",
      "পূর্বভাদ্রপদা", "উত্তরভাদ্রপদা", "রেবতী"
    ];
    const nakshatra = nakshatras[nakIndex];
    const flavor = NAK_FLAVOR[nakshatra] ?? "";

    // 🔮 Generate Horoscope for each sign
    const horoscope = {};
    for (const sign of SIGNS) {
      const rng = seededRandom(`${isoDate}|${sign}|${city}`);
      horoscope[sign] = {
        summary: `${pick(rng, TEMPLATES.lead)} ${flavor}`.trim(),
        health: pick(rng, TEMPLATES.health),
        advice: pick(rng, TEMPLATES.advice),
        tithi: `তিথি ${tithi}`,
        nakshatra,
      };
    }

    // 🧾 Final JSON Response
    const result = {
      date: displayDate,
      location: { city, region, country, lat, lon, timeZone: tz },
      sun_longitude: Number(sunLon.toFixed(6)),
      moon_longitude: Number(moonLon.toFixed(6)),
      tithi,
      nakshatra,
      horoscope,
      meta: {
        generatedAt: new Date().toISOString(),
        source: "astronomy-engine",
        version: "1.0.0",
      },
    };

    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("Horoscope API error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate horoscope" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
