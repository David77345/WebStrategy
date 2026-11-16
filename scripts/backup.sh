#!/usr/bin/env bash
# Linux runner only. Do not enable shell tracing: environment contains secrets.
set -euo pipefail
umask 077
for tool in pg_dump age aws sha256sum stat; do command -v "$tool" >/dev/null || { echo "Missing required tool: $tool" >&2; exit 1; }; done
for key in PGHOST PGDATABASE PGUSER PGPASSWORD AGE_RECIPIENT R2_ENDPOINT R2_BUCKET AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY; do
  [[ -n "${!key:-}" ]] || { echo "Missing required variable: $key" >&2; exit 1; }
done
[[ "${PGSSLMODE:-}" == "verify-full" ]] || { echo 'Set PGSSLMODE=verify-full and a trusted PGSSLROOTCERT.' >&2; exit 1; }
[[ "$R2_ENDPOINT" =~ ^https://[a-zA-Z0-9]+\.r2\.cloudflarestorage\.com$ ]] || { echo 'Invalid R2 endpoint.' >&2; exit 1; }
[[ "$R2_BUCKET" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ]] || { echo 'Invalid bucket.' >&2; exit 1; }
export AWS_DEFAULT_REGION=auto PGCONNECT_TIMEOUT=15
export AWS_EC2_METADATA_DISABLED=true AWS_PAGER=''
work_dir="$(mktemp -d -t day-backup.XXXXXXXX)"
trap 'rm -rf -- "$work_dir"' EXIT
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
name="day-${stamp}-$(od -An -N4 -tx1 /dev/urandom | tr -d ' \n').dump.age"
# Stream directly into encryption; plaintext is never written to disk.
# pipefail prevents upload if pg_dump or age fails, including version mismatch.
pg_dump --format=custom --no-owner --no-acl | age --recipient "$AGE_RECIPIENT" --output "$work_dir/$name"
[[ -s "$work_dir/$name" ]] || { echo 'Empty backup; upload cancelled.' >&2; exit 1; }
checksum="$(sha256sum "$work_dir/$name" | cut -d ' ' -f 1)"
bytes="$(stat -c %s "$work_dir/$name")"
printf '{"version":1,"createdUtc":"%s","object":"daily/%s","ciphertextSha256":"%s","bytes":%s}\n' "$stamp" "$name" "$checksum" "$bytes" > "$work_dir/manifest.json"
aws --endpoint-url "$R2_ENDPOINT" s3 cp "$work_dir/$name" "s3://$R2_BUCKET/daily/$name" --only-show-errors
remote_bytes="$(aws --endpoint-url "$R2_ENDPOINT" s3api head-object --bucket "$R2_BUCKET" --key "daily/$name" --query ContentLength --output text)"
[[ "$remote_bytes" == "$bytes" ]] || { echo 'Remote size mismatch.' >&2; exit 1; }
# Publish manifest only after the dump has been uploaded and size verified.
aws --endpoint-url "$R2_ENDPOINT" s3 cp "$work_dir/manifest.json" "s3://$R2_BUCKET/daily/$name.json" --content-type application/json --only-show-errors
printf 'Encrypted backup uploaded: %s (%s bytes). Restore test still required.\n' "$name" "$bytes"
