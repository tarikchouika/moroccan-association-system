import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { audit, readJson, requireSuperAdmin } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/** GET — قائمة الجمعيات حسب دور المستخدم */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  const scope = req.nextUrl.searchParams.get("scope") ?? "public";

  if (scope === "mine") {
    if (!user) return Response.json({ associations: [] });
    if (user.role === "SUPER_ADMIN") {
      const all = await db.association.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { memberships: true, donations: true, events: true } } },
      });
      return Response.json({ associations: all });
    }
    const mine = await db.association.findMany({
      where: { memberships: { some: { userId: user.id, status: "ACTIVE" } } },
      include: { _count: { select: { memberships: true, donations: true, events: true } } },
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ associations: mine });
  }

  // العموم: الجمعيات النشطة الموثقة فقط
  const publicList = await db.association.findMany({
    where: { status: "ACTIVE", isVerified: true },
    select: {
      id: true, slug: true, name: true, acronym: true, category: true, city: true,
      region: true, description: true, isVerified: true, legalStatus: true, viewCount: true,
      iceNumber: true, foundedAt: true,
      _count: { select: { memberships: { where: { status: "ACTIVE" } }, donations: true } },
    },
    orderBy: { viewCount: "desc" },
  });
  return Response.json({ associations: publicList });
}

const createSchema = z.object({
  name: z.string().min(4, "اسم الجمعية مطلوب"),
  acronym: z.string().max(20).optional().or(z.literal("")),
  description: z.string().min(30, "الوصف قصير جداً (30 حرفاً على الأقل)"),
  mission: z.string().optional().or(z.literal("")),
  category: z.string().min(2),
  city: z.string().min(2, "المدينة مطلوبة"),
  region: z.string().min(2, "الجهة مطلوبة"),
  address: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  foundedAt: z.string().optional().or(z.literal("")),
  legalStatus: z.enum(["DECLARED", "PUBLIC_UTILITY"]).default("DECLARED"),
  iceNumber: z.string().optional().or(z.literal("")),
  taxId: z.string().optional().or(z.literal("")),
  presidentName: z.string().min(3, "اسم الرئيس/ة مطلوب"),
  presidentEmail: z.string().email("بريد الرئيس/ة غير صالح"),
  presidentPassword: z.string().min(8, "كلمة سر الحساب (8 أحرف على الأقل)"),
});

/** POST — تسجيل جمعية جديدة (تأسيس رقمي لملفها على المنصة) */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجلوا الدخول أولاً" }, { status: 401 });

  const body = await readJson<Record<string, string>>(req);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const d = parsed.data;

  const slug =
    d.name
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) + "-" + Date.now().toString(36).slice(-4);

  // إنشاء حساب الرئيس إن لم يكن موجوداً (أو استعمال الحالي)
  let presidentId = user.id;
  if (user.email.toLowerCase() !== d.presidentEmail.toLowerCase()) {
    const existing = await db.user.findUnique({ where: { email: d.presidentEmail.toLowerCase() } });
    presidentId =
      existing?.id ??
      (
        await db.user.create({
          data: {
            email: d.presidentEmail.toLowerCase(),
            fullName: d.presidentName,
            passwordHash: hashPassword(d.presidentPassword),
            role: "ASSOCIATION_ADMIN",
          },
        })
      ).id;
  }

  const association = await db.association.create({
    data: {
      slug,
      name: d.name.trim(),
      acronym: d.acronym || null,
      description: d.description.trim(),
      mission: d.mission || null,
      category: d.category,
      city: d.city,
      region: d.region,
      address: d.address || null,
      email: d.email || null,
      phone: d.phone || null,
      website: d.website || null,
      foundedAt: d.foundedAt ? new Date(d.foundedAt) : null,
      legalStatus: d.legalStatus,
      iceNumber: d.iceNumber || null,
      taxId: d.taxId || null,
      status: "PENDING",
      createdBy: user.id,
    },
  });

  // عضوية الرئيس
  const year = new Date().getFullYear();
  const count = await db.membership.count({ where: { associationId: association.id } });
  await db.membership.create({
    data: {
      userId: presidentId,
      associationId: association.id,
      roleInAssociation: "PRESIDENT",
      memberType: "ACTIVE",
      membershipNumber: `${(d.acronym || "ASM").replace(/\s/g, "")}-${String(count + 1).padStart(4, "0")}`,
      status: "ACTIVE",
      cndpConsent: true,
      cndpConsentAt: new Date(),
    },
  });

  // ميزانية أولية فارغة
  await db.budget.create({
    data: { name: `ميزانية السنة المالية ${year}`, fiscalYear: year, associationId: association.id },
  });

  await audit(user.id, "CREATE", "Association", association.id, `طلب تسجيل جمعية: ${d.name}`);

  return Response.json({ association: { id: association.id, slug: association.slug, name: association.name } }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string(),
  action: z.enum(["verify", "suspend", "activate", "reject"]),
});

/** PATCH — إشراف السوبر أدمين على الجمعيات */
export async function PATCH(req: NextRequest) {
  const sa = await requireSuperAdmin();
  if (sa.error) return sa.error;

  const body = await readJson<unknown>(req);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "طلب غير صالح" }, { status: 400 });

  const { id, action } = parsed.data;
  const association = await db.association.findUnique({ where: { id } });
  if (!association) return Response.json({ error: "الجمعية غير موجودة" }, { status: 404 });

  const updates: Record<string, unknown> = {};
  if (action === "verify") {
    updates.isVerified = true;
    updates.verifiedAt = new Date();
    updates.status = "ACTIVE";
  } else if (action === "suspend") {
    updates.status = "SUSPENDED";
  } else if (action === "activate") {
    updates.status = "ACTIVE";
  } else if (action === "reject") {
    updates.status = "SUSPENDED";
    updates.isVerified = false;
  }

  const updated = await db.association.update({ where: { id }, data: updates });
  await audit(sa.userId, "MODERATION", "Association", id, `${action} → ${association.name}`);
  return Response.json({ association: { id: updated.id, status: updated.status, isVerified: updated.isVerified } });
}
