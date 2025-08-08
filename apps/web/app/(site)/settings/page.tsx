"use client";
import { useAppStore } from "@/store/useAppStore";

export default function Settings() {
  const { province, setProvince, language, setLanguage, userId } = useAppStore();
  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-2xl font-semibold">Preferences</h2>
      <div className="grid gap-4">
        <label className="grid gap-1">Province
          <select className="border rounded p-2" value={province} onChange={e=>setProvince(e.target.value as any)}>
            <option value="BC">BC</option>
            <option value="AB">AB</option>
            <option value="ON">ON</option>
          </select>
        </label>
        <label className="grid gap-1">Language
          <select className="border rounded p-2" value={language} onChange={e=>setLanguage(e.target.value as any)}>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="zh">中文</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
            <option value="hi">हिंदी</option>
          </select>
        </label>
      </div>
      <div className="text-xs text-muted-foreground">User ID: {userId}</div>
      <p className="text-sm">Your preferences are saved in your browser and also synced to our server for better personalization.</p>
    </div>
  );
}
