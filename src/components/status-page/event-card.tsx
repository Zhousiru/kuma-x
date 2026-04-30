import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentType, ReactNode } from 'react'

const eventArticle = cva('flex items-start gap-4 px-5 py-5', {
  variants: {
    variant: {
      resolved: '',
      info: 'rounded-2xl bg-info-bg',
      warning: 'rounded-2xl bg-warning-bg',
      danger: 'rounded-2xl bg-danger-bg',
      neutral: 'rounded-2xl bg-surface-muted',
      dark: 'rounded-2xl bg-surface-sunken',
    },
  },
})

const eventCoin = cva(
  'mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full',
  {
    variants: {
      variant: {
        resolved: 'bg-success text-white',
        info: 'bg-info text-white',
        warning: 'bg-warning text-white',
        danger: 'bg-danger text-white',
        neutral:
          'border border-border-strong bg-surface text-foreground-subtle',
        dark: 'bg-foreground text-background',
      },
    },
  },
)

export type EventCardVariant = NonNullable<
  VariantProps<typeof eventArticle>['variant']
>

export type EventCardProps = {
  Icon: ComponentType<{ className?: string }>
  variant: EventCardVariant
  title: ReactNode
  body?: ReactNode
  meta?: ReactNode
  eyebrow?: ReactNode
}

export function EventCard({
  Icon,
  variant,
  title,
  body,
  meta,
  eyebrow,
}: EventCardProps) {
  return (
    <article className={eventArticle({ variant })}>
      <div aria-hidden className={eventCoin({ variant })}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <div className="mb-0.5 text-xs font-medium uppercase tracking-wide">
            {eyebrow}
          </div>
        ) : null}
        <h3 className="font-semibold text-foreground">{title}</h3>
        {body ? <div className="mt-1">{body}</div> : null}
        {meta ? (
          <div className="mt-2 text-xs text-foreground-subtle">{meta}</div>
        ) : null}
      </div>
    </article>
  )
}
