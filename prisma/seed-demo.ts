/**
 * MAMP — بيانات تجريبية واقعية للمنصة
 * تُنفَّذ عبر: bun run db:seed
 */
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// --- تشفير كلمات السر (scrypt بدون اعتماديات خارجية) ---
import { scryptSync, randomBytes } from "crypto";
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const CITIES: Record<string, string> = {
  "الدار البيضاء": "الدار البيضاء - سطات",
  "الرباط": "الرباط - سلا - القنيطرة",
  "فاس": "فاس - مكناس",
  "أكادير": "سوس - ماسة",
  "مراكش": "مراكش - آسفي",
  "طنجة": "طنجة - تطوان - الحسيمة",
};

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log("🌱 بدء تعبئة قاعدة البيانات...");

  // تفريغ الجداول
  await prisma.chatMessage.deleteMany();
  await prisma.auditLog.deleteMany()
  await prisma.projectParticipant.deleteMany()
  await prisma.collaborativeProject.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.eventRegistration.deleteMany()
  await prisma.event.deleteMany()
  await prisma.document.deleteMany()
  await prisma.donation.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.feePayment.deleteMany()
  await prisma.membership.deleteMany()
  await prisma.association.deleteMany()
  await prisma.user.deleteMany()

  // ============================================================
  // 1) المستخدمون
  // ============================================================
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@mamp.ma",
      passwordHash: hashPassword("Mamp@2026"),
      fullName: "مدير منصة مامب",
      role: "SUPER_ADMIN",
      phone: "+212600000001",
    },
  });

  const govPartner = await prisma.user.create({
    data: {
      email: "partenaire@mamp.ma",
      passwordHash: hashPassword("Mamp@2026"),
      fullName: "ممثل جهة شريكة",
      role: "PARTNER",
      phone: "+212600000002",
    },
  });

  const citizen = await prisma.user.create({
    data: {
      email: "citoyen@mamp.ma",
      passwordHash: hashPassword("Mamp@2026"),
      fullName: "يوسف المواطن",
      role: "CITIZEN",
      phone: "+212600000003",
    },
  });

  // ============================================================
  // 2) الجمعيات
  // ============================================================
  const nadwa = await prisma.association.create({
    data: {
      slug: "association-nadwa-tanmiya",
      name: "جمعية ندوة للتنمية والتشغيل",
      acronym: "ندوة",
      description:
        "جمعية تنموية تعمل على تأهيل الشباب ودعم المقاولاتية الصغرى وتشجيع التشغيل الذاتي بجهة الدار البيضاء - سطات، عبر برامج تكوينية ومرافقة المشاريع.",
      mission:
        "تمكين الشباب من الكفاءات المهنية والرقمية، ومرافقة المشاريع المقاولاتية الناشئة، والمساهمة في التنمية المحلية المستدامة.",
      category: "تنموية",
      city: "الدار البيضاء",
      region: CITIES["الدار البيضاء"],
      address: "شارع الزرقطوني، الدار البيضاء 20250",
      email: "contact@nadwa.ma",
      phone: "+212522000001",
      foundedAt: new Date("2016-03-12"),
      legalStatus: "PUBLIC_UTILITY",
      iceNumber: "002587410000073",
      taxId: "40213509",
      bankRib: "011 780 0000012345678901 23",
      donationsEnabled: true,
      donationBankName: "القرض الشعبي المغربي — وكالة الدار البيضاء أنفا",
      donationRib: "181 810 2121167890345120 34",
      donationCcp: "2456178",
      donationInstructions: "تُوجَّل إشعارات التحويل إلى بريد الجمعية مع الاسم الكامل للداعم.",
      acceptInKind: true,
      inKindNeeds: "تجهيزات رقمية · كتب تكوينية · عتاد ورشات المقاولاتية",
      status: "ACTIVE",
      isVerified: true,
      verifiedAt: new Date("2024-02-01"),
      viewCount: 4820,
    },
  });

  const alMashriq = await prisma.association.create({
    data: {
      slug: "association-al-mashriq-thaqafiya",
      name: "جمعية المشرق للثقافة والفنون",
      acronym: "المشرق",
      description:
        "فضاء ثقافي وفني بمدينة فاس، ينظم ملتقيات ومهرجانات في الموسيقى والمسرح والفن التشكيلي، ويصون التراث الثقافي العريق للمدينة.",
      mission: "إشاعة الثقافة والفنون وإبراز التراث المغربي الأصيل وتقريبها من الشباب.",
      category: "ثقافية",
      city: "فاس",
      region: CITIES["فاس"],
      address: "حي النرجس، فاس 30070",
      email: "info@almashriq.ma",
      phone: "+212535000002",
      foundedAt: new Date("2018-09-05"),
      legalStatus: "DECLARED",
      iceNumber: "003162980000021",
      donationsEnabled: true,
      donationBankName: "بنك أفريقيا — وكالة الرباط أكدال",
      donationRib: "013 780 0000245819370215 61",
      donationInstructions: "الدعم العيني يُستقبل بمقر الجمعية أيام الأربعاء والجمعة.",
      acceptInKind: true,
      inKindNeeds: "بطانيات شتوية · مواد غذائية غير قابلة للتلف",
      status: "ACTIVE",
      isVerified: true,
      verifiedAt: new Date("2024-03-15"),
      viewCount: 3175,
    },
  });

  const mido = await prisma.association.create({
    data: {
      slug: "association-mido-biya",
      name: "جمعية ميدو لحماية البيئة",
      acronym: "ميدو",
      description:
        "جمعية بيئية بمدينة أكادير تعمل على التربية البيئية وعمليات تشجير السواحل وتنظيف الشواطئ والحساسة البيئية، بمشاركة المتطوعين والمدارس.",
      mission: "حماية البيئة المحلية ونشر ثقافة التنمية المستدامة لدى الناشئة.",
      category: "بيئية",
      city: "أكادير",
      region: CITIES["أكادير"],
      address: "شارع الحسن الثاني، أكادير 80000",
      email: "contact@mido-env.ma",
      phone: "+212528000003",
      foundedAt: new Date("2020-01-20"),
      legalStatus: "DECLARED",
      iceNumber: "004421870000048",
      status: "ACTIVE",
      isVerified: true,
      verifiedAt: new Date("2024-04-02"),
      viewCount: 2284,
    },
  });

  const amal = await prisma.association.create({
    data: {
      slug: "association-amal-ijtimaiya",
      name: "جمعية أمل للعمل الاجتماعي",
      acronym: "أمل",
      description:
        "جمعية اجتماعية بالرباط تدعم الأسر في وضعية هشاشة، وتنظم قوافل إنسانية ودعم مدرسي وصحي للأطفال والأرامل والمسنين.",
      mission: "التكافل الاجتماعي ودعم الفئات الهشة وتحسين ظروف عيش الأسر المعوزة.",
      category: "اجتماعية",
      city: "الرباط",
      region: CITIES["الرباط"],
      address: "حي أكدال، الرباط 10000",
      email: "contact@amal.ma",
      phone: "+212537000004",
      foundedAt: new Date("2015-06-18"),
      legalStatus: "PUBLIC_UTILITY",
      iceNumber: "001345620000019",
      status: "PENDING",
      isVerified: false,
      viewCount: 967,
    },
  });

  // ============================================================
  // 3) أعضاء الجمعيات (أدمين + كوأدمين + منخرطون + متطوعون)
  // ============================================================
  const mkUser = (i: number, name: string, role: string) =>
    prisma.user.create({
      data: {
        email: `user${i}@mamp.ma`,
        passwordHash: hashPassword("Mamp@2026"),
        fullName: name,
        role,
      },
    });

  const u1 = await mkUser(1, "سعاد العلمي (رئيسة ندوة)", "ASSOCIATION_ADMIN");
  const u2 = await mkUser(2, "خالد بناني (أمين مال ندوة)", "ASSOCIATION_ADMIN");
  const u3 = await mkUser(3, "ياسمين الفاسي (كوأدمين ندوة)", "CO_ADMIN");
  const u4 = await mkUser(4, "عمر الإدريسي (متطوع)", "CO_ADMIN");
  const u5 = await mkUser(5, "نادية الشرقاوي (رئيسة المشرق)", "ASSOCIATION_ADMIN");
  const u6 = await mkUser(6, "حمزة التازي (كوأدمين المشرق)", "CO_ADMIN");
  const u7 = await mkUser(7, "ليلى بنعمر (رئيسة ميدو)", "ASSOCIATION_ADMIN");
  const u8 = await mkUser(8, "أيوب أوبيهي (متطوع ميدو)", "CO_ADMIN");
  const u9 = await mkUser(9, "فاطمة الزهراء (رئيسة أمل)", "ASSOCIATION_ADMIN");

  await prisma.membership.createMany({
    data: [
      { userId: u1.id, associationId: nadwa.id, roleInAssociation: "PRESIDENT", memberType: "ACTIVE", membershipNumber: "NDW-0001", status: "ACTIVE", joinedAt: new Date("2016-03-12"), cndpConsent: true, cndpConsentAt: new Date("2016-03-12") },
      { userId: u2.id, associationId: nadwa.id, roleInAssociation: "TREASURER", memberType: "ACTIVE", membershipNumber: "NDW-0002", status: "ACTIVE", joinedAt: new Date("2016-04-02"), cndpConsent: true, cndpConsentAt: new Date("2016-04-02") },
      { userId: u3.id, associationId: nadwa.id, roleInAssociation: "CO_ADMIN", memberType: "ACTIVE", membershipNumber: "NDW-0003", status: "ACTIVE", joinedAt: new Date("2019-01-15"), cndpConsent: true, cndpConsentAt: new Date("2019-01-15") },
      { userId: u4.id, associationId: nadwa.id, roleInAssociation: "VOLUNTEER", memberType: "STUDENT", membershipNumber: "NDW-0004", status: "ACTIVE", joinedAt: new Date("2023-02-10"), cndpConsent: true, cndpConsentAt: new Date("2023-02-10") },
      { userId: u5.id, associationId: alMashriq.id, roleInAssociation: "PRESIDENT", memberType: "ACTIVE", membershipNumber: "MSHQ-0001", status: "ACTIVE", joinedAt: new Date("2018-09-05"), cndpConsent: true, cndpConsentAt: new Date("2018-09-05") },
      { userId: u6.id, associationId: alMashriq.id, roleInAssociation: "CO_ADMIN", memberType: "ACTIVE", membershipNumber: "MSHQ-0002", status: "ACTIVE", joinedAt: new Date("2019-10-01"), cndpConsent: true, cndpConsentAt: new Date("2019-10-01") },
      { userId: u7.id, associationId: mido.id, roleInAssociation: "PRESIDENT", memberType: "ACTIVE", membershipNumber: "MDO-0001", status: "ACTIVE", joinedAt: new Date("2020-01-20"), cndpConsent: true, cndpConsentAt: new Date("2020-01-20") },
      { userId: u8.id, associationId: mido.id, roleInAssociation: "VOLUNTEER", memberType: "ACTIVE", membershipNumber: "MDO-0002", status: "ACTIVE", joinedAt: new Date("2022-08-14"), cndpConsent: true, cndpConsentAt: new Date("2022-08-14") },
      { userId: u9.id, associationId: amal.id, roleInAssociation: "PRESIDENT", memberType: "HONORARY", membershipNumber: "AML-0001", status: "ACTIVE", joinedAt: new Date("2015-06-18"), cndpConsent: true, cndpConsentAt: new Date("2015-06-18") },
    ],
  });

  // منخرطون إضافيون لجمعية ندوة (بيانات وصفية)
  const extraMembers = [
    ["رشيد المالكي", "MEMBER", "ACTIVE", "مهندس"],
    ["سلمى بوعزة", "MEMBER", "ACTIVE", "طالبة"],
    ["منير الصقلي", "BOARD_MEMBER", "ACTIVE", "أستاذ"],
    ["هدى بلقاضي", "MEMBER", "PENDING", "موظفة"],
    ["ياسين الرامي", "VOLUNTEER", "ACTIVE", "طالب"],
    ["أمينة السباعي", "MEMBER", "ACTIVE", "طبيبة"],
    ["كريم الفيلالي", "BOARD_MEMBER", "ACTIVE", "تاجر"],
    ["زينب العثماني", "MEMBER", "SUSPENDED", "محامية"],
  ] as const;

  for (let i = 0; i < extraMembers.length; i++) {
    const [name, role, status, profession] = extraMembers[i];
    const u = await prisma.user.create({
      data: {
        email: `member${i + 1}@nadwa.ma`,
        passwordHash: hashPassword("Mamp@2026"),
        fullName: name,
        role: "CITIZEN",
      },
    });
    await prisma.membership.create({
      data: {
        userId: u.id,
        associationId: nadwa.id,
        roleInAssociation: role,
        memberType: "ACTIVE",
        membershipNumber: `NDW-${String(i + 5).padStart(4, "0")}`,
        status,
        joinedAt: new Date(2020 + (i % 5), (i * 3) % 12, 5 + i),
        profession,
        cndpConsent: true,
        cndpConsentAt: new Date(2020 + (i % 5), (i * 3) % 12, 5 + i),
      },
    });
  }

  // ============================================================
  // 4) واجبات الانخراط
  // ============================================================
  const ndwMembers = await prisma.membership.findMany({
    where: { associationId: nadwa.id, status: "ACTIVE" },
  });
  let feeSeq = 1;
  for (const m of ndwMembers) {
    for (const year of [2025, 2026]) {
      if (year === 2026 && m.membershipNumber.endsWith("4")) continue; // بعض المنخرطين لم يؤدوا بعد
      await prisma.feePayment.create({
        data: {
          year,
          amount: 120,
          method: "CASH",
          receiptNumber: `NDW-FEE-${year}-${String(feeSeq++).padStart(3, "0")}`,
          paidAt: new Date(year, 1, 15),
          membershipId: m.id,
          associationId: nadwa.id,
        },
      });
    }
  }

  // ============================================================
  // 5) العمليات المالية (سنتان)
  // ============================================================
  const txData: Array<[string, "INCOME" | "EXPENSE", string, number, number]> = [
    // [وصف، نوع، فئة، مبلغ، شهر قبل الآن]
    ["واجبات انخراطات الأعضاء 2025", "INCOME", "انخراطات", 1440, 10],
    ["تبرع نقدي من مقاولة وطنية", "INCOME", "تبرعات", 25000, 9],
    ["إعانة من وكالة عمومية لدعم التكوين", "INCOME", "إعانات ومساعدات", 40000, 9],
    ["مداخيل دورة تكوينية في البرمجة", "INCOME", "أنشطة وفعاليات", 9500, 8],
    ["كراء مقر الجمعية (سنة)", "EXPENSE", "كراء وتحملات", 18000, 8],
    ["اقتناء حاسبات للتكوين", "EXPENSE", "تجهيزات ومعدات", 12000, 7],
    ["أتعاب المكونين في الدورات", "EXPENSE", "أنشطة وفعاليات", 7500, 7],
    ["حملة تواصلية على الشبكات", "EXPENSE", "تواصل وتكوين", 3200, 6],
    ["مصاريف إدارية (بريد، طباعة)", "EXPENSE", "أتعاب ومصاريف إدارية", 1800, 6],
    ["تبرع منعضو فاعل خير", "INCOME", "تبرعات", 8000, 5],
    ["ورشة تحسيسية بالتشغيل الذاتي", "EXPENSE", "أنشطة وفعاليات", 4600, 5],
    ["مداخيل معرض المقاولات الصغرى", "INCOME", "أنشطة وفعاليات", 13200, 4],
    ["كراء قاعة المعرض", "EXPENSE", "كراء وتحملات", 5000, 4],
    ["إعانة جماعية الدار البيضاء", "INCOME", "إعانات ومساعدات", 30000, 3],
    ["اقتناء كراسي وطاولات", "EXPENSE", "تجهيزات ومعدات", 6800, 3],
    ["واجبات انخراطات 2026 (دفعة أولى)", "INCOME", "انخراطات", 720, 2],
    ["تكوين رقمي للمنخرطين", "EXPENSE", "تواصل وتكوين", 5400, 2],
    ["تبرع عيني: 10 حاسبات محمولة", "INCOME", "تبرعات", 22000, 1],
    ["تعويضات المتطوعين (تنقلات)", "EXPENSE", "أنشطة وفعاليات", 2400, 1],
    ["اشتراك سنوي في منصة رقمية", "EXPENSE", "أتعاب ومصاريف إدارية", 3600, 0],
  ];

  let txSeq = 1;
  for (const [desc, type, cat, amount, monthsAgo] of txData) {
    await prisma.transaction.create({
      data: {
        description: desc,
        type,
        category: cat,
        amount,
        date: new Date(2026, 1 - monthsAgo, 12),
        paymentMethod: type === "INCOME" ? "BANK_TRANSFER" : "CHECK",
        receiptNumber: `NDW-TX-${String(txSeq++).padStart(3, "0")}`,
        associationId: nadwa.id,
        approvedById: u2.id,
      },
    });
  }

  // ميزانية 2026
  await prisma.budget.create({
    data: {
      name: "ميزانية السنة المالية 2026",
      fiscalYear: 2026,
      plannedIncome: 160000,
      plannedExpense: 145000,
      status: "APPROVED",
      associationId: nadwa.id,
      notes: "صودق عليها من طرف الجمع العام العادي لشهر فبراير 2026",
    },
  });

  // ============================================================
  // 6) التبرعات
  // ============================================================
  const donations: Array<[string, number, boolean, string, number, string | null]> = [
    ["مؤسسة التضامن الوطنية", 25000, false, "MONEY", 9, "دعم برامج التكوين المهني"],
    ["أحمد المنجد", 5000, false, "MONEY", 6, null],
    ["متبرع كريم (مجهول)", 8000, true, "MONEY", 5, null],
    ["شركة الأطلس للاتصالات", 12000, false, "MONEY", 4, "شراكة في برنامج التكوين الرقمي"],
    ["سعاد بنجلون", 1500, false, "MONEY", 2, "بارك الله فيكم"],
    ["جمعية شراكة فرنسية", 18000, false, "MONEY", 1, "مشروع تشجير الأحياء"],
    ["محمد الحسني", 600, false, "MONEY", 0, null],
  ];
  let dnSeq = 1;
  for (const [name, amount, anon, type, monthsAgo, msg] of donations) {
    await prisma.donation.create({
      data: {
        donorName: anon ? "متبرع مجهول" : name,
        isAnonymous: anon,
        amount,
        type,
        date: new Date(2026, 1 - monthsAgo, 8),
        message: msg,
        receiptIssued: true,
        receiptNumber: `NDW-DON-${String(dnSeq++).padStart(3, "0")}`,
        associationId: nadwa.id,
      },
    });
  }

  // ============================================================
  // 7) الفعاليات
  // ============================================================
  const events: Array<[string, string, string, Date, string, number, string]> = [
    ["الدورة التكوينية السابعة في تطوير الويب", "تكوينية", "مقر الجمعية، الدار البيضاء", daysFromNow(21), "الدار البيضاء", 30, "PUBLISHED"],
    ["ملتقى المقاولاتية الشابة", "تحسيسة" as unknown as string, "قاعة المؤتمرات، الدار البيضاء", daysFromNow(45), "الدار البيضاء", 120, "PUBLISHED"],
    ["ورشة تحرير السير الذاتية وريادة الأعمال", "تكوينية", "مقر الجمعية، الدار البيضاء", daysFromNow(-14), "الدار البيضاء", 25, "COMPLETED"],
    ["قافلة تشجير حي النهضة", "بيئية", "حي النهضة، الدار البيضاء", daysFromNow(-40), "الدار البيضاء", 80, "COMPLETED"],
  ];
  const [ev1] = await Promise.all(
    events.map(([title, category, location, startDate, city, max, status]) =>
      prisma.event.create({
        data: {
          title: title as string,
          category: category as string,
          location: location as string,
          startDate: startDate as Date,
          city: city as string,
          maxParticipants: max as number,
          status: status as string,
          description:
            "فعالية من تنظيم جمعية ندوة للتنمية والتشغيل، مفتوحة أمام المنخرطين والعموم. للتسجيل يرجى ملء الاستمارة عبر المنصة قبل الموعد بأسبوع على الأقل.",
          associationId: nadwa.id,
          createdById: u1.id,
        },
      })
    )
  );

  const registrants = [
    ["سلمى بوعزة", "s.bouaza@example.ma", "+212661111111"],
    ["ياسين الرامي", "y.ramii@example.ma", "+212662222222"],
    ["إيمان الصحراوي", "i.sahraoui@example.ma", "+212663333333"],
    ["مهدي بنعيسى", "m.benaissa@example.ma", "+212664444444"],
    ["خديجة الوزاني", "k.ouazzani@example.ma", "+212665555555"],
  ];
  await prisma.eventRegistration.createMany({
    data: registrants.map(([fullName, email, phone]) => ({
      eventId: ev1.id,
      fullName,
      email,
      phone,
      status: "REGISTERED",
    })),
  });

  // ============================================================
  // 8) الوثائق
  // ============================================================
  await prisma.document.createMany({
    data: [
      { title: "القانون الأساسي لجمعية ندوة (النسخة المحدثة 2024)", type: "STATUTES", associationId: nadwa.id, isPublic: true, description: "النص المحدث للقانون الأساسي كما صودق عليه من الجمع العام الاستثنائي.", uploadedById: u1.id, url: "#" },
      { title: "محضر الجمع العام العادي — فبراير 2026", type: "MINUTES", associationId: nadwa.id, isPublic: false, uploadedById: u1.id, url: "#" },
      { title: "التقرير الأدبي والمالي 2025", type: "ANNUAL_REPORT", associationId: nadwa.id, isPublic: true, description: "تقرير يلخص أنشطة الجمعية ووضعيتها المالية برسم سنة 2025.", uploadedById: u2.id, url: "#" },
      { title: "التقرير المالي التفصيلي 2025", type: "FINANCIAL_REPORT", associationId: nadwa.id, isPublic: false, uploadedById: u2.id, url: "#" },
      { title: "اتفاقية شراكة مع المديرية الإقليمية للتشغيل", type: "AGREEMENT", associationId: nadwa.id, isPublic: false, uploadedById: u1.id, url: "#" },
      { title: "القانون الأساسي لجمعية المشرق للثقافة والفنون", type: "STATUTES", associationId: alMashriq.id, isPublic: true, uploadedById: u5.id, url: "#" },
      { title: "التقرير السنوي 2025 — جمعية ميدو البيئية", type: "ANNUAL_REPORT", associationId: mido.id, isPublic: true, uploadedById: u7.id, url: "#" },
    ],
  });

  // ============================================================
  // 9) إشعارات وسجل تدقيق أولي
  // ============================================================
  await prisma.notification.createMany({
    data: [
      { title: "مرحباً بكم في منصة مامب", body: "تم إنشاء حسابكم بنجاح. استكملوا ملف جمعيتكم للاستفادة من جميع الخدمات.", type: "SYSTEM", userId: u1.id },
      { title: "تبرع جديد", body: "تم تسجيل تبرع جديد بمبلغ 600.00 درهم من طرف محمد الحسني.", type: "DONATION", userId: u2.id, associationId: nadwa.id },
      { title: "تسجيلات الدورة التكوينية", body: "5 تسجيلات جديدة في الدورة التكوينية السابعة لتطوير الويب.", type: "EVENT", userId: u3.id, associationId: nadwa.id },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      { action: "CREATE", entity: "Association", entityId: nadwa.id, details: "إنشاء جمعية ندوة للتنمية والتشغيل", userId: superAdmin.id },
      { action: "MODERATION", entity: "Association", entityId: nadwa.id, details: "توثيق الجمعية ومنح صفة المنفعة العامة", userId: superAdmin.id },
      { action: "CREATE", entity: "Association", entityId: amal.id, details: "طلب تسجيل جمعية أمل للعمل الاجتماعي — في انتظار المصادقة", userId: superAdmin.id },
      { action: "LOGIN", entity: "User", entityId: u1.id, details: "تسجيل دخول رئيسة الجمعية", userId: u1.id },
    ],
  });

  // ============================================================
  // 10) مشاريع وبرامج مشتركة (بين الجمعيات والجهات)
  // ============================================================
  await prisma.collaborativeProject.createMany({
    data: [
      {
        title: "برنامج محو الأمية الرقمية بالعالم القروي",
        description:
          "برنامج تكويني مشترك يستهدف 300 مستفيد بالعالم القروي في مجالات المهارات الرقمية الأساسية والبحث عن العمل إلكترونياً.",
        objectives: "تكوين 300 مستفيد · تجهيز 3 قاعات · تكوين 12 مكوّناً محلياً",
        kind: "PROGRAM",
        category: "تعليمية",
        startDate: daysFromNow(14),
        endDate: daysFromNow(120),
        location: "دار الشباب المركزية",
        city: "الجديدة",
        isPublic: true,
        status: "IN_PROGRESS",
        leadAssociationId: nadwa.id,
        createdById: superAdmin.id,
      },
      {
        title: "ملتقى الشباب للمبادرات البيئية",
        description:
          "فعالية مشتركة تجمع شباب الجمعيات لبلورة مبادرات بيئية قابلة للتمويل مع ورشات التدبير المستدام للماء والطاقة.",
        objectives: "بلورة 10 مبادرات · تشجير 3 أحياء · تحسيس 500 تلميذ",
        kind: "EVENT",
        category: "بيئية",
        startDate: daysFromNow(30),
        isPublic: true,
        status: "PUBLISHED",
        leadAssociationId: mido.id,
        createdById: superAdmin.id,
      },
      {
        title: "مشروع القوافل الطبية للتغطية الصحية بالمناطق النائية",
        description:
          "مشروع صحي مشترك لتنظيم قوافل طبية مجانية بالمناطق النائية مع توزيع أدوية أساسية بشراكة مع المختبرات الوطنية.",
        objectives: "6 قوافل · 2400 فحص طبي · توزيع 3000 وحدة دوائية",
        kind: "PROJECT",
        category: "صحية",
        startDate: daysFromNow(45),
        endDate: daysFromNow(220),
        location: "جوائع إقليمية متعددة",
        city: "بني ملال",
        isPublic: true,
        status: "PUBLISHED",
        leadAssociationId: amal.id,
        createdById: superAdmin.id,
      },
    ],
  });

  const seededProjects = await prisma.collaborativeProject.findMany({ select: { id: true, title: true } });
  const projByTitle = Object.fromEntries(seededProjects.map((p) => [p.title, p.id]));

  await prisma.projectParticipant.createMany({
    data: [
      { projectId: projByTitle["برنامج محو الأمية الرقمية بالعالم القروي"], associationId: alMashriq.id, status: "ACTIVE", partnerRole: "EXECUTION" },
      { projectId: projByTitle["برنامج محو الأمية الرقمية بالعالم القروي"], associationId: mido.id, status: "ACTIVE", partnerRole: "SUPPORT" },
      { projectId: projByTitle["برنامج محو الأمية الرقمية بالعالم القروي"], partnerName: "المديرية الإقليمية للتربية الوطنية", partnerType: "GOVERNMENT", partnerRole: "COORDINATION", status: "ACTIVE" },
      { projectId: projByTitle["برنامج محو الأمية الرقمية بالعالم القروي"], partnerName: "مؤسسة الأطلس للتنمية الرقمية", partnerType: "PRIVATE", partnerRole: "FUNDING", status: "ACTIVE" },
      { projectId: projByTitle["ملتقى الشباب للمبادرات البيئية"], associationId: amal.id, status: "ACTIVE", partnerRole: "EXECUTION" },
      { projectId: projByTitle["ملتقى الشباب للمبادرات البيئية"], partnerName: "المندوبية السامية للمياه والغابات", partnerType: "GOVERNMENT", partnerRole: "COORDINATION", status: "ACTIVE" },
      { projectId: projByTitle["ملتقى الشباب للمبادرات البيئية"], partnerName: "الشبكة المتوسطية للتنمية المستدامة", partnerType: "INTERNATIONAL", partnerRole: "SUPPORT", status: "ACTIVE" },
      { projectId: projByTitle["مشروع القوافل الطبية للتغطية الصحية بالمناطق النائية"], associationId: nadwa.id, status: "ACTIVE", partnerRole: "FUNDING" },
      { projectId: projByTitle["مشروع القوافل الطبية للتغطية الصحية بالمناطق النائية"], partnerName: "المديرية الجهوية للصحة", partnerType: "GOVERNMENT", partnerRole: "COORDINATION", status: "ACTIVE" },
    ],
  });

  // ============================================================
  // ملخص
  // ============================================================
  const counts = {
    users: await prisma.user.count(),
    associations: await prisma.association.count(),
    memberships: await prisma.membership.count(),
    transactions: await prisma.transaction.count(),
    donations: await prisma.donation.count(),
    events: await prisma.event.count(),
    documents: await prisma.document.count(),
  };
  console.log("✅ تمت التعبئة بنجاح:", counts);
  console.log("👤 حسابات الدخول التجريبية (كلمة السر موحدة: Mamp@2026):");
  console.log("   • السوبر أدمين: admin@mamp.ma");
  console.log("   • أدمين جمعية:  user1@mamp.ma (رئيسة ندوة)");
  console.log("   • أمين المال:   user2@mamp.ma");
  console.log("   • كوأدمين:      user3@mamp.ma");
  console.log("   • شريك حكومي:   partenaire@mamp.ma");
  console.log("   • مواطن:        citoyen@mamp.ma");
}

main()
  .catch((e) => {
    console.error("❌ فشل التعبئة:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
