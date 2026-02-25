import Link from "next/link";
import { mice, allPlayers, proPlayers, BRAND_COLORS, MOUSE_IMAGE_URLS, amazonLink } from "@/data";

const slug = (n) => n.toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

const ARTICLES = {
  "how-to-choose-gaming-mouse": {
    title: "How to Choose the Right Gaming Mouse in 2026",
    date: "2026-02-23",
    tag: "Guide",
    color: "#00ff6a",
    content: (topMice) => [
      { type: "p", text: "Choosing a gaming mouse can feel overwhelming with hundreds of options on the market. But professional esports players have already done the testing for you — and the data tells a clear story about what actually matters." },
      { type: "h2", text: "1. Shape Is Everything" },
      { type: "p", text: "The most important factor in choosing a mouse is shape. No amount of sensor technology or weight savings will compensate for a shape that doesn't fit your hand. There are three main categories: ergonomic (right-hand contoured), symmetrical (ambidextrous), and egg-shaped. Symmetrical shapes dominate the FPS scene in 2026, with the Razer Viper V3 Pro and Logitech G Pro X Superlight 2 leading the way." },
      { type: "h2", text: "2. Weight Matters — But Don't Obsess" },
      { type: "p", text: "The average weight of a professional mouse in 2026 is around 55g, down from 80g just three years ago. Lighter mice allow faster flick shots and reduce fatigue during long sessions. However, some players — especially those in tactical shooters — still prefer mice in the 60-70g range for more control. The sweet spot for most players is 45-65g." },
      { type: "h2", text: "3. Wireless Is Now the Standard" },
      { type: "p", text: "Over 80% of professional FPS players now use wireless mice. Modern wireless technology from Razer (HyperPolling), Logitech (Lightspeed), and others has eliminated any latency difference from wired. If you're still using a wired mouse because you think wireless has lag — that hasn't been true since 2020." },
      { type: "h2", text: "4. Sensor: They're All Good Now" },
      { type: "p", text: "Every major gaming mouse released in 2025-2026 uses a sensor that tracks flawlessly. The Focus Pro 35K, HERO 2, and PAW-3950 all deliver zero smoothing, zero acceleration, and sub-millimeter tracking. Sensor should not be a deciding factor for any mouse above $50." },
      { type: "h2", text: "5. What the Pros Actually Use" },
      { type: "mice", data: topMice },
      { type: "p", text: "The data is clear: pros prioritize shape fit, low weight, and reliable wireless. Price is rarely a factor at the professional level, but the good news is that most top mice are available for $80-160." },
      { type: "cta", text: "Explore all mice →", href: "/mice" },
    ],
  },
  "claw-vs-palm-vs-fingertip-grip": {
    title: "Claw vs Palm vs Fingertip Grip: Which Is Best for FPS?",
    date: "2026-02-23",
    tag: "Analysis",
    color: "#00b4ff",
    content: () => [
      { type: "p", text: "Every FPS player holds their mouse differently, but grip style has a massive impact on which mouse will feel best in your hand. Understanding your grip is the first step to finding the right mouse." },
      { type: "h2", text: "Palm Grip" },
      { type: "p", text: "Your entire hand rests on the mouse, with your palm making full contact. This is the most relaxed grip and provides the most stability for smooth tracking. Palm grippers benefit from larger, ergonomic mice like the Razer DeathAdder V4 Pro or Zowie EC2-CW. Many CS2 AWPers prefer palm grip for its smooth, controlled aim." },
      { type: "h2", text: "Claw Grip" },
      { type: "p", text: "Your palm touches the back of the mouse while your fingers are arched. This hybrid approach offers both stability and quick flick potential. Claw grip is the most common style among Valorant professionals. Medium-sized symmetrical mice like the Razer Viper V3 Pro work well here." },
      { type: "h2", text: "Fingertip Grip" },
      { type: "p", text: "Only your fingertips touch the mouse — your palm doesn't make contact at all. This gives maximum agility for micro-adjustments but requires more finger strength. Small, lightweight mice under 50g are ideal. Many Korean FPS players prefer this style." },
      { type: "h2", text: "What the Data Shows" },
      { type: "p", text: "While we can't measure grip remotely, the mouse size choices of pros tell us a lot. CS2 pros skew toward larger mice (suggesting more palm/relaxed claw), while Valorant and Fortnite pros lean smaller (more claw/fingertip). There's no 'best' grip — only the best grip for your hand size and playstyle." },
      { type: "cta", text: "Find mice by shape →", href: "/shapes" },
    ],
  },
  "mouse-weight-trend-2024-2026": {
    title: "The Great Weight Race: How Pro Mice Went from 100g to 45g",
    date: "2026-02-23",
    tag: "Data",
    color: "#f59e0b",
    content: () => [
      { type: "p", text: "In 2018, a 'light' gaming mouse weighed 80g. By 2026, anything over 60g feels heavy. This is the story of how the entire industry shifted in just a few years." },
      { type: "h2", text: "The Finalmouse Effect" },
      { type: "p", text: "It started with Finalmouse. The Ultralight Pro in 2018 introduced the honeycomb shell design at 67g — a concept the entire industry initially mocked, then copied within 18 months. By 2019, every major manufacturer was releasing 'ultralight' versions of their mice." },
      { type: "h2", text: "The Race to Sub-50g" },
      { type: "p", text: "Once the barrier was broken, weight became a marketing arms race. Razer brought the Viper line down from 69g to 54g. Logitech trimmed the Superlight from 63g to 60g. Newcomers like Lamzu and WLMouse pushed below 50g. The Finalmouse UltralightX hit 42g." },
      { type: "h2", text: "Where Are We Now?" },
      { type: "p", text: "The average mouse used by a professional player in February 2026 weighs approximately 55g. But the race has slowed — most manufacturers now agree that there's a point where reducing weight further hurts structural rigidity and feel. The current sweet spot is 45-58g for competitive mice." },
      { type: "h2", text: "Does Weight Actually Affect Performance?" },
      { type: "p", text: "Yes, but with diminishing returns. Moving from 100g to 60g makes a noticeable difference in flick speed and fatigue. Moving from 60g to 45g is much more subtle. Most pros say shape matters more than shaving off the last 10 grams." },
      { type: "cta", text: "View weight trends →", href: "/trends" },
    ],
  },
  "wireless-vs-wired-2026": {
    title: "Is Wireless Finally Better Than Wired? The 2026 Data Says Yes",
    date: "2026-02-23",
    tag: "Analysis",
    color: "#8b5cf6",
    content: () => [
      { type: "p", text: "For years, 'wireless has lag' was gospel in competitive gaming. In 2026, the opposite is true: wireless mice now outsell and outperform wired in professional play." },
      { type: "h2", text: "The Numbers Don't Lie" },
      { type: "p", text: "Over 80% of professional FPS players now use wireless mice, up from roughly 30% in 2020. In CS2 specifically, wireless adoption exceeds 85%. The Logitech G Pro Wireless in 2018 started the shift, and the Razer Viper V3 Pro in 2024 cemented it." },
      { type: "h2", text: "Latency: A Non-Issue" },
      { type: "p", text: "Modern wireless protocols like Razer HyperPolling Wireless (4KHz), Logitech Lightspeed, and Finalmouse's wireless tech all deliver sub-1ms latency — faster than most USB wired connections. At 4KHz wireless polling, the mouse reports its position every 0.25ms. Human reaction time is around 150ms. The difference is unmeasurable in practice." },
      { type: "h2", text: "Why Pros Switched" },
      { type: "p", text: "No cable drag. That's it. Cable drag creates inconsistent friction that affects micro-adjustments. Bungees helped, but eliminating the cable entirely is objectively better for consistent aim. The weight penalty for wireless (usually 3-8g extra for the battery) is negligible with modern battery technology." },
      { type: "cta", text: "Browse wireless mice →", href: "/best/wireless" },
    ],
  },
  "dpi-edpi-sensitivity-explained": {
    title: "DPI, eDPI, and Sensitivity Explained: A Complete Guide",
    date: "2026-02-23",
    tag: "Guide",
    color: "#ff4655",
    content: () => [
      { type: "p", text: "DPI, sensitivity, eDPI — these terms get thrown around constantly in the gaming community, but many players don't fully understand what they mean or how to optimize them." },
      { type: "h2", text: "What Is DPI?" },
      { type: "p", text: "DPI (Dots Per Inch) is how sensitive your mouse hardware is. At 800 DPI, moving your mouse one inch moves the cursor 800 pixels. Most pros use 400 or 800 DPI — this is purely preference, as you can achieve identical in-game sensitivity at any DPI by adjusting the in-game slider." },
      { type: "h2", text: "What Is eDPI?" },
      { type: "p", text: "eDPI (effective DPI) = Mouse DPI × In-game Sensitivity. This is the number that actually matters for comparing settings between players. A player at 400 DPI with 2.0 sensitivity has 800 eDPI — identical to a player at 800 DPI with 1.0 sensitivity." },
      { type: "h2", text: "What eDPI Should You Use?" },
      { type: "p", text: "It depends on the game. CS2 pros average around 850 eDPI. Valorant pros average about 280 eDPI (Valorant uses a different sensitivity scale). Fortnite pros tend to run much higher. The general rule: lower eDPI = more precision for headshots, higher eDPI = faster turning for movement-heavy games." },
      { type: "h2", text: "The 400 vs 800 DPI Debate" },
      { type: "p", text: "There's a persistent myth that 400 DPI is 'more precise.' Technically, 800 or 1600 DPI with a lower in-game sensitivity gives you sub-pixel precision in desktop use. But in-game, both are identical at the same eDPI. Use whichever feels comfortable for desktop navigation." },
      { type: "cta", text: "Explore sensitivity settings →", href: "/sensitivity" },
    ],
  },
};

