# Financial Analytics Skill

## Overview

Query spending analytics, category breakdowns, income vs expense trends, and financial insights.

## Base URL

`https://voiceybill-server.vercel.app/api`

## Authentication

Bearer token required. Obtain via `POST /auth/login`.

## Endpoints

### Get Analytics Summary

```
GET /analytics/summary
```

Query parameters:
- `startDate` (ISO string) — Period start
- `endDate` (ISO string) — Period end

Returns total income, total expenses, net balance, and transaction count.

### Get Category Breakdown

```
GET /analytics/categories
```

Query parameters:
- `type` (string) — "income" or "expense"
- `startDate` (ISO string)
- `endDate` (ISO string)

Returns spending/income breakdown by category with percentages.

### Get Trends

```
GET /analytics/trends
```

Query parameters:
- `period` (string) — "daily", "weekly", or "monthly"
- `startDate` (ISO string)
- `endDate` (ISO string)

Returns time-series data for income and expenses.
