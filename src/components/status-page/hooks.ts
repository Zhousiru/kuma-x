"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  heartbeatQuery,
  incidentHistoryQuery,
  statusPageQuery,
} from "@/lib/kuma";

export function useNowTick(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function useStatusPageData(slug: string) {
  const page = useQuery(statusPageQuery(slug));
  const refetchMs = Math.max(
    (page.data?.config.autoRefreshInterval ?? 60) * 1000,
    30_000,
  );
  const beats = useQuery(heartbeatQuery(slug, refetchMs));
  const history = useQuery(incidentHistoryQuery(slug));

  return {
    page,
    beats,
    history,
    refetchMs,
    lastUpdatedAt: beats.dataUpdatedAt,
    nextRefreshAt: beats.dataUpdatedAt + refetchMs,
  };
}
