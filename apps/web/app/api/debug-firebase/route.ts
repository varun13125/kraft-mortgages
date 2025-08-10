import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasServiceAccountJson: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    
    // Show first few characters of actual values (for debugging, not security)
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmailPrefix: process.env.FIREBASE_CLIENT_EMAIL?.substring(0, 20) + '...',
    
    allFirebaseEnvVars: Object.keys(process.env)
      .filter(key => key.includes('FIREBASE'))
      .reduce((obj, key) => {
        obj[key] = process.env[key] ? `${process.env[key]?.substring(0, 10)}...` : 'NOT SET';
        return obj;
      }, {} as Record<string, string>)
  });
}