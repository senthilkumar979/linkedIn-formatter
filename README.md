# PostForm

Free LinkedIn text formatter. Paste Markdown from ChatGPT or Gemini, preview a LinkedIn-style feed card, and copy Unicode-formatted text that pastes cleanly into LinkedIn.

LinkedIn does not support Markdown or rich text in posts. PostForm converts `**bold**`, `*italic*`, and `` `code` `` into Mathematical Alphanumeric Unicode characters that look styled in the feed.

## Features

- Split editor + live LinkedIn preview
- Auto-convert Markdown emphasis and inline code
- Preserves paragraph spacing on paste (LinkedIn collapses empty lines — PostForm inserts invisible spacers)
- Selection toolbar: bold, italic, bold italic, mono, script, small caps, strikethrough
- Insert divider, code, bullet, check, and arrow
- Keyboard shortcuts (⌘B / Ctrl+B, ⌘I, ⌘E, ⌘⇧X, ⌘⇧H, ⌘\`, …)
- UTF-16 character counter (LinkedIn’s ~3,000 limit)
- Fully client-side — nothing is uploaded

## Develop

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Build

```bash
npm run build
npm run preview
```

`prebuild` regenerates [`public/robots.txt`](public/robots.txt) and [`public/sitemap.xml`](public/sitemap.xml) from `VITE_SITE_URL`.

## Deploy on Vercel

1. Push this repo to GitHub (or use the Vercel CLI).
2. Import the project — framework preset **Vite**.
3. Set environment variable:

| Name | Example |
| --- | --- |
| `VITE_SITE_URL` | `https://your-project.vercel.app` |

4. Deploy. No other secrets required.

```bash
npx vercel
```

### Shipping checklist

- [ ] `VITE_SITE_URL` set to the production domain
- [ ] `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/ai.txt` reachable after deploy
- [ ] Submit sitemap in [Google Search Console](https://search.google.com/search-console)
- [ ] Optional: custom domain + update `VITE_SITE_URL` and redeploy

### SEO & AI discovery

| File | Purpose |
| --- | --- |
| `/robots.txt` | Crawl rules + AI bot allow + sitemap |
| `/sitemap.xml` | Homepage for search engines |
| `/llms.txt` | Concise product brief for LLM crawlers |
| `/ai.txt` | Machine-readable tool summary |
| `index.html` meta + JSON-LD | Classic SEO / Open Graph / WebApplication schema |

### Performance notes

- Fonts are self-hosted (`@fontsource`) — no Google Fonts round-trips
- Heavy `backdrop-filter` only on large screens
- `prefers-reduced-motion` respected
- Long-cache headers for hashed `/assets/*` via `vercel.json`
