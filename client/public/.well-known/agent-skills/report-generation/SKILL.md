# Report Generation Skill

## Overview

Generate and schedule financial reports delivered via email.

## Base URL

`https://voiceybill-server.vercel.app/api`

## Authentication

Bearer token required. Obtain via `POST /auth/login`.

## Endpoints

### Generate Report

```
POST /report/generate
```

Body:
```json
{
  "type": "monthly",
  "startDate": "2026-07-01T00:00:00.000Z",
  "endDate": "2026-07-31T23:59:59.000Z",
  "format": "pdf"
}
```

### Schedule Report

```
POST /report/schedule
```

Body:
```json
{
  "frequency": "weekly",
  "day": "monday",
  "email": "user@example.com",
  "type": "summary"
}
```

### List Scheduled Reports

```
GET /report/schedules
```

### Delete Scheduled Report

```
DELETE /report/schedules/:id
```