const SLUGS = Object.keys(ARTICLES);

export function generateStaticParams() {
  return SLUGS.map((s) => ({ slug: s }));
}

export function generateMetadata({ params }) {
  const article = ARTICLES[params.slug];
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} — EsportsMice Blog`,
    description: article.content([])[0]?.text?.slice(0, 155) + "...",
    alternates: { canonical: `https://esportsmice.com/blog/${params.slug}` },
    openGraph: {
      title: article.title,
      description: article.content([])[0]?.text?.slice(0, 155) + "...",
      url: `https://esportsmice.com/blog/${params.slug}`,
    },
    twitter: { card: "summary_large_image", title: article.title },
  };
}

export default function BlogArticlePage({ params }) {
  const article = ARTICLES[params.slug];
  if (!article) {
    return (
      <div style={{ background: "#050505", minHeight: "100vh" }} className="text-white text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Link href="/blog" className="text-sm underline" style={{ color: "#00ff6a" }}>← Back to blog</Link>
      </div>
    );
  }

  // Get top mice for articles that need it
  const mc = {};
  allPlayers.forEach((p) => { mc[p.mouse] = (mc[p.mouse] || 0) + 1; });
  const topMice = Object.entries(mc)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => {
      const m = mice.find((mm) => mm.name === name || name.includes(mm.name));
      return { name, count, pct: ((count / allPlayers.length) * 100).toFixed(1), mouse: m };
    });

  const blocks = article.content(topMice);

  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/blog" className="text-sm opacity-40 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>
          ← Back to blog
        </Link>

        <article className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${article.color}20`, color: article.color }}>{article.tag}</span>
            <span className="text-xs opacity-30" style={{ color: "#fff" }}>{article.date}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-8 leading-tight" style={{ color: "#fff" }}>{article.title}</h1>

          <div className="space-y-5">
            {blocks.map((block, i) => {
              if (block.type === "p") return <p key={i} className="text-base leading-relaxed opacity-70" style={{ color: "#fff" }}>{block.text}</p>;
              if (block.type === "h2") return <h2 key={i} className="text-xl font-black mt-8 mb-3" style={{ color: article.color }}>{block.text}</h2>;
              if (block.type === "cta") return (
                <div key={i} className="mt-8">
                  <Link href={block.href} className="inline-block px-6 py-3 rounded-lg text-sm font-bold no-underline transition-all hover:scale-105" style={{ background: `${article.color}20`, border: `1px solid ${article.color}30`, color: article.color, textDecoration: "none" }}>{block.text}</Link>
                </div>
              );
              if (block.type === "mice") return (
                <div key={i} className="grid gap-3 my-6">
                  {block.data.map((m, j) => (
                    <a key={j} href={m.mouse ? `/mice/${slug(m.mouse.name)}` : "#"} className="flex items-center gap-4 p-4 rounded-xl no-underline transition-all hover:scale-[1.01]" style={{ background: "#0a0a0a", border: "1px solid #ffffff08", textDecoration: "none" }}>
                      <span className="text-lg font-black opacity-20 w-6 text-center" style={{ color: "#fff" }}>#{j + 1}</span>
                      {m.mouse && MOUSE_IMAGE_URLS[m.mouse.name] && <img src={MOUSE_IMAGE_URLS[m.mouse.name]} alt={m.name} className="h-10 w-16 object-contain" />}
                      <div className="flex-1">
                        <div className="font-bold text-sm" style={{ color: m.mouse ? (BRAND_COLORS[m.mouse.brand] || "#fff") : "#fff" }}>{m.name}</div>
                        <div className="text-xs opacity-40" style={{ color: "#fff" }}>{m.pct}% of pros · {m.count} players{m.mouse ? ` · ${m.mouse.weight}g · $${m.mouse.price}` : ""}</div>
                      </div>
                      {m.mouse && <a href={amazonLink(m.name)} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-bold no-underline transition-all hover:scale-105" style={{ background: "#f59e0b", color: "#000", textDecoration: "none" }}>Buy</a>}
                    </a>
                  ))}
                </div>
              );
              return null;
            })}
          </div>
        </article>

        {/* Related articles */}
        <div className="mt-16 pt-8" style={{ borderTop: "1px solid #ffffff08" }}>
          <h3 className="text-sm font-bold uppercase tracking-widest opacity-30 mb-4" style={{ color: "#fff" }}>More Articles</h3>
          <div className="grid gap-3">
            {SLUGS.filter((s) => s !== params.slug).slice(0, 3).map((s) => {
              const a = ARTICLES[s];
              return (
                <Link key={s} href={`/blog/${s}`} className="flex items-center gap-3 p-3 rounded-lg no-underline transition-all hover:scale-[1.01]" style={{ background: "#ffffff04", border: "1px solid #ffffff06", textDecoration: "none" }}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${a.color}20`, color: a.color }}>{a.tag}</span>
                  <span className="text-sm font-bold truncate" style={{ color: "#fff" }}>{a.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
