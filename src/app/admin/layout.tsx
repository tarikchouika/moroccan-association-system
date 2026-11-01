import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة إدارة المنصة",
  description: "لوحة تحكم مدير منصة مامب — إحصائيات شاملة وإدارة جميع الجمعيات المسجلة.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
