/**
 * Page Context Helper
 * Provides context-aware information about the current page for AI assistance
 */

export interface PageContext {
    path: string;
    pageType: 'calculator' | 'service' | 'blog' | 'location' | 'contact' | 'home' | 'other';
    pageName: string;
    description: string;
    relevantTopics: string[];
    suggestedActions: string[];
    calculatorContext?: CalculatorContext;
}

export interface CalculatorContext {
    calculatorType: string;
    formula: string;
    fields: { name: string; description: string }[];
    tips: string[];
    warnings: string[];
}

// Calculator-specific contexts
const calculatorContexts: Record<string, CalculatorContext> = {
    '/commercial/calculators/cap-rate': {
        calculatorType: 'Cap Rate',
        formula: 'Cap Rate = (Net Operating Income / Market Value) × 100',
        fields: [
            { name: 'Net Operating Income (NOI)', description: 'Annual income after operating expenses' },
            { name: 'Market Value', description: 'Current property value or purchase price' },
            { name: 'Target Cap Rate', description: 'Desired cap rate for comparison' },
        ],
        tips: [
            'Higher cap rates generally indicate higher risk but better returns',
            'Compare to regional benchmarks for context',
            'Value Gap shows if property is over/undervalued relative to market',
        ],
        warnings: [
            'Cap rates below 3% are below market average for most BC regions',
            'Cap rates above 10% may indicate higher risk or distressed property',
        ],
    },
    '/commercial/calculators/noi-analysis': {
        calculatorType: 'NOI Analysis',
        formula: 'NOI = Effective Gross Income - Operating Expenses',
        fields: [
            { name: 'Gross Rent', description: 'Total potential rental income' },
            { name: 'Other Income', description: 'Parking, laundry, etc.' },
            { name: 'Vacancy Rate', description: 'Expected vacancy percentage' },
            { name: 'Operating Expenses', description: 'Management, utilities, insurance, taxes, maintenance' },
        ],
        tips: [
            'Vacancy is subtracted from gross income BEFORE expenses',
            'Expense ratio above 50% may indicate inefficiency',
            'NOI does not include debt service (mortgage payments)',
        ],
        warnings: [
            'High expense ratios (>50%) warrant review of operations',
        ],
    },
    '/commercial/calculators/refinance': {
        calculatorType: 'Commercial Refinance',
        formula: 'Break-Even = Total Costs / Monthly Savings',
        fields: [
            { name: 'Current Balance', description: 'Outstanding mortgage amount' },
            { name: 'Current Rate', description: 'Your existing interest rate' },
            { name: 'New Rate', description: 'Proposed new interest rate' },
            { name: 'Remaining Term', description: 'Months left on current mortgage' },
        ],
        tips: [
            '3-Month Interest penalty is simpler, IRD can be higher or lower',
            'Include all costs: penalty, legal, appraisal, discharge fees',
            'Only refinance if break-even happens before you plan to sell/renew',
        ],
        warnings: [
            'IRD penalty can be significant if rate differential is large',
        ],
    },
    '/construction/calculators/progressive-draw': {
        calculatorType: 'Progressive Draw',
        formula: 'Interest = Cumulative Balance × Monthly Rate × Months',
        fields: [
            { name: 'Total Loan Amount', description: 'Maximum construction loan' },
            { name: 'Interest Rate', description: 'Construction loan rate' },
            { name: 'Draw Schedule', description: 'Percentage drawn at each stage' },
        ],
        tips: [
            'You only pay interest on drawn amounts, not the full loan',
            'Standard draws: Foundation 15%, Framing 25%, Lock-up 40%, etc.',
            'Average balance method provides estimate of total interest cost',
        ],
        warnings: [
            'Construction rates are typically higher than permanent mortgages',
        ],
    },
    '/construction/calculators/cost-to-complete': {
        calculatorType: 'Cost to Complete',
        formula: 'Cost to Complete = (Hard + Soft + Contingency) - (Equity + Funded)',
        fields: [
            { name: 'Hard Costs', description: 'Land, construction, landscaping' },
            { name: 'Soft Costs', description: 'Permits, architectural, legal, engineering' },
            { name: 'Contingency', description: 'Buffer for unexpected costs (typically 5-15%)' },
            { name: 'Funding', description: 'Equity invested plus loan already funded' },
        ],
        tips: [
            'Always include a contingency of at least 10%',
            'Progress bar shows how much of project is funded',
            'Negative cost-to-complete means project is fully funded',
        ],
        warnings: [],
    },
    '/calculators/payment': {
        calculatorType: 'Mortgage Payment',
        formula: 'M = P × [r(1+r)^n] / [(1+r)^n – 1]',
        fields: [
            { name: 'Principal', description: 'Loan amount' },
            { name: 'Interest Rate', description: 'Annual rate' },
            { name: 'Amortization', description: 'Total repayment period (typically 25-30 years)' },
        ],
        tips: [
            'Bi-weekly payments can save significant interest over time',
            'Use stress test rate (contract + 2%) for qualification',
        ],
        warnings: [],
    },
    '/calculators/affordability': {
        calculatorType: 'Affordability',
        formula: 'Max Mortgage = (Annual Income × GDS Limit / 12 - Other Debts) × Affordability Factor',
        fields: [
            { name: 'Annual Income', description: 'Gross household income' },
            { name: 'Down Payment', description: 'Available funds for down payment' },
            { name: 'Monthly Debts', description: 'Car payments, credit cards, etc.' },
        ],
        tips: [
            'GDS should be under 39%, TDS under 44%',
            'Include property taxes and heating in calculations',
        ],
        warnings: [],
    },
};

