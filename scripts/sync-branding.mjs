/**
 * Syncs src/config/branding.json → public files + package.json
 * Run automatically before start/build, or manually: npm run sync-branding
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const brandingPath = path.join(root, 'src', 'config', 'branding.json');
const branding = JSON.parse(fs.readFileSync(brandingPath, 'utf8'));

const required = [
  'appName',
  'appShortName',
  'appTagline',
  'appDescription',
  'packageName',
  'themeColor',
  'backgroundColor',
];
for (const key of required) {
  if (!branding[key]) {
    console.error(`sync-branding: missing "${key}" in branding.json`);
    process.exit(1);
  }
}

// --- public/index.html ---
const indexPath = path.join(root, 'public', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(/<title>[^<]*<\/title>/, `<title>${branding.appName}</title>`);
indexHtml = indexHtml.replace(
  /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
  `<meta name="description" content="${branding.appDescription}" />`
);
indexHtml = indexHtml.replace(
  /<meta\s+name="theme-color"\s+content="[^"]*"\s*\/?>/,
  `<meta name="theme-color" content="${branding.themeColor}" />`
);
fs.writeFileSync(indexPath, indexHtml);

// --- public/manifest.json ---
const manifestPath = path.join(root, 'public', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.short_name = branding.appShortName;
manifest.name = branding.appName;
manifest.description = branding.appDescription;
manifest.theme_color = branding.themeColor;
manifest.background_color = branding.backgroundColor;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

// --- package.json ---
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.name = branding.packageName;
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

console.log(`✓ Branding synced: "${branding.appName}"`);
