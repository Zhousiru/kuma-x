"use client";

import { useMemo } from "react";
import type { Incident } from "@/lib/kuma";
import { dayKey, formatDayHeading } from "@/lib/format";
import { ClientOnly } from "./client-only";
import { SECTION_TITLE } from "./constants";
import { IncidentCard } from "./incident-card";

export function PastIncidents({
  incidents,
  now,
}: {
  incidents: Incident[];
  now: number;
}) {
  const grouped = useMemo(() => {
    const byDay = new Map<string, Incident[]>();
    for (const i of incidents) {
      const k = dayKey(i.createdDate);
      const arr = byDay.get(k);
      if (arr) arr.push(i);
      else byDay.set(k, [i]);
    }
    return Array.from(byDay.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [incidents]);

  if (grouped.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
        {SECTION_TITLE.pastIncidents}
      </h2>
      <div className="flex flex-col gap-6">
        {grouped.map(([day, items]) => (
          <div key={day} className="flex flex-col">
            <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground-subtle">
              <ClientOnly>{formatDayHeading(day)}</ClientOnly>
            </h3>
            {items.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                now={now}
                variant="past"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
