import { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getPost as getFsPost } from '@/lib/db/firestore';
import Navigation from '@/components/Navigation';

// Transform Google Sheets post to our component format
function transformGoogleSheetsPost(post: any) {
  if (!post) return null;
  
  // Parse JSON strings if they exist
  const tags = post.tags ? (typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : post.tags) : [];
  const categories = post.categories ? (typeof post.categories === 'string' ? JSON.parse(post.categories || '[]') : post.categories) : ['Mortgage Advice'];
  
  return {
    slug: post.slug || '',
    title: post.title || '',
    content: post.content || '',
    excerpt: post.excerpt || '',
    author: post.author?.name || post.author || 'Varun Chaudhry',
    authorEmail: post.authoremail || 'varun@kraftmortgages.ca',
    publishedAt: post.publishedat || new Date().toISOString(),
    updatedAt: post.updatedat || post.publishedat || new Date().toISOString(),
    status: post.status || 'published',
    featured: post.featured === 'true' || post.featured === true,
    categories,
    tags,
    seo: {
      title: post.seotitle || post.title || '',
      description: post.seodescription || post.excerpt || '',
      keywords: post.seokeywords ? (typeof post.seokeywords === 'string' ? post.seokeywords.split(',').map((k: string) => k.trim()) : post.seokeywords) : tags,
      ogImage: post.seoimage || '/images/blog-default.jpg',
      canonicalUrl: post.seocanonicalurl || `https://kraftmortgages.ca/blog/${post.slug}`
    },
    readingTime: parseInt(post.readingtime) || Math.ceil((post.content || '').length / 1000),
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
              
              {/* Categories */}
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categories.map((category: string) => (
                  <span 
                    key={category}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
                {post.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{post.author}</span>
                  <span className="text-gray-400">•</span>
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
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg prose-blue max-w-none
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
                prose-blockquote:rounded-r-lg prose-blockquote:my-8">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
              
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 font-medium">Tags:</span>
                    {post.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Author Info */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {post.author.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        About {post.author}
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Licensed mortgage broker with over 23 years of experience in the Canadian mortgage industry. 
                        Specializing in MLI Select, construction financing, and self-employed mortgages across BC, AB, and ON.
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Contact Kraft Mortgages for expert mortgage advice:
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="font-bold mb-4">📞 Call Us</h3>
                  <p className="mb-2">Office: <a href="tel:604-593-1550" className="hover:underline font-medium">604-593-1550</a></p>
                  <p>Mobile: <a href="tel:604-727-1579" className="hover:underline font-medium">604-727-1579</a></p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="font-bold mb-4">✉️ Email & Online</h3>
                  <p className="mb-2">Email: <a href="mailto:varun@kraftmortgages.ca" className="hover:underline font-medium">varun@kraftmortgages.ca</a></p>
                  <p>Apply: <a href="https://r.mtg-app.com/varun-chaudhry" className="hover:underline font-medium" target="_blank" rel="noopener noreferrer">Online Application</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}