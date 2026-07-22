#!/bin/bash
# Resize/compress JPEGs in place for web use.
# Usage: scripts/optimize-images.sh [folder]   (defaults to images/)
#
# Skips files already small enough (<= 500KB and <= 2400px on the long edge)
# so re-running the script on an already-optimized folder is a no-op.

set -euo pipefail

TARGET="${1:-images}"
MAX_DIM=2400
MAX_BYTES=512000
QUALITY=78

if ! command -v sips >/dev/null 2>&1; then
  echo "sips not found (this script is macOS-only)." >&2
  exit 1
fi

find "$TARGET" -type f \( -iname '*.jpg' -o -iname '*.jpeg' \) | while read -r f; do
  size=$(stat -f%z "$f")
  dims=$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null)
  w=$(echo "$dims" | awk '/pixelWidth/{print $2}')
  h=$(echo "$dims" | awk '/pixelHeight/{print $2}')
  longest=$(( w > h ? w : h ))

  if [ "$size" -le "$MAX_BYTES" ] && [ "$longest" -le "$MAX_DIM" ]; then
    echo "skip  $f (${size}B, ${w}x${h})"
    continue
  fi

  sips -Z "$MAX_DIM" -s formatOptions "$QUALITY" "$f" >/dev/null 2>&1
  newsize=$(stat -f%z "$f")
  echo "opt   $f (${size}B -> ${newsize}B)"
done
