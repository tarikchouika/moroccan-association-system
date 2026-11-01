import type { LegalDocs } from "./types";

/**
 * English legal documents — professional localization of the Arabic reference source.
 * Terms of use / Privacy / Cookies.
 */
export const enLegalDocs: LegalDocs = {
  terms: {
    title: "Platform Terms of Use",
    subtitle:
      "These terms govern the use of the MAMP platform and all its services and pages, including the published public version and the official Android app. By using the platform, you acknowledge these terms and accept them in full.",
    updated: "November 1, 2026",
    sections: [
      {
        heading: "Definition of the service",
        paragraphs: [
          "The MAMP platform is a Moroccan digital platform for the management and administration of associations: memberships, accounting, donations, events and official documents, together with “the Associative Assistant” — a smart assistant that answers from a verified official knowledge base.",
          "The platform operates in two versions: a public version for browsing, viewing, donating and registering for events, and a complete administrative version (dashboard) dedicated to associations' members, which runs on the platform's local infrastructure.",
        ],
      },
      {
        heading: "Accounts and responsibilities",
        paragraphs: [
          "The account is created with correct and accurate information, and the user is responsible for the confidentiality of their password and for every activity carried out through their account.",
          "Each user's permissions are defined according to their role: platform general administrator, association admin, co-admin (member/volunteer), partner entity, or citizen. No user may attempt to access anything beyond the scope of their permissions or to breach the privacy of other associations.",
        ],
      },
      {
        heading: "Acceptable use",
        paragraphs: ["Using the platform for any unlawful purpose is prohibited, in particular:"],
        bullets: [
          "Entering false or misleading data about an association, a person, a donation or a financial transaction.",
          "Impersonating any person or entity, or using badges and permissions without right.",
          "Exploiting “the Associative Assistant” or any service in an attempt to extract information or bypass the security controls.",
          "Misusing the service in a way that harms the infrastructure or other users.",
        ],
      },
      {
        heading: "Donations and financial transactions",
        paragraphs: [
          "The MAMP platform is solely a digital medium for documentation and management: it is neither a collection entity nor a financial intermediary, and it neither holds nor transfers funds. Every donation or financial payment takes place directly between the donor and the association concerned, through its officially announced means.",
          "Responsibility for the lawfulness of fundraising (the prior authorization provided for by the regulations in force), for its distribution and for its proof rests with the association alone.",
        ],
      },
      {
        heading: "The Associative Assistant and the limits of information",
        paragraphs: [
          "The assistant operates with a reviewed official knowledge base, together with strict filtering that prevents the display of any unverified link. Nevertheless, its answers remain general guidance and do not constitute legal or accounting advice replacing the specialists and the official texts.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "All elements of the platform (design, logo, code, knowledge base, visual identity) are owned by their owner TARIK CHOUIKA, and may not be copied or reused commercially without prior written permission.",
          "The official Android app is digitally signed with the certificate CN=TARIK CHOUIKA, and any copy not signed with this certificate is not considered an official release.",
        ],
      },
      {
        heading: "Limitation of liability",
        paragraphs: [
          "The service is provided “as is”, without express or implied warranties of continuity or of freedom from errors. The platform shall not be liable for any direct or indirect damage arising from the use of the service or from the inaccuracy of information entered by the users themselves.",
        ],
      },
      {
        heading: "Governing law and dispute resolution",
        paragraphs: [
          "These terms are governed by Moroccan law, in particular Dahir No. 1.58.376 as amended by Law 75.00 and Law 09.08 on the protection of personal data.",
          "In the event of a dispute, please first contact us to resolve it amicably; failing that, the case shall be referred to the competent courts of the Kingdom of Morocco.",
        ],
      },
      {
        heading: "Amendment of the terms",
        paragraphs: [
          "The platform owner is entitled to update these terms as needed, and any material amendment will be announced through the platform. Your continued use of the service after publication of the update constitutes acceptance of the new version.",
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy and Data Protection Policy",
    subtitle:
      "At the MAMP platform, we are committed to protecting your personal data in accordance with Law No. 09.08 on the protection of individuals with regard to the processing of personal data, and with the guidelines of the National Commission for the Control of Personal Data Protection (CNDP).",
    updated: "November 1, 2026",
    sections: [
      {
        heading: "The data controller",
        paragraphs: [
          "The controller for the processing of personal data on the MAMP platform is the platform owner, TARIK CHOUIKA. For any question or request concerning your personal data, you may contact us via the contact channels announced on the platform.",
        ],
      },
      {
        heading: "The data we collect",
        paragraphs: ["We work with the minimum necessary data:"],
        bullets: [
          "Account data: full name, email, encrypted password, phone (optional).",
          "Membership data: membership number, membership type, occupation (optional), membership date.",
          "Associations' financial management data: the transactions and accounting documents entered by the treasurers themselves.",
          "The national identifier (ID card number): entirely optional, requested only when necessary and with explicit consent.",
        ],
      },
      {
        heading: "Legal basis for processing",
        paragraphs: [
          "The basis is your prior explicit consent when creating the account or joining, and the consent is recorded with its date and time within the platform, in compliance with Law 09.08.",
          "Associations' financial management data are also processed in fulfillment of the accounting and legal obligations incumbent on associations.",
        ],
      },
      {
        heading: "Retention period",
        paragraphs: [
          "The data are retained for the duration of the active account or membership, then deleted or anonymized after the relationship ends, in accordance with the applicable retention periods, while respecting the legal archiving obligations.",
        ],
      },
      {
        heading: "Your rights and how to exercise them",
        paragraphs: ["Law 09.08 guarantees you the following rights:"],
        bullets: [
          "The right to access your data and verify it.",
          "The right to correct or update inaccurate data.",
          "The right to object to the processing for legitimate reasons.",
          "The right to withdraw your consent (with the resulting termination of the account).",
        ],
      },
      {
        heading: "The National Commission (CNDP)",
        paragraphs: [
          "You have the right to file a complaint with the National Commission for the Control of Personal Data Protection if you believe that your rights to the protection of your personal data have been violated. The Commission's official portal is announced on the “Legal reference” page and in the Associative Assistant's knowledge base.",
        ],
      },
      {
        heading: "Data security",
        paragraphs: [
          "We take reasonable technical and organizational measures to protect the data: passwords encrypted with the scrypt algorithm, signed sessions inside an httpOnly cookie, an audit log for sensitive operations, and controlled hierarchical permissions for each role.",
          "We do not sell, rent or exchange your data with any third party for commercial purposes.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "We use a single technical session cookie only, with no tracking or advertising cookies. Full details are provided in the cookies policy.",
        ],
      },
      {
        heading: "Amendments to the policy",
        paragraphs: [
          "We may update this policy as the services evolve or in order to comply with the law. Any material amendment will be announced through the platform before it takes effect.",
        ],
      },
    ],
  },

  cookies: {
    title: "Cookies Policy",
    subtitle:
      "Full transparency: the MAMP platform uses no tracking or advertising cookies — a single technical cookie to keep your session safely open.",
    updated: "November 1, 2026",
    sections: [
      {
        heading: "What are cookies?",
        paragraphs: [
          "Cookies are small text data that the website stores on your browser to remember information necessary for the service to work. Their processing is subject in Morocco to Law 09.08.",
        ],
      },
      {
        heading: "What does the platform use?",
        paragraphs: [
          "A single cookie named mamp_session: a secure technical cookie carrying a digitally signed session identifier that keeps you logged in to the dashboard.",
        ],
        bullets: [
          "Type: strictly necessary (Strictly Necessary) — it cannot be disabled while keeping the login service working.",
          "Duration: one week from the last login, then it expires automatically.",
          "Security attributes: httpOnly (not readable by page scripts), Secure in production, and SameSite=Lax.",
        ],
      },
      {
        heading: "What does the platform not use?",
        bullets: [
          "No tracking or commercial analytics cookies.",
          "No advertising cookies or third-party pixel tags.",
          "No sharing of browsing behavior with any external party.",
        ],
      },
      {
        heading: "Disabling cookies and its effect",
        paragraphs: [
          "You can block cookies from your browser settings. In that case, all the public pages, the Associative Assistant and the associations directory remain available, but logging in to the dashboard will not work because the session cannot be maintained.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "For any question about this policy or about the processing of your data, see the privacy policy or contact us via the channels announced on the platform.",
        ],
      },
    ],
  },
};
