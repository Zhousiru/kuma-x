'use client'

import { overallStatus, toHeroStatus } from '@/lib/status'
import { SECTION_TITLE } from './constants'
import { Footer } from './footer'
import { Hero } from './hero'
import { useNowTick, useStatusPageData } from './hooks'
import { Incidents } from './incidents'
import { Maintenances } from './maintenances'
import { MonitorGroup } from './monitor-group'
import { PastIncidents } from './past-incidents'
import { ErrorState, PageSkeleton } from './states'

export function StatusPageView({ slug }: { slug: string }) {
  const { page, beats, history, lastUpdatedAt, nextRefreshAt } =
    useStatusPageData(slug)
  const now = useNowTick(1000)

  if (page.isPending) return <PageSkeleton />
  if (page.isError || !page.data) return <ErrorState />

  const { config, incidents, maintenanceList, publicGroupList } = page.data
  const heartbeatList = beats.data?.heartbeatList ?? {}
  const uptimeList = beats.data?.uptimeList ?? {}
  const overall = overallStatus(publicGroupList, heartbeatList)
  const activeIncidents = (incidents ?? []).filter((i) => i.active !== false)
  const pastIncidents = (history.data?.incidents ?? []).filter(
    (i) => i.active === false,
  )

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-12 md:pb-24 md:pt-20">
        <Hero
          title={config.title}
          status={toHeroStatus(overall)}
          description={config.description}
          lastUpdatedAt={lastUpdatedAt}
        />

        <Incidents incidents={activeIncidents} now={now} />
        <Maintenances list={maintenanceList} />

        <section className="mb-10">
          <h2 className="sr-only">{SECTION_TITLE.systemStatus}</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {publicGroupList.map((group, i) => (
              <MonitorGroup
                key={group.id}
                group={group}
                heartbeatList={heartbeatList}
                uptimeList={uptimeList}
                now={now}
                showTags={config.showTags}
                showCertificateExpiry={config.showCertificateExpiry}
                showOnlyLastHeartbeat={config.showOnlyLastHeartbeat}
                isFirst={i === 0}
              />
            ))}
          </div>
        </section>

        <PastIncidents incidents={pastIncidents} now={now} />
      </main>

      <Footer
        showPoweredBy={config.showPoweredBy}
        footerText={config.footerText}
        nextRefreshAt={nextRefreshAt}
        now={now}
      />
    </div>
  )
}
