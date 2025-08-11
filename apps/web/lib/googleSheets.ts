import { google } from 'googleapis';
import { getRecentPosts, getPost as getFsPost } from '@/lib/db/firestore';

interface GoogleSheetsPost {
  [key: string]: string;
}

// Use existing Firebase service account to access Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Default to the n8n workflow's configured Sheet ID if env is missing
const DEFAULT_SHEET_ID = '1fz1DIUq7gerTUC9kWFXZovbJUFbp-dr5e3Rw005J2NU';

export async function getBlogPosts(): Promise<GoogleSheetsPost[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID,
      range: 'Blogs!A:AF', // Allow extra columns without breaking mapping
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    // First row is headers
    const headers = rows[0].map((h: string) => String(h || '').toLowerCase().replace(/\s+/g, ''));
    
    // Convert rows to objects
    const posts = rows.slice(1).map((row: string[]) => {
      const post: GoogleSheetsPost = {};
      headers.forEach((header, index) => {
        post[header] = row[index] || '';
      });
      return post;
    });

    // Filter only published posts and sort by date
    const sheetPosts = posts
      .filter((post: GoogleSheetsPost) => {
        const statusValue = String((post as any).status || '').toLowerCase();
        const slugOk = String((post as any).slug || '').trim().length > 0;
        const titleOk = String((post as any).title || '').trim().length > 0;
        return slugOk && titleOk && (statusValue === 'published' || statusValue === 'true');
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