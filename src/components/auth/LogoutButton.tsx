'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui path

const LogoutButton: React.FC = () => {
  const { signOutUser, loading, error } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
      // Successful sign-out is handled by onAuthStateChanged in AuthContext.
      // User will be null, and ProtectedRoute (if used) will redirect to login.
      // Or, we can explicitly redirect here.
      router.push('/login'); 
    } catch (err) {
      // Error is already set in AuthContext
      console.error('Logout error:', err);
      // Optionally, display a message to the user
    }
  };

  return (
    <>
      <Button onClick={handleLogout} disabled={loading} variant="outline">
        {loading ? 'Logging Out...' : 'Logout'}
      </Button>
      {error && <p className="text-sm text-red-600 mt-2">Error during logout: {typeof error === 'string' ? error : error.message}</p>}
    </>
  );
};

export default LogoutButton;
