/**
 * توليد SQL بذر قاعدة D1 الإنتاجية — حساب السوبر أدمين فقط.
 * التشفير مطابق لـ src/lib/auth.ts (scrypt: N=16384, r=8, p=1، 64 بايت).
 * الاستعمال: bun scripts/gen-d1-seed.ts > d1/seed.sql
 */
import { scryptSync, randomBytes } from "crypto";

const SUPER_ADMIN = {
  email: "tarikchouika@gmail.com",
  password: "Tch@10mn",
  fullName: "طريق الشويكة",
};

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

const id = randomBytes(12).toString("hex"); // معرف ثابت الطول
const email = esc(SUPER_ADMIN.email);
const name = esc(SUPER_ADMIN.fullName);
const hash = esc(hashPassword(SUPER_ADMIN.password));

console.log(`-- بذرة D1 الإنتاجية — السوبر أدمين فقط (لا حسابات تجريبية)
-- تُطبَّق عبر: npx wrangler d1 execute mamp-db --remote --file=d1/seed.sql
INSERT INTO User (id, email, passwordHash, fullName, phone, nationalId, nationality, avatarUrl, role, isActive, "createdAt", "updatedAt")
VALUES ('${id}', '${email}', '${hash}', '${name}', NULL, NULL, 'MA', NULL, 'SUPER_ADMIN', 1, datetime('now'), datetime('now'));`);
