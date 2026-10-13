import { CANADIAN_LENDERS, LenderDetail, LenderChannel } from '@/data/canadianLendersData';

// ---------------------------------------------------------------------------
// Code-side corrections for known errors in the generated lender data.
// `data/canadianLendersData.ts` is regenerated outside this repo, so fixes there are
// overwritten on the next refresh. Each correction only applies while the record still
// carries the known-wrong value, so a fix made upstream always wins.
// Every consumer (chat, /api/lenders, AI tools) must read `LENDERS`, not CANADIAN_LENDERS.
// ---------------------------------------------------------------------------
interface LenderCorrection {
  /** Matched against `id` first, then the exact (case-insensitive) lender name. */
  ids: string[];
  names: string[];
  /** Only applied while the record still has this channel. */
  whenChannel: LenderChannel;
  reason: string;
  patch: (lender: LenderDetail) => Partial<LenderDetail>;
}

const CHANNEL_CORRECTIONS: LenderCorrection[] = [
  {
    // BUG-027: CTBC Bank Corp. (Canada) is an OSFI-regulated Schedule II chartered bank (prime
    // lender). The feed tags it 'Alternative (B)', which made its AI dossiers quote Alt-B
    // 50% GDS / 50% TDS ratios and stated-income programs.
    ids: ['lender_sp_ctbc_bank'],
    names: ['ctbc bank', 'ctbc bank corp. (canada)', 'ctbc bank canada'],
    whenChannel: 'Alternative (B)',
    reason: 'Schedule II chartered bank mis-tagged as Alternative (B) in the generated data',
    patch: (l) => ({
      channel: 'Prime (A)',
      categoryRaw: 'Chartered Bank / Schedule II',
      programs: (l.programs || []).filter((p) => p !== 'Alternative B'),
      bestFor: 'Uninsured (conventional) residential mortgages through a Schedule II chartered bank, with prime-based pricing.',
      fitRationale: 'OSFI-regulated Schedule II bank lending under prime (OSFI B-20) underwriting through the broker channel.',
    }),
  },
];

function findCorrection(lender: LenderDetail): LenderCorrection | undefined {
  const id = (lender.id || '').toLowerCase();
  const name = (lender.name || '').trim().toLowerCase();
  return CHANNEL_CORRECTIONS.find(
    (c) => c.whenChannel === lender.channel && (c.ids.includes(id) || c.names.includes(name))
  );
}

/** Returns the lender with any known data corrections applied (a new object; input untouched). */
export function applyLenderCorrections(lender: LenderDetail): LenderDetail {
  const correction = findCorrection(lender);
  return correction ? { ...lender, ...correction.patch(lender) } : lender;
}

/** The lender dataset with code-side corrections applied. Use this everywhere lenders are read. */
export const LENDERS: LenderDetail[] = CANADIAN_LENDERS.map(applyLenderCorrections);

const CONTACT_PAREN_RE = /\s*\([^()]*@[^()]*\)/g;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/**
 * Removes e-mail addresses (and "(name@domain)" parentheticals) from free-text lender fields
 * before they are shown to website visitors. Some generated fields embed named BDM contacts.
 */
export function scrubContactDetails(text: string | undefined | null): string {
  if (!text) return '';
  return text.replace(CONTACT_PAREN_RE, '').replace(EMAIL_RE, '[contact via Kraft Mortgages]');
}

