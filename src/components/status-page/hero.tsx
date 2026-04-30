import { formatDateTime } from '@/lib/format'
import type { HeroStatus } from '@/lib/status'
import { cva } from 'class-variance-authority'
import { ClientOnly } from './client-only'
import { HERO_HEADLINE, HERO_TEXT } from './constants'
import { STATUS_ICON } from './styles'

const heroCoin = cva(
  'hidden h-20 w-20 flex-none items-center justify-center rounded-full md:flex',
  {
    variants: {
      status: {
        up: 'bg-success text-white',
        down: 'bg-danger text-white',
        'partial-down': 'bg-danger text-white',
        maintenance: 'bg-info text-white',
      },
    },
  },
)

export function Hero({
  title,
  status,
  description,
  lastUpdatedAt,
}: {
  title: string
  status: HeroStatus
  description: string | null
  lastUpdatedAt: number
}) {
  const Icon = STATUS_ICON[status]
  const summary = description?.trim()

  return (
    <section className="mb-12 mt-10 md:mb-16 md:mt-16">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-lg font-bold text-foreground">{title}</span>
      </div>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-4xl font-semibold leading-none tracking-tight text-foreground md:text-5xl">
            {HERO_HEADLINE[status]}
          </h1>
          {summary ? (
            <p className="mt-4 max-w-xl leading-relaxed text-foreground-muted">
              {summary}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-foreground-subtle">
            <ClientOnly>
              {lastUpdatedAt > 0
                ? `${HERO_TEXT.lastUpdated} ${formatDateTime(new Date(lastUpdatedAt).toISOString())}`
                : ' '}
            </ClientOnly>
          </p>
        </div>
        <div aria-hidden className={heroCoin({ status })}>
          <Icon className="h-9 w-9" />
        </div>
      </div>
    </section>
  )
}
