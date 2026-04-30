import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { StatusPageView } from "@/components/status-page";
import { fetchStatusPage, prefetchStatusPage } from "@/lib/kuma";
import { getQueryClient } from "@/lib/query-client";

const SLUG = "default";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { config } = await fetchStatusPage(SLUG);
    return {
      title: config.title,
      description: config.description ?? undefined,
    };
  } catch {
    return {};
  }
}

export default async function Page() {
  const queryClient = getQueryClient();
  await prefetchStatusPage(queryClient, SLUG);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatusPageView slug={SLUG} />
    </HydrationBoundary>
  );
}
