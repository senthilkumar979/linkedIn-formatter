/** Production site URL — set `VITE_SITE_URL` in Vercel (e.g. https://postform.vercel.app). */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? 'https://postform.vercel.app'
).replace(/\/$/, '')

export const SITE_NAME = 'PostForm'
export const SITE_TAGLINE = 'Free LinkedIn Text Formatter'
export const SITE_DESCRIPTION =
  'PostForm is a free LinkedIn text formatter. Paste ChatGPT or Gemini Markdown, preview Unicode bold and italic, keep paragraph spacing, and copy posts ready for LinkedIn.'
