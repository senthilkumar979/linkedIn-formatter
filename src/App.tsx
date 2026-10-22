import { useRef, useState } from 'react'
import { EditorPane } from './components/EditorPane'
import { LinkedInPreview } from './components/LinkedInPreview'
import { markdownToLinkedIn } from './lib/linkedinFormat'
import { SAMPLE_POST } from './lib/samplePost'

export const App = () => {
  const [source, setSource] = useState(SAMPLE_POST)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const converted = markdownToLinkedIn(source)

  async function handleCopy() {
    if (!converted) return
    await navigator.clipboard.writeText(converted)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col px-4 pb-24 pt-8 md:px-8 md:pb-10 md:pt-10">
      <header className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="flex items-center gap-3 text-[var(--text)]">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-semibold tracking-wide text-white md:h-11 md:w-11"
              aria-hidden
            >
              Pf
            </span>
            <span className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">PostForm</span>
          </h1>
          <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-[var(--text-muted)] md:text-base">
            Free LinkedIn text formatter — turn ChatGPT or Gemini Markdown into bold, italic, and
            mono that pastes cleanly into LinkedIn.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!converted}
          className={`copy-btn hidden h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45 md:inline-flex ${copied ? 'copy-btn-success' : ''}`}
        >
          {copied ? (
            <>
              <span aria-hidden>✓</span>
              Copied — paste into LinkedIn
            </>
          ) : (
            'Copy for LinkedIn'
          )}
        </button>
      </header>

      <main className="grid min-h-0 flex-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <EditorPane
          value={source}
          converted={converted}
          onChange={setSource}
          onLoadSample={() => setSource(SAMPLE_POST)}
          onClear={() => setSource('')}
          textareaRef={textareaRef}
        />
        <LinkedInPreview converted={converted} />
      </main>

      <footer className="mt-8 hidden text-center text-xs text-[var(--text-muted)] md:block">
        Runs entirely in your browser · Paragraph gaps preserved for LinkedIn · UTF-16 character
        limit
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--border)] bg-[var(--bg)]/90 p-3 backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!converted}
          className={`copy-btn flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold text-white disabled:opacity-45 ${copied ? 'copy-btn-success' : ''}`}
        >
          {copied ? 'Copied ✓' : 'Copy for LinkedIn'}
        </button>
      </div>
    </div>
  )
}
