import { cn } from "@/lib/cn";
import type { MonitorTag } from "@/lib/kuma";

const CHIP_BASE =
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

export function TagChip({ tag }: { tag: MonitorTag }) {
  const label = tag.value ? `${tag.name}: ${tag.value}` : (tag.name ?? "");
  if (!label) return null;
  if (tag.color) {
    return (
      <span
        className={CHIP_BASE}
        style={{ backgroundColor: `${tag.color}1f`, color: tag.color }}
      >
        {label}
      </span>
    );
  }
  return (
    <span className={cn(CHIP_BASE, "bg-neutral-bg text-foreground-muted")}>
      {label}
    </span>
  );
}
