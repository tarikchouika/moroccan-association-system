import type { Metadata } from "next";
import { RegisterForm } from "@/components/site/register-form";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: "أنشئوا حساباً مجانياً في منصة مامب — للمواطنين والمنخرطين والمتطوعين وأعضاء الجمعيات.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
