"use client";

import { cva } from "class-variance-authority";
import type { Heartbeat } from "@/lib/kuma";
import { type BeatStatus, statusFromBeat } from "@/lib/status";

const VBH = 100;
const BAR_W = 3;
const GAP = 1;
const COL = BAR_W + GAP;
const DIM_OPACITY = 0.45;

const HEIGHT_PCT: Record<BeatStatus, number> = {
  up: 100,
  pending: 67,
  maintenance: 67,
  down: 33,
  unknown: 20,
};

const beatFill = cva("", {
  variants: {
    status: {
      up: "",
      pending: "",
      maintenance: "",
      down: "",
      unknown: "",
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
  ],
});

function heartbeatLabel(beat: Heartbeat): string {
  return [beat.time, beat.msg || null].filter(Boolean).join(" · ");
}

export function HeartbeatChart({
  beats,
  hovered,
  setHovered,
}: {
  beats: Heartbeat[];
  hovered: Heartbeat | null;
  setHovered: (beat: Heartbeat | null) => void;
}) {
  if (beats.length === 0) return null;
  const width = beats.length * COL;

  const pickBeat = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(
      beats.length - 1,
      Math.max(0, Math.floor(ratio * beats.length)),
    );
    const beat = beats[idx];
    if (beat) setHovered(beat);
  };

  return (
    <svg
      role="img"
      aria-label="Heartbeat history"
      viewBox={`0 0 ${width} ${VBH}`}
      preserveAspectRatio="none"
      className="block h-[30px] w-full touch-pan-y"
      onPointerDown={pickBeat}
      onPointerMove={pickBeat}
      onPointerLeave={() => setHovered(null)}
      onPointerCancel={() => setHovered(null)}
      onPointerUp={(e) => {
        if (e.pointerType !== "mouse") setHovered(null);
      }}
    >
      {beats.map((b, i) => {
        const status = statusFromBeat(b);
        const h = HEIGHT_PCT[status];
        const colX = i * COL;
        const barX = colX + GAP / 2;
        const isHovered = hovered === b;
        const dim = hovered != null && !isHovered;
        return (
          <g key={i}>
            <rect
              x={colX}
              y={0}
              width={COL}
              height={VBH}
              fill="transparent"
            />
            <rect
              x={barX}
              y={VBH - h}
              width={BAR_W}
              height={h}
              className={beatFill({
                status,
                state: isHovered ? "hover" : "default",
              })}
              opacity={dim ? DIM_OPACITY : 1}
            />
            <title>{heartbeatLabel(b)}</title>
          </g>
        );
      })}
    </svg>
  );
}
