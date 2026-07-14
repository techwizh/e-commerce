# Techwiz Kicks — Technical Documentation

Developer and deployment documentation for the Techwiz Kicks full-stack e-commerce platform.

---

## Overview

Techwiz Kicks is a monorepo containing a React frontend and Express backend. The live deployment uses Render for both the static storefront and the API server.

| Component | Technology | Live URL |
|---|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 | https://techwiz-kicks.onrender.com |
| Backend API | Express 5, TypeScript | https://techwiz-kicks-api.onrender.com |
| Source control | GitHub | https://github.com/techwizh/e-commerce |

---

## Admin Authentication

The admin panel uses **password-only authentication** (no username field).

### Credentials

| Field | Value |
|---|---|
| **Username** | None (not used) |
| **Password** | `T3717@ict` |

### Where the Password Is Configured

| Environment | Location |
|---|---|
| **Production (Render)** | `techwiz-kicks-api` → Environment → `ADMIN_PASSWORD` |
| **Local development** | `backend/.env` file |

**Local `.env` example:**

```env
ADMIN_PASSWORD=T3717@ict
```

### How Authentication Works

1. Admin submits password to `POST /api/admin/login`
2. Backend compares against `process.env.ADMIN_PASSWORD`
3. On success, the frontend stores the password in `sessionStorage`
4. Subsequent admin API calls send header: `X-Admin-Password: <password>`

**Relevant files:**

- `backend/src/config.ts` — reads `ADMIN_PASSWORD`
- `backend/src/middleware/adminAuth.ts` — protects admin routes
- `backend/src/routes/admin.ts` — login and CRUD endpoints
- `frontend/src/pages/AdminPage.tsx` — admin UI
- `frontend/src/api/admin.ts` — admin API client

---

## Project Structure

```
ecommerce/
├── frontend/                    # React storefront
│   ├── public/
│   │   └── images/sneakers/     # Product images (served statically)
│   ├── src/
│   │   ├── api/                 # API clients (client.ts, admin.ts)
│   │   ├── components/          # UI components
│   │   ├── context/             # Cart state (localStorage)
│   │   ├── hooks/               # useStoreConfig
│   │   ├── pages/               # Route pages + AdminPage
│   │   ├── types/               # TypeScript interfaces
│   │   └── utils/               # Currency formatting
│   ├── package.json
│   └── vite.config.ts           # Dev proxy to backend
│
├── backend/                     # Express API
│   ├── src/
│   │   ├── routes/              # config, categories, products, orders, admin
│   │   ├── middleware/          # adminAuth
│   │   ├── db.ts                # JSON file storage
│   │   ├── seed.ts              # Product catalog + sync logic
│   │   ├── config.ts            # Port, password, store config
│   │   └── index.ts             # Server entry
│   ├── data/                    # store.json (gitignored, generated at runtime)
│   ├── .env                     # Local secrets (gitignored)
│   └── package.json
│
├── package.json                 # Root scripts
├── render.yaml                  # Render Blueprint config
├── README.md
├── USER_MANUAL.md               # End-user and admin guide
└── DOCUMENTATION.md             # This file
```

---

## Tech Stack

### Frontend

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router 7
- Lucide React (icons)

### Backend

- Express 5
- TypeScript
- Zod (validation)
- UUID (order IDs)
- JSON file database (`backend/data/store.json`)

---

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm run install:all
```

### Environment Setup

Create `backend/.env`:

```env
ADMIN_PASSWORD=T3717@ict
```

### Run

```bash
# Terminal 1 — Backend (http://localhost:3001)
npm run dev:backend

