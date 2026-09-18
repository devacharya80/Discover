import assert from "node:assert/strict";
import { test } from "node:test";
import { mapAdzunaWorkType,mapAdzunaWorkMode,mapAdzunaExperienceLevel,extractAdzunaSkills } from "./adzuna.mapper.js";

test("maps internship jobs",()=>assert.equal(mapAdzunaWorkType("full_time","", "Software Engineering Intern"),"INTERNSHIP"));
test("maps remote mode",()=>assert.equal(mapAdzunaWorkMode("This is a remote role"),"REMOTE"));
test("maps senior experience",()=>assert.equal(mapAdzunaExperienceLevel("Senior Backend Engineer"),"SENIOR"));
test("extracts known skills",()=>assert.deepEqual(extractAdzunaSkills("React Node.js Engineer","Uses PostgreSQL and Docker"),["react","node.js","postgresql","docker"]));
