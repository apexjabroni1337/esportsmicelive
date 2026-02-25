import { mice, proPlayers, allPlayers } from "@/data";

const BASE_URL = "https://esportsmice.com";
const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

export default function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/mice`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/players`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/teams`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/games`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/brands`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sensors`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/trends`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/lab`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/shapes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/sensitivity`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];

  const mousePages = mice.map((m) => ({
    url: `${BASE_URL}/mice/${slug(m.name)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Individual player pages (CS2/Val: top 150, others: top 50 — rest render on-demand)
  const PLAYER_CAPS = { CS2: 150, Valorant: 150 };
  const PLAYER_DEFAULT_CAP = 50;
  const playerGameCounts = {};
  const playerSlugs = new Set();
  const playerPages = [];
  // proPlayers first (have bios)
  proPlayers.forEach((p) => {
    const s = slug(p.name);
    if (playerSlugs.has(s)) return;
    const cap = PLAYER_CAPS[p.game] || PLAYER_DEFAULT_CAP;
    playerGameCounts[p.game] = (playerGameCounts[p.game] || 0) + 1;
    if (playerGameCounts[p.game] > cap) return;
    playerSlugs.add(s);
    playerPages.push({ url: `${BASE_URL}/players/${s}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  });
  // Then extended players
  allPlayers.forEach((p) => {
    const s = slug(p.name);
    if (playerSlugs.has(s)) return;
    const cap = PLAYER_CAPS[p.game] || PLAYER_DEFAULT_CAP;
    playerGameCounts[p.game] = (playerGameCounts[p.game] || 0) + 1;
    if (playerGameCounts[p.game] > cap) return;
    playerSlugs.add(s);
    playerPages.push({ url: `${BASE_URL}/players/${s}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 });
  });

  const games = [...new Set(allPlayers.map((p) => p.game))];
  const gamePages = games.map((g) => ({
    url: `${BASE_URL}/games/${slug(g)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const brands = [...new Set(mice.map((m) => m.brand))];
  const brandPages = brands.map((b) => ({
    url: `${BASE_URL}/brands/${slug(b)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const teamSet = new Set();
  allPlayers.forEach((p) => {
    if (p.team && !["Free Agent", "Content Creator", "Content", "Retired", "Streamer"].includes(p.team)) {
      teamSet.add(p.team);
    }
  });
  const teamPages = [...teamSet].map((t) => ({
    url: `${BASE_URL}/teams/${slug(t)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Individual sensor pages
  const sensors = [...new Set(mice.map((m) => m.sensor))];
  const sensorPages = sensors.map((s) => ({
    url: `${BASE_URL}/sensors/${slug(s)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Shape pages
  const shapePages = ["symmetrical", "ergonomic"].map((s) => ({
    url: `${BASE_URL}/shapes/${s}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Per-game sensitivity pages (must match GAME_SENS_INFO keys in sensitivity/[slug]/page.jsx)
  const sensGameSlugs = ["cs2", "valorant", "fortnite", "apex", "overwatch-2", "r6-siege", "call-of-duty", "pubg", "quake-champions", "marvel-rivals", "deadlock", "lol", "dota-2", "rocket-league"];
  const sensitivityPages = sensGameSlugs.map((g) => ({
    url: `${BASE_URL}/sensitivity/${g}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Mouse comparison pages (top 15 mice, all pairs)
  const topMiceForCompare = [...mice].sort((a, b) => b.proUsage - a.proUsage).slice(0, 15);
  const comparePages = [];
  for (let i = 0; i < topMiceForCompare.length; i++) {
    for (let j = i + 1; j < topMiceForCompare.length; j++) {
      comparePages.push({
        url: `${BASE_URL}/compare/${slug(topMiceForCompare[i].name)}-vs-${slug(topMiceForCompare[j].name)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // "Best mouse for X" guide pages
  const bestSlugs = ["cs2", "valorant", "fortnite", "apex", "overwatch-2", "r6-siege", "call-of-duty", "pubg", "lol", "dota-2", "marvel-rivals", "rocket-league", "wireless", "lightweight", "budget"];
  const bestPages = [
    { url: `${BASE_URL}/best`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...bestSlugs.map((s) => ({
      url: `${BASE_URL}/best/${s}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];

  const blogSlugs = ["how-to-choose-gaming-mouse", "claw-vs-palm-vs-fingertip-grip", "mouse-weight-trend-2024-2026", "wireless-vs-wired-2026", "dpi-edpi-sensitivity-explained"];
  const blogPages = [
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...blogSlugs.map((s) => ({
      url: `${BASE_URL}/blog/${s}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];

  return [...staticPages, ...mousePages, ...playerPages, ...gamePages, ...brandPages, ...teamPages, ...sensorPages, ...shapePages, ...sensitivityPages, ...comparePages, ...bestPages, ...blogPages];
}
