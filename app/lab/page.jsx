import EsportsMice from "@/components/ClientApp";
import { SSRSection, SSRTitle, SSRSub, SSRGrid, SSRStat, SSRLink, SSRDivider } from "@/components/ssr";
import { mice } from "@/data";

const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const metadata = {
  title: "Lab — Mouse Finder Quiz & Analysis Tools",
  description: "Find your perfect esports mouse with our interactive quiz. Answer questions about hand size, grip style, game, and preferences to get personalized mouse recommendations.",
  alternates: { canonical: "https://esportsmice.com/lab" },
  openGraph: {
    title: "Lab — Mouse Finder Quiz & Analysis Tools",
    description: "Find your perfect esports mouse with our interactive quiz.",
    url: "https://esportsmice.com/lab",
    images: [{ url: "https://esportsmice.com/og?title=Lab&subtitle=Mouse+Finder+Quiz+%C2%B7+Personalized+Recommendations", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function LabPage() {
  const symm = mice.filter((m) => m.shape === "Symmetrical");
  const ergo = mice.filter((m) => m.shape === "Ergonomic");
  const light = mice.filter((m) => m.weight < 55).sort((a, b) => a.weight - b.weight);
  const medium = mice.filter((m) => m.weight >= 55 && m.weight <= 70);
  const budget = mice.filter((m) => m.price < 90).sort((a, b) => a.price - b.price);

  return (
    <>
      <article
        className="absolute overflow-hidden"
        style={{ width: 1, height: 1, padding: 0, margin: -1, clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
      >
        <h1>Mouse Finder Lab — Find Your Perfect Esports Gaming Mouse</h1>
        <p>
          Not sure which gaming mouse is right for you? Our interactive Mouse Finder Quiz analyzes your
          hand size, grip style, preferred games, weight preference, budget, and connectivity needs to
          recommend the best esports mice from our database of {mice.length} models.
        </p>

        <h2>Grip Style Guide</h2>
        <h3>Palm Grip</h3>
        <p>
          Full hand contact with the mouse. Your entire palm rests on the back of the mouse, with fingers
          flat on the buttons. Palm grip favors larger, ergonomic shapes that fill the hand. Best for
          players who prioritize comfort during long sessions and use arm-based aiming.
        </p>
        <p>Recommended palm grip mice:</p>
        <ul>
          {ergo.sort((a, b) => b.proUsage - a.proUsage).slice(0, 5).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — {m.weight}g, {m.brand}, ${m.price}</li>
          ))}
        </ul>

        <h3>Claw Grip</h3>
        <p>
          Fingertips and palm base contact the mouse, with fingers arched over the buttons. Claw grip
          allows faster clicks and quick micro-adjustments. Works well with medium-sized symmetrical or
          ergonomic mice that have a pronounced hump toward the back.
        </p>
        <p>Recommended claw grip mice:</p>
        <ul>
          {symm.sort((a, b) => b.proUsage - a.proUsage).slice(0, 5).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — {m.weight}g, {m.brand}, ${m.price}</li>
          ))}
        </ul>

        <h3>Fingertip Grip</h3>
        <p>
          Only fingertips touch the mouse — no palm contact at all. Fingertip grip gives maximum control
          for micro-flicks and is preferred by high-sensitivity players. Requires small, lightweight mice.
        </p>
        <p>Recommended fingertip grip mice:</p>
        <ul>
          {light.slice(0, 5).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — {m.weight}g, {m.brand}, ${m.price}</li>
          ))}
        </ul>

        <h2>How to Measure Your Hand</h2>
        <p>
          Accurate hand measurements help determine the best mouse size. Measure from the tip of your
          middle finger to the base of your palm (hand length), and across the widest point of your palm
          excluding the thumb (hand width). Both measurements in centimeters.
        </p>
        <ul>
          <li>Small hands: Under 17cm length / under 8.5cm width — small mice recommended</li>
          <li>Medium hands: 17-19.5cm length / 8.5-10cm width — medium mice recommended</li>
          <li>Large hands: Over 19.5cm length / over 10cm width — large mice recommended</li>
        </ul>

        <h2>Mice by Weight Category</h2>
        <h3>Ultralight (Under 55g) — Best for speed and agility</h3>
        <ul>
          {light.map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — {m.weight}g ({m.brand}), ${m.price}</li>
          ))}
        </ul>
        <h3>Medium Weight (55-70g) — Balanced control and comfort</h3>
        <ul>
          {medium.sort((a, b) => a.weight - b.weight).slice(0, 10).map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — {m.weight}g ({m.brand}), ${m.price}</li>
          ))}
        </ul>

        <h2>Best Budget Esports Mice (Under $90)</h2>
        <ul>
          {budget.map((m) => (
            <li key={m.id}><a href={`/mice/${slug(m.name)}`}>{m.name}</a> — ${m.price} ({m.brand}, {m.weight}g, {m.sensor})</li>
          ))}
        </ul>

        <h2>FAQ</h2>
        <dl>
          <dt>What is the best mouse for FPS games?</dt>
          <dd>The most used FPS mice among pros are the <a href={`/mice/${slug(mice.sort((a, b) => b.proUsage - a.proUsage)[0].name)}`}>{mice.sort((a, b) => b.proUsage - a.proUsage)[0].name}</a> and <a href={`/mice/${slug(mice.sort((a, b) => b.proUsage - a.proUsage)[1].name)}`}>{mice.sort((a, b) => b.proUsage - a.proUsage)[1].name}</a>. Light weight and accurate sensors are most important for FPS.</dd>
          <dt>Does mouse weight matter?</dt>
          <dd>Yes. Lighter mice allow faster movements and reduce fatigue. Most pros now use mice under 60g. However, some players prefer slightly heavier mice for stability.</dd>
          <dt>Wireless or wired?</dt>
          <dd>Modern wireless gaming mice have no perceptible latency disadvantage. {mice.filter((m) => m.connectivity === "Wireless").length} of {mice.length} mice in our database are wireless, and virtually all top pros have switched to wireless.</dd>
        </dl>

        <nav aria-label="Related"><ul>
          <li><a href="/mice">All Esports Mice — Full Database</a></li>
          <li><a href="/compare">Compare Mice Side by Side</a></li>
          <li><a href="/shapes">Shape Overlay Tool</a></li>
          <li><a href="/players">Pro Player Settings</a></li>
          <li><a href="/sensitivity">Sensitivity Converter</a></li>
          <li><a href="/brands">Mouse Brands</a></li>
          <li><a href="/sensors">Sensor Comparison</a></li>
          <li><a href="/">EsportsMice Home</a></li>
        </ul></nav>
      </article>

      <SSRSection>
        <SSRTitle accent="Mouse">Finder Lab</SSRTitle>
        <SSRSub>Find your perfect esports mouse. Our quiz analyzes hand size, grip style, game, weight preference, and budget to recommend from {mice.length} mice.</SSRSub>
        <SSRGrid>
          <SSRStat label="Mice" value={mice.length} color="#f59e0b" />
          <SSRStat label="Symmetrical" value={symm.length} color="#f59e0b" />
          <SSRStat label="Ergonomic" value={ergo.length} color="#f59e0b" />
          <SSRStat label="Under $90" value={budget.length} color="#f59e0b" />
        </SSRGrid>
        <div className="flex flex-wrap gap-2">
          <SSRLink href="/mice" color="#f59e0b">All Mice</SSRLink>
          <SSRLink href="/compare" color="#f59e0b">Compare</SSRLink>
          <SSRLink href="/shapes" color="#f59e0b">Shapes</SSRLink>
        </div>
      </SSRSection>

      <EsportsMice initialTab="lab" />
    </>
  );
}
