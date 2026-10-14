# auth.md

VoiceyBill authentication and agent-registration guide.

## Agent Audience

This document is for AI agents that need to authenticate on behalf of a
VoiceyBill user in order to call the VoiceyBill API
(`https://voiceybill-server.vercel.app/api`). Agents act with the full
permissions of the authenticated user.

## Overview

VoiceyBill uses JWT (bearer token) authentication. A user account is required;
agents obtain a token by authenticating with the user's verified email and
password.

## Discovery Metadata

- Authorization server metadata: [`/.well-known/oauth-authorization-server`](/.well-known/oauth-authorization-server)
- Protected resource metadata: [`/.well-known/oauth-protected-resource`](/.well-known/oauth-protected-resource)

## agent_auth

```json
{
  "skill": "https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md",
  "register_uri": "https://voiceybill-server.vercel.app/api/auth/register",
  "supported_identity_types": ["verified_email"],
  "supported_credential_types": ["jwt_bearer"],
  "authorization_server": "https://voiceybill.com/.well-known/oauth-authorization-server",
  "protected_resource": "https://voiceybill.com/.well-known/oauth-protected-resource"
}
```

## Registration / Provisioning

Create an account, then verify the email with the one-time code that is emailed.

- **POST** `https://voiceybill-server.vercel.app/api/auth/register` — Create a new account
- **POST** `https://voiceybill-server.vercel.app/api/auth/verify-otp` — Verify the email with the OTP
- **POST** `https://voiceybill-server.vercel.app/api/auth/resend-otp` — Resend the verification OTP

## Supported Methods

- Email + password (email verified via OTP)
- Password reset via `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`

## Credential Usage

Authenticate to receive a JWT, then send it as a bearer token on every
authenticated request.

- **POST** `https://voiceybill-server.vercel.app/api/auth/login` — Authenticate and receive a JWT

### Request Format (Login)

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

### Response Format

```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Using the Token

```
Authorization: Bearer <token>
```

## Token Lifetime

Tokens are valid for 7 days after issuance.

## Rate Limits

- Login / register: 5 attempts per minute per IP
- OTP endpoints: 3 attempts per minute per IP
