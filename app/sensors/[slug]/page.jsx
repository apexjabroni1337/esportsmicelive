import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { mice, allPlayers, proPlayers, amazonLink, BRAND_COLORS } from "@/data";

const sl = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

const SENSOR_DESCS = {
  "Focus Pro 35K": "Razer's flagship optical sensor co-developed with PixArt, powering the Viper V3 Pro and DeathAdder V3 Pro. It tracks at 35,000 DPI with zero smoothing or acceleration, and supports native 8KHz polling. Its asymmetric cut-off distance lets pros tune lift-off independently from landing. The Focus Pro 35K dethroned Logitech's HERO dominance and redefined what pros expect from tracking hardware.",
  "Focus Pro 36K Gen-2": "The second generation of Razer's Focus Pro sensor, pushing DPI to 36,000 with improved power efficiency and tracking consistency. It powers the latest Razer mice including the Viper V3 Pro updates and DeathAdder V3 HyperSpeed.",
  "Focus Pro 30K": "Razer's earlier flagship sensor found in the original DeathAdder V3 Pro and Viper V3 HyperSpeed. At 30,000 DPI it set the standard before the 35K revision arrived, and still powers several widely-used pro mice.",
  "Focus+": "Razer's pre-Focus Pro sensor line used in the Viper Ultimate and DeathAdder V2 Pro. At 20,000 DPI, it was the sensor that helped Razer establish its optical tracking credentials before the Focus Pro era.",
  "HERO 2": "Logitech's second-generation in-house sensor, designed at their Swiss R&D lab. HERO 2 powers the G Pro X Superlight 2 and Superstrike, delivering 44,000 DPI with sub-micron precision and 10x the power efficiency of its predecessor. Paired with Lightspeed wireless, it's behind more major tournament wins than almost any other sensor.",
  "HERO 25K": "The original HERO sensor that launched Logitech's four-year reign over professional esports. Found in the legendary G Pro X Superlight, it delivered 25,600 DPI with zero smoothing, filtering, or acceleration. Its power efficiency enabled the Superlight's 70-hour battery life at just 63 grams.",
  "HERO": "Logitech's first-generation HERO sensor used in earlier G Pro Wireless models. It set the foundation for Logitech's in-house sensor program and proved that proprietary sensors could compete with PixArt's dominance.",
  "PAW3395": "PixArt's workhorse sensor that democratized flagship-tier tracking for the entire industry. At 26,000 DPI with 650 IPS max tracking speed, it powers mice from Zowie, Pulsar, Lamzu, Ninjutso, and dozens of others. The PAW3395 proved that sensor technology had reached a plateau where differences between 'good' and 'best' were imperceptible to human reflexes.",
  "PAW3950": "PixArt's latest flagship sensor representing the cutting edge of optical tracking. With 8KHz native polling support, 42,000 DPI, and improved power efficiency, it powers the newest generation of mice from Lamzu, Endgame Gear, WLMouse, and ASUS. The PAW3950 is the sensor of choice for 2025's most ambitious mouse designs.",
  "PAW3370": "PixArt's mid-range sensor that bridged the gap between the legacy 3360 and the flagship 3395. Used in several well-regarded mice during the 2021-2022 era, it offered 19,000 DPI with excellent tracking consistency.",
  "PMW3389": "PixArt's upgraded version of the legendary 3360, offering 16,000 DPI and improved power efficiency. It was the go-to sensor for premium mice in the 2018-2020 era before the PAW3395 superseded it.",
  "PMW3360": "The legendary sensor that powered the golden age of esports mice. The PMW3360 was considered the first truly 'flawless' sensor with zero prediction, smoothing, or acceleration. It powered iconic mice like the original Logitech G Pro, Zowie FK/EC series, and dozens more.",
  "PMW3366": "Logitech's customized variant of the PMW3360, used exclusively in Logitech mice. It powered the original G Pro Wireless and G502 Lightspeed, adding Logitech's proprietary surface tuning capabilities.",
  "PMW3310": "An earlier PixArt sensor that was considered excellent for its era. Used in classic mice like the Zowie FK1 and SteelSeries Rival, it was the first sensor many pros considered truly lag-free.",
  "AimPoint Pro": "ASUS ROG's custom sensor built on proprietary silicon, delivering 42,000 DPI with 8KHz polling. ASUS's unique advantage is in-house chip fabrication, enabling tighter integration between sensor, MCU, and wireless radio than any competitor.",
  "Marksman S 33K": "Corsair's proprietary sensor powering the M75 Air and other recent Corsair mice. At 33,000 DPI with low power consumption, it delivers competitive tracking performance at accessible price points.",
  "TrueMove Air": "SteelSeries' optical sensor designed for wireless mice, powering the Aerox 5 Wireless and Prime Wireless. It offers reliable tracking with SteelSeries' custom firmware optimizations.",
  "TrueMove Pro": "SteelSeries' flagship sensor variant found in their highest-end mice, offering improved tracking speed and jitter reduction over the standard TrueMove 3.",
  "TrueMove 3": "SteelSeries' co-developed sensor with PixArt, based on the PMW3360 platform. Found in the Rival 600 and Sensei Ten, it added TrueMove's 1-to-1 tracking at any DPI setting.",
  "XS-1": "Pulsar's proprietary sensor developed for the X2F and future mice. It delivers clean, lag-free tracking optimized specifically for Pulsar's ultra-lightweight designs, competing directly with the PAW3395 in real-world performance.",
  "Custom": "A proprietary sensor developed in-house by the manufacturer, often based on modified PixArt or other reference designs with custom firmware and tuning.",
};

