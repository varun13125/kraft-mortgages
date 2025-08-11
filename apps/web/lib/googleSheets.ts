import { google } from 'googleapis';

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

export async function getBlogPosts(): Promise<GoogleSheetsPost[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Blogs!A:S', // Sheet name is "Blogs" based on your n8n setup
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    // First row is headers
    const headers = rows[0].map((h: string) => h.toLowerCase().replace(/\s+/g, ''));
    
    // Convert rows to objects
    const posts = rows.slice(1).map((row: string[]) => {
      const post: GoogleSheetsPost = {};
      headers.forEach((header, index) => {
        post[header] = row[index] || '';
      });
      return post;
    });

    // Filter only published posts and sort by date
    return posts
      .filter((post: GoogleSheetsPost) => post.status === 'published')
      .sort((a: GoogleSheetsPost, b: GoogleSheetsPost) => 
        new Date(b.publishedat).getTime() - new Date(a.publishedat).getTime()
      );
  } catch (error) {
    console.error('Error fetching posts from Google Sheets:', error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<GoogleSheetsPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((post: GoogleSheetsPost) => post.slug === slug);
}