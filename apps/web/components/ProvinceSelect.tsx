"use client";
import { useAppStore } from "@/store/useAppStore";

export function ProvinceSelect() {
  const { province, setProvince } = useAppStore();
  return (
    <select className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-gold-500 focus:outline-none" value={province} onChange={e=>setProvince(e.target.value as any)} aria-label="Province">
      <option value="BC" className="bg-gray-700 text-white">BC</option>
      <option value="AB" className="bg-gray-700 text-white">AB</option>
      <option value="ON" className="bg-gray-700 text-white">ON</option>
    </select>
  );
}
