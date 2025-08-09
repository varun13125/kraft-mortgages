import type { Run } from '@/lib/db/firestore';
import { savePost } from '@/lib/db/firestore';
import { log } from '@/lib/runlog';
import { buildArticleJsonLd } from '@/lib/seo/schema';

interface PublishData {
  url: string;
  method: 'wordpress' | 'firestore';
  publishedAt: string;
}

export async function publishStage(run: Run): Promise<{ success: boolean; data?: PublishData; error?: string }> {
  try {
    await log(run.id, 'Publisher: Publishing content...');

    const editor = run.final;
    const brief = run.brief;
    const gate = run.gate;
    
    if (!editor?.finalMarkdown || !brief) {
      throw new Error('Editor and brief data required for publish stage');
    }

    const { finalMarkdown } = editor;
    const { title, slug, metaDescription, faq = [] } = brief;

    // Convert [n] citation markers to proper links
    let processedMarkdown = finalMarkdown;
    const sources = run.scout?.sources || [];
    
    sources.forEach((source: any, index) => {
      const citationRegex = new RegExp(`\\[${index + 1}\\]`, 'g');
      processedMarkdown = processedMarkdown.replace(
        citationRegex, 
        `[[${index + 1}]](${source.url} "${source.title}")`
      );
    });

    // Convert markdown to HTML (basic conversion)
    const htmlContent = markdownToHtml(processedMarkdown);

    // Generate schema.org JSON-LD
    const jsonLd = buildArticleJsonLd({
      title,
      description: metaDescription || '',
      content: finalMarkdown,
      author: 'Varun Chaudhry',
      url: `https://www.kraftmortgages.ca/blog/${slug}`,
      publishedDate: new Date().toISOString(),
      faq: faq.map(q => ({ question: q, answer: 'Contact us for personalized guidance.' }))
    });

    let publishUrl: string;
    let publishMethod: 'wordpress' | 'firestore' = 'firestore';

    // Try WordPress first if configured
    if (process.env.WORDPRESS_BASE_URL && process.env.WORDPRESS_USERNAME && process.env.WORDPRESS_APP_PASSWORD) {
      try {
        await log(run.id, 'Publisher: Attempting WordPress publication...');
        publishUrl = await publishToWordPress({
          title,
          slug,
          content: htmlContent,
          metaDescription,
          categories: [], // Configure as needed
          tags: brief.keywords || []
        });
        publishMethod = 'wordpress';
        await log(run.id, `Publisher: WordPress published - ${publishUrl}`);
      } catch (wpError) {
        await log(run.id, `Publisher: WordPress failed, falling back to Firestore - ${wpError}`);
        publishUrl = await publishToFirestore();
      }
    } else {
      // Publish to Firestore CMS
      publishUrl = await publishToFirestore();
    }

    async function publishToFirestore(): Promise<string> {
      const post = {
        slug,
        title,
        markdown: processedMarkdown,
        html: htmlContent,
        status: 'published' as const,
        publishedAt: new Date(),
        author: {
          name: 'Varun Chaudhry',
          title: 'Licensed Mortgage Broker',
          license: 'BCFSA #M08001935'
        },
        metaDescription,
        keywords: brief.keywords || [],
        jsonLd,
        embeddings: gate?.embeddings || undefined,
      };

      await savePost(post);
      return `https://www.kraftmortgages.ca/blog/${slug}`;
    }

    const publishData: PublishData = {
      url: publishUrl,
      method: publishMethod,
      publishedAt: new Date().toISOString(),
    };

    await log(run.id, `Publisher: Successfully published via ${publishMethod} - ${publishUrl}`);

    return {
      success: true,
      data: publishData,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error in publish stage';
    await log(run.id, `Publisher error: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

async function publishToWordPress(data: {
  title: string;
  slug: string;
  content: string;
  metaDescription?: string;
  categories?: number[];
  tags?: string[];
}): Promise<string> {
  const { title, slug, content, metaDescription, categories = [], tags = [] } = data;

  const wpData = {
    title,
    slug,
    content,
    status: 'publish',
    excerpt: metaDescription || '',
    categories,
    meta: {
      description: metaDescription || '',
      keywords: tags.join(', ')
    }
  };

  const response = await fetch(`${process.env.WORDPRESS_BASE_URL}/wp-json/wp/v2/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_APP_PASSWORD}`
      ).toString('base64')}`
    },
    body: JSON.stringify(wpData)
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.link || `${process.env.WORDPRESS_BASE_URL}/${slug}`;
}

function markdownToHtml(markdown: string): string {
  // Basic markdown to HTML conversion
  return markdown
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    // Wrap in paragraphs
    .replace(/^(.+)$/gm, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1');
}