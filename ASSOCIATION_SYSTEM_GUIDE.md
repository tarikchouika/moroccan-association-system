# نظام إدارة الجمعيات المغربية - دليل الإعداد الكامل

## Moroccan Association Management System - Complete Setup Guide

---

## 📌 مقدمة

هذا الدليل يحتوي على الإعداد الكامل لنظام إدارة الجمعيات وفقًا للقانون المغربي (ظهير 1958، القانون 75-00، وقانون حماية المعطيات الشخصية 09-08). يشمل:

- النموذج البياني (Prisma Schema) مع جميع العلاقات والفهارس.
- الـ Backend API (Node.js/Express) مع نظام المصادقة (JWT) والصلاحيات (RBAC).
- الواجهة الأمامية (React + TypeScript + Tailwind CSS) مع لوحة تحكم تفاعلية.
- الوثائق القانونية (نموذج إيصال التبرع، قائمة التصريح السنوي للسلطات المحلية).
- إدارة الأعضاء (CRUD كامل مع بحث وتصفية وترقيم).
- سكربت تعبئة قاعدة البيانات ببيانات تجريبية واقعية.

---

## 🗄️ 1. نموذج قاعدة البيانات (Prisma Schema)

### prisma/schema.prisma

```prisma
// ============================================================================
// Moroccan Association Management System - Prisma Schema
// Compliant with Dahir 1958, Law 75-00, and CNDP Law 09-08
// ============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// ENUMS
// ============================================================================

enum UserRole {
  admin
  treasurer
  board_member
  member
  guest
}

enum MembershipType {
  active
  honorary
  benefactor
  student
}

enum MemberStatus {
  active
  pending
  suspended
  resigned
}

enum AssemblyType {
  ordinary
  extraordinary
  constituent
}

enum AssemblyStatus {
  scheduled
  held
  cancelled
}

enum EventCategory {
  cultural
  training
  fundraising
  social
  meeting
  other
}

enum EventStatus {
  draft
  published
  cancelled
  completed
}

enum RegistrationStatus {
  registered
  attended
  cancelled
}

enum TransactionType {
  income
  expense
}

enum PaymentMethod {
  cash
  bank_transfer
  check
  online
}

enum BudgetStatus {
  draft
  approved
  archived
}

enum DonationType {
  donation
  sponsorship
  grant
}

enum SubscriptionStatus {
  active
  expired
  cancelled
}

enum DocumentType {
  statutes
  minutes
  annual_report
  financial_report
  other
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  EXPORT
}

// ============================================================================
// MODELS
// ============================================================================

model User {
  id                String    @id @default(uuid()) @map("id")
  email             String    @unique @map("email")
  passwordHash      String    @map("password_hash")
  firstName         String?   @map("first_name")
  lastName          String?   @map("last_name")
  phone             String?   @map("phone")
  profilePictureUrl String?   @map("profile_picture_url")
  role              UserRole  @default(member) @map("role")
  isActive          Boolean   @default(true) @map("is_active")
  lastLogin         DateTime? @map("last_login")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  member            Member?
  createdEvents     Event[]   @relation("EventCreator")
  approvedTx        Transaction[] @relation("TransactionApprover")
  uploadedDocs      Document[] @relation("DocumentUploader")
  auditLogs         AuditLog[]

  @@index([email])
  @@map("users")
}

model Member {
  id                String           @id @default(uuid()) @map("id")
  userId            String?          @unique @map("user_id")
  membershipNumber  String           @unique @map("membership_number")
  nationalId        String?          @map("national_id")
  firstName         String?          @map("first_name")
  lastName          String?          @map("last_name")
  dateOfBirth       DateTime?        @map("date_of_birth")
  address           String?          @map("address")
  city              String?          @map("city")
  profession        String?          @map("profession")
  membershipType    MembershipType   @default(active) @map("membership_type")
  joinedDate        DateTime         @map("joined_date")
  expiryDate        DateTime?        @map("expiry_date")
  status            MemberStatus     @default(active) @map("status")
  notes             String?          @map("notes")

  cndpConsent       Boolean          @default(false) @map("cndp_consent")
  cndpConsentDate   DateTime?        @map("cndp_consent_date")

  createdAt         DateTime         @default(now()) @map("created_at")
  updatedAt         DateTime         @updatedAt @map("updated_at")

  user              User?            @relation(fields: [userId], references: [id], onDelete: SetNull)
  boardMemberships  BoardMember[]
  assemblyAttendances AssemblyAttendance[]
  eventRegistrations EventRegistration[]
  transactions      Transaction[]
  subscriptions     MemberSubscription[]

  @@index([membershipNumber])
  @@index([nationalId])
  @@index([status])
  @@map("members")
}

model BoardPosition {
  id          String        @id @default(uuid()) @map("id")
  name        String        @map("name")
  description String?       @map("description")

  boardMembers BoardMember[]

  @@map("board_positions")
}

model BoardMember {
  id            String   @id @default(uuid()) @map("id")
  memberId      String   @map("member_id")
  positionId    String   @map("position_id")
  electionDate  DateTime @map("election_date")
  termEndDate   DateTime? @map("term_end_date")
  isActive      Boolean  @default(true) @map("is_active")
  createdAt     DateTime @default(now()) @map("created_at")

  member        Member         @relation(fields: [memberId], references: [id], onDelete: Cascade)
  position      BoardPosition  @relation(fields: [positionId], references: [id])

  @@unique([memberId, positionId])
  @@map("board_members")
}

model GeneralAssembly {
  id              String         @id @default(uuid()) @map("id")
  title           String         @map("title")
  type            AssemblyType   @map("type")
  date            DateTime       @map("date")
  startTime       DateTime?      @map("start_time")
  endTime         DateTime?      @map("end_time")
  location        String?        @map("location")
  agenda          String?        @map("agenda")
  quorumRequired  Int?           @map("quorum_required")
  quorumAchieved  Int?           @map("quorum_achieved")
  minutes         String?        @map("minutes")
  status          AssemblyStatus @default(scheduled) @map("status")
  createdAt       DateTime       @default(now()) @map("created_at")
  updatedAt       DateTime       @updatedAt @map("updated_at")

  attendances     AssemblyAttendance[]
  documents       Document[]     @relation("RelatedDocuments")

  @@map("general_assemblies")
}

model AssemblyAttendance {
  id         String   @id @default(uuid()) @map("id")
  assemblyId String   @map("assembly_id")
  memberId   String   @map("member_id")
  attended   Boolean  @default(false) @map("attended")
  voted      Boolean  @default(false) @map("voted")

  assembly   GeneralAssembly @relation(fields: [assemblyId], references: [id], onDelete: Cascade)
  member     Member          @relation(fields: [memberId], references: [id], onDelete: Cascade)

  @@unique([assemblyId, memberId])
  @@map("assembly_attendances")
}

model Event {
  id              String        @id @default(uuid()) @map("id")
  title           String        @map("title")
  description     String?       @map("description")
  category        EventCategory @map("category")
  startDate       DateTime      @map("start_date")
  endDate         DateTime?     @map("end_date")
  location        String?       @map("location")
  maxParticipants Int?          @map("max_participants")
  isPublic        Boolean       @default(false) @map("is_public")
  status          EventStatus   @default(draft) @map("status")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  createdById     String?       @map("created_by")
  createdBy       User?         @relation("EventCreator", fields: [createdById], references: [id])

  registrations   EventRegistration[]
  transactions    Transaction[]

  @@index([startDate])
  @@index([status])
  @@map("events")
}

model EventRegistration {
  id              String           @id @default(uuid()) @map("id")
  eventId         String           @map("event_id")
  memberId        String           @map("member_id")
  registrationDate DateTime        @default(now()) @map("registration_date")
  status          RegistrationStatus @default(registered) @map("status")

  event           Event            @relation(fields: [eventId], references: [id], onDelete: Cascade)
  member          Member           @relation(fields: [memberId], references: [id], onDelete: Cascade)

  @@unique([eventId, memberId])
  @@map("event_registrations")
}

model AccountingCategory {
  id          String              @id @default(uuid()) @map("id")
  name        String              @map("name")
  type        TransactionType     @map("type")
  code        String?             @map("code")
  parentId    String?             @map("parent_id")

  parent      AccountingCategory? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    AccountingCategory[] @relation("CategoryHierarchy")

  transactions Transaction[]
  budgetLines  BudgetLine[]

  @@map("accounting_categories")
}

model Transaction {
  id                    String        @id @default(uuid()) @map("id")
  date                  DateTime      @map("date")
  description           String        @map("description")
  amount                Decimal       @db.Decimal(15, 2) @map("amount")
  type                  TransactionType @map("type")
  categoryId            String?       @map("category_id")
  paymentMethod         PaymentMethod @default(cash) @map("payment_method")
  reference             String?       @map("reference")
  receiptNumber         String?       @map("receipt_number")
  memberId              String?       @map("member_id")
  eventId               String?       @map("event_id")
  approvedById          String?       @map("approved_by")
  supportingDocumentUrl String?       @map("supporting_document_url")
  notes                 String?       @map("notes")
  createdAt             DateTime      @default(now()) @map("created_at")
  updatedAt             DateTime      @updatedAt @map("updated_at")

  category        AccountingCategory? @relation(fields: [categoryId], references: [id])
  member          Member?             @relation(fields: [memberId], references: [id], onDelete: SetNull)
  event           Event?              @relation(fields: [eventId], references: [id], onDelete: SetNull)
  approvedBy      User?               @relation("TransactionApprover", fields: [approvedById], references: [id])

  @@index([date])
  @@index([type])
  @@index([memberId])
  @@map("transactions")
}

model Budget {
  id            String       @id @default(uuid()) @map("id")
  name          String       @map("name")
  fiscalYear    Int          @map("fiscal_year")
  totalIncome   Decimal      @default(0) @db.Decimal(15, 2) @map("total_income")
  totalExpenses Decimal      @default(0) @db.Decimal(15, 2) @map("total_expenses")
  status        BudgetStatus @default(draft) @map("status")
  approvedAt    DateTime?    @map("approved_at")
  createdAt     DateTime     @default(now()) @map("created_at")
  updatedAt     DateTime     @updatedAt @map("updated_at")

  lines         BudgetLine[]

  @@unique([fiscalYear])
  @@map("budgets")
}

model BudgetLine {
  id            String   @id @default(uuid()) @map("id")
  budgetId      String   @map("budget_id")
  categoryId    String?  @map("category_id")
  plannedAmount Decimal  @db.Decimal(15, 2) @map("planned_amount")
  actualAmount  Decimal  @default(0) @db.Decimal(15, 2) @map("actual_amount")
  notes         String?  @map("notes")

  budget        Budget             @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  category      AccountingCategory? @relation(fields: [categoryId], references: [id])

  @@map("budget_lines")
}

model Donation {
  id            String       @id @default(uuid()) @map("id")
  donorName     String       @map("donor_name")
  donorEmail    String?      @map("donor_email")
  donorPhone    String?      @map("donor_phone")
  amount        Decimal      @db.Decimal(15, 2) @map("amount")
  date          DateTime     @map("date")
  type          DonationType @map("type")
  isAnonymous   Boolean      @default(false) @map("is_anonymous")
  receiptIssued Boolean      @default(false) @map("receipt_issued")
  receiptNumber String?      @map("receipt_number")
  notes         String?      @map("notes")
  createdAt     DateTime     @default(now()) @map("created_at")

  @@index([date])
  @@map("donations")
}

model SubscriptionType {
  id              String             @id @default(uuid()) @map("id")
  name            String             @map("name")
  amount          Decimal            @db.Decimal(15, 2) @map("amount")
  durationMonths  Int                @map("duration_months")
  description     String?            @map("description")

  subscriptions   MemberSubscription[]

  @@map("subscription_types")
}

model MemberSubscription {
  id                 String             @id @default(uuid()) @map("id")
  memberId           String             @map("member_id")
  subscriptionTypeId String             @map("subscription_type_id")
  startDate          DateTime           @map("start_date")
  endDate            DateTime           @map("end_date")
  amountPaid         Decimal?           @db.Decimal(15, 2) @map("amount_paid")
  paymentDate        DateTime?          @map("payment_date")
  status             SubscriptionStatus @default(active) @map("status")
  createdAt          DateTime           @default(now()) @map("created_at")

  member           Member           @relation(fields: [memberId], references: [id], onDelete: Cascade)
  subscriptionType SubscriptionType @relation(fields: [subscriptionTypeId], references: [id])

  @@index([memberId])
  @@index([endDate])
  @@map("member_subscriptions")
}

model Document {
  id                String       @id @default(uuid()) @map("id")
  title             String       @map("title")
  type              DocumentType @map("type")
  fileUrl           String       @map("file_url")
  version           Int          @default(1) @map("version")
  relatedEntityType String?      @map("related_entity_type")
  relatedEntityId   String?      @map("related_entity_id")
  isPublic          Boolean      @default(false) @map("is_public")
  createdAt         DateTime     @default(now()) @map("created_at")
  updatedAt         DateTime     @updatedAt @map("updated_at")

  uploadedById      String?      @map("uploaded_by")
  uploadedBy        User?        @relation("DocumentUploader", fields: [uploadedById], references: [id])

  assembly          GeneralAssembly? @relation("RelatedDocuments", fields: [relatedEntityId], references: [id])

  @@map("documents")
}

model AuditLog {
  id        String      @id @default(uuid()) @map("id")
  userId    String?     @map("user_id")
  action    AuditAction @map("action")
  tableName String      @map("table_name")
  recordId  String?     @map("record_id")
  oldValues Json?       @map("old_values")
  newValues Json?       @map("new_values")
  ipAddress String?     @map("ip_address")
  userAgent String?     @map("user_agent")
  createdAt DateTime    @default(now()) @map("created_at")

  user      User?       @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([tableName, recordId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## 🛠️ خطوات تهيئة Prisma

```bash
# تثبيت Prisma
npm install prisma --save-dev
npm install @prisma/client

