import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { mice, allPlayers, TEAM_DESCRIPTIONS, TEAM_LOGOS, BRAND_COLORS, amazonLink, countryName } from "@/data";

const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

function getTeamData(teamName) {
  const teamPlayers = allPlayers.filter(p => p.team === teamName);
  const seen = new Set();
  const uniquePlayers = teamPlayers.filter(p => {
    const key = p.name + "|" + p.game;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const byGame = {};
  uniquePlayers.forEach(p => {
    if (!byGame[p.game]) byGame[p.game] = [];
    byGame[p.game].push(p);
  });
  const gameEntries = Object.entries(byGame).sort((a, b) => b[1].length - a[1].length);

  const mouseCounts = {};
  uniquePlayers.forEach(p => { if (p.mouse && p.mouse !== "Unknown") mouseCounts[p.mouse] = (mouseCounts[p.mouse] || 0) + 1; });
  const topMice = Object.entries(mouseCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const edpis = uniquePlayers.map(p => p.edpi).filter(e => e && e > 0);
  const avgEdpi = edpis.length ? Math.round(edpis.reduce((a, b) => a + b, 0) / edpis.length) : null;
  const dpis = uniquePlayers.map(p => p.dpi).filter(d => d && d > 0);
  const avgDpi = dpis.length ? Math.round(dpis.reduce((a, b) => a + b, 0) / dpis.length) : null;

  const countries = [...new Set(uniquePlayers.map(p => p.country).filter(Boolean))];
  const desc = TEAM_DESCRIPTIONS[teamName];

  return { uniquePlayers, gameEntries, topMice, avgEdpi, avgDpi, countries, desc };
}

function getAllTeams() {
  const teamSet = new Set();
  allPlayers.forEach(p => {
    if (p.team && !["Free Agent", "Content Creator", "Content", "Retired", "Streamer", ""].includes(p.team)) {
      teamSet.add(p.team);
    }
  });
  return [...teamSet];
}

export function generateStaticParams() {
  return getAllTeams().map(t => ({ slug: slug(t) }));
}

export function generateMetadata({ params }) {
  const allTeams = getAllTeams();
  const teamName = allTeams.find(t => slug(t) === params.slug);
  if (!teamName) return { title: "Team Not Found" };

  const { uniquePlayers, gameEntries, desc } = getTeamData(teamName);
  const games = gameEntries.map(([g]) => g).join(", ");
  const description = desc?.bio
    ? desc.bio.slice(0, 155) + "..."
    : `${teamName} esports team — ${uniquePlayers.length} tracked pro players across ${games}. Mouse preferences, DPI settings, sensitivity configs and complete gear setups.`;

  return {
    title: `${teamName} — Pro Player Settings, Mice & Gear`,
    description,
    alternates: { canonical: `https://esportsmice.com/teams/${params.slug}` },
    openGraph: {
      title: `${teamName} — Pro Player Settings, Mice & Gear`,
      description,
      url: `https://esportsmice.com/teams/${params.slug}`,
      images: [{ url: `https://esportsmice.com/og?title=${encodeURIComponent(teamName)}&subtitle=${encodeURIComponent(`${uniquePlayers.length} Players · ${gameEntries.length} Games · Pro Settings`)}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function TeamPage({ params }) {
  const allTeams = getAllTeams();
  const teamName = allTeams.find(t => slug(t) === params.slug);

  if (!teamName) {
    return (
      <>
        <div style={{ padding: 40, textAlign: "center", color: "#fff" }}>
          <h1>Team Not Found</h1>
          <p>This team doesn't exist in our database.</p>
        </div>
        <EsportsMice initialTab="teams" />
      </>
    );
  }

  const { uniquePlayers, gameEntries, topMice, avgEdpi, avgDpi, countries, desc } = getTeamData(teamName);
  const games = gameEntries.map(([g]) => g);
  const logoUrl = TEAM_LOGOS[teamName];

  return (
    <>
      {/* JSON-LD SportsTeam structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SportsTeam",
        name: teamName,
        description: desc?.bio || `${teamName} is a professional esports organization with ${uniquePlayers.length} tracked players across ${games.join(", ")}.`,
        url: `https://esportsmice.com/teams/${params.slug}`,
        ...(logoUrl ? { logo: `https://esportsmice.com${logoUrl}` } : {}),
        sport: games.join(", "),
        member: uniquePlayers.slice(0, 20).map(p => ({
          "@type": "Person",
          name: p.fullName || p.name,
          alternateName: p.name,
          jobTitle: `Professional ${p.game} Player`,
        })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://esportsmice.com" },
          { "@type": "ListItem", position: 2, name: "Teams", item: "https://esportsmice.com/teams" },
          { "@type": "ListItem", position: 3, name: teamName, item: `https://esportsmice.com/teams/${params.slug}` },
        ],
      }) }} />

      {/* Server-rendered SEO content */}
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
        itemScope itemType="https://schema.org/SportsTeam"
      >
        <h1 itemProp="name">{teamName} — Professional Esports Team Settings, Mice and Gear</h1>
        {logoUrl && <meta itemProp="logo" content={`https://esportsmice.com${logoUrl}`} />}
        <meta itemProp="url" content={`https://esportsmice.com/teams/${params.slug}`} />

        <h2>About {teamName}</h2>
        {desc?.bio ? (
          <p itemProp="description">{desc.bio}</p>
        ) : (
          <p itemProp="description">
            {teamName} is a professional esports organization with {uniquePlayers.length} tracked players
            competing across {games.join(", ")}. {avgDpi ? `Their average DPI is ${avgDpi} and average eDPI is ${avgEdpi}.` : ""}
          </p>
        )}

        {desc?.achievements && (
          <>
            <h2>{teamName} Key Achievements</h2>
            <ul>
              {desc.achievements.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </>
        )}

        <h2>{teamName} Team Statistics</h2>
        <table>
          <caption>Overview of {teamName} esports organization</caption>
          <tbody>
            <tr><th>Total Players Tracked</th><td>{uniquePlayers.length}</td></tr>
            <tr><th>Games</th><td>{games.join(", ")}</td></tr>
            {avgDpi && <tr><th>Average DPI</th><td>{avgDpi}</td></tr>}
            {avgEdpi && <tr><th>Average eDPI</th><td>{avgEdpi}</td></tr>}
            {countries.length > 0 && <tr><th>Nationalities</th><td>{countries.map(c => countryName(c)).join(", ")}</td></tr>}
          </tbody>
        </table>

        {topMice.length > 0 && (
          <>
            <h2>Most Used Mice in {teamName}</h2>
            <table>
              <caption>Mouse popularity among {teamName} players</caption>
              <thead><tr><th>Mouse</th><th>Players Using</th></tr></thead>
              <tbody>
                {topMice.map(([m, count]) => (
                  <tr key={m}>
                    <td><a href={`/mice/${slug(m)}`}>{m}</a></td>
                    <td>{count} {count === 1 ? "player" : "players"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <h2>{teamName} Player Roster and Settings</h2>
        {gameEntries.map(([game, players]) => (
          <div key={game}>
            <h3>{teamName} {game} Roster</h3>
            <table>
              <caption>{teamName} {game} player settings and mice</caption>
              <thead><tr><th>Player</th><th>Role</th><th>Mouse</th><th>DPI</th><th>Sensitivity</th><th>eDPI</th></tr></thead>
              <tbody>
                {players.map(p => (
                  <tr key={p.name + p.game}>
                    <td><a href={`/players/${slug(p.name)}`}>{p.name}</a></td>
                    <td>{p.role}</td>
                    <td><a href={`/mice/${slug(p.mouse)}`}>{p.mouse}</a></td>
                    <td>{p.dpi}</td>
                    <td>{p.sens}</td>
                    <td>{p.edpi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Internal links */}
        <h2>Related Pages</h2>
        <nav>
          <ul>
            {games.map(g => <li key={g}><a href={`/games/${slug(g)}`}>{g} Pro Settings</a></li>)}
            {topMice.slice(0, 5).map(([m]) => <li key={m}><a href={`/mice/${slug(m)}`}>{m} Review</a></li>)}
            <li><a href="/teams">All Pro Teams</a></li>
            <li><a href="/players">All Pro Players</a></li>
          </ul>
        </nav>
      </article>

      <EsportsMice initialTab="teamDetail" initialTeam={teamName} />
    </>
  );
}
