import React from 'react';

// --- Color Palette ---
const COLORS = {
  primary: '#1A5276',
  primaryLight: '#2980B9',
  accent: '#F39C12',
  success: '#27AE60', // Green for revenues
  danger: '#E74C3C',  // Red for expenses
  bg: '#F8F9FA',
  card: '#FFFFFF',
  text: '#2C3E50',
  textLight: '#7F8C8D',
};

// --- Stat Card Icon Components ---
const UsersIcon: React.FC = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const RevenueIcon: React.FC = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const CalendarIcon: React.FC = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const HeartIcon: React.FC = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// --- Trend Arrow Components ---
const TrendUp: React.FC = () => (
  <svg width="16" height="16" fill="none" stroke={COLORS.success} strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendDown: React.FC = () => (
  <svg width="16" height="16" fill="none" stroke={COLORS.danger} strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

// --- Types ---
interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down';
  trendValue: string;
  icon: React.FC;
  bgColor: string;
  iconColor: string;
}

interface ActivityItem {
  id: number;
  type: 'member' | 'donation' | 'event' | 'payment';
  description: string;
  time: string;
  amount?: string;
  icon: React.FC;
  iconBg: string;
}

// --- Stat Cards Data ---
const statCards: StatCard[] = [
  {
    title: 'Adhérents Actifs',
    value: '245',
    subtitle: 'Membres enregistrés',
    trend: 'up',
    trendValue: '+12%',
    icon: UsersIcon,
    bgColor: '#EBF5FB',
    iconColor: COLORS.primary,
  },
  {
    title: 'Revenus',
    value: '45,200 DH',
    subtitle: 'Ce mois-ci',
    trend: 'up',
    trendValue: '+8%',
    icon: RevenueIcon,
    bgColor: '#E8F8F5',
    iconColor: COLORS.success,
  },
  {
    title: 'Événements',
    value: '3',
    subtitle: 'Événements à venir',
    trend: 'up',
    trendValue: '+1',
    icon: CalendarIcon,
    bgColor: '#FEF5E7',
    iconColor: COLORS.accent,
  },
  {
    title: 'Dons',
    value: '15,300 DH',
    subtitle: 'Ce mois-ci',
    trend: 'down',
    trendValue: '-3%',
    icon: HeartIcon,
    bgColor: '#FDEDEC',
    iconColor: COLORS.danger,
  },
];

// --- Activity Data ---
const recentActivities: ActivityItem[] = [
  {
    id: 1,
    type: 'member',
    description: 'Nouvel adhérent : Ahmed Benani a rejoint l\'association',
    time: 'Il y a 2 heures',
    icon: UsersIcon,
    iconBg: '#EBF5FB',
  },
  {
    id: 2,
    type: 'donation',
    description: 'Don reçu de Fatima El Mansouri',
    time: 'Il y a 5 heures',
    amount: '2,500 DH',
    icon: HeartIcon,
    iconBg: '#FDEDEC',
  },
  {
    id: 3,
    type: 'event',
    description: 'Événement créé : Assemblée Générale Annuelle',
    time: 'Hier',
    icon: CalendarIcon,
    iconBg: '#FEF5E7',
  },
  {
    id: 4,
    type: 'payment',
    description: 'Paiement facture : Location salle communautaire',
    time: 'Il y a 2 jours',
    amount: '1,200 DH',
    icon: RevenueIcon,
    iconBg: '#E8F8F5',
  },
];

// --- Financial Chart Placeholder ---
const FinancialChartPlaceholder: React.FC = () => (
  <div
    style={{
      background: COLORS.card,
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #E8E8E8',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: COLORS.text }}>
          Vue Financière
        </h3>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: COLORS.textLight }}>
          Revenus vs Dépenses — 6 derniers mois
        </p>
      </div>
      <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.success, display: 'inline-block' }} />
          Revenus
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.danger, display: 'inline-block' }} />
          Dépenses
        </span>
      </div>
    </div>

    {/* Bar Chart Placeholder */}
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', padding: '0 8px' }}>
      {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'].map((month, idx) => {
        const revenues = [32000, 28000, 41000, 35000, 45200, 38000];
        const expenses = [18000, 22000, 25000, 20000, 28000, 23000];
        const maxVal = 50000;
        const revHeight = (revenues[idx] / maxVal) * 100;
        const expHeight = (expenses[idx] / maxVal) * 100;

        return (
          <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
              <div
                style={{
                  width: '35%',
                  height: `${revHeight}%`,
                  background: COLORS.success,
                  borderRadius: '4px 4px 0 0',
                  minHeight: '8px',
                  transition: 'height 0.3s ease',
                  opacity: 0.9,
                }}
                title={`Revenus: ${revenues[idx].toLocaleString()} DH`}
              />
              <div
                style={{
                  width: '35%',
                  height: `${expHeight}%`,
                  background: COLORS.danger,
                  borderRadius: '4px 4px 0 0',
                  minHeight: '8px',
                  transition: 'height 0.3s ease',
                  opacity: 0.9,
                }}
                title={`Dépenses: ${expenses[idx].toLocaleString()} DH`}
              />
            </div>
            <span style={{ fontSize: '12px', color: COLORS.textLight }}>{month}</span>
          </div>
        );
      })}
    </div>

    {/* Summary Row */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
        padding: '16px',
        background: COLORS.bg,
        borderRadius: '8px',
        border: '1px solid #E8E8E8',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '12px', color: COLORS.textLight }}>Total Revenus</span>
        <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700, color: COLORS.success }}>
          219,200 DH
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '12px', color: COLORS.textLight }}>Total Dépenses</span>
        <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700, color: COLORS.danger }}>
          136,000 DH
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '12px', color: COLORS.textLight }}>Solde Net</span>
        <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700, color: COLORS.primary }}>
          83,200 DH
        </p>
      </div>
    </div>
  </div>
);

