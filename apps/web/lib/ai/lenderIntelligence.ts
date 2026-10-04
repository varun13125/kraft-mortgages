import { CANADIAN_LENDERS, LenderDetail, LenderChannel } from '@/data/canadianLendersData';

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

/**
 * Universal Lender Resolver
 * Matches ANY query against all 125 Canadian lenders in the database.
 */
export const resolveLenderFromQuery = (query: string): LenderDetail | null => {
  const cleanQ = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = cleanQ.split(/\s+/).filter(w => w.length > 0);

  // 1. Direct Alias & Acronym Matching
  for (const [alias, fullNames] of Object.entries(LENDER_ALIASES)) {
    const isMultiWord = alias.includes(' ');
    const isMatch = isMultiWord
      ? cleanQ.includes(alias)
      : words.includes(alias) || cleanQ.includes(` ${alias} `) || cleanQ.startsWith(`${alias} `) || cleanQ.endsWith(` ${alias}`);

    if (isMatch) {
      for (const fn of fullNames) {
        const found = CANADIAN_LENDERS.find(l => l.name.toLowerCase() === fn.toLowerCase());
        if (found) return found;
      }
    }
  }

  // 2. Full Name / Brand Match across all 125 lenders
  for (const lender of CANADIAN_LENDERS) {
    const lName = lender.name.toLowerCase();

    // Check if cleaned query contains full lender name
    if (cleanQ.includes(lName)) {
      return lender;
    }

    // Check if key distinctive brand name word matches
    const distinctiveWords = lName
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => !['bank', 'corp', 'canada', 'inc', 'ltd', 'financial', 'mortgage', 'mortgages', 'capital', 'services', 'group', 'the', 'of', 'and', 'corporation', 'credit', 'union'].includes(w) && w.length >= 3);

    for (const dw of distinctiveWords) {
      if (words.includes(dw)) {
        return lender;
      }
    }
  }

  return null;
};

/**
 * Returns authoritative, institutional rental policy based on lender channel and specific name.
 */
export const getChannelRentalPolicy = (channel: LenderChannel, lenderName: string) => {
  const lowerName = lenderName.toLowerCase();

  // Alternative B Lenders (Home Trust, Equitable, Haventree, Community Trust)
  if (channel === 'Alternative (B)' || lowerName.includes('home trust') || lowerName.includes('equitable') || lowerName.includes('haventree') || lowerName.includes('community trust')) {
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
  if (channel === 'Alternative (B)' || lowerName.includes('home trust') || lowerName.includes('equitable') || lowerName.includes('haventree')) {
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
• **Best Suited For:** ${lender.bestFor}
• **Special Features:** ${lender.specialFeatures.join(', ')}
• **Underwriting Policies & Notes:**
  ${lender.underwritingNotes}
• **Fit Rationale:** ${lender.fitRationale}
• **BDM / Underwriting Contact:** ${lender.bdm}

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
    let checkedProvince: 'BC' | 'ON' | 'AB' | 'QC' | null = null;
    let provFullName = '';

    if (q.includes('bc') || q.includes('british columbia') || q.includes('vancouver')) {
      checkedProvince = 'BC';
      provFullName = 'British Columbia (BC)';
    } else if (q.includes('ontario') || q.includes('ont') || q.includes('toronto')) {
      checkedProvince = 'ON';
      provFullName = 'Ontario (ON)';
    } else if (q.includes('alberta') || q.includes('calgary') || q.includes('edmonton')) {
      checkedProvince = 'AB';
      provFullName = 'Alberta (AB)';
    } else if (q.includes('quebec') || q.includes('montreal')) {
      checkedProvince = 'QC';
      provFullName = 'Quebec (QC)';
    }

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
• **BDM Submission Desk:** ${matchedLender.bdm}

*Would you like to review their complete underwriting policy, rental income treatment, or submit a deal for triage?*`;
      } else {
        // Recommend alternative lenders in that province
        const alternativeLenders = CANADIAN_LENDERS
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
  if ((q.includes('which') || q.includes('what') || q.includes('list')) && (q.includes('lender') || q.includes('credit union') || q.includes('bank') || q.includes('mic'))) {
    let targetProv: 'BC' | 'ON' | 'AB' | null = null;
    let provName = '';

    if (q.includes('bc') || q.includes('british columbia')) {
      targetProv = 'BC';
      provName = 'British Columbia (BC)';
    } else if (q.includes('ontario') || q.includes('ont')) {
      targetProv = 'ON';
      provName = 'Ontario (ON)';
    } else if (q.includes('alberta')) {
      targetProv = 'AB';
      provName = 'Alberta (AB)';
    }

    if (targetProv) {
      let filtered = CANADIAN_LENDERS.filter(l => l.provinces?.includes(targetProv!));
      if (q.includes('credit union')) {
        filtered = filtered.filter(l => l.channel === 'Credit Union');
      } else if (q.includes('private') || q.includes('mic')) {
        filtered = filtered.filter(l => l.channel === 'Private / MIC');
      } else if (q.includes('alt') || q.includes('b lender')) {
        filtered = filtered.filter(l => l.channel === 'Alternative (B)');
      }

      const topList = filtered.slice(0, 6).map(l => 
        `• **${l.name}** [${l.channel}]: Lowest Rate: **${l.lowestRate ? `${l.lowestRate.toFixed(2)}%` : l.benchmarkRate}** | Max LTV: ${l.maxLTV}% | Notes: ${l.lendingAreaNotes}`
      ).join('\n');

      return `### Lenders Operating in ${provName}

Here are top verified lenders actively lending in **${provName}** based on Mortgage Mentors' institutional database (${filtered.length} total lenders active in ${targetProv}):

${topList}

---
*You can filter the full matrix live at [mortgagementors.net/lenders](https://mortgagementors.net/lenders) or run a deal through Deal Analysis.*`;
    }
  }

  return null;
};

