import type { Heartbeat } from "@/lib/kuma/types";
import { parseKumaDate } from "./format";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const LAST_BEAT_NOW_TOLERANCE_MS = 2 * MINUTE;

export function orderHeartbeats(beats: Heartbeat[] | undefined): Heartbeat[] {
  return [...(beats ?? [])].sort(
    (a, b) => parseKumaDate(a.time) - parseKumaDate(b.time),
  );
}

export function latestHeartbeat(
  beats: Heartbeat[] | undefined,
): Heartbeat | undefined {
  return orderHeartbeats(beats).at(-1);
}

export function elapsedSinceFirstBeat(
  beats: Heartbeat[],
  now: number,
): string | null {
  const first = beats[0];
  if (!first || now <= 0) return null;

  const minutes = Math.max(0, Math.floor((now - parseKumaDate(first.time)) / MINUTE));
  return minutes > 60 ? `${Math.floor(minutes / 60)}h` : `${minutes}m`;
}

export function elapsedSinceLastBeat(
  beats: Heartbeat[],
  now: number,
): string | null {
  const last = beats.at(-1);
  if (!last || now <= 0) return null;

  const elapsed = Math.max(0, now - parseKumaDate(last.time));
  if (elapsed < LAST_BEAT_NOW_TOLERANCE_MS) return "now";
  if (elapsed < HOUR) return `${Math.round(elapsed / MINUTE)}m ago`;
  return `${Math.round(elapsed / HOUR)}h ago`;
}
