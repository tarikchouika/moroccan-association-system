-- ترحيل v1.6.0: تفويض قبول طلبات الانخراط
-- عمود جديد على جدول الجمعيات: معرف المستخدم المسيّر المفوّض من الرئيس
-- (NULL = الرئيس نفسه يقبل طلبات الانخراط الجديدة)

-- RedefineTables
PRAGMA defer_foreign_keys=true;
CREATE TABLE "new_Association" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT,
    "description" TEXT NOT NULL,
    "mission" TEXT,
    "category" TEXT NOT NULL DEFAULT 'تنموية',
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "address" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "logoUrl" TEXT,
    "coverUrl" TEXT,
    "foundedAt" DATETIME,
    "legalStatus" TEXT NOT NULL DEFAULT 'DECLARED',
    "iceNumber" TEXT,
    "taxId" TEXT,
    "bankRib" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" DATETIME,
    "approvalsDelegatedTo" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Association_approvalsDelegatedTo_fkey" FOREIGN KEY ("approvalsDelegatedTo") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Association" ("id", "slug", "name", "acronym", "description", "mission", "category", "city", "region", "address", "website", "email", "phone", "logoUrl", "coverUrl", "foundedAt", "legalStatus", "iceNumber", "taxId", "bankRib", "status", "isVerified", "verifiedAt", "viewCount", "createdBy", "createdAt", "updatedAt")
SELECT "id", "slug", "name", "acronym", "description", "mission", "category", "city", "region", "address", "website", "email", "phone", "logoUrl", "coverUrl", "foundedAt", "legalStatus", "iceNumber", "taxId", "bankRib", "status", "isVerified", "verifiedAt", "viewCount", "createdBy", "createdAt", "updatedAt" FROM "Association";
DROP TABLE "Association";
ALTER TABLE "new_Association" RENAME TO "Association";
CREATE UNIQUE INDEX "Association_slug_key" ON "Association"("slug");
CREATE INDEX "Association_status_idx" ON "Association"("status");
CREATE INDEX "Association_category_idx" ON "Association"("category");
CREATE INDEX "Association_city_idx" ON "Association"("city");