// Normalized Dictionary of Canadian Lender Aliases, Acronyms, and Core Brands
const LENDER_ALIASES: Record<string, string[]> = {
  // Schedule II / International Prime Banks
  'ctbc': ['CTBC Bank Corp. (Canada)'],
  'chinatrust': ['CTBC Bank Corp. (Canada)'],
  'shinhan': ['Shinhan Bank Canada'],
  'keb': ['KEB Hana Bank Canada'],
  'hana': ['KEB Hana Bank Canada'],
  'icici': ['ICICI Bank Canada'],
  'sbi': ['SBI Canada Bank (State Bank of India)'],
  'state bank of india': ['SBI Canada Bank (State Bank of India)'],

  // Big-6 Chartered Banks
  'bmo': ['BMO Bank of Montreal'],
  'bank of montreal': ['BMO Bank of Montreal'],
  'cibc': ['CIBC'],
  'canadian imperial': ['CIBC'],
  'td': ['TD Canada Trust'],
  'td bank': ['TD Canada Trust'],
  'toronto dominion': ['TD Canada Trust'],
  'rbc': ['Royal Bank of Canada (RBC)'],
  'royal bank': ['Royal Bank of Canada (RBC)'],
  'scotia': ['Scotiabank'],
  'scotiabank': ['Scotiabank'],
  'bank of nova scotia': ['Scotiabank'],
  'national bank': ['National Bank of Canada'],
  'nbc': ['National Bank of Canada'],

  // Monoline Lenders
  'mcap': ['MCAP'],
  'first national': ['First National Financial'],
  'first nat': ['First National Financial'],
  'cmls': ['CMLS Financial'],
  'merix': ['Merix Financial'],
  'rmg': ['RMG Mortgages'],
  'radius': ['Radius Financial'],
  'rfa': ['RFA Bank'],
  'marathon': ['Marathon Mortgage'],
  'strive': ['Strive Capital Corporation (Aspire)'],
  'aspire': ['Aspire (Strive Capital)'],

  // Alternative (B) Lenders
  'home trust': ['Home Trust'],
  'hometrust': ['Home Trust'],
  'htc': ['Home Trust'],
  'equitable': ['Equitable Bank'],
  'eq bank': ['Equitable Bank'],
  'eqb': ['Equitable Bank'],
  'haventree': ['Haventree Bank'],
  'community trust': ['Community Trust'],
  'ctc': ['Community Trust'],
  'b2b': ['B2B Bank'],
  'b2b bank': ['B2B Bank'],
  'bridgewater': ['Bridgewater Bank'],
  'cwb': ['CWB Optimum Mortgage'],
  'optimum': ['CWB Optimum Mortgage'],
  'canadian western bank': ['Canadian Western Bank / Optimum Mortgage'],
  'versabank': ['VersaBank'],
  'peoples trust': ['Peoples Trust'],
  'peoples group': ['Peoples Trust'],
  'wealthone': ['WealthONE Bank of Canada'],
  'wealth one': ['WealthONE Bank of Canada'],
  'manulife': ['Manulife Bank'],

  // Credit Unions
  'desjardins': ['Desjardins'],
  'vancity': ['Vancity (Vancouver City Savings Credit Union)'],
  'coast capital': ['Coast Capital Savings'],
  'meridian': ['Meridian Credit Union'],
  'duca': ['DUCA Financial Services Credit Union'],
  'servus': ['Servus Credit Union'],
  'first west': ['First West Credit Union (Envision Financial, Valley First, Island Savings)'],
  'envision': ['First West Credit Union (Envision Financial, Valley First, Island Savings)'],
  'valley first': ['First West Credit Union (Envision Financial, Valley First, Island Savings)'],
  'island savings': ['First West Credit Union (Envision Financial, Valley First, Island Savings)'],
  'ic savings': ['IC Savings'],

  // Specialty & Reverse Mortgages
  'bloom': ['Bloom Fin (Reverse Mortgages)'],
  'homeequity': ['HomeEquity Bank (CHIP Reverse Mortgage)'],
  'chip': ['HomeEquity Bank (CHIP Reverse Mortgage)'],

  // Privates & MICs
  'aarea': ['AAREA Capital', 'Aarea Private Lending'],
  'antrim': ['Antrim Investments'],
  'fisgard': ['Fisgard Asset Management Corp'],
  'trez': ['Trez Capital'],
  'romspen': ['Romspen Investment Corporation'],
  'cedar peaks': ['Cedar Peaks Mortgage Services'],
  'caplink': ['Caplink Financial Corporation'],
  'alta west': ['Alta West Capital'],
  'alpine': ['Alpine Credits'],
  'calvert': ['Calvert Home Mortgage'],
  'cove': ['Cove Mortgage'],
  'gentai': ['Gentai Capital Corporation'],
  'kv capital': ['KV Capital'],
  'cmi': ['CMI (Canadian Mortgages Inc)', 'CMI Group'],
  'cambridge': ['Cambridge MIC (CMI)', 'Cambridge Mortgage Investment Corporation'],
  'cameron stephens': ['Cameron Stephens'],
  'firm capital': ['Firm Capital'],
  'first source': ['First Source Mortgage Corporation'],
  'glasslake': ['Glasslake Funding'],
  'neighbourhood': ['Neighbourhood Holdings'],
  'oppono': ['Oppono Lending Company'],
  'phl': ['PHL Capital Corp'],
  'pioneer west': ['Pioneer West Acceptance Corporation'],
  'resco': ['Resco Mortgage Investment Corporation'],
  'richview': ['Richview Capital MIC'],
  'vwr': ['VWR Capital Corp'],
  'vault': ['Vault Capital Inc.']
};

