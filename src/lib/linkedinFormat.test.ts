import { describe, expect, it } from 'vitest'
import {
  clearSelectionStyle,
  countLinkedInChars,
  LINE_SPACER,
  markdownToLinkedIn,
  preserveBlankLines,
  styleSelection,
  truncateForPreview,
} from './linkedinFormat'
import { SAMPLE_POST } from './samplePost'

describe('markdownToLinkedIn', () => {
  it('converts bold markdown to unicode bold', () => {
    const result = markdownToLinkedIn('Hello **world**')
    expect(result).toBe('Hello 𝘄𝗼𝗿𝗹𝗱')
    expect(result).not.toContain('**')
  })

  it('converts inline code to monospace', () => {
    const result = markdownToLinkedIn('Use `useAsyncSelect` today')
    expect(result).not.toContain('`')
    expect(result).toContain('𝚞𝚜𝚎𝙰𝚜𝚢𝚗𝚌𝚂𝚎𝚕𝚎𝚌𝚝')
  })

  it('converts italic markdown', () => {
    expect(markdownToLinkedIn('say *hello*')).toBe('say 𝘩𝘦𝘭𝘭𝘰')
  })

  it('leaves urls and hashtags plain', () => {
    const input =
      'See https://www.npmjs.com/package/usethishook\n\n#ReactJS #TypeScript'
    const result = markdownToLinkedIn(input)
    expect(result).toContain('https://www.npmjs.com/package/usethishook')
    expect(result).toContain('#ReactJS')
    expect(result).toContain('#TypeScript')
  })

  it('preserves blank lines so LinkedIn does not collapse paragraphs', () => {
    const result = markdownToLinkedIn('Line one\n\nLine two')
    expect(result).toBe(`Line one\n${LINE_SPACER}\nLine two`)
  })

  it('formats the sample AI post without leftover markdown markers', () => {
    const result = markdownToLinkedIn(SAMPLE_POST)
    expect(result).not.toContain('**')
    expect(result).not.toContain('`')
    expect(result).toContain('𝚞𝚜𝚎𝙰𝚜𝚢𝚗𝚌𝚂𝚎𝚕𝚎𝚌𝚝')
    expect(result).toContain('𝘂𝘀𝗲𝗧𝗵𝗶𝘀𝗛𝗼𝗼𝗸')
    expect(result).toContain('https://usethishook.mentorbridge.in/useAsyncSelect')
    expect(result).toContain('#useThisHook')
    expect(result).toContain('✅')
    expect(result.split('\n').some((line) => line === LINE_SPACER)).toBe(true)
  })
})

describe('preserveBlankLines', () => {
  it('puts a braille spacer on empty lines', () => {
    expect(preserveBlankLines('a\n\nb')).toBe(`a\n${LINE_SPACER}\nb`)
  })
})

describe('styleSelection', () => {
  it('applies bold to a plain selection', () => {
    expect(styleSelection('React', 'bold')).toBe('𝗥𝗲𝗮𝗰𝘁')
  })

  it('normalizes then re-styles already styled text', () => {
    expect(styleSelection('𝗥𝗲𝗮𝗰𝘁', 'italic')).toBe('𝘙𝘦𝘢𝘤𝘵')
  })
})

describe('clearSelectionStyle', () => {
  it('strips unicode styling back to ascii', () => {
    expect(clearSelectionStyle('𝗥𝗲𝗮𝗰𝘁')).toBe('React')
  })
})

describe('countLinkedInChars', () => {
  it('counts utf-16 units so bold letters cost two', () => {
    expect(countLinkedInChars('Hello')).toBe(5)
    expect(countLinkedInChars('𝗛𝗲𝗹𝗹𝗼')).toBe(10)
  })
})

describe('truncateForPreview', () => {
  it('does not truncate short text', () => {
    expect(truncateForPreview('Short')).toEqual({
      visible: 'Short',
      isTruncated: false,
    })
  })

  it('truncates long text near a word boundary', () => {
    const long = 'a'.repeat(100) + ' ' + 'b'.repeat(150)
    const { visible, isTruncated } = truncateForPreview(long, 210)
    expect(isTruncated).toBe(true)
    expect(visible.length).toBeLessThanOrEqual(210)
  })
})
