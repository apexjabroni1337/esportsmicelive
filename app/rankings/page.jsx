import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink } from "@/components/ssr";
import { mice, allPlayers } from "@/data";

export const metadata = {
  title: "Mouse Rankings — Pro Esports Mouse Tier List & Comparison",
  description: "Complete esports mouse rankings sorted by pro usage, weight, price, sensor, and more. Compare every gaming mouse side by side with data from 2100+ professional players.",
  alternates: { canonical: "https://esportsmice.com/rankings" },
  openGraph: {
    title: "Mouse Rankings — Pro Esports Mouse Tier List & Comparison",
    description: "Complete esports mouse rankings sorted by pro usage, weight, price, and more.",
    url: "https://esportsmice.com/rankings",
    images: [{ url: "https://esportsmice.com/og?title=Mouse+Rankings&subtitle=Pro+Esports+Mouse+Tier+List+%C2%B7+2100%2B+Players", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mouse Rankings — Pro Esports Mouse Tier List & Comparison",
    description: "Complete esports mouse rankings sorted by pro usage, weight, price, and more.",
  },
};

export default function RankingsPage() {
  const sorted = [...mice].sort((a, b) => b.proUsage - a.proUsage);
  const totalPlayers = allPlayers.length;

  return (
    <>
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Esports Mouse Rankings — Complete Tier List by Pro Usage</h1>
        <p>
          Comprehensive rankings of {mice.length} professional esports gaming mice, sorted by pro player
          adoption rate. Based on real data from {totalPlayers.toLocaleString()}+ professional players across
          {" "}{new Set(allPlayers.map(p => p.game)).size} major competitive titles.
        </p>
        <h2>Top 20 Esports Mice by Pro Usage</h2>
        <ol>
          {sorted.slice(0, 20).map((m) => (
            <li key={m.id}>
              <a href={`/mice/${m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{m.name}</a>
              {" "}— {m.brand}, {m.weight}g, {m.proUsage}% pro usage, ${m.price}
            </li>
          ))}
        </ol>
      </article>

      <SSRSection>
        <SSRTitle accent="MOUSE">RANKINGS</SSRTitle>
        <SSRSub>
          Complete esports mouse tier list ranked by professional player usage. Sort by weight, price,
          sensor, polling rate, and more across {mice.length} gaming mice.
        </SSRSub>
        <SSRGrid>
          <SSRStat label="Mice Ranked" value={mice.length} color="#d4af37" />
          <SSRStat label="Pro Players" value={totalPlayers.toLocaleString() + "+"} color="#d4af37" />
          <SSRStat label="#1 Mouse" value={sorted[0]?.name || "—"} color="#d4af37" />
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/compare">Compare</SSRLink>
          <SSRLink href="/best">Best Guides</SSRLink>
          <SSRLink href="/sensors">Sensors</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="rankings" />
    </>
  );
}