// Words that appear in lender names but are generic mortgage / English vocabulary.
// They can never identify a lender on their own (e.g. "home" must not resolve to
// Home Trust, "for" must not resolve to "MCAN Home - Precision Prime for Insured").
const GENERIC_NAME_WORDS = new Set([
  'bank', 'banks', 'corp', 'canada', 'canadian', 'inc', 'ltd', 'financial', 'finance', 'financi', 'fin',
  'mortgage', 'mortgages', 'capital', 'services', 'group', 'the', 'of', 'and', 'corporation', 'credit',
  'credits', 'union', 'for', 'all', 'home', 'homes', 'first', 'national', 'trust', 'savings', 'private',
  'lending', 'lender', 'lenders', 'investment', 'investments', 'equity', 'prime', 'insured', 'precision',
  'west', 'western', 'coast', 'coastal', 'island', 'valley', 'community', 'peoples', 'royal',
  'alternative', 'alt', 'asset', 'management', 'funding', 'fund', 'funds', 'holdings', 'direct', 'choice',
  'classic', 'connect', 'secure', 'solutions', 'source', 'point', 'near', 'one', 'three', 'seven', 'sun',
  'farm', 'micro', 'neo', 'domain', 'mandate', 'access', 'effort', 'stop', 'reliable', 'professional',
  'professionals', 'premiere', 'reverse', 'shelter', 'trailer', 'consumers', 'company', 'brokers',
  'quebec', 'montreal', 'mic', 'mip', 'circle', 'peaks', 'den',
]);

// Brand tokens / aliases that are also ordinary English words. They only count as a
// lender reference when the query also contains lender-context vocabulary.
const AMBIGUOUS_BRAND_WORDS = new Set([
  'aspire', 'strive', 'optimum', 'marathon', 'radius', 'bloom', 'cove', 'chip', 'vault', 'alpine',
  'neighbourhood', 'equitable', 'envision', 'meridian', 'cambridge', 'excalibur', 'drake', 'cedar',
  'pioneer', 'armada', 'atrium', 'lanyard', 'lions', 'eclipse', 'sequence', 'fraction', 'greenlight',
  'calvert', 'resco',
]);

const LENDER_CONTEXT_RE =
  /\b(lender|lenders|bank|banks|mic|trust|capital|financial|credit union|underwrit\w*|guideline\w*|polic(?:y|ies)|bdm|approv\w*|programs?|products?|offers?|offering|lends?|lending|rates? (?:at|from|with))\b/;

const distinctiveTokens = (name: string): string[] =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !GENERIC_NAME_WORDS.has(w));

/**
 * Resolves an alias target name to a lender record. Exact name match first, then a
 * lender whose distinctive tokens are all contained in the target's tokens
 * (e.g. alias target "CTBC Bank Corp. (Canada)" -> dataset "CTBC Bank").
 */
const findLenderForAliasTarget = (targetName: string): LenderDetail | undefined => {
  const exact = LENDERS.find(l => l.name.toLowerCase() === targetName.toLowerCase());
  if (exact) return exact;
  const targetTokens = new Set(distinctiveTokens(targetName));
  if (targetTokens.size === 0) return undefined;
  return LENDERS.find(l => {
    const tokens = distinctiveTokens(l.name);
    return tokens.length > 0 && tokens.every(t => targetTokens.has(t));
  });
};

/**
 * Universal Lender Resolver
 * Matches a query against the Canadian lender database. Deliberately conservative:
 * a false positive injects the wrong lender's dossier into the chat prompt, which is
 * far worse than falling back to a general answer.
 */
