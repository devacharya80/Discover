# Discover API

Base URL: `http://localhost:5000/api`

All authenticated endpoints use the `token` HTTP-only cookie created by login/register.

## Public endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /health | Health check |
| GET | /company | Search active companies |
| GET | /company/:id | Company details |
| GET | /company/:companyId/locations | Company locations |
| GET | /company/:companyId/jobs | Active company jobs |
| GET | /company/:companyId/job/:jobId | Active company job |
| GET | /jobs | Global active-job discovery |
| GET | /jobs/:jobId | Active job details |
| GET | /members/companies/:companyId | Public company team |

## Authentication

| Method | Endpoint |
|---|---|
| POST | /auth/register |
| POST | /auth/login |
| POST | /auth/logout |
| GET | /auth/me/:id |

## Authenticated user operations

| Method | Endpoint |
|---|---|
| GET | /user/profile |
| PATCH | /user/profile |
| POST | /jobs/:jobId/apply |
| GET | /applications/user/applications |
| PATCH | /applications/user/applications/:id/withdraw |
| GET | /saved-jobs |
| GET | /saved-jobs/ids?ids=id1,id2 |
| POST | /jobs/:jobId/save |
| DELETE | /jobs/:jobId/save |
| POST | /claims/companies/:companyId |
| GET | /claims/user |

## Company management

Company owners/admins/recruiters can publish jobs. Owners/admins can update company data, locations, and members.

| Method | Endpoint |
|---|---|
| POST | /company |
| PATCH | /company/:id |
| POST | /company/:companyId/locations |
| PATCH | /company/:companyId/locations/:locationId |
| DELETE | /company/:companyId/locations/:locationId |
| POST | /company/:companyId/jobs |
| PATCH | /company/:companyId/job/:jobId |
| GET | /applications/companies/:companyId/applications |
| PATCH | /applications/companies/:companyId/applications/:applicationId |
| POST | /members/companies/:companyId |
| PATCH | /members/companies/:companyId/:memberId |
| DELETE | /members/companies/:companyId/:memberId |
| GET | /claims/companies/:companyId |

## Admin

Only users with `role=ADMIN` can review company claims and trigger Adzuna ingestion.

| Method | Endpoint |
|---|---|
| PATCH | /claims/:claimId |
| POST | /jobs/ingest/adzuna |

## Job query parameters

`GET /jobs` and company job listing support:

- `page`
- `limit` (1-50)
- `search`
- `city`
- `type`
- `mode`
- `experienceLevel`
- `sortBy=createdAt|salaryMin|salaryMax|title`
- `sortOrder=asc|desc`

Public job endpoints intentionally return only ACTIVE, non-expired jobs.

## Error format

Validation errors may include:

```json
{
  "message": "Invalid job data",
  "errors": {
    "title": ["Job title should have at least 2 characters"]
  }
}
```

Authentication failures return HTTP 401. Authorization failures return HTTP 403. Missing resources return HTTP 404. Duplicate state transitions normally return HTTP 409.
