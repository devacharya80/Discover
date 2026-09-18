-- CreateTable
CREATE TABLE "ExternalJob" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "fingerprint" TEXT,
    "jobId" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalJob_jobId_key" ON "ExternalJob"("jobId");

-- CreateIndex
CREATE INDEX "ExternalJob_fingerprint_idx" ON "ExternalJob"("fingerprint");

-- CreateIndex
CREATE INDEX "ExternalJob_provider_idx" ON "ExternalJob"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalJob_provider_externalId_key" ON "ExternalJob"("provider", "externalId");

-- AddForeignKey
ALTER TABLE "ExternalJob" ADD CONSTRAINT "ExternalJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
