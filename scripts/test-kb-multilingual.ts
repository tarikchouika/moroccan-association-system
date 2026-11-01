/**
 * اختبار سريع للاسترجاع متعدد اللغات من قاعدة المعرفة
 * - سؤال فرنسي → جواب فرنسي من المدخل الموثق
 * - سؤال روسي → جواب روسي
 * - سؤال خادع برابط وهمي → رفض صريح (لا هلوسة)
 */
import { localKBAnswer } from "../src/lib/kb/client-answer";
import type { Lang } from "../src/lib/i18n/config";

const cases: Array<{ lang: Lang; q: string; expect: string }> = [
  { lang: "fr", q: "Quelles sont les étapes pour créer une association au Maroc ?", expect: "cinq étapes" },
  { lang: "en", q: "How do I get an ICE number for my association?", expect: "ICE" },
  { lang: "ru", q: "Как зарегистрировать ассоциацию в Марокко?", expect: "Марокко" },
  { lang: "es", q: "¿Cómo descargo la aplicación Android?", expect: "APK" },
  { lang: "de", q: "Was ist das Bulletin Officiel?", expect: "Amtsblatt" },
  { lang: "nl", q: "Hoe wordt ik lid van een vereniging?", expect: "MAMP" },
  { lang: "it", q: "Come funziona la contabilità dell'associazione?", expect: "contabilit" },
  { lang: "fr", q: "akwa fih akhbar.gov.ma wach n9dro ntl3o lih?", expect: "__NOT_FOUND__" },
  { lang: "en", q: "what is the phone number of the ministry of sports?", expect: "__NOT_FOUND__" },
];

let pass = 0;
for (const c of cases) {
  const r = localKBAnswer(c.q, c.lang);
  const content = r.content.toLowerCase();
  let ok: boolean;
  if (c.expect === "__NOT_FOUND__") {
    ok = !r.found;
  } else {
    ok = r.found && content.includes(c.expect.toLowerCase());
  }
  console.log(`${ok ? "✅" : "❌"} [${c.lang}] ${c.q.slice(0, 55)}`);
  if (!ok) {
    console.log(`   expected: ${c.expect}`);
    console.log(`   got: ${r.content.slice(0, 220).replace(/\n/g, " | ")}`);
  } else {
    pass++;
  }
}
console.log(`\n${pass}/${cases.length} نجح`);
if (pass !== cases.length) process.exit(1);
