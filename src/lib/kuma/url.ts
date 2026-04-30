const STATUS_PAGE_API_PATH = "/api/status-page";

export function getKumaBaseUrl(): string {
  const baseUrl = process.env.UPTIME_KUMA_URL?.replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("UPTIME_KUMA_URL is not set on the server");
  }
  return baseUrl;
}

export function statusPageApiPath(...segments: string[]): string {
  const path = segments.map((segment) => encodeURIComponent(segment)).join("/");
  return path ? `${STATUS_PAGE_API_PATH}/${path}` : STATUS_PAGE_API_PATH;
}

export function statusPageApiUrl(...segments: string[]): string {
  return `${getKumaBaseUrl()}${statusPageApiPath(...segments)}`;
}
