import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Clock, Tag, Star } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase.client';
import { BlogPostListItem } from '@/lib/types/blog';

export const metadata: Metadata = {
  title: 'Mortgage Insights Blog | Kraft Mortgages',
  description: 'Expert mortgage advice, market insights, and Canadian homebuying tips from licensed broker Varun Chaudhry with 23+ years experience.',
  keywords: 'mortgage advice, Canadian mortgages, home buying, mortgage broker, BC mortgages, Alberta mortgages, Ontario mortgages',
  openGraph: {
    title: 'Mortgage Insights Blog | Kraft Mortgages',
    description: 'Expert mortgage advice and market insights from licensed broker Varun Chaudhry.',
    type: 'website',
    url: 'https://kraftmortgages.ca/blog',
    images: [
      {
        url: 'https://kraftmortgages.ca/images/blog-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Kraft Mortgages Blog',
      },
    ],
  },
};

// Fetch published blog posts from blog_posts collection
async function getBlogPosts(): Promise<BlogPostListItem[]> {
  try {
    const postsQuery = query(
      collection(db, 'blog_posts'),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(12)
    );
    
    const querySnapshot = await getDocs(postsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        slug: doc.id,
        title: data.title || '',
        excerpt: data.excerpt || '',
        publishedAt: data.publishedAt || new Date().toISOString(),
        readingTime: data.readingTime || Math.ceil((data.content || '').length / 1000),
        tags: data.tags || [],
        featured: data.featured || false,
        categories: data.categories || ['Mortgage Advice'],
      };
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    // Fallback to empty array - n8n will populate this
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <>
      {/* Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Kraft Mortgages Blog',
            description: 'Expert mortgage advice and market insights from licensed broker Varun Chaudhry',
            url: 'https://kraftmortgages.ca/blog',
            author: {
              '@type': 'Person',
              name: 'Varun Chaudhry',
              email: 'varun@kraftmortgages.ca',
              jobTitle: 'Licensed Mortgage Broker',
              worksFor: {
                '@type': 'Organization',
                name: 'Kraft Mortgages',
              },
            },
            publisher: {
              '@type': 'Organization',
              name: 'Kraft Mortgages',
              logo: {
                '@type': 'ImageObject',
                url: 'https://kraftmortgages.ca/kraft-logo.png',
              },
            },
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Mortgage Insights & Market Updates
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Expert advice from 23+ years in the Canadian mortgage industry
              </p>
              <div className="flex items-center justify-center gap-4 text-blue-200">
                <User className="w-5 h-5" />
                <span>Varun Chaudhry, Licensed Mortgage Broker</span>
                <span className="text-blue-300">•</span>
                <span>BCFSA #M08001935</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-2 mb-8">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <article 
                      key={post.slug}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-600 font-medium text-sm">Featured</span>
                          {post.categories.map((category) => (
                            <span 
                              key={category}
                              className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-medium ml-2"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-6 text-lg">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.publishedAt).toLocaleDateString('en-CA', {
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readingTime} min read</span>
                            </div>
                          </div>
                        </div>
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.slice(0, 4).map((tag) => (
                              <span 
                                key={tag}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regular Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
                  <p className="text-gray-600 mb-8">
                    Our automated blog content system is being set up. 
                    Fresh mortgage insights and market updates will be published here regularly.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">
                      Need Mortgage Advice Right Now?
                    </h3>
                    <p className="text-blue-800 mb-4">
                      Don't wait for the next blog post. Get personalized mortgage guidance today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="tel:604-593-1550"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        📞 604-593-1550
                      </a>
                      <a 
                        href="mailto:varun@kraftmortgages.ca"
                        className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                      >
                        📧 varun@kraftmortgages.ca
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post) => (
                      <article 
                        key={post.slug}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {post.categories.map((category) => (
                              <span 
                                key={category}
                                className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-medium"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                            <Link 
                              href={`/blog/${post.slug}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(post.publishedAt).toLocaleDateString('en-CA', {
                                  year: 'numeric',
                                  month: 'short', 
                                  day: 'numeric'
                                })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{post.readingTime} min</span>
                              </div>
                            </div>
                          </div>
                          
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span 
                                  key={tag}
                                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Discuss Your Mortgage Needs?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Every situation is unique. Get personalized advice from a licensed professional with over two decades of experience.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">📞 Call Direct</h3>
                  <p className="text-gray-600 mb-3">Speak with Varun directly</p>
                  <a 
                    href="tel:604-593-1550"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    604-593-1550
                  </a>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">📧 Email</h3>
                  <p className="text-gray-600 mb-3">Get detailed responses</p>
                  <a 
                    href="mailto:varun@kraftmortgages.ca"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    varun@kraftmortgages.ca
                  </a>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">🌐 Apply Online</h3>
                  <p className="text-gray-600 mb-3">Start your application</p>
                  <a 
                    href="https://r.mtg-app.com/varun-chaudhry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}