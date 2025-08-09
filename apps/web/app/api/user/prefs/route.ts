import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/auth';
import { db } from '@/lib/db/firestore';

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
        const userDoc = await db.collection('users').doc(uid).get();
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
    const decodedToken = await verifyFirebaseToken(token);
    const uid = decodedToken.uid;

    const body = await request.json();
    const { preferences } = body;

    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json({ error: 'Invalid preferences data' }, { status: 400 });
    }

    // Save user preferences to Firestore
    await db.collection('users').doc(uid).set({
      preferences,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('User prefs save error:', error);
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
}
