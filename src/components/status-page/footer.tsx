import { formatClock } from '@/lib/format'
import { FOOTER_TEXT } from './constants'

export function Footer({
  showPoweredBy,
  footerText,
  nextRefreshAt,
  now,
}: {
  showPoweredBy: boolean
  footerText: string | null
  nextRefreshAt: number
  now: number
}) {
  const hasRefresh = nextRefreshAt > 0
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-surface-sunken">
      <div className="mx-auto max-w-3xl px-4 h-24 flex items-center text-sm text-foreground-muted">
        <div className="grid gap-4 sm:grid-cols-2 w-full">
          <div className="flex flex-col gap-3">
            {footerText ? (
              <p className="leading-relaxed">{footerText}</p>
            ) : null}
            <p
              className="text-sm text-foreground-subtle"
              suppressHydrationWarning
            >
              © {year} bakaptr
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            {hasRefresh ? (
              <p
                suppressHydrationWarning
                className="text-foreground-subtle tabular-nums"
              >
                {FOOTER_TEXT.refreshIn}{' '}
                {formatClock(Math.max(0, (nextRefreshAt - (now ?? 0)) / 1000))}
              </p>
            ) : null}
            {showPoweredBy ? (
              <p className="text-foreground-subtle">
                {FOOTER_TEXT.poweredBy}{' '}
                <a
                  href={FOOTER_TEXT.uptimeKumaUrl}
                  className="text-foreground-muted underline-offset-4 hover:text-foreground hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {FOOTER_TEXT.uptimeKuma}
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
