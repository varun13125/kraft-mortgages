"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function PrefSync() {
  const { setProvince, setLanguage, province, language, userId } = useAppStore();
  useEffect(() => {
    const p = localStorage.getItem("km_province") as any;
    const l = localStorage.getItem("km_lang") as any;
    if (p) setProvince(p);
    if (l) setLanguage(l);
    // upsert server-side prefs (best-effort)
    const upsert = async () => {
      try {
        await fetch("/api/user/prefs", { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ userId, key: "prefs", value: { province: p || province, language: l || language } }) });
      } catch {}
    };
    upsert();
  }, []); // eslint-disable-line
  return null;
}
