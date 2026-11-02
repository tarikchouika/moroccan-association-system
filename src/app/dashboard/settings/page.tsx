"use client";

/**
 * الإعدادات والملف — صورة المستخدم، وثائق الهوية (CNDP)،
 * لوغو الجمعية، وتسجيل جمعية جديدة (#new).
 */
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UserCircle2, Loader2, ShieldCheck, IdCard, BookUser, Car, Building2,
  Upload, Trash2, ImagePlus, Plus, BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDash, useSelectedAssociation } from "@/components/dashboard/dash-context";
import { useI18n } from "@/lib/i18n/provider";
import { fileToResizedDataUrl, RESIZE_PRESETS } from "@/lib/image-upload";

interface IdentityDoc {
  id: string;
  docType: string;
  label: string | null;
  dataUrl: string;
}

const DOC_META: { type: "NATIONAL_ID" | "PASSPORT" | "DRIVERS_LICENSE"; icon: typeof IdCard }[] = [
  { type: "NATIONAL_ID", icon: IdCard },
  { type: "PASSPORT", icon: BookUser },
  { type: "DRIVERS_LICENSE", icon: Car },
];

export default function SettingsPage() {
  const { user, associationId, canManage } = useDash();
  const assoc = useSelectedAssociation();
  const { d } = useI18n();
  const t = d.dash.settings;
  const { toast } = useToast();
  const qc = useQueryClient();

  const avatarInput = useRef<HTMLInputElement>(null);
  const logoInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"avatar" | "logo" | `doc:${string}` | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // نموذج جمعية جديدة
  const [newAssoc, setNewAssoc] = useState({
    name: "", acronym: "", category: "تنموية", city: "", region: "",
    description: "", mission: "", address: "", email: "", phone: "", website: "",
    foundedAt: "", legalStatus: "DECLARED", iceNumber: "",
    presidentName: "", presidentEmail: "", presidentPassword: "", logoUrl: "",
  });

  const { data: docsData } = useQuery<{ documents: IdentityDoc[]; avatarUrl: string | null }>({
    queryKey: ["myDocs"],
    queryFn: async () => {
      const res = await fetch("/api/uploads");
      if (!res.ok) return { documents: [], avatarUrl: null };
      return res.json();
    },
  });
  const docs = docsData?.documents ?? [];
  const effectiveAvatar = avatarUrl ?? docsData?.avatarUrl ?? null;
  const effectiveLogo = logoUrl; // يُحدَّث بعد الجلب الخفيف أدناه

  // جلب لوغو الجمعية الحالية (خفيف)
  const { data: assocDetail } = useQuery<{ logoUrl: string | null }>({
    queryKey: ["assocLogo", associationId],
    queryFn: async () => {
      const res = await fetch(`/api/stats?associationId=${associationId}`);
      if (!res.ok) return { logoUrl: null };
      return res.json();
    },
    enabled: !!associationId,
  });
  const shownLogo = effectiveLogo ?? assocDetail?.logoUrl ?? null;

  // ---------- الصورة الشخصية ----------
  async function onAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy("avatar");
    try {
      const dataUrl = await fileToResizedDataUrl(file, RESIZE_PRESETS.avatar);
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "avatar", dataUrl }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      setAvatarUrl(dataUrl);
      toast({ title: t.toastAvatarUpdated });
    } catch (err) {
      toast({ title: t.toastAvatarFailed, description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  }

  async function removeAvatar() {
    setBusy("avatar");
    try {
      const res = await fetch("/api/uploads?kind=avatar", { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setAvatarUrl(null);
      qc.invalidateQueries({ queryKey: ["myDocs"] });
      toast({ title: t.toastDocDeleted });
    } catch (err) {
      toast({ title: t.toastAvatarFailed, description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  }

  // ---------- وثائق الهوية ----------
  async function onDocPick(e: React.ChangeEvent<HTMLInputElement>, docType: string) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(`doc:${docType}`);
    try {
      const dataUrl = await fileToResizedDataUrl(file, RESIZE_PRESETS.identity);
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "identity", docType, dataUrl }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      qc.invalidateQueries({ queryKey: ["myDocs"] });
      toast({ title: t.toastDocUploaded });
    } catch (err) {
      toast({ title: t.toastDocFailed, description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  }

  async function removeDoc(docType: string) {
    setBusy(`doc:${docType}`);
    try {
      const res = await fetch(`/api/uploads?kind=identity&docType=${docType}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      qc.invalidateQueries({ queryKey: ["myDocs"] });
      toast({ title: t.toastDocDeleted });
    } catch (err) {
      toast({ title: t.toastDocFailed, description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  }

  // ---------- لوغو الجمعية ----------
  async function onLogoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !associationId) return;
    setBusy("logo");
    try {
      const dataUrl = await fileToResizedDataUrl(file, RESIZE_PRESETS.logo);
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "logo", associationId, dataUrl }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      setLogoUrl(dataUrl);
      toast({ title: t.toastLogoUpdated });
    } catch (err) {
      toast({ title: t.toastLogoFailed, description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  }

  // ---------- تسجيل جمعية جديدة ----------
  const newAssocLogoInput = useRef<HTMLInputElement>(null);
  const [newAssocLogo, setNewAssocLogo] = useState<string | null>(null);

  async function onNewAssocLogoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await fileToResizedDataUrl(file, RESIZE_PRESETS.logo);
      setNewAssocLogo(dataUrl);
      setNewAssoc((f) => ({ ...f, logoUrl: dataUrl }));
    } catch (err) {
      toast({ title: t.toastLogoFailed, description: err instanceof Error ? err.message : "", variant: "destructive" });
    }
  }

  const createAssoc = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/associations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAssoc, logoUrl: newAssoc?.logoUrl ?? "" }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      return j;
    },
    onSuccess: () => {
      toast({ title: t.toastAssocCreated });
      setNewAssoc({
        name: "", acronym: "", category: "تنموية", city: "", region: "",
        description: "", mission: "", address: "", email: "", phone: "", website: "",
        foundedAt: "", legalStatus: "DECLARED", iceNumber: "",
        presidentName: "", presidentEmail: "", presidentPassword: "", logoUrl: "",
      });
      setNewAssocLogo(null);
      routerRefresh();
    },
    onError: (e: Error) => toast({ title: t.toastAssocFailed, description: e.message, variant: "destructive" }),
  });

  function routerRefresh() {
    // تحديث بيانات الجلسة (قائمة الجمعيات في الشريط) عبر إعادة تحميل ناعمة
    qc.invalidateQueries({});
    window.setTimeout(() => window.location.reload(), 900);
  }

  const initials = user.name.trim().slice(0, 2);
  const docLabel = (type: string) =>
    type === "NATIONAL_ID" ? t.docNationalId : type === "PASSPORT" ? t.docPassport : t.docDriversLicense;

  const canSubmitAssoc =
    newAssoc.name.trim().length >= 4 &&
    newAssoc.description.trim().length >= 30 &&
    newAssoc.city.trim().length >= 2 &&
    newAssoc.region.trim().length >= 2 &&
    newAssoc.presidentName.trim().length >= 3 &&
    /.+@.+\..+/.test(newAssoc.presidentEmail) &&
    newAssoc.presidentPassword.length >= 8;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* الملف الشخصي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCircle2 className="size-5 text-primary" />
            {t.profileTitle}
          </CardTitle>
          <CardDescription>{t.profileDesc}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-5">
          <Avatar className="size-20 border-2 border-primary/25">
            {effectiveAvatar ? <AvatarImage src={effectiveAvatar} alt={user.name} /> : null}
            <AvatarFallback className="bg-secondary text-2xl font-black text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="break-words font-extrabold">{user.name}</p>
            <p className="break-all text-[12px] text-muted-foreground" dir="ltr">{user.email}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <input ref={avatarInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onAvatarPick} />
              <Button size="sm" variant="outline" className="gap-2 font-bold" onClick={() => avatarInput.current?.click()} disabled={busy === "avatar"}>
                {busy === "avatar" ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
                {t.avatarChange}
              </Button>
              {effectiveAvatar && (
                <Button size="sm" variant="ghost" className="gap-2 font-bold text-destructive hover:text-destructive" onClick={removeAvatar} disabled={busy === "avatar"}>
                  <Trash2 className="size-4" />
                  {t.avatarRemove}
                </Button>
              )}
            </div>
            <p className="pt-1 text-[11px] text-muted-foreground">{t.avatarHint}</p>
          </div>
        </CardContent>
      </Card>

      {/* وثائق الهوية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-5 text-primary" />
            {t.identityTitle}
          </CardTitle>
          <CardDescription>{t.identityDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-lg border border-gold/30 bg-gold-soft/60 p-3 text-[12px] leading-6 text-yellow-900 dark:text-yellow-200">
            {t.identityPrivacy}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {DOC_META.map(({ type, icon: Icon }) => {
              const doc = docs.find((x) => x.docType === type);
              const isBusy = busy === `doc:${type}`;
              return (
                <div key={type} className="flex flex-col gap-2.5 rounded-xl border border-border bg-muted/40 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-[13px] font-extrabold">
                      <Icon className="size-4 text-primary" />
                      {docLabel(type)}
                    </p>
                    {doc ? (
                      <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700">
                        <BadgeCheck className="size-3" />
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">{t.docMissing}</Badge>
                    )}
                  </div>
                  {doc ? (
                    // eslint-disable-next-line @next/next/no-img-element -- وثيقة data URL خاصة
                    <img
                      src={doc.dataUrl}
                      alt={docLabel(type)}
                      className="h-28 w-full rounded-lg border border-border bg-background object-contain"
                    />
                  ) : (
                    <div className="grid h-28 w-full place-items-center rounded-lg border border-dashed border-border bg-background text-muted-foreground/40">
                      <Icon className="size-8" />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    <input
                      id={`doc-input-${type}`}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      hidden
                      onChange={(e) => onDocPick(e, type)}
                    />
                    <label htmlFor={`doc-input-${type}`}>
                      <Button size="sm" variant="outline" className="gap-1.5 text-[12px] font-bold" asChild disabled={isBusy}>
                        <span className="cursor-pointer">
                          {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                          {doc ? t.docReplace : t.docUpload}
                        </span>
                      </Button>
                    </label>
                    {doc && (
                      <Button size="sm" variant="ghost" className="gap-1.5 text-[12px] font-bold text-destructive hover:text-destructive" onClick={() => removeDoc(type)} disabled={isBusy}>
                        <Trash2 className="size-3.5" />
                        {t.docDelete}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ملف الجمعية (لوغو) */}
      {assoc && canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-5 text-primary" />
              {t.assocTitle} — <span className="text-primary">{assoc.name}</span>
            </CardTitle>
            <CardDescription>{t.assocDesc}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-5">
            <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-primary/25 bg-background">
              {shownLogo ? (
                // eslint-disable-next-line @next/next/no-img-element -- لوغو data URL
                <img src={shownLogo} alt={assoc.name} className="size-full object-contain" />
              ) : (
                <span className="text-xl font-black text-primary">{assoc.name.trim().slice(0, 2)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[12px] font-bold text-muted-foreground">{t.logoLabel}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <input ref={logoInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onLogoPick} />
                <Button size="sm" variant="outline" className="gap-2 font-bold" onClick={() => logoInput.current?.click()} disabled={busy === "logo"}>
                  {busy === "logo" ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
                  {t.logoChange}
                </Button>
              </div>
              <p className="pt-1 text-[11px] text-muted-foreground">{t.logoHint}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* تسجيل جمعية جديدة */}
      <Card id="new" className="scroll-mt-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="size-5 text-primary" />
            {t.newAssocTitle}
          </CardTitle>
          <CardDescription>{t.newAssocDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t.formName}</Label>
              <Input value={newAssoc.name} onChange={(e) => setNewAssoc({ ...newAssoc, name: e.target.value })} placeholder={t.formNamePh} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.formAcronym}</Label>
              <Input value={newAssoc.acronym} onChange={(e) => setNewAssoc({ ...newAssoc, acronym: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.formCategory}</Label>
              <Select value={newAssoc.category} onValueChange={(v) => setNewAssoc({ ...newAssoc, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(d.demo.categories).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t.formCity}</Label>
              <Input value={newAssoc.city} onChange={(e) => setNewAssoc({ ...newAssoc, city: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.formRegion}</Label>
              <Select value={newAssoc.region} onValueChange={(v) => setNewAssoc({ ...newAssoc, region: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(d.demo.regions).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t.formDescription}</Label>
              <Textarea rows={3} value={newAssoc.description} onChange={(e) => setNewAssoc({ ...newAssoc, description: e.target.value })} placeholder={t.formDescPh} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t.formMission}</Label>
              <Textarea rows={2} value={newAssoc.mission} onChange={(e) => setNewAssoc({ ...newAssoc, mission: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.formAddress}</Label>
              <Input value={newAssoc.address} onChange={(e) => setNewAssoc({ ...newAssoc, address: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.formIceNumber}</Label>
              <Input dir="ltr" className="text-start" value={newAssoc.iceNumber} onChange={(e) => setNewAssoc({ ...newAssoc, iceNumber: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.formEmail}</Label>
              <Input dir="ltr" className="text-start" type="email" value={newAssoc.email} onChange={(e) => setNewAssoc({ ...newAssoc, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.formPhone}</Label>
              <Input dir="ltr" className="text-start" value={newAssoc.phone} onChange={(e) => setNewAssoc({ ...newAssoc, phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.formWebsite}</Label>
              <Input dir="ltr" className="text-start" value={newAssoc.website} onChange={(e) => setNewAssoc({ ...newAssoc, website: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.formFoundedAt}</Label>
              <Input dir="ltr" className="text-start num" type="date" value={newAssoc.foundedAt} onChange={(e) => setNewAssoc({ ...newAssoc, foundedAt: e.target.value })} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t.formLegalStatus}</Label>
              <Select value={newAssoc.legalStatus} onValueChange={(v) => setNewAssoc({ ...newAssoc, legalStatus: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DECLARED">{t.formLegalDeclared}</SelectItem>
                  <SelectItem value="PUBLIC_UTILITY">{t.formLegalPU}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* لوغو الجمعية الجديدة */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t.formLogoLabel}</Label>
              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-border bg-muted/40 p-3.5">
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-background">
                  {newAssocLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- لوغو data URL
                    <img src={newAssocLogo} alt="logo" className="size-full object-contain" />
                  ) : (
                    <ImagePlus className="size-6 text-muted-foreground/40" />
                  )}
                </div>
                <input ref={newAssocLogoInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onNewAssocLogoPick} />
                <Button type="button" size="sm" variant="outline" className="gap-2 font-bold" onClick={() => newAssocLogoInput.current?.click()}>
                  <Upload className="size-4" />
                  {t.logoChange}
                </Button>
                <p className="text-[11px] text-muted-foreground">{t.logoHint}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{t.formPresidentName}</Label>
              <Input value={newAssoc.presidentName} onChange={(e) => setNewAssoc({ ...newAssoc, presidentName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.formPresidentEmail}</Label>
              <Input dir="ltr" className="text-start" type="email" value={newAssoc.presidentEmail} onChange={(e) => setNewAssoc({ ...newAssoc, presidentEmail: e.target.value })} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{t.formPresidentPassword}</Label>
              <Input dir="ltr" className="text-start" type="password" value={newAssoc.presidentPassword} onChange={(e) => setNewAssoc({ ...newAssoc, presidentPassword: e.target.value })} />
              <p className="text-[11px] text-muted-foreground">{t.formPresidentHint}</p>
            </div>
          </div>
          <div className="mt-5">
            <Button
              className="gap-2 font-extrabold"
              onClick={() => createAssoc.mutate()}
              disabled={createAssoc.isPending || !canSubmitAssoc}
            >
              {createAssoc.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {createAssoc.isPending ? t.formSubmitting : t.formSubmit}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
