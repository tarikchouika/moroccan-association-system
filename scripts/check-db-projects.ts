/** فحص حالة قاعدة البيانات بعد المخطط الجديد */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.collaborativeProject.count();
  const participants = await prisma.projectParticipant.count();
  const docs = await prisma.userDocument.count();
  const avatars = await prisma.user.count({ where: { avatarUrl: { not: null } } });
  const logos = await prisma.association.count({ where: { logoUrl: { not: null } } });
  const assocs = await prisma.association.count();
  const users = await prisma.user.count();

  console.log("associations:", assocs);
  console.log("users:", users);
  console.log("collaborativeProjects:", projects);
  console.log("projectParticipants:", participants);
  console.log("userDocuments:", docs);
  console.log("usersWithAvatar:", avatars);
  console.log("associationsWithLogo:", logos);

  const sample = await prisma.collaborativeProject.findMany({
    take: 6,
    select: { title: true, kind: true, status: true, leadAssociation: { select: { name: true } }, _count: { select: { participants: true } } },
  });
  console.log("\nsample projects:");
  for (const p of sample) {
    console.log(` - [${p.kind}/${p.status}] ${p.title} — قائد: ${p.leadAssociation.name} — مشاركون: ${p._count.participants}`);
  }
}

main().finally(() => prisma.$disconnect());
