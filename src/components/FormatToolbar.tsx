import type { FontStyle } from '../lib/linkedinFormat'
import type { InsertKind } from '../lib/editorActions'

interface FormatToolbarProps {
  onStyle: (style: FontStyle) => void
  onClearStyle: () => void
  onInsert: (kind: InsertKind) => void
  hasSelection: boolean
}

const STYLES: Array<{ id: FontStyle; label: string; sample: string; hint: string }> = [
  { id: 'bold', label: 'Bold', sample: '𝗕', hint: '⌘B' },
  { id: 'italic', label: 'Italic', sample: '𝘐', hint: '⌘I' },
  { id: 'boldItalic', label: 'Bold Italic', sample: '𝘽', hint: '⌘⇧B' },
  { id: 'monospace', label: 'Mono', sample: '𝙼', hint: '⌘E' },
  { id: 'script', label: 'Script', sample: '𝒮', hint: '' },
  { id: 'smallCaps', label: 'Caps', sample: 'ꜱᴄ', hint: '' },
  { id: 'strikethrough', label: 'Strike', sample: 'S̶', hint: '⌘⇧X' },
]

const INSERTS: Array<{ id: InsertKind; label: string; sample: string; hint: string }> = [
  { id: 'horizontalRule', label: 'Divider', sample: '─', hint: '⌘⇧H' },
  { id: 'code', label: 'Code', sample: '</>', hint: '⌘`' },
  { id: 'bullet', label: 'Bullet', sample: '•', hint: '⌘⇧L' },
  { id: 'check', label: 'Check', sample: '✅', hint: '⌘⇧K' },
  { id: 'arrow', label: 'Arrow', sample: '→', hint: '' },
]

const btnClass =
  'inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/90 px-2.5 text-xs font-medium text-[var(--text)] transition enabled:hover:border-[var(--accent)] enabled:hover:bg-[var(--accent-soft)] enabled:hover:text-[var(--accent-bright)] disabled:cursor-not-allowed disabled:opacity-35'

export const FormatToolbar = ({
  onStyle,
  onClearStyle,
  onInsert,
  hasSelection,
}: FormatToolbarProps) => {
  return (
    <div className="flex flex-col gap-2" role="toolbar" aria-label="Formatting">
      <div className="flex flex-wrap items-center gap-1.5">
        {STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            title={
              hasSelection
                ? `${style.label}${style.hint ? ` (${style.hint})` : ''}`
                : 'Select text first'
            }
            disabled={!hasSelection}
            onClick={() => onStyle(style.id)}
            className={btnClass}
          >
            <span className="text-[13px] leading-none" aria-hidden>
              {style.sample}
            </span>
            <span className="hidden lg:inline">{style.label}</span>
          </button>
        ))}
        <button
          type="button"
          title={hasSelection ? 'Clear style (⌘\\)' : 'Select text first'}
          disabled={!hasSelection}
          onClick={onClearStyle}
          className="inline-flex h-9 items-center rounded-lg border border-dashed border-[var(--border)] px-2.5 text-xs font-medium text-[var(--text-muted)] transition enabled:hover:border-[var(--border-strong)] enabled:hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-35"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[10px] font-semibold tracking-[0.12em] text-[var(--text-muted)] uppercase">
          Insert
        </span>
        {INSERTS.map((item) => (
          <button
            key={item.id}
            type="button"
            title={`${item.label}${item.hint ? ` (${item.hint})` : ''}`}
            onClick={() => onInsert(item.id)}
            className={btnClass}
          >
            <span className="text-[13px] leading-none" aria-hidden>
              {item.sample}
            </span>
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
