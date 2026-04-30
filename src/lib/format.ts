const LOCALE = "en";
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const relativeTime = new Intl.RelativeTimeFormat(LOCALE, {
  numeric: "auto",
  style: "narrow",
});

const dayHeading = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const dateTime = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const clockTime = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export function parseKumaDate(s: string): number {
  const value = s.trim();
  if (!value) return Number.NaN;
  if (value.includes("T")) return new Date(value).getTime();
  return new Date(`${value.replace(" ", "T")}Z`).getTime();
}

export function formatRelative(s: string, now: number): string {
  const t = parseKumaDate(s);
  if (!Number.isFinite(t)) return s;
  if (now <= 0) return "now";

  const diff = t - now;
  const abs = Math.abs(diff);
  if (abs < 45 * SECOND) return "now";
  if (abs < HOUR) {
    return relativeTime.format(Math.round(diff / MINUTE), "minute");
  }
  if (abs < DAY) return relativeTime.format(Math.round(diff / HOUR), "hour");
  return relativeTime.format(Math.round(diff / DAY), "day");
}

export function formatClock(secondsTotal: number): string {
  const s = Math.max(0, Math.floor(secondsTotal));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

export function dayKey(s: string): string {
  return (s.includes("T") ? s.split("T")[0] : s.split(" ")[0]) ?? s;
}

export function formatDayHeading(key: string): string {
  const t = new Date(`${key}T00:00:00`).getTime();
  if (!Number.isFinite(t)) return key;
  return dayHeading.format(t);
}

export function formatDateTime(s: string): string {
  const t = parseKumaDate(s);
  if (!Number.isFinite(t)) return s.replace("T", " ");
  return dateTime.format(t);
}

export function formatTime(t: number): string {
  return clockTime.format(t);
}

export function formatUptime(value: number | undefined): string {
  if (value === undefined) return "—";
  const pct = value * 100;
  if (pct >= 99.995) return "100%";
  if (pct >= 99) return `${pct.toFixed(2)}%`;
  return `${pct.toFixed(1)}%`;
}
