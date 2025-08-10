// Lazy imports and initialization to prevent build-time issues
let admin: any = null;
let getFirestore: any = null;
let isInitialized = false;

// Initialize imports only when needed
async function initializeFirebase() {
  if (!admin) {
    admin = (await import('firebase-admin')).default;
    getFirestore = (await import('firebase-admin/firestore')).getFirestore;
  }
}

// Initialize Firebase Admin - completely lazy
async function initializeAdmin() {
  if (isInitialized || (admin && admin.apps.length > 0)) return;
  
  // Skip during build or if no credentials
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !process.env.FIREBASE_PROJECT_ID) {
    return;
  }
  
  await initializeFirebase();
  
  let serviceAccount;
  
  // Try using complete service account JSON first (recommended)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e);
      return;
    }
  }
  
  // Fallback to individual environment variables
  if (!serviceAccount) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // Skip initialization if required env vars are missing
    if (!projectId || !clientEmail || !privateKey) {
      return;
    }
    
    // Handle different private key formats
    if (privateKey) {
      // If it's base64 encoded, decode it
      if (!privateKey.includes('BEGIN PRIVATE KEY')) {
        try {
          privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
        } catch (e) {
          console.log('Private key is not base64, using as-is');
        }
      }
      
      // Replace literal \n with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    serviceAccount = {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  // Initialize admin
  if (serviceAccount && serviceAccount.projectId) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.projectId, // Explicitly set project ID
      });
      isInitialized = true;
    } catch (initError) {
      console.error('Firebase admin initialization error:', initError);
    }
  }
}

// Safe database getter with build-time fallback
async function getDb() {
  await initializeAdmin();
  
  if (!isInitialized || !admin || !getFirestore) {
    // Return a mock object for build time or when Firebase isn't available
    const mockCollection = {
      add: () => Promise.resolve({ id: 'mock' }),
      doc: (id: string) => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        id
      }),
      where: () => mockCollection,
      orderBy: () => mockCollection,
      limit: () => mockCollection,
      get: () => Promise.resolve({ docs: [], empty: true }),
    };
    
    return {
      collection: () => mockCollection,
    } as any;
  }
  
  try {
    // Connect to the correct database (default is in nam5 region)
    return getFirestore();
  } catch (error) {
    console.error('Failed to get Firestore instance:', error);
    // Return mock for safety
    const mockCollection = {
      add: () => Promise.resolve({ id: 'mock' }),
      doc: (id: string) => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        id
      }),
    };
    return {
      collection: () => mockCollection,
    } as any;
  }
}

// Typed helpers
export interface Run {
  id: string;
  mode: 'auto' | 'manual-topic' | 'manual-idea';
  manualQuery?: string;
  targetProvinces: string[];
  startedAt: Date;
  steps: Step[];
  createdBy: string;
  scout?: any;
  brief?: any;
  draft?: any;
  gate?: any;
  final?: any;
  published?: any;
}

export interface Step {
  agent: string;
  status: 'queued' | 'running' | 'ok' | 'error';
  startedAt?: Date;
  finishedAt?: Date;
  error?: string;
}

export interface Post {
  slug: string;
  title: string;
  markdown: string;
  html: string;
  status: 'published' | 'draft';
  publishedAt: Date;
  author: {
    name: string;
    title: string;
    license: string;
  };
  metaDescription?: string;
  keywords?: string[];
  embeddings?: number[][];
}

// Export db for backward compatibility
export const db = { 
  collection: async (name: string) => (await getDb()).collection(name) 
};

// Collection helpers
export const runsCol = async () => (await getDb()).collection('runs');
export const postsCol = async () => (await getDb()).collection('posts');
export const adminsCol = async () => (await getDb()).collection('admins');

export const nowTimestamp = async () => {
  await initializeFirebase();
  return admin ? admin.firestore.Timestamp.now() : { toDate: () => new Date() };
};

// CRUD helpers
export async function createRun(data: Omit<Run, 'id'>): Promise<string> {
  const doc = await (await runsCol()).add({
    ...data,
    startedAt: await nowTimestamp(),
  });
  return doc.id;
}

export async function getRun(runId: string): Promise<Run | null> {
  const doc = await (await runsCol()).doc(runId).get();
  if (!doc.exists) return null;
  
  return {
    id: doc.id,
    ...doc.data(),
    startedAt: doc.data()?.startedAt?.toDate(),
    steps: doc.data()?.steps?.map((s: any) => ({
      ...s,
      startedAt: s.startedAt?.toDate(),
      finishedAt: s.finishedAt?.toDate(),
    })) || [],
  } as Run;
}

export async function updateRun(runId: string, data: Partial<Run>): Promise<void> {
  await (await runsCol()).doc(runId).update(data);
}

export async function updateRunStep(runId: string, stepIndex: number, stepData: Partial<Step>): Promise<void> {
  // Create update data, filtering out undefined values
  const timestampData: any = {
    ...stepData,
  };
  
  // Only add timestamp fields if they have values
  if (stepData.startedAt) {
    await initializeFirebase();
    if (admin) {
      timestampData.startedAt = admin.firestore.Timestamp.fromDate(stepData.startedAt);
    }
  }
  
  if (stepData.finishedAt) {
    await initializeFirebase();
    if (admin) {
      timestampData.finishedAt = admin.firestore.Timestamp.fromDate(stepData.finishedAt);
    }
  }
  
  await (await runsCol()).doc(runId).update({
    [`steps.${stepIndex}`]: timestampData,
  });
}

export async function isAdmin(uid: string): Promise<boolean> {
  const doc = await (await adminsCol()).doc(uid).get();
  return doc.exists;
}

export async function savePost(post: Post): Promise<void> {
  await initializeFirebase();
  const timestampData = admin ? admin.firestore.Timestamp.fromDate(post.publishedAt) : post.publishedAt;
  
  await (await postsCol()).doc(post.slug).set({
    ...post,
    publishedAt: timestampData,
  });
}

export async function getPost(slug: string): Promise<Post | null> {
  const doc = await (await postsCol()).doc(slug).get();
  if (!doc.exists) return null;
  
  const data = doc.data()!;
  return {
    ...data,
    publishedAt: data.publishedAt?.toDate(),
  } as Post;
}

export async function getRecentPosts(limit: number = 20): Promise<Post[]> {
  const snapshot = await (await postsCol())
    .orderBy('publishedAt', 'desc')
    .limit(limit)
    .get();
  
  return snapshot.docs.map((doc: any) => ({
    ...doc.data(),
    publishedAt: doc.data().publishedAt?.toDate(),
  })) as Post[];
}