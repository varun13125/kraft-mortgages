import { google } from 'googleapis';
import { getRecentPosts, getPost as getFsPost } from '@/lib/db/firestore';

interface GoogleSheetsPost {
  [key: string]: string;
}

// Build robust GoogleAuth using either FIREBASE_SERVICE_ACCOUNT_JSON or individual vars
function buildGoogleAuth(): any {
  // Prefer full JSON
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      const svc = JSON.parse(json);
      return new google.auth.GoogleAuth({
        credentials: {
          client_email: svc.client_email,
          private_key: String(svc.private_key || '').replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });
    } catch (e) {
      // fallthrough to individual vars
    }
  }

  // Fallback to individual vars with decoding
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  if (privateKey && !privateKey.includes('BEGIN PRIVATE KEY')) {
    try {
      privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
    } catch {
      // use as-is
    }
  }
  // Strip surrounding quotes if any
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

const sheets = google.sheets({ version: 'v4', auth: buildGoogleAuth() });

// Default to the n8n workflow's configured Sheet ID if env is missing
const DEFAULT_SHEET_ID = '1fz1DIUq7gerTUC9kWFXZovbJUFbp-dr5e3Rw005J2NU';

export async function getBlogPosts(): Promise<GoogleSheetsPost[]> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID;

    // Strategy 1: If GOOGLE_API_KEY exists, try public API first (works when sheet is link-visible)
    // We will try service-account auth first for reliability; public API later if set
    const apiKey = process.env.GOOGLE_API_KEY;
    async function tryPublicApi(range: string): Promise<string[][] | null> {
      if (!apiKey) return null;
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
        const r = await fetch(url, { cache: 'no-store' as any });
        if (!r.ok) return null;
        const data = await r.json();
        const vals = (data && data.values) as string[][] | undefined;
        if (vals && vals.length > 0) return vals;
        return null;
      } catch {
        return null;
      }
    }

    async function tryRanges(ranges: string[]): Promise<string[][] | null> {
      for (const range of ranges) {
        // Try service account first
        try {
          const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range });
          const vals = resp.data.values as string[][] | undefined;
          if (vals && vals.length > 0) return vals;
        } catch {
          // continue to next range
        }
        // Try public API as a secondary option
        const pub = await tryPublicApi(range);
        if (pub && pub.length > 0) return pub;
      }
      return null;
    }

    const candidateRanges = [
      'Blogs!A:AF',
      'Blog!A:AF',
      'Posts!A:AF',
      'Sheet1!A:AF',
      'Sheet!A:AF',
      'A:AF', // first sheet fallback
    ];

    const rows = await tryRanges(candidateRanges);
    if (!rows || rows.length === 0) {
      // Firestore fallback if Sheets empty
      try {
        const fsPosts = await getRecentPosts(20);
        return fsPosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          content: (p as any).markdown || '',
          excerpt: (p as any).metaDescription || '',
          publishedat: (p.publishedAt instanceof Date ? p.publishedAt : new Date(p.publishedAt as any)).toISOString(),
          readingtime: String(Math.ceil(((p as any).markdown || '').split(/\s+/).length / 200) || 5),
          tags: JSON.stringify(p.keywords || []),
          featured: 'false',
          categories: JSON.stringify(['Mortgage Advice'])
        } as any));
      } catch {}
      return [];
    }

    // First row is headers (normalize aggressively: lowercase, strip non-alphanumerics)
    // Find the header row dynamically (within first 10 rows)
    function normalizeHeader(h: string): string {
      return String(h || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    const candidateKeys = new Set(['slug','title','content','status','publishedat','excerpt']);
    let headerRowIndex = 0;
    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const normalized = (rows[i] || []).map(normalizeHeader);
      const hasAny = normalized.some((h) => candidateKeys.has(h));
      const nonEmpty = normalized.some((h) => h.length > 0);
      if (hasAny && nonEmpty) {
        headerRowIndex = i;
        break;
      }
    }

    const headers = (rows[headerRowIndex] || []).map(normalizeHeader);
    
    // Convert rows to objects
    const rawRows = rows.slice(headerRowIndex + 1).map((row: any[]) => {
      const m: Record<string, any> = {};
      headers.forEach((header, index) => {
        const cell = row[index];
        const value = typeof cell === 'string' ? cell.trim() : (cell == null ? '' : String(cell).trim());
        m[header] = value;
      });
      return m as GoogleSheetsPost;
    });

    function pick(obj: any, keys: string[]): string {
      for (const k of keys) {
        const v = obj[k];
        if (v != null && String(v).trim().length > 0) return String(v).trim();
      }
      return '';
    }

    function parseBool(val: string): boolean {
      const v = String(val || '').trim().toLowerCase();
      return v === 'true' || v === 'published' || v === '1' || v === 'yes' || v === 'y';
    }

    function deriveFromFrontmatter(markdown: string): { title?: string; date?: string } {
      try {
        if (!markdown) return {};
        // Look for simple frontmatter lines like: title: "..." or title: ...
        const titleMatch = markdown.match(/\btitle:\s*"?([^"\n]+)"?/i);
        const dateMatch = markdown.match(/\bdate:\s*"?([^"\n]+)"?/i);
        return {
          title: titleMatch ? titleMatch[1].trim() : undefined,
          date: dateMatch ? dateMatch[1].trim() : undefined,
        };
      } catch {
        return {};
      }
    }

    function slugify(input: string): string {
      return String(input || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
    }

    // Normalize each row to a consistent shape used by pages
    const posts = rawRows.map((r) => {
      const slug = pick(r, ['slug','urlslug','postslug','permalink','path']);
      const title = pick(r, ['title','posttitle','heading']);
      const content = pick(r, ['content','body','markdown','article']);
      const excerpt = pick(r, ['excerpt','description','summary','metadescription']);
      const statusStr = pick(r, ['status','published','ispublished']);
      const publishedat = pick(r, ['publishedat','date','datetime','publishdate']);
      const readingtime = pick(r, ['readingtime','readtime','minutes']);
      const tags = pick(r, ['tags','keywords']);
      const categories = pick(r, ['categories','category']);
      const featuredStr = pick(r, ['featured','isfeatured']);

      // Derive from frontmatter if missing
      let derivedTitle = title;
      let derivedPublishedAt = publishedat;
      if ((!derivedTitle || !derivedPublishedAt) && content) {
        const fm = deriveFromFrontmatter(content);
        if (!derivedTitle && fm.title) derivedTitle = fm.title;
        if (!derivedPublishedAt && fm.date) derivedPublishedAt = fm.date;
      }

      const finalTitle = derivedTitle;
      const finalSlug = slug || (finalTitle ? slugify(finalTitle) : '');

      return {
        // original
        ...r,
        // normalized keys expected by UI
        slug: finalSlug,
        title: finalTitle,
        content,
        excerpt,
        status: statusStr || r['status'] || '',
        publishedat: derivedPublishedAt,
        readingtime,
        tags,
        categories,
        featured: parseBool(featuredStr) || (r['featured'] as any),
      } as GoogleSheetsPost as any;
    });

    // Filter only published posts and sort by date
    const sheetPosts = posts
      .filter((post: GoogleSheetsPost) => {
        const statusValue = String((post as any).status || '').trim().toLowerCase();
        const slugOk = String((post as any).slug || '').trim().length > 0;
        const titleOk = String((post as any).title || '').trim().length > 0;
        const isPublished = ['published','true','1','yes','y'].includes(statusValue);
        const publishedAtStr = String((post as any).publishedat || '').trim();
        const hasPublishedAt = publishedAtStr.length > 0;
        const contentLen = String((post as any).content || '').trim().length;
        const hasContent = contentLen > 0;
        // Accept if explicitly published OR if it clearly looks like a post (has content or publishedAt)
        return slugOk && titleOk && (isPublished || hasPublishedAt || hasContent);
      })
      .sort((a: GoogleSheetsPost, b: GoogleSheetsPost) => 
        new Date(b.publishedat).getTime() - new Date(a.publishedat).getTime()
      );

    // If Sheet has no published posts, fall back to Firestore
    if (!sheetPosts.length) {
      try {
        const fsPosts = await getRecentPosts(20);
        return fsPosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.metaDescription || '',
          publishedat: (p.publishedAt instanceof Date ? p.publishedAt : new Date(p.publishedAt as any)).toISOString(),
          readingtime: String(Math.ceil((p.markdown || '').split(/\s+/).length / 200) || 5),
          tags: JSON.stringify(p.keywords || []),
          featured: 'false',
          categories: JSON.stringify(['Mortgage Advice'])
        } as any));
      } catch {
        // ignore and return empty below
      }
    }

    return sheetPosts;
  } catch (error) {
    console.error('Error fetching posts from Google Sheets:', error);
    // On error, try Firestore fallback
    try {
      const fsPosts = await getRecentPosts(20);
      return fsPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.metaDescription || '',
        publishedat: (p.publishedAt instanceof Date ? p.publishedAt : new Date(p.publishedAt as any)).toISOString(),
        readingtime: String(Math.ceil((p.markdown || '').split(/\s+/).length / 200) || 5),
        tags: JSON.stringify(p.keywords || []),
        featured: 'false',
        categories: JSON.stringify(['Mortgage Advice'])
      } as any));
    } catch {
      return [];
    }
  }
}

