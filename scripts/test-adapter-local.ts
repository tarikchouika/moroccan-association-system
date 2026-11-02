/**
 * اختبار محلي: هل يطبّق العميل المولَّد خيار adapter؟
 * محاكاة محوّل D1 بدائي يكشف المسار المتخذ.
 */
import { PrismaClient } from "@prisma/client";

const fakeAdapter = {
  adapterName: "fake-d1",
  provider: "sqlite",
  options: {},
  connect: async () => fakeAdapter,
  disconnect: async () => {},
  executeRaw: async (query) => ({ rows: [] }),
  queryRaw: async (query, params) => {
    console.log("queryRaw called:", String(query).slice(0, 120).replace(/\s+/g, " "));
    return { rows: [{ email: "test@x.ma", role: "SUPER_ADMIN" }] };
  },
  getConnectionInfo: async () => ({ type: "sqlite" }),
  transaction: {
    start: async () => ({}),
    commit: async () => {},
    rollback: async () => {},
  },
};

const prisma = new PrismaClient({ adapter: fakeAdapter, log: ["error", "warn"] });
console.log("client constructed with adapter");
try {
  const users = await prisma.user.findMany({ select: { email: true, role: true } });
  console.log("RESULT:", users);
  console.log("✅ المحوّل يُطبَّق — المسار سليم");
} catch (e) {
  console.log("❌ ERROR:", e.constructor.name);
  console.log(String(e.message).slice(0, 400));
}
