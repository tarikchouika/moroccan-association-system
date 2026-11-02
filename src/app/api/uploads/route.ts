import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser, canManageAssociation } from "@/lib/auth";
import { audit, readJson } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * رفع الصور — صورة المستخدم، لوغو الجمعية، وثائق الهوية.
 * الصور تصل data URL مضغوطة من العميل (canvas) — نتحقق من النوع والحجم هنا دفاعياً.
 * الحدود: الصورة الشخصية/اللوغو ≤ 300KB، وثيقة الهوية ≤ 900KB (قانون 09.08 —
 * وثائق الهوية يطلع عليها صاحبها والسوبر أدمين فقط).
 */

const DATA_URL_RE = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
const DOC_TYPES = ["NATIONAL_ID", "PASSPORT", "DRIVERS_LICENSE"] as const;

const uploadSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("avatar"),
    dataUrl: z.string().regex(DATA_URL_RE, "صيغة الصورة غير مدعومة (PNG/JPEG/WebP فقط)"),
  }),
  z.object({
    kind: z.literal("logo"),
    associationId: z.string(),
    dataUrl: z.string().regex(DATA_URL_RE, "صيغة الصورة غير مدعومة (PNG/JPEG/WebP فقط)"),
  }),
  z.object({
    kind: z.literal("identity"),
    docType: z.enum(DOC_TYPES),
    label: z.string().max(120).optional(),
    dataUrl: z.string().regex(DATA_URL_RE, "صيغة الصورة غير مدعومة (PNG/JPEG/WebP فقط)"),
  }),
]);

function sizeOf(dataUrl: string): number {
  const b64 = dataUrl.split(",")[1] ?? "";
  return Math.floor((b64.length * 3) / 4);
}

/** POST — رفع/تحديث صورة */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجلوا الدخول أولاً" }, { status: 401 });

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const d = parsed.data;

  if (d.kind === "avatar") {
    if (sizeOf(d.dataUrl) > 300 * 1024) {
      return Response.json({ error: "حجم الصورة الشخصية يتجاوز 300 كيلوبايت" }, { status: 413 });
    }
    await db.user.update({ where: { id: user.id }, data: { avatarUrl: d.dataUrl } });
    await audit(user.id, "UPDATE", "User", user.id, "تحديث الصورة الشخصية");
    return Response.json({ avatarUrl: d.dataUrl });
  }

  if (d.kind === "logo") {
    if (!canManageAssociation(user, d.associationId)) {
      return Response.json({ error: "صلاحية إدارة الجمعية مطلوبة لتحديث اللوغو" }, { status: 403 });
    }
    if (sizeOf(d.dataUrl) > 300 * 1024) {
      return Response.json({ error: "حجم اللوغو يتجاوز 300 كيلوبايت" }, { status: 413 });
    }
    await db.association.update({ where: { id: d.associationId }, data: { logoUrl: d.dataUrl } });
    await audit(user.id, "UPDATE", "Association", d.associationId, "تحديث لوغو الجمعية");
    return Response.json({ logoUrl: d.dataUrl });
  }

  // وثيقة هوية — تخص المستخدم نفسه حصراً
  if (sizeOf(d.dataUrl) > 900 * 1024) {
    return Response.json({ error: "حجم الوثيقة يتجاوز 900 كيلوبايت" }, { status: 413 });
  }
  const doc = await db.userDocument.upsert({
    where: { userId_docType: { userId: user.id, docType: d.docType } },
    create: { userId: user.id, docType: d.docType, label: d.label || null, dataUrl: d.dataUrl },
    update: { label: d.label || null, dataUrl: d.dataUrl },
  });
  await audit(user.id, "UPLOAD", "UserDocument", doc.id, `وثيقة هوية: ${d.docType}`);
  return Response.json({ document: { id: doc.id, docType: doc.docType, label: doc.label } });
}

/** GET — وثائق هوية المستخدم الحالي */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجلوا الدخول أولاً" }, { status: 401 });
  const documents = await db.userDocument.findMany({
    where: { userId: user.id },
    select: { id: true, docType: true, label: true, dataUrl: true, createdAt: true, updatedAt: true },
    orderBy: { docType: "asc" },
  });
  return Response.json({ documents, avatarUrl: user.avatarUrl ?? null });
}

/** DELETE — حذف الصورة الشخصية أو وثيقة هوية */
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجلوا الدخول أولاً" }, { status: 401 });

  const kind = req.nextUrl.searchParams.get("kind");
  const docType = req.nextUrl.searchParams.get("docType");

  if (kind === "avatar") {
    await db.user.update({ where: { id: user.id }, data: { avatarUrl: null } });
    await audit(user.id, "DELETE", "User", user.id, "حذف الصورة الشخصية");
    return Response.json({ ok: true });
  }

  if (kind === "identity" && docType) {
    const parsed = z.enum(DOC_TYPES).safeParse(docType);
    if (!parsed.success) return Response.json({ error: "نوع وثيقة غير صالح" }, { status: 400 });
    await db.userDocument.deleteMany({ where: { userId: user.id, docType: parsed.data } });
    await audit(user.id, "DELETE", "UserDocument", undefined, `حذف وثيقة: ${parsed.data}`);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "طلب غير صالح" }, { status: 400 });
}