# تهيئة Prisma
npx prisma init

# استبدل محتوى schema.prisma بالكود أعلاه
# ثم قم بتعيين متغير DATABASE_URL في ملف .env

# إنشاء الهجرة ونشرها
npx prisma generate
npx prisma migrate dev --name init_schema
```

---

## 🚀 2. الـ Backend API (Node.js + Express + JWT + RBAC)

### هيكل المشروع

```
src/
├── middleware/
│   ├── auth.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── members.controller.ts
├── routes/
│   ├── auth.routes.ts
│   ├── members.routes.ts
├── utils/
│   └── jwt.ts
├── index.ts
```

### تثبيت الاعتماديات

```bash
npm install express cors dotenv jsonwebtoken bcryptjs @prisma/client zod
npm install -D typescript @types/node @types/express @types/jsonwebtoken @types/bcryptjs ts-node-dev
```

### src/utils/jwt.ts

```typescript
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-moroccan-association-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
```

### src/middleware/auth.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token' } });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token expired or invalid' } });
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action' }
      });
    }
    next();
  };
};
```

### src/controllers/auth.controller.ts

```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    const token = generateToken({ userId: user.id, role: user.role });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { member: true }
    });

    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};
```

### src/routes/auth.routes.ts

```typescript
import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/admin-only', authenticate, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Welcome, Admin!' });
});

export default router;
```

