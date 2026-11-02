"use client";

/**
 * أدوات رفع الصور — ضغط وتصغير في المتصفح قبل الإرسال.
 * نستعمل canvas لتصغير الأبعاد (الصور الرمزية 512px، اللوغوات 512px،
 * وثائق الهوية 1280px) ثم ترميز WebP/JPEG بجودة مضبوطة، فنبقى ضمن
 * حدود الحجم المعتمدة في واجهة الرفع دون مساس بالجودة البصرية.
 */

export interface ResizeOptions {
  /** أقصى بعد (عرض أو ارتفاع) بالبكسل */
  maxDim: number;
  /** جودة الترميز 0..1 */
  quality: number;
  /** صيغة الإخراج */
  mime?: "image/webp" | "image/jpeg";
  /** أقصى حجم نهائي بالبايت (نخفض الجودة تدريجياً لاحترامه) */
  maxBytes?: number;
}

export const RESIZE_PRESETS = {
  /** صورة المستخدم الرمزية */
  avatar: { maxDim: 512, quality: 0.85, mime: "image/webp" as const, maxBytes: 280 * 1024 },
  /** لوغو الجمعية */
  logo: { maxDim: 512, quality: 0.88, mime: "image/webp" as const, maxBytes: 280 * 1024 },
  /** وثيقة هوية (بطاقة/جواز/رخصة) */
  identity: { maxDim: 1280, quality: 0.82, mime: "image/jpeg" as const, maxBytes: 850 * 1024 },
  /** وثيقة رسمية لتأسيس الجمعية (قانون أساسي/محضر/وصل) */
  document: { maxDim: 1400, quality: 0.72, mime: "image/jpeg" as const, maxBytes: 420 * 1024 },
} satisfies Record<string, ResizeOptions>;

/** تحويل ملف صورة إلى data URL مضغوط — يرفض الملفات غير الصورية */
export async function fileToResizedDataUrl(
  file: File,
  opts: ResizeOptions
): Promise<string> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    throw new Error("المرجو اختيار صورة بصيغة PNG أو JPEG أو WebP");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("حجم الملف كبير جداً (12 ميغابايت كحد أقصى)");
  }

  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, opts.maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("تعذر تجهيز الصورة في هذا المتصفح");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close();

  const mime = opts.mime ?? "image/webp";
  const maxBytes = opts.maxBytes ?? 300 * 1024;

  // محاولة الجودة الأساسية ثم خفض تدريجي عند تجاوز الحجم
  let quality = opts.quality;
  let dataUrl = canvas.toDataURL(mime, quality);
  while (dataUrl.length * 0.75 > maxBytes && quality > 0.4) {
    quality -= 0.12;
    dataUrl = canvas.toDataURL(mime, quality);
  }
  // إن ظل الحجم فوق السقف (صور بالغة التعقيد) نُنزل الأبعاد خطوة إضافية
  if (dataUrl.length * 0.75 > maxBytes) {
    const c2 = document.createElement("canvas");
    c2.width = Math.round(w * 0.8);
    c2.height = Math.round(h * 0.8);
    const ctx2 = c2.getContext("2d");
    if (ctx2) {
      ctx2.imageSmoothingQuality = "high";
      ctx2.drawImage(canvas, 0, 0, c2.width, c2.height);
      dataUrl = c2.toDataURL(mime, Math.max(0.45, quality - 0.1));
    }
  }
  return dataUrl;
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* نجرب المسار الكلاسيكي */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("تعذر قراءة الصورة"));
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** اسم مألوف لنوع وثيقة الهوية */
export const ID_DOC_LABELS: Record<string, string> = {
  NATIONAL_ID: "البطاقة الوطنية",
  PASSPORT: "جواز السفر",
  DRIVERS_LICENSE: "رخصة السياقة",
};
