import Link from "next/link";

export const metadata = {
  title: "Blog — EsportsMice",
  description: "Esports mouse guides, pro gear analysis, and data-driven insights. Learn what the pros use and why.",
  alternates: { canonical: "https://esportsmice.com/blog" },
  openGraph: {
    title: "Blog — EsportsMice",
    description: "Esports mouse guides, pro gear analysis, and data-driven insights.",
    url: "https://esportsmice.com/blog",
  },
  twitter: { card: "summary_large_image" },
};

const ARTICLES = [
  {
    slug: "how-to-choose-gaming-mouse",
    title: "How to Choose the Right Gaming Mouse in 2026",
    excerpt: "Shape, weight, sensor, wireless vs wired — the complete guide to finding your perfect mouse based on what the pros actually use.",
    date: "2026-02-23",
    tag: "Guide",
    color: "#00ff6a",
  },
  {
    slug: "claw-vs-palm-vs-fingertip-grip",
    title: "Claw vs Palm vs Fingertip Grip: Which Is Best for FPS?",
    excerpt: "We analyzed grip styles across 2,000+ pro players to find which grip dominates each game — and which mice match each style.",
    date: "2026-02-23",
    tag: "Analysis",
    color: "#00b4ff",
  },
  {
    slug: "mouse-weight-trend-2024-2026",
    title: "The Great Weight Race: How Pro Mice Went from 100g to 45g",
    excerpt: "A data-driven look at how average mouse weight in esports has dropped 40% in just three years, and what it means for your next purchase.",
    date: "2026-02-23",
    tag: "Data",
    color: "#f59e0b",
  },
  {
    slug: "wireless-vs-wired-2026",
    title: "Is Wireless Finally Better Than Wired? The 2026 Data Says Yes",
    excerpt: "Over 80% of CS2 and Valorant pros now use wireless mice. Here's the data behind the shift and why wired is disappearing from the pro scene.",
    date: "2026-02-23",
    tag: "Analysis",
    color: "#8b5cf6",
  },
  {
    slug: "dpi-edpi-sensitivity-explained",
    title: "DPI, eDPI, and Sensitivity Explained: A Complete Guide",
    excerpt: "What DPI should you use? What's eDPI? We break down every sensitivity concept with real pro player data and optimal ranges for each game.",
    date: "2026-02-23",
    tag: "Guide",
    color: "#ff4655",
  },
];

export default function BlogPage() {
  return (
    <div style={{ background: "#050505", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-sm opacity-40 hover:opacity-60 transition-all no-underline" style={{ color: "#fff", textDecoration: "none" }}>
          ← Back to EsportsMice
        </Link>
        <h1 className="text-3xl sm:text-5xl font-black mt-6 mb-2" style={{ color: "#00ff6a", fontFamily: "Orbitron, sans-serif" }}>Blog</h1>
        <p className="text-base opacity-40 mb-10">Esports mouse guides, pro gear analysis, and data-driven insights.</p>

        <div className="space-y-6">
          {ARTICLES.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="block rounded-xl p-6 transition-all hover:scale-[1.01] no-underline" style={{ background: `${a.color}06`, border: `1px solid ${a.color}12`, textDecoration: "none" }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${a.color}20`, color: a.color }}>{a.tag}</span>
                <span className="text-xs opacity-30" style={{ color: "#fff" }}>{a.date}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mb-2" style={{ color: "#fff" }}>{a.title}</h2>
              <p className="text-sm opacity-50" style={{ color: "#fff" }}>{a.excerpt}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-xl p-8 text-center" style={{ background: "#ffffff04", border: "1px solid #ffffff08" }}>
          <p className="text-sm opacity-30" style={{ color: "#fff" }}>More articles coming soon. Want to be notified?</p>
          <Link href="/contact" className="inline-block mt-3 px-5 py-2 rounded-lg text-sm font-bold no-underline transition-all hover:scale-105" style={{ background: "#00ff6a", color: "#000", textDecoration: "none" }}>Get in Touch</Link>
        </div>
      </div>
    </div>
  );
}
