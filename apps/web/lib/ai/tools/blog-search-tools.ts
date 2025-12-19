/**
 * Blog Search Tools for AI Chatbot
 * Allows AI to search and recommend blog posts
 */

import { MortgageTool } from './types';

// Blog post index for search (in production, this would query the actual blog)
const blogPostIndex = [
    {
        slug: 'insured-mortgage-cap-1-5-million',
        title: '$1.5M Insured Mortgage Cap: What It Means for BC Buyers',
        excerpt: 'The new insured mortgage cap of $1.5 million opens doors for buyers in expensive markets like Vancouver.',
        topics: ['insured mortgage', 'first-time buyer', 'down payment', 'CMHC', '$1.5 million'],
        category: 'Policy Updates',
    },
    {
        slug: 'bc-build-vs-alberta-buy',
        title: '2.5% Rate Cut: BC Build vs Alberta Buy Strategy',
        excerpt: 'Compare building in BC vs buying in Alberta with the latest rate cuts.',
        topics: ['rate cut', 'construction', 'Alberta', 'BC', 'strategy'],
        category: 'Market Analysis',
    },
    {
        slug: 'sales-down-13-percent',
        title: 'BC Housing Sales Down 13%: Buyer Opportunity?',
        excerpt: 'Sales slowdown creates opportunities for prepared buyers.',
        topics: ['market', 'sales', 'buyer market', 'opportunity'],
        category: 'Market Analysis',
    },
    {
        slug: 'stress-test-explained',
        title: 'Mortgage Stress Test Explained for 2025',
        excerpt: 'Understanding the qualifying rate and how it affects your purchasing power.',
        topics: ['stress test', 'qualifying rate', 'benchmark rate', 'affordability'],
        category: 'Education',
    },
    {
        slug: 'self-employed-mortgage-guide',
        title: 'Self-Employed Mortgage Guide: Getting Approved in 2025',
        excerpt: 'Bank statements, stated income, and other options for business owners.',
        topics: ['self-employed', 'business owner', 'bank statements', 'stated income', 'B-lender'],
        category: 'Guides',
    },
    {
        slug: 'commercial-mortgage-basics',
        title: 'Commercial Mortgage Basics: What You Need to Know',
        excerpt: 'Understanding cap rates, NOI, and commercial lending requirements.',
        topics: ['commercial', 'cap rate', 'NOI', 'multi-family', 'investment'],
        category: 'Education',
    },
    {
        slug: 'construction-financing-guide',
        title: 'Construction Financing: Progressive Draw Explained',
        excerpt: 'How construction loans work, draw schedules, and what to expect.',
        topics: ['construction', 'draw schedule', 'builder', 'new build'],
        category: 'Guides',
    },
    {
        slug: 'first-time-buyer-incentives-2025',
        title: 'First-Time Buyer Incentives in 2025',
        excerpt: 'RRSP Home Buyers Plan, First Home Savings Account, and more.',
        topics: ['first-time buyer', 'RRSP', 'FHSA', 'incentives', 'tax benefits'],
        category: 'Guides',
    },
];

export class BlogSearchTools {
    private static instance: BlogSearchTools;

    static getInstance(): BlogSearchTools {
        if (!BlogSearchTools.instance) {
            BlogSearchTools.instance = new BlogSearchTools();
        }
        return BlogSearchTools.instance;
    }

    /**
     * Search blog posts by query
     */
    searchPosts(query: string): { slug: string; title: string; excerpt: string; relevance: number }[] {
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

        const results = blogPostIndex.map(post => {
            let relevance = 0;

            // Check title match
            queryWords.forEach(word => {
                if (post.title.toLowerCase().includes(word)) {
                    relevance += 3;
                }
            });

            // Check topics match
            post.topics.forEach(topic => {
                if (queryLower.includes(topic) || queryWords.some(w => topic.includes(w))) {
                    relevance += 2;
                }
            });

            // Check excerpt match
            queryWords.forEach(word => {
                if (post.excerpt.toLowerCase().includes(word)) {
                    relevance += 1;
                }
            });

            return { ...post, relevance };
        });

        return results
            .filter(r => r.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 3)
            .map(({ slug, title, excerpt, relevance }) => ({ slug, title, excerpt, relevance }));
    }

    /**
     * Get posts by category
     */
    getPostsByCategory(category: string): { slug: string; title: string; excerpt: string }[] {
        return blogPostIndex
            .filter(p => p.category.toLowerCase() === category.toLowerCase())
            .map(({ slug, title, excerpt }) => ({ slug, title, excerpt }));
    }

    /**
     * Format search results for display
     */
    formatSearchResults(posts: { slug: string; title: string; excerpt: string }[]): string {
        if (posts.length === 0) {
            return "I couldn't find any blog posts matching your query. Would you like to browse our [Blog](/blog)?";
        }

        let response = "Here are some relevant articles:\n\n";
        posts.forEach((post, i) => {
            response += `${i + 1}. **[${post.title}](/blog/${post.slug})**\n   ${post.excerpt}\n\n`;
        });

        return response;
    }
}

// Export tool definitions for registration
export const blogSearchTools: MortgageTool[] = [
    {
        name: 'search_blog',
        description: 'Search blog posts for relevant content based on user query',
        parameters: null,
        execute: async (params: { query: string }) => {
            const blog = BlogSearchTools.getInstance();
            const posts = blog.searchPosts(params.query);
            return {
                success: true,
                data: { posts },
                formattedResult: blog.formatSearchResults(posts),
            };
        },
    },
    {
        name: 'get_blog_category',
        description: 'Get blog posts by category (Policy Updates, Market Analysis, Education, Guides)',
        parameters: null,
        execute: async (params: { category: string }) => {
            const blog = BlogSearchTools.getInstance();
            const posts = blog.getPostsByCategory(params.category);
            return {
                success: true,
                data: { posts },
                formattedResult: blog.formatSearchResults(posts),
            };
        },
    },
];

export const blogSearchToolsInstance = BlogSearchTools.getInstance();
