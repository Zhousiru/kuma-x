import { cva } from "class-variance-authority";
import type { Monitor } from "@/lib/kuma";
import { CERT_PILL } from "./constants";

const pill = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        ok: "bg-success-bg text-success-strong",
        danger: "bg-danger-bg text-danger-strong",
      },
    },
  },
);

function certExpiryDays(value: Monitor["certExpiryDaysRemaining"]): number | null {
  if (value === undefined || value === null || value === "") return null;
  const days = Number(value);
  return Number.isFinite(days) ? days : null;
}

export function CertExpiryPill({ monitor }: { monitor: Monitor }) {
  if (monitor.validCert === false) {
    return <span className={pill({ variant: "danger" })}>{CERT_PILL.bad}</span>;
  }
  const days = certExpiryDays(monitor.certExpiryDaysRemaining);
  if (days === null) return null;
  return (
    <span className={pill({ variant: days <= 7 ? "danger" : "ok" })}>
      {CERT_PILL.prefix} · {days}d
    </span>
  );
}
