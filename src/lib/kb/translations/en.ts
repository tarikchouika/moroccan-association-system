import type { KBTranslationSet } from "./types";

/**
 * English knowledge base translations — professional localization of the Arabic
 * canonical source (src/lib/kb/data.ts). Entry ids, link keys and category keys
 * are copied verbatim; only title, keywords and answer are translated.
 */
export const enKB: KBTranslationSet = {
  entries: {
    "law-dahir-1958": {
      title: "The Dahir regulating the right to form associations (1958)",
      keywords: ["Dahir", "1958", "law", "associations", "right", "found", "1.58.376", "legal", "framework", "legislation"],
      answer:
        "The founding reference for associative work in Morocco is Dahir No. 1.58.376 issued on 3 Jumada al-Ula 1378 (15 November 1958), which regulates the right to form associations, as amended and supplemented. This Dahir was published in Official Bulletin No. 2404 bis dated 27 November 1958, and it sets the general rules for the formation, management and dissolution of associations. The Moroccan system is characterized by its declarative nature: forming an association is free and requires no prior authorization, subject to the obligation to declare it to the local administrative authority.",
    },
    "law-75-00": {
      title: "Law 75.00 amending and supplementing the associations Dahir (2002)",
      keywords: ["75.00", "75", "law", "amendment", "supplement", "2002", "1.02.206", "Dahir", "amending"],
      answer:
        "Law No. 75.00 on associations was promulgated by Dahir No. 1.02.206 dated 12 Jumada al-Ula 1423 (23 July 2002); it amends and supplements the Dahir of 15 November 1958. Among its main innovations: clarification of the declaration and receipt issuance procedure, regulation of the relations between associations and the authorities, and strengthened financial transparency. You can consult the official texts via the associations page on the General Secretariat of the Government portal.",
    },
    "law-07-09": {
      title: "Law 07.09 amending Article 5 of the associations Dahir",
      keywords: ["07.09", "Article", "fifth", "declaration", "amending", "receipt"],
      answer:
        "Law No. 07.09 amended Article 5 of the Dahir of 15 November 1958 on the right to form associations — the article that governs the procedure for declaring an association to the local administrative authority and the issuance of the receipt. The official text is available on the associations page of the General Secretariat of the Government.",
    },
    "law-constitution": {
      title: "The constitutional basis of associative work",
      keywords: ["Constitution", "2011", "Article", "12", "29", "civil", "society", "democracy", "participatory"],
      answer:
        "The Constitution of the Kingdom of Morocco of 2011 enshrines associative work: Article 12 affirms the role of non-governmental associations in preparing, implementing and evaluating decisions within participatory democracy, and Article 29 guarantees the freedom of assembly, of demonstration, and of establishing associations and joining them. The public authorities are also committed to facilitating the creation of associations and supporting their work.",
    },
    "law-data-09-08": {
      title: "Law 09.08 on the protection of personal data (CNDP)",
      keywords: ["09.08", "data", "personal", "protection", "CNDP", "commission", "declaration", "privacy", "information"],
      answer:
        "Law No. 09.08 on the protection of individuals with regard to the processing of personal data subjects associations that process their members' data (name, national ID card number, phone...) to the obligation to declare to the National Commission for the Control of Personal Data Protection (CNDP), or to request a license as the case may be. The MAMP platform integrates an explicit consent (Consent) for each member in accordance with this law, and allows the date of consent to be recorded. For more information and for online declaration, visit the CNDP website.",
    },
    "law-fundraising": {
      title: "Public fundraising (prior authorization)",
      keywords: ["fundraising", "public", "donations", "authorization", "procedure", "caravan", "campaign", "permission"],
      answer:
        "Public fundraising operations (door-to-door, caravans, public campaigns...) for charitable purposes are subject to prior authorization under the law on the organization of public fundraising operations and the distribution of aid for charitable purposes, and its implementing decree. Requests are filed according to the officially announced procedures, and the associations page of the General Secretariat of the Government provides the procedure and the authorization request form. On the MAMP platform you can link each fundraising operation to its authorization number to track compliance.",
    },
    "found-steps": {
      title: "Steps to found an association in Morocco",
      keywords: ["founding", "steps", "create", "association", "procedure", "formalities", "how", "found", "Morocco"],
      answer:
        "Founding an association in Morocco follows a declarative system in five main steps:\n1. Holding the founding general assembly: attended by the founders, it adopts the statutes and elects the board members (president, secretary general, treasurer...).\n2. Preparing the file: multiple copies of the statutes signed by the founders, the signed minutes of the founding general assembly, the list of founding members with copies of their national ID cards and information sheets, and the criminal record or other proof of identity.\n3. Filing the declaration: the file is submitted to the headquarters of the local administrative authority (the caidat, the pashalik or the administrative annex) to which the association's headquarters belongs, directly or through a judicial officer.\n4. Issuance of the receipt: a stamped and dated provisional receipt for the declaration is issued on the spot (Article 5 of the 1958 Dahir as amended).\n5. Publication in the Official Bulletin: requested from the General Secretariat of the Government, either directly by the association or through the local authority, so that the association acquires legal personality.\n\nThe official documents and forms (the association founding declaration form, the provisions to be included in the statutes) are available on the associations page of the General Secretariat of the Government.",
    },
    "found-statutes": {
      title: "The provisions to be included in the statutes",
      keywords: ["statutes", "articles of association", "provisions", "clauses", "drafting", "content", "rules"],
      answer:
        "The association's statutes must include the minimum provisions laid down by the 1958 Dahir, including: the association's name and purposes, its headquarters, the conditions for membership and for loss of member status, the amount of the membership fee if any, the governing bodies and the definition of their duties (general assembly, board...), the voting and quorum rules, and the procedure for amending the statutes and dissolving the association and the fate of its funds. The General Secretariat of the Government provides an official document entitled “Provisions to be included in the statutes of associations”, which can be consulted via the associations page.",
    },
    "found-receipt": {
      title: "The provisional receipt and the final receipt of the declaration",
      keywords: ["receipt", "provisional", "final", "filing", "declaration", "proof", "document"],
      answer:
        "When the association founding declaration is filed with the local administrative authority, a stamped and dated provisional receipt is issued on the spot (Article 5 of the Dahir as amended by Law 75.00 and Law 07.09). This receipt is the official proof of the declaration, and the association may use it in certain procedures pending the issuance of the final receipt. If the issuance of the final receipt is unjustifiably delayed, the association may follow up on the matter with the relevant administration or by filing a case before the competent administrative court.",
    },
    "found-publication": {
      title: "Publication in the Official Bulletin",
      keywords: ["publication", "Official Bulletin", "bulletin officiel", "legal", "personality", "notice"],
      answer:
        "An association does not enjoy legal personality until the declaration of its founding has been published in the Official Bulletin. The request is made either directly by the association to the General Secretariat of the Government (Directorate of the Official Bulletin) or through the local authority, against payment of the prescribed fees. After publication, the association can open a bank account in its name, enter into contracts and sue in court. To consult the issues of the Official Bulletin and the published texts, visit the General Secretariat of the Government portal.",
    },
    "found-public-utility": {
      title: "Recognition of public utility status",
      keywords: ["public", "utility", "status", "recognition", "utilité", "publique", "advantage", "conditions"],
      answer:
        "Public utility status is granted by decree issued on the proposal of the Minister of the Interior after consulting a commission, and it grants the association privileges including the ability to receive gifts and bequests and to collect grants, as well as additional collection guarantees. The procedure for filing a public utility status application and the application form are officially available on the associations page of the General Secretariat of the Government. As a rule, the effective practice of an activity of public utility for a sufficient period, in accordance with its statutes, is required.",
    },
    "found-foreign-aid": {
      title: "Declaration of foreign aid",
      keywords: ["aid", "foreign", "foreigners", "funding", "grants", "declaration", "receipt", "donations"],
      answer:
        "Any association receiving financial or in-kind aid from a foreign entity (a state, an organization, a foreign association...) must declare it using the official form “Declaration of foreign aid received by the association”, available on the associations page of the General Secretariat of the Government, in accordance with the provisions of the 1958 Dahir as amended and supplemented. On the MAMP platform, when a donation from a foreign entity is recorded, a notice of the obligation to declare appears and a field is dedicated to the declaration number.",
    },
    "found-annual-declaration": {
      title: "Annual declarations and board changes",
      keywords: ["declaration", "annual", "change", "members", "board", "update", "authorities", "mandatory"],
      answer:
        "In accordance with the 1958 Dahir as amended by Law 75.00, associations must declare to the local authority the changes occurring in their management or membership (change of board, change of headquarters, amendment of the statutes) within the legal time limits. It is also good practice — and required in many relationships with partners — to prepare an annual activity and financial report approved by the ordinary general assembly. The MAMP platform provides a ready-made checklist for the annual declaration within the “Documents” module.",
    },
    "join-platform": {
      title: "How to join an association through the MAMP platform",
      keywords: ["membership", "join", "how", "participate", "member", "MAMP"],
      answer:
        "To join an association through the MAMP platform:\n1. Create a free citizen account from the “Create account” page.\n2. Browse the associations directory and use the filters (city, field).\n3. From the association's page, press “Request membership” and fill in the form (specialization, explicit consent to data processing in accordance with Law 09.08).\n4. The request remains in “Pending” status until it is accepted by the association's board, after which you become an actual member and benefit from the members' dashboard.\n\nYou can also volunteer at associations' public events without becoming a member.",
    },
    "join-fees": {
      title: "Annual membership fees",
      keywords: ["membership", "fee", "subscription", "annual", "amount", "payment", "renewal"],
      answer:
        "The annual membership fee is set by each association's statutes. On the MAMP platform, the treasurer records the payment of the fees for each fiscal year with an automatically numbered receipt, and the system alerts the members who have not paid the current year's fee. The membership expiry date is calculated automatically, and a late member moves to the “overdue payment” status before suspension.",
    },
    "accounting-features": {
      title: "The association's digital accounting in MAMP",
      keywords: ["accounting", "finance", "accounts", "income", "expense", "budget", "report", "financial", "management"],
      answer:
        "The accounting module of the MAMP platform enables associations to:\n• Record all income and expenses by category (memberships, donations, grants, activities, rent, equipment...).\n• Dual approval: the treasurer records and the president approves.\n• An annual provisional budget and a comparison of actuals against the plan.\n• Real-time indicators: the balance, annual income, annual expenses, and the monthly treasury trend.\n• Generate the annual financial report ready to print and present to the general assembly.\nAll amounts are in Moroccan dirham (MAD).",
    },
    "accounting-categories": {
      title: "The approved accounting categories",
      keywords: ["categories", "classification", "types", "fields", "labels", "accounting"],
      answer:
        "The platform uses unified, extensible categories: income (memberships, donations, grants and aid, activities and events, other) and expenses (rent and charges, equipment, fees and administrative expenses, communication and training, activities and events, other). This classification directly feeds the charts and the annual financial report.",
    },
    "donation-receipt": {
      title: "The donation receipt within the platform",
      keywords: ["receipt", "donation", "donate", "proof", "reçu", "acknowledgment"],
      answer:
        "When each donation (cash or in-kind) is recorded, the platform generates a numbered official receipt containing: the association's information, the donor's name, the amount or the description of the in-kind donation, the date and serial number, and the signature. The donor can request their receipt directly from the association's page, and the association keeps a copy in the donations register. The receipt is necessary for the donor to benefit from the tax deduction when the legal conditions are met.",
    },
    "tax-deduction": {
      title: "The tax deduction for donations (Article 10 of the General Tax Code)",
      keywords: ["deduction", "tax", "taxes", "Article", "10", "code", "deduct", "reduction", "donation", "income"],
      answer:
        "Article 10 of the Moroccan General Tax Code allows, under the conditions and rates specified therein, the deduction of cash or in-kind gifts and donations granted to certain entities and institutions from the taxable income of the donors (natural and legal persons), including in particular institutions and associations holding public utility status or recognized as being of public utility. To verify the updated conditions, the lists concerned and the applicable rates, reference must be made to the text in force via the General Directorate of Taxes portal or by contacting the competent tax service. Donors are advised to keep the donation receipt.",
    },
    "tax-association-status": {
      title: "The tax status of associations",
      keywords: ["tax", "status", "exemption", "VAT", "quasi", "commercial", "transactions"],
      answer:
        "Associations recognized as being of public utility benefit from a special tax regime: the income directly related to the practice of their public utility activity is exempt, whereas operations of a commercial, industrial, financial or real-estate nature (carried out on a quasi-commercial basis) are subject to the taxes in force. For guidance on special cases (invoices, value added tax on the purchase of goods...), please refer to the General Directorate of Taxes.",
    },
    "digital-ice": {
      title: "The Unified Company Identifier (ICE) for associations",
      keywords: ["ICE", "identifier", "unified", "number", "company", "obtain", "certificate"],
      answer:
        "The Unified Company Identifier (ICE) is a unique identification number assigned to companies and entities — including associations — by the Moroccan administrations, and it facilitates their transactions with the public and private sectors (procurement, invoices, declarations...). The ICE is requested free of charge via the ICE portal of the General Directorate of Taxes by filling in a form and submitting the association's file (statutes, receipt, board minutes...). On the MAMP platform, the ICE field is part of the association's digital identity card.",
    },
    "digital-identity": {
      title: "The digital identity of the Moroccan association (MAMP)",
      keywords: ["digital", "identity", "card", "association", "file", "digitization", "verification", "ID"],
      answer:
        "The MAMP platform grants each verified association a “digital identity card” that brings together its official data: name and acronym, headquarters, receipt number or legal reference, public utility status if any, ICE number, tax identification, bank account, and the current board members. This card can be shared with partners and donor institutions, and it helps government and private entities verify the association's identity electronically through the public version of its file.",
    },
    "digital-egov": {
      title: "Moroccan digital administrations and public services",
      keywords: ["administrations", "digital", "services", "public", "portal", "government", "electronic", "state"],
      answer:
        "The main official portals of the Moroccan State of interest to associative work:\n• maroc.ma — the official portal of the Kingdom and its digital services.\n• sgg.gov.ma — the General Secretariat of the Government: legislative texts, the Official Bulletin, and a dedicated associations page.\n• interieur.gov.ma — the Ministry of Interior (the territorial administration that receives declarations).\n• tax.gov.ma — the General Directorate of Taxes.\n• ice.gov.ma — the Unified Company Identifier portal.\n• cnss.ma — the National Social Security Fund (employee declaration).\n• cndp.ma — the National Commission for the Protection of Personal Data.\n• asd.ma — the Direct Social Aid portal.\nAll of these portals have been verified and are updated periodically in the platform's knowledge base.",
    },
    "digital-cnss": {
      title: "Declaration of the association's employees with the CNSS",
      keywords: ["CNSS", "employees", "staff", "social", "security", "declaration", "salariés", "contribution"],
      answer:
        "An association that employs salaried staff (employees, paid facilitators...) is required to register them with the National Social Security Fund and to pay the monthly contributions, in accordance with the legislation in force. These procedures can be completed electronically via the CNSS digital services (employee declaration, payment of contributions, issuance of certificates). The CNSS registration number field is available within the association's digital card in MAMP.",
    },
    "platform-what": {
      title: "What is the MAMP platform?",
      keywords: ["MAMP", "platform", "what", "is", "definition", "website", "services"],
      answer:
        "MAMP (Moroccan Associations Management Platform) is a Moroccan digital platform for the management and administration of associations: memberships, accounting, donations and receipts, events, official documents and reports, together with a smart associative assistant that guides users. The platform is multi-association (each association has an independent space) and serves five categories: the platform owner (super admin), the association admin (board members), the co-admins (members and volunteers), the competent government and private entities, and the citizens and foreigners.",
    },
    "platform-roles": {
      title: "Roles and permissions on the MAMP platform",
      keywords: ["roles", "permissions", "admin", "super", "co-admin", "partner", "citizen"],
      answer:
        "The platform relies on granular permissions at two levels:\n• The platform owner (super admin): verification of associations, suspension, general supervision, the audit log.\n• The association admin: the board members (president, vice-president, secretary general, treasurer) — full management: members, accounting, documents, events, reports. Financial operations require the treasurer and the president.\n• The co-admins: members and volunteers with specific permissions granted by the board (organizing events, receiving registrations...).\n• Government and private entities: verified partner accounts allowing access to the data declared by the associations concerned.\n• Citizens and foreigners: free accounts for browsing, donating and registering for public events.",
    },
    "platform-register-association": {
      title: "Registering your association on the platform",
      keywords: ["register", "association", "add", "create", "page", "request", "verification", "new"],
      answer:
        "To register your association on the MAMP platform:\n1. Create an account in the name of one of the association's board members.\n2. From the dashboard, choose “Register an association” and fill in the card: name, field, city and region, description and objectives, founding date, official data (receipt number, ICE if available...).\n3. The file remains in “Pending approval” status until the platform team reviews and verifies it.\n4. After verification, all the modules open: members, accounting, donations, events, documents.\n\nVerification protects the reputation of associations and maintains the reliability of the public directory.",
    },
    "platform-security": {
      title: "Security and data protection on the platform",
      keywords: ["security", "protection", "data", "encryption", "password", "privacy", "audit"],
      answer:
        "The MAMP platform is committed to strict security standards: passwords are encrypted (scrypt) and never stored in plain text, sessions are digitally signed via JWT tokens inside an httpOnly cookie, permissions are checked on the server for every request (not only in the interface), and an audit log documents all sensitive operations (who did what, and when). Members' personal data are processed with their explicit consent in accordance with Law 09.08, with the possibility to request correction or deletion.",
    },
    "platform-donate": {
      title: "Donating to an association through the platform",
      keywords: ["donate", "support", "contribution", "payment", "money", "provisions"],
      answer:
        "To donate to a verified association on the platform: go to the association's page from the directory, press “Donate”, then fill in the name (or choose to donate anonymously) and the amount or the description of the in-kind donation. The association records the donation and is issued a numbered receipt that appears in the donations register. In-kind donations are documented with a precise description and valuation. Note: public fundraising operations from the public require a prior authorization in accordance with the law — and foreign aid must be declared.",
    },
    "platform-events": {
      title: "Events and registration",
      keywords: ["events", "activities", "registration", "workshop", "course", "forum", "participation"],
      answer:
        "Associations organize their events (training courses, forums, caravans, workshops...) on the platform and set the number of seats, the venue and the date. Public events appear on the home page and citizens can register directly with their account or by filling in a quick form. The association tracks the registrations and approves attendance from its dashboard.",
    },
    "platform-documents": {
      title: "Managing official documents",
      keywords: ["documents", "files", "minutes", "reports", "statutes", "archive", "retention"],
      answer:
        "The documents module preserves the association's classified official archive: the statutes and their updated versions, the minutes of the general assemblies and the board, the annual activity and financial reports, the receipts, and the partnership agreements. The sensitivity of each document is defined (public/internal) and documents are stored with version numbers (versioning) to track amendments — which makes it easier to prepare the annual declaration file and to gather the documents required by partners.",
    },
    "platform-assistant": {
      title: "The Associative Assistant — how to use it?",
      keywords: ["assistant", "chat", "bot", "smart", "chatbot", "questions", "guidance", "use"],
      answer:
        "I am “the Associative Assistant”, your companion on the platform. I answer questions about: laws and official procedures (founding, declaration, public utility...), the practical uses of the platform (membership, accounting, donations...), and guidance toward the verified official portals. I work with a reviewed knowledge base and official sources only: I do not invent links or unverified information. If I do not know the answer, I say so openly and direct you to the competent official source. Ask your question in free form!",
    },
    "platform-support-youth": {
      title: "Public support for associations",
      keywords: ["support", "grant", "subsidies", "state", "financial", "programs", "partnership", "public"],
      answer:
        "Several mechanisms exist to support associations: public grants and aid (the supervising ministries, the territorial authorities, the development agencies...), and sectoral partnership programs. These opportunities are usually announced on the websites of the ministries and supervising authorities — including the Ministry of Youth, Culture and Communication, which publishes the texts governing associative life and the support programs, and the Ministry of Interior. When receiving any foreign aid, it must be declared in accordance with the law. Verification of the association in MAMP makes it easier to prepare support application files (the digital identity card, the annual reports, the legal documents).",
    },
    "contact-official": {
      title: "Contacting the administrations in charge of associations",
      keywords: ["contact", "communication", "administration", "authority", "responsible", "address", "office", "complaint"],
      answer:
        "The key administrations involved in associative work: the local administrative authority (caidat/pashalik of the association's headquarters) for receiving declarations and changes; the General Secretariat of the Government for publication in the Official Bulletin, public utility status and fundraising procedures; the General Directorate of Taxes for tax matters and the ICE; and the CNDP for data processing declarations. Always use the verified official portals above to communicate, and keep copies of all correspondence and receipts.",
    },
    "app-download": {
      title: "The MAMP platform app for Android — download and installation",
      keywords: ["app", "Android", "apk", "download", "install", "phone", "mobile", "release", "signature"],
      answer:
        "The MAMP platform app has an official Android release that is automatically built and signed from the official repository. To download: visit the app page on the platform and then press “Download APK file”, or scan the QR code on the same page. After downloading: 1) open the file from the notifications or the downloads folder. 2) enable “Allow from this source” when Android asks for it (a standard message for any app outside the store). 3) press “Install” and then open the app. The app is digitally signed with the certificate CN=TARIK CHOUIKA with a validity of 30 years, and the certificate fingerprint is published in the notes of each release — any file that does not carry this signature is not an official release. Requirements: Android 7.0 or newer with an Internet connection. The permanent download link always points to the latest release.",
    },
  },

  links: {
    maroc: "Official Portal of the Kingdom of Morocco",
    sgg: "General Secretariat of the Government",
    sggAssociations: "Associations page — General Secretariat of the Government",
    cndp: "National Commission for the Control of Personal Data Protection",
    ice: "Unified Company Identifier (ICE) Portal",
    tax: "General Directorate of Taxes",
    cnss: "National Social Security Fund",
    asd: "Direct Social Aid Portal",
    interieur: "Ministry of Interior",
    mcrpsc: "Ministry of Youth, Culture and Communication",
    mamp: "MAMP Platform — Moroccan Associations Management",
    mampApp: "Official MAMP Android application",
    mampApk: "Download the MAMP Android app (latest signed release)",
    mampReleases: "MAMP app releases — official repository",
  },

  categories: {
    "التشريع": "Legislation",
    "التأسيس": "Founding",
    "الانخراط": "Membership",
    "المحاسبة": "Accounting",
    "التبرعات": "Donations",
    "الضرائب": "Taxation",
    "الهوية الرقمية": "Digital identity",
    "البوابات الرسمية": "Official portals",
    "حماية المعطيات": "Data protection",
    "المنصة": "Platform",
  },
};
