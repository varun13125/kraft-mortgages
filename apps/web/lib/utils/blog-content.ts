/**
 * Blog content processing utilities
 */

// Replace [IMAGE: Description] placeholders with actual img tags
export function processImagePlaceholders(content: string): string {
  if (!content) return content;

  // Replace [IMAGE: Description] with styled img tags
  return content.replace(
    /\[IMAGE:\s*([^\]]+)\]/g,
    '<img src="https://via.placeholder.com/800x400/6B7280/FFFFFF?text=$1" alt="$1" class="w-full rounded-lg shadow-lg my-6" style="max-width: 100%; height: auto;" />'
  );
}

// Strip HTML tags and generate plain text excerpt
export function generateExcerpt(htmlContent: string, wordCount: number = 25): string {
  if (!htmlContent) return '';

  // Remove HTML tags
  const plainText = htmlContent
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim();

  // Split into words and truncate
  const words = plainText.split(' ');
  if (words.length <= wordCount) {
    return plainText;
  }

  return words.slice(0, wordCount).join(' ') + '...';
}

// Process content for single post display (with images)
export function processPostContent(content: string): string {
  if (!content) return content;

  // First process image placeholders
  const processedContent = processImagePlaceholders(content);

  return processedContent;
}

// Process content for index page excerpt
export function processExcerptContent(htmlContent: string, maxLength: number = 150): string {
  if (!htmlContent) return '';

  // Remove HTML tags and create excerpt
  const plainText = htmlContent
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + '...';
}