import {
  PrismaClient,
  UserRole,
  MembershipType,
  MemberStatus,
  TransactionType,
  PaymentMethod,
  DonationType,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début de l\'insertion des données de test...');

  // =========================================================================
  // 1. Nettoyage complet de la base de données
  // =========================================================================
  console.log('🗑️  Nettoyage des tables existantes...');
  await prisma.auditLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.memberSubscription.deleteMany();
  await prisma.subscriptionType.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.budgetLine.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.accountingCategory.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.assemblyAttendance.deleteMany();
  await prisma.generalAssembly.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.boardPosition.deleteMany();
  await prisma.member.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Tables nettoyées.');

  // =========================================================================
  // 2. Hachage du mot de passe commun
  // =========================================================================
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // =========================================================================
  // 3. Création des utilisateurs Admin et Trésorier (avec membres liés)
  // =========================================================================
  console.log('👤 Création des utilisateurs admin et trésorier...');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@associa.ma',
      passwordHash,
      firstName: 'Admin',
      lastName: 'System',
      phone: '06 00 00 00 01',
      role: UserRole.admin,
      member: {
        create: {
          membershipNumber: 'MEM-2024-001',
          nationalId: 'AD000001',
          firstName: 'Admin',
          lastName: 'System',
          city: 'Casablanca',
          profession: 'Administrateur système',
          status: MemberStatus.active,
          membershipType: MembershipType.active,
          joinedDate: new Date('2024-01-01'),
          cndpConsent: true,
          cndpConsentDate: new Date(),
        },
      },
    },
  });

  const treasurerUser = await prisma.user.create({
    data: {
      email: 'tresorier@associa.ma',
      passwordHash,
      firstName: 'Khadija',
      lastName: 'Tazi',
      phone: '06 12 34 56 78',
      role: UserRole.treasurer,
      member: {
        create: {
          membershipNumber: 'MEM-2024-002',
          nationalId: 'KT987654',
          firstName: 'Khadija',
          lastName: 'Tazi',
          dateOfBirth: new Date('1985-03-14'),
          address: '42 Rue Fes, Maarif',
          city: 'Casablanca',
          profession: 'Comptable agréée',
          status: MemberStatus.active,
          membershipType: MembershipType.active,
          joinedDate: new Date('2024-01-01'),
          cndpConsent: true,
          cndpConsentDate: new Date(),
        },
      },
    },
    include: { member: true },
  });

  console.log('   ✅ Admin: admin@associa.ma');
  console.log('   ✅ Trésorier: tresorier@associa.ma');

  // =========================================================================
  // 4. Création de 10 membres avec données marocaines réalistes
  // =========================================================================
  console.log('👥 Création de 10 membres...');

  const membersData: Array<{
    firstName: string;
    lastName: string;
    cin: string;
    city: string;
    type: MembershipType;
    status?: MemberStatus;
    dateOfBirth?: string;
    address?: string;
    profession?: string;
    phone?: string;
  }> = [
    {
      firstName: 'Ahmed',
      lastName: 'El Amrani',
      cin: 'AB123456',
      city: 'Casablanca',
      type: MembershipType.active,
      dateOfBirth: '1980-06-15',
      address: '15 Boulevard Massira Al Khadra',
      profession: 'Ingénieur informatique',
      phone: '06 61 23 45 67',
    },
    {
      firstName: 'Fatima',
      lastName: 'Zahra',
      cin: 'CD789012',
      city: 'Rabat',
      type: MembershipType.student,
      dateOfBirth: '1999-09-22',
      address: '8 Avenue Atlas, Hay Riad',
      profession: 'Étudiante en droit',
      phone: '06 72 34 56 78',
    },
    {
      firstName: 'Youssef',
      lastName: 'Benali',
      cin: 'EF345678',
      city: 'Marrakech',
      type: MembershipType.active,
      dateOfBirth: '1988-02-10',
      address: '33 Rue Bab Agnaou, Médina',
      profession: 'Chef d\'entreprise',
      phone: '06 83 45 67 89',
    },
    {
      firstName: 'Amina',
      lastName: 'Hassani',
      cin: 'GH901234',
      city: 'Fès',
      type: MembershipType.honorary,
      dateOfBirth: '1972-11-05',
      address: '5 Derb El Miter, Médina',
      profession: 'Professeure universitaire',
      phone: '06 94 56 78 90',
    },
    {
      firstName: 'Omar',
      lastName: 'Chraibi',
      cin: 'IJ567890',
      city: 'Tanger',
      type: MembershipType.active,
      dateOfBirth: '1983-07-28',
      address: '22 Rue de la Liberté',
      profession: 'Avocat',
      phone: '06 15 67 89 01',
    },
    {
      firstName: 'Salma',
      lastName: 'Idrissi',
      cin: 'KL234567',
      city: 'Agadir',
      type: MembershipType.active,
      dateOfBirth: '1991-04-17',
      address: '10 Avenue Hassan II',
      profession: 'Médecin généraliste',
      phone: '06 26 78 90 12',
    },
    {
      firstName: 'Mehdi',
      lastName: 'Alaoui',
      cin: 'MN890123',
      city: 'Oujda',
      type: MembershipType.student,
      dateOfBirth: '2001-01-30',
      address: '7 Rue Ziat Ben Sidi Youssef',
      profession: 'Étudiant en commerce',
      phone: '06 37 89 01 23',
    },
    {
      firstName: 'Nadia',
      lastName: 'Berrada',
      cin: 'OP456789',
      city: 'Casablanca',
      type: MembershipType.active,
      dateOfBirth: '1986-08-12',
      address: '45 Rue Blida, Médina',
      profession: 'Architecte',
      phone: '06 48 90 12 34',
    },
    {
      firstName: 'Karim',
      lastName: 'Ziani',
      cin: 'QR012345',
      city: 'Meknès',
      type: MembershipType.benefactor,
      dateOfBirth: '1975-12-25',
      address: '18 Avenue des FAR',
      profession: 'Directeur commercial',
      phone: '06 59 01 23 45',
    },
    {
      firstName: 'Leila',
      lastName: 'Bennani',
      cin: 'ST678901',
      city: 'Rabat',
      type: MembershipType.active,
      dateOfBirth: '1993-05-08',
      address: '27 Rue Abou Marouane Essaadi',
      profession: 'Designer graphique',
      phone: '06 60 12 34 56',
    },
  ];

  const members = [];
  for (let i = 0; i < membersData.length; i++) {
    const data = membersData[i];
    const member = await prisma.member.create({
      data: {
        membershipNumber: `MEM-2026-${String(i + 3).padStart(3, '0')}`,
        nationalId: data.cin,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        address: data.address,
        city: data.city,
        profession: data.profession,
        membershipType: data.type,
        status: data.status ?? (i === 7 ? MemberStatus.pending : MemberStatus.active),
        joinedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        cndpConsent: true,
        cndpConsentDate: new Date(),
      },
    });
    members.push(member);
  }

  console.log(`   ✅ ${members.length} membres créés (villes: Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, Oujda, Meknès)`);

  // =========================================================================
  // 5. Postes du bureau et membres du bureau
  // =========================================================================
  console.log('🏛️  Création des postes du bureau...');

  const positions = await Promise.all([
    prisma.boardPosition.create({
      data: { name: 'Président', description: 'Représentant légal de l\'association, préside les assemblées générales' },
    }),
    prisma.boardPosition.create({
      data: { name: 'Secrétaire Général', description: 'Gestion administrative, rédaction des PV et correspondances' },
    }),
    prisma.boardPosition.create({
      data: { name: 'Trésorier', description: 'Gestion financière, comptabilité et budgets' },
    }),
  ]);

  await prisma.boardMember.createMany({
    data: [
      // Ahmed El Amrani (Casablanca) = Président
      { memberId: members[0].id, positionId: positions[0].id, electionDate: new Date('2024-01-15'), termEndDate: new Date('2027-01-15') },
      // Fatima Zahra (Rabat) = Secrétaire Général
      { memberId: members[1].id, positionId: positions[1].id, electionDate: new Date('2024-01-15'), termEndDate: new Date('2027-01-15') },
      // Khadija Tazi (trésorier user) = Trésorier
      { memberId: treasurerUser.member!.id, positionId: positions[2].id, electionDate: new Date('2024-01-15'), termEndDate: new Date('2027-01-15') },
    ],
  });

  console.log('   ✅ Président: Ahmed El Amrani (Casablanca)');
  console.log('   ✅ Secrétaire Général: Fatima Zahra (Rabat)');
  console.log('   ✅ Trésorier: Khadija Tazi (Casablanca)');

  // =========================================================================
  // 6. Catégories comptables (Revenus et Dépenses)
  // =========================================================================
  console.log('📊 Création des catégories comptables...');

  const incomeCategories = await Promise.all([
    prisma.accountingCategory.create({ data: { name: 'Cotisations des membres', type: TransactionType.income, code: '751' } }),
    prisma.accountingCategory.create({ data: { name: 'Dons et Legs', type: TransactionType.income, code: '754' } }),
    prisma.accountingCategory.create({ data: { name: 'Subventions publiques', type: TransactionType.income, code: '756' } }),
    prisma.accountingCategory.create({ data: { name: 'Revenus d\'événements', type: TransactionType.income, code: '758' } }),
  ]);

  const expenseCategories = await Promise.all([
    prisma.accountingCategory.create({ data: { name: 'Frais de fonctionnement bureau', type: TransactionType.expense, code: '6061' } }),
    prisma.accountingCategory.create({ data: { name: 'Événements & Activités', type: TransactionType.expense, code: '625' } }),
    prisma.accountingCategory.create({ data: { name: 'Communication & Marketing', type: TransactionType.expense, code: '626' } }),
    prisma.accountingCategory.create({ data: { name: 'Frais postaux et télécommunications', type: TransactionType.expense, code: '6221' } }),
    prisma.accountingCategory.create({ data: { name: 'Déplacements et missions', type: TransactionType.expense, code: '624' } }),
  ]);

  console.log(`   ✅ ${incomeCategories.length} catégories de revenus`);
  console.log(`   ✅ ${expenseCategories.length} catégories de dépenses`);

  // =========================================================================
  // 7. Types d'adhésion / Cotisations
  // =========================================================================
  console.log('💳 Création des types d\'adhésion...');

  const [annualSub, studentSub] = await Promise.all([
    prisma.subscriptionType.create({
      data: {
        name: 'Cotisation Annuelle',
        amount: 500,
        durationMonths: 12,
        description: 'Adhésion standard pour les membres actifs - couvre toute l\'année civile',
      },
    }),
    prisma.subscriptionType.create({
      data: {
        name: 'Cotisation Étudiant',
        amount: 200,
        durationMonths: 12,
        description: 'Tarif réduit pour les étudiants inscrits (justificatif requis)',
      },
    }),
  ]);

  console.log('   ✅ Cotisation Annuelle: 500 DH (12 mois)');
  console.log('   ✅ Cotisation Étudiant: 200 DH (12 mois)');

  // =========================================================================
  // 8. Souscriptions des membres
  // =========================================================================
  console.log('📋 Création des souscriptions des membres...');

  const subscriptionData = members.map((member, i) => {
    const isStudent = membersData[i].type === MembershipType.student;
    const subType = isStudent ? studentSub : annualSub;
    const startYear = 2026;
    return {
      memberId: member.id,
      subscriptionTypeId: subType.id,
      startDate: new Date(startYear, 0, 1),
      endDate: new Date(startYear, 11, 31),
      amountPaid: subType.amount,
      paymentDate: new Date(startYear, 0, 5 + i),
      status: 'active' as const,
    };
  });

  await prisma.memberSubscription.createMany({ data: subscriptionData });
  console.log(`   ✅ ${subscriptionData.length} souscriptions créées`);

  // =========================================================================
  // 9. Transactions fictives
  // =========================================================================
  console.log('💰 Création des transactions...');

  const transactionsData = [
    {
      desc: 'Cotisation Ahmed El Amrani 2026',
      amount: 500,
      type: TransactionType.income,
      catId: incomeCategories[0].id,
      memberId: members[0].id,
      method: PaymentMethod.bank_transfer,
      ref: 'VIR-2026-001',
    },
    {
      desc: 'Cotisation Fatima Zahra 2026',
      amount: 200,
      type: TransactionType.income,
      catId: incomeCategories[0].id,
      memberId: members[1].id,
      method: PaymentMethod.cash,
      ref: null,
    },
    {
      desc: 'Cotisation Youssef Benali 2026',
      amount: 500,
      type: TransactionType.income,
      catId: incomeCategories[0].id,
      memberId: members[2].id,
      method: PaymentMethod.bank_transfer,
      ref: 'VIR-2026-002',
    },
    {
      desc: 'Subvention Ministère de la Jeunesse et des Sports',
      amount: 25000,
      type: TransactionType.income,
      catId: incomeCategories[2].id,
      method: PaymentMethod.bank_transfer,
      ref: 'SUB-MJS-2026-001',
    },
    {
      desc: 'Revenus atelier formation digital mars 2026',
      amount: 3500,
      type: TransactionType.income,
      catId: incomeCategories[3].id,
      method: PaymentMethod.online,
      ref: 'EVT-2026-001',
    },
    {
      desc: 'Achat fournitures de bureau (papeterie, cartouches)',
      amount: 1200,
      type: TransactionType.expense,
      catId: expenseCategories[0].id,
      method: PaymentMethod.cash,
      ref: null,
    },
    {
      desc: 'Location salle pour Assemblée Générale 2026',
      amount: 3500,
      type: TransactionType.expense,
      catId: expenseCategories[1].id,
      method: PaymentMethod.check,
      ref: 'CHQ-004589',
    },
    {
      desc: 'Impression brochures et flyers promotion',
      amount: 800,
      type: TransactionType.expense,
      catId: expenseCategories[2].id,
      method: PaymentMethod.cash,
      ref: null,
    },
    {
      desc: 'Forfait internet et téléphone - Janvier à Juin',
      amount: 1800,
      type: TransactionType.expense,
      catId: expenseCategories[3].id,
      method: PaymentMethod.bank_transfer,
      ref: 'PRM-2026-H1',
    },
    {
      desc: 'Déplacement délégation à la conférence Marrakech',
      amount: 4200,
      type: TransactionType.expense,
      catId: expenseCategories[4].id,
      method: PaymentMethod.bank_transfer,
      ref: 'VIR-CONF-001',
    },
  ];

  for (let i = 0; i < transactionsData.length; i++) {
    const tx = transactionsData[i];
    await prisma.transaction.create({
      data: {
        date: new Date(2026, Math.floor(i / 3), 5 + (i * 3) % 25),
        description: tx.desc,
        amount: tx.amount,
        type: tx.type,
        categoryId: tx.catId,
        paymentMethod: tx.method,
        reference: tx.ref,
        memberId: tx.memberId ?? null,
        approvedById: adminUser.id,
        notes: i < 5 ? 'Revenu validé par le bureau' : 'Dépense approuvée',
      },
    });
  }

  console.log(`   ✅ ${transactionsData.length} transactions créées (revenus et dépenses)`);

  // =========================================================================
  // 10. Budget prévisionnel
  // =========================================================================
  console.log('📈 Création du budget 2026...');

  const budget = await prisma.budget.create({
    data: {
      name: 'Budget prévisionnel 2026',
      fiscalYear: 2026,
      totalIncome: 80000,
      totalExpenses: 55000,
      status: 'approved',
      approvedAt: new Date('2026-01-20'),
    },
  });

  await prisma.budgetLine.createMany({
    data: [
      { budgetId: budget.id, categoryId: incomeCategories[0].id, plannedAmount: 30000, actualAmount: 1200, notes: 'Cotisations membres' },
      { budgetId: budget.id, categoryId: incomeCategories[2].id, plannedAmount: 30000, actualAmount: 25000, notes: 'Subventions étatiques' },
      { budgetId: budget.id, categoryId: incomeCategories[3].id, plannedAmount: 20000, actualAmount: 3500, notes: 'Revenus événements' },
      { budgetId: budget.id, categoryId: expenseCategories[0].id, plannedAmount: 12000, actualAmount: 1200, notes: 'Fonctionnement bureau' },
      { budgetId: budget.id, categoryId: expenseCategories[1].id, plannedAmount: 18000, actualAmount: 3500, notes: 'Événements & activités' },
      { budgetId: budget.id, categoryId: expenseCategories[2].id, plannedAmount: 8000, actualAmount: 800, notes: 'Communication' },
    ],
  });

  console.log('   ✅ Budget prévisionnel 2026 créé (Recettes: 80000 DH, Dépenses: 55000 DH)');

  // =========================================================================
  // 11. Don / Subvention de la Fondation Hightech Maroc
  // =========================================================================
  console.log('🎁 Création du don de la Fondation Hightech Maroc...');

  await prisma.donation.create({
    data: {
      donorName: 'Fondation Hightech Maroc',
      donorEmail: 'contact@fondation-hightech.ma',
      donorPhone: '+212 5 22 00 00 00',
      amount: 50000,
      date: new Date('2026-05-10'),
      type: DonationType.grant,
      isAnonymous: false,
      receiptIssued: true,
      receiptNumber: 'REC-2026-001',
      notes: 'Subvention pour le programme de formation numérique des jeunes - Convention signée le 01/05/2026',
    },
  });

  console.log('   ✅ Don: 50 000 DH de Fondation Hightech Maroc (type: Subvention)');

  // =========================================================================
  // 12. Résumé final
  // =========================================================================
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  ✅ Base de données remplie avec succès !');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('🔑 Identifiants de connexion :');
  console.log('   Admin:      admin@associa.ma    / Password123!');
  console.log('   Trésorier:  tresorier@associa.ma / Password123!');
  console.log('');
  console.log('📊 Données insérées :');
  console.log(`   - ${2} utilisateurs (admin + trésorier)`);
  console.log(`   - ${members.length} membres (8 villes marocaines)`);
  console.log(`   - ${3} postes du bureau + ${3} membres du bureau`);
  console.log(`   - ${incomeCategories.length + expenseCategories.length} catégories comptables`);
  console.log(`   - ${2} types d'adhésion`);
  console.log(`   - ${subscriptionData.length} souscriptions`);
  console.log(`   - ${transactionsData.length} transactions`);
  console.log(`   - ${1} budget prévisionnel 2026`);
  console.log(`   - ${1} don (50 000 DH)`);
  console.log('═══════════════════════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du remplissage de la base de données:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
