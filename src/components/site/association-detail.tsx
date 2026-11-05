"use client";

import Link from "next/link";
import {
  MapPin, CalendarDays, Users, HandCoins, BadgeCheck,
  Building2, ScrollText, Hash, HeartHandshake, ShieldCheck, Landmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DemoAssociation, DemoEvent } from "@/generated/types";
import { useI18n, useDemoI18n, useDocumentTitle } from "@/lib/i18n/provider";

/** جسم صفحة الجمعية — مكون عميل ليتفاعل مع تغيير اللغة */
export function AssociationDetailBody({
  association: a,
  events,
}: {
  association: DemoAssociation;
  events: DemoEvent[];
}) {
  const { d } = useI18n();
  const demo = useDemoI18n();
  useDocumentTitle(demo.assocName(a));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* رأس الجمعية */}
      <div className="gradient-dark zellige-pattern mb-8 overflow-hidden rounded-3xl p-8 text-white sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            {a.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- لوغو data URL من قاعدة البيانات
              <img
                src={a.logoUrl}
                alt={demo.assocName(a)}
                className="size-20 shrink-0 rounded-2xl border border-white/15 bg-white/95 object-contain p-1.5"
              />
            ) : (
              <span className="grid size-20 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-2xl font-black text-gold">
                {demo.assocAcronym(a)?.slice(0, 2) || a.name.slice(0, 2)}
              </span>
            )}
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {a.isVerified && (
                  <Badge className="gap-1 border-gold/40 bg-gold/20 text-[11px] font-bold text-gold">
                    <BadgeCheck className="size-3.5" /> {d.associationDetail.verifiedBadge}
                  </Badge>
                )}
                {a.legalStatus === "PUBLIC_UTILITY" && (
                  <Badge variant="outline" className="border-white/25 bg-white/10 text-[11px] font-bold text-white">
                    <Landmark className="size-3.5" /> {d.associationDetail.publicUtilityBadge}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-black sm:text-3xl">{demo.assocName(a)}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                <span className="flex items-center gap-1"><MapPin className="size-4" />{demo.city(a.city)} — {demo.region(a.region)}</span>
                {a.foundedAt && (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-4" />
                    {d.associationDetail.foundedIn} <span className="num">{new Date(a.foundedAt).getFullYear()}</span>
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <Button asChild size="lg" className="h-12 gap-2 bg-gold px-6 font-extrabold text-[#061229] hover:bg-gold/90">
              <Link href={`/associations/${a.slug}#donate`}>
                <HeartHandshake className="size-5" />
                {d.associationDetail.donateBtn}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 gap-2 border-white/25 bg-transparent px-6 font-extrabold text-white hover:bg-white/10 hover:text-white">
              <Link href={`/associations/${a.slug}#join`}>
                <Users className="size-5" />
                {d.associationDetail.joinBtn}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* المحتوى الرئيسي */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold">
                <ScrollText className="size-5 text-primary" />
                {d.associationDetail.aboutTitle}
              </h2>
              <p className="text-[15px] leading-8 text-muted-foreground">{demo.assocDescription(a)}</p>
              {a.mission && (
                <div className="mt-6 rounded-xl border border-primary/15 bg-secondary/60 p-5">
                  <h3 className="mb-2 flex items-center gap-2 text-base font-extrabold text-primary">
                    <ShieldCheck className="size-4" />
                    {d.associationDetail.missionTitle}
                  </h3>
                  <p className="text-sm leading-7 text-foreground/80">{demo.assocMission(a)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* الفعاليات */}
          {events.length > 0 && (
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold">
                  <CalendarDays className="size-5 text-primary" />
                  {d.associationDetail.upcomingEvents}
                </h2>
                <div className="space-y-3">
                  {events.map((e) => (
                    <div
                      key={e.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/30"
                    >
                      <div>
                        <p className="font-extrabold">{demo.eventTitle(e)}</p>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                          {demo.eventLocation(e)} · {demo.fmtDate(e.startDate)}
                        </p>
                      </div>
                      <Badge variant="secondary">{demo.eventCategory(e.category)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* نداء الانخراط */}
          <Card id="join" className="scroll-mt-24">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
              <div>
                <h2 className="mb-1.5 text-xl font-extrabold">
                  {d.associationDetail.joinCardTitle} {demo.assocAcronym(a) || demo.assocName(a)}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  {d.associationDetail.joinCardDesc}
                </p>
              </div>
              <Button asChild size="lg" className="h-12 gap-2 px-6 font-extrabold">
                <Link href="/register">
                  {d.associationDetail.joinBtn}
                  <span className="inline-block rtl:rotate-0 ltr:rotate-180">←</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* العمود الجانبي */}
        <div className="space-y-6">
          {/* بطاقة الهوية الرقمية */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold">
                <Hash className="size-4 text-primary" />
                {d.associationDetail.identityTitle}
              </h3>
              <dl className="space-y-3 text-sm">
                {[
                  [d.associationDetail.fieldCategory, demo.category(a.category)],
                  [d.associationDetail.fieldCity, demo.city(a.city)],
                  [d.associationDetail.fieldRegion, demo.region(a.region)],
                  ...(a.foundedAt ? [[d.associationDetail.fieldFoundedYear, String(new Date(a.foundedAt).getFullYear())]] : []),
                  ...(a.iceNumber ? [[d.associationDetail.fieldIce, a.iceNumber]] : []),
                  [d.associationDetail.fieldLegalStatus, a.legalStatus === "PUBLIC_UTILITY" ? d.associationDetail.statusPublicUtility : d.associationDetail.statusDeclared],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 border-b border-border/70 pb-2.5 last:border-0">
                    <dt className="text-muted-foreground font-bold">{k}</dt>
                    <dd className="font-extrabold">{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* مؤشرات */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, label: d.associationDetail.activeMembers, value: String(a.memberCount) },
              { icon: HandCoins, label: d.associationDetail.registeredDonations, value: String(a.donationCount) },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-5 text-center">
                  <s.icon className="mx-auto mb-2 size-6 text-primary" />
                  <p className="num text-2xl font-black">{s.value}</p>
                  <p className="mt-1 text-[12px] font-bold text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* بطاقة التبرع — مع وسائل الاستقبال الفعلية عند تفعيلها */}
          <Card id="donate" className="scroll-mt-24 overflow-hidden">
            <div className="gradient-dark zellige-pattern p-6 text-white">
              <HeartHandshake className="mb-3 size-8 text-gold" />
              <h3 className="text-lg font-extrabold">{d.associationDetail.donateCardTitle}</h3>
              <p className="mt-2 text-[13px] leading-6 text-white/75">
                {d.associationDetail.donateCardDesc}
              </p>

              {a.donationsEnabled ? (
                <div className="mt-4 space-y-2.5 text-[12px] leading-6">
                  <p className="font-extrabold text-gold">{d.associationDetail.receptionTitle}</p>
                  {a.donationBankName && a.donationRib && (
                    <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                      <p className="flex items-center gap-1.5 font-bold text-white/90">
                        <Landmark className="size-3.5 text-gold" /> {d.associationDetail.receptionBank}
                      </p>
                      <p className="mt-1 text-white/75">{a.donationBankName}</p>
                      <p className="num mt-0.5 font-bold tracking-wider text-white" dir="ltr">{a.donationRib}</p>
                    </div>
                  )}
                  {a.donationCcp && (
                    <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                      <p className="font-bold text-white/90">{d.associationDetail.receptionCcp}</p>
                      <p className="num mt-0.5 font-bold text-white" dir="ltr">{a.donationCcp}</p>
                    </div>
                  )}
                  {a.donationOnlineUrl && (
                    <a
                      href={a.donationOnlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-gold/40 bg-gold/15 p-3 font-bold text-gold hover:bg-gold/25"
                    >
                      {d.associationDetail.receptionOnline} ↗
                    </a>
                  )}
                  {a.donationInstructions && (
                    <p className="rounded-lg border border-white/15 bg-white/5 p-3 text-white/75">
                      {a.donationInstructions}
                    </p>
                  )}
                  {a.acceptInKind && a.inKindNeeds && (
                    <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                      <p className="font-bold text-white/90">{d.associationDetail.receptionInKind}</p>
                      <p className="mt-1 text-white/75">{a.inKindNeeds}</p>
                    </div>
                  )}
                  <p className="text-[11px] leading-5 text-white/50">{d.associationDetail.receptionEnabled}</p>
                </div>
              ) : (
                <p className="mt-3 rounded-lg border border-white/15 bg-white/5 p-3 text-[11px] leading-5 text-white/60">
                  {d.associationDetail.donateCardNote}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