function getSensorData(sensorName) {
  const sensorMice = mice.filter(m => m.sensor === sensorName);
  const totalProUsage = sensorMice.reduce((a, m) => a + m.proUsage, 0);
  const avgWeight = sensorMice.length ? Math.round(sensorMice.reduce((a, m) => a + m.weight, 0) / sensorMice.length) : 0;
  const avgPrice = sensorMice.length ? Math.round(sensorMice.reduce((a, m) => a + m.price, 0) / sensorMice.length) : 0;
  const brands = [...new Set(sensorMice.map(m => m.brand))];
  const maxDpi = sensorMice.length ? Math.max(...sensorMice.map(m => m.dpi)) : 0;
  const maxPolling = sensorMice.length ? Math.max(...sensorMice.map(m => m.pollingRate)) : 0;

  // Count actual pro players using this sensor
  let playerCount = 0;
  const playerList = [];
  allPlayers.forEach(p => {
    if (!p.mouse) return;
    const matched = sensorMice.find(m => {
      const mn = m.name.toLowerCase();
      const pm = p.mouse.toLowerCase();
      return pm === mn || pm.includes(mn) || mn.includes(pm);
    });
    if (matched) {
      playerCount++;
      if (playerList.length < 30) playerList.push(p);
    }
  });

  return { sensorMice, totalProUsage, avgWeight, avgPrice, brands, maxDpi, maxPolling, playerCount, playerList };
}

function getAllSensors() {
  return [...new Set(mice.map(m => m.sensor))].sort();
}

export function generateStaticParams() {
  return getAllSensors().map(s => ({ slug: sl(s) }));
}

