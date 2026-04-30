import { type QueryClient, queryOptions } from "@tanstack/react-query";
import {
  fetchHeartbeats,
  fetchIncidentHistory,
  fetchStatusPage,
} from "./client";

const STALE_LONG = 5 * 60 * 1000;
const HEARTBEAT_DEFAULT_REFETCH_MS = 60_000;

export const statusPageQuery = (slug: string) =>
  queryOptions({
    queryKey: ["kuma", "page", slug] as const,
    queryFn: () => fetchStatusPage(slug),
    staleTime: STALE_LONG,
  });

export const heartbeatQuery = (
  slug: string,
  refetchMs: number = HEARTBEAT_DEFAULT_REFETCH_MS,
) =>
  queryOptions({
    queryKey: ["kuma", "heartbeat", slug] as const,
    queryFn: () => fetchHeartbeats(slug),
    staleTime: refetchMs,
    refetchInterval: refetchMs,
  });

export const incidentHistoryQuery = (slug: string) =>
  queryOptions({
    queryKey: ["kuma", "incident-history", slug] as const,
    queryFn: () => fetchIncidentHistory(slug),
    staleTime: STALE_LONG,
  });

export async function prefetchStatusPage(
  queryClient: QueryClient,
  slug: string,
): Promise<void> {
  await Promise.all([
    queryClient.prefetchQuery(statusPageQuery(slug)),
    queryClient.prefetchQuery(heartbeatQuery(slug)),
    queryClient.prefetchQuery(incidentHistoryQuery(slug)),
  ]);
}
