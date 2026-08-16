#!/bin/bash
# Generate srcset derivatives (480w/900w/1400w) for JPEGs used in the
# photography gallery, so mobile doesn't download the same full-size file
# used on a wide desktop monitor. Companion to optimize-images.sh, which
# caps the original at 2400px/78q — that original stays the largest srcset
# step; this script only adds smaller derivatives next to it.
#
# Usage: scripts/generate-responsive-images.sh [folder]   (defaults to images/)
#
# Idempotent: skips a width if the derivative already exists, and skips a
# width entirely if the original is already narrower than it (no upscaling).
# Excludes images/og/ (fixed-size social-share cards, not gallery photos).

set -euo pipefail

TARGET="${1:-images}"
WIDTHS=(480 900 1400)
QUALITY=72

if ! command -v sips >/dev/null 2>&1; then
  echo "sips not found (this script is macOS-only)." >&2
  exit 1
fi

find "$TARGET" -type f \( -iname '*.jpg' -o -iname '*.jpeg' \) ! -path '*/og/*' | while read -r f; do
  # Skip files that are themselves a generated derivative (re-running on an
  # already-processed folder shouldn't cascade into -480w-480w.jpg etc).
  case "$f" in
    *-480w.jpg|*-900w.jpg|*-1400w.jpg) continue ;;
  esac

  dir=$(dirname "$f")
  base=$(basename "$f")
  name="${base%.*}"
  src_w=$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')

  for w in "${WIDTHS[@]}"; do
    out="$dir/$name-${w}w.jpg"

    if [ "$src_w" -le "$w" ]; then
      echo "skip  $out (original only ${src_w}px wide)"
      continue
    fi
    if [ -f "$out" ]; then
      echo "skip  $out (already exists)"
      continue
    fi

    cp "$f" "$out"
    sips --resampleWidth "$w" -s format jpeg -s formatOptions "$QUALITY" "$out" >/dev/null 2>&1
    newsize=$(stat -f%z "$out")
    echo "made  $out (${newsize}B)"
  done
done
