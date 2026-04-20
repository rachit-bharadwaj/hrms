<div align="center">

<img src="https://img.shields.io/badge/Harbor-HRMS-0f172a?style=for-the-badge&logoColor=white" alt="Harbor HRMS" />

# Harbor — Human Resource Management System

**A production-ready, full-stack HRMS that handles your entire workforce lifecycle —
from onboarding and attendance to payroll and performance.**

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=flat-square)](https://orm.drizzle.team/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)](./LICENSE)

<br />

[🚀 Live Demo](#) &nbsp;·&nbsp;
[📐 ERD Diagram](https://mermaid.ai/view/38d1cb50-d7dc-4f92-b83d-f484f3b7b406) &nbsp;·&nbsp;
[🐛 Report Bug](https://github.com/rachit-bharadwaj/hrms/issues) &nbsp;·&nbsp;
[✨ Request Feature](https://github.com/rachit-bharadwaj/hrms/issues)

<br />

> 🔗 **Live Demo:** [https://harbor.rachitbharadwaj.in](https://harbor.rachitbharadwaj.in)

</div>

---

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🧩 Feature Modules](#-feature-modules)
- [🏗️ System Architecture](#️-system-architecture)
- [🗂️ Folder Structure](#️-folder-structure)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [📐 ERD / Database Schema](#-erd--database-schema)
- [🔐 Security & Best Practices](#-security--best-practices)
- [🧪 Testing](#-testing)
- [📖 API Documentation](#-api-documentation)
- [📝 Assumptions](#-assumptions)
- [🗺️ Roadmap](#️-roadmap)
- [📄 License](#-license)

---

## ✨ Overview

**Harbor** is a high-fidelity HRMS platform built for modern organizations. It covers the full employee lifecycle — from onboarding and department assignment to daily attendance, leave workflows, payroll computation, and task tracking — all from a single, unified interface.

The project emphasizes:

- ✅ **Correctness** — Statically typed TypeScript codebase, strict schema-driven database access
- ✅ **Compliance** — Statutory payroll rules: PF (12%), ESI (statutory thresholds), TDS
- ✅ **Clean Architecture** — Modular separation between routes, controllers, services, and data layers
- ✅ **Role-Based Security** — JWT Auth + RBAC from day one
- ✅ **Extensibility** — Each domain is isolated and ready to grow independently

---

## 🧩 Feature Modules

<details>
<summary><b>👥 User & Role Management</b></summary>
<br />

- Four roles: **Super Admin**, **HR Admin**, **Manager**, **Employee**
- Secure login/logout with JWT-based stateless authentication
- Password reset and account activation flows
- Granular permission model per role: `view`, `edit`, `manage`
- Middleware-enforced route protection on all sensitive APIs

</details>

<details>
<summary><b>🧑‍💼 Employee Management</b></summary>
<br />

- Full CRUD for employee records
- Employee profile with:
  - Personal details: name, DOB, contact, address, photo
  - Job details: designation, department, joining date, employee ID
  - Document references: Aadhar, PAN, offer letter, KYC documents
- Department-wise employee listing and filtering

</details>

<details>
<summary><b>🏢 Department Management</b></summary>
<br />

- Create, update, and list departments
- Assign employees to departments
- Department-wise employee count and reporting aggregations

</details>

<details>
<summary><b>🗓️ Attendance Management</b></summary>
<br />

- Daily attendance marking: **Present / Absent / Half Day / WFH**
- Monthly per-employee attendance view
- Department-level attendance summaries for Managers and HR
- Attendance feeds directly into payroll (Loss of Pay / LWP) calculations
- Export hooks for CSV / PDF reporting

</details>

<details>
<summary><b>🏖️ Leave Management ⭐ (High Priority)</b></summary>
<br />

- Leave application flow for **CL (Casual)**, **SL (Sick)**, **EL (Earned)** leave types
- Approval workflow with three states: **Pending → Approved / Rejected**
- Date-range calculation that **skips weekends and holidays** — only working days consume the leave balance
- Real-time leave balance tracking per employee per leave type
- Leave history viewable by both employee and HR
- Extensible structure for carry-forward and encashment rules

</details>

<details>
<summary><b>💰 Salary & Payroll ⭐ (High Priority)</b></summary>
<br />

**Calculation Engine includes:**

| Component | Detail |
|-----------|--------|
| **Basic + HRA** | Configurable per employee designation |
| **PF** | Employee (12%) + Employer (12%) contributions |
| **ESI** | Applied based on gross salary threshold |
| **TDS** | Deducted at source based on tax slab rules |
| **LWP** | Pro-rated deduction based on attendance |
| **Net Pay** | Auto-calculated after all deductions |

- Monthly salary slip generation per employee
- **PDF salary slip download** powered by PDFKit
- Full payroll history per employee for auditing

</details>

<details>
<summary><b>📅 Calendar & Holidays</b></summary>
<br />

- Manage national, regional, and company-specific holidays
- Visual calendar integrated with attendance and leave availability
- Holidays automatically excluded from leave balance consumption

</details>

<details>
<summary><b>✅ Task Assignment</b></summary>
<br />

- Assign tasks to employees with title, priority, and due date
- Task states: **To Do → In Progress → Completed**
- Employees can view and update their assigned tasks
- Managers can monitor progress and adjust priorities

</details>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       Browser / Client                   │
│          Next.js 16 + React 19 + Tailwind CSS 4          │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS (Axios)
┌────────────────────────▼────────────────────────────────┐
│                    Express 5 API Server                  │
│              TypeScript · JWT Auth · RBAC                │
│    Routes → Controllers → Services → Repositories        │
└────────────────────────┬────────────────────────────────┘
                         │ Drizzle ORM
┌────────────────────────▼────────────────────────────────┐
│                  PostgreSQL 14+ Database                 │
│         Normalized schema · Indexed relations            │
└─────────────────────────────────────────────────────────┘
```

**Key design decisions:**

- **Stateless API** — JWTs carry all session context; no server-side session store required
- **Type-safe data layer** — Drizzle ORM enforces types from schema → query → response
- **Separation of concerns** — Routes handle HTTP, services hold domain logic, repositories handle DB access
- **Modular domains** — Each feature (leave, payroll, attendance) is independently structured and can scale separately

---

## 🗂️ Folder Structure

```
hrms/
├─ backend/                    # Express + TypeScript API server
│  ├─ src/
│  │  ├─ modules/              # Feature modules (employees, leaves, payroll…)
│  │  │  └─ [module]/
│  │  │     ├─ [module].routes.ts
│  │  │     ├─ [module].controller.ts
│  │  │     ├─ [module].service.ts
│  │  │     └─ [module].schema.ts
│  │  ├─ middlewares/          # Auth, RBAC, error handling
│  │  ├─ db/                   # Drizzle client and schema definitions
│  │  └─ index.ts              # App entry point
│  ├─ scripts/
│  │  └─ seed.ts               # Database seeding script
│  ├─ tests/                   # Jest unit tests (leave, payroll logic)
│  ├─ drizzle.config.ts        # Drizzle ORM configuration
│  └─ example.env              # Sample environment variables
│
├─ website/                    # Next.js 16 frontend application
│  ├─ app/                     # App Router pages, layouts, and API routes
│  ├─ components/              # Reusable UI components
│  └─ public/                  # Static assets (icons, images)
│
├─ ERD_Diagram.pdf             # Full database ERD
└─ README.md                   # Project documentation
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.4 | App Router, SSR, routing |
| **React** | 19.2.4 | UI framework |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Lucide React** | 1.8.0 | Icon library |
| **Axios** | 1.15.0 | HTTP client for API calls |
| **React Hot Toast** | 2.6.0 | In-app notifications |
| **TypeScript** | 5 | Type-safe frontend code |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 5.1.0 | HTTP routing framework |
| **TypeScript** | 5.8.3 | Type-safe backend code |
| **Drizzle ORM** | 0.45.1 | Type-safe ORM for PostgreSQL |
| **PostgreSQL** | 14+ | Relational database |
| **JWT (jsonwebtoken)** | 9.0.2 | Stateless authentication |
| **PDFKit** | 0.18.0 | Salary slip PDF generation |
| **Swagger UI Express** | 5.0.1 | Interactive API documentation |
| **Jest + ts-jest** | 29.7.0 | Unit testing framework |
| **Nodemon** | 3.1.10 | Auto-reload for development |

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are available on your system:

- **Node.js** v18+
- **npm** or **yarn**
- **PostgreSQL** v14+
- A running PostgreSQL instance with a database created

---

### 1. Clone the Repository

```bash
git clone https://github.com/rachit-bharadwaj/hrms.git
cd hrms
```

---

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy the example env and configure it
cp example.env .env
```

Edit `.env` with your actual values — see [Environment Variables](#️-environment-variables) below.

```bash
# Push schema to your PostgreSQL database
npm run db:push

# (Optional) Seed the database with initial data
npm run db:seed

# Start the development server
npm run dev
```

> The backend runs on `http://localhost:8000` by default.

---

### 3. Frontend Setup

Open a new terminal from the repo root:

```bash
cd website

# Install dependencies
npm install

# Start the development server
npm run dev
```

> The frontend runs on `http://localhost:3000` by default.

---

### 4. Database Commands (Drizzle CLI)

All schema operations are managed via Drizzle Kit:

```bash
npm run db:push       # Push current schema directly to DB (dev)
npm run db:generate   # Generate migration files from schema changes
npm run db:migrate    # Apply pending migrations
npm run db:studio     # Launch Drizzle Studio (visual DB browser)
npm run db:seed       # Populate DB with seed data
```

---

## ⚙️ Environment Variables

The `backend/example.env` file documents all supported variables. Copy it to `.env` and fill in your values:

```env
# Server
PORT=8000
API_VERSION=1.0.0

# CORS — comma-separated list of allowed frontend origins
CORS_ORIGINS=http://localhost:3000,https://your-production-domain.com

# Database — PostgreSQL connection string
DATABASE_URL=postgres://user:password@localhost:5432/harbor_hrms

# Authentication — strong random secret for JWT signing
JWT_SECRET=your-super-secure-random-jwt-secret
```

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Backend listen port, defaults to `8000` |
| `API_VERSION` | No | Logical API version label |
| `CORS_ORIGINS` | Yes | Allowed CORS origins (comma-separated) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing and verification |

---

## 📐 ERD / Database Schema

The full database schema with all tables, foreign keys, and relationships is available as an interactive ERD:

> **🔗 [View Interactive ERD on Mermaid](https://mermaid.ai/view/38d1cb50-d7dc-4f92-b83d-f484f3b7b406)**

A PDF version is also available in the repository:

> **📄 [ERD_Diagram.pdf](./ERD_Diagram.pdf)**

Key entities in the schema include:

| Entity | Description |
|--------|-------------|
| `users` | Authentication and role assignments |
| `employees` | Full employee profiles and job metadata |
| `departments` | Department definitions and hierarchy |
| `attendance` | Daily attendance records per employee |
| `leave_types` | CL, SL, EL and configuration |
| `leave_requests` | Applications with approval status |
| `leave_balances` | Real-time balance per employee per type |
| `salary_structures` | Per-employee salary component definitions |
| `payroll_runs` | Monthly payroll cycles and computed pay |
| `holidays` | Company calendar with holiday metadata |
| `tasks` | Task records with status and assignments |

---

## 🔐 Security & Best Practices

| Area | Implementation |
|------|---------------|
| **Authentication** | JWT-based stateless auth — tokens are signed with a secret and validated on each request |
| **Authorization** | RBAC middleware enforces role-based access on every protected route |
| **Input Validation** | Drizzle schema constraints + API-layer validation on incoming payloads |
| **CORS** | Configurable via `CORS_ORIGINS` env variable; restricted to trusted origins only |
| **Secrets Management** | All sensitive values (DB URL, JWT secret) read exclusively from environment variables |
| **Type Safety** | TypeScript end-to-end: schema → ORM → service → API response |
| **Payroll Accuracy** | Statutory calculations (PF, ESI, TDS) isolated in testable service functions |

---

## 🧪 Testing

Unit tests are written for the most critical business logic — leave balance updates, payroll calculations (PF, ESI, TDS, net pay), and date handling:

```bash
cd backend
npm test
```

Test files are located in `backend/tests/`. The test suite uses **Jest** and **ts-jest** for TypeScript-native test execution.

> New contributors are encouraged to add tests for any new module or calculation logic introduced.

---

## 📖 API Documentation

The backend exposes interactive Swagger API documentation powered by `swagger-jsdoc` and `swagger-ui-express`.

Once the backend is running, navigate to:

```
http://localhost:8000/api/docs
```

The docs allow you to:

- 🔍 Browse all available endpoints grouped by module
- 📦 Inspect request/response schemas
- 🔑 Authenticate with a Bearer JWT token
- 🧪 Execute live API calls directly from the browser

---

## 📝 Assumptions

The following design decisions and simplifications were made during implementation:

1. **TDS** is modeled with a simple slab structure. More granular tax computation (surcharges, rebates) can be added as per jurisdiction requirements.
2. **Leave accrual** is configured at the leave-type level. Monthly accrual schedules and carry-forward caps may need adjustment based on your organization's specific policy.
3. **Attendance input** is managed via the web UI and API — direct biometric device integration is not included but the data model supports it as an external input.
4. **Payroll** is scoped to a single currency and a single country's statutory rules (PF/ESI/TDS). Multi-country or multi-currency setups are not enabled by default.
5. **Document uploads** store file references/metadata; the actual file storage is expected to be wired to an object storage backend (e.g., AWS S3, Cloudflare R2).

---

## 🗺️ Roadmap

- [ ] 🐳 Docker Compose setup (backend + frontend + PostgreSQL in a single command)
- [ ] 🔄 GitHub Actions CI/CD pipeline for lint, test, and deploy
- [ ] 📊 HR Analytics dashboard (turnover, leave trends, payroll cost breakdown)
- [ ] 📧 Email/Slack notifications for leave approvals, task assignments, and payroll events
- [ ] 🔐 SSO / OAuth integration (Google Workspace, Microsoft Entra)
- [ ] 🌍 Multi-currency and multi-country payroll support
- [ ] 📱 Mobile-responsive PWA improvements
- [ ] 🏦 Banking API integration for automated salary disbursement

---

## 📄 License

This project is an internal organizational assignment and is licensed under the **ISC License**.

Please contact [Rachit Bharadwaj](https://github.com/rachit-bharadwaj) before using this project in a commercial context.

---

<div align="center">

Made with ❤️ by [Rachit Bharadwaj](https://github.com/rachit-bharadwaj)

⭐ **Star this repo if you found it useful!**

</div>