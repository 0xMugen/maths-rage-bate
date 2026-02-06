#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// === BASE FORMULAS ===
const BASE_FORMULAS = {
  euler: {
    name: "Euler's Identity",
    latex: "e^{i\\pi} + 1 = 0",
    left: "e^{i\\pi} + 1",
    right: "0"
  },
  pythagoras: {
    name: "Pythagorean Theorem", 
    latex: "a^2 + b^2 = c^2",
    left: "a^2 + b^2",
    right: "c^2"
  },
  quadratic: {
    name: "Quadratic Formula",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    left: "x",
    right: "\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
  },
  gaussian: {
    name: "Gaussian Integral",
    latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}",
    left: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx",
    right: "\\sqrt{\\pi}"
  },
  zeta2: {
    name: "Basel Problem",
    latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}",
    left: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2}",
    right: "\\frac{\\pi^2}{6}"
  },
  golden: {
    name: "Golden Ratio",
    latex: "\\varphi = \\frac{1 + \\sqrt{5}}{2}",
    left: "\\varphi",
    right: "\\frac{1 + \\sqrt{5}}{2}"
  },
  identity: {
    name: "Multiplicative Identity",
    latex: "1 \\cdot x = x",
    left: "1 \\cdot x",
    right: "x"
  }
};

// === SLOP ADDITIONS (things that equal 0) ===
const ZERO_ADDITIONS = [
  "\\sin^2(\\theta) + \\cos^2(\\theta) - 1",
  "\\lim_{n \\to \\infty} \\frac{1}{n}",
  "\\int_0^0 f(x)\\,dx",
  "\\ln(1)",
  "e^0 - 1",
  "\\zeta(2) - \\frac{\\pi^2}{6}",
  "\\sum_{k=1}^{n} 0",
  "\\lim_{x \\to 0} x",
  "\\frac{d}{dx}(C)",
  "\\Im(1)",
  "\\Re(i) \\cdot \\Im(i)",
  "\\binom{n}{n+1}",
  "\\lfloor 0.5 \\rfloor",
  "(-1)^2 - 1",
  "\\Gamma(1) - 1"
];

// === SLOP MULTIPLIERS (things that equal 1) ===
const ONE_MULTIPLIERS = [
  "e^0",
  "\\Gamma(2)",
  "\\sin^2(\\alpha) + \\cos^2(\\alpha)",
  "\\frac{\\pi}{\\pi}",
  "\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^0",
  "\\left|e^{i\\theta}\\right|",
  "\\det(I)",
  "\\prod_{k=1}^{n} 1",
  "\\gcd(1, n)",
  "\\lcm(1, 1)",
  "(-1)^2",
  "\\left(\\frac{1}{2}\\right)^0",
  "\\sum_{k=0}^{\\infty} \\frac{(-1)^k}{k!} \\cdot (-1)",
  "\\frac{\\Gamma(n+1)}{n!}"
];

// === FANCY REPLACEMENTS ===
const REPLACEMENTS = {
  "1": [
    "\\sum_{k=0}^{\\infty} \\frac{1}{2^{k+1}}",
    "\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^{1/n}",
    "\\int_0^1 1\\,dx",
    "\\Gamma(2)",
    "e^{\\ln(1) + 0}"
  ],
  "\\pi": [
    "4 \\arctan(1)",
    "2 \\arcsin(1)", 
    "\\frac{22}{7} - \\frac{1}{791}",
    "\\lim_{n \\to \\infty} n \\sin\\left(\\frac{\\pi}{n}\\right)"
  ],
  "2": [
    "\\sum_{k=0}^{1} 1",
    "\\int_0^2 1\\,dx",
    "e^{\\ln(2)}"
  ]
};

