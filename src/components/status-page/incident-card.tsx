import {
  AlertTriangle,
  Check,
  CircleAlert,
  Info,
  Megaphone,
} from "lucide-react";
import type { ComponentType } from "react";
import type { Incident, IncidentStyle } from "@/lib/kuma";
import { formatDateTime, formatRelative } from "@/lib/format";
import { ClientOnly } from "./client-only";
import { PAST_INCIDENT } from "./constants";
import { EventCard, type EventCardVariant } from "./event-card";
import { Markdown } from "./markdown";

type Variant = "active" | "past";

type IncidentVisual = {
  Icon: ComponentType<{ className?: string }>;
  variant: EventCardVariant;
};

const ACTIVE_VISUAL: Record<IncidentStyle, IncidentVisual> = {
  info: { Icon: Info, variant: "info" },
  primary: { Icon: Megaphone, variant: "info" },
  warning: { Icon: AlertTriangle, variant: "warning" },
  danger: { Icon: CircleAlert, variant: "danger" },
  light: { Icon: Info, variant: "neutral" },
  dark: { Icon: Megaphone, variant: "dark" },
};

const PAST_VISUAL: IncidentVisual = {
  Icon: Check,
  variant: "resolved",
};

export function IncidentCard({
  incident,
  now,
  variant,
}: {
  incident: Incident;
  now: number;
  variant: Variant;
}) {
  const visual =
    variant === "past"
      ? PAST_VISUAL
      : (ACTIVE_VISUAL[incident.style] ?? ACTIVE_VISUAL.info);
  const ts = incident.lastUpdatedDate ?? incident.createdDate;

  const meta =
    variant === "active" ? (
      <time dateTime={ts} suppressHydrationWarning>
        {formatRelative(ts, now)}
      </time>
    ) : (
      <span className="flex flex-wrap gap-x-4 gap-y-0.5">
        <span>
          {PAST_INCIDENT.created}:{" "}
          <ClientOnly>{formatDateTime(incident.createdDate)}</ClientOnly>
        </span>
        {incident.lastUpdatedDate ? (
          <span>
            {PAST_INCIDENT.updated}:{" "}
            <ClientOnly>
              {formatDateTime(incident.lastUpdatedDate)}
            </ClientOnly>
          </span>
        ) : null}
      </span>
    );

  return (
    <EventCard
      Icon={visual.Icon}
      variant={visual.variant}
      title={incident.title}
      body={incident.content ? <Markdown source={incident.content} /> : null}
      meta={meta}
    />
  );
}