export const resolveLenderFromQuery = (query: string): LenderDetail | null => {
  const cleanQ = ` ${query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()} `;
  const words = cleanQ.trim().split(' ').filter(w => w.length > 0);
  const hasLenderContext = LENDER_CONTEXT_RE.test(cleanQ);

  // 1. Direct Alias & Acronym Matching (whole-word / whole-phrase only)
  for (const [alias, fullNames] of Object.entries(LENDER_ALIASES)) {
    const isMatch = alias.includes(' ') ? cleanQ.includes(` ${alias} `) : words.includes(alias);
    if (!isMatch) continue;
    if (AMBIGUOUS_BRAND_WORDS.has(alias) && !hasLenderContext) continue;

    for (const fn of fullNames) {
      const found = findLenderForAliasTarget(fn);
      if (found) return found;
    }
  }

  // 2. Full Name / Distinctive Brand Token Match
  for (const lender of LENDERS) {
    const normalizedName = lender.name.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    if (normalizedName.length >= 4 && cleanQ.includes(` ${normalizedName} `)) {
      return lender;
    }

    for (const dw of distinctiveTokens(lender.name)) {
      if (dw.length < 3 || !words.includes(dw)) continue;
      if (AMBIGUOUS_BRAND_WORDS.has(dw) && !hasLenderContext) continue;
      return lender;
    }
  }

  return null;
};

type ProvinceCode = 'BC' | 'ON' | 'AB' | 'QC';

/** Whole-word province detection (the old substring checks matched "want" as ON, "abc" as BC). */
const detectProvince = (q: string, includeQuebec = true): { code: ProvinceCode; name: string } | null => {
  if (/\b(bc|british columbia|vancouver)\b|b\.c\./.test(q)) return { code: 'BC', name: 'British Columbia (BC)' };
  if (/\b(ontario|ont|toronto|ottawa)\b/.test(q)) return { code: 'ON', name: 'Ontario (ON)' };
  if (/\b(alberta|calgary|edmonton)\b/.test(q)) return { code: 'AB', name: 'Alberta (AB)' };
  if (includeQuebec && /\b(quebec|québec|montreal)\b/.test(q)) return { code: 'QC', name: 'Quebec (QC)' };
  return null;
};

/**
 * Returns authoritative, institutional rental policy based on lender channel and specific name.
 */
export const getChannelRentalPolicy = (channel: LenderChannel, lenderName: string) => {
  const lowerName = lenderName.toLowerCase();

  // Alternative B Lenders (Home Trust, Equitable, Haventree, Community Trust)
  // Name fallback for Alt-B brands, but never for their reverse-mortgage arms (e.g. "Equitable
  // Reverse Mortgages" is a Monoline product and must not get the Alt-B 80% worksheet).
  const altBByName = !lowerName.includes('reverse') && (lowerName.includes('home trust') || lowerName.includes('equitable') || lowerName.includes('haventree') || lowerName.includes('community trust'));
  if (channel === 'Alternative (B)' || altBByName) {
    return {
      subjectOwnerOccupied: "**50% Rental Add-Back** to borrower gross qualifying income. The subject property's PITH remains fully counted as a liability in GDS/TDS (no subject PITH offset). Requires signed lease or appraisal Market Rent Schedule (Form 214 / Schedule A).",
      subjectPureRental: "**80% Rental Offset Worksheet** `((Gross Rent × 80%) - Subject PITH = Net Surplus/Deficit)` OR qualifying on a **Debt Service Coverage Ratio (DSCR / DCR)** basis (typically minimum **1.00x – 1.10x DSCR** up to 75%–80% LTV), exempt from standard personal income / Line 15000 NOA constraints.",
      portfolioProperties: "**Full 80% Offset Worksheet** `((Gross Rent × 80%) - Existing Property PITH = Net Surplus/Deficit)`. Positive surpluses add directly to borrower income; negative deficits add to TDS monthly liabilities. This generous 80% factor prevents existing portfolio debt from exhausting the borrower's personal TDS ceiling.",
      formulaWorksheet: "(Gross Rent × 80%) - Property PITH"
    };
  }

  // Private / MIC
  if (channel === 'Private / MIC') {
    return {
      subjectOwnerOccupied: "Evaluated on pure **property equity, marketable value, and location**. Debt servicing ratios (GDS/TDS) are exempt from OSFI B-20 regulations.",
      subjectPureRental: "Underwritten on **asset cash flow and exit strategy**. Payments are structured as interest-only. No personal GDS/TDS ratio caps.",
      portfolioProperties: "Portfolio debt does not impact personal ratio calculations. Lenders assess overall global equity coverage and borrower liquidity.",
      formulaWorksheet: "Asset Equity & Interest-Only Servicing"
    };
  }

  // Credit Unions
  if (channel === 'Credit Union') {
    return {
      subjectOwnerOccupied: "**50% Rental Add-Back** to borrower qualifying income (signed lease or appraisal market rent schedule required). Subject PITH included in liabilities.",
      subjectPureRental: "Typically qualified via **Rental Property Worksheet (50% to 75% factor)** or conventional add-back depending on provincial credit union policies.",
      portfolioProperties: "**Rental Property Worksheet** `(Gross Rent × 50%) - Property PITH = Net Surplus/Deficit`. Net positive cash flow increases qualifying income; net negative reduces borrowing capacity.",
      formulaWorksheet: "(Gross Rent × 50%) - Property PITH"
    };
  }

  // Prime (A) & Monoline Lenders (Big-6 Banks, CTBC, Shinhan, MCAP, First National, CMLS, etc.)
  return {
    subjectOwnerOccupied: "**50% Rental Add-Back** to borrower gross qualifying income. The subject property's full PITH is carried in GDS/TDS liabilities (no subject PITH offset). Requires signed lease agreement or appraisal Market Rent Schedule (Form 214 / Schedule A).",
    subjectPureRental: "**50% Rental Add-Back / Worksheet**. Almost all Prime A and Monoline lenders add 50% of gross market rent to income. Full PITH is included in TDS.",
    portfolioProperties: "**Standard 50% Rental Property Worksheet (Surplus/Deficit Approach)** `((Gross Rent × 50%) - Existing Property PITH = Net Surplus/Deficit)`. Positive surpluses add to qualifying income; negative deficits add directly to monthly debt obligations in TDS.",
    formulaWorksheet: "(Gross Rent × 50%) - Property PITH"
  };
};

