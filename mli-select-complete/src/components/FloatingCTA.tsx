"use client";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function FloatingCTA() {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <Link href="/contact" className="btn btn-primary shadow-lg">
        <Phone className="mr-2 h-4 w-4" /> Request a Call
      </Link>
    </div>
  );
}
