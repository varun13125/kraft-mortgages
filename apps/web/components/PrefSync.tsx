"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function PrefSync() {
  const { setProvince, setLanguage, province, language } = useAppStore();
  
  useEffect(() => {
    // Load preferences from localStorage only
    const p = localStorage.getItem("km_province") as any;
    const l = localStorage.getItem("km_lang") as any;
    if (p) setProvince(p);
    if (l) setLanguage(l);
    
    // Note: Server sync is now handled by authenticated pages only
    // This prevents unnecessary 401 errors on public pages
  }, []); // eslint-disable-line
  
  return null;
}