export async function getBlogPost(slug: string): Promise<GoogleSheetsPost | undefined> {
  const posts = await getBlogPosts();
  const found = posts.find((post: GoogleSheetsPost) => post.slug === slug);
  if (found) return found;

  // Fallback to Firestore if not found in Sheets
  try {
    const p = await getFsPost(slug as any);
    if (!p) return undefined;
    return {
      slug: p.slug as any,
      title: p.title as any,
      content: (p as any).markdown || '',
      excerpt: (p as any).metaDescription || '',
      publishedat: (p.publishedAt instanceof Date ? p.publishedAt : new Date(p.publishedAt as any)).toISOString() as any,
      readingtime: String(Math.ceil(((p as any).markdown || '').split(/\s+/).length / 200) || 5) as any,
      tags: JSON.stringify((p as any).keywords || []) as any,
      featured: 'false' as any,
      categories: JSON.stringify(['Mortgage Advice']) as any,
    } as any;
  } catch {
    return undefined;
  }
}

export async function getBlogPostsWithDiagnostics(): Promise<{ rawCount: number; filteredCount: number; sample: any[] }>{
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID,
      range: 'Blogs!A:AF',
    });
    const rows = response.data.values || [];
    if (!rows.length) return { rawCount: 0, filteredCount: 0, sample: [] };
    const headers = rows[0].map((h: string) => String(h || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ''));
    const rawRows = rows.slice(1).map((row: any[]) => {
      const m: Record<string, any> = {};
      headers.forEach((header, index) => {
        const cell = row[index];
        const value = typeof cell === 'string' ? cell.trim() : (cell == null ? '' : String(cell).trim());
        m[header] = value;
      });
      return m as GoogleSheetsPost;
    });
    function pick(obj: any, keys: string[]): string {
      for (const k of keys) {
        const v = obj[k];
        if (v != null && String(v).trim().length > 0) return String(v).trim();
      }
      return '';
    }
    function parseBool(val: string): boolean {
      const v = String(val || '').trim().toLowerCase();
      return v === 'true' || v === 'published' || v === '1' || v === 'yes' || v === 'y';
    }
    const posts = rawRows.map((r) => {
      const slug = pick(r, ['slug','urlslug','postslug','permalink','path']);
      const title = pick(r, ['title','posttitle','heading']);
      const content = pick(r, ['content','body','markdown','article']);
      const excerpt = pick(r, ['excerpt','description','summary','metadescription']);
      const statusStr = pick(r, ['status','published','ispublished']);
      const publishedat = pick(r, ['publishedat','date','datetime','publishdate']);
      const readingtime = pick(r, ['readingtime','readtime','minutes']);
      const tags = pick(r, ['tags','keywords']);
      const categories = pick(r, ['categories','category']);
      const featuredStr = pick(r, ['featured','isfeatured']);
      return {
        ...r,
        slug, title, content, excerpt, status: statusStr || r['status'] || '',
        publishedat, readingtime, tags, categories, featured: parseBool(featuredStr) || (r['featured'] as any),
      } as any;
    });
    const filtered = posts.filter((post: any) => {
      const statusValue = String(post.status || '').trim().toLowerCase();
      const slugOk = String(post.slug || '').trim().length > 0;
      const titleOk = String(post.title || '').trim().length > 0;
      const isPublished = ['published','true','1','yes','y'].includes(statusValue);
      const publishedAtStr = String(post.publishedat || '').trim();
      const hasPublishedAt = publishedAtStr.length > 0;
      const contentLen = String(post.content || '').trim().length;
      const hasContent = contentLen > 0;
      return slugOk && titleOk && (isPublished || hasPublishedAt || hasContent);
    });
    const sample = posts.slice(0, 5).map((p: any) => ({
      slug: p.slug,
      title: p.title,
      status: p.status,
      publishedat: p.publishedat,
      contentLen: (p.content || '').length,
      rawKeys: Object.keys(p).slice(0, 10),
    }));
    return { rawCount: posts.length, filteredCount: filtered.length, sample };
  } catch {
    return { rawCount: 0, filteredCount: 0, sample: [] };
  }
}