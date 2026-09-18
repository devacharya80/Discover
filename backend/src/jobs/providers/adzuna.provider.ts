import type { AdzunaSearchResponse } from "../../types/adzuna.types.js";

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api";

export const searchAdzunaJobs = async ({
  country, page, what, where,
}: {
  country: string; page: number; what?: string; where?: string;
}): Promise<AdzunaSearchResponse> => {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) throw new Error("Adzuna API credentials are missing");

  const url = new URL(`${ADZUNA_BASE_URL}/jobs/${country}/search/${page}`);
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("content-type", "application/json");
  url.searchParams.set("results_per_page", "20");
  if (what) url.searchParams.set("what", what);
  if (where) url.searchParams.set("where", where);

  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Adzuna API request failed: ${response.status} ${response.statusText}`);
  return (await response.json()) as AdzunaSearchResponse;
};
