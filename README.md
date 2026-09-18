# DISCOVER

Discover is a location-first company and job discovery platform for students, freshers, and software engineers.

It combines a MapLibre company map with verified company profiles, active jobs, applications, saved jobs, company claiming, recruiter/company management, and external job ingestion through Adzuna.

## Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, MapLibre GL
- Backend: Node.js, Express 5, TypeScript, Zod
- Database: PostgreSQL + Prisma 7
- Authentication: JWT in an HTTP-only cookie
- External jobs: Adzuna
- CI: GitHub Actions
- Local full stack: Docker Compose

## Product capabilities

### Users
- Register/login/logout
- Secure HTTP-only session cookie
- Profile and location editing
- Protected profile routes
- Application tracking and withdrawal
- Saved jobs
- Account settings
- Company creation

### Company discovery
- Interactive MapLibre map
- Browser geolocation
- Company markers with distance
- Company/city/industry search
- Company profiles
- About, jobs, and people tabs
- Verification badge
- Company claim workflow

### Jobs
- Global active-job discovery
- Search, type, mode, experience and city filters
- Pagination and sorting
- Job details
- Platform applications
- External application links
- Save/unsave
- Job expiration
- Recruiter/company job creation and management
- Application status management

### Company management
- Create a company
- Manage company locations and primary location
- Publish jobs
- Manage applications
- Company members and roles
- Claim review and verification workflow

### External job ingestion
- Adzuna provider
- Normalization
- Validation
- Deduplication
- Company resolution
- External location preservation
- Re-fetch updates for exact external matches
- Direct application link
- Adzuna attribution in the UI

## Local setup

### 1. Backend

```bash
cd backend
npm install
```

Create `.env` from `.env.example`.

Then generate Prisma Client and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

For development:

```bash
npm run dev
```

For a production build:

```bash
npm run build
npm start
```

The API runs on `http://localhost:5000` by default.

### 2. Frontend

```bash
cd frontend
npm install
```

Create `.env` from `.env.example` if the API is not running at the default URL.

Start development:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Docker

From the repository root:

```bash
docker compose up --build
```

This starts PostgreSQL, the backend, and the frontend.

Before using Docker outside local development, replace the example JWT secret and database credentials.

## Adzuna ingestion

Set:

```text
ADZUNA_APP_ID=...
ADZUNA_APP_KEY=...
```

Then an administrator can run:

```bash
npm run ingest:adzuna
```

The API endpoint is:

```text
POST /api/jobs/ingest/adzuna
```

It requires an authenticated ADMIN user.

## Important API groups

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me/:id`

### Users

- `GET /api/user/profile`
- `PATCH /api/user/profile`

### Companies

- `GET /api/company`
- `GET /api/company/:id`
- `POST /api/company`
- `PATCH /api/company/:id`
- `GET /api/company/:companyId/locations`
- `POST /api/company/:companyId/locations`
- `PATCH /api/company/:companyId/locations/:locationId`
- `DELETE /api/company/:companyId/locations/:locationId`

### Jobs

- `GET /api/jobs`
- `GET /api/jobs/:jobId`
- `POST /api/jobs/:jobId/apply`
- `POST /api/jobs/:jobId/save`
- `DELETE /api/jobs/:jobId/save`
- `POST /api/company/:companyId/jobs`
- `GET /api/company/:companyId/jobs`
- `GET /api/company/:companyId/job/:jobId`
- `PATCH /api/company/:companyId/job/:jobId`

### Applications

- `GET /api/applications/user/applications`
- `PATCH /api/applications/user/applications/:applicationId/withdraw`
- `GET /api/applications/companies/:companyId/applications`
- `PATCH /api/applications/companies/:companyId/applications/:applicationId`

### Saved jobs

- `GET /api/saved-jobs`
- `GET /api/saved-jobs/ids`
- `POST /api/saved-jobs/:jobId`
- `DELETE /api/saved-jobs/:jobId`

### Claims and members

- `POST /api/claims/companies/:companyId`
- `GET /api/claims/user`
- `GET /api/claims/companies/:companyId`
- `PATCH /api/claims/:claimId`
- `GET /api/members/companies/:companyId`
- `POST /api/members/companies/:companyId`
- `PATCH /api/members/companies/:companyId/:memberId`
- `DELETE /api/members/companies/:companyId/:memberId`

## Verification

CI runs:

- Backend TypeScript build
- Prisma Client generation
- Backend tests
- Frontend TypeScript/Vite build
- Frontend ESLint

Run locally:

```bash
cd backend && npm run build && npm test
cd ../frontend && npm run build && npm run lint
```

## Repository

GitHub: https://github.com/devacharya80/Discover
