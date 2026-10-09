-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;
ALTER TABLE "User" ADD COLUMN "profileImage" TEXT;

-- CreateTable
CREATE TABLE "SchoolApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationNo" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "instituteCode" TEXT,
    "passwordHash" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "schoolId" TEXT,
    CONSTRAINT "SchoolApplication_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolApplication_applicationNo_key" ON "SchoolApplication"("applicationNo");

-- CreateIndex
CREATE INDEX "SchoolApplication_status_idx" ON "SchoolApplication"("status");

-- CreateIndex
CREATE INDEX "SchoolApplication_email_idx" ON "SchoolApplication"("email");
