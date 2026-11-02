import type { Dict } from "../types";

/**
 * Deutsches Wörterbuch — vollständige professionelle Übersetzung der Benutzeroberfläche.
 * Struktur und Werte folgen exakt dem arabischen Referenzwörterbuch (ar.ts).
 */
export const de: Dict = {
  common: {
    brandTagline: "MAMP · Vereinsverwaltung",
    verified: "Verifiziert",
    publicUtility: "Gemeinnützig",
    memberWord: "Mitglied",
    membersWord: "Mitglieder",
    currency: "MAD",
    loading: "Wird geladen...",
    notFoundTitle: "Verein nicht gefunden",
    close: "Schließen",
    learnMore: "Mehr erfahren",
    themeDark: "Zum dunklen Modus wechseln",
    themeLight: "Zum hellen Modus wechseln",
  },

  nav: {
    home: "Startseite",
    associations: "Vereinsverzeichnis",
    legal: "Rechtsgrundlagen",
    assistant: "Vereinsassistent",
    login: "Anmelden",
    register: "Konto erstellen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    mainNavAria: "Hauptnavigation",
    homeAria: "MAMP-Plattform — Startseite",
    language: "Sprache",
  },

  footer: {
    about:
      "Eine marokkanische digitale Plattform für die Verwaltung und Führung von Vereinen: Mitgliedschaften, Buchhaltung, Spenden, Veranstaltungen und offizielle Dokumente — gemäß dem Dahir Nr. 1.58.376 in der durch Gesetz 75.00 geänderten Fassung und unter Einhaltung des Gesetzes 09.08 zum Schutz personenbezogener Daten.",
    badgeLaw: "Konform mit Gesetz 75.00",
    badgePrivacy: "Datenschutz (CNDP)",
    badgeAssistant: "Assistent ohne Halluzinationen",
    platformTitle: "Die Plattform",
    membersLogin: "Mitgliederanmeldung",
    dashboard: "Dashboard",
    androidApp: "Android-App",
    legalDocsTitle: "Rechtliche Dokumente",
    terms: "Nutzungsbedingungen",
    privacy: "Datenschutzerklärung",
    cookies: "Cookie-Richtlinie",
    officialPortalsTitle: "Verifizierte offizielle Portale",
    copyright: "© 2026 MAMP-Plattform — TARIK CHOUIKA. Alle Rechte vorbehalten.",
    legalNotice: "Die rechtlichen Informationen dienen der Orientierung; maßgeblich sind stets die offiziellen Texte.",
  },

  home: {
    hero: {
      badge: "Die erste umfassende marokkanische Plattform zur Digitalisierung der Vereinsarbeit",
      titleA: "Digitalisierung der Verwaltung und Buchhaltung",
      titleB: "marokkanischer Vereine",
      titleC: "mit Professionalität und Sicherheit",
      subtitle:
        "Von der Gründung bis zum Jahresbericht: Mitgliedschaften, Buchhaltung, Spenden mit offiziellen Quittungen, Veranstaltungen, rechtliche Dokumente — und ein intelligenter Vereinsassistent, der Sie Schritt für Schritt anleitet, gemäß Gesetz 75.00 und dem Dahir vom 15. November 1958.",
      ctaPrimary: "Jetzt kostenlos starten",
      ctaSecondary: "Vereinsverzeichnis",
      trustDahir: "Dahir 1.58.376",
      trustLaw: "Gesetz 75.00",
      trustData: "Gesetz 09.08 (CNDP)",
      cardVerified: "Verifiziert ✓",
      cardActiveMember: "Aktives Mitglied",
      cardIncome: "Einnahmen 2026",
      cardDonations: "Erfasste Spenden",
      cardTreasury: "Kassenbestand",
      cardAssistant: "Vereinsassistent",
      cardUserMsg: "Wie reichen wir das Gründungsdossier eines Vereins ein?",
      cardBotMsg: "Die Anmeldung wird beim Sitz der lokalen Behörde eingereicht, zusammen mit 4 Exemplaren der Satzung und dem Gründungsprotokoll…",
      statAssociations: "Vereine auf der Plattform",
      statMembers: "Mitglieder und Ehrenamtliche",
      statTransactions: "Erfasste Finanzvorgänge",
      statManaged: "digital verwaltete Dirham",
    },
    features: {
      badge: "Umfassende Funktionen",
      titleA: "Alles, was Ihr Verein braucht, in",
      titleB: "einer einzigen Plattform",
      subtitle:
        "Wir haben jedes Modul so gestaltet, dass es die tägliche Vereinsarbeit gemäß den marokkanischen Gesetzen unterstützt — mit einer Einfachheit, die für jedes Niveau digitaler Erfahrung geeignet ist.",
      items: [
        { title: "Verwaltung der Mitgliedschaften", desc: "Mitgliederakten, Anträge, jährliche Mitgliedsbeiträge mit nummerierten Quittungen sowie Erinnerungen zur Verlängerung." },
        { title: "Professionelle Buchhaltung", desc: "Kategorisierte Einnahmen und Ausgaben, Haushaltsplan, vieräugige Freigabe und ein druckfertiger jährlicher Finanzbericht." },
        { title: "Spenden und Quittungen", desc: "Erfassung von Geld- und Sachspenden, Erstellung offizieller Quittungen und Nachverfolgung der Compliance (ausländische Hilfe)." },
        { title: "Veranstaltungen und Aktivitäten", desc: "Planung von Kursen, Treffen und Konvois, öffentliche Anmeldung der Teilnehmer und Verfolgung der Anwesenheit." },
        { title: "Offizielle Dokumente", desc: "Ein verifiziertes Archiv: Satzung, Protokolle, Jahresberichte — mit Versionierung, Kategorisierung und Vertraulichkeitsstufen." },
        { title: "Digitale Identität des Vereins", desc: "Eine digitale Karte, die ICE, Steueridentifikation und Rechtsgrundlagen bündelt — teilbar und überprüfbar." },
        { title: "Berichte und Dashboards", desc: "Echtzeit-Kennzahlen und Diagramme zur Leistung des Vereins, geeignet für die Präsentation vor der Generalversammlung und gegenüber Partnern." },
        { title: "Vereinsassistent", desc: "Ein intelligenter Assistent, der Fragen zu Verfahren und Gesetzen beantwortet — auf Basis einer verifizierten offiziellen Wissensdatenbank, ohne Halluzinationen." },
        { title: "Sicherheit und granulare Berechtigungen", desc: "Verschlüsselte Passwörter, signierte Sitzungen, rollenbasierte Berechtigungen und ein Prüfprotokoll für alle sensiblen Vorgänge." },
      ],
    },
    roles: {
      badge: "Berechtigungssystem mit fünf Ebenen",
      titleA: "Für jeden Akteur der Vereinsarbeit",
      titleB: "der richtige Platz",
      subtitle:
        "Vom Plattforminhaber bis zum Bürger: präzise, serverseitig geprüfte Berechtigungen, die die Trennung der Rollen und den Schutz sensibler Daten gewährleisten.",
      items: [
        {
          title: "Der Super-Admin",
          subtitle: "Plattforminhaber",
          desc: "Vollständige Aufsicht: Verifizierung neuer Vereine und Sperrung regelwidriger Vereine, Verfolgung der Plattformstatistiken, Benutzerverwaltung sowie ein Prüfprotokoll, das jeden sensiblen Vorgang dokumentiert.",
          points: ["Verifizierung und Sperrung von Vereinen", "Umfassende Plattformstatistiken", "Vollständiges Prüfprotokoll", "Verwaltung von Konten und Berechtigungen"],
        },
        {
          title: "Der Vereins-Admin",
          subtitle: "Mitglieder des Vorstands",
          desc: "Verwalten Sie Ihren Verein in aller Freiheit: Annehmen von Mitgliedschaften, Erfassen von Finanzvorgängen, Hochladen von Dokumenten, Organisieren von Veranstaltungen und Erstellen von Berichten für die Generalversammlung.",
          points: ["Annehmen/Ablehnen von Mitgliedsanträgen", "Buchhaltung und Haushalt", "Offizielle Dokumente und Berichte", "Organisation von Veranstaltungen"],
        },
        {
          title: "Die Co-Admins",
          subtitle: "Mitglieder und Ehrenamtliche",
          desc: "Vom Vorstand verliehene, begrenzte Befugnisse: Organisation von Veranstaltungen, Verfolgung der Teilnehmeranmeldungen, Pflege der Kommunikation — mit klarer Trennung von den Finanzdaten.",
          points: ["Organisation übertragener Veranstaltungen", "Empfang von Teilnehmeranmeldungen", "Eigenes Aufgaben-Dashboard", "Kein Einblick in die Finanzen"],
        },
        {
          title: "Staatliche und private Stellen",
          subtitle: "Fachbehörden und Partner",
          desc: "Verifizierte Partnerkonten, die den zuständigen Stellen Einblick in die von den Vereinen deklarierten Daten ermöglichen (Rechtsstatus, ICE, öffentliche Berichte).",
          points: ["Verifizierte Darstellung der Vereine", "Überprüfung der digitalen Identität", "Öffentliche Berichte", "Offizieller Kommunikationskanal"],
        },
        {
          title: "Bürger und Ausländer",
          subtitle: "Die Öffentlichkeit",
          desc: "Ein kostenloses Konto: Entdecken verifizierter Vereine, Spenden mit Erhalt einer Quittung, Anmeldung für öffentliche Veranstaltungen und Fragen an den Vereinsassistenten.",
          points: ["Verzeichnis verifizierter Vereine", "Spenden mit offizieller Quittung", "Anmeldung für Veranstaltungen", "Vereinsassistent"],
        },
      ],
    },
    howItWorks: {
      titleA: "Von null zum Verein",
      titleB: "vollständig digital",
      subtitle: "Nur vier Schritte trennen Sie von einer modernen Vereinsführung.",
      steps: [
        { title: "Konto erstellen", desc: "Kostenlose Registrierung in einer Minute: als Bürger, Ehrenamtlicher oder Vorstandsmitglied eines Vereins." },
        { title: "Verein registrieren", desc: "Eine vollständige Identitätskarte wartet auf die Verifizierung durch das Plattformteam — danach öffnen sich alle Module." },
        { title: "Verwalten und veröffentlichen", desc: "Mitgliedschaften, Buchhaltung, Veranstaltungen, Dokumente — alles dokumentiert und nachverfolgbar." },
        { title: "Messen und Partner überzeugen", desc: "Offizielle Berichte und eine digitale Identitätskarte, die Geldgeber und Behörden überzeugen." },
      ],
    },
    preview: {
      titleA: "Verifizierte",
      titleB: "Vereine",
      subtitle:
        "Jeder Verein durchläuft ein Verifizierungsverfahren, das seine Identität und seine Rechtsgrundlage prüft, bevor er im öffentlichen Verzeichnis erscheint.",
      viewAll: "Alle Vereine",
    },
    assistantCta: {
      titleA: "„Der Vereinsassistent“ —",
      titleB: "Ihr verlässlicher Begleiter",
      subtitle:
        "Fragen Sie ihn nach den Schritten der Vereinsgründung, den Anmeldeunterlagen, der Gemeinnützigkeit, der ICE-Nummer, dem Steuerabzug für Spenden… Er antwortet aus einer verifizierten offiziellen Wissensdatenbank:",
      subtitleBold: " ohne Halluzinationen und ohne erfundene Links",
      subtitleEnd: " — und wenn er etwas nicht weiß, sagt er es offen und verweist Sie an die offizielle Quelle.",
      cta: "Mit dem Assistenten sprechen",
      secondary: "Rechtsgrundlagen",
    },
    faq: {
      title: "Häufige Fragen",
      items: [
        {
          q: "Ist die Plattform kostenlos?",
          a: "Kontoerstellung, Vereinsverzeichnis, Anmeldung für öffentliche Veranstaltungen und der Vereinsassistent — für alle Nutzer kostenlos. Die Plattform behält sich vor, später erweiterte Dienste für große Vereine mit vorheriger Ankündigung anzubieten.",
        },
        {
          q: "Sind die Daten unseres Vereins sicher?",
          a: "Ja: Passwörter sind verschlüsselt, Sitzungen digital signiert, Berechtigungen werden bei jeder serverseitigen Anfrage geprüft, und das Prüfprotokoll dokumentiert jeden Vorgang. Die Verarbeitung personenbezogener Daten erfolgt mit ausdrücklicher Einwilligung gemäß Gesetz 09.08 (CNDP).",
        },
        {
          q: "Ersetzt die Plattform die offiziellen Behörden?",
          a: "Nein. MAMP ist ein digitales Verwaltungswerkzeug für Vereine: Es strukturiert Ihre Akten, Ihre Buchhaltung und Ihre Dokumente und bereitet sie für die offiziellen Verfahren vor. Die Anmeldung bei der lokalen Behörde, die Veröffentlichung im Amtsblatt (Bulletin Officiel) und Anträge an die Behörden erfolgen über deren offizielle, zugelassene Kanäle.",
        },
        {
          q: "Wie läuft die Verifizierung der Vereine ab?",
          a: "Bei der Registrierung eines neuen Vereins prüft das Plattformteam dessen Daten (Rechtsgrundlage, Vorstand, Tätigkeitsbereich), bevor das Siegel „Verifiziert“ verliehen wird und der Verein im öffentlichen Verzeichnis erscheint. Nicht verifizierte Vereine verbleiben im Status „In Prüfung“.",
        },
        {
          q: "Können Ausländer die Plattform nutzen?",
          a: "Ja, die Plattform steht Bürgern und Ausländern gleichermaßen offen: Durchstöbern des Vereinsverzeichnisses, Spenden, Anmeldung für öffentliche Veranstaltungen — und die Oberfläche ist in acht Sprachen mit vollständiger RTL-Unterstützung verfügbar.",
        },
        {
          q: "Was, wenn unser Verein einen offiziellen Bericht benötigt?",
          a: "Das Berichtsmodul erstellt den jährlichen Tätigkeits- und Finanzbericht, die Mitgliederliste und das Spendenregister — alle in einem druckbaren Format zur Vorlage bei der Generalversammlung oder gegenüber Partnern und Förderorganisationen.",
        },
      ],
    },
  },

  associations: {
    titleA: "Verzeichnis",
    titleB: "verifizierter Vereine",
    subtitle:
      "Entdecken Sie die auf der Plattform registrierten Vereine nach Tätigkeitsbereichen und Städten. Jeder verifizierte Verein erscheint hier nach Prüfung seiner Rechtsgrundlage — damit Sie vertrauensvoll spenden oder Mitglied werden.",
    searchPlaceholder: "Nach Name oder Bereich suchen...",
    searchAria: "Vereine durchsuchen",
    cityAria: "Stadt",
    allCities: "Alle Städte",
    categoryAria: "Tätigkeitsbereich",
    allCategories: "Alle Bereiche",
    resultsCount: "Vereine",
    noResultsTitle: "Keine passenden Ergebnisse",
    noResultsDesc: "Versuchen Sie, die Suchbegriffe zu ändern oder die Filter zurückzusetzen.",
    resetFilters: "Filter zurücksetzen",
  },

  associationDetail: {
    verifiedBadge: "Verifizierter Verein",
    publicUtilityBadge: "Gemeinnützigkeit",
    foundedIn: "Gegründet",
    donateBtn: "Für den Verein spenden",
    joinBtn: "Mitgliedsantrag stellen",
    aboutTitle: "Über den Verein",
    missionTitle: "Leitbild und Ziele",
    upcomingEvents: "Kommende Veranstaltungen",
    joinCardTitle: "Mitglied werden bei",
    joinCardDesc:
      "Bringen Sie sich in die Aktivitäten des Vereins und seiner Mitglieder ein. Der Antrag wird dem Vorstand des Vereins zur Bestätigung vorgelegt, und Ihre Daten werden mit Ihrer ausdrücklichen Einwilligung gemäß Gesetz 09.08 verarbeitet.",
    identityTitle: "Digitale Identitätskarte",
    fieldCategory: "Tätigkeitsbereich",
    fieldCity: "Stadt",
    fieldRegion: "Region",
    fieldFoundedYear: "Gründungsjahr",
    fieldIce: "ICE-Nummer",
    fieldLegalStatus: "Rechtsstatus",
    statusPublicUtility: "Gemeinnützig",
    statusDeclared: "Angemeldet",
    activeMembers: "aktive Mitglieder",
    registeredDonations: "erfasste Spenden",
    donateCardTitle: "Vertrauensvoll spenden",
    donateCardDesc:
      "Jede Spende wird mit einer nummerierten offiziellen Quittung erfasst. Geld- und Sachspenden werden dokumentiert, und ausländische Hilfe wird gemäß dem Gesetz deklariert.",
    donateCardNote:
      "Hinweis: In der Vollversion der Plattform erfolgt die Spende direkt über diese Karte mit sofortiger Erfassung in der Buchhaltung des Vereins.",
    heroImageAlt:
      "Oberfläche der MAMP-Plattform-App auf einem Android-Smartphone — Verzeichnis, Vereinsassistent und Veranstaltungen",
  },

  assistant: {
    titleA: "Der",
    titleB: "Vereinsassistent",
    subtitle:
      "Stellen Sie Fragen zu den Gesetzen, den offiziellen Verfahren und zur Nutzung der Plattform — jede Antwort stützt sich auf eine verifizierte offizielle Wissensdatenbank, und jeder Link durchläuft eine strenge Filterung.",
    chat: {
      welcome:
        "Guten Tag 👋 Ich bin der **Vereinsassistent**.\n\nIch kann Ihnen helfen bei:\n• **Offiziellen Verfahren**: Gründung von Vereinen, Anmeldung, Veröffentlichung im Amtsblatt (Bulletin Officiel), Gemeinnützigkeit...\n• **Nutzung der Plattform**: Mitgliedschaft, Buchhaltung, Spenden, Veranstaltungen, Dokumente.\n• **Verifizierter Orientierung**: zu den offiziellen Portalen der marokkanischen Behörden.\n\nMein strenges Versprechen: Ich antworte ausschließlich aus einer verifizierten offiziellen Wissensdatenbank — **keine Halluzinationen, keine erfundenen Links**. Wenn ich die Antwort nicht kenne, sage ich es offen.",
      quickQuestions: [
        "Wie lauten die Schritte zur Gründung eines Vereins?",
        "Was ist die provisorische Bescheinigung?",
        "Wie erhalte ich die ICE-Nummer für meinen Verein?",
        "Wie lade ich die Android-App herunter?",
        "Wie schütze ich die Daten der Mitglieder (CNDP)?",
        "Welche Berechtigungen hat jede Rolle auf der Plattform?",
      ],
      headerSub: "Offizielle Wissensdatenbank · strenge Linkfilterung",
      newChat: "Neuer Chat",
      inputPlaceholder: "Stellen Sie Ihre Frage hier im Detail...",
      inputAria: "Ihre Frage",
      sendAria: "Senden",
      errorFallback: "Es konnte keine Antwort abgerufen werden.",
      offlineNote: "_(Antwort aus der verifizierten Wissensdatenbank — Modus ohne Serververbindung)_",
      kbSourcesTitle: "Wissensquellen",
      kbSourcesDesc:
        "Die offiziellen Themen, auf die sich der Assistent stützt — manuell verifizierte Links.",
      charterTitle: "Verlässlichkeitscharta",
      charterItems: [
        "Keine Links außerhalb der offiziellen Whitelist.",
        "Keine erfundenen Artikelnummern, Quoten oder Daten.",
        "„Ich weiß es nicht“ ist eine zulässige und legitime Antwort.",
        "Automatische Filterung jedes Links vor der Anzeige.",
      ],
    },
  },

  chatbot: {
    openAria: "Vereinsassistenten öffnen",
    title: "Vereinsassistent",
    headerSub: "Verifizierte Antworten — ohne erfundene Links",
    fullVersionAria: "Vollversion",
    closeAria: "Schließen",
    welcome:
      "Guten Tag 👋 Ich bin der **Vereinsassistent**, Ihr Begleiter in der MAMP-Plattform.\n\nIch beantworte Ihre Fragen zu:\n• Gründung von Vereinen und offiziellen Verfahren\n• Mitgliedschaft, Buchhaltung und Spenden\n• Offizielle Portale und digitale Identität\n\nIch arbeite mit einer verifizierten offiziellen Wissensdatenbank — ich gebe keine unüberprüften Links oder Informationen weiter. Wie kann ich Ihnen helfen?",
    suggestions: [
      "Wie gründet man einen Verein in Marokko?",
      "Welche Unterlagen gehören zum Gründungsdossier?",
      "Wie werde ich Mitglied eines Vereins?",
      "Was ist die ICE-Nummer?",
      "Wie lade ich die Android-App herunter?",
      "Wie lauten die Schritte zur Veröffentlichung im Amtsblatt?",
    ],
    inputPlaceholder: "Stellen Sie Ihre Frage hier...",
    inputAria: "Ihre Frage an den Assistenten",
    sendAria: "Senden",
    errorFallback: "Verbindung zum Assistenten fehlgeschlagen, bitte versuchen Sie es erneut.",
    offlineNote: "_(Antwort aus der verifizierten Wissensdatenbank — Modus ohne Serververbindung)_",
  },

  auth: {
    login: {
      title: "Willkommen zurück",
      subtitle: "Melden Sie sich an, um auf Ihr Dashboard zuzugreifen",
      email: "E-Mail-Adresse",
      password: "Passwort",
      submit: "Anmelden",
      busy: "Überprüfung läuft...",
      errorApiUnavailable:
        "Der Anmeldedienst läuft auf dem lokalen Server der Plattform. Dies ist die stabile öffentliche Version — nutzen Sie sie zum Stöbern, für den Vereinsassistenten und für Spenden.",
      errorNetwork: "Verbindung zum Server fehlgeschlagen. Bitte prüfen Sie Ihre Netzwerkverbindung.",
      noAccount: "Noch kein Konto?",
      createAccount: "Kostenloses Konto erstellen",
      demoTitle: "Testkonten für die lokale Version (Passwort: Mamp@2026)",
      demoAccounts: [
        { email: "admin@mamp.ma", role: "Super-Admin" },
        { email: "user1@mamp.ma", role: "Vereinsvorsitzende" },
        { email: "user2@mamp.ma", role: "Schatzmeister" },
        { email: "partenaire@mamp.ma", role: "Partnerstelle" },
      ],
      demoNote:
        "Auf der veröffentlichten Version (mamp.pages.dev) laufen die Demo-Dashboards mit Testdaten ohne Anmeldung.",
    },
    register: {
      title: "Neues Konto erstellen",
      subtitle: "Kostenlos für alle: Bürger, Mitglieder, Ehrenamtliche und Angehörige der Vereine",
      fullName: "Vollständiger Name",
      fullNamePlaceholder: "z. B. Mohammed El Alaoui",
      email: "E-Mail-Adresse",
      phone: "Telefon (optional)",
      phonePlaceholder: "+212 6XX XXX XXX",
      password: "Passwort",
      passwordHint: "Mindestens 8 Zeichen mit Ziffern",
      consentPrefix: "Ich stimme der",
      consentPrivacy: "Datenschutzerklärung",
      consentMiddle:
        " sowie der Verarbeitung meiner personenbezogenen Daten für Zwecke der Nutzung der Plattform gemäß Gesetz 09.08 zum Schutz personenbezogener Daten zu und akzeptiere die",
      consentTerms: "Nutzungsbedingungen",
      consentSuffix: ". Ich kann meine Einwilligung jederzeit widerrufen.",
      consentError:
        "Für den Abschluss der Registrierung ist die Einwilligung in die Datenverarbeitung gemäß Gesetz 09.08 erforderlich",
      submit: "Konto erstellen",
      busy: "Wird erstellt...",
      errorApiUnavailable:
        "Der Registrierungsdienst läuft auf dem lokalen Server der Plattform. Dies ist die stabile öffentliche Version — Sie können das Vereinsverzeichnis durchstöbern und den Vereinsassistenten nutzen.",
      errorNetwork: "Verbindung zum Server fehlgeschlagen. Bitte prüfen Sie Ihre Netzwerkverbindung.",
      haveAccount: "Sie haben bereits ein Konto?",
      loginLink: "Jetzt anmelden",
      securityNote: "Passwörter werden mit dem scrypt-Standard verschlüsselt und niemals im Klartext gespeichert.",
    },
  },

  app: {
    badge: "Die offizielle App — Android",
    titleA: "Die MAMP-Plattform in Ihrer Tasche",
    titleB: "mit einer einzigen App",
    subtitle:
      "Die offizielle Android-App der Plattform: Durchstöbern Sie das Vereinsverzeichnis, sprechen Sie mit dem Vereinsassistenten und melden Sie sich für Veranstaltungen an — mit einem Fingertipp und direktem Download über Cloudflare.",
    heroImageAlt:
      "Oberfläche der MAMP-Plattform-App auf einem Android-Smartphone — Verzeichnis, Vereinsassistent und Veranstaltungen",
    downloadTitle: "Download und Installation",
    steps: [
      {
        title: "Schritt 1 — Datei herunterladen",
        desc: "Klicken Sie auf dieser Seite auf die Schaltfläche „Direkter Download — Cloudflare“ oder scannen Sie den QR-Code mit der Handykamera. Die Datei mamp.apk wird dann mit höchster Geschwindigkeit aus dem globalen Cloudflare-Netzwerk geladen.",
      },
      {
        title: "Schritt 2 — Play-Protect-Meldung überspringen",
        desc: "Möglicherweise erscheint die Meldung „Diese App wurde nicht überprüft“ — eine Standardmeldung für jede App außerhalb des Stores. Tippen Sie auf „Weitere Details“ und dann auf „Trotzdem installieren“, wie in den Bildern unten.",
      },
      {
        title: "Schritt 3 — App installieren",
        desc: "Kehren Sie zum Installationsbildschirm zurück und tippen Sie auf „Installieren“. Warten Sie einige Sekunden, bis der Vorgang abgeschlossen ist — zusätzliche Einstellungen sind nicht erforderlich.",
      },
      {
        title: "Schritt 4 — Öffnen und Nutzen",
        desc: "Öffnen Sie die App „MAMP-Plattform“ aus der App-Liste: Vereinsverzeichnis, Vereinsassistent und Veranstaltungen — alles liegt in Ihren Händen, mit Wischen nach unten zum Aktualisieren.",
      },
    ],
    noteTitle: "💡 Wichtiger Hinweis zur Android-Meldung",
    noteBody:
      "Das Erscheinen der Meldung „Unbekannte Quelle“ oder „Diese App wurde nicht überprüft“ ist normal und zu erwarten: Die App wird direkt von der offiziellen Website der Plattform und nicht aus einem App-Store vertrieben. Sobald Sie die Quelle einmal zugelassen haben, laufen künftige Installationen völlig reibungslos.",
    playProtectTitle: "Play-Protect-Meldung überspringen — Schritt für Schritt mit Bildern",
    playProtectIntro:
      "Diese Meldung erscheint auf modernen Android-Smartphones, sobald eine App außerhalb des Play Stores installiert wird. Folgen Sie den folgenden drei Bildern in der Reihenfolge:",
    playProtectSteps: [
      {
        title: "Play-Protect-Meldung bei der Installation",
        desc: "Beim Öffnen der APK-Datei kann die Meldung „Diese App wurde nicht überprüft“ erscheinen. Tippen Sie unten auf die blaue Schaltfläche „Weitere Details“ — und wählen Sie nicht „Abbrechen“.",
        alt: "Schritt 1 zum Überspringen der Play-Protect-Meldung: Play-Protect-Meldung bei der Installation",
      },
      {
        title: "Details der Warnung",
        desc: "Android erklärt, dass die App außerhalb des Play Stores stammt — dies ist bei allen direkt vertriebenen Apps normal. Tippen Sie auf „Trotzdem installieren“, um fortzufahren.",
        alt: "Schritt 2 zum Überspringen der Play-Protect-Meldung: Details der Warnung",
      },
      {
        title: "Installation abgeschlossen",
        desc: "Innerhalb weniger Sekunden ist die Installation abgeschlossen und die Schaltfläche „App öffnen“ erscheint. Diese Schritte sind nur einmal erforderlich — künftige Updates laufen reibungslos.",
        alt: "Schritt 3 zum Überspringen der Play-Protect-Meldung: Installation abgeschlossen",
      },
    ],
    qrTitle: "Schnelles Scannen mit der Kamera",
    qrDesc: "Richten Sie die Handykamera auf den Code, um direkt auf diese Seite zu gelangen",
    qrAlt: "QR-Code der Downloadseite der MAMP-Plattform-App",
    featuresTitle: "Vorteile der App",
    features: [
      "Die einzige offizielle, autorisierte Version der Plattform",
      "Ausschließlich verschlüsselte HTTPS-Verbindung — keine gemischten Inhalte",
      "Klare Seite bei Verbindungsabbruch",
      "Automatische Aktualisierung: derselbe Link liefert stets die neueste Version",
      "Passt sich Smartphones und Tablets an — volle Bildschirmausnutzung",
    ],
    webVersionTitle: "Vollständige Webversion",
    webVersionDesc:
      "Die neueste Version der vollständigen Plattform-Website in einer einzigen komprimierten Datei — ein direkter Link von Cloudflare, der sich bei jeder neuen offiziellen Veröffentlichung automatisch aktualisiert.",
    webVersionBtn: "Website herunterladen — direktes ZIP",
    requirementsTitle: "Systemvoraussetzungen",
    requirementsText: "Android 7.0 (Nougat) oder neuer · Internetverbindung · etwa 3 MB Speicherplatz",
    faqTitle: "Häufige Fragen zur App",
    faq: [
      {
        q: "Warum verlangt Android die Erlaubnis zur Installation aus „unbekannten Quellen“?",
        a: "Weil die App direkt über die offizielle Website der Plattform statt über den Google Play Store vertrieben wird. Diese Meldung ist eine Standardwarnung, die bei jeder App außerhalb des Stores erscheint; sobald Sie einmal zugestimmt haben, wird die App ganz normal installiert.",
      },
      {
        q: "Welche Systemvoraussetzungen gelten?",
        a: "Ein Android-Smartphone oder -Tablet mit Android 7.0 (Nougat) oder neuer sowie einer Internetverbindung. Die App ist eine offizielle Hülle der Plattform, die über mamp.pages.dev läuft und nur sehr wenig Speicherplatz auf dem Gerät belegt.",
      },
      {
        q: "Ist die App für iOS verfügbar?",
        a: "Derzeit ist die offizielle Version für Android bestimmt. iPhone- und iPad-Nutzer können die vollständige Webversion direkt im Browser (Safari oder Chrome) über mamp.pages.dev mit denselben Diensten und Inhalten nutzen.",
      },
      {
        q: "Wie erhalte ich eine Kopie der Plattform-Website selbst?",
        a: "Die vollständige Webversion der Plattform ist als komprimierte ZIP-Datei über einen direkten Link von Cloudflare auf dieser Seite verfügbar (Abschnitt „Vollständige Webversion“), und die Datei wird bei jeder neuen offiziellen Veröffentlichung automatisch aktualisiert.",
      },
    ],
    relatedPrefix: "Sie nutzen die Plattform lieber im Browser? Die Vollversion ist stets verfügbar über",
    relatedHomeLink: "die Startseite",
    relatedMiddle: "— die rechtlichen Dokumente der App finden Sie in den",
    relatedTermsLink: "Nutzungsbedingungen",
    relatedSuffix: ".",
  },

  release: {
    title: "Informationen zur neuesten Version",
    versionLabel: "Version",
    dateLabel: "Veröffentlichungsdatum",
    sizeLabel: "Dateigröße",
    failedText:
      "Die Versionsdetails können derzeit nicht abgerufen werden — der Download-Link unten führt Sie stets zur neuesten offiziellen Version.",
    downloadBtn: "Direkter Download — Cloudflare",
    downloadNote:
      "Ein dauerhafter Link aus dem Cloudflare-Netzwerk, der stets die neueste offizielle Version mit höchster Geschwindigkeit bereitstellt.",
    backupBtn: "Backup-Link — GitHub Releases",
  },

  legal: {
    hub: {
      badge: "Verifizierte und aktuelle Referenz",
      titleA: "Rechtsgrundlagen",
      titleB: "für die marokkanische Vereinsarbeit",
      subtitle:
        "Alles, was Sie zum Verständnis des rechtlichen Rahmens der Vereine brauchen: die grundlegenden Texte, das Gründungsverfahren Schritt für Schritt und die verifizierten offiziellen Portale — mit Links, die an ihrer Quelle überprüft wurden.",
      lawsTitle: "Der rechtliche Rahmen",
      laws: [
        {
          title: "Dahir Nr. 1.58.376",
          date: "15. November 1958",
          desc: "Die Gründungsreferenz für das Recht, in Marokko Vereine zu gründen, in der geänderten und ergänzten Fassung. Ein Anmeldesystem, das die Gründungsfreiheit ohne vorherige Genehmigung gewährleistet.",
          ref: "Amtsblatt (Bulletin Officiel) Nr. 2404 bis (27. November 1958)",
        },
        {
          title: "Gesetz Nr. 75.00",
          date: "23. Juli 2002",
          desc: "Verkündet durch den Dahir Nr. 1.02.206. Es präzisierte das Anmeldeverfahren und die Ausstellung der Bescheinigung und regelte die Beziehungen der Vereine zur Verwaltung.",
          ref: "Dahir Nr. 1.02.206",
        },
        {
          title: "Gesetz Nr. 07.09",
          date: "Änderung von Artikel 5",
          desc: "Änderte Artikel 5 des Dhairs von 1958, der das Verfahren der Anmeldung des Vereins bei der lokalen Verwaltungsbehörde und die Ausstellung der Bescheinigung regelt.",
          ref: "Änderung von Artikel 5 des Dhairs von 1958",
        },
        {
          title: "Gesetz Nr. 09.08",
          date: "18. Februar 2009",
          desc: "Schutz natürlicher Personen bei der Verarbeitung personenbezogener Daten. Es verpflichtet Vereine, bei der Verarbeitung von Mitgliederdaten eine Anmeldung bei der CNDP vorzunehmen.",
          ref: "Aufsicht: Die Nationale Kommission CNDP",
        },
        {
          title: "Verfassung des Königreichs 2011",
          date: "Artikel 12 und 29",
          desc: "Verankert die partizipative Demokratie und die Rolle der Vereine bei der Vorbereitung von Entscheidungen und gewährleistet die Freiheit der Vereinsgründung und der Mitgliedschaft.",
          ref: "Offizielles Portal maroc.ma",
        },
        {
          title: "Artikel 10 — Generalsteuergesetzbuch",
          date: "Steuersystem",
          desc: "Legt die Bedingungen für den Abzug von Geld- und Sachzuwendungen an berechtigte Stellen von der steuerlichen Bemessungsgrundlage der Spender fest.",
          ref: "Generaldirektion für Steuern",
        },
      ],
      stepsTitle: "Verfahren der Vereinsgründung — Schritt für Schritt",
      stepsIntro:
        "Gemäß dem durch das Dahir vom 15. November 1958 verankerten Anmeldesystem in der durch Gesetz 75.00 und Gesetz 07.09 geänderten Fassung.",
      steps: [
        { title: "Die Gründungsversammlung", desc: "Beschluss über die Satzung und Wahl des Vorstands." },
        { title: "Zusammenstellung des Dossiers", desc: "Signierte Exemplare der Satzung, Gründungsprotokoll, Mitgliederliste und Kopien der Ausweise." },
        { title: "Einreichung der Anmeldung", desc: "Bei der lokalen Verwaltungsbehörde am Sitz des Vereins, direkt oder über einen Gerichtsvollzieher." },
        { title: "Ausstellung der Bescheinigung", desc: "Eine gestempelte und datierte provisorische Bescheinigung wird sofort ausgestellt (Artikel 5 des Dhairs von 1958)." },
        { title: "Veröffentlichung im Amtsblatt", desc: "Antrag beim Generalsekretariat der Regierung zum Erwerb der Rechtspersönlichkeit." },
      ],
      portalsTitle: "Verifizierte offizielle Portale",
      portalsIntro:
        "Ausschließlich verifizierte offizielle Links — dieselbe Liste, die der Vereinsassistent verwendet, sodass den Nutzern kein Link außerhalb davon angegeben wird.",
      portals: [
        { key: "maroc", desc: "Das offizielle Portal des Königreichs und die öffentlichen digitalen Dienste." },
        { key: "sggAssociations", desc: "Rechtstexte, offizielle Formulare, Verfahren der Gemeinnützigkeit und der Spendensammlung." },
        { key: "interieur", desc: "Das für die Gebietsverwaltung zuständige Ministerium, das die Anmeldungen entgegennimmt." },
        { key: "tax", desc: "Das Steuersystem der Vereine, die Bescheinigungen und die steuerlichen Auskünfte." },
        { key: "ice", desc: "Beantragung der einheitlichen Unternehmenskennung (ICE) für Vereine." },
        { key: "cnss", desc: "Anmeldung der Vereinsbeschäftigten und die Sozialversicherungsbeiträge." },
        { key: "cndp", desc: "Anmeldung der Verarbeitung personenbezogener Daten (Gesetz 09.08)." },
        { key: "asd", desc: "Portal der direkten Sozialhilfe." },
        { key: "mcrpsc", desc: "Die Rahmenbestimmungen des Vereinslebens und die sektoralen Förderprogramme." },
      ],
      formsTitle: "Fertige offizielle Formulare",
      formsDesc:
        "Das Formular für die Anmeldung einer Vereinsgründung, die in die Satzungen aufzunehmenden Bestimmungen, der Antrag auf Gemeinnützigkeit, die Deklaration ausländischer Hilfe und der Antrag auf Genehmigung einer Spendensammlung — alle offiziell über die Vereinsseite des Generalsekretariats der Regierung verfügbar.",
      formsBtn: "Zu den Formularen",
      assistantTitle: "Sie haben eine Rechtsfrage?",
      assistantDesc:
        "Fragen Sie den „Vereinsassistenten“ — er antwortet aus der oben genannten offiziellen Wissensdatenbank, ohne Halluzinationen und ohne erfundene Links.",
      assistantBtn: "Mit dem Assistenten sprechen",
      disclaimer:
        "Hinweis: Die rechtlichen Informationen auf dieser Seite sind orientierend und zusammengefasst; maßgeblich bleibt der amtliche Wortlaut der Dahir-Dekrete und Gesetze in der im Amtsblatt (Bulletin Officiel) veröffentlichten Fassung, und für eine genaue Beratung wird empfohlen, Fachleute und die zuständigen Behörden zu konsultieren.",
    },
    docBadge: "Offizielles rechtliches Dokument — MAMP-Plattform",
    lastUpdated: "Letzte Aktualisierung:",
    docFooter:
      "Dieses Dokument dient der Orientierung und ersetzt weder die offiziellen Texte noch die Beratung durch Fachleute. Bei rechtlichen Fragen zur Nutzung der Plattform kontaktieren Sie uns bitte über die auf der Seite „Rechtsgrundlagen“ angegebene E-Mail-Adresse.",
  },

  kb: {
    sourcesNote: "Quellen",
    notFound:
      "Es tut mir leid, ich habe derzeit keine verifizierte Antwort auf diese Frage.\n\nIch empfehle Ihnen, sich an die zuständige Behörde zu wenden oder das betreffende offizielle Portal zu besuchen (die wichtigsten Portale finden Sie auf der Seite „Rechtsgrundlagen“).\n\nHinweis: Diese Version antwortet direkt aus der verifizierten Wissensdatenbank der Plattform; die Vollversion des Assistenten ist auf dem lokalen Server der Plattform verfügbar.",
    linksHeader: "Verifizierte offizielle Links:",
    relatedHeader: "Verwandte Themen:",
  },

  demo: {
    cities: {
      "الدار البيضاء": "Casablanca",
      "فاس": "Fès",
      "أكادير": "Agadir",
      "الرباط": "Rabat",
      "مراكش": "Marrakesch",
      "طنجة": "Tanger",
      "وجدة": "Oujda",
      "مكناس": "Meknès",
    },
    regions: {
      "الدار البيضاء - سطات": "Casablanca-Settat",
      "فاس - مكناس": "Fès-Meknès",
      "سوس - ماسة": "Souss-Massa",
      "الرباط - سلا - القنيطرة": "Rabat-Salé-Kénitra",
      "مراكش - آسفي": "Marrakesch-Safi",
    },
    categories: {
      "تنموية": "Entwicklung",
      "ثقافية": "Kultur",
      "بيئية": "Umwelt",
      "اجتماعية": "sozial",
      "رياضية": "Sport",
      "تعليمية": "Bildung",
      "صحية": "Gesundheit",
    },
    eventCategories: {
      "تكوينية": "Fortbildung",
      "تحسيسة": "Bewusstseinsbildung",
      "ثقافية": "Kultur",
      "رياضية": "Sport",
      "خيرية": "wohltätig",
    },
    associations: {
      "association-nadwa-tanmiya": {
        name: "Verein Nadwa für Entwicklung und Beschäftigung",
        acronym: "Nadwa",
        description:
          "Ein Entwicklungsverein in der Region Casablanca-Settat, der sich der Qualifizierung junger Menschen, der Förderung des Kleinstunternehmertums und der Unterstützung der Selbstbeschäftigung widmet — durch Ausbildungsprogramme und Projektbegleitung.",
        mission:
          "Junge Menschen mit beruflichen und digitalen Kompetenzen ausstatten, entstehende Gründungsvorhaben begleiten und zu einer nachhaltigen lokalen Entwicklung beitragen.",
      },
      "association-al-mashriq-thaqafiya": {
        name: "Verein Al-Mashriq für Kultur und Künste",
        acronym: "Al-Mashriq",
        description:
          "Ein kultureller und künstlerischer Raum in der Stadt Fès, der Treffen und Festivals für Musik, Theater und bildende Kunst organisiert und das reiche kulturelle Erbe der Stadt bewahrt.",
        mission:
          "Kultur und Künste verbreiten, das authentische marokkanische Erbe hervorheben und beides der Jugend näherbringen.",
      },
      "association-mido-biya": {
        name: "Verein Mido für Umweltschutz",
        acronym: "Mido",
        description:
          "Ein Umweltverein in der Stadt Agadir, der sich für Umwelterziehung, Aufforstungsaktionen an der Küste und Strandreinigungen einsetzt — unter Beteiligung von Ehrenamtlichen und Schulen.",
        mission:
          "Die lokale Umwelt schützen und bei Heranwachsenden eine Kultur der nachhaltigen Entwicklung verbreiten.",
      },
    },
    events: {
      "الدورة التكوينية السابعة في تطوير الويب": {
        title: "Die siebte Fortbildung in Webentwicklung",
        location: "Vereinssitz, Casablanca",
      },
      "ملتقى المقاولاتية الشابة": {
        title: "Treffen des jungen Unternehmertums",
        location: "Konferenzsaal, Casablanca",
      },
    },
  },
  meta: {
    siteName: "MAMP-Plattform",
    siteTitle: "MAMP-Plattform — Verwaltung marokkanischer Vereine",
    siteDescription: "Professionelle digitale Plattform für die Verwaltung marokkanischer Vereine: Mitgliedschaften, Buchhaltung, Spenden, Veranstaltungen und offizielle Dokumente — gemäß Gesetz 75.00 und Königlichem Dahir 1.58.376.",
    pages: {
      associations: "Verzeichnis zertifizierter Vereine",
      legal: "Rechtsgrundlagen der marokkanischen Vereinsarbeit",
      terms: "Nutzungsbedingungen der Plattform",
      privacy: "Datenschutz- und Datenschutzerklärung",
      cookies: "Cookie-Richtlinie",
      assistant: "Vereinsassistent",
      app: "Offizielle Android-App",
      login: "Anmelden",
      register: "Konto erstellen",
      notFound: "Seite nicht gefunden",
    },
  },
};
