import React, { useState, useMemo } from 'react';

// ─── Types ───────────────────────────────────────────────────────────
type StatutAdhesion = 'Actif' | 'En attente' | 'Suspendu';
type TypeAdherent = 'Individuel' | 'Famille' | 'Morale' | 'Bienfaiteur';

interface Membre {
  id: number;
  numeroAdherent: string;
  nom: string;
  prenom: string;
  cin: string;
  type: TypeAdherent;
  statut: StatutAdhesion;
  dateAdhesion: string;
}

// ─── Données de démonstration ────────────────────────────────────────
const MEMBRES_DEMO: Membre[] = [
  { id: 1,  numeroAdherent: 'ADM-0001', nom: 'Alami',       prenom: 'Mohammed',     cin: 'BK 482103', type: 'Individuel', statut: 'Actif',       dateAdhesion: '2023-01-15' },
  { id: 2,  numeroAdherent: 'ADM-0002', nom: 'Bennani',     prenom: 'Fatima',       cin: 'BE 635791', type: 'Famille',    statut: 'Actif',       dateAdhesion: '2023-02-20' },
  { id: 3,  numeroAdherent: 'ADM-0003', nom: 'Chraibi',     prenom: 'Abdellah',    cin: 'BH 291467', type: 'Individuel', statut: 'En attente',  dateAdhesion: '2023-03-10' },
  { id: 4,  numeroAdherent: 'ADM-0004', nom: 'El Fassi',    prenom: 'Khadija',     cin: 'BK 109832', type: 'Bienfaiteur',statut: 'Actif',       dateAdhesion: '2022-11-05' },
  { id: 5,  numeroAdherent: 'ADM-0005', nom: 'Idrissi',     prenom: 'Youssef',     cin: 'BE 748256', type: 'Individuel', statut: 'Suspendu',    dateAdhesion: '2023-04-18' },
  { id: 6,  numeroAdherent: 'ADM-0006', nom: 'Tazi',        prenom: 'Amina',       cin: 'BH 563920', type: 'Famille',    statut: 'Actif',       dateAdhesion: '2023-05-22' },
  { id: 7,  numeroAdherent: 'ADM-0007', nom: 'Bouzidi',     prenom: 'Rachid',      cin: 'BK 384175', type: 'Morale',     statut: 'Actif',       dateAdhesion: '2022-09-14' },
  { id: 8,  numeroAdherent: 'ADM-0008', nom: 'Ait Ouazza',  prenom: 'Zineb',       cin: 'BE 927341', type: 'Individuel', statut: 'En attente',  dateAdhesion: '2023-06-30' },
  { id: 9,  numeroAdherent: 'ADM-0009', nom: 'Mansouri',    prenom: 'Hassan',      cin: 'BH 156482', type: 'Individuel', statut: 'Actif',       dateAdhesion: '2023-07-11' },
  { id: 10, numeroAdherent: 'ADM-0010', nom: 'Filali',      prenom: 'Salma',       cin: 'BK 672039', type: 'Bienfaiteur',statut: 'Actif',       dateAdhesion: '2022-08-25' },
  { id: 11, numeroAdherent: 'ADM-0011', nom: 'Chaoui',      prenom: 'Omar',        cin: 'BE 438567', type: 'Individuel', statut: 'Suspendu',    dateAdhesion: '2023-08-03' },
  { id: 12, numeroAdherent: 'ADM-0012', nom: 'Slaoui',      prenom: 'Nadia',       cin: 'BH 891240', type: 'Famille',    statut: 'Actif',       dateAdhesion: '2023-09-17' },
  { id: 13, numeroAdherent: 'ADM-0013', nom: 'Berrada',     prenom: 'Karim',       cin: 'BK 215673', type: 'Morale',     statut: 'En attente',  dateAdhesion: '2023-10-01' },
  { id: 14, numeroAdherent: 'ADM-0014', nom: 'Ouazzani',    prenom: 'Malika',      cin: 'BE 573894', type: 'Individuel', statut: 'Actif',       dateAdhesion: '2022-12-09' },
  { id: 15, numeroAdherent: 'ADM-0015', nom: 'Seghrouchni', prenom: 'Ahmed',       cin: 'BH 348716', type: 'Bienfaiteur',statut: 'Actif',       dateAdhesion: '2023-11-20' },
  { id: 16, numeroAdherent: 'ADM-0016', nom: 'Lahlou',      prenom: 'Samira',     cin: 'BK 769402', type: 'Famille',    statut: 'Suspendu',    dateAdhesion: '2023-12-05' },
  { id: 17, numeroAdherent: 'ADM-0017', nom: 'Hamdaoui',    prenom: 'Driss',       cin: 'BE 184537', type: 'Individuel', statut: 'Actif',       dateAdhesion: '2024-01-08' },
  { id: 18, numeroAdherent: 'ADM-0018', nom: 'Chakir',      prenom: 'Latifa',      cin: 'BH 627893', type: 'Individuel', statut: 'En attente',  dateAdhesion: '2024-02-14' },
  { id: 19, numeroAdherent: 'ADM-0019', nom: 'Kettani',     prenom: 'Mehdi',       cin: 'BK 492158', type: 'Morale',     statut: 'Actif',       dateAdhesion: '2024-03-22' },
  { id: 20, numeroAdherent: 'ADM-0020', nom: 'Jabri',       prenom: 'Hajar',       cin: 'BE 836741', type: 'Individuel', statut: 'Actif',       dateAdhesion: '2024-04-10' },
];

