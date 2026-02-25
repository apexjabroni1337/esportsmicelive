import Link from "next/link";

export const metadata = {
  title: "Page Not Found — EsportsMice",
  description: "The page you're looking for doesn't exist. Browse our database of pro esports mice, player settings, and gear comparisons.",
};

export default function NotFound() {
  const links = [
    { href: "/", label: "Home", desc: "Back to the homepage" },
    { href: "/mice", label: "All Mice", desc: "Browse 150+ esports mice" },
    { href: "/players", label: "Pro Players", desc: "2100+ player settings" },
    { href: "/games", label: "Games", desc: "Mouse DNA by game" },
    { href: "/compare", label: "Compare", desc: "Side-by-side comparison" },
    { href: "/sensitivity", label: "Sensitivity Converter", desc: "Convert between games" },
    { href: "/brands", label: "Brands", desc: "Razer, Logitech, Zowie & more" },
    { href: "/sensors", label: "Sensors", desc: "PAW3395, Focus Pro & more" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#050505" }}>
      <div className="text-center max-w-lg">
        <h1 className="text-7xl font-black mb-2" style={{ fontFamily: "Orbitron", color: "#00ff6a" }}>404</h1>
        <p className="text-xl opacity-60 mb-2">Page not found</p>
        <p className="text-sm opacity-40 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-left p-3 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: "#111", border: "1px solid #ffffff0a" }}
            >
              <div className="text-sm font-bold" style={{ color: "#00ff6a" }}>{l.label}</div>
              <div className="text-xs opacity-40 mt-0.5">{l.desc}</div>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
          style={{ background: "#00ff6a20", color: "#00ff6a", border: "1px solid #00ff6a40" }}
        >
          ← Back to EsportsMice
        </Link>
      </div>
    </div>
  );
}
