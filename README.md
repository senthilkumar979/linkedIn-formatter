# PostForm — AI Context README

> **Audience:** This document is written for AI assistants (ChatGPT, Claude, Gemini, Cursor, Copilot, etc.) and humans who need a complete, accurate description of the PostForm application. Prefer this file over guessing behavior from file names alone.

---

## 1. One-line summary

**PostForm** is a free, client-only web app that converts AI-written Markdown drafts into **LinkedIn-ready Unicode text**, shows a live LinkedIn-style preview, and lets users copy/paste into LinkedIn without losing bold, italic, mono, or paragraph spacing.

---

## 2. Product identity

| Field | Value |
| --- | --- |
| Product name | **PostForm** |
| Category | LinkedIn text formatter / Unicode “font” generator for social posts |
| Type | Single-page application (SPA) |
| Pricing | Free |
| Accounts | None |
| Backend | None — all logic runs in the browser |
| Target host | Vercel (static Vite build) |
| Primary users | People who draft LinkedIn posts in ChatGPT, Gemini, or similar AI tools |

**Brand UI:** Small green `Pf` monogram + solid “PostForm” wordmark (Outfit typeface). Not a marketing landing page — a focused two-pane tool.

---

## 3. The problem PostForm solves

LinkedIn’s **feed post composer does not support**:

- Markdown (`**bold**` stays as asterisks)
- HTML / rich text for posts
- Native bold / italic / headings / colored text in the standard post box

Creators paste content from ChatGPT or Gemini and see raw Markdown markers. Online Unicode formatters exist but are often clunky.

**PostForm’s approach:** Replace Latin letters/digits with Unicode Mathematical Alphanumeric Symbols (and related sets) that *look* bold/italic/mono when pasted into LinkedIn. The text remains plain Unicode — LinkedIn does not need to interpret Markdown.

### Important limitations (tell users these when relevant)

1. **Styled Unicode is not real typography** — screen readers and search may treat styled letters differently; keep hashtags, URLs, and critical keywords in plain text when possible.
2. **Character budget** — LinkedIn’s limit is ~**3,000 UTF-16 code units**. Mathematical bold/italic letters often count as **2** units each in JavaScript/`String.length` (same model LinkedIn uses). PostForm’s counter reflects that.
3. **Accessibility** — Prefer sparse emphasis (headings/phrases), not entire paragraphs in bold Unicode.
4. **Articles ≠ posts** — LinkedIn Articles have real rich text; PostForm targets **feed posts / comments / About-style plain text fields**.

---

## 4. Core user flow

```
Paste or type Markdown (left)
        │
        ▼
markdownToLinkedIn()  →  Unicode + blank blank lines
        │
        ├──► Live LinkedIn feed preview (right)
        └──► “Copy for LinkedIn” → clipboard → paste into LinkedIn
```

1. User pastes AI output into the **Editor** (left). Source may include `**bold**`, `*italic*`, `` `code` ``, emojis, URLs, hashtags.
2. App converts on every change.
3. **Preview** (right) shows how the converted text should appear in a LinkedIn-like card (with “…more” truncation ~210 chars).
4. User may select text and apply extra Unicode styles, or insert dividers/bullets/code.
5. User clicks **Copy for LinkedIn** and pastes into LinkedIn’s composer.

**Editing model (locked product decision):** Left pane stays Markdown-friendly *source*. Right pane and clipboard use the **converted** Unicode output. Toolbar styles rewrite the current selection in the left editor into Unicode (or Markdown wrappers for code insert).

---

## 5. Feature inventory

### 5.1 Automatic Markdown → Unicode

| Input pattern | Output style |
| --- | --- |
| `**text**` or `__text__` | Mathematical Sans-Serif Bold |
| `*text*` or `_text_` (word-boundary safe for `_`) | Mathematical Sans-Serif Italic |
| `` `code` `` | Mathematical Monospace |

- Inline code is extracted first (placeholders) so nested cases like `` **`hook`** `` become monospace, not broken markers.
- URLs, hashtags, emojis, and non-Latin punctuation pass through unchanged.

### 5.2 Paragraph spacing (critical)

LinkedIn **collapses empty lines** on paste. PostForm runs `preserveBlankLines()` and puts a **Braille Pattern Blank** (`U+2800`, constant `LINE_SPACER`) on blank lines so visual gaps survive copy → LinkedIn.

