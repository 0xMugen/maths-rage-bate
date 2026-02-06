---
name: math-slop
description: Generate satirical "math slop" meme images that parody viral math posts. Creates fake elegant discoveries by manipulating known formulas with terms that cancel out, unnecessary substitutions, and theatrical reveals. Renders LaTeX to PNG. Use for math memes, fake proofs, or when someone asks for "math slop."
---

# Math Slop Generator

Generate single-line "ragebait" formulas that connect famous constants (φ, π, e, i) in ways that look profound but are trivially true.

## What Is Math Slop?

Viral math content that presents trivial manipulations as profound discoveries:
- `φ^(ln e) = φ^(i⁴)` — just φ¹ = φ¹ since ln(e)=1 and i⁴=1
- `e^(iπ) + 1 + γ = 0 + γ` — Euler's identity with γ added to both sides
- `τ - 2π = e^(iπ) + 1` — 0 = 0 with extra steps
- Adding zeros: `(φ - φ)`, `ln(1)`, `e^(iπ) + 1`
- Multiplying by ones: `e^0`, `sin²θ + cos²θ`, `i⁴`

## Quick Generate

```bash
cd /home/server/clawd/skills/math-slop

# Generate single formula
node scripts/generate-slop.js

# Generate multiple
node scripts/generate-slop.js --count 5

# Render to PNG via QuickLaTeX
LATEX=$(node scripts/generate-slop.js)
curl -s "https://quicklatex.com/latex3.f" \
  --data-urlencode "formula=$LATEX" \
  --data "fsize=36px&fcolor=FFFFFF&bcolor=0d1117&mode=0&out=1" \
  | sed -n '2p' | awk '{print $1}' | xargs curl -s -o slop.png
```

## Rendering Options

1. **With Puppeteer** (best quality):
   ```bash
   npm install puppeteer
   ./scripts/slop.sh output.png
   ```

2. **Via QuickLaTeX API** (no deps, works anywhere):
   ```bash
   node scripts/generate-slop.js --latex-only | \
     curl -s -X POST "https://quicklatex.com/latex3.f" \
       -d "formula=$(cat -)&fsize=24px&fcolor=ffffff&bcolor=1a1a2e&mode=0" \
       -o output.png
   ```

3. **Manual via web_fetch**: Use latex.codecogs.com or quicklatex.com with the generated LaTeX

## Formula Types

- **Euler mashups**: e^(iπ) + 1 with added constants
- **Golden ratio "connections"**: φ² = φ + 1 variations  
- **π and e "relationships"**: trivial manipulations
- **Add zeros**: adding (φ-φ), ln(1), sin(0) to both sides
- **Multiply by ones**: e^0, i⁴, sin²+cos²
