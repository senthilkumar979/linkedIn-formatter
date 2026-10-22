# LinkedIn Post Formatter

Paste Markdown from ChatGPT or Gemini, preview a LinkedIn-style feed card, and copy Unicode-formatted text that pastes cleanly into LinkedIn.

LinkedIn does not support Markdown or rich text in posts. This app converts `**bold**`, `*italic*`, and `` `code` `` into Mathematical Alphanumeric Unicode characters that look styled in the feed.

## Features

- Split editor + live LinkedIn preview
- Auto-convert Markdown emphasis and inline code
- Preserves paragraph spacing on paste (LinkedIn collapses empty lines — PostForm inserts invisible spacers)
- Selection toolbar: bold, italic, bold italic, mono, script, small caps, strikethrough
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

## Deploy on Vercel

1. Push this repo to GitHub (or connect the folder with the Vercel CLI).
2. Import the project in [Vercel](https://vercel.com/new) — framework preset **Vite**.
3. Deploy. No environment variables required.

Or from the CLI:

```bash
npx vercel
```
