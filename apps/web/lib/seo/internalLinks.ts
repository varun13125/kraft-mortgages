// Internal linking opportunities for mortgage content

export const INTERNAL_LINKS = {
  // Calculator pages
  calculators: [
    { path: '/calculators/payment', text: 'mortgage payment calculator', keywords: ['payment', 'monthly payment', 'calculator'] },
    { path: '/calculators/affordability', text: 'affordability calculator', keywords: ['afford', 'affordability', 'qualify'] },
    { path: '/calculators/renewal', text: 'renewal calculator', keywords: ['renewal', 'renew', 'term'] },
    { path: '/calculators/construction-pro', text: 'construction mortgage calculator', keywords: ['construction', 'building', 'draw'] },
    { path: '/calculators/investment', text: 'investment property calculator', keywords: ['investment', 'rental', 'cash flow'] },
    { path: '/calculators/self-employed', text: 'self-employed mortgage calculator', keywords: ['self employed', 'business owner', 'entrepreneur'] }
  ],

  // Service pages
  services: [
    { path: '/mli-select', text: 'MLI Select program', keywords: ['mli select', 'multi unit', 'investment property'] },
    { path: '/about', text: 'our mortgage expertise', keywords: ['experience', 'licensed broker', 'expert'] },
    { path: '/contact', text: 'contact our team', keywords: ['contact', 'speak with', 'consultation'] }
  ],

  // Provincial pages
  provinces: [
    { path: '/provinces/bc', text: 'BC mortgage solutions', keywords: ['british columbia', 'bc', 'vancouver'] },
    { path: '/provinces/ab', text: 'Alberta mortgage options', keywords: ['alberta', 'ab', 'calgary', 'edmonton'] },
    { path: '/provinces/on', text: 'Ontario mortgage services', keywords: ['ontario', 'on', 'toronto'] }
  ],

  // Resource pages
  resources: [
    { path: '/blog', text: 'mortgage insights', keywords: ['blog', 'articles', 'insights', 'resources'] },
    { path: '/faq', text: 'frequently asked questions', keywords: ['faq', 'questions', 'help'] }
  ]
};

export function suggestInternalLinks(content: string, maxLinks: number = 3): Array<{ path: string; text: string; context: string }> {
  const suggestions: Array<{ path: string; text: string; context: string; score: number }> = [];
  const contentLower = content.toLowerCase();

  // Score potential links based on keyword matches
  Object.values(INTERNAL_LINKS).flat().forEach(link => {
    let score = 0;
    let matchedKeywords: string[] = [];

    link.keywords.forEach(keyword => {
      const keywordRegex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      const matches = contentLower.match(keywordRegex);
      if (matches) {
        score += matches.length * keyword.split(' ').length; // Multi-word keywords get higher score
        matchedKeywords.push(keyword);
      }
    });

    if (score > 0) {
      // Find context around the first keyword match
      const firstKeyword = matchedKeywords[0];
      const keywordIndex = contentLower.indexOf(firstKeyword.toLowerCase());
      const contextStart = Math.max(0, keywordIndex - 50);
      const contextEnd = Math.min(content.length, keywordIndex + firstKeyword.length + 50);
      const context = content.slice(contextStart, contextEnd);

      suggestions.push({
        path: link.path,
        text: link.text,
        context: context.trim(),
        score
      });
    }
  });

  // Sort by score and return top suggestions
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxLinks)
    .map(({ path, text, context }) => ({ path, text, context }));
}

export function insertInternalLinks(content: string, suggestions?: Array<{ path: string; text: string; context: string }>): string {
  if (!suggestions) {
    suggestions = suggestInternalLinks(content);
  }

  let processedContent = content;

  suggestions.forEach(suggestion => {
    // Find the first occurrence of relevant keywords and replace with link
    suggestion.context.split(/\s+/).forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3) { // Only replace meaningful words
        const wordRegex = new RegExp(`\\b${cleanWord}\\b`, 'i');
        if (processedContent.match(wordRegex) && !processedContent.includes(suggestion.path)) {
          processedContent = processedContent.replace(
            wordRegex,
            `[${cleanWord}](${suggestion.path})`
          );
          return; // Only add one link per suggestion
        }
      }
    });
  });

  return processedContent;
}