// Page type detection patterns
const pagePatterns: { pattern: RegExp; type: PageContext['pageType']; name: string }[] = [
    { pattern: /\/calculators?\//, type: 'calculator', name: 'Calculator' },
    { pattern: /\/commercial/, type: 'service', name: 'Commercial Lending' },
    { pattern: /\/construction/, type: 'service', name: 'Construction Financing' },
    { pattern: /\/residential/, type: 'service', name: 'Residential Mortgages' },
    { pattern: /\/private-lending/, type: 'service', name: 'Private Lending' },
    { pattern: /\/blog/, type: 'blog', name: 'Blog' },
    { pattern: /\/mortgage-broker-/, type: 'location', name: 'Location Page' },
    { pattern: /\/contact/, type: 'contact', name: 'Contact' },
    { pattern: /^\/$/, type: 'home', name: 'Home' },
];

/**
 * Get context for the current page
 */
export function getPageContext(pathname: string): PageContext {
    // Determine page type
    let pageType: PageContext['pageType'] = 'other';
    let pageName = 'Page';

    for (const { pattern, type, name } of pagePatterns) {
        if (pattern.test(pathname)) {
            pageType = type;
            pageName = name;
            break;
        }
    }

    // Extract more specific page name from path
    const pathParts = pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart) {
        pageName = lastPart
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Build base context
    const context: PageContext = {
        path: pathname,
        pageType,
        pageName,
        description: getPageDescription(pathname, pageType),
        relevantTopics: getRelevantTopics(pageType),
        suggestedActions: getSuggestedActions(pageType),
    };

    // Add calculator-specific context if applicable
    const calcContext = calculatorContexts[pathname];
    if (calcContext) {
        context.calculatorContext = calcContext;
        context.pageName = `${calcContext.calculatorType} Calculator`;
    }

    return context;
}

function getPageDescription(pathname: string, pageType: PageContext['pageType']): string {
    const descriptions: Record<string, string> = {
        '/commercial/calculators/cap-rate': 'Calculate the capitalization rate for commercial real estate investments',
        '/commercial/calculators/noi-analysis': 'Analyze Net Operating Income for commercial properties',
        '/commercial/calculators/refinance': 'Calculate break-even analysis for commercial refinancing',
        '/construction/calculators/progressive-draw': 'Calculate interest on construction loan draws',
        '/construction/calculators/cost-to-complete': 'Analyze funding gap for construction projects',
        '/construction/calculators/builder-program': 'Compare builder financing programs',
        '/calculators/payment': 'Calculate monthly mortgage payments',
        '/calculators/affordability': 'Determine how much mortgage you can afford',
        '/contact': 'Contact Kraft Mortgages for a consultation',
        '/': 'Kraft Mortgages - BC & Alberta Mortgage Specialists',
    };

    return descriptions[pathname] || `${pageType} page`;
}

function getRelevantTopics(pageType: PageContext['pageType']): string[] {
    const topics: Record<PageContext['pageType'], string[]> = {
        calculator: ['Calculate values', 'Explain formulas', 'Provide examples', 'Compare scenarios'],
        service: ['Explain services', 'Eligibility requirements', 'Rate information', 'Application process'],
        blog: ['Related articles', 'Market updates', 'Educational content'],
        location: ['Local services', 'Area expertise', 'Contact information'],
        contact: ['Book appointment', 'Phone number', 'Office hours', 'Consultation'],
        home: ['Services overview', 'Getting started', 'Why Kraft Mortgages'],
        other: ['General assistance', 'Navigation help'],
    };

    return topics[pageType];
}

function getSuggestedActions(pageType: PageContext['pageType']): string[] {
    const actions: Record<PageContext['pageType'], string[]> = {
        calculator: ['Run a calculation', 'Explain the formula', 'Show an example', 'Compare to benchmarks'],
        service: ['Learn about requirements', 'Check current rates', 'Start application', 'Book consultation'],
        blog: ['Find related articles', 'Get summary', 'Learn more about topic'],
        location: ['Get contact info', 'Book local appointment', 'Learn about area'],
        contact: ['Book appointment', 'Get phone number', 'Send message'],
        home: ['Find the right service', 'Calculate affordability', 'Learn about rates'],
        other: ['Navigate to calculators', 'Find services', 'Contact us'],
    };

    return actions[pageType];
}

/**
 * Generate a system prompt addition based on page context
 */
export function generatePageContextPrompt(context: PageContext): string {
    let prompt = `
CURRENT PAGE CONTEXT:
- Page: ${context.path}
- Page Type: ${context.pageType}
- Page Name: ${context.pageName}
- Description: ${context.description}

When helping users on this page:
${context.suggestedActions.map(action => `- ${action}`).join('\n')}
`;

    if (context.calculatorContext) {
        const calc = context.calculatorContext;
        prompt += `
CALCULATOR DETAILS:
- Calculator: ${calc.calculatorType}
- Formula: ${calc.formula}

Fields on this page:
${calc.fields.map(f => `- ${f.name}: ${f.description}`).join('\n')}

Tips for users:
${calc.tips.map(tip => `- ${tip}`).join('\n')}
`;

        if (calc.warnings.length > 0) {
            prompt += `
Warnings to mention when relevant:
${calc.warnings.map(w => `- ⚠️ ${w}`).join('\n')}
`;
        }
    }

    return prompt;
}
