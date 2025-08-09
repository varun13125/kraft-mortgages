import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID!;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export const db = getFirestore();

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
  embeddings?: number[][];
}

// Collection helpers
export const runsCol = () => db.collection('runs');
export const postsCol = () => db.collection('posts');
export const adminsCol = () => db.collection('admins');

export const nowTimestamp = () => admin.firestore.Timestamp.now();

// CRUD helpers
export async function createRun(data: Omit<Run, 'id'>): Promise<string> {
  const doc = await runsCol().add({
    ...data,
    startedAt: nowTimestamp(),
  });
  return doc.id;
}

export async function getRun(runId: string): Promise<Run | null> {
  const doc = await runsCol().doc(runId).get();
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
  await runsCol().doc(runId).update(data);
}

export async function updateRunStep(runId: string, stepIndex: number, stepData: Partial<Step>): Promise<void> {
  const timestampData = {
    ...stepData,
    startedAt: stepData.startedAt ? admin.firestore.Timestamp.fromDate(stepData.startedAt) : undefined,
    finishedAt: stepData.finishedAt ? admin.firestore.Timestamp.fromDate(stepData.finishedAt) : undefined,
  };
  
  await runsCol().doc(runId).update({
    [`steps.${stepIndex}`]: timestampData,
  });
}

export async function isAdmin(uid: string): Promise<boolean> {
  const doc = await adminsCol().doc(uid).get();
  return doc.exists;
}

export async function savePost(post: Post): Promise<void> {
  await postsCol().doc(post.slug).set({
    ...post,
    publishedAt: admin.firestore.Timestamp.fromDate(post.publishedAt),
  });
}

export async function getPost(slug: string): Promise<Post | null> {
  const doc = await postsCol().doc(slug).get();
  if (!doc.exists) return null;
  
  const data = doc.data()!;
  return {
    ...data,
    publishedAt: data.publishedAt?.toDate(),
  } as Post;
}

export async function getRecentPosts(limit: number = 20): Promise<Post[]> {
  const snapshot = await postsCol()
    .orderBy('publishedAt', 'desc')
    .limit(limit)
    .get();
  
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    publishedAt: doc.data().publishedAt?.toDate(),
  })) as Post[];
}