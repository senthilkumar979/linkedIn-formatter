import { describe, expect, it } from 'vitest'
import { buildInsertText, HORIZONTAL_RULE, matchShortcut } from './editorActions'

describe('buildInsertText', () => {
  it('inserts a horizontal rule block', () => {
    expect(buildInsertText('horizontalRule', '')).toContain(HORIZONTAL_RULE)
  })

  it('wraps selection in markdown code', () => {
    expect(buildInsertText('code', 'useAsyncSelect')).toBe('`useAsyncSelect`')
  })

  it('prefixes bullets and checks', () => {
    expect(buildInsertText('bullet', 'Item')).toBe('• Item')
    expect(buildInsertText('check', '')).toBe('✅ ')
  })
})

describe('matchShortcut', () => {
  it('matches bold with meta+b', () => {
    const event = new KeyboardEvent('keydown', { key: 'b', metaKey: true })
    expect(matchShortcut(event)?.style).toBe('bold')
  })

  it('matches strike with ctrl+shift+x', () => {
    const event = new KeyboardEvent('keydown', { key: 'x', ctrlKey: true, shiftKey: true })
    expect(matchShortcut(event)?.style).toBe('strikethrough')
  })

  it('matches divider insert', () => {
    const event = new KeyboardEvent('keydown', { key: 'h', metaKey: true, shiftKey: true })
    expect(matchShortcut(event)?.insert).toBe('horizontalRule')
  })

  it('ignores keys without mod', () => {
    const event = new KeyboardEvent('keydown', { key: 'b' })
    expect(matchShortcut(event)).toBeNull()
  })
})
