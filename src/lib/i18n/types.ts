/**
 * عقد قاموس الترجمة (Dict) — البنية الملزمة لكل اللغات الثماني.
 * أي ملف لغة لا يطابق هذه البنية حرفياً يفشل في فحص TypeScript،
 * وهذا هو الضابط الأول ضد التسربات والمفاتيح الناقصة.
 */

export interface Dict {
  common: {
    /** الشعار — السطر الصغير تحت الاسم */
    brandTagline: string;
    verified: string;
    publicUtility: string;
    memberWord: string;
    membersWord: string;
    currency: string;
    loading: string;
    notFoundTitle: string;
    close: string;
    learnMore: string;
    themeDark: string;
    themeLight: string;
  };

  nav: {
    home: string;
    associations: string;
    projects: string;
    legal: string;
    assistant: string;
    login: string;
    register: string;
    openMenu: string;
    closeMenu: string;
    mainNavAria: string;
    homeAria: string;
    language: string;
  };

  footer: {
    about: string;
    badgeLaw: string;
    badgePrivacy: string;
    badgeAssistant: string;
    platformTitle: string;
    membersLogin: string;
    dashboard: string;
    androidApp: string;
    legalDocsTitle: string;
    terms: string;
    privacy: string;
    cookies: string;
    officialPortalsTitle: string;
    copyright: string;
    legalNotice: string;
  };

  home: {
    hero: {
      badge: string;
      titleA: string;
      titleB: string;
      titleC: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      trustDahir: string;
      trustLaw: string;
      trustData: string;
      cardVerified: string;
      cardActiveMember: string;
      cardIncome: string;
      cardDonations: string;
      cardTreasury: string;
      cardAssistant: string;
      cardUserMsg: string;
      cardBotMsg: string;
      statAssociations: string;
      statMembers: string;
      statTransactions: string;
      statManaged: string;
    };
    features: {
      badge: string;
      titleA: string;
      titleB: string;
      subtitle: string;
      items: Array<{ title: string; desc: string }>;
    };
    roles: {
      badge: string;
      titleA: string;
      titleB: string;
      subtitle: string;
      items: Array<{
        title: string;
        subtitle: string;
        desc: string;
        points: string[];
      }>;
    };
    howItWorks: {
      titleA: string;
      titleB: string;
      subtitle: string;
      steps: Array<{ title: string; desc: string }>;
    };
    preview: {
      titleA: string;
      titleB: string;
      subtitle: string;
      viewAll: string;
    };
    assistantCta: {
      titleA: string;
      titleB: string;
      subtitle: string;
      subtitleBold: string;
      subtitleEnd: string;
      cta: string;
      secondary: string;
    };
    faq: {
      title: string;
      items: Array<{ q: string; a: string }>;
    };
  };

  associations: {
    titleA: string;
    titleB: string;
    subtitle: string;
    searchPlaceholder: string;
    searchAria: string;
    cityAria: string;
    allCities: string;
    categoryAria: string;
    allCategories: string;
    resultsCount: string;
    noResultsTitle: string;
    noResultsDesc: string;
    resetFilters: string;
  };

  associationDetail: {
    verifiedBadge: string;
    publicUtilityBadge: string;
    foundedIn: string;
    donateBtn: string;
    joinBtn: string;
    aboutTitle: string;
    missionTitle: string;
    upcomingEvents: string;
    joinCardTitle: string;
    joinCardDesc: string;
    identityTitle: string;
    fieldCategory: string;
    fieldCity: string;
    fieldRegion: string;
    fieldFoundedYear: string;
    fieldIce: string;
    fieldLegalStatus: string;
    statusPublicUtility: string;
    statusDeclared: string;
    activeMembers: string;
    registeredDonations: string;
    donateCardTitle: string;
    donateCardDesc: string;
    donateCardNote: string;
    heroImageAlt: string;
  };

  assistant: {
    titleA: string;
    titleB: string;
    subtitle: string;
    chat: {
      welcome: string;
      quickQuestions: string[];
      headerSub: string;
      newChat: string;
      inputPlaceholder: string;
      inputAria: string;
      sendAria: string;
      errorFallback: string;
      offlineNote: string;
      kbSourcesTitle: string;
      kbSourcesDesc: string;
      charterTitle: string;
      charterItems: string[];
    };
  };

  chatbot: {
    openAria: string;
    title: string;
    headerSub: string;
    fullVersionAria: string;
    closeAria: string;
    welcome: string;
    suggestions: string[];
    inputPlaceholder: string;
    inputAria: string;
    sendAria: string;
    errorFallback: string;
    offlineNote: string;
  };

