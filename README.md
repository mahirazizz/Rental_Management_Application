# Rental App

A full-stack rental management platform where tenants can discover properties, submit applications, and manage residences, while managers can list properties and review applications.

This project is built as a production-style monorepo with a Next.js frontend and an Express + Prisma backend.

## Why This Project

Rental App demonstrates practical full-stack engineering skills:

- Role-based application flows for **tenant** and **manager** users
- Real-world backend architecture with modular routes/controllers
- Advanced property search with filters and map coordinates
- Authenticated API access with JWT/Cognito token flow
- PostgreSQL + Prisma data modeling with relations and enums
- Optional cloud media upload pipeline (AWS S3)

## Main Features

### Tenant Experience

- Browse property listings with filters (price, beds, baths, type, amenities, size, location)
- Explore map/listing search views
- Save and remove favorite properties
- Submit rental applications
- View active residences and lease/payment details
- Manage account settings

### Manager Experience

- Create and manage property listings
- Upload property images (S3 when configured)
- View manager-specific properties
- Review tenant applications and update status
- Manage profile settings

## Tech Stack

### Frontend (client)

- Next.js 15 (App Router) + React 19 + TypeScript
- Redux Toolkit + RTK Query for state and API layer
- Tailwind CSS + Radix UI for UI components
- AWS Amplify Auth integration (Cognito)
- Framer Motion, Leaflet maps, React Hook Form + Zod

### Backend (server)

- Node.js + Express + TypeScript
- Prisma ORM with PostgreSQL adapter
- PostgreSQL (with PostGIS extension support)
- JWT-based auth middleware (supports Cognito token workflows in development)
- Multer + AWS SDK for media upload handling

## Project Structure

```text
Rental_App/
  client/   # Next.js frontend
  server/   # Express + Prisma backend
```

## Architecture Overview

- Frontend consumes backend endpoints using RTK Query
- Auth token is attached in API requests from frontend
- Backend routes are organized by domain:
  - `/properties`
  - `/applications`
  - `/leases`
  - `/tenants`
  - `/managers`
- Database models include:
  - `Property`, `Location`, `Manager`, `Tenant`, `Application`, `Lease`, `Payment`

## Prerequisites

Install these first:

- Node.js 18+
- npm 9+
- PostgreSQL 14+ (with access to create/use PostGIS extension)

## Environment Variables

Create these files before running:

- `server/.env`
- `client/.env.local`

### server/.env

```env
PORT=3002
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
JWT_SECRET=your-secret-key

# Optional: enable S3 uploads for property images
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

Notes:

- If `AWS_REGION` and `S3_BUCKET_NAME` are not set, the app falls back to placeholder property images.
- `DATABASE_URL` is required for Prisma to connect.

### client/.env.local

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002/
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=your-user-pool-client-id
```

Notes:

- `NEXT_PUBLIC_API_BASE_URL` should point to your backend server.
- Cognito values are required for full auth flow in the frontend.

## Installation

From the repository root, install dependencies in both apps:

```bash
cd server
npm install

cd ../client
npm install
```

## Database Setup

From `server/`:

```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

This will:

- Generate Prisma client
- Apply schema migrations
- Seed initial development data

## Run Locally

Use two terminals.

### Terminal 1: Start backend

```bash
cd server
npm run dev
```

Backend runs on: `http://localhost:3002`

### Terminal 2: Start frontend

```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:3000`

## Build for Production

### Backend

```bash
cd server
npm run build
npm start
```

### Frontend

```bash
cd client
npm run build
npm run start
```

## API Snapshot

Base URL: `http://localhost:3002`

- `GET /properties` - list properties with filters
- `GET /properties/:id` - get property details
- `POST /properties` - create property (manager)
- `PUT /properties/:id` - update property (manager)
- `POST /applications` - create application (tenant)
- `PUT /applications/:id/status` - update status (manager)
- `GET /applications` - list applications (tenant/manager)
- `GET /leases` - list leases (tenant/manager)
- `GET /leases/:id/payments` - get lease payments
- `GET/POST/PUT/DELETE /tenants/...` - tenant profile/actions
- `GET/POST/PUT/DELETE /managers/...` - manager profile/actions

## Screens / Flows

The application includes:

- Public landing and informational pages
- Search page with filter + map + listing layout
- Tenant dashboard pages (applications, favorites, residences, settings)
- Manager dashboard pages (applications, properties, new property, settings)

## What I Focused On

- Clean modular backend structure
- Practical role-based permissions
- Reusable frontend component architecture
- Real-world form handling and validation
- State-driven filtering and query parameter sync

## Known Development Notes

- Current auth middleware accepts decoded Cognito-like tokens in development mode when local verification fails. For production, strict token verification should be enforced.
- S3 image uploads are optional and environment-driven.

## Future Improvements

- Add test coverage (unit + integration + e2e)
- Harden production auth verification with JWKS validation
- Add CI/CD pipeline and deployment docs
- Add Docker setup for one-command local startup
- Add richer observability (structured logs, metrics)

## Author

Mahir Aziz

If you are a recruiter reviewing this project, thank you for your time. I am happy to walk through architecture decisions, tradeoffs, and implementation details.
