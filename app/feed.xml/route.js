const BLOG_ARTICLES = [
  {
    slug: "how-to-choose-gaming-mouse",
    title: "How to Choose the Right Gaming Mouse in 2026",
    description: "Shape, weight, sensor, wireless vs wired — the complete guide to finding your perfect mouse based on what the pros actually use.",
    date: "2026-02-23",
  },
  {
    slug: "claw-vs-palm-vs-fingertip-grip",
    title: "Claw vs Palm vs Fingertip Grip: Which Is Best for FPS?",
    description: "We analyzed grip styles across 2,000+ pro players to find which grip dominates each game — and which mice match each style.",
    date: "2026-02-23",
  },
  {
    slug: "mouse-weight-trend-2024-2026",
    title: "The Great Weight Race: How Pro Mice Went from 100g to 45g",
    description: "A data-driven look at how average mouse weight in esports has dropped 40% in just three years.",
    date: "2026-02-23",
  },
  {
    slug: "wireless-vs-wired-2026",
    title: "Is Wireless Finally Better Than Wired? The 2026 Data Says Yes",
    description: "Over 80% of CS2 and Valorant pros now use wireless mice. Here's the data behind the shift.",
    date: "2026-02-23",
  },
  {
    slug: "dpi-edpi-sensitivity-explained",
    title: "DPI, eDPI, and Sensitivity Explained: A Complete Guide",
    description: "What DPI should you use? What's eDPI? We break down every sensitivity concept with real pro player data.",
    date: "2026-02-23",
  },
];

export async function GET() {
  const baseUrl = "https://esportsmice.com";

  const items = BLOG_ARTICLES.map(
    (a) => `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${baseUrl}/blog/${a.slug}</link>
      <description><![CDATA[${a.description}]]></description>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${a.slug}</guid>
    </item>`
  ).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EsportsMice Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Esports mouse guides, pro gear analysis, and data-driven insights from EsportsMice.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
