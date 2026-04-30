import type {
  Heartbeat,
  HeartbeatStatus,
  MonitorGroup,
} from "@/lib/kuma/types";
import { latestHeartbeat } from "./heartbeat";

export type BeatStatus = "up" | "down" | "pending" | "maintenance" | "unknown";
export type DerivedStatus = BeatStatus | "partial-down";
export type HeroStatus = "up" | "down" | "partial-down" | "maintenance";

export function toHeroStatus(status: DerivedStatus): HeroStatus {
  if (status === "pending" || status === "unknown") return "up";
  return status;
}

const STATUS_FROM_HEARTBEAT: Record<HeartbeatStatus, BeatStatus> = {
  0: "down",
  1: "up",
  2: "pending",
  3: "maintenance",
};

export function statusFromBeat(beat: Heartbeat): BeatStatus {
  return STATUS_FROM_HEARTBEAT[beat.status] ?? "unknown";
}

export function lastStatus(beats: Heartbeat[] | undefined): BeatStatus {
  const latest = latestHeartbeat(beats);
  return latest ? statusFromBeat(latest) : "unknown";
}

function aggregate(statuses: BeatStatus[]): DerivedStatus {
  if (statuses.length === 0) return "unknown";
  const downCount = statuses.filter((s) => s === "down").length;
  if (downCount === statuses.length) return "down";
  if (downCount > 0) return "partial-down";
  if (statuses.includes("maintenance")) return "maintenance";
  if (statuses.includes("pending")) return "pending";
  if (statuses.every((s) => s === "up")) return "up";
  return "unknown";
}

export function groupStatus(
  group: MonitorGroup,
  beats: Record<string, Heartbeat[]>,
): DerivedStatus {
  return aggregate(
    group.monitorList.map((m) => lastStatus(beats[String(m.id)])),
  );
}

export function overallStatus(
  groups: MonitorGroup[],
  beats: Record<string, Heartbeat[]>,
): DerivedStatus {
  return aggregate(
    groups.flatMap((g) =>
      g.monitorList.map((m) => lastStatus(beats[String(m.id)])),
    ),
  );
}
