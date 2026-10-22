import { useRef, useState, type ChangeEvent, type RefObject } from 'react'
import { useEditorShortcuts } from '../hooks/useEditorShortcuts'
import { buildInsertText, type InsertKind, type ShortcutAction } from '../lib/editorActions'
import { clearSelectionStyle, countLinkedInChars, styleSelection, type FontStyle } from '../lib/linkedinFormat'
import { CharMeter } from './CharMeter'
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
  const valueRef = useRef(value)
  const onActionRef = useRef<(action: ShortcutAction) => void>(() => {})
  valueRef.current = value

  const charCount = countLinkedInChars(converted)

  function syncSelection() {
    const el = textareaRef.current
    if (!el) return
    selectionRef.current = { start: el.selectionStart, end: el.selectionEnd }
    setHasSelection(el.selectionStart !== el.selectionEnd)
  }

  function applyRange(start: number, end: number, next: string) {
    onChange(valueRef.current.slice(0, start) + next + valueRef.current.slice(end))
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(start, start + next.length)
      selectionRef.current = { start, end: start + next.length }
      setHasSelection(next.length > 0 && start !== start + next.length)
    })
  }

  function replaceSelection(transform: (selected: string) => string) {
    const { start, end } = selectionRef.current
    if (start === end) return
    applyRange(start, end, transform(valueRef.current.slice(start, end)))
  }

  function insertSnippet(kind: InsertKind) {
    const el = textareaRef.current
    const start = el?.selectionStart ?? selectionRef.current.start
    const end = el?.selectionEnd ?? selectionRef.current.end
    applyRange(start, end, buildInsertText(kind, valueRef.current.slice(start, end)))
  }

  onActionRef.current = (action) => {
    const el = textareaRef.current
    if (el) {
      selectionRef.current = { start: el.selectionStart, end: el.selectionEnd }
      setHasSelection(el.selectionStart !== el.selectionEnd)
    }
    if (action.clear) return replaceSelection(clearSelectionStyle)
    if (action.style) return replaceSelection((s) => styleSelection(s, action.style!))
    if (action.insert) insertSnippet(action.insert)
  }

  useEditorShortcuts({ textareaRef, onActionRef })

  return (
    <section className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--accent-bright)] uppercase">
            Source
          </p>
          <h2 className="mt-0.5 text-xl font-semibold tracking-tight">Editor</h2>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            ⌘B bold · ⌘I italic · ⌘E mono · ⌘⇧H divider · ⌘` code
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
          onInsert={insertSnippet}
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

      <CharMeter charCount={charCount} />
    </section>
  )
}
