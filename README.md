# Harbor: Advanced HRMS Platform

Harbor is a high-fidelity Human Resource Management System (HRMS) built for organizational efficiency. It covers everything from employee lifecycle management and visual attendance tracking to statutory payroll processing and automated task delegation.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd hrms
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp example.env .env
   # Update .env with your DATABASE_URL and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd website
   npm install
   npm run dev
   ```

## 🏗️ Technical Architecture

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide Icons.
- **Backend**: Express.js, TypeScript.
- **Database**: PostgreSQL with Drizzle ORM (Type-safe schemas and queries).
- **Security**: JWT Authentication with Role-Based Access Control (RBAC).

## 🛠️ Key Modules & Business Logic

- **Leave Management**: Smart date calculation (skipping weekends/holidays), balance tracking with carry-forward and encashment.
- **Payroll Engine**: Statutory compliance for **PF (12%)**, **ESI (statutory thresholds)**, and **TDS**. Pro-rated net pay calculation based on **Attendance (LWP)**.
- **Calendar & Holidays**: Visually integrated corporate calendar that flows into attendance and leave availability.
- **Task Delegation**: Manager-to-Employee task pipeline with priority monitoring.

## 📄 Environment Configuration (backend/.env)

- `DATABASE_URL`: Connection string for PostgreSQL.
- `JWT_SECRET`: Secret key for signing session tokens.
- `PORT`: (Optional) Defaults to 8000.
- `CORS_ORIGINS`: Allowed frontend origins.

## 🧪 Testing

Unit tests for critical payroll and leave logic are located in `backend/tests`.
Run tests using:
```bash
cd backend
npm test
```

## 📜 License
Internal Organizational Tool.
