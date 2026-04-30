import type { Incident } from "@/lib/kuma";
import { IncidentCard } from "./incident-card";

export function Incidents({
  incidents,
  now,
}: {
  incidents: Incident[];
  now: number;
}) {
  if (!incidents || incidents.length === 0) return null;
  return (
    <section className="mb-10 flex flex-col gap-3">
      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          now={now}
          variant="active"
        />
      ))}
    </section>
  );
}
