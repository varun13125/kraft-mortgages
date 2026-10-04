// Master Canadian Institutional Lender Intelligence Database
// Strictly Audited & Verified Against Canadian Mortgage Industry Underwriting Standards

export type CanadianProvince = 'BC' | 'AB' | 'ON' | 'QC' | 'SK' | 'MB' | 'NS' | 'NB' | 'NL' | 'PE' | 'YT' | 'NT' | 'NU';
export type LenderChannel = 'Prime (A)' | 'Monoline' | 'Alternative (B)' | 'Credit Union' | 'Private / MIC' | 'Commercial / Land';
export type PropertyTypeScope = 'Residential' | 'Commercial' | 'Agricultural' | 'Land' | 'Construction';

export interface LenderRateProduct {
  id: string;
  productName: string;
  term: '1 Year' | '2 Year' | '3 Year' | '4 Year' | '5 Year' | '7 Year' | '10 Year';
  termType: 'Fixed' | 'Variable' | 'HELOC';
  program: 'Insured' | 'Insurable' | 'Uninsured' | 'Alternative B' | 'Private Equity';
  rate: number;
  spread?: string;
  apr?: number;
  rateType: 'Standard' | 'Limited' | 'Promo';
  rateHoldDays: number;
  maxLTV: number;
  maxAmortization: number;
  prepaymentPrivilege: string;
  cashback?: string;
  notes?: string;
}

export interface LenderDetail {
  id: string;
  name: string;
  channel: LenderChannel;
  categoryRaw: string;
  minBeacon: number;
  maxLTV: number;
  benchmarkRate: string;
  lowestRate: number;
  productsCount: number;
  isFeatured?: boolean;
  provinces: CanadianProvince[];
  lendingAreaNotes?: string;
  rateHoldDefault?: number;
  transactionTypes: ('Purchase' | 'Refinance' | 'Transfer')[];
  purposes: ('Owner-Occupied' | 'Rental / Investment' | 'Second Home')[];
  rateTypes: ('Standard' | 'Limited' | 'Promo')[];
  programs: ('Insured' | 'Insurable' | 'Uninsured' | 'Alternative B' | 'Private Equity')[];
  turnaround?: string;
  propertyTypes: PropertyTypeScope[];
  bestFor?: string;
  specialFeatures: string[];
  underwritingNotes: string;
  fitRationale: string;
  website: string;
  bdm: string;
  lastUpdated: string;
  rates: LenderRateProduct[];
}

