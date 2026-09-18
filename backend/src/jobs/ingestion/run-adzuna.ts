import "dotenv/config";
import { ingestAdzunaJobs } from "./adzuna.ingestion.js";

const result = await ingestAdzunaJobs({
  country: process.env.ADZUNA_COUNTRY ?? "in",
  pages: Number(process.env.ADZUNA_PAGES ?? 1),
  what: process.env.ADZUNA_WHAT ?? "software engineer",
  where: process.env.ADZUNA_WHERE || undefined,
});

console.log("Adzuna ingestion result:", result);