/**
 * Returns institutional GDS/TDS debt service limits and stress testing parameters.
 */
export const getChannelGdsTdsLimits = (channel: LenderChannel, lenderName: string) => {
  const lowerName = lenderName.toLowerCase();

  // Alternative B
  const altBByName = !lowerName.includes('reverse') && (lowerName.includes('home trust') || lowerName.includes('equitable') || lowerName.includes('haventree'));
  if (channel === 'Alternative (B)' || altBByName) {
    return {
      standardGds: "Up to 50%",
      standardTds: "Up to 50%",
      exceptionTolerance: "Extended GDS/TDS up to 50%/50% permitted under Alt-B BFS Stated Income and story-based credit underwriting.",
      stressTestRule: "Qualified at contract rate + 2.00% (or contract rate depending on specific provincial/uninsured Alt-B program)."
    };
  }

  // Private / MIC
  if (channel === 'Private / MIC') {
    return {
      standardGds: "Exempt (No GDS)",
      standardTds: "Exempt (No TDS)",
      exceptionTolerance: "No OSFI B-20 debt ratio constraints. Underwritten purely on loan-to-value (LTV) and property marketability.",
      stressTestRule: "Exempt from OSFI B-20 stress test. Payments structured as interest-only at contract rate."
    };
  }

  // Prime (A) Schedule II (CTBC, Shinhan, KEB Hana)
  if (lowerName.includes('ctbc') || lowerName.includes('shinhan') || lowerName.includes('keb') || lowerName.includes('icici') || lowerName.includes('sbi')) {
    return {
      standardGds: "39%",
      standardTds: "44%",
      exceptionTolerance: "Standard OSFI B-20 max is 39% GDS / 44% TDS (retail baseline often targets 32-35% GDS / 40-42% TDS). Exceptions up to 45%–48% TDS considered for strong beacon scores (700+), low LTV (< 65%), or high verifiable liquid net worth.",
      stressTestRule: "Greater of Contract Rate + 2.00% or Bank of Canada benchmark floor (5.25%)."
    };
  }

  // Prime (A) / Monoline Standard
  return {
    standardGds: "39%",
    standardTds: "44%",
    exceptionTolerance: "Strictly enforced under OSFI B-20 guidelines. Exceptions up to 40% GDS / 45% TDS may be considered for high beacon scores (>720) with substantial liquid reserves.",
    stressTestRule: "Greater of Contract Rate + 2.00% or Bank of Canada benchmark floor (5.25%)."
  };
};

/**
 * Builds a comprehensive, authoritative underwriting dossier for any resolved lender.
 */
