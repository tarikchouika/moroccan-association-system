/**
 * جواب المحلي من قاعدة المعرفة — يعمل في المتصفح بدون خادم، بثماني لغات.
 * يُستعمل كنسخة احتياطية عند تعذر /api/chat (مثل النسخة الثابتة المنشورة)
 * أو مباشرة عندما تكون لغة الواجهة غير العربية (الخادم المحلي يجيب بالعربية).
 *
 * الضمان (بدون هلوسة): الجواب يأتي حرفياً من ترجمة مدققة لمدخل موثق
 * + روابط اللائحة البيضاء فقط بأسمائها المترجمة.
 * لا توليد لغوي، لا هلوسة، لا روابط خارج القائمة الرسمية.
 */
import { searchKBMultilingual } from "./retrieval";
import { OFFICIAL_LINKS, type KBLink } from "./data";
import { getKBSet } from "./translations";
import { DICTS } from "@/lib/i18n/dictionaries";
import { DEFAULT_LANG, type Lang } from "@/lib/i18n/config";

export interface LocalKBAnswer {
  content: string;
  found: boolean;
}

/** خريطة url → مفتاح اللائحة البيضاء (لاستخراج التسمية المترجمة) */
const URL_TO_KEY: Map<string, string> = (() => {
  const m = new Map<string, string>();
  for (const [key, link] of Object.entries(OFFICIAL_LINKS)) {
    m.set(link.url, key);
  }
  return m;
})();

function formatLinks(links: KBLink[], lang: Lang): string {
  if (links.length === 0) return "";
  const set = getKBSet(lang);
  const d = DICTS[lang] ?? DICTS[DEFAULT_LANG];
  return (
    `\n\n${d.kb.linksHeader}\n` +
    links
      .map((l) => {
        const key = URL_TO_KEY.get(l.url);
        const label =
          key && key in set.links ? set.links[key as keyof typeof set.links] : l.label;
        return `• ${l.url} — ${label}`;
      })
      .join("\n")
  );
}

/** الحد الأدنى لقبول المطابقة — يمنع الأجوبة الضعيفة الصلة عن أسئلة خادعة
 *  (مطابقة كلمة مفتاحية واحدة = 6، أي أقل من الحد؛ السؤال الحقيقي يسجل عادة 10+) */
const MIN_SCORE = 9;

/**
 * يبحث في قاعدة المعرفة (بكل اللغات) ويرجّع جواباً نصياً جاهزاً للعرض
 * بلغة الواجهة المحددة.
 * - وجد نتائج قوية → نص المدخل الأفضل مترجماً + مصدره + روابطه الرسمية
 * - لم يجد أو كانت المطابقة ضعيفة → رسالة صادقة وواضحة بلغة المستخدم (بدون اختلاق)
 */
export function localKBAnswer(question: string, lang: Lang = DEFAULT_LANG): LocalKBAnswer {
  const d = DICTS[lang] ?? DICTS[DEFAULT_LANG];
  const set = getKBSet(lang);
  const results = searchKBMultilingual(question, 2).filter((r) => r.score >= MIN_SCORE);

  if (results.length === 0) {
    return { found: false, content: d.kb.notFound };
  }

  const best = results[0].entry;
  const related = results
    .slice(1)
    .filter((r) => r.score >= Math.max(6, results[0].score * 0.4))
    .map((r) => `• ${set.entries[r.entry.id]?.title ?? r.entry.title}`);

  const t = set.entries[best.id];
  const title = t?.title ?? best.title;
  const answer = t?.answer ?? best.answer;

  let content = `**${title}**\n\n${answer}${formatLinks(best.links, lang)}`;
  if (related.length > 0) {
    content += `\n\n${d.kb.relatedHeader}\n${related.join("\n")}`;
  }
  return { found: true, content };
}
