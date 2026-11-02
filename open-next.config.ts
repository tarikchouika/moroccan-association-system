import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * إعداد OpenNext لسحب منصة مامب إلى Cloudflare Workers.
 * لا نستعمل ISR — الصفحات العمومية تُخدَّم من أصول كلاودفلير الثابتة
 * (مشروع Pages) ولوحة التحكم وكل مسارات API ديناميكية بالكامل،
 * لذا لا حاجة لذاكرة تخزين R2 للتخزين التدريجي.
 */
export default defineCloudflareConfig({});