export const generateLenderUnderwritingDossier = (lender: LenderDetail, userQuery: string): string => {
  const rental = getChannelRentalPolicy(lender.channel, lender.name);
  const ratios = getChannelGdsTdsLimits(lender.channel, lender.name);
  const provStr = lender.provinces && lender.provinces.length >= 8 
    ? 'National (All 10 Canadian Provinces)' 
    : (lender.provinces?.join(', ') || 'National');

  return `### ${lender.name} – Underwriting Guidelines: Rental Income & Debt Servicing

**${lender.name}** operates within the **${lender.channel}** channel (${lender.categoryRaw}). Here is the exact underwriting breakdown for rental treatment, qualifying debt service ratios, geographic footprint, and approval parameters:

---

### 1. Geographic Operating Footprint & Provincial Availability
• **Operating Provinces:** **${provStr}**
• **Regional Lending Notes:** ${lender.lendingAreaNotes || 'National urban and suburban centers.'}
• **Lending Area Scope:** ${lender.provinces?.includes('BC') ? '✅ Lends in British Columbia' : '❌ Does NOT lend in BC'} | ${lender.provinces?.includes('ON') ? '✅ Lends in Ontario' : '❌ Does NOT lend in ON'} | ${lender.provinces?.includes('AB') ? '✅ Lends in Alberta' : '❌ Does NOT lend in AB'}

---

### 2. Rental Income Calculation
• **Subject Property (Owner-Occupied with Suite / 2–4 Units):**
  - **Treatment:** ${rental.subjectOwnerOccupied}
• **Subject Property (Pure Rental Investment):**
  - **Treatment:** ${rental.subjectPureRental}
• **Non-Subject Portfolio Properties (Existing Rentals Owned):**
  - **Treatment:** ${rental.portfolioProperties}
• **Worksheet Formula:** \`${rental.formulaWorksheet}\`

---

### 3. Maximum Debt Service Ratios (GDS / TDS)
• **Maximum GDS:** **${ratios.standardGds}**
• **Maximum TDS:** **${ratios.standardTds}**
• **Exception Flexibility:** ${ratios.exceptionTolerance}
• **Stress Test Qualifying Rate:** ${ratios.stressTestRule}

---

### 4. Active Pricing & Product Availability
• **Lowest Active Rate:** **${lender.lowestRate ? `${lender.lowestRate.toFixed(2)}%` : lender.benchmarkRate}**
• **Total Products / Matrix Tiers:** **${lender.productsCount || lender.rates?.length || 24} available products**
• **Rate Hold Period:** **${lender.rateHoldDefault || 120} Days**
• **Maximum Loan-to-Value (LTV):** **${lender.maxLTV}%**
• **Minimum Beacon Score:** **${lender.minBeacon}**

---

### 5. Key Program Parameters & Guidelines
• **Best Suited For:** ${scrubContactDetails(lender.bestFor) || 'See the Kraft Mortgages team for program fit.'}
• **Special Features:** ${scrubContactDetails((lender.specialFeatures || []).join(', '))}
• **Underwriting Policies & Notes:**
  ${scrubContactDetails(lender.underwritingNotes)}
• **Fit Rationale:** ${scrubContactDetails(lender.fitRationale)}
• **Submission:** Files are placed through the Kraft Mortgages advisory team (604-593-1550); lender guidelines and pricing change frequently and are confirmed at application.

*Would you like me to evaluate an exact deal scenario or calculate TDS debt service ratios for ${lender.name}?*`;
};

/**
 * Universal Geographic Underwriting Resolver
 * Handles questions like:
 * - "Does Vancity lend in Ontario?"
 * - "Does CTBC lend in BC?"
 * - "Which credit unions lend in BC?"
 * - "Which lenders lend in Ontario?"
 */
