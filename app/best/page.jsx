import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { allPlayers } from "@/data";

export const metadata = {
  title: "Best Gaming Mouse Guides (2026) — By Game, Weight, Budget & More",
  description: `Find the best esports gaming mouse for your game and playstyle. Pro-data-driven guides for CS2, Valorant, Fortnite, Apex Legends, and more. Based on data from ${2100}+ professional players.`,
  alternates: { canonical: "https://esportsmice.com/best" },
  openGraph: {
    title: "Best Gaming Mouse Guides (2026) — By Game, Weight, Budget & More",
    description: "Find the best esports gaming mouse for your game and playstyle.",
    url: "https://esportsmice.com/best",
    images: [{ url: "https://esportsmice.com/og?title=Best+Esports+Mice&subtitle=Guides+by+Game+%C2%B7+Weight+%C2%B7+Budget+%C2%B7+2026", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

const GUIDES = [
  { slug: "cs2", label: "Best Mouse for CS2", sub: "Counter-Strike 2 pro picks" },
  { slug: "valorant", label: "Best Mouse for Valorant", sub: "Tactical FPS pro picks" },
  { slug: "fortnite", label: "Best Mouse for Fortnite", sub: "Build & aim pro picks" },
  { slug: "apex", label: "Best Mouse for Apex Legends", sub: "Battle royale pro picks" },
  { slug: "overwatch-2", label: "Best Mouse for Overwatch 2", sub: "Hero shooter pro picks" },
  { slug: "r6-siege", label: "Best Mouse for R6 Siege", sub: "Tactical shooter pro picks" },
  { slug: "lol", label: "Best Mouse for League of Legends", sub: "MOBA pro picks" },
  { slug: "pubg", label: "Best Mouse for PUBG", sub: "Battle royale pro picks" },
  { slug: "call-of-duty", label: "Best Mouse for Call of Duty", sub: "Arena FPS pro picks" },
  { slug: "dota-2", label: "Best Mouse for Dota 2", sub: "MOBA pro picks" },
  { slug: "marvel-rivals", label: "Best Mouse for Marvel Rivals", sub: "Hero shooter pro picks" },
  { slug: "rocket-league", label: "Best Mouse for Rocket League", sub: "Vehicular soccer picks" },
  { slug: "wireless", label: "Best Wireless Gaming Mouse", sub: "Top wireless picks" },
  { slug: "lightweight", label: "Best Lightweight Gaming Mouse", sub: "Ultralight under 60g" },
  { slug: "budget", label: "Best Budget Gaming Mouse", sub: "Top picks under $80" },
];

export default function BestIndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ItemList",
        name: "Best Gaming Mouse Guides",
        itemListElement: GUIDES.map((g, i) => ({
          "@type": "ListItem", position: i + 1,
          url: `https://esportsmice.com/best/${g.slug}`,
          name: g.label,
        })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "EsportsMice", item: "https://esportsmice.com" },
          { "@type": "ListItem", position: 2, name: "Best Mice Guides", item: "https://esportsmice.com/best" },
        ],
      }) }} />

      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Best Gaming Mouse Guides (2026)</h1>
        <p>Data-driven guides to the best esports gaming mice, broken down by game, weight class, and budget. Every recommendation is backed by real pro player usage data from {allPlayers.length}+ tracked professionals.</p>

        <h2>Best Mouse by Game</h2>
        <ul>
          {GUIDES.filter(g => !["wireless", "lightweight", "budget"].includes(g.slug)).map(g => (
            <li key={g.slug}><a href={`/best/${g.slug}`}>{g.label}</a> — {g.sub}</li>
          ))}
        </ul>

        <h2>Best Mouse by Category</h2>
        <ul>
          {GUIDES.filter(g => ["wireless", "lightweight", "budget"].includes(g.slug)).map(g => (
            <li key={g.slug}><a href={`/best/${g.slug}`}>{g.label}</a> — {g.sub}</li>
          ))}
        </ul>

        <nav aria-label="Related"><ul>
          <li><a href="/mice">All Esports Mice</a></li>
          <li><a href="/compare">Compare Mice</a></li>
          <li><a href="/players">Pro Player Settings</a></li>
        </ul></nav>
      </article>

      <SSRSection>
        <SSRTitle accent="Best Mice">Guides by Game & Category</SSRTitle>
        <SSRSub>Data-driven recommendations backed by {allPlayers.length}+ pro player setups. Find the perfect mouse for your game.</SSRSub>
        <SSRGrid>
          {GUIDES.map(g => (
            <SSRLink key={g.slug} href={`/best/${g.slug}`}>{g.label}</SSRLink>
          ))}
        </SSRGrid>
      </SSRSection>

      <EsportsMice initialTab="rankings" />
    </>
  );
}
