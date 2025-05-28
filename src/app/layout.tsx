import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // Ensure path is correct
import AppNavigationBar from "@/components/layout/AppNavigationBar"; // To be created
// import { Toaster } from "@/components/ui/sonner"; // If sonner is to be used globally

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JuriStream",
  description: "AI-Enabled Legal Case Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppNavigationBar />
          <main className="container mx-auto p-4">
            {children}
          </main>
          {/* <Toaster /> */} {/* If using sonner globally */}
        </AuthProvider>
      </body>
    </html>
  );
}
