"use client";

/**
 * المشاريع والبرامج المشتركة — صفحة لوحة التحكم.
 * إنشاء فعاليات/برامج/مشاريع مشتركة بين الجمعيات والجهات،
 * وإدارة الحالة والمشاركين — متعددة اللغات عبر قاموس dash.projects.
 */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Handshake, Plus, Loader2, Trash2, MapPin, CalendarDays, Globe2, Lock,
  MoreHorizontal, CheckCircle2, XCircle, PlayCircle, Send, Building2,
  Landmark, Briefcase, Globe, Users2, X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useDash } from "@/components/dashboard/dash-context";
import { useI18n } from "@/lib/i18n/provider";
import { fmtDate } from "@/lib/format";

interface Participant {
  id: string;
  associationId: string | null;
  partnerName: string | null;
  partnerType: string;
  partnerRole: string;
  status: string;
  association: { id: string; name: string; slug: string; acronym: string | null; isVerified: boolean } | null;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string | null;
  kind: string;
  category: string;
  objectives: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  city: string | null;
  isPublic: boolean;
  status: string;
  leadAssociationId: string;
  leadAssociation: { id: string; name: string; slug: string; acronym: string | null; isVerified: boolean };
  participants: Participant[];
}

interface DraftParticipant {
  associationId?: string;
  partnerName?: string;
  partnerType: string;
  partnerRole: string;
}

const PARTNER_TYPE_ICONS: Record<string, typeof Landmark> = {
  GOVERNMENT: Landmark,
  PRIVATE: Briefcase,
  NGO: Users2,
  INTERNATIONAL: Globe,
};

