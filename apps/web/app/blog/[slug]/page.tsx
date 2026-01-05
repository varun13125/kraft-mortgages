import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';
import { getPost as getFsPost } from '@/lib/db/firestore';
import Navigation from '@/components/Navigation';
import { processPostContent, decodeHtmlEntities } from '@/lib/utils/blog-content';

// Auto-categorize based on content analysis (same logic as blog listing)
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

// Transform Google Sheets post to our component format
function transformGoogleSheetsPost(post: any) {
  if (!post) return null;

  // Parse JSON strings if they exist
  const tags = post.tags ? (typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : post.tags) : [];
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

  // Decode HTML entities in text fields (fixes &#39; from WordPress)
  const decodedTitle = decodeHtmlEntities(post.title || '');
  const decodedExcerpt = decodeHtmlEntities(post.excerpt || post.metaDescription || '');

  return {
    slug: post.slug || '',
    title: decodedTitle,
    content: content,
    excerpt: decodedExcerpt,
    author: post.author?.name || post.author || 'Varun Chaudhry',
    authorEmail: post.authoremail || 'varun@kraftmortgages.ca',
    publishedAt: post.publishedat || new Date().toISOString(),
    updatedAt: post.updatedat || post.publishedat || new Date().toISOString(),
    status: post.status || 'published',
    featured: post.featured === 'true' || post.featured === true,
    categories,
    tags,
    seo: {
      title: decodeHtmlEntities(post.seotitle || post.title || ''),
      description: decodeHtmlEntities(post.seodescription || post.excerpt || post.metaDescription || ''),
      keywords: post.seokeywords ? (typeof post.seokeywords === 'string' ? post.seokeywords.split(',').map((k: string) => k.trim()) : post.seokeywords) : tags,
      ogImage: post.seoimage || '/images/blog-default.jpg',
      canonicalUrl: post.seocanonicalurl || `https://kraftmortgages.ca/blog/${post.slug}`
    },
    readingTime: parseInt(post.readingtime) || Math.ceil(content.length / 1000),
    brief: post.brief
  };
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const rawPost = await getFsPost(params.slug);
  const post = transformGoogleSheetsPost(rawPost);

  if (!post) {
    return {
      title: 'Post Not Found | Kraft Mortgages',
    };
  }

  return {
    title: post.seo.title || `${post.title} | Kraft Mortgages`,
    description: post.seo.description,
    keywords: post.seo.keywords.join(', '),
    openGraph: {
      title: post.seo.title || post.title,
      description: post.seo.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: post.seo.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.title || post.title,
      description: post.seo.description,
      images: [post.seo.ogImage],
    },
    alternates: {
      canonical: post.seo.canonicalUrl,
    },
  };
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const rawPost = await getFsPost(params.slug);
  const post = transformGoogleSheetsPost(rawPost);

  if (!post) {
    notFound();
  }

  // Process content to handle image placeholders
  const processedContent = processPostContent(post.content);

  const publishedDate = new Date(post.publishedAt);
  const updatedDate = new Date(post.updatedAt);

  return (
    <>
      {/* Navigation Component */}
      <Navigation />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.seo.ogImage,
            author: {
              '@type': 'Person',
              name: post.author,
              email: post.authorEmail,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Kraft Mortgages',
              logo: {
                '@type': 'ImageObject',
                url: 'https://kraftmortgages.ca/kraft-logo.png',
              },
            },
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': post.seo.canonicalUrl,
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              {/* Categories */}
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categories.map((category: string) => (
                  <span
                    key={category}
                    className="bg-gold-500/20 text-gold-300 px-3 py-1 rounded-full text-sm font-medium border border-gold-500/30"
                  >
                    {category}
                  </span>
                ))}
                {post.featured && (
                  <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium border border-yellow-500/30">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium text-gray-100">{typeof post.author === 'string' ? post.author : post.author.name}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm">Licensed Mortgage Broker</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{publishedDate.toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg prose-invert max-w-none
                prose-headings:font-bold prose-headings:text-gray-100
                prose-h1:text-3xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:text-gray-100
                prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-gray-100
                prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-gray-100
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-strong:text-gray-100 prose-strong:font-semibold
                prose-ul:my-6 prose-li:my-2 prose-li:text-gray-300
                prose-a:text-gold-400 prose-a:no-underline hover:prose-a:text-gold-300 prose-a:font-medium
                prose-blockquote:border-l-4 prose-blockquote:border-gold-500/50
                prose-blockquote:bg-gray-800/50 prose-blockquote:py-4 prose-blockquote:px-6
                prose-blockquote:rounded-r-lg prose-blockquote:my-8 prose-blockquote:text-gray-300
                prose-code:text-gold-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
                prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
                prose-hr:border-gray-700
                [&>button]:bg-gold-500 [&>button]:hover:bg-gold-400 [&>button]:text-gray-900 [&>button]:font-semibold [&>button]:px-4 [&>button]:py-2 [&>button]:rounded-lg [&>button]:transition-colors
                [&>button]:cursor-pointer [&>button]:inline-flex [&>button]:items-center [&>button]:justify-center
                [&>em_small]:text-gray-500 [&>em_small]:text-sm [&>em_small]:italic
                [&>img]:w-full [&>img]:rounded-lg [&>img]:shadow-lg [&>img]:my-6
                [&>h1]:text-gray-100 [&>h2]:text-gray-100 [&>h3]:text-gray-100">
                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-300 font-medium">Tags:</span>
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-700/50 transition-colors border border-gray-600/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Info */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl">
                      {typeof post.author === 'string' ? post.author.split(' ').map((n: string) => n[0]).join('') : post.author.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 mb-2">
                        About {typeof post.author === 'string' ? post.author : post.author.name}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Licensed mortgage broker with over 18 years of experience in the Canadian mortgage industry.
                        Specializing in MLI Select, construction financing, and self-employed mortgages across BC, AB, and ON.
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>📧 {post.authorEmail}</span>
                        <span>🏢 BCFSA #M08001935</span>
                        <span>📍 Surrey, BC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Contact CTA Section */}
        <section className="bg-gradient-to-r from-gold-500/10 to-amber-600/10 border border-gold-500/20 backdrop-blur-sm py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Contact Kraft Mortgages for expert mortgage advice:
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-100 mb-4">📞 Call Us</h3>
                  <p className="text-gray-400 mb-2">Office: <a href="tel:604-593-1550" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">604-593-1550</a></p>
                  <p className="text-gray-400">Mobile: <a href="tel:604-727-1579" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">604-727-1579</a></p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-100 mb-4">✉️ Email & Online</h3>
                  <p className="text-gray-400 mb-2">Email: <a href="mailto:varun@kraftmortgages.ca" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">varun@kraftmortgages.ca</a></p>
                  <p className="text-gray-400">Apply: <a href="https://r.mtg-app.com/varun-chaudhry" className="text-gold-400 hover:text-gold-300 font-medium transition-colors" target="_blank" rel="noopener noreferrer">Online Application</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}