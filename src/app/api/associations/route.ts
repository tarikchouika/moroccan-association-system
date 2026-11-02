import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { audit, readJson, nextMembershipNumber } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/** GET — قائمة الجمعيات حسب دور المستخدم */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  const scope = req.nextUrl.searchParams.get("scope") ?? "public";

  if (scope === "mine") {
    if (!user) return Response.json({ associations: [] });
    // طاقم المنصة (المالك + الأدمين + الكوأدمين + المحاسب): كل الجمعيات
    const staffRoles = ["SUPER_ADMIN", "ASSOCIATION_ADMIN", "CO_ADMIN", "ACCOUNTANT"];
    if (staffRoles.includes(user.role)) {
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
  logoUrl: z
    .string()
    .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, "صيغة اللوغو غير مدعومة")
    .optional()
    .or(z.literal("")),
  // الوثائق الرسمية للتأسيس — إرفاق إلزامي لتسجيل الجمعية
  documents: z
    .array(
      z.object({
        docType: z.enum(["STATUTES", "FOUNDING_MINUTES", "DEPOSIT_RECEIPT"]),
        dataUrl: z
          .string()
          .regex(
            /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/,
            "صيغة الوثيقة غير مدعومة (JPG/PNG/WebP فقط)"
          ),
      })
    )
    .default([]),
  // أعضاء المكتب المسير — يُنشأ لكل واحد حساب على المنصة
  boardMembers: z
    .array(
      z.object({
        role: z.enum([
          "VICE_PRESIDENT",
          "SECRETARY",
          "TREASURER",
          "BOARD_MEMBER",
          "CO_ADMIN",
        ]),
        fullName: z.string().min(3, "اسم العضو مطلوب"),
        email: z.string().email("بريد العضو غير صالح"),
        phone: z.string().max(20).optional().or(z.literal("")),
      })
    )
    .default([]),
});

/** أنواع الوثائق الرسمية المطلوبة لإتمام التسجيل */
const REQUIRED_DOC_TYPES = ["STATUTES", "FOUNDING_MINUTES", "DEPOSIT_RECEIPT"] as const;

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

  // إلزامية الوثائق الرسمية الثلاث لتسجيل الجمعية على المنصة
  const providedDocTypes = new Set(d.documents.map((x) => x.docType));
  const missingDocs = REQUIRED_DOC_TYPES.filter((t) => !providedDocTypes.has(t));
  if (missingDocs.length > 0) {
    return Response.json(
      {
        error:
          "إرفاق الوثائق الرسمية إلزامي لتسجيل الجمعية: القانون الأساسي، محضر الجمع العام التأسيسي، ووصل الإيداع لدى السلطة المحلية",
      },
      { status: 400 }
    );
  }

  // إلزامية الكاتب العام وأمين المال في المكتب المسير (المسطرة المغربية)
  const boardRoles = new Set(d.boardMembers.map((m) => m.role));
  if (!boardRoles.has("SECRETARY") || !boardRoles.has("TREASURER")) {
    return Response.json(
      {
        error:
          "يجب إدراج الكاتب العام وأمين المال ضمن أعضاء المكتب المسير — تُنشأ لكل عضو حساب على المنصة",
      },
      { status: 400 }
    );
  }
  // لا ازدواجية في البريد داخل الطلب
  const allEmails = [d.presidentEmail.toLowerCase(), ...d.boardMembers.map((m) => m.email.toLowerCase())];
  if (new Set(allEmails).size !== allEmails.length) {
    return Response.json(
      { error: "لا يمكن تكرار نفس البريد الإلكتروني لأكثر من عضو في المكتب" },
      { status: 400 }
    );
  }

  const slug =
    d.name
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) + "-" + Date.now().toString(36).slice(-4);

  // إنشاء حساب الرئيس إن لم يكن موجوداً (أو استعمال الحالي)
  // ملاحظة: دور المنصة للمستخدمين العاديين CITIZEN — سلطات المكتب تأتي من
  // عضويتهم (roleInAssociation) لا من دور المنصة (الذي يبقى لطاقم المنصة
  // الذي يعيّنه المالك حصراً عبر لوحة الإدارة)
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
            role: "CITIZEN",
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
      logoUrl: (() => {
        if (!d.logoUrl) return null;
        const b64 = d.logoUrl.split(",")[1] ?? "";
        return Math.floor((b64.length * 3) / 4) <= 300 * 1024 ? d.logoUrl : null;
      })(),
      status: "PENDING",
      createdBy: user.id,
    },
  });

  // عضوية الرئيس
  const year = new Date().getFullYear();
  await db.membership.create({
    data: {
      userId: presidentId,
      associationId: association.id,
      roleInAssociation: "PRESIDENT",
      memberType: "ACTIVE",
      membershipNumber: await nextMembershipNumber(association.id),
      status: "ACTIVE",
      cndpConsent: true,
      cndpConsentAt: new Date(),
    },
  });

  // حسابات أعضاء المكتب المسير — حساب باسم كل عضو (الرئيس، الكاتب، أمين المال،
  // نوابهم والمستشارون) مع عضوية نشطة ودور داخل الجمعية
  const createdBoard: string[] = [];
  for (const member of d.boardMembers) {
    let memberId: string;
    const existingMember = await db.user.findUnique({
      where: { email: member.email.toLowerCase() },
    });
    if (existingMember) {
      memberId = existingMember.id;
    } else {
      const created = await db.user.create({
        data: {
          email: member.email.toLowerCase(),
          fullName: member.fullName.trim(),
          phone: member.phone || null,
          passwordHash: hashPassword("Mamp@2026"),
          role: "CITIZEN",
        },
      });
      memberId = created.id;
      createdBoard.push(`${member.fullName} (${member.email})`);
    }

    const alreadyMember = await db.membership.findFirst({
      where: { userId: memberId, associationId: association.id },
    });
    if (!alreadyMember) {
      await db.membership.create({
        data: {
          userId: memberId,
          associationId: association.id,
          roleInAssociation: member.role,
          memberType: "ACTIVE",
          membershipNumber: await nextMembershipNumber(association.id),
          status: "ACTIVE",
          cndpConsent: true,
          cndpConsentAt: new Date(),
        },
      });
    }
  }

  // الوثائق الرسمية المرفقة — تُراجع من طرف السوبر أدمين قبل التوثيق
  for (const doc of d.documents) {
    await db.document.create({
      data: {
        title:
          doc.docType === "STATUTES"
            ? "القانون الأساسي للجمعية"
            : doc.docType === "FOUNDING_MINUTES"
              ? "محضر الجمع العام التأسيسي"
              : "وصل إيداع التصريح لدى السلطة المحلية",
        type: doc.docType,
        description: "وثيقة رسمية مرفقة عند تسجيل الجمعية على المنصة",
        url: doc.dataUrl,
        isPublic: false,
        associationId: association.id,
        uploadedById: user.id,
      },
    });
  }

  // ميزانية أولية فارغة
  await db.budget.create({
    data: { name: `ميزانية السنة المالية ${year}`, fiscalYear: year, associationId: association.id },
  });

  await audit(user.id, "CREATE", "Association", association.id, `طلب تسجيل جمعية: ${d.name}`);

  return Response.json(
    {
      association: { id: association.id, slug: association.slug, name: association.name },
      boardAccountsCreated: createdBoard.length,
    },
    { status: 201 }
  );
}

