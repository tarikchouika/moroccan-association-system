/**
 * مركز المراسلة الفورية — منصة MAMP
 * ---------------------------------------------------------------
 * مبدأ صارم بطلب من المالك:
 *   الرسائل تُستهلك بين الطرفين ولا تُسجَّل في قاعدة البيانات إطلاقاً.
 *
 * • الرسائل تعيش في ذاكرة الخادم (RAM) فقط، من الإرسال حتى التسليم.
 * • عند استلام الرسالة (ACK من المستقبِل) تُمحى من الذاكرة نهائياً.
 * • إن ظل المستقبِل غير متصل تنتهي صلاحية الرسالة بعد TTL وتُمحى.
 * • إشارات المكالمات (WebRTC) عابرة كذلك — لا أثر لها بعد التسليم.
 * • لا يوجد أي استدعاء لقاعدة البيانات في هذا الملف.
 *
 * الغلاف globalThis يضمن بقاء نسخة واحدة عبر إعادة التحميل في التطوير.
 */

export type MessageKind = "TEXT" | "VOICE" | "IMAGE" | "FILE";

export interface EphemeralMessage {
  id: string;
  from: string; // معرف المرسل
  to: string; // معرف المستقبِل
  kind: MessageKind;
  content: string; // نص أو data URL (صوت/صورة/ملف)
  fileName?: string; // اسم الملف (صورة/ملف)
  duration?: number; // مدة الرسالة الصوتية بالثواني
  ts: number; // زمن الإرسال
  expiresAt: number; // انتهاء الصلاحية في الذاكرة
}

export type CallSignalType =
  | "OFFER"
  | "ANSWER"
  | "ICE"
  | "ACCEPT"
  | "DECLINE"
  | "END";

export interface CallSignal {
  id: string;
  from: string;
  to: string;
  type: CallSignalType;
  /** SDP أو مرشح ICE أو نوع الوسائط المطلوب */
  payload: unknown;
  ts: number;
}

interface SseClient {
  id: number;
  send: (event: string, data: unknown) => boolean;
}

interface HubState {
  clients: Map<string, Set<SseClient>>;
  buffers: Map<string, EphemeralMessage[]>;
  sentCounters: Map<string, { windowStart: number; count: number }>;
  lastSeen: Map<string, number>;
  clientSeq: number;
  msgSeq: number;
}

export const LIMITS = {
  /** أقصى طول للرسالة النصية */
  textLen: 4000,
  /** أقصى حجم للمحتوى المشفر base64 (رسائل الوسائط) */
  contentLen: 2_700_000, // ≈ 2 ميغابايت بعد فك الترميز
  /** أقصى عدد رسائل معلقة لكل مستقبِل */
  bufferMax: 100,
  /** صلاحية الرسالة المعلقة في الذاكرة (24 ساعة) */
  bufferTtlMs: 24 * 60 * 60 * 1000,
  /** حد الإرسال: 40 رسالة في الدقيقة لكل مستخدم */
  rateMax: 40,
  rateWindowMs: 60_000,
} as const;

function createHub(): HubState {
  return {
    clients: new Map(),
    buffers: new Map(),
    sentCounters: new Map(),
    lastSeen: new Map(),
    clientSeq: 0,
    msgSeq: 0,
  };
}

const g = globalThis as unknown as { __mampMsgHub?: HubState };
export const hub: HubState = g.__mampMsgHub ?? (g.__mampMsgHub = createHub());

// ---------------------------------------------------------------
// أدوات داخلية
// ---------------------------------------------------------------

