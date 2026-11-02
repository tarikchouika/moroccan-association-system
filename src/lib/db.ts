/**
 * عميل Prisma — الوضع الموحد: العميل الكلاسيكي + SQLite المحلية.
 *
 * منذ v1.6.1 أزيلت قاعدة D1 السحابية والعامل الكامل نهائياً بقرار المالك:
 *   • البيئة المحلية هي مشغّل المنصة الكامل الوحيد (API + لوحة التحكم + قاعدة
 *     البيانات) — عبر `bun run dev` أو النسخة المستقلة `bun run start`.
 *   • النسخة السحابية (mamp.pages.dev) عمومية ثابتة بلا خادم ولا قاعدة بيانات.
 *
 * مسار ملف القاعدة يُضبط عبر DATABASE_URL (افتراضياً file:./db/custom.db
 * في .env — راجع أدلة التشغيل في WORKLOG.md).
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: ["error"],
  });
}

export const db = globalForPrisma.prisma!;
