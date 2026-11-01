import type { KBTranslationSet } from "./types";

/**
 * Traduction française de la base de connaissances (FR-MA).
 * Miroir exact de src/lib/kb/data.ts (source de référence arabe) :
 * mêmes identifiants d'entrées, mêmes chiffres, mêmes liens officiels.
 */
export const frKB: KBTranslationSet = {
  entries: {
    "law-dahir-1958": {
      title: "Le Dahir régissant le droit de créer des associations (1958)",
      keywords: ["dahir", "1958", "loi", "associations", "droit", "création", "1.58.376", "cadre", "juridique", "texte fondateur"],
      answer:
        "Le texte fondateur du travail associatif au Maroc est le Dahir n° 1.58.376 promulgué le 3 Jumada al-Ula 1378 (15 novembre 1958), qui régit le droit de créer des associations, tel qu'il a été modifié et complété. Ce dahir a été publié au Bulletin Officiel n° 2404 bis en date du 27 novembre 1958 et fixe les règles générales de création, de gestion et de dissolution des associations. Le système marocain se distingue par son caractère déclaratif : la création d'une association est libre et sans autorisation préalable, avec l'obligation de la déclarer auprès de l'autorité administrative locale.",
    },
    "law-75-00": {
      title: "Loi 75.00 modifiant et complétant le Dahir sur les associations (2002)",
      keywords: ["75.00", "75", "loi", "modification", "complément", "2002", "1.02.206", "dahir", "amendement"],
      answer:
        "La loi n° 75.00 relative aux associations a été promulguée par le Dahir n° 1.02.206 du 12 Jumada al-Ula 1423 (23 juillet 2002) ; elle modifie et complète le Dahir du 15 novembre 1958. Parmi ses principales innovations : la clarification de la procédure de déclaration et de délivrance du récépissé, l'encadrement des relations des associations avec les autorités et le renforcement de la transparence financière. Vous pouvez consulter les textes officiels sur la page des associations du portail du Secrétariat Général du Gouvernement.",
    },
    "law-07-09": {
      title: "Loi 07.09 modifiant l'article 5 du Dahir sur les associations",
      keywords: ["07.09", "article", "cinquième", "déclaration", "modification", "récépissé"],
      answer:
        "La loi n° 07.09 a modifié l'article 5 du Dahir du 15 novembre 1958 relatif au droit de créer des associations, article qui régit la procédure de déclaration de l'association auprès de l'autorité administrative locale et la délivrance du récépissé. Le texte officiel est disponible sur la page des associations du Secrétariat Général du Gouvernement.",
    },
    "law-constitution": {
      title: "Le fondement constitutionnel du travail associatif",
      keywords: ["constitution", "2011", "article", "12", "29", "société civile", "démocratie", "participative"],
      answer:
        "La Constitution du Royaume du Maroc de 2011 consacre le travail associatif : l'article 12 confirme le rôle des associations non gouvernementales dans l'élaboration, l'exécution et l'évaluation des décisions dans le cadre de la démocratie participative, et l'article 29 garantit la liberté de réunion, de manifestation, de créer des associations et d'y adhérer. Les pouvoirs publics s'engagent en outre à faciliter la création des associations et à soutenir leur action.",
    },
    "law-data-09-08": {
      title: "Loi 09.08 sur la protection des données à caractère personnel (CNDP)",
      keywords: ["09.08", "données", "personnelles", "protection", "CNDP", "commission", "déclaration", "confidentialité"],
      answer:
        "La loi n° 09.08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel soumet les associations traitant les données de leurs membres (nom, numéro de la carte nationale, téléphone...) à l'obligation de déclaration auprès de la Commission Nationale de contrôle de la protection des données à caractère personnel (CNDP) ou de demande d'autorisation selon le cas. La plateforme MAMP intègre un consentement explicite (Consent) pour chaque adhérent conformément à cette loi, et permet d'enregistrer la date du consentement. Pour plus d'informations et pour la déclaration électronique, visitez le site de la CNDP.",
    },
    "law-fundraising": {
      title: "Collecte de dons auprès du public (autorisation préalable)",
      keywords: ["collecte", "dons", "public", "autorisation", "procédure", "caravane", "campagne", "collecte publique"],
      answer:
        "Les opérations de collecte de dons auprès du public (portes-à-porte, caravanes, campagnes publiques...) à des fins caritatives sont soumises à une autorisation préalable conformément à la loi relative à l'organisation des opérations de collecte de dons auprès du public et de distribution d'aides à des fins caritatives, ainsi qu'à son décret d'application. Les demandes sont déposées selon les procédures officiellement annoncées, et la page des associations du Secrétariat Général du Gouvernement dispose de la procédure et du formulaire de demande d'autorisation. Sur la plateforme MAMP, vous pouvez associer chaque opération de collecte de dons au numéro de l'autorisation afin d'en suivre la conformité.",
    },
    "found-steps": {
      title: "Étapes de création d'une association au Maroc",
      keywords: ["création", "étapes", "créer", "association", "procédure", "démarches", "comment", "fonder"],
      answer:
        "La création d'une association au Maroc s'effectue selon un régime déclaratif en cinq étapes principales :\n1. Tenue de l'assemblée générale constitutive : réunissant les fondateurs, elle adopte les statuts et élit les membres du bureau (président, secrétaire général, trésorier...).\n2. Préparation du dossier : plusieurs exemplaires des statuts signés par les fondateurs, le procès-verbal de l'assemblée générale constitutive signé, la liste des membres fondateurs accompagnée de copies de leurs cartes nationales d'identité et des fiches de renseignements, ainsi que le casier judiciaire ou tout document attestant l'identité.\n3. Dépôt de la déclaration : le dossier est présenté au siège de l'autorité administrative locale (caïdat, pachalik ou annexe administrative) dont relève le siège de l'association, directement ou par l'intermédiaire d'un huissier de justice.\n4. Délivrance du récépissé : un récépissé provisoire timbré et daté de la déclaration est délivré séance tenante (article 5 du Dahir de 1958 tel que modifié).\n5. Publication au Bulletin Officiel : elle est demandée auprès du Secrétariat Général du Gouvernement, soit directement par l'association, soit via l'autorité locale, pour que l'association acquière la personnalité morale.\n\nLes documents officiels et formulaires (formulaire de déclaration de création d'association, clauses à insérer dans les statuts) sont disponibles sur la page des associations du Secrétariat Général du Gouvernement.",
    },
    "found-statutes": {
      title: "Clauses à insérer dans les statuts",
      keywords: ["statuts", "loi fondamentale", "clauses", "articles", "dispositions", "rédaction", "contenu"],
      answer:
        "Les statuts de l'association doivent contenir le minimum de clauses fixées par le Dahir de 1958, notamment : la dénomination de l'association et ses objectifs, son siège social, les conditions d'adhésion et de perte de la qualité de membre, le montant de la cotisation le cas échéant, les organes de gestion et la définition de leurs attributions (assemblée générale, bureau...), les règles de vote et le quorum, ainsi que la procédure de modification des statuts, de dissolution de l'association et de la dévolution de ses biens. Le Secrétariat Général du Gouvernement met à disposition un document officiel intitulé « Clauses à insérer dans les statuts des associations », consultable sur la page des associations.",
    },
    "found-receipt": {
      title: "Récépissé provisoire et récépissé définitif de la déclaration",
      keywords: ["récépissé", "provisoire", "définitif", "dépôt", "déclaration", "titre", "document", "remise"],
      answer:
        "Lors du dépôt de la déclaration de création de l'association auprès de l'autorité administrative locale, un récépissé provisoire timbré et daté est délivré séance tenante (article 5 du Dahir tel que modifié par la loi 75.00 et la loi 07.09). Ce récépissé constitue la preuve officielle de la déclaration et peut être utilisé par l'association dans certaines procédures dans l'attente de la délivrance du récépissé définitif. En cas de retard injustifié dans la délivrance du récépissé définitif, l'association peut relancer l'administration concernée ou introduire un recours devant le tribunal administratif compétent.",
    },
    "found-publication": {
      title: "Publication au Bulletin Officiel",
      keywords: ["publication", "Bulletin", "Officiel", "bulletin officiel", "personnalité", "morale"],
      answer:
        "L'association ne jouit de la personnalité morale qu'après la publication au Bulletin Officiel de la déclaration de sa création. La demande est introduite soit directement par l'association auprès du Secrétariat Général du Gouvernement (direction du Bulletin Officiel), soit via l'autorité locale, contre paiement des droits fixés. Après la publication, l'association peut ouvrir un compte bancaire à son nom, contracter et agir en justice. Pour consulter les numéros du Bulletin Officiel et les textes publiés, visitez le portail du Secrétariat Général du Gouvernement.",
    },
    "found-public-utility": {
      title: "Reconnaissance de la qualité d'utilité publique",
      keywords: ["utilité", "publique", "qualité", "reconnaissance", "avantages", "conditions", "décret"],
      answer:
        "La qualité d'utilité publique est accordée par décret pris sur proposition du ministre de l'Intérieur après consultation d'une commission ; elle confère à l'association des avantages, dont la possibilité de recevoir des dons et legs et de percevoir des subventions, ainsi que des garanties supplémentaires en matière de recouvrement. La procédure de dépôt de la demande de reconnaissance de la qualité d'utilité publique et le formulaire de demande sont officiellement disponibles sur la page des associations du Secrétariat Général du Gouvernement. L'exercice effectif d'une activité d'utilité publique pendant une durée suffisante, conformément à ses statuts, est habituellement exigé.",
    },
    "found-foreign-aid": {
      title: "Déclaration des aides étrangères",
      keywords: ["aides", "étrangères", "étrangers", "financement", "étranger", "dons", "déclaration", "réception"],
      answer:
        "Toute association recevant une aide financière ou en nature d'une entité étrangère (État, organisation, association étrangère...) doit la déclarer selon le formulaire officiel « Déclaration de réception d'une aide étrangère par l'association », disponible sur la page des associations du Secrétariat Général du Gouvernement, conformément aux dispositions du Dahir de 1958 tel que modifié et complété. Sur la plateforme MAMP, lors de l'enregistrement d'un don provenant d'une entité étrangère, un rappel de l'obligation de déclaration s'affiche et un champ est réservé au numéro de déclaration.",
    },
    "found-annual-declaration": {
      title: "Déclarations annuelles et changements du bureau",
      keywords: ["déclaration", "annuelle", "changement", "membres", "bureau", "mise à jour", "autorités", "obligatoire"],
      answer:
        "Conformément au Dahir de 1958 tel que modifié par la loi 75.00, les associations doivent déclarer auprès de l'autorité locale les changements survenant dans leur administration ou leurs membres (changement du bureau, changement du siège, modification des statuts) dans les délais légaux. Il est également recommandé — et exigé dans de nombreuses relations avec les partenaires — d'établir un rapport moral et financier annuel approuvé par l'assemblée générale ordinaire. La plateforme MAMP met à disposition une liste de contrôle prête à l'emploi pour la déclaration annuelle dans le module « Documents ».",
    },
    "join-platform": {
      title: "Comment adhérer à une association via la plateforme MAMP",
      keywords: ["adhésion", "rejoindre", "membre", "comment", "adhérer", "participer", "MAMP"],
      answer:
        "Pour adhérer à une association via la plateforme MAMP :\n1. Créez un compte citoyen gratuit depuis la page « Créer un compte ».\n2. Parcourez l'annuaire des associations et utilisez les filtres (ville, domaine).\n3. Depuis la page de l'association, appuyez sur « Demande d'adhésion » et remplissez le formulaire (spécialité, consentement explicite au traitement des données conformément à la loi 09.08).\n4. La demande reste « en attente » jusqu'à son acceptation par le bureau de l'association ; vous devenez alors adhérent à part entière et bénéficiez de l'espace des membres.\n\nIl est également possible de se porter volontaire pour les événements publics des associations sans adhérer.",
    },
    "join-fees": {
      title: "Cotisations annuelles d'adhésion",
      keywords: ["cotisation", "adhésion", "abonnement", "annuel", "frais", "montant", "paiement", "renouvellement"],
      answer:
        "La cotisation annuelle d'adhésion est fixée par les statuts de chaque association. Sur la plateforme MAMP, le trésorier enregistre le paiement des cotisations pour chaque exercice, avec délivrance automatique d'un reçu numéroté, et le système rappelle les adhérents n'ayant pas réglé la cotisation de l'exercice en cours. La date d'expiration de l'adhésion est calculée automatiquement, et l'adhérent en retard passe au statut « cotisation en retard » avant la suspension.",
    },
    "accounting-features": {
      title: "La comptabilité numérique de l'association dans MAMP",
      keywords: ["comptabilité", "finances", "comptes", "recette", "dépense", "budget", "rapport financier", "gestion"],
      answer:
        "Le module de comptabilité de la plateforme MAMP permet aux associations :\n• d'enregistrer toutes les recettes et dépenses de manière classée (adhésions, dons, subventions, activités, location, équipements...).\n• de recourir à la validation double : le trésorier enregistre et le président valide.\n• de disposer d'un budget prévisionnel annuel et de la comparaison entre le réalisé et le prévu.\n• de suivre des indicateurs en temps réel : solde, recette annuelle, dépense annuelle, évolution mensuelle de la trésorerie.\n• de générer le rapport financier annuel prêt à imprimer et à présenter à l'assemblée générale.\nTous les montants sont en dirham marocain (MAD).",
    },
    "accounting-categories": {
      title: "Catégories de classification comptable adoptées",
      keywords: ["catégories", "classification", "types", "rubriques", "classement", "comptable"],
      answer:
        "La plateforme adopte des catégories unifiées et extensibles : recettes (adhésions, dons, subventions et aides, activités et événements, autres) et dépenses (location et charges, équipements et matériel, honoraires et frais administratifs, communication et formation, activités et événements, autres). Cette classification alimente directement les graphiques et le rapport financier annuel.",
    },
    "donation-receipt": {
      title: "Le reçu de don dans la plateforme",
      keywords: ["reçu", "don", "reçu de don", "justificatif", "preuve", "attestation"],
      answer:
        "À l'enregistrement de chaque don (en numéraire ou en nature), la plateforme génère un reçu officiel numéroté comprenant : les informations de l'association, le nom du donateur, le montant ou la description du don en nature, la date et le numéro de série, ainsi que la signature. Le donateur peut demander son reçu directement depuis la page de l'association, et l'association conserve une copie dans le registre des dons. Le reçu est indispensable au donateur pour bénéficier de la déduction fiscale lorsque les conditions légales sont réunies.",
    },
    "tax-deduction": {
      title: "Déduction fiscale des dons (article 10 du Code Général des Impôts)",
      keywords: ["déduction", "fiscale", "impôts", "article", "10", "code", "réduction", "don", "revenu"],
      answer:
        "L'article 10 du Code Général des Impôts marocain permet, dans les conditions et aux taux qu'il définit, la déduction des dons et libéralités en numéraire ou en nature accordés à certaines entités et institutions, de l'assiette fiscale des donateurs (personnes physiques et morales), notamment les établissements et associations porteurs de la qualité d'utilité publique ou reconnus comme étant d'utilité publique. Pour vérifier les conditions actualisées, les listes concernées et les taux en vigueur, il convient de se référer au texte en vigueur via le portail de la Direction Générale des Impôts ou de contacter le service fiscal compétent. Il est conseillé aux donateurs de conserver le reçu de don.",
    },
    "tax-association-status": {
      title: "Le régime fiscal des associations",
      keywords: ["fiscal", "statut", "exonération", "impôt", "valeur ajoutée", "quasi commercial", "opérations"],
      answer:
        "Les associations reconnues d'utilité publique bénéficient d'un régime fiscal particulier : leurs revenus directement liés à l'exercice de leur activité d'utilité publique sont exonérés, tandis que les opérations à caractère commercial, industriel, financier ou immobilier (exercées de manière quasi commerciale) sont soumises aux impôts en vigueur. Pour toute indication sur les cas particuliers (factures, taxe sur la valeur ajoutée lors de l'acquisition de biens...), veuillez vous adresser à la Direction Générale des Impôts.",
    },
    "digital-ice": {
      title: "L'Identifiant Unique de l'Entreprise (ICE) pour les associations",
      keywords: ["ICE", "identifiant", "unique", "numéro", "identification", "entreprise", "obtention", "attestation"],
      answer:
        "L'Identifiant Unique de l'Entreprise (ICE) est un numéro d'identification unique attribué aux entreprises et aux organismes — dont les associations — auprès des administrations marocaines ; il facilite leurs transactions avec les secteurs public et privé (marchés publics, factures, déclarations...). L'ICE est demandé gratuitement via le portail ICE relevant de la Direction Générale des Impôts, en remplissant un formulaire et en soumettant le dossier de l'association (statuts, récépissé, procès-verbal du bureau...). Sur la plateforme MAMP, le champ ICE fait partie de la carte d'identité numérique de l'association.",
    },
    "digital-identity": {
      title: "L'identité numérique de l'association marocaine (MAMP)",
      keywords: ["identité", "numérique", "carte", "identification", "association", "dossier", "numérisation", "vérification"],
      answer:
        "La plateforme MAMP attribue à chaque association vérifiée une « carte d'identité numérique » regroupant ses données officielles : nom et sigle, siège, numéro du récépissé ou référence juridique, qualité d'utilité publique le cas échéant, numéro ICE, identifiant fiscal, compte bancaire et membres du bureau actuel. Cette carte peut être partagée avec les partenaires et les bailleurs, et aide les entités gouvernementales et privées à vérifier électroniquement l'identité de l'association via la version publique de son dossier.",
    },
    "digital-egov": {
      title: "Administrations numériques et services publics marocains",
      keywords: ["administrations", "numériques", "services", "publics", "portail", "gouvernemental", "État"],
      answer:
        "Les principaux portails officiels de l'État marocain utiles au travail associatif :\n• maroc.ma — le portail officiel du Royaume et de ses services numériques.\n• sgg.gov.ma — le Secrétariat Général du Gouvernement : textes législatifs, Bulletin Officiel et page dédiée aux associations.\n• interieur.gov.ma — le Ministère de l'Intérieur (administration territoriale destinataire des déclarations).\n• tax.gov.ma — la Direction Générale des Impôts.\n• ice.gov.ma — le portail de l'Identifiant Unique de l'Entreprise.\n• cnss.ma — la Caisse Nationale de Sécurité Sociale (déclaration des salariés).\n• cndp.ma — la Commission Nationale de protection des données personnelles.\n• asd.ma — le portail de l'Aide Sociale Directe.\nTous ces portails ont été vérifiés et sont régulièrement mis à jour dans la base de connaissances de la plateforme.",
    },
    "digital-cnss": {
      title: "Déclaration des salariés de l'association auprès de la CNSS",
      keywords: ["CNSS", "salariés", "employés", "sécurité", "sociale", "déclaration", "cotisation"],
      answer:
        "L'association employant des salariés (employés, animateurs rémunérés...) est tenue de les déclarer auprès de la Caisse Nationale de Sécurité Sociale et de payer les cotisations mensuelles, conformément à la législation en vigueur. Ces procédures peuvent être accomplies électroniquement via les services numériques de la CNSS (déclaration des salariés, paiement des cotisations, obtention d'attestations). Le champ du numéro d'affiliation à la CNSS est disponible dans la carte numérique de l'association dans MAMP.",
    },
    "platform-what": {
      title: "Qu'est-ce que la plateforme MAMP ?",
      keywords: ["MAMP", "mamp", "plateforme", "définition", "site", "services", "présentation"],
      answer:
        "MAMP (Moroccan Associations Management Platform) est une plateforme numérique marocaine de gestion et d'administration des associations : adhésions, comptabilité, dons et reçus, événements, documents officiels et rapports, avec un assistant associatif intelligent guidant les utilisateurs. La plateforme est multi-associations (chaque association dispose d'un espace indépendant) et sert cinq catégories : le propriétaire de la plateforme (super administrateur), l'administrateur d'association (membres du bureau), les co-administrateurs (adhérents et bénévoles), les entités gouvernementales et privées compétentes, ainsi que les citoyens et les étrangers.",
    },
    "platform-roles": {
      title: "Rôles et permissions dans la plateforme MAMP",
      keywords: ["rôles", "permissions", "admin", "super administrateur", "co-administrateur", "partenaire", "citoyen"],
      answer:
        "La plateforme repose sur des permissions fines à deux niveaux :\n• Le propriétaire de la plateforme (super administrateur) : vérification des associations, suspension, supervision générale, journal d'audit.\n• L'administrateur d'association : les membres du bureau (président, son vice-président, le secrétaire général, le trésorier) — gestion complète : membres, comptabilité, documents, événements, rapports. Les opérations financières sont conditionnées par le trésorier et le président.\n• Les co-administrateurs : adhérents et bénévoles disposant de permissions spécifiques accordées par le bureau (organisation d'événements, réception des inscriptions...).\n• Les entités gouvernementales et privées : comptes partenaires vérifiés permettant la consultation des données déclarées des associations concernées.\n• Les citoyens et les étrangers : comptes gratuits pour la navigation, les dons et l'inscription aux événements publics.",
    },
    "platform-register-association": {
      title: "Enregistrer votre association sur la plateforme",
      keywords: ["enregistrement", "association", "ajouter", "créer", "page", "demande", "vérification", "nouvelle"],
      answer:
        "Pour enregistrer votre association sur la plateforme MAMP :\n1. Créez un compte au nom d'un des membres du bureau de l'association.\n2. Depuis le tableau de bord, choisissez « Enregistrer une association » et remplissez la fiche : nom, domaine, ville et région, description et objectifs, date de création, données officielles (numéro du récépissé, ICE le cas échéant...).\n3. Le dossier reste « en attente de validation » jusqu'à son examen et sa vérification par l'équipe de la plateforme.\n4. Après vérification, tous les modules s'ouvrent : membres, comptabilité, dons, événements, documents.\n\nLa vérification protège la réputation des associations et préserve la fiabilité de l'annuaire public.",
    },
    "platform-security": {
      title: "Sécurité et protection des données dans la plateforme",
      keywords: ["sécurité", "protection", "données", "chiffrement", "mot de passe", "confidentialité", "audit"],
      answer:
        "La plateforme MAMP applique des normes de sécurité strictes : les mots de passe sont chiffrés (scrypt) et ne sont jamais stockés en clair ; les sessions sont signées numériquement via des jetons JWT dans un cookie httpOnly ; les permissions sont contrôlées à chaque requête côté serveur (et non uniquement dans l'interface) ; et un journal d'audit documente toutes les opérations sensibles (qui a fait quoi, et quand). Le traitement des données personnelles des adhérents s'effectue avec leur consentement explicite conformément à la loi 09.08, avec la possibilité de demander la rectification ou la suppression.",
    },
    "platform-donate": {
      title: "Faire un don à une association via la plateforme",
      keywords: ["don", "soutien", "contribution", "paiement", "verser", "argent", "financement"],
      answer:
        "Pour faire un don à une association vérifiée sur la plateforme : accédez à la page de l'association depuis l'annuaire, appuyez sur « Faire un don », puis renseignez le nom (ou choisissez de faire un don anonyme) et le montant ou la description du don en nature. L'association enregistre le don et reçoit un reçu numéroté apparaissant dans le registre des dons. Les dons en nature sont documentés avec une description précise et une évaluation. Remarque : les opérations de collecte publique de dons auprès du public exigent une autorisation préalable conformément à la loi — et les aides étrangères doivent être déclarées.",
    },
    "platform-events": {
      title: "Événements et inscriptions",
      keywords: ["événements", "activités", "inscription", "atelier", "session", "rencontre", "manifestation", "participation"],
      answer:
        "Les associations organisent leurs événements (sessions, rencontres, caravanes, ateliers...) sur la plateforme et fixent le nombre de places, le lieu et la date. Les événements publics apparaissent sur la page d'accueil et les citoyens peuvent s'y inscrire directement avec leur compte ou via un formulaire rapide. L'association suit les inscriptions et valide les présences depuis son tableau de bord.",
    },
    "platform-documents": {
      title: "Gestion des documents officiels",
      keywords: ["documents", "dossiers", "procès-verbaux", "rapports", "statuts", "archives", "conservation"],
      answer:
        "Le module des documents conserve l'archive officielle de l'association de manière classée : les statuts et leurs versions actualisées, les procès-verbaux des assemblées générales et du bureau, les rapports moraux et financiers annuels, les récépissés et les conventions de partenariat. La sensibilité de chaque document est définie (public/interne) et les documents sont conservés avec des numéros de version (versioning) pour suivre les modifications — ce qui facilite la préparation du dossier de déclaration annuelle et la collecte des documents exigés par les partenaires.",
    },
    "platform-assistant": {
      title: "L'Assistant Associatif — comment l'utiliser ?",
      keywords: ["assistant", "chat", "bot", "intelligent", "discussion", "questions", "guidage", "utilisation"],
      answer:
        "Je suis « l'Assistant Associatif », votre compagnon sur la plateforme. Je réponds à propos de : les lois et procédures officielles (création, déclaration, utilité publique...), les usages pratiques de la plateforme (adhésion, comptabilité, dons...) et l'orientation vers les portails officiels vérifiés. Je fonctionne avec une base de connaissances revue et des sources officielles uniquement : je n'invente ni liens ni informations non vérifiées. Si je ne connais pas la réponse, je le dis franchement et vous oriente vers la source officielle compétente. Posez votre question librement !",
    },
    "platform-support-youth": {
      title: "Le soutien public aux associations",
      keywords: ["soutien", "subvention", "aides", "État", "financier", "programmes", "partenariat", "public"],
      answer:
        "Plusieurs mécanismes de soutien aux associations existent : les subventions et aides publiques (ministères de tutelle, collectivités territoriales, agences de développement...) et les programmes de partenariat sectoriel. Ces opportunités sont généralement annoncées sur les sites des ministères et des autorités de tutelle — dont le Ministère de la Jeunesse, de la Culture et de la Communication, qui publie les textes encadrant la vie associative et les programmes de soutien, ainsi que le Ministère de l'Intérieur. À la réception de toute aide étrangère, celle-ci doit être déclarée conformément à la loi. La vérification de l'association dans MAMP facilite la préparation des dossiers de demande de soutien (carte d'identité numérique, rapports annuels, documents juridiques).",
    },
    "contact-official": {
      title: "Contacter les administrations concernées par les associations",
      keywords: ["contact", "communication", "administration", "entité", "responsable", "adresse", "bureau", "réclamation"],
      answer:
        "Les administrations essentielles concernées par le travail associatif : l'autorité administrative locale (caïdat/pachalik du siège de l'association) pour la réception des déclarations et des changements ; le Secrétariat Général du Gouvernement pour la publication au Bulletin Officiel, la qualité d'utilité publique et les procédures de collecte de dons ; la Direction Générale des Impôts pour les aspects fiscaux et l'ICE ; la CNDP pour les déclarations de traitement des données. Utilisez toujours les portails officiels vérifiés ci-dessus pour vos contacts, et conservez des copies de toute correspondance et de tout récépissé.",
    },
    "app-download": {
      title: "Application Android de la plateforme MAMP — téléchargement et installation",
      keywords: ["application", "Android", "APK", "apk", "télécharger", "téléchargement", "installation", "téléphone", "mobile", "version", "versions", "signature"],
      answer:
        "L'application de la plateforme MAMP dispose d'une version officielle pour Android, construite et signée automatiquement depuis le dépôt officiel. Pour la télécharger : visitez la page de l'application sur la plateforme puis appuyez sur « Télécharger le fichier APK », ou scannez le code QR présent sur la même page. Après le téléchargement : 1) ouvrez le fichier depuis les notifications ou le dossier de téléchargements. 2) activez « Autoriser depuis cette source » lorsqu'Android le demande (message standard pour toute application hors boutique). 3) appuyez sur « Installer » puis ouvrez l'application. L'application est signée numériquement avec le certificat CN=TARIK CHOUIKA d'une validité de 30 ans, et l'empreinte du certificat est publiée dans les notes de chaque version — tout fichier ne portant pas cette signature n'est pas une version officielle. Configuration requise : Android 7.0 ou version plus récente avec connexion Internet. Le lien permanent de téléchargement dirige toujours vers la dernière version.",
    },
  },

  links: {
    maroc: "Portail officiel du Royaume du Maroc",
    sgg: "Secrétariat Général du Gouvernement",
    sggAssociations: "Page des associations — Secrétariat Général du Gouvernement",
    cndp: "Commission Nationale de contrôle de la protection des Données à caractère Personnel",
    ice: "Portail de l'Identifiant Unique de l'Entreprise (ICE)",
    tax: "Direction Générale des Impôts",
    cnss: "Caisse Nationale de Sécurité Sociale",
    asd: "Portail de l'Aide Sociale Directe",
    interieur: "Ministère de l'Intérieur",
    mcrpsc: "Ministère de la Jeunesse, de la Culture et de la Communication",
    mamp: "Plateforme MAMP — Gestion des associations marocaines",
    mampApp: "Application Android officielle de la plateforme MAMP",
    mampApk: "Télécharger l'application Android MAMP (dernière version signée)",
    mampReleases: "Versions de l'application MAMP — dépôt officiel",
  },

  categories: {
    "التشريع": "Législation",
    "التأسيس": "Création",
    "الانخراط": "Adhésion",
    "المحاسبة": "Comptabilité",
    "التبرعات": "Dons",
    "الضرائب": "Fiscalité",
    "الهوية الرقمية": "Identité numérique",
    "البوابات الرسمية": "Portails officiels",
    "حماية المعطيات": "Protection des données",
    "المنصة": "Plateforme",
  },
};
