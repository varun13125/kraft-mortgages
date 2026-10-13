/**
 * HTML sanitizer for blog post bodies (BUG-016: stored XSS).
 *
 * Post HTML/markdown comes from external or AI sources (blog ingest API,
 * AI content pipeline, Firestore) and is rendered on the main domain with
 * `dangerouslySetInnerHTML` (app/blog/[slug]/page.tsx). Every write path and
 * the Firestore read path run it through `sanitizeBlogHtml()`.
 *
 * Policy (allowlist):
 *  - Tags: headings, paragraphs, lists, links, images, tables, blockquote,
 *    code/pre, inline emphasis, hr/br, and neutral containers (div/span/article/
 *    section/figure). Everything else is dropped; <script>, <style>, <iframe>,
 *    <object>, <embed>, <svg>, <math>, forms, etc. are removed (script/style
 *    content included).
 *  - Attributes: only per-tag allowlisted ones. No event handlers (on*), no
 *    `class`/`id` (Tailwind classes could build page-covering overlays; ids
 *    allow DOM clobbering).
 *  - URLs: links http/https/mailto/tel or relative; images http/https or
 *    relative. `javascript:`, `data:`, `vbscript:` etc. are removed.
 *  - target="_blank" links always get rel="noopener noreferrer".
 *  - Inline `style` is KEPT BUT FILTERED through a property/value allowlist
 *    (colours, gradients, spacing, borders, font size/weight, text-align, simple
 *    display/flex/grid). The 17 seed posts and Marblism imports rely on ~400
 *    inline styles for callout boxes, comparison tables and CTA buttons, so a
 *    blanket strip would visibly break live posts. Not allowed: position, z-index,
 *    transforms, negative margins, url(), expression(), background images, etc.,
 *    so CSS cannot load resources or overlay the page chrome. Pass
 *    `{ allowInlineStyles: false }` to strip every style attribute.
 *
 * Hardening against the page's post-processing: app/blog/[slug]/page.tsx runs
 * `processPostContent()` (lib/utils/blog-content.ts) AFTER this function. That
 * helper decodes entities (`&quot;`, `&#8220;` -> `"`), deletes
 * `[IMAGE: ...]` markers and rebuilds a markdown "Related Resources" tail into
 * `<a href="...">`. Each of those could re-open an attribute in otherwise safe
 * HTML, so the output here is made resistant to them:
 *  1. attribute values never contain a `"` (URLs: %22, text: a typographic quote);
 *  2. `&amp;#` is emitted as `&amp;&#x23;` so `&amp;#8220;` cannot decode to `"`;
 *  3. `[IMAGE: ...]` markers are removed here, and any leftover `[IMAGE:` is
 *     emitted as `[IMAGE&#58;` so the page's regex can never match across tags;
 *  4. the ingest API's markdown tail is converted to HTML here (strict URL check)
 *     and the output always ends with an empty `<span></span>`, so the page's
 *     own tail conversion (which interpolates text into an href) never runs.
 * The robust fix is for the page to call sanitizeBlogHtml() LAST, after
 * processPostContent() (needs-owner: frontend).
 */
import sanitizeHtml from 'sanitize-html';

export interface SanitizeBlogHtmlOptions {
  /** Keep allowlisted inline CSS (default true). false = strip every `style`. */
  allowInlineStyles?: boolean;
}

// ---------------------------------------------------------------------------
// CSS allowlist
// ---------------------------------------------------------------------------
const NUM = '(?:\\d+(?:\\.\\d+)?|\\.\\d+)';
// Non-negative lengths only (negative margins could pull content over the header).
const LEN = `(?:0|${NUM}(?:px|em|rem|%|vh|vw|ch|ex|pt)?)`;
const COLOR = '(?:#[0-9a-f]{3,8}|rgba?\\(\\s*[\\d.\\s,%]+\\)|hsla?\\(\\s*[\\d.\\s,%deg]+\\)|[a-z]{3,30})';

const re = (body: string) => new RegExp(`^(?:${body})$`, 'i');
const LEN_1 = [re(`${LEN}|auto|none`)];
const LEN_1_TO_4 = [re(`(?:(?:${LEN}|auto)\\s*){1,4}`)];
const COLOR_RE = [re(COLOR)];
const GRADIENT = re(
  `(?:linear|radial)-gradient\\(\\s*(?:(?:${NUM}deg|to [a-z ]{3,20})\\s*,\\s*)?(?:${COLOR}(?:\\s+${NUM}%)?\\s*,?\\s*){2,6}\\)`
);
const BORDER = [re(`none|0|(?:${LEN}\\s+)?(?:solid|dashed|dotted|double|none)(?:\\s+${COLOR})?`)];
const SHADOW = [re(`none|(?:-?${LEN}\\s+){2,4}${COLOR}`)];

