// ⚠️ ملف مولّد آلياً بواسطة scripts/generate-demo-data.ts — لا تحرره يدوياً
import type { DemoData } from "./types";

export const DEMO_DATA: DemoData = {
  "generatedAt": "2026-11-02T05:54:15.019Z",
  "stats": {
    "users": 20,
    "associations": 4,
    "activeMembers": 15,
    "transactions": 22,
    "donations": 7,
    "managedAmount": 290271
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
      "iceNumber": "002587410000073",
      "logoUrl": null
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
      "iceNumber": "003162980000021",
      "logoUrl": null
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
      "iceNumber": "004421870000048",
      "logoUrl": null
    }
  ],
  "events": [
    {
      "id": "cmvykyogz0040rfxqe69g4wep",
      "title": "الدورة التكوينية السابعة في تطوير الويب",
      "category": "تكوينية",
      "startDate": "2026-11-23T01:28:42.850Z",
      "location": "مقر الجمعية، الدار البيضاء",
      "city": "الدار البيضاء",
      "maxParticipants": 30,
      "associationName": "جمعية ندوة للتنمية والتشغيل",
      "associationSlug": "association-nadwa-tanmiya"
    },
    {
      "id": "cmvykyogz0042rfxqda2o04ci",
      "title": "ملتقى المقاولاتية الشابة",
      "category": "تحسيسة",
      "startDate": "2026-12-17T01:28:42.850Z",
      "location": "قاعة المؤتمرات، الدار البيضاء",
      "city": "الدار البيضاء",
      "maxParticipants": 120,
      "associationName": "جمعية ندوة للتنمية والتشغيل",
      "associationSlug": "association-nadwa-tanmiya"
    }
  ],
  "projects": [
    {
      "id": "cmvyquqdr0001lvycyibfcaar",
      "title": "برنامج محو الأمية الرقمية بالعالم القروي",
      "description": "برنامج تكويني مشترك يستهدف 300 مستفيد بالعالم القروي في مجالات المهارات الرقمية الأساسية والبحث عن العمل إلكترونياً، عبر قاعات مجهزة ونظام تكوين عن بعد.",
      "objectives": "تكوين 300 مستفيد · تجهيز 3 قاعات متعددة الوسائط · تكوين 12 مكوّناً محلياً",
      "kind": "PROGRAM",
      "category": "تعليمية",
      "startDate": "2026-11-16T04:13:36.398Z",
      "endDate": "2027-03-02T04:13:36.398Z",
      "location": "دار الشباب المركزية",
      "city": "الجديدة",
      "status": "IN_PROGRESS",
      "leadName": "جمعية ندوة للتنمية والتشغيل",
      "leadSlug": "association-nadwa-tanmiya",
      "participants": [
        {
          "name": "جمعية المشرق للثقافة والفنون",
          "type": "ASSOCIATION",
          "role": "EXECUTION",
          "status": "ACTIVE"
        },
        {
          "name": "جمعية ميدو لحماية البيئة",
          "type": "ASSOCIATION",
          "role": "SUPPORT",
          "status": "ACTIVE"
        },
        {
          "name": "المديرية الإقليمية للتربية الوطنية",
          "type": "GOVERNMENT",
          "role": "COORDINATION",
          "status": "ACTIVE"
        },
        {
          "name": "مؤسسة الأطلس للتنمية الرقمية",
          "type": "PRIVATE",
          "role": "FUNDING",
          "status": "ACTIVE"
        }
      ]
    },
    {
      "id": "cmvyquqdu0008lvycsp4ifk5f",
      "title": "ملتقى الشباب للمبادرات البيئية",
      "description": "فعالية مشتركة تجمع شباب الجمعيات لبلورة مبادرات بيئية قابلة للتمويل، مع ورشات حول التدبير المستدام للماء والطاقة وتشجير الأحياء.",
      "objectives": "بلورة 10 مبادرات · تشجير 3 أحياء · تحسيس 500 تلميذ",
      "kind": "EVENT",
      "category": "بيئية",
      "startDate": "2026-12-02T04:13:36.398Z",
      "endDate": null,
      "location": "مركز اللقاءات الحضرية",
      "city": "الدار البيضاء",
      "status": "PUBLISHED",
      "leadName": "جمعية ميدو لحماية البيئة",
      "leadSlug": "association-mido-biya",
      "participants": [
        {
          "name": "جمعية أمل للعمل الاجتماعي",
          "type": "ASSOCIATION",
          "role": "EXECUTION",
          "status": "ACTIVE"
        },
        {
          "name": "المندوبية السامية للمياه والغابات",
          "type": "GOVERNMENT",
          "role": "COORDINATION",
          "status": "ACTIVE"
        },
        {
          "name": "الشبكة المتوسطية للتنمية المستدامة",
          "type": "INTERNATIONAL",
          "role": "SUPPORT",
          "status": "ACTIVE"
        }
      ]
    },
    {
      "id": "cmvyquqdw000elvyckrncyyz3",
      "title": "مشروع القوافل الطبية للتغطية الصحية بالمناطق النائية",
      "description": "مشروع صحي مشترك لتنظيم قوافل طبية مجانية بالمناطق النائية: فحوصات عامة، تخصصات أساسية، وتوزيع أدوية أساسية بشراكة مع المختبرات الوطنية.",
      "objectives": "6 قوافل · 2400 فحص طبي · توزيع 3000 وحدة دوائية",
      "kind": "PROJECT",
      "category": "صحية",
      "startDate": "2026-12-17T04:13:36.398Z",
      "endDate": "2027-06-10T04:13:36.398Z",
      "location": "جوائع إقليمية متعددة",
      "city": "بني ملال",
      "status": "PUBLISHED",
      "leadName": "جمعية أمل للعمل الاجتماعي",
      "leadSlug": "association-amal-ijtimaiya",
      "participants": [
        {
          "name": "جمعية ندوة للتنمية والتشغيل",
          "type": "ASSOCIATION",
          "role": "FUNDING",
          "status": "ACTIVE"
        },
        {
          "name": "المديرية الجهوية للصحة",
          "type": "GOVERNMENT",
          "role": "COORDINATION",
          "status": "ACTIVE"
        },
        {
          "name": "تعاونية صيدلة الأمل",
          "type": "PRIVATE",
          "role": "SUPPORT",
          "status": "ACTIVE"
        }
      ]
    }
  ]
};
