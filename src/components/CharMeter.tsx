import { LINKEDIN_CHAR_LIMIT } from '../lib/linkedinFormat'

interface CharMeterProps {
  charCount: number
}

export const CharMeter = ({ charCount }: CharMeterProps) => {
  const progress = Math.min(100, (charCount / LINKEDIN_CHAR_LIMIT) * 100)
  const isNearLimit = charCount >= LINKEDIN_CHAR_LIMIT * 0.9
  const isOver = charCount > LINKEDIN_CHAR_LIMIT

  return (
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
  )
}
