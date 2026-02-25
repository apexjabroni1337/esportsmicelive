# EsportsMice — Next.js

Professional esports mouse database built with Next.js for maximum SEO and crawlability.

## SEO Features

- **Individual URLs** for every page, mouse, and player profile
- **Server-side rendering** — full HTML content visible to search engines
- **Dynamic metadata** — unique `<title>`, `<meta description>`, Open Graph tags per page
- **Structured data** — JSON-LD schema for Google rich results
- **Auto-generated sitemap** at `/sitemap.xml` with all 100+ URLs
- **robots.txt** at `/robots.txt` allowing all crawlers
- **Canonical URLs** on every page to prevent duplicate content
- **Vercel Analytics** built in

## Pages

| Route | Content |
|---|---|
| `/` | Home/Overview with hero, quick insights, mouse picker |
| `/mice` | All mice database with filters and sorting |
| `/mice/[slug]` | Individual mouse detail (47 pages) |
| `/players` | All pro players list with advanced filters |
| `/players/[slug]` | Individual player profiles with bio, stats, achievements |
| `/games` | Game-specific mouse DNA and breakdowns |
| `/brands` | Brand comparison and analysis |
| `/sensors` | Mouse sensor analytics and comparison |
| `/trends` | Industry trends, weight/polling/wireless/price data |
| `/compare` | Side-by-side mouse comparison tool |
| `/lab` | Mouse finder quiz |
| `/shapes` | Mouse shape overlay tool |
| `/sensitivity` | Sensitivity converter across games |

## Deployment to Vercel

### Option A: Push to GitHub (Recommended)

1. Create a new GitHub repo
2. Push this project:
   ```bash
   cd esportsmice-next
   git init
   git add .
   git commit -m "Initial Next.js conversion"
   git remote add origin https://github.com/YOUR_USERNAME/esportsmice.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) → Import Project → Select the repo
4. Vercel auto-detects Next.js — click Deploy

### Option B: Vercel CLI

```bash
npm i -g vercel
cd esportsmice-next
npm install
vercel
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── layout.jsx          # Root layout (nav, analytics, JSON-LD)
│   ├── page.jsx            # Homepage
│   ├── globals.css          # Global styles + Tailwind
│   ├── sitemap.js           # Auto-generated sitemap
│   ├── robots.js            # robots.txt
│   ├── not-found.jsx        # 404 page
│   ├── mice/
│   │   ├── page.jsx         # All mice
│   │   └── [slug]/page.jsx  # Individual mouse (47 pages)
│   ├── players/
│   │   ├── page.jsx         # All players
│   │   └── [slug]/page.jsx  # Player profiles
│   ├── games/page.jsx
│   ├── brands/page.jsx
│   ├── sensors/page.jsx
│   ├── trends/page.jsx
│   ├── compare/page.jsx
│   ├── lab/page.jsx
│   ├── shapes/page.jsx
│   └── sensitivity/page.jsx
├── components/
│   ├── ClientApp.jsx        # Main interactive app component
│   └── ui.jsx               # Shared UI components
├── data/
│   └── index.js             # All data (mice, players, constants)
└── config files
```

## Image Setup

Copy your mouse/brand/game images into `public/images/` maintaining the paths referenced in the data (e.g., `public/images/mice/razer-viper-v3-pro.png`).
