/**
 * Script to add blog post to Firestore
 * Run with: npx tsx scripts/add-blog-post.ts
 */

import { savePost } from '../lib/db/firestore';

const blogPost = {
    slug: 'sales-down-13-vacancies-up-christmas-gift-2025',
    title: 'Sales Down 13%, Vacancies Up: Why This "Bad" News is Your Christmas Gift',
    markdown: `If you read the headlines this morning, you probably want to hide your wallet.

The BC Real Estate Association (BCREA) just released their November report, and the ink is red. Residential sales are down 13.3% compared to last year, and prices have slipped by 1.4%.

Even more shocking? The CMHC reported yesterday that vacancy rates in Vancouver have jumped from 1.6% to 3.7%—the highest level in over 30 years.

The media is calling this a "weakening" market. I call it **Peak Negotiating Power**.

Here is the reality of the market as we close out 2025—and why smart investors are writing offers while everyone else is holiday shopping.

## 1. The "Fear Premium" Has Returned (And It's Lowering Rates)

Why is the market soft when the Bank of Canada rate is sitting at a friendly 2.25%? It's not the cost of borrowing. It's uncertainty.

Investors are spooked by "Trade War" headlines and the new vacancy numbers. But here is the secret: That fear is making fixed mortgages cheaper. When global investors get scared, they buy safe bonds. This "flight to safety" pushes bond yields down—and fixed mortgage rates follow.

Right now, we are seeing 5-year fixed rates dipping into the **4.39% – 4.49% range**. You are getting the benefit of "crisis pricing" on your rate, without the crisis actually hurting the local economy yet.

## 2. The "Easy Landlord" Era is Over (And That's Good)

The jump in vacancy rates to 3.7% sends a clear message: Tenants have choices. You can no longer buy a mediocre condo, slap a "For Rent" sign on it, and expect a bidding war.

This scares away the amateur speculators—which leaves the field wide open for sophisticated investors. The opportunities in 2026 aren't in generic condos; they are in unique, high-demand units (like row homes or multiplexes) that tenants actually want to live in. While the amateurs are selling their empty condos at a loss, you can pick up those assets for **5% to 10% below asking**.

## 3. Sellers Are Tired

The BCREA report shows that sales are 25% below the 10-year average. That means there are thousands of sellers in Surrey, Vancouver, and the Fraser Valley who have been sitting on the market for 60+ days. They are fatigued. They are stressed.

In a roaring market, you pay the asking price. In a market down 13% with high vacancies, **you dictate the terms**. We are helping clients secure properties with aggressive conditions—including long completion dates that let you ride the winter while locking in today's low rates.

## The Play: "Buy the Fear"

By Spring 2026, when the trade talks settle and confidence returns, the buyers will be back. The "discount bin" we see today will be gone.

### Your Action Plan:

- **Lock a Rate Hold Now:** Secure a fixed rate in the 4.30%s while bond yields are suppressed.
- **Target "Stale" Listings:** Look for sellers who missed the Fall market. They are the most willing to negotiate.
- **Run the Rent Numbers:** With vacancies up, don't assume 2024 rents. Let us run a conservative cash-flow analysis for you before you offer.

---

Are you ready to make a low-ball offer with confidence? Don't guess. Book a 15-minute strategy call with me today, and let's structure a deal that works in this market.

[Book Your Strategy Call with Varun](/contact)

---

**Kraft Mortgages**  
#301 - 1688 152nd Street  
Surrey BC V4A 2G2  
Serving Clients Across British Columbia and Alberta

---

*Note: This post is for information purposes only and does not constitute legal, real estate, or tax advice. Please consult a realtor for property selection. APR Disclosure: On a $500,000 mortgage with a 5-year fixed rate of 4.39% and a 25-year amortization, the APR is 4.42% assuming a standard closing fee. Rates are subject to qualification and market change.*`,
    html: '', // Will be generated from markdown
    status: 'published' as const,
    publishedAt: new Date('2025-12-18T12:00:00-08:00'),
    author: {
        name: 'Varun Chaudhry',
        title: 'Senior Mortgage Strategist',
        license: 'BCFSA #M08001935'
    },
    metaDescription: 'BC Real Estate sales are down 13% and vacancy rates have doubled. Smart investors see this as peak negotiating power. Learn how to capitalize on the 2025 market downturn.',
    keywords: [
        'BC real estate market 2025',
        'BCREA report December 2025',
        'CMHC vacancy rates Vancouver',
        'buy the fear real estate',
        'mortgage rates December 2025',
        'BC housing market downturn',
        'real estate negotiation strategies',
        'Vancouver rental vacancy rates',
        'investment property BC',
        'Surrey real estate market'
    ],
    categories: ['Market Analysis', 'Investment Strategy'],
    // SEO fields for the blog display
    seotitle: 'Sales Down 13%, Vacancies Up: Why This Market Downturn is Your Opportunity | Kraft Mortgages',
    seodescription: 'BC Real Estate sales are down 13% and vacancy rates have doubled to 3.7%. Smart investors see this as peak negotiating power. Learn how to capitalize on the 2025 market downturn.',
    seokeywords: 'BC real estate market 2025, BCREA report, CMHC vacancy rates, mortgage rates, investment property, Vancouver real estate',
    seoimage: '/images/blog-default.jpg',
    readingtime: '6',
    featured: true,
    brief: 'December 2025 market analysis: BCREA shows 13.3% sales decline, CMHC reports vacancy rates at 30-year high. Strategic opportunities for buyers.'
};

async function main() {
    try {
        console.log('Adding blog post to Firestore...');
        console.log('Slug:', blogPost.slug);
        console.log('Title:', blogPost.title);

        await savePost(blogPost as any);

        console.log('✅ Blog post added successfully!');
        console.log('View at: https://kraftmortgages.ca/blog/' + blogPost.slug);
    } catch (error) {
        console.error('❌ Error adding blog post:', error);
        process.exit(1);
    }
}

main();
