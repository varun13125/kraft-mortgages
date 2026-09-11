// Generates /public/og-default.jpg — a branded 1200x630 social share image.
// Run: node scripts/make-og-image.mjs  (from apps/web)
// Uses sharp (already a devDependency) to composite SVG onto a dark slate background.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const OUT = 'public/og-default.jpg';
const W = 1200;
const H = 630;

// Brand colors (match the site's gold/slate palette).
const SLATE_950 = '#0f172a';
const GOLD_500 = '#d4af37';
const GOLD_400 = '#d97706';

// SVG overlay: gradient accent, logo block, tagline, license line.
// Using inline text (no font file dependency) — system sans fallbacks.
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${GOLD_500}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${GOLD_400}" stop-opacity="0.4"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${GOLD_500}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${GOLD_500}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Ambient gold glow -->
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Top gold accent bar -->
  <rect x="0" y="0" width="${W}" height="8" fill="url(#goldBar)"/>

  <!-- Brand wordmark -->
  <text x="100" y="280" font-family="Georgia, 'Times New Roman', serif" font-size="86" font-weight="700" fill="#f1f5f9" letter-spacing="2">Kraft Mortgages</text>

  <!-- Gold underline -->
  <rect x="100" y="310" width="180" height="4" fill="${GOLD_500}"/>

  <!-- Tagline -->
  <text x="100" y="380" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#cbd5e1">Licensed Canadian Mortgage Brokerage</text>
  <text x="100" y="425" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="${GOLD_500}" font-weight="600">BC  &#183;  Alberta  &#183;  Ontario</text>

  <!-- Footer facts -->
  <text x="100" y="540" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#94a3b8">18+ Years  &#183;  $2B+ Funded  &#183;  30+ Lenders  &#183;  5,000+ Clients</text>

  <!-- License strip -->
  <text x="100" y="590" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#64748b">BCFSA #SR220230   RECA LIC-00655428   FSRA #12918</text>

  <!-- Bottom gold accent bar -->
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="url(#goldBar)"/>
</svg>
`);

try {
  await sharp({
    create: { width: W, height: H, channels: 3, background: SLATE_950 },
  })
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(OUT);

  const meta = await sharp(OUT).metadata();
  console.log(`✅ OG image written: ${OUT} (${meta.width}x${meta.height}, ${meta.format})`);
} catch (err) {
  console.error('❌ OG image generation failed:', err.message);
  process.exit(1);
}
