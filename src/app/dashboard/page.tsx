'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LogoutButton from '@/components/auth/LogoutButton';
import { useAuth } from '@/contexts/AuthContext'; // To display user info

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Dashboard
          </h1>
          <div className="mb-6 text-center">
            {user ? (
              <p className="text-lg text-gray-700">
                Welcome, <span className="font-semibold">{user.email}</span>!
              </p>
            ) : (
              <p className="text-lg text-gray-700">Loading user data...</p>
            )}
          </div>
          <p className="text-gray-600 mb-8 text-center">
            This is a protected area. You can only see this if you are logged in.
          </p>
          <div className="flex justify-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