function newId(prefix: string, n: number): string {
  return `${prefix}_${Date.now().toString(36)}_${n.toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function purgeExpired(userId: string) {
  const buf = hub.buffers.get(userId);
  if (!buf || buf.length === 0) return;
  const now = Date.now();
  const kept = buf.filter((m) => m.expiresAt > now);
  if (kept.length !== buf.length) hub.buffers.set(userId, kept);
}

/** تنظيف دوري خفيف — يستدعى من نقاط الدخول (stream/send) */
function sweep() {
  for (const userId of hub.buffers.keys()) purgeExpired(userId);
}

export function isOnline(userId: string): boolean {
  const set = hub.clients.get(userId);
  return !!set && set.size > 0;
}

export function pendingCount(userId: string): number {
  purgeExpired(userId);
  return hub.buffers.get(userId)?.length ?? 0;
}

export function onlineSnapshot(): string[] {
  return [...hub.clients.entries()]
    .filter(([, set]) => set.size > 0)
    .map(([id]) => id);
}

// ---------------------------------------------------------------
// اتصالات SSE
// ---------------------------------------------------------------

/** تسجيل عميل SSE — يعيد دالة إلغاء التسجيل */
export function registerClient(
  userId: string,
  send: (event: string, data: unknown) => boolean
): () => void {
  const client: SseClient = { id: ++hub.clientSeq, send };
  let set = hub.clients.get(userId);
  if (!set) {
    set = new Set();
    hub.clients.set(userId, set);
  }
  set.add(client);
  hub.lastSeen.set(userId, Date.now());
  broadcastPresence(userId, true);
  // تدفق الرسائل المعلقة فور الاتصال (تبقى حتى ACK)
  flushBuffer(userId);
  return () => {
    const s = hub.clients.get(userId);
    if (s) {
      s.delete(client);
      if (s.size === 0) {
        hub.clients.delete(userId);
        broadcastPresence(userId, false);
      }
    }
  };
}

/** بث حدث لكل اتصالات مستخدم — يعيد true إذا وُصل لمتصل واحد على الأقل */
export function pushEvent(userId: string, event: string, data: unknown): boolean {
  const set = hub.clients.get(userId);
  if (!set || set.size === 0) return false;
  let delivered = false;
  for (const c of set) {
    if (c.send(event, data)) delivered = true;
  }
  return delivered;
}

function broadcastPresence(userId: string, online: boolean) {
  const snapshot = onlineSnapshot();
  for (const uid of snapshot) {
    if (uid !== userId) pushEvent(uid, "presence", { userId, online });
  }
}

// ---------------------------------------------------------------
// الرسائل المؤقتة
// ---------------------------------------------------------------

/** إرسال رسالة: تُحفظ في الذاكرة حتى تسلَّم (ACK) — لا قاعدة بيانات */
export function sendMessage(
  msg: Omit<EphemeralMessage, "id" | "ts" | "expiresAt">
): EphemeralMessage {
  sweep();
  const full: EphemeralMessage = {
    ...msg,
    id: newId("msg", ++hub.msgSeq),
    ts: Date.now(),
    expiresAt: Date.now() + LIMITS.bufferTtlMs,
  };

  const buf = hub.buffers.get(msg.to) ?? [];
  buf.push(full);
  // سقف الحماية: أبقاء آخر bufferMax رسالة
  const trimmed = buf.length > LIMITS.bufferMax ? buf.slice(-LIMITS.bufferMax) : buf;
  hub.buffers.set(msg.to, trimmed);

  // تسليم فوري إن كان متصلاً
  pushEvent(msg.to, "msg", full);
  return full;
}

/** تدفق الرسائل المعلقة إلى اتصالات المستخدم */
function flushBuffer(userId: string) {
  purgeExpired(userId);
  const buf = hub.buffers.get(userId);
  if (!buf || buf.length === 0) return;
  for (const m of buf) pushEvent(userId, "msg", m);
}

/** تأكيد الاستلام = محو الرسائل من الذاكرة (استُهلكت بين الطرفين) */
export function acknowledge(userId: string, ids: string[]): number {
  const buf = hub.buffers.get(userId);
  if (!buf || buf.length === 0) return 0;
  const idSet = new Set(ids);
  const kept = buf.filter((m) => !idSet.has(m.id));
  const consumed = buf.length - kept.length;
  hub.buffers.set(userId, kept);
  return consumed;
}

// ---------------------------------------------------------------
// مؤشر الكتابة (عابر — لا يخزَّن)
// ---------------------------------------------------------------

export function sendTyping(from: string, to: string) {
  pushEvent(to, "typing", { from, ts: Date.now() });
}

// ---------------------------------------------------------------
// إشارات المكالمات (WebRTC) — عابرة، تستلزم اتصالاً حياً
// ---------------------------------------------------------------

export function sendCallSignal(
  from: string,
  to: string,
  type: CallSignalType,
  payload: unknown
): boolean {
  return pushEvent(to, "signal", {
    id: newId("sig", ++hub.msgSeq),
    from,
    to,
    type,
    payload,
    ts: Date.now(),
  } satisfies CallSignal);
}

// ---------------------------------------------------------------
// تحديد المعدل (حماية من الإغراق) — في الذاكرة
// ---------------------------------------------------------------

export function allowSend(userId: string): boolean {
  const now = Date.now();
  const c = hub.sentCounters.get(userId);
  if (!c || now - c.windowStart > LIMITS.rateWindowMs) {
    hub.sentCounters.set(userId, { windowStart: now, count: 1 });
    return true;
  }
  c.count += 1;
  return c.count <= LIMITS.rateMax;
}

// ---------------------------------------------------------------
// إحصاءات تشغيلية (مراقبة بلا محتوى)
// ---------------------------------------------------------------

export function hubStats() {
  sweep();
  let buffered = 0;
  for (const b of hub.buffers.values()) buffered += b.length;
  return {
    connected: onlineSnapshot().length,
    bufferedMessages: buffered,
    totalConnections: [...hub.clients.values()].reduce((n, s) => n + s.size, 0),
  };
}
