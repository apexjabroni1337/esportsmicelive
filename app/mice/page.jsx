import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { mice, allPlayers, proPlayers, BRAND_COLORS, MOUSE_DESCRIPTIONS, amazonLink } from "@/data";

const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

export const metadata = {
  title: "All Esports Mice — Complete Database & Rankings",
  description: "Browse every mouse used by professional esports players. Filter by brand, weight, sensor, polling rate, and price. Compare 150+ gaming mice with full specs and pro usage statistics.",
  alternates: { canonical: "https://esportsmice.com/mice" },
  openGraph: {
    title: "All Esports Mice — Complete Database & Rankings",
    description: "Browse every mouse used by professional esports players. 150+ gaming mice with full specs and pro usage statistics.",
    url: "https://esportsmice.com/mice",
    images: [{ url: "https://esportsmice.com/og?title=All+Esports+Mice&subtitle=Complete+Database+%C2%B7+150%2B+Mice+%C2%B7+Full+Specs+%C2%B7+Pro+Usage", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function MicePage() {
  const sorted = [...mice].sort((a, b) => b.proUsage - a.proUsage);
  const brands = [...new Set(mice.map((m) => m.brand))];
  const sensors = [...new Set(mice.map((m) => m.sensor))];
  const avgWeight = Math.round(mice.reduce((a, m) => a + m.weight, 0) / mice.length);
  const avgPrice = Math.round(mice.reduce((a, m) => a + m.price, 0) / mice.length);
  const lightest = [...mice].sort((a, b) => a.weight - b.weight)[0];
  const heaviest = [...mice].sort((a, b) => b.weight - a.weight)[0];
  const cheapest = [...mice].sort((a, b) => a.price - b.price)[0];
  const mostExpensive = [...mice].sort((a, b) => b.price - a.price)[0];
  const highestRated = [...mice].sort((a, b) => b.rating - a.rating)[0];
  const wirelessCount = mice.filter((m) => m.connectivity === "Wireless").length;

  return (
    <>
      {/* ItemList schema for rich results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ItemList",
        name: "Best Esports Mice Ranked by Pro Usage",
        description: `Top ${mice.length} professional esports gaming mice ranked by pro player adoption`,
        numberOfItems: sorted.length,
        itemListElement: sorted.slice(0, 20).map((m, i) => ({
          "@type": "ListItem", position: i + 1,
          url: `https://esportsmice.com/mice/${slug(m.name)}`,
          name: m.name,
          item: { "@type": "Product", name: m.name, brand: { "@type": "Brand", name: m.brand }, description: `${m.name} by ${m.brand}. ${m.weight}g ${m.shape.toLowerCase()} mouse with ${m.sensor} sensor. ${m.proUsage}% pro usage.` },
        })),
      }) }} />
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>All Esports Gaming Mice — Complete Database and Rankings</h1>
        <p>
          Browse our complete database of {mice.length} professional esports gaming mice used by
          {allPlayers.length.toLocaleString()}+ professional players. Every mouse includes full specifications,
          pro usage statistics, expert ratings, and purchase links.
        </p>

        <h2>Quick Stats</h2>
        <ul>
          <li>Total mice in database: {mice.length}</li>
          <li>Average weight: {avgWeight}g</li>
          <li>Average price: ${avgPrice}</li>
          <li>Lightest: <a href={`/mice/${slug(lightest.name)}`}>{lightest.name}</a> ({lightest.weight}g)</li>
          <li>Heaviest: <a href={`/mice/${slug(heaviest.name)}`}>{heaviest.name}</a> ({heaviest.weight}g)</li>
          <li>Cheapest: <a href={`/mice/${slug(cheapest.name)}`}>{cheapest.name}</a> (${cheapest.price})</li>
          <li>Most expensive: <a href={`/mice/${slug(mostExpensive.name)}`}>{mostExpensive.name}</a> (${mostExpensive.price})</li>
          <li>Highest rated: <a href={`/mice/${slug(highestRated.name)}`}>{highestRated.name}</a> ({highestRated.rating}/10)</li>
          <li>Wireless: {wirelessCount} of {mice.length} ({Math.round(wirelessCount / mice.length * 100)}%)</li>
          <li>Brands represented: {brands.length}</li>
          <li>Sensors represented: {sensors.length}</li>
        </ul>

        <h2>Esports Mice Ranked by Pro Usage</h2>
        <table>
          <caption>All {mice.length} esports mice sorted by professional player usage</caption>
          <thead>
            <tr><th>Rank</th><th>Mouse</th><th>Brand</th><th>Weight</th><th>Sensor</th><th>Polling Rate</th><th>Shape</th><th>Price</th><th>Pro Usage</th><th>Rating</th></tr>
          </thead>
          <tbody>
            {sorted.map((m, i) => (
              <tr key={m.id}>
                <td>{i + 1}</td>
                <td><a href={`/mice/${slug(m.name)}`}>{m.name}</a></td>
                <td><a href="/brands">{m.brand}</a></td>
                <td>{m.weight}g</td>
                <td><a href="/sensors">{m.sensor}</a></td>
                <td>{m.pollingRate.toLocaleString()} Hz</td>
                <td>{m.shape}</td>
                <td>${m.price}</td>
                <td>{m.proUsage}%</td>
                <td>{m.rating}/10</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Mice by Weight Category</h2>
        <h3>Ultralight (Under 50g)</h3>
        <ul>
          {mice.filter((m) => m.weight < 50).sort((a, b) => a.weight - b.weight).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — {m.weight}g ({m.brand}), ${m.price}</li>
          ))}
        </ul>
        <h3>Lightweight (50-60g)</h3>
        <ul>
          {mice.filter((m) => m.weight >= 50 && m.weight <= 60).sort((a, b) => a.weight - b.weight).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — {m.weight}g ({m.brand}), ${m.price}</li>
          ))}
        </ul>
        <h3>Medium (61-70g)</h3>
        <ul>
          {mice.filter((m) => m.weight > 60 && m.weight <= 70).sort((a, b) => a.weight - b.weight).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — {m.weight}g ({m.brand}), ${m.price}</li>
          ))}
        </ul>
        <h3>Standard (Over 70g)</h3>
        <ul>
          {mice.filter((m) => m.weight > 70).sort((a, b) => a.weight - b.weight).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — {m.weight}g ({m.brand}), ${m.price}</li>
          ))}
        </ul>

        <h2>Mice by Brand</h2>
        {brands.sort().map((brand) => {
          const brandMice = mice.filter((m) => m.brand === brand).sort((a, b) => b.proUsage - a.proUsage);
          return (
            <section key={brand}>
              <h3><a href="/brands">{brand}</a> ({brandMice.length} mice)</h3>
              <ul>
                {brandMice.map((m) => (
                  <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — {m.weight}g, {m.sensor}, ${m.price}, {m.proUsage}% pro usage</li>
                ))}
              </ul>
            </section>
          );
        })}

        <h2>Mice by Sensor</h2>
        {sensors.map((sensor) => {
          const sensorMice = mice.filter((m) => m.sensor === sensor);
          return (
            <section key={sensor}>
              <h3><a href="/sensors">{sensor}</a> ({sensorMice.length} mice)</h3>
              <ul>
                {sensorMice.map((m) => (
                  <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> ({m.brand})</li>
                ))}
              </ul>
            </section>
          );
        })}

        <h2>Mice by Shape</h2>
        {[...new Set(mice.map((m) => m.shape))].map((shape) => {
          const shapeMice = mice.filter((m) => m.shape === shape);
          return (
            <section key={shape}>
              <h3>{shape} Shape ({shapeMice.length} mice)</h3>
              <ul>
                {shapeMice.map((m) => (
                  <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> ({m.brand}, {m.weight}g)</li>
                ))}
              </ul>
            </section>
          );
        })}

        <h2>Mice by Price Range</h2>
        <h3>Budget (Under $80)</h3>
        <ul>
          {mice.filter((m) => m.price < 80).sort((a, b) => a.price - b.price).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — ${m.price} ({m.brand})</li>
          ))}
        </ul>
        <h3>Mid-Range ($80-$150)</h3>
        <ul>
          {mice.filter((m) => m.price >= 80 && m.price <= 150).sort((a, b) => a.price - b.price).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — ${m.price} ({m.brand})</li>
          ))}
        </ul>
        <h3>Premium (Over $150)</h3>
        <ul>
          {mice.filter((m) => m.price > 150).sort((a, b) => a.price - b.price).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — ${m.price} ({m.brand})</li>
          ))}
        </ul>

        <nav aria-label="Related"><ul>
          <li><a href="/players">Pro Player Settings and Gear</a></li>
          <li><a href="/brands">Brand Comparison and Analysis</a></li>
          <li><a href="/sensors">Sensor Analytics and Comparison</a></li>
          <li><a href="/compare">Compare Any Two Mice Side by Side</a></li>
          <li><a href="/shapes">Mouse Shape Overlay Tool</a></li>
          <li><a href="/games">Mouse Usage by Esports Game</a></li>
          <li><a href="/trends">Mouse Industry Trends 2019-2025</a></li>
          <li><a href="/sensitivity">Sensitivity Converter</a></li>
          <li><a href="/lab">Mouse Finder Quiz</a></li>
          <li><a href="/">EsportsMice Home</a></li>
        </ul></nav>
      </article>

      <SSRSection>
        <SSRTitle accent="All">Esports Mice</SSRTitle>
        <SSRSub>Complete database of {mice.length} professional esports gaming mice with full specs, pro usage stats, and expert ratings.</SSRSub>
        <SSRGrid>
          <SSRStat label="Total Mice" value={mice.length} color="#00ff6a" />
          <SSRStat label="Avg Weight" value={`${avgWeight}g`} color="#00ff6a" />
          <SSRStat label="Avg Price" value={`$${avgPrice}`} color="#00ff6a" />
          <SSRStat label="Wireless" value={`${Math.round(wirelessCount/mice.length*100)}%`} color="#00ff6a" />
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/players">Pro Settings</SSRLink>
          <SSRLink href="/compare">Compare</SSRLink>
          <SSRLink href="/brands">Brands</SSRLink>
          <SSRLink href="/sensors">Sensors</SSRLink>
          <SSRLink href="/shapes">Shapes</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="mice" />
    </>
  );
}
