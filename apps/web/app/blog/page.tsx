import { Metadata } from 'next';
// ISR: re-render at most every 5 minutes instead of hitting Firestore on every
// view (was force-dynamic). getRecentPosts() needs no request data (no cookies/
// headers) and falls back to the built-in posts when Firestore is unavailable, so
// prerendering at build is safe. Newly published posts appear within ~5 minutes.
export const revalidate = 300;
import Link from 'next/link';
import { Calendar, User, ArrowRight, Clock, Tag, Star, Mail, Phone, FileText } from 'lucide-react';
import { getRecentPosts } from '@/lib/db/firestore';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { OG_DEFAULTS } from '@/lib/seo/og';
import { ORG_ID } from '@/lib/seo/jsonld';
import { generateExcerpt, decodeHtmlEntities } from '@/lib/utils/blog-content';

export const metadata: Metadata = {
  title: 'Mortgage Blog | Expert Advice & Rates | Kraft Mortgages',
  description: 'Mortgage advice, BC rate updates & homebuying guides from licensed broker Varun Chaudhry. $2B+ funded. Updated weekly.',
  keywords: 'Surrey mortgage broker blog, mortgage advice BC, mortgage rates Surrey, home buying tips Surrey, BC mortgage news, first-time buyer guide Surrey',
  alternates: {
    canonical: 'https://www.kraftmortgages.ca/blog',
  },
  openGraph: {
    // OG_DEFAULTS supplies the site share image — /images/blog-default.jpg never existed.
    ...OG_DEFAULTS,
    title: 'Surrey Mortgage Broker Blog | Expert Advice & Rates | Kraft Mortgages',
    description: 'Expert mortgage advice and market insights from licensed broker Varun Chaudhry.',
    url: 'https://www.kraftmortgages.ca/blog',
  },
};

// Auto-categorize based on content analysis (same logic as ingest API)
function autoCategories(title: string, content: string): string[] {
  const text = (title + ' ' + content).toLowerCase();
  const categories: string[] = [];

  // Topic-based categories
  if (text.includes('mli select') || text.includes('cmhc') || text.includes('multi-unit')) {
    categories.push('MLI Select');
  }
  if (text.includes('construction') || text.includes('builder') || text.includes('draw mortgage')) {
    categories.push('Construction Financing');
  }
  if (text.includes('self-employed') || text.includes('self employed') || text.includes('business owner')) {
    categories.push('Self-Employed Mortgages');
  }
  if (text.includes('renewal') || text.includes('renew') || text.includes('refinance')) {
    categories.push('Mortgage Renewals');
  }
  if (text.includes('first-time') || text.includes('first time buyer') || text.includes('first home')) {
    categories.push('First-Time Buyers');
  }
  if (text.includes('bank of canada') || text.includes('interest rate') || text.includes('rate cut') || text.includes('rate hold')) {
    categories.push('Market Commentary');
  }

  // Location-based categories
  if (text.includes('surrey')) categories.push('Surrey Real Estate');
  if (text.includes('burnaby')) categories.push('Burnaby Real Estate');
  if (text.includes('coquitlam')) categories.push('Coquitlam Real Estate');
  if (text.includes('vancouver') && !text.includes('surrey') && !text.includes('burnaby')) categories.push('Vancouver Real Estate');
  if (text.includes('abbotsford') || text.includes('fraser valley')) categories.push('Fraser Valley Real Estate');
  if (text.includes('kelowna')) categories.push('Kelowna Real Estate');
  if (text.includes('kamloops')) categories.push('Kamloops Real Estate');

  if (categories.length === 0) return ['Mortgage Advice'];
  return categories.slice(0, 2);
}

// Normalize Firestore post to page format
function transformPost(post: any) {
  if (!post) return null;

  const tags = post.keywords || [];
  const content = post.markdown || post.content || '';

  // Parse existing categories or auto-generate from content
  let categories: string[] = [];
  if (post.categories) {
    categories = typeof post.categories === 'string' ? JSON.parse(post.categories || '[]') : post.categories;
  }
  // If no valid categories or contains "Uncategorized", auto-categorize
  if (!categories.length || categories.includes('Uncategorized') || categories.includes('uncategorized')) {
    categories = autoCategories(post.title || '', content);
  }

  // Generate dynamic excerpt from content (25-30 words)
  const dynamicExcerpt = generateExcerpt(content, 30);

  // Decode HTML entities in text fields (fixes &#39; from WordPress)
  const decodedTitle = decodeHtmlEntities(post.title || '');
  const decodedExcerpt = decodeHtmlEntities(post.metaDescription || post.excerpt || dynamicExcerpt);

  return {
    slug: post.slug || '',
    title: decodedTitle,
    excerpt: decodedExcerpt,
    author: post.author?.name || post.author || 'Varun Chaudhry',
    authorEmail: post.authoremail || 'varun@kraftmortgages.ca',
    publishedAt: (new Date(post.publishedAt || post.publishedat || new Date())),
    updatedAt: (new Date(post.updatedAt || post.updatedat || post.publishedAt || post.publishedat || new Date())),
    status: post.status || 'published',
    featured: post.featured === 'true' || post.featured === true || false,
    categories,
    tags,
    seo: {
      title: decodeHtmlEntities(post.seotitle || post.title || ''),
      description: decodeHtmlEntities(post.seodescription || dynamicExcerpt),
      keywords: post.seokeywords ? (typeof post.seokeywords === 'string' ? post.seokeywords.split(',').map((k: string) => k.trim()) : post.seokeywords) : tags,
      ogImage: post.seoimage || '/images/blog-default.jpg',
      canonicalUrl: post.seocanonicalurl || `https://www.kraftmortgages.ca/blog/${post.slug}`
    },
    readingTime: parseInt(post.readingtime) || Math.ceil((content.length) / 1000) || 5,
    brief: post.brief
  };
}