const patchSchema = z.object({
  id: z.string(),
  action: z.enum(["verify", "suspend", "activate", "reject", "delegate_approvals"]),
  /** للتفويض: معرف المستخدم المفوّض (فارغ = إلغاء التفويض وعودته للرئيس) */
  delegateTo: z.string().optional().or(z.literal("")),
});

/** PATCH — إشراف السوبر أدمين/أدمين المنصة على الجمعيات + تفويض القبول */
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجلوا الدخول أولاً" }, { status: 401 });

  const body = await readJson<unknown>(req);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "طلب غير صالح" }, { status: 400 });

  const { id, action, delegateTo } = parsed.data;
  const association = await db.association.findUnique({ where: { id } });
  if (!association) return Response.json({ error: "الجمعية غير موجودة" }, { status: 404 });

  // تفويض قبول الانخراط: الرئيس (أو السوبر أدمين) حصراً
  if (action === "delegate_approvals") {
    const isSuper = user.role === "SUPER_ADMIN";
    const isPresident = user.memberships.some(
      (m) => m.associationId === id && m.roleInAssociation === "PRESIDENT" && m.status === "ACTIVE"
    );
    if (!isSuper && !isPresident) {
      return Response.json(
        { error: "تفويض قبول الانخراط من صلاحيات رئيس الجمعية حصراً" },
        { status: 403 }
      );
    }

    if (delegateTo) {
      // المفوَّض إليه: مسيّر نشط داخل الجمعية (نائب/كاتب/أمين مال/مستشار/كوأدمين)
      const target = await db.membership.findFirst({
        where: {
          associationId: id,
          userId: delegateTo,
          status: "ACTIVE",
          roleInAssociation: {
            in: ["VICE_PRESIDENT", "SECRETARY", "TREASURER", "BOARD_MEMBER", "CO_ADMIN"],
          },
        },
        include: { user: { select: { fullName: true } } },
      });
      if (!target) {
        return Response.json(
          { error: "المفوَّض إليه يجب أن يكون مسيّراً نشطاً داخل الجمعية" },
          { status: 400 }
        );
      }
      await db.association.update({
        where: { id },
        data: { approvalsDelegatedTo: delegateTo },
      });
      await audit(
        user.id,
        "UPDATE",
        "Association",
        id,
        `تفويض قبول الانخراط إلى ${target.user.fullName} — ${association.name}`
      );
      return Response.json({ ok: true, delegatedTo: target.user.fullName });
    }

    // إلغاء التفويض — تعود الصلاحية للرئيس
    await db.association.update({ where: { id }, data: { approvalsDelegatedTo: null } });
    await audit(user.id, "UPDATE", "Association", id, `إلغاء تفويض قبول الانخراط — ${association.name}`);
    return Response.json({ ok: true, delegatedTo: null });
  }

  // إجراءات الإشراف: السوبر أدمين أو أدمين المنصة (المعين من المالك)
  if (user.role !== "SUPER_ADMIN" && user.role !== "ASSOCIATION_ADMIN") {
    return Response.json({ error: "هذه الإجراءات من صلاحيات إدارة المنصة" }, { status: 403 });
  }

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
  await audit(user.id, "MODERATION", "Association", id, `${action} → ${association.name}`);
  return Response.json({ association: { id: updated.id, status: updated.status, isVerified: updated.isVerified } });
}
