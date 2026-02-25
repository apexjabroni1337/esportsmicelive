import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { MOUSE_DIMS, mice } from "@/data";

const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

export const metadata = {
  title: "Shape Overlay — Compare Mouse Shapes Side by Side",
  description: "Compare the shapes and dimensions of esports mice using our interactive overlay tool. Overlay any two mice at true scale to compare length, width, height, and hump position.",
  alternates: { canonical: "https://esportsmice.com/shapes" },
  openGraph: {
    title: "Shape Overlay — Compare Mouse Shapes Side by Side",
    description: "Compare the shapes and dimensions of esports mice using our interactive overlay tool.",
    url: "https://esportsmice.com/shapes",
    images: [{ url: "https://esportsmice.com/og?title=Shape+Overlay&subtitle=Compare+Mouse+Shapes+%C2%B7+Interactive+Overlay+Tool", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function ShapesPage() {
  const mouseNames = Object.keys(MOUSE_DIMS);
  const dimData = mouseNames.map((name) => {
    const [l, w, h] = MOUSE_DIMS[name];
    const m = mice.find((mm) => mm.name === name);
    return { name, length: l, width: w, height: h, mouse: m };
  });
  const avgLength = Math.round(dimData.reduce((a, d) => a + d.length, 0) / dimData.length * 10) / 10;
  const avgWidth = Math.round(dimData.reduce((a, d) => a + d.width, 0) / dimData.length * 10) / 10;
  const avgHeight = Math.round(dimData.reduce((a, d) => a + d.height, 0) / dimData.length * 10) / 10;
  const longest = [...dimData].sort((a, b) => b.length - a.length)[0];
  const shortest = [...dimData].sort((a, b) => a.length - b.length)[0];
  const widest = [...dimData].sort((a, b) => b.width - a.width)[0];
  const narrowest = [...dimData].sort((a, b) => a.width - b.width)[0];
  const tallest = [...dimData].sort((a, b) => b.height - a.height)[0];
  const flattest = [...dimData].sort((a, b) => a.height - b.height)[0];

  return (
    <>
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Mouse Shape Overlay Tool — Compare Gaming Mouse Dimensions</h1>
        <p>
          Compare the physical dimensions and shapes of {mouseNames.length} esports gaming mice using our
          interactive overlay tool. Select any two mice to see them overlaid at true scale, comparing
          length, width, height, and overall footprint.
        </p>

        <h2>Average Mouse Dimensions</h2>
        <ul>
          <li>Average length: {avgLength}mm</li>
          <li>Average width: {avgWidth}mm</li>
          <li>Average height: {avgHeight}mm</li>
          <li>Longest: <a href={`/mice/${slug(longest.name)}`}>{longest.name}</a> ({longest.length}mm)</li>
          <li>Shortest: <a href={`/mice/${slug(shortest.name)}`}>{shortest.name}</a> ({shortest.length}mm)</li>
          <li>Widest: <a href={`/mice/${slug(widest.name)}`}>{widest.name}</a> ({widest.width}mm)</li>
          <li>Narrowest: <a href={`/mice/${slug(narrowest.name)}`}>{narrowest.name}</a> ({narrowest.width}mm)</li>
          <li>Tallest hump: <a href={`/mice/${slug(tallest.name)}`}>{tallest.name}</a> ({tallest.height}mm)</li>
          <li>Flattest: <a href={`/mice/${slug(flattest.name)}`}>{flattest.name}</a> ({flattest.height}mm)</li>
        </ul>

        <h2>Complete Mouse Dimensions Database</h2>
        <table>
          <caption>Physical dimensions of {mouseNames.length} esports gaming mice (millimeters)</caption>
          <thead><tr><th>Mouse</th><th>Length</th><th>Width</th><th>Height</th><th>Brand</th><th>Weight</th><th>Shape</th></tr></thead>
          <tbody>
            {dimData.sort((a, b) => a.length - b.length).map((d) => (
              <tr key={d.name}>
                <td><a href={`/mice/${slug(d.name)}`}>{d.name}</a></td>
                <td>{d.length}mm</td>
                <td>{d.width}mm</td>
                <td>{d.height}mm</td>
                <td>{d.mouse ? <a href="/brands">{d.mouse.brand}</a> : "—"}</td>
                <td>{d.mouse ? `${d.mouse.weight}g` : "—"}</td>
                <td>{d.mouse?.shape || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Mice by Size Category</h2>
        <h3>Small Mice (Under 120mm length)</h3>
        <ul>
          {dimData.filter((d) => d.length < 120).sort((a, b) => a.length - b.length).map((d) => (
            <li key={d.name}><a href={`/mice/${slug(d.name)}`}>{d.name}</a> — {d.length}×{d.width}×{d.height}mm{d.mouse ? `, ${d.mouse.weight}g` : ""}</li>
          ))}
        </ul>
        <h3>Medium Mice (120-126mm)</h3>
        <ul>
          {dimData.filter((d) => d.length >= 120 && d.length <= 126).sort((a, b) => a.length - b.length).map((d) => (
            <li key={d.name}><a href={`/mice/${slug(d.name)}`}>{d.name}</a> — {d.length}×{d.width}×{d.height}mm{d.mouse ? `, ${d.mouse.weight}g` : ""}</li>
          ))}
        </ul>
        <h3>Large Mice (Over 126mm)</h3>
        <ul>
          {dimData.filter((d) => d.length > 126).sort((a, b) => a.length - b.length).map((d) => (
            <li key={d.name}><a href={`/mice/${slug(d.name)}`}>{d.name}</a> — {d.length}×{d.width}×{d.height}mm{d.mouse ? `, ${d.mouse.weight}g` : ""}</li>
          ))}
        </ul>

        <h2>Shape Guide</h2>
        <h3>Symmetrical Mice</h3>
        <p>Symmetrical (ambidextrous) shapes work for both hands and are generally preferred for claw and fingertip grips.</p>
        <ul>
          {dimData.filter((d) => d.mouse?.shape === "Symmetrical").map((d) => (
            <li key={d.name}><a href={`/mice/${slug(d.name)}`}>{d.name}</a> — {d.length}×{d.width}×{d.height}mm ({d.mouse.brand})</li>
          ))}
        </ul>
        <h3>Ergonomic Mice</h3>
        <p>Ergonomic (right-handed) shapes are contoured for palm grip and offer better comfort for extended sessions.</p>
        <ul>
          {dimData.filter((d) => d.mouse?.shape === "Ergonomic").map((d) => (
            <li key={d.name}><a href={`/mice/${slug(d.name)}`}>{d.name}</a> — {d.length}×{d.width}×{d.height}mm ({d.mouse.brand})</li>
          ))}
        </ul>

        <nav aria-label="Related"><ul>
          <li><a href="/mice">All Esports Mice</a></li>
          <li><a href="/compare">Compare Mice Specs</a></li>
          <li><a href="/lab">Mouse Finder Quiz</a></li>
          <li><a href="/players">Pro Player Settings</a></li>
          <li><a href="/brands">Mouse Brands</a></li>
          <li><a href="/sensors">Sensor Comparison</a></li>
          <li><a href="/">EsportsMice Home</a></li>
        </ul></nav>
      </article>

      <SSRSection>
        <SSRTitle accent="Shape">Overlay Tool</SSRTitle>
        <SSRSub>Compare the dimensions of {mouseNames.length} esports mice at true scale. Overlay any two mice to compare length, width, height, and footprint.</SSRSub>
        <SSRGrid>
          <SSRStat label="Mice" value={mouseNames.length} color="#00ff6a" />
          <SSRStat label="Avg Length" value={`${avgLength}mm`} color="#00ff6a" />
          <SSRStat label="Avg Width" value={`${avgWidth}mm`} color="#00ff6a" />
          <SSRStat label="Avg Height" value={`${avgHeight}mm`} color="#00ff6a" />
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/compare">Compare Specs</SSRLink>
          <SSRLink href="/lab">Finder Quiz</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="shapes" />
    </>
  );
}
