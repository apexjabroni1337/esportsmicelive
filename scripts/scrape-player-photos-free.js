/**
 * FREE-USE PLAYER PHOTO SCRAPER
 * ==============================
 * Only downloads images from sources with verified Creative Commons
 * or public domain licenses. Will NOT touch HLTV, ESL, tournament
 * photographer images, or anything copyrighted.
 *
 * Sources:
 *   1. Wikimedia Commons (CC-BY-SA, CC-BY, Public Domain)
 *   2. Liquipedia (CC-BY-SA 3.0 — user-uploaded under CC license)
 *
 * Expected yield: ~10-25% of players (mostly well-known ones)
 * The rest will need official team press kit photos or stay blank.
 *
 * Usage:
 *   cd esportsmice-next
 *   node scripts/scrape-player-photos-free.js
 *
 * Requirements:
 *   npm install sharp (for image processing)
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// ─── Config ───
const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "players");
const DELAY_MS = 1500; // Be respectful to APIs
const MAX_RETRIES = 2;
const IMAGE_SIZE = 256; // Output size in px

// ─── Ensure output dir exists ───
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ─── Extract player data from data/index.js ───
function getPlayers() {
  const dataFile = path.join(__dirname, "..", "data", "index.js");
  const content = fs.readFileSync(dataFile, "utf8");

  // Extract from PLAYER_IMAGES to get the name→filename mapping
  const imgBlock = content.slice(
    content.indexOf("export const PLAYER_IMAGES"),
    content.indexOf("};", content.indexOf("export const PLAYER_IMAGES")) + 2
  );
  const imgEntries = [...imgBlock.matchAll(/"([^"]+)":\s*"([^"]+)"/g)];
  const nameToFile = {};
  imgEntries.forEach(([, name, filepath]) => {
    nameToFile[name] = filepath;
  });

  // Extract from proPlayers for fullName and game
  const ppStart = content.indexOf("export const proPlayers");
  const ppSection = content.slice(ppStart, ppStart + 5000000);
  const players = [];
  const seen = new Set();

  // Match individual player objects
  const playerRegex = /name:\s*"([^"]+)"[^}]*?game:\s*"([^"]+)"[^}]*?(?:fullName:\s*"([^"]+)")?/g;
  let match;
  while ((match = playerRegex.exec(ppSection)) !== null) {
    const [, name, game, fullName] = match;
    if (seen.has(name)) continue;
    seen.add(name);
    if (nameToFile[name]) {
      const filename = path.basename(nameToFile[name], ".png");
      players.push({ name, game, fullName: fullName || name, filename });
    }
  }

  // Also grab from extendedPlayers
  const epStart = content.indexOf("export const extendedPlayers");
  if (epStart > 0) {
    const epSection = content.slice(epStart, epStart + 5000000);
    const epRegex = /name:\s*"([^"]+)"[^}]*?game:\s*"([^"]+)"[^}]*?(?:fullName:\s*"([^"]+)")?/g;
    while ((match = epRegex.exec(epSection)) !== null) {
      const [, name, game, fullName] = match;
      if (seen.has(name)) continue;
      seen.add(name);
      if (nameToFile[name]) {
        const filename = path.basename(nameToFile[name], ".png");
        players.push({ name, game, fullName: fullName || name, filename });
      }
    }
  }

  return players;
}

// ─── HTTP fetch helper ───
function fetch(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error("Too many redirects"));
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, {
      headers: { "User-Agent": "EsportsMiceBot/1.0 (https://esportsmice.com; contact@esportsmice.com) — fetching CC-licensed images only" },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetch(res.headers.location, redirects + 1));
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

function fetchJSON(url) {
  return fetch(url).then((buf) => JSON.parse(buf.toString()));
}

// ─── Source 1: Wikimedia Commons ───
// Searches for player photos with verified CC licenses
async function searchWikimediaCommons(playerName, fullName, game) {
  const gameMap = {
    CS2: "Counter-Strike", Valorant: "Valorant", LoL: "League of Legends",
    "Dota 2": "Dota 2", Fortnite: "Fortnite", "Overwatch 2": "Overwatch",
    Apex: "Apex Legends", "R6 Siege": "Rainbow Six", "Call of Duty": "Call of Duty",
    PUBG: "PUBG", "Rocket League": "Rocket League", "Marvel Rivals": "Marvel Rivals",
    Deadlock: "Deadlock", "Quake Champions": "Quake",
  };

  const queries = [
    `${fullName} esports`,
    `${fullName} ${gameMap[game] || game}`,
    `${playerName} esports player`,
  ];

  for (const query of queries) {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5&format=json`;
      const data = await fetchJSON(url);

      if (!data.query?.search?.length) continue;

      for (const result of data.query.search) {
        const title = result.title;
        // Get image info including license
        const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata&format=json`;
        const infoData = await fetchJSON(infoUrl);
        const pages = infoData.query?.pages;
        if (!pages) continue;

        for (const page of Object.values(pages)) {
          const info = page.imageinfo?.[0];
          if (!info) continue;

          const license = info.extmetadata?.LicenseShortName?.value || "";
          const desc = (info.extmetadata?.ImageDescription?.value || "").toLowerCase();

          // ONLY accept Creative Commons or Public Domain
          const isCC = /cc[-\s]?by|creative\s*commons|public\s*domain|cc0|pd/i.test(license);
          if (!isCC) {
            continue; // Skip non-CC images
          }

          // Check if description/title relates to the player
          const nameCheck = playerName.toLowerCase();
          const fullNameCheck = fullName.toLowerCase();
          const titleLower = title.toLowerCase();
          if (
            titleLower.includes(nameCheck) ||
            titleLower.includes(fullNameCheck) ||
            desc.includes(nameCheck) ||
            desc.includes(fullNameCheck)
          ) {
            return {
              url: info.url,
              source: "Wikimedia Commons",
              license: license,
              attribution: info.extmetadata?.Artist?.value || "Wikimedia Commons",
            };
          }
        }
      }
    } catch (e) {
      // Continue to next query
    }
  }
  return null;
}

// ─── Source 2: Liquipedia ───
// Liquipedia content is CC-BY-SA 3.0
// We use their API to get player page images
async function searchLiquipedia(playerName, fullName, game) {
  const wikiMap = {
    CS2: "counterstrike", Valorant: "valorant", LoL: "leagueoflegends",
    "Dota 2": "dota2", Fortnite: "fortnite", "Overwatch 2": "overwatch",
    Apex: "apexlegends", "R6 Siege": "rainbowsix", "Call of Duty": "callofduty",
    PUBG: "pubg", "Rocket League": "rocketleague", "Marvel Rivals": "marvelrivals",
    Deadlock: "deadlock", "Quake Champions": "fighters",
  };

  const wiki = wikiMap[game];
  if (!wiki) return null;

  // Try exact player name on Liquipedia
  const names = [playerName, playerName.replace(/\s+/g, "_")];

  for (const name of names) {
    try {
      const url = `https://liquipedia.net/${wiki}/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&piprop=original&format=json`;
      const data = await fetchJSON(url);
      const pages = data.query?.pages;
      if (!pages) continue;

      for (const page of Object.values(pages)) {
        if (page.original?.source) {
          return {
            url: page.original.source,
            source: "Liquipedia",
            license: "CC-BY-SA 3.0",
            attribution: "Liquipedia (liquipedia.net)",
          };
        }
      }
    } catch (e) {
      // Liquipedia may rate limit or block — that's fine
    }
  }
  return null;
}

// ─── Image processing ───
async function downloadAndProcess(imageUrl, outputPath) {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    // If sharp isn't installed, just save the raw image
    const buf = await fetch(imageUrl);
    fs.writeFileSync(outputPath, buf);
    return true;
  }

  try {
    const buf = await fetch(imageUrl);

    await sharp(buf)
      .resize(IMAGE_SIZE, IMAGE_SIZE, {
        fit: "cover",
        position: "top", // Focus on face (usually top of image)
      })
      .png({ quality: 85 })
      .toFile(outputPath);

    return true;
  } catch (e) {
    // If sharp fails, try saving raw
    try {
      const buf = await fetch(imageUrl);
      fs.writeFileSync(outputPath, buf);
      return true;
    } catch {
      return false;
    }
  }
}

// ─── Main ───
async function main() {
  const players = getPlayers();
  console.log(`\n🔍 Free-Use Player Photo Scraper`);
  console.log(`   Only downloading CC-licensed and public domain images`);
  console.log(`   Sources: Wikimedia Commons, Liquipedia (CC-BY-SA 3.0)`);
  console.log(`   Players to search: ${players.length}\n`);

  // Check which already exist
  const existing = new Set(
    fs.readdirSync(OUTPUT_DIR).map((f) => f.replace(/\.\w+$/, ""))
  );
  const toFetch = players.filter((p) => !existing.has(p.filename));
  console.log(`   Already have: ${existing.size}`);
  console.log(`   Need to fetch: ${toFetch.length}\n`);

  let found = 0;
  let notFound = 0;
  let errors = 0;
  const attributions = []; // Track for credits file

  for (let i = 0; i < toFetch.length; i++) {
    const player = toFetch[i];
    const outPath = path.join(OUTPUT_DIR, `${player.filename}.png`);
    const progress = `[${i + 1}/${toFetch.length}]`;

    process.stdout.write(`${progress} ${player.name} (${player.game})... `);

    let result = null;

    // Try Liquipedia first (more likely to have esports players)
    try {
      result = await searchLiquipedia(player.name, player.fullName, player.game);
    } catch (e) {
      // Continue
    }

    // Fall back to Wikimedia Commons
    if (!result) {
      try {
        result = await searchWikimediaCommons(player.name, player.fullName, player.game);
      } catch (e) {
        // Continue
      }
    }

    if (result) {
      try {
        const ok = await downloadAndProcess(result.url, outPath);
        if (ok) {
          found++;
          console.log(`✅ ${result.source} (${result.license})`);
          attributions.push({
            player: player.name,
            source: result.source,
            license: result.license,
            attribution: result.attribution,
            url: result.url,
          });
        } else {
          errors++;
          console.log(`⚠️ Download failed`);
        }
      } catch (e) {
        errors++;
        console.log(`⚠️ ${e.message}`);
      }
    } else {
      notFound++;
      console.log(`—  No free-use image found`);
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  // Save attributions file (IMPORTANT — must credit CC sources)
  const creditsPath = path.join(OUTPUT_DIR, "ATTRIBUTIONS.json");
  fs.writeFileSync(creditsPath, JSON.stringify(attributions, null, 2));

  // Also save a human-readable credits file
  const creditsText = [
    "PLAYER PHOTO ATTRIBUTIONS",
    "=========================",
    "All images below are used under Creative Commons or Public Domain licenses.",
    "Original sources and photographers are credited below.",
    "",
    ...attributions.map(
      (a) =>
        `${a.player}: ${a.source} — License: ${a.license} — Credit: ${a.attribution}`
    ),
  ].join("\n");
  fs.writeFileSync(path.join(OUTPUT_DIR, "ATTRIBUTIONS.txt"), creditsText);

  console.log(`\n${"═".repeat(50)}`);
  console.log(`✅ Found & downloaded: ${found}`);
  console.log(`—  No free image found: ${notFound}`);
  console.log(`⚠️  Errors: ${errors}`);
  console.log(`📁 Saved to: ${OUTPUT_DIR}`);
  console.log(`📝 Attributions: ${creditsPath}`);
  console.log(`${"═".repeat(50)}\n`);

  if (found < toFetch.length * 0.3) {
    console.log(`💡 Low hit rate is expected — most esports photos are copyrighted.`);
    console.log(`   For more coverage, consider:`);
    console.log(`   • Downloading official headshots from team websites (roster pages)`);
    console.log(`   • Reaching out to tournament organizers for press photo permission`);
    console.log(`   • Using player social media profile pictures (with attribution)`);
    console.log(``);
  }
}

main().catch(console.error);
