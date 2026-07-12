# Techwiz Kicks — Sports E-Commerce

🌐 **Live store:** [https://techwiz-kicks.onrender.com](https://techwiz-kicks.onrender.com)  
🔧 **Admin panel:** [https://techwiz-kicks.onrender.com/admin](https://techwiz-kicks.onrender.com/admin)

A full-stack e-commerce storefront for sports shoes, sneakers, and athletic shirts.

![Techwiz Kicks](https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&q=80)

## Project Structure

```
ecommerce/
├── frontend/          # React + Vite storefront
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/           # Express API server
    ├── src/
    └── package.json
```

## Features

- **Homepage** — Hero banner, category showcase, featured & best-selling products
- **Shop** — Browse all products with category filters and sorting
- **Product Detail** — Image gallery, size/color selection, add to cart
- **Shopping Cart** — Quantity controls, order summary, free shipping threshold
- **Checkout** — Shipping form with real order submission to the backend (demo payment)

## Tech Stack

**Frontend** — React 19, TypeScript, Vite, Tailwind CSS v4, React Router

**Backend** — Express 5, TypeScript, JSON file storage

## Getting Started

Install dependencies:

```bash
npm run install:all
```

Start both servers (in separate terminals):

```bash
# Terminal 1 — API (http://localhost:3001)
npm run dev:backend

# Terminal 2 — Frontend (http://localhost:5173)
npm run dev:frontend
```

The frontend proxies `/api/*` requests to the backend automatically.

## Admin Panel

Manage products (add, edit, delete) at `/admin`.

| Environment | URL | Default password |
|---|---|---|
| Local | http://localhost:5173/admin | Your `ADMIN_PASSWORD` |
| Production | https://techwiz-kicks.onrender.com/admin | Your `ADMIN_PASSWORD` on Render |

On Render, `ADMIN_PASSWORD` is set in **techwiz-kicks-api** → **Environment**.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/config` | Store config (shipping, currency) |
| GET | `/api/categories` | All categories |
| GET | `/api/categories/:slug` | Single category |
| GET | `/api/products` | Products (supports `category`, `sort`, `badge` query params) |
| GET | `/api/products/:id` | Single product |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/products` | List all products (admin) |
| POST | `/api/admin/products` | Create product (admin) |
| PUT | `/api/admin/products/:id` | Update product (admin) |
| DELETE | `/api/admin/products/:id` | Delete product (admin) |

## Build

```bash
npm run build          # Frontend → frontend/dist/
npm run build:backend  # Backend → backend/dist/
```

## License

MIT
