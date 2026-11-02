/**
 * عميل Prisma — وضعان شفافان:
 *  1) بيئة Cloudflare Workers (الإنتاج): عميل runtime=workerd (تشغيل WASM)
 *     مع محوّل D1 — قاعدة SQLite الموزعة من كلاودفلير عبر ربط DB في wrangler.jsonc.
 *  2) التطوير المحلي والخادم المستقل: العميل الكلاسيكي (محرك المكتبة)
 *     مع ملف SQLite عبر DATABASE_URL — تماماً كما كان قبل الترحيل.
 *
 * المولَّدان من المخطط نفسه (راجعوا prisma/schema.prisma) — واجهات النماذج متطابقة.
 * الكشف: WebSocketPair (عالمي حصري لبيئة workerd) ثم navigator.userAgent.
 * ملاحظة حزم: استيراد العميل الكلاسيكي ديناميكي داخل فرع Node حصراً — لأن
 * Next 16 يجعل @prisma/client خارجياً باسم مجزّأ لا يحلّه wrangler، والفرع
 * لا يُنفَّذ على Workers أصلاً فلا يُحمَّل هناك أبداً.
 * تشغيل Prisma للعامل منسوخ محلياً عبر scripts/fix-prisma-external.sh.
 */
import { PrismaClient as PrismaClientWorkers } from "@/generated/prisma/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaD1 } from "@prisma/adapter-d1";
import type { PrismaClient as PrismaClientNode } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientNode | undefined
}

function isWorkersRuntime(): boolean {
  // WebSocketPair عالمي حصري لبيئة workerd (كلاودفلير Workers)
  if (typeof WebSocketPair !== "undefined") return true;
  try {
    return (
      typeof navigator !== "undefined" &&
      typeof navigator.userAgent === "string" &&
      navigator.userAgent.includes("Cloudflare-Workers")
    );
  } catch {
    return false;
  }
}

async function createPrismaClient(): Promise<PrismaClientNode> {
  if (isWorkersRuntime()) {
    try {
      const { env } = await getCloudflareContext({ async: true });
      const d1 = (env as unknown as { DB?: D1Database } | undefined)?.DB;
      if (d1) {
        // عميل workerd + محوّل D1 — واجهات النماذج مطابقة للكلاسيكي
        const workers = new PrismaClientWorkers({
          adapter: new PrismaD1(d1),
          log: ["error"],
        });
        return workers as unknown as PrismaClientNode;
      }
      console.error("[db] بيئة Workers بلا ربط D1 — العودة إلى SQLite");
    } catch (e) {
      console.error("[db] تعذر قراءة سياق كلاودفلير — العودة إلى SQLite:", e);
    }
  }

  // الوضع المحلي/المستقل كما كان تماماً — العميل الكلاسيكي + محرك المكتبة
  // (استيراد ديناميكي: لا يُنفَّذ على Workers فلا يُحمَّل الاسم المجزّأ هناك)
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient({
    log: ['query'],
  })
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = await createPrismaClient();
}

export const db = globalForPrisma.prisma!;
