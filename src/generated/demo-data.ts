// ⚠️ ملف مولّد آلياً بواسطة scripts/generate-demo-data.ts — لا تحرره يدوياً
import type { DemoData } from "./types";

export const DEMO_DATA: DemoData = {
  "generatedAt": "2026-11-01T12:03:40.437Z",
  "stats": {
    "users": 20,
    "associations": 4,
    "activeMembers": 15,
    "transactions": 20,
    "donations": 7,
    "managedAmount": 290260
  },
  "associations": [
    {
      "slug": "association-nadwa-tanmiya",
      "name": "جمعية ندوة للتنمية والتشغيل",
      "acronym": "ندوة",
      "category": "تنموية",
      "city": "الدار البيضاء",
      "region": "الدار البيضاء - سطات",
      "description": "جمعية تنموية تعمل على تأهيل الشباب ودعم المقاولاتية الصغرى وتشجيع التشغيل الذاتي بجهة الدار البيضاء - سطات، عبر برامج تكوينية ومرافقة المشاريع.",
      "mission": "تمكين الشباب من الكفاءات المهنية والرقمية، ومرافقة المشاريع المقاولاتية الناشئة، والمساهمة في التنمية المحلية المستدامة.",
      "foundedAt": "2016-03-12T00:00:00.000Z",
      "legalStatus": "PUBLIC_UTILITY",
      "isVerified": true,
      "viewCount": 4820,
      "memberCount": 10,
      "donationCount": 7,
      "iceNumber": "002587410000073"
    },
    {
      "slug": "association-al-mashriq-thaqafiya",
      "name": "جمعية المشرق للثقافة والفنون",
      "acronym": "المشرق",
      "category": "ثقافية",
      "city": "فاس",
      "region": "فاس - مكناس",
      "description": "فضاء ثقافي وفني بمدينة فاس، ينظم ملتقيات ومهرجانات في الموسيقى والمسرح والفن التشكيلي، ويصون التراث الثقافي العريق للمدينة.",
      "mission": "إشاعة الثقافة والفنون وإبراز التراث المغربي الأصيل وتقريبها من الشباب.",
      "foundedAt": "2018-09-05T00:00:00.000Z",
      "legalStatus": "DECLARED",
      "isVerified": true,
      "viewCount": 3175,
      "memberCount": 2,
      "donationCount": 0,
      "iceNumber": "003162980000021"
    },
    {
      "slug": "association-mido-biya",
      "name": "جمعية ميدو لحماية البيئة",
      "acronym": "ميدو",
      "category": "بيئية",
      "city": "أكادير",
      "region": "سوس - ماسة",
      "description": "جمعية بيئية بمدينة أكادير تعمل على التربية البيئية وعمليات تشجير السواحل وتنظيف الشواطئ والحساسة البيئية، بمشاركة المتطوعين والمدارس.",
      "mission": "حماية البيئة المحلية ونشر ثقافة التنمية المستدامة لدى الناشئة.",
      "foundedAt": "2020-01-20T00:00:00.000Z",
      "legalStatus": "DECLARED",
      "isVerified": true,
      "viewCount": 2284,
      "memberCount": 2,
      "donationCount": 0,
      "iceNumber": "004421870000048"
    }
  ],
  "events": [
    {
      "id": "cmvxdxxrf0046q26lhegklmhu",
      "title": "الدورة التكوينية السابعة في تطوير الويب",
      "category": "تكوينية",
      "startDate": "2026-11-22T05:24:24.745Z",
      "location": "مقر الجمعية، الدار البيضاء",
      "city": "الدار البيضاء",
      "maxParticipants": 30,
      "associationName": "جمعية ندوة للتنمية والتشغيل",
      "associationSlug": "association-nadwa-tanmiya"
    },
    {
      "id": "cmvxdxxre0040q26l32fhyxih",
      "title": "ملتقى المقاولاتية الشابة",
      "category": "تحسيسة",
      "startDate": "2026-12-16T05:24:24.745Z",
      "location": "قاعة المؤتمرات، الدار البيضاء",
      "city": "الدار البيضاء",
      "maxParticipants": 120,
      "associationName": "جمعية ندوة للتنمية والتشغيل",
      "associationSlug": "association-nadwa-tanmiya"
    }
  ]
};
