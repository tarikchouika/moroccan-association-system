/**
 * إدراج مشاريع مشتركة تجريبية في القاعدة الحالية (غير تدميري).
 * يُستعمل مرة واحدة بعد إضافة نموذج CollaborativeProject.
 * التنفيذ: bun run scripts/seed-projects.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function main() {
  const existing = await prisma.collaborativeProject.count();
  if (existing > 0) {
    console.log(`ℹ توجد ${existing} مشاريع مشتركة أصلاً — لا حاجة للإدراج`);
    return;
  }

  const assocs = await prisma.association.findMany({ select: { id: true, slug: true, name: true } });
  const bySlug = Object.fromEntries(assocs.map((a) => [a.slug, a.id]));
  const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" }, select: { id: true } });

  const defs = [
    {
      title: "برنامج محو الأمية الرقمية بالعالم القروي",
      description:
        "برنامج تكويني مشترك يستهدف 300 مستفيد بالعالم القروي في مجالات المهارات الرقمية الأساسية والبحث عن العمل إلكترونياً، عبر قاعات مجهزة ونظام تكوين عن بعد.",
      objectives: "تكوين 300 مستفيد · تجهيز 3 قاعات متعددة الوسائط · تكوين 12 مكوّناً محلياً",
      kind: "PROGRAM",
      category: "تعليمية",
      startDate: daysFromNow(14),
      endDate: daysFromNow(120),
      location: "دار الشباب المركزية",
      city: "الجديدة",
      status: "IN_PROGRESS",
      leadSlug: "association-nadwa-tanmiya",
      participants: [
        { slug: "association-al-mashriq-thaqafiya", role: "EXECUTION" },
        { slug: "association-mido-biya", role: "SUPPORT" },
        { name: "المديرية الإقليمية للتربية الوطنية", type: "GOVERNMENT", role: "COORDINATION" },
        { name: "مؤسسة الأطلس للتنمية الرقمية", type: "PRIVATE", role: "FUNDING" },
      ],
    },
    {
      title: "ملتقى الشباب للمبادرات البيئية",
      description:
        "فعالية مشتركة تجمع شباب الجمعيات لبلورة مبادرات بيئية قابلة للتمويل، مع ورشات حول التدبير المستدام للماء والطاقة وتشجير الأحياء.",
      objectives: "بلورة 10 مبادرات · تشجير 3 أحياء · تحسيس 500 تلميذ",
      kind: "EVENT",
      category: "بيئية",
      startDate: daysFromNow(30),
      endDate: null,
      location: "مركز اللقاءات الحضرية",
      city: "الدار البيضاء",
      status: "PUBLISHED",
      leadSlug: "association-mido-biya",
      participants: [
        { slug: "association-amal-ijtimaiya", role: "EXECUTION" },
        { name: "المندوبية السامية للمياه والغابات", type: "GOVERNMENT", role: "COORDINATION" },
        { name: "الشبكة المتوسطية للتنمية المستدامة", type: "INTERNATIONAL", role: "SUPPORT" },
      ],
    },
    {
      title: "مشروع القوافل الطبية للتغطية الصحية بالمناطق النائية",
      description:
        "مشروع صحي مشترك لتنظيم قوافل طبية مجانية بالمناطق النائية: فحوصات عامة، تخصصات أساسية، وتوزيع أدوية أساسية بشراكة مع المختبرات الوطنية.",
      objectives: "6 قوافل · 2400 فحص طبي · توزيع 3000 وحدة دوائية",
      kind: "PROJECT",
      category: "صحية",
      startDate: daysFromNow(45),
      endDate: daysFromNow(220),
      location: "جوائع إقليمية متعددة",
      city: "بني ملال",
      status: "PUBLISHED",
      leadSlug: "association-amal-ijtimaiya",
      participants: [
        { slug: "association-nadwa-tanmiya", role: "FUNDING" },
        { name: "المديرية الجهوية للصحة", type: "GOVERNMENT", role: "COORDINATION" },
        { name: "تعاونية صيدلة الأمل", type: "PRIVATE", role: "SUPPORT" },
      ],
    },
  ];

  for (const def of defs) {
    const leadId = bySlug[def.leadSlug];
    if (!leadId) {
      console.warn(`⚠ جمعية ${def.leadSlug} غير موجودة — تخطي`);
      continue;
    }
    await prisma.collaborativeProject.create({
      data: {
        title: def.title,
        description: def.description,
        objectives: def.objectives,
        kind: def.kind,
        category: def.category,
        startDate: def.startDate,
        endDate: def.endDate,
        location: def.location,
        city: def.city,
        isPublic: true,
        status: def.status,
        leadAssociationId: leadId,
        createdById: admin?.id ?? null,
        participants: {
          create: def.participants.map((p) => {
            const slug = (p as { slug?: string }).slug;
            return slug
              ? { associationId: bySlug[slug], status: "ACTIVE", partnerRole: p.role }
              : {
                  partnerName: (p as { name: string }).name,
                  partnerType: (p as { type: string }).type,
                  partnerRole: p.role,
                  status: "ACTIVE",
                };
          }),
        },
      },
    });
    console.log(`✓ ${def.title}`);
  }
  console.log("🎉 اكتمل إدراج المشاريع المشتركة التجريبية");
}

main().catch((e) => {
  console.error("فشل الإدراج:", e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
