import { STATES } from './constants'

export function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="mb-12 mt-10 md:mb-16 md:mt-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-6 w-1 flex-none animate-pulse rounded-full bg-surface-sunken" />
            <div className="h-5 w-24 animate-pulse rounded bg-surface-sunken" />
          </div>
          <div className="h-12 w-3/4 animate-pulse rounded-md bg-surface-sunken" />
          <div className="mt-4 h-4 w-2/5 animate-pulse rounded bg-surface-sunken" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border-t border-border px-4 py-6 first:border-t-0"
            >
              <div className="h-4 w-1/3 animate-pulse rounded bg-surface-sunken" />
              <div className="mt-4 h-[30px] w-full animate-pulse rounded bg-surface-sunken" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ErrorState() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center text-foreground-subtle">
      <p>{STATES.error}</p>
    </div>
  )
}
