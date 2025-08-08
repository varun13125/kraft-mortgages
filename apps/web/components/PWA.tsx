"use client";
import { useEffect } from "react";

export function PWA() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (!process.env.NEXT_PUBLIC_PWA_ENABLED) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
