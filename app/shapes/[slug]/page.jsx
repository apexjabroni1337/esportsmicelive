import EsportsMice from "@/components/ClientApp";
import { mice, allPlayers, BRAND_COLORS, MOUSE_DIMS, amazonLink } from "@/data";

const sl = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

const SHAPES = {
  symmetrical: {
    title: "Symmetrical",
    aka: "Ambidextrous",
    description: "Symmetrical (ambidextrous) mice have a mirror-image design that is identical on both sides. They are the dominant shape in professional esports, favored by claw and fingertip grip players for their versatility and precision. The symmetrical form allows rapid micro-adjustments and consistent tracking regardless of how you position your hand. Notable symmetrical designs include the Razer Viper V3 Pro, Logitech G Pro X Superlight, Finalmouse UltralightX, and Zowie FK series. Over 70% of professional FPS players use symmetrical mice.",
    gripAdvice: "Best for claw grip and fingertip grip. Palm grip users with smaller hands can also be comfortable with larger symmetrical mice. The flat sides provide consistent contact points for precise control during fast flick movements.",
    prosAdvice: "Symmetrical mice dominate competitive FPS because they allow the widest range of grip adjustments mid-game. Players can shift their hand position forward for aggressive play or back for passive angles without losing control. The consistent side profile also makes it easier to develop muscle memory for consistent aim.",
  },
  ergonomic: {
    title: "Ergonomic",
    aka: "Right-Handed",
    description: "Ergonomic (right-handed) mice feature an asymmetric design that curves to fit the natural resting position of the right hand. They provide superior comfort for long sessions by reducing wrist strain and encouraging a more relaxed grip. Classic ergonomic designs like the Razer DeathAdder, Zowie EC series, and Vaxee Outset have been staples in professional gaming for over a decade. While less common than symmetrical mice in the pro scene, ergonomic mice are preferred by players who prioritize comfort and use a palm or relaxed claw grip.",
    gripAdvice: "Best for palm grip and relaxed claw grip. The contoured shape fills the hand naturally, reducing the need for grip pressure. Not recommended for fingertip grip due to the pronounced hump and curved sides.",
    prosAdvice: "Ergonomic mice are favored by players who play long sessions or who prioritize comfort over raw speed. Many Counter-Strike veterans who grew up on the Zowie EC or Microsoft IntelliMouse Explorer 3.0 continue to prefer ergonomic shapes even as the meta shifts toward symmetrical designs.",
  },
};

export function generateStaticParams() {
  return Object.keys(SHAPES).map(s => ({ slug: s }));
}

