#!/usr/bin/env python3
"""إدراج قسم meta (عناوين التبويب والوصف) في القواميس الثمانية قبل نهاية كل ملف."""
import re, sys

META = {
"ar": {
  "siteName": "منصة مامب",
  "siteTitle": "منصة مامب — إدارة الجمعيات المغربية",
  "siteDescription": "منصة رقمية احترافية لإدارة الجمعيات المغربية: الانخراطات، المحاسبة، التبرعات، الفعاليات والوثائق الرسمية — وفق القانون 75.00 والظهير الشريف 1.58.376.",
  "pages": {
    "associations": "دليل الجمعيات الموثقة",
    "legal": "المرجع القانوني للعمل الجمعوي المغربي",
    "terms": "شروط استخدام المنصة",
    "privacy": "سياسة الخصوصية وحماية المعطيات",
    "cookies": "سياسة ملفات تعريف الارتباط",
    "assistant": "المساعد الجمعوي",
    "app": "تطبيق أندرويد الرسمي",
    "login": "تسجيل الدخول",
    "register": "إنشاء حساب",
    "notFound": "صفحة غير موجودة",
  },
},
"fr": {
  "siteName": "Plateforme MAMP",
  "siteTitle": "Plateforme MAMP — Gestion des associations marocaines",
  "siteDescription": "Plateforme numérique professionnelle de gestion des associations marocaines : adhésions, comptabilité, dons, événements et documents officiels — conformément à la loi 75.00 et au dahir n° 1.58.376.",
  "pages": {
    "associations": "Annuaire des associations certifiées",
    "legal": "Référence juridique du travail associatif marocain",
    "terms": "Conditions d'utilisation de la plateforme",
    "privacy": "Politique de confidentialité et de protection des données",
    "cookies": "Politique relative aux cookies",
    "assistant": "Assistant Associatif",
    "app": "Application Android officielle",
    "login": "Connexion",
    "register": "Créer un compte",
    "notFound": "Page introuvable",
  },
},
"en": {
  "siteName": "MAMP Platform",
  "siteTitle": "MAMP Platform — Management of Moroccan Associations",
  "siteDescription": "Professional digital platform for managing Moroccan associations: memberships, accounting, donations, events and official documents — in accordance with Law 75.00 and Royal Dahir 1.58.376.",
  "pages": {
    "associations": "Directory of certified associations",
    "legal": "Legal reference for Moroccan associative work",
    "terms": "Terms of use of the platform",
    "privacy": "Privacy and data protection policy",
    "cookies": "Cookie policy",
    "assistant": "Associative Assistant",
    "app": "Official Android app",
    "login": "Log in",
    "register": "Create an account",
    "notFound": "Page not found",
  },
},
"es": {
  "siteName": "Plataforma MAMP",
  "siteTitle": "Plataforma MAMP — Gestión de las asociaciones marroquíes",
  "siteDescription": "Plataforma digital profesional para la gestión de las asociaciones marroquíes: membresías, contabilidad, donaciones, eventos y documentos oficiales — conforme a la Ley 75.00 y el Dahir Real 1.58.376.",
  "pages": {
    "associations": "Directorio de asociaciones certificadas",
    "legal": "Referencia legal del trabajo asociativo marroquí",
    "terms": "Condiciones de uso de la plataforma",
    "privacy": "Política de privacidad y protección de datos",
    "cookies": "Política de cookies",
    "assistant": "Asistente Asociativo",
    "app": "Aplicación Android oficial",
    "login": "Iniciar sesión",
    "register": "Crear una cuenta",
    "notFound": "Página no encontrada",
  },
},
"it": {
  "siteName": "Piattaforma MAMP",
  "siteTitle": "Piattaforma MAMP — Gestione delle associazioni marocchine",
  "siteDescription": "Piattaforma digitale professionale per la gestione delle associazioni marocchine: iscrizioni, contabilità, donazioni, eventi e documenti ufficiali — in conformità con la legge 75.00 e il dahir reale 1.58.376.",
  "pages": {
    "associations": "Elenco delle associazioni certificate",
    "legal": "Riferimento giuridico del lavoro associativo marocchino",
    "terms": "Condizioni d'uso della piattaforma",
    "privacy": "Politica sulla privacy e la protezione dei dati",
    "cookies": "Politica sui cookie",
    "assistant": "Assistente Associativo",
    "app": "App Android ufficiale",
    "login": "Accedi",
    "register": "Crea un account",
    "notFound": "Pagina non trovata",
  },
},
"de": {
  "siteName": "MAMP-Plattform",
  "siteTitle": "MAMP-Plattform — Verwaltung marokkanischer Vereine",
  "siteDescription": "Professionelle digitale Plattform für die Verwaltung marokkanischer Vereine: Mitgliedschaften, Buchhaltung, Spenden, Veranstaltungen und offizielle Dokumente — gemäß Gesetz 75.00 und Königlichem Dahir 1.58.376.",
  "pages": {
    "associations": "Verzeichnis zertifizierter Vereine",
    "legal": "Rechtsgrundlagen der marokkanischen Vereinsarbeit",
    "terms": "Nutzungsbedingungen der Plattform",
    "privacy": "Datenschutz- und Datenschutzerklärung",
    "cookies": "Cookie-Richtlinie",
    "assistant": "Vereinsassistent",
    "app": "Offizielle Android-App",
    "login": "Anmelden",
    "register": "Konto erstellen",
    "notFound": "Seite nicht gefunden",
  },
},
"nl": {
  "siteName": "Platform MAMP",
  "siteTitle": "Platform MAMP — Beheer van Marokkaanse verenigingen",
  "siteDescription": "Professioneel digitaal platform voor het beheer van Marokkaanse verenigingen: lidmaatschappen, boekhouding, donaties, evenementen en officiële documenten — overeenkomstig Wet 75.00 en het Koninklijk Dahir 1.58.376.",
  "pages": {
    "associations": "Gids van gecertificeerde verenigingen",
    "legal": "Juridische referentie voor Marokkaans verenigingswerk",
    "terms": "Gebruiksvoorwaarden van het platform",
    "privacy": "Privacybeleid en gegevensbescherming",
    "cookies": "Cookiebeleid",
    "assistant": "Verenigingsassistent",
    "app": "Officiële Android-app",
    "login": "Inloggen",
    "register": "Account aanmaken",
    "notFound": "Pagina niet gevonden",
  },
},
"ru": {
  "siteName": "Платформа MAMP",
  "siteTitle": "Платформа MAMP — Управление марокканскими ассоциациями",
  "siteDescription": "Профессиональная цифровая платформа для управления марокканскими ассоциациями: членство, бухгалтерия, пожертвования, мероприятия и официальные документы — в соответствии с законом 75.00 и королевским дахиром 1.58.376.",
  "pages": {
    "associations": "Каталог сертифицированных ассоциаций",
    "legal": "Правовой справочник ассоциативной деятельности в Марокко",
    "terms": "Условия использования платформы",
    "privacy": "Политика конфиденциальности и защиты данных",
    "cookies": "Политика использования файлов cookie",
    "assistant": "Ассоциативный помощник",
    "app": "Официальное приложение для Android",
    "login": "Вход",
    "register": "Регистрация",
    "notFound": "Страница не найдена",
  },
},
}

