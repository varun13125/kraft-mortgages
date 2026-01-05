/**
 * Blog content processing utilities
 */

// Decode common HTML entities from WordPress/Marblism content
export function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  return text
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#34;/g, '"')
    .replace(/&#x22;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")  // Right single quote
    .replace(/&#8216;/g, "'")  // Left single quote
    .replace(/&#8220;/g, '"')  // Left double quote
    .replace(/&#8221;/g, '"')  // Right double quote
    .replace(/&#8211;/g, '–')  // En dash
    .replace(/&#8212;/g, '—'); // Em dash
}

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

  // Decode HTML entities first, then remove HTML tags
  const plainText = decodeHtmlEntities(htmlContent)
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

  // Decode HTML entities first (fixes &#39; apostrophes from WordPress)
  let processedContent = decodeHtmlEntities(content);

  // Then process image placeholders
  processedContent = processImagePlaceholders(processedContent);

  return processedContent;
}

// Process content for index page excerpt
export function processExcerptContent(htmlContent: string, maxLength: number = 150): string {
  if (!htmlContent) return '';

  // Decode HTML entities first, then remove HTML tags and create excerpt
  const plainText = decodeHtmlEntities(htmlContent)
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + '...';
}