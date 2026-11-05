/**
 * مولد البيانات العمومية — يقرأ من قاعدة SQLite ويولد src/generated/demo-data.ts
 * تُستعمل في الصفحات العمومية (قابلة للتصدير الثابت) دون اتصال مباشر بقاعدة البيانات.
 * التنفيذ: bun run demo:generate
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "fs";

const prisma = new PrismaClient();

async function main() {
  const associations = await prisma.association.findMany({
    where: { status: "ACTIVE" },
    orderBy: { viewCount: "desc" },
    include: {
      memberships: { where: { status: "ACTIVE" }, select: { id: true } },
      events: {
        where: { isPublic: true, status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        take: 6,
      },
      _count: { select: { donations: true, documents: true } },
    },
  });

  const [userCount, assocTotal, memberTotal, txTotal, donationTotal] = await Promise.all([
    prisma.user.count(),
    prisma.association.count(),
    prisma.membership.count({ where: { status: "ACTIVE" } }),
    prisma.transaction.count(),
    prisma.donation.count(),
  ]);

  const projects = await prisma.collaborativeProject.findMany({
    where: { isPublic: true, status: { in: ["PUBLISHED", "IN_PROGRESS"] } },
    include: {
      leadAssociation: { select: { name: true, slug: true } },
      participants: { include: { association: { select: { name: true, slug: true } } }, orderBy: { joinedAt: "asc" as const } },
    },
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
    take: 24,
  });

  const managed = await prisma.transaction.aggregate({ _sum: { amount: true } });
  const donationsSum = await prisma.donation.aggregate({ _sum: { amount: true } });

  const data = {
    generatedAt: new Date().toISOString(),
    stats: {
      users: userCount,
      associations: assocTotal,
      activeMembers: memberTotal,
      transactions: txTotal,
      donations: donationTotal,
      managedAmount: Math.round((managed._sum.amount ?? 0) + (donationsSum._sum.amount ?? 0)),
    },
    associations: associations.map((a) => ({
      slug: a.slug,
      name: a.name,
      acronym: a.acronym ?? "",
      category: a.category,
      city: a.city,
      region: a.region,
      description: a.description,
      mission: a.mission ?? "",
      foundedAt: a.foundedAt?.toISOString() ?? null,
      legalStatus: a.legalStatus,
      isVerified: a.isVerified,
      viewCount: a.viewCount,
      memberCount: a.memberships.length,
      donationCount: a._count.donations,
      iceNumber: a.iceNumber,
      logoUrl: (a as { logoUrl?: string | null }).logoUrl ?? null,
      donationsEnabled: a.donationsEnabled,
      donationBankName: a.donationBankName,
      donationRib: a.donationRib,
      donationCcp: a.donationCcp,
      donationOnlineUrl: a.donationOnlineUrl,
      donationInstructions: a.donationInstructions,
      acceptInKind: a.acceptInKind,
      inKindNeeds: a.inKindNeeds,
    })),
    events: associations.flatMap((a) =>
      a.events.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        startDate: e.startDate.toISOString(),
        location: e.location ?? "",
        city: e.city ?? a.city,
        maxParticipants: e.maxParticipants,
        associationName: a.name,
        associationSlug: a.slug,
      }))
    ),
    projects: projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? "",
      objectives: p.objectives ?? "",
      kind: p.kind,
      category: p.category,
      startDate: p.startDate?.toISOString() ?? null,
      endDate: p.endDate?.toISOString() ?? null,
      location: p.location ?? "",
      city: p.city ?? "",
      status: p.status,
      leadName: p.leadAssociation.name,
      leadSlug: p.leadAssociation.slug,
      participants: p.participants.map((pt) => ({
        name: pt.association?.name ?? pt.partnerName ?? "",
        type: pt.association ? "ASSOCIATION" : pt.partnerType,
        role: pt.partnerRole,
        status: pt.status,
      })),
    })),
  };

  mkdirSync("src/generated", { recursive: true });
  writeFileSync(
    "src/generated/demo-data.ts",
    `// ⚠️ ملف مولّد آلياً بواسطة scripts/generate-demo-data.ts — لا تحرره يدوياً\n` +
      `import type { DemoData } from "./types";\n\n` +
      `export const DEMO_DATA: DemoData = ${JSON.stringify(data, null, 2)};\n`
  );
  console.log(`✅ تم توليد البيانات العمومية: ${associations.length} جمعية، ${data.events.length} فعالية، ${projects.length} عمل مشترك`);
}

main().catch((e) => {
  console.error("فشل التوليد:", e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