export function generateMetadata({ params }) {
  const allSensors = getAllSensors();
  const sensorName = allSensors.find(s => sl(s) === params.slug);
  if (!sensorName) return { title: "Sensor Not Found" };

  const { sensorMice, totalProUsage, playerCount, brands } = getSensorData(sensorName);
  const desc = SENSOR_DESCS[sensorName];
  const description = desc
    ? desc.slice(0, 155) + "..."
    : `${sensorName} sensor — used in ${sensorMice.length} mice by ${brands.join(", ")}. ${totalProUsage}% total pro usage across ${playerCount} tracked professional esports players.`;

  return {
    title: `${sensorName} — Sensor Specs, Pro Usage & Mice`,
    description,
    alternates: { canonical: `https://esportsmice.com/sensors/${params.slug}` },
    openGraph: {
      title: `${sensorName} — Sensor Specs, Pro Usage & Mice`,
      description,
      url: `https://esportsmice.com/sensors/${params.slug}`,
      images: [{ url: `https://esportsmice.com/og?title=${encodeURIComponent(sensorName)}&subtitle=${encodeURIComponent(`${sensorMice.length} Mice · ${totalProUsage}% Pro Usage · ${playerCount} Players`)}`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function SensorPage({ params }) {
  const allSensors = getAllSensors();
  const sensorName = allSensors.find(s => sl(s) === params.slug);

  if (!sensorName) {
    return (
      <>
        <div style={{ padding: 40, textAlign: "center", color: "#fff" }}>
          <h1>Sensor Not Found</h1>
          <p>This sensor doesn&apos;t exist in our database.</p>
        </div>
        <EsportsMice initialTab="sensors" />
      </>
    );
  }

  const { sensorMice, totalProUsage, avgWeight, avgPrice, brands, maxDpi, maxPolling, playerCount, playerList } = getSensorData(sensorName);
  const desc = SENSOR_DESCS[sensorName];

  // Related sensors (same manufacturer or similar DPI range)
  const isPixArt = sensorName.startsWith("PAW") || sensorName.startsWith("PMW");
  const isRazer = sensorName.startsWith("Focus");
  const isLogitech = sensorName.startsWith("HERO");
  const relatedSensors = allSensors.filter(s => {
    if (s === sensorName) return false;
    if (isPixArt && (s.startsWith("PAW") || s.startsWith("PMW"))) return true;
    if (isRazer && s.startsWith("Focus")) return true;
    if (isLogitech && s.startsWith("HERO")) return true;
    return false;
  }).slice(0, 5);

  return (
    <>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: sensorName,
        category: "Gaming Mouse Sensor",
        description: desc || `${sensorName} gaming mouse sensor used in ${sensorMice.length} mice. ${totalProUsage}% total pro usage.`,
        url: `https://esportsmice.com/sensors/${params.slug}`,
        additionalProperty: [
          { "@type": "PropertyValue", name: "Max DPI", value: maxDpi.toLocaleString() },
          { "@type": "PropertyValue", name: "Max Polling Rate", value: `${maxPolling}Hz` },
          { "@type": "PropertyValue", name: "Mice Using Sensor", value: String(sensorMice.length) },
          { "@type": "PropertyValue", name: "Pro Player Usage", value: `${totalProUsage}%` },
          { "@type": "PropertyValue", name: "Brands", value: brands.join(", ") },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://esportsmice.com" },
          { "@type": "ListItem", position: 2, name: "Sensors", item: "https://esportsmice.com/sensors" },
          { "@type": "ListItem", position: 3, name: sensorName, item: `https://esportsmice.com/sensors/${params.slug}` },
        ],
      }) }} />

      {/* Server-rendered SEO content */}
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>{sensorName} — Gaming Mouse Sensor Specifications, Pro Usage and Mice</h1>

        <h2>About the {sensorName}</h2>
        {desc ? <p>{desc}</p> : (
          <p>
            The {sensorName} is a gaming mouse sensor used in {sensorMice.length} mice
            from {brands.join(", ")}. It supports up to {maxDpi.toLocaleString()} DPI
            and {maxPolling >= 1000 ? `${maxPolling / 1000}K` : maxPolling}Hz polling rate.
            {totalProUsage}% of tracked professional esports players use a mouse with this sensor.
          </p>
        )}

        <h2>{sensorName} Specifications</h2>
        <table>
          <caption>Technical specifications for the {sensorName}</caption>
          <tbody>
            <tr><th>Max DPI</th><td>{maxDpi.toLocaleString()}</td></tr>
            <tr><th>Max Polling Rate</th><td>{maxPolling >= 1000 ? `${maxPolling / 1000}K` : maxPolling}Hz</td></tr>
            <tr><th>Mice Using This Sensor</th><td>{sensorMice.length}</td></tr>
            <tr><th>Total Pro Usage</th><td>{totalProUsage}%</td></tr>
            <tr><th>Pro Players Tracked</th><td>{playerCount}</td></tr>
            <tr><th>Brands</th><td>{brands.join(", ")}</td></tr>
            <tr><th>Avg Mouse Weight</th><td>{avgWeight}g</td></tr>
            <tr><th>Avg Mouse Price</th><td>${avgPrice}</td></tr>
          </tbody>
        </table>

        <h2>Mice Using the {sensorName}</h2>
        <table>
          <caption>All gaming mice powered by the {sensorName} sensor</caption>
          <thead><tr><th>Mouse</th><th>Brand</th><th>Weight</th><th>Price</th><th>Pro Usage</th><th>Shape</th></tr></thead>
          <tbody>
            {sensorMice.sort((a, b) => b.proUsage - a.proUsage).map(m => (
              <tr key={m.id}>
                <td><a href={`/mice/${sl(m.name)}`}>{m.name}</a></td>
                <td><a href={`/brands/${sl(m.brand)}`}>{m.brand}</a></td>
                <td>{m.weight}g</td>
                <td>${m.price}</td>
                <td>{m.proUsage}%</td>
                <td>{m.shape}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {playerList.length > 0 && (
          <>
            <h2>Pro Players Using the {sensorName}</h2>
            <p>{playerCount} professional players use a mouse with the {sensorName} sensor.</p>
            <table>
              <caption>Professional players using {sensorName}-powered mice</caption>
              <thead><tr><th>Player</th><th>Game</th><th>Team</th><th>Mouse</th><th>DPI</th></tr></thead>
              <tbody>
                {playerList.map((p, i) => (
                  <tr key={i}>
                    <td><a href={`/players/${sl(p.name)}`}>{p.name}</a></td>
                    <td><a href={`/games/${sl(p.game)}`}>{p.game}</a></td>
                    <td>{p.team}</td>
                    <td><a href={`/mice/${sl(p.mouse)}`}>{p.mouse}</a></td>
                    <td>{p.dpi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <h2>Related Sensors</h2>
        <nav>
          <ul>
            {relatedSensors.map(s => <li key={s}><a href={`/sensors/${sl(s)}`}>{s} Sensor</a></li>)}
            <li><a href="/sensors">All Sensors</a></li>
            <li><a href="/mice">All Mice</a></li>
          </ul>
        </nav>
      </article>

      <EsportsMice initialTab="sensors" />
    </>
  );
}
