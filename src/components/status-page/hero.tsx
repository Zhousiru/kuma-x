import { cva } from 'class-variance-authority'
import { formatDateTime } from '@/lib/format'
import type { HeroStatus } from '@/lib/status'
import { HERO_HEADLINE, HERO_TEXT } from './constants'
import { STATUS_ICON } from './styles'

const heroDot = cva('inline-block h-2.5 w-2.5 rounded-full', {
  variants: {
    status: {
      up: 'bg-success',
      down: 'bg-danger',
      'partial-down': 'bg-danger',
      maintenance: 'bg-info',
    },
  },
})

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

const heroBar = cva('h-6 w-1 flex-none rounded-full', {
  variants: {
    status: {
      up: 'bg-success',
      down: 'bg-danger',
      'partial-down': 'bg-danger',
      maintenance: 'bg-info',
    },
  },
})

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
      <div className="mb-6 flex items-center gap-3">
        <span aria-hidden className={heroBar({ status })} />
        <span className="text-lg font-bold uppercase tracking-widest text-foreground">
          {title}
        </span>
      </div>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-4xl font-semibold leading-none tracking-tight text-foreground md:text-5xl">
            {HERO_HEADLINE[status]}
            <span aria-hidden className={heroDot({ status })} />
          </h1>
          {summary ? (
            <p className="mt-5 max-w-xl leading-relaxed text-foreground-muted">
              {summary}
            </p>
          ) : null}
          {lastUpdatedAt > 0 ? (
            <p
              suppressHydrationWarning
              className="mt-2 text-xs text-foreground-subtle"
            >
              {HERO_TEXT.lastUpdated}{' '}
              {formatDateTime(new Date(lastUpdatedAt).toISOString())}
            </p>
          ) : null}
        </div>
        <div aria-hidden className={heroCoin({ status })}>
          <Icon className="h-9 w-9" />
        </div>
      </div>
    </section>
  )
}