export function generateMetadata({ params }) {
  const shape = SHAPES[params.slug];
  if (!shape) return { title: "Shape Not Found" };

  const shapeMice = mice.filter(m => m.shape === shape.title);
  const description = `${shape.title} (${shape.aka}) gaming mice — ${shapeMice.length} mice reviewed. Pro usage data, top picks, weight and price comparisons. Find the best ${shape.title.toLowerCase()} mouse for your grip style.`;

  return {
    title: `Best ${shape.title} Gaming Mice — ${shapeMice.length} Mice Compared`,
    description,
    alternates: { canonical: `https://esportsmice.com/shapes/${params.slug}` },
    openGraph: {
      title: `Best ${shape.title} Gaming Mice — ${shapeMice.length} Mice Compared`,
      description,
      url: `https://esportsmice.com/shapes/${params.slug}`,
      images: [{ url: `https://esportsmice.com/og?title=Best+${shape.title}+Mice&subtitle=${shapeMice.length}+Mice+Compared+%C2%B7+Pro+Usage+Data`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function ShapePage({ params }) {
  const shape = SHAPES[params.slug];
  if (!shape) {
    return (
      <>
        <div style={{ padding: 40, textAlign: "center", color: "#fff" }}><h1>Shape Not Found</h1></div>
        <EsportsMice initialTab="shapes" />
      </>
    );
  }

  const shapeMice = mice.filter(m => m.shape === shape.title).sort((a, b) => b.proUsage - a.proUsage);
  const totalProUsage = shapeMice.reduce((a, m) => a + m.proUsage, 0);
  const avgWeight = Math.round(shapeMice.reduce((a, m) => a + m.weight, 0) / shapeMice.length);
  const avgPrice = Math.round(shapeMice.reduce((a, m) => a + m.price, 0) / shapeMice.length);
  const brands = [...new Set(shapeMice.map(m => m.brand))].sort();
  const lightestMouse = [...shapeMice].sort((a, b) => a.weight - b.weight)[0];
  const mostUsedMouse = shapeMice[0];
  const budgetPick = [...shapeMice].filter(m => m.proUsage > 0.5).sort((a, b) => a.price - b.price)[0];
  const wirelessCount = shapeMice.filter(m => m.wireless).length;

  // Count pro players using this shape
  let playerCount = 0;
  allPlayers.forEach(p => {
    if (!p.mouse) return;
    const matched = shapeMice.find(m => {
      const mn = m.name.toLowerCase();
      const pm = p.mouse.toLowerCase();
      return pm === mn || pm.includes(mn) || mn.includes(pm);
    });
    if (matched) playerCount++;
  });

  const otherShape = params.slug === "symmetrical" ? "ergonomic" : "symmetrical";
  const otherShapeData = SHAPES[otherShape];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Best ${shape.title} Gaming Mice`,
        description: shape.description,
        url: `https://esportsmice.com/shapes/${params.slug}`,
        numberOfItems: shapeMice.length,
        itemListElement: shapeMice.slice(0, 10).map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: m.name,
            brand: { "@type": "Brand", name: m.brand },
            url: `https://esportsmice.com/mice/${sl(m.name)}`,
          },
        })),
      }) }} />

      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Best {shape.title} ({shape.aka}) Gaming Mice for Esports — {shapeMice.length} Mice Compared</h1>

        <h2>What is a {shape.title} Mouse?</h2>
        <p>{shape.description}</p>

        <h2>Grip Style Guide for {shape.title} Mice</h2>
        <p>{shape.gripAdvice}</p>

        <h2>Why Pros Choose {shape.title} Mice</h2>
        <p>{shape.prosAdvice}</p>

        <h2>{shape.title} Mouse Statistics</h2>
        <table>
          <caption>Overview of {shape.title.toLowerCase()} mice in professional esports</caption>
          <tbody>
            <tr><th>Total {shape.title} Mice</th><td>{shapeMice.length}</td></tr>
            <tr><th>Combined Pro Usage</th><td>{totalProUsage}%</td></tr>
            <tr><th>Pro Players Using</th><td>{playerCount}</td></tr>
            <tr><th>Average Weight</th><td>{avgWeight}g</td></tr>
            <tr><th>Average Price</th><td>${avgPrice}</td></tr>
            <tr><th>Wireless Options</th><td>{wirelessCount} of {shapeMice.length}</td></tr>
            <tr><th>Brands</th><td>{brands.join(", ")}</td></tr>
            {mostUsedMouse && <tr><th>Most Used by Pros</th><td><a href={`/mice/${sl(mostUsedMouse.name)}`}>{mostUsedMouse.name}</a> ({mostUsedMouse.proUsage}%)</td></tr>}
            {lightestMouse && <tr><th>Lightest</th><td><a href={`/mice/${sl(lightestMouse.name)}`}>{lightestMouse.name}</a> ({lightestMouse.weight}g)</td></tr>}
            {budgetPick && <tr><th>Best Budget Pick</th><td><a href={`/mice/${sl(budgetPick.name)}`}>{budgetPick.name}</a> (${budgetPick.price})</td></tr>}
          </tbody>
        </table>

        <h2>All {shape.title} Mice Ranked by Pro Usage</h2>
        <table>
          <caption>{shapeMice.length} {shape.title.toLowerCase()} gaming mice ranked by professional player usage</caption>
          <thead><tr><th>Rank</th><th>Mouse</th><th>Brand</th><th>Weight</th><th>Price</th><th>Pro Usage</th><th>Sensor</th><th>Connectivity</th></tr></thead>
          <tbody>
            {shapeMice.map((m, i) => (
              <tr key={m.id}>
                <td>{i + 1}</td>
                <td><a href={`/mice/${sl(m.name)}`}>{m.name}</a></td>
                <td><a href={`/brands/${sl(m.brand)}`}>{m.brand}</a></td>
                <td>{m.weight}g</td>
                <td>${m.price}</td>
                <td>{m.proUsage}%</td>
                <td><a href={`/sensors/${sl(m.sensor)}`}>{m.sensor}</a></td>
                <td>{m.connectivity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Related Pages</h2>
        <nav>
          <ul>
            <li><a href={`/shapes/${otherShape}`}>Best {otherShapeData.title} Mice</a></li>
            <li><a href="/shapes">Shape Overlay Comparison Tool</a></li>
            <li><a href="/mice">All Mice</a></li>
            <li><a href="/lab">Mouse Finder Quiz</a></li>
            {shapeMice.slice(0, 5).map(m => <li key={m.id}><a href={`/mice/${sl(m.name)}`}>{m.name} Review</a></li>)}
          </ul>
        </nav>
      </article>

      <EsportsMice initialTab="shapes" />
    </>
  );
}
