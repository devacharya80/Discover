import { searchAdzunaJobs } from "./jobs/providers/adzuna.provider.js";
import {parseAdzunaJob} from "./jobs/parsers/adzuna.parser.js"
import { validateExternalJob } from "./jobs/validators/external-job.validator.js";

export const test = async () => {
  try {
    const result = await searchAdzunaJobs({
      country: "in",
      page: 1,
      what: "software engineer",
      where: "Bangalore",
    });

    console.log("Total jobs:", result.count);

    const firstJob = result.results[0];
    // let data = result.results; 
    // console.log(result.results.slice(0,10))

    if (!firstJob) {
      console.log("No jobs found");
      return;
    }

    const normalizedJob = parseAdzunaJob(firstJob);
    const validatedJob = validateExternalJob(normalizedJob);

    console.dir(validatedJob, { depth: null });

    console.log("Normalized job:");
    console.dir(normalizedJob, { depth: null });
  } catch (error) {
    console.error(error);
  }
};

// test();

// test();