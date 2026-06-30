# HomeBalance

A full-stack household budgeting application. Users register, join or create a household, log shared expenses, organize them by category, and track spending against a monthly budget — all from a React dashboard backed by an Express/PostgreSQL API.

## Features

- **Authentication** — Email/password registration and login with JWT-based sessions.
- **Households** — Each user belongs to a household (created on registration or joined via invite code); household members share expenses and a budget.
- **Expenses** — Create, edit, delete, filter, and list expenses, scoped to the household or a specific user.
- **Categories** — Categorize expenses for reporting and filtering.
- **Monthly Budgets** — Set, view, and delete a budget per month, and track it against actual spending.
- **Currency** — Per-household currency setting.

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 19, TypeScript, Vite, React Router, React Hook Form, Axios, Recharts, Notyf, Lucide icons |
| Backend  | Node.js, Express 5, TypeScript, Joi (validation), JWT, bcrypt-style hashing via `cyber` util |
| Database | PostgreSQL (via `pg`) |

## Project Structure

```
FS Template/
├── Backend/                 Express + TypeScript REST API
│   └── src/
│       ├── 1-assets/
│       ├── 2-utils/         config, db access layer (dal), crypto helpers
│       ├── 3-models/        domain models + Joi validation
│       ├── 4-services/      business logic
│       ├── 5-controllers/   Express routers / route handlers
│       ├── 6-middleware/    auth, security (XSS), error handling
│       ├── 7-repository/    SQL queries
│       └── app.ts           app entry point
├── Frontend/                React + Vite SPA
│   └── src/
│       ├── Components/      UserArea, ExpenseArea, BudgetArea, HouseholdArea, LayoutArea, PagesArea, SharedArea
│       ├── Context/          AuthContext (global auth state)
│       ├── Models/           TypeScript interfaces matching API DTOs
│       ├── Services/         Axios-based API clients
│       └── Utils/            axios instance, app config, notifications, currency helpers
└── Database/                 (PostgreSQL schema / scripts)
```

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [PostgreSQL](https://www.postgresql.org/) running locally (or accessible remotely)

## Getting Started

### 1. Database

Create a PostgreSQL database matching the name configured in `Backend/.env` (`POSTGRES_DATABASE`), then run any setup scripts found in `Database/` against it.

### 2. Backend

```bash
cd Backend
npm install
```

Configure `Backend/.env`:

```env
ENVIRONMENT = "development"
PORT = 5000
POSTGRES_PORT = 5432
POSTGRES_HOST = "localhost"
POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "your-password"
POSTGRES_DATABASE = "BudgetManager"
HASH_SALT = "your-salt"
JWT_SECRET = "your-jwt-secret"
```

Start the API (auto-reloads on file changes):

```bash
npm start
```

The server listens on `http://localhost:5000` and logs `Database connected!!!!!` once it has verified the PostgreSQL connection.

### 3. Frontend

```bash
cd Frontend
npm install
```

Configure `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Vite opens the app automatically (default `http://localhost:5173`).

## Available Scripts

**Backend** (`Backend/package.json`)
- `npm start` — run the API with `nodemon` + `ts-node`

**Frontend** (`Frontend/package.json`)
- `npm run dev` / `npm start` — start the Vite dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## API Overview

All routes are prefixed with `/api`. Routes marked 🔒 require a valid JWT (`Authorization: Bearer <token>`).

| Method | Route | Description |
|--------|-------|-------------|
| POST   | `/users/register` | Register a new user (optionally with a household invite code) |
| POST   | `/users/login` | Log in and receive a JWT |
| GET    | `/users/me` 🔒 | Get the current authenticated user |
| GET    | `/households/me` 🔒 | Get the current user's household |
| PUT    | `/households/currency` 🔒 | Update the household's currency |
| GET    | `/categories` | List all expense categories |
| POST   | `/expenses` 🔒 | Create an expense |
| GET    | `/expenses` 🔒 | List expenses for the household |
| GET    | `/expenses/filter` 🔒 | List expenses with filters |
| GET    | `/expenses/user/:userId` 🔒 | List expenses for a specific user |
| GET    | `/expenses/:expenseId` 🔒 | Get a single expense |
| PUT    | `/expenses/:id` 🔒 | Update an expense |
| DELETE | `/expenses/:id` 🔒 | Delete an expense |
| POST   | `/monthlyBudget` 🔒 | Set a budget for a month |
| GET    | `/monthlyBudget` 🔒 | List all monthly budgets |
| GET    | `/monthlyBudget/:budgetMonth` 🔒 | Get the budget for a given month |
| DELETE | `/monthlyBudget/:monthlyBudgetId` 🔒 | Delete a monthly budget |

## Authentication Flow

1. User registers (`POST /api/users/register`) or logs in (`POST /api/users/login`) and receives a JWT.
2. The frontend (`AuthContext` + `AxiosInstance`) stores the token and attaches it as a `Bearer` token on subsequent requests.
3. `authMiddleware.authenticate` on the backend verifies the token and loads the user's `id` and `householdId` onto `req.user` for use by protected routes.
4. Frontend routes under the dashboard layout are wrapped in `ProtectedRoute`, which redirects unauthenticated users to `/login`.
