import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { mice, allPlayers, proPlayers, BRAND_COLORS } from "@/data";

export const metadata = {
  title: "EsportsMice — The Definitive Guide to Pro Esports Mice",
  description: "The #1 database of professional esports mice. Compare mice used by 2100+ pro players across CS2, Valorant, League of Legends, Fortnite, and 10+ major competitive titles. Full specs, rankings, and pro settings.",
  alternates: { canonical: "https://esportsmice.com" },
  openGraph: {
    title: "EsportsMice — The Definitive Guide to Pro Esports Mice",
    description: "The #1 database of professional esports mice. Compare mice used by 2100+ pro players across 13 major games.",
    url: "https://esportsmice.com",
    images: [{ url: "https://esportsmice.com/og?title=The+Definitive+Guide+to+Pro+Esports+Mice&subtitle=2100%2B+Pro+Players+%C2%B7+150%2B+Mice+%C2%B7+13+Games", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EsportsMice — The Definitive Guide to Pro Esports Mice",
    description: "The #1 database of professional esports mice. Compare mice used by 2100+ pro players across 13 major games.",
  },
};

export default function HomePage() {
  const totalPlayers = allPlayers.length;
  const totalMice = mice.length;
  const totalGames = new Set(allPlayers.map((p) => p.game)).size;
  const topMice = [...mice].sort((a, b) => b.proUsage - a.proUsage).slice(0, 10);
  const topBrands = Object.entries(
    mice.reduce((acc, m) => { acc[m.brand] = (acc[m.brand] || 0) + m.proUsage; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 7);

  return (
    <>
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>EsportsMice — The Definitive Guide to Pro Esports Gaming Mice</h1>
        <p>
          EsportsMice is the most comprehensive database of professional esports gaming mice, tracking
          the gear and settings of {totalPlayers.toLocaleString()}+ professional players across {totalGames} major
          competitive titles including Counter-Strike 2, Valorant, League of Legends, Fortnite, Dota 2,
          Apex Legends, Call of Duty, Overwatch 2, Rainbow Six Siege, and more.
        </p>
        <p>
          Our database covers {totalMice} gaming mice from brands including Razer, Logitech, Zowie, Finalmouse,
          Pulsar, Lamzu, SteelSeries, Corsair, and more. Every mouse includes full specifications, pro usage
          statistics, expert ratings, and direct purchase links.
        </p>

        <h2>Most Popular Esports Mice in {new Date().getFullYear()}</h2>
        <ol>
          {topMice.map((m) => (
            <li key={m.id}>
              <a href={`/mice/${m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{m.name}</a>
              {" "}— {m.brand}, {m.weight}g, {m.proUsage}% pro usage, ${m.price}
            </li>
          ))}
        </ol>

        <h2>Top Mouse Brands in Professional Esports</h2>
        <ul>
          {topBrands.map(([brand, usage]) => (
            <li key={brand}><a href="/brands">{brand}</a> — {usage}% combined pro usage</li>
          ))}
        </ul>

        <h2>Featured Pro Players</h2>
        <ul>
          {proPlayers.slice(0, 20).map((p) => {
            const pm = mice.find((m) => p.mouse.includes(m.name) || m.name.includes(p.mouse));
            const mSlug = pm ? pm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : null;
            return (
              <li key={`${p.name}-${p.game}`}>
                <a href={`/players/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{p.name}</a>
                {" "}— {p.game} ({p.team}) — Uses{" "}
                {mSlug ? <a href={`/mice/${mSlug}`}>{p.mouse}</a> : p.mouse}
                {" "}at {p.dpi} DPI, {p.edpi} eDPI
              </li>
            );
          })}
        </ul>

        <h2>Esports Games Covered</h2>
        <ul>
          {[...new Set(allPlayers.map((p) => p.game))].sort((a, b) => {
            const ca = allPlayers.filter((p) => p.game === a).length;
            const cb = allPlayers.filter((p) => p.game === b).length;
            return cb - ca;
          }).map((game) => (
            <li key={game}><a href={`/games/${game.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`}>{game}</a> — {allPlayers.filter((p) => p.game === game).length} pro players tracked</li>
          ))}
        </ul>

        <h2>Mouse Sensors</h2>
        <ul>
          {[...new Set(mice.map((m) => m.sensor))].slice(0, 8).map((sensor) => (
            <li key={sensor}><a href="/sensors">{sensor}</a> — used in {mice.filter((m) => m.sensor === sensor).length} mice</li>
          ))}
        </ul>

        <nav aria-label="Site sections">
          <h2>Explore EsportsMice</h2>
          <ul>
            <li><a href="/mice">All Esports Mice — Complete database with specs and rankings</a></li>
            <li><a href="/players">Pro Player Settings — DPI, sensitivity, and gear for {totalPlayers.toLocaleString()}+ players</a></li>
            <li><a href="/games">Games — Mouse DNA by esports title</a></li>
            <li><a href="/brands">Brands — Compare Razer, Logitech, Zowie, and more</a></li>
            <li><a href="/sensors">Sensors — PAW3395, Focus Pro 36K, HERO 2 comparison</a></li>
            <li><a href="/trends">Trends — Weight, polling rate, wireless adoption data</a></li>
            <li><a href="/compare">Compare — Side-by-side mouse comparison tool</a></li>
            <li><a href="/sensitivity">Sensitivity Converter — Convert settings between games</a></li>
            <li><a href="/lab">Lab — Find your perfect mouse with our quiz</a></li>
            <li><a href="/shapes">Shape Overlay — Compare mouse dimensions visually</a></li>
          </ul>
        </nav>
      </article>

      <SSRSection>
        <SSRTitle accent="ESPORTS">MICE</SSRTitle>
        <SSRSub>
          The most comprehensive database of professional esports gaming mice, tracking the gear and settings
          of {totalPlayers.toLocaleString()}+ professional players across {totalGames} major competitive titles.
        </SSRSub>
        <SSRGrid>
          <SSRStat label="Pro Players" value={totalPlayers.toLocaleString() + "+"} color="#00ff6a" />
          <SSRStat label="Mice" value={totalMice} color="#00ff6a" />
          <SSRStat label="Games" value={totalGames} color="#00ff6a" />
          <SSRStat label="Profiles" value={proPlayers.length} color="#00ff6a" />
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/players">Pro Settings</SSRLink>
          <SSRLink href="/games">Games</SSRLink>
          <SSRLink href="/brands">Brands</SSRLink>
          <SSRLink href="/sensors">Sensors</SSRLink>
          <SSRLink href="/trends">Trends</SSRLink>
          <SSRLink href="/compare">Compare</SSRLink>
          <SSRLink href="/sensitivity">Sensitivity</SSRLink>
          <SSRLink href="/lab">Lab</SSRLink>
          <SSRLink href="/shapes">Shapes</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="overview" />
    </>
  );
}