def esc(s: str) -> str:
    return s.replace('\\', '\\\\').replace('"', '\\"')

for code, meta in META.items():
    path = f"src/lib/i18n/dictionaries/{code}.ts"
    src = open(path, encoding="utf-8").read()
    if "\n  meta: {" in src:
        print(f"{code}: موجود مسبقاً — تخطٍّ")
        continue
    # نهاية القاموس: آخر «};» متبوعة بتصدير النوع أو نهاية الملف
    m = list(re.finditer(r"\n\};", src))
    if not m:
        sys.exit(f"لم أجد نهاية القاموس في {path}")
    last = m[-1]
    pages = meta["pages"]
    block = (
        "\n  meta: {\n"
        f"    siteName: \"{esc(meta['siteName'])}\",\n"
        f"    siteTitle: \"{esc(meta['siteTitle'])}\",\n"
        f"    siteDescription: \"{esc(meta['siteDescription'])}\",\n"
        "    pages: {\n"
        + "".join(f"      {k}: \"{esc(v)}\",\n" for k, v in pages.items())
        + "    },\n"
        "  },"
    )
    src = src[:last.start()] + block + src[last.start():]
    open(path, "w", encoding="utf-8").write(src)
    print(f"{code}: أُدرج قسم meta ({len(pages)} عناوين صفحات)")
print("تم.")
