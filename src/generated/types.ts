/** أنواع البيانات العمومية المولدة آلياً */

export interface DemoAssociation {
  slug: string;
  name: string;
  acronym: string;
  category: string;
  city: string;
  region: string;
  description: string;
  mission: string;
  foundedAt: string | null;
  legalStatus: string;
  isVerified: boolean;
  viewCount: number;
  memberCount: number;
  donationCount: number;
  iceNumber: string | null;
}

export interface DemoEvent {
  id: string;
  title: string;
  category: string;
  startDate: string;
  location: string;
  city: string;
  maxParticipants: number | null;
  associationName: string;
  associationSlug: string;
}

export interface DemoData {
  generatedAt: string;
  stats: {
    users: number;
    associations: number;
    activeMembers: number;
    transactions: number;
    donations: number;
    managedAmount: number;
  };
  associations: DemoAssociation[];
  events: DemoEvent[];
}

export interface DemoStats extends DemoData["stats"] {}