// --- Activity Icon Color Map ---
const activityIconColors: Record<string, string> = {
  member: COLORS.primary,
  donation: COLORS.danger,
  event: COLORS.accent,
  payment: COLORS.success,
};

// --- Dashboard Component ---
const Dashboard: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        padding: '32px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: COLORS.text }}>
          Tableau de Bord
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '15px', color: COLORS.textLight }}>
          Vue d'ensemble de votre association — AssociaMA
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === 'up' ? TrendUp : TrendDown;

          return (
            <div
              key={card.title}
              style={{
                background: COLORS.card,
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                border: '1px solid #E8E8E8',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: COLORS.textLight, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {card.title}
                  </p>
                  <p style={{ margin: '8px 0 4px', fontSize: '28px', fontWeight: 700, color: COLORS.text }}>
                    {card.value}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: COLORS.textLight }}>
                    {card.subtitle}
                  </p>
                </div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.iconColor,
                  }}
                >
                  <Icon />
                </div>
              </div>

              {/* Trend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F0F0F0' }}>
                <TrendIcon />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: card.trend === 'up' ? COLORS.success : COLORS.danger,
                  }}
                >
                  {card.trendValue}
                </span>
                <span style={{ fontSize: '12px', color: COLORS.textLight, marginLeft: '4px' }}>
                  vs mois dernier
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Activity + Chart */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Recent Activity */}
        <div
          style={{
            background: COLORS.card,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #E8E8E8',
          }}
        >
          <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 600, color: COLORS.text }}>
            Activité Récente
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {recentActivities.map((activity, index) => {
              const ActIcon = activity.icon;
              const iconColor = activityIconColors[activity.type] || COLORS.textLight;

              return (
                <div
                  key={activity.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px 0',
                    borderBottom: index < recentActivities.length - 1 ? '1px solid #F0F0F0' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: activity.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: iconColor,
                      flexShrink: 0,
                    }}
                  >
                    <ActIcon />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '14px', color: COLORS.text, lineHeight: 1.4 }}>
                      {activity.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', color: COLORS.textLight }}>
                        {activity.time}
                      </span>
                      {activity.amount && (
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: activity.type === 'donation' ? COLORS.success : COLORS.danger,
                            background: activity.type === 'donation' ? '#E8F8F5' : '#FDEDEC',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {activity.amount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Chart */}
        <FinancialChartPlaceholder />
      </div>
    </div>
  );
};

export default Dashboard;
