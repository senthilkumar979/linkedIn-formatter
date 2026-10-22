import type { FontStyle } from '../lib/linkedinFormat'

interface FormatToolbarProps {
  onStyle: (style: FontStyle) => void
  onClearStyle: () => void
  hasSelection: boolean
}

const STYLES: Array<{ id: FontStyle; label: string; sample: string }> = [
  { id: 'bold', label: 'Bold', sample: '𝗕' },
  { id: 'italic', label: 'Italic', sample: '𝘐' },
  { id: 'boldItalic', label: 'Bold Italic', sample: '𝘽' },
  { id: 'monospace', label: 'Mono', sample: '𝙼' },
  { id: 'script', label: 'Script', sample: '𝒮' },
  { id: 'smallCaps', label: 'Caps', sample: 'ꜱᴄ' },
  { id: 'strikethrough', label: 'Strike', sample: 'S̶' },
]

export const FormatToolbar = ({ onStyle, onClearStyle, hasSelection }: FormatToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Text styles">
      {STYLES.map((style) => (
        <button
          key={style.id}
          type="button"
          title={hasSelection ? `Apply ${style.label}` : 'Select text first'}
          disabled={!hasSelection}
          onClick={() => onStyle(style.id)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]/90 px-2.5 text-xs font-medium text-[var(--text)] transition enabled:hover:border-[var(--accent)] enabled:hover:bg-[var(--accent-soft)] enabled:hover:text-[var(--accent-bright)] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="text-[13px] leading-none" aria-hidden>
            {style.sample}
          </span>
          <span className="hidden lg:inline">{style.label}</span>
        </button>
      ))}
      <button
        type="button"
        title={hasSelection ? 'Clear style' : 'Select text first'}
        disabled={!hasSelection}
        onClick={onClearStyle}
        className="inline-flex h-9 items-center rounded-lg border border-dashed border-[var(--border)] px-2.5 text-xs font-medium text-[var(--text-muted)] transition enabled:hover:border-[var(--border-strong)] enabled:hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-35"
      >
        Clear
      </button>
    </div>
  )
}
