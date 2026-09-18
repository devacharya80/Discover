import type {
  AdzunaSearchResponse,
} from "../../types/adzuna.types.js";

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api";

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

if (!APP_ID || !APP_KEY) {
  throw new Error("Adzuna API credentials are missing");
}

export const searchAdzunaJobs = async ({
  country,
  page,
  what,
  where,
}: {
  country: string;
  page: number;
  what?: string;
  where?: string;
}): Promise<AdzunaSearchResponse> => {
  const url = new URL(
    `${ADZUNA_BASE_URL}/jobs/${country}/search/${page}`,
  );

  url.searchParams.set("app_id", APP_ID);
  url.searchParams.set("app_key", APP_KEY);
  url.searchParams.set("content-type", "application/json");
  url.searchParams.set("results_per_page", "20");

  if (what) {
    url.searchParams.set("what", what);
  }

  if (where) {
    url.searchParams.set("where", where);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Adzuna API request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as AdzunaSearchResponse;

  return data;
};