"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/logo";
import { useI18n, useDocumentTitle } from "@/lib/i18n/provider";

export function LoginForm() {
  const { d } = useI18n();
  useDocumentTitle(d.meta.pages.login);
  const t = d.auth.login;
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
      if (!res.ok && (res.status === 404 || res.status === 405)) {
        throw new Error("api-unavailable");
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || t.errorNetwork);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error && e.message === "api-unavailable"
          ? t.errorApiUnavailable
          : t.errorNetwork
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
        <h1 className="text-2xl font-black">{t.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.subtitle}</p>
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
              <Label htmlFor="email">{t.email}</Label>
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
              <Label htmlFor="password">{t.password}</Label>
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
              {busy ? t.busy : (
                <>
                  <LogIn className="size-4" />
                  {t.submit}
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t.noAccount}{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              {t.createAccount}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
