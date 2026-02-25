import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { allPlayers, proPlayers, mice } from "@/data";

const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
const findMouse = (name) => mice.find((m) => name.includes(m.name) || m.name.includes(name));
const mSlug = (name) => { const m = findMouse(name); return m ? slug(m.name) : null; };

export const metadata = {
  title: "Sensitivity Converter — Convert Mouse Sensitivity Between Games",
  description: "Convert your mouse sensitivity between CS2, Valorant, Fortnite, Apex Legends, Overwatch 2, and more. See cm/360, compare with pro players, and find your ideal eDPI.",
  alternates: { canonical: "https://esportsmice.com/sensitivity" },
  openGraph: {
    title: "Sensitivity Converter — Convert Mouse Sensitivity Between Games",
    description: "Convert your mouse sensitivity between CS2, Valorant, Fortnite, Apex, and more.",
    url: "https://esportsmice.com/sensitivity",
    images: [{ url: "https://esportsmice.com/og?title=Sensitivity+Converter&subtitle=CS2+%C2%B7+Valorant+%C2%B7+Fortnite+%C2%B7+Apex+%C2%B7+cm%2F360+%C2%B7+Pro+Comparison", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function SensitivityPage() {
  const games = [...new Set(allPlayers.map((p) => p.game))].sort((a, b) =>
    allPlayers.filter((p) => p.game === b).length - allPlayers.filter((p) => p.game === a).length
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "HowTo",
        name: "How to Convert Mouse Sensitivity Between Games",
        description: "Convert your mouse sensitivity settings between CS2, Valorant, Fortnite, Apex Legends, and other esports titles using eDPI.",
        step: [
          { "@type": "HowToStep", name: "Find your current eDPI", text: "Multiply your mouse DPI by your in-game sensitivity. For example, 800 DPI × 1.0 sens = 800 eDPI." },
          { "@type": "HowToStep", name: "Calculate cm/360", text: "Use the formula: cm/360 = (360 × 2.54) / (DPI × sensitivity × game multiplier). This gives you your physical mouse distance for a full 360-degree turn." },
          { "@type": "HowToStep", name: "Convert to target game", text: "Enter your cm/360 into the target game's formula to find the equivalent sensitivity. Our converter does this automatically for all 14 supported games." },
          { "@type": "HowToStep", name: "Fine-tune", text: "Test the converted sensitivity in-game and adjust slightly based on feel. Compare your eDPI with pro players in that game to see where you fall." },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How do I convert CS2 sensitivity to Valorant?", acceptedAnswer: { "@type": "Answer", text: "Divide your CS2 sensitivity by 3.18 to get the equivalent Valorant sensitivity. For example, CS2 sens 1.0 at 800 DPI = Valorant sens 0.314 at 800 DPI. Both will give you the same cm/360 (the physical distance to do a full turn)." }},
          { "@type": "Question", name: "What is eDPI and why does it matter?", acceptedAnswer: { "@type": "Answer", text: "eDPI (effective DPI) = Mouse DPI × in-game sensitivity. It normalizes sensitivity across different DPI settings. A player using 400 DPI × 2.0 sens has the same eDPI (800) as someone using 800 DPI × 1.0 sens — they aim at the same speed." }},
          { "@type": "Question", name: "What is cm/360?", acceptedAnswer: { "@type": "Answer", text: "cm/360 is the number of centimeters you need to move your mouse to do a full 360-degree turn in-game. Lower cm/360 = faster/higher sensitivity. Most CS2 pros use 25-55 cm/360. This is the universal way to compare sensitivity across games." }},
          { "@type": "Question", name: "What sensitivity do pro players use?", acceptedAnswer: { "@type": "Answer", text: `The average eDPI varies by game. CS2 pros average around 800-900 eDPI, Valorant pros around 250-350 eDPI (using Valorant's scale), and Fortnite pros around 45-65 eDPI (Fortnite's percentage scale). Use our per-game sensitivity pages for detailed breakdowns.` }},
        ],
      }) }} />
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Mouse Sensitivity Converter — Convert Settings Between Esports Games</h1>
        <p>
          Convert your mouse sensitivity between {games.length} competitive titles. Our converter calculates
          eDPI, cm/360, in/360, and shows how your sensitivity compares to {allPlayers.length.toLocaleString()}+
          professional players.
        </p>

        <h2>How Sensitivity Conversion Works</h2>
        <p>
          Different games use different sensitivity scales. The universal metric is eDPI (effective DPI),
          calculated as mouse DPI × in-game sensitivity. A player at 800 DPI with 1.0 sensitivity has
          800 eDPI. This number can be compared directly across all games.
        </p>
        <p>
          Another useful metric is cm/360 — how many centimeters of mouse movement are needed for a full
          360-degree in-game turn. Lower cm/360 means higher sensitivity (less mouse movement needed).
        </p>

        <h2>Sensitivity Statistics by Game</h2>
        <table>
          <caption>Average, median, and range of eDPI across esports titles</caption>
          <thead><tr><th>Game</th><th>Players</th><th>Avg DPI</th><th>Avg eDPI</th><th>Median eDPI</th><th>Min eDPI</th><th>Max eDPI</th></tr></thead>
          <tbody>
            {games.map((game) => {
              const gp = allPlayers.filter((p) => p.game === game);
              const edpis = gp.map((p) => p.edpi).sort((a, b) => a - b);
              return (
                <tr key={game}>
                  <td>{game}</td>
                  <td>{gp.length}</td>
                  <td>{Math.round(gp.reduce((a, p) => a + p.dpi, 0) / gp.length)}</td>
                  <td>{Math.round(gp.reduce((a, p) => a + p.edpi, 0) / gp.length)}</td>
                  <td>{edpis[Math.floor(edpis.length / 2)]}</td>
                  <td>{edpis[0]}</td>
                  <td>{edpis[edpis.length - 1]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {games.slice(0, 6).map((game) => {
          const gp = proPlayers.filter((p) => p.game === game);
          if (!gp.length) return null;
          const lowest = [...gp].sort((a, b) => a.edpi - b.edpi).slice(0, 3);
          const highest = [...gp].sort((a, b) => b.edpi - a.edpi).slice(0, 3);
          return (
            <section key={game}>
              <h2>{game} Pro Sensitivity Settings</h2>
              <h3>Lowest Sensitivity {game} Pros</h3>
              <ul>
                {lowest.map((p) => {
                  const ms = mSlug(p.mouse);
                  return (
                    <li key={p.name}>
                      <a href={`/players/${slug(p.name)}`}>{p.name}</a> ({p.team}) — {p.edpi} eDPI ({p.dpi} DPI × {p.sens}),
                      uses {ms ? <a href={`/mice/${ms}`}>{p.mouse}</a> : p.mouse}
                    </li>
                  );
                })}
              </ul>
              <h3>Highest Sensitivity {game} Pros</h3>
              <ul>
                {highest.map((p) => {
                  const ms = mSlug(p.mouse);
                  return (
                    <li key={p.name}>
                      <a href={`/players/${slug(p.name)}`}>{p.name}</a> ({p.team}) — {p.edpi} eDPI ({p.dpi} DPI × {p.sens}),
                      uses {ms ? <a href={`/mice/${ms}`}>{p.mouse}</a> : p.mouse}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <h2>DPI Distribution Across All Pros</h2>
        <table>
          <thead><tr><th>DPI</th><th>Players</th><th>Percentage</th></tr></thead>
          <tbody>
            {[400, 800, 1600, 3200].map((dpi) => {
              const count = allPlayers.filter((p) => p.dpi === dpi).length;
              return <tr key={dpi}><td>{dpi}</td><td>{count}</td><td>{Math.round(count / allPlayers.length * 100)}%</td></tr>;
            })}
          </tbody>
        </table>

        <h2>FAQ</h2>
        <dl>
          <dt>What DPI should I use?</dt>
          <dd>800 DPI is the most popular choice among professionals. 400 DPI is the second most common. Higher DPI with lower in-game sensitivity gives smoother cursor movement.</dd>
          <dt>What eDPI do most pros use?</dt>
          <dd>It varies by game. FPS pros typically use 200-1200 eDPI. MOBA and RTS pros use 800-4000+ eDPI. Use the converter above to see where you fall relative to pros in your game.</dd>
          <dt>How big should my mousepad be?</dt>
          <dd>Low sensitivity: 45cm+ wide. Medium sensitivity: 40cm. High sensitivity: 30cm minimum. Your cm/360 determines the minimum space needed for a full turn.</dd>
        </dl>

        <nav aria-label="Related"><ul>
          <li><a href="/players">Pro Player Settings — All {proPlayers.length} Profiles</a></li>
          <li><a href="/mice">All Esports Mice</a></li>
          <li><a href="/games">Mouse Usage by Game</a></li>
          <li><a href="/compare">Compare Mice</a></li>
          <li><a href="/brands">Mouse Brands</a></li>
          <li><a href="/trends">Industry Trends</a></li>
          <li><a href="/">EsportsMice Home</a></li>
        </ul></nav>
      </article>

      <SSRSection>
        <SSRTitle accent="Sensitivity">Converter</SSRTitle>
        <SSRSub>Convert your mouse sensitivity between {games.length} competitive titles. Compare with {allPlayers.length.toLocaleString()}+ professional players.</SSRSub>
        <SSRGrid>
          <SSRStat label="Games" value={games.length} color="#00ff6a" />
          <SSRStat label="Players" value={allPlayers.length.toLocaleString()} color="#00ff6a" />
          <SSRStat label="Most Common DPI" value="800" color="#00ff6a" />
          <SSRStat label="Pro Profiles" value={proPlayers.length} color="#00ff6a" />
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/players">Pro Settings</SSRLink>
          <SSRLink href="/mice">All Mice</SSRLink>
          <SSRLink href="/games">Games</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="sensitivity" />
    </>
  );
}
