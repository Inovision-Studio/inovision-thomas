#!/usr/bin/env bash
# One-command Supabase setup: applies the schema and loads all content.
# Usage:
#   cp .env.supabase.example .env.supabase   # then paste your real strings
#   bash scripts/setup-supabase.sh
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.supabase ]; then
  echo "Missing .env.supabase — copy .env.supabase.example and fill in your Supabase strings first."
  exit 1
fi

set -a; source .env.supabase; set +a

if [[ "${DATABASE_URL:-}" == *"<ref>"* || -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL still has placeholders — edit .env.supabase with your real Supabase connection strings."
  exit 1
fi

echo "→ Generating Prisma client"
npx prisma generate

echo "→ Applying schema to Supabase (migrate deploy)"
npx prisma migrate deploy

echo "→ Seeding content (products, blog, images, branding)"
npx tsx prisma/seed.ts

echo "✓ Supabase ready. Owner password: smokey2025 (change it in Admin → Settings)."
echo "  Next: set the same DATABASE_URL / DIRECT_URL / JWT_SECRET in Vercel, then deploy."
