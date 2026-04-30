import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { StatusPageView } from "@/components/status-page";
import { fetchStatusPage, prefetchStatusPage } from "@/lib/kuma";
import { getQueryClient } from "@/lib/query-client";

type Params = { slug: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalized = slug.toLowerCase();
  if (normalized !== slug) return {};
  try {
    const { config } = await fetchStatusPage(normalized);
    return {
      title: config.title,
      description: config.description ?? undefined,
    };
  } catch {
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const normalized = slug.toLowerCase();
  if (normalized === "default") redirect("/");
  if (normalized !== slug) redirect(`/p/${normalized}`);

  const queryClient = getQueryClient();
  await prefetchStatusPage(queryClient, normalized);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatusPageView slug={normalized} />
    </HydrationBoundary>
  );
}