### src/index.ts

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import membersRoutes from './routes/members.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/members', membersRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Association API is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### تشغيل الـ Backend

```bash
npx ts-node-dev --respawn --transpile-only src/index.ts
```

---

## 🎨 3. الواجهة الأمامية (React + TypeScript + Tailwind CSS)

### هيكل المشروع

```
frontend/
├── components/
│   └── Layout/
│       ├── Sidebar.tsx
│       ├── Topbar.tsx
│       └── DashboardLayout.tsx
├── pages/
│   ├── Dashboard.tsx
│   └── Members.tsx
├── App.tsx
└── main.tsx
```

### تثبيت الاعتماديات

```bash
npm install react-router-dom lucide-react clsx tailwind-merge
```

### frontend/components/Layout/Sidebar.tsx

```tsx
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Wallet, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Tableau de Bord', icon: Home, path: '/dashboard' },
  { name: 'Adhérents', icon: Users, path: '/members' },
  { name: 'Événements', icon: Calendar, path: '/events' },
  { name: 'Finances', icon: Wallet, path: '/finance' },
  { name: 'Documents', icon: FileText, path: '/documents' },
  { name: 'Paramètres', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1A5276] text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-center h-16 border-b border-blue-800">
          <h1 className="text-xl font-bold tracking-wide">AssociaMA</h1>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#F39C12] text-white font-semibold'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-blue-800">
          <button className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-blue-800 hover:text-red-100 rounded-lg w-full transition-colors">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
```

