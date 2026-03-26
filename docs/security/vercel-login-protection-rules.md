# Vercel Login Protection Rules

Bu belge `/api/admin/login` endpointi icin Vercel tarafinda uygulanacak bot ve rate koruma kurallarini tanimlar.

## Neden gerekli?

Uygulama icinde login rate-limit aktif olsa bile, edge seviyesinde bir katman daha eklemek brute-force ve bot trafigini daha erken keser.

## Uygulama adimlari (Vercel Dashboard)

1. `Project -> Settings -> Security` bolumune gir.
2. `Bot Management`i aktif et.
3. `WAF / Firewall Rules` altinda asagidaki kurallari olustur.
4. Kurallari `Enforce` modunda yayinla.

## Kural Seti

### 1) Block known malicious bots (login)

- Name: `block_malicious_bots_login`
- Scope: `/api/admin/login`
- Condition: request path is `/api/admin/login` AND bot score is malicious/suspicious
- Action: `Block`

### 2) Challenge unknown automation on login

- Name: `challenge_automation_login`
- Scope: `/api/admin/login`
- Condition: request path is `/api/admin/login` AND bot score is automated/likely automated
- Action: `Challenge`

### 3) Edge rate limit by IP

- Name: `edge_rate_limit_login_ip`
- Scope: `/api/admin/login`
- Match: per-IP
- Threshold: `20 requests / 10 minutes`
- Action: `Block` for `10 minutes`

### 4) Edge burst shield

- Name: `edge_burst_limit_login_ip`
- Scope: `/api/admin/login`
- Match: per-IP
- Threshold: `5 requests / 30 seconds`
- Action: `Challenge` (veya Block)

## Senkronizasyon notu

Uygulama ici limitler su anda varsayilan olarak:

- `LOGIN_IP_WINDOW_LIMIT=20`
- `LOGIN_IP_WINDOW_SECONDS=600`
- `LOGIN_EMAIL_IP_WINDOW_LIMIT=8`
- `LOGIN_EMAIL_IP_WINDOW_SECONDS=600`
- `LOGIN_FAILED_LOCK_LIMIT=10`
- `LOGIN_FAILED_LOCK_WINDOW_SECONDS=900`
- `LOGIN_BACKOFF_BASE_SECONDS=2`
- `LOGIN_BACKOFF_MAX_SECONDS=120`

## Cloudflare Turnstile (Server-Side Verify)

Login endpointi Turnstile tokenini server-side dogrular.

Gerekli env degiskenleri:

- `TURNSTILE_ENABLED=true`
- `TURNSTILE_SECRET_KEY=<secret>`
- `TURNSTILE_VERIFY_TIMEOUT_MS=8000`
- `NEXT_PUBLIC_TURNSTILE_ENABLED=true`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site-key>`

Not: `TURNSTILE_ENABLED=true` iken secret eksikse login endpoint bilincli olarak hata verir.

Vercel edge kurallari ile uygulama ici limitlerin ayni mantikta kalmasi onerilir.

## Test checklist

1. Yanlis sifre ile ardarda deneme yap, once 401 sonra lock eşiğinde 429 donmeli.
2. Ayni IP ile hizli istek at, edge tarafinda challenge/block tetiklenmeli.
3. Dogru giriste lock sayaci sifirlanmali.