export const resolveGeographicUnderwritingQuery = (query: string): string | null => {
  const q = query.toLowerCase();

  // Check specific lender + province inquiry
  const matchedLender = resolveLenderFromQuery(query);
  if (matchedLender) {
    const detected = detectProvince(q);
    const checkedProvince: ProvinceCode | null = detected?.code ?? null;
    const provFullName = detected?.name ?? '';

    if (checkedProvince) {
      const lendsInProv = matchedLender.provinces?.includes(checkedProvince);
      if (lendsInProv) {
        return `### ${matchedLender.name} – Lending Availability in ${provFullName}

**Yes! ${matchedLender.name}** actively lends in **${provFullName}**.

---

### Lending Jurisdiction Breakdown
• **Operating Status:** Active in **${provFullName}**
• **Regional Footprint:** ${matchedLender.lendingAreaNotes || 'Full provincial coverage'}
• **Channel:** ${matchedLender.channel} (${matchedLender.categoryRaw})
• **Maximum LTV:** ${matchedLender.maxLTV}%
• **Minimum Beacon Score:** ${matchedLender.minBeacon}
• **Lowest Rate:** ${matchedLender.lowestRate ? `${matchedLender.lowestRate.toFixed(2)}%` : matchedLender.benchmarkRate}
• **Next Step:** The Kraft Mortgages advisory team (604-593-1550) can confirm current eligibility and pricing for your file.

*Would you like to review their complete underwriting policy, rental income treatment, or submit a deal for triage?*`;
      } else {
        // Recommend alternative lenders in that province
        const alternativeLenders = LENDERS
          .filter(l => l.channel === matchedLender.channel && l.provinces?.includes(checkedProvince!))
          .slice(0, 4)
          .map(l => `• **${l.name}** (${l.lowestRate ? `${l.lowestRate.toFixed(2)}%` : l.benchmarkRate} lowest rate | Max ${l.maxLTV}% LTV)`)
          .join('\n');

        return `### ${matchedLender.name} – Lending Availability in ${provFullName}

**No.** **${matchedLender.name}** does **NOT** lend in **${provFullName}**.

---

### Geographic Policy Breakdown
• **Current Lending Areas:** ${matchedLender.lendingAreaNotes || matchedLender.provinces?.join(', ')}
• **Reason:** ${matchedLender.channel === 'Credit Union' ? 'Provincially regulated credit unions are restricted to their home province jurisdictions.' : 'Lender operates strictly within specified provincial hubs.'}

### Recommended Alternatives in ${provFullName} (${matchedLender.channel}):
${alternativeLenders || '• Big-6 Chartered Banks & National Monolines (First National, MCAP, CMLS)'}

*Would you like me to analyze deal fit with any of these eligible lenders?*`;
      }
    }
  }

  // Check general regional inquiries: "Which credit unions lend in BC?"
  if (/\b(which|what|list)\b/.test(q) && /\b(lenders?|credit unions?|banks?|mics?)\b/.test(q)) {
    const detected = detectProvince(q, false);
    const targetProv = detected?.code as 'BC' | 'ON' | 'AB' | undefined;
    const provName = detected?.name ?? '';

    if (targetProv) {
      let filtered = LENDERS.filter(l => l.provinces?.includes(targetProv));
      if (/\bcredit unions?\b/.test(q)) {
        filtered = filtered.filter(l => l.channel === 'Credit Union');
      } else if (/\b(private|mics?)\b/.test(q)) {
        filtered = filtered.filter(l => l.channel === 'Private / MIC');
      } else if (/\b(alt|alternative|b[- ]lenders?)\b/.test(q)) {
        filtered = filtered.filter(l => l.channel === 'Alternative (B)');
      }

      const topList = filtered.slice(0, 6).map(l => 
        `• **${l.name}** [${l.channel}]: Lowest Rate: **${l.lowestRate ? `${l.lowestRate.toFixed(2)}%` : l.benchmarkRate}** | Max LTV: ${l.maxLTV}% | Notes: ${l.lendingAreaNotes}`
      ).join('\n');

      return `### Lenders Operating in ${provName}

Here are top verified lenders actively lending in **${provName}** based on Kraft Mortgages Canada Inc.'s institutional lender network (${filtered.length} total lenders active in ${targetProv}):

${topList}

---
*Speak directly with the Kraft Mortgages Advisory Team at 604-593-1550 | (604) 359-5993 to structure and place your deal.*`;
    }
  }

  return null;
};

/**
 * Generates an authoritative, complete underwriting response tailored to the client's question
 * using authentic lender guidelines from Kraft Mortgages' institutional database with zero risk of truncation.
 */
