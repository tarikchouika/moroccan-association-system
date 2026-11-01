import { getCurrentUser } from "@/lib/auth";
import { ASSOCIATION_ROLE_LABELS } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ user: null }, { status: 200 });

  return Response.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      memberships: user.memberships.map((m) => ({
        id: m.id,
        associationId: m.associationId,
        associationName: m.association.name,
        associationSlug: m.association.slug,
        roleInAssociation: m.roleInAssociation,
        roleLabel: ASSOCIATION_ROLE_LABELS[m.roleInAssociation] ?? m.roleInAssociation,
        status: m.status,
        membershipNumber: m.membershipNumber,
      })),
    },
  });
}
