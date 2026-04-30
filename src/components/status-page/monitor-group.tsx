'use client'

import { cn } from '@/lib/cn'
import type { Heartbeat, MonitorGroup as MonitorGroupT } from '@/lib/kuma'
import { groupStatus } from '@/lib/status'
import { cva } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { STATUS_LABEL } from './constants'
import { ServiceRow } from './service-row'
import { STATUS_ICON, statusText } from './styles'

const chevron = cva('h-4 w-4 transition-transform duration-300', {
  variants: {
    expanded: {
      true: 'rotate-180 text-foreground-subtle',
      false: 'text-foreground-faint group-hover:text-foreground-subtle',
    },
  },
})

export function MonitorGroup({
  group,
  heartbeatList,
  uptimeList,
  now,
  showTags,
  showCertificateExpiry,
  showOnlyLastHeartbeat,
  isFirst,
}: {
  group: MonitorGroupT
  heartbeatList: Record<string, Heartbeat[]>
  uptimeList: Record<string, number>
  now: number
  showTags: boolean
  showCertificateExpiry: boolean
  showOnlyLastHeartbeat: boolean
  isFirst?: boolean
}) {
  const [expanded, setExpanded] = useState(true)
  const status = groupStatus(group, heartbeatList)
  const StatusIcon = STATUS_ICON[status]
  const statusLabel = STATUS_LABEL[status]

  return (
    <div className={cn(!isFirst && 'border-t border-border')}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="group flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-4 py-5 text-left outline-none transition-colors hover:bg-surface-muted"
      >
        <span className="font-semibold text-foreground">{group.name}</span>
        <div className="flex items-center gap-3">
          <span className={cn('transition-colors', statusText({ status }))}>
            <span className="hidden text-sm font-medium capitalize md:inline">
              {statusLabel}
            </span>
            <StatusIcon
              aria-label={statusLabel}
              className="h-4 w-4 md:hidden"
            />
          </span>
          <ChevronDown className={chevron({ expanded })} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-6 pt-1">
              {group.monitorList.map((monitor) => (
                <ServiceRow
                  key={monitor.id}
                  monitor={monitor}
                  beats={heartbeatList[String(monitor.id)]}
                  uptime={uptimeList[`${monitor.id}_24`]}
                  now={now}
                  showTags={showTags}
                  showCertificateExpiry={showCertificateExpiry}
                  showOnlyLastHeartbeat={showOnlyLastHeartbeat}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
