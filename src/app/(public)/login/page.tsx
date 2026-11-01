import type { Metadata } from "next";
import { LoginForm } from "@/components/site/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجلوا الدخول إلى لوحة التحكم في منصة مامب.",
  alternates: { canonical: "/login/" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <LoginForm />;
}
