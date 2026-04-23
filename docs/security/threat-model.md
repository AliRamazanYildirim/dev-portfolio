# Threat Model (STRIDE)

Scope: `arytechsolutions.com` Admin-Panel + oeffentliche APIs.
Aktualisiert: 22.04.2026.

## Assets

- Admin-Credentials (bcrypt-Hash in Env).
- JWT Session Cookie (`admin-auth-token`, 24h, httpOnly, SameSite=Strict).
- Kundendaten (MongoDB: `customers`, `projects`, `referral`, `contactmessages`).
- Cloudinary-API-Secret (Env) und uploaded Image-URLs.
- SMTP-Credentials (Env) fuer Benachrichtigungen.

## Trust Boundaries

1. Internet → Vercel Edge (WAF, Bot-Management, Rate-Limits).
2. Edge → Next.js App (Proxy: Auth + CSRF).
3. App → MongoDB Atlas / Cloudinary / SMTP.

## STRIDE Matrix

| Kategorie | Bedrohung | Mitigation | Verantwortlicher Modul |
| --- | --- | --- | --- |
| **S**poofing | Gestohlene Admin-Credentials | bcrypt (cost=12), Turnstile, Rate-Limit, Failed-Attempt-Lock, Exponential Backoff | `app/api/admin/login/**`, `lib/auth.ts` |
| S | Session-Hijack via Cookie-Diebstahl | httpOnly, Secure, SameSite=Strict, JTI-Revocation, CSP `frame-ancestors 'none'` | `lib/auth.ts`, `lib/security/tokenRevocation.ts` |
| **T**ampering | Bearbeiten fremder Kunden/Projekte per CSRF | Double-Submit CSRF-Token ueber Proxy | `lib/security/csrf.ts`, `proxy.ts` |
| T | Gefaelschter Upload (Polyglot/MIME-Spoof) | Magic-Byte Verifikation + Cloudinary Type-Check | `app/api/upload/lib/magicBytes.ts` |
| **R**epudiation | Admin-Aktionen ohne Nachweis | Audit-Log (geplant, Issue #audit-log) | `models/AuditLog.ts` |
| **I**nformation Disclosure | Cross-Tenant Data Leak in Queries | Repository-Layer prueft `adminId`, Zod-Validierung der Query-Parameter | `lib/repositories/**` |
| I | Fehlende Header bei statischen Seiten | CSP/HSTS/XFO global im `next.config.ts` gesetzt | `lib/security/headers.ts` |
| I | Klartext-Stacktraces in Responses | `handleError` liefert nur kuratierte Fehlermeldungen | `lib/api-response.ts` |
| **D**enial of Service | Login-Brute-Force | Rate-Limit pro IP + Email + globale Lock | `app/api/admin/login/service.ts` |
| D | Unbegrenzter Kontakt-Spam | Rate-Limit + Turnstile | `app/api/contact/**`, `app/api/send-email/**` |
| D | Unbounded Upload-Bytes | 10 MB Size-Cap in `validateUploadFile` | `app/api/upload/validation.ts` |
| **E**levation of Privilege | Ungeschuetzte Admin-API | `proxy.ts` verifiziert JWT + CSRF fuer alle `/api/admin/*` | `proxy.ts` |
| E | Token verbleibt nach Logout gueltig | JTI-Blacklist mit TTL-Index | `lib/security/tokenRevocation.ts`, `models/RevokedToken.ts` |

## Offene Punkte / Backlog

- Audit-Log fuer mutating Admin-Aktionen (`models/AuditLog.ts`, Issue offen).
- Env-Schema Validierung zum Startup (`lib/security/env.ts`, Issue offen).
- Nonce-basierte CSP fuer Produktion (aktuell Baseline mit `'unsafe-inline'` fuer Style).
