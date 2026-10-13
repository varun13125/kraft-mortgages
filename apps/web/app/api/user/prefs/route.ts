import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyFirebaseToken } from '@/lib/auth';
import { db } from '@/lib/db/firestore';

export const dynamic = 'force-dynamic';

// Bounded, primitive-only preference map (previously any object of any size was stored).
const PreferencesSchema = z
  .record(z.string().max(64), z.union([z.string().max(200), z.number(), z.boolean(), z.null()]))
  .refine((p) => Object.keys(p).length <= 30, 'Too many preference keys');

export async function GET(request: NextRequest) {
  try {
    // Try to get user from token, but don't require it for basic prefs
    let uid = null;
    try {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await verifyFirebaseToken(token);
        uid = decodedToken.uid;
      }
    } catch (error) {
      console.log('No valid auth token, returning default prefs');
    }

    // Return default preferences
    const defaultPrefs = {
      theme: 'light',
      notifications: true,
      province: 'BC',
      currency: 'CAD'
    };

    if (uid) {
      try {
        // Try to get user-specific preferences
        const userDoc = await (await db.collection('users')).doc(uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          return NextResponse.json({
            preferences: { ...defaultPrefs, ...(userData?.preferences || {}) }
          });
        }
      } catch (error) {
        console.log('Error fetching user prefs, using defaults');
      }
    }

    return NextResponse.json({ preferences: defaultPrefs });

  } catch (error) {
    console.error('User prefs error:', error);
    return NextResponse.json({ preferences: { theme: 'light' } }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let uid: string;
    try {
      uid = (await verifyFirebaseToken(token)).uid;
    } catch {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsedPrefs = PreferencesSchema.safeParse(body?.preferences);

    if (!parsedPrefs.success) {
      return NextResponse.json({ error: 'Invalid preferences data' }, { status: 400 });
    }
    const preferences = parsedPrefs.data;

    // Save user preferences to Firestore
    await (await db.collection('users')).doc(uid).set({
      preferences,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('User prefs save error:', error);
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
}
