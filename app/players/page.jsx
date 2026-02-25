import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { allPlayers, proPlayers, mice, BRAND_COLORS } from "@/data";

export const metadata = {
  title: "Pro Players — Esports Mouse Settings & Gear",
  description: "Browse 2100+ professional esports players and their mouse settings. Find DPI, sensitivity, eDPI, polling rate, and gear for CS2, Valorant, LoL, Fortnite, and more.",
  alternates: { canonical: "https://esportsmice.com/players" },
  openGraph: {
    title: "Pro Players — Esports Mouse Settings & Gear",
    description: "Browse 2100+ professional esports players and their mouse settings across 13 major competitive titles.",
    url: "https://esportsmice.com/players",
    images: [{ url: "https://esportsmice.com/og?title=Pro+Players&subtitle=2100%2B+Players+%C2%B7+Mouse+Settings+%C2%B7+DPI+%C2%B7+Sensitivity", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function PlayersPage() {
  const slug = (name) => name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
  const mouseSlug = (mouseName) => {
    const m = mice.find((mm) => mouseName.includes(mm.name) || mm.name.includes(mouseName));
    return m ? slug(m.name) : null;
  };

  const games = [...new Set(allPlayers.map((p) => p.game))].sort((a, b) => {
    return allPlayers.filter((p) => p.game === b).length - allPlayers.filter((p) => p.game === a).length;
  });

  // Global stats
  const avgDpi = Math.round(allPlayers.reduce((a, p) => a + p.dpi, 0) / allPlayers.length);
  const avgEdpi = Math.round(allPlayers.reduce((a, p) => a + p.edpi, 0) / allPlayers.length);
  const mostUsedMouse = (() => {
    const counts = {};
    allPlayers.forEach((p) => { counts[p.mouse] = (counts[p.mouse] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  })();

  // Top teams
  const teamCounts = {};
  allPlayers.forEach((p) => {
    if (p.team && p.team !== "Free Agent" && p.team !== "Retired" && p.team !== "Content") {
      teamCounts[p.team] = (teamCounts[p.team] || 0) + 1;
    }
  });
  const topTeams = Object.entries(teamCounts).sort((a, b) => b[1] - a[1]).slice(0, 15);

  // DPI distribution
  const dpiRanges = [
    { label: "200-400 DPI", min: 200, max: 400 },
    { label: "800 DPI", min: 800, max: 800 },
    { label: "1600 DPI", min: 1600, max: 1600 },
    { label: "Other", min: 0, max: 99999 },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ItemList",
        name: "Professional Esports Players — Mouse Settings & Gear",
        description: `${allPlayers.length}+ pro esports players and their complete mouse settings`,
        numberOfItems: allPlayers.length,
        itemListElement: proPlayers.slice(0, 20).map((p, i) => ({
          "@type": "ListItem", position: i + 1,
          url: `https://esportsmice.com/players/${slug(p.name)}`,
          name: p.name,
          item: { "@type": "Person", name: p.fullName || p.name, jobTitle: `Professional ${p.game} Player`, memberOf: { "@type": "SportsTeam", name: p.team } },
        })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What DPI do most pro players use?", acceptedAnswer: { "@type": "Answer", text: `The average DPI among ${allPlayers.length}+ pro players is ${avgDpi}. The most common DPI setting is 800, followed by 400 and 1600. However, the effective sensitivity (eDPI = DPI × in-game sens) is what matters most for aiming, and this varies significantly by game.` }},
          { "@type": "Question", name: "What mouse do CS2 pros use?", acceptedAnswer: { "@type": "Answer", text: `The most popular mouse among CS2 professionals is the ${mostUsedMouse[0]}, used by ${mostUsedMouse[1]} tracked players. Lightweight wireless mice with high polling rates dominate the CS2 pro scene.` }},
          { "@type": "Question", name: "What eDPI should I use?", acceptedAnswer: { "@type": "Answer", text: `The average eDPI across all pro players is ${avgEdpi}. For CS2/Valorant, most pros use 200-1000 eDPI. For Fortnite, 2000-6000 is typical. For LoL/Dota 2, 3000-15000 is common. Start near the average for your game and adjust based on comfort.` }},
        ],
      }) }} />
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Professional Esports Players — Mouse Settings, DPI, Sensitivity and Gear</h1>
        <p>
          Browse the mouse settings and gear of {allPlayers.length.toLocaleString()}+ professional esports players
          across {games.length} major competitive titles. Find DPI, in-game sensitivity, eDPI, polling rate,
          and the exact mouse model used by your favorite pros.
        </p>

        <h2>Key Statistics</h2>
        <ul>
          <li>Total players tracked: {allPlayers.length.toLocaleString()}</li>
          <li>Players with full profiles: {proPlayers.length}</li>
          <li>Games covered: {games.length}</li>
          <li>Average DPI across all pros: {avgDpi}</li>
          <li>Average eDPI across all pros: {avgEdpi}</li>
          <li>Most popular mouse: {mostUsedMouse[0]} ({mostUsedMouse[1]} players)</li>
        </ul>

        <h2>Players by Game</h2>
        <ul>
          {games.map((g) => (
            <li key={g}><a href={`/games/${g.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`}>{g}</a> — {allPlayers.filter((p) => p.game === g).length} players tracked</li>
          ))}
        </ul>

        {/* Per-game sections with top players */}
        {games.map((game) => {
          const gamePlayers = proPlayers.filter((p) => p.game === game);
          const allGamePlayers = allPlayers.filter((p) => p.game === game);
          const gameAvgDpi = Math.round(allGamePlayers.reduce((a, p) => a + p.dpi, 0) / allGamePlayers.length);
          const gameAvgEdpi = Math.round(allGamePlayers.reduce((a, p) => a + p.edpi, 0) / allGamePlayers.length);
          const mouseCounts = {};
          allGamePlayers.forEach((p) => { mouseCounts[p.mouse] = (mouseCounts[p.mouse] || 0) + 1; });
          const topMouseInGame = Object.entries(mouseCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

          if (!gamePlayers.length) return null;
          return (
            <section key={game}>
              <h2>{game} Pro Players</h2>
              <p>
                {allGamePlayers.length} {game} players tracked. Average DPI: {gameAvgDpi}. Average eDPI: {gameAvgEdpi}.
                Most popular mouse: {topMouseInGame[0]?.[0]}.
              </p>
              <h3>Top {game} Players with Full Profiles</h3>
              <table>
                <thead><tr><th>Player</th><th>Team</th><th>Role</th><th>Mouse</th><th>DPI</th><th>eDPI</th></tr></thead>
                <tbody>
                  {gamePlayers.slice(0, 15).map((p) => {
                    const ms = mouseSlug(p.mouse);
                    return (
                      <tr key={p.name}>
                        <td><a href={`/players/${slug(p.name)}`}>{p.name}</a></td>
                        <td>{p.team}</td>
                        <td>{p.role}</td>
                        <td>{ms ? <a href={`/mice/${ms}`}>{p.mouse}</a> : p.mouse}</td>
                        <td>{p.dpi}</td>
                        <td>{p.edpi}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <h3>Most Used Mice in {game}</h3>
              <ol>
                {topMouseInGame.map(([mouse, count]) => {
                  const ms = mouseSlug(mouse);
                  return (
                    <li key={mouse}>
                      {ms ? <a href={`/mice/${ms}`}>{mouse}</a> : mouse} — {count} players ({Math.round(count / allGamePlayers.length * 100)}%)
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}

        <h2>Top Esports Teams</h2>
        <p>Teams with the most tracked players in our database:</p>
        <ul>
          {topTeams.map(([team, count]) => {
            const teamPlayers = proPlayers.filter((p) => p.team === team).slice(0, 5);
            return (
              <li key={team}>
                {team} — {count} players
                {teamPlayers.length > 0 && (
                  <> ({teamPlayers.map((p, i) => (
                    <span key={p.name}>
                      {i > 0 && ", "}
                      <a href={`/players/${slug(p.name)}`}>{p.name}</a>
                    </span>
                  ))})</>
                )}
              </li>
            );
          })}
        </ul>

        <h2>Most Popular Mice Among All Pro Players</h2>
        {(() => {
          const counts = {};
          allPlayers.forEach((p) => { counts[p.mouse] = (counts[p.mouse] || 0) + 1; });
          const topMice = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15);
          return (
            <ol>
              {topMice.map(([mouse, count]) => {
                const ms = mouseSlug(mouse);
                return (
                  <li key={mouse}>
                    {ms ? <a href={`/mice/${ms}`}>{mouse}</a> : mouse} — {count} players ({Math.round(count / allPlayers.length * 100)}%)
                  </li>
                );
              })}
            </ol>
          );
        })()}

        <h2>DPI Distribution Among Pro Players</h2>
        <p>The most common DPI settings used by professional esports players:</p>
        <ul>
          <li>400 DPI — {allPlayers.filter((p) => p.dpi === 400).length} players ({Math.round(allPlayers.filter((p) => p.dpi === 400).length / allPlayers.length * 100)}%)</li>
          <li>800 DPI — {allPlayers.filter((p) => p.dpi === 800).length} players ({Math.round(allPlayers.filter((p) => p.dpi === 800).length / allPlayers.length * 100)}%)</li>
          <li>1600 DPI — {allPlayers.filter((p) => p.dpi === 1600).length} players ({Math.round(allPlayers.filter((p) => p.dpi === 1600).length / allPlayers.length * 100)}%)</li>
          <li>Other — {allPlayers.filter((p) => ![400, 800, 1600].includes(p.dpi)).length} players</li>
        </ul>

        <h2>All Featured Pro Players (A-Z)</h2>
        <p>{proPlayers.length} players with detailed profiles including biography, achievements, and mouse history:</p>
        <ul>
          {[...proPlayers].sort((a, b) => a.name.localeCompare(b.name)).map((p) => {
            const ms = mouseSlug(p.mouse);
            return (
              <li key={`${p.name}-${p.game}`}>
                <a href={`/players/${slug(p.name)}`}>{p.name}</a> — {p.game} ({p.team}),
                uses {ms ? <a href={`/mice/${ms}`}>{p.mouse}</a> : p.mouse}, {p.dpi} DPI, {p.edpi} eDPI
              </li>
            );
          })}
        </ul>

        <nav aria-label="Related pages">
          <h2>Related Pages</h2>
          <ul>
            <li><a href="/mice">All Esports Mice — Full Database</a></li>
            <li><a href="/sensitivity">Sensitivity Converter — Convert Between Games</a></li>
            <li><a href="/games">Mouse Usage by Game</a></li>
            <li><a href="/brands">Mouse Brand Comparison</a></li>
            <li><a href="/compare">Compare Mice Side by Side</a></li>
            <li><a href="/sensors">Sensor Comparison</a></li>
            <li><a href="/trends">Industry Trends</a></li>
            <li><a href="/shapes">Mouse Shape Overlay</a></li>
            <li><a href="/lab">Mouse Finder Quiz</a></li>
            <li><a href="/">EsportsMice Home</a></li>
          </ul>
        </nav>
      </article>

      <SSRSection>
        <SSRTitle accent="Pro">Players</SSRTitle>
        <SSRSub>Mouse settings and gear for {allPlayers.length.toLocaleString()}+ professional esports players across {games.length} competitive titles.</SSRSub>
        <SSRGrid>
          <SSRStat label="Total Players" value={allPlayers.length.toLocaleString() + "+"} color="#00ff6a" />
          <SSRStat label="Full Profiles" value={proPlayers.length} color="#00ff6a" />
          <SSRStat label="Games" value={games.length} color="#00ff6a" />
          <SSRStat label="Avg DPI" value={avgDpi} color="#00ff6a" />
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/sensitivity">Sensitivity</SSRLink>
          <SSRLink href="/games">Games</SSRLink>
          <SSRLink href="/brands">Brands</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="players" />
    </>
  );
}