export const generateAuthoritativeUnderwritingAnswer = (
  lender: LenderDetail, 
  userQuery: string, 
  matchedGuidelines: any[] = []
): string => {
  const q = userQuery.toLowerCase();
  const rental = getChannelRentalPolicy(lender.channel, lender.name);
  const ratios = getChannelGdsTdsLimits(lender.channel, lender.name);
  const provStr = lender.provinces && lender.provinces.length >= 8 
    ? 'National (All 10 Canadian Provinces)' 
    : (lender.provinces?.join(', ') || 'National');

  // 1. Income calculation query on B-Side / Alt-B (e.g. Equitable Bank, Home Trust, Haventree).
  // Only Alternative (B) lenders get this template: it describes stated-income / BFS programs
  // and extended ratios that Prime, Monoline, Credit Union and Private lenders do not offer.
  const isAltB = lender.channel === 'Alternative (B)';
  if (isAltB && (q.includes('income') || q.includes('b side') || q.includes('bfs') || q.includes('stated') || q.includes('calculate'))) {
    return `### **${lender.name} (${lender.channel}) – How Income is Calculated on the B-Side**

Here is the exact underwriting breakdown for **${lender.name}** under their Alternative (B-Side) programs:

---

### 1. Self-Employed & BFS Stated Income (Bank Statement Program)
• **Income Approach:** For self-employed borrowers where tax returns (T1 Generals/NOAs) do not reflect true earnings, ${lender.name} qualifies income via **12 Months Business Bank Statements** or signed self-declared statements.
• **Gross Revenue vs Net:** Underwritten on reasonable gross business revenue with standard industry expense factors applied.
• **Salaried Inclusion:** Co-borrowers with traditional salaried T4 income can be blended into total qualifying income (typically up to 50% of total application income).
• **Extended Debt Servicing Ratios:** Allows extended ratios up to **${ratios.standardGds} GDS / ${ratios.standardTds} TDS** (extended up to 50%–60% TDS on strong credit/equity tiers).
• **Loan-to-Value (LTV):** Up to **${lender.maxLTV}% LTV** (tiered based on beacon score, e.g., 700–720+ Beacon for max LTV).

---

### 2. Traditional & Confirmed Income Verification
• **Self-Employed (Confirmed):** 2 Years T1 Generals with NOAs + Statement of Business Activities, plus recent 3 months business bank statements and Articles of Incorporation.
• **Salaried / Hourly:** Current Letter of Employment (under 60 days old) + recent pay stub. 2-year average for bonuses, commission, and overtime.

---

### 3. Rental Income Treatment & Worksheets
• **Subject Property Suite / Rental:** ${rental.subjectOwnerOccupied}
• **Subject Pure Rental (1–4 Units):** ${rental.subjectPureRental}
• **Non-Subject Portfolio Properties:** ${rental.portfolioProperties}
• **Worksheet Formula:** \`${rental.formulaWorksheet}\`

---

### 4. Non-Traditional & Household Income Flexibility
• **Contributory Household Income:** ${lender.name} considers contributory income from non-borrowing immediate family members (spouse, adult children, parents) residing in the home to assist with debt-service ratios.
• **Gig & Platform Income:** Uber, Lyft, DoorDash, and Airbnb income accepted with 12 months verified deposit statements.

---

### 5. Qualification & Deal Submission Desk
• **Stress Test Qualifying Rate:** Qualified at contract rate + 2.00% (or un-stressed contract rate on select Alt-B tiers).
• **Minimum Beacon Score:** **${lender.minBeacon}**
• **Lowest Active Rate:** **${lender.lowestRate ? `${lender.lowestRate.toFixed(2)}%` : lender.benchmarkRate}**
• **Advisory Contact:** The Team at Kraft Mortgages Canada Inc. • 604-593-1550 | (604) 359-5993

*Would you like to calculate debt servicing ratios or submit this scenario for review?*`;
  }

  // 2. Rental offset query
  if (q.includes('rental') || q.includes('offset')) {
    return `### **${lender.name} – Rental Income Underwriting Guidelines**

Here is the exact rental calculation policy for **${lender.name}** (${lender.channel}):

---

### 1. Subject Property Rental Treatment
• **Owner-Occupied with Suite:** ${rental.subjectOwnerOccupied}
• **Pure Rental Investment:** ${rental.subjectPureRental}

---

### 2. Existing Portfolio Properties (Non-Subject)
• **Worksheet Approach:** ${rental.portfolioProperties}
• **Worksheet Formula:** \`${rental.formulaWorksheet}\`

---

### 3. Key Approval Parameters
• **Max LTV:** **${lender.maxLTV}%** | **Min Beacon:** **${lender.minBeacon}**
• **Qualifying Ratios:** **${ratios.standardGds} GDS / ${ratios.standardTds} TDS**
• **Brokerage Desk:** Kraft Mortgages Advisory Team • 604-593-1550 | (604) 359-5993

*Would you like me to model this portfolio with our advisory team?*`;
  }

  // Fallback to full dossier
  return generateLenderUnderwritingDossier(lender, userQuery);
};

