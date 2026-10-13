'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

type Province = 'BC' | 'AB' | 'ON';

/**
 * Renders nothing. On mount it sets the visitor's province in the app store so
 * province-specific disclaimers (ComplianceBanner, chat disclosure) match the
 * city page they landed on. Used by the server-component city layouts so those
 * pages don't have to become client components.
 *
 * Runs after PrefSync's effect (PrefSync is rendered earlier in the root layout),
 * so the city's province wins over a previously stored preference. The visitor
 * can still change it with the province selector in the header.
 */
export function SetProvince({ province }: { province: Province }) {
  const setProvince = useAppStore((s) => s.setProvince);
  useEffect(() => {
    setProvince(province);
  }, [province, setProvince]);
  return null;
}
