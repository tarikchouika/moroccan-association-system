import type { LegalDocs } from "./types";

/**
 * Documents juridiques en français — traduction professionnelle (FR-MA)
 * en miroir exact de la source arabe de référence.
 */
export const frLegalDocs: LegalDocs = {
  terms: {
    title: "Conditions d'utilisation de la plateforme",
    subtitle:
      "Les présentes conditions régissent l'utilisation de la plateforme MAMP et l'ensemble de ses services et pages, y compris la version publique publiée et l'application Android officielle. En utilisant la plateforme, vous reconnaissez ces conditions et les acceptez intégralement.",
    updated: "1er novembre 2026",
    sections: [
      {
        heading: "Définition du service",
        paragraphs: [
          "La plateforme MAMP est une plateforme numérique marocaine de gestion et d'administration des associations : adhésions, comptabilité, dons, événements et documents officiels, avec « l'Assistant Associatif » — un assistant intelligent répondant à partir d'une base de connaissances officielle vérifiée.",
          "La plateforme fonctionne en deux versions : une version publique pour la navigation, la consultation, les dons et l'inscription aux événements, et une version administrative complète (tableau de bord) réservée aux membres adhérents des associations, fonctionnant sur l'infrastructure locale de la plateforme.",
        ],
      },
      {
        heading: "Comptes et responsabilités",
        paragraphs: [
          "La création du compte s'effectue avec des informations exactes et précises ; l'utilisateur est responsable de la confidentialité de son mot de passe et de toute activité menée via son compte.",
          "Les permissions de chaque utilisateur sont définies selon son rôle : administrateur général de la plateforme, administrateur d'association, co-administrateur (adhérent/bénévole), entité partenaire ou citoyen. Nul utilisateur ne peut tenter d'accéder au-delà du périmètre de ses permissions ni de porter atteinte à la vie privée des autres associations.",
        ],
      },
      {
        heading: "Usage acceptable",
        paragraphs: ["Il est interdit d'utiliser la plateforme à toute fin illicite, en particulier :"],
        bullets: [
          "Saisir des données fausses ou trompeuses sur une association, une personne, un don ou une opération financière.",
          "Usurper l'identité de toute personne ou entité, ou utiliser des badges et des permissions sans droit.",
          "Exploiter « l'Assistant Associatif » ou tout autre service pour tenter d'extraire des informations ou de contourner les mesures de sécurité.",
          "Faire un mauvais usage du service d'une manière portant atteinte à l'infrastructure ou aux autres utilisateurs.",
        ],
      },
      {
        heading: "Dons et transactions financières",
        paragraphs: [
          "La plateforme MAMP est uniquement un intermédiaire numérique de documentation et de gestion : elle n'est ni organisme de recouvrement ni intermédiaire financier ; elle ne détient ni ne transfère de fonds. Tout don ou paiement s'effectue directement entre le donateur et l'association concernée, via ses moyens officiellement annoncés.",
          "La responsabilité quant à la licéité de la collecte des dons (l'autorisation préalable prévue par la réglementation en vigueur), à leur distribution et à leur justification incombe à la seule association.",
        ],
      },
      {
        heading: "L'Assistant Associatif et les limites de l'information",
        paragraphs: [
          "L'assistant fonctionne avec une base de connaissances officielle revue, accompagnée d'un filtrage strict empêchant l'affichage de tout lien non vérifié. Ses réponses demeurent toutefois indicatives et générales, et ne constituent pas un avis juridique ou comptable remplaçant les spécialistes et les textes officiels.",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        paragraphs: [
          "Tous les éléments de la plateforme (conception, logo, codes, base de connaissances, identité visuelle) sont la propriété de leur titulaire TARIK CHOUIKA ; ils ne peuvent être copiés ni réutilisés commercialement sans autorisation écrite préalable.",
          "L'application Android officielle est signée numériquement avec le certificat CN=TARIK CHOUIKA ; toute copie non signée avec ce certificat n'est pas considérée comme une version officielle.",
        ],
      },
      {
        heading: "Limites de responsabilité",
        paragraphs: [
          "Le service est fourni « en l'état », sans garanties expresses ou implicites de continuité ou d'absence d'erreurs. La plateforme n'assume aucune responsabilité pour tout dommage direct ou indirect résultant de l'utilisation du service ou de l'imprécision d'informations saisies par les utilisateurs eux-mêmes.",
        ],
      },
      {
        heading: "Droit applicable et règlement des litiges",
        paragraphs: [
          "Les présentes conditions sont soumises au droit marocain, notamment au Dahir n° 1.58.376 tel que modifié par la loi 75.00 et à la loi 09.08 relative à la protection des données à caractère personnel.",
          "En cas de litige, il est demandé de nous contacter d'abord pour une résolution à l'amiable ; à défaut, l'affaire est portée devant les juridictions compétentes du Royaume du Maroc.",
        ],
      },
      {
        heading: "Modification des conditions",
        paragraphs: [
          "Le propriétaire de la plateforme est en droit de mettre à jour ces conditions en cas de besoin ; toute modification substantielle est annoncée via la plateforme. Votre poursuite de l'utilisation du service après la publication de la mise à jour vaut acceptation de la nouvelle version.",
        ],
      },
    ],
  },

  privacy: {
    title: "Politique de confidentialité et de protection des données",
    subtitle:
      "À la plateforme MAMP, nous nous engageons à protéger vos données personnelles conformément à la loi n° 09.08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, et aux orientations de la Commission Nationale de contrôle de la protection des données à caractère personnel (CNDP).",
    updated: "1er novembre 2026",
    sections: [
      {
        heading: "Responsable du traitement",
        paragraphs: [
          "Le responsable du traitement des données personnelles sur la plateforme MAMP est le propriétaire de la plateforme, TARIK CHOUIKA. Pour toute question ou demande relative à vos données personnelles, vous pouvez nous contacter via les canaux de communication annoncés sur la plateforme.",
        ],
      },
      {
        heading: "Les données que nous collectons",
        paragraphs: ["Nous travaillons avec le minimum de données nécessaire :"],
        bullets: [
          "Données du compte : nom complet, adresse e-mail, mot de passe chiffré, téléphone (facultatif).",
          "Données d'adhésion : numéro d'adhérent, type d'adhésion, profession (facultatif), date d'adhésion.",
          "Données de gestion financière des associations : opérations et documents comptables saisis par les trésoriers eux-mêmes.",
          "Identifiant national (numéro de la carte) : entièrement facultatif, demandé uniquement en cas de besoin et avec consentement explicite.",
        ],
      },
      {
        heading: "Base légale du traitement",
        paragraphs: [
          "La base est votre consentement explicite préalable lors de la création du compte ou de l'adhésion ; le consentement est enregistré avec sa date et son heure dans la plateforme, en conformité avec la loi 09.08.",
          "Les données de gestion financière des associations sont également traitées en exécution des obligations comptables et légales pesant sur les associations.",
        ],
      },
      {
        heading: "Durée de conservation",
        paragraphs: [
          "Les données sont conservées pendant la durée du compte ou de l'adhésion active, puis supprimées ou anonymisées après la fin de la relation, selon les durées de conservation en vigueur, dans le respect des obligations légales d'archivage.",
        ],
      },
      {
        heading: "Vos droits et leur exercice",
        paragraphs: ["La loi 09.08 vous garantit les droits suivants :"],
        bullets: [
          "Droit d'accéder à vos données et de les vérifier.",
          "Droit de rectifier les données inexactes ou de les mettre à jour.",
          "Droit de s'opposer au traitement pour des motifs légitimes.",
          "Droit de retirer votre consentement (avec pour conséquence la clôture du compte).",
        ],
      },
      {
        heading: "La Commission Nationale CNDP",
        paragraphs: [
          "Vous avez le droit de déposer une réclamation auprès de la Commission Nationale de contrôle de la protection des données à caractère personnel si vous estimez que vos droits relatifs à la protection de vos données personnelles ont été violés. Le portail officiel de la Commission est annoncé sur la page « Référence juridique » et dans la base de connaissances de l'Assistant Associatif.",
        ],
      },
      {
        heading: "Sécurité des données",
        paragraphs: [
          "Nous prenons des mesures techniques et organisationnelles raisonnables pour protéger les données : chiffrement des mots de passe avec l'algorithme scrypt, sessions signées dans un cookie httpOnly, journal d'audit des opérations sensibles et permissions hiérarchiques maîtrisées pour chaque rôle.",
          "Nous ne vendons, ne louons ni n'échangeons vos données avec un tiers à des fins commerciales.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "Nous utilisons un seul cookie technique de session, sans aucun cookie de suivi ou publicitaire. Les détails complets figurent dans la politique relative aux cookies.",
        ],
      },
      {
        heading: "Modifications de la politique",
        paragraphs: [
          "Nous sommes susceptibles de mettre à jour cette politique au fil de l'évolution des services ou pour nous conformer à la loi. Toute modification substantielle sera annoncée via la plateforme avant son entrée en vigueur.",
        ],
      },
    ],
  },

  cookies: {
    title: "Politique relative aux cookies",
    subtitle:
      "Transparence totale : la plateforme MAMP n'utilise aucun cookie de suivi ni publicitaire — un seul cookie technique pour maintenir votre session ouverte en toute sécurité.",
    updated: "1er novembre 2026",
    sections: [
      {
        heading: "Que sont les cookies ?",
        paragraphs: [
          "Les cookies sont de petites données textuelles que le site stocke dans votre navigateur pour mémoriser des informations indispensables au fonctionnement du service. Leur traitement est soumis au Maroc à la loi 09.08.",
        ],
      },
      {
        heading: "Qu'est-ce que la plateforme utilise ?",
        paragraphs: [
          "Un seul cookie nommé mamp_session : un cookie technique de sécurité portant un identifiant de session signé numériquement, qui vous permet de rester connecté au tableau de bord.",
        ],
        bullets: [
          "Type : strictement nécessaire (Strictly Necessary) — il ne peut être désactivé tout en maintenant le service de connexion opérationnel.",
          "Durée : une semaine à compter de la dernière connexion, puis expiration automatique.",
          "Propriétés de sécurité : httpOnly (illisible par les scripts de la page), Secure en production et SameSite=Lax.",
        ],
      },
      {
        heading: "Qu'est-ce que la plateforme n'utilise pas ?",
        bullets: [
          "Aucun cookie de suivi ni d'analyse commerciale.",
          "Aucun cookie publicitaire ni balise pixel de tiers.",
          "Aucun partage du comportement de navigation avec une entité externe.",
        ],
      },
      {
        heading: "Désactivation des cookies et ses conséquences",
        paragraphs: [
          "Vous pouvez bloquer les cookies depuis les paramètres de votre navigateur. Dans ce cas, toutes les pages publiques, l'Assistant Associatif et l'annuaire des associations restent accessibles, mais la connexion au tableau de bord ne fonctionnera pas, car la session ne peut être maintenue.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          "Pour toute question sur cette politique ou sur le traitement de vos données, consultez la politique de confidentialité ou contactez-nous via les canaux annoncés sur la plateforme.",
        ],
      },
    ],
  },
};