const ALLOWED_STYLES: Record<string, RegExp[]> = {
  color: COLOR_RE,
  'background-color': COLOR_RE,
  background: [re(COLOR), GRADIENT],
  'border-color': COLOR_RE,
  border: BORDER,
  'border-top': BORDER,
  'border-right': BORDER,
  'border-bottom': BORDER,
  'border-left': BORDER,
  'border-width': LEN_1_TO_4,
  'border-style': [re('none|solid|dashed|dotted|double')],
  'border-radius': LEN_1_TO_4,
  'border-collapse': [re('collapse|separate')],
  'box-shadow': SHADOW,
  margin: LEN_1_TO_4,
  'margin-top': LEN_1,
  'margin-right': LEN_1,
  'margin-bottom': LEN_1,
  'margin-left': LEN_1,
  padding: LEN_1_TO_4,
  'padding-top': LEN_1,
  'padding-right': LEN_1,
  'padding-bottom': LEN_1,
  'padding-left': LEN_1,
  width: LEN_1,
  'max-width': LEN_1,
  'min-width': LEN_1,
  height: LEN_1,
  'max-height': LEN_1,
  'min-height': LEN_1,
  display: [re('block|inline|inline-block|flex|inline-flex|grid|table|table-row|table-cell|list-item')],
  'flex-direction': [re('row|column|row-reverse|column-reverse')],
  'flex-wrap': [re('wrap|nowrap')],
  'justify-content': [re('flex-start|flex-end|center|space-between|space-around|space-evenly|stretch|start|end')],
  'align-items': [re('flex-start|flex-end|center|stretch|baseline|start|end')],
  gap: [re(`(?:${LEN}\\s*){1,2}`)],
  'grid-template-columns': [re(`(?:(?:${NUM}fr|${LEN}|auto)\\s*){1,6}`), re(`repeat\\(\\s*\\d{1,2}\\s*,\\s*${NUM}fr\\s*\\)`)],
  'text-align': [re('left|right|center|justify|start|end')],
  'text-decoration': [re('none|underline|line-through|overline')],
  'font-size': [re(LEN)],
  'font-weight': [re('normal|bold|bolder|lighter|[1-9]00')],
  'font-style': [re('normal|italic|oblique')],
  'line-height': [re(`normal|${NUM}(?:px|em|rem|%)?`)],
  'letter-spacing': [re(`normal|${LEN}`)],
  'white-space': [re('normal|nowrap|pre|pre-wrap|pre-line')],
  'vertical-align': [re('top|middle|bottom|baseline')],
  'list-style-type': [re('disc|circle|square|decimal|lower-alpha|upper-alpha|lower-roman|upper-roman|none')],
  overflow: [re('auto|hidden|visible|scroll')],
  'overflow-x': [re('auto|hidden|visible|scroll')],
  'overflow-y': [re('auto|hidden|visible|scroll')],
  cursor: [re('pointer|default|auto')],
  transition: [re(`[a-z-]{3,30}\\s+${NUM}m?s(?:\\s+[a-z-]{3,20})?`)],
};

// ---------------------------------------------------------------------------
// Tag / attribute allowlist
// ---------------------------------------------------------------------------
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'div', 'span', 'article', 'section', 'figure', 'figcaption',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'a', 'img',
  'table', 'caption', 'colgroup', 'col', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'blockquote', 'q', 'cite', 'code', 'pre', 'kbd', 'samp',
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'abbr', 'time',
];

const URL_ATTRS = new Set(['href', 'src', 'cite']);

const BASE_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
  td: ['colspan', 'rowspan', 'align'],
  th: ['colspan', 'rowspan', 'scope', 'align'],
  col: ['span'],
  colgroup: ['span'],
  ol: ['start', 'reversed', 'type'],
  blockquote: ['cite'],
  q: ['cite'],
  abbr: ['title'],
  time: ['datetime'],
};

const SAFE_REL_TOKENS = new Set(['nofollow', 'noopener', 'noreferrer', 'ugc', 'sponsored']);

