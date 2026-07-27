{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "engleski-online",
  "compatibility_date": "2026-07-27",
  "compatibility_flags": ["nodejs_compat"],
  "main": "vinext/server/app-router-entry",
  "workers_dev": true,
  "assets": {
    "directory": "dist/client",
    "not_found_handling": "none",
    "binding": "ASSETS"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "engleski-online-content",
      "database_id": "00000000-0000-4000-8000-000000000000",
      "migrations_dir": "drizzle"
    }
  ]
}
