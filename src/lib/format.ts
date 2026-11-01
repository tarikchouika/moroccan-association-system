/** تنسيقات العرض — العملة والتواريخ */

export function fmtMAD(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return `${rounded.toLocaleString("en-US", { maximumFractionDigits: 0 })} د.م`;
}

export function fmtMADPrecise(amount: number): string {
  return `${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} د.م`;
}

export function fmtDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("ar-MA-u-nu-latn", { day: "numeric", month: "long", year: "numeric" });
}

export function fmtDateShort(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB");
}

export function fmtNumber(n: number): string {
  return n.toLocaleString("en-US");
}
