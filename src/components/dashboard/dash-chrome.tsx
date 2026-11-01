"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Wallet, HandCoins, CalendarDays, FileText,
  BarChart3, Settings, LogOut, Menu, X, Building2, ShieldCheck,
  Landmark, ChevronDown, Inbox, Sparkles,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useDash, useSelectedAssociation } from "./dash-context";

const NAV = [
  { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/dashboard/members", label: "الأعضاء والانخراطات", icon: Users },
  { href: "/dashboard/accounting", label: "المحاسبة", icon: Wallet },
  { href: "/dashboard/donations", label: "التبرعات والوصولات", icon: HandCoins },
  { href: "/dashboard/events", label: "الفعاليات", icon: CalendarDays },
  { href: "/dashboard/documents", label: "الوثائق", icon: FileText },
  { href: "/dashboard/reports", label: "التقارير", icon: BarChart3 },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { associationId, canFinance } = useDash();
  const assoc = useSelectedAssociation();

  const links = NAV.filter((n) => {
    if (!associationId) return n.href === "/dashboard" || n.href === "/dashboard/settings";
    if (n.href === "/dashboard/accounting" && !canFinance && assoc?.roleInAssociation !== "SECRETARY") return true;
    return true;
  });

  return (
    <nav className="flex-1 space-y-1 px-3 py-4" aria-label="تنقل لوحة التحكم">
      {links.map((n) => {
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-bold transition-colors",
              active
                ? "bg-gold text-[#10231b] shadow-md"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white"
            )}
          >
            <n.icon className="size-4.5 shrink-0" />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardChrome({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, associations, associationId, setAssociationId, isSuper } = useDash();
  const assoc = useSelectedAssociation();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.push("/login");
    router.refresh();
  }

  const initials = user.name.trim().slice(0, 2);

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* الشريط الجانبي — سطح المكتب */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gradient-dark zellige-pattern lg:flex">
        <div className="flex h-16 items-center justify-center border-b border-white/10">
          <Logo light />
        </div>
        <SidebarNav />
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-bold text-sidebar-foreground/60 transition-colors hover:text-white"
          >
            <Building2 className="size-4" />
            العودة إلى الموقع العمومي
          </Link>
        </div>
      </aside>

      {/* القائمة الجانبية — جوال */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-72 gradient-dark zellige-pattern flex flex-col msg-in">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <Logo light />
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-white hover:bg-white/10" aria-label="إغلاق">
                <X className="size-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* المحتوى */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* الشريط العلوي */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setOpen(true)} aria-label="فتح القائمة">
            <Menu className="size-5" />
          </button>

          {/* مبدل الجمعيات */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="max-w-[280px] gap-2 font-bold" disabled={associations.length === 0}>
                <Building2 className="size-4 text-primary" />
                <span className="truncate">{assoc?.name ?? (isSuper ? "كل الجمعيات" : "لا جمعية بعد")}</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel className="flex items-center gap-2 text-[12px]">
                <ShieldCheck className="size-3.5 text-primary" />
                جمعياتكم ({associations.length})
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {associations.map((a) => (
                <DropdownMenuItem
                  key={a.id}
                  onClick={() => setAssociationId(a.id)}
                  className={cn("gap-2", a.id === associationId && "bg-secondary")}
                >
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="truncate font-bold">{a.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{a.roleLabel}</Badge>
                  </div>
                </DropdownMenuItem>
              ))}
              {isSuper && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-primary">
                      <Landmark className="size-4" />
                      لوحة إدارة المنصة
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings#new" className="flex items-center gap-2 font-bold">
                  <Inbox className="size-4" />
                  تسجيل جمعية جديدة
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {assoc && !assoc.isVerified && (
            <Badge variant="outline" className="hidden border-yellow-600/40 bg-yellow-50 text-[11px] font-bold text-yellow-800 sm:inline-flex">
              قيد التوثيق
            </Badge>
          )}

          <div className="flex-1" />

          <Button asChild variant="ghost" size="sm" className="hidden gap-2 font-bold text-primary sm:flex">
            <Link href="/assistant">
              <Sparkles className="size-4" />
              المساعد الجمعوي
            </Link>
          </Button>

          {/* قائمة المستخدم */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none ring-primary focus-visible:ring-2" aria-label="قائمة الحساب">
                <Avatar className="size-9 border-2 border-primary/30">
                  <AvatarFallback className="bg-secondary text-[13px] font-black text-primary">{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p className="font-extrabold">{user.name}</p>
                <p className="text-[11px] font-normal text-muted-foreground" dir="ltr">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="gap-2 font-bold text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
