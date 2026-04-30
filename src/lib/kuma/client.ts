import type {
  HeartbeatPayload,
  IncidentHistoryPayload,
  StatusPagePayload,
} from "./types";
import { getKumaBaseUrl, statusPageApiPath } from "./url";

const isServer = typeof window === "undefined";
const serverFetchInit = { next: { revalidate: 30 } } as RequestInit;

function endpoint(path: string): string {
  if (!isServer) return path;
  return `${getKumaBaseUrl()}${path}`;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(endpoint(path), isServer ? serverFetchInit : undefined);
  if (!res.ok) {
    throw new Error(`kuma ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function fetchStatusPage(slug: string): Promise<StatusPagePayload> {
  return getJson<StatusPagePayload>(statusPageApiPath(slug));
}

export function fetchHeartbeats(slug: string): Promise<HeartbeatPayload> {
  return getJson<HeartbeatPayload>(statusPageApiPath("heartbeat", slug));
}

export function fetchIncidentHistory(
  slug: string,
): Promise<IncidentHistoryPayload> {
  return getJson<IncidentHistoryPayload>(
    statusPageApiPath(slug, "incident-history"),
  );
}