export default function ProjectsPage() {
  const { associationId, canManage } = useDash();
  const { d } = useI18n();
  const t = d.dash.projects;
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", objectives: "", kind: "PROJECT",
    category: "تنموية", startDate: "", endDate: "", location: "", city: "", isPublic: true,
  });
  const [drafts, setDrafts] = useState<DraftParticipant[]>([]);
  const [draftAssoc, setDraftAssoc] = useState("");
  const [draftPartner, setDraftPartner] = useState({ partnerName: "", partnerType: "GOVERNMENT", partnerRole: "EXECUTION" });

  const { data, isLoading } = useQuery<{ projects: ProjectItem[] }>({
    queryKey: ["projects", associationId],
    queryFn: async () => {
      const res = await fetch(`/api/projects?scope=mine&associationId=${associationId}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
      return res.json();
    },
    enabled: !!associationId,
  });

  // قائمة الجمعيات النشطة لاختيار المشاركين
  const { data: assocData } = useQuery<{ associations: { id: string; name: string; city: string }[] }>({
    queryKey: ["assocPicker"],
    queryFn: async () => {
      const res = await fetch("/api/associations?scope=public");
      if (!res.ok) return { associations: [] };
      return res.json();
    },
    staleTime: 5 * 60_000,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["projects", associationId] });
  };

  const resetForm = () => {
    setForm((f) => ({ ...f, title: "", description: "", objectives: "", startDate: "", endDate: "", location: "", city: "" }));
    setDrafts([]);
    setDraftAssoc("");
    setDraftPartner({ partnerName: "", partnerType: "GOVERNMENT", partnerRole: "EXECUTION" });
  };

  const create = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/projects?associationId=${associationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          participants: drafts,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      return j;
    },
    onSuccess: () => {
      toast({ title: t.toastCreated });
      setOpen(false);
      resetForm();
      invalidate();
    },
    onError: (e: Error) => toast({ title: t.toastCreateFailed, description: e.message, variant: "destructive" }),
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", id, status }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      return j;
    },
    onSuccess: () => toast({ title: t.toastStatusUpdated }),
    onError: (e: Error) => toast({ title: t.toastStatusFailed, description: e.message, variant: "destructive" }),
    onSettled: invalidate,
  });

  const setParticipant = useMutation({
    mutationFn: async ({ participantId, status }: { participantId: string; status: string }) => {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "participant-status", participantId, status }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      return j;
    },
    onSuccess: () => toast({ title: t.toastParticipantUpdated }),
    onError: (e: Error) => toast({ title: t.toastParticipantFailed, description: e.message, variant: "destructive" }),
    onSettled: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      return j;
    },
    onSuccess: () => toast({ title: t.toastRemoved }),
    onError: (e: Error) => toast({ title: t.toastRemoveFailed, description: e.message, variant: "destructive" }),
    onSettled: invalidate,
  });

  const projects = data?.projects ?? [];

  const kindLabel = (k: string) =>
    k === "EVENT" ? d.projects.kindEvent : k === "PROGRAM" ? d.projects.kindProgram : d.projects.kindProject;
  const statusInfo = (s: string) =>
    ({
      DRAFT: { label: t.statusDraft, cls: "border-gray-200 bg-gray-50 text-gray-600" },
      PUBLISHED: { label: t.statusPublished, cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
      IN_PROGRESS: { label: t.statusInProgress, cls: "border-sky-200 bg-sky-50 text-sky-700" },
      COMPLETED: { label: t.statusCompleted, cls: "border-primary/25 bg-secondary text-primary" },
      CANCELLED: { label: t.statusCancelled, cls: "border-red-200 bg-red-50 text-red-700" },
    })[s] ?? { label: s, cls: "border-border" };
  const partStatusInfo = (s: string) =>
    ({
      PENDING: { label: t.partPending, cls: "border-yellow-200 bg-yellow-50 text-yellow-800" },
      ACTIVE: { label: t.partActive, cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
      DECLINED: { label: t.partDeclined, cls: "border-red-200 bg-red-50 text-red-700" },
    })[s] ?? { label: s, cls: "border-border" };
  const roleLabel = (r: string) =>
    r === "COORDINATION" ? d.projects.roleCoordination
      : r === "FUNDING" ? d.projects.roleFunding
        : r === "SUPPORT" ? d.projects.roleSupport
          : d.projects.roleExecution;

  const pickerAssocs = (assocData?.associations ?? []).filter((a) => a.id !== associationId);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">{t.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="num font-bold">{projects.length}</span> {t.countLabel}
          </p>
        </div>
        {canManage && !!associationId && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 font-extrabold">
                <Plus className="size-4" />
                {t.newBtn}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t.formTitle}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <Label>{t.titleLabel}</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t.titlePh} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t.kindLabel}</Label>
                    <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PROJECT">{d.projects.kindProject}</SelectItem>
                        <SelectItem value="PROGRAM">{d.projects.kindProgram}</SelectItem>
                        <SelectItem value="EVENT">{d.projects.kindEvent}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.categoryLabel}</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(d.demo.categories).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t.startLabel}</Label>
                    <Input dir="ltr" className="text-start num" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.endLabel}</Label>
                    <Input dir="ltr" className="text-start num" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{t.locationLabel}</Label>
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.cityLabel}</Label>
                    <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{t.descLabel}</Label>
                  <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.objectivesLabel}</Label>
                  <Textarea rows={2} value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} placeholder={t.objectivesPh} />
                </div>

                {/* منشئ المشاركين */}
                <div className="space-y-2.5 rounded-xl border border-border bg-muted/40 p-3.5">
                  <div>
                    <p className="text-[13px] font-extrabold">{t.participantsTitle}</p>
                    <p className="mt-0.5 text-[11.5px] leading-5 text-muted-foreground">{t.participantsHint}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <Select value={draftAssoc} onValueChange={setDraftAssoc}>
                      <SelectTrigger className="bg-background"><SelectValue placeholder={t.addAssocLabel} /></SelectTrigger>
                      <SelectContent>
                        {pickerAssocs.map((a) => (
                          <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-1.5 font-bold"
                      disabled={!draftAssoc}
                      onClick={() => {
                        setDrafts((ds) => [...ds, { associationId: draftAssoc, partnerType: "GOVERNMENT", partnerRole: "EXECUTION" }]);
                        setDraftAssoc("");
                      }}
                    >
                      <Plus className="size-4" /> {t.addBtn}
                    </Button>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <Input
                      value={draftPartner.partnerName}
                      onChange={(e) => setDraftPartner({ ...draftPartner, partnerName: e.target.value })}
                      placeholder={t.partnerNamePh}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-1.5 font-bold"
                      disabled={draftPartner.partnerName.trim().length < 2}
                      onClick={() => {
                        setDrafts((ds) => [...ds, { ...draftPartner, partnerName: draftPartner.partnerName.trim() }]);
                        setDraftPartner({ partnerName: "", partnerType: "GOVERNMENT", partnerRole: "EXECUTION" });
                      }}
                    >
                      <Plus className="size-4" /> {t.addBtn}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={draftPartner.partnerType} onValueChange={(v) => setDraftPartner({ ...draftPartner, partnerType: v })}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GOVERNMENT">{d.projects.partnerGovernment}</SelectItem>
                        <SelectItem value="PRIVATE">{d.projects.partnerPrivate}</SelectItem>
                        <SelectItem value="NGO">{d.projects.partnerNgo}</SelectItem>
                        <SelectItem value="INTERNATIONAL">{d.projects.partnerInternational}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={draftPartner.partnerRole} onValueChange={(v) => setDraftPartner({ ...draftPartner, partnerRole: v })}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COORDINATION">{d.projects.roleCoordination}</SelectItem>
                        <SelectItem value="FUNDING">{d.projects.roleFunding}</SelectItem>
                        <SelectItem value="EXECUTION">{d.projects.roleExecution}</SelectItem>
                        <SelectItem value="SUPPORT">{d.projects.roleSupport}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {drafts.length > 0 && (
                    <ul className="space-y-1.5">
                      {drafts.map((p, i) => {
                        const name = p.associationId
                          ? pickerAssocs.find((a) => a.id === p.associationId)?.name ?? "—"
                          : p.partnerName ?? "—";
                        const Icon = p.associationId ? Building2 : (PARTNER_TYPE_ICONS[p.partnerType] ?? Landmark);
                        return (
                          <li key={i} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-[12.5px] font-bold">
                            <span className="flex min-w-0 items-center gap-2">
                              <Icon className="size-4 shrink-0 text-primary" />
                              <span className="truncate">{name}</span>
                              {!p.associationId && (
                                <Badge variant="secondary" className="shrink-0 text-[10px]">{roleLabel(p.partnerRole)}</Badge>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => setDrafts((ds) => ds.filter((_, j) => j !== i))}
                              className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                              aria-label={t.removeBtn}
                            >
                              <X className="size-3.5" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/40 p-3 text-[12px]">
                  <Checkbox checked={form.isPublic} onCheckedChange={(v) => setForm({ ...form, isPublic: v === true })} className="mt-0.5" />
                  <span>
                    <span className="block font-bold">{t.publicLabel}</span>
                    <span className="text-muted-foreground">{t.publicHint}</span>
                  </span>
                </label>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => create.mutate()}
                  disabled={create.isPending || form.title.trim().length < 4}
                  className="font-extrabold"
                >
                  {create.isPending && <Loader2 className="me-2 size-4 animate-spin" />}
                  {t.submitBtn}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!associationId ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Building2 className="size-10 text-muted-foreground/40" />
            <p className="font-bold">{d.dash.menu.noAssociation}</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-7 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Handshake className="size-10 text-muted-foreground/40" />
            <p className="font-bold">{t.emptyTitle}</p>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">{t.emptyDesc}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => {
            const st = statusInfo(p.status);
            const isLead = p.leadAssociationId === associationId;
            return (
              <Card key={p.id}>
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-wrap gap-1.5">
                      <Badge variant="outline" className={`text-[10px] ${st.cls}`}>{st.label}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{kindLabel(p.kind)}</Badge>
                      {p.isPublic ? (
                        <Badge variant="outline" className="gap-1 border-primary/25 bg-secondary text-[10px] text-primary">
                          <Globe2 className="size-3" />
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-border text-[10px] text-muted-foreground">
                          <Lock className="size-3" />
                        </Badge>
                      )}
                    </div>
                    {isLead && canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-label={d.dash.menu.accountMenu}>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {p.status === "DRAFT" && (
                            <DropdownMenuItem onClick={() => setStatus.mutate({ id: p.id, status: "PUBLISHED" })} className="gap-2 font-bold">
                              <Send className="size-4 text-primary" /> {t.actionPublish}
                            </DropdownMenuItem>
                          )}
                          {p.status !== "IN_PROGRESS" && p.status !== "COMPLETED" && (
                            <DropdownMenuItem onClick={() => setStatus.mutate({ id: p.id, status: "IN_PROGRESS" })} className="gap-2 font-bold">
                              <PlayCircle className="size-4 text-sky-600" /> {t.actionStart}
                            </DropdownMenuItem>
                          )}
                          {p.status !== "COMPLETED" && (
                            <DropdownMenuItem onClick={() => setStatus.mutate({ id: p.id, status: "COMPLETED" })} className="gap-2 font-bold">
                              <CheckCircle2 className="size-4 text-emerald-600" /> {t.actionComplete}
                            </DropdownMenuItem>
                          )}
                          {p.status !== "CANCELLED" && (
                            <DropdownMenuItem onClick={() => setStatus.mutate({ id: p.id, status: "CANCELLED" })} className="gap-2 font-bold">
                              <XCircle className="size-4 text-red-600" /> {t.actionCancel}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => confirm(t.confirmDelete) && remove.mutate(p.id)}
                            className="gap-2 font-bold text-destructive focus:text-destructive"
                          >
                            <Trash2 className="size-4" /> {t.actionDelete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <h3 className="mb-1.5 font-extrabold leading-snug">{p.title}</h3>
                  <p className="mb-3 text-[12px] leading-6 text-muted-foreground">
                    <CalendarDays className="me-1 inline size-3.5" />
                    {p.startDate ? fmtDate(p.startDate) : "—"}
                    {p.endDate ? ` → ${fmtDate(p.endDate)}` : ""}
                    {p.location && (
                      <>
                        <br />
                        <MapPin className="me-1 inline size-3.5" />
                        {p.location}{p.city ? ` · ${p.city}` : ""}
                      </>
                    )}
                  </p>
                  {p.description && (
                    <p className="mb-3 line-clamp-2 text-[13px] leading-6 text-muted-foreground">{p.description}</p>
                  )}

                  {/* القيادة والمشاركون */}
                  <div className="mt-auto space-y-2 border-t border-border pt-3">
                    <p className="flex flex-wrap items-center gap-1.5 text-[11.5px] font-bold text-muted-foreground">
                      <Landmark className="size-3.5 text-gold" />
                      {d.projects.leadLabel}: <span className="text-foreground">{p.leadAssociation.name}</span>
                      {isLead && <Badge variant="secondary" className="text-[9.5px]">{t.leadLabel}</Badge>}
                    </p>
                    {p.participants.length === 0 ? (
                      <p className="text-[11.5px] text-muted-foreground">{t.noParticipants}</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {p.participants.map((pt) => {
                          const ps = partStatusInfo(pt.status);
                          const Icon = pt.association ? Building2 : (PARTNER_TYPE_ICONS[pt.partnerType] ?? Landmark);
                          const canRespond = !isLead && pt.associationId === associationId && pt.status === "PENDING";
                          return (
                            <li key={pt.id} className="flex min-w-0 flex-wrap items-center gap-1.5 text-[12px]">
                              <Icon className="size-3.5 shrink-0 text-primary" />
                              <span className="min-w-0 truncate font-bold">{pt.association?.name ?? pt.partnerName}</span>
                              <Badge variant="outline" className="text-[9.5px]">{roleLabel(pt.partnerRole)}</Badge>
                              <Badge variant="outline" className={`text-[9.5px] ${ps.cls}`}>{ps.label}</Badge>
                              {canRespond && (
                                <span className="ms-auto flex shrink-0 gap-1">
                                  <button
                                    onClick={() => setParticipant.mutate({ participantId: pt.id, status: "ACTIVE" })}
                                    className="rounded-md p-1 text-emerald-600 hover:bg-emerald-50"
                                    title={t.partActive}
                                  >
                                    <CheckCircle2 className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => setParticipant.mutate({ participantId: pt.id, status: "DECLINED" })}
                                    className="rounded-md p-1 text-red-600 hover:bg-red-50"
                                    title={t.partDeclined}
                                  >
                                    <XCircle className="size-4" />
                                  </button>
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
