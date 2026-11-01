import { db } from "@/lib/db";
async function main() {
  const users = await db.user.count();
  const assoc = await db.association.count();
  const memb = await db.membership.count();
  const tx = await db.transaction.count();
  const ev = await db.event.count();
  const don = await db.donation.count();
  const docs = await db.document.count();
  const chat = await db.chatMessage.count();
  console.log(JSON.stringify({ users, assoc, memb, tx, ev, don, docs, chat }));
  const roles = await db.user.groupBy({ by: ["role"], _count: true });
  console.log("roles:", JSON.stringify(roles));
  const aStatus = await db.association.groupBy({ by: ["status"], _count: true });
  console.log("assocStatus:", JSON.stringify(aStatus));
}
main().finally(() => db.$disconnect());
