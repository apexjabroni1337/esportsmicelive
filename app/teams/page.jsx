import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink } from "@/components/ssr";
import { allPlayers } from "@/data";

const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

export const metadata = {
  title: "Pro Esports Teams — Mouse & Gear Choices by Organization",
  description: "Explore mouse and gear choices across 350+ professional esports teams. See what mice Team Liquid, FaZe Clan, Fnatic, Natus Vincere, G2, and every other pro org use across CS2, Valorant, LoL, Dota 2, and more.",
  alternates: { canonical: "https://esportsmice.com/teams" },
  openGraph: {
    title: "Pro Esports Teams — Mouse & Gear Choices by Organization",
    description: "Explore mouse and gear choices across 350+ professional esports teams.",
    url: "https://esportsmice.com/teams",
    images: [{ url: "https://esportsmice.com/og?title=Teams&subtitle=Mouse+choices+across+350%2B+pro+esports+organizations", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function TeamsPage() {
  const teamMap = {};
  allPlayers.forEach(p => {
    if (!p.team || p.team === "Free Agent" || p.team === "Content Creator" || p.team === "Content" || p.team === "Retired" || p.team === "Streamer") return;
    if (!teamMap[p.team]) teamMap[p.team] = { count: 0, games: new Set() };
    teamMap[p.team].count++;
    teamMap[p.team].games.add(p.game);
  });
  const teamCount = Object.keys(teamMap).length;
  const gameCount = new Set(allPlayers.map(p => p.game)).size;
  const topTeams = Object.entries(teamMap).sort((a, b) => b[1].count - a[1].count).slice(0, 20);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ItemList",
        name: "Professional Esports Teams",
        numberOfItems: teamCount,
        itemListElement: topTeams.slice(0, 20).map(([team, data], i) => ({
          "@type": "ListItem", position: i + 1,
          url: `https://esportsmice.com/teams/${slug(team)}`,
          name: team,
          item: { "@type": "SportsTeam", name: team },
        })),
      }) }} />
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Professional Esports Teams — Mouse & Gear Data</h1>
        <p>
          Comprehensive mouse and peripheral data for {teamCount} professional esports organizations
          across {gameCount} major competitive titles.
        </p>
        <h2>Top Teams by Players Tracked</h2>
        <ul>
          {topTeams.map(([name, data]) => (
            <li key={name}>{name} — {data.count} players across {data.games.size} games</li>
          ))}
        </ul>
        <nav aria-label="Related"><ul>
          <li><a href="/mice">All Esports Mice</a></li>
          <li><a href="/players">Pro Player Settings</a></li>
          <li><a href="/games">Mouse Usage by Game</a></li>
          <li><a href="/brands">Brand Comparison</a></li>
          <li><a href="/">EsportsMice Home</a></li>
        </ul></nav>
      </article>

      <SSRSection>
        <SSRTitle accent="Pro">Teams</SSRTitle>
        <SSRSub>Mouse and gear choices across {teamCount} professional esports organizations in {gameCount} major titles.</SSRSub>
        <SSRGrid>
          <SSRStat label="Organizations" value={teamCount} color="#38bdf8" />
          <SSRStat label="Games" value={gameCount} color="#00ff6a" />
          <SSRStat label="Players Tracked" value={allPlayers.length} color="#f59e0b" />
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/players">Pro Settings</SSRLink>
          <SSRLink href="/games">By Game</SSRLink>
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/brands">Brands</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="teams" />
    </>
  );
}
