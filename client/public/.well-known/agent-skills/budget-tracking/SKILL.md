# Budget Tracking Skill

## Overview

Set and monitor budgets by category with spending alerts and progress tracking.

## Base URL

`https://voiceybill-server.vercel.app/api`

## Authentication

Bearer token required. Obtain via `POST /auth/login`.

## Endpoints

### List Budgets

```
GET /budget
```

Returns all active budgets with current spending progress.

### Create Budget

```
POST /budget
```

Body:
```json
{
  "category": "Food",
  "amount": 500,
  "period": "monthly"
}
```

### Update Budget

```
PUT /budget/:id
```

### Delete Budget

```
DELETE /budget/:id
```
