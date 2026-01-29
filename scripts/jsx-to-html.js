#!/usr/bin/env node

/**
 * JSX to HTML Converter for Rize Demos
 *
 * Wraps JSX React components in an HTML template that loads
 * React, ReactDOM, and Babel from CDN for browser execution.
 *
 * Usage:
 *   node scripts/jsx-to-html.js <input.jsx> [output.html]
 *   npm run build:jsx -- path/to/Component.jsx
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node jsx-to-html.js <input.jsx> [output.html]');
  console.log('       npm run build:jsx -- path/to/Component.jsx');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1] || inputFile.replace('.jsx', '.html').replace(/.*\//, '').toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file not found: ${inputFile}`);
  process.exit(1);
}

// Read JSX content
let jsxContent = fs.readFileSync(inputFile, 'utf8');

// Remove ES module imports - we'll use globals from CDN
jsxContent = jsxContent
  .replace(/^import.*from\s+['"]react['"];?\s*$/gm, '')
  .replace(/^import.*from\s+['"]react-dom['"];?\s*$/gm, '')
  .replace(/^import\s*{\s*useState\s*,?\s*useEffect\s*,?\s*}\s*from\s*['"]react['"];?\s*$/gm, '')
  .replace(/^export\s+default\s+/gm, '')
  .trim();

// Extract component name from filename
const componentName = path.basename(inputFile, '.jsx');

// Extract title from component or filename
const titleMatch = jsxContent.match(/<title>([^<]+)<\/title>/);
const title = titleMatch ? titleMatch[1] : componentName.replace(/([A-Z])/g, ' $1').trim();

// HTML template
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      background: #111113;
      font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useCallback, useMemo } = React;

${jsxContent}

    // Auto-detect and render the main component
    const AppComponent = typeof App !== 'undefined' ? App :
                         typeof ${componentName} !== 'undefined' ? ${componentName} :
                         () => <div>No component found</div>;

    ReactDOM.createRoot(document.getElementById('root')).render(<AppComponent />);
  </script>
</body>
</html>`;

// Write output
const outputPath = path.join(process.cwd(), outputFile);
fs.writeFileSync(outputPath, htmlTemplate);

console.log(`✓ Converted: ${inputFile} -> ${outputFile}`);
