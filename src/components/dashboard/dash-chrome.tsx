"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Wallet, HandCoins, CalendarDays, FileText,
  BarChart3, Settings, LogOut, Menu, X, Building2, ShieldCheck,
  Landmark, ChevronDown, Inbox, Sparkles, Handshake, MessagesSquare, Newspaper,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useDash, useSelectedAssociation } from "./dash-context";
import { useI18n } from "@/lib/i18n/provider";

const NAV_ICONS = {
  overview: LayoutDashboard,
  projects: Handshake,
  members: Users,
  accounting: Wallet,
  donations: HandCoins,
  events: CalendarDays,
  documents: FileText,
  reports: BarChart3,
  messages: MessagesSquare,
  articles: Newspaper,
  settings: Settings,
} as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { associationId, canFinance } = useDash();
  const assoc = useSelectedAssociation();
  const { d } = useI18n();
  const t = d.dash.nav;

  // روابط الشريط — مستندة إلى مفاتيح القاموس مع أيقوناتها
  const links = (
    [
      { href: "/dashboard", key: "overview", label: t.overview },
      { href: "/dashboard/messages", key: "messages", label: t.messages },
      { href: "/dashboard/articles", key: "articles", label: t.articles },
      { href: "/dashboard/projects", key: "projects", label: t.projects },
      { href: "/dashboard/members", key: "members", label: t.members },
      { href: "/dashboard/accounting", key: "accounting", label: t.accounting },
      { href: "/dashboard/donations", key: "donations", label: t.donations },
      { href: "/dashboard/events", key: "events", label: t.events },
      { href: "/dashboard/settings", key: "settings", label: t.settings },
    ] as const
  ).filter((n) => {
    // المراسلة والمقالات والخبرات: متاحان لكل المستخدمين — عبر الجمعيات
    if (n.key === "messages" || n.key === "articles") return true;
    if (!associationId) return n.key === "overview" || n.key === "settings";
    // المحاسبة: للماليين حصراً (رئيس/أمين مال/محاسب المنصة/السوبر) والكاتب العام للتوثيق
    if (n.key === "accounting" && !canFinance && assoc?.roleInAssociation !== "SECRETARY") return false;
    return true;
  });

  return (
    <nav className="flex-1 space-y-1 px-3 py-4" aria-label={d.dash.menu.openMenu}>
      {links.map((n) => {
        const Icon = NAV_ICONS[n.key];
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-bold transition-colors",
              active
                ? "bg-gold text-[#061229] shadow-md"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white"
            )}
          >
            <Icon className="size-4.5 shrink-0" />
            <span className="min-w-0 break-words">{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardChrome({
  children,
  avatarUrl,
}: {
  children: React.ReactNode;
  avatarUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, associations, associationId, setAssociationId, isSuper, isStaff } = useDash();
  const assoc = useSelectedAssociation();
  const { d } = useI18n();
  const m = d.dash.menu;

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
            <Building2 className="size-4 shrink-0" />
            {m.backToSite}
          </Link>
        </div>
      </aside>

      {/* القائمة الجانبية — جوال */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-72 gradient-dark zellige-pattern flex max-w-[85vw] flex-col msg-in">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <Logo light />
              <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-white hover:bg-white/10" aria-label={m.closeMenu}>
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
        <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-border bg-card/90 px-3 backdrop-blur sm:gap-3 sm:px-6">
          <button className="shrink-0 rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setOpen(true)} aria-label={m.openMenu}>
            <Menu className="size-5" />
          </button>

          {/* مبدل الجمعيات — سقف متجاوف كي لا يفيض الشريط على الجوال */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-0 max-w-[150px] gap-1.5 px-2.5 text-[12px] font-bold sm:max-w-[220px] sm:gap-2 sm:px-4 sm:text-sm lg:max-w-[280px]" disabled={associations.length === 0}>
                <Building2 className="hidden size-4 shrink-0 text-primary sm:block" />
                <span className="truncate">{assoc?.name ?? (isSuper ? m.allAssociations : m.noAssociation)}</span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel className="flex items-center gap-2 text-[12px]">
                <ShieldCheck className="size-3.5 text-primary" />
                {m.myAssociations} (<span className="num">{associations.length}</span>)
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
                    <Badge variant="secondary" className="shrink-0 text-[10px]">{a.roleLabel}</Badge>
                  </div>
                </DropdownMenuItem>
              ))}
              {isStaff && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-primary">
                      <Landmark className="size-4" />
                      {m.platformAdmin}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings#new" className="flex items-center gap-2 font-bold">
                  <Inbox className="size-4" />
                  {m.registerNew}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {assoc && !assoc.isVerified && (
            <Badge variant="outline" className="hidden border-yellow-600/40 bg-yellow-50 text-[11px] font-bold text-yellow-800 sm:inline-flex dark:bg-yellow-950/40 dark:text-yellow-300">
              {m.pendingVerification}
            </Badge>
          )}

          <div className="min-w-0 flex-1" />

          <Button asChild variant="ghost" size="sm" className="hidden gap-2 font-bold text-primary lg:flex">
            <Link href="/assistant">
              <Sparkles className="size-4" />
              <span className="hidden xl:inline">{m.assistant}</span>
            </Link>
          </Button>

          <LanguageSwitcher compact />
          <ThemeToggle />

          {/* قائمة المستخدم */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="shrink-0 rounded-full outline-none ring-primary focus-visible:ring-2" aria-label={m.accountMenu}>
                <Avatar className="size-9 border-2 border-primary/30">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-secondary text-[13px] font-black text-primary">{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p className="break-words font-extrabold">{user.name}</p>
                <p className="break-all text-[11px] font-normal text-muted-foreground" dir="ltr">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="gap-2 font-bold">
                  <Settings className="size-4" />
                  {d.dash.nav.settings}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="gap-2 font-bold text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                {m.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