### frontend/components/Layout/Topbar.tsx

```tsx
import { Bell, Globe } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-4 lg:ml-0 ml-12">
        <h2 className="text-xl font-semibold text-gray-800">Tableau de Bord</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          <Globe size={16} />
          <span>FR</span>
        </button>

        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Ahmed El Amrani</p>
            <p className="text-xs text-gray-500">Administrateur</p>
          </div>
          <div className="w-10 h-10 bg-[#1A5276] rounded-full flex items-center justify-center text-white font-bold">
            AE
          </div>
        </div>
      </div>
    </header>
  );
}
```

### frontend/components/Layout/DashboardLayout.tsx

```tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### frontend/pages/Dashboard.tsx

```tsx
import { Users, Wallet, Calendar, Heart, TrendingUp, TrendingDown } from 'lucide-react';

const stats = [
  {
    title: 'Adhérents Actifs',
    value: '245',
    change: '+12 ce mois',
    icon: Users,
    color: 'bg-blue-500',
    trend: 'up'
  },
  {
    title: 'Revenus (Année)',
    value: '45,200 DH',
    change: '+8% vs 2025',
    icon: Wallet,
    color: 'bg-green-500',
    trend: 'up'
  },
  {
    title: 'Événements à venir',
    value: '3',
    change: 'Prochaine: AG 2026',
    icon: Calendar,
    color: 'bg-[#F39C12]',
    trend: 'neutral'
  },
  {
    title: 'Dons Reçus',
    value: '15,300 DH',
    change: '5 reçus fiscaux en attente',
    icon: Heart,
    color: 'bg-red-500',
    trend: 'up'
  },
];

