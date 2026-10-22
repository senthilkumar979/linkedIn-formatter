import { applyFontStyle, normalizeToAscii, type FontStyle } from './unicodeMaps'

export const LINKEDIN_CHAR_LIMIT = 3000
export const PREVIEW_TRUNCATE_AT = 210

/** Braille blank — LinkedIn collapses empty lines; this keeps paragraph gaps. */
export const LINE_SPACER = '\u2800'

const MARK_START = '\uE000'
const MARK_END = '\uE001'
const INDEX_BASE = 0xe100

function encodePlaceholder(index: number): string {
  return `${MARK_START}${String.fromCodePoint(INDEX_BASE + index)}${MARK_END}`
}

function decodePlaceholders(text: string, codes: string[]): string {
  return text.replace(
    new RegExp(`${MARK_START}([\\uE100-\\uE1FF])${MARK_END}`, 'g'),
    (_, marker: string) => {
      const index = marker.codePointAt(0)! - INDEX_BASE
      return codes[index] ?? ''
    },
  )
}

/**
 * LinkedIn strips purely empty lines on paste. Put an invisible spacer on
 * blank lines so paragraph spacing survives copy → composer.
 */
export function preserveBlankLines(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => (line.trim() === '' || line === LINE_SPACER ? LINE_SPACER : line))
    .join('\n')
}

/**
 * Convert Markdown-ish AI output into LinkedIn-ready Unicode text.
 * Handles **bold**, __bold__, *italic*, _italic_, and `code`.
 */
export function markdownToLinkedIn(input: string): string {
  if (!input) return ''

  const codes: string[] = []
  let text = input.replace(/`([^`]+)`/g, (_, code: string) => {
    codes.push(applyFontStyle(code, 'monospace'))
    return encodePlaceholder(codes.length - 1)
  })

  text = text.replace(/\*\*([^*]+)\*\*/g, (_, inner: string) => applyFontStyle(inner, 'bold'))
  text = text.replace(/__([^_]+)__/g, (_, inner: string) => applyFontStyle(inner, 'bold'))

  text = text.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, (_, inner: string) =>
    applyFontStyle(inner, 'italic'),
  )
  text = text.replace(
    /(?<![A-Za-z0-9_])_([^_\n]+)_(?![A-Za-z0-9_])/g,
    (_, inner: string) => applyFontStyle(inner, 'italic'),
  )

  return preserveBlankLines(decodePlaceholders(text, codes))
}

export function styleSelection(text: string, style: FontStyle): string {
  const plain = normalizeToAscii(text)
  return applyFontStyle(plain, style)
}

export function clearSelectionStyle(text: string): string {
  return normalizeToAscii(text)
}

/** LinkedIn counts UTF-16 code units (same as JS string.length). */
export function countLinkedInChars(converted: string): number {
  return converted.length
}

export function isOverLimit(converted: string): boolean {
  return countLinkedInChars(converted) > LINKEDIN_CHAR_LIMIT
}

export function truncateForPreview(
  text: string,
  limit = PREVIEW_TRUNCATE_AT,
): { visible: string; isTruncated: boolean } {
  if (text.length <= limit) return { visible: text, isTruncated: false }

  let cut = limit
  while (cut > 0 && text[cut] !== ' ' && text[cut] !== '\n') cut -= 1
  if (cut < limit * 0.6) cut = limit

  return { visible: text.slice(0, cut).trimEnd(), isTruncated: true }
}

export { type FontStyle }
