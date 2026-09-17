/*
  Warnings:

  - The values [ONSITE] on the enum `WorkMode` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `appliedAt` on the `CompanyClaimRequest` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkMode_new" AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE');
ALTER TABLE "public"."Job" ALTER COLUMN "mode" DROP DEFAULT;
ALTER TABLE "Job" ALTER COLUMN "mode" TYPE "WorkMode_new" USING ("mode"::text::"WorkMode_new");
ALTER TYPE "WorkMode" RENAME TO "WorkMode_old";
ALTER TYPE "WorkMode_new" RENAME TO "WorkMode";
DROP TYPE "public"."WorkMode_old";
ALTER TABLE "Job" ALTER COLUMN "mode" SET DEFAULT 'REMOTE';
COMMIT;

-- AlterTable
ALTER TABLE "CompanyClaimRequest" DROP COLUMN "appliedAt",
ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Job_companyId_createdAt_idx" ON "Job"("companyId", "createdAt");
