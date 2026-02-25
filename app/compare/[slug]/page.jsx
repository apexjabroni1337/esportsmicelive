import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { mice, allPlayers, BRAND_COLORS, MOUSE_IMAGE_URLS, amazonLink } from "@/data";

const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

// Generate top 15 mice pairs = 105 comparison pages
const TOP_N = 15;
const topMice = [...mice].sort((a, b) => b.proUsage - a.proUsage).slice(0, TOP_N);

function getPair(pairSlug) {
  // Try all combinations to find the matching pair
  for (let i = 0; i < mice.length; i++) {
    for (let j = i + 1; j < mice.length; j++) {
      const combo = slug(mice[i].name) + "-vs-" + slug(mice[j].name);
      const comboRev = slug(mice[j].name) + "-vs-" + slug(mice[i].name);
      if (pairSlug === combo || pairSlug === comboRev) {
        return [mice[i], mice[j]];
      }
    }
  }
  return null;
}

export function generateStaticParams() {
  const params = [];
  for (let i = 0; i < topMice.length; i++) {
    for (let j = i + 1; j < topMice.length; j++) {
      params.push({ slug: slug(topMice[i].name) + "-vs-" + slug(topMice[j].name) });
    }
  }
  return params;
}

export function generateMetadata({ params }) {
  const pair = getPair(params.slug);
  if (!pair) return { title: "Mouse Comparison" };
  const [a, b] = pair;

  const title = `${a.name} vs ${b.name} — Side-by-Side Comparison`;
  const description = `Compare the ${a.name} (${a.weight}g, $${a.price}, ${a.proUsage}% pro usage) vs ${b.name} (${b.weight}g, $${b.price}, ${b.proUsage}% pro usage). Full specs, sensor, shape, polling rate, and pro player data head-to-head.`;

  return {
    title,
    description,
    alternates: { canonical: `https://esportsmice.com/compare/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `https://esportsmice.com/compare/${params.slug}`,
      images: [{
        url: `https://esportsmice.com/og?title=${encodeURIComponent(a.name + " vs " + b.name)}&subtitle=${encodeURIComponent("Head-to-Head Comparison")}&stat1=${encodeURIComponent(a.weight + "g vs " + b.weight + "g")}&s1Label=Weight&stat2=${encodeURIComponent(a.proUsage + "% vs " + b.proUsage + "%")}&s2Label=Pro+Usage&stat3=${encodeURIComponent("$" + a.price + " vs $" + b.price)}&s3Label=Price`,
        width: 1200, height: 630,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function winner(a, b, key, lower = false) {
  if (a[key] === b[key]) return "tie";
  if (lower) return a[key] < b[key] ? "a" : "b";
  return a[key] > b[key] ? "a" : "b";
}

export default function ComparisonPage({ params }) {
  const pair = getPair(params.slug);
  if (!pair) return <EsportsMice initialTab="compare" />;
  const [a, b] = pair;

  const aPlayers = allPlayers.filter(p => {
    const pm = p.mouse.toLowerCase();
    const mn = a.name.toLowerCase();
    return pm === mn || pm.includes(mn) || mn.includes(pm);
  }).slice(0, 10);
  const bPlayers = allPlayers.filter(p => {
    const pm = p.mouse.toLowerCase();
    const mn = b.name.toLowerCase();
    return pm === mn || pm.includes(mn) || mn.includes(pm);
  }).slice(0, 10);

  const specs = [
    { label: "Weight", aVal: `${a.weight}g`, bVal: `${b.weight}g`, winner: winner(a, b, "weight", true), detail: "Lighter mice allow faster flicks with less fatigue" },
    { label: "Sensor", aVal: a.sensor, bVal: b.sensor, winner: "tie", detail: "Both sensors are top-tier for competitive play" },
    { label: "Polling Rate", aVal: `${a.pollingRate >= 1000 ? a.pollingRate/1000 + "K" : a.pollingRate}Hz`, bVal: `${b.pollingRate >= 1000 ? b.pollingRate/1000 + "K" : b.pollingRate}Hz`, winner: winner(a, b, "pollingRate"), detail: "Higher polling = less input delay" },
    { label: "Shape", aVal: a.shape, bVal: b.shape, winner: "tie", detail: "Shape preference is subjective" },
    { label: "Connectivity", aVal: a.connectivity, bVal: b.connectivity, winner: "tie" },
    { label: "Price", aVal: `$${a.price}`, bVal: `$${b.price}`, winner: winner(a, b, "price", true), detail: "Lower price = better value" },
    { label: "Pro Usage", aVal: `${a.proUsage}%`, bVal: `${b.proUsage}%`, winner: winner(a, b, "proUsage"), detail: "Higher adoption among professional players" },
    { label: "Rating", aVal: `${a.rating}/10`, bVal: `${b.rating}/10`, winner: winner(a, b, "rating"), detail: "Expert review score" },
  ];

  const aWins = specs.filter(s => s.winner === "a").length;
  const bWins = specs.filter(s => s.winner === "b").length;

  // Other popular comparisons
  const otherComparisons = [];
  for (let i = 0; i < topMice.length && otherComparisons.length < 8; i++) {
    for (let j = i + 1; j < topMice.length && otherComparisons.length < 8; j++) {
      const s = slug(topMice[i].name) + "-vs-" + slug(topMice[j].name);
      if (s !== params.slug) {
        otherComparisons.push({ slug: s, a: topMice[i].name, b: topMice[j].name });
      }
    }
  }

  return (
    <>
      {/* Comparison JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `Is the ${a.name} or ${b.name} better for esports?`, acceptedAnswer: { "@type": "Answer", text: `The ${a.name} has ${a.proUsage}% pro usage vs ${b.proUsage}% for the ${b.name}. The ${a.name} weighs ${a.weight}g and costs $${a.price}, while the ${b.name} weighs ${b.weight}g at $${b.price}. ${aWins > bWins ? `The ${a.name} wins in ${aWins} categories` : bWins > aWins ? `The ${b.name} wins in ${bWins} categories` : "They tie overall"} in our head-to-head comparison. The best choice depends on hand size, grip style, and personal preference.` }},
          { "@type": "Question", name: `${a.name} vs ${b.name} — which is lighter?`, acceptedAnswer: { "@type": "Answer", text: `The ${a.weight < b.weight ? a.name + " is lighter at " + a.weight + "g vs " + b.weight + "g" : b.weight < a.weight ? b.name + " is lighter at " + b.weight + "g vs " + a.weight + "g" : "both weigh the same at " + a.weight + "g"}. ${a.weight < b.weight ? "That's " + (b.weight - a.weight) + "g lighter" : b.weight < a.weight ? "That's " + (a.weight - b.weight) + "g lighter" : ""}.` }},
          { "@type": "Question", name: `Which mouse do more pros use — ${a.name} or ${b.name}?`, acceptedAnswer: { "@type": "Answer", text: `The ${a.proUsage > b.proUsage ? a.name + " is more popular among pros with " + a.proUsage + "% usage vs " + b.proUsage + "%" : b.name + " is more popular among pros with " + b.proUsage + "% usage vs " + a.proUsage + "%"}. Pro usage is tracked across ${allPlayers.length}+ players in our database.` }},
        ],
      }) }} />
      {/* Breadcrumb */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "EsportsMice", item: "https://esportsmice.com" },
          { "@type": "ListItem", position: 2, name: "Compare", item: "https://esportsmice.com/compare" },
          { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: `https://esportsmice.com/compare/${params.slug}` },
        ],
      }) }} />

      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>{a.name} vs {b.name} — Head-to-Head Esports Mouse Comparison</h1>
        <p>Detailed side-by-side comparison of the {a.name} and {b.name}. Compare weight, sensor, polling rate, shape, price, pro usage, and rating.</p>

        <h2>Specification Comparison</h2>
        <table>
          <caption>{a.name} vs {b.name} — Full Specs</caption>
          <thead><tr><th>Spec</th><th>{a.name}</th><th>{b.name}</th><th>Winner</th></tr></thead>
          <tbody>
            {specs.map(s => (
              <tr key={s.label}>
                <td>{s.label}</td>
                <td>{s.aVal}</td>
                <td>{s.bVal}</td>
                <td>{s.winner === "a" ? a.name : s.winner === "b" ? b.name : "Tie"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Verdict</h2>
        <p>
          {aWins > bWins
            ? `The ${a.name} wins ${aWins} out of ${specs.length} categories. It is the better choice for players who prioritize ${specs.filter(s => s.winner === "a").map(s => s.label.toLowerCase()).join(", ")}.`
            : bWins > aWins
            ? `The ${b.name} wins ${bWins} out of ${specs.length} categories. It is the better choice for players who prioritize ${specs.filter(s => s.winner === "b").map(s => s.label.toLowerCase()).join(", ")}.`
            : `Both mice are evenly matched with ${aWins} wins each. The best choice comes down to personal shape preference and grip style.`}
        </p>

        <h2>Pro Players Using {a.name}</h2>
        <ul>
          {aPlayers.map(p => (
            <li key={p.name}><a href={`/players/${slug(p.name)}`}>{p.name}</a> ({p.game}, {p.team}) — {p.dpi} DPI, {p.edpi} eDPI</li>
          ))}
        </ul>

        <h2>Pro Players Using {b.name}</h2>
        <ul>
          {bPlayers.map(p => (
            <li key={p.name}><a href={`/players/${slug(p.name)}`}>{p.name}</a> ({p.game}, {p.team}) — {p.dpi} DPI, {p.edpi} eDPI</li>
          ))}
        </ul>

        <h2>Buy</h2>
        <ul>
          <li><a href={amazonLink(a.name)}>Buy {a.name} on Amazon</a> — ${a.price}</li>
          <li><a href={amazonLink(b.name)}>Buy {b.name} on Amazon</a> — ${b.price}</li>
        </ul>

        <h2>More Comparisons</h2>
        <ul>
          {otherComparisons.map(c => (
            <li key={c.slug}><a href={`/compare/${c.slug}`}>{c.a} vs {c.b}</a></li>
          ))}
        </ul>

        <nav aria-label="Related"><ul>
          <li><a href={`/mice/${slug(a.name)}`}>{a.name} Full Review</a></li>
          <li><a href={`/mice/${slug(b.name)}`}>{b.name} Full Review</a></li>
          <li><a href="/mice">All Esports Mice</a></li>
          <li><a href="/compare">Compare Tool</a></li>
          <li><a href="/players">Pro Player Settings</a></li>
        </ul></nav>
      </article>

      <SSRSection>
        <SSRTitle accent={a.name}>{`vs ${b.name}`}</SSRTitle>
        <SSRSub>Head-to-head comparison of two popular esports mice. {aWins > bWins ? `${a.name} wins ${aWins}/${specs.length} categories.` : bWins > aWins ? `${b.name} wins ${bWins}/${specs.length} categories.` : "Evenly matched."}</SSRSub>
        <SSRGrid>
          <SSRStat label={a.name} value={`${a.weight}g · $${a.price}`} color={BRAND_COLORS[a.brand] || "#00ff6a"} />
          <SSRStat label={b.name} value={`${b.weight}g · $${b.price}`} color={BRAND_COLORS[b.brand] || "#00b4ff"} />
          <SSRStat label="Pro Usage" value={`${a.proUsage}% vs ${b.proUsage}%`} color="#f59e0b" />
          <SSRStat label="Verdict" value={aWins > bWins ? `${a.name.split(" ")[0]} wins` : bWins > aWins ? `${b.name.split(" ")[0]} wins` : "Tied"} color="#00ff6a" />
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href={`/mice/${slug(a.name)}`}>{a.name}</SSRLink>
          <SSRLink href={`/mice/${slug(b.name)}`}>{b.name}</SSRLink>
          <SSRLink href="/compare">Compare Tool</SSRLink>
          <SSRLink href="/mice">All Mice</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="compare" />
    </>
  );
}
