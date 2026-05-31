#!/bin/sh
set -e

# 마이그레이션 실행
echo "[Migration] Running..."
node -e "
  const ds = require('./dist/data-source.js').default;
  ds.initialize()
    .then(() => ds.runMigrations())
    .then(() => { console.log('[Migration] Done'); process.exit(0); })
    .catch(err => { console.error('[Migration] Failed:', err.message); process.exit(1); });
"

# NestJS 앱 시작
echo "[App] Starting..."
exec node dist/main
