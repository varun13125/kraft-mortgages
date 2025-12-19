/**
 * Navigation Tools for AI Chatbot
 * Allows AI to suggest and execute navigation actions
 */

import { MortgageTool } from './types';

// Define page categories and their routes
const pageRoutes: Record<string, { path: string; name: string; description: string }[]> = {
    calculators: [
        { path: '/calculators/affordability', name: 'Affordability Calculator', description: 'Calculate how much mortgage you can afford' },
        { path: '/calculators/payment', name: 'Payment Calculator', description: 'Calculate monthly mortgage payments' },
        { path: '/commercial/calculators/cap-rate', name: 'Cap Rate Calculator', description: 'Calculate capitalization rate for commercial properties' },
        { path: '/commercial/calculators/noi-analysis', name: 'NOI Analysis', description: 'Analyze Net Operating Income' },
        { path: '/commercial/calculators/refinance', name: 'Refinance Calculator', description: 'Break-even analysis for refinancing' },
        { path: '/construction/calculators/progressive-draw', name: 'Progressive Draw', description: 'Construction loan draw schedule' },
        { path: '/construction/calculators/cost-to-complete', name: 'Cost to Complete', description: 'Funding gap analysis for construction' },
        { path: '/construction/calculators/builder-program', name: 'Builder Program Comparison', description: 'Compare builder financing programs' },
    ],
    services: [
        { path: '/residential', name: 'Residential Mortgages', description: 'Home purchase and refinance options' },
        { path: '/commercial', name: 'Commercial Lending', description: 'Multi-family and commercial property financing' },
        { path: '/construction', name: 'Construction Financing', description: 'New build and renovation loans' },
        { path: '/private-lending', name: 'Private Lending', description: 'Alternative financing solutions' },
        { path: '/self-employed', name: 'Self-Employed Mortgages', description: 'Mortgages for business owners' },
    ],
    info: [
        { path: '/about', name: 'About Us', description: 'Learn about Kraft Mortgages' },
        { path: '/contact', name: 'Contact', description: 'Get in touch with our team' },
        { path: '/blog', name: 'Blog', description: 'Mortgage insights and market updates' },
    ],
};

export class NavigationTools {
    private static instance: NavigationTools;

    static getInstance(): NavigationTools {
        if (!NavigationTools.instance) {
            NavigationTools.instance = new NavigationTools();
        }
        return NavigationTools.instance;
    }

    /**
     * Find relevant pages based on user query
     */
    findRelevantPages(query: string): { path: string; name: string; description: string; relevance: number }[] {
        const queryLower = query.toLowerCase();
        const results: { path: string; name: string; description: string; relevance: number }[] = [];

        // Keywords mapping to categories
        const keywordMap: Record<string, string[]> = {
            calculators: ['calculate', 'calculator', 'how much', 'afford', 'payment', 'cap rate', 'noi', 'refinance', 'draw'],
            services: ['mortgage', 'loan', 'financing', 'commercial', 'construction', 'residential', 'private', 'self-employed'],
            info: ['about', 'contact', 'blog', 'article', 'learn', 'call', 'phone'],
        };

        // Check each category
        for (const [category, pages] of Object.entries(pageRoutes)) {
            const categoryKeywords = keywordMap[category] || [];
            const categoryMatch = categoryKeywords.some(kw => queryLower.includes(kw));

            for (const page of pages) {
                let relevance = 0;

                // Check name match
                if (page.name.toLowerCase().split(' ').some(word => queryLower.includes(word))) {
                    relevance += 3;
                }

                // Check description match
                if (page.description.toLowerCase().split(' ').some(word => queryLower.includes(word))) {
                    relevance += 2;
                }

                // Category match
                if (categoryMatch) {
                    relevance += 1;
                }

                if (relevance > 0) {
                    results.push({ ...page, relevance });
                }
            }
        }

        // Sort by relevance and return top 3
        return results.sort((a, b) => b.relevance - a.relevance).slice(0, 3);
    }

    /**
     * Get navigation suggestion for a specific intent
     */
    getNavigationForIntent(intent: string): { path: string; name: string } | null {
        const intentMap: Record<string, string> = {
            'calculate_affordability': '/calculators/affordability',
            'calculate_payment': '/calculators/payment',
            'cap_rate': '/commercial/calculators/cap-rate',
            'noi': '/commercial/calculators/noi-analysis',
            'refinance': '/commercial/calculators/refinance',
            'construction': '/construction',
            'commercial': '/commercial',
            'residential': '/residential',
            'contact': '/contact',
            'apply': '/contact',
            'blog': '/blog',
        };

        const path = intentMap[intent.toLowerCase()];
        if (path) {
            const allPages = [...pageRoutes.calculators, ...pageRoutes.services, ...pageRoutes.info];
            const page = allPages.find(p => p.path === path);
            return page ? { path: page.path, name: page.name } : null;
        }

        return null;
    }

    /**
     * Format navigation suggestion for display
     */
    formatNavigationSuggestion(pages: { path: string; name: string; description: string }[]): string {
        if (pages.length === 0) {
            return "I couldn't find a specific page for that. Would you like me to help you find something else?";
        }

        if (pages.length === 1) {
            return `I recommend checking out our **[${pages[0].name}](${pages[0].path})** - ${pages[0].description}`;
        }

        let response = "Here are some pages that might help:\n\n";
        pages.forEach((page, i) => {
            response += `${i + 1}. **[${page.name}](${page.path})** - ${page.description}\n`;
        });

        return response;
    }
}

// Export tool definitions for registration
export const navigationTools: MortgageTool[] = [
    {
        name: 'find_relevant_pages',
        description: 'Find relevant pages on the Kraft Mortgages website based on user query',
        parameters: null,
        execute: async (params: { query: string }) => {
            const nav = NavigationTools.getInstance();
            const pages = nav.findRelevantPages(params.query);
            return {
                success: true,
                data: {
                    pages,
                    formatted: nav.formatNavigationSuggestion(pages),
                },
            };
        },
    },
    {
        name: 'navigate_to_page',
        description: 'Suggest a specific page for the user to visit',
        parameters: null,
        execute: async (params: { intent: string }) => {
            const nav = NavigationTools.getInstance();
            const suggestion = nav.getNavigationForIntent(params.intent);
            return {
                success: !!suggestion,
                data: suggestion,
                formattedResult: suggestion
                    ? `You can find that on our **[${suggestion.name}](${suggestion.path})** page.`
                    : "I couldn't find a specific page for that.",
            };
        },
    },
];

export const navigationToolsInstance = NavigationTools.getInstance();
