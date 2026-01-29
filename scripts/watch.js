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

    console.log(`[${new Date().toLocaleTimeString()}] Changed: ${filename}`);

    try {
      execSync(`node scripts/jsx-to-html.js "${inputPath}" "${outputName}"`, {
        cwd: process.cwd(),
        stdio: 'inherit'
      });
    } catch (error) {
      console.error(`Failed to convert ${filename}`);
    }
  });
}

// Keep process alive
process.stdin.resume();
