import { redirect } from "next/navigation";
import { getCurrentUser, ASSOCIATION_ROLE_LABELS } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dash-context";
import { DashboardChrome } from "@/components/dashboard/dash-chrome";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // السوبر أدمين: كل الجمعيات للإشراف (يعمل عبر لوحة /admin، وهنا جمعيات عضويته فقط)
  const associations = user.memberships
    .filter((m) => m.status === "ACTIVE" && m.association.status !== "SUSPENDED")
    .map((m) => ({
      id: m.association.id,
      name: m.association.name,
      slug: m.association.slug,
      acronym: null,
      status: m.association.status,
      isVerified: m.association.isVerified ?? false,
      roleInAssociation: m.roleInAssociation,
      roleLabel: ASSOCIATION_ROLE_LABELS[m.roleInAssociation] ?? m.roleInAssociation,
      membershipNumber: m.membershipNumber,
    }));

  return (
    <DashboardShell
      user={{ id: user.id, name: user.fullName, email: user.email, role: user.role }}
      associations={associations}
    >
      <DashboardChrome>{children}</DashboardChrome>
    </DashboardShell>
  );
}
