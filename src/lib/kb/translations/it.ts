import type { KBTranslationSet } from "./types";

/**
 * Traduzione italiana della base di conoscenza dell'Assistente Associativo.
 * Le chiavi degli ingressi, dei link e delle categorie restano identiche a data.ts;
 * solo i valori (titolo, parole chiave, risposta) sono tradotti.
 */
export const itKB: KBTranslationSet = {
  entries: {
    "law-dahir-1958": {
      title: "Il dahir che disciplina il diritto di fondare associazioni (1958)",
      keywords: ["dahir", "1958", "legge", "associazioni", "diritto", "fondazione", "1.58.376", "riferimento", "giuridico", "Marocco"],
      answer:
        "Il riferimento fondativo dell'attività associativa in Marocco è il dahir n. 1.58.376 emanato il 3 Jumada al-Ula 1378 (15 novembre 1958), che disciplina il diritto di fondare associazioni, così come modificato e integrato. Questo dahir è stato pubblicato nel Bollettino Ufficiale n. 2404 bis in data 27 novembre 1958 e definisce le regole generali di fondazione, gestione e scioglimento delle associazioni. Il sistema marocchino si distingue per il suo carattere dichiarativo: la fondazione di un'associazione è libera e non richiede autorizzazione preventiva, con l'obbligo di dichiararla presso l'autorità amministrativa locale.",
    },
    "law-75-00": {
      title: "La legge 75.00 che modifica e integra il dahir sulle associazioni (2002)",
      keywords: ["75.00", "75", "legge", "modifica", "integrazione", "2002", "1.02.206", "dahir", "emendamento"],
      answer:
        "La legge n. 75.00 relativa alle associazioni è stata resa esecutiva in virtù del dahir n. 1.02.206 in data 12 Jumada al-Ula 1423 (23 luglio 2002); essa modifica e integra il dahir del 15 novembre 1958. Tra le sue principali novità: la chiarificazione della procedura di dichiarazione e di rilascio della ricevuta, la disciplina dei rapporti delle associazioni con le autorità e il rafforzamento della trasparenza finanziaria. Potete consultare i testi ufficiali tramite la pagina delle associazioni sul portale del Segretariato Generale del Governo.",
    },
    "law-07-09": {
      title: "La legge 07.09 che modifica l'articolo 5 del dahir sulle associazioni",
      keywords: ["07.09", "articolo", "quinto", "dichiarazione", "modifica", "ricevuta"],
      answer:
        "La legge n. 07.09 ha modificato l'articolo 5 del dahir del 15 novembre 1958 relativo al diritto di fondare associazioni, ovvero l'articolo che disciplina la procedura di dichiarazione dell'associazione presso l'autorità amministrativa locale e il rilascio della ricevuta. Il testo ufficiale è disponibile sulla pagina delle associazioni del Segretariato Generale del Governo.",
    },
    "law-constitution": {
      title: "Il fondamento costituzionale dell'attività associativa",
      keywords: ["Costituzione", "2011", "articolo", "12", "29", "società", "civile", "democrazia", "partecipativa"],
      answer:
        "La Costituzione del Regno del Marocco del 2011 consacra l'attività associativa: l'articolo 12 conferma il ruolo delle organizzazioni non governative nell'elaborazione, nell'attuazione e nella valutazione delle decisioni nell'ambito della democrazia partecipativa, e l'articolo 29 garantisce la libertà di riunione e di assemblea, di fondare associazioni e di aderirvi. Le autorità pubbliche si impegnano inoltre a agevolare la creazione di associazioni e a sostenerne l'operato.",
    },
    "law-data-09-08": {
      title: "La legge 09.08 sulla protezione dei dati a carattere personale (CNDP)",
      keywords: ["09.08", "dati", "personali", "protezione", "CNDP", "commissione", "dichiarazione", "privacy", "riservatezza"],
      answer:
        "La legge n. 09.08 relativa alla protezione delle persone fisiche rispetto al trattamento dei dati a carattere personale assoggetta le associazioni che trattano i dati dei propri membri (nome, numero della carta d'identità nazionale, telefono...) all'obbligo di dichiarazione presso la Commissione nazionale per il controllo della protezione dei dati a carattere personale (CNDP) o, a seconda dei casi, di richiesta di autorizzazione. La piattaforma MAMP integra un consenso esplicito (Consent) per ogni aderente ai sensi di questa legge e consente di registrare la data del consenso. Per maggiori informazioni e per la dichiarazione elettronica, visitate il sito della CNDP.",
    },
    "law-fundraising": {
      title: "La raccolta di donazioni dal pubblico (autorizzazione preventiva)",
      keywords: ["raccolta", "donazioni", "pubblico", "autorizzazione", "preventiva", "procedura", "convogli", "campagna", "permesso"],
      answer:
        "Le operazioni di raccolta di donazioni dal pubblico (porta a porta, convogli, campagne pubbliche...) a fini benefici sono assoggettate a un'autorizzazione preventiva ai sensi della legge relativa all'organizzazione delle operazioni di raccolta di donazioni dal pubblico e di distribuzione di aiuti a fini benefici, e del suo decreto applicativo. Le richieste sono depositate secondo le procedure ufficialmente annunciate, e la pagina delle associazioni del Segretariato Generale del Governo mette a disposizione la procedura e il modulo di richiesta dell'autorizzazione. Sulla piattaforma MAMP potete collegare ogni operazione di raccolta di donazioni al numero dell'autorizzazione per monitorare la conformità.",
    },
    "found-steps": {
      title: "I passaggi per fondare un'associazione in Marocco",
      keywords: ["fondazione", "passaggi", "creazione", "associazione", "procedura", "formalità", "come", "costituire", "Marocco"],
      answer:
        "La fondazione di un'associazione in Marocco avviene secondo un sistema dichiarativo in cinque passaggi principali:\n1. Tenuta dell'assemblea generale fondativa: vi partecipano i fondatori, che approvano lo statuto ed eleggono i membri dell'ufficio (presidente, segretario generale, tesoriere...).\n2. Preparazione del dossier: più copie dello statuto firmate dai fondatori, verbale dell'assemblea generale fondativa firmato, elenco dei membri fondatori con copie delle loro carte d'identità nazionali e delle schede informative, e il casellario giudiziario o altro documento che attesti l'identità.\n3. Deposito della dichiarazione: il dossier è presentato presso la sede dell'autorità amministrativa locale (caidato, pascialato o annesso amministrativo) da cui dipende la sede dell'associazione, direttamente o tramite un ufficiale giudiziario.\n4. Rilascio della ricevuta: viene consegnata seduta stante una ricevuta provvisoria timbrata e datata della dichiarazione (articolo 5 del dahir del 1958 come modificato).\n5. Pubblicazione nel Bollettino Ufficiale: viene richiesta al Segretariato Generale del Governo, o direttamente dall'associazione o tramite l'autorità locale, affinché l'associazione acquisisca la personalità giuridica.\n\nI documenti ufficiali e i moduli (modulo di dichiarazione di fondazione di un'associazione, disposizioni da includere negli statuti) sono disponibili sulla pagina delle associazioni del Segretariato Generale del Governo.",
    },
    "found-statutes": {
      title: "Le disposizioni da includere nello statuto",
      keywords: ["statuto", "atto", "costitutivo", "clausole", "disposizioni", "statuti", "redazione", "contenuto", "obbligatorie"],
      answer:
        "Lo statuto dell'associazione deve contenere il minimo di disposizioni fissate dal dahir del 1958, tra cui: la denominazione dell'associazione e le sue finalità, la sede sociale, le condizioni di adesione e la perdita della qualità di membro, l'importo della quota di adesione se previsto, gli organi di gestione e la definizione dei loro compiti (assemblea generale, ufficio...), le regole di voto e il quorum, e la procedura di modifica dello statuto, di scioglimento dell'associazione e di destinazione dei suoi beni. Il Segretariato Generale del Governo mette a disposizione un documento ufficiale dal titolo «Disposizioni da includere negli statuti delle associazioni», consultabile tramite la pagina delle associazioni.",
    },
    "found-receipt": {
      title: "La ricevuta provvisoria e la ricevuta definitiva della dichiarazione",
      keywords: ["ricevuta", "provvisoria", "definitiva", "deposito", "dichiarazione", "titolo", "documento", "consegna"],
      answer:
        "Al momento del deposito della dichiarazione di fondazione dell'associazione presso l'autorità amministrativa locale, viene rilasciata seduta stante una ricevuta provvisoria timbrata e datata (articolo 5 del dahir come modificato dalla legge 75.00 e dalla legge 07.09). Questa ricevuta costituisce la prova ufficiale della dichiarazione e l'associazione può utilizzarla in determinate procedure in attesa del rilascio della ricevuta definitiva. In caso di ritardo ingiustificato nel rilascio della ricevuta definitiva, l'associazione può seguire la questione con l'amministrazione competente o mediante ricorso dinanzi al tribunale amministrativo competente.",
    },
    "found-publication": {
      title: "La pubblicazione nel Bollettino Ufficiale",
      keywords: ["pubblicazione", "Bollettino", "Ufficiale", "bulletin", "officiel", "ufficializzazione", "personalità", "giuridica"],
      answer:
        "L'associazione non gode della personalità giuridica se non dopo la pubblicazione nel Bollettino Ufficiale della dichiarazione di fondazione. La richiesta viene inoltrata o direttamente dall'associazione al Segretariato Generale del Governo (direzione del Bollettino Ufficiale) o tramite l'autorità locale, previo pagamento delle tasse stabilite. Dopo la pubblicazione, l'associazione può aprire un conto bancario a proprio nome, stipulare contratti e stare in giudizio. Per consultare i numeri del Bollettino Ufficiale e i testi pubblicati, visitate il portale del Segretariato Generale del Governo.",
    },
    "found-public-utility": {
      title: "Il riconoscimento della qualifica di pubblica utilità",
      keywords: ["pubblica", "utilità", "qualifica", "riconoscimento", "utilité", "publique", "vantaggi", "requisiti"],
      answer:
        "La qualifica di pubblica utilità è conferita con decreto adottato su proposta del ministro dell'Interno previo parere di una commissione, e attribuisce all'associazione vantaggi tra cui la possibilità di ricevere elargizioni e lasciti e di percepire sovvenzioni, nonché garanzie aggiuntive in fase di riscossione. La procedura di deposito della richiesta di riconoscimento della qualifica di pubblica utilità e il relativo modulo sono disponibili ufficialmente sulla pagina delle associazioni del Segretariato Generale del Governo. Di norma è richiesta l'effettiva esercitazione di un'attività di pubblica utilità per un periodo sufficiente, conformemente al proprio statuto.",
    },
    "found-foreign-aid": {
      title: "La dichiarazione degli aiuti stranieri",
      keywords: ["aiuti", "stranieri", "estero", "finanziamento", "elargizioni", "dichiarazione", "ricezione", "obbligo"],
      answer:
        "Ogni associazione che riceve un aiuto finanziario o in natura da un ente straniero (Stato, organizzazione, associazione straniera...) deve dichiararlo secondo il modulo ufficiale «Dichiarazione di ricezione di un aiuto straniero da parte dell'associazione», disponibile sulla pagina delle associazioni del Segretariato Generale del Governo, conformemente alle disposizioni del dahir del 1958 come modificato e integrato. Sulla piattaforma MAMP, alla registrazione di una donazione proveniente da un ente straniero compare un avviso sull'obbligo di dichiarazione e un campo è dedicato al numero della dichiarazione.",
    },
    "found-annual-declaration": {
      title: "Le dichiarazioni annuali e le modifiche dell'ufficio",
      keywords: ["dichiarazione", "annuale", "modifiche", "membri", "ufficio", "aggiornamento", "autorità", "obbligo"],
      answer:
        "Ai sensi del dahir del 1958 come modificato dalla legge 75.00, le associazioni devono dichiarare all'autorità locale le modifiche che intervengono nella loro dirigenza o nei loro membri (cambio dell'ufficio, cambio della sede, modifica dello statuto) entro i termini di legge. È inoltre consigliabile — ed è richiesto in molti rapporti con i partner — redigere un rendiconto morale e finanziario annuale approvato dall'assemblea generale ordinaria. La piattaforma MAMP mette a disposizione una checklist pronta per la dichiarazione annuale all'interno del modulo «Documenti».",
    },
    "join-platform": {
      title: "Come aderire a un'associazione tramite la piattaforma MAMP",
      keywords: ["adesione", "iscrizione", "membro", "come", "aderire", "partecipare", "aderente", "MAMP"],
      answer:
        "Per aderire a un'associazione tramite la piattaforma MAMP:\n1. Create un account cittadino gratuito dalla pagina «Crea un account».\n2. Consultate l'elenco delle associazioni e utilizzate i filtri (città, ambito).\n3. Dalla pagina dell'associazione premete «Richiesta di adesione» e compilate il modulo (specializzazione, consenso esplicito al trattamento dei dati ai sensi della legge 09.08).\n4. La richiesta resta nello stato «in attesa» fino all'accettazione da parte dell'ufficio dell'associazione; diverrete così aderenti effettivi e beneficerete del pannello dei membri.\n\nÈ anche possibile fare da volontari agli eventi pubblici delle associazioni senza aderire.",
    },
    "join-fees": {
      title: "Le quote di adesione annuali",
      keywords: ["quota", "adesione", "iscrizione", "annuale", "importo", "versamento", "pagamento", "rinnovo"],
      answer:
        "La quota di adesione annuale è fissata dallo statuto di ciascuna associazione. Sulla piattaforma MAMP, il tesoriere registra il versamento delle quote per ogni esercizio finanziario con rilascio automatico di una ricevuta numerata, e il sistema avvisa gli aderenti che non hanno versato la quota dell'anno in corso. La data di scadenza dell'iscrizione è calcolata automaticamente, e l'aderente in ritardo passa allo stato «in ritardo di pagamento» prima della sospensione.",
    },
    "accounting-features": {
      title: "La contabilità digitale dell'associazione su MAMP",
      keywords: ["contabilità", "finanza", "conti", "entrate", "uscite", "bilancio", "rendiconto", "finanziario", "gestione"],
      answer:
        "Il modulo di contabilità della piattaforma MAMP consente alle associazioni:\n• di registrare tutte le entrate e le uscite classificate (adesioni, donazioni, sovvenzioni, attività, affitti, attrezzature...).\n• un'approvazione duale: il tesoriere registra e il presidente approva.\n• un bilancio preventivo annuale e il confronto tra effettivo e previsto.\n• indicatori immediati: saldo, entrata annuale, uscita annuale, andamento mensile della cassa.\n• di generare il rendiconto finanziario annuale pronto per la stampa e la presentazione all'assemblea generale.\nTutti gli importi sono in dirham marocchino (MAD).",
    },
    "accounting-categories": {
      title: "Le categorie di classificazione contabile adottate",
      keywords: ["categorie", "classificazione", "voci", "classi", "contabili", "imputazione"],
      answer:
        "La piattaforma adotta categorie unificate ed estendibili: entrate (adesioni, donazioni, sovvenzioni e aiuti, attività ed eventi, altre) e uscite (affitti e oneri, attrezzature e dotazioni, onorari e spese amministrative, comunicazione e formazione, attività ed eventi, altre). Questa classificazione alimenta direttamente i grafici e il rendiconto finanziario annuale.",
    },
    "donation-receipt": {
      title: "La ricevuta della donazione sulla piattaforma",
      keywords: ["ricevuta", "donazione", "ricevute", "certificato", "reçu", "conferma", "prova", "donativo"],
      answer:
        "Alla registrazione di ogni donazione (in denaro o in natura) la piattaforma genera una ricevuta ufficiale numerata che contiene: le informazioni dell'associazione, il nome del donatore, l'importo o la descrizione della donazione in natura, la data e il numero di serie, e la firma. Il donatore può richiedere la propria ricevuta direttamente dalla pagina dell'associazione, e l'associazione conserva una copia nel registro delle donazioni. La ricevuta è necessaria al donatore per beneficiare della detrazione fiscale quando ricorrono le condizioni legali.",
    },
    "tax-deduction": {
      title: "La detrazione fiscale delle donazioni (articolo 10 del Codice Generale delle Imposte)",
      keywords: ["detrazione", "fiscale", "imposte", "articolo", "10", "Codice", "deduzione", "riduzione", "donazione", "reddito"],
      answer:
        "L'articolo 10 del Codice Generale delle Imposte marocchino consente, alle condizioni e alle percentuali ivi stabilite, la detrazione delle elargizioni e delle donazioni in denaro o in natura concesse ad alcuni enti e istituzioni dalla base imponibile dei donatori (persone fisiche e giuridiche), tra cui in particolare istituti e associazioni titolari della qualifica di pubblica utilità o riconosciute come di pubblica utilità. Per verificare le condizioni aggiornate, gli elenchi interessati e le percentuali vigenti, occorre fare riferimento al testo vigente tramite il portale della Direzione Generale delle Imposte o contattare l'ufficio fiscale competente. Si consiglia ai donatori di conservare la ricevuta della donazione.",
    },
    "tax-association-status": {
      title: "Il regime fiscale delle associazioni",
      keywords: ["fiscale", "regime", "esenzione", "imposta", "valore", "aggiunto", "quasi", "commerciale", "operazioni"],
      answer:
        "Le associazioni riconosciute come di pubblica utilità beneficiano di un regime fiscale particolare: sono esentate le entrate direttamente legate all'esercizio della loro attività di pubblica utilità, mentre le operazioni di carattere commerciale, industriale, finanziario o immobiliare (esercitate in modo quasi commerciale) sono assoggettate alle imposte vigenti. Per un orientamento sui casi particolari (fatture, imposta sul valore aggiunto all'acquisto di beni...), si prega di rivolgersi alla Direzione Generale delle Imposte.",
    },
    "digital-ice": {
      title: "L'Identificatore Unico dell'Impresa (ICE) per le associazioni",
      keywords: ["ICE", "identificatore", "unico", "numero", "identificazione", "impresa", "ottenere", "attestato"],
      answer:
        "L'Identificatore Unico dell'Impresa (ICE) è un numero identificativo univoco assegnato alle imprese e agli enti — tra cui le associazioni — presso le amministrazioni marocchine, e facilita le loro transazioni con i settori pubblico e privato (gare d'appalto, fatture, dichiarazioni...). L'ICE si richiede gratuitamente tramite il portale ICE della Direzione Generale delle Imposte, compilando un modulo e presentando il dossier dell'associazione (statuto, ricevuta, verbale dell'ufficio...). Sulla piattaforma MAMP, il campo ICE è parte della scheda identificativa digitale dell'associazione.",
    },
    "digital-identity": {
      title: "L'identità digitale dell'associazione marocchina (MAMP)",
      keywords: ["identità", "digitale", "carta", "identificativa", "associazione", "scheda", "digitalizzazione", "verifica"],
      answer:
        "La piattaforma MAMP assegna a ogni associazione verificata una «carta d'identità digitale» che raccoglie i suoi dati ufficiali: nome e acronimo, sede, numero della ricevuta o riferimento giuridico, eventuale qualifica di pubblica utilità, numero ICE, identificazione fiscale, conto bancario e membri dell'ufficio in carica. Questa scheda è condivisibile con i partner e gli enti erogatori, e aiuta gli enti governativi e privati a verificare elettronicamente l'identità dell'associazione tramite la versione pubblica del suo profilo.",
    },
    "digital-egov": {
      title: "Le amministrazioni digitali e i servizi pubblici marocchini",
      keywords: ["amministrazioni", "digitali", "servizi", "pubblici", "portale", "governativo", "electronic", "Stato"],
      answer:
        "I principali portali ufficiali dello Stato marocchino rilevanti per l'attività associativa:\n• maroc.ma — il portale ufficiale del Regno e dei suoi servizi digitali.\n• sgg.gov.ma — il Segretariato Generale del Governo: testi legislativi, Bollettino Ufficiale e una pagina dedicata alle associazioni.\n• interieur.gov.ma — il Ministero dell'Interno (l'amministrazione territoriale che riceve le dichiarazioni).\n• tax.gov.ma — la Direzione Generale delle Imposte.\n• ice.gov.ma — il portale dell'Identificatore Unico dell'Impresa.\n• cnss.ma — la Cassa Nazionale di Previdenza Sociale (dichiarazione dei dipendenti).\n• cndp.ma — la Commissione nazionale per la protezione dei dati personali.\n• asd.ma — il portale del Sussidio Sociale Diretto.\nTutti questi portali sono stati verificati e sono aggiornati periodicamente nella base di conoscenza della piattaforma.",
    },
    "digital-cnss": {
      title: "La dichiarazione dei dipendenti dell'associazione alla CNSS",
      keywords: ["CNSS", "dipendenti", "lavoratori", "previdenza", "sociale", "dichiarazione", "salariés", "contributi"],
      answer:
        "L'associazione che impiega lavoratori dipendenti (dipendenti, animatori retribuiti...) è tenuta a dichiararli presso la Cassa Nazionale di Previdenza Sociale e a versare i contributi mensili, conformemente alla legislazione vigente. Queste procedure possono essere svolte elettronicamente tramite i servizi digitali della CNSS (dichiarazione dei dipendenti, pagamento dei contributi, estrazione degli attestati). Il campo del numero di iscrizione alla CNSS è disponibile nella scheda digitale dell'associazione su MAMP.",
    },
    "platform-what": {
      title: "Che cos'è la piattaforma MAMP?",
      keywords: ["MAMP", "piattaforma", "cos'è", "definizione", "mamp", "sito", "servizi", "gestione"],
      answer:
        "MAMP (Moroccan Associations Management Platform) è una piattaforma digitale marocchina per la gestione e l'amministrazione delle associazioni: adesioni, contabilità, donazioni e ricevute, eventi, documenti ufficiali e rendiconti, con un assistente associativo intelligente che orienta gli utenti. La piattaforma è multi-associazione (ogni associazione ha uno spazio indipendente) e serve cinque categorie: il proprietario della piattaforma (super admin), l'admin dell'associazione (membri dell'ufficio), i co-admin (aderenti e volontari), gli enti governativi e privati competenti, e i cittadini e gli stranieri.",
    },
    "platform-roles": {
      title: "I ruoli e le autorizzazioni sulla piattaforma MAMP",
      keywords: ["ruoli", "autorizzazioni", "admin", "super", "co-admin", "partner", "cittadino", "roles"],
      answer:
        "La piattaforma adotta autorizzazioni granulari su due livelli:\n• Proprietario della piattaforma (super admin): verifica delle associazioni, loro sospensione, supervisione generale, registro di controllo.\n• Admin dell'associazione: i membri dell'ufficio (presidente, vice, segretario generale, tesoriere) — gestione completa: membri, contabilità, documenti, eventi, rendiconti. Le operazioni finanziarie sono limitate al tesoriere e al presidente.\n• Co-admin: aderenti e volontari con autorizzazioni specifiche concesse dall'ufficio (organizzazione di eventi, ricezione delle iscrizioni...).\n• Enti governativi e privati: account partner verificati che consentono la consultazione dei dati dichiarati delle associazioni interessate.\n• Cittadini e stranieri: account gratuiti per la consultazione, le donazioni e l'iscrizione agli eventi pubblici.",
    },
    "platform-register-association": {
      title: "Registrare la vostra associazione sulla piattaforma",
      keywords: ["registrazione", "associazione", "aggiungere", "creare", "pagina", "richiesta", "verifica", "nuova"],
      answer:
        "Per registrare la vostra associazione sulla piattaforma MAMP:\n1. Create un account a nome di uno dei membri dell'ufficio dell'associazione.\n2. Dal pannello, scegliete «Registrare un'associazione» e compilate la scheda: nome, ambito, città e regione, descrizione e obiettivi, data di fondazione, dati ufficiali (numero della ricevuta, ICE se disponibile...).\n3. Il dossier resta nello stato «in attesa di approvazione» finché il team della piattaforma non lo esamina e lo verifica.\n4. Dopo la verifica si aprono tutti i moduli: membri, contabilità, donazioni, eventi, documenti.\n\nLa verifica tutela la reputazione delle associazioni e preserva l'affidabilità dell'elenco pubblico.",
    },
    "platform-security": {
      title: "La sicurezza e la protezione dei dati sulla piattaforma",
      keywords: ["sicurezza", "protezione", "dati", "personali", "crittografia", "password", "riservatezza", "audit", "sessione"],
      answer:
        "La piattaforma MAMP rispetta standard di sicurezza rigorosi: le password sono crittografate (scrypt) e non vengono mai memorizzate in chiaro, le sessioni sono firmate digitalmente tramite token JWT all'interno di un cookie httpOnly, le autorizzazioni sono verificate a ogni richiesta sul server (e non solo nell'interfaccia), e un registro di controllo documenta tutte le operazioni sensibili (chi, cosa, quando). Il trattamento dei dati personali degli aderenti avviene con il loro consenso esplicito ai sensi della legge 09.08, con la possibilità di richiedere la rettifica o la cancellazione.",
    },
    "platform-donate": {
      title: "Donare a un'associazione tramite la piattaforma",
      keywords: ["donazione", "sostegno", "contributo", "pagamento", "versamento", "denaro", "aiuto"],
      answer:
        "Per donare a un'associazione verificata sulla piattaforma: entrate nella pagina dell'associazione dall'elenco, premete «Dona», quindi compilate il nome (o scegliete di donare in forma anonima) e l'importo o la descrizione della donazione in natura. L'associazione registra la donazione e riceve una ricevuta numerata che compare nel registro delle donazioni. Le donazioni in natura sono documentate con una descrizione precisa e una valutazione. Nota: le operazioni di raccolta pubblica di donazioni dal pubblico richiedono un'autorizzazione preventiva secondo la legge — e gli aiuti stranieri devono essere dichiarati.",
    },
    "platform-events": {
      title: "Gli eventi e le iscrizioni",
      keywords: ["eventi", "attività", "iscrizione", "workshop", "corso", "convegno", "manifestazione", "partecipazione"],
      answer:
        "Le associazioni organizzano i propri eventi (corsi, convegni, convogli, laboratori...) sulla piattaforma e ne definiscono il numero di posti, il luogo e la data. Gli eventi pubblici compaiono nella home page e i cittadini possono iscriversi direttamente con il proprio account o compilando un modulo rapido. L'associazione segue le iscrizioni e approva le presenze dal proprio pannello.",
    },
    "platform-documents": {
      title: "La gestione dei documenti ufficiali",
      keywords: ["documenti", "file", "verbali", "rendiconti", "statuto", "archivio", "conservazione", "gestione"],
      answer:
        "Il modulo dei documenti conserva l'archivio ufficiale dell'associazione in modo classificato: lo statuto e le sue versioni aggiornate, i verbali delle assemblee generali e dell'ufficio, i rendiconti morali e finanziari annuali, le ricevute e gli accordi di partnership. Per ogni documento è definito il livello di riservatezza (pubblico/interno) ed è conservato con numerazione delle versioni (versioning) per tracciare le modifiche — il che facilita la preparazione del dossier di dichiarazione annuale e la raccolta dei documenti richiesti dai partner.",
    },
    "platform-assistant": {
      title: "L'Assistente Associativo — come si utilizza?",
      keywords: ["assistente", "chat", "bot", "intelligente", "conversazione", "domande", "guida", "utilizzo"],
      answer:
        "Sono «l'Assistente Associativo», il vostro compagno sulla piattaforma. Rispondo su: leggi e procedure ufficiali (fondazione, dichiarazione, pubblica utilità...), usi pratici della piattaforma (adesione, contabilità, donazioni...) e orientamento verso i portali ufficiali verificati. Lavoro con una base di conoscenza revisionata e solo fonti ufficiali: non invento link né informazioni non verificate. Se non conosco la risposta, lo dico chiaramente e vi indirizzo alla fonte ufficiale competente. Ponete la vostra domanda liberamente!",
    },
    "platform-support-youth": {
      title: "Il sostegno pubblico alle associazioni",
      keywords: ["sostegno", "sovvenzione", "contributi", "Stato", "finanziario", "programmi", "partnership", "pubblico"],
      answer:
        "Esistono diversi meccanismi di sostegno alle associazioni: sovvenzioni e aiuti pubblici (ministeri competenti, collettività territoriali, agenzie di sviluppo...) e programmi di partnership settoriale. Queste opportunità sono di norma annunciate sui siti dei ministeri e degli enti competenti — tra cui il Ministero della Gioventù, della Cultura e della Comunicazione, che pubblica i testi che inquadrano la vita associativa e i programmi di sostegno, e il Ministero dell'Interno. Alla ricezione di qualsiasi aiuto straniero, occorre dichiararlo secondo la legge. La verifica dell'associazione su MAMP facilita la preparazione dei dossier di richiesta di sostegno (carta d'identità digitale, rendiconti annuali, documenti legali).",
    },
    "contact-official": {
      title: "Contattare le amministrazioni competenti in materia di associazioni",
      keywords: ["contatto", "comunicazione", "amministrazione", "autorità", "responsabile", "indirizzo", "ufficio", "reclamo"],
      answer:
        "Le amministrazioni principali competenti in materia di attività associativa: l'autorità amministrativa locale (caidato/pascialato della sede dell'associazione) per la ricezione delle dichiarazioni e delle modifiche; il Segretariato Generale del Governo per la pubblicazione nel Bollettino Ufficiale, la qualifica di pubblica utilità e le procedure di raccolta di donazioni; la Direzione Generale delle Imposte per gli aspetti fiscali e l'ICE; la CNDP per le dichiarazioni di trattamento dei dati. Utilizzate sempre i portali ufficiali verificati sopra indicati per comunicare e conservate copia di ogni corrispondenza e ricevuta.",
    },
    "app-download": {
      title: "L'app della piattaforma MAMP per Android — download e installazione",
      keywords: ["app", "Android", "APK", "apk", "scaricare", "download", "installazione", "telefono", "cellulare", "versione", "versioni", "firma"],
      answer:
        "L'app della piattaforma MAMP dispone di una versione ufficiale per Android, costruita e firmata automaticamente dal repository ufficiale. Per il download: visitate la pagina dell'app sulla piattaforma e premete «Scarica file APK», oppure scansionate il codice QR presente sulla stessa pagina. Dopo il download: 1) aprite il file dalle notifiche o dalla cartella dei download. 2) attivate «Consenti da questa fonte» quando Android lo richiede (messaggio standard per ogni app al di fuori dello store). 3) premete «Installa» quindi aprite l'app. L'app è firmata digitalmente con il certificato CN=TARIK CHOUIKA con validità di 30 anni, e l'impronta del certificato è pubblicata nelle note di ogni versione — qualsiasi file che non reca questa firma non è una versione ufficiale. Requisiti: Android 7.0 o più recente con connessione a Internet. Il link permanente di download indirizza sempre all'ultima versione.",
    },
  },
  links: {
    maroc: "Portale ufficiale del Regno del Marocco",
    sgg: "Segretariato Generale del Governo",
    sggAssociations: "Pagina delle associazioni — Segretariato Generale del Governo",
    cndp: "Commissione Nazionale per il controllo della protezione dei dati personali",
    ice: "Portale dell'Identificatore Unico dell'Impresa (ICE)",
    tax: "Direzione Generale delle Imposte",
    cnss: "Cassa Nazionale di Previdenza Sociale",
    asd: "Portale del Sussidio Sociale Diretto",
    interieur: "Ministero dell'Interno",
    mcrpsc: "Ministero della Gioventù, della Cultura e della Comunicazione",
    mamp: "Piattaforma MAMP — Gestione delle associazioni marocchine",
    mampApp: "Applicazione Android ufficiale della piattaforma MAMP",
    mampApk: "Scarica l'applicazione Android MAMP (ultima versione firmata)",
    mampReleases: "Versioni dell'applicazione MAMP — repository ufficiale",
  },
  categories: {
    "التشريع": "Legislazione",
    "التأسيس": "Costituzione",
    "الانخراط": "Adesione",
    "المحاسبة": "Contabilità",
    "التبرعات": "Donazioni",
    "الضرائب": "Fiscalità",
    "الهوية الرقمية": "Identità digitale",
    "البوابات الرسمية": "Portali ufficiali",
    "حماية المعطيات": "Protezione dei dati",
    "المنصة": "Piattaforma",
  },
};
