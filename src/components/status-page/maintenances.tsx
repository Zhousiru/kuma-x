import { CalendarClock, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import type { Maintenance, MaintenanceStatus } from "@/lib/kuma";
import { formatDateTime } from "@/lib/format";
import { MAINTENANCE_LABEL } from "./constants";
import { EventCard } from "./event-card";
import { Markdown } from "./markdown";

type VisibleMaintenanceStatus = Extract<
  MaintenanceStatus,
  "under-maintenance" | "scheduled"
>;

type MaintenanceVisual = {
  Icon: ComponentType<{ className?: string }>;
  label: string;
};

const MAINTENANCE_VISUAL: Record<VisibleMaintenanceStatus, MaintenanceVisual> = {
  "under-maintenance": { Icon: Wrench, label: MAINTENANCE_LABEL.active },
  scheduled: { Icon: CalendarClock, label: MAINTENANCE_LABEL.scheduled },
};

function isVisibleMaintenance(
  maintenance: Maintenance,
): maintenance is Maintenance & { status: VisibleMaintenanceStatus } {
  return maintenance.status in MAINTENANCE_VISUAL;
}

function timezoneSuffix(m: Maintenance): string {
  return [m.timezoneOffset ? `UTC${m.timezoneOffset}` : null, m.timezone]
    .filter(Boolean)
    .join(" · ");
}

export function Maintenances({ list }: { list: Maintenance[] }) {
  const visible = (list ?? []).filter(isVisibleMaintenance);
  if (visible.length === 0) return null;

  return (
    <section className="mb-10 flex flex-col gap-3">
      {visible.map((m) => {
        const visual = MAINTENANCE_VISUAL[m.status];
        const slot = m.timeslotList?.[0];
        const tz = timezoneSuffix(m);
        return (
          <EventCard
            key={m.id}
            Icon={visual.Icon}
            variant="info"
            eyebrow={<span className="text-info-strong">{visual.label}</span>}
            title={m.title}
            body={m.description ? <Markdown source={m.description} /> : null}
            meta={
              slot ? (
                <span className="text-info-strong">
                  {formatDateTime(slot.startDate)} →{" "}
                  {formatDateTime(slot.endDate)}
                  {tz ? ` (${tz})` : ""}
                </span>
              ) : null
            }
          />
        );
      })}
    </section>
  );
}
