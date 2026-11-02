/** تنظيف بيانات التجارب من قاعدة البيانات المحلية */
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const testEmailPatterns = [
  { email: { contains: "test-citizen-" } },
  { email: { contains: "member-a-" } },
  { email: { contains: "sqli-" } },
  { email: { contains: "xss-" } },
  { email: { contains: "weak-" } },
];

const d1 = await p.association.deleteMany({ where: { name: { contains: "اختبار النظام الشامل" } } });
const d1b = await p.association.deleteMany({ where: { name: { contains: "script" } } });
const d2 = await p.event.deleteMany({ where: { title: { contains: "الاختبار الحي" } } });
const d2b = await p.event.deleteMany({ where: { title: { contains: "ضغط متزامنة" } } });
const d3 = await p.user.deleteMany({ where: { OR: testEmailPatterns } });
await p.chatMessage.deleteMany({});

console.log(
  "تنظيف:",
  JSON.stringify({
    جمعيات: d1.count + d1b.count,
    فعاليات: d2.count + d2b.count,
    مستخدمون: d3.count,
  })
);
await p.$disconnect();
