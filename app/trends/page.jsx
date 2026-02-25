import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { mice, allPlayers, weightTrend, pollingTrend, wirelessTrend, priceTrend } from "@/data";

const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const metadata = {
  title: "Trends — Esports Mouse Industry Trends & Data",
  description: "Track the evolution of pro esports mice from 2019-2025. Weight trends, polling rate adoption, wireless growth, price changes, brand dominance shifts, and technology adoption data.",
  alternates: { canonical: "https://esportsmice.com/trends" },
  openGraph: {
    title: "Trends — Esports Mouse Industry Trends & Data",
    description: "Track the evolution of pro esports mice from 2019-2025.",
    url: "https://esportsmice.com/trends",
    images: [{ url: "https://esportsmice.com/og?title=Trends&subtitle=Weight+%C2%B7+Polling+Rate+%C2%B7+Wireless+%C2%B7+Price+%C2%B7+2019-2025", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function TrendsPage() {
  const under50 = mice.filter((m) => m.weight < 50);
  const over4k = mice.filter((m) => m.pollingRate >= 4000);
  const over8k = mice.filter((m) => m.pollingRate >= 8000);
  const wireless = mice.filter((m) => m.connectivity === "Wireless");
  const under100 = mice.filter((m) => m.price < 100);

  const byYear = {};
  mice.forEach((m) => { if (m.releaseYear) { if (!byYear[m.releaseYear]) byYear[m.releaseYear] = []; byYear[m.releaseYear].push(m); } });

  return (
    <>
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Esports Mouse Industry Trends — Data from 2019 to 2025</h1>
        <p>
          The professional esports mouse landscape has transformed dramatically. From the ultralight revolution
          to 8KHz polling rates and near-universal wireless adoption, competitive peripherals have evolved
          faster in the past 5 years than in the previous 20.
        </p>

        <h2>Current State of Pro Esports Mice</h2>
        <ul>
          <li>Mice under 50g: {under50.length} — {under50.map((m) => <span key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> ({m.weight}g), </span>)}</li>
          <li>4KHz+ polling rate: {over4k.length} mice ({Math.round(over4k.length/mice.length*100)}% of database)</li>
          <li>8KHz polling rate: {over8k.length} mice</li>
          <li>Wireless: {wireless.length} of {mice.length} ({Math.round(wireless.length/mice.length*100)}%)</li>
          <li>Under $100: {under100.length} mice</li>
        </ul>

        <h2>Average Mouse Weight Trend</h2>
        <p>The weight race defined the early 2020s, with brands competing to hit new lows while maintaining structural integrity.</p>
        <table>
          <caption>Average esports mouse weight by year</caption>
          <thead><tr><th>Year</th><th>Avg Weight</th><th>Change</th></tr></thead>
          <tbody>{weightTrend.map((d, i) => (
            <tr key={d.year}><td>{d.year}</td><td>{d.avgWeight || d.weight}g</td><td>{i > 0 ? `${((d.avgWeight || d.weight) - (weightTrend[i-1].avgWeight || weightTrend[i-1].weight)).toFixed(1)}g` : "—"}</td></tr>
          ))}</tbody>
        </table>

        <h2>Maximum Polling Rate Trend</h2>
        <p>Polling rates skyrocketed from the universal 1000Hz standard to 8000Hz, cutting input latency from 1ms to 0.125ms.</p>
        <table>
          <caption>Maximum available polling rate by year</caption>
          <thead><tr><th>Year</th><th>Max Hz</th><th>Latency</th></tr></thead>
          <tbody>{pollingTrend.map((d) => (
            <tr key={d.year}><td>{d.year}</td><td>{(d.max || d.avg || 0).toLocaleString()} Hz</td><td>{(1000/(d.max || d.avg || 1000)).toFixed(3)}ms</td></tr>
          ))}</tbody>
        </table>

        <h2>Wireless Adoption Trend</h2>
        <p>Wireless went from a competitive disadvantage to the dominant choice for professionals.</p>
        <table>
          <caption>Wireless mouse adoption in professional esports</caption>
          <thead><tr><th>Year</th><th>Wireless %</th></tr></thead>
          <tbody>{wirelessTrend.map((d) => <tr key={d.year}><td>{d.year}</td><td>{d.wireless}%</td></tr>)}</tbody>
        </table>

        <h2>Average Price Trend</h2>
        <table>
          <caption>Average esports mouse price by year</caption>
          <thead><tr><th>Year</th><th>Avg Price</th></tr></thead>
          <tbody>{priceTrend.map((d) => <tr key={d.year}><td>{d.year}</td><td>${d.price}</td></tr>)}</tbody>
        </table>

        <h2>Mice Released by Year</h2>
        {Object.entries(byYear).sort((a, b) => b[0] - a[0]).map(([year, yearMice]) => (
          <section key={year}>
            <h3>{year} Releases ({yearMice.length} mice)</h3>
            <ul>
              {yearMice.map((m) => (
                <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> ({m.brand}) — {m.weight}g, ${m.price}</li>
              ))}
            </ul>
          </section>
        ))}

        <h2>Key Technology Milestones</h2>
        <ul>
          <li>2020 — Logitech G Pro X Superlight popularizes sub-63g wireless mice</li>
          <li>2021 — Finalmouse Starlight-12 achieves 42g with magnesium alloy</li>
          <li>2022 — Razer introduces 4KHz wireless polling with HyperPolling dongle</li>
          <li>2023 — Multiple brands offer 4KHz polling as standard</li>
          <li>2024 — 8KHz polling becomes available; sub-45g wireless mice proliferate</li>
          <li>2025 — HITS (magnetic induction) switches debut in Logitech Superstrike; PAW3950 sensor launches</li>
        </ul>

        <nav aria-label="Related"><ul>
          <li><a href="/mice">All Esports Mice</a></li>
          <li><a href="/brands">Brand Comparison</a></li>
          <li><a href="/sensors">Sensor Analytics</a></li>
          <li><a href="/players">Pro Player Settings</a></li>
          <li><a href="/games">Mouse Usage by Game</a></li>
          <li><a href="/compare">Compare Mice</a></li>
          <li><a href="/">EsportsMice Home</a></li>
        </ul></nav>
      </article>

      <SSRSection>
        <SSRTitle accent="Industry">Trends</SSRTitle>
        <SSRSub>How professional esports mice have evolved from 2019 to 2025 — weight, polling rate, wireless adoption, and pricing data.</SSRSub>
        <SSRGrid>
          <SSRStat label="Under 50g" value={`${under50.length} mice`} color="#00ff6a" />
          <SSRStat label="8KHz Polling" value={`${over8k.length} mice`} color="#00ff6a" />
          <SSRStat label="Wireless" value={`${Math.round(wireless.length/mice.length*100)}%`} color="#00ff6a" />
          <SSRStat label="Under $100" value={`${under100.length} mice`} color="#00ff6a" />
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/brands">Brands</SSRLink>
          <SSRLink href="/sensors">Sensors</SSRLink>
          <SSRLink href="/players">Pro Settings</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="trends" />
    </>
  );
}
