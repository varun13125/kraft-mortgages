'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client'; // Assuming firebase client is at this path

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null | string; // Allow string for custom errors
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null | string>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in.
        // Force refresh the token to get custom claims.
        currentUser.getIdTokenResult(true).then((idTokenResult) => {
          // console.log('Updated claims:', idTokenResult.claims);
          // You might want to store claims in your auth state if needed directly
          // For example: setUserData({ ...currentUser, claims: idTokenResult.claims });
        }).catch((error) => {
          console.error("Error refreshing ID token:", error);
          // Handle error if necessary, e.g., set an error state
        });
        setUser(currentUser);
      } else {
        // User is signed out.
        setUser(null);
      }
      setLoading(false);
      setError(null); // Clear error on auth state change
    }, (authStateError) => {
      setUser(null);
      setLoading(false);
      setError(authStateError);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      // User will be set by onAuthStateChanged
    } catch (e) {
      setError(e as AuthError);
      setLoading(false); // Explicitly set loading to false on error
      throw e; // Re-throw to allow caller to handle
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // User will be set by onAuthStateChanged
    } catch (e) {
      setError(e as AuthError);
      setLoading(false); // Explicitly set loading to false on error
      throw e; // Re-throw to allow caller to handle
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      // User will be set to null by onAuthStateChanged
    } catch (e) {
      setError(e as AuthError);
      setLoading(false); // Explicitly set loading to false on error
      throw e; // Re-throw to allow caller to handle
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signUpWithEmail, signInWithEmail, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
