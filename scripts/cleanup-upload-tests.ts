/** تنظيف بيانات اختبارات الرفع والمشاريع — إعادة الحالة البذرية النقية */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1) إزالة لوغو الجمعيات التجريبي
  const logos = await prisma.association.updateMany({
    where: { logoUrl: { not: null } },
    data: { logoUrl: null },
  });
  console.log("لوغوهات أزيلت:", logos.count);

  // 2) حذف كل وثائق الهوية الاختبارية (بقايا جلستين)
  const docs = await prisma.userDocument.deleteMany({});
  console.log("وثائق هوية حذفت:", docs.count);

  // 3) إزالة الصور الشخصية الاختبارية
  const avatars = await prisma.user.updateMany({
    where: { avatarUrl: { not: null } },
    data: { avatarUrl: null },
  });
  console.log("صور شخصية أزيلت:", avatars.count);

  // 4) حذف مشروع الاختبار (التشجير — ليس من البذر المنسق)
  const del = await prisma.collaborativeProject.deleteMany({
    where: { title: { contains: "التشجير الموحد" } },
  });
  console.log("مشاريع اختبار حذفت:", del.count);

  // 5) تحقق نهائي
  const projects = await prisma.collaborativeProject.count();
  const participants = await prisma.projectParticipant.count();
  console.log(`\nالحالة النهائية: ${projects} مشاريع منسقة، ${participants} مشاركة، 0 وثائق هوية، 0 لوغو، 0 صور شخصية`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