// ─── Constantes ──────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 5;

const STATUT_STYLES: Record<StatutAdhesion, string> = {
  'Actif':      'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  'En attente': 'bg-amber-100 text-amber-800 ring-amber-600/20',
  'Suspendu':   'bg-rose-100 text-rose-800 ring-rose-600/20',
};

// ─── Composant Members ───────────────────────────────────────────────
const Members: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<StatutAdhesion | 'Tous'>('Tous');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrage
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MEMBRES_DEMO.filter((m) => {
      const matchesSearch =
        !q ||
        m.nom.toLowerCase().includes(q) ||
        m.prenom.toLowerCase().includes(q) ||
        m.cin.toLowerCase().includes(q) ||
        m.numeroAdherent.toLowerCase().includes(q);
      const matchesStatut = filterStatut === 'Tous' || m.statut === filterStatut;
      return matchesSearch && matchesStatut;
    });
  }, [search, filterStatut]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Réinitialiser la page quand le filtre ou la recherche change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatut]);

  const handleVoir = (membre: Membre) => {
    alert(`Fiche membre\n\n${membre.prenom} ${membre.nom}\nN° ${membre.numeroAdherent}\nCIN: ${membre.cin}\nType: ${membre.type}\nStatut: ${membre.statut}\nAdhésion: ${membre.dateAdhesion}`);
  };

  const handleModifier = (membre: Membre) => {
    alert(`Modification du membre ${membre.prenom} ${membre.nom} (${membre.numeroAdherent})`);
  };

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Membres</h1>
        <p className="mt-1 text-sm text-gray-500">
          Liste des adhérents de l'association — {filtered.length} membre{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Recherche */}
        <div className="relative w-full sm:max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom, CIN ou N° adhérent…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filtre statut */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-statut" className="text-sm font-medium text-gray-700">
            Statut :
          </label>
          <select
            id="filter-statut"
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value as StatutAdhesion | 'Tous')}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Tous">Tous</option>
            <option value="Actif">Actif</option>
            <option value="En attente">En attente</option>
            <option value="Suspendu">Suspendu</option>
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  N° Adhérent
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Nom &amp; Prénom
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  CIN
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Statut
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date d'adhésion
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                    Aucun membre ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                paginatedData.map((membre) => (
                  <tr
                    key={membre.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-blue-600">
                      {membre.numeroAdherent}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                          {membre.prenom[0]}{membre.nom[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {membre.nom} {membre.prenom}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                      {membre.cin}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                      {membre.type}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUT_STYLES[membre.statut]}`}
                      >
                        {membre.statut}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-600">
                      {new Date(membre.dateAdhesion).toLocaleDateString('fr-MA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVoir(membre)}
                          className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Voir
                        </button>
                        <button
                          onClick={() => handleModifier(membre)}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Modifier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
          <div className="hidden text-sm text-gray-500 sm:block">
            Affichage de <span className="font-medium">{filtered.length === 0 ? 0 : startIndex + 1}</span> à{' '}
            <span className="font-medium">
              {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}
            </span>{' '}
            sur <span className="font-medium">{filtered.length}</span> résultat{filtered.length !== 1 ? 's' : ''}
          </div>
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {safeCurrentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
