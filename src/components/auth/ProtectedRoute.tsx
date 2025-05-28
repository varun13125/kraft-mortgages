'use client';

import React, { ReactNode, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    // Optional: Show a loading spinner or skeleton screen
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    // User is not authenticated, and redirection should have happened.
    // Return null or a minimal component to avoid rendering children.
    return null; 
  }

  return <>{children}</>; // Render children if authenticated
};

export default ProtectedRoute;
