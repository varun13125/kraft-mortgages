import { getAuth } from "firebase/auth";
import { app } from "./firebase.client";

// BUG-050: dashboard API calls carry the admin's Firebase ID token, so they must
// stay same-origin. NEXT_PUBLIC_CREWAPI_BASE_URL used to be used here as well as
// for the EXTERNAL crew host (app/api/cron/daily), which risked sending admin
// tokens off-site. The crew host now has its own server-only CREWAPI_BASE_URL.
const BASE = "/api";

async function authHeader(): Promise<Record<string, string>> {
  if (!app) {
    console.warn("Firebase is not configured; API request sent without auth");
    return {};
  }
  const user = getAuth(app).currentUser;
  if (!user) {
    console.warn("No Firebase user logged in when making API request");
    return {};
  }
  
  try {
    const token = await user.getIdToken();
    if (!token) {
      console.warn("Failed to get Firebase ID token");
      return {};
    }
    return { "Authorization": `Bearer ${token}` };
  } catch (error) {
    console.error("Error getting Firebase ID token:", error);
    return {};
  }
}

export async function apiPost<T>(path: string, body: any, opts: RequestInit = {}): Promise<T> {
  const authHeaders = await authHeader();
  const headers = { 
    "Content-Type": "application/json", 
    ...authHeaders, 
    ...(opts.headers || {}) 
  };
  
  // Log if no auth token
  if (!authHeaders["Authorization"]) {
    console.warn(`Making POST request to ${path} without auth token`);
  }
  
  const url = `${BASE}${path}`;
  console.log(`POST ${url}`, { body, hasAuth: !!authHeaders["Authorization"] });
  
  try {
    const res = await fetch(url, { 
      method: "POST", 
      headers, 
      body: JSON.stringify(body) 
    });
    
    const responseText = await res.text();
    
    if (!res.ok) {
      console.error(`API error ${res.status} from ${path}:`, responseText);
      let errorObj;
      try {
        errorObj = JSON.parse(responseText);
      } catch {
        errorObj = { error: responseText };
      }
      throw new Error(JSON.stringify(errorObj));
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error(`Failed to POST ${path}:`, error);
    throw error;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const authHeaders = await authHeader();
  const headers = { ...authHeaders };
  
  // Log if no auth token
  if (!authHeaders["Authorization"]) {
    console.warn(`Making GET request to ${path} without auth token`);
  }
  
  const url = `${BASE}${path}`;
  console.log(`GET ${url}`, { hasAuth: !!authHeaders["Authorization"] });
  
  try {
    const res = await fetch(url, { headers, cache: "no-store" });
    
    const responseText = await res.text();
    
    if (!res.ok) {
      console.error(`API error ${res.status} from ${path}:`, responseText);
      let errorObj;
      try {
        errorObj = JSON.parse(responseText);
      } catch {
        errorObj = { error: responseText };
      }
      throw new Error(JSON.stringify(errorObj));
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error(`Failed to GET ${path}:`, error);
    throw error;
  }
}