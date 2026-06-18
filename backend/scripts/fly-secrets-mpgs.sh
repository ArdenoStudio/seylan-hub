#!/usr/bin/env bash
# Apply MPGS-related Fly.io secrets for seylan-hub-api.
#
# Prerequisites: flyctl installed and authenticated (`flyctl auth login`).
#
# Usage (from your machine, after exporting secrets — do not commit values):
#   cd backend
#   export MPGS_API_PASSWORD='...'
#   export MPGS_WEBHOOK_SECRET='...'
#   ./scripts/fly-secrets-mpgs.sh
#
# Optional overrides:
#   MPGS_MERCHANT_ID (default: CURSOR1)
#   MPGS_OPERATOR_ID (default: CURSOR1op)
#   MPGS_HOST MPGS_API_VERSION FLY_APP

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v flyctl >/dev/null 2>&1 && ! command -v fly >/dev/null 2>&1; then
  echo "flyctl not found. Install: https://fly.io/docs/hands-on/install-flyctl/" >&2
  exit 1
fi

FLY="${FLY:-flyctl}"
command -v flyctl >/dev/null 2>&1 || FLY="fly"

if ! "$FLY" auth whoami >/dev/null 2>&1; then
  echo "Not logged in to Fly.io. Run: $FLY auth login" >&2
  exit 1
fi

: "${MPGS_API_PASSWORD:?Set MPGS_API_PASSWORD (integration / API password from MPGS portal)}"
: "${MPGS_WEBHOOK_SECRET:?Set MPGS_WEBHOOK_SECRET (Notification Secret from Webhook Notifications)}"

APP="${FLY_APP:-seylan-hub-api}"
MID="${MPGS_MERCHANT_ID:-CURSOR1}"
OPID="${MPGS_OPERATOR_ID:-CURSOR1op}"
HOST="${MPGS_HOST:-test-seylan.mtf.gateway.mastercard.com}"
VER="${MPGS_API_VERSION:-79}"

"$FLY" secrets set \
  MPGS_ENABLE=true \
  "MPGS_MERCHANT_ID=$MID" \
  "MPGS_OPERATOR_ID=$OPID" \
  "MPGS_HOST=$HOST" \
  "MPGS_API_VERSION=$VER" \
  "MPGS_API_PASSWORD=$MPGS_API_PASSWORD" \
  "MPGS_WEBHOOK_SECRET=$MPGS_WEBHOOK_SECRET" \
  --app "$APP"

echo "MPGS secrets updated on Fly app: $APP"