// === UTILITY FUNCTIONS ===
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateSlop(baseKey, slopLevel) {
  const base = BASE_FORMULAS[baseKey] || BASE_FORMULAS[pick(Object.keys(BASE_FORMULAS))];
  
  // Determine number of additions based on slop level
  const numAdditions = Math.min(slopLevel + Math.floor(Math.random() * 2), ZERO_ADDITIONS.length);
  const numMultipliers = Math.floor(slopLevel / 2);
  
  // Pick random zero additions
  const additions = shuffle(ZERO_ADDITIONS).slice(0, numAdditions);
  
  // Pick random one multipliers  
  const multipliers = shuffle(ONE_MULTIPLIERS).slice(0, numMultipliers);
  
  // Build the slopped formula
  let left = base.left;
  let right = base.right;
  
  // Add zeros to left side
  for (const add of additions) {
    if (Math.random() > 0.5) {
      left = `${left} + ${add}`;
    } else {
      left = `${add} + ${left}`;
    }
  }
  
  // Multiply right side by ones
  for (const mult of multipliers) {
    if (Math.random() > 0.5) {
      right = `${mult} \\cdot \\left(${right}\\right)`;
    } else {
      right = `\\left(${right}\\right) \\cdot ${mult}`;
    }
  }
  
  // Maybe add a zero to right side too
  if (slopLevel >= 3 && Math.random() > 0.5) {
    right = `${right} + ${pick(ZERO_ADDITIONS)}`;
  }
  
  return {
    name: base.name,
    original: base.latex,
    slopped: `${left} = ${right}`
  };
}

function generateLatexDocument(formula) {
  return `
\\documentclass[preview,border=20pt]{standalone}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{xcolor}
\\pagecolor{black}
\\color{white}

\\begin{document}
\\begin{equation*}
\\displaystyle
${formula}
\\end{equation*}
\\end{document}
`;
}

function renderToPng(latex, outputPath) {
  const tmpDir = `/tmp/math-slop-${Date.now()}`;
  fs.mkdirSync(tmpDir, { recursive: true });
  
  const texFile = path.join(tmpDir, 'formula.tex');
  const pdfFile = path.join(tmpDir, 'formula.pdf');
  
  fs.writeFileSync(texFile, latex);
  
  try {
    // Compile LaTeX to PDF
    execSync(`pdflatex -interaction=nonstopmode -output-directory="${tmpDir}" "${texFile}"`, {
      stdio: 'pipe',
      timeout: 30000
    });
    
    // Convert PDF to PNG
    execSync(`convert -density 300 "${pdfFile}" -quality 100 -resize 1200x "${outputPath}"`, {
      stdio: 'pipe',
      timeout: 30000
    });
    
    console.log(`Generated: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error('Render failed:', err.message);
    // Dump the LaTeX for debugging
    console.log('LaTeX source:');
    console.log(latex);
    throw err;
  } finally {
    // Cleanup
    try {
      fs.rmSync(tmpDir, { recursive: true });
    } catch {}
  }
}

// === MAIN ===
function main() {
  const args = process.argv.slice(2);
  
  // Parse args
  let baseFormula = 'random';
  let slopLevel = 3;
  let outputPath = `/tmp/math-slop-${Date.now()}.png`;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base' && args[i+1]) {
      baseFormula = args[++i];
    } else if (args[i] === '--slop' && args[i+1]) {
      slopLevel = parseInt(args[++i], 10);
    } else if (args[i] === '--out' && args[i+1]) {
      outputPath = args[++i];
    } else if (args[i] === '--list') {
      console.log('Available base formulas:');
      for (const [key, val] of Object.entries(BASE_FORMULAS)) {
        console.log(`  ${key}: ${val.name}`);
      }
      process.exit(0);
    } else if (args[i] === '--help') {
      console.log(`
Math Slop Generator

Usage: node generate.js [options]

Options:
  --base <name>   Base formula (euler, pythagoras, quadratic, gaussian, zeta2, golden, random)
  --slop <1-5>    Slop level (default: 3)
  --out <path>    Output PNG path
  --list          List available base formulas
  --help          Show this help
`);
      process.exit(0);
    }
  }
  
  // Generate
  const key = baseFormula === 'random' ? pick(Object.keys(BASE_FORMULAS)) : baseFormula;
  const result = generateSlop(key, slopLevel);
  
  console.log(`Base: ${result.name}`);
  console.log(`Original: ${result.original}`);
  console.log(`Slopped: ${result.slopped}`);
  console.log('');
  
  const latex = generateLatexDocument(result.slopped);
  renderToPng(latex, outputPath);
  
  return outputPath;
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateSlop, generateLatexDocument, renderToPng, BASE_FORMULAS };
