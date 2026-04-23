#!/usr/bin/env bash
# Secret-Scan ueber das Arbeitsverzeichnis via gitleaks.

set -euo pipefail

REPORT_DIR="reports/security"
mkdir -p "$REPORT_DIR"

if ! command -v gitleaks >/dev/null 2>&1; then
  echo "gitleaks ist nicht installiert — Secret-Scan wird uebersprungen."
  echo "Installation: https://github.com/gitleaks/gitleaks"
  exit 0
fi

echo "→ Running gitleaks detect"
gitleaks detect \
  --redact \
  --report-format=json \
  --report-path="$REPORT_DIR/gitleaks-report.json" \
  --no-banner
