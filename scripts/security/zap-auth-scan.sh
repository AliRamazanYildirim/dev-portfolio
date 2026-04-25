#!/usr/bin/env bash
# ZAP Authenticated Baseline Scan gegen den geschuetzten /admin Bereich.
#
# Workflow:
#   1. Login via /api/admin/login → JWT-Cookie extrahieren
#   2. ZAP mit Replacer-Addon, das den Cookie in jede Anfrage injiziert
#   3. Baseline-Scan auf /admin Pfade
#
# Voraussetzungen:
#   - .env.zap mit ZAP_ADMIN_EMAIL und ZAP_ADMIN_PASSWORD
#   - App laeuft unter http://localhost:3000 (oder $TARGET_URL)
#   - TURNSTILE_ENABLED!=true (sonst kann curl-Login nicht durchgehen)
#
# Usage: bun run security:zap:auth

set -euo pipefail

TARGET_URL="${TARGET_URL:-http://host.docker.internal:3000}"
LOCAL_TARGET="${LOCAL_TARGET:-http://localhost:3000}"
SCAN_PATH="${SCAN_PATH:-/admin}"
REPORT_DIR="reports/security"
RULES_FILE=".zap/baseline-rules.tsv"
ENV_FILE=".env.zap"

# ─── Credentials laden ──────────────────────────────────────────────────────
if [[ ! -f "$ENV_FILE" ]]; then
  echo "✗ $ENV_FILE fehlt. Kopiere .env.zap.example und passe Werte an." >&2
  exit 1
fi
# shellcheck disable=SC1090
set -a && source "$ENV_FILE" && set +a

: "${ZAP_ADMIN_EMAIL:?ZAP_ADMIN_EMAIL fehlt in $ENV_FILE}"
: "${ZAP_ADMIN_PASSWORD:?ZAP_ADMIN_PASSWORD fehlt in $ENV_FILE}"

mkdir -p "$REPORT_DIR"

# ─── Login → Cookie ─────────────────────────────────────────────────────────
echo "→ Login als $ZAP_ADMIN_EMAIL"

LOGIN_HEADERS="$(curl -sS -i -X POST "$LOCAL_TARGET/api/admin/login" \
  -H "Content-Type: application/json" \
  --data-binary "$(ZAP_ADMIN_EMAIL="$ZAP_ADMIN_EMAIL" ZAP_ADMIN_PASSWORD="$ZAP_ADMIN_PASSWORD" \
    bun -e 'process.stdout.write(JSON.stringify({email:process.env.ZAP_ADMIN_EMAIL,password:process.env.ZAP_ADMIN_PASSWORD}))')" \
  | tr -d '\r')"

AUTH_TOKEN="$(printf '%s\n' "$LOGIN_HEADERS" \
  | grep -i '^set-cookie: admin-auth-token=' \
  | head -n1 \
  | sed -E 's/^[Ss]et-[Cc]ookie: admin-auth-token=([^;]+).*/\1/')"

if [[ -z "${AUTH_TOKEN:-}" ]]; then
  echo "✗ Login fehlgeschlagen. Antwort:" >&2
  printf '%s\n' "$LOGIN_HEADERS" | head -n 20 >&2
  exit 1
fi
echo "  ✓ Auth-Cookie erhalten"

# ─── ZAP Replacer-Konfiguration ─────────────────────────────────────────────
# Injiziert "Cookie: admin-auth-token=<token>" in jeden Request.
REPLACER_OPTS=(
  -config "replacer.full_list(0).description=AuthCookie"
  -config "replacer.full_list(0).enabled=true"
  -config "replacer.full_list(0).matchtype=REQ_HEADER"
  -config "replacer.full_list(0).matchstr=Cookie"
  -config "replacer.full_list(0).regex=false"
  -config "replacer.full_list(0).replacement=admin-auth-token=${AUTH_TOKEN}"
)

# ─── Scan ──────────────────────────────────────────────────────────────────
echo "→ ZAP authenticated baseline scan: ${TARGET_URL}${SCAN_PATH}"

docker --context default run --rm \
  --add-host=host.docker.internal:host-gateway \
  -v "$PWD/$REPORT_DIR:/zap/wrk:rw" \
  -v "$PWD/$RULES_FILE:/zap/wrk/rules.tsv:ro" \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py \
    -t "${TARGET_URL}${SCAN_PATH}" \
    -c rules.tsv \
    -r zap-auth-report.html \
    -J zap-auth-report.json \
    -I \
    -z "${REPLACER_OPTS[*]}"

echo "→ Reports written to $REPORT_DIR/zap-auth-report.{html,json}"
