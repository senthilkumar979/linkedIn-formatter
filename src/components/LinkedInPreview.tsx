import { useEffect, useState } from 'react'
import { truncateForPreview } from '../lib/linkedinFormat'

interface LinkedInPreviewProps {
  converted: string
}

export const LinkedInPreview = ({ converted }: LinkedInPreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [fadeKey, setFadeKey] = useState(0)

  useEffect(() => {
    setIsExpanded(false)
    setFadeKey((key) => key + 1)
  }, [converted])

  const { visible, isTruncated } = truncateForPreview(converted)
  const body = isExpanded || !isTruncated ? converted : visible

  return (
    <section className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--teal)] uppercase">
          Live preview
        </p>
        <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          LinkedIn feed
        </h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Matches spacing and styles after you paste
        </p>
      </div>

      <div
        className="min-h-[300px] flex-1 overflow-auto p-4 md:min-h-[420px] md:p-6"
        style={{
          background:
            'linear-gradient(160deg, #dfe3e8 0%, var(--preview-bg) 45%, #ddd9d2 100%)',
        }}
      >
        <article className="mx-auto max-w-xl overflow-hidden rounded-xl bg-[var(--preview-card)] shadow-[0_8px_30px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.8)_inset]">
          <header className="flex items-start gap-3 px-4 pt-4 pb-2">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] text-sm font-bold text-white shadow-md"
              aria-hidden
            >
              You
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-[var(--preview-text)]">You</p>
                <span className="text-xs text-[var(--preview-muted)]">· 1st</span>
              </div>
              <p className="truncate text-xs text-[var(--preview-muted)]">
                Building tools for developers
              </p>
              <p className="mt-0.5 text-xs text-[var(--preview-muted)]">Just now · 🌐</p>
            </div>
          </header>

          <div
            key={fadeKey}
            className="preview-fade px-4 pb-4 text-[15px] leading-[1.55] break-words whitespace-pre-wrap text-[var(--preview-text)]"
          >
            {body || (
              <span className="text-[var(--preview-muted)]">
                Your formatted post will appear here…
              </span>
            )}
            {!isExpanded && isTruncated && (
              <>
                {' '}
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="inline text-[15px] font-semibold text-[var(--preview-muted)] hover:text-[var(--preview-link)] hover:underline"
                >
                  …more
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[#e8e8e8] px-4 py-2.5 text-xs text-[var(--preview-muted)]">
            <span>👍 ❤️ 🎉</span>
            <span>0 comments · 0 reposts</span>
          </div>
          <div className="grid grid-cols-4 border-t border-[#e8e8e8] text-xs font-semibold text-[var(--preview-muted)]">
            {['Like', 'Comment', 'Repost', 'Send'].map((label) => (
              <div key={label} className="py-3 text-center">
                {label}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
