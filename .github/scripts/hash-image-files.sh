#!/usr/bin/env bash
# Prints one line for every file of an exported image filesystem, in three blocks of regular files, route payload files and
# symlinks that the compare job sorts by path. A regular file gives its SHA-256 and a symlink gives its target, so the output does not depend on timestamps, owners or the order in which the files were written.
# Usage: hash-image-files.sh <directory>
set -euo pipefail

if [ "$#" -ne 1 ] || [ ! -d "$1" ]; then
  echo "usage: hash-image-files.sh <directory>" >&2
  exit 2
fi

cd "$1"
export LC_ALL=C

find . -type f ! -name '_full.segment.rsc' -print0 | sort -z | xargs -0 -r sha256sum
# Next.js puts a random placeholder %%drp:name:hex%% in the payload of a dynamic route. The hex part is 13 or 14 characters long, and
# the last row of the payload counts the bytes before it, so a longer value also changes that number. Both are normalized, the value
# becomes RANDOM and the count changes by the same number of bytes, so a real change of the payload still changes the hash.
normalize_segment() {
  awk '
    {
      line = $0
      while (match(line, /%%drp:[A-Za-z0-9_]+:[0-9a-f]+%%/)) {
        split(substr(line, RSTART, RLENGTH), part, ":")
        replacement = "%%drp:" part[2] ":RANDOM%%"
        delta += length(replacement) - RLENGTH
        line = substr(line, 1, RSTART - 1) replacement substr(line, RSTART + RLENGTH)
      }
      rows[NR] = line
    }
    END {
      if (NR > 0 && match(rows[NR], /^[0-9a-f]+:[0-9]+$/)) {
        split(rows[NR], last, ":")
        rows[NR] = last[1] ":" (last[2] + delta)
      }
      for (i = 1; i <= NR; i++) print rows[i]
    }
  ' "$1"
}
find . -type f -name '_full.segment.rsc' -print0 | sort -z | while IFS= read -r -d '' file; do
  hash="$(normalize_segment "$file" | sha256sum | cut -d ' ' -f 1)"
  printf '%s  %s\n' "$hash" "$file"
done
find . -type l -print0 | sort -z | while IFS= read -r -d '' link; do
  printf 'link  %s -> %s\n' "$link" "$(readlink "$link")"
done