  auth: {
    login: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      submit: string;
      busy: string;
      errorApiUnavailable: string;
      errorNetwork: string;
      noAccount: string;
      createAccount: string;
    };
    register: {
      title: string;
      subtitle: string;
      fullName: string;
      fullNamePlaceholder: string;
      email: string;
      phone: string;
      phonePlaceholder: string;
      password: string;
      passwordHint: string;
      consentPrefix: string;
      consentPrivacy: string;
      consentMiddle: string;
      consentTerms: string;
      consentSuffix: string;
      consentError: string;
      submit: string;
      busy: string;
      errorApiUnavailable: string;
      errorNetwork: string;
      haveAccount: string;
      loginLink: string;
      securityNote: string;
    };
  };

  app: {
    badge: string;
    titleA: string;
    titleB: string;
    subtitle: string;
    heroImageAlt: string;
    downloadTitle: string;
    steps: Array<{ title: string; desc: string }>;
    noteTitle: string;
    noteBody: string;
    playProtectTitle: string;
    playProtectIntro: string;
    playProtectSteps: Array<{ title: string; desc: string; alt: string }>;
    qrTitle: string;
    qrDesc: string;
    qrAlt: string;
    featuresTitle: string;
    features: string[];
    webVersionTitle: string;
    webVersionDesc: string;
    webVersionBtn: string;
    requirementsTitle: string;
    requirementsText: string;
    faqTitle: string;
    faq: Array<{ q: string; a: string }>;
    relatedPrefix: string;
    relatedHomeLink: string;
    relatedMiddle: string;
    relatedTermsLink: string;
    relatedSuffix: string;
  };

  release: {
    title: string;
    versionLabel: string;
    dateLabel: string;
    sizeLabel: string;
    failedText: string;
    downloadBtn: string;
    downloadNote: string;
    backupBtn: string;
  };

  legal: {
    hub: {
      badge: string;
      titleA: string;
      titleB: string;
      subtitle: string;
      lawsTitle: string;
      laws: Array<{ title: string; date: string; desc: string; ref: string }>;
      stepsTitle: string;
      stepsIntro: string;
      steps: Array<{ title: string; desc: string }>;
      portalsTitle: string;
      portalsIntro: string;
      portals: Array<{ key: string; desc: string }>;
      formsTitle: string;
      formsDesc: string;
      formsBtn: string;
      assistantTitle: string;
      assistantDesc: string;
      assistantBtn: string;
      disclaimer: string;
    };
    docBadge: string;
    lastUpdated: string;
    docFooter: string;
  };

  kb: {
    /** عنوان قسم المصادر في صفحة المساعد */
    sourcesNote: string;
    /** رسالة «لا أعرف» الصادقة من المساعد */
    notFound: string;
    /** ترويسة قائمة الروابط الرسمية في الجواب */
    linksHeader: string;
    /** ترويسة المواضيع ذات الصلة */
    relatedHeader: string;
  };

  demo: {
    /** مدن (مفتاح = الاسم العربي في البيانات) */
    cities: Record<string, string>;
    regions: Record<string, string>;
    /** مجالات الجمعيات */
    categories: Record<string, string>;
    eventCategories: Record<string, string>;
    /** جمعيات العرض (مفتاح = slug) */
    associations: Record<string, { name: string; acronym: string; description: string; mission: string }>;
    /** فعاليات العرض (مفتاح = العنوان العربي) */
    events: Record<string, { title: string; location: string }>;
  };

  /** المشاريع المشتركة — الصفحة العمومية */
  projects: {
    badge: string;
    titleA: string;
    titleB: string;
    subtitle: string;
    filterAll: string;
    filterEvents: string;
    filterPrograms: string;
    filterProjects: string;
    kindEvent: string;
    kindProgram: string;
    kindProject: string;
    statusPublished: string;
    statusInProgress: string;
    statusCompleted: string;
    statusCancelled: string;
    leadLabel: string;
    participantsLabel: string;
    noParticipants: string;
    partnerGovernment: string;
    partnerPrivate: string;
    partnerNgo: string;
    partnerInternational: string;
    roleCoordination: string;
    roleFunding: string;
    roleExecution: string;
    roleSupport: string;
    partPending: string;
    partActive: string;
    partDeclined: string;
    datesLabel: string;
    locationLabel: string;
    objectivesLabel: string;
    emptyTitle: string;
    emptyDesc: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
  };

  /** لوحة التحكم — الهيكل والإعدادات والمشاريع المشتركة */
  dash: {
    nav: {
      overview: string;
      projects: string;
      members: string;
      accounting: string;
      donations: string;
      events: string;
      settings: string;
    };
    menu: {
      openMenu: string;
      closeMenu: string;
      backToSite: string;
      myAssociations: string;
      allAssociations: string;
      noAssociation: string;
      platformAdmin: string;
      registerNew: string;
      assistant: string;
      accountMenu: string;
      logout: string;
      pendingVerification: string;
    };
    projects: {
      title: string;
      countLabel: string;
      newBtn: string;
      formTitle: string;
      titleLabel: string;
      titlePh: string;
      kindLabel: string;
      categoryLabel: string;
      descLabel: string;
      objectivesLabel: string;
      objectivesPh: string;
      startLabel: string;
      endLabel: string;
      locationLabel: string;
      cityLabel: string;
      publicLabel: string;
      publicHint: string;
      participantsTitle: string;
      participantsHint: string;
      addAssocLabel: string;
      addPartnerLabel: string;
      partnerNameLabel: string;
      partnerNamePh: string;
      partnerTypeLabel: string;
      partnerRoleLabel: string;
      addBtn: string;
      removeBtn: string;
      submitBtn: string;
      cancelBtn: string;
      leadLabel: string;
      participantsLabel: string;
      noParticipants: string;
      statusDraft: string;
      statusPublished: string;
      statusInProgress: string;
      statusCompleted: string;
      statusCancelled: string;
      partPending: string;
      partActive: string;
      partDeclined: string;
      actionPublish: string;
      actionStart: string;
      actionComplete: string;
      actionCancel: string;
      actionDelete: string;
      confirmDelete: string;
      toastCreated: string;
      toastCreateFailed: string;
      toastStatusUpdated: string;
      toastStatusFailed: string;
      toastParticipantUpdated: string;
      toastParticipantFailed: string;
      toastRemoved: string;
      toastRemoveFailed: string;
      emptyTitle: string;
      emptyDesc: string;
    };
    settings: {
      title: string;
      subtitle: string;
      profileTitle: string;
      profileDesc: string;
      avatarLabel: string;
      avatarChange: string;
      avatarRemove: string;
      avatarUploading: string;
      avatarHint: string;
      identityTitle: string;
      identityDesc: string;
      identityPrivacy: string;
      docNationalId: string;
      docPassport: string;
      docDriversLicense: string;
      docUpload: string;
      docReplace: string;
      docDelete: string;
      docMissing: string;
      assocTitle: string;
      assocDesc: string;
      logoLabel: string;
      logoChange: string;
      logoHint: string;
      newAssocTitle: string;
      newAssocDesc: string;
      formName: string;
      formNamePh: string;
      formAcronym: string;
      formCategory: string;
      formCity: string;
      formRegion: string;
      formDescription: string;
      formDescPh: string;
      formMission: string;
      formAddress: string;
      formEmail: string;
      formPhone: string;
      formWebsite: string;
      formFoundedAt: string;
      formLegalStatus: string;
      formLegalDeclared: string;
      formLegalPU: string;
      formIceNumber: string;
      formPresidentName: string;
      formPresidentEmail: string;
      formPresidentPassword: string;
      formPresidentHint: string;
      formLogoLabel: string;
      formSubmit: string;
      formSubmitting: string;
      newAssocDocsTitle: string;
      newAssocDocsDesc: string;
      formDocStatutes: string;
      formDocStatutesHint: string;
      formDocMinutes: string;
      formDocReceipt: string;
      formDocsHint: string;
      boardTitle: string;
      boardDesc: string;
      boardAddBtn: string;
      boardRemoveBtn: string;
      boardRoleLabel: string;
      boardFullName: string;
      boardEmail: string;
      boardPhone: string;
      boardRoleVicePresident: string;
      boardRoleSecretary: string;
      boardRoleTreasurer: string;
      boardRoleBoardMember: string;
      boardRoleCoAdmin: string;
      boardAccountsNote: string;
      toastDocsRequired: string;
      toastBoardRequired: string;
      toastAssocCreated: string;
      toastAssocFailed: string;
      toastLogoUpdated: string;
      toastLogoFailed: string;
      toastAvatarUpdated: string;
      toastAvatarFailed: string;
      toastDocUploaded: string;
      toastDocFailed: string;
      toastDocDeleted: string;
    };
  };

  /** بيانات وصفية للتبويب ومحركات البحث — تتحدث ديناميكياً بلغة الواجهة */
  meta: {
    /** اسم المنصة القصير (لاحقة عناوين التبويب) */
    siteName: string;
    /** عنوان التبويب الافتراضي (الصفحة الرئيسية) */
    siteTitle: string;
    /** وصف الموقع — يحدّث وسم meta description بلغة الواجهة */
    siteDescription: string;
    /** عناوين الصفحات كما تظهر في التبويب (بدون اللاحقة) */
    pages: {
      associations: string;
      projects: string;
      legal: string;
      terms: string;
      privacy: string;
      cookies: string;
      assistant: string;
      app: string;
      login: string;
      register: string;
      notFound: string;
    };
  };
}

/** نوع مسارات مفاتيح القاموس — t("home.hero.title") */
export type DictPath = {};
