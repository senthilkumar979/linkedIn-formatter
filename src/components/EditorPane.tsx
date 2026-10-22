import { useRef, useState, type ChangeEvent, type RefObject } from 'react'
import {
  clearSelectionStyle,
  countLinkedInChars,
  LINKEDIN_CHAR_LIMIT,
  styleSelection,
  type FontStyle,
} from '../lib/linkedinFormat'
import { FormatToolbar } from './FormatToolbar'

interface EditorPaneProps {
  value: string
  converted: string
  onChange: (value: string) => void
  onLoadSample: () => void
  onClear: () => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
}

export const EditorPane = ({
  value,
  converted,
  onChange,
  onLoadSample,
  onClear,
  textareaRef,
}: EditorPaneProps) => {
  const [hasSelection, setHasSelection] = useState(false)
  const selectionRef = useRef({ start: 0, end: 0 })

  const charCount = countLinkedInChars(converted)
  const progress = Math.min(100, (charCount / LINKEDIN_CHAR_LIMIT) * 100)
  const isNearLimit = charCount >= LINKEDIN_CHAR_LIMIT * 0.9
  const isOver = charCount > LINKEDIN_CHAR_LIMIT

  function syncSelection() {
    const el = textareaRef.current
    if (!el) return
    selectionRef.current = { start: el.selectionStart, end: el.selectionEnd }
    setHasSelection(el.selectionStart !== el.selectionEnd)
  }

  function replaceSelection(transform: (selected: string) => string) {
    const el = textareaRef.current
    if (!el) return
    const { start, end } = selectionRef.current
    if (start === end) return

    const nextSelected = transform(value.slice(start, end))
    onChange(value.slice(0, start) + nextSelected + value.slice(end))

    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start, start + nextSelected.length)
      selectionRef.current = { start, end: start + nextSelected.length }
      setHasSelection(true)
    })
  }

  return (
    <section className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--accent-bright)] uppercase">
            Source
          </p>
          <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            Editor
          </h2>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Paste Markdown · select text to restyle
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)]"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text)]"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="border-b border-[var(--border)] px-4 py-3">
        <FormatToolbar
          hasSelection={hasSelection}
          onStyle={(style: FontStyle) => replaceSelection((s) => styleSelection(s, style))}
          onClearStyle={() => replaceSelection(clearSelectionStyle)}
        />
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        onSelect={syncSelection}
        onKeyUp={syncSelection}
        onMouseUp={syncSelection}
        spellCheck={false}
        placeholder="Paste your LinkedIn post draft here…"
        className="min-h-[300px] flex-1 resize-none bg-transparent px-5 py-4 font-[family-name:var(--font-mono)] text-[13px] leading-7 text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]/50 md:min-h-[420px]"
      />

      <div className="space-y-2 border-t border-[var(--border)] px-5 py-3">
        <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: isOver
                ? 'var(--danger)'
                : isNearLimit
                  ? 'var(--warn)'
                  : 'linear-gradient(90deg, var(--accent), var(--teal))',
            }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">Blank lines kept for LinkedIn paste</span>
          <span
            className={
              isOver
                ? 'font-semibold text-[var(--danger)]'
                : isNearLimit
                  ? 'font-semibold text-[var(--warn)]'
                  : 'font-medium text-[var(--text-muted)]'
            }
          >
            {charCount.toLocaleString()} / {LINKEDIN_CHAR_LIMIT.toLocaleString()}
          </span>
        </div>
      </div>
    </section>
  )
}
