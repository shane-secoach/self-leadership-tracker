#!/bin/bash
set -e

echo "Running database migrations..."
pnpm db:push || true

echo "Starting application..."
node dist/server/_core/index.js
