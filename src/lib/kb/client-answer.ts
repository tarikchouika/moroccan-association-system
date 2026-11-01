/**
 * جواب المحلي من قاعدة المعرفة — يعمل في المتصفح بدون خادم
 * يُستعمل كنسخة احتياطية عند تعذر /api/chat (مثل النسخة الثابتة المنشورة).
 * الضمان: الجواب يأتي حرفياً من مدخل موثق + روابط اللائحة البيضاء فقط.
 * لا توليد لغوي، لا هلوسة، لا روابط خارج القائمة الرسمية.
 */
import { searchKB } from "./retrieval";
import type { KBLink } from "./data";

export interface LocalKBAnswer {
  content: string;
  found: boolean;
}

function formatLinks(links: KBLink[]): string {
  if (links.length === 0) return "";
  return (
    "\n\nالروابط الرسمية الموثقة:\n" +
    links.map((l) => `• ${l.url} — ${l.label}`).join("\n")
  );
}

/**
 * يبحث في قاعدة المعرفة ويرجّع جواباً نصياً جاهزاً للعرض.
 * - وجد نتائج → نص المدخل الأفضل + مصدره + روابطه الرسمية
 * - لم يجد → رسالة صادقة وواضحة (بدون اختلاق)
 */
export function localKBAnswer(question: string): LocalKBAnswer {
  const results = searchKB(question, 2);
  if (results.length === 0) {
    return {
      found: false,
      content:
        "عذراً، لا أتوفر حالياً على جواب موثق لهذا السؤال.\n\n" +
        "أنصحكم بالتواصل مع الإدارة المختصة أو زيارة البوابة الرسمية المعنية " +
        "(تجدون أهم البوابات في صفحة «المرجع القانوني»).\n\n" +
        "ملاحظة: هذه النسخة تجيب مباشرة من قاعدة المعارف الموثقة للمنصة، " +
        "والنسخة الكاملة للمساعد متوفرة على الخادم المحلي للمنصة.",
    };
  }

  const best = results[0].entry;
  const related = results
    .slice(1)
    .filter((r) => r.score >= Math.max(6, results[0].score * 0.4))
    .map((r) => `• ${r.entry.title}`);

  let content = `**${best.title}**\n\n${best.answer}${formatLinks(best.links)}`;
  if (related.length > 0) {
    content += `\n\nمواضيع ذات صلة:\n${related.join("\n")}`;
  }
  return { found: true, content };
}