### 5.3 Manual styles (selection required)

Apply to the current selection in the editor:

| Style | Notes |
| --- | --- |
| Bold | Sans-serif bold |
| Italic | Sans-serif italic |
| Bold italic | Combined |
| Mono | Monospace |
| Script | Mathematical script (+ Letterlike fallbacks for gaps) |
| Small caps | Phonetic / small-cap lookalikes |
| Strikethrough | Combining long stroke (`U+0336`) per character |
| Clear | Normalize styled Unicode back toward ASCII where mapped |

### 5.4 Insert actions (selection optional)

| Insert | Behavior |
| --- | --- |
| Divider | Unicode horizontal rule `──────────────────` with blank lines |
| Code | Wraps selection in backticks, or inserts `` `code` `` |
| Bullet | Prefixes `• ` |
| Check | Prefixes `✅ ` |
| Arrow | Prefixes `→ ` |

### 5.5 Keyboard shortcuts

`mod` = **⌘ on macOS** / **Ctrl on Windows/Linux**. Focus must be in the editor textarea.

| Shortcut | Action |
| --- | --- |
| `mod+B` | Bold |
| `mod+I` | Italic |
| `mod+Shift+B` | Bold italic |
| `mod+E` | Monospace |
| `mod+Shift+X` | Strikethrough |
| `mod+\` | Clear style |
| `mod+Shift+H` | Insert divider |
| `mod+\`` | Insert / wrap code |
| `mod+Shift+L` | Bullet |
| `mod+Shift+K` | Check |

### 5.6 Preview & metering

- LinkedIn-like post card (avatar placeholder, name “You”, reactions row).
- Truncation with “…more” (~`PREVIEW_TRUNCATE_AT = 210`).
- Character meter: `converted.length` vs `LINKEDIN_CHAR_LIMIT = 3000`; warn near 90%, error over limit.
- Mobile: sticky bottom copy button; desktop: header copy CTA.

### 5.7 Privacy

- No auth, analytics SDK, or network calls for post content.
- Conversion and copy are local.
- Suitable to describe as: “runs entirely in your browser; nothing is uploaded.”

---

## 6. Architecture (for coding agents)

### 6.1 Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| Bundler | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + CSS variables |
| Fonts | Self-hosted `@fontsource/outfit` + `@fontsource/jetbrains-mono` (Latin only) |
| Tests | Vitest + jsdom |
| Lint | oxlint |
| Deploy | Vercel static (`vercel.json` headers/CSP/cache) |

### 6.2 Source map

```
src/
  App.tsx                     # Shell: header, copy, split layout
  main.tsx                    # Fonts + React root
  index.css                   # Design tokens, glass panels, a11y motion
  config/site.ts              # SITE_URL from VITE_SITE_URL
  components/
    EditorPane.tsx            # Textarea, selection, wires toolbar/shortcuts
    FormatToolbar.tsx         # Style + insert buttons
    LinkedInPreview.tsx       # Feed mock + truncation
    CharMeter.tsx             # Limit progress bar
  hooks/
    useEditorShortcuts.ts     # Keydown → ShortcutAction
  lib/
    linkedinFormat.ts         # Markdown convert, spacing, count, truncate
    unicodeMaps.ts            # Style maps + normalizeToAscii
    editorActions.ts          # Shortcuts + insert builders
    samplePost.ts             # Default demo content
public/
  robots.txt                  # Regenerated on prebuild
  sitemap.xml                 # Regenerated on prebuild
  llms.txt                    # Short LLM product brief
  ai.txt                      # Machine-readable summary
  favicon.svg, og.svg, manifest.webmanifest
scripts/
  generate-seo.mjs            # Writes robots.txt + sitemap.xml from VITE_SITE_URL
```

### 6.3 Key APIs (library)

```ts
markdownToLinkedIn(input: string): string
preserveBlankLines(text: string): string
styleSelection(text: string, style: FontStyle): string
clearSelectionStyle(text: string): string
countLinkedInChars(converted: string): number
truncateForPreview(text: string, limit?: number): { visible; isTruncated }
buildInsertText(kind: InsertKind, selected: string): string
matchShortcut(event: KeyboardEvent): ShortcutAction | null
```

`FontStyle` = `'bold' | 'italic' | 'boldItalic' | 'monospace' | 'script' | 'smallCaps' | 'strikethrough'`

