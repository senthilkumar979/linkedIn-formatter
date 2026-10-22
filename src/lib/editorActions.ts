import type { FontStyle } from './unicodeMaps'

export const HORIZONTAL_RULE = '──────────────────'

export type InsertKind = 'horizontalRule' | 'bullet' | 'check' | 'arrow' | 'code'

export interface ShortcutAction {
  style?: FontStyle
  insert?: InsertKind
  clear?: boolean
  label: string
}

/** Map mod-key combos to editor actions. `mod` = Cmd on Mac, Ctrl elsewhere. */
export const SHORTCUTS: Array<{
  key: string
  shift?: boolean
  action: ShortcutAction
}> = [
  { key: 'b', action: { style: 'bold', label: 'Bold' } },
  { key: 'i', action: { style: 'italic', label: 'Italic' } },
  { key: 'e', action: { style: 'monospace', label: 'Mono' } },
  { key: 'x', shift: true, action: { style: 'strikethrough', label: 'Strike' } },
  { key: 'b', shift: true, action: { style: 'boldItalic', label: 'Bold Italic' } },
  { key: '\\', action: { clear: true, label: 'Clear style' } },
  { key: 'h', shift: true, action: { insert: 'horizontalRule', label: 'Divider' } },
  { key: 'l', shift: true, action: { insert: 'bullet', label: 'Bullet' } },
  { key: 'k', shift: true, action: { insert: 'check', label: 'Check' } },
  { key: '`', action: { insert: 'code', label: 'Code' } },
]

export function buildInsertText(kind: InsertKind, selected: string): string {
  switch (kind) {
    case 'horizontalRule':
      return `\n\n${HORIZONTAL_RULE}\n\n`
    case 'bullet':
      return selected ? `• ${selected}` : '• '
    case 'check':
      return selected ? `✅ ${selected}` : '✅ '
    case 'arrow':
      return selected ? `→ ${selected}` : '→ '
    case 'code':
      return selected ? `\`${selected}\`` : '`code`'
  }
}

export function matchShortcut(
  event: KeyboardEvent,
): ShortcutAction | null {
  const mod = event.metaKey || event.ctrlKey
  if (!mod) return null

  const key = event.key.toLowerCase()
  const shift = event.shiftKey

  for (const shortcut of SHORTCUTS) {
    if (shortcut.key !== key) continue
    if (Boolean(shortcut.shift) !== shift) continue
    return shortcut.action
  }
  return null
}
