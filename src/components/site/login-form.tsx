"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/logo";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "تعذر تسجيل الدخول");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم. تحققوا من الشبكة.");
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
        <h1 className="text-2xl font-black">مرحباً بعودتكم</h1>
        <p className="mt-2 text-sm text-muted-foreground">سجلوا الدخول للوصول إلى لوحة التحكم الخاصة بكم</p>
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
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  dir="ltr"
                  className="ps-9 text-start"
                  placeholder="name@example.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2 font-extrabold" size="lg" disabled={busy}>
              {busy ? "جارٍ التحقق..." : (
                <>
                  <LogIn className="size-4" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ليست لديكم حساب؟{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              أنشئوا حساباً مجانياً
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* حسابات تجريبية */}
      <div className="mt-6 rounded-xl border border-dashed border-primary/30 bg-secondary/50 p-4 text-[12px] leading-6">
        <p className="mb-2 flex items-center gap-1.5 font-extrabold text-primary">
          <Info className="size-4" />
          حسابات تجريبية للنسخة المحلية (كلمة السر: <span className="num">Mamp@2026</span>)
        </p>
        <ul className="grid grid-cols-1 gap-1 text-muted-foreground sm:grid-cols-2" dir="ltr">
          <li>admin@mamp.ma — سوبر أدمين</li>
          <li>user1@mamp.ma — رئيسة جمعية</li>
          <li>user2@mamp.ma — أمين مال</li>
          <li>partenaire@mamp.ma — جهة شريكة</li>
        </ul>
        <p className="mt-2 text-[11px] text-muted-foreground/80">
          على النسخة المنشورة (mamp.pages.dev) تعمل لوحات العرض ببيانات تجريبية دون تسجيل دخول.
        </p>
      </div>
    </div>
  );
}
