const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const STORAGE_KEY = "kraft_utm_data";

export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
  captured_at?: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function captureUTM(): void {
  if (!isBrowser()) return;

  // Don't overwrite if already captured this session
  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) return;

  const params = new URLSearchParams(window.location.search);
  const utmData: UTMData = {};

  let hasUTM = false;
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) {
      utmData[key] = val;
      hasUTM = true;
    }
  }

  // Always capture referrer and landing page for attribution
  utmData.referrer = document.referrer || undefined;
  utmData.landing_page = window.location.href;
  utmData.captured_at = new Date().toISOString();

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmData));
}

export function getUTMData(): UTMData | null {
  if (!isBrowser()) return null;

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UTMData;
  } catch {
    return null;
  }
}

export function clearUTM(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(STORAGE_KEY);
}
