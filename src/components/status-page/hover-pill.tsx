import { cva } from "class-variance-authority";
import { formatRelative, formatUptime } from "@/lib/format";
import type { Heartbeat } from "@/lib/kuma";
import { type DerivedStatus, statusFromBeat } from "@/lib/status";
import { HOVER_PILL, STATUS_LABEL } from "./constants";

const pill = cva("rounded-md px-2.5 py-0.5 font-medium", {
  variants: {
    tone: {
      idle: "bg-neutral-bg text-foreground-muted",
      up: "bg-success-bg text-success-strong",
      down: "bg-danger-bg text-danger-strong",
      pending: "bg-warning-bg text-warning-strong",
      maintenance: "bg-info-bg text-info-strong",
      unknown: "bg-neutral-bg text-foreground-muted",
    },
  },
  defaultVariants: { tone: "idle" },
});

function activeText(beat: Heartbeat, now: number, status: DerivedStatus): string {
  return [formatRelative(beat.time, now), STATUS_LABEL[status]].join(" · ");
}

export function HoverPill({
  hovered,
  now,
  uptime,
}: {
  hovered: Heartbeat | null;
  now: number;
  uptime: number | undefined;
}) {
  if (!hovered) {
    return (
      <span className={pill()}>
        {formatUptime(uptime)} {HOVER_PILL.uptimeSuffix}
      </span>
    );
  }
  const status = statusFromBeat(hovered);
  return (
    <span className={pill({ tone: status })}>{activeText(hovered, now, status)}</span>
  );
}
