#!/usr/bin/env bash
# Generate and render a math slop meme
# Usage: ./slop.sh [output.png]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT="${1:-/tmp/math-slop-$(date +%s).png}"
HTML_TMP="/tmp/math-slop-$$.html"

# Generate HTML
node "$SCRIPT_DIR/generate-slop.js" --html > "$HTML_TMP"

# Try to render with puppeteer
if command -v node &> /dev/null && node -e "require('puppeteer')" 2>/dev/null; then
    node "$SCRIPT_DIR/render-to-png.js" "$HTML_TMP" "$OUTPUT"
    rm "$HTML_TMP"
    echo "Generated: $OUTPUT"
else
    echo "Puppeteer not installed. HTML saved to: $HTML_TMP"
    echo "To render manually:"
    echo "  1. Open $HTML_TMP in a browser"
    echo "  2. Screenshot the result"
    echo ""
    echo "Or install puppeteer: npm install puppeteer"
fi
