import assert from "node:assert/strict";
import { test } from "node:test";
import { generateJobFingerprint } from "./fingerprint.js";

const job = {
  externalId:"1", source:"ADZUNA", title:"Software Engineer",
  description:"Build APIs with TypeScript and PostgreSQL",
  companyName:"Acme", location:{name:"Bengaluru, Karnataka",city:"Bengaluru",state:"Karnataka",country:"INDIA"},
  type:"FULL_TIME", experienceLevel:"ENTRYLEVEL", skills:[], applicationUrl:"https://example.com", createdAt:new Date(),
} as const;

test("fingerprint is stable for identical jobs",()=>assert.equal(generateJobFingerprint(job),generateJobFingerprint({...job})));
test("fingerprint changes when meaningful description changes",()=>assert.notEqual(generateJobFingerprint(job),generateJobFingerprint({...job,description:"Build mobile apps with React Native"})));
