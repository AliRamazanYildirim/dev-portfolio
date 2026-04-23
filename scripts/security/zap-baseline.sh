#!/usr/bin/env bash
# ZAP Baseline Scan gegen die lokal laufende Next.js App.
#
# Voraussetzungen:
#   - Docker installiert (Linux: host-gateway wird per --add-host gesetzt)
#   - App laeuft unter http://localhost:3000 (oder $TARGET_URL)
#     Empfehlung: gegen Production-Build scannen (`bun run build && bun run start`),
#     damit dev-only CSP 'unsafe-eval' nicht anschlaegt.
#
# Usage:
#   bun run security:zap
#   TARGET_URL=https://staging.example.com bun run security:zap

set -euo pipefail

TARGET_URL="${TARGET_URL:-http://host.docker.internal:3000}"
REPORT_DIR="reports/security"
RULES_FILE=".zap/baseline-rules.tsv"
CONTEXT_FILE=".zap/context.xml"

mkdir -p "$REPORT_DIR"

echo "→ Running ZAP baseline scan against: $TARGET_URL"

docker --context default run --rm \
  --add-host=host.docker.internal:host-gateway \
  -v "$PWD/$REPORT_DIR:/zap/wrk:rw" \
  -v "$PWD/$RULES_FILE:/zap/wrk/rules.tsv:ro" \
  -v "$PWD/$CONTEXT_FILE:/zap/wrk/context.xml:ro" \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py \
    -t "$TARGET_URL" \
    -c rules.tsv \
    -n context.xml \
    -r zap-baseline-report.html \
    -J zap-baseline-report.json \
    -I

echo "→ Reports written to $REPORT_DIR/"
