"use client";

/**
 * المراسلة الفورية — بين أفراد الجمعيات والمتطوعين وسائر الجمعيات
 * ---------------------------------------------------------------
 * • رسائل نصية وصوتية وصور وملفات — ومكالمات صوت/صوت وصورة (WebRTC).
 * • مبدأ صارم: الرسائل مؤقتة تُستهلك بين الطرفين ولا تُسجَّل في قاعدة البيانات؛
 *   تبقى في ذاكرة هذه الجلسة فقط وتختفي عند التحديث.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MessagesSquare, Search, Send, Paperclip, ImageIcon, Mic, Square, X,
  Phone, Video, PhoneOff, PhoneIncoming, MicOff, VideoOff, Loader2,
  ShieldCheck, FileText, Wifi, WifiOff, ArrowRight, Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n/provider";
import { useDash } from "@/components/dashboard/dash-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  platformRole: string;
  associations: { associationName: string; roleInAssociation: string }[];
  online: boolean;
}

interface UiMsg {
  id: string;
  mine: boolean;
  kind: "TEXT" | "VOICE" | "IMAGE" | "FILE";
  content: string;
  fileName?: string;
  duration?: number;
  ts: number;
}

interface CallSignalEvent {
  id: string;
  from: string;
  to: string;
  type: "OFFER" | "ANSWER" | "ICE" | "ACCEPT" | "DECLINE" | "END";
  payload: { sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit; video?: boolean };
  ts: number;
}

type CallState =
  | { phase: "idle" }
  | { phase: "outgoing"; with: string; video: boolean }
  | { phase: "incoming"; with: string; video: boolean }
  | { phase: "active"; with: string; video: boolean }
  | { phase: "ended"; reason: "declined" | "unavailable" | "ended" | "failed" };

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
};

/** الطرف المقابل في مكالمة غير خاملة (أو null) */
function callPeer(c: CallState): string | null {
  return c.phase === "outgoing" || c.phase === "incoming" || c.phase === "active" ? c.with : null;
}

/** هل المكالمة الحالية بالفيديو؟ */
function callHasVideo(c: CallState): boolean {
  return (c.phase === "outgoing" || c.phase === "incoming" || c.phase === "active") && c.video;
}

