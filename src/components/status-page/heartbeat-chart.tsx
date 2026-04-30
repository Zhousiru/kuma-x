"use client";

import { cva } from "class-variance-authority";
import { useMemo } from "react";
import { cn } from "@/lib/cn";
import type { Heartbeat } from "@/lib/kuma";
import { type BeatStatus, statusFromBeat } from "@/lib/status";

export const SLOTS = 100;

const VBH = 10;
const SLOT_W = 10;
const BAR_W = 7;
const VBW = SLOTS * SLOT_W;

type SlotStatus = BeatStatus | "empty";

const beatFill = cva("transition-opacity", {
  variants: {
    status: {
      up: "",
      pending: "",
      maintenance: "",
      down: "",
      unknown: "",
      empty: "",
    },
    state: {
      default: "",
      hover: "",
    },
  },
  compoundVariants: [
    { status: "up", state: "default", className: "fill-success" },
    { status: "up", state: "hover", className: "fill-success-strong" },
    { status: "pending", state: "default", className: "fill-warning" },
    { status: "pending", state: "hover", className: "fill-warning-strong" },
    { status: "maintenance", state: "default", className: "fill-info-soft" },
    { status: "maintenance", state: "hover", className: "fill-info-strong" },
    { status: "down", state: "default", className: "fill-danger" },
    { status: "down", state: "hover", className: "fill-danger-strong" },
    { status: "unknown", state: "default", className: "fill-foreground-faint" },
    { status: "unknown", state: "hover", className: "fill-foreground-subtle" },
    {
      status: "empty",
      state: "default",
      className: "fill-foreground-faint/25",
    },
    {
      status: "empty",
      state: "hover",
      className: "fill-foreground-faint/25",
    },
  ],
});

function heartbeatLabel(beat: Heartbeat): string {
  return [beat.time, beat.msg || null].filter(Boolean).join(" · ");
}

type Slot = Heartbeat | null;

export function HeartbeatChart({
  beats,
  hovered,
  setHovered,
}: {
  beats: Heartbeat[];
  hovered: Heartbeat | null;
  setHovered: (beat: Heartbeat | null) => void;
}) {
  const slots = useMemo<Slot[]>(() => {
    const tail = beats.slice(-SLOTS);
    const padding = Math.max(0, SLOTS - tail.length);
    return [...Array<Slot>(padding).fill(null), ...tail];
  }, [beats]);

  const onPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(SLOTS - 1, Math.max(0, Math.floor(ratio * SLOTS)));
    setHovered(slots[idx] ?? null);
  };

  return (
    <svg
      role="img"
      aria-label="Heartbeat history"
      viewBox={`0 0 ${VBW} ${VBH}`}
      preserveAspectRatio="none"
      className="block h-[30px] w-full select-none touch-pan-y"
      onPointerDown={onPointer}
      onPointerMove={onPointer}
      onPointerLeave={() => setHovered(null)}
      onPointerCancel={() => setHovered(null)}
      onPointerUp={(e) => {
        if (e.pointerType !== "mouse") setHovered(null);
      }}
    >
      {slots.map((b, i) => {
        const status: SlotStatus = b ? statusFromBeat(b) : "empty";
        const isHovered = b !== null && hovered === b;
        const dim = b !== null && hovered !== null && !isHovered;
        const x = i * SLOT_W + (SLOT_W - BAR_W) / 2;
        return (
          <g key={i}>
            <rect
              x={x}
              y={0}
              width={BAR_W}
              height={VBH}
              className={cn(
                beatFill({ status, state: isHovered ? "hover" : "default" }),
                dim && "opacity-45",
              )}
            />
            {b ? <title>{heartbeatLabel(b)}</title> : null}
          </g>
        );
      })}
    </svg>
  );
}
