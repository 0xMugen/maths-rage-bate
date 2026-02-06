#!/usr/bin/env bash
# Render LaTeX to PNG using QuickLaTeX API with padding
# Usage: echo "latex" | ./render-quicklatex.sh output.png

OUTPUT="${1:-/tmp/math-slop.png}"
PADDING="${2:-40}"

if [ ! -t 0 ]; then
    LATEX=$(cat -)
else
    echo "Usage: echo 'latex' | render-quicklatex.sh output.png [padding]"
    exit 1
fi

# Call QuickLaTeX API
RESPONSE=$(curl -s "https://quicklatex.com/latex3.f" \
  -d "formula=$LATEX" \
  -d "fsize=40px" \
  -d "fcolor=FFFFFF" \
  -d "bcolor=0d1117" \
  -d "mode=0" \
  -d "out=1")

STATUS=$(echo "$RESPONSE" | head -1 | tr -d '\r')
if [ "$STATUS" != "0" ]; then
    echo "QuickLaTeX error: $RESPONSE" >&2
    exit 1
fi

URL=$(echo "$RESPONSE" | sed -n '2p' | tr -d '\r' | awk '{print $1}')
TMP="/tmp/slop-raw-$$.png"

# Download raw image
curl -s -o "$TMP" "$URL"

# Add padding with sharp
node -e "
const sharp = require('sharp');
const p = ${PADDING};
sharp('$TMP')
  .metadata()
  .then(m => sharp('$TMP')
    .extend({
      top: p,
      bottom: p,
      left: p,
      right: p,
      background: '#0d1117'
    })
    .toFile('$OUTPUT'))
  .then(() => console.log('$OUTPUT'))
  .catch(e => { console.error(e.message); process.exit(1); });
"

rm -f "$TMP"