/** تحويل data URL إلى Blob URL للتشغيل (يحترم CSP media-src blob:) */
function dataUrlToBlobUrl(dataUrl: string): string {
  const [head, b64] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(head)?.[1] ?? "application/octet-stream";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

/** مشغل صوتي للرسائل الصوتية — يحول عند العرض ويعتق blob عند الإزالة */
function MediaAudio({ content }: { content: string }) {
  const url = useMemo(() => dataUrlToBlobUrl(content), [content]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return <audio controls src={url} className="h-10 max-w-[240px]" />;
}

export default function MessagesPage() {
  const { user } = useDash();
  const { d } = useI18n();
  const t = d.dash.messages;
  const { toast } = useToast();

  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Record<string, UiMsg[]>>({});
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [typingMap, setTypingMap] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [notEligible, setNotEligible] = useState(false);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [sending, setSending] = useState(false);
  const [call, setCall] = useState<CallState>({ phase: "idle" });
  const [remoteReady, setRemoteReady] = useState(false);

  // مراجع الاتصال الحي
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pendingOfferRef = useRef<CallSignalEvent | null>(null);
  const iceQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const ackQueueRef = useRef<Set<string>>(new Set());
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const callRef = useRef<CallState>({ phase: "idle" });
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingThrottleRef = useRef(0);

  activeIdRef.current = activeId;
  callRef.current = call;

  // ---------------------------------------------------------------
  // دليل جهات الاتصال
  // ---------------------------------------------------------------
  const { data: contactsData, refetch: refetchContacts } = useQuery<{ contacts: Contact[] }>({
    queryKey: ["msg-contacts", q],
    queryFn: async () => {
      const res = await fetch(`/api/messaging/contacts?q=${encodeURIComponent(q)}`);
      if (res.status === 403) {
        setNotEligible(true);
        return { contacts: [] };
      }
      if (!res.ok) throw new Error("failed");
      return res.json();
    },
    refetchInterval: 30_000,
  });
  const contacts = useMemo(() => contactsData?.contacts ?? [], [contactsData]);

  const activeContact = contacts.find((c) => c.id === activeId) ?? null;
  const callContact = contacts.find((c) => c.id === callPeer(call)) ?? null;

  const roleName = useCallback(
    (r: string) => (t.roles as Record<string, string>)[r] ?? r,
    [t]
  );

  // ---------------------------------------------------------------
  // إشارات المكالمات (POST عابر — لا يسجَّل)
  // ---------------------------------------------------------------
  const postSignal = useCallback(
    async (to: string, type: CallSignalEvent["type"], payload: unknown) => {
      try {
        const res = await fetch("/api/messaging/call", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to, type, payload }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
    []
  );

  // ---------------------------------------------------------------
  // تنظيف مكالمة
  // ---------------------------------------------------------------
  const cleanupCall = useCallback((next: CallState) => {
    if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
    ringTimeoutRef.current = null;
    iceQueueRef.current = [];
    pendingOfferRef.current = null;
    try {
      pcRef.current?.close();
    } catch {}
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((tr) => tr.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    setRemoteReady(false);
    setCall(next);
    setTimeout(() => setCall((c) => (c.phase === "ended" ? { phase: "idle" } : c)), 2500);
  }, []);

  const hangup = useCallback(
    (notify = true) => {
      const c = callRef.current;
      const peer = callPeer(c);
      if (notify && peer) postSignal(peer, "END", null);
      cleanupCall({ phase: "ended", reason: "ended" });
    },
    [cleanupCall, postSignal]
  );

  // ---------------------------------------------------------------
  // قناة SSE — رسائل وحضور وكتابة وإشارات مكالمات
  // ---------------------------------------------------------------
  useEffect(() => {
    const es = new EventSource("/api/messaging/stream");
    es.addEventListener("ready", () => setStatus("connected"));
    es.addEventListener("ping", () => setStatus("connected"));
    es.onerror = () => setStatus("disconnected");

    es.addEventListener("presence", () => {
      refetchContacts();
    });

    es.addEventListener("typing", (e) => {
      const data = JSON.parse((e as MessageEvent).data) as { from: string };
      setTypingMap((m) => ({ ...m, [data.from]: Date.now() }));
    });

    // رسالة مؤقتة: تُعرض ثم يؤكد استلامها فتُمحى من ذاكرة الخادم
    es.addEventListener("msg", (e) => {
      const m = JSON.parse((e as MessageEvent).data) as {
        id: string; from: string; to: string; kind: UiMsg["kind"];
        content: string; fileName?: string; duration?: number; ts: number;
      };
      const mine = m.from === user.id;
      const peer = mine ? m.to : m.from;
      setThreads((th) => ({
        ...th,
        [peer]: [
          ...(th[peer] ?? []),
          { id: m.id, mine, kind: m.kind, content: m.content, fileName: m.fileName, duration: m.duration, ts: m.ts },
        ],
      }));
      if (!mine && activeIdRef.current !== peer) {
        setUnread((u) => ({ ...u, [peer]: (u[peer] ?? 0) + 1 }));
      }
      // استلام = استهلاك: تأكيد فوري يمحو الرسالة من الذاكرة
      ackQueueRef.current.add(m.id);
      const ids = [...ackQueueRef.current];
      ackQueueRef.current.clear();
      fetch("/api/messaging/ack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      }).catch(() => {});
    });

    // إشارات المكالمات
    es.addEventListener("signal", (e) => {
      const s = JSON.parse((e as MessageEvent).data) as CallSignalEvent;
      const c = callRef.current;

      if (s.type === "OFFER") {
        if (c.phase === "idle" || c.phase === "ended") {
          pendingOfferRef.current = s;
          setCall({ phase: "incoming", with: s.from, video: !!s.payload.video });
        } else {
          postSignal(s.from, "DECLINE", null); // مشغول بمكالمة أخرى
        }
        return;
      }
      if (s.from !== callPeer(c)) return;

      switch (s.type) {
        case "ANSWER": {
          const pc = pcRef.current;
          if (pc && s.payload.sdp) {
            pc
              .setRemoteDescription(new RTCSessionDescription(s.payload.sdp))
              .then(async () => {
                for (const cand of iceQueueRef.current) {
                  try {
                    await pc.addIceCandidate(cand);
                  } catch {}
                }
                iceQueueRef.current = [];
              })
              .catch(() => cleanupCall({ phase: "ended", reason: "failed" }));
            setCall({ phase: "active", with: s.from, video: callHasVideo(c) });
          }
          break;
        }
        case "ICE": {
          const pc = pcRef.current;
          if (pc && s.payload.candidate) {
            if (pc.remoteDescription) {
              pc.addIceCandidate(s.payload.candidate).catch(() => {});
            } else {
              iceQueueRef.current.push(s.payload.candidate);
            }
          }
          break;
        }
        case "DECLINE":
          cleanupCall({ phase: "ended", reason: "declined" });
          break;
        case "END":
          cleanupCall({ phase: "ended", reason: "ended" });
          break;
      }
    });

    return () => {
      es.close();
    };
  }, [user.id, cleanupCall, postSignal, refetchContacts]);

  // مؤقت مؤشر الكتابة (يُخفى بعد 4 ثوانٍ)
  useEffect(() => {
    const iv = setInterval(() => {
      setTypingMap((m) => {
        const now = Date.now();
        const next: Record<string, number> = {};
        let changed = false;
        for (const [k, v] of Object.entries(m)) {
          if (now - v < 4000) next[k] = v;
          else changed = true;
        }
        return changed ? next : m;
      });
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  // ربط تدفقات الفيديو/الصوت بالعناصر
  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
    if (remoteVideoRef.current && remoteStreamRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [call.phase, remoteReady]);

  // ---------------------------------------------------------------
  // إرسال الرسائل
  // ---------------------------------------------------------------
  const sendPayload = useCallback(
    async (kind: UiMsg["kind"], content: string, fileName?: string, duration?: number) => {
      const to = activeIdRef.current;
      if (!to) return;
      setSending(true);
      try {
        const res = await fetch("/api/messaging/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to, kind, content, fileName, duration }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast({ title: t.sendFailed, description: data.error, variant: "destructive" });
          return;
        }
        setThreads((th) => ({
          ...th,
          [to]: [
            ...(th[to] ?? []),
            { id: data.id, mine: true, kind, content, fileName, duration, ts: data.ts },
          ],
        }));
      } catch {
        toast({ title: t.sendFailed, variant: "destructive" });
      } finally {
        setSending(false);
      }
    },
    [toast, t.sendFailed]
  );

  const sendText = useCallback(() => {
    const v = text.trim();
    if (!v || !activeId) return;
    setText("");
    sendPayload("TEXT", v);
  }, [text, activeId, sendPayload]);

  const notifyTyping = useCallback(() => {
    if (!activeId) return;
    const now = Date.now();
    if (now - typingThrottleRef.current < 3000) return;
    typingThrottleRef.current = now;
    fetch("/api/messaging/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: activeId, typing: true }),
    }).catch(() => {});
  }, [activeId]);

  const attachImage = useCallback(
    async (file: File) => {
      try {
        // ضغط الصورة قبل الإرسال (حدود الوسائط المؤقتة)
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas");
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        let dataUrl = canvas.toDataURL("image/jpeg", 0.78);
        let quality = 0.78;
        while (dataUrl.length > 900_000 && quality > 0.4) {
          quality -= 0.12;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        sendPayload("IMAGE", dataUrl, file.name);
      } catch {
        toast({ title: t.sendFailed, variant: "destructive" });
      }
    },
    [sendPayload, toast, t.sendFailed]
  );

  const attachFile = useCallback(
    async (file: File) => {
      if (file.size > 1_800_000) {
        toast({ title: t.fileSizeLimit, variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => sendPayload("FILE", String(reader.result), file.name);
      reader.onerror = () => toast({ title: t.sendFailed, variant: "destructive" });
      reader.readAsDataURL(file);
    },
    [sendPayload, toast, t.sendFailed, t.fileSizeLimit]
  );

  // ---------------------------------------------------------------
  // التسجيل الصوتي
  // ---------------------------------------------------------------
  const startRecording = useCallback(async () => {
    if (!activeId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const secs = recordSecsRef.current;
        setRecording(false);
        setRecordSecs(0);
        if (blob.size < 1200) return; // تسجيل فارغ
        if (blob.size > 2_200_000) {
          toast({ title: t.fileSizeLimit, variant: "destructive" });
          return;
        }
        const reader = new FileReader();
        reader.onload = () => sendPayload("VOICE", String(reader.result), undefined, secs || 1);
        reader.readAsDataURL(blob);
      };
      recorderRef.current = rec;
      rec.start();
      setRecording(true);
      setRecordSecs(0);
      recordTimerRef.current = setInterval(() => {
        const next = recordSecsRef.current + 1;
        recordSecsRef.current = next;
        setRecordSecs(next);
        if (next >= 119) stopRecordingRef.current?.(false); // حد دقيقتان
      }, 1000);
    } catch {
      toast({ title: t.micDenied, variant: "destructive" });
    }
  }, [activeId, sendPayload, toast, t.fileSizeLimit, t.micDenied]);

  const stopRecording = useCallback((cancel = false) => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    recordTimerRef.current = null;
    if (cancel) chunksRef.current = [];
    recorderRef.current?.stop();
    recorderRef.current = null;
  }, []);
  const stopRecordingRef = useRef(stopRecording);
  stopRecordingRef.current = stopRecording;
  const recordSecsRef = useRef(0);
  recordSecsRef.current = recordSecs;

  // ---------------------------------------------------------------
  // المكالمات
  // ---------------------------------------------------------------
  const startCall = useCallback(
    async (video: boolean) => {
      if (!activeId || callRef.current.phase !== "idle") return;
      const to = activeId;
      try {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: video ? { width: { ideal: 640 }, height: { ideal: 480 } } : false,
        });
      } catch {
        toast({ title: video ? t.camDenied : t.micDenied, variant: "destructive" });
        return;
      }
      const pc = new RTCPeerConnection(ICE_CONFIG);
      pcRef.current = pc;
      localStreamRef.current.getTracks().forEach((tr) => pc.addTrack(tr, localStreamRef.current!));
      pc.onicecandidate = (e) => {
        if (e.candidate) postSignal(to, "ICE", { candidate: e.candidate.toJSON() });
      };
      pc.ontrack = (e) => {
        remoteStreamRef.current = e.streams[0];
        setRemoteReady(true);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
      };
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
          cleanupCall({ phase: "ended", reason: "failed" });
        }
      };
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const ok = await postSignal(to, "OFFER", { sdp: pc.localDescription, video });
        if (!ok) {
          cleanupCall({ phase: "ended", reason: "unavailable" });
          return;
        }
        setCall({ phase: "outgoing", with: to, video });
        ringTimeoutRef.current = setTimeout(() => {
          if (callRef.current.phase === "outgoing") hangup(true); // مهلة الرنين
        }, 45_000);
      } catch {
        cleanupCall({ phase: "ended", reason: "failed" });
      }
    },
    [activeId, postSignal, cleanupCall, hangup, toast, t.camDenied, t.micDenied]
  );

  const acceptCall = useCallback(async () => {
    const s = pendingOfferRef.current;
    if (!s) return;
    const { from, payload } = s;
    const video = !!payload.video;
    try {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: video ? { width: { ideal: 640 }, height: { ideal: 480 } } : false,
      });
    } catch {
      postSignal(from, "DECLINE", null);
      cleanupCall({ phase: "ended", reason: "failed" });
      return;
    }
    const pc = new RTCPeerConnection(ICE_CONFIG);
    pcRef.current = pc;
    localStreamRef.current.getTracks().forEach((tr) => pc.addTrack(tr, localStreamRef.current!));
    pc.onicecandidate = (e) => {
      if (e.candidate) postSignal(from, "ICE", { candidate: e.candidate.toJSON() });
    };
    pc.ontrack = (e) => {
      remoteStreamRef.current = e.streams[0];
      setRemoteReady(true);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        cleanupCall({ phase: "ended", reason: "failed" });
      }
    };
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp!));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await postSignal(from, "ANSWER", { sdp: pc.localDescription });
      setCall({ phase: "active", with: from, video });
    } catch {
      postSignal(from, "END", null);
      cleanupCall({ phase: "ended", reason: "failed" });
    }
  }, [postSignal, cleanupCall]);

  const declineCall = useCallback(() => {
    const peer = callPeer(callRef.current);
    if (callRef.current.phase === "incoming" && peer) postSignal(peer, "DECLINE", null);
    cleanupCall({ phase: "idle" });
  }, [postSignal, cleanupCall]);

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((tr) => (tr.enabled = !tr.enabled));
  };
  const toggleCam = () => {
    localStreamRef.current?.getVideoTracks().forEach((tr) => (tr.enabled = !tr.enabled));
  };

  // ---------------------------------------------------------------
  // العرض
  // ---------------------------------------------------------------
  const thread = activeId ? threads[activeId] ?? [] : [];
  const peerTyping = activeId ? Date.now() - (typingMap[activeId] ?? 0) < 4000 : false;

  // تمرير تلقائي لآخر رسالة
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.length, activeId]);

  if (notEligible) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <ShieldCheck className="size-10 text-primary" />
          <p className="max-w-md font-bold">{t.notEligible}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* ترويسة + تنبيه السرية */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black sm:text-2xl">
            <MessagesSquare className="size-6 text-primary" />
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 font-bold",
            status === "connected" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-600",
            status === "connecting" && "border-amber-500/40 bg-amber-500/10 text-amber-600",
            status === "disconnected" && "border-red-500/40 bg-red-500/10 text-red-600"
          )}
        >
          {status === "connected" && <Wifi className="size-3.5" />}
          {status === "connecting" && <Loader2 className="size-3.5 animate-spin" />}
          {status === "disconnected" && <WifiOff className="size-3.5" />}
          {status === "connected" ? t.connected : status === "connecting" ? t.connecting : t.disconnected}
        </Badge>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[13px] leading-6">
        <p className="font-bold text-amber-700 dark:text-amber-400">🔒 {t.ephemeralNotice}</p>
        <p className="mt-0.5 text-amber-700/80 dark:text-amber-400/70">{t.ephemeralHint}</p>
      </div>

      {/* واجهة المحادثة */}
      <Card className="overflow-hidden">
        <div className="grid h-[calc(100dvh-19rem)] min-h-[26rem] grid-cols-1 md:grid-cols-[20rem_1fr]">
          {/* قائمة جهات الاتصال */}
          <div className={cn("flex min-h-0 flex-col border-e border-border", activeId && "hidden md:flex")}>
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="absolute start-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t.searchPh}
                  className="h-9 ps-8"
                />
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {contacts.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  <p className="font-bold">{t.noContacts}</p>
                  <p className="mt-1 text-[12px]">{t.noContactsDesc}</p>
                </div>
              ) : (
                contacts.map((c) => {
                  const isStaff = ["SUPER_ADMIN", "ASSOCIATION_ADMIN", "CO_ADMIN", "ACCOUNTANT"].includes(c.platformRole);
                  const unreadN = unread[c.id] ?? 0;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveId(c.id);
                        setUnread((u) => ({ ...u, [c.id]: 0 }));
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-2.5 text-start transition-colors",
                        activeId === c.id ? "bg-primary/10" : "hover:bg-muted"
                      )}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="size-10">
                          {c.avatarUrl ? <AvatarImage src={c.avatarUrl} alt="" /> : null}
                          <AvatarFallback className="bg-primary/15 text-sm font-black">
                            {c.fullName.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            "absolute -bottom-0.5 -end-0.5 size-3 rounded-full border-2 border-background",
                            c.online ? "bg-emerald-500" : "bg-muted-foreground/40"
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-extrabold">{c.fullName}</p>
                          {isStaff && (
                            <Badge variant="outline" className="h-4 shrink-0 border-primary/30 bg-primary/10 px-1 text-[9px] font-bold text-primary">
                              {t.staffBadge}
                            </Badge>
                          )}
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {c.associations.length > 0
                            ? c.associations
                                .slice(0, 2)
                                .map((a) => `${roleName(a.roleInAssociation)} · ${a.associationName}`)
                                .join(" | ")
                            : t.staffBadge}
                        </p>
                      </div>
                      {unreadN > 0 && (
                        <Badge className="h-5 shrink-0 rounded-full px-1.5 text-[11px] font-black">{unreadN}</Badge>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* خيط المحادثة */}
          <div className={cn("flex min-h-0 flex-col", !activeId && "hidden md:flex")}>
            {!activeContact ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <MessagesSquare className="size-12 text-muted-foreground/40" />
                <p className="font-bold">{t.selectContact}</p>
                <p className="max-w-sm text-sm text-muted-foreground">{t.selectContactDesc}</p>
              </div>
            ) : (
              <>
                {/* رأس المحادثة */}
                <div className="flex items-center gap-3 border-b border-border p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 md:hidden"
                    onClick={() => setActiveId(null)}
                    aria-label={t.backToContacts}
                  >
                    <ArrowRight className="size-4 rtl:rotate-0 ltr:rotate-180" />
                  </Button>
                  <Avatar className="size-9">
                    {activeContact.avatarUrl ? <AvatarImage src={activeContact.avatarUrl} alt="" /> : null}
                    <AvatarFallback className="bg-primary/15 text-xs font-black">
                      {activeContact.fullName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold">{activeContact.fullName}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {peerTyping ? (
                        <span className="font-bold text-primary">{t.typing}</span>
                      ) : activeContact.online ? (
                        <span className="text-emerald-600">{t.online}</span>
                      ) : (
                        t.offline
                      )}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9"
                    onClick={() => startCall(false)}
                    disabled={call.phase !== "idle"}
                    title={t.voiceCall}
                  >
                    <Phone className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9"
                    onClick={() => startCall(true)}
                    disabled={call.phase !== "idle"}
                    title={t.videoCall}
                  >
                    <Video className="size-4" />
                  </Button>
                </div>

                {/* الرسائل */}
                <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-4">
                  {thread.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                      <Clock className="size-8 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">{t.emptyThread}</p>
                      <p className="text-[11px] text-muted-foreground/70">{t.sessionOnly}</p>
                    </div>
                  ) : (
                    thread.map((m) => (
                      <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 sm:max-w-[70%]",
                            m.mine
                              ? "rounded-ee-sm bg-primary text-primary-foreground"
                              : "rounded-es-sm bg-muted"
                          )}
                        >
                          {m.kind === "TEXT" && <p className="whitespace-pre-wrap break-words">{m.content}</p>}
                          {m.kind === "VOICE" && <MediaAudio content={m.content} />}
                          {m.kind === "IMAGE" && (
                            <img src={m.content} alt={m.fileName ?? ""} className="max-h-72 rounded-lg object-cover" />
                          )}
                          {m.kind === "FILE" && (
                            <a
                              href={dataUrlToBlobUrl(m.content)}
                              download={m.fileName ?? "file"}
                              className="flex items-center gap-2 underline-offset-2 hover:underline"
                            >
                              <FileText className="size-4 shrink-0" />
                              <span className="break-all">{m.fileName}</span>
                            </a>
                          )}
                          <p className={cn("mt-1 text-[10px]", m.mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                            {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* صندوق الإرسال */}
                <div className="border-t border-border p-3">
                  {recording ? (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-2 text-sm font-bold text-red-600">
                        <span className="size-2.5 animate-pulse rounded-full bg-red-600" />
                        {t.recording} {Math.floor(recordSecs / 60)}:{String(recordSecs % 60).padStart(2, "0")}
                      </span>
                      <div className="flex-1" />
                      <Button variant="ghost" size="sm" onClick={() => stopRecording(true)}>
                        <X className="size-4" /> {t.cancelRecording}
                      </Button>
                      <Button size="sm" onClick={() => stopRecording(false)}>
                        <Send className="size-4" /> {t.stopRecording}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2">
                      <label className="shrink-0 cursor-pointer" title={t.attachImage}>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) attachImage(f);
                            e.target.value = "";
                          }}
                        />
                        <span className="grid size-9 place-items-center rounded-lg border border-input hover:bg-muted">
                          <ImageIcon className="size-4" />
                        </span>
                      </label>
                      <label className="shrink-0 cursor-pointer" title={t.attachFile}>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) attachFile(f);
                            e.target.value = "";
                          }}
                        />
                        <span className="grid size-9 place-items-center rounded-lg border border-input hover:bg-muted">
                          <Paperclip className="size-4" />
                        </span>
                      </label>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-9 shrink-0 text-red-600"
                        onClick={startRecording}
                        disabled={sending}
                        title={t.recordVoice}
                      >
                        <Mic className="size-4" />
                      </Button>
                      <Input
                        value={text}
                        onChange={(e) => {
                          setText(e.target.value);
                          notifyTyping();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendText();
                          }
                        }}
                        placeholder={t.messagePh}
                        className="min-h-9"
                        maxLength={4000}
                      />
                      <Button size="icon" className="size-9 shrink-0" onClick={sendText} disabled={!text.trim() || sending}>
                        {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 rtl:rotate-0 ltr:rotate-180" />}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* مكالمة واردة */}
      {call.phase === "incoming" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <span className="relative grid size-20 place-items-center rounded-full bg-primary/15">
                <PhoneIncoming className="size-9 animate-pulse text-primary" />
              </span>
              <div>
                <p className="text-lg font-black">{callContact?.fullName ?? "…"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {call.video ? t.incomingVideo : t.incomingVoice}
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700"
                  onClick={declineCall}
                  title={t.decline}
                >
                  <PhoneOff className="size-6" />
                </Button>
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={acceptCall}
                  title={t.accept}
                >
                  <Phone className="size-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* مكالمة جارية */}
      {(call.phase === "outgoing" || call.phase === "active") && (
        <div className="fixed inset-0 z-50 bg-black/90 p-4">
          <div className="mx-auto flex h-full max-w-3xl flex-col">
            <div className="flex items-center justify-between py-3 text-white">
              <div>
                <p className="font-black">{callContact?.fullName ?? "…"}</p>
                <p className="text-xs text-white/70">{call.phase === "outgoing" ? t.calling : ""}</p>
              </div>
              <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
                {call.video ? <Video className="size-3.5" /> : <Phone className="size-3.5" />}
              </Badge>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-2xl bg-black">
              {call.video ? (
                <>
                  <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute bottom-3 end-3 h-28 w-40 rounded-lg border border-white/20 object-cover"
                  />
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <span className="grid size-24 place-items-center rounded-full bg-primary/20">
                    <Phone className={cn("size-10 text-primary", call.phase === "outgoing" && "animate-pulse")} />
                  </span>
                  <p className="font-black text-white">{callContact?.fullName}</p>
                  <p className="text-sm text-white/60">{call.phase === "outgoing" ? t.ringing : ""}</p>
                  {remoteReady && <audio ref={remoteVideoRef} autoPlay className="hidden" />}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 py-5">
              <Button
                variant="outline"
                size="icon"
                className="size-12 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={toggleMute}
                title={t.mute}
              >
                <MicOff className="size-5" />
              </Button>
              {call.video && (
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                  onClick={toggleCam}
                  title={t.cameraOff}
                >
                  <VideoOff className="size-5" />
                </Button>
              )}
              <Button
                size="icon"
                className="size-14 rounded-full bg-red-600 hover:bg-red-700"
                onClick={() => hangup(true)}
                title={t.hangup}
              >
                <PhoneOff className="size-6" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* نهاية المكالمة */}
      {call.phase === "ended" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <Card className="w-full max-w-xs">
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <PhoneOff className="size-10 text-muted-foreground" />
              <p className="font-bold">
                {call.reason === "declined"
                  ? t.declined
                  : call.reason === "unavailable"
                    ? t.unavailable
                    : call.reason === "failed"
                      ? t.callFailed
                      : t.ended}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
