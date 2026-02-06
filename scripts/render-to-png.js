#!/usr/bin/env node
/**
 * Render math slop HTML to PNG using Puppeteer
 * Install: npm install puppeteer
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function renderHTML(htmlContent, outputPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  // Wait for MathJax to render
  await page.waitForFunction(() => {
    return typeof MathJax !== 'undefined' && 
           MathJax.startup && 
           MathJax.startup.promise;
  });
  await page.evaluate(() => MathJax.startup.promise);
  await page.waitForTimeout(500); // Extra buffer for rendering
  
  // Get the container bounds
  const container = await page.$('.container');
  const box = await container.boundingBox();
  
  // Screenshot just the container with padding
  await page.screenshot({
    path: outputPath,
    clip: {
      x: Math.max(0, box.x - 20),
      y: Math.max(0, box.y - 20),
      width: box.width + 40,
      height: box.height + 40
    }
  });
  
  await browser.close();
  console.log(`Saved to ${outputPath}`);
}

// CLI
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: render-to-png.js <input.html> <output.png>');
  process.exit(1);
}

const inputPath = args[0];
const outputPath = args[1];

const html = fs.readFileSync(inputPath, 'utf8');
renderHTML(html, outputPath).catch(err => {
  console.error('Render failed:', err.message);
  process.exit(1);
});