export default async function BlogPage() {
  const fsPosts = await getRecentPosts(100);
  // getRecentPosts() does not filter by status, so drafts were listed publicly.
  const posts = (fsPosts || [])
    .filter((p: any) => p && p.status !== 'draft')
    .map(transformPost)
    .filter(Boolean); // Filter out null posts
  // Only the first two featured posts get the large cards; any further featured
  // posts used to disappear entirely (excluded from both lists).
  const featuredPosts = posts.filter(post => post?.featured).slice(0, 2);
  const regularPosts = posts.filter(post => !featuredPosts.includes(post));

  return (
    <>
      {/* Navigation Component */}
      <Navigation />

      {/* Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Kraft Mortgages Blog',
            description: 'Expert mortgage advice and market insights from licensed broker Varun Chaudhry',
            url: 'https://www.kraftmortgages.ca/blog',
            author: {
              '@type': 'Person',
              name: 'Varun Chaudhry',
              email: 'varun@kraftmortgages.ca',
              jobTitle: 'Licensed Mortgage Broker',
              worksFor: { '@id': ORG_ID },
            },
            publisher: { '@id': ORG_ID },
          }),
        }}
      />

      <main id="main-content" className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <section className="py-20 px-4 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                Mortgage Insights & Market Updates
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent"> Expert Advice</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
                Expert advice from 18+ years of combined experience in the Canadian mortgage industry. Navigate complex scenarios with industry-leading expertise.
              </p>
              <div className="flex items-center justify-center gap-4 text-gray-400 mb-8">
                <User className="w-5 h-5" />
                <span>Varun Chaudhry, Licensed Mortgage Broker</span>
                <span className="text-gray-600">•</span>
                <span>BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30">
                <Star className="w-3 h-3" />
                Featured Insights
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-12">
                <Star className="w-6 h-6 text-gold-400" />
                <h2 className="text-3xl font-bold text-gray-100">Featured Articles</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => post && (
                  <article
                    key={post?.slug || 'featured-' + Math.random()}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Star className="w-4 h-4 text-gold-400" />
                        <span className="text-gold-400 font-medium text-sm">Featured</span>
                        {post?.categories?.map((category: string) => (
                          <span
                            key={category}
                            className="bg-gold-500/20 text-gold-300 px-3 py-1 rounded-full text-sm font-medium ml-2 border border-gold-500/30"
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-2xl font-bold text-gray-100 mb-4">
                        <Link
                          href={`/blog/${post?.slug}`}
                          className="hover:text-gold-400 transition-colors"
                        >
                          {post?.title}
                        </Link>
                      </h3>

                      <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                        {post?.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{post?.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-CA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Date TBD'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post?.readingTime || 5} min read</span>
                          </div>
                        </div>
                      </div>


                      <Link
                        href={`/blog/${post?.slug}`}
                        className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors group"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Regular Blog Posts Grid */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                  <FileText className="w-4 h-4" />
                  Blog Coming Soon
                </div>
                <h2 className="text-3xl font-bold text-gray-100 mb-4">Stay Tuned for Expert Insights</h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
                  Our automated blog content system is being set up with professional insights.
                  Fresh mortgage advice and market updates will be published here regularly.
                </p>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 max-w-2xl mx-auto mb-8">
                  <h3 className="text-xl font-bold text-gray-100 mb-4">
                    Need Mortgage Advice Right Now?
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Don&apos;t wait for the next blog post. Get personalized mortgage guidance today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="tel:604-593-1550"
                      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-amber-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      604-593-1550
                    </a>
                    <a
                      href="mailto:varun@kraftmortgages.ca"
                      className="inline-flex items-center justify-center px-6 py-3 border border-gold-500/50 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      varun@kraftmortgages.ca
                    </a>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-4">First blog post coming soon!</p>
                  <div className="inline-flex items-center gap-2 text-gold-400">
                    <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Setting up content...</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-12">
                  <FileText className="w-6 h-6 text-gold-400" />
                  <h2 className="text-3xl font-bold text-gray-100">Latest Articles</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => post && (
                    <article
                      key={post?.slug || 'post-' + Math.random()}
                      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {post?.categories?.map((category: string) => (
                            <span
                              key={category}
                              className="bg-gold-500/20 text-gold-300 px-3 py-1 rounded-full text-sm font-medium border border-gold-500/30"
                            >
                              {category}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-xl font-bold text-gray-100 mb-3 line-clamp-2">
                          <Link
                            href={`/blog/${post?.slug}`}
                            className="hover:text-gold-400 transition-colors"
                          >
                            {post?.title}
                          </Link>
                        </h3>

                        <p className="text-gray-400 mb-4 line-clamp-3">
                          {post?.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{post?.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-CA', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'Date TBD'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post?.readingTime || 5} min</span>
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/blog/${post?.slug}`}
                          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors group"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">
                Ready to Discuss Your Mortgage Needs?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Every situation is unique. Get personalized advice from a licensed professional with 18+ years of combined experience.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-100 mb-2">📞 Call Direct</h3>
                  <p className="text-gray-400 mb-3">Speak with Varun directly</p>
                  <a
                    href="tel:604-593-1550"
                    className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                  >
                    604-593-1550
                  </a>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-100 mb-2">📧 Email</h3>
                  <p className="text-gray-400 mb-3">Get detailed responses</p>
                  <a
                    href="mailto:varun@kraftmortgages.ca"
                    className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                  >
                    varun@kraftmortgages.ca
                  </a>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-100 mb-2">🌐 Apply Online</h3>
                  <p className="text-gray-400 mb-3">Start your application</p>
                  <a
                    href="https://r.mtg-app.com/varun-chaudhry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}