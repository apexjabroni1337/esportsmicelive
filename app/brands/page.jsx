import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { mice, allPlayers, proPlayers, BRAND_COLORS, amazonLink } from "@/data";

const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

export const metadata = {
  title: "Brands — Esports Mouse Manufacturers Compared",
  description: "Compare Razer, Logitech, Zowie, Finalmouse, Pulsar, Lamzu, SteelSeries, Corsair, and more. Pro share, mouse lineups, average weight, pricing, and expert ratings for every esports mouse brand.",
  alternates: { canonical: "https://esportsmice.com/brands" },
  openGraph: {
    title: "Brands — Esports Mouse Manufacturers Compared",
    description: "Compare the top gaming mouse brands used by professional esports players.",
    url: "https://esportsmice.com/brands",
    images: [{ url: "https://esportsmice.com/og?title=Brands&subtitle=Razer+%C2%B7+Logitech+%C2%B7+Zowie+%C2%B7+Finalmouse+%C2%B7+Pulsar+%C2%B7+Lamzu", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function BrandsPage() {
  const brandData = [...new Set(mice.map((m) => m.brand))].map((brand) => {
    const brandMice = mice.filter((m) => m.brand === brand);
    const avgWeight = Math.round(brandMice.reduce((a, m) => a + m.weight, 0) / brandMice.length);
    const avgPrice = Math.round(brandMice.reduce((a, m) => a + m.price, 0) / brandMice.length);
    const avgRating = (brandMice.reduce((a, m) => a + m.rating, 0) / brandMice.length).toFixed(1);
    const totalProUsage = brandMice.reduce((a, m) => a + m.proUsage, 0);
    const lightest = [...brandMice].sort((a, b) => a.weight - b.weight)[0];
    const mostPopular = [...brandMice].sort((a, b) => b.proUsage - a.proUsage)[0];
    const sensors = [...new Set(brandMice.map((m) => m.sensor))];
    const shapes = [...new Set(brandMice.map((m) => m.shape))];
    const priceRange = `$${Math.min(...brandMice.map((m) => m.price))}-$${Math.max(...brandMice.map((m) => m.price))}`;
    const weightRange = `${Math.min(...brandMice.map((m) => m.weight))}g-${Math.max(...brandMice.map((m) => m.weight))}g`;
    const brandPros = proPlayers.filter((p) => {
      const pm = p.mouse.toLowerCase();
      return brandMice.some((m) => pm.includes(m.name.toLowerCase()) || m.name.toLowerCase().includes(pm));
    });
    return { brand, mice: brandMice, avgWeight, avgPrice, avgRating, totalProUsage, lightest, mostPopular, sensors, shapes, priceRange, weightRange, pros: brandPros };
  }).sort((a, b) => b.totalProUsage - a.totalProUsage);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ItemList",
        name: "Esports Mouse Brands Ranked by Pro Usage",
        numberOfItems: brandData.length,
        itemListElement: brandData.map((b, i) => ({
          "@type": "ListItem", position: i + 1,
          url: `https://esportsmice.com/brands/${slug(b.brand)}`,
          name: b.brand,
          item: { "@type": "Brand", name: b.brand },
        })),
      }) }} />
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Esports Mouse Brands — Complete Comparison and Analysis</h1>
        <p>
          Compare {brandData.length} gaming mouse manufacturers used by professional esports players.
          See mouse lineups, pro usage share, average specs, pricing, and featured pro players for each brand.
        </p>

        <h2>Brand Rankings Overview</h2>
        <table>
          <caption>All esports mouse brands ranked by combined pro usage</caption>
          <thead><tr><th>Rank</th><th>Brand</th><th>Mice</th><th>Pro Usage</th><th>Avg Weight</th><th>Price Range</th><th>Avg Rating</th><th>Most Popular</th></tr></thead>
          <tbody>
            {brandData.map((b, i) => (
              <tr key={b.brand}>
                <td>{i + 1}</td>
                <td><a href={`/brands/${slug(b.brand)}`}>{b.brand}</a></td>
                <td>{b.mice.length}</td>
                <td>{b.totalProUsage}%</td>
                <td>{b.avgWeight}g</td>
                <td>{b.priceRange}</td>
                <td>{b.avgRating}/10</td>
                <td><a href={`/mice/${slug(b.mostPopular.name)}`}>{b.mostPopular.name}</a></td>
              </tr>
            ))}
          </tbody>
        </table>

        {brandData.map((b) => (
          <section key={b.brand}>
            <h2><a href={`/brands/${slug(b.brand)}`}>{b.brand} — Complete Esports Mouse Lineup</a></h2>
            <p>
              {b.brand} has {b.mice.length} esports mice with a combined {b.totalProUsage}% pro usage.
              Weight range: {b.weightRange}. Price range: {b.priceRange}. Average rating: {b.avgRating}/10.
              Sensors used: {b.sensors.join(", ")}. Shapes offered: {b.shapes.join(", ")}.
              <a href={`/brands/${slug(b.brand)}`}> View full {b.brand} page →</a>
            </p>

            <h3>{b.brand} Mouse Lineup</h3>
            <table>
              <thead><tr><th>Mouse</th><th>Weight</th><th>Sensor</th><th>Shape</th><th>Price</th><th>Pro Usage</th><th>Rating</th></tr></thead>
              <tbody>
                {b.mice.sort((a, c) => c.proUsage - a.proUsage).map((m) => (
                  <tr key={m.id}>
                    <td><a href={`/mice/${slug(m.name)}`}>{m.name}</a></td>
                    <td>{m.weight}g</td>
                    <td><a href="/sensors">{m.sensor}</a></td>
                    <td>{m.shape}</td>
                    <td><a href={amazonLink(m.name)}>${m.price}</a></td>
                    <td>{m.proUsage}%</td>
                    <td>{m.rating}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {b.pros.length > 0 && (
              <>
                <h3>Pro Players Using {b.brand} Mice</h3>
                <table>
                  <thead><tr><th>Player</th><th>Game</th><th>Team</th><th>Mouse</th></tr></thead>
                  <tbody>
                    {b.pros.slice(0, 10).map((p, i) => (
                      <tr key={`${p.name}-${i}`}>
                        <td><a href={`/players/${slug(p.name)}`}>{p.name}</a></td>
                        <td>{p.game}</td>
                        <td>{p.team}</td>
                        <td>{p.mouse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </section>
        ))}

        <nav aria-label="Brand Pages">
          <h2>Individual Brand Pages</h2>
          <ul>
            {brandData.map((b) => (
              <li key={b.brand}><a href={`/brands/${slug(b.brand)}`}>{b.brand} Esports Mice — {b.mice.length} mice, {b.totalProUsage}% pro usage</a></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Related">
          <h2>Related Pages</h2>
          <ul>
            <li><a href="/mice">All Esports Mice</a></li>
            <li><a href="/players">Pro Player Settings</a></li>
            <li><a href="/sensors">Sensor Comparison</a></li>
            <li><a href="/trends">Industry Trends</a></li>
            <li><a href="/compare">Compare Mice</a></li>
            <li><a href="/games">Mouse Usage by Game</a></li>
            <li><a href="/">EsportsMice Home</a></li>
          </ul>
        </nav>
      </article>

      <SSRSection>
        <SSRTitle accent="Mouse">Brands</SSRTitle>
        <SSRSub>Compare {brandData.length} gaming mouse manufacturers. Pro usage share, lineups, average specs, pricing, and featured players for each brand.</SSRSub>
        <SSRGrid>
          {brandData.slice(0, 4).map((b) => (
            <SSRStat key={b.brand} label={b.brand} value={`${b.totalProUsage}% pro`} color={BRAND_COLORS[b.brand]} />
          ))}
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          {brandData.map((b) => (
            <SSRLink key={b.brand} href={`/brands/${slug(b.brand)}`}>{b.brand}</SSRLink>
          ))}
        </div>
        <SSRDivider />
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/players">Pro Settings</SSRLink>
          <SSRLink href="/sensors">Sensors</SSRLink>
          <SSRLink href="/trends">Trends</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="brands" />
    </>
  );
}
