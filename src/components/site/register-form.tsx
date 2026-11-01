"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Phone, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/site/logo";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!consent) {
      setError("يجب الموافقة على معالجة المعطيات وفق القانون 09.08 لإتمام التسجيل");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok && (res.status === 404 || res.status === 405)) {
        throw new Error("api-unavailable");
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "تعذر إنشاء الحساب");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error && e.message === "api-unavailable"
          ? "خدمة التسجيل تعمل على الخادم المحلي للمنصة. هذه هي النسخة العمومية الثابتة — يمكنكم تصفح دليل الجمعيات واستعمال المساعد الجمعوي."
          : "تعذر الاتصال بالخادم. تحققوا من الشبكة."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl font-black">إنشاء حساب جديد</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          مجاني للجميع: المواطنون، المنخرطون، المتطوعون وأعضاء الجمعيات
        </p>
      </div>

      <Card className="shadow-xl border-border/80">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-[13px] font-bold text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  className="ps-9"
                  placeholder="مثال: محمد العلوي"
                  value={form.fullName}
                  onChange={set("fullName")}
                  required
                  minLength={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  dir="ltr"
                  className="ps-9 text-start"
                  placeholder="name@example.ma"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">الهاتف (اختياري)</Label>
              <div className="relative">
                <Phone className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  className="ps-9 text-start"
                  placeholder="+212 6XX XXX XXX"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة السر</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  dir="ltr"
                  className="ps-9 text-start"
                  placeholder="8 أحرف على الأقل مع أرقام"
                  value={form.password}
                  onChange={set("password")}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/40 p-3.5 text-[12px] leading-6">
              <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
              <span className="text-muted-foreground">
                أوافق على{" "}
                <Link href="/legal/privacy" className="font-bold text-primary underline underline-offset-4 hover:text-primary/80">
                  سياسة الخصوصية
                </Link>{" "}
                ومعالجة معطياتي الشخصية لأغراض استعمال المنصة، وفق القانون 09.08
                المتعلق بحماية المعطيات ذات الطابع الشخصي، وعلى{" "}
                <Link href="/legal/terms" className="font-bold text-primary underline underline-offset-4 hover:text-primary/80">
                  شروط الاستخدام
                </Link>. يمكنني سحب موافقتي في أي وقت.
              </span>
            </label>

            <Button type="submit" className="w-full gap-2 font-extrabold" size="lg" disabled={busy}>
              {busy ? "جارٍ الإنشاء..." : (
                <>
                  <UserPlus className="size-4" />
                  إنشاء الحساب
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            لديكم حساب؟{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              سجلوا الدخول
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[12px] text-muted-foreground">
        <ShieldCheck className="size-4 text-primary" />
        كلمات السر مشفرة بمعيار scrypt ولا تُخزن كنص صريح.
      </p>
    </div>
  );
}
