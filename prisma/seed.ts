/**
 * MAMP — بذرة قاعدة البيانات الإنتاجية
 * تُنفَّذ عبر: bun run db:seed
 *
 * لا تحتوي أي حسابات تجريبية — الحساب الوحيد هو مالك المنصة (السوبر أدمين).
 * بيانات التطوير الكاملة (جمعيات وأعضاء وفعاليات تجريبية) في prisma/seed-demo.ts
 * وتُستعمل للبيئات المحلية وتوليد بيانات الواجهة العمومية فقط: bun run db:seed:demo
 */
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const prisma = new PrismaClient();

/** تشفير كلمات السر (scrypt بدون اعتماديات خارجية) — نفس دالة src/lib/auth.ts */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** الحساب الرسمي الوحيد — مالك المنصة */
const SUPER_ADMIN = {
  email: "tarikchouika@gmail.com",
  password: "Tch@10mn",
  fullName: "طريق الشويكة",
  phone: null as string | null,
};

async function main() {
  console.log("🌱 بدء تعبئة قاعدة البيانات الإنتاجية...");

  // تفريغ الجداول (بذرة نظيفة وقابلة لإعادة التشغيل)
  await prisma.chatMessage.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.projectParticipant.deleteMany();
  await prisma.collaborativeProject.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.document.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.userDocument.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.association.deleteMany();
  await prisma.user.deleteMany();

  // السوبر أدمين — الحساب الوحيد
  const existing = await prisma.user.findUnique({ where: { email: SUPER_ADMIN.email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash: hashPassword(SUPER_ADMIN.password), role: "SUPER_ADMIN", isActive: true },
    });
    console.log("👤 حُدِّث حساب مالك المنصة:", SUPER_ADMIN.email);
  } else {
    await prisma.user.create({
      data: {
        email: SUPER_ADMIN.email,
        passwordHash: hashPassword(SUPER_ADMIN.password),
        fullName: SUPER_ADMIN.fullName,
        role: "SUPER_ADMIN",
      },
    });
    console.log("👤 أُنشئ حساب مالك المنصة:", SUPER_ADMIN.email);
  }

  const counts = {
    users: await prisma.user.count(),
    associations: await prisma.association.count(),
  };
  console.log("✅ اكتملت البذرة الإنتاجية:", counts);
  console.log("   (لا حسابات تجريبية — سجّلوا الدخول بحساب مالك المنصة)");
}

main()
  .catch((e) => {
    console.error("❌ فشل التعبئة:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
