'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui path
import { Input } from '@/components/ui/input';   // Assuming shadcn/ui path
import { Label } from '@/components/ui/label';   // Assuming shadcn/ui path
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming shadcn/ui path

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { signUpWithEmail, loading, error: authError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError("Passwords don't match.");
      return;
    }

    try {
      await signUpWithEmail(email, password);
      // Successful sign-up is handled by onAuthStateChanged in AuthContext
      // which then should ideally trigger a redirect or state change.
      // For now, we'll redirect to login, assuming user needs to verify or login after signup.
      // A more user-friendly approach might be to redirect to a dashboard or a "please verify email" page.
      router.push('/login'); 
    } catch (err: any) {
      // AuthError from Firebase is already set in AuthContext's error state.
      // We can set a formError for additional local validation or specific messages.
      if (err.code) {
        setFormError(err.message); // Display Firebase error message
      } else {
        setFormError('An unexpected error occurred during sign up.');
      }
      console.error('Sign up error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            {authError && typeof authError !== 'string' && authError.message && (
              <p className="text-sm text-red-600">{authError.message}</p>
            )}
            {authError && typeof authError === 'string' && (
              <p className="text-sm text-red-600">{authError}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
