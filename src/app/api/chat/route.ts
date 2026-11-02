/**
 * POST /api/chat — المساعد الجمعوي
 * مساعد ذكي ملتزم صرامةً بقاعدة معارف رسمية مُتحقق منها:
 * لا هلوسة، لا اختراع روابط، لا معلومات غير موثقة.
 */
import { NextRequest } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { searchKB, buildContext, sanitizeLinks, sessionFallback } from "@/lib/kb/retrieval";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `أنت «المساعد الجمعوي» (Assistant Al-Jamiaoui) — المساعد الرسمي لمنصة مامب لإدارة الجمعيات المغربية.

مهمتك: مساعدة المستخدمين على فهم المنصة واستعمال خدماتها، وترشيدهم في الإجراءات الجمعوية بالمغرب والتوجه نحو البوابات الرسمية.

## القواعد الصارمة (غير قابلة للنقاش):
1. أجب فقط انطلاقاً من «السياق الموثق» المرفق أسفل رسالة المستخدم. إذا لم يوجد فيه الجواب، قل بوضوح: «عذراً، لا أتوفر حالياً على جواب موثد لهذا السؤال. أنصحكم بالتواصل مع الإدارة المختصة أو زيارة البوابة الرسمية المعنية.» ثم اقترح أقرب موضوع متوفر في السياق إن أمكن.
2. ممنوع منعاً باتاً توليد أي رابط أو موقع إلكتروني غير موجود حرفياً في السياق الموثق. لا تكتب روابط من ذاكرتك أبداً، ولا تخترع امتدادات أو صفحات فرعية.
3. لا تخترع أرقام مواد قانونية، مراسيم، تواريخ، نسباً ضريبية، مبالغ أو إجراءات غير موجودة في السياق.
4. لا تدعِ معرفة معطيات خاصة بجمعية معينة (أعضاء، رصيد، حالة ملف) — وجّه المستخدم للوحة الجمعية المعنية.
5. أجب باللغة العربية الفصحى المبسطة، بنبرة مهنية ودودة. استعمل قوائم مرقمة عند شرح الخطوات.
6. عند ذكر معلومة قانونية، أشر إلى مصدرها (الظهير/القانون) كما ورد في السياق.
7. اجعل الأجوبة موجزة ومباشرة (3-10 أسطر غالباً)، واقترح في النهاية موضوعاً ذا صلة إن كان مفيداً.
8. إذا سُئلت عن نفسك: أنت المساعد الجمعوي، تعمل بقاعدة معارف رسمية مُراجعة، ولا تقدم استشارة قانونية بديلة عن المختصين.

## معلومات عامة ثابتة مسموحة:
- اسم المنصة: منصة مامب (MAMP) لإدارة الجمعيات المغربية.
- العملة: الدرهم المغربي (MAD).
- الرابط العمومي للمنصة: https://mamp.pages.dev`;

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "طلب غير صالح" }, { status: 400 });
    }
    const message: string = String(body.message ?? "").trim();
    const history: Array<{ role: string; content: string }> = Array.isArray(body.history)
      ? body.history.slice(-6).filter((m) => m && (m.role === "user" || m.role === "assistant"))
      : [];
    let sessionId: string = String(body.sessionId ?? "") || sessionFallback();

    if (!message || message.length > 2000) {
      return Response.json({ error: "رسالة غير صالحة" }, { status: 400 });
    }

    // 1) استرجاع المعرفة الموثقة
    const results = searchKB(message, 4);
    const context = buildContext(results);

    // 2) توليد الجواب عبر النموذج
    let answer: string;
    try {
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: SYSTEM_PROMPT },
          ...(context
            ? [
                {
                  role: "assistant",
                  content: `السياق الموثق الوحيد المسموح الاستناد إليه (من قاعدة المعارف الرسمية للمنصة):\n\n${context}`,
                },
              ]
            : []),
          ...history.map((m) => ({
            role: m.role as "user" | "assistant",
            content: String(m.content).slice(0, 2000),
          })),
          { role: "user", content: message },
        ],
        thinking: { type: "disabled" },
      });
      answer = completion.choices[0]?.message?.content ?? "";
    } catch (e) {
      // تعذر النموذج → جواب مباشر من قاعدة المعرفة (بدون هلوسة إطلاقاً)
      answer =
        results.length > 0
          ? results[0].entry.answer
          : "عذراً، تعذر الاتصال بالمحرك الذكي حالياً، ولا أتوفر على جواب موثق لهذا السؤال في قاعدة معارفي. أنصحكم بزيارة البوابة الرسمية المعنية أو إعادة المحاولة بعد قليل.";
    }

    // 3) الفلترة الصارمة: إزالة أي رابط غير موثق
    const { text: safeAnswer, removed } = sanitizeLinks(answer);
    if (removed > 0) {
      const finalText =
        safeAnswer +
        "\n\n(تنبيه: تمت إزالة رابط/روابط غير موثقة من هذا الجواب حفاظاً على المصداقية.)";
      return Response.json({
        answer: finalText,
        sessionId,
        kb: results.map((r) => r.entry.id),
        filtered: removed,
      });
    }

    // 4) تسجيل المحادثة (سجل خفيف)
    try {
      const session = await getSession();
      await db.chatMessage.createMany({
        data: [
          { sessionId, role: "user", content: message.slice(0, 500), userId: session?.sub ?? null },
          { sessionId, role: "assistant", content: safeAnswer.slice(0, 2000), userId: session?.sub ?? null },
        ],
      });
    } catch {
      // التسجيل ليس حرجاً — لا نفشل المحادثة بسببه
    }

    return Response.json({
      answer: safeAnswer,
      sessionId,
      kb: results.map((r) => r.entry.id),
    });
  } catch (e) {
    console.error("chat error:", e);
    return Response.json({ error: "حدث خطأ غير متوقع في المساعد" }, { status: 500 });
  }
}

/** GET — فحص صحة الخدمة */
export async function GET() {
  return Response.json({
    name: "المساعد الجمعوي",
    status: "متصل",
    disclaimer:
      "يعمل بقاعدة معارف رسمية مُتحقق منها؛ لا يولد روابط أو معلومات غير موثقة.",
  });
}
