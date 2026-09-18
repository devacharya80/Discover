ALTER TABLE "ExternalJob" ADD COLUMN IF NOT EXISTS "externalLocationName" TEXT;
ALTER TABLE "ExternalJob" ADD COLUMN IF NOT EXISTS "externalCity" TEXT;
ALTER TABLE "ExternalJob" ADD COLUMN IF NOT EXISTS "externalState" TEXT;
ALTER TABLE "ExternalJob" ADD COLUMN IF NOT EXISTS "externalCountry" TEXT;
ALTER TABLE "ExternalJob" ADD COLUMN IF NOT EXISTS "externalLatitude" DOUBLE PRECISION;
ALTER TABLE "ExternalJob" ADD COLUMN IF NOT EXISTS "externalLongitude" DOUBLE PRECISION;

CREATE TABLE IF NOT EXISTS "SavedJob" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SavedJob_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "SavedJob_userId_jobId_key" ON "SavedJob"("userId","jobId");
CREATE INDEX IF NOT EXISTS "SavedJob_userId_createdAt_idx" ON "SavedJob"("userId","createdAt");

DO $$ BEGIN
  ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "Company_name_idx" ON "Company"("name");
CREATE INDEX IF NOT EXISTS "CompanyMember_companyId_role_idx" ON "CompanyMember"("companyId","role");
CREATE INDEX IF NOT EXISTS "CompanyLocation_companyId_isPrimary_idx" ON "CompanyLocation"("companyId","isPrimary");
CREATE INDEX IF NOT EXISTS "Job_status_createdAt_idx" ON "Job"("status","createdAt");
CREATE INDEX IF NOT EXISTS "Job_expiresAt_idx" ON "Job"("expiresAt");
CREATE INDEX IF NOT EXISTS "Application_userId_appliedAt_idx" ON "Application"("userId","appliedAt");
CREATE INDEX IF NOT EXISTS "Application_jobId_status_idx" ON "Application"("jobId","status");
CREATE INDEX IF NOT EXISTS "CompanyClaimRequest_companyId_status_idx" ON "CompanyClaimRequest"("companyId","status");
CREATE INDEX IF NOT EXISTS "CompanyClaimRequest_userId_status_idx" ON "CompanyClaimRequest"("userId","status");
