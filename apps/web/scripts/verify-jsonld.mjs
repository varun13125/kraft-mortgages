// Verifies the JSON-LD builders in lib/seo/jsonld.ts produce correct, non-contradictory
// schema. Run with the companion loader that resolves extensionless TS imports:
//
//   node --experimental-strip-types --no-warnings \
//        --loader ./scripts/verify-loader.mjs \
//        scripts/verify-jsonld.mjs          (from apps/web)
//
// Note: this file lives in scripts/, so the module path is ../lib/...
const mod = await import('../lib/seo/jsonld.ts');
const { orgJsonLd, faqJsonLd, breadcrumbJsonLd, cityServiceJsonLd, ORG_ID } = mod;

const errors = [];
const org = orgJsonLd();
const orgNode = org['@graph'].find(
  (n) => (Array.isArray(n['@type']) ? n['@type'].includes('MortgageBroker') : n['@type'] === 'MortgageBroker')
);
if (!orgNode) errors.push('orgJsonLd: no MortgageBroker node');
if (orgNode && orgNode['@id'] !== ORG_ID) errors.push(`orgJsonLd: @id mismatch ${orgNode['@id']} vs ${ORG_ID}`);
if (orgNode && !orgNode.telephone?.includes('604-593-1550')) errors.push('orgJsonLd: wrong telephone');
if (orgNode && !orgNode.logo?.endsWith('kraft-logo.png')) errors.push('orgJsonLd: wrong logo url');
if (orgNode && orgNode.foundingDate !== '2014-01-01') errors.push('orgJsonLd: wrong foundingDate');

const hasWebsite = org['@graph'].some((n) => n['@type'] === 'WebSite');
if (!hasWebsite) errors.push('orgJsonLd: missing WebSite graph (sitelinks search box)');

const faq = faqJsonLd([{ question: 'Q?', answer: 'A.' }]);
if (faq['@type'] !== 'FAQPage' || !Array.isArray(faq.mainEntity)) errors.push('faqJsonLd: bad shape');

const bc = breadcrumbJsonLd([{ name: 'Home', url: 'https://x' }]);
if (bc['@type'] !== 'BreadcrumbList') errors.push('breadcrumbJsonLd: bad shape');

const city = cityServiceJsonLd({ cityName: 'Surrey', provinceName: 'BC', url: 'https://x/surrey', description: 'd' });
if (!city.provider || city.provider['@id'] !== ORG_ID) {
  errors.push('cityServiceJsonLd: must reference org @id, not redefine org');
}
if (city['@id'] === ORG_ID) errors.push('cityServiceJsonLd: must NOT reuse the org @id');

if (errors.length) {
  console.error('❌ JSON-LD verification failed:');
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log('✅ JSON-LD builders verified:', {
  orgId: ORG_ID,
  hasWebsite,
  orgTypes: orgNode['@type'],
  cityReferencesOrg: city.provider['@id'] === ORG_ID,
});
