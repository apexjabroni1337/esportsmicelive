import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { mice, allPlayers, proPlayers } from "@/data";

const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

export const metadata = {
  title: "Sensors — Mouse Sensor Analytics & Comparison",
  description: "Comprehensive breakdown of every sensor powering pro esports mice. Compare PAW3395, Focus Pro 36K, HERO 2, PAW3950, and more. Pro usage stats, specifications, and mice using each sensor.",
  alternates: { canonical: "https://esportsmice.com/sensors" },
  openGraph: {
    title: "Sensors — Mouse Sensor Analytics & Comparison",
    description: "Comprehensive breakdown of every sensor powering pro esports mice.",
    url: "https://esportsmice.com/sensors",
    images: [{ url: "https://esportsmice.com/og?title=Sensors&subtitle=PAW3395+%C2%B7+Focus+Pro+36K+%C2%B7+HERO+2+%C2%B7+Pro+Usage+Stats", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function SensorsPage() {
  const sensorData = [...new Set(mice.map((m) => m.sensor))].map((sensor) => {
    const sensorMice = mice.filter((m) => m.sensor === sensor);
    const totalProUsage = sensorMice.reduce((a, m) => a + m.proUsage, 0);
    const avgWeight = Math.round(sensorMice.reduce((a, m) => a + m.weight, 0) / sensorMice.length);
    const avgPrice = Math.round(sensorMice.reduce((a, m) => a + m.price, 0) / sensorMice.length);
    const brands = [...new Set(sensorMice.map((m) => m.brand))];
    const maxDpi = Math.max(...sensorMice.map((m) => m.dpi));
    const maxPolling = Math.max(...sensorMice.map((m) => m.pollingRate));
    const sensorPros = proPlayers.filter((p) =>
      sensorMice.some((m) => p.mouse.includes(m.name) || m.name.includes(p.mouse))
    );
    return { sensor, mice: sensorMice, totalProUsage, avgWeight, avgPrice, brands, maxDpi, maxPolling, pros: sensorPros };
  }).sort((a, b) => b.totalProUsage - a.totalProUsage);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ItemList",
        name: "Esports Mouse Sensors Ranked by Pro Usage",
        numberOfItems: sensorData.length,
        itemListElement: sensorData.map((s, i) => ({
          "@type": "ListItem", position: i + 1,
          url: `https://esportsmice.com/sensors/${slug(s.sensor)}`,
          name: s.sensor,
        })),
      }) }} />
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Mouse Sensor Analytics — Every Sensor in Professional Esports</h1>
        <p>
          Comprehensive breakdown of {sensorData.length} optical sensors powering professional esports mice.
          Compare specifications, pro usage data, and see which sensors dominate competitive gaming.
        </p>

        <h2>Sensor Rankings</h2>
        <table>
          <caption>Mouse sensors ranked by professional player usage</caption>
          <thead><tr><th>Rank</th><th>Sensor</th><th>Mice</th><th>Pro Usage</th><th>Max DPI</th><th>Max Hz</th><th>Brands</th></tr></thead>
          <tbody>
            {sensorData.map((s, i) => (
              <tr key={s.sensor}>
                <td>{i + 1}</td>
                <td>{s.sensor}</td>
                <td>{s.mice.length}</td>
                <td>{s.totalProUsage}%</td>
                <td>{s.maxDpi.toLocaleString()}</td>
                <td>{s.maxPolling.toLocaleString()}</td>
                <td>{s.brands.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {sensorData.map((s) => (
          <section key={s.sensor}>
            <h2>{s.sensor} — Full Analysis</h2>
            <p>
              The {s.sensor} is found in {s.mice.length} esports mice with a combined {s.totalProUsage}% pro usage.
              It supports up to {s.maxDpi.toLocaleString()} DPI and {s.maxPolling.toLocaleString()} Hz polling.
              Average mouse weight with this sensor: {s.avgWeight}g. Average price: ${s.avgPrice}.
              Used by: {s.brands.join(", ")}.
            </p>

            <h3>Mice Using the {s.sensor}</h3>
            <table>
              <thead><tr><th>Mouse</th><th>Brand</th><th>Weight</th><th>Price</th><th>Pro Usage</th><th>Rating</th></tr></thead>
              <tbody>
                {s.mice.sort((a, b) => b.proUsage - a.proUsage).map((m) => (
                  <tr key={m.id}>
                    <td><a href={`/mice/${slug(m.name)}`}>{m.name}</a></td>
                    <td><a href="/brands">{m.brand}</a></td>
                    <td>{m.weight}g</td>
                    <td>${m.price}</td>
                    <td>{m.proUsage}%</td>
                    <td>{m.rating}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {s.pros.length > 0 && (
              <>
                <h3>Pro Players Using {s.sensor} Mice</h3>
                <ul>
                  {s.pros.slice(0, 8).map((p) => (
                    <li key={p.name}>
                      <a href={`/players/${slug(p.name)}`}>{p.name}</a> — {p.game} ({p.team}), {p.mouse}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        ))}

        <nav aria-label="Related"><ul>
          <li><a href="/mice">All Esports Mice</a></li>
          <li><a href="/compare">Compare Mice Side by Side</a></li>
          <li><a href="/brands">Mouse Brands</a></li>
          <li><a href="/players">Pro Player Settings</a></li>
          <li><a href="/trends">Industry Trends</a></li>
          <li><a href="/games">Mouse Usage by Game</a></li>
          <li><a href="/">EsportsMice Home</a></li>
        </ul></nav>
      </article>

      <SSRSection>
        <SSRTitle accent="Sensor">Analytics</SSRTitle>
        <SSRSub>Comprehensive breakdown of {sensorData.length} optical sensors powering professional esports mice. Compare specs, pro usage, and see which sensors dominate.</SSRSub>
        <SSRGrid>
          {sensorData.slice(0, 4).map((s) => (
            <SSRStat key={s.sensor} label={s.sensor} value={`${s.totalProUsage}% pro`} />
          ))}
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/compare">Compare</SSRLink>
          <SSRLink href="/brands">Brands</SSRLink>
          <SSRLink href="/players">Pro Settings</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="sensors" />
    </>
  );
}