# Terminal 2 — Frontend (http://localhost:5173)
npm run dev:frontend
```

The Vite dev server proxies `/api/*` to `http://localhost:3001`.

### Local URLs

| Service | URL |
|---|---|
| Store | http://localhost:5173 |
| Admin | http://localhost:5173/admin |
| API | http://localhost:3001/api/health |

---

## Deployment (Render)

Deployment is configured via `render.yaml` (Blueprint).

### Services

| Service | Type | Root Directory |
|---|---|---|
| `techwiz-kicks-api` | Web Service (Node) | `backend/` |
| `techwiz-kicks` | Static Site | `frontend/` |

### Environment Variables

**Backend (`techwiz-kicks-api`):**

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `ADMIN_PASSWORD` | `T3717@ict` |

**Frontend (`techwiz-kicks`):**

| Variable | Source |
|---|---|
| `VITE_API_URL` | Auto-linked from `techwiz-kicks-api` external URL |

### Deploy Workflow

1. Push code to `main` on GitHub
2. Render auto-syncs from the Blueprint (or click **Manual sync**)
3. Wait for both services to show **Live**
4. Open admin → **Sync Catalog** if new seed products need to be published

### Build Commands

```bash
# Frontend
cd frontend && npm install && npm run build
# Output: frontend/dist/

# Backend
cd backend && npm install && npm run build
# Output: backend/dist/
```

---

## API Reference

Base URL (production): `https://techwiz-kicks-api.onrender.com/api`

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/config` | Store config (shipping, currency) |
| GET | `/categories` | All categories |
| GET | `/categories/:slug` | Single category |
| GET | `/products` | List products (`?category=`, `?sort=`, `?badge=true`) |
| GET | `/products/:id` | Single product |
| POST | `/orders` | Place an order |
| GET | `/orders/:id` | Get order by ID |

### Admin Endpoints (require `X-Admin-Password` header)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/login` | Verify password (`{ "password": "..." }`) |
| POST | `/admin/sync-catalog` | Merge seed products into live store |
| GET | `/admin/products` | List all products |
| POST | `/admin/products` | Create product |
| PUT | `/admin/products/:id` | Update product |
| DELETE | `/admin/products/:id` | Delete product |

### Store Configuration

| Setting | Value |
|---|---|
| Currency | KES (Kenyan Shillings) |
| Free shipping threshold | Ksh 10,000 |
| Standard shipping cost | Ksh 500 |

---

## Data Model

### Product

```typescript
{
  id: string                    // e.g. "sn-001"
  name: string
  category: 'sports-shoes' | 'sneakers' | 'sports-shirts'
  price: number                 // KES, no decimals
  originalPrice?: number
  image: string                 // URL or /images/... path
  images: string[]
  description: string
  features: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  rating: number
  reviewCount: number
  badge?: string
  inStock: boolean
}
```

### Storage

- Products, categories, and orders are stored in `backend/data/store.json`
- On Render free tier, data may reset on redeploy — use **Sync Catalog** or admin panel to restore seed products
- Cart data is stored in the browser (`localStorage`, key: `techwiz-kicks-cart`)

---

## Adding Products via Code

1. Add images to `frontend/public/images/sneakers/`
2. Add product definitions in `backend/src/seed.ts`
3. Push to GitHub and redeploy
4. Backend startup or **Sync Catalog** merges new products by ID

---

## Security Notes

- Admin password is stored as an environment variable, not in source code
- Payment checkout is **demo only** — no real card processing
- Change `ADMIN_PASSWORD` on Render if the password is ever exposed
- The repository is public — treat `T3717@ict` as a known credential and rotate if needed

---

## Useful Commands

```bash
npm run install:all     # Install all dependencies
npm run dev:frontend    # Start frontend dev server
npm run dev:backend     # Start backend dev server
npm run build           # Build frontend
npm run build:backend   # Build backend
npm run lint            # Lint frontend
```

---

## Repository & Links

| Resource | URL |
|---|---|
| GitHub | https://github.com/techwizh/e-commerce |
| Live store | https://techwiz-kicks.onrender.com |
| Admin panel | https://techwiz-kicks.onrender.com/admin |
| API health | https://techwiz-kicks-api.onrender.com/api/health |
| Render dashboard | https://dashboard.render.com |

---

*Last updated: July 2026*
