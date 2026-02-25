import EsportsMice from "@/components/ClientApp";
import { mice, allPlayers } from "@/data";

const sl = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

const GAME_SENS_INFO = {
  "CS2": { fullName: "Counter-Strike 2", sensMultiplier: 0.022, unit: "in-game sensitivity", example: "0.8-1.2 @ 800 DPI", notes: "CS2 uses the same sensitivity scale as CS:GO. The formula for cm/360 is: 360 / (DPI × sensitivity × 0.022). Most pros use 800 DPI with in-game sensitivity between 0.5 and 1.5." },
  "Valorant": { fullName: "Valorant", sensMultiplier: 0.07, unit: "in-game sensitivity", example: "0.25-0.45 @ 800 DPI", notes: "Valorant sensitivity is approximately 3.18× CS2 sensitivity. To convert CS2 sens to Valorant, divide by 3.18. Most Valorant pros use 800 DPI with sensitivity between 0.2 and 0.5." },
  "Fortnite": { fullName: "Fortnite", sensMultiplier: 0.5555, unit: "X/Y sensitivity %", example: "5-8% @ 800 DPI", notes: "Fortnite uses percentage-based sensitivity. Building and editing sensitivity are separate from aim sensitivity. Most competitive Fortnite players use relatively high eDPI compared to tactical shooters." },
  "Apex": { fullName: "Apex Legends", sensMultiplier: 0.022, unit: "in-game sensitivity", example: "1.0-2.5 @ 800 DPI", notes: "Apex Legends uses the same sensitivity engine as Source games, making its scale identical to CS2. However, Apex pros tend to use higher sensitivity than CS2 pros due to the faster movement and 360-degree engagements." },
  "Overwatch 2": { fullName: "Overwatch 2", sensMultiplier: 0.0066, unit: "in-game sensitivity", example: "3.0-6.0 @ 800 DPI", notes: "Overwatch 2 sensitivity is roughly 3.33× CS2 sensitivity. Hero-specific sensitivity multipliers exist, so many players adjust per-hero. Hitscan DPS players tend to use lower sensitivity than support or tank players." },
  "R6 Siege": { fullName: "Rainbow Six Siege", sensMultiplier: 0.00572958, unit: "in-game sensitivity", example: "7-15 @ 800 DPI", notes: "R6 Siege has a unique sensitivity system with separate multipliers for different zoom levels. The base sensitivity scale is different from most other FPS games." },
  "Call of Duty": { fullName: "Call of Duty", sensMultiplier: 0.022, unit: "in-game sensitivity", example: "3.0-6.0 @ 800 DPI", notes: "Call of Duty PC sensitivity varies by title. Most competitive CoD players use relatively high sensitivity for the fast-paced gameplay and quick turning requirements." },
  "PUBG": { fullName: "PUBG: Battlegrounds", sensMultiplier: 0.002222, unit: "in-game sensitivity", example: "30-45 @ 800 DPI", notes: "PUBG uses a different sensitivity scale than most shooters. Separate sensitivity settings exist for different scopes and ADS levels. Most pros customize each zoom level independently." },
  "Quake Champions": { fullName: "Quake Champions", sensMultiplier: 0.022, unit: "in-game sensitivity", example: "1.5-3.5 @ 800 DPI", notes: "Quake Champions players typically use higher sensitivity than tactical shooter players due to the arena FPS gameplay requiring rapid 180-degree turns and vertical tracking." },
  "Marvel Rivals": { fullName: "Marvel Rivals", sensMultiplier: 0.07, unit: "in-game sensitivity", example: "3.0-6.0 @ 800 DPI", notes: "Marvel Rivals is a newer title with an evolving competitive scene. Sensitivity preferences are still being established as the meta develops." },
  "Deadlock": { fullName: "Deadlock", sensMultiplier: 0.022, unit: "in-game sensitivity", example: "1.0-2.5 @ 800 DPI", notes: "Deadlock uses Valve's Source 2 engine, so its sensitivity scale is very similar to CS2. As a MOBA-shooter hybrid, players tend to use slightly higher sensitivity than pure tactical shooters." },
  "LoL": { fullName: "League of Legends", sensMultiplier: null, unit: "Windows DPI", example: "800-1600 DPI", notes: "League of Legends does not have an in-game mouse sensitivity slider in the same way FPS games do. Mouse speed is controlled primarily through DPI and Windows pointer speed. Most LoL pros use 800-1600 DPI." },
  "Dota 2": { fullName: "Dota 2", sensMultiplier: null, unit: "Windows DPI", example: "800-1200 DPI", notes: "Like League of Legends, Dota 2 mouse speed is primarily DPI-based. Most Dota 2 pros use 800-1200 DPI. Camera movement and precision clicking are more relevant than aiming sensitivity." },
  "Rocket League": { fullName: "Rocket League", sensMultiplier: null, unit: "camera/controller", example: "Controller dominant", notes: "Rocket League is played almost exclusively with controllers at the professional level. Mouse sensitivity is not a primary concern, though some players use mouse for menus." },
};

