import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://esportsmice.com"),
  title: {
    default: "EsportsMice — The Definitive Guide to Pro Esports Mice",
    template: "%s | EsportsMice",
  },
  description:
    "The #1 database of professional esports mice. Compare mice used by 2100+ pro players across CS2, Valorant, League of Legends, and 10+ major games. Specs, rankings, sensor data, and pro settings.",
  keywords: [
    "esports mice",
    "pro gaming mouse",
    "CS2 mouse",
    "Valorant mouse",
    "pro player settings",
    "gaming mouse ranking",
    "esports peripherals",
    "pro player mouse",
    "best gaming mouse",
    "mouse sensor comparison",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "EsportsMice",
    title: "EsportsMice — The Definitive Guide to Pro Esports Mice",
    description:
      "The #1 database of professional esports mice. Compare mice used by 2100+ pro players across 13 major games.",
    url: "https://esportsmice.com",
    images: [
      {
        url: "https://esportsmice.com/og?title=The+Definitive+Guide+to+Pro+Esports+Mice&subtitle=2100%2B+Pro+Players+%C2%B7+150%2B+Mice+%C2%B7+13+Games",
        width: 1200,
        height: 630,
        alt: "EsportsMice — The Definitive Guide to Pro Esports Mice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EsportsMice — The Definitive Guide to Pro Esports Mice",
    description:
      "The #1 database of professional esports mice. Compare mice used by 2100+ pro players across 13 major games.",
    images: ["https://esportsmice.com/og?title=The+Definitive+Guide+to+Pro+Esports+Mice&subtitle=2100%2B+Pro+Players+%C2%B7+150%2B+Mice+%C2%B7+13+Games"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://esportsmice.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#050505" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://flagcdn.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://flagcdn.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="EsportsMice Blog" href="/feed.xml" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "EsportsMice",
                url: "https://esportsmice.com",
                description:
                  "The #1 database of professional esports mice. Compare mice used by 2100+ pro players across 13 major games.",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://esportsmice.com/?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "EsportsMice",
                url: "https://esportsmice.com",
                logo: "https://esportsmice.com/icon.png",
                sameAs: [],
                description: "The definitive database for professional esports mice, pro player settings, and gaming peripheral data.",
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What mouse do most pro esports players use?",
                    acceptedAnswer: { "@type": "Answer", text: "The Razer Viper V3 Pro is the most popular mouse among professional esports players in 2025-2026, used across CS2, Valorant, Fortnite, and other titles. The Logitech G Pro X Superlight 2 is the second most popular choice." },
                  },
                  {
                    "@type": "Question",
                    name: "What DPI do pro players use?",
                    acceptedAnswer: { "@type": "Answer", text: "Most professional esports players use between 400 and 800 DPI. 800 DPI is the most common setting, followed by 400 DPI. The actual aiming speed is determined by eDPI (DPI × in-game sensitivity), which varies significantly by game." },
                  },
                  {
                    "@type": "Question",
                    name: "What mouse does s1mple use?",
                    acceptedAnswer: { "@type": "Answer", text: "s1mple, widely regarded as the greatest CS player of all time, has used various mice throughout his career. Check his full profile on EsportsMice for his current mouse, DPI, sensitivity, and complete gear setup." },
                  },
                  {
                    "@type": "Question",
                    name: "Is a lighter mouse better for gaming?",
                    acceptedAnswer: { "@type": "Answer", text: "Lighter mice (under 60g) are preferred by most professional FPS players because they allow faster flick aiming and reduce wrist fatigue. However, some players prefer medium-weight mice (65-80g) for more controlled, stable aim. The best weight depends on your grip style and game." },
                  },
                  {
                    "@type": "Question",
                    name: "What polling rate do pros use?",
                    acceptedAnswer: { "@type": "Answer", text: "In 2025, 4KHz (4000Hz) polling is the most common among pros, with 8KHz (8000Hz) gaining adoption. Higher polling rates reduce input delay and provide smoother cursor movement, which matters at the highest levels of competitive play." },
                  },
                ],
              },
            ]),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
