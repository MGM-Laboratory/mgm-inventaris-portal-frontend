#!/usr/bin/env bash
# Prints one line for every file of an exported image filesystem, sorted by path. A regular file gives its SHA-256 and a symlink
# gives its target, so the output does not depend on timestamps, owners or the order in which the files were written.
# Usage: hash-image-files.sh <directory>
set -euo pipefail

if [ "$#" -ne 1 ] || [ ! -d "$1" ]; then
  echo "usage: hash-image-files.sh <directory>" >&2
  exit 2
fi

cd "$1"
export LC_ALL=C

find . -type f ! -name '_full.segment.rsc' -print0 | sort -z | xargs -0 -r sha256sum
# Next.js puts a random placeholder %%drp:name:hex%% in the payload of a dynamic route, so the value is replaced before hashing
find . -type f -name '_full.segment.rsc' -print0 | sort -z | while IFS= read -r -d '' file; do
  hash="$(sed -E 's/%%drp:([A-Za-z0-9_]+):[0-9a-f]+%%/%%drp:\1:RANDOM%%/g' "$file" | sha256sum | cut -d ' ' -f 1)"
  printf '%s  %s\n' "$hash" "$file"
done
find . -type l -print0 | sort -z | while IFS= read -r -d '' link; do
  printf 'link  %s -> %s\n' "$link" "$(readlink "$link")"
done