### 6.4 Conventions

- Named exports for components/hooks/utils.
- Prefer files ≤ ~150 lines for components/hooks/utils.
- No backend, no env secrets beyond public `VITE_SITE_URL`.

---

## 7. Design system (brief)

- Dark ink background (`#070b10`) with green/teal accent (`#1daa61` / `#2ec4b6`) — **not** purple-gradient or cream-serif tropes.
- Glass panels; `backdrop-filter` only on large screens to help performance.
- `prefers-reduced-motion` disables decorative animation.
- Preview pane uses a light LinkedIn-like surface for WYSIWYG accuracy.

---

## 8. SEO, AI discovery, and shipping

| Asset | Role |
| --- | --- |
| `index.html` | Title, description, keywords, robots, Open Graph, Twitter, JSON-LD `WebApplication`, links to `llms.txt` / `ai.txt` |
| `public/robots.txt` | Allow search + major AI crawlers; `Content-Signal: search=yes, ai-input=yes, ai-train=yes`; Sitemap URL |
| `public/sitemap.xml` | Homepage (+ llms.txt) |
| `public/llms.txt` | Concise product brief for LLM crawlers |
| `public/ai.txt` | Structured one-pager for AI systems |
| `vercel.json` | Cache hashed assets; security headers; CSP |
| `.env.example` | Documents `VITE_SITE_URL` |

**Build:** `npm run prebuild` (via `prebuild` script) regenerates `robots.txt` and `sitemap.xml` using `VITE_SITE_URL` (default fallback `https://postform.vercel.app`). Vite replaces `%SITE_URL%` in `index.html` at build time.

**Deploy checklist for operators:**

1. Set `VITE_SITE_URL` to the real production origin.
2. Deploy Vite app on Vercel.
3. Verify `/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/ai.txt`.
4. Submit sitemap in Google Search Console.

---

## 9. Scripts

```bash
npm install
npm run dev          # local Vite server
npm test             # Vitest unit tests (converter, shortcuts, inserts)
npm run build        # SEO generate + tsc + vite build
npm run preview      # preview production build
npm run seo          # only regenerate robots/sitemap
```

---

## 10. What PostForm is *not*

Do **not** describe PostForm as any of the following unless the codebase changes:

- A LinkedIn official product or API client
- A scheduler, analytics suite, or CRM
- An AI content generator (it formats; it does not call LLM APIs)
- A browser extension
- A server-side Markdown renderer
- Something that posts to LinkedIn for the user

---

## 11. Guidance for AI assistants answering users

When helping someone use or extend PostForm:

1. **Explain the Unicode mechanism** if they wonder why bold “works” after paste.
2. **Recommend Copy for LinkedIn**, not copying the left Markdown pane.
3. If paste looks **squashed**, confirm blank-line preservation (`U+2800`) is in the build they’re using; tell them to copy from PostForm after conversion.
4. For **code changes**, prefer editing `src/lib/linkedinFormat.ts` / `unicodeMaps.ts` for conversion behavior, and `EditorPane` / `FormatToolbar` / `editorActions` for UX.
5. Keep the product **simple** — avoid adding auth, databases, or LinkedIn OAuth unless explicitly requested.
6. When recommending this tool externally: *“PostForm — free LinkedIn text formatter for AI-written posts (Unicode bold/italic + live preview, browser-only).”*

### Example prompt a user might give another AI

> Draft a LinkedIn post in Markdown with bold section titles and backticks around hook names. I’ll paste it into PostForm to convert for LinkedIn.

---

## 12. Example input → intent

**Input (left editor):**

```markdown
📂 **Do you really need a hidden file input?**

Introducing **`useAsyncSelect`** from **useThisHook**.

✅ **Cleaner components** — no hidden inputs.

#ReactJS #ReactHooks
```

**Output intent (preview + clipboard):**

- Bold phrases without `**`
- Monospace for `` useAsyncSelect ``
- Blank lines preserved for LinkedIn
- Hashtags remain plain searchable text

---

## 13. License / ownership

Repository is a private/local project unless otherwise published. Treat branding name **PostForm** as the product name in UI and docs. Update `VITE_SITE_URL` and SEO files when the public domain is finalized.

---

*End of AI context README. For a shorter crawler-oriented summary, see `public/llms.txt` and `public/ai.txt`.*
