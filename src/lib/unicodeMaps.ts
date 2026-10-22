export type FontStyle =
  | 'bold'
  | 'italic'
  | 'boldItalic'
  | 'monospace'
  | 'script'
  | 'smallCaps'
  | 'strikethrough'

interface RangeMap {
  upper?: number
  lower?: number
  digit?: number
}

type RangedStyle = Exclude<FontStyle, 'strikethrough' | 'smallCaps' | 'script'>

const STYLE_RANGES: Record<RangedStyle, RangeMap> = {
  bold: { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec },
  italic: { upper: 0x1d608, lower: 0x1d622 },
  boldItalic: { upper: 0x1d63c, lower: 0x1d656 },
  monospace: { upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 },
}

/** Mathematical script holes filled with Letterlike Symbols. */
const SCRIPT_GAPS: Record<string, string> = {
  B: '\u212C',
  E: '\u2130',
  F: '\u2131',
  H: '\u210B',
  I: '\u2110',
  L: '\u2112',
  M: '\u2133',
  R: '\u211B',
  e: '\u212F',
  g: '\u210A',
  o: '\u2134',
}

const SMALL_CAP_CHARS = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ'
const STRIKE = '\u0336'

function fromRange(base: number, offset: number): string {
  return String.fromCodePoint(base + offset)
}

function mapLatin(char: string, ranges: RangeMap): string {
  const code = char.codePointAt(0)
  if (code === undefined) return char
  if (ranges.upper !== undefined && code >= 65 && code <= 90) return fromRange(ranges.upper, code - 65)
  if (ranges.lower !== undefined && code >= 97 && code <= 122) return fromRange(ranges.lower, code - 97)
  if (ranges.digit !== undefined && code >= 48 && code <= 57) return fromRange(ranges.digit, code - 48)
  return char
}

function mapScript(char: string): string {
  if (SCRIPT_GAPS[char]) return SCRIPT_GAPS[char]
  const code = char.codePointAt(0)
  if (code === undefined) return char
  if (code >= 65 && code <= 90) return fromRange(0x1d49c, code - 65)
  if (code >= 97 && code <= 122) return fromRange(0x1d4b6, code - 97)
  return char
}

function mapSmallCaps(char: string): string {
  const code = char.toLowerCase().codePointAt(0)
  if (code === undefined || code < 97 || code > 122) return char
  return [...SMALL_CAP_CHARS][code - 97] ?? char
}

export function applyFontStyle(text: string, style: FontStyle): string {
  if (style === 'strikethrough') {
    return [...text].map((c) => (c === '\n' || c === '\r' ? c : c + STRIKE)).join('')
  }
  if (style === 'smallCaps') return [...text].map(mapSmallCaps).join('')
  if (style === 'script') return [...text].map(mapScript).join('')
  const ranges = STYLE_RANGES[style]
  return [...text].map((char) => mapLatin(char, ranges)).join('')
}

function buildReverseMap(): Map<string, string> {
  const map = new Map<string, string>()
  for (const style of Object.keys(STYLE_RANGES) as RangedStyle[]) {
    const ranges = STYLE_RANGES[style]
    for (let i = 0; i < 26; i++) {
      if (ranges.upper !== undefined) map.set(fromRange(ranges.upper, i), String.fromCharCode(65 + i))
      if (ranges.lower !== undefined) map.set(fromRange(ranges.lower, i), String.fromCharCode(97 + i))
    }
    if (ranges.digit !== undefined) {
      for (let i = 0; i < 10; i++) map.set(fromRange(ranges.digit, i), String.fromCharCode(48 + i))
    }
  }
  for (let i = 0; i < 26; i++) {
    const upper = String.fromCharCode(65 + i)
    const lower = String.fromCharCode(97 + i)
    map.set(mapScript(upper), upper)
    map.set(mapScript(lower), lower)
    map.set([...SMALL_CAP_CHARS][i]!, lower)
  }
  return map
}

const REVERSE = buildReverseMap()

export function normalizeToAscii(text: string): string {
  let result = ''
  for (const char of text) {
    if (char === STRIKE) continue
    result += REVERSE.get(char) ?? char
  }
  return result
}
