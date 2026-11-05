/**
 * أهلية المراسلة — من يحق له استعمال الدردشة؟
 * (أفراد الجمعيات والمتطوعون المنخرطون نشيطون + طاقم المنصة)
 * الأداة تقرأ من قاعدة البيانات لتصنيف المستخدمين فقط —
 * لا علاقة لها بمحتوى الرسائل (التي لا تُخزَّن إطلاقاً).
 */
import { db } from "@/lib/db";
import { isPlatformStaff } from "@/lib/auth";

export interface ContactInfo {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  platformRole: string;
  /** [{ associationName, roleInAssociation }] */
  associations: { associationName: string; roleInAssociation: string }[];
}

/** هل المستخدم مؤهل للمراسلة؟ (طاقم المنصة أو منخرط نشيط في جمعية نشيطة) */
export async function isChatEligible(user: {
  id: string;
  role: string;
  isActive: boolean;
}): Promise<boolean> {
  if (!user.isActive) return false;
  if (isPlatformStaff(user.role)) return true;
  const m = await db.membership.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
      association: { status: "ACTIVE" },
    },
  });
  return !!m;
}

/** دليل المراسلة: كل المنخرطين النشيطين + طاقم المنصة (بحث اختياري) */
export async function listChatContacts(
  excludeUserId: string,
  q: string
): Promise<ContactInfo[]> {
  const search = q.trim().toLowerCase();

  const memberships = await db.membership.findMany({
    where: { status: "ACTIVE", association: { status: "ACTIVE" } },
    include: {
      user: { select: { id: true, fullName: true, avatarUrl: true, role: true, isActive: true } },
      association: { select: { name: true } },
    },
    take: 500,
  });

  const byUser = new Map<string, ContactInfo>();
  for (const m of memberships) {
    if (!m.user.isActive || m.user.id === excludeUserId) continue;
    const entry =
      byUser.get(m.user.id) ??
      {
        id: m.user.id,
        fullName: m.user.fullName,
        avatarUrl: m.user.avatarUrl,
        platformRole: m.user.role,
        associations: [],
      };
    entry.associations.push({
      associationName: m.association.name,
      roleInAssociation: m.roleInAssociation,
    });
    byUser.set(m.user.id, entry);
  }

  // طاقم المنصة (حتى بلا انخراط)
  const staff = await db.user.findMany({
    where: { isActive: true, role: { in: ["SUPER_ADMIN", "ASSOCIATION_ADMIN", "CO_ADMIN", "ACCOUNTANT"] } },
    select: { id: true, fullName: true, avatarUrl: true, role: true },
  });
  for (const u of staff) {
    if (u.id === excludeUserId) continue;
    if (!byUser.has(u.id)) {
      byUser.set(u.id, {
        id: u.id,
        fullName: u.fullName,
        avatarUrl: u.avatarUrl,
        platformRole: u.role,
        associations: [],
      });
    }
  }

  let list = [...byUser.values()];
  if (search) {
    list = list.filter(
      (c) =>
        c.fullName.toLowerCase().includes(search) ||
        c.associations.some(
          (a) =>
            a.associationName.toLowerCase().includes(search) ||
            a.roleInAssociation.toLowerCase().includes(search)
        )
    );
  }

  // ترتيب ثابت: الاسم
  list.sort((a, b) => a.fullName.localeCompare(b.fullName, "ar"));
  return list.slice(0, 300);
}
