# OWASP ASVS L1 Checklist — Portfolio Admin

Pragmatische L1-Checkliste fuer den Admin-Bereich. L2/L3 optional.

| ID | Anforderung | Status | Umsetzung |
| --- | --- | --- | --- |
| V2.1 | Password Policy | ✅ | Admin-Passwort per Script gesetzt, bcrypt cost=12 |
| V2.2 | Brute-Force Protection | ✅ | Rate-Limit + Failed-Lock + Exponential Backoff (`app/api/admin/login`) |
| V2.5 | Credential Recovery | N/A | Nur interner Admin, kein Self-Service |
| V3.2 | Session Binding | ✅ | JWT mit `jti`, Revocation-Liste |
| V3.3 | Session Logout | ✅ | Logout ruft `revokeToken` + loescht Cookie |
| V3.4 | Cookie Attributes | ✅ | httpOnly, Secure (prod), SameSite=Strict |
| V4.1 | Authorization Enforcement | ✅ | Proxy prueft JWT fuer `/api/admin/**`, `/admin/**` |
| V4.3 | Admin Endpoints Protection | ✅ | Proxy-Matcher + CSRF |
| V5.1 | Input Validation | ✅ | Domain-spezifische `validation.ts` pro Route |
| V5.3 | Output Encoding | ✅ | React Escaping + kein raw HTML in API-Responses |
| V7.1 | Error Handling | ✅ | `handleError` serialisiert ohne Stack-Trace |
| V8.1 | Data Protection at Rest | ✅ | MongoDB Atlas encrypted storage |
| V9.1 | Communication Security | ✅ | HSTS Header + HTTPS only in Prod |
| V10.3 | Malicious Upload Prevention | ✅ | MIME + Magic-Byte Check, 10 MB Limit |
| V11.1 | CSRF Protection | ✅ | Double-Submit Token im Proxy |
| V12.1 | File Upload Scope | ✅ | Nur Bilder, Cloudinary-Bucket isoliert |
| V13.1 | API Authentication | ✅ | JWT Cookie |
| V14.1 | Configuration Hardening | 🔄 | Env-Schema-Validierung offen (Backlog) |
| V14.2 | Security Headers | ✅ | CSP, HSTS, XFO, Referrer-Policy, Permissions-Policy |
| V14.4 | Secrets Management | ✅ | Keine Secrets im Repo; Vercel Env + gitleaks CI-ready |

Legende: ✅ umgesetzt, 🔄 in Arbeit, ❌ fehlt, N/A nicht anwendbar.
