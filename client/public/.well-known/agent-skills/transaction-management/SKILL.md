# Transaction Management Skill

## Overview

Manage financial transactions in VoiceyBill — create, read, update, and delete records of income and expenses.

## Base URL

`https://voiceybill-server.vercel.app/api`

## Authentication

Bearer token required. Obtain via `POST /auth/login`.

## Endpoints

### List Transactions

```
GET /transaction
```

Query parameters:
- `page` (number) — Page number for pagination
- `limit` (number) — Items per page
- `type` (string) — Filter by "income" or "expense"
- `category` (string) — Filter by category
- `startDate` (ISO string) — Filter from date
- `endDate` (ISO string) — Filter to date
- `search` (string) — Search by description

### Create Transaction

```
POST /transaction
```

Body:
```json
{
  "amount": 42.50,
  "type": "expense",
  "category": "Food",
  "description": "Lunch at cafe",
  "date": "2026-07-19T12:00:00.000Z"
}
```

### Update Transaction

```
PUT /transaction/:id
```

### Delete Transaction

```
DELETE /transaction/:id
```

### Voice Input

```
POST /voice/transcribe
Content-Type: multipart/form-data
```

Upload an audio file to create a transaction via voice.

### Receipt Scan

```
POST /transaction/scan-receipt
Content-Type: multipart/form-data
```

Upload a receipt image for AI-powered extraction.
