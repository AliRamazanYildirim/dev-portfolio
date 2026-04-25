# Authenticated ZAP Scan

Baseline tarama (`security:zap`) sadece public endpoint'leri görür. Bu script `/admin` arkasını da tarar: login → JWT cookie → ZAP `Replacer` ile her isteğe inject.

## Setup

1. `.env.zap` oluştur:
      bash  ```
   cp .env.zap.example .env.zap

   ```text
   `ZAP_ADMIN_EMAIL` ve `ZAP_ADMIN_PASSWORD` değerleri `.env`'deki `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` (plain karşılığı) ile eşleşmeli.

2. Turnstile devre dışı olmalı (`.env`):

   ```bash
   TURNSTILE_ENABLED=false
   ```bash
   Production'da `true` ise scan öncesi geçici olarak kapat. (curl headless → captcha çözemez.)

3. Uygulamayı başlat:

   ```bash
   bun run build && bun run start
   ```

## Çalıştırma

```bash
bun run security:zap:auth
```

Rapor: `reports/security/zap-auth-report.{html,json}`

## Nasıl çalışıyor

1. Script `POST /api/admin/login` → `Set-Cookie: admin-auth-token=<JWT>` çıkarır.
2. ZAP'a `-z` ile Replacer config geçilir → her HTTP isteğine `Cookie: admin-auth-token=<JWT>` eklenir.
3. `zap-baseline.py` `/admin` ağacında pasif tarar (active scan değil — admin verilerini bozma riski yok).

## Limitler

- Pasif tarama; SQL/CSRF active testleri yok. Onlar için manuel review (Task 2).
- JWT TTL süresi içinde tamamlanmalı (varsayılan: yeterli).
- Turnstile aktifken çalışmaz.
