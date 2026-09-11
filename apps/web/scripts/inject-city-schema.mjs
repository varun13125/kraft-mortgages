// Injects <CityServiceJsonLd> into every mortgage-broker-{city}/layout.tsx.
// Handles two patterns:
//   Pattern A (no existing schema): `return children;` or `return <>{children}</>;`
//     → wrap in a fragment containing the schema component.
//   Pattern B (existing inline FinancialService schema): a `const jsonLd = {...}` plus
//     a `<script ... dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />`
//     → replace the const + script with the CityServiceJsonLd component (which references
//       the org @id instead of redefining a competing FinancialService graph).
// Idempotent: skips files already using CityServiceJsonLd.
//
// Run: node scripts/inject-city-schema.mjs   (from apps/web)
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE_DIR = 'app/(site)';
const PROVINCE_BY_CITY = {
  surrey: 'BC', vancouver: 'BC', burnaby: 'BC', richmond: 'BC', coquitlam: 'BC',
  langley: 'BC', kelowna: 'BC', kamloops: 'BC', abbotsford: 'BC', nanaimo: 'BC',
  victoria: 'BC',
  calgary: 'AB', edmonton: 'AB', 'red-deer': 'AB', lethbridge: 'AB', airdrie: 'AB',
  toronto: 'ON', ottawa: 'ON', windsor: 'ON',
};
const CITY_DISPLAY = { 'red-deer': 'Red Deer' };

const IMPORT_LINE = "import { CityServiceJsonLd } from '@/components/SEO/CityServiceJsonLd';";

const dirs = readdirSync(SITE_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.startsWith('mortgage-broker-') && d.name !== 'mortgage-broker-[city]')
  .map((d) => d.name);

let modified = 0;
let skipped = 0;

for (const dir of dirs) {
  const layoutPath = join(SITE_DIR, dir, 'layout.tsx');
  if (!existsSync(layoutPath)) { skipped++; continue; }
  const slug = dir.replace('mortgage-broker-', '');
  const province = PROVINCE_BY_CITY[slug] || 'BC';
  const cityName = CITY_DISPLAY[slug] || slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

  let src = readFileSync(layoutPath, 'utf8');

  if (src.includes('CityServiceJsonLd')) { skipped++; continue; }

  // Add import after the first existing import line.
  if (!src.includes(IMPORT_LINE)) {
    src = src.replace(/^(import [^\n]*;\n)/, `$1${IMPORT_LINE}\n`);
  }

  const schemaTag = `<CityServiceJsonLd cityName="${cityName}" provinceName="${province}" description="Licensed mortgage broker serving ${cityName}, ${province}. Residential, construction, self-employed, MLI Select, and private lending solutions." />`;

  let changed = false;

  // Pattern B: existing inline `const jsonLd = {...}` block + `<script ...jsonLd.../>`.
  if (/const\s+jsonLd\s*=\s*\{/.test(src)) {
    const before = src;
    // Remove the `const jsonLd = {...};` declaration (balanced braces across newlines).
    let next = src.replace(/  const\s+jsonLd\s*=\s*\{[\s\S]*?\n  \};\n\n?/, '');
    // Replace the <script ... JSON.stringify(jsonLd) .../> with the component.
    next = next.replace(
      /      <script\s*\n\s*type="application\/ld\+json"\s*\n\s*dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(jsonLd\)\s*\}\}\s*\n\s*\/>\n/,
      `      ${schemaTag}\n`
    );
    if (next !== before) {
      src = next;
      changed = true;
    } else {
      console.warn(`WARN: ${dir}/layout.tsx — Pattern B matched but regex did not replace (indentation/format differs); skipping.`);
    }
  }

  // Pattern A: no existing schema — wrap `return children;` or `return <>{children}</>;`.
  if (!changed) {
    const newReturn = `  return (\n    <>\n      ${schemaTag}\n      {children}\n    </>\n  );`;
    const returnRe = /return\s+children\s*;|return\s+<>\s*\{children\}\s*<\/>\s*;/;
    if (returnRe.test(src)) {
      src = src.replace(returnRe, newReturn);
      changed = true;
    }
  }

  if (!changed) {
    console.warn(`WARN: ${dir}/layout.tsx — no recognized pattern; skipping (manual edit needed).`);
    skipped++;
    continue;
  }

  writeFileSync(layoutPath, src);
  modified++;
  console.log(`✓ ${dir}`);
}

console.log(`\nDone: ${modified} modified, ${skipped} skipped.`);
