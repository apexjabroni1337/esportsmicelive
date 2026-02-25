import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { allPlayers, mice, proPlayers, GAME_DESCRIPTIONS } from "@/data";

const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
const findMouse = (name) => mice.find((m) => name.includes(m.name) || m.name.includes(name));
const mSlug = (name) => { const m = findMouse(name); return m ? slug(m.name) : null; };

export const metadata = {
  title: "Games — Mouse DNA by Esports Title",
  description: "Discover which mice dominate each esports game. CS2, Valorant, League of Legends, Fortnite, Apex Legends, Dota 2, Call of Duty, R6 Siege and more — brand splits, top mice, DPI averages, and gear culture per game.",
  alternates: { canonical: "https://esportsmice.com/games" },
  openGraph: {
    title: "Games — Mouse DNA by Esports Title",
    description: "Discover which mice dominate each esports game. Brand splits, top mice, DPI averages per game.",
    url: "https://esportsmice.com/games",
    images: [{ url: "https://esportsmice.com/og?title=Games&subtitle=Mouse+DNA+%C2%B7+13+Esports+Titles+%C2%B7+Brand+Splits+%C2%B7+DPI+Data", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function GamesPage() {
  const games = [...new Set(allPlayers.map((p) => p.game))].sort((a, b) =>
    allPlayers.filter((p) => p.game === b).length - allPlayers.filter((p) => p.game === a).length
  );
  const totalPlayers = allPlayers.length;
  const globalAvgDpi = Math.round(allPlayers.reduce((a, p) => a + p.dpi, 0) / totalPlayers);
  const globalAvgEdpi = Math.round(allPlayers.reduce((a, p) => a + p.edpi, 0) / totalPlayers);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ItemList",
        name: "Esports Games — Mouse Usage by Title",
        description: `Mouse preferences across ${games.length} major esports games`,
        numberOfItems: games.length,
        itemListElement: games.map((g, i) => ({
          "@type": "ListItem", position: i + 1,
          url: `https://esportsmice.com/games/${slug(g)}`,
          name: g,
        })),
      }) }} />
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Esports Games — Mouse DNA, Settings, and Gear Culture by Game</h1>
        <p>
          Every esports title has its own mouse meta. Discover which mice, brands, and settings dominate
          across {games.length} major competitive games covering {totalPlayers.toLocaleString()} professional players.
          Global average DPI: {globalAvgDpi}. Global average eDPI: {globalAvgEdpi}.
        </p>

        <h2>All Games Overview</h2>
        <table>
          <caption>Summary of mouse usage across {games.length} esports titles</caption>
          <thead><tr><th>Game</th><th>Players</th><th>Avg DPI</th><th>Avg eDPI</th><th>Top Mouse</th></tr></thead>
          <tbody>
            {games.map((game) => {
              const players = allPlayers.filter((p) => p.game === game);
              const avgDpi = Math.round(players.reduce((a, p) => a + p.dpi, 0) / players.length);
              const avgEdpi = Math.round(players.reduce((a, p) => a + p.edpi, 0) / players.length);
              const counts = {};
              players.forEach((p) => { counts[p.mouse] = (counts[p.mouse] || 0) + 1; });
              const topMouse = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
              return (
                <tr key={game}>
                  <td><a href={`/games/${slug(game)}`}>{game}</a></td>
                  <td>{players.length}</td>
                  <td>{avgDpi}</td>
                  <td>{avgEdpi}</td>
                  <td>{topMouse ? topMouse[0] : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {games.map((game) => {
          const players = allPlayers.filter((p) => p.game === game);
          const avgDpi = Math.round(players.reduce((a, p) => a + p.dpi, 0) / players.length);
          const avgEdpi = Math.round(players.reduce((a, p) => a + p.edpi, 0) / players.length);
          const medianEdpi = [...players].sort((a, b) => a.edpi - b.edpi)[Math.floor(players.length / 2)]?.edpi;
          const dpi400 = players.filter((p) => p.dpi === 400).length;
          const dpi800 = players.filter((p) => p.dpi === 800).length;
          const dpi1600 = players.filter((p) => p.dpi === 1600).length;

          const mouseCounts = {};
          players.forEach((p) => { mouseCounts[p.mouse] = (mouseCounts[p.mouse] || 0) + 1; });
          const topMice = Object.entries(mouseCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

          const brandCounts = {};
          players.forEach((p) => {
            const m = findMouse(p.mouse);
            if (m) brandCounts[m.brand] = (brandCounts[m.brand] || 0) + 1;
          });
          const topBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

          const gamePros = proPlayers.filter((p) => p.game === game);
          const desc = GAME_DESCRIPTIONS[game];

          return (
            <section key={game}>
              <h2><a href={`/games/${slug(game)}`}>{game}</a> — Complete Mouse Usage Analysis</h2>
              {desc && <p>{desc}</p>}
              <p>
                {players.length} professional {game} players tracked. Average DPI: {avgDpi}. Average eDPI: {avgEdpi}.
                Median eDPI: {medianEdpi}. DPI distribution: {dpi400} use 400 DPI ({Math.round(dpi400/players.length*100)}%),
                {dpi800} use 800 DPI ({Math.round(dpi800/players.length*100)}%),
                {dpi1600} use 1600 DPI ({Math.round(dpi1600/players.length*100)}%).
              </p>

              <h3>Most Popular Mice in {game}</h3>
              <ol>
                {topMice.map(([mouse, count]) => {
                  const ms = mSlug(mouse);
                  return (
                    <li key={mouse}>
                      {ms ? <a href={`/mice/${ms}`}>{mouse}</a> : mouse} — {count} players ({Math.round(count/players.length*100)}%)
                    </li>
                  );
                })}
              </ol>

              <h3>Brand Market Share in {game}</h3>
              <ul>
                {topBrands.map(([brand, count]) => (
                  <li key={brand}><a href="/brands">{brand}</a> — {count} players ({Math.round(count/players.length*100)}%)</li>
                ))}
              </ul>

              {gamePros.length > 0 && (
                <>
                  <h3>Top {game} Pro Players</h3>
                  <table>
                    <thead><tr><th>Player</th><th>Team</th><th>Role</th><th>Mouse</th><th>DPI</th><th>eDPI</th></tr></thead>
                    <tbody>
                      {gamePros.slice(0, 10).map((p) => {
                        const ms = mSlug(p.mouse);
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
                </>
              )}
            </section>
          );
        })}

        <nav aria-label="Related"><ul>
          <li><a href="/mice">All Esports Mice</a></li>
          <li><a href="/players">Pro Player Settings</a></li>
          <li><a href="/sensitivity">Sensitivity Converter</a></li>
          <li><a href="/brands">Mouse Brands</a></li>
          <li><a href="/sensors">Sensor Analytics</a></li>
          <li><a href="/trends">Industry Trends</a></li>
          <li><a href="/compare">Compare Mice</a></li>
          <li><a href="/">EsportsMice Home</a></li>
        </ul></nav>
      </article>

      <SSRSection>
        <SSRTitle accent="Games">Mouse DNA</SSRTitle>
        <SSRSub>Which mice, brands, and settings dominate across {games.length} major competitive esports titles covering {totalPlayers.toLocaleString()} professionals.</SSRSub>
        <SSRGrid>
          <SSRStat label="Games" value={games.length} color="#00ff6a" />
          <SSRStat label="Total Players" value={totalPlayers.toLocaleString()} color="#00ff6a" />
          <SSRStat label="Avg DPI" value={globalAvgDpi} color="#00ff6a" />
          <SSRStat label="Avg eDPI" value={globalAvgEdpi} color="#00ff6a" />
        </SSRGrid>
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#ffffff40" }}>Select a game</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {games.map((g) => (
            <SSRLink key={g} href={`/games/${slug(g)}`}>{g} ({allPlayers.filter((p) => p.game === g).length})</SSRLink>
          ))}
        </div>
        <SSRDivider />
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/players">Pro Settings</SSRLink>
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/sensitivity">Sensitivity</SSRLink>
          <SSRLink href="/brands">Brands</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="games" />
    </>
  );
}
