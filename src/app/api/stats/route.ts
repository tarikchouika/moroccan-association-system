import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { requireSuperAdmin } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/** GET — مؤشرات لوحة التحكم لجمعية أو للمنصة (سوبر أدمين) */
export async function GET(req: NextRequest) {
  const associationId = req.nextUrl.searchParams.get("associationId");

  // ===== إحصائيات المنصة (سوبر أدمين) =====
  if (!associationId) {
    const sa = await requireSuperAdmin();
    if (sa.error) return sa.error;

    const [users, associations, activeMembers, donations, transactions, pendingAssociations, chatMessages] =
      await Promise.all([
        db.user.count(),
        db.association.count(),
        db.membership.count({ where: { status: "ACTIVE" } }),
        db.donation.aggregate({ _sum: { amount: true } }),
        db.transaction.aggregate({ _sum: { amount: true } }),
        db.association.count({ where: { status: "PENDING" } }),
        db.chatMessage.count(),
      ]);

    const byCategory = await db.association.groupBy({ by: ["category"], _count: true });
    const recentAudit = await db.auditLog.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { fullName: true, email: true } } },
    });

    return Response.json({
      platform: {
        users,
        associations,
        activeMembers,
        pendingAssociations,
        chatMessages,
        donationsTotal: donations._sum.amount ?? 0,
        transactionsTotal: transactions._sum.amount ?? 0,
        byCategory,
      },
      recentAudit,
    });
  }

  // ===== إحصائيات جمعية =====
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "غير مصرح" }, { status: 401 });

  const membership = user.memberships.find((m) => m.associationId === associationId);
  if (!membership && user.role !== "SUPER_ADMIN" && user.role !== "PARTNER") {
    return Response.json({ error: "لا تنتمون إلى هذه الجمعية" }, { status: 403 });
  }

  const year = Number(req.nextUrl.searchParams.get("year") ?? new Date().getFullYear());
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const [members, pendingMembers, income, expense, donationsAgg, donationCount, events, upcomingEvents, docs, budget] =
    await Promise.all([
      db.membership.count({ where: { associationId, status: "ACTIVE" } }),
      db.membership.count({ where: { associationId, status: "PENDING" } }),
      db.transaction.aggregate({
        where: { associationId, type: "INCOME", date: { gte: startOfYear, lt: endOfYear } },
        _sum: { amount: true },
      }),
      db.transaction.aggregate({
        where: { associationId, type: "EXPENSE", date: { gte: startOfYear, lt: endOfYear } },
        _sum: { amount: true },
      }),
      db.donation.aggregate({ where: { associationId, date: { gte: startOfYear, lt: endOfYear } }, _sum: { amount: true } }),
      db.donation.count({ where: { associationId } }),
      db.event.count({ where: { associationId } }),
      db.event.findMany({
        where: { associationId, startDate: { gte: new Date() }, status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        take: 5,
        include: { _count: { select: { registrations: true } } },
      }),
      db.document.count({ where: { associationId } }),
      db.budget.findFirst({ where: { associationId, fiscalYear: year } }),
    ]);

  // تطور شهري
  const monthly: Array<{ month: string; income: number; expense: number }> = [];
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"];
  const txs = await db.transaction.findMany({
    where: { associationId, date: { gte: startOfYear, lt: endOfYear } },
    select: { date: true, type: true, amount: true },
  });
  for (let m = 0; m < 12; m++) {
    monthly.push({
      month: monthNames[m],
      income: txs.filter((t) => t.date.getMonth() === m && t.type === "INCOME").reduce((s, t) => s + t.amount, 0),
      expense: txs.filter((t) => t.date.getMonth() === m && t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0),
    });
  }

  // توزيع المصروفات حسب الفئة
  const byCategory = await db.transaction.groupBy({
    by: ["category"],
    where: { associationId, type: "EXPENSE", date: { gte: startOfYear, lt: endOfYear } },
    _sum: { amount: true },
  });

  const incomeTotal = income._sum.amount ?? 0;
  const expenseTotal = expense._sum.amount ?? 0;

  return Response.json({
    association: {
      members,
      pendingMembers,
      incomeTotal,
      expenseTotal,
      balance: incomeTotal - expenseTotal,
      donationsTotal: donationsAgg._sum.amount ?? 0,
      donationCount,
      events,
      docs,
      budget: budget ? { plannedIncome: budget.plannedIncome, plannedExpense: budget.plannedExpense, status: budget.status } : null,
      monthly,
      expenseByCategory: byCategory.map((c) => ({ category: c.category, amount: c._sum.amount ?? 0 })),
      upcomingEvents: upcomingEvents.map((e) => ({
        id: e.id,
        title: e.title,
        startDate: e.startDate,
        location: e.location,
        registrations: e._count.registrations,
        maxParticipants: e.maxParticipants,
      })),
    },
  });
}
