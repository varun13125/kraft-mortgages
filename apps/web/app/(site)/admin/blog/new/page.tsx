'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  X,
  Plus,
  Tag,
  Calendar,
  User,
  Globe,
  FileText,
  Settings
} from 'lucide-react';
import { BlogPost } from '@/lib/types/blog';

// Rich text editor component (simplified for demo)
function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
}) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 text-sm font-medium rounded ${
              !isPreview 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 text-sm font-medium rounded ${
              isPreview 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Preview
          </button>
        </div>
        <span className="text-xs text-gray-500">Markdown supported</span>
      </div>
      
      {isPreview ? (
        <div className="p-4 min-h-[400px] prose max-w-none">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br>') }} />
          ) : (
            <p className="text-gray-500 italic">Nothing to preview yet...</p>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[400px] p-4 border-none focus:ring-0 resize-none"
          style={{ outline: 'none' }}
        />
      )}
    </div>
  );
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    author: 'Varun Chaudhry',
    authorEmail: 'varun@kraftmortgages.ca',
    status: 'draft',
    featured: false,
    categories: [],
    tags: [],
    seo: {
      title: '',
      description: '',
      keywords: [],
      ogImage: '/images/blog-default.jpg',
      canonicalUrl: ''
    }
  });
  
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    setSaving(true);
    try {
      // Generate slug from title
      const slug = post.title?.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 60);

      const postToSave = {
        ...post,
        slug,
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString(),
        readingTime: Math.ceil((post.content?.length || 0) / 1000),
        seo: {
          ...post.seo,
          title: post.seo?.title || post.title,
          description: post.seo?.description || post.excerpt,
          canonicalUrl: post.seo?.canonicalUrl || `https://kraftmortgages.ca/blog/${slug}`
        }
      };

      // TODO: Implement actual save API call
      console.log('Saving post:', postToSave);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (status === 'published') {
        router.push('/admin/blog');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !post.tags?.includes(newTag.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const addCategory = () => {
    if (newCategory.trim() && !post.categories?.includes(newCategory.trim())) {
      setPost(prev => ({
        ...prev,
        categories: [...(prev.categories || []), newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setPost(prev => ({
      ...prev,
      categories: prev.categories?.filter(cat => cat !== categoryToRemove) || []
    }));
  };

  const suggestedCategories = [
    'Mortgage Advice',
    'Market Updates',
    'First-Time Buyers',
    'Self-Employed',
    'Investment Properties',
    'Refinancing',
    'Canadian Real Estate'
  ];

  const suggestedTags = [
    'mortgage-rates',
    'home-buying',
    'first-time-buyer',
    'self-employed',
    'refinancing',
    'investment-property',
    'market-update',
    'canadian-mortgages',
    'mortgage-approval',
    'down-payment'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blog"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
                <p className="text-gray-600">Create and publish your mortgage insights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={saving || !post.title || !post.content}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                Publish
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <nav className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'content'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'seo'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  SEO
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Title
                  </label>
                  <input
                    type="text"
                    value={post.title || ''}
                    onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your blog post title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt (Meta Description)
                  </label>
                  <textarea
                    value={post.excerpt || ''}
                    onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of your post (155 characters max for SEO)..."
                    rows={3}
                    maxLength={155}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {(post.excerpt?.length || 0)}/155 characters
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <MarkdownEditor
                    value={post.content || ''}
                    onChange={(value) => setPost(prev => ({ ...prev, content: value }))}
                    placeholder="Write your blog post content here. Markdown is supported..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">SEO Optimization</h3>
                  <p className="text-sm text-blue-800">
                    Optimize your post for search engines by customizing these fields. 
                    If left empty, they will be automatically generated from your content.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={post.seo?.title || ''}
                    onChange={(e) => setPost(prev => ({ 
                      ...prev, 
                      seo: { ...prev.seo!, title: e.target.value }
                    }))}
                    placeholder={post.title || 'Will use post title if empty'}
                    maxLength={60}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {(post.seo?.title?.length || 0)}/60 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={post.seo?.description || ''}
                    onChange={(e) => setPost(prev => ({ 
                      ...prev, 
                      seo: { ...prev.seo!, description: e.target.value }
                    }))}
                    placeholder={post.excerpt || 'Will use excerpt if empty'}
                    rows={3}
                    maxLength={155}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {(post.seo?.description?.length || 0)}/155 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Focus Keywords
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add SEO keyword..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Current Keywords */}
                    {post.seo?.keywords && post.seo.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.seo.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => {
                                setPost(prev => ({
                                  ...prev,
                                  seo: {
                                    ...prev.seo!,
                                    keywords: prev.seo?.keywords?.filter((_, i) => i !== index) || []
                                  }
                                }));
                              }}
                              className="ml-1 hover:text-blue-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Suggested Keywords */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Suggested keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags
                          .filter(tag => !post.seo?.keywords?.includes(tag))
                          .slice(0, 8)
                          .map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setPost(prev => ({
                                  ...prev,
                                  seo: {
                                    ...prev.seo!,
                                    keywords: [...(prev.seo?.keywords || []), tag]
                                  }
                                }));
                              }}
                              className="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                            >
                              {tag}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Author Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Author Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={post.author || ''}
                        onChange={(e) => setPost(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author Email
                      </label>
                      <input
                        type="email"
                        value={post.authorEmail || ''}
                        onChange={(e) => setPost(prev => ({ ...prev, authorEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Categories
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                        placeholder="Add category..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addCategory}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Current Categories */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.categories.map((category) => (
                          <span
                            key={category}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => removeCategory(category)}
                              className="ml-1 hover:text-green-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Suggested Categories */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Suggested categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedCategories
                          .filter(cat => !post.categories?.includes(cat))
                          .map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => {
                                setPost(prev => ({
                                  ...prev,
                                  categories: [...(prev.categories || []), category]
                                }));
                              }}
                              className="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                            >
                              {category}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Tags
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tag..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Current Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-blue-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Suggested Tags */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags
                          .filter(tag => !post.tags?.includes(tag))
                          .slice(0, 10)
                          .map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setPost(prev => ({
                                  ...prev,
                                  tags: [...(prev.tags || []), tag]
                                }));
                              }}
                              className="px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                            >
                              {tag}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={post.featured || false}
                        onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured Post</span>
                    </label>
                    <p className="text-sm text-gray-500 ml-7">
                      Featured posts appear prominently on the blog homepage
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}