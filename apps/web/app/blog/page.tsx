import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mortgage Insights Blog | Kraft Mortgages',
  description: 'Expert mortgage advice, market insights, and Canadian homebuying tips from licensed broker Varun Chaudhry.',
};

import { getRecentPosts } from '@/lib/db/firestore';

// Fetch posts from Firestore database
async function getBlogPosts() {
  try {
    const posts = await getRecentPosts(20);
    
    return posts.map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.metaDescription || post.title,
      publishedAt: post.publishedAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
      readTime: `${Math.ceil(post.markdown?.length / 1000 || 5)} min read`,
      category: 'Mortgage Insights',
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    // Fallback to sample posts if Firestore fails
    return [
      {
        slug: 'first-time-home-buyer-guide-bc-2025',
        title: 'Complete First-Time Home Buyer Guide for BC 2025',
        excerpt: 'Everything you need to know about buying your first home in British Columbia, including programs, grants, and insider tips from 23+ years in the industry.',
        publishedAt: '2025-01-15',
        readTime: '12 min read',
        category: 'First Time Buyers',
      },
      {
        slug: 'construction-mortgage-financing-guide',
        title: 'Construction Mortgage Financing: A Complete Guide',
        excerpt: 'Navigate construction loans with confidence. Learn about draw schedules, interest calculations, and how to secure the best rates for your build.',
        publishedAt: '2025-01-10',
        readTime: '8 min read',
        category: 'Construction',
      },
      {
        slug: 'self-employed-mortgage-strategies-2025',
        title: 'Self-Employed Mortgage Strategies That Work in 2025',
        excerpt: 'Proven strategies for self-employed professionals to secure competitive mortgage rates, even with non-traditional income documentation.',
        publishedAt: '2025-01-05',
        readTime: '10 min read',
        category: 'Self-Employed',
      }
    ];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
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

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.slug}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-3">
                      <span className="bg-blue-100 px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.publishedAt).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric'
                          })}</span>
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors"
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:604-593-1550"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                📞 604-593-1550
              </a>
              <a 
                href="mailto:varun@kraftmortgages.ca"
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                📧 varun@kraftmortgages.ca
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}