const recentActivities = [
  { action: 'Nouvel adhérent inscrit', detail: 'Fatima Z. (MEM-2026-046)', time: 'Il y a 2h' },
  { action: 'Paiement de cotisation reçu', detail: '500 DH - Ahmed E. (Virement)', time: 'Il y a 5h' },
  { action: 'Document mis à jour', detail: 'Statuts de l\'association v3.1', time: 'Hier' },
  { action: 'Événement créé', detail: 'Atelier de Formation - 15 Août', time: 'Hier' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              {stat.trend === 'up' && <TrendingUp size={16} className="text-green-500" />}
              {stat.trend === 'down' && <TrendingDown size={16} className="text-red-500" />}
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité Récente</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#1A5276] flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.detail}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Revenus vs Dépenses (2026)</h3>
            <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-[#1A5276] focus:ring-[#1A5276]">
              <option>Cette année</option>
              <option>2025</option>
            </select>
          </div>

          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center text-gray-400">
              <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Graphique financier (Intégrer Recharts ici)</p>
            </div>
          </div>

          <div className="mt-4 flex gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Revenus (62,400 DH)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Dépenses (28,150 DH)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 👥 4. إدارة الأعضاء (CRUD كامل)

### src/controllers/members.controller.ts

```typescript
import { Request, Response } from 'express';
import { PrismaClient, MemberStatus, MembershipType } from '@prisma/client';

const prisma = new PrismaClient();

export const getMembers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const status = req.query.status as MemberStatus;
    const type = req.query.membershipType as MembershipType;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { membershipNumber: { contains: search, mode: 'insensitive' } },
        { nationalId: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (type) where.membershipType = type;

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: { joinedDate: 'desc' },
        include: {
          user: { select: { email: true, phone: true } },
          subscriptions: {
            where: { status: 'active' },
            take: 1,
            orderBy: { startDate: 'desc' },
            include: { subscriptionType: true }
          }
        }
      }),
      prisma.member.count({ where })
    ]);

    res.json({
      success: true,
      data: members,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch members' } });
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, phone: true } },
        subscriptions: {
          include: { subscriptionType: true },
          orderBy: { startDate: 'desc' }
        },
        boardMemberships: {
          include: { position: true }
        }
      }
    });

    if (!member) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Member not found' } });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch member' } });
  }
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const {
      firstName, lastName, nationalId, dateOfBirth, address, city, profession,
      membershipType, cndpConsent
    } = req.body;

    // Generate membership number
    const lastMember = await prisma.member.findFirst({
      orderBy: { membershipNumber: 'desc' }
    });

    let nextNumber = 1;
    if (lastMember) {
      const lastNum = parseInt(lastMember.membershipNumber.split('-').pop() || '0');
      nextNumber = lastNum + 1;
    }

    const membershipNumber = `MEM-${new Date().getFullYear()}-${String(nextNumber).padStart(4, '0')}`;

    const member = await prisma.member.create({
      data: {
        membershipNumber,
        firstName,
        lastName,
        nationalId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address,
        city,
        profession,
        membershipType: membershipType || 'active',
        joinedDate: new Date(),
        cndpConsent: cndpConsent || false,
        cndpConsentDate: cndpConsent ? new Date() : null
      }
    });

    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create member' } });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const member = await prisma.member.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update member' } });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.member.delete({ where: { id } });

    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to delete member' } });
  }
};
```

### src/routes/members.routes.ts

```typescript
import { Router } from 'express';
import { getMembers, getMemberById, createMember, updateMember, deleteMember } from '../controllers/members.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('admin', 'treasurer', 'board_member'), getMembers);
router.get('/:id', authenticate, authorize('admin', 'treasurer', 'board_member'), getMemberById);
router.post('/', authenticate, authorize('admin'), createMember);
router.put('/:id', authenticate, authorize('admin'), updateMember);
router.delete('/:id', authenticate, authorize('admin'), deleteMember);

export default router;
```

### frontend/pages/Members.tsx

```tsx
import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, UserCheck, UserX, Clock } from 'lucide-react';

interface Member {
  id: string;
  membershipNumber: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  status: 'active' | 'pending' | 'suspended';
  membershipType: 'active' | 'honorary' | 'student' | 'benefactor';
  joinedDate: string;
  user?: { email: string; phone: string };
  subscriptions?: { subscriptionType: { name: string } }[];
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 0 });

  useEffect(() => {
    fetchMembers();
  }, [page, search, statusFilter]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));

      const mockData: Member[] = [
        { id: '1', membershipNumber: 'MEM-2026-0001', firstName: 'Ahmed', lastName: 'El Amrani', nationalId: 'AB123456', status: 'active', membershipType: 'active', joinedDate: '2026-01-15', user: { email: 'ahmed@test.ma', phone: '0612345678' }, subscriptions: [{ subscriptionType: { name: 'Annuelle' } }] },
        { id: '2', membershipNumber: 'MEM-2026-0002', firstName: 'Fatima', lastName: 'Zahra', nationalId: 'CD789012', status: 'active', membershipType: 'student', joinedDate: '2026-02-10' },
        { id: '3', membershipNumber: 'MEM-2026-0003', firstName: 'Youssef', lastName: 'Benali', nationalId: 'EF345678', status: 'pending', membershipType: 'active', joinedDate: '2026-07-20' },
        { id: '4', membershipNumber: 'MEM-2026-0004', firstName: 'Amina', lastName: 'Hassani', nationalId: 'GH901234', status: 'active', membershipType: 'honorary', joinedDate: '2026-03-05' },
        { id: '5', membershipNumber: 'MEM-2026-0005', firstName: 'Omar', lastName: 'Chraibi', nationalId: 'IJ567890', status: 'active', membershipType: 'active', joinedDate: '2026-04-12' },
      ];

      setMembers(mockData);
      setMeta({ total: 245, totalPages: 13 });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    const icons: Record<string, JSX.Element> = {
      active: <UserCheck size={14} />,
      pending: <Clock size={14} />,
      suspended: <UserX size={14} />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.active}`}>
        {icons[status] || icons.active}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Adhérents</h1>
          <p className="text-gray-500 text-sm">{meta.total} adhérents enregistrés</p>
        </div>
        <button className="px-4 py-2 bg-[#1A5276] text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2 shadow-sm">
          <span>+</span> Nouvel Adhérent
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom, CIN, ou N° adhérent..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A5276] focus:border-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A5276] outline-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendu</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">N° Adhérent</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom & Prénom</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">CIN</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date d'adhésion</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Chargement...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Aucun adhérent trouvé.</td></tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-[#1A5276] font-medium">{member.membershipNumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{member.firstName} {member.lastName}</div>
                      {member.user?.email && <div className="text-xs text-gray-500">{member.user.email}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{member.nationalId || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{member.membershipType}</td>
                    <td className="px-6 py-4">{getStatusBadge(member.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(member.joinedDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#1A5276] hover:text-blue-800 text-sm font-medium mr-3">Voir</button>
                      <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">Modifier</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium">{page}</span> sur <span className="font-medium">{meta.totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Précédent
            </button>
            <button
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Suivant <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📜 5. الوثائق القانونية المغربية

### نموذج "إيصال التبرع" (Reçu de Donation)

```html
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="UTF-8">
  <title>Reçu de Donation - {{receiptNumber}}</title>
  <style>
    body { font-family: 'Arial', sans-serif; color: #2C3E50; padding: 40px; line-height: 1.6; }
    .header { text-align: center; border-bottom: 3px solid #1A5276; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #1A5276; margin: 0; font-size: 24px; }
    .header p { margin: 5px 0; font-size: 14px; color: #555; }
    .receipt-title { text-align: center; font-size: 20px; font-weight: bold; margin: 30px 0; text-transform: uppercase; letter-spacing: 1px; }
    .content { font-size: 16px; text-align: justify; margin-bottom: 40px; }
    .amount-box { background: #F8F9FA; border: 1px dashed #1A5276; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; color: #1A5276; margin: 20px 0; }
    .footer { margin-top: 60px; display: flex; justify-content: space-between; }
    .signature-block { text-align: center; width: 45%; }
    .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 10px; }
    .legal-note { font-size: 11px; color: #777; text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{associationName}}</h1>
    <p>{{associationAddress}}</p>
    <p>Tél: {{associationPhone}} | Email: {{associationEmail}}</p>
    <p><strong>Agrément N°:</strong> {{agrementNumber}} | <strong>IF:</strong> {{identifiantFiscal}}</p>
  </div>

  <div class="receipt-title">Reçu de Donation N° {{receiptNumber}}</div>

  <div class="content">
    <p><strong>Date :</strong> {{date}}</p>
    <p><strong>Lieu :</strong> {{city}}, Maroc</p>
    <br>
    <p>Je soussigné(e), <strong>{{treasurerName}}</strong>, agissant en qualité de Trésorier(ère) de l'association <strong>{{associationName}}</strong>, reconnais avoir reçu de :</p>

    <p style="margin-left: 20px;">
      <strong>Nom et Prénom / Raison Sociale :</strong> {{donorName}}<br>
      <strong>CIN / Passeport / ICE N° :</strong> {{donorId}}<br>
      <strong>Adresse :</strong> {{donorAddress}}
    </p>

    <p>La somme de :</p>
    <div class="amount-box">
      {{amountInNumbers}} DH (<span style="font-style: italic; font-weight: normal;">{{amountInLetters}} Dirhams</span>)
    </div>

    <p>À titre de donation volontaire, sans contrepartie, destinée à soutenir les projets et activités de notre association.</p>
  </div>

  <div class="footer">
    <div class="signature-block">
      <p><strong>Le Donateur</strong></p>
      <div class="signature-line">Signature et cachet</div>
    </div>
    <div class="signature-block">
      <p><strong>Le Trésorier(ère)</strong></p>
      <div class="signature-line">Signature et cachet de l'association</div>
    </div>
  </div>

  <div class="legal-note">
    Ce reçu est délivré au donateur pour servir et valoir ce que de droit, notamment pour la déduction fiscale prévue par l'article 145 du Code Général des Impôts (CGI) marocain.
    <br>L'association est agréée par le Ministère de l'Intérieur / la Préfecture de {{city}}.
  </div>
</body>
</html>
```

### قائمة التصريح السنوي للسلطات المحلية

يجب على الجمعية تقديم الملف التالي سنويًا (وفقًا للقانون 75-00):

1. **PV de l'Assemblée Générale Ordinaire (AGO)** - موقع من الرئيس والكاتب العام.
2. **Rapport Moral et Rapport d'Activités** - يصف أعمال الجمعية خلال السنة الماضية.
3. **Rapport Financier et Bilan** - معتمد من الجمعية العامة العمومية.
4. **Liste mise à jour des membres du Bureau** - الاسم الكامل، رقم البطاقة الوطنية، العنوان، تاريخ الميلاد، والمنصب.
5. **Copie des Statuts (si modifiés)** - يطلب فقط في حالة تعديل النظام الأساسي.
6. **Formulaire de déclaration de modification** - النموذج الرسمي من الولاية/العمالة.
7. **Copie de la CIN du Président** - نسخة مطابقة للأصل (مصادق عليها).

---

## 🌱 6. سكربت تعبئة قاعدة البيانات (Seed Script)

### الإعداد

أضف هذا القسم في package.json:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

ثم قم بتثبيت ts-node:

```bash
npm install -D ts-node
```

### prisma/seed.ts

```typescript
import { PrismaClient, UserRole, MembershipType, MemberStatus, TransactionType, PaymentMethod, DonationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
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

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Create Users & Members
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@associa.ma',
      passwordHash,
      firstName: 'Admin',
      lastName: 'System',
      role: UserRole.admin,
      member: {
        create: {
          membershipNumber: 'MEM-2024-001',
          nationalId: 'AD000001',
          firstName: 'Admin',
          lastName: 'System',
          status: MemberStatus.active,
          membershipType: MembershipType.active,
          joinedDate: new Date('2024-01-01'),
          cndpConsent: true,
          cndpConsentDate: new Date()
        }
      }
    }
  });

  const treasurerUser = await prisma.user.create({
    data: {
      email: 'tresorier@associa.ma',
      passwordHash,
      firstName: 'Khadija',
      lastName: 'Tazi',
      role: UserRole.treasurer,
      member: {
        create: {
          membershipNumber: 'MEM-2024-002',
          nationalId: 'KT987654',
          firstName: 'Khadija',
          lastName: 'Tazi',
          status: MemberStatus.active,
          membershipType: MembershipType.active,
          joinedDate: new Date('2024-01-01'),
          cndpConsent: true,
          cndpConsentDate: new Date()
        }
      }
    }
  });

  // Create 10 regular members
  const membersData = [
    { firstName: 'Ahmed', lastName: 'El Amrani', cin: 'AB123456', city: 'Casablanca', type: MembershipType.active },
    { firstName: 'Fatima', lastName: 'Zahra', cin: 'CD789012', city: 'Rabat', type: MembershipType.student },
    { firstName: 'Youssef', lastName: 'Benali', cin: 'EF345678', city: 'Marrakech', type: MembershipType.active },
    { firstName: 'Amina', lastName: 'Hassani', cin: 'GH901234', city: 'Fès', type: MembershipType.honorary },
    { firstName: 'Omar', lastName: 'Chraibi', cin: 'IJ567890', city: 'Tanger', type: MembershipType.active },
    { firstName: 'Salma', lastName: 'Idrissi', cin: 'KL234567', city: 'Agadir', type: MembershipType.active },
    { firstName: 'Mehdi', lastName: 'Alaoui', cin: 'MN890123', city: 'Oujda', type: MembershipType.student },
    { firstName: 'Nadia', lastName: 'Berrada', cin: 'OP456789', city: 'Casablanca', type: MembershipType.active },
    { firstName: 'Karim', lastName: 'Ziani', cin: 'QR012345', city: 'Meknès', type: MembershipType.benefactor },
    { firstName: 'Leila', lastName: 'Bennani', cin: 'ST678901', city: 'Rabat', type: MembershipType.active },
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
        city: data.city,
        membershipType: data.type,
        status: i === 7 ? MemberStatus.pending : MemberStatus.active,
        joinedDate: new Date(2026, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1),
        cndpConsent: true,
        cndpConsentDate: new Date()
      }
    });
    members.push(member);
  }

  // Board Positions & Board Members
  const positions = await Promise.all([
    prisma.boardPosition.create({ data: { name: 'Président(e)', description: 'Représentant légal de l\'association' } }),
    prisma.boardPosition.create({ data: { name: 'Secrétaire Général(e)', description: 'Gestion administrative et PV' } }),
    prisma.boardPosition.create({ data: { name: 'Trésorier(ère)', description: 'Gestion financière et comptable' } }),
  ]);

  await prisma.boardMember.createMany({
    data: [
      { memberId: members[0].id, positionId: positions[0].id, electionDate: new Date('2025-12-15') },
      { memberId: members[1].id, positionId: positions[1].id, electionDate: new Date('2025-12-15') },
      { memberId: treasurerUser.member!.id, positionId: positions[2].id, electionDate: new Date('2025-12-15') },
    ]
  });

  // Accounting Categories
  const incomeCategories = await Promise.all([
    prisma.accountingCategory.create({ data: { name: 'Cotisations', type: TransactionType.income, code: '751' } }),
    prisma.accountingCategory.create({ data: { name: 'Dons et Legs', type: TransactionType.income, code: '754' } }),
    prisma.accountingCategory.create({ data: { name: 'Subventions', type: TransactionType.income, code: '756' } }),
  ]);

  const expenseCategories = await Promise.all([
    prisma.accountingCategory.create({ data: { name: 'Frais de bureau', type: TransactionType.expense, code: '606' } }),
    prisma.accountingCategory.create({ data: { name: 'Événements & Activités', type: TransactionType.expense, code: '625' } }),
    prisma.accountingCategory.create({ data: { name: 'Communication', type: TransactionType.expense, code: '626' } }),
  ]);

  // Subscription Types
  await Promise.all([
    prisma.subscriptionType.create({ data: { name: 'Cotisation Annuelle', amount: 500, durationMonths: 12 } }),
    prisma.subscriptionType.create({ data: { name: 'Cotisation Étudiant', amount: 200, durationMonths: 12 } }),
  ]);

  // Mock Transactions
  const transactionsData = [
    { desc: 'Cotisation Ahmed El Amrani 2026', amount: 500, type: TransactionType.income, catId: incomeCategories[0].id, memberId: members[0].id, method: PaymentMethod.bank_transfer },
    { desc: 'Subvention Ministère Jeunesse & Sports', amount: 25000, type: TransactionType.income, catId: incomeCategories[2].id, method: PaymentMethod.bank_transfer },
    { desc: 'Achat fournitures bureau', amount: 1200, type: TransactionType.expense, catId: expenseCategories[0].id, method: PaymentMethod.cash },
    { desc: 'Location salle AG 2026', amount: 3500, type: TransactionType.expense, catId: expenseCategories[1].id, method: PaymentMethod.check },
    { desc: 'Cotisation Fatima Zahra 2026', amount: 200, type: TransactionType.income, catId: incomeCategories[0].id, memberId: members[1].id, method: PaymentMethod.cash },
  ];

  for (const tx of transactionsData) {
    await prisma.transaction.create({
      data: {
        date: new Date(2026, 6, Math.floor(Math.random() * 27) + 1),
        description: tx.desc,
        amount: tx.amount,
        type: tx.type,
        categoryId: tx.catId,
        paymentMethod: tx.method,
        memberId: tx.memberId,
        approvedById: adminUser.id
      }
    });
  }

  // Mock Donations
  await prisma.donation.create({
    data: {
      donorName: 'Fondation Hightech Maroc',
      amount: 50000,
      date: new Date('2026-05-10'),
      type: DonationType.grant,
      receiptIssued: true,
      receiptNumber: 'REC-2026-001'
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('🔑 Login Credentials:');
  console.log('   Admin: admin@associa.ma / Password123!');
  console.log('   Treasurer: tresorier@associa.ma / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### تشغيل سكربت التعبئة

```bash
npx prisma db seed
```

---

## 🔗 الربط بين الواجهة والـ Backend

1. **تيار المصادقة**: الواجهة ترسل POST /api/v1/auth/login → Backend يرسل JWT.
2. **الطلبات المحمية**: كل طلب يحمل Authorization: Bearer <token>.
3. **إدارة الصلاحيات**: authorize('admin', 'treasurer') لحماية المسارات الحساسة.

---

## 🚀 ملخص التنفيذ

1. تهيئة قاعدة البيانات: `npx prisma migrate dev`
2. تعبئة البيانات التجريبية: `npx prisma db seed`
3. تشغيل الـ Backend: `npx ts-node-dev src/index.ts`
4. تشغيل الواجهة: `npm run dev`
5. تسجيل الدخول: `admin@associa.ma / Password123!`

---

## 📝 الخاتمة

هذا النظام يوفر كل ما تحتاجه لإدارة جمعية في المغرب وفقًا للقوانين المحلية. يمكن البدء في تطوير وحدات إضافية (الفعاليات، التقارير المالية، التصريحات الإلكترونية، دفع الفواتير عبر CMI، إلخ) بناءً على هذا الأساس.