function getGameData(gameName) {
  const players = allPlayers.filter(p => p.game === gameName);
  const dpis = players.map(p => p.dpi).filter(d => d && d > 0).sort((a, b) => a - b);
  const edpis = players.map(p => p.edpi).filter(e => e && e > 0).sort((a, b) => a - b);
  const avgDpi = dpis.length ? Math.round(dpis.reduce((a, b) => a + b, 0) / dpis.length) : 0;
  const avgEdpi = edpis.length ? Math.round(edpis.reduce((a, b) => a + b, 0) / edpis.length) : 0;
  const medianEdpi = edpis.length ? edpis[Math.floor(edpis.length / 2)] : 0;
  const minEdpi = edpis.length ? edpis[0] : 0;
  const maxEdpi = edpis.length ? edpis[edpis.length - 1] : 0;

  const mouseCounts = {};
  players.forEach(p => { if (p.mouse) mouseCounts[p.mouse] = (mouseCounts[p.mouse] || 0) + 1; });
  const topMice = Object.entries(mouseCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const dpiDist = { "400": 0, "800": 0, "1600": 0, "other": 0 };
  dpis.forEach(d => {
    if (d === 400) dpiDist["400"]++;
    else if (d >= 800 && d <= 800) dpiDist["800"]++;
    else if (d === 1600) dpiDist["1600"]++;
    else dpiDist["other"]++;
  });

  return { players, dpis, edpis, avgDpi, avgEdpi, medianEdpi, minEdpi, maxEdpi, topMice, dpiDist };
}

const ALL_GAMES = Object.keys(GAME_SENS_INFO);

export function generateStaticParams() {
  return ALL_GAMES.map(g => ({ slug: sl(g) }));
}

export function generateMetadata({ params }) {
  const gameName = ALL_GAMES.find(g => sl(g) === params.slug);
  if (!gameName) return { title: "Game Not Found" };

  const info = GAME_SENS_INFO[gameName];
  const { players, avgDpi, avgEdpi, medianEdpi } = getGameData(gameName);
  const description = `${info.fullName} pro player sensitivity settings — ${players.length} players tracked. Average DPI: ${avgDpi}, average eDPI: ${avgEdpi}, median eDPI: ${medianEdpi}. DPI calculator and sensitivity converter.`;

  return {
    title: `${info.fullName} Pro Sensitivity Settings — DPI & eDPI Calculator`,
    description,
    alternates: { canonical: `https://esportsmice.com/sensitivity/${params.slug}` },
    openGraph: {
      title: `${info.fullName} Pro Sensitivity Settings — DPI & eDPI Calculator`,
      description,
      url: `https://esportsmice.com/sensitivity/${params.slug}`,
      images: [{ url: `https://esportsmice.com/og?title=${encodeURIComponent(info.fullName + ' Sensitivity')}&subtitle=${encodeURIComponent(`${players.length} Pro Players · Avg eDPI ${avgEdpi} · DPI Calculator`)}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function SensitivityGamePage({ params }) {
  const gameName = ALL_GAMES.find(g => sl(g) === params.slug);
  if (!gameName) {
    return (
      <>
        <div style={{ padding: 40, textAlign: "center", color: "#fff" }}><h1>Game Not Found</h1></div>
        <EsportsMice initialTab="sensitivity" />
      </>
    );
  }

  const info = GAME_SENS_INFO[gameName];
  const { players, avgDpi, avgEdpi, medianEdpi, minEdpi, maxEdpi, topMice } = getGameData(gameName);

  // Get top players by name recognition (those with full profiles)
  const topPlayers = players.filter(p => p.hasProfile).slice(0, 20);
  if (topPlayers.length < 20) {
    players.filter(p => !p.hasProfile).slice(0, 20 - topPlayers.length).forEach(p => topPlayers.push(p));
  }

  const otherGames = ALL_GAMES.filter(g => g !== gameName);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${info.fullName} Pro Player Sensitivity Settings and DPI Guide`,
        description: `Complete guide to ${info.fullName} sensitivity settings. ${players.length} pro players tracked with average eDPI of ${avgEdpi}.`,
        url: `https://esportsmice.com/sensitivity/${params.slug}`,
        about: { "@type": "VideoGame", name: info.fullName },
      }) }} />

      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>{info.fullName} Pro Player Sensitivity Settings — DPI, eDPI and Sensitivity Guide</h1>

        <h2>About {info.fullName} Sensitivity</h2>
        <p>{info.notes}</p>
        <p>
          We track {players.length} professional {info.fullName} players and their complete sensitivity configurations.
          The average DPI is {avgDpi}, average eDPI is {avgEdpi}, and median eDPI is {medianEdpi}.
          eDPI ranges from {minEdpi} (lowest) to {maxEdpi} (highest) among tracked pros.
          {info.example && ` Typical pro settings: ${info.example}.`}
        </p>

        <h2>{info.fullName} Sensitivity Statistics</h2>
        <table>
          <caption>Sensitivity statistics for {players.length} professional {info.fullName} players</caption>
          <tbody>
            <tr><th>Players Tracked</th><td>{players.length}</td></tr>
            <tr><th>Average DPI</th><td>{avgDpi}</td></tr>
            <tr><th>Average eDPI</th><td>{avgEdpi}</td></tr>
            <tr><th>Median eDPI</th><td>{medianEdpi}</td></tr>
            <tr><th>Lowest eDPI</th><td>{minEdpi}</td></tr>
            <tr><th>Highest eDPI</th><td>{maxEdpi}</td></tr>
            <tr><th>Sensitivity Unit</th><td>{info.unit}</td></tr>
            <tr><th>Typical Pro Range</th><td>{info.example}</td></tr>
          </tbody>
        </table>

        <h2>Top {info.fullName} Pro Player Settings</h2>
        <table>
          <caption>Professional {info.fullName} player sensitivity, DPI and mouse settings</caption>
          <thead><tr><th>Player</th><th>Team</th><th>Mouse</th><th>DPI</th><th>Sensitivity</th><th>eDPI</th></tr></thead>
          <tbody>
            {topPlayers.map((p, i) => (
              <tr key={i}>
                <td><a href={`/players/${sl(p.name)}`}>{p.name}</a></td>
                <td>{p.team}</td>
                <td><a href={`/mice/${sl(p.mouse)}`}>{p.mouse}</a></td>
                <td>{p.dpi}</td>
                <td>{p.sens}</td>
                <td>{p.edpi}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {topMice.length > 0 && (
          <>
            <h2>Most Popular Mice in {info.fullName}</h2>
            <table>
              <caption>Most used gaming mice among professional {info.fullName} players</caption>
              <thead><tr><th>Mouse</th><th>Players</th></tr></thead>
              <tbody>
                {topMice.map(([m, count]) => (
                  <tr key={m}><td><a href={`/mice/${sl(m)}`}>{m}</a></td><td>{count}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <h2>Other Game Sensitivity Guides</h2>
        <nav>
          <ul>
            {otherGames.map(g => <li key={g}><a href={`/sensitivity/${sl(g)}`}>{GAME_SENS_INFO[g].fullName} Sensitivity Settings</a></li>)}
            <li><a href="/sensitivity">Sensitivity Converter Tool</a></li>
            <li><a href={`/games/${sl(gameName)}`}>{info.fullName} Pro Players</a></li>
          </ul>
        </nav>
      </article>

      <EsportsMice initialTab="sensitivity" />
    </>
  );
}
