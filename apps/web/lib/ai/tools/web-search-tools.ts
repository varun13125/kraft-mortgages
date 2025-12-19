/**
 * Web Search Tool for AI Chatbot
 * Allows AI to search the web for current information
 */

import { MortgageTool } from './types';

export interface SearchResult {
    title: string;
    snippet: string;
    url: string;
}

export class WebSearchTools {
    private static instance: WebSearchTools;

    static getInstance(): WebSearchTools {
        if (!WebSearchTools.instance) {
            WebSearchTools.instance = new WebSearchTools();
        }
        return WebSearchTools.instance;
    }

    /**
     * Search the web using Google Custom Search API or similar
     */
    async search(query: string, limit: number = 5): Promise<SearchResult[]> {
        const apiKey = process.env.GOOGLE_API_KEY;
        const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

        // If no search API configured, return helpful message
        if (!apiKey || !searchEngineId) {
            console.log('[WebSearch] Google Search API not configured, using fallback');
            return this.getFallbackResults(query);
        }

        try {
            const response = await fetch(
                `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=${limit}`
            );

            if (!response.ok) {
                console.error('[WebSearch] API error:', response.status);
                return this.getFallbackResults(query);
            }

            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                return this.getFallbackResults(query);
            }

            return data.items.map((item: any) => ({
                title: item.title,
                snippet: item.snippet,
                url: item.link
            }));
        } catch (error) {
            console.error('[WebSearch] Error:', error);
            return this.getFallbackResults(query);
        }
    }

    /**
     * Fallback results when API is not available
     * Points to authoritative Canadian mortgage sources
     */
    private getFallbackResults(query: string): SearchResult[] {
        const lowerQuery = query.toLowerCase();
        const results: SearchResult[] = [];

        // Always include official sources
        results.push({
            title: "Canada Mortgage and Housing Corporation (CMHC)",
            snippet: "Official source for Canadian mortgage insurance, housing market data, and homebuyer programs.",
            url: "https://www.cmhc-schl.gc.ca/"
        });

        // Add relevant sources based on query
        if (lowerQuery.includes('rate') || lowerQuery.includes('interest')) {
            results.push({
                title: "Bank of Canada - Interest Rates",
                snippet: "Official Bank of Canada policy rate and benchmark rate information.",
                url: "https://www.bankofcanada.ca/rates/"
            });
        }

        if (lowerQuery.includes('first-time') || lowerQuery.includes('first time') || lowerQuery.includes('fthb')) {
            results.push({
                title: "Government of Canada - First-Time Home Buyer Programs",
                snippet: "Information on FHSA, Home Buyers' Plan, and other first-time buyer incentives.",
                url: "https://www.canada.ca/en/services/finance/managing-your-home.html"
            });
        }

        if (lowerQuery.includes('stress test') || lowerQuery.includes('osfi')) {
            results.push({
                title: "OSFI - Mortgage Underwriting Guidelines",
                snippet: "Official stress test and mortgage qualification guidelines from OSFI.",
                url: "https://www.osfi-bsif.gc.ca/"
            });
        }

        if (lowerQuery.includes('bc') || lowerQuery.includes('british columbia')) {
            results.push({
                title: "BC Housing",
                snippet: "British Columbia housing programs and property transfer tax information.",
                url: "https://www.bchousing.org/"
            });
        }

        if (lowerQuery.includes('construction') || lowerQuery.includes('builder')) {
            results.push({
                title: "CMHC - Progress Advance Mortgages",
                snippet: "Information on construction financing and progress draw mortgages.",
                url: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing"
            });
        }

        return results.slice(0, 5);
    }

    /**
     * Format search results for AI consumption
     */
    formatResults(results: SearchResult[]): string {
        if (results.length === 0) {
            return "No search results found.";
        }

        let formatted = "**Relevant Resources:**\n\n";
        results.forEach((result, index) => {
            formatted += `${index + 1}. **${result.title}**\n`;
            formatted += `   ${result.snippet}\n`;
            formatted += `   [Learn more](${result.url})\n\n`;
        });

        return formatted;
    }
}

// Export tool definitions for registration
export const webSearchTools: MortgageTool[] = [
    {
        name: 'web_search',
        description: 'Search the web for current mortgage rates, policies, or housing market information',
        parameters: null,
        execute: async (params: { query: string; limit?: number }) => {
            const searcher = WebSearchTools.getInstance();
            const results = await searcher.search(params.query, params.limit || 5);

            return {
                success: true,
                data: results,
                formattedResult: searcher.formatResults(results),
            };
        },
    },
    {
        name: 'get_official_resources',
        description: 'Get links to official Canadian mortgage and housing resources',
        parameters: null,
        execute: async (params: { topic?: string }) => {
            const searcher = WebSearchTools.getInstance();
            const results = searcher['getFallbackResults'](params.topic || 'mortgage');

            return {
                success: true,
                data: results,
                formattedResult: searcher.formatResults(results),
            };
        },
    },
];

export const webSearchToolsInstance = WebSearchTools.getInstance();
