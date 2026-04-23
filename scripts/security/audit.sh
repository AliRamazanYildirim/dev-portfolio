#!/usr/bin/env bash
# Dependency-Vulnerability Scan.
#
# Bevorzugt osv-scanner (unterstuetzt bun.lock / package.json),
# faellt zurueck auf `bun pm audit`. Bricht bei Hoch-/Kritischen Funden ab.

set -euo pipefail

REPORT_DIR="reports/security"
mkdir -p "$REPORT_DIR"

if command -v osv-scanner >/dev/null 2>&1; then
  echo "→ Running osv-scanner"
  osv-scanner --lockfile=bun.lock --format=table | tee "$REPORT_DIR/osv-report.txt"
  exit 0
fi

echo "→ osv-scanner nicht gefunden, fallback auf bun audit"
if [[ ! -f "bun.lock" ]]; then
  echo "   bun.lock fehlt – Audit wird uebersprungen."
  exit 0
fi

# `bun audit` gibt bei Funden Exit!=0 zurueck; Script soll dennoch Report schreiben.
set +e
bun audit --audit-level=high | tee "$REPORT_DIR/bun-audit.txt"
audit_exit=${PIPESTATUS[0]}
set -e
exit "$audit_exit"
