#!/usr/bin/env bash
# Resize report section images to column width (688px) for faster loads.
# Run from repo root. Back up originals first if you need full resolution.
# Requires: macOS (sips) or ImageMagick (convert).

set -e
REPORT_DIR="public/report"
WIDTH=688

if [[ ! -d "$REPORT_DIR" ]]; then
  echo "Error: $REPORT_DIR not found. Run from repo root."
  exit 1
fi

if command -v sips &>/dev/null; then
  echo "Using sips (macOS)..."
  for f in "$REPORT_DIR"/report-*.png; do
    [[ -f "$f" ]] || continue
    echo "  $(basename "$f")"
    sips -w $WIDTH "$f" 1>/dev/null
  done
elif command -v convert &>/dev/null; then
  echo "Using ImageMagick..."
  for f in "$REPORT_DIR"/report-*.png; do
    [[ -f "$f" ]] || continue
    echo "  $(basename "$f")"
    convert "$f" -resize "${WIDTH}x>" "$f"
  done
else
  echo "Error: need 'sips' (macOS) or ImageMagick 'convert'. Install ImageMagick: brew install imagemagick"
  exit 1
fi

echo "Done. Section images resized to ${WIDTH}px width."
