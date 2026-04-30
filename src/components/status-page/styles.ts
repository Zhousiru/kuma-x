import { cva } from 'class-variance-authority'
import { Check, CircleAlert, CircleHelp, Clock, Wrench } from 'lucide-react'
import type { ComponentType } from 'react'
import type { DerivedStatus } from '@/lib/status'

export const statusDot = cva('', {
  variants: {
    status: {
      up: 'bg-success',
      down: 'bg-danger',
      'partial-down': 'bg-danger',
      pending: 'bg-warning',
      maintenance: 'bg-info',
      unknown: 'bg-foreground-faint',
    },
  },
})

export const statusText = cva('', {
  variants: {
    status: {
      up: 'text-success-strong',
      down: 'text-danger-strong',
      'partial-down': 'text-danger-strong',
      pending: 'text-warning-strong',
      maintenance: 'text-info-strong',
      unknown: 'text-foreground-subtle',
    },
  },
})

export const STATUS_ICON: Record<
  DerivedStatus,
  ComponentType<{ className?: string }>
> = {
  up: Check,
  down: CircleAlert,
  'partial-down': CircleAlert,
  pending: Clock,
  maintenance: Wrench,
  unknown: CircleHelp,
}
