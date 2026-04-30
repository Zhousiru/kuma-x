import type { DerivedStatus, HeroStatus } from '@/lib/status'

export const STATUS_LABEL: Record<DerivedStatus, string> = {
  up: 'Operational',
  down: 'Outage',
  'partial-down': 'Partial Outage',
  pending: 'Pending',
  maintenance: 'Maintenance',
  unknown: 'Unknown',
}

export const HERO_HEADLINE: Record<HeroStatus, string> = {
  up: 'All systems operational',
  down: 'Service outage',
  'partial-down': 'Partial service outage',
  maintenance: 'Maintenance in progress',
}

export const MAINTENANCE_LABEL = {
  active: 'In progress',
  scheduled: 'Scheduled',
} as const

export const SECTION_TITLE = {
  systemStatus: 'System status',
  activeIncidents: 'Active incidents',
  pastIncidents: 'Past incidents',
} as const

export const HERO_TEXT = {
  lastUpdated: 'Last updated',
} as const

export const FOOTER_TEXT = {
  poweredBy: 'Powered by',
  uptimeKuma: 'Uptime Kuma',
  uptimeKumaUrl: 'https://github.com/louislam/uptime-kuma',
  refreshIn: 'Refresh in',
} as const

export const HOVER_PILL = {
  uptimeSuffix: 'Uptime',
} as const

export const CERT_PILL = {
  bad: 'Invalid cert',
  prefix: 'Cert',
} as const

export const PAST_INCIDENT = {
  created: 'Created',
  updated: 'Updated',
} as const

export const PLACEHOLDER = {
  none: '—',
} as const

export const STATES = {
  error: 'Status page is unavailable right now.',
} as const
