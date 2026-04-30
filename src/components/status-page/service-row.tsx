"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatUptime } from "@/lib/format";
import {
  elapsedSinceFirstBeat,
  elapsedSinceLastBeat,
  orderHeartbeats,
} from "@/lib/heartbeat";
import type { Heartbeat, Monitor } from "@/lib/kuma";
import { lastStatus } from "@/lib/status";
import { CertExpiryPill } from "./cert-expiry-pill";
import { ClientOnly } from "./client-only";
import { STATUS_LABEL } from "./constants";
import { HeartbeatChart, SLOTS } from "./heartbeat-chart";
import { HoverPill } from "./hover-pill";
import { statusDot, statusText } from "./styles";
import { TagChip } from "./tag-chip";

function monitorHref(monitor: Monitor): string | null {
  if (!monitor.sendUrl || !monitor.url || monitor.url === "https://") return null;

  try {
    const url = new URL(monitor.url);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

export function ServiceRow({
  monitor,
  beats,
  uptime,
  now,
  showTags,
  showCertificateExpiry,
  showOnlyLastHeartbeat,
}: {
  monitor: Monitor;
  beats: Heartbeat[] | undefined;
  uptime: number | undefined;
  now: number;
  showTags: boolean;
  showCertificateExpiry: boolean;
  showOnlyLastHeartbeat: boolean;
}) {
  const [hovered, setHovered] = useState<Heartbeat | null>(null);
  const heartbeats = useMemo(() => orderHeartbeats(beats), [beats]);
  const status = lastStatus(beats);
  const linkTarget = monitorHref(monitor);
  const chartFull = heartbeats.length >= SLOTS;
  const firstElapsed = chartFull ? elapsedSinceFirstBeat(heartbeats, now) : null;
  const lastElapsed = elapsedSinceLastBeat(heartbeats, now);

  const statusToneClass = statusText({ status });

  return (
    <div className="px-2 py-3">
      <div className="mb-2 flex flex-col justify-between gap-1.5 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {linkTarget ? (
            <a
              href={linkTarget}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              {monitor.name}
            </a>
          ) : (
            <h4 className="text-sm font-medium text-foreground">
              {monitor.name}
            </h4>
          )}
          {showCertificateExpiry ? <CertExpiryPill monitor={monitor} /> : null}
          {showTags && monitor.tags && monitor.tags.length > 0
            ? monitor.tags.map((tag, i) => <TagChip key={tag.id ?? i} tag={tag} />)
            : null}
        </div>
        <div className="flex items-center gap-3">
          {showOnlyLastHeartbeat ? (
            <span
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium capitalize",
                statusToneClass,
              )}
            >
              <span
                aria-hidden
                className={cn("h-1.5 w-1.5 rounded-full", statusDot({ status }))}
              />
              {STATUS_LABEL[status]}
            </span>
          ) : (
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                statusToneClass,
              )}
            >
              {formatUptime(uptime)}
            </span>
          )}
        </div>
      </div>

      {showOnlyLastHeartbeat ? null : (
        <>
          <HeartbeatChart
            beats={heartbeats}
            hovered={hovered}
            setHovered={setHovered}
          />

          <div className="mt-2 grid grid-cols-3 items-center text-xs">
            <span className="justify-self-start font-medium text-foreground-subtle">
              <ClientOnly>{firstElapsed}</ClientOnly>
            </span>
            <div
              className={cn(
                "justify-self-center",
                !hovered && "hidden md:block",
              )}
            >
              <HoverPill hovered={hovered} now={now} uptime={uptime} />
            </div>
            <span className="justify-self-end font-medium text-foreground-subtle">
              <ClientOnly>{lastElapsed}</ClientOnly>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
