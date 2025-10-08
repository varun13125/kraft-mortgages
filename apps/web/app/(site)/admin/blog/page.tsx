'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  Star,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock
} from 'lucide-react';
import { BlogPost, BlogPostListItem } from '@/lib/types/blog';

// Mock data for development - replace with actual API calls
const mockPosts: BlogPostListItem[] = [
  {
    slug: 'beyond-big-banks-complex-mortgage-approval',
    title: 'Beyond the Big Banks: How We Get Complex Files Approved Post-Stress Test',
    excerpt: 'We specialize in helping self-employed business owners and new Canadians get mortgage approval when traditional banks say no. Learn our expert strategies for passing the stress test.',
    publishedAt: '2025-10-08T10:00:00Z',
    readingTime: 8,
    tags: ['stress-test', 'self-employed', 'mortgage-approval', 'complex-files', 'alternative-lenders'],
    featured: true,
    categories: ['Mortgage Advice', 'Self-Employed', 'Mortgage Approval']
  },
  {
    slug: 'first-time-buyer-guide-2024',
    title: 'Complete First-Time Home Buyer Guide for Canada 2024',
    excerpt: 'Everything you need to know about buying your first home in Canada, from mortgage pre-approval to closing day.',
    publishedAt: '2024-01-15T10:00:00Z',
    readingTime: 12,
    tags: ['first-time-buyer', 'canadian-mortgages', 'home-buying'],
    featured: false,
    categories: ['Home Buying', 'First-Time Buyers']
  },
  {
    slug: 'mortgage-rates-january-2024',
    title: 'Canadian Mortgage Rates Update: January 2024',
    excerpt: 'Current mortgage rates across Canada and what they mean for your home buying decisions.',
    publishedAt: '2024-01-10T09:00:00Z',
    readingTime: 8,
    tags: ['mortgage-rates', 'market-update', 'canada'],
    featured: false,
    categories: ['Market Updates', 'Mortgage Rates']
  },
  {
    slug: 'self-employed-mortgage-tips',
    title: 'Getting a Mortgage When Self-Employed: Expert Tips',
    excerpt: 'How self-employed borrowers can qualify for competitive mortgage rates in Canada.',
    publishedAt: '2024-01-08T14:30:00Z',
    readingTime: 10,
    tags: ['self-employed', 'mortgage-approval', 'documentation'],
    featured: false,
    categories: ['Self-Employed', 'Mortgage Approval']
  }
];

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      selectedFilter === 'all' ? true :
      selectedFilter === 'featured' ? post.featured :
      selectedFilter === 'published' ? true : // All mock posts are published
      selectedFilter === 'draft' ? false : true;

    return matchesSearch && matchesFilter;
  });

  const handleDeletePost = (slug: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.slug !== slug));
    }
  };

  const toggleFeatured = (slug: string) => {
    setPosts(posts.map(post => 
      post.slug === slug 
        ? { ...post, featured: !post.featured }
        : post
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
              <p className="text-gray-600 mt-1">Manage your blog posts and content</p>
            </div>
            <Link
              href="/admin/blog/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Post
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Edit className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900">{posts.filter(p => p.featured).length}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Posts</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Title</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Categories</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Published</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Reading Time</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      {searchTerm ? 'No posts match your search.' : 'No posts found.'}
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.slug} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {post.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900 line-clamp-1">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                              {post.excerpt}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Published
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {post.categories.map((category) => (
                            <span
                              key={category}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(post.publishedAt).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {post.readingTime} min
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Post"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => toggleFeatured(post.slug)}
                            className={`p-2 transition-colors ${
                              post.featured
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : 'text-gray-400 hover:text-yellow-500'
                            }`}
                            title={post.featured ? 'Remove from Featured' : 'Add to Featured'}
                          >
                            <Star className={`w-4 h-4 ${post.featured ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.slug)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}