/**
 * GET /api/messaging/contacts — دليل المراسلة
 * المنخرطون النشيطون (أفراد الجمعيات والمتطوعون) + طاقم المنصة،
 * مع حالة الاتصال الحية من مركز المراسلة (بلا محتوى رسائل).
 */
import { NextRequest } from "next/server";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";
import { isOnline } from "@/lib/messaging/hub";
import { isChatEligible, listChatContacts } from "@/lib/messaging/eligibility";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (!(await isChatEligible(user))) {
    return forbidden("المراسلة متاحة للمنخرطين النشيطين وطاقم المنصة");
  }

  const q = req.nextUrl.searchParams.get("q") ?? "";
  const contacts = await listChatContacts(user.id, q);

  return Response.json({
    contacts: contacts.map((c) => ({
      ...c,
      online: isOnline(c.id),
    })),
  });
}
