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
  logoUrl?: string | null;
  /** معلومات استقبال التبرعات (تظهر للعموم عند التفعيل) */
  donationsEnabled?: boolean;
  donationBankName?: string | null;
  donationRib?: string | null;
  donationCcp?: string | null;
  donationOnlineUrl?: string | null;
  donationInstructions?: string | null;
  acceptInKind?: boolean;
  inKindNeeds?: string | null;
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

export interface DemoProjectParticipant {
  name: string;
  /** ASSOCIATION (جمعية على المنصة) أو نوع الجهة الخارجية */
  type: string;
  role: string;
  status: string;
}

export interface DemoProject {
  id: string;
  title: string;
  description: string;
  objectives: string;
  /** EVENT | PROGRAM | PROJECT */
  kind: string;
  category: string;
  startDate: string | null;
  endDate: string | null;
  location: string;
  city: string;
  status: string;
  leadName: string;
  leadSlug: string;
  participants: DemoProjectParticipant[];
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
  projects: DemoProject[];
}

export type DemoStats = DemoData["stats"];
