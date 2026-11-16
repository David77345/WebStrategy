#!/usr/bin/env bash
# Restore only to a NEW isolated database; never to the live database.
set -euo pipefail
umask 077
for tool in age pg_restore psql sha256sum; do command -v "$tool" >/dev/null || { echo "Missing required tool: $tool" >&2; exit 1; }; done
for key in PGHOST PGDATABASE PGUSER PGPASSWORD AGE_IDENTITY_FILE BACKUP_FILE BACKUP_SHA256 RESTORE_CONFIRM_DATABASE; do
  [[ -n "${!key:-}" ]] || { echo "Missing required variable: $key" >&2; exit 1; }
done
[[ "${PGSSLMODE:-}" == "verify-full" ]] || { echo 'TLS hostname verification required.' >&2; exit 1; }
[[ "$PGDATABASE" =~ ^day_restore_[a-z0-9_]+$ && "$PGDATABASE" == "$RESTORE_CONFIRM_DATABASE" ]] || { echo 'Use a separate database named day_restore_<ticket> and confirm its exact name.' >&2; exit 1; }
[[ "$BACKUP_SHA256" =~ ^[a-fA-F0-9]{64}$ && -f "$BACKUP_FILE" && -f "$AGE_IDENTITY_FILE" ]] || { echo 'Invalid backup, checksum or identity file.' >&2; exit 1; }
export PGCONNECT_TIMEOUT=15
actual="$(sha256sum "$BACKUP_FILE" | cut -d ' ' -f 1)"
[[ "$actual" == "${BACKUP_SHA256,,}" ]] || { echo 'Ciphertext checksum mismatch.' >&2; exit 1; }
objects="$(psql -X -A -t -v ON_ERROR_STOP=1 -c "SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname NOT LIKE 'pg_%' AND n.nspname <> 'information_schema';")"
[[ "$objects" == '0' ]] || { echo 'Target has existing objects; refusing to overwrite.' >&2; exit 1; }
age --decrypt --identity "$AGE_IDENTITY_FILE" "$BACKUP_FILE" | pg_restore --dbname="$PGDATABASE" --no-owner --no-acl --exit-on-error --single-transaction
echo 'Restore completed in isolated database. Do not reconnect production or activate deliveries until reconciliation and privacy checks pass.'
