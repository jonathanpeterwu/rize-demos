#!/usr/bin/env node

/**
 * Build All JSX to HTML
 *
 * Converts all JSX files from source directory to HTML demos.
 *
 * Usage:
 *   npm run build:all
 *   node scripts/build-all.js [source-dir]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Source directories to scan for JSX files
const sourceDirs = [
  path.join(process.env.HOME, 'Dev/Rize'),
  path.join(process.env.HOME, 'Dev/Rize/rize')
];

// Output directory
const outputDir = process.cwd();

// Mapping of JSX files to output names
const fileMapping = {
  'RizePricingOnboarding.jsx': 'rize-widget.html',
  'RizeDashboardExplore.jsx': 'rize-dashboard-explore.html',
  'RizeExploreProduct.jsx': 'rize-explore-product.html',
  'RizeInviteAccepted.jsx': 'rize-invite-accepted.html',
  'RizeOnboardingEmails.jsx': 'rize-onboarding-emails.html',
  'RizeProductTourDemo.jsx': 'rize-product-tour-demo.html'
};

// Find all JSX files
function findJsxFiles(dirs) {
  const files = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.endsWith('.jsx')) {
        files.push({
          input: path.join(dir, entry),
          output: fileMapping[entry] || entry.replace('.jsx', '.html').toLowerCase()
        });
      }
    }
  }
  return files;
}

// Convert JSX to HTML
function convertFile(inputPath, outputName) {
  const scriptPath = path.join(__dirname, 'jsx-to-html.js');
  try {
    execSync(`node "${scriptPath}" "${inputPath}" "${outputName}"`, {
      cwd: outputDir,
      stdio: 'inherit'
    });
    return true;
  } catch (error) {
    console.error(`✗ Failed: ${inputPath}`);
    return false;
  }
}

// Main
console.log('Building Rize Demos...\n');

const jsxFiles = findJsxFiles(sourceDirs);
let success = 0;
let failed = 0;

for (const file of jsxFiles) {
  if (convertFile(file.input, file.output)) {
    success++;
  } else {
    failed++;
  }
}

console.log(`\nBuild complete: ${success} succeeded, ${failed} failed`);

// Update index.html with new files
console.log('\nTo update index.html, edit manually or regenerate.');