/** Runs for every tag before the allowlist: attribute hygiene (see header, point 1). */
function transformAll(tagName: string, attribs: sanitizeHtml.Attributes): sanitizeHtml.Tag {
  const out: sanitizeHtml.Attributes = {};
  for (const [name, rawValue] of Object.entries(attribs)) {
    let value = String(rawValue ?? '');
    if (URL_ATTRS.has(name)) {
      value = value.trim().replace(/"/g, '%22').replace(/`/g, '%60');
      // Seed/legacy posts used protocol-relative "//images/x.png" (resolves to https://images/...).
      if (name === 'src' && value.startsWith('//images/')) value = value.slice(1);
    } else {
      value = value.replace(/"/g, '”'); // typographic right double quote
    }
    out[name] = value;
  }

  if (tagName === 'a') {
    const target = (out.target || '').trim().toLowerCase();
    const rel = new Set(
      (out.rel || '')
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => SAFE_REL_TOKENS.has(t))
    );
    delete out.target;
    if (target === '_blank') {
      out.target = '_blank';
      rel.add('noopener');
      rel.add('noreferrer');
    }
    if (rel.size) out.rel = Array.from(rel).join(' ');
    else delete out.rel;
  }

  if (tagName === 'img') {
    if (out.loading && !/^(?:lazy|eager)$/i.test(out.loading)) delete out.loading;
    if (out.decoding && !/^(?:async|sync|auto)$/i.test(out.decoding)) delete out.decoding;
  }

  return { tagName, attribs: out };
}

function buildOptions(allowInlineStyles: boolean): sanitizeHtml.IOptions {
  const allowedAttributes: Record<string, string[]> = { ...BASE_ALLOWED_ATTRIBUTES };
  if (allowInlineStyles) allowedAttributes['*'] = ['style'];
  return {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes,
    allowedStyles: allowInlineStyles ? { '*': ALLOWED_STYLES } : undefined,
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowProtocolRelative: true,
    allowVulnerableTags: false,
    disallowedTagsMode: 'discard',
    // Drop the contents of these entirely (not just the tags).
    nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript', 'title', 'template', 'select', 'object', 'embed', 'svg', 'math'],
    nestingLimit: 64,
    transformTags: { '*': transformAll },
  };
}

const OPTIONS_WITH_STYLES = buildOptions(true);
const OPTIONS_NO_STYLES = buildOptions(false);

// The ingest API (app/api/blog/ingest) appends one of these markdown tails.
// Strict versions of the patterns in lib/utils/blog-content.ts: plain-text title,
// URL limited to http(s) or a root-relative path with no quotes/angle brackets.
const TAIL_URL = '(?:https?:\\/\\/[^\\s()<>"\'`]+|\\/[^\\s()<>"\'`]*)';
const RELATED_TAIL = new RegExp(
  `\\n*-{3}\\n+#{3} Related Resources\\n+((?:- \\[[^\\]<>\\n]+\\]\\(${TAIL_URL}\\)\\n?)+)\\s*$`
);
const RELATED_ITEM = new RegExp(`- \\[([^\\]<>\\n]+)\\]\\((${TAIL_URL})\\)`, 'g');
const CTA_TAIL = new RegExp(
  `\\n*-{3}\\n+\\*\\*Looking for expert mortgage advice\\?\\*\\* \\[Contact Kraft Mortgages\\]\\((${TAIL_URL})\\) for a free consultation\\.\\s*$`
);
const TRAILING_GUARD = /(?:<span><\/span>\s*)+$/;

/** Attribute-escape an already validated URL (it can only contain `&` to escape). */
const escapeAttr = (v: string) => v.replace(/&(?!amp;|lt;|gt;)/g, '&amp;');

function convertIngestTail(html: string): string {
  let out = html.replace(RELATED_TAIL, (_m, list: string) => {
    const items = Array.from(list.matchAll(RELATED_ITEM))
      .map(([, title, url]) => `<li><a href="${escapeAttr(url)}">${title}</a></li>`)
      .join('');
    return `<hr /><h3>Related Resources</h3><ul>${items}</ul>`;
  });
  out = out.replace(
    CTA_TAIL,
    (_m, url: string) =>
      `<hr /><p><strong>Looking for expert mortgage advice?</strong> <a href="${escapeAttr(url)}">Contact Kraft Mortgages</a> for a free consultation.</p>`
  );
  return out;
}

/**
 * Sanitize a blog post body (HTML, or markdown that may embed HTML).
 * Idempotent in effect: sanitizing already-sanitized output yields safe output.
 */
export function sanitizeBlogHtml(input: unknown, opts: SanitizeBlogHtmlOptions = {}): string {
  if (typeof input !== 'string' || input.length === 0) return '';
  const options = opts.allowInlineStyles === false ? OPTIONS_NO_STYLES : OPTIONS_WITH_STYLES;

  // Authoring placeholders: removed here, before parsing (the page used to do it after).
  const pre = input.replace(/\[IMAGE:\s*([^\]]+)\]/g, '');

  let out = sanitizeHtml(pre, options);
  out = out.replace(/&amp;#/g, '&amp;&#x23;');
  out = out.replace(/\[IMAGE:/g, '[IMAGE&#58;');
  out = convertIngestTail(out.replace(TRAILING_GUARD, ''));
  return `${out}<span></span>`;
}
