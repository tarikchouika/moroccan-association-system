import type { LegalDocs } from "./types";

/**
 * Documenti legali in italiano — Termini di utilizzo, Informativa sulla privacy,
 * Politica sui cookie. Traduzione fedele del testo arabo di riferimento;
 * riferimenti normativi, token tecnici e date restano invariati.
 */
export const itLegalDocs: LegalDocs = {
  terms: {
    title: "Termini di utilizzo della piattaforma",
    subtitle:
      "I presenti termini disciplinano l'utilizzo della piattaforma MAMP e di tutti i suoi servizi e pagine, compresa la versione pubblica pubblicata e l'app Android ufficiale. Utilizzando la piattaforma, voi li riconoscete e li accettate integralmente.",
    updated: "1º novembre 2026",
    sections: [
      {
        heading: "Definizione del servizio",
        paragraphs: [
          "La piattaforma MAMP è una piattaforma digitale marocchina per la gestione e l'amministrazione delle associazioni: adesioni, contabilità, donazioni, eventi e documenti ufficiali, con l'«Assistente Associativo» — un assistente intelligente che risponde da una base di conoscenza ufficiale verificata.",
          "La piattaforma opera in due versioni: una versione pubblica per la consultazione, l'esplorazione, le donazioni e l'iscrizione agli eventi, e una versione amministrativa completa (pannello di controllo) dedicata ai membri aderenti delle associazioni, in funzione sull'infrastruttura locale della piattaforma.",
        ],
      },
      {
        heading: "Account e responsabilità",
        paragraphs: [
          "La creazione dell'account avviene con informazioni corrette e accurate, e l'utente è responsabile della riservatezza della propria password e di ogni attività svolta tramite il proprio account.",
          "Le autorizzazioni di ciascun utente sono definite in base al ruolo ricoperto: amministratore generale della piattaforma, admin di associazione, co-admin (aderente/volontario), ente partner o cittadino. Nessun utente può tentare di accedere a quanto si trova al di fuori dell'ambito delle proprie autorizzazioni o di violare la riservatezza delle altre associazioni.",
        ],
      },
      {
        heading: "Uso lecito",
        paragraphs: ["È vietato utilizzare la piattaforma per qualsiasi scopo illecito, in particolare:"],
        bullets: [
          "Inserire dati falsi o fuorvianti su un'associazione, una persona, una donazione o un'operazione finanziaria.",
          "Spacciarsi per qualsiasi persona o ente, o utilizzare senza diritto distintivi e autorizzazioni.",
          "Sfruttare l'«Assistente Associativo» o qualsiasi servizio per tentare di estrarre informazioni o eludere le misure di sicurezza.",
          "Usare impropriamente il servizio in modo dannoso per l'infrastruttura o per gli altri utenti.",
        ],
      },
      {
        heading: "Donazioni e transazioni finanziarie",
        paragraphs: [
          "La piattaforma MAMP è unicamente un intermediario digitale di documentazione e gestione: non è un ente di incasso né un intermediario finanziario, e non detiene né trasferisce fondi. Ogni donazione o pagamento avviene direttamente tra il donatore e l'associazione interessata tramite i mezzi da essa ufficialmente dichiarati.",
          "La responsabilità della liceità della raccolta di donazioni (l'autorizzazione preventiva prevista dalla normativa vigente), della loro distribuzione e della loro documentazione incombe esclusivamente sull'associazione.",
        ],
      },
      {
        heading: "L'Assistente Associativo e i limiti dell'informazione",
        paragraphs: [
          "L'assistente opera con una base di conoscenza ufficiale revisionata, con un filtraggio rigoroso che impedisce la visualizzazione di qualsiasi link non verificato. Ciononostante, le sue risposte restano di carattere indicativo generale e non costituiscono una consulenza legale o contabile in sostituzione degli specialisti e dei testi ufficiali.",
        ],
      },
      {
        heading: "Proprietà intellettuale",
        paragraphs: [
          "Tutti gli elementi della piattaforma (design, logo, codici, base di conoscenza, identità visiva) sono di proprietà del titolare TARIK CHOUIKA e non possono essere copiati o riutilizzati commercialmente senza previa autorizzazione scritta.",
          "L'app Android ufficiale è firmata digitalmente con il certificato CN=TARIK CHOUIKA, e qualsiasi copia non firmata con questo certificato non è considerata una versione ufficiale.",
        ],
      },
      {
        heading: "Limiti di responsabilità",
        paragraphs: [
          "Il servizio è fornito «così come è» senza garanzie esplicite o implicite di continuità o di esenzione da errori. La piattaforma non è responsabile di alcun danno diretto o indiretto derivante dall'utilizzo del servizio o dall'imprecisione di informazioni inserite dagli stessi utenti.",
        ],
      },
      {
        heading: "Legge applicabile e risoluzione delle controversie",
        paragraphs: [
          "I presenti termini sono assoggettati al diritto marocchino, in particolare al dahir n. 1.58.376 come modificato dalla legge 75.00 e dalla legge 09.08 relativa alla protezione dei dati a carattere personale.",
          "In caso di controversia, si prega di contattarci innanzitutto per una soluzione amichevole; qualora ciò non fosse possibile, la questione sarà deferita ai tribunali competenti del Regno del Marocco.",
        ],
      },
      {
        heading: "Modifica dei termini",
        paragraphs: [
          "Il proprietario della piattaforma ha il diritto di aggiornare i presenti termini quando necessario, e ogni modifica sostanziale sarà annunciata tramite la piattaforma. Il vostro uso continuato del servizio dopo la pubblicazione dell'aggiornamento costituisce accettazione della nuova versione.",
        ],
      },
    ],
  },

  privacy: {
    title: "Informativa sulla privacy e protezione dei dati",
    subtitle:
      "Sulla piattaforma MAMP ci impegniamo a proteggere i vostri dati personali conformemente alla legge n. 09.08 relativa alla protezione delle persone fisiche rispetto al trattamento dei dati a carattere personale, e alle direttive della Commissione nazionale per il controllo della protezione dei dati a carattere personale (CNDP).",
    updated: "1º novembre 2026",
    sections: [
      {
        heading: "Titolare del trattamento",
        paragraphs: [
          "Il titolare del trattamento dei dati personali sulla piattaforma MAMP è il proprietario della piattaforma TARIK CHOUIKA. Per qualsiasi domanda o richiesta relativa ai vostri dati personali, potete contattarci tramite i canali di comunicazione dichiarati sulla piattaforma.",
        ],
      },
      {
        heading: "I dati che raccogliamo",
        paragraphs: ["Operiamo con il minimo indispensabile di dati:"],
        bullets: [
          "Dati dell'account: nome completo, indirizzo e-mail, password crittografata, telefono (facoltativo).",
          "Dati di adesione: numero di tessera, tipo di adesione, professione (facoltativa), data di adesione.",
          "Dati di gestione finanziaria delle associazioni: le operazioni e i documenti contabili inseriti personalmente dai tesorieri.",
          "Identificativo nazionale (numero della carta d'identità): del tutto facoltativo, richiesto solo quando necessario e con consenso esplicito.",
        ],
      },
      {
        heading: "Base giuridica del trattamento",
        paragraphs: [
          "La base è il vostro consenso esplicito e preventivo alla creazione dell'account o all'adesione; il consenso è registrato con data e ora all'interno della piattaforma in conformità alla legge 09.08.",
          "I dati di gestione finanziaria delle associazioni sono trattati anche in adempimento degli obblighi contabili e legali che gravano sulle associazioni.",
        ],
      },
      {
        heading: "Durata di conservazione",
        paragraphs: [
          "I dati sono conservati per tutta la durata dell'account o dell'adesione attiva, quindi cancellati o anonimizzati al termine del rapporto secondo le durate di conservazione vigenti, nel rispetto degli obblighi legali di archiviazione.",
        ],
      },
      {
        heading: "I vostri diritti e come esercitarli",
        paragraphs: ["La legge 09.08 vi garantisce i seguenti diritti:"],
        bullets: [
          "Diritto di accesso ai vostri dati e di verifica degli stessi.",
          "Diritto di rettifica dei dati inesatti o di aggiornamento degli stessi.",
          "Diritto di opposizione al trattamento per motivi legittimi.",
          "Diritto di revoca del consenso (con la conseguente chiusura dell'account).",
        ],
      },
      {
        heading: "La Commissione nazionale CNDP",
        paragraphs: [
          "Avete il diritto di presentare un reclamo alla Commissione nazionale per il controllo della protezione dei dati a carattere personale se ritenete che i vostri diritti alla protezione dei vostri dati personali siano stati violati. Il portale ufficiale della Commissione è indicato nella pagina «Riferimento giuridico» e nella base di conoscenza dell'Assistente Associativo.",
        ],
      },
      {
        heading: "Sicurezza dei dati",
        paragraphs: [
          "Adottiamo misure tecniche e organizzative ragionevoli per proteggere i dati: crittografia delle password con l'algoritmo scrypt, sessioni firmate all'interno di un cookie httpOnly, registro di controllo delle operazioni sensibili e autorizzazioni gerarchiche regolate per ogni ruolo.",
          "Non vendiamo, non affittiamo né scambiamo i vostri dati con terzi per finalità commerciali.",
        ],
      },
      {
        heading: "Cookie",
        paragraphs: [
          "Utilizziamo un solo cookie tecnico di sessione, senza alcun cookie di tracciamento o pubblicitario. I dettagli completi sono disponibili nella politica sui cookie.",
        ],
      },
      {
        heading: "Modifiche all'informativa",
        paragraphs: [
          "Potremmo aggiornare questa informativa in caso di evoluzione dei servizi o per conformarci alla legge. Ogni modifica sostanziale sarà annunciata tramite la piattaforma prima della sua entrata in vigore.",
        ],
      },
    ],
  },

  cookies: {
    title: "Politica sui cookie",
    subtitle:
      "Piena trasparenza: la piattaforma MAMP non utilizza alcun cookie di tracciamento né pubblicitario — un solo cookie tecnico per mantenere aperta in sicurezza la vostra sessione.",
    updated: "1º novembre 2026",
    sections: [
      {
        heading: "Che cosa sono i cookie?",
        paragraphs: [
          "I cookie sono piccoli dati testuali che il sito memorizza sul vostro browser per ricordare informazioni necessarie al funzionamento del servizio. In Marocco il loro trattamento è assoggettato alla legge 09.08.",
        ],
      },
      {
        heading: "Che cosa utilizza la piattaforma?",
        paragraphs: [
          "Un solo cookie denominato mamp_session: un cookie tecnico di sicurezza che trasporta un identificativo di sessione firmato digitalmente, che vi permette di rimanere collegati all'interno del pannello di controllo.",
        ],
        bullets: [
          "Tipo: tecnicamente indispensabile (Strictly Necessary) — non può essere disattivato lasciando funzionante il servizio di accesso.",
          "Durata: una settimana dall'ultimo accesso, dopodiché scade automaticamente.",
          "Caratteristiche di sicurezza: httpOnly (non leggibile dagli script della pagina), Secure in produzione e SameSite=Lax.",
        ],
      },
      {
        heading: "Che cosa non utilizza la piattaforma?",
        bullets: [
          "Nessun cookie di tracciamento né di analisi commerciale.",
          "Nessun cookie pubblicitario né pixel tag di terze parti.",
          "Nessuna condivisione del comportamento di navigazione con alcun ente esterno.",
        ],
      },
      {
        heading: "Disattivazione dei cookie e relative conseguenze",
        paragraphs: [
          "Potete bloccare i cookie dalle impostazioni del vostro browser. In tal caso tutte le pagine pubbliche, l'Assistente Associativo e l'elenco delle associazioni restano accessibili, ma l'accesso al pannello di controllo non funzionerà perché non è possibile mantenere la sessione.",
        ],
      },
      {
        heading: "Contatti",
        paragraphs: [
          "Per qualsiasi domanda su questa politica o sul trattamento dei vostri dati, consultate l'informativa sulla privacy o contattateci tramite i canali dichiarati sulla piattaforma.",
        ],
      },
    ],
  },
};
