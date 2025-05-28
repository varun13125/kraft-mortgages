"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to JuriStream</h1>
      <p className="text-lg text-gray-700 mb-8">
        Your AI-Enabled Legal Case Management System.
      </p>
      {loading ? (
        <p>Loading user status...</p>
      ) : !user ? (
        <div className="space-x-4">
          <Link href="/auth_pages_temp/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </Link>
          <Link href="/auth_pages_temp/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Sign Up
          </Link>
          {/* Or use shadcn Buttons:
          <Button asChild><Link href="/auth_pages_temp/login">Login</Link></Button>
          <Button asChild variant="outline"><Link href="/auth_pages_temp/signup">Sign Up</Link></Button>
          */}
        </div>
      ) : (
        <div>
          <p className="mb-4">You are logged in as {user.email}.</p>
          <Link href="/cases" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Go to My Cases
          </Link>
          {/* <Button asChild><Link href="/cases">Go to My Cases</Link></Button> */}
        </div>
      )}
    </div>
  );
}
