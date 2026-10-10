# Ecommerce API



Monolithic REST API for an e-commerce system.



## Technology



- Node.js

- Express.js

- Prisma ORM

- PostgreSQL

- JWT

- Docker

- Docker Compose



## Architecture



The application uses a Monolithic architecture. Routes, controllers, services, middleware and configuration run in one Node.js/Express backend. The backend communicates with PostgreSQL through Prisma ORM and provides REST APIs for authentication, users, products, orders and shipments.



## Environment Variables



Environment variables are loaded from `.env`:



- `DATABASE\_URL`

- `PORT`

- `NODE\_ENV`

- `JWT\_SECRET`

- `JWT\_EXPIRES\_IN`



The `.env` file contains secrets and is excluded by `.gitignore`. The `.env.example` file contains only example values for setup.



## Prisma ORM



Prisma maps the models in `prisma/schema.prisma` to PostgreSQL tables. Prisma Client provides database queries, while Prisma Migrate synchronizes schema changes through migration files.



## Run with Docker Compose



```powershell

docker compose up -d --build

docker compose ps

Invoke-RestMethod http://127.0.0.1:3000/health

API Workflow
- POST /api/auth/register
- POST /api/auth/login
- POST /api/orders
- GET /api/orders/:oid
- GET /api/shipments/:shipid
Protected endpoints require:
Authorization: Bearer <token>
```

The PostgreSQL service uses a healthcheck. The API service starts after PostgreSQL becomes healthy.

## API Workflow

- POST /api/auth/register
- POST /api/auth/login
- POST /api/orders
- GET /api/orders/:oid
- GET /api/shipments/:shipid

Protected endpoints require: `Authorization: Bearer <token>`

## Database Verification

Use Docker CLI to list tables and verify products, orders and order details.
