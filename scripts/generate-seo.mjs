import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const site = (process.env.VITE_SITE_URL || 'https://postform.vercel.app').replace(/\/$/, '')
const publicDir = resolve(process.cwd(), 'public')

const robots = `# PostForm robots.txt
# https://www.robotstxt.org/robotstxt.html

User-agent: *
Allow: /
Content-Signal: search=yes, ai-input=yes, ai-train=yes

# Search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# AI assistants & answer engines (discovery)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${site}/sitemap.xml
`

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${site}/llms.txt</loc>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>
`

writeFileSync(resolve(publicDir, 'robots.txt'), robots)
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap)
console.log(`SEO files written for ${site}`)