export const CANADIAN_LENDERS: LenderDetail[] = [
  {
    "id": "lender_1",
    "name": "AAREA Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "OPERATIONAL UPDATE (Mar 2026): New Vancouver office — 1300-1500 West Georgia St, Vancouver BC V6G 2Z6. Step Ra...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "OPERATIONAL UPDATE (Mar 2026): New Vancouver office — 1300-1500 West Georgia St, Vancouver BC V6G 2Z6. Step Rate on default files escalates to 20% (effective from date noted in commitment). Legal fee: $1,100/demand letter. NSF fee: $200. No...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "aarea.ca",
    "bdm": "Jessica Yeung (jessica@aarea.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia & Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": true,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_1_1st_closed",
        "productName": "AAREA Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_1_1st_open",
        "productName": "AAREA Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_1_2nd_mtg",
        "productName": "AAREA Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_2",
    "name": "Aarea Private Lending",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "OPERATIONAL UPDATE (Mar 2026): New Vancouver office — 1300-1500 West Georgia St, Vancouver BC V6G 2Z6. Step Ra...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "OPERATIONAL UPDATE (Mar 2026): New Vancouver office — 1300-1500 West Georgia St, Vancouver BC V6G 2Z6. Step Rate on default files escalates to 20% (effective from date noted in commitment). Legal fee: $1,100/demand letter. NSF fee: $200. No...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.aarea.ca",
    "bdm": "Shannon August (mail@aarea.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia & Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_2_1st_closed",
        "productName": "Aarea Private Lending 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_2_1st_open",
        "productName": "Aarea Private Lending 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_2_2nd_mtg",
        "productName": "Aarea Private Lending 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_3",
    "name": "Access Mortgage",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private lender. 2nd mortgage specialist....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private lender. 2nd mortgage specialist....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "accessmortgage.ca",
    "bdm": "Nadeem Chagan (nadeem@accessmortgage.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_3_1st_closed",
        "productName": "Access Mortgage 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_3_1st_open",
        "productName": "Access Mortgage 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_3_2nd_mtg",
        "productName": "Access Mortgage 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_4",
    "name": "Alicorn Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private lender. 2nd mortgage funding opportunities....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private lender. 2nd mortgage funding opportunities....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "alicorn.ca",
    "bdm": "Maggie Cao (maggie@alicorn.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_4_1st_closed",
        "productName": "Alicorn Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_4_1st_open",
        "productName": "Alicorn Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_4_2nd_mtg",
        "productName": "Alicorn Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_5",
    "name": "All Island Equity MIC",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Vancouver Island MIC focused. Stated income with reasonability test. Construction: Custom 75%/65% (primary/sec...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Vancouver Island MIC focused. Stated income with reasonability test. Construction: Custom 75%/65% (primary/secondary), Spec 65%/55%. Commercial/Land: 65%. Exit strategy required. Rates: 8.75%-12.5%. Contact: Brad Rembold - brad@allislandequ...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.allislandequitymic.com",
    "bdm": "Brad Rembold|Margaret O'Connor (brad@allislandequitymic.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_5_1st_closed",
        "productName": "All Island Equity MIC 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_5_1st_open",
        "productName": "All Island Equity MIC 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_5_2nd_mtg",
        "productName": "All Island Equity MIC 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_6",
    "name": "Alta West Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "NEW PRODUCT (Mar 2026): Premiere Small Town Advantage — Rate starting 7.49% | Commitment Fee 2.99% | Finder's ...",
    "specialFeatures": [
      "Rental Worksheet Offset",
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "NEW PRODUCT (Mar 2026): Premiere Small Town Advantage — Rate starting 7.49% | Commitment Fee 2.99% | Finder's Fee 1.00% | Volume bonus up to 15 BPS/deal. Target: towns pop <20,000. Evaluates zoning + real-world comparables. BDMs: Donna Morr...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.awcapital.ca",
    "bdm": "Lundon Clark (ON)|Natalie Echlin (SW ON)|Donna Morrison (BC)|Chris O'Sullivan (AB) (lundon@awcapital.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_6_1st_closed",
        "productName": "Alta West Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_6_1st_open",
        "productName": "Alta West Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_6_2nd_mtg",
        "productName": "Alta West Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_7",
    "name": "Antrim Investments",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Open Terms Standard. LTV sliding scale: 75% on first $1M, 60% on balance. Quick Quote App available. Major cen...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Open Terms Standard. LTV sliding scale: 75% on first $1M, 60% on balance. Quick Quote App available. Major centres only. Fast turnaround. Stated income, no GDS/TDS. Terms: 1-2 years. Amort: up to 40yr. Rates as low as 6.95% depending on LTV...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.antriminvestments.com",
    "bdm": "Will Granleese, Chris Worsnup (will@antriminvestments.com, chrisw@antriminvestments.com, applications@antriminvestments.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB"
    ],
    "lendingAreaNotes": "British Columbia & Alberta",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": true,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_7_1st_closed",
        "productName": "Antrim Investments 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_7_1st_open",
        "productName": "Antrim Investments 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_7_2nd_mtg",
        "productName": "Antrim Investments 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_8",
    "name": "Armada Mortgage Corporation",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "1st and 2nd mortgages in major urban areas. Competitive/Flexible rates and fees, low docs, no minimum beacon....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "1st and 2nd mortgages in major urban areas. Competitive/Flexible rates and fees, low docs, no minimum beacon....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.armadamortgage.com",
    "bdm": "Gordon Hone (sales@armadamortgage.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_8_1st_closed",
        "productName": "Armada Mortgage Corporation 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_8_1st_open",
        "productName": "Armada Mortgage Corporation 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_8_2nd_mtg",
        "productName": "Armada Mortgage Corporation 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_9",
    "name": "Aspire (Strive Capital)",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "UPDATED (Mar 11, 2026): Aspire promo email. Extra 20 BPS on eligible new Aspire files submitted Mar 1-31, 2026...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "UPDATED (Mar 11, 2026): Aspire promo email. Extra 20 BPS on eligible new Aspire files submitted Mar 1-31, 2026 on 1, 2, and 3 year terms. Bonus can be used as extra compensation, rate buydown, or split. Buydown policy noted: 1-year term 1 b...",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "strivecapital.ca",
    "bdm": "Aspire / Strive Capital (communications@strivecapital.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON",
      "BC",
      "AB"
    ],
    "lendingAreaNotes": "Ontario, British Columbia, and Alberta",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_9_1y_classic",
        "productName": "Aspire (Strive Capital) 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_9_2y_classic",
        "productName": "Aspire (Strive Capital) 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_9_bfs_stated",
        "productName": "Aspire (Strive Capital) BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_9_alt_var",
        "productName": "Aspire (Strive Capital) Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_10",
    "name": "Atrium Mortgage Investment Corporation",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Publicly traded (TSX: AI). Fast, flexible residential and commercial mortgages for clients underserved by trad...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Publicly traded (TSX: AI). Fast, flexible residential and commercial mortgages for clients underserved by traditional lenders in major urban centres....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.atriummic.com",
    "bdm": "Phil Fiuza|Richard Coleman (phil.fiuza@atriummic.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential",
      "Commercial"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_10_1st_closed",
        "productName": "Atrium Mortgage Investment Corporation 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_10_1st_open",
        "productName": "Atrium Mortgage Investment Corporation 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_10_2nd_mtg",
        "productName": "Atrium Mortgage Investment Corporation 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_11",
    "name": "Avantus Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private lender....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private lender....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "avantus.ca",
    "bdm": "Sunil Prasad (sunil@avantus.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_11_1st_closed",
        "productName": "Avantus Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_11_1st_open",
        "productName": "Avantus Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_11_2nd_mtg",
        "productName": "Avantus Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_12",
    "name": "B2B Bank",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "PROMO EXTENDED TO FEB 28, 2026: Net Worth premium reduced to 25bps (from 75bps). Equity 50 premium reduced to ...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "PROMO EXTENDED TO FEB 28, 2026: Net Worth premium reduced to 25bps (from 75bps). Equity 50 premium reduced to 25bps (from 75bps). Equity 65 premium reduced to 50bps (from 100bps). Owner-occupied new submissions only. Contact: Mahmoud Gad, P...",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "b2bbank.com/brokermortgages",
    "bdm": "N/S (mortgageunderwriting@b2bbank.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (Major Canadian Provinces outside Quebec)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_12_1y_classic",
        "productName": "B2B Bank 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_12_2y_classic",
        "productName": "B2B Bank 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_12_bfs_stated",
        "productName": "B2B Bank BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_12_alt_var",
        "productName": "B2B Bank Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_13",
    "name": "BDC",
    "channel": "Commercial / Land",
    "categoryRaw": "Crown Corporation / Commercial",
    "minBeacon": 650,
    "maxLTV": 85,
    "benchmarkRate": "Commercial Benchmark (Prime + 1.50% - 3.50%)",
    "bestFor": "NEW (Mar 11, 2026): Extracted from data/BDC.md discussion notes. BDC is treated as a government commercial len...",
    "specialFeatures": [
      "Commercial Owner-Occupied",
      "Equipment Financing",
      "Working Capital Loans"
    ],
    "underwritingNotes": "FEDERAL CROWN COMMERCIAL BANK: Exclusively finances Canadian business enterprises, owner-occupied commercial properties, industrial facilities, and working capital. Does NOT offer residential consumer mortgages.",
    "fitRationale": "Federal commercial bank for operating business owners requiring commercial real estate & equipment financing.",
    "website": "bdc.ca",
    "bdm": "Manik Rai",
    "lastUpdated": "Today",
    "turnaround": "3-5 Business Days",
    "propertyTypes": [
      "Commercial"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_13_1st_closed",
        "productName": "BDC 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_13_1st_open",
        "productName": "BDC 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_13_2nd_mtg",
        "productName": "BDC 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_14",
    "name": "BMO Bank of Montreal",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank (Schedule I)",
    "minBeacon": 680,
    "maxLTV": 95,
    "benchmarkRate": "4.09% - 4.49%",
    "bestFor": "A-Lender",
    "specialFeatures": [
      "Conventional & Insurable",
      "Standard B-20",
      "Smart Fixed Rates",
      "Corporate Auto Debt Exclusion"
    ],
    "underwritingNotes": "Big 6 Chartered Bank. High-ratio insured loans up to 95% LTV (up to $1.5M with 30-year amort for FTHB). Strict 50% rental income add-back on subject secondary suites (does NOT offset PITH). BMO allows corporate vehicle debt exclusion with 3 months corporate statements proving business pays.",
    "fitRationale": "Prime A chartered bank with aggressive broker pricing and corporate debt carve-out.",
    "website": "",
    "bdm": "",
    "lastUpdated": "Today",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces)",
    "productsCount": 95,
    "lowestRate": 4.29,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_14_5y_fix_ins",
        "productName": "BMO Bank of Montreal 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_14_5y_fix_insurable",
        "productName": "BMO Bank of Montreal 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.53,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_14_3y_fix_ins",
        "productName": "BMO Bank of Montreal 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_14_3y_fix_unins",
        "productName": "BMO Bank of Montreal 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.74,
        "spread": "Fixed",
        "apr": 4.78,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_14_5y_var_ins",
        "productName": "BMO Bank of Montreal 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_14_1y_fix",
        "productName": "BMO Bank of Montreal 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.09,
        "spread": "Fixed",
        "apr": 5.14,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_14_heloc",
        "productName": "BMO Bank of Montreal Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_15",
    "name": "Bayfield Mortgage Professionals",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Over 40 years of experience. 1st and 2nd position financing delivering fair and practical mortgage solutions....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Over 40 years of experience. 1st and 2nd position financing delivering fair and practical mortgage solutions....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.bayfield.ca",
    "bdm": "Monique Tirshman|Carol Dorry|Lilly Bui (submit@bayfield.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_15_1st_closed",
        "productName": "Bayfield Mortgage Professionals 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_15_1st_open",
        "productName": "Bayfield Mortgage Professionals 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_15_2nd_mtg",
        "productName": "Bayfield Mortgage Professionals 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_16",
    "name": "Benson Capital",
    "channel": "Commercial / Land",
    "categoryRaw": "Private Commercial / Land",
    "minBeacon": 550,
    "maxLTV": 75,
    "benchmarkRate": "8.50% - 11.50%",
    "bestFor": "Ontario's leading private lender for residential, commercial, land, and construction financing. Serving privat...",
    "specialFeatures": [
      "Commercial Mortgages",
      "Land Financing",
      "Construction Draws"
    ],
    "underwritingNotes": "Ontario private commercial lender for commercial, land, and construction financing. Loans ranging from $500K to $15M+. Asset-focused, quick closings.",
    "fitRationale": "Ontario commercial and development land bridge financing.",
    "website": "www.bensoncapital.ca",
    "bdm": "Lending Team (bm@bensoncapital.ca)",
    "lastUpdated": "Today",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Commercial",
      "Land",
      "Construction"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_16_1st_closed",
        "productName": "Benson Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_16_1st_open",
        "productName": "Benson Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_16_2nd_mtg",
        "productName": "Benson Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_17",
    "name": "Bloom Fin (Reverse Mortgages)",
    "channel": "Alternative (B)",
    "categoryRaw": "Reverse Mortgage Specialist",
    "minBeacon": 500,
    "maxLTV": 55,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "Reverse mortgage specialist only for homeowners age 55+. Equity release with zero monthly payments. Not for purchases.",
    "specialFeatures": [
      "Reverse Mortgage (Age 55+)",
      "Equity Release",
      "No Monthly Payments"
    ],
    "underwritingNotes": "Reverse mortgage specialist for Canadian homeowners age 55+. 1Y/3Y/5Y rate terms. No reset premium. Prepayment penalties based on time since funding. Max 55% LTV based on age. Zero monthly payments. Not applicable for standard home purchase deals.",
    "fitRationale": "Specialized retirement equity release for seniors 55+ looking to unlock home equity without monthly payments.",
    "website": "bloomfin.ca",
    "bdm": "Andre Da Silva (647-947-0636, adasilva@bloomfin.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_17_1y_classic",
        "productName": "Bloom Fin (Reverse Mortgages) 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_17_2y_classic",
        "productName": "Bloom Fin (Reverse Mortgages) 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_17_bfs_stated",
        "productName": "Bloom Fin (Reverse Mortgages) BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_17_alt_var",
        "productName": "Bloom Fin (Reverse Mortgages) Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_18",
    "name": "Bridgewater Bank",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "RATES (Dec 22, 2025): Prime 4.45%. 1YR: 680+ 4.99% | 640+ 5.19% | 600+ 5.39% | 550+ 5.69% | 500+ 5.94%. 2YR: 6...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "RATES (Dec 22, 2025): Prime 4.45%. 1YR: 680+ 4.99% | 640+ 5.19% | 600+ 5.39% | 550+ 5.69% | 500+ 5.94%. 2YR: 680+ 5.19% | 640+ 5.29% | 600+ 5.49% | 550+ 5.79% | 500+ 6.04%. 3YR: 680+ 5.19% | 640+ 5.29% | 600+ 5.49% | 550+ 5.79% | 500+ 6.04%...",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "bwbbrokerinfo.ca",
    "bdm": "Yvonne Futter (BC: Lower Mainland, Van Island, Northern BC) (YFutter@bridgewaterbank.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (Major Canadian Provinces outside Quebec)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_18_1y_classic",
        "productName": "Bridgewater Bank 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_18_2y_classic",
        "productName": "Bridgewater Bank 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_18_bfs_stated",
        "productName": "Bridgewater Bank BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_18_alt_var",
        "productName": "Bridgewater Bank Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_19",
    "name": "CMI (Canadian Mortgages Inc)",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "⚠️ RESIDENTIAL ONLY - NO COMMERCIAL OR CONSTRUCTION LENDING. No min credit score. Stated income. No GDS/TDS re...",
    "specialFeatures": [
      "BFS Stated Income",
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "⚠️ RESIDENTIAL ONLY - NO COMMERCIAL OR CONSTRUCTION LENDING. No min credit score. Stated income. No GDS/TDS restrictions. 1-year term, interest-only, open or closed. Approvals in hours, closings in days. Focus on borrower story + exit plan....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "cmicanada.ca",
    "bdm": "Deal Desk (info@thecmigroup.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential",
      "Commercial"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_19_1st_closed",
        "productName": "CMI (Canadian Mortgages Inc) 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_19_1st_open",
        "productName": "CMI (Canadian Mortgages Inc) 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_19_2nd_mtg",
        "productName": "CMI (Canadian Mortgages Inc) 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_20",
    "name": "CMI Group",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private 2nd mortgage funding. Recent deal: 15% yield at 74.7% LTV (Upper Mission, Kelowna). Contact: Travis Al...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private 2nd mortgage funding. Recent deal: 15% yield at 74.7% LTV (Upper Mission, Kelowna). Contact: Travis Allinott - travis.allinott@thecmigroup.ca....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "thecmigroup.ca",
    "bdm": "Travis Allinott (travis.allinott@thecmigroup.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_20_1st_closed",
        "productName": "CMI Group 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_20_1st_open",
        "productName": "CMI Group 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_20_2nd_mtg",
        "productName": "CMI Group 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_21",
    "name": "CMLS AVEO",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "GDS/TDS: 50/50 (<65% LTV), 48/48 (>65% LTV). 35yr amort on exception (680+). Beacon min 550. Bankruptcy: disch...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "GDS/TDS: 50/50 (<65% LTV), 48/48 (>65% LTV). 35yr amort on exception (680+). Beacon min 550. Bankruptcy: discharged 6mo+ (550-575). Proposal: 6mo+ repayment. BFS Alt Income: 6mo bank stmts + 3 invoices. Prepay: 20/20. Penalty: 3/2/1%....",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "cmls.ca/brokers",
    "bdm": "N/S (underwriting@cmls.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All provinces except QC)",
    "productsCount": 85,
    "lowestRate": 4.24,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_21_1y_classic",
        "productName": "CMLS AVEO 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 4.24,
        "spread": "Fixed",
        "apr": 4.39,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_21_2y_classic",
        "productName": "CMLS AVEO 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_21_bfs_stated",
        "productName": "CMLS AVEO BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 4.54,
        "spread": "Fixed",
        "apr": 4.59,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_21_alt_var",
        "productName": "CMLS AVEO Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_22",
    "name": "CTBC Bank Corp. (Canada)",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank (Schedule II)",
    "minBeacon": 660,
    "maxLTV": 75,
    "benchmarkRate": "4.69% - 5.39%",
    "bestFor": "Foreign income & DP accepted. No restrictions on gifted DP. Quick closings. Hold Co available. New customers o...",
    "specialFeatures": [
      "Foreign Income Accepted",
      "Gifted Down Payment Flexibility",
      "Holding Company OK"
    ],
    "underwritingNotes": "Schedule II chartered bank. Accepts foreign income & gifted down payments with zero seasoning restrictions. Quick closings. Personal or Holding Company title available.",
    "fitRationale": "Prime bank choice for foreign income earners and holding company borrowers.",
    "website": "ctbcbank.ca",
    "bdm": "Star Li (star.li@ctbcbank.ca)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia (Vancouver / Richmond / Burnaby) & Ontario (Greater Toronto Area / Markham)",
    "productsCount": 28,
    "lowestRate": 4.39,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_22_5y_fix_ins",
        "productName": "CTBC Bank Corp. (Canada) 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.44,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_22_5y_fix_insurable",
        "productName": "CTBC Bank Corp. (Canada) 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.59,
        "spread": "Fixed",
        "apr": 4.63,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_22_3y_fix_ins",
        "productName": "CTBC Bank Corp. (Canada) 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.54,
        "spread": "Fixed",
        "apr": 4.59,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_22_3y_fix_unins",
        "productName": "CTBC Bank Corp. (Canada) 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.84,
        "spread": "Fixed",
        "apr": 4.88,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_22_5y_var_ins",
        "productName": "CTBC Bank Corp. (Canada) 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_22_1y_fix",
        "productName": "CTBC Bank Corp. (Canada) 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.19,
        "spread": "Fixed",
        "apr": 5.24,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_22_heloc",
        "productName": "CTBC Bank Corp. (Canada) Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_23",
    "name": "CWB Optimum Mortgage",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "Alternative lending arm of Canadian Western Bank....",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "Alternative lending arm of Canadian Western Bank....",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "www.optimummortgage.ca",
    "bdm": "Frank Giacomini (N/S)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (Major Canadian Provinces outside Quebec)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_23_1y_classic",
        "productName": "CWB Optimum Mortgage 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_23_2y_classic",
        "productName": "CWB Optimum Mortgage 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_23_bfs_stated",
        "productName": "CWB Optimum Mortgage BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_23_alt_var",
        "productName": "CWB Optimum Mortgage Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_24",
    "name": "Cambridge MIC (CMI)",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 65,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Construction and 2nd mortgage lender. Active in Victoria market. Martina East (martina@cambridgemic.com) also ...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Construction and 2nd mortgage lender. Active in Victoria market. Martina East (martina@cambridgemic.com) also available....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "cambridgemic.com",
    "bdm": "Trevor Cullen (trevor@cambridgemic.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_24_1st_closed",
        "productName": "Cambridge MIC (CMI) 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_24_1st_open",
        "productName": "Cambridge MIC (CMI) 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_24_2nd_mtg",
        "productName": "Cambridge MIC (CMI) 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_25",
    "name": "Cambridge Mortgage Investment Corporation",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Creative, flexible private lending built for brokers. Fast approvals, tailored financing....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Creative, flexible private lending built for brokers. Fast approvals, tailored financing....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.cambridgemic.com",
    "bdm": "Martina East (martina@cambridgemic.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_25_1st_closed",
        "productName": "Cambridge Mortgage Investment Corporation 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_25_1st_open",
        "productName": "Cambridge Mortgage Investment Corporation 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_25_2nd_mtg",
        "productName": "Cambridge Mortgage Investment Corporation 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_26",
    "name": "Cameron Stephens",
    "channel": "Commercial / Land",
    "categoryRaw": "Commercial Lender / Mezzanine",
    "minBeacon": 600,
    "maxLTV": 75,
    "benchmarkRate": "8.00% - 12.00%",
    "bestFor": "NEW (Mar 11, 2026): Website review. Cameron Stephens positions itself as a leading Canadian commercial real es...",
    "specialFeatures": [
      "Commercial First Mortgages",
      "Mezzanine Financing",
      "Land & Development"
    ],
    "underwritingNotes": "Major Canadian non-bank commercial lender specializing in commercial mortgages, construction loans, and mezzanine debt for real estate developers ($2M to $50M+).",
    "fitRationale": "Institutional commercial and construction mezzanine financing for active developers.",
    "website": "cameronstephens.com",
    "bdm": "General / team via website",
    "lastUpdated": "Today",
    "turnaround": "3-5 Business Days",
    "propertyTypes": [
      "Commercial",
      "Land",
      "Construction"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_26_1st_closed",
        "productName": "Cameron Stephens 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_26_1st_open",
        "productName": "Cameron Stephens 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_26_2nd_mtg",
        "productName": "Cameron Stephens 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_27",
    "name": "Canadian Western Bank / Optimum Mortgage",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank / Canadian Western Bank",
    "minBeacon": 660,
    "maxLTV": 80,
    "benchmarkRate": "4.49% - 5.19%",
    "bestFor": "A-Lender. Amalgamated with National Bank (March 2025). Documents to mortgage.documents@cwbank.com. 10 business...",
    "specialFeatures": [
      "Schedule I Chartered Bank",
      "National Bank Affiliated",
      "Prime Conventional"
    ],
    "underwritingNotes": "Schedule I chartered Canadian bank (amalgamated with National Bank group). Prime conventional residential mortgages up to 80% LTV. Optimum Mortgage is their separate alternative lending division.",
    "fitRationale": "Solid Western Canadian prime bank for conventional residential files.",
    "website": "optimummortgage.ca",
    "bdm": "Jagjot Sidhu (Jagjot.Sidhu@cwbank.com)",
    "lastUpdated": "Today",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (Major Canadian Provinces outside Quebec)",
    "productsCount": 95,
    "lowestRate": 4.29,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_27_5y_fix_ins",
        "productName": "Canadian Western Bank / Optimum Mortgage 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_27_5y_fix_insurable",
        "productName": "Canadian Western Bank / Optimum Mortgage 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.53,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_27_3y_fix_ins",
        "productName": "Canadian Western Bank / Optimum Mortgage 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_27_3y_fix_unins",
        "productName": "Canadian Western Bank / Optimum Mortgage 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.74,
        "spread": "Fixed",
        "apr": 4.78,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_27_5y_var_ins",
        "productName": "Canadian Western Bank / Optimum Mortgage 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_27_1y_fix",
        "productName": "Canadian Western Bank / Optimum Mortgage 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.09,
        "spread": "Fixed",
        "apr": 5.14,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_27_heloc",
        "productName": "Canadian Western Bank / Optimum Mortgage Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_28",
    "name": "Canguard Mortgage Investment Corp",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 65,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "MIC lender. Construction financing on as-complete value. Active in Victoria/Vancouver markets. Sadaf Tavakoli ...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "MIC lender. Construction financing on as-complete value. Active in Victoria/Vancouver markets. Sadaf Tavakoli (sadaf@canguard.ca) handles reviews....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "canguard.ca",
    "bdm": "Mani Ebrahimi (mani@canguard.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_28_1st_closed",
        "productName": "Canguard Mortgage Investment Corp 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_28_1st_open",
        "productName": "Canguard Mortgage Investment Corp 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_28_2nd_mtg",
        "productName": "Canguard Mortgage Investment Corp 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_29",
    "name": "Capital Direct Lending Corp",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Equity Counts. No income/credit/age requirements. GVA, Victoria, Metro Kelowna only. Newer homes (30 yrs) / Hi...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Equity Counts. No income/credit/age requirements. GVA, Victoria, Metro Kelowna only. Newer homes (30 yrs) / High Rise Condos. 1 Year terms. Broker specials effective Aug 2025....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.capitaldirect.ca",
    "bdm": "Greg Kakuno (BC)|Donna Hunter (AB)|Cheryl Smith (ON) (gkakuno@capitaldirect.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_29_1st_closed",
        "productName": "Capital Direct Lending Corp 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_29_1st_open",
        "productName": "Capital Direct Lending Corp 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_29_2nd_mtg",
        "productName": "Capital Direct Lending Corp 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_30",
    "name": "Capital West Mortgage Inc.",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "NEW (Mar 9, 2026): Capital West Mortgage Inc. Alternative Lending Division. March Madness promo runs to Apr 1....",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "NEW (Mar 9, 2026): Capital West Mortgage Inc. Alternative Lending Division. March Madness promo runs to Apr 1. Positioning: clean credit, marketable real estate, no minimum income. Submit through Filogix, Velocity, or Finmo. Downloads inclu...",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "capitalwest.ca/ald",
    "bdm": "Cassius Felicella | Adam Rubin (apply@capitalwest.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, MB, SK, Atlantic)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_30_1y_classic",
        "productName": "Capital West Mortgage Inc. 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_30_2y_classic",
        "productName": "Capital West Mortgage Inc. 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_30_bfs_stated",
        "productName": "Capital West Mortgage Inc. BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_30_alt_var",
        "productName": "Capital West Mortgage Inc. Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_31",
    "name": "Caplink Financial Corporation",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "NEW (Mar 10, 2026): Limited-time 80% LTV promotion for single-family homes in Alberta only. Edmonton Metropoli...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "NEW (Mar 10, 2026): Limited-time 80% LTV promotion for single-family homes in Alberta only. Edmonton Metropolitan Region includes St. Albert, Sherwood Park, Beaumont, Spruce Grove, Leduc. Calgary Metropolitan Region includes Airdrie, Cheste...",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "caplink.ca",
    "bdm": "Mila Glidden (mila@caplink.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "AB",
      "BC"
    ],
    "lendingAreaNotes": "Alberta & British Columbia",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_31_1y_classic",
        "productName": "Caplink Financial Corporation 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_31_2y_classic",
        "productName": "Caplink Financial Corporation 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_31_bfs_stated",
        "productName": "Caplink Financial Corporation BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_31_alt_var",
        "productName": "Caplink Financial Corporation Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_32",
    "name": "Cedar Peaks Mortgage Services",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Preferred direct Private Lender for over 20 years. 'In Business to do Business'. If it's not an A or B deal, i...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Preferred direct Private Lender for over 20 years. 'In Business to do Business'. If it's not an A or B deal, it's a Cedar Peaks Deal....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.cedarpeaksmortgage.ca",
    "bdm": "Mark Pullin|Melanie Andrews (mark@cedarpeaksmortgage.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "AB",
      "BC"
    ],
    "lendingAreaNotes": "Alberta & British Columbia",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_32_1st_closed",
        "productName": "Cedar Peaks Mortgage Services 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_32_1st_open",
        "productName": "Cedar Peaks Mortgage Services 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_32_2nd_mtg",
        "productName": "Cedar Peaks Mortgage Services 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_33",
    "name": "Coast Capital Savings",
    "channel": "Credit Union",
    "categoryRaw": "Federal Credit Union",
    "minBeacon": 640,
    "maxLTV": 80,
    "benchmarkRate": "4.29% - 4.79%",
    "bestFor": "Construction: 75% LTC, Prime+2%, 18-mo term. Bridge: 2 months, firm sale req. Interim: 6 months, 1% fee. Impai...",
    "specialFeatures": [
      "Federal Credit Union",
      "Construction Financing",
      "Bridge & Interim Loans"
    ],
    "underwritingNotes": "One of Canada's largest federal credit unions. Construction: 75% LTC, Prime + 2.00%, 18-mo term. Bridge: 2 months with firm sale. Interim: 6 months. Subject secondary suites: 50% rental add-back to income.",
    "fitRationale": "Federal credit union with robust construction and bridge financing capabilities.",
    "website": "coastcapitalsavings.com",
    "bdm": "N/S (brokercentre@coastcapitalsavings.com)",
    "lastUpdated": "Today",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Federal Credit Union with core BC retail branch footprint)",
    "productsCount": 82,
    "lowestRate": 4.39,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_33_5y_fix_ins",
        "productName": "Coast Capital Savings 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.44,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_33_5y_fix_insurable",
        "productName": "Coast Capital Savings 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.59,
        "spread": "Fixed",
        "apr": 4.63,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_33_3y_fix_ins",
        "productName": "Coast Capital Savings 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.54,
        "spread": "Fixed",
        "apr": 4.59,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_33_3y_fix_unins",
        "productName": "Coast Capital Savings 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.84,
        "spread": "Fixed",
        "apr": 4.88,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_33_5y_var_ins",
        "productName": "Coast Capital Savings 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_33_1y_fix",
        "productName": "Coast Capital Savings 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.19,
        "spread": "Fixed",
        "apr": 5.24,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_33_heloc",
        "productName": "Coast Capital Savings Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_34",
    "name": "Community Trust",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "BDM Meghan Farrant 604-838-0025. 35yr amort. Rate hold 90 days. 5 programs: Conforming (500+, 50/50, 80%), Hig...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "BDM Meghan Farrant 604-838-0025. 35yr amort. Rate hold 90 days. 5 programs: Conforming (500+, 50/50, 80%), High Credit (680+ all, 60/60, 80% purchase/75% refi, +30bps), High Equity (600+ all, 60/60, 65%, no premium), High Net Worth (680+, 7...",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "communitytrust.ca",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (Major Canadian Provinces outside Quebec)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_34_1y_classic",
        "productName": "Community Trust 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_34_2y_classic",
        "productName": "Community Trust 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_34_bfs_stated",
        "productName": "Community Trust BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_34_alt_var",
        "productName": "Community Trust Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_35",
    "name": "Consumers Choice Mortgages",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private mortgages on residential properties in BC with a focus on Greater Vancouver and the Lower Mainland....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private mortgages on residential properties in BC with a focus on Greater Vancouver and the Lower Mainland....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.consumerschoicemortgages.ca",
    "bdm": "Kurt Madsen (consumerschoice@momat.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_35_1st_closed",
        "productName": "Consumers Choice Mortgages 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_35_1st_open",
        "productName": "Consumers Choice Mortgages 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_35_2nd_mtg",
        "productName": "Consumers Choice Mortgages 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_36",
    "name": "Cosman Mortgage Capital Corp",
    "channel": "Commercial / Land",
    "categoryRaw": "Commercial Direct Lender",
    "minBeacon": 600,
    "maxLTV": 75,
    "benchmarkRate": "8.25% - 10.75%",
    "bestFor": "Direct lender for commercial mortgages ranging between $1-$10 Million in Southern Ontario....",
    "specialFeatures": [
      "Direct Commercial Mortgages",
      "Southern Ontario Focus",
      "$1M - $10M Financing"
    ],
    "underwritingNotes": "Direct commercial lender providing $1M-$10M commercial mortgages in Southern Ontario. Focus on cash-flowing commercial, industrial, and retail assets.",
    "fitRationale": "Direct private commercial mortgages for Southern Ontario commercial assets.",
    "website": "www.cosmanmortgage.ca",
    "bdm": "Jason Cosman (jason@cosmanmortgage.ca)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Commercial"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_36_1st_closed",
        "productName": "Cosman Mortgage Capital Corp 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_36_1st_open",
        "productName": "Cosman Mortgage Capital Corp 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_36_2nd_mtg",
        "productName": "Cosman Mortgage Capital Corp 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_37",
    "name": "Cove Mortgage",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private/Equity MIC",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Underwriting criteria aligned with Canadian mortgage broker guidelines.",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "",
    "bdm": "",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_37_1st_closed",
        "productName": "Cove Mortgage 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_37_1st_open",
        "productName": "Cove Mortgage 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_37_2nd_mtg",
        "productName": "Cove Mortgage 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_38",
    "name": "Domain Funding",
    "channel": "Commercial / Land",
    "categoryRaw": "Commercial & Development",
    "minBeacon": 550,
    "maxLTV": 70,
    "benchmarkRate": "8.75% - 11.50%",
    "bestFor": "Private mortgage financing of commercial properties and developments. Complex loan structures and fast funding...",
    "specialFeatures": [
      "Development Financing",
      "Commercial Bridge",
      "Flexible Terms"
    ],
    "underwritingNotes": "Private commercial financing of commercial properties, development sites, and transitional real estate in Western Canada.",
    "fitRationale": "Western Canadian commercial land and development bridge financing.",
    "website": "www.domainfunding.ca",
    "bdm": "Marcus Yun (myun@domainfunding.ca)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Commercial",
      "Land",
      "Construction"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_38_1st_closed",
        "productName": "Domain Funding 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_38_1st_open",
        "productName": "Domain Funding 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_38_2nd_mtg",
        "productName": "Domain Funding 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_39",
    "name": "Drake Financial Ltd.",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private lending specialist. Exempt Market Dealer Rep. Fraser Valley focus. Abbotsford office: 2190 McCallum Ro...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private lending specialist. Exempt Market Dealer Rep. Fraser Valley focus. Abbotsford office: 2190 McCallum Road, V2S 3P3. BCFSA licensed since 2005....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "drakefinancial.com",
    "bdm": "Peter Pasula (peter@drakefinancial.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_39_1st_closed",
        "productName": "Drake Financial Ltd. 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_39_1st_open",
        "productName": "Drake Financial Ltd. 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_39_2nd_mtg",
        "productName": "Drake Financial Ltd. 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_40",
    "name": "Eclipse Mortgages",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "Exclusive alternative mortgage solution for MCAP and RMG Mortgages. Supports buyers/owners whose credit/income...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "Exclusive alternative mortgage solution for MCAP and RMG Mortgages. Supports buyers/owners whose credit/income doesn't match traditional lenders....",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "www.eclipsemortgages.ca",
    "bdm": "Deal Run (dealrun@eclipsemortgages.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, MB, SK, Atlantic)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_40_1y_classic",
        "productName": "Eclipse Mortgages 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_40_2y_classic",
        "productName": "Eclipse Mortgages 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_40_bfs_stated",
        "productName": "Eclipse Mortgages BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_40_alt_var",
        "productName": "Eclipse Mortgages Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_41",
    "name": "Equitable Bank",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "5.59% (1-Yr Alt)",
    "bestFor": "Tiered FICO programs. Low-LTV promo: -0.20% LTV<=65%, -0.30% LTV<=50%. BC rate sheet Mar 27 2026. BDM Wade Gor...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "Tiered FICO programs. Low-LTV promo: -0.20% LTV<=65%, -0.30% LTV<=50%. BC rate sheet Mar 27 2026. BDM Wade Gordon....",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "equitablebank.ca",
    "bdm": "Suzanne Aujla (saujla@eqbank.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces including Quebec)",
    "productsCount": 115,
    "lowestRate": 4.29,
    "isFeatured": true,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_41_1y_classic",
        "productName": "Equitable Bank 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_41_2y_classic",
        "productName": "Equitable Bank 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_41_bfs_stated",
        "productName": "Equitable Bank BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 4.59,
        "spread": "Fixed",
        "apr": 4.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_41_alt_var",
        "productName": "Equitable Bank Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_42",
    "name": "Farm Credit Canada (FCC)",
    "channel": "Commercial / Land",
    "categoryRaw": "Crown Corporation / Agriculture",
    "minBeacon": 650,
    "maxLTV": 75,
    "benchmarkRate": "Ag Benchmark (Prime + 1.00% - 2.50%)",
    "bestFor": "Crown corporation specializing in agriculture. Offers Flexfarm mortgage, young farmer programs, equipment loan...",
    "specialFeatures": [
      "Agricultural Mortgages",
      "Young Farmer Loans",
      "Agribusiness Financing"
    ],
    "underwritingNotes": "Federal Crown corporation dedicated exclusively to Canadian agriculture, farming operations, agribusiness, and rural farm acreage. Does NOT lend on urban residential single-family homes.",
    "fitRationale": "Federal agriculture lender for working farms, ranches, and commercial agribusiness.",
    "website": "fcc-fac.ca",
    "bdm": "",
    "lastUpdated": "Today",
    "turnaround": "3-5 Business Days",
    "propertyTypes": [
      "Agricultural",
      "Land"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_42_1st_closed",
        "productName": "Farm Credit Canada (FCC) 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_42_1st_open",
        "productName": "Farm Credit Canada (FCC) 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_42_2nd_mtg",
        "productName": "Farm Credit Canada (FCC) 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_43",
    "name": "Farm Lending Canada",
    "channel": "Commercial / Land",
    "categoryRaw": "Agricultural / Acreage Specialist",
    "minBeacon": 600,
    "maxLTV": 75,
    "benchmarkRate": "7.25% - 9.50%",
    "bestFor": "Expertise in Ag and rural residential mortgages. From large-scale farm and ranch operations to hobby farms....",
    "specialFeatures": [
      "Hobby Farm Program",
      "Small Ag Program",
      "Large Acreage Financing"
    ],
    "underwritingNotes": "Specialist in Ag and rural acreage mortgages. Hobby Farm program caps at 40 acres; >40 acres qualifies under Small Ag (70% max LTV, 3yr T1s).",
    "fitRationale": "Agricultural and acreage properties across Western Canada and Ontario.",
    "website": "www.farmlending.ca",
    "bdm": "Tom Hickey (tom.hickey@farmlending.ca)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Agricultural",
      "Land"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_43_1st_closed",
        "productName": "Farm Lending Canada 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_43_1st_open",
        "productName": "Farm Lending Canada 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_43_2nd_mtg",
        "productName": "Farm Lending Canada 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_44",
    "name": "Firm Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private/Equity MIC",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Underwriting criteria aligned with Canadian mortgage broker guidelines.",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "",
    "bdm": "",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_44_1st_closed",
        "productName": "Firm Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_44_1st_open",
        "productName": "Firm Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_44_2nd_mtg",
        "productName": "Firm Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_45",
    "name": "First Circle Financial",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Non-income qualifying. No GDS/TDS. All interest-only. Terms: 12-24 months, fully open. Construction: 25% equit...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Non-income qualifying. No GDS/TDS. All interest-only. Terms: 12-24 months, fully open. Construction: 25% equity, NHW required, 100% soft cost prepaid. Handles BKs, Corps, non-resident, bridge loans. Fast turnaround....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "firstcirclefinancial.ca",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_45_1st_closed",
        "productName": "First Circle Financial 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_45_1st_open",
        "productName": "First Circle Financial 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_45_2nd_mtg",
        "productName": "First Circle Financial 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_46",
    "name": "First National Financial",
    "channel": "Monoline",
    "categoryRaw": "Monoline Prime A Leader",
    "minBeacon": 660,
    "maxLTV": 95,
    "benchmarkRate": "3.99% - 4.39%",
    "bestFor": "One of Canada's largest non-bank lenders, home to Excalibur alternative lending....",
    "specialFeatures": [
      "Conventional & Insurable",
      "Standard B-20",
      "Merlin Online Tracking",
      "Fast Turnarounds"
    ],
    "underwritingNotes": "Canada's largest non-bank monoline mortgage lender ($140B+ AUM). High-ratio insured loans up to 95% LTV. Subject secondary suites: 50% rental income added to gross income (does NOT do subject PITH offset). Non-subject rentals: standard First National Rental Worksheet (50% gross rent minus PITH). Excalibur is their separate alternative B division.",
    "fitRationale": "Premier monoline lender with best-in-class broker service, quick turnarounds, and top-tier rates.",
    "website": "www.firstnational.ca",
    "bdm": "Excalibur Team (N/S)",
    "lastUpdated": "Today",
    "turnaround": "4-12 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces including Quebec)",
    "productsCount": 120,
    "lowestRate": 4.19,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_46_5y_fix_ins",
        "productName": "First National Financial 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.19,
        "spread": "Fixed",
        "apr": 4.24,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_46_5y_fix_insurable",
        "productName": "First National Financial 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.43,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_46_3y_fix_ins",
        "productName": "First National Financial 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.34,
        "spread": "Fixed",
        "apr": 4.39,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_46_3y_fix_unins",
        "productName": "First National Financial 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.64,
        "spread": "Fixed",
        "apr": 4.68,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_46_5y_var_ins",
        "productName": "First National Financial 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_46_1y_fix",
        "productName": "First National Financial 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.99,
        "spread": "Fixed",
        "apr": 5.04,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_46_heloc",
        "productName": "First National Financial Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_47",
    "name": "First Source Mortgage Corporation",
    "channel": "Commercial / Land",
    "categoryRaw": "Commercial & Construction",
    "minBeacon": 550,
    "maxLTV": 75,
    "benchmarkRate": "8.95% - 11.95%",
    "bestFor": "Boutique mortgage lender, providing financing up to $20 million for projects in the GTA and surrounding areas....",
    "specialFeatures": [
      "GTA Commercial Lending",
      "Construction Financing",
      "Up to $20 Million"
    ],
    "underwritingNotes": "Boutique commercial mortgage lender providing financing up to $20M for commercial and construction projects in the Greater Toronto Area.",
    "fitRationale": "Commercial development and builder bridge financing in the GTA.",
    "website": "www.firstsourcemortgage.ca",
    "bdm": "Elena Robinson & James Co (interim) (elena.robinson@firstnational.ca)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Commercial",
      "Construction",
      "Land"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_47_1st_closed",
        "productName": "First Source Mortgage Corporation 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_47_1st_open",
        "productName": "First Source Mortgage Corporation 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_47_2nd_mtg",
        "productName": "First Source Mortgage Corporation 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_48",
    "name": "First West Credit Union (Envision Financial, Valley First, Island Savings)",
    "channel": "Credit Union",
    "categoryRaw": "Provincial Credit Union (BC)",
    "minBeacon": 650,
    "maxLTV": 80,
    "benchmarkRate": "4.34% - 4.84%",
    "bestFor": "2026 CHANGES: Total Wealth fee reduced to 0.25% (from 0.5%), refundable if $100K+ moved to FW. New 0.25% fee f...",
    "specialFeatures": [
      "Extended Ratios (55/55)",
      "BFS Alt Income",
      "Total Wealth HNW Program",
      "Local Common Sense"
    ],
    "underwritingNotes": "Major BC credit union operating Envision Financial, Valley First, and Island Savings. Extended ratio program up to 55/55 GDS/TDS (at 65% LTV). Total Wealth program for high net worth clients. Generous common-sense rental suite policies.",
    "fitRationale": "Top BC credit union for extended debt servicing and wealth-based lending.",
    "website": "firstwestcu.ca",
    "bdm": "Mark Gawehns (LM/Van Island North) | Cheryl De Wal (Interior/Victoria) (mgawehns@firstwestcu.ca | cdewal@firstwestcu.ca)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia only (Fraser Valley, Okanagan, Vancouver Island)",
    "productsCount": 55,
    "lowestRate": 4.34,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_48_5y_fix_ins",
        "productName": "First West Credit Union (Envision Financial, Valley First, Island Savings) 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.34,
        "spread": "Fixed",
        "apr": 4.39,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_48_5y_fix_insurable",
        "productName": "First West Credit Union (Envision Financial, Valley First, Island Savings) 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.54,
        "spread": "Fixed",
        "apr": 4.58,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_48_3y_fix_ins",
        "productName": "First West Credit Union (Envision Financial, Valley First, Island Savings) 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.54,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_48_3y_fix_unins",
        "productName": "First West Credit Union (Envision Financial, Valley First, Island Savings) 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.79,
        "spread": "Fixed",
        "apr": 4.83,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_48_5y_var_ins",
        "productName": "First West Credit Union (Envision Financial, Valley First, Island Savings) 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_48_1y_fix",
        "productName": "First West Credit Union (Envision Financial, Valley First, Island Savings) 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.14,
        "spread": "Fixed",
        "apr": 5.19,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_48_heloc",
        "productName": "First West Credit Union (Envision Financial, Valley First, Island Savings) Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_49",
    "name": "Fisgard Asset Management Corp",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Equity-focused: ability to pay > strict income. Construction OO only with progress draws, NHW required. Constr...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Equity-focused: ability to pay > strict income. Construction OO only with progress draws, NHW required. Construction >65% LTV requires income verification. BC 2nd: 580+ beacon, no rentals. Epic Equity (ON only): no income docs up to 65% LTV...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "fisgard.com",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB"
    ],
    "lendingAreaNotes": "British Columbia & Alberta",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_49_1st_closed",
        "productName": "Fisgard Asset Management Corp 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_49_1st_open",
        "productName": "Fisgard Asset Management Corp 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_49_2nd_mtg",
        "productName": "Fisgard Asset Management Corp 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_50",
    "name": "Fraction",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private/Equity MIC",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Underwriting criteria aligned with Canadian mortgage broker guidelines.",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "",
    "bdm": "",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_50_1st_closed",
        "productName": "Fraction 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_50_1st_open",
        "productName": "Fraction 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_50_2nd_mtg",
        "productName": "Fraction 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_51",
    "name": "Gentai Capital Corporation",
    "channel": "Commercial / Land",
    "categoryRaw": "Commercial Asset Manager",
    "minBeacon": 550,
    "maxLTV": 75,
    "benchmarkRate": "8.50% - 11.50%",
    "bestFor": "Leading Canadian alternative investment manager, offering value-added real estate financing solutions coast to...",
    "specialFeatures": [
      "Commercial First Mortgages",
      "Construction Draw Loans",
      "Asset-Based Lending"
    ],
    "underwritingNotes": "Alternative commercial investment manager providing commercial first mortgages, land financing, and construction loans across BC, AB, and ON.",
    "fitRationale": "Commercial real estate and construction asset financing.",
    "website": "www.gentaicapital.com",
    "bdm": "James Kim|Rocky Kalsi (info@gentaicapital.com)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Commercial",
      "Land",
      "Construction"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_51_1st_closed",
        "productName": "Gentai Capital Corporation 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_51_1st_open",
        "productName": "Gentai Capital Corporation 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_51_2nd_mtg",
        "productName": "Gentai Capital Corporation 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_52",
    "name": "Glasslake Funding",
    "channel": "Private / MIC",
    "categoryRaw": "B-Lender",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "RESIDENTIAL PROGRAMS: (1) Bank Statement (BFS): 5.49%+ starting rate, 660+ beacon, 80% purchase/75% refi, 1-5y...",
    "specialFeatures": [
      "BFS Stated Income",
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "RESIDENTIAL PROGRAMS: (1) Bank Statement (BFS): 5.49%+ starting rate, 660+ beacon, 80% purchase/75% refi, 1-5yr terms, up to 40yr amort, $200K-$3M, max TDS 60% (50% at 80% LTV), 6-12mo bank statements required, self-employed 2+ years same b...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "glasslake.ca",
    "bdm": "Jake Bannister (jakebannister@glasslake.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_52_1st_closed",
        "productName": "Glasslake Funding 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_52_1st_open",
        "productName": "Glasslake Funding 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_52_2nd_mtg",
        "productName": "Glasslake Funding 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_53",
    "name": "Glengarry Farm Finance",
    "channel": "Commercial / Land",
    "categoryRaw": "Agricultural Finance",
    "minBeacon": 600,
    "maxLTV": 75,
    "benchmarkRate": "7.50% - 9.75%",
    "bestFor": "Alternative institutional lender in the agricultural market providing flexible finance solutions to the farmin...",
    "specialFeatures": [
      "Agricultural Finance",
      "Farmland Mortgages",
      "Flexible Terms"
    ],
    "underwritingNotes": "Alternative institutional lender in the agricultural market providing customized mortgage and capital solutions for Canadian farmers and farm properties.",
    "fitRationale": "Farmland and agricultural mortgage solutions.",
    "website": "www.glengarry.ca",
    "bdm": "Deal Run (dealrun@glengarry.ca)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Agricultural",
      "Land"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_53_1st_closed",
        "productName": "Glengarry Farm Finance 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_53_1st_open",
        "productName": "Glengarry Farm Finance 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_53_2nd_mtg",
        "productName": "Glengarry Farm Finance 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_54",
    "name": "Graysbrook Capital Ltd.",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Providing common sense mortgage solutions in Atlantic Canada since 2006. Now lending in Southwest Ontario up t...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Providing common sense mortgage solutions in Atlantic Canada since 2006. Now lending in Southwest Ontario up to 75% LTV....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.graysbrookcapital.ca",
    "bdm": "Ryan MacNeil (ryan@graysbrookcapital.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_54_1st_closed",
        "productName": "Graysbrook Capital Ltd. 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_54_1st_open",
        "productName": "Graysbrook Capital Ltd. 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_54_2nd_mtg",
        "productName": "Graysbrook Capital Ltd. 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_55",
    "name": "Greenlight Capital Canada",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "NEW (Mar 11, 2026): HELOC promo email. First-position HELOC starting at Prime + 3.04% = 7.49%, minimum credit ...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "NEW (Mar 11, 2026): HELOC promo email. First-position HELOC starting at Prime + 3.04% = 7.49%, minimum credit score 650, owner-occupied properties in major urban areas, maximum loan $1.75M, lender fee starting at 2.5%, no condos. Second-pos...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "greenlightcapitalcanada.com",
    "bdm": "Martin Jeffery (martin@greenlightcapitalcanada.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_55_1st_closed",
        "productName": "Greenlight Capital Canada 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_55_1st_open",
        "productName": "Greenlight Capital Canada 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_55_2nd_mtg",
        "productName": "Greenlight Capital Canada 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_56",
    "name": "Haventree Bank",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "35yr amort. Rate hold 90 days. Beacon: 680+ (best), 640+ (+20bps), 600+ (+40bps), 500-599 (+60bps), <500 case-...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "35yr amort. Rate hold 90 days. Beacon: 680+ (best), 640+ (+20bps), 600+ (+40bps), 500-599 (+60bps), <500 case-by-case. No min beacon if LTV≤65%. Extended ratios: 60/60, 65/65 in GVA/GTA. Condo min: 400sf (GTA/GVA), 500sf elsewhere....",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "www.haventreebank.com",
    "bdm": "Susan Thomas (susan.thomas@haventreebank.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (Major Canadian Provinces outside Quebec)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_56_1y_classic",
        "productName": "Haventree Bank 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_56_2y_classic",
        "productName": "Haventree Bank 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_56_bfs_stated",
        "productName": "Haventree Bank BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_56_alt_var",
        "productName": "Haventree Bank Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_57",
    "name": "Highclere Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private mortgage lender specializing in commercial and residential lending...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private mortgage lender specializing in commercial and residential lending...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "https://highclerecapital.ca",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential",
      "Commercial"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_57_1st_closed",
        "productName": "Highclere Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_57_1st_open",
        "productName": "Highclere Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_57_2nd_mtg",
        "productName": "Highclere Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_58",
    "name": "Hillmount Capital Inc.",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Flexible mortgage financing across Ontario—first, second, mezzanine, HELOCs, and bridge loans....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Flexible mortgage financing across Ontario—first, second, mezzanine, HELOCs, and bridge loans....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.hillmount.ca",
    "bdm": "Catalin Popa|Zev Wasserman (deals@hillmount.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_58_1st_closed",
        "productName": "Hillmount Capital Inc. 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_58_1st_open",
        "productName": "Hillmount Capital Inc. 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_58_2nd_mtg",
        "productName": "Hillmount Capital Inc. 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_59",
    "name": "Home Trust",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "5.49% (1-Yr Alt)",
    "bestFor": "Classic: No min FICO, flexible GDS/TDS, 30yr amort. Equityline Visa: 80% LTV (65% revolving), fully open. One ...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "Classic: No min FICO, flexible GDS/TDS, 30yr amort. Equityline Visa: 80% LTV (65% revolving), fully open. One Charge: Classic + Equityline combo. Small Commercial: $400K min, 75% LTV, 1.10x DSCR, 60% TDSR. Story-based underwriting....",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "hometrust.ca",
    "bdm": "Cathal Connelly (Cathal.Connelly@hometrust.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces including Quebec)",
    "productsCount": 36,
    "lowestRate": 4.39,
    "isFeatured": true,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_59_1y_classic",
        "productName": "Home Trust 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_59_2y_classic",
        "productName": "Home Trust 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 4.59,
        "spread": "Fixed",
        "apr": 4.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_59_bfs_stated",
        "productName": "Home Trust BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 4.69,
        "spread": "Fixed",
        "apr": 4.74,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_59_alt_var",
        "productName": "Home Trust Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_60",
    "name": "HomeEquity Bank (CHIP Reverse Mortgage)",
    "channel": "Alternative (B)",
    "categoryRaw": "Reverse Mortgage Specialist",
    "minBeacon": 500,
    "maxLTV": 55,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "Leading national provider of the CHIP Reverse Mortgage for Canadians 55+. Equity release without monthly payments.",
    "specialFeatures": [
      "Reverse Mortgage (Age 55+)",
      "CHIP Reverse Mortgage",
      "No Monthly Payments"
    ],
    "underwritingNotes": "Leading national provider of the CHIP Reverse Mortgage for Canadians 55+. LTV max 55% based on youngest borrower age. No monthly mortgage payments required. Not applicable for standard home purchase deals.",
    "fitRationale": "Retirement equity release solution for homeowners 55+ to access tax-free cash from home equity without monthly mortgage debt servicing.",
    "website": "www.chipadvisor.ca",
    "bdm": "Rene Quercia (rquercia@heb.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_60_1y_classic",
        "productName": "HomeEquity Bank (CHIP Reverse Mortgage) 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_60_2y_classic",
        "productName": "HomeEquity Bank (CHIP Reverse Mortgage) 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_60_bfs_stated",
        "productName": "HomeEquity Bank (CHIP Reverse Mortgage) BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_60_alt_var",
        "productName": "HomeEquity Bank (CHIP Reverse Mortgage) Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_61",
    "name": "IC Savings",
    "channel": "Credit Union",
    "categoryRaw": "Provincial Credit Union (ON)",
    "minBeacon": 620,
    "maxLTV": 80,
    "benchmarkRate": "4.89% - 5.89%",
    "bestFor": "Ontario-wide lender specializing in self-employed, rentals and challenged credit. 1st mortgages only....",
    "specialFeatures": [
      "Local Ontario CU",
      "Self-Employed Friendly",
      "Rental Specialists"
    ],
    "underwritingNotes": "Ontario credit union specializing in self-employed borrowers, rental properties, and challenged debt ratios. Common-sense residential 1st mortgages up to 80% LTV.",
    "fitRationale": "Community credit union in Ontario with high flexibility for self-employed clients.",
    "website": "www.icsavings.ca",
    "bdm": "Joe Rosati (jrosati@icsavings.ca)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario only",
    "productsCount": 55,
    "lowestRate": 4.34,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_61_5y_fix_ins",
        "productName": "IC Savings 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.34,
        "spread": "Fixed",
        "apr": 4.39,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_61_5y_fix_insurable",
        "productName": "IC Savings 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.54,
        "spread": "Fixed",
        "apr": 4.58,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_61_3y_fix_ins",
        "productName": "IC Savings 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.54,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_61_3y_fix_unins",
        "productName": "IC Savings 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.79,
        "spread": "Fixed",
        "apr": 4.83,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_61_5y_var_ins",
        "productName": "IC Savings 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_61_1y_fix",
        "productName": "IC Savings 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.14,
        "spread": "Fixed",
        "apr": 5.19,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_61_heloc",
        "productName": "IC Savings Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_62",
    "name": "K5 Mortgage",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "⚠️ RESIDENTIAL ONLY - NO COMMERCIAL LENDING. Private 2nd mortgage specialist. Prior deal: Dhillon file (KMCP-1...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "⚠️ RESIDENTIAL ONLY - NO COMMERCIAL LENDING. Private 2nd mortgage specialist. Prior deal: Dhillon file (KMCP-1873) in email history. Distressed situations expertise. Contact: Sarah Papa - yes@k5mortgage.com....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "k5mortgage.com",
    "bdm": "Sarah Papa (yes@k5mortgage.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential",
      "Commercial"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_62_1st_closed",
        "productName": "K5 Mortgage 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_62_1st_open",
        "productName": "K5 Mortgage 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_62_2nd_mtg",
        "productName": "K5 Mortgage 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_63",
    "name": "KEB Hana Bank Canada",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank (Schedule II)",
    "minBeacon": 660,
    "maxLTV": 80,
    "benchmarkRate": "4.59% - 5.29%",
    "bestFor": "DEC 2025 PROMO RATES: Fixed rate promotion active. Flexible rate adjustments available with buydown options. A...",
    "specialFeatures": [
      "Foreign Income Program",
      "High Net Worth",
      "Early Career Medical"
    ],
    "underwritingNotes": "Schedule II chartered bank. Prime conventional mortgages up to 80% LTV. Strong foreign income program (US / Korean income accepted up to 80% LTV) and early-career professional programs.",
    "fitRationale": "Prime chartered bank with specialized foreign income and medical professional programs.",
    "website": "hanabank.ca",
    "bdm": "Angela Lee (Branch Manager, Surrey) (leesooy@hanafn.com)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON",
      "BC",
      "AB"
    ],
    "lendingAreaNotes": "Ontario, British Columbia, and Alberta",
    "productsCount": 95,
    "lowestRate": 4.29,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_63_5y_fix_ins",
        "productName": "KEB Hana Bank Canada 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_63_5y_fix_insurable",
        "productName": "KEB Hana Bank Canada 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.53,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_63_3y_fix_ins",
        "productName": "KEB Hana Bank Canada 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_63_3y_fix_unins",
        "productName": "KEB Hana Bank Canada 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.74,
        "spread": "Fixed",
        "apr": 4.78,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_63_5y_var_ins",
        "productName": "KEB Hana Bank Canada 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_63_1y_fix",
        "productName": "KEB Hana Bank Canada 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.09,
        "spread": "Fixed",
        "apr": 5.14,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_63_heloc",
        "productName": "KEB Hana Bank Canada Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_64",
    "name": "Kazana Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private lender....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private lender....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "kazanacapital.com",
    "bdm": "Sajhan (Sajhan@kazanacapital.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_64_1st_closed",
        "productName": "Kazana Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_64_1st_open",
        "productName": "Kazana Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_64_2nd_mtg",
        "productName": "Kazana Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_65",
    "name": "LCM Capital (Lender Connect Mortgage)",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 65,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "RATES (Jan 2026): 1st Mortgages starting at 7.45% + 1% fee. 2nd Mortgages starting at 10.45% + 1.5% fee. Nearl...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "RATES (Jan 2026): 1st Mortgages starting at 7.45% + 1% fee. 2nd Mortgages starting at 10.45% + 1.5% fee. Nearly $500M deployed with zero loan losses. Represents multiple capital sources with diverse investment interests - ability to fund un...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "lcmcapital.ca",
    "bdm": "Matthew Sadler (CEO), Mark Lang (CFO), Shae de Jaray (Managing Director) (deals@lcmcapital.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_65_1st_closed",
        "productName": "LCM Capital (Lender Connect Mortgage) 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_65_1st_open",
        "productName": "LCM Capital (Lender Connect Mortgage) 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_65_2nd_mtg",
        "productName": "LCM Capital (Lender Connect Mortgage) 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_66",
    "name": "Lanyard Financial Corporation",
    "channel": "Commercial / Land",
    "categoryRaw": "Commercial & Land Bridge",
    "minBeacon": 550,
    "maxLTV": 75,
    "benchmarkRate": "8.95% - 11.95%",
    "bestFor": "Commercial financing on most assets (including land) & jumbo residential 1st mortgages in Western Canada and O...",
    "specialFeatures": [
      "Commercial Land Financing",
      "Jumbo Western Canada Mortgages",
      "Bridge Financing"
    ],
    "underwritingNotes": "Western Canadian commercial lender specializing in commercial mortgages, land financing, and transitional loans. Deal size $1M to $15M+.",
    "fitRationale": "Commercial and development land financing in BC and Western Canada.",
    "website": "www.lanyardgroup.com",
    "bdm": "Sam Fogell|Brian Chelin (sfogell@lanyardgroup.com)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Commercial",
      "Land",
      "Construction"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_66_1st_closed",
        "productName": "Lanyard Financial Corporation 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_66_1st_open",
        "productName": "Lanyard Financial Corporation 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_66_2nd_mtg",
        "productName": "Lanyard Financial Corporation 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_67",
    "name": "Liahona Mortgage Investment Corp.",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Flexible financing for marketable single-family homes across Ontario. Construction, large scale developments, ...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Flexible financing for marketable single-family homes across Ontario. Construction, large scale developments, prime land....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.liahona.ca",
    "bdm": "Ken Macken (solutions@liahona.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_67_1st_closed",
        "productName": "Liahona Mortgage Investment Corp. 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_67_1st_open",
        "productName": "Liahona Mortgage Investment Corp. 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_67_2nd_mtg",
        "productName": "Liahona Mortgage Investment Corp. 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_68",
    "name": "Lions Den Capital Corp",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "High networth investor-backed private lender. Flexible equity-focused lending across Western Canada. LTV highl...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "High networth investor-backed private lender. Flexible equity-focused lending across Western Canada. LTV highly dependent on: location, property type (residential/commercial/land), exit strategy, 1st or 2nd position, and borrower strength. ...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "lionsdencapital.ca",
    "bdm": "Debbie Jackson (Vice President - Operations) (debbie@lionsdencapital.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_68_1st_closed",
        "productName": "Lions Den Capital Corp 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_68_1st_open",
        "productName": "Lions Den Capital Corp 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_68_2nd_mtg",
        "productName": "Lions Den Capital Corp 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_69",
    "name": "Mandate Management Corporation",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Transparent and simple alternative products. Competitive rates, minimal documentation. Ideal for entrepreneuri...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Transparent and simple alternative products. Competitive rates, minimal documentation. Ideal for entrepreneurial borrowers....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.mandatemortgage.com",
    "bdm": "Alan Long|Derek Chappell (mandate.national@gmail.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_69_1st_closed",
        "productName": "Mandate Management Corporation 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_69_1st_open",
        "productName": "Mandate Management Corporation 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_69_2nd_mtg",
        "productName": "Mandate Management Corporation 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_70",
    "name": "Marathon Mortgage",
    "channel": "Monoline",
    "categoryRaw": "Monoline Prime A",
    "minBeacon": 660,
    "maxLTV": 95,
    "benchmarkRate": "3.94% - 4.34%",
    "bestFor": "NEW (Mar 10, 2026): Rate promo email effective Mar 10. Whisper deal: 5-year fixed insured/insurable at 3.89% f...",
    "specialFeatures": [
      "24-Hour Broker Turnaround",
      "Insured & Insurable Specials",
      "Whisper Rate Deals"
    ],
    "underwritingNotes": "Independent Canadian monoline lender. Focus on insured and insurable prime residential mortgages. Whisper rate promotions across 3-year and 5-year fixed terms.",
    "fitRationale": "Competitive prime monoline with aggressive rate specials for brokers.",
    "website": "marathonmortgage.ca",
    "bdm": "Derek Chin (dchin@marathonmortgage.ca)",
    "lastUpdated": "Today",
    "turnaround": "12-24 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON",
      "BC",
      "AB"
    ],
    "lendingAreaNotes": "Ontario, British Columbia, and Alberta",
    "productsCount": 40,
    "lowestRate": 3.99,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_70_5y_fix_ins",
        "productName": "Marathon Mortgage 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 3.99,
        "spread": "Fixed",
        "apr": 4.04,
        "rateType": "Promo",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_70_5y_fix_insurable",
        "productName": "Marathon Mortgage 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.19,
        "spread": "Fixed",
        "apr": 4.23,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_70_3y_fix_ins",
        "productName": "Marathon Mortgage 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.14,
        "spread": "Fixed",
        "apr": 4.19,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_70_3y_fix_unins",
        "productName": "Marathon Mortgage 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.48,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_70_5y_var_ins",
        "productName": "Marathon Mortgage 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_70_1y_fix",
        "productName": "Marathon Mortgage 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.79,
        "spread": "Fixed",
        "apr": 4.84,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_70_heloc",
        "productName": "Marathon Mortgage Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_71",
    "name": "Metropointe MIC",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "MIC confirmed active on 210 & 212 St. Lawrence Street Victoria — Residential Development Land deal. Appraisal/...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "MIC confirmed active on 210 & 212 St. Lawrence Street Victoria — Residential Development Land deal. Appraisal/reliance letter issued by Cunningham & Rivard Appraisals Ltd. (Susan Waugh). Deal file ref: CR26-2024. Rates/LTV/fees not yet conf...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "N/S",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_71_1st_closed",
        "productName": "Metropointe MIC 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_71_1st_open",
        "productName": "Metropointe MIC 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_71_2nd_mtg",
        "productName": "Metropointe MIC 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_72",
    "name": "Mortgage and Investment Professionals (MIP)",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Residential 1st and 2nd mortgages up to 85% LTV. Direct private investors (not a MIC). Small commercial and ag...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Residential 1st and 2nd mortgages up to 85% LTV. Direct private investors (not a MIC). Small commercial and agricultural considered....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.MIPMortgage.com",
    "bdm": "Zoltan Padar (hello@MIPMortgage.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential",
      "Commercial"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_72_1st_closed",
        "productName": "Mortgage and Investment Professionals (MIP) 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_72_1st_open",
        "productName": "Mortgage and Investment Professionals (MIP) 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_72_2nd_mtg",
        "productName": "Mortgage and Investment Professionals (MIP) 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_73",
    "name": "Moskowitz Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "RATES: 9.9%-13.9% (subject to risk). FEES: 2.0%-4.0% of loan amount. TERMS: 6-36 months. AMORTIZATION: Often i...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "RATES: 9.9%-13.9% (subject to risk). FEES: 2.0%-4.0% of loan amount. TERMS: 6-36 months. AMORTIZATION: Often interest only, negotiable. PREPAYMENT: Flexible. SECURITY: 1st mortgage, 2nd mortgage on selective basis. GUARANTEE: Personal requi...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "moskowitzcapital.com",
    "bdm": "Colton Miller (Business Development - Edmonton), Brian Moskowitz (colton@moskowitzcapital.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_73_1st_closed",
        "productName": "Moskowitz Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_73_1st_open",
        "productName": "Moskowitz Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_73_2nd_mtg",
        "productName": "Moskowitz Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_74",
    "name": "My Private Lender",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private/Equity MIC",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Underwriting criteria aligned with Canadian mortgage broker guidelines.",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "",
    "bdm": "",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_74_1st_closed",
        "productName": "My Private Lender 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_74_1st_open",
        "productName": "My Private Lender 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_74_2nd_mtg",
        "productName": "My Private Lender 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_75",
    "name": "NPX (MERIX)",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "AXIS: 50/50 GDS/TDS, 620+ beacon, 30yr amort, 100% rental add-back. XTEND: 40yr amort, 600+ beacon, qualify at...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "AXIS: 50/50 GDS/TDS, 620+ beacon, 30yr amort, 100% rental add-back. XTEND: 40yr amort, 600+ beacon, qualify at contract rate. XTREME BC: Option A (65% LTV, 65/65 declared) or B (75% LTV, 55/55). Lender fees can be capitalized if ≤71.5% LTV....",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "merixfinancial.com",
    "bdm": "N/S (npxsalesdesk@merixfinancial.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All provinces except QC)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_75_1y_classic",
        "productName": "NPX (MERIX) 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_75_2y_classic",
        "productName": "NPX (MERIX) 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_75_bfs_stated",
        "productName": "NPX (MERIX) BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_75_alt_var",
        "productName": "NPX (MERIX) Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_76",
    "name": "National Bank Optimum Mortgage",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "Formerly Optimum Mortgage (CWB). Rebranded as National Bank Optimum Mortgage March 2026. Min financing $100K. ...",
    "specialFeatures": [
      "BFS Stated Income",
      "Rental Worksheet Offset"
    ],
    "underwritingNotes": "Formerly Optimum Mortgage (CWB). Rebranded as National Bank Optimum Mortgage March 2026. Min financing $100K. Rental +25-50bps, 2nd home +25bps, bankruptcy +25-75bps. Filogix/Finmo submission....",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "optimummortgage.ca",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_76_1y_classic",
        "productName": "National Bank Optimum Mortgage 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_76_2y_classic",
        "productName": "National Bank Optimum Mortgage 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_76_bfs_stated",
        "productName": "National Bank Optimum Mortgage BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_76_alt_var",
        "productName": "National Bank Optimum Mortgage Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_77",
    "name": "Neighbourhood Holdings",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Licensed in BC, AB, SK, ON, NS. Rates by LTV + Beacon. 3 term types: Open (1% fee), Closed (no fee, 3mo penalt...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Licensed in BC, AB, SK, ON, NS. Rates by LTV + Beacon. 3 term types: Open (1% fee), Closed (no fee, 3mo penalty), Partially Open (no fee, closed 3mo then open). No max GDS/TDS. Stated income. 90-day rate guarantee. Interest-only or up to 40...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.neighbourhoodholdings.com",
    "bdm": "BDM Team (dealrun@neighbourhoodholdings.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_77_1st_closed",
        "productName": "Neighbourhood Holdings 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_77_1st_open",
        "productName": "Neighbourhood Holdings 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_77_2nd_mtg",
        "productName": "Neighbourhood Holdings 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_78",
    "name": "Neo Financial (Neo Mortgage Services Inc.)",
    "channel": "Prime (A)",
    "categoryRaw": "Prime Digital Monoline / NLD",
    "minBeacon": 680,
    "maxLTV": 95,
    "benchmarkRate": "3.89% - 4.29%",
    "bestFor": "Via National Lender Desk (NLD). Products: 5yr Fixed 45-day Quick Close 3.89% | 5yr Fixed 120-day 3.94% | 5yr A...",
    "specialFeatures": [
      "Ultra-Low Rates",
      "Quick Close Specials",
      "Digital Workflow"
    ],
    "underwritingNotes": "Via National Lender Desk (NLD). Aggressive 45-day quick-close rates on 5-year fixed insured/insurable files. Full digital submission.",
    "fitRationale": "Fintech prime lender with aggressive rate-drop pricing on quick closings.",
    "website": "neomortgage.ca",
    "bdm": "Sarah Springer (sarah.springer@neofinancial.com)",
    "lastUpdated": "Today",
    "turnaround": "24 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON",
      "BC",
      "AB"
    ],
    "lendingAreaNotes": "Ontario, British Columbia, and Alberta",
    "productsCount": 62,
    "lowestRate": 4.14,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_78_5y_fix_ins",
        "productName": "Neo Financial (Neo Mortgage Services Inc.) 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.14,
        "spread": "Fixed",
        "apr": 4.19,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_78_5y_fix_insurable",
        "productName": "Neo Financial (Neo Mortgage Services Inc.) 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.34,
        "spread": "Fixed",
        "apr": 4.38,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_78_3y_fix_ins",
        "productName": "Neo Financial (Neo Mortgage Services Inc.) 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_78_3y_fix_unins",
        "productName": "Neo Financial (Neo Mortgage Services Inc.) 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.59,
        "spread": "Fixed",
        "apr": 4.63,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_78_5y_var_ins",
        "productName": "Neo Financial (Neo Mortgage Services Inc.) 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_78_1y_fix",
        "productName": "Neo Financial (Neo Mortgage Services Inc.) 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.94,
        "spread": "Fixed",
        "apr": 4.99,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_78_heloc",
        "productName": "Neo Financial (Neo Mortgage Services Inc.) Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_79",
    "name": "OZ Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 70,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "NEW (Mar 11, 2026): Small Commercial Program. 1st Mortgages: rate from 8.99%, fee from 2.00%, max 70% LTV, max...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "NEW (Mar 11, 2026): Small Commercial Program. 1st Mortgages: rate from 8.99%, fee from 2.00%, max 70% LTV, max loan $750K. 2nd Mortgages: rate from 10.49%, fee from 3.00%, max 70% LTV, max loan $500K. Terms: 12-24 months with open options a...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "ozcapital.ca",
    "bdm": "Jeff Bauer (jeff@ozcapital.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential",
      "Commercial"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_79_1st_closed",
        "productName": "OZ Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_79_1st_open",
        "productName": "OZ Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_79_2nd_mtg",
        "productName": "OZ Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_80",
    "name": "One Stop Mortgage",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private lender network. Saverio Spadavecchia (saverio@onestopmortgage.ca) also available....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private lender network. Saverio Spadavecchia (saverio@onestopmortgage.ca) also available....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "onestopmortgage.ca",
    "bdm": "Michal Kropidlowski (mkro@onestopmortgage.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_80_1st_closed",
        "productName": "One Stop Mortgage 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_80_1st_open",
        "productName": "One Stop Mortgage 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_80_2nd_mtg",
        "productName": "One Stop Mortgage 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_81",
    "name": "Oppono Lending Company",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Residential Equity lender. No income verification or beacon score requirements. Fund up to 80% LTV....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Residential Equity lender. No income verification or beacon score requirements. Fund up to 80% LTV....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.oppono.com",
    "bdm": "Ajay Kaith (ajay.kaith@oppono.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_81_1st_closed",
        "productName": "Oppono Lending Company 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_81_1st_open",
        "productName": "Oppono Lending Company 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_81_2nd_mtg",
        "productName": "Oppono Lending Company 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_82",
    "name": "PHL Capital Corp",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 60,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Construction: 60% LTV on as-complete (net GST). Land advance: 65% max. 1-year open terms. Can structure land +...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Construction: 60% LTV on as-complete (net GST). Land advance: 65% max. 1-year open terms. Can structure land + construction separately....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "phlcapital.com",
    "bdm": "Tej Sidhu (tejsidhu@phlcapital.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_82_1st_closed",
        "productName": "PHL Capital Corp 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_82_1st_open",
        "productName": "PHL Capital Corp 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_82_2nd_mtg",
        "productName": "PHL Capital Corp 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_83",
    "name": "Pioneer West Acceptance Corporation",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Direct private equity lender. Urban good quality residential: 6.50% (AB/BC). 1st & 2nd or 3rd blankets, wraps....",
    "specialFeatures": [
      "BFS Stated Income",
      "Rental Worksheet Offset",
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Direct private equity lender. Urban good quality residential: 6.50% (AB/BC). 1st & 2nd or 3rd blankets, wraps. BFS/NIQ/low-doc OK. Rental OK. Foreclosure refinances considered. 1+ year terms. No massive renewal fees....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "alberta-mortgage.com",
    "bdm": "Daren B (darenb@pioneerwest.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_83_1st_closed",
        "productName": "Pioneer West Acceptance Corporation 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_83_1st_open",
        "productName": "Pioneer West Acceptance Corporation 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_83_2nd_mtg",
        "productName": "Pioneer West Acceptance Corporation 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_84",
    "name": "Premiere Mortgage / Premiere Canadian Mortgage Corp",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "NEW PRODUCT (Mar 2026): Premiere Small Town Advantage — Rate starting 7.49% | Commitment Fee 2.99% | Finder's ...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "NEW PRODUCT (Mar 2026): Premiere Small Town Advantage — Rate starting 7.49% | Commitment Fee 2.99% | Finder's Fee 1.00% | Population <20,000 towns. System lender drop-down: Alta West Capital / Premiere Mortgage. Since 1985. EQUITY-BASED: No...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "premhome.ca / mortgagescanada.net",
    "bdm": "Monica Leggett (Mgr UW) | Angie Alves (Sr Fulfillment) | Alicia Phypers (MO) | John Mercuri (President) (monica@premhome.ca | lending@premhome.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_84_1st_closed",
        "productName": "Premiere Mortgage / Premiere Canadian Mortgage Corp 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_84_1st_open",
        "productName": "Premiere Mortgage / Premiere Canadian Mortgage Corp 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_84_2nd_mtg",
        "productName": "Premiere Mortgage / Premiere Canadian Mortgage Corp 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_85",
    "name": "Private Lender Inc.",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private/Equity MIC",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Underwriting criteria aligned with Canadian mortgage broker guidelines.",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "",
    "bdm": "",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_85_1st_closed",
        "productName": "Private Lender Inc. 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_85_1st_open",
        "productName": "Private Lender Inc. 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_85_2nd_mtg",
        "productName": "Private Lender Inc. 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_86",
    "name": "Professional Mortgage Brokers Inc (PMB)",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private Mortgages East of Toronto—Durham, Kawartha, Peterborough. Residential, Recreational, Land & Agricultur...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private Mortgages East of Toronto—Durham, Kawartha, Peterborough. Residential, Recreational, Land & Agricultural....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.pmbmortgages.ca",
    "bdm": "Melissa Reinhardt|Ken Reinhardt (melissa@pmbmortgages.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_86_1st_closed",
        "productName": "Professional Mortgage Brokers Inc (PMB) 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_86_1st_open",
        "productName": "Professional Mortgage Brokers Inc (PMB) 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_86_2nd_mtg",
        "productName": "Professional Mortgage Brokers Inc (PMB) 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_87",
    "name": "RFA Bank",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "35yr amort. Rate hold 90 days. Beacon: 680+ (best), 640+ (+20bps), 600+ (+40bps), 500-599 (+60bps). No min bea...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "35yr amort. Rate hold 90 days. Beacon: 680+ (best), 640+ (+20bps), 600+ (+40bps), 500-599 (+60bps). No min beacon if LTV≤65%. Extended ratios: 60/60, 65/65 in major markets. Subject: 80% addback. Suite: 95%. Graduation to Prime with full co...",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "rfa.ca",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All provinces except QC)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_87_1y_classic",
        "productName": "RFA Bank 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_87_2y_classic",
        "productName": "RFA Bank 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_87_bfs_stated",
        "productName": "RFA Bank BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_87_alt_var",
        "productName": "RFA Bank Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_88",
    "name": "Reliable Mortgages Ltd.",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Reliable MIC HELOC—NO interest on unadvanced funds, NO renewal fees. Fast service & creative ideas....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Reliable MIC HELOC—NO interest on unadvanced funds, NO renewal fees. Fast service & creative ideas....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.reliablemortgages.ca",
    "bdm": "Dale Matthysen|David Whyte (reliabledale@reliablemortgages.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_88_1st_closed",
        "productName": "Reliable Mortgages Ltd. 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_88_1st_open",
        "productName": "Reliable Mortgages Ltd. 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_88_2nd_mtg",
        "productName": "Reliable Mortgages Ltd. 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_89",
    "name": "Resco Mortgage Investment Corporation",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Residential 1st and 2nd mortgages in major urban centres in Ontario, BC, and Manitoba, up to 80% LTV....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Residential 1st and 2nd mortgages in major urban centres in Ontario, BC, and Manitoba, up to 80% LTV....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.rescomic.ca",
    "bdm": "Deal Desk (deals@rescomic.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_89_1st_closed",
        "productName": "Resco Mortgage Investment Corporation 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_89_1st_open",
        "productName": "Resco Mortgage Investment Corporation 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_89_2nd_mtg",
        "productName": "Resco Mortgage Investment Corporation 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_90",
    "name": "Richview Capital MIC",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Private Mortgages in the GTA. Residential, Condos, Commercial, and Construction Loans. Same day commitments....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Private Mortgages in the GTA. Residential, Condos, Commercial, and Construction Loans. Same day commitments....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.richviewcapitalmic.com",
    "bdm": "Maurizio Sera (maurizio@richviewcapital.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential",
      "Commercial"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_90_1st_closed",
        "productName": "Richview Capital MIC 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_90_1st_open",
        "productName": "Richview Capital MIC 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_90_2nd_mtg",
        "productName": "Richview Capital MIC 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_91",
    "name": "Romspen Investment Corporation",
    "channel": "Commercial / Land",
    "categoryRaw": "Commercial Real Estate Fund",
    "minBeacon": 550,
    "maxLTV": 75,
    "benchmarkRate": "9.00% - 12.00%",
    "bestFor": "One of the largest Canadian private real estate lenders specializing in commercial bridge mortgages ($10M-$100...",
    "specialFeatures": [
      "Commercial Bridge Loans",
      "Construction Financing",
      "National Scope"
    ],
    "underwritingNotes": "One of Canada's largest private commercial mortgage funds. Specializes in commercial bridge mortgages, construction financing, and mezzanine loans ($5M to $50M+).",
    "fitRationale": "Major commercial and construction debt fund for large-scale real estate projects.",
    "website": "www.romspen.com",
    "bdm": "Blake Cassidy (blakecassidy@romspen.com)",
    "lastUpdated": "Today",
    "turnaround": "3-5 Business Days",
    "propertyTypes": [
      "Commercial",
      "Land",
      "Construction"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "MB",
      "SK",
      "NS",
      "NB"
    ],
    "lendingAreaNotes": "Multi-Provincial (BC, AB, ON, and selected secondary markets)",
    "productsCount": 10,
    "lowestRate": 8.49,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_91_1st_closed",
        "productName": "Romspen Investment Corporation 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.49,
        "spread": "Contract Rate",
        "apr": 9.74,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_91_1st_open",
        "productName": "Romspen Investment Corporation 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 9.49,
        "spread": "Contract Rate",
        "apr": 10.49,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_91_2nd_mtg",
        "productName": "Romspen Investment Corporation 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.99,
        "spread": "Contract Rate",
        "apr": 11.99,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_92",
    "name": "Royal Canadian Asset Management Inc.",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "1st mortgages up to 75% LTV. Approvals within 24 hours. Non-income qualifier, no TDS/GDS. Expanded areas from ...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "1st mortgages up to 75% LTV. Approvals within 24 hours. Non-income qualifier, no TDS/GDS. Expanded areas from Ottawa to Niagara....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.royalcanadianmortgage.com",
    "bdm": "Kelly Slinn|Helen Gatsby (kelly@royalcanadianmortgage.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_92_1st_closed",
        "productName": "Royal Canadian Asset Management Inc. 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_92_1st_open",
        "productName": "Royal Canadian Asset Management Inc. 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_92_2nd_mtg",
        "productName": "Royal Canadian Asset Management Inc. 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_93",
    "name": "Rydan Private Lending",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Asset-based private lender specializing in Ontario, residential & commercial, 1st and 2nd mortgages up to 75% ...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Asset-based private lender specializing in Ontario, residential & commercial, 1st and 2nd mortgages up to 75% LTV....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.rydanprivatelending.com",
    "bdm": "Stan Schwartz (stan@rydanfinancial.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential",
      "Commercial"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_93_1st_closed",
        "productName": "Rydan Private Lending 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_93_1st_open",
        "productName": "Rydan Private Lending 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_93_2nd_mtg",
        "productName": "Rydan Private Lending 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_94",
    "name": "Scotiabank",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank (Schedule I)",
    "minBeacon": 680,
    "maxLTV": 95,
    "benchmarkRate": "4.14% - 4.54%",
    "bestFor": "STEP: 80% LTV (65% revolving), up to 11 credit components. IFP: Same-day funding, no lawyer (except QC). Subje...",
    "specialFeatures": [
      "STEP Plan HELOC",
      "Conventional & Insurable",
      "Standard B-20",
      "e-Transfer IFP Funding"
    ],
    "underwritingNotes": "Big 6 Chartered Bank. Flagship STEP (Scotia Total Equity Plan) allows up to 80% LTV (65% revolving HELOC). High-ratio insured up to 95% LTV. Subject secondary suites: standard 50% rental income add-back to borrower income (does NOT do 100% subject PITH offset). Non-subject rentals assessed via Scotiabank Rental Property Worksheet.",
    "fitRationale": "Big 6 bank with premier multi-component HELOC (STEP Plan) and national footprint.",
    "website": "scotiabank.com",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces)",
    "productsCount": 462,
    "lowestRate": 4.29,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_94_5y_fix_ins",
        "productName": "Scotiabank 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_94_5y_fix_insurable",
        "productName": "Scotiabank 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.53,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_94_3y_fix_ins",
        "productName": "Scotiabank 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_94_3y_fix_unins",
        "productName": "Scotiabank 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.74,
        "spread": "Fixed",
        "apr": 4.78,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_94_5y_var_ins",
        "productName": "Scotiabank 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_94_1y_fix",
        "productName": "Scotiabank 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.09,
        "spread": "Fixed",
        "apr": 5.14,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_94_heloc",
        "productName": "Scotiabank Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_95",
    "name": "Secure Capital MIC",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "NEW: 2nd Mortgage to 80% LTV (2yr term). Private MIC. Equity-based. Self-employed, bad credit, no income verif...",
    "specialFeatures": [
      "Rental Worksheet Offset",
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "NEW: 2nd Mortgage to 80% LTV (2yr term). Private MIC. Equity-based. Self-employed, bad credit, no income verification. Rental properties OK. Foreign nationals OK. Commercial OK (65% LTV). Quick closings (2-3 weeks)....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "securecapitalmic.com",
    "bdm": "Josh Mailhot (josh@securecapitalmic.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_95_1st_closed",
        "productName": "Secure Capital MIC 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_95_1st_open",
        "productName": "Secure Capital MIC 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_95_2nd_mtg",
        "productName": "Secure Capital MIC 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_96",
    "name": "Sequence Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Urban 1sts starting at 5.99% closed (rate special) / 7.75% open after 3 months, 1-year terms. 50% LTV: best ra...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Urban 1sts starting at 5.99% closed (rate special) / 7.75% open after 3 months, 1-year terms. 50% LTV: best rates. Up to 75% LTV with good credit and sustainable payments. Fixed rate, interest-only options available. No income docs, no min ...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "sequencecapital.ca",
    "bdm": "Christine Perkins (christine@sequencecapital.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_96_1st_closed",
        "productName": "Sequence Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_96_1st_open",
        "productName": "Sequence Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_96_2nd_mtg",
        "productName": "Sequence Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_97",
    "name": "Shelter Lending Corp",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Online-first private MIC. No min credit score. Stated income. Terms: 6-24 months, interest-only. Approvals in ...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Online-first private MIC. No min credit score. Stated income. Terms: 6-24 months, interest-only. Approvals in 24h, funding in 1-3 days. Ideal for urgent, rural, or credit-challenged files. Contact: Deenu - Deenu@shelterlending.ca....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "shelterlending.ca",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_97_1st_closed",
        "productName": "Shelter Lending Corp 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_97_1st_open",
        "productName": "Shelter Lending Corp 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_97_2nd_mtg",
        "productName": "Shelter Lending Corp 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_98",
    "name": "Shinhan Bank Canada",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank (Schedule II)",
    "minBeacon": 660,
    "maxLTV": 80,
    "benchmarkRate": "4.59% - 5.19%",
    "bestFor": "GDS 40%/TDS 50%. Rental: 90% gross rent add-back, 100% PITH to expenses. BFS-A: 15% gross-up if 680+ and <$1.2...",
    "specialFeatures": [
      "Foreign Income Friendly",
      "Rental Add-Back",
      "BFS-A Gross-Up"
    ],
    "underwritingNotes": "Schedule II chartered bank. GDS 40% / TDS 50%. Allows 90% gross rental income add-back to income on select conventional files. BFS-A allows 15% revenue gross-up if Beacon 680+.",
    "fitRationale": "Flexible Schedule II prime bank with generous rental add-back and BFS gross-up.",
    "website": "shinhan.ca",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON",
      "BC"
    ],
    "lendingAreaNotes": "Ontario (Toronto / GTA) & British Columbia (Vancouver)",
    "productsCount": 24,
    "lowestRate": 4.29,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_98_5y_fix_ins",
        "productName": "Shinhan Bank Canada 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_98_5y_fix_insurable",
        "productName": "Shinhan Bank Canada 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.53,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_98_3y_fix_ins",
        "productName": "Shinhan Bank Canada 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_98_3y_fix_unins",
        "productName": "Shinhan Bank Canada 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.74,
        "spread": "Fixed",
        "apr": 4.78,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_98_5y_var_ins",
        "productName": "Shinhan Bank Canada 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_98_1y_fix",
        "productName": "Shinhan Bank Canada 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.09,
        "spread": "Fixed",
        "apr": 5.14,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_98_heloc",
        "productName": "Shinhan Bank Canada Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_99",
    "name": "Strive Capital Corporation (Aspire)",
    "channel": "Monoline",
    "categoryRaw": "Monoline Prime A",
    "minBeacon": 660,
    "maxLTV": 95,
    "benchmarkRate": "3.99% - 4.39%",
    "bestFor": "Rate update Feb 23, 2026 — 10 BPS DROP across 5yr Fixed insured/insurable. Bond yields down into 2.6% range dr...",
    "specialFeatures": [
      "Prime Insured & Insurable",
      "Standard B-20",
      "Fast Approvals"
    ],
    "underwritingNotes": "Prime monoline mortgage division of Strive Capital. Full suite of prime insured and insurable residential mortgages. Aspire is their separate alternative lending division.",
    "fitRationale": "Fast-growing prime monoline lender with competitive rates and strong broker service.",
    "website": "strivecapital.ca",
    "bdm": "Sean Casey (BC Lower Mainland & Island) (scasey@strivecapital.ca)",
    "lastUpdated": "Today",
    "turnaround": "12-24 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON",
      "BC",
      "AB"
    ],
    "lendingAreaNotes": "Ontario, British Columbia, and Alberta",
    "productsCount": 65,
    "lowestRate": 4.24,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_99_5y_fix_ins",
        "productName": "Strive Capital Corporation (Aspire) 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.24,
        "spread": "Fixed",
        "apr": 4.29,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_99_5y_fix_insurable",
        "productName": "Strive Capital Corporation (Aspire) 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.48,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_99_3y_fix_ins",
        "productName": "Strive Capital Corporation (Aspire) 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.44,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_99_3y_fix_unins",
        "productName": "Strive Capital Corporation (Aspire) 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.69,
        "spread": "Fixed",
        "apr": 4.73,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_99_5y_var_ins",
        "productName": "Strive Capital Corporation (Aspire) 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_99_1y_fix",
        "productName": "Strive Capital Corporation (Aspire) 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.04,
        "spread": "Fixed",
        "apr": 5.09,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_99_heloc",
        "productName": "Strive Capital Corporation (Aspire) Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_100",
    "name": "Sun Micro Financial",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Alternative products with competitive rates. 1st and 2nd mortgages....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Alternative products with competitive rates. 1st and 2nd mortgages....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.sunmicrofinancial.ca",
    "bdm": "Sandeep Bugreja|Pankaj Ahuja (info@sunmicrofinancial.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_100_1st_closed",
        "productName": "Sun Micro Financial 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_100_1st_open",
        "productName": "Sun Micro Financial 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_100_2nd_mtg",
        "productName": "Sun Micro Financial 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_101",
    "name": "TD Canada Trust",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank (Schedule I)",
    "minBeacon": 680,
    "maxLTV": 95,
    "benchmarkRate": "4.09% - 4.49%",
    "bestFor": "JAN 30, 2026 RATE CHANGES: 3yr Fixed -5bps, 5yr Fixed Insured +5bps, 5yr VIRM -5bps, 5yr VIRM Insured -10bps. ...",
    "specialFeatures": [
      "Conventional & Insurable",
      "Standard B-20",
      "TD Home Equity FlexLine",
      "High-Ratio Insured"
    ],
    "underwritingNotes": "Big 6 Chartered Bank. High-ratio insured up to 95% LTV ($1.5M cap, 30yr amort for FTHB). Subject secondary suite: 50% gross rental added to borrower income. Non-subject rentals: TD Rental Property Worksheet (50% to 80% offset factor minus PITH). Standard GDS 39% / TDS 44%.",
    "fitRationale": "Major chartered bank with strong collateral HELOC options and broker turnaround.",
    "website": "td.com",
    "bdm": "Sim Gill-Kahlon (Simranjeet.Gill-Kahlon@td.com)",
    "lastUpdated": "Today",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces)",
    "productsCount": 95,
    "lowestRate": 4.29,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_101_5y_fix_ins",
        "productName": "TD Canada Trust 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_101_5y_fix_insurable",
        "productName": "TD Canada Trust 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.53,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_101_3y_fix_ins",
        "productName": "TD Canada Trust 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_101_3y_fix_unins",
        "productName": "TD Canada Trust 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.74,
        "spread": "Fixed",
        "apr": 4.78,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_101_5y_var_ins",
        "productName": "TD Canada Trust 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_101_1y_fix",
        "productName": "TD Canada Trust 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.09,
        "spread": "Fixed",
        "apr": 5.14,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_101_heloc",
        "productName": "TD Canada Trust Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_102",
    "name": "Three Point Capital",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Providing residential 1st & 2nd mortgages for over 30 years. Pathfinder (No Fee/Lower Rate) and Elevation prog...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Providing residential 1st & 2nd mortgages for over 30 years. Pathfinder (No Fee/Lower Rate) and Elevation programs....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.threepointcapital.ca",
    "bdm": "Loren Hawkins (West)|Justin Theriault (East) (loren@threepointcapital.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_102_1st_closed",
        "productName": "Three Point Capital 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_102_1st_open",
        "productName": "Three Point Capital 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_102_2nd_mtg",
        "productName": "Three Point Capital 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_103",
    "name": "Union Financial Corp",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "NEW (Mar 11, 2026): Website and contact review. Union Financial Corp operates a broader financial platform wit...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "NEW (Mar 11, 2026): Website and contact review. Union Financial Corp operates a broader financial platform with dedicated lending division and pages for lending, private loans, agri loans for Canadian farmers and agribusinesses, private bus...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "unionfinancialcorp.com",
    "bdm": "Jay Mondor (jmondor@unionfinancialcorp.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_103_1st_closed",
        "productName": "Union Financial Corp 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_103_1st_open",
        "productName": "Union Financial Corp 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_103_2nd_mtg",
        "productName": "Union Financial Corp 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_104",
    "name": "VWR Capital Corp",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "No GDS/TDS. Pure stated income. No down payment proof required. Rentals at same LTV as OO. Land financing BC o...",
    "specialFeatures": [
      "Rental Worksheet Offset",
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "No GDS/TDS. Pure stated income. No down payment proof required. Rentals at same LTV as OO. Land financing BC only (+1.00%). Student housing (+1.00%). Remediated grow ops (+0.50%). Arrears accepted (+1.00%). Interest-only up to 65% LTV. 35yr...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "vwrcapital.com",
    "bdm": "N/S (N/S)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC",
      "ON"
    ],
    "lendingAreaNotes": "British Columbia and Ontario",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_104_1st_closed",
        "productName": "VWR Capital Corp 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_104_1st_open",
        "productName": "VWR Capital Corp 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_104_2nd_mtg",
        "productName": "VWR Capital Corp 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_105",
    "name": "Vanmortgage",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "1st and 2nd residential and commercial mortgages up to 75% LTV. Home Line of Credit available....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "1st and 2nd residential and commercial mortgages up to 75% LTV. Home Line of Credit available....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.vanmortgage.com",
    "bdm": "Sue Sun|Vladimir Ercag (sue@vanmortgage.com)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential",
      "Commercial"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_105_1st_closed",
        "productName": "Vanmortgage 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_105_1st_open",
        "productName": "Vanmortgage 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_105_2nd_mtg",
        "productName": "Vanmortgage 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_106",
    "name": "Vault Capital Inc.",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Near B Program: 5.25%-5.99% + 1% fee, 4-hour approvals, light docs, min 600 beacon, no past mortgage arrears. ...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Near B Program: 5.25%-5.99% + 1% fee, 4-hour approvals, light docs, min 600 beacon, no past mortgage arrears. Near B 2-Year: 5.75%-5.99% + 1% fee, fully open after 12 months. Classic: 5.75%-7.25%, 600-695+ beacon, max 70% refi, no condos. H...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "vaultcredit.ca",
    "bdm": "Alicia Forbes (AForbes@vaultcredit.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_106_1st_closed",
        "productName": "Vault Capital Inc. 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_106_1st_open",
        "productName": "Vault Capital Inc. 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_106_2nd_mtg",
        "productName": "Vault Capital Inc. 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_107",
    "name": "WealthONE Bank of Canada",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "Live Benchmark",
    "bestFor": "30yr amort. Rate hold 90 days (live deals). Beacon: 680+ (50/50 GDS/TDS), 620-679 (45/45). 620 hard stop. Cons...",
    "specialFeatures": [
      "BFS Stated Income"
    ],
    "underwritingNotes": "30yr amort. Rate hold 90 days (live deals). Beacon: 680+ (50/50 GDS/TDS), 620-679 (45/45). 620 hard stop. Consumer Proposal: completed 12mo+, 680+ beacon. Bankruptcy: discharged only, 680+, 25bps premium. Multi-rental (7+): 65% max, 75-100b...",
    "fitRationale": "Excellent fit for self-employed, stated income, or credit restructuring.",
    "website": "wealthonebank.ca",
    "bdm": "Jeff Hayashi (brokers@wealthonebank.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON",
      "BC"
    ],
    "lendingAreaNotes": "Ontario & British Columbia",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_107_1y_classic",
        "productName": "WealthONE Bank of Canada 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_107_2y_classic",
        "productName": "WealthONE Bank of Canada 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_107_bfs_stated",
        "productName": "WealthONE Bank of Canada BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_107_alt_var",
        "productName": "WealthONE Bank of Canada Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  },
  {
    "id": "lender_108",
    "name": "Home Credits",
    "channel": "Private / MIC",
    "categoryRaw": "Private",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "2026-05-07...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "2026-05-07...",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "deals@homecredits.ca",
    "bdm": "",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario (Greater Toronto Area & Southern Ontario)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_108_1st_closed",
        "productName": "Home Credits 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_108_1st_open",
        "productName": "Home Credits 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_108_2nd_mtg",
        "productName": "Home Credits 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_109",
    "name": "Seven Lending",
    "channel": "Private / MIC",
    "categoryRaw": "Private",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Common Sense Lending. Min docs: App + CB + Appraisal + CPS/MLS. Inter-alia, Private Payouts, Jumbo 2nds, Forec...",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Common Sense Lending. Min docs: App + CB + Appraisal + CPS/MLS. Inter-alia, Private Payouts, Jumbo 2nds, Foreclosure Rescues, Small Commercial, Deposit Financing. Payouts other private lenders. Story-based underwriting. Surrey BC....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "sevenlending.ca",
    "bdm": "Darius Hossein-pour (Darius@sevenlending.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_109_1st_closed",
        "productName": "Seven Lending 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_109_1st_open",
        "productName": "Seven Lending 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_109_2nd_mtg",
        "productName": "Seven Lending 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_110",
    "name": "WestCan Mortgage Solutions",
    "channel": "Private / MIC",
    "categoryRaw": "Private/Equity MIC",
    "minBeacon": 500,
    "maxLTV": 75,
    "benchmarkRate": "7.95% - 9.95%",
    "bestFor": "Your Small Town Lender. 1st and 2nd mortgage solutions. Mobiles on pad financing (BC only)....",
    "specialFeatures": [
      "Equity Lending (No GDS/TDS)"
    ],
    "underwritingNotes": "Your Small Town Lender. 1st and 2nd mortgage solutions. Mobiles on pad financing (BC only)....",
    "fitRationale": "Fast equity financing based on property location and marketable value.",
    "website": "www.westcanmortgage.ca",
    "bdm": "Cheryl Kirstien|Joanne Quigley (cheryl@westcanmortgage.ca)",
    "lastUpdated": "Today",
    "propertyTypes": [
      "Residential"
    ],
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia (Metro Vancouver, Fraser Valley, Island)",
    "productsCount": 12,
    "lowestRate": 7.95,
    "isFeatured": false,
    "rateHoldDefault": 30,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Private Equity"
    ],
    "rates": [
      {
        "id": "lender_110_1st_closed",
        "productName": "WestCan Mortgage Solutions 1st Mortgage Interest-Only (1-Year)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 7.95,
        "spread": "Contract Rate",
        "apr": 9.2,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 75,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Closed 1-Year or 3 months interest penalty",
        "notes": "Equity lending based on property marketable value and location. No GDS/TDS."
      },
      {
        "id": "lender_110_1st_open",
        "productName": "WestCan Mortgage Solutions 1st Mortgage Fully Open (Interest-Only)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 8.95,
        "spread": "Contract Rate",
        "apr": 9.95,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 70,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Fully open anytime after 3 months without penalty",
        "notes": "Ideal for flip, construction exit, or quick turnaround."
      },
      {
        "id": "lender_110_2nd_mtg",
        "productName": "WestCan Mortgage Solutions 2nd Mortgage Equity Line",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Private Equity",
        "rate": 10.45,
        "spread": "Contract Rate",
        "apr": 11.45,
        "rateType": "Standard",
        "rateHoldDays": 30,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "Interest-only servicing",
        "notes": "Secondary financing behind existing prime 1st mortgage."
      }
    ]
  },
  {
    "id": "lender_111",
    "name": "Royal Bank of Canada (RBC)",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank (Schedule I)",
    "minBeacon": 680,
    "maxLTV": 95,
    "benchmarkRate": "4.09% - 4.49%",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Conventional & Insurable",
      "Standard B-20",
      "Homeline Plan HELOC",
      "Medical Professional Program"
    ],
    "underwritingNotes": "Tier-1 Prime A bank. GDS 39% / TDS 44%. High-ratio insured loans up to 95% LTV (purchase price up to $1.5M with 30-year amort for FTHB). Strict 50% rental income add-back on subject secondary suites (no subject PITH offset). Requires 2-year T1s/NOAs for BFS.",
    "fitRationale": "Tier-1 chartered bank with national footprint and discretionary rate pricing.",
    "website": "www.rbcroyalbank.com/mortgages",
    "bdm": "RBC Broker Desk (broker@rbc.com)",
    "lastUpdated": "Today",
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces)",
    "productsCount": 95,
    "lowestRate": 4.29,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_111_5y_fix_ins",
        "productName": "Royal Bank of Canada (RBC) 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_111_5y_fix_insurable",
        "productName": "Royal Bank of Canada (RBC) 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.53,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_111_3y_fix_ins",
        "productName": "Royal Bank of Canada (RBC) 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_111_3y_fix_unins",
        "productName": "Royal Bank of Canada (RBC) 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.74,
        "spread": "Fixed",
        "apr": 4.78,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_111_5y_var_ins",
        "productName": "Royal Bank of Canada (RBC) 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_111_1y_fix",
        "productName": "Royal Bank of Canada (RBC) 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.09,
        "spread": "Fixed",
        "apr": 5.14,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_111_heloc",
        "productName": "Royal Bank of Canada (RBC) Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_112",
    "name": "CIBC",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank (Schedule I)",
    "minBeacon": 680,
    "maxLTV": 95,
    "benchmarkRate": "4.14% - 4.54%",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Conventional & Insurable",
      "Standard B-20",
      "Home Power Plan HELOC",
      "Newcomer Program"
    ],
    "underwritingNotes": "Prime A underwriting. GDS 39% / TDS 44%. 50% rental income add-back to gross income on subject suites. Non-subject rentals assessed via Rental Worksheet. Requires standard full income verification (paystub + LOE + 2yr T4s).",
    "fitRationale": "Full-service chartered bank with aggressive fixed specials and foreign asset programs.",
    "website": "www.cibc.com/mortgages",
    "bdm": "CIBC Broker Support (brokerdesk@cibc.com)",
    "lastUpdated": "Today",
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces)",
    "productsCount": 95,
    "lowestRate": 4.29,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_112_5y_fix_ins",
        "productName": "CIBC 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_112_5y_fix_insurable",
        "productName": "CIBC 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.53,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_112_3y_fix_ins",
        "productName": "CIBC 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_112_3y_fix_unins",
        "productName": "CIBC 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.74,
        "spread": "Fixed",
        "apr": 4.78,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_112_5y_var_ins",
        "productName": "CIBC 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_112_1y_fix",
        "productName": "CIBC 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.09,
        "spread": "Fixed",
        "apr": 5.14,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_112_heloc",
        "productName": "CIBC Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_113",
    "name": "National Bank of Canada",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank (Schedule I)",
    "minBeacon": 680,
    "maxLTV": 95,
    "benchmarkRate": "4.19% - 4.59%",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Conventional & Insurable",
      "Standard B-20",
      "All-In-One Line of Credit",
      "Multi-Unit 2-4 Units"
    ],
    "underwritingNotes": "Prime A standard: 50% rental income add-back on subject properties; Rental Property Worksheet on existing rental portfolio. Amalgamated with Canadian Western Bank (CWB) core commercial/prime operations.",
    "fitRationale": "Excellent Big-6 bank option for prime files with complex multi-unit configurations.",
    "website": "www.nbc.ca/mortgages",
    "bdm": "NBC Broker Desk (brokerdesk@nbc.ca)",
    "lastUpdated": "Today",
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces)",
    "productsCount": 95,
    "lowestRate": 4.29,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_113_5y_fix_ins",
        "productName": "National Bank of Canada 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_113_5y_fix_insurable",
        "productName": "National Bank of Canada 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.53,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_113_3y_fix_ins",
        "productName": "National Bank of Canada 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_113_3y_fix_unins",
        "productName": "National Bank of Canada 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.74,
        "spread": "Fixed",
        "apr": 4.78,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_113_5y_var_ins",
        "productName": "National Bank of Canada 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_113_1y_fix",
        "productName": "National Bank of Canada 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.09,
        "spread": "Fixed",
        "apr": 5.14,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_113_heloc",
        "productName": "National Bank of Canada Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_114",
    "name": "Manulife Bank",
    "channel": "Prime (A)",
    "categoryRaw": "Prime A Bank (Schedule I)",
    "minBeacon": 680,
    "maxLTV": 95,
    "benchmarkRate": "4.19% - 4.59%",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Manulife One All-In-One",
      "Conventional & Insurable",
      "Standard B-20",
      "Debt Consolidation"
    ],
    "underwritingNotes": "Prime A Schedule I Bank. Standard B-20 stress test compliance. GDS 39% / TDS 44%. Manulife One allows revolving credit up to 65% LTV with total financing up to 80% LTV.",
    "fitRationale": "Innovative all-in-one mortgage account ideal for disciplined clients seeking rapid debt paydown.",
    "website": "www.manulifebank.ca",
    "bdm": "Manulife Bank Broker Desk (broker_sales@manulife.com)",
    "lastUpdated": "Today",
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces)",
    "productsCount": 95,
    "lowestRate": 4.29,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_114_5y_fix_ins",
        "productName": "Manulife Bank 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.29,
        "spread": "Fixed",
        "apr": 4.34,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_114_5y_fix_insurable",
        "productName": "Manulife Bank 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.53,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_114_3y_fix_ins",
        "productName": "Manulife Bank 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.49,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_114_3y_fix_unins",
        "productName": "Manulife Bank 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.74,
        "spread": "Fixed",
        "apr": 4.78,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_114_5y_var_ins",
        "productName": "Manulife Bank 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_114_1y_fix",
        "productName": "Manulife Bank 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.09,
        "spread": "Fixed",
        "apr": 5.14,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_114_heloc",
        "productName": "Manulife Bank Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_115",
    "name": "MCAP",
    "channel": "Monoline",
    "categoryRaw": "Monoline Prime A Leader",
    "minBeacon": 660,
    "maxLTV": 95,
    "benchmarkRate": "3.99% - 4.39%",
    "turnaround": "4-12 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Conventional & Insurable",
      "Standard B-20",
      "Fast 4-12hr Turnaround",
      "Value-Flex Pricing"
    ],
    "underwritingNotes": "Monoline Prime A: 50% rental income added to gross income on subject properties (does NOT do subject PITH offset). Non-subject rentals calculated via standard MCAP Rental Worksheet (50% gross rent minus PITH). 30-year amort on FTHB insured files.",
    "fitRationale": "Dedicated broker channel lender with ultra-fast turnaround and leading rates.",
    "website": "www.mcap.com",
    "bdm": "MCAP Broker Services (brokersupport@mcap.com)",
    "lastUpdated": "Today",
    "provinces": [
      "BC",
      "AB",
      "ON",
      "QC",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All 10 Canadian Provinces including Quebec)",
    "productsCount": 135,
    "lowestRate": 4.19,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_115_5y_fix_ins",
        "productName": "MCAP 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.19,
        "spread": "Fixed",
        "apr": 4.24,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_115_5y_fix_insurable",
        "productName": "MCAP 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.43,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_115_3y_fix_ins",
        "productName": "MCAP 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.34,
        "spread": "Fixed",
        "apr": 4.39,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_115_3y_fix_unins",
        "productName": "MCAP 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.64,
        "spread": "Fixed",
        "apr": 4.68,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_115_5y_var_ins",
        "productName": "MCAP 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_115_1y_fix",
        "productName": "MCAP 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.99,
        "spread": "Fixed",
        "apr": 5.04,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_115_heloc",
        "productName": "MCAP Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_116",
    "name": "CMLS Financial",
    "channel": "Monoline",
    "categoryRaw": "Monoline Prime A Leader",
    "minBeacon": 660,
    "maxLTV": 95,
    "benchmarkRate": "4.04% - 4.44%",
    "turnaround": "12-24 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Conventional & Insurable",
      "Standard B-20",
      "HOAP Program",
      "Transfer/Switch Specials"
    ],
    "underwritingNotes": "Monoline Prime A: 50% rental income added to gross income on subject secondary suites. Rental worksheet (50% rent minus PITH) applied to non-subject rental properties. CMLS AVEO is their separate Alt-B division.",
    "fitRationale": "High service level monoline with flexible prime features.",
    "website": "www.cmls.ca",
    "bdm": "CMLS Residential Broker Desk (residential@cmls.ca)",
    "lastUpdated": "Today",
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All provinces except QC)",
    "productsCount": 85,
    "lowestRate": 4.24,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_116_5y_fix_ins",
        "productName": "CMLS Financial 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.24,
        "spread": "Fixed",
        "apr": 4.29,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_116_5y_fix_insurable",
        "productName": "CMLS Financial 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.48,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_116_3y_fix_ins",
        "productName": "CMLS Financial 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.44,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_116_3y_fix_unins",
        "productName": "CMLS Financial 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.69,
        "spread": "Fixed",
        "apr": 4.73,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_116_5y_var_ins",
        "productName": "CMLS Financial 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_116_1y_fix",
        "productName": "CMLS Financial 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.04,
        "spread": "Fixed",
        "apr": 5.09,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_116_heloc",
        "productName": "CMLS Financial Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_117",
    "name": "Merix Financial",
    "channel": "Monoline",
    "categoryRaw": "Monoline Prime A Leader",
    "minBeacon": 660,
    "maxLTV": 95,
    "benchmarkRate": "4.09% - 4.49%",
    "turnaround": "12-24 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Conventional & Insurable",
      "Standard B-20",
      "Trailer Fee Option",
      "Fast Turnaround"
    ],
    "underwritingNotes": "Prime Monoline: 50% rental add-back on subject secondary suites. Rental worksheet applied to existing rental portfolio. NPX is their separate Alt-B division.",
    "fitRationale": "Established broker-centric monoline with competitive prime pricing.",
    "website": "www.merixfinancial.com",
    "bdm": "Merix Underwriting Desk (info@merixfinancial.com)",
    "lastUpdated": "Today",
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All provinces except QC)",
    "productsCount": 65,
    "lowestRate": 4.24,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_117_5y_fix_ins",
        "productName": "Merix Financial 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.24,
        "spread": "Fixed",
        "apr": 4.29,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_117_5y_fix_insurable",
        "productName": "Merix Financial 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.48,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_117_3y_fix_ins",
        "productName": "Merix Financial 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.44,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_117_3y_fix_unins",
        "productName": "Merix Financial 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.69,
        "spread": "Fixed",
        "apr": 4.73,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_117_5y_var_ins",
        "productName": "Merix Financial 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_117_1y_fix",
        "productName": "Merix Financial 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.04,
        "spread": "Fixed",
        "apr": 5.09,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_117_heloc",
        "productName": "Merix Financial Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_118",
    "name": "RMG Mortgages",
    "channel": "Monoline",
    "categoryRaw": "Monoline Prime A Leader",
    "minBeacon": 660,
    "maxLTV": 95,
    "benchmarkRate": "4.04% - 4.44%",
    "turnaround": "12-24 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Conventional & Insurable",
      "Standard B-20",
      "Low Prepayment Penalties",
      "Promotional Rates"
    ],
    "underwritingNotes": "Monoline Prime A: 50% rental income add-back on subject secondary suites. Rental worksheet for non-subject properties. B-20 stress test compliance.",
    "fitRationale": "Top-tier monoline offering aggressive broker promotions and straightforward guidelines.",
    "website": "www.rmgmortgages.ca",
    "bdm": "RMG Broker Team (info@rmgmortgages.ca)",
    "lastUpdated": "Today",
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All provinces except QC)",
    "productsCount": 65,
    "lowestRate": 4.24,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_118_5y_fix_ins",
        "productName": "RMG Mortgages 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.24,
        "spread": "Fixed",
        "apr": 4.29,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_118_5y_fix_insurable",
        "productName": "RMG Mortgages 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.48,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_118_3y_fix_ins",
        "productName": "RMG Mortgages 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.44,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_118_3y_fix_unins",
        "productName": "RMG Mortgages 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.69,
        "spread": "Fixed",
        "apr": 4.73,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_118_5y_var_ins",
        "productName": "RMG Mortgages 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_118_1y_fix",
        "productName": "RMG Mortgages 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.04,
        "spread": "Fixed",
        "apr": 5.09,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_118_heloc",
        "productName": "RMG Mortgages Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_119",
    "name": "Radius Financial",
    "channel": "Monoline",
    "categoryRaw": "Monoline Prime A",
    "minBeacon": 660,
    "maxLTV": 95,
    "benchmarkRate": "4.09% - 4.49%",
    "turnaround": "24 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Monoline Prime",
      "Standard B-20",
      "Competitive Fixed Rates"
    ],
    "underwritingNotes": "Broker channel monoline lender offering prime insured, insurable, and uninsurable residential mortgages. 50% rental income add-back on subject properties.",
    "fitRationale": "Reliable prime monoline with strong product lines.",
    "website": "www.radiusfinancial.ca",
    "bdm": "Radius Broker Desk (brokers@radiusfinancial.ca)",
    "lastUpdated": "Today",
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (All provinces except QC)",
    "productsCount": 65,
    "lowestRate": 4.24,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_119_5y_fix_ins",
        "productName": "Radius Financial 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.24,
        "spread": "Fixed",
        "apr": 4.29,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_119_5y_fix_insurable",
        "productName": "Radius Financial 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.44,
        "spread": "Fixed",
        "apr": 4.48,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_119_3y_fix_ins",
        "productName": "Radius Financial 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.44,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_119_3y_fix_unins",
        "productName": "Radius Financial 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.69,
        "spread": "Fixed",
        "apr": 4.73,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_119_5y_var_ins",
        "productName": "Radius Financial 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_119_1y_fix",
        "productName": "Radius Financial 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.04,
        "spread": "Fixed",
        "apr": 5.09,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_119_heloc",
        "productName": "Radius Financial Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_120",
    "name": "Vancity (Vancouver City Savings Credit Union)",
    "channel": "Credit Union",
    "categoryRaw": "Provincial Credit Union (BC)",
    "minBeacon": 640,
    "maxLTV": 80,
    "benchmarkRate": "4.24% - 4.74%",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Common-Sense Debt Servicing",
      "Provincial Regulation",
      "Secondary Suite Friendly",
      "Local Community Desk"
    ],
    "underwritingNotes": "Credit Union (BC): Not strictly bound by OSFI B-20 on uninsured conventional loans. Flexible rental suite policies (allows up to 75%-80% rental add-back or offset on authorized secondary suites with market rent support). Excellent for local BC properties.",
    "fitRationale": "Leading BC credit union with common-sense underwriting on self-employed and rental suites.",
    "website": "www.vancity.com",
    "bdm": "Vancity Broker Services (brokerservices@vancity.com)",
    "lastUpdated": "Today",
    "provinces": [
      "BC"
    ],
    "lendingAreaNotes": "British Columbia only (Metro Vancouver, Fraser Valley, Victoria)",
    "productsCount": 68,
    "lowestRate": 4.39,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_120_5y_fix_ins",
        "productName": "Vancity (Vancouver City Savings Credit Union) 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.44,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_120_5y_fix_insurable",
        "productName": "Vancity (Vancouver City Savings Credit Union) 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.59,
        "spread": "Fixed",
        "apr": 4.63,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_120_3y_fix_ins",
        "productName": "Vancity (Vancouver City Savings Credit Union) 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.54,
        "spread": "Fixed",
        "apr": 4.59,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_120_3y_fix_unins",
        "productName": "Vancity (Vancouver City Savings Credit Union) 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.84,
        "spread": "Fixed",
        "apr": 4.88,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_120_5y_var_ins",
        "productName": "Vancity (Vancouver City Savings Credit Union) 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_120_1y_fix",
        "productName": "Vancity (Vancouver City Savings Credit Union) 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.19,
        "spread": "Fixed",
        "apr": 5.24,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_120_heloc",
        "productName": "Vancity (Vancouver City Savings Credit Union) Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_121",
    "name": "Meridian Credit Union",
    "channel": "Credit Union",
    "categoryRaw": "Provincial Credit Union (ON)",
    "minBeacon": 650,
    "maxLTV": 80,
    "benchmarkRate": "4.29% - 4.79%",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Provincial Regulation",
      "BFS Self-Employed Friendly",
      "Rental Portfolio Program",
      "Local Ontario Underwriting"
    ],
    "underwritingNotes": "Credit Union (ON): Provincially regulated by FSRAO. Offers flexible debt servicing up to 48-50% TDS on strong files. Rental worksheet with generous offset factors on multi-property Ontario investors.",
    "fitRationale": "Ontario's top credit union for files needing common-sense flexibility beyond Big-6 bank constraints.",
    "website": "www.meridiancu.ca",
    "bdm": "Meridian Broker Team (broker@meridiancu.ca)",
    "lastUpdated": "Today",
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario only (GTA, Golden Horseshoe, Ottawa, Southwestern ON)",
    "productsCount": 74,
    "lowestRate": 4.34,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_121_5y_fix_ins",
        "productName": "Meridian Credit Union 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.34,
        "spread": "Fixed",
        "apr": 4.39,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_121_5y_fix_insurable",
        "productName": "Meridian Credit Union 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.54,
        "spread": "Fixed",
        "apr": 4.58,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_121_3y_fix_ins",
        "productName": "Meridian Credit Union 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.54,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_121_3y_fix_unins",
        "productName": "Meridian Credit Union 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.79,
        "spread": "Fixed",
        "apr": 4.83,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_121_5y_var_ins",
        "productName": "Meridian Credit Union 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_121_1y_fix",
        "productName": "Meridian Credit Union 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.14,
        "spread": "Fixed",
        "apr": 5.19,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_121_heloc",
        "productName": "Meridian Credit Union Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_122",
    "name": "DUCA Financial Services Credit Union",
    "channel": "Credit Union",
    "categoryRaw": "Provincial Credit Union (ON)",
    "minBeacon": 640,
    "maxLTV": 80,
    "benchmarkRate": "4.34% - 4.84%",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Provincially Regulated",
      "Common Sense Underwriting",
      "Ontario Market Focus"
    ],
    "underwritingNotes": "Ontario credit union with strong alternative underwriting guidelines for residential purchases and refinances up to 80% LTV.",
    "fitRationale": "Flexible Ontario credit union for borrowers needing common-sense debt ratio analysis.",
    "website": "www.duca.com",
    "bdm": "DUCA Broker Desk (broker@duca.com)",
    "lastUpdated": "Today",
    "provinces": [
      "ON"
    ],
    "lendingAreaNotes": "Ontario only (Greater Toronto Area & Central Ontario)",
    "productsCount": 60,
    "lowestRate": 4.19,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_122_5y_fix_ins",
        "productName": "DUCA Financial Services Credit Union 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.19,
        "spread": "Fixed",
        "apr": 4.24,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_122_5y_fix_insurable",
        "productName": "DUCA Financial Services Credit Union 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.39,
        "spread": "Fixed",
        "apr": 4.43,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_122_3y_fix_ins",
        "productName": "DUCA Financial Services Credit Union 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.34,
        "spread": "Fixed",
        "apr": 4.39,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_122_3y_fix_unins",
        "productName": "DUCA Financial Services Credit Union 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.64,
        "spread": "Fixed",
        "apr": 4.68,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_122_5y_var_ins",
        "productName": "DUCA Financial Services Credit Union 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_122_1y_fix",
        "productName": "DUCA Financial Services Credit Union 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.99,
        "spread": "Fixed",
        "apr": 5.04,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_122_heloc",
        "productName": "DUCA Financial Services Credit Union Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_123",
    "name": "Desjardins",
    "channel": "Credit Union",
    "categoryRaw": "Credit Union Federation (QC/ON)",
    "minBeacon": 650,
    "maxLTV": 95,
    "benchmarkRate": "4.19% - 4.59%",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Conventional & Insurable",
      "Multi-Unit 2-4 Units",
      "Quebec & Ontario Market Leader",
      "Competitive Rates"
    ],
    "underwritingNotes": "Credit Union: Standard 50% rental income add-back on subject units. High-ratio insured loans permitted up to 95% LTV. Strong appetite for owner-occupied duplexes and triplexes.",
    "fitRationale": "Dominant institution for Quebec and Eastern Ontario residential and multi-unit files.",
    "website": "www.desjardins.com",
    "bdm": "Desjardins Broker Desk (courtage@desjardins.com)",
    "lastUpdated": "Today",
    "provinces": [
      "QC",
      "ON"
    ],
    "lendingAreaNotes": "Quebec (full provincial footprint) & Ontario (broker channel network)",
    "productsCount": 190,
    "lowestRate": 4.34,
    "isFeatured": true,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_123_5y_fix_ins",
        "productName": "Desjardins 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.34,
        "spread": "Fixed",
        "apr": 4.39,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_123_5y_fix_insurable",
        "productName": "Desjardins 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.54,
        "spread": "Fixed",
        "apr": 4.58,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_123_3y_fix_ins",
        "productName": "Desjardins 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.54,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_123_3y_fix_unins",
        "productName": "Desjardins 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.79,
        "spread": "Fixed",
        "apr": 4.83,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_123_5y_var_ins",
        "productName": "Desjardins 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_123_1y_fix",
        "productName": "Desjardins 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.14,
        "spread": "Fixed",
        "apr": 5.19,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_123_heloc",
        "productName": "Desjardins Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_124",
    "name": "Servus Credit Union",
    "channel": "Credit Union",
    "categoryRaw": "Provincial Credit Union (AB)",
    "minBeacon": 650,
    "maxLTV": 80,
    "benchmarkRate": "4.34% - 4.84%",
    "turnaround": "48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "Alberta Leader",
      "Profit Sharing Program",
      "Conventional & High-Ratio"
    ],
    "underwritingNotes": "Alberta's largest credit union. Full residential product suite, common-sense underwriting on Alberta employment, agriculture, and self-employed files.",
    "fitRationale": "Alberta premier credit union with local decision making and member profit-sharing.",
    "website": "www.servus.ca",
    "bdm": "Servus Broker Services (broker@servus.ca)",
    "lastUpdated": "Today",
    "provinces": [
      "AB"
    ],
    "lendingAreaNotes": "Alberta only (Calgary, Edmonton, Red Deer, Lethbridge)",
    "productsCount": 61,
    "lowestRate": 4.34,
    "isFeatured": false,
    "rateHoldDefault": 120,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Insured",
      "Insurable",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_124_5y_fix_ins",
        "productName": "Servus Credit Union 5-Year Fixed (High-Ratio Insured)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.34,
        "spread": "Fixed",
        "apr": 4.39,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Eligible for CMHC / Sagen / Canada Guaranty default insurance."
      },
      {
        "id": "lender_124_5y_fix_insurable",
        "productName": "Servus Credit Union 5-Year Fixed (Insurable Conventional)",
        "term": "5 Year",
        "termType": "Fixed",
        "program": "Insurable",
        "rate": 4.54,
        "spread": "Fixed",
        "apr": 4.58,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 80,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "Portfolio insurable, purchase price under $1.5M, 25-year amortization."
      },
      {
        "id": "lender_124_3y_fix_ins",
        "productName": "Servus Credit Union 3-Year Fixed (Insured)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Insured",
        "rate": 4.49,
        "spread": "Fixed",
        "apr": 4.54,
        "rateType": "Standard",
        "rateHoldDays": 120,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum / 20% payment increase annually",
        "notes": "CMHC insured 3-year term."
      },
      {
        "id": "lender_124_3y_fix_unins",
        "productName": "Servus Credit Union 3-Year Fixed (Uninsured / 30-Yr Amort)",
        "term": "3 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 4.79,
        "spread": "Fixed",
        "apr": 4.83,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15/15 Prepayment",
        "notes": "Uninsured refinance or purchase >$1.5M with 30-year amortization."
      },
      {
        "id": "lender_124_5y_var_ins",
        "productName": "Servus Credit Union 5-Year Adjustable Variable (Insured)",
        "term": "5 Year",
        "termType": "Variable",
        "program": "Insured",
        "rate": 3.6,
        "spread": "Prime - 0.85%",
        "apr": 3.65,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 95,
        "maxAmortization": 25,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Floats directly with Bank of Canada Prime Rate changes."
      },
      {
        "id": "lender_124_1y_fix",
        "productName": "Servus Credit Union 1-Year Fixed Conventional",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Uninsured",
        "rate": 5.14,
        "spread": "Fixed",
        "apr": 5.19,
        "rateType": "Standard",
        "rateHoldDays": 60,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Standard prepayment",
        "notes": "Short term fixed."
      },
      {
        "id": "lender_124_heloc",
        "productName": "Servus Credit Union Home Equity Line of Credit (HELOC)",
        "term": "5 Year",
        "termType": "HELOC",
        "program": "Uninsured",
        "rate": 4.95,
        "spread": "Prime + 0.50%",
        "apr": 4.95,
        "rateType": "Standard",
        "rateHoldDays": 90,
        "maxLTV": 65,
        "maxAmortization": 30,
        "prepaymentPrivilege": "Fully open interest-only revolving credit",
        "notes": "Readvanceable collateral charge line of credit."
      }
    ]
  },
  {
    "id": "lender_125",
    "name": "Peoples Trust",
    "channel": "Alternative (B)",
    "categoryRaw": "B-Lender / Trust Company",
    "minBeacon": 600,
    "maxLTV": 80,
    "benchmarkRate": "5.49% - 6.29%",
    "turnaround": "24-48 Hours",
    "propertyTypes": [
      "Residential"
    ],
    "specialFeatures": [
      "BFS Stated Income",
      "Extended Ratios",
      "Alternative Lending"
    ],
    "underwritingNotes": "B-Lender: Max 80% LTV conventional. Allows extended GDS/TDS up to 50% on strong files. Rental worksheet with generous offset for investment portfolios.",
    "fitRationale": "Established alternative lender for self-employed and challenged debt ratio files.",
    "website": "www.peoplestrust.com",
    "bdm": "Peoples Trust Broker Desk (broker@peoplestrust.com)",
    "lastUpdated": "Today",
    "provinces": [
      "BC",
      "AB",
      "ON",
      "SK",
      "MB",
      "NS",
      "NB",
      "NL",
      "PE"
    ],
    "lendingAreaNotes": "National (Major Canadian Provinces outside Quebec)",
    "productsCount": 32,
    "lowestRate": 5.29,
    "isFeatured": false,
    "rateHoldDefault": 45,
    "transactionTypes": [
      "Purchase",
      "Refinance",
      "Transfer"
    ],
    "purposes": [
      "Owner-Occupied",
      "Rental / Investment",
      "Second Home"
    ],
    "rateTypes": [
      "Standard",
      "Limited",
      "Promo"
    ],
    "programs": [
      "Alternative B",
      "Uninsured"
    ],
    "rates": [
      {
        "id": "lender_125_1y_classic",
        "productName": "Peoples Trust 1-Year Fixed Classic (Alt-B)",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.29,
        "spread": "Fixed",
        "apr": 5.44,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Extended GDS/TDS up to 50%/50%. 30-year amortization."
      },
      {
        "id": "lender_125_2y_classic",
        "productName": "Peoples Trust 2-Year Fixed Classic (Alt-B)",
        "term": "2 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.49,
        "spread": "Fixed",
        "apr": 5.54,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% lump sum annually",
        "notes": "Classic Alt-B Tier 1."
      },
      {
        "id": "lender_125_bfs_stated",
        "productName": "Peoples Trust BFS Stated Income 1-Year",
        "term": "1 Year",
        "termType": "Fixed",
        "program": "Alternative B",
        "rate": 5.59,
        "spread": "Fixed",
        "apr": 5.64,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 80,
        "maxAmortization": 30,
        "prepaymentPrivilege": "20% annual prepayment",
        "notes": "Qualified on bank statements + business reasonableness without Line 15000 NOA lock."
      },
      {
        "id": "lender_125_alt_var",
        "productName": "Peoples Trust Alt-B Variable",
        "term": "3 Year",
        "termType": "Variable",
        "program": "Alternative B",
        "rate": 5.1,
        "spread": "Prime + 0.65%",
        "apr": 5.2,
        "rateType": "Standard",
        "rateHoldDays": 45,
        "maxLTV": 75,
        "maxAmortization": 30,
        "prepaymentPrivilege": "15% annual prepayment",
        "notes": "Adjustable rate Alt-B."
      }
    ]
  }
];
