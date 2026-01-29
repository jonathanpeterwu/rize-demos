#!/usr/bin/env node

/**
 * Watch JSX Files for Changes
 *
 * Automatically rebuilds HTML when JSX files change.
 *
 * Usage:
 *   npm run watch
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const watchDirs = [
  path.join(process.env.HOME, 'Dev/Rize'),
  path.join(process.env.HOME, 'Dev/Rize/rize')
];

const fileMapping = {
  'RizePricingOnboarding.jsx': 'rize-widget.html',
  'RizeDashboardExplore.jsx': 'rize-dashboard-explore.html',
  'RizeExploreProduct.jsx': 'rize-explore-product.html',
  'RizeInviteAccepted.jsx': 'rize-invite-accepted.html',
  'RizeOnboardingEmails.jsx': 'rize-onboarding-emails.html'
};

console.log('Watching for JSX changes...');
console.log('Dirs:', watchDirs.join(', '));
console.log('Press Ctrl+C to stop\n');

for (const dir of watchDirs) {
  if (!fs.existsSync(dir)) continue;

  fs.watch(dir, (eventType, filename) => {
    if (!filename || !filename.endsWith('.jsx')) return;

    const inputPath = path.join(dir, filename);
    const outputName = fileMapping[filename] || filename.replace('.jsx', '.html').toLowerCase();

    console.log(`\n[${new Date().toLocaleTimeString()}] Changed: ${filename}`);
    console.log(`  Source: ${inputPath}`);
    console.log(`  Output: ${outputName}`);

    try {
      const scriptPath = path.join(__dirname, 'jsx-to-html.js');
      const result = execSync(`node "${scriptPath}" "${inputPath}" "${outputName}"`, {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8'
      });
      console.log(`  ✓ Rebuilt successfully`);
      if (result) console.log(`  ${result.trim()}`);
    } catch (error) {
      console.error(`  ✗ Failed to convert ${filename}`);
      if (error.message) console.error(`  Error: ${error.message}`);
    }
  });
}

// Keep process alive
process.stdin.resume();
