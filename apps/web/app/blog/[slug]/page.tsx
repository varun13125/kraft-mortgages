import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  category: string;
  metaDescription: string;
}

import { postsCol } from '@/lib/db/firestore';

// Fetch from Firestore database
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const collection = await postsCol();
    const doc = await collection.doc(slug).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data();
    if (!data) return null;
    
    return {
      slug: data.slug,
      title: data.title,
      content: data.markdown, // Use the markdown content
      excerpt: data.metaDescription || data.title, // Use meta description as excerpt
      publishedAt: data.publishedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      readTime: `${Math.ceil(data.markdown.length / 1000)} min read`, // Rough estimate
      category: 'Mortgage Insights',
      metaDescription: data.metaDescription || data.title,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    
    // Fallback to sample post for first-time-buyer-guide-bc-2025
    if (slug === 'first-time-home-buyer-guide-bc-2025') {
      return {
        slug: 'first-time-home-buyer-guide-bc-2025',
        title: 'Complete First-Time Home Buyer Guide for BC 2025',
        excerpt: 'Everything you need to know about buying your first home in British Columbia, including programs, grants, and insider tips from 23+ years in the industry.',
        content: `# Complete First-Time Home Buyer Guide for BC 2025

*Last updated: January 15, 2025*

Buying your first home in British Columbia can feel overwhelming, but with the right guidance and preparation, it becomes an achievable goal. As a licensed mortgage broker with over 23 years of experience helping BC residents achieve homeownership, I've compiled this comprehensive guide to walk you through every step of the process.

## Understanding the BC Real Estate Market in 2025

The British Columbia real estate market continues to evolve, with new policies and programs designed to help first-time buyers enter the market. Here's what you need to know about the current landscape:

### Market Conditions
- Average home prices across BC regions
- Inventory levels and competition
- Interest rate environment and predictions
- Seasonal buying patterns

## First-Time Home Buyer Programs in BC

### BC Home Owner Mortgage and Equity Partnership (BC HOME Partnership)
The BC HOME Partnership program provides eligible first-time home buyers with a loan for up to 5% of the home's purchase price, with no interest charges and no monthly payments required.

**Eligibility Requirements:**
- First-time home buyer in BC
- Canadian citizen or permanent resident
- Annual household income under $150,000
- Minimum 5% down payment from your own resources

### Property Transfer Tax Exemption
First-time home buyers in BC may be eligible for a full or partial exemption from property transfer tax on homes valued up to $835,000.

### First-Time Home Buyer Incentive (Federal)
This shared equity mortgage with the Government of Canada can help reduce your monthly mortgage payments.

## Down Payment Requirements and Sources

### Minimum Down Payment Rules
- 5% minimum for homes under $500,000
- 5% on first $500,000 + 10% on amount above $500,000
- 20% minimum for homes over $1 million

### Acceptable Down Payment Sources
- Personal savings
- Gifted funds from family members
- RRSP Home Buyers' Plan withdrawal
- Sale of assets

## The Pre-Approval Process

Getting pre-approved for a mortgage is your first step toward homeownership. Here's what to expect:

### Required Documentation
- Employment verification and income documents
- Bank statements and asset verification
- Credit report and score review
- Debt obligations assessment

### Benefits of Pre-Approval
- Know your budget before house hunting
- Stronger negotiating position with sellers
- Faster closing process
- Rate protection for 90-120 days

## Understanding Mortgage Options

### Fixed vs. Variable Rate Mortgages
**Fixed Rate Mortgages:**
- Predictable payments throughout the term
- Protection against rate increases
- Typically higher initial rates

**Variable Rate Mortgages:**
- Lower initial rates
- Payment amounts can fluctuate
- Potential for savings if rates decrease

### Mortgage Terms and Amortization
- Term: The length of your mortgage contract (typically 1-5 years)
- Amortization: Total time to pay off the mortgage (up to 25 years for first-time buyers with less than 20% down)

## Additional Costs to Consider

### Closing Costs (typically 1.5-3% of purchase price)
- Legal fees
- Home inspection
- Property transfer tax
- Title insurance
- Moving expenses

### Ongoing Homeownership Costs
- Property taxes
- Home insurance
- Utilities
- Maintenance and repairs
- Strata fees (if applicable)

## Tips for Success

1. **Start Early**: Begin saving and improving your credit score well before you plan to buy
2. **Get Professional Help**: Work with experienced professionals including a mortgage broker, realtor, and lawyer
3. **Stay Within Budget**: Don't max out your pre-approval amount
4. **Research Neighborhoods**: Consider commute times, schools, and future development
5. **Plan for the Unexpected**: Maintain an emergency fund after your purchase

## Common First-Time Buyer Mistakes to Avoid

- Shopping for homes before getting pre-approved
- Ignoring closing costs and moving expenses
- Not getting a professional home inspection
- Changing jobs during the mortgage process
- Taking on new debt before closing

## Working with a Mortgage Professional

A licensed mortgage broker can help you navigate the complex world of mortgage financing. Benefits include:

- Access to multiple lenders and products
- Expert guidance on program eligibility
- Assistance with complex financial situations
- Support throughout the entire process

---

## About the Author

**Varun Chaudhry** is a licensed mortgage broker with over 23 years of experience in the Canadian mortgage industry. Specializing in MLI Select, construction financing, and self-employed mortgages across BC, AB, and ON.

- **License**: BCFSA #M08001935
- **Office**: 301-1688 152nd Street, Surrey, BC V4A 4N2  
- **Phone**: [604-593-1550](tel:604-593-1550)
- **Specialties**: MLI Select Program, Construction Financing, Self-Employed Mortgages

*This article was last updated on January 15, 2025 and reflects current mortgage regulations and market conditions.*

---

## Ready to Get Started?

Every mortgage situation is unique. Contact Varun directly to discuss your specific needs and explore the best mortgage solutions for your circumstances.

**📞 [604-593-1550](tel:604-593-1550) | 📧 [varun@kraftmortgages.ca](mailto:varun@kraftmortgages.ca)**`,
      publishedAt: '2025-01-15',
      readTime: '12 min read',
      category: 'First Time Buyers',
      metaDescription: 'Complete 2025 guide for first-time home buyers in BC. Learn about programs, down payments, mortgage options, and insider tips from licensed broker Varun Chaudhry.',
      };
    }
    
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Kraft Mortgages',
    };
  }

  return {
    title: `${post.title} | Kraft Mortgages`,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Varun Chaudhry'],
    },
  };
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">Varun Chaudhry</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm">Licensed Mortgage Broker</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg prose-blue max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h1:text-3xl prose-h1:mb-8 prose-h1:mt-12
                prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10
                prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-strong:text-gray-900
                prose-ul:my-6 prose-li:my-2
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-blue-200 
                prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6
                prose-blockquote:rounded-r-lg prose-blockquote:my-8"
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br>').replace(/##? /g, '<h2>').replace(/<h2>/g, '</p><h2>').replace(/<\/h2>/g, '</h2><p>') 
              }}
            />
          </div>
        </div>
      </article>

      {/* Related/CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Have Questions About This Topic?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Every mortgage situation is unique. Get personalized advice from a licensed professional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:604-593-1550"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                📞 Call 604-593-1550
              </a>
              <a 
                href="mailto:varun@kraftmortgages.ca"
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                📧 Email Varun
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}