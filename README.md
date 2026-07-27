# 🏛️ AssociaMA - نظام إدارة الجمعيات المغربية

Moroccan Association Management System - Complete Setup Guide

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📌 About

A comprehensive association management system built in compliance with Moroccan law:
- **Dahir 1958** - Association governance
- **Law 75-00** - Annual declarations to authorities
- **Law 09-08 CNDP** - Personal data protection

## 🚀 Features

- ✅ **Authentication** - JWT-based with RBAC (Admin, Treasurer, Board Member, Member)
- ✅ **Members Management** - Full CRUD with search, filter, pagination
- ✅ **Financial Tracking** - Transactions, budgets, accounting categories
- ✅ **Events & Assemblies** - General assemblies, event registrations
- ✅ **Document Management** - Legal documents, statutes, minutes
- ✅ **Donation Receipts** - Tax-compliant receipts (Article 145 CGI)
- ✅ **Annual Declarations** - Préfecture declaration checklist

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js + Express + TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Frontend** | React + TypeScript + Tailwind CSS |
| **Auth** | JWT + bcryptjs |
| **Build** | Vite |

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Run Prisma migrations
npx prisma generate
npx prisma migrate dev --name init_schema

# Seed the database
npx prisma db seed

# Start the server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@associa.ma | Password123! |
| Treasurer | tresorier@associa.ma | Password123! |

## 📁 Project Structure

```
moroccan-association-system/
├── prisma/
│   ├── schema.prisma      # Database schema (16 models, 15 enums)
│   └── seed.ts            # Database seeder with Moroccan data
├── src/
│   ├── controllers/       # Business logic
│   ├── middleware/         # Auth & RBAC
│   ├── routes/            # API endpoints
│   └── utils/             # JWT helpers
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   └── pages/         # Page components
│   └── ...
└── public/templates/      # Legal document templates
```

## 📜 Legal Documents

- **Donation Receipt** (`recu-donation.html`) - Tax-compliant receipt for donors
- **Annual Declaration Checklist** (`ANNUAL_DECLARATION_CHECKLIST.md`) - Required documents for Préfecture

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Get current user |

### Members
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/members` | List members (paginated) | Admin, Treasurer, Board |
| GET | `/api/v1/members/:id` | Get member details | Admin, Treasurer, Board |
| POST | `/api/v1/members` | Create member | Admin |
| PUT | `/api/v1/members/:id` | Update member | Admin |
| DELETE | `/api/v1/members/:id` | Delete member | Admin |

## 🇲🇦 Moroccan Compliance

- **Membership Numbers**: Auto-generated format `MEM-YYYY-NNNN`
- **CNDP Consent**: Law 09-08 compliant data protection consent
- **Fiscal Receipts**: Article 145 CGI compliant donation receipts
- **Annual Declarations**: Complete checklist for Préfecture/Province

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with ❤️ for Moroccan associations managing their communities in compliance with local regulations.
