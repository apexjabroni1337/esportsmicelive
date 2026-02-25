import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { mice, MOUSE_DESCRIPTIONS, BRAND_COLORS, MOUSE_IMAGE_URLS, allPlayers, amazonLink } from "@/data";

export function generateStaticParams() {
  return mice.map((mouse) => ({
    slug: mouse.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""),
  }));
}

export function generateMetadata({ params }) {
  const mouse = mice.find(
    (m) => m.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") === params.slug
  );
  if (!mouse) {
    return { title: "Mouse Not Found" };
  }
  const desc = MOUSE_DESCRIPTIONS[mouse.name];
  const description = desc
    ? desc.text.slice(0, 155) + "..."
    : `${mouse.name} by ${mouse.brand} — ${mouse.weight}g, ${mouse.sensor} sensor, ${mouse.pollingRate}Hz polling, $${mouse.price}. Used by ${mouse.proUsage}% of tracked pro esports players.`;

  return {
    title: `${mouse.name} — Pro Esports Mouse Review & Stats`,
    description,
    alternates: { canonical: `https://esportsmice.com/mice/${params.slug}` },
    openGraph: {
      title: `${mouse.name} — Pro Esports Mouse Review & Stats`,
      description,
      url: `https://esportsmice.com/mice/${params.slug}`,
      images: [{
        url: `https://esportsmice.com/og?title=${encodeURIComponent(mouse.name)}&subtitle=${encodeURIComponent(`${mouse.brand} · ${mouse.sensor}`)}&badge=${encodeURIComponent(mouse.brand)}&accent=${encodeURIComponent(BRAND_COLORS[mouse.brand] || '#00ff6a')}&stat1=${encodeURIComponent(mouse.weight + 'g')}&s1Label=Weight&stat2=${encodeURIComponent(mouse.proUsage + '%')}&s2Label=Pro+Usage&stat3=${encodeURIComponent('$' + mouse.price)}&s3Label=Price`,
        width: 1200, height: 630,
        alt: `${mouse.name} by ${mouse.brand} - esports gaming mouse`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${mouse.name} — Pro Esports Mouse Review & Stats`,
      description,
      images: [`https://esportsmice.com/og?title=${encodeURIComponent(mouse.name)}&subtitle=${encodeURIComponent(`${mouse.brand} · ${mouse.sensor}`)}&badge=${encodeURIComponent(mouse.brand)}&accent=${encodeURIComponent(BRAND_COLORS[mouse.brand] || '#00ff6a')}&stat1=${encodeURIComponent(mouse.weight + 'g')}&s1Label=Weight&stat2=${encodeURIComponent(mouse.proUsage + '%')}&s2Label=Pro+Usage&stat3=${encodeURIComponent('$' + mouse.price)}&s3Label=Price`],
    },
  };
}

export default function MouseDetailPage({ params }) {
  const mouse = mice.find(
    (m) => m.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") === params.slug
  );
  if (!mouse) return <EsportsMice initialTab="overview" />;

  const desc = MOUSE_DESCRIPTIONS[mouse.name];
  const usedBy = allPlayers.filter((p) => {
    const mn = mouse.name.toLowerCase();
    const pm = p.mouse.toLowerCase();
    return pm === mn || pm.includes(mn) || mn.includes(pm);
  }).slice(0, 30);
  const imgUrl = MOUSE_IMAGE_URLS[mouse.name];

  return (
    <>
      {/* JSON-LD Product structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: mouse.name,
        brand: { "@type": "Brand", name: mouse.brand },
        description: desc ? desc.text.slice(0, 300) : `${mouse.name} by ${mouse.brand}. ${mouse.weight}g ${mouse.shape.toLowerCase()} gaming mouse with ${mouse.sensor} sensor, ${mouse.pollingRate >= 1000 ? `${mouse.pollingRate / 1000}K` : mouse.pollingRate}Hz polling. Used by ${mouse.proUsage}% of pro esports players.`,
        ...(imgUrl ? { image: `https://esportsmice.com${imgUrl}` } : {}),
        offers: {
          "@type": "Offer",
          price: String(mouse.price),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: amazonLink(mouse.name),
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: String(mouse.rating),
          bestRating: "10",
          ratingCount: String(Math.max(usedBy.length, 1)),
        },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Weight", value: `${mouse.weight}g` },
          { "@type": "PropertyValue", name: "Sensor", value: mouse.sensor },
          { "@type": "PropertyValue", name: "Polling Rate", value: `${mouse.pollingRate}Hz` },
          { "@type": "PropertyValue", name: "Shape", value: mouse.shape },
          { "@type": "PropertyValue", name: "Connectivity", value: mouse.connectivity },
          { "@type": "PropertyValue", name: "Pro Usage", value: `${mouse.proUsage}%` },
        ],
      }) }} />
      {/* Breadcrumb JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://esportsmice.com" },
          { "@type": "ListItem", position: 2, name: "Mice", item: "https://esportsmice.com/mice" },
          { "@type": "ListItem", position: 3, name: mouse.name, item: `https://esportsmice.com/mice/${params.slug}` },
        ],
      }) }} />
      {/* Server-rendered SEO content — in the HTML for crawlers, visually hidden */}
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
        itemScope itemType="https://schema.org/Product"
      >
        <h1 itemProp="name">{mouse.name} — Professional Esports Gaming Mouse Review and Stats</h1>
        <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
          <meta itemProp="name" content={mouse.brand} />
        </div>
        {imgUrl && <meta itemProp="image" content={`https://esportsmice.com${imgUrl}`} />}
        <meta itemProp="description" content={desc ? desc.text : `${mouse.name} by ${mouse.brand}. ${mouse.weight}g, ${mouse.sensor} sensor, ${mouse.pollingRate}Hz polling rate.`} />
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="price" content={String(mouse.price)} />
          <meta itemProp="priceCurrency" content="USD" />
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <meta itemProp="url" content={amazonLink(mouse.name)} />
        </div>
        <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
          <meta itemProp="ratingValue" content={String(mouse.rating)} />
          <meta itemProp="bestRating" content="10" />
          <meta itemProp="ratingCount" content="1" />
        </div>

        <h2>About the {mouse.name}</h2>
        {desc ? <p>{desc.text}</p> : (
          <p>
            The {mouse.name} is a {mouse.connectivity.toLowerCase()} {mouse.shape.toLowerCase()} gaming mouse
            made by {mouse.brand}. It weighs {mouse.weight} grams and uses the {mouse.sensor} sensor
            with a maximum DPI of {mouse.dpi.toLocaleString()} and {mouse.pollingRate >= 1000 ? `${mouse.pollingRate / 1000}K` : mouse.pollingRate}Hz
            polling rate. It is priced at ${mouse.price} USD and rated {mouse.rating}/10.
          </p>
        )}

        <h2>{mouse.name} Full Specifications</h2>
        <table>
          <caption>Complete specifications for the {mouse.name} by {mouse.brand}</caption>
          <tbody>
            <tr><th>Brand</th><td><a href={`/brands/${mouse.brand.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-")}`}>{mouse.brand}</a></td></tr>
            <tr><th>Weight</th><td>{mouse.weight} grams</td></tr>
            <tr><th>Sensor</th><td><a href={`/sensors/${mouse.sensor.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`}>{mouse.sensor}</a></td></tr>
            <tr><th>Max DPI</th><td>{mouse.dpi.toLocaleString()}</td></tr>
            <tr><th>Polling Rate</th><td>{mouse.pollingRate.toLocaleString()} Hz</td></tr>
            <tr><th>Shape</th><td><a href={`/shapes/${mouse.shape.toLowerCase()}`}>{mouse.shape}</a></td></tr>
            <tr><th>Connectivity</th><td>{mouse.connectivity}</td></tr>
            <tr><th>Price</th><td>${mouse.price} USD</td></tr>
            <tr><th>Switches</th><td>{mouse.switches}</td></tr>
            <tr><th>Battery Life</th><td>{mouse.batteryLife} hours</td></tr>
            <tr><th>Release Year</th><td>{mouse.releaseYear}</td></tr>
            <tr><th>Pro Usage</th><td>{mouse.proUsage}% of tracked professional players</td></tr>
            <tr><th>Rating</th><td>{mouse.rating} out of 10</td></tr>
          </tbody>
        </table>

        {usedBy.length > 0 && (
          <>
            <h2>Professional Players Using the {mouse.name}</h2>
            <p>The {mouse.name} is used by {usedBy.length}+ professional esports players across {[...new Set(usedBy.map((p) => p.game))].map((g, i, arr) => (
              <span key={g}>{i > 0 && (i === arr.length - 1 ? " and " : ", ")}<a href={`/games/${g.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`}>{g}</a></span>
            ))}.</p>
            <ul>
              {usedBy.map((p, i) => (
                <li key={i}>
                  <a href={`/players/${p.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-")}`}>{p.name}</a>
                  {" "}— <a href={`/games/${p.game.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`}>{p.game}</a> (<a href={`/teams/${p.team.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`}>{p.team}</a>) — {p.dpi} DPI, {p.sens} sens, {p.edpi} eDPI
                </li>
              ))}
            </ul>
          </>
        )}

        {desc?.highlights && (
          <><h2>Key Highlights</h2><ul>{desc.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul></>
        )}

        <p><a href={amazonLink(mouse.name)}>Buy the {mouse.name} on Amazon for ${mouse.price}</a></p>

        {/* Other mice by the same brand */}
        {(() => {
          const sameBrand = mice.filter((m) => m.brand === mouse.brand && m.id !== mouse.id);
          if (!sameBrand.length) return null;
          return (
            <>
              <h2>Other {mouse.brand} Esports Mice</h2>
              <ul>
                {sameBrand.map((m) => (
                  <li key={m.id}>
                    <a href={`/mice/${m.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-")}`}>{m.name}</a>
                    {" "}— {m.weight}g, {m.proUsage}% pro usage, ${m.price}
                  </li>
                ))}
              </ul>
            </>
          );
        })()}

        {/* Mice with the same sensor */}
        {(() => {
          const sameSensor = mice.filter((m) => m.sensor === mouse.sensor && m.id !== mouse.id);
          if (!sameSensor.length) return null;
          return (
            <>
              <h2>Other Mice with the {mouse.sensor} Sensor</h2>
              <ul>
                {sameSensor.map((m) => (
                  <li key={m.id}>
                    <a href={`/mice/${m.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-")}`}>{m.name}</a>
                    {" "}({m.brand}) — {m.weight}g, ${m.price}
                  </li>
                ))}
              </ul>
            </>
          );
        })()}

        {/* Similar mice by weight */}
        {(() => {
          const similar = mice
            .filter((m) => m.id !== mouse.id && Math.abs(m.weight - mouse.weight) <= 10)
            .sort((a, b) => Math.abs(a.weight - mouse.weight) - Math.abs(b.weight - mouse.weight))
            .slice(0, 8);
          if (!similar.length) return null;
          return (
            <>
              <h2>Similar Weight Esports Mice (±10g of {mouse.weight}g)</h2>
              <ul>
                {similar.map((m) => (
                  <li key={m.id}>
                    <a href={`/mice/${m.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-")}`}>{m.name}</a>
                    {" "}({m.brand}) — {m.weight}g, {m.proUsage}% pro usage
                  </li>
                ))}
              </ul>
            </>
          );
        })()}

        {/* Same shape mice */}
        {(() => {
          const sameShape = mice.filter((m) => m.shape === mouse.shape && m.id !== mouse.id).slice(0, 8);
          if (!sameShape.length) return null;
          return (
            <>
              <h2>Other {mouse.shape} Shape Esports Mice</h2>
              <ul>
                {sameShape.map((m) => (
                  <li key={m.id}>
                    <a href={`/mice/${m.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-")}`}>{m.name}</a>
                    {" "}({m.brand}) — {m.weight}g, ${m.price}
                  </li>
                ))}
              </ul>
            </>
          );
        })()}

        <nav aria-label="Related pages">
          <h2>Related Pages</h2>
          <ul>
            <li><a href="/mice">All Esports Mice</a></li>
            <li><a href="/players">Pro Player Settings</a></li>
            <li><a href="/brands">{mouse.brand} and Other Brands</a></li>
            <li><a href="/sensors">{mouse.sensor} and Other Sensors</a></li>
            <li><a href="/compare">Compare {mouse.name} vs Other Mice</a></li>
            <li><a href="/games">Mouse Usage by Game</a></li>
            <li><a href="/trends">Mouse Industry Trends</a></li>
            <li><a href="/shapes">{mouse.name} Shape Dimensions</a></li>
            <li><a href="/sensitivity">Sensitivity Converter</a></li>
            <li><a href="/lab">Mouse Finder Quiz</a></li>
            <li><a href="/">EsportsMice Home</a></li>
          </ul>
        </nav>
      </article>

      {/* Visible server-rendered content */}
      <SSRSection>
        <SSRTitle accent={mouse.brand}>{mouse.name}</SSRTitle>
        <SSRSub>
          {desc
            ? desc.text.slice(0, 280) + "..."
            : `The ${mouse.name} is a ${mouse.weight}g ${mouse.connectivity.toLowerCase()} ${mouse.shape.toLowerCase()} gaming mouse by ${mouse.brand}, featuring the ${mouse.sensor} sensor with ${mouse.pollingRate >= 1000 ? `${mouse.pollingRate / 1000}K` : mouse.pollingRate}Hz polling. Used by ${mouse.proUsage}% of tracked professional esports players.`
          }
        </SSRSub>
        <SSRGrid>
          <SSRStat label="Weight" value={`${mouse.weight}g`} color={BRAND_COLORS[mouse.brand]} />
          <SSRStat label="Sensor" value={mouse.sensor} color={BRAND_COLORS[mouse.brand]} />
          <SSRStat label="Polling" value={`${mouse.pollingRate >= 1000 ? `${mouse.pollingRate / 1000}K` : mouse.pollingRate}Hz`} color={BRAND_COLORS[mouse.brand]} />
          <SSRStat label="Pro Usage" value={`${mouse.proUsage}%`} color={BRAND_COLORS[mouse.brand]} />
          <SSRStat label="Price" value={`$${mouse.price}`} color={BRAND_COLORS[mouse.brand]} />
          <SSRStat label="Shape" value={mouse.shape} color={BRAND_COLORS[mouse.brand]} />
          <SSRStat label="Rating" value={`${mouse.rating}/10`} color={BRAND_COLORS[mouse.brand]} />
          <SSRStat label="Switches" value={mouse.switches} color={BRAND_COLORS[mouse.brand]} />
        </SSRGrid>
        {usedBy.length > 0 && (
          <>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#ffffff40" }}>
              Used by {usedBy.length}+ pros including
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {usedBy.slice(0, 8).map((p) => (
                <SSRLink key={p.name} href={`/players/${p.name.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-")}`} color={BRAND_COLORS[mouse.brand]}>
                  {p.name} · {p.game}
                </SSRLink>
              ))}
            </div>
          </>
        )}
        <SSRDivider />
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/players">Pro Settings</SSRLink>
          <SSRLink href="/compare">Compare</SSRLink>
          <SSRLink href="/sensors">Sensors</SSRLink>
          <SSRLink href="/brands">{mouse.brand}</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="mouseDetail" initialMouseSlug={params.slug} />
    </>
  );
}
