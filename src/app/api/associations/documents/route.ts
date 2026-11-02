import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isPlatformStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * وثائق الجمعية الرسمية — طاقم إدارة المنصة حصراً
 * يعرض الوثائق المرفقة عند تسجيل الجمعية (القانون الأساسي، محضر التأسيس،
 * وصل الإيداع) لمراجعتها قبل التوثيق. لا تُعرض عمومياً أبداً.
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجلوا الدخول أولاً" }, { status: 401 });
  if (!isPlatformStaff(user.role)) {
    return Response.json({ error: "مراجعة الوثائق من صلاحيات طاقم إدارة المنصة" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!id) return Response.json({ error: "معرف الجمعية مطلوب" }, { status: 400 });

  const association = await db.association.findUnique({
    where: { id },
    select: { id: true, name: true, slug: true, status: true, isVerified: true },
  });
  if (!association) return Response.json({ error: "الجمعية غير موجودة" }, { status: 404 });

  const documents = await db.document.findMany({
    where: { associationId: id },
    select: {
      id: true,
      title: true,
      type: true,
      description: true,
      url: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return Response.json({ association, documents });
}
