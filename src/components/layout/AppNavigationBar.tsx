"use client"; // Required for hooks

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext"; // Ensure path is correct
import { LogoutButton } from "@/components/auth/LogoutButton"; // Ensure path is correct
// import { Button } from "@/components/ui/button"; // If using shadcn Button

export default function AppNavigationBar() {
  const { user, loading } = useAuth();

  return (
    <nav className="bg-gray-100 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          JuriStream
        </Link>
        <div className="space-x-4 flex items-center"> {/* Added flex and items-center */}
          {loading ? (
            <span>Loading...</span>
          ) : !user ? (
            <>
              <Link href="/auth_pages_temp/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link href="/auth_pages_temp/signup" className="text-gray-700 hover:text-blue-600">Sign Up</Link>
            </>
          ) : (
            <>
              <span className="text-gray-700">Welcome, {user.email}</span>
              <Link href="/cases" className="text-gray-700 hover:text-blue-600">Cases</Link>